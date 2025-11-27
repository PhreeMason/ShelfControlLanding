"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { TEST_USER_IDS } from "@/lib/config/test-users";
import { formatUserName } from "@/lib/utils/format-user-name";

export interface ActivityTypeData {
  activity_type: string;
  count: number;
}

export interface SearchAnalyticsData {
  total_searches: number;
  popular_queries: Array<{
    query: string;
    count: number;
  }>;
  searches_by_date: Array<{
    date: string;
    count: number;
  }>;
}

export interface DeadlineStatsData {
  status_breakdown: Array<{
    status: string;
    count: number;
  }>;
  deadlines_by_date: Array<{
    date: string;
    count: number;
  }>;
  total_deadlines: number;
}

export interface UserInfo {
  id: string;
  email: string | null;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
}

export interface DeadlinesOverTimeData {
  date: string;
  count: number;
}

export interface ActivityTypesOverTimeData {
  dates: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
  }[];
}

export async function getActivityTypesBreakdown(
  userIds?: string[]
): Promise<ActivityTypeData[]> {
  const supabase = createAdminClient();

  let query = supabase
    .from("user_activities")
    .select("activity_type")
    .not("user_id", "in", `(${TEST_USER_IDS.join(",")})`);

  if (userIds && userIds.length > 0) {
    query = query.in("user_id", userIds);
  }

  const { data, error } = await query;

  if (error) {
    return [];
  }

  const breakdown = data.reduce(
    (acc: Record<string, number>, activity) => {
      acc[activity.activity_type] = (acc[activity.activity_type] || 0) + 1;
      return acc;
    },
    {}
  );

  return Object.entries(breakdown).map(([activity_type, count]) => ({
    activity_type,
    count,
  }));
}

export async function getActivityTypesOverTime(
  userIds?: string[],
  days: number = 14
): Promise<ActivityTypesOverTimeData> {
  const supabase = createAdminClient();

  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - days);
  daysAgo.setHours(0, 0, 0, 0);
  const daysAgoStr = daysAgo.toISOString();

  // Paginate to get all records (Supabase has 1000 row limit per request)
  const allData: { activity_type: string; timestamp: string | null }[] = [];
  let page = 0;
  const pageSize = 1000;

  while (true) {
    let query = supabase
      .from("user_activities")
      .select("activity_type, timestamp")
      .not("user_id", "in", `(${TEST_USER_IDS.join(",")})`)
      .gte("timestamp", daysAgoStr)
      .order("timestamp", { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (userIds && userIds.length > 0) {
      query = query.in("user_id", userIds);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      break;
    }

    allData.push(...data);

    if (data.length < pageSize) {
      break; // Last page
    }
    page++;
  }

  if (allData.length === 0) {
    return { dates: [], datasets: [] };
  }

  const data = allData;

  // Build date range
  const dateRange: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dateRange.push(date.toISOString().split("T")[0]);
  }

  // Group by activity type and date
  const activityByTypeAndDate = new Map<string, Map<string, number>>();

  data.forEach((activity) => {
    const date = new Date(activity.timestamp!).toISOString().split("T")[0];
    const type = activity.activity_type;

    if (!activityByTypeAndDate.has(type)) {
      activityByTypeAndDate.set(type, new Map());
    }
    const dateMap = activityByTypeAndDate.get(type)!;
    dateMap.set(date, (dateMap.get(date) || 0) + 1);
  });

  const colors = [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#14b8a6",
    "#f97316",
  ];

  const datasets = Array.from(activityByTypeAndDate.entries()).map(
    ([activityType, dateMap], index) => {
      const color = colors[index % colors.length];
      const data = dateRange.map((date) => dateMap.get(date) || 0);

      return {
        label: activityType,
        data,
        borderColor: color,
        backgroundColor: color,
        tension: 0.1,
      };
    }
  );

  const formattedDates = dateRange.map((date) => {
    const [, month, day] = date.split("-");
    return `${parseInt(month)}/${parseInt(day)}`;
  });

  return {
    dates: formattedDates,
    datasets,
  };
}

export async function getSearchAnalytics(
  userIds?: string[]
): Promise<SearchAnalyticsData> {
  const supabase = createAdminClient();

  let query = supabase
    .from("user_searches")
    .select("query, created_at")
    .not("user_id", "in", `(${TEST_USER_IDS.join(",")})`)
    .order("created_at", { ascending: false });

  if (userIds && userIds.length > 0) {
    query = query.in("user_id", userIds);
  }

  const { data, error } = await query;

  if (error) {
    return {
      total_searches: 0,
      popular_queries: [],
      searches_by_date: [],
    };
  }

  const queryCount = data.reduce(
    (acc: Record<string, number>, search) => {
      acc[search.query] = (acc[search.query] || 0) + 1;
      return acc;
    },
    {}
  );

  const popular_queries = Object.entries(queryCount)
    .map(([query, count]) => ({ query, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const dateCount = data.reduce(
    (acc: Record<string, number>, search) => {
      const date = new Date(search.created_at!).toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {}
  );

  const searches_by_date = Object.entries(dateCount)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    total_searches: data.length,
    popular_queries,
    searches_by_date,
  };
}

export async function getDeadlineStats(
  userIds?: string[]
): Promise<DeadlineStatsData> {
  const supabase = createAdminClient();

  let deadlinesQuery = supabase
    .from("deadlines")
    .select("id, created_at")
    .not("user_id", "in", `(${TEST_USER_IDS.join(",")})`);

  if (userIds && userIds.length > 0) {
    deadlinesQuery = deadlinesQuery.in("user_id", userIds);
  }

  const { data: deadlines, error: deadlinesError } = await deadlinesQuery;

  if (deadlinesError) {
    return {
      status_breakdown: [],
      deadlines_by_date: [],
      total_deadlines: 0,
    };
  }

  const deadlineIds = deadlines.map(d => d.id);

  if (deadlineIds.length === 0) {
    return {
      status_breakdown: [],
      deadlines_by_date: [],
      total_deadlines: 0,
    };
  }

  const { data: statuses } = await supabase
    .from("deadline_status")
    .select("deadline_id, status, updated_at")
    .in("deadline_id", deadlineIds)
    .order("updated_at", { ascending: false });

  const latestStatusByDeadline = new Map<string, string>();

  (statuses || []).forEach((item) => {
    if (item.deadline_id && !latestStatusByDeadline.has(item.deadline_id)) {
      latestStatusByDeadline.set(item.deadline_id, item.status || "unknown");
    }
  });

  const statusCount: Record<string, number> = {};
  latestStatusByDeadline.forEach((status) => {
    statusCount[status] = (statusCount[status] || 0) + 1;
  });

  const status_breakdown = Object.entries(statusCount).map(([status, count]) => ({
    status,
    count,
  }));

  const dateCount = deadlines.reduce(
    (acc: Record<string, number>, deadline) => {
      const date = new Date(deadline.created_at).toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {}
  );

  const deadlines_by_date = Object.entries(dateCount)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    status_breakdown,
    deadlines_by_date,
    total_deadlines: deadlines.length,
  };
}

export async function getAllUsers(): Promise<UserInfo[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, username, first_name, last_name")
    .not("id", "in", `(${TEST_USER_IDS.join(",")})`)
    .order("email", { ascending: true });

  if (error) {
    return [];
  }

  return data;
}

export async function getDeadlinesOverTime(
  userIds?: string[]
): Promise<DeadlinesOverTimeData[]> {
  const supabase = createAdminClient();

  let query = supabase
    .from("deadlines")
    .select("created_at")
    .not("user_id", "in", `(${TEST_USER_IDS.join(",")})`);

  if (userIds && userIds.length > 0) {
    query = query.in("user_id", userIds);
  }

  const { data, error } = await query;

  if (error) {
    return [];
  }

  const dateCount = data.reduce(
    (acc: Record<string, number>, deadline) => {
      const date = new Date(deadline.created_at).toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {}
  );

  return Object.entries(dateCount)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

const ACTIVE_STATUSES = ["pending", "reading"];

export async function getOverdueDeadlines(
  userIds?: string[]
): Promise<DeadlinesOverTimeData[]> {
  const supabase = createAdminClient();

  const today = new Date().toISOString().split("T")[0];

  let deadlinesQuery = supabase
    .from("deadlines")
    .select("id, deadline_date")
    .not("user_id", "in", `(${TEST_USER_IDS.join(",")})`)
    .lt("deadline_date", today);

  if (userIds && userIds.length > 0) {
    deadlinesQuery = deadlinesQuery.in("user_id", userIds);
  }

  const { data: deadlines, error: deadlinesError } = await deadlinesQuery;

  if (deadlinesError || !deadlines || deadlines.length === 0) {
    return [];
  }

  const deadlineIds = deadlines.map((d) => d.id);

  const { data: statuses } = await supabase
    .from("deadline_status")
    .select("deadline_id, status, updated_at")
    .in("deadline_id", deadlineIds)
    .order("updated_at", { ascending: false });

  const latestStatusByDeadline = new Map<string, string>();

  (statuses || []).forEach((item) => {
    if (item.deadline_id && !latestStatusByDeadline.has(item.deadline_id)) {
      latestStatusByDeadline.set(item.deadline_id, item.status || "pending");
    }
  });

  const overdueDeadlines = deadlines.filter((deadline) => {
    const status = latestStatusByDeadline.get(deadline.id) || "pending";
    return ACTIVE_STATUSES.includes(status);
  });

  const dateCount = overdueDeadlines.reduce(
    (acc: Record<string, number>, deadline) => {
      const date = deadline.deadline_date;
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {}
  );

  return Object.entries(dateCount)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export interface ProgressOverTimeData {
  dates: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
  }[];
}

export interface TopBookData {
  book_id: string;
  title: string;
  cover_image_url: string | null;
  deadline_count: number;
}

export async function getTopBooks(limit: number = 10): Promise<TopBookData[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase.rpc("get_top_books", { p_limit: limit });

  if (error || !data) {
    return [];
  }

  return data;
}

interface ProgressRecord {
  deadline_id: string;
  user_id: string;
  username: string | null;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  date: string;
  current_progress: number;
  ignore_in_calcs: boolean;
}

interface DeadlineProgressQueryResult {
  deadline_id: string;
  current_progress: number;
  ignore_in_calcs: boolean;
  created_at: string;
  deadlines: {
    user_id: string;
    profiles: {
      username: string | null;
      email: string | null;
      first_name: string | null;
      last_name: string | null;
    };
  };
}

export async function getProgressOverTime(
  timezoneOffsetMinutes?: number,
  days: number = 30
): Promise<ProgressOverTimeData> {
  const supabase = createAdminClient();

  const offsetMinutes = timezoneOffsetMinutes ?? 0;

  const nowLocal = new Date(Date.now() - offsetMinutes * 60 * 1000);
  const daysAgo = new Date(nowLocal);
  daysAgo.setDate(daysAgo.getDate() - days);
  daysAgo.setHours(0, 0, 0, 0);
  const daysAgoStr = daysAgo.toISOString();

  const { data, error } = await supabase
    .from("deadline_progress")
    .select(
      `
      deadline_id,
      current_progress,
      ignore_in_calcs,
      created_at,
      deadlines!inner(user_id, profiles!inner(username, email, first_name, last_name))
    `
    )
    .gte("created_at", daysAgoStr)
    .not("deadlines.user_id", "in", `(${TEST_USER_IDS.join(",")})`)
    .order("deadline_id")
    .order("created_at");

  if (error) {
    return { dates: [], datasets: [] };
  }

  if (!data || data.length === 0) {
    return { dates: [], datasets: [] };
  }

  const records: ProgressRecord[] = (data as DeadlineProgressQueryResult[]).map((record) => {
    const utcDate = new Date(record.created_at);
    const localDate = new Date(utcDate.getTime() - offsetMinutes * 60 * 1000);
    return {
      deadline_id: record.deadline_id,
      user_id: record.deadlines.user_id,
      email: record.deadlines.profiles.email,
      username: record.deadlines.profiles.username,
      first_name: record.deadlines.profiles.first_name,
      last_name: record.deadlines.profiles.last_name,
      date: localDate.toISOString().split("T")[0],
      current_progress: record.current_progress,
      ignore_in_calcs: record.ignore_in_calcs,
    };
  });

  const dateRange: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(Date.now() - offsetMinutes * 60 * 1000);
    date.setDate(date.getDate() - i);
    dateRange.push(date.toISOString().split("T")[0]);
  }

  const deadlineMaxByDate = new Map<string, Map<string, number>>();

  records.forEach((record) => {
    if (!deadlineMaxByDate.has(record.deadline_id)) {
      deadlineMaxByDate.set(record.deadline_id, new Map());
    }
    const dateMap = deadlineMaxByDate.get(record.deadline_id)!;
    const currentMax = dateMap.get(record.date) || 0;
    dateMap.set(record.date, Math.max(currentMax, record.current_progress));
  });

  const ignoreRecordsByDeadline = new Map<string, Set<string>>();
  records.forEach((record) => {
    if (record.ignore_in_calcs) {
      if (!ignoreRecordsByDeadline.has(record.deadline_id)) {
        ignoreRecordsByDeadline.set(record.deadline_id, new Set());
      }
      ignoreRecordsByDeadline.get(record.deadline_id)!.add(record.date);
    }
  });

  const userPagesPerDay = new Map<string, Map<string, number>>();
  const userInfoMap = new Map<string, UserInfo>();

  deadlineMaxByDate.forEach((dateMap, deadlineId) => {
    const sortedDates = Array.from(dateMap.keys()).sort();
    let previousProgress = 0;

    sortedDates.forEach((date) => {
      const currentProgress = dateMap.get(date)!;
      const isIgnored = ignoreRecordsByDeadline.get(deadlineId)?.has(date);

      const record = records.find((r) => r.deadline_id === deadlineId && r.date === date);

      if (record) {
        const userId = record.user_id;

        if (!userPagesPerDay.has(userId)) {
          userPagesPerDay.set(userId, new Map());
        }

        if (!userInfoMap.has(userId)) {
          userInfoMap.set(userId, {
            id: userId,
            email: record.email,
            username: record.username,
            first_name: record.first_name,
            last_name: record.last_name,
          });
        }

        if (!isIgnored) {
          const pagesRead = currentProgress - previousProgress;

          const userDateMap = userPagesPerDay.get(userId)!;
          const currentTotal = userDateMap.get(date) || 0;
          userDateMap.set(date, currentTotal + pagesRead);
        }
      }

      previousProgress = currentProgress;
    });
  });

  const colors = [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#14b8a6",
    "#f97316",
  ];

  const datasets = Array.from(userPagesPerDay.entries()).map(
    ([userId, dateMap], index) => {
      const color = colors[index % colors.length];
      const data = dateRange.map((date) => dateMap.get(date) || 0);
      const userInfo = userInfoMap.get(userId);
      const label = userInfo ? formatUserName(userInfo) : `User ${userId.slice(0, 8)}`;

      return {
        label,
        data,
        borderColor: color,
        backgroundColor: color,
        tension: 0.1,
      };
    }
  );

  const formattedDates = dateRange.map((date) => {
    const [, month, day] = date.split("-");
    return `${parseInt(month)}/${parseInt(day)}`;
  });

  return {
    dates: formattedDates,
    datasets,
  };
}

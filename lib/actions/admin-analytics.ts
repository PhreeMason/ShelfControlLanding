"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { TEST_USER_IDS } from "@/lib/config/test-users";
import { formatUserName } from "@/lib/utils/format-user-name";

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

export interface UserInfo {
  id: string;
  email: string | null;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
}

export interface DeadlineStatusBreakdownData {
  status: string;
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

export async function getActivityTypesOverTime(
  userIds?: string[],
  days: number = 14
): Promise<ActivityTypesOverTimeData> {
  const supabase = createAdminClient();

  const { data, error } = await supabase.rpc("get_activity_types_over_time", {
    p_days: days,
    p_user_ids: userIds && userIds.length > 0 ? userIds : undefined,
    p_exclude_user_ids: TEST_USER_IDS,
  });

  if (error || !data || data.length === 0) {
    return { dates: [], datasets: [] };
  }

  // Build date range
  const dateRange: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dateRange.push(date.toISOString().split("T")[0]);
  }

  // Group RPC results by activity type
  const activityByTypeAndDate = new Map<string, Map<string, number>>();
  data.forEach((row) => {
    if (!activityByTypeAndDate.has(row.activity_type)) {
      activityByTypeAndDate.set(row.activity_type, new Map());
    }
    activityByTypeAndDate.get(row.activity_type)!.set(row.activity_date, row.count);
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
      const chartData = dateRange.map((date) => dateMap.get(date) || 0);

      return {
        label: activityType,
        data: chartData,
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

export async function getDeadlinesByStatus(
  userIds?: string[]
): Promise<DeadlineStatusBreakdownData[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase.rpc("get_deadline_status_breakdown", {
    p_user_ids: userIds && userIds.length > 0 ? userIds : undefined,
    p_exclude_user_ids: TEST_USER_IDS,
  });

  if (error || !data) {
    return [];
  }

  return data;
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

export interface TopBookData {
  book_id: string;
  title: string;
  cover_image_url: string | null;
  publication_date: string | null;
  deadline_count: number;
  yesterday_rank?: number | null;
}

export interface FormatDistributionData {
  format: string;
  count: number;
}

export async function getTopBooks(limit: number = 10): Promise<TopBookData[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase.rpc("get_top_books", { p_limit: limit });

  if (error || !data) {
    return [];
  }

  return data.map((item: Omit<TopBookData, 'publication_date'> & { publication_date?: string | null }) => ({
    ...item,
    publication_date: item.publication_date ?? null,
  }));
}

export interface TopDeadlineUserData {
  user_id: string;
  email: string | null;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  deadline_count: number;
  yesterday_rank?: number | null;
}

export interface TopPagesReadUserData {
  user_id: string;
  email: string | null;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  pages_read: number;
  yesterday_rank?: number | null;
}

export async function getTopDeadlineUsers(
  limit: number = 10
): Promise<TopDeadlineUserData[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase.rpc("get_top_deadline_users", {
    p_limit: limit,
  });

  if (error || !data) {
    return [];
  }

  // Generate signed URLs for avatars
  const usersWithAvatars = await Promise.all(
    data.map(async (user) => {
      if (user.avatar_url) {
        const { data: signedData } = await supabase.storage
          .from("avatars")
          .createSignedUrl(user.avatar_url, 60 * 60); // 1 hour
        return { ...user, avatar_url: signedData?.signedUrl || null };
      }
      return user;
    })
  );

  return usersWithAvatars;
}

export async function getTopPagesReadToday(
  limit: number = 10,
  timezone: string = "UTC"
): Promise<TopPagesReadUserData[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase.rpc("get_top_pages_read_today", {
    p_limit: limit,
    p_exclude_user_ids: TEST_USER_IDS,
    p_tz: timezone,
  });

  if (error || !data) {
    return [];
  }

  // Generate signed URLs for avatars
  const usersWithAvatars = await Promise.all(
    data.map(async (user) => {
      if (user.avatar_url) {
        const { data: signedData } = await supabase.storage
          .from("avatars")
          .createSignedUrl(user.avatar_url, 60 * 60); // 1 hour
        return { ...user, avatar_url: signedData?.signedUrl || null };
      }
      return user;
    })
  );

  return usersWithAvatars;
}

export interface MostActiveUserData {
  user_id: string;
  email: string | null;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  activity_count: number;
  yesterday_rank?: number | null;
}

export async function getMostActiveUsersToday(
  limit: number = 10,
  timezone: string = "UTC"
): Promise<MostActiveUserData[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase.rpc("get_most_active_users_today", {
    p_limit: limit,
    p_exclude_user_ids: TEST_USER_IDS,
    p_tz: timezone,
  });

  if (error || !data) {
    return [];
  }

  // Generate signed URLs for avatars
  const usersWithAvatars = await Promise.all(
    data.map(async (user) => {
      if (user.avatar_url) {
        const { data: signedData } = await supabase.storage
          .from("avatars")
          .createSignedUrl(user.avatar_url, 60 * 60); // 1 hour
        return { ...user, avatar_url: signedData?.signedUrl || null };
      }
      return user;
    })
  );

  return usersWithAvatars;
}

export async function getFormatDistribution(
  userIds?: string[]
): Promise<FormatDistributionData[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase.rpc("get_format_distribution", {
    p_user_ids: userIds && userIds.length > 0 ? userIds : undefined,
    p_exclude_user_ids: TEST_USER_IDS,
  });

  if (error || !data) {
    return [];
  }

  return data;
}

export interface ProfilesCreatedOverTimeData {
  dates: string[];
  counts: number[];
}

export interface ActiveOverduePageCountData {
  dates: string[];
  activePages: number[];
  overduePages: number[];
}

export async function getActiveOverduePageCounts(
  days: number = 30
): Promise<ActiveOverduePageCountData> {
  const supabase = createAdminClient();

  const { data, error } = await supabase.rpc(
    "get_active_overdue_remaining_pages",
    {
      p_days: days,
      p_exclude_user_ids: TEST_USER_IDS,
    }
  );

  if (error || !data || data.length === 0) {
    return { dates: [], activePages: [], overduePages: [] };
  }

  // Build complete date range to fill in gaps
  const dateRange: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dateRange.push(date.toISOString().split("T")[0]);
  }

  // Create maps from the RPC results
  const activeByDate = new Map<string, number>();
  const overdueByDate = new Map<string, number>();
  data.forEach((row: { report_date: string; active_remaining_pages: number; overdue_remaining_pages: number }) => {
    activeByDate.set(row.report_date, row.active_remaining_pages);
    overdueByDate.set(row.report_date, row.overdue_remaining_pages);
  });

  // Build arrays, filling in 0 for missing dates
  const activePages = dateRange.map((date) => activeByDate.get(date) || 0);
  const overduePages = dateRange.map((date) => overdueByDate.get(date) || 0);

  // Format dates for display
  const formattedDates = dateRange.map((date) => {
    const [, month, day] = date.split("-");
    return `${parseInt(month)}/${parseInt(day)}`;
  });

  return {
    dates: formattedDates,
    activePages,
    overduePages,
  };
}

export async function getProfilesCreatedOverTime(
  days: number = 30
): Promise<ProfilesCreatedOverTimeData> {
  const supabase = createAdminClient();

  const { data, error } = await supabase.rpc("get_profiles_created_over_time", {
    p_days: days,
  });

  if (error || !data || data.length === 0) {
    return { dates: [], counts: [] };
  }

  // Build complete date range to fill in gaps
  const dateRange: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dateRange.push(date.toISOString().split("T")[0]);
  }

  // Create a map from the RPC results
  const countByDate = new Map<string, number>();
  data.forEach((row: { profile_date: string; count: number }) => {
    countByDate.set(row.profile_date, row.count);
  });

  // Build the counts array, filling in 0 for missing dates
  const counts = dateRange.map((date) => countByDate.get(date) || 0);

  // Format dates for display
  const formattedDates = dateRange.map((date) => {
    const [, month, day] = date.split("-");
    return `${parseInt(month)}/${parseInt(day)}`;
  });

  return {
    dates: formattedDates,
    counts,
  };
}

export async function getProgressOverTime(
  timezoneOffsetMinutes?: number,
  days: number = 30,
  userIds?: string[]
): Promise<ProgressOverTimeData> {
  const supabase = createAdminClient();

  const offsetMinutes = timezoneOffsetMinutes ?? 0;

  const nowLocal = new Date(Date.now() - offsetMinutes * 60 * 1000);
  const daysAgo = new Date(nowLocal);
  daysAgo.setDate(daysAgo.getDate() - days);
  daysAgo.setHours(0, 0, 0, 0);
  const daysAgoStr = daysAgo.toISOString();

  let query = supabase
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

  if (userIds && userIds.length > 0) {
    query = query.in("deadlines.user_id", userIds);
  }

  const { data, error } = await query;

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
      const chartData = dateRange.map((date) => dateMap.get(date) || 0);
      const userInfo = userInfoMap.get(userId);
      const label = userInfo ? formatUserName(userInfo) : `User ${userId.slice(0, 8)}`;

      return {
        label,
        data: chartData,
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

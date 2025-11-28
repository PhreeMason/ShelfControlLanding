"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getTopPagesReadToday,
  TopPagesReadUserData,
} from "@/lib/actions/admin-analytics";
import { User } from "lucide-react";
import Image from "next/image";
import { RankChangeIndicator } from "./rank-change-indicator";

function formatUserDisplayName(user: TopPagesReadUserData): string {
  const fullName = [user.first_name, user.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (fullName) return fullName;
  if (user.username) return user.username;
  return user.email || user.user_id.slice(0, 8);
}

export function TopPagesReadChart() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["top-pages-read-today"],
    queryFn: () => getTopPagesReadToday(10, "UTC"),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Failed to load data
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No reading data available
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {data.map((user, index) => (
        <div
          key={user.user_id}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
        >
          <span className="text-muted-foreground font-medium w-6 text-right">
            {index + 1}
          </span>

          <div className="w-12 flex justify-center">
            <RankChangeIndicator
              currentRank={index + 1}
              yesterdayRank={user.yesterday_rank}
            />
          </div>

          <div className="relative w-10 h-10 flex-shrink-0 rounded-full overflow-hidden bg-muted">
            {user.avatar_url ? (
              <Image
                src={user.avatar_url}
                alt={formatUserDisplayName(user)}
                fill
                sizes="40px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{formatUserDisplayName(user)}</p>
          </div>

          <div className="flex-shrink-0">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary">
              {user.pages_read.toLocaleString()} pages
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

"use client";

import { ActivityTypesChart } from "./components/activity-types-chart";
import { SearchAnalyticsChart } from "./components/search-analytics-chart";
import { DeadlineStatsChart } from "./components/deadline-stats-chart";
import { DeadlinesOverTimeChart } from "./components/deadlines-over-time-chart";
import { ProgressOverTimeChart } from "./components/progress-over-time-chart";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen p-8">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            User activity analytics and insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-lg border p-6">
            <h2 className="text-2xl font-semibold mb-4">Activity Types</h2>
            <ActivityTypesChart />
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="text-2xl font-semibold mb-4">Search Analytics</h2>
            <SearchAnalyticsChart />
          </div>

          <div className="rounded-lg border p-6 lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">Deadline Statistics</h2>
            <DeadlineStatsChart />
          </div>

          <div className="rounded-lg border p-6 lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">Deadlines Over Time</h2>
            <DeadlinesOverTimeChart />
          </div>

          <div className="rounded-lg border p-6 lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">Reading Progress Over Time</h2>
            <ProgressOverTimeChart />
          </div>
        </div>
      </div>
    </div>
  );
}

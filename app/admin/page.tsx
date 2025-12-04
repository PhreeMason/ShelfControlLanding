"use client";

import { ActivityTypesChart } from "./components/activity-types-chart";
import { DeadlinesOverTimeChart } from "./components/deadlines-over-time-chart";
import { FormatDistributionChart } from "./components/format-distribution-chart";
import { MostActiveUsersChart } from "./components/most-active-users-chart";
import { ProfilesCreatedChart } from "./components/profiles-created-chart";
import { ProgressOverTimeChart } from "./components/progress-over-time-chart";
import { TopBooksChart } from "./components/top-books-chart";
import { TopPagesReadChart } from "./components/top-pages-read-chart";
import { TopUsersChart } from "./components/top-users-chart";

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
          <div className="rounded-lg border p-6 lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">Profiles Created (Last 30 Days)</h2>
            <ProfilesCreatedChart />
          </div>
          <div className="rounded-lg border p-6">
            <h2 className="text-2xl font-semibold mb-4">Top Books</h2>
            <TopBooksChart />
          </div>
          <div className="rounded-lg border p-6">
            <h2 className="text-2xl font-semibold mb-4">Top Users by Deadlines</h2>
            <TopUsersChart />
          </div>
          <div className="rounded-lg border p-6">
            <h2 className="text-2xl font-semibold mb-4">Top Readers Today</h2>
            <TopPagesReadChart />
          </div>
          <div className="rounded-lg border p-6">
            <h2 className="text-2xl font-semibold mb-4">Most Active Users Today</h2>
            <MostActiveUsersChart />
          </div>
          <div className="rounded-lg border p-6">
            <h2 className="text-2xl font-semibold mb-4">Book Format Distribution</h2>
            <FormatDistributionChart />
          </div>
          <div className="rounded-lg border p-6">
            <h2 className="text-2xl font-semibold mb-4">Activity Types Over Time</h2>
            <ActivityTypesChart />
          </div>

          <div className="rounded-lg border p-6 lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">Deadlines by Status</h2>
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

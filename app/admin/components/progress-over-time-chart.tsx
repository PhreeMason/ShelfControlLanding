"use client";

import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { useQuery } from "@tanstack/react-query";
import { getProgressOverTime, getAllUsers } from "@/lib/actions/admin-analytics";
import { UserFilter } from "./user-filter";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type TimeRange = 7 | 14 | 21 | 30;

export function ProgressOverTimeChart() {
  const [selectedDays, setSelectedDays] = useState<TimeRange>(30);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const timezoneOffset = new Date().getTimezoneOffset();

  const { data: users = [] } = useQuery({
    queryKey: ["all-users"],
    queryFn: getAllUsers,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["progress-over-time", timezoneOffset, selectedDays, selectedUserIds],
    queryFn: () => getProgressOverTime(
      timezoneOffset,
      selectedDays,
      selectedUserIds.length > 0 ? selectedUserIds : undefined
    ),
  });

  const handleUserToggle = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const clearFilters = () => {
    setSelectedUserIds([]);
  };

  const selectAllUsers = () => {
    setSelectedUserIds(users.map((u) => u.id));
  };

  const chartData = {
    labels: data?.dates || [],
    datasets: data?.datasets || [],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
            return `${label}: ${value} pages`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Pages Read",
        },
        ticks: {
          stepSize: 10,
        },
      },
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
    },
  };

  const timeRanges: TimeRange[] = [7, 14, 21, 30];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {timeRanges.map((days) => (
          <button
            key={days}
            onClick={() => setSelectedDays(days)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedDays === days
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {days} days
          </button>
        ))}
      </div>

      <UserFilter
        selectedUserIds={selectedUserIds}
        onUserToggle={handleUserToggle}
        onClearFilters={clearFilters}
        onSelectAll={selectAllUsers}
      />

      {isLoading ? (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Loading...
        </div>
      ) : selectedUserIds.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Select users to display
        </div>
      ) : !data || data.datasets.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          No progress data available for the last {selectedDays} days
        </div>
      ) : (
        <div className="h-64">
          <Line data={chartData} options={options} />
        </div>
      )}
    </div>
  );
}

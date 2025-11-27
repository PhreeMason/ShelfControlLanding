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
import { getActivityTypesOverTime } from "@/lib/actions/admin-analytics";
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

export function ActivityTypesChart() {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["activity-types-over-time", selectedUserIds],
    queryFn: () => getActivityTypesOverTime(selectedUserIds.length > 0 ? selectedUserIds : undefined),
  });

  const chartData = {
    labels: data?.dates || [],
    datasets: data?.datasets || [],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

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

  return (
    <div className="space-y-4">
      <UserFilter
        selectedUserIds={selectedUserIds}
        onUserToggle={handleUserToggle}
        onClearFilters={clearFilters}
      />

      {isLoading ? (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Loading...
        </div>
      ) : !data || data.datasets.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          No activity data available
        </div>
      ) : (
        <div className="h-64">
          <Line data={chartData} options={options} />
        </div>
      )}
    </div>
  );
}

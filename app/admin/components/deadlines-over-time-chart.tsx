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
import { getOverdueDeadlines } from "@/lib/actions/admin-analytics";
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

export function DeadlinesOverTimeChart() {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const { data: deadlinesData = [], isLoading } = useQuery({
    queryKey: ["overdue-deadlines", selectedUserIds],
    queryFn: () => getOverdueDeadlines(selectedUserIds.length > 0 ? selectedUserIds : undefined),
  });

  const chartData = {
    labels: deadlinesData.map((item) => item.date),
    datasets: [
      {
        label: "Overdue Deadlines",
        data: deadlinesData.map((item) => item.count),
        borderColor: "rgba(239, 68, 68, 1)",
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        tension: 0.1,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Overdue Deadlines",
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
      ) : deadlinesData.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          No overdue deadlines
        </div>
      ) : (
        <div className="h-64">
          <Line data={chartData} options={options} />
        </div>
      )}
    </div>
  );
}

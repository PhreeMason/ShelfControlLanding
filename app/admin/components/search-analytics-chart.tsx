"use client";

import { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { useQuery } from "@tanstack/react-query";
import { getSearchAnalytics } from "@/lib/actions/admin-analytics";
import { UserFilter } from "./user-filter";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function SearchAnalyticsChart() {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["search-analytics", selectedUserIds],
    queryFn: () => getSearchAnalytics(selectedUserIds.length > 0 ? selectedUserIds : undefined),
  });

  if (!data) {
    return null;
  }
  const chartData = {
    labels: data.popular_queries.map((item) => item.query),
    datasets: [
      {
        label: "Search Count",
        data: data.popular_queries.map((item) => item.count),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `Top Search Queries (Total: ${data.total_searches})`,
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
      ) : data.popular_queries.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          No search data available
        </div>
      ) : (
        <div className="h-64">
          <Bar data={chartData} options={options} />
        </div>
      )}
    </div>
  );
}

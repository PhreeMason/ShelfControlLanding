"use client";

import { useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useQuery } from "@tanstack/react-query";
import { getFormatDistribution } from "@/lib/actions/admin-analytics";
import { UserFilter } from "./user-filter";

ChartJS.register(ArcElement, Tooltip, Legend);

const FORMAT_COLORS: Record<string, string> = {
  physical: "rgba(59, 130, 246, 0.8)",
  eBook: "rgba(168, 85, 247, 0.8)",
  audio: "rgba(249, 115, 22, 0.8)",
  unknown: "rgba(156, 163, 175, 0.8)",
};

const FORMAT_LABELS: Record<string, string> = {
  physical: "Physical",
  eBook: "eBook",
  audio: "Audio",
  unknown: "Unknown",
};

export function FormatDistributionChart() {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const { data: formatData = [], isLoading } = useQuery({
    queryKey: ["format-distribution", selectedUserIds],
    queryFn: () =>
      getFormatDistribution(
        selectedUserIds.length > 0 ? selectedUserIds : undefined
      ),
  });

  const total = formatData.reduce((sum, item) => sum + item.count, 0);

  const chartData = {
    labels: formatData.map(
      (item) => FORMAT_LABELS[item.format] || item.format
    ),
    datasets: [
      {
        data: formatData.map((item) => item.count),
        backgroundColor: formatData.map(
          (item) => FORMAT_COLORS[item.format] || FORMAT_COLORS.unknown
        ),
        borderWidth: 0,
      },
    ],
  };

  const options: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: "Book Format Distribution",
      },
      datalabels: {
        color: "#fff",
        font: {
          weight: "bold",
          size: 12,
        },
        formatter: (value: number) => {
          const percentage = ((value / total) * 100).toFixed(1);
          return `${percentage}%`;
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
      ) : formatData.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          No data found
        </div>
      ) : (
        <div className="h-64">
          <Pie data={chartData} options={options} plugins={[ChartDataLabels]} />
        </div>
      )}
    </div>
  );
}

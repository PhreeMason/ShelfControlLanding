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
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useQuery } from "@tanstack/react-query";
import { getDeadlinesByStatus } from "@/lib/actions/admin-analytics";
import { SingleUserFilter } from "./single-user-filter";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const STATUS_COLORS: Record<string, string> = {
  overdue: "rgba(239, 68, 68, 0.8)",
  pending: "rgba(234, 179, 8, 0.8)",
  reading: "rgba(59, 130, 246, 0.8)",
  paused: "rgba(156, 163, 175, 0.8)",
  to_review: "rgba(168, 85, 247, 0.8)",
  complete: "rgba(34, 197, 94, 0.8)",
  rejected: "rgba(239, 68, 68, 0.6)",
  withdrew: "rgba(107, 114, 128, 0.8)",
  did_not_finish: "rgba(249, 115, 22, 0.8)",
};

const STATUS_LABELS: Record<string, string> = {
  overdue: "Overdue",
  pending: "Pending",
  reading: "Reading",
  paused: "Paused",
  to_review: "To Review",
  complete: "Complete",
  rejected: "Rejected",
  withdrew: "Withdrew",
  did_not_finish: "Did Not Finish",
};

export function DeadlineStatusChart() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { data: statusData = [], isLoading } = useQuery({
    queryKey: ["deadline-status-breakdown", selectedUserId],
    queryFn: () => getDeadlinesByStatus([selectedUserId!]),
    enabled: !!selectedUserId,
  });

  const chartData = {
    labels: statusData.map((item) => STATUS_LABELS[item.status] || item.status),
    datasets: [
      {
        label: "Deadlines",
        data: statusData.map((item) => item.count),
        backgroundColor: statusData.map((item) => STATUS_COLORS[item.status] || "rgba(156, 163, 175, 0.8)"),
        borderWidth: 0,
      },
    ],
  };

  const maxCount = Math.max(...statusData.map((item) => item.count), 0);

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 20,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Deadlines by Status",
      },
      datalabels: {
        anchor: "end",
        align: "end",
        color: "hsl(var(--foreground))",
        font: {
          weight: "bold",
          size: 12,
        },
        formatter: (value: number) => (value > 0 ? value : ""),
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          // Only use stepSize: 1 for small values to show integers
          ...(maxCount <= 20 ? { stepSize: 1 } : {}),
        },
      },
    },
  };

  return (
    <div className="space-y-4">
      <SingleUserFilter
        selectedUserId={selectedUserId}
        onUserSelect={setSelectedUserId}
      />

      {!selectedUserId ? (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Search for a user to view deadline status
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Loading...
        </div>
      ) : statusData.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          No deadlines found
        </div>
      ) : (
        <div className="h-64">
          <Bar data={chartData} options={options} plugins={[ChartDataLabels]} />
        </div>
      )}
    </div>
  );
}

// Keep old export name for backwards compatibility
export { DeadlineStatusChart as DeadlinesOverTimeChart };

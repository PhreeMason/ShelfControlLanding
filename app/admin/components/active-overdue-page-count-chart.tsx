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
import { getActiveOverduePageCounts } from "@/lib/actions/admin-analytics";

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

export function ActiveOverduePageCountChart() {
  const [selectedDays, setSelectedDays] = useState<TimeRange>(30);

  const { data, isLoading } = useQuery({
    queryKey: ["active-overdue-page-counts", selectedDays],
    queryFn: () => getActiveOverduePageCounts(selectedDays),
  });

  const chartData = {
    labels: data?.dates || [],
    datasets: [
      {
        label: "Active Books",
        data: data?.activePages || [],
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f6",
        tension: 0.1,
      },
      {
        label: "Overdue Books",
        data: data?.overduePages || [],
        borderColor: "#ef4444",
        backgroundColor: "#ef4444",
        tension: 0.1,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || "";
            const value = context.parsed.y ?? 0;
            return `${label}: ${value.toLocaleString()} pages`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Total Pages",
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

      {isLoading ? (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Loading...
        </div>
      ) : !data || (data.activePages.length === 0 && data.overduePages.length === 0) ? (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          No data available for the last {selectedDays} days
        </div>
      ) : (
        <div className="h-64">
          <Line data={chartData} options={options} />
        </div>
      )}
    </div>
  );
}

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
import { getProgressOverTime } from "@/lib/actions/admin-analytics";

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
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const timezoneOffset = new Date().getTimezoneOffset();

  const { data, isLoading } = useQuery({
    queryKey: ["progress-over-time", timezoneOffset, selectedDays],
    queryFn: () => getProgressOverTime(timezoneOffset, selectedDays),
  });

  const filteredDatasets = data?.datasets.filter(dataset =>
    selectedUsers.has(dataset.label)
  ) || [];

  const chartData = {
    labels: data?.dates || [],
    datasets: filteredDatasets,
  };

  const toggleUser = (userLabel: string) => {
    setSelectedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userLabel)) {
        newSet.delete(userLabel);
      } else {
        newSet.add(userLabel);
      }
      return newSet;
    });
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        display: true,
      },
      title: {
        display: true,
        text: "Pages Read Per Day by User",
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

      {isLoading ? (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Loading...
        </div>
      ) : !data || data.datasets.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          No progress data available for the last {selectedDays} days
        </div>
      ) : (
        <>
          <div className="h-64">
            <Line data={chartData} options={options} />
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Filter by User:</h4>
            <div className="flex flex-wrap gap-3">
              {data.datasets.map((dataset, index) => (
                <label
                  key={`${dataset.label}-${index}`}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedUsers.has(dataset.label)}
                    onChange={() => toggleUser(dataset.label)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                  />
                  <span
                    className="text-sm"
                    style={{ color: dataset.borderColor }}
                  >
                    {dataset.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

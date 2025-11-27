"use client";

import { useState, useEffect, useRef } from "react";
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
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const hasInitialized = useRef(false);
  const timezoneOffset = new Date().getTimezoneOffset();

  const { data, isLoading } = useQuery({
    queryKey: ["progress-over-time", timezoneOffset, selectedDays],
    queryFn: () => getProgressOverTime(timezoneOffset, selectedDays),
  });

  // Initialize selectedUsers with all users on first data load
  useEffect(() => {
    if (data?.datasets && !hasInitialized.current) {
      setSelectedUsers(data.datasets.map((d) => d.label));
      hasInitialized.current = true;
    }
  }, [data]);

  const filteredDatasets = data?.datasets.filter(dataset =>
    selectedUsers.includes(dataset.label)
  ) || [];

  const chartData = {
    labels: data?.dates || [],
    datasets: filteredDatasets,
  };

  const handleUserToggle = (userLabel: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userLabel)
        ? prev.filter((u) => u !== userLabel)
        : [...prev, userLabel]
    );
  };

  const selectAllUsers = () => {
    if (data?.datasets) {
      setSelectedUsers(data.datasets.map((d) => d.label));
    }
  };

  const clearAllUsers = () => {
    setSelectedUsers([]);
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

      {data?.datasets && data.datasets.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Users:</span>
            <button
              onClick={selectAllUsers}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Select All
            </button>
            <span className="text-muted-foreground">|</span>
            <button
              onClick={clearAllUsers}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
            {data.datasets.map((dataset) => (
              <button
                key={dataset.label}
                onClick={() => handleUserToggle(dataset.label)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${
                  selectedUsers.includes(dataset.label)
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-muted/50 text-muted-foreground"
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: dataset.borderColor }}
                />
                {dataset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Loading...
        </div>
      ) : !data || data.datasets.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          No progress data available for the last {selectedDays} days
        </div>
      ) : filteredDatasets.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Select users to display
        </div>
      ) : (
        <div className="h-64">
          <Line data={chartData} options={options} />
        </div>
      )}
    </div>
  );
}

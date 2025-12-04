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
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const hasInitialized = useRef(false);

  const { data, isLoading } = useQuery({
    queryKey: ["activity-types-over-time", selectedUserIds],
    queryFn: () => getActivityTypesOverTime(selectedUserIds.length > 0 ? selectedUserIds : undefined),
  });

  // Initialize selectedTypes with all activity types on first data load
  useEffect(() => {
    if (data?.datasets && !hasInitialized.current) {
      setSelectedTypes(data.datasets.map((d) => d.label));
      hasInitialized.current = true;
    }
  }, [data]);

  const filteredDatasets = data?.datasets.filter((dataset) =>
    selectedTypes.includes(dataset.label)
  ) || [];

  const chartData = {
    labels: data?.dates || [],
    datasets: filteredDatasets,
  };

  const maxCount = Math.max(
    ...filteredDatasets.flatMap((dataset) => dataset.data),
    0
  );

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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

  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const selectAllTypes = () => {
    if (data?.datasets) {
      setSelectedTypes(data.datasets.map((d) => d.label));
    }
  };

  const clearAllTypes = () => {
    setSelectedTypes([]);
  };

  return (
    <div className="space-y-4">
      <UserFilter
        selectedUserIds={selectedUserIds}
        onUserToggle={handleUserToggle}
        onClearFilters={clearFilters}
      />

      {data?.datasets && data.datasets.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Activity Types:</span>
            <button
              onClick={selectAllTypes}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Select All
            </button>
            <span className="text-muted-foreground">|</span>
            <button
              onClick={clearAllTypes}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
            {data.datasets.map((dataset) => (
              <button
                key={dataset.label}
                onClick={() => handleTypeToggle(dataset.label)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${
                  selectedTypes.includes(dataset.label)
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
          No activity data available
        </div>
      ) : filteredDatasets.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Select activity types to display
        </div>
      ) : (
        <div className="h-64">
          <Line data={chartData} options={options} />
        </div>
      )}
    </div>
  );
}

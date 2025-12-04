"use client";

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
import { getProfilesCreatedOverTime } from "@/lib/actions/admin-analytics";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function ProfilesCreatedChart() {
  const { data, isLoading } = useQuery({
    queryKey: ["profiles-created-over-time"],
    queryFn: () => getProfilesCreatedOverTime(30),
  });

  const chartData = {
    labels: data?.dates || [],
    datasets: [
      {
        label: "Profiles Created",
        data: data?.counts || [],
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderWidth: 0,
      },
    ],
  };

  const maxCount = Math.max(...(data?.counts || []), 0);

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
        display: false,
      },
      datalabels: {
        anchor: "end",
        align: "end",
        color: "hsl(var(--foreground))",
        font: {
          weight: "bold",
          size: 10,
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
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  const totalProfiles = data?.counts.reduce((sum, count) => sum + count, 0) || 0;

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Loading...
        </div>
      ) : !data || data.counts.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          No profiles created in the last 30 days
        </div>
      ) : (
        <>
          <div className="text-sm text-muted-foreground">
            Total: {totalProfiles} profile{totalProfiles !== 1 ? "s" : ""}
          </div>
          <div className="h-64">
            <Bar data={chartData} options={options} plugins={[ChartDataLabels]} />
          </div>
        </>
      )}
    </div>
  );
}

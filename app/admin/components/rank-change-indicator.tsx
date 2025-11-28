"use client";

import { ChevronUp, ChevronDown, Minus } from "lucide-react";

interface RankChangeIndicatorProps {
  currentRank: number;
  yesterdayRank?: number | null;
}

export function RankChangeIndicator({
  currentRank,
  yesterdayRank,
}: RankChangeIndicatorProps) {
  // No data yet (before migration) - show nothing
  if (yesterdayRank === undefined) {
    return null;
  }

  // null means user wasn't in yesterday's list = NEW entry
  if (yesterdayRank === null) {
    return (
      <span className="text-xs font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
        NEW
      </span>
    );
  }

  const diff = yesterdayRank - currentRank;

  if (diff > 0) {
    return (
      <div className="flex items-center gap-0.5 text-green-600">
        <ChevronUp size={18} strokeWidth={2.5} />
        <span className="text-sm font-semibold">{diff}</span>
      </div>
    );
  }

  if (diff < 0) {
    return (
      <div className="flex items-center gap-0.5 text-red-500">
        <ChevronDown size={18} strokeWidth={2.5} />
        <span className="text-sm font-semibold">{Math.abs(diff)}</span>
      </div>
    );
  }

  // diff === 0, same position
  return <Minus size={16} className="text-gray-300" />;
}

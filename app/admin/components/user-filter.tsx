"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "@/lib/actions/admin-analytics";
import { formatUserName } from "@/lib/utils/format-user-name";

interface UserFilterProps {
  selectedUserIds: string[];
  onUserToggle: (userId: string) => void;
  onClearFilters: () => void;
}

export function UserFilter({
  selectedUserIds,
  onUserToggle,
  onClearFilters,
}: UserFilterProps) {
  const { data: users = [] } = useQuery({
    queryKey: ["all-users"],
    queryFn: getAllUsers,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Filter by Users</h3>
        {selectedUserIds.length > 0 && (
          <button
            onClick={onClearFilters}
            className="text-xs text-muted-foreground hover:text-foreground underline"
          >
            Clear filters ({selectedUserIds.length})
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border rounded">
        {users.map((user) => (
          <label
            key={user.id}
            className="flex items-center gap-2 text-sm cursor-pointer hover:bg-accent px-2 py-1 rounded"
          >
            <input
              type="checkbox"
              checked={selectedUserIds.includes(user.id)}
              onChange={() => onUserToggle(user.id)}
              className="cursor-pointer"
            />
            <span>{formatUserName(user)}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

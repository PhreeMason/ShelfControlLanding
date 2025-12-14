"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers, UserInfo } from "@/lib/actions/admin-analytics";
import { formatUserName } from "@/lib/utils/format-user-name";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface SingleUserFilterProps {
  selectedUserId: string | null;
  onUserSelect: (userId: string | null) => void;
}

export function SingleUserFilter({
  selectedUserId,
  onUserSelect,
}: SingleUserFilterProps) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: users = [] } = useQuery({
    queryKey: ["all-users"],
    queryFn: getAllUsers,
  });

  const selectedUser = users.find((u) => u.id === selectedUserId);
  const filteredUsers = users.filter((user) => {
    if (user.id === selectedUserId) return false;
    if (!search) return false;
    const searchLower = search.toLowerCase();
    const name = formatUserName(user).toLowerCase();
    const email = (user.email || "").toLowerCase();
    return name.includes(searchLower) || email.includes(searchLower);
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (user: UserInfo) => {
    onUserSelect(user.id);
    setSearch("");
    setIsOpen(false);
  };

  const handleClear = () => {
    onUserSelect(null);
  };

  return (
    <div className="flex flex-col gap-2" ref={containerRef}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Select User</h3>
        {selectedUser && (
          <button
            onClick={handleClear}
            className="text-xs text-muted-foreground hover:text-foreground underline"
          >
            Clear
          </button>
        )}
      </div>

      {selectedUser && (
        <div className="flex flex-wrap gap-1">
          <Badge variant="secondary" className="gap-1 pr-1">
            {formatUserName(selectedUser)}
            <button
              onClick={handleClear}
              className="ml-1 hover:bg-muted rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        </div>
      )}

      {!selectedUser && (
        <div className="relative">
          <Input
            placeholder="Search for a user..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className="w-full"
          />
          {isOpen && filteredUsers.length > 0 && (
            <div className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto bg-popover border rounded-md shadow-md">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleSelect(user)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-accent flex flex-col"
                >
                  <span>{formatUserName(user)}</span>
                  {user.email && (
                    <span className="text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
          {isOpen && search && filteredUsers.length === 0 && (
            <div className="absolute z-50 mt-1 w-full bg-popover border rounded-md shadow-md p-3 text-sm text-muted-foreground">
              No users found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

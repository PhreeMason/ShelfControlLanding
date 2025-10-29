import type { UserInfo } from "@/lib/actions/admin-analytics";

export function formatUserName(user: UserInfo): string {
  const fullName = [user.first_name, user.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (fullName) {
    return fullName;
  }

  if (user.username) {
    return user.username;
  }

  return user.email || user.id;
}

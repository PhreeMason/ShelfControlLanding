import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import Image from "next/image";
import { DeleteAccountDialog } from "@/components/delete-account-dialog";
import { DeleteUserDataDialog } from "@/components/delete-user-data-dialog";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userData.user.id)
    .single();

  const displayName = profile?.first_name
    ? `${profile.first_name}${profile.last_name ? ' ' + profile.last_name : ''}`
    : profile?.username || userData.user.email?.split('@')[0];

  let avatarUrl = null;
  if (profile?.avatar_url) {
    const { data, error } = await supabase.storage
      .from('avatars')
      .createSignedUrl(profile.avatar_url, 90 * 24 * 60 * 60);

    if (!error && data) {
      avatarUrl = data.signedUrl;
    }
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {displayName}
        </h1>
        <p className="text-muted-foreground">
          Manage your profile and account settings
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Your account details and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b">
            {avatarUrl ? (
              <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={avatarUrl}
                  alt={displayName}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <User className="w-10 h-10 text-muted-foreground" />
              </div>
            )}
            <div>
              <h3 className="text-xl font-semibold">{displayName}</h3>
              <p className="text-sm text-muted-foreground">{userData.user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile?.first_name && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="text-base">
                  {profile.first_name} {profile.last_name || ''}
                </p>
              </div>
            )}

            {profile?.username && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Username</p>
                <p className="text-base">{profile.username}</p>
              </div>
            )}

            {profile?.website && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Website</p>
                <p className="text-base">{profile.website}</p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-muted-foreground">Account Created</p>
              <p className="text-base">
                {new Date(userData.user.created_at).toLocaleDateString()}
              </p>
            </div>

            {profile?.role && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Role</p>
                <p className="text-base capitalize">{profile.role}</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t">
            <Button asChild>
              <a href="/protected/profile/edit">Edit Profile</a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border border-destructive/50 rounded-lg bg-destructive/5">
            <div className="space-y-1">
              <p className="font-medium text-sm">Delete All My Data</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete all your deadlines and associated data (notes, progress, tags, etc.). This action cannot be undone.
              </p>
            </div>
            <DeleteUserDataDialog />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border border-destructive/50 rounded-lg bg-destructive/5">
            <div className="space-y-1">
              <p className="font-medium text-sm">Delete Account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <DeleteAccountDialog
              identifier={profile?.username || profile?.email || userData.user.email || ""}
              identifierType={profile?.username ? "username" : "email"}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

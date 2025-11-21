import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EditProfileForm } from "@/components/edit-profile-form";

export default async function EditProfilePage() {
  const supabase = await createClient();

  // Check authentication
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    redirect("/auth/login");
  }

  // Fetch profile data
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userData.user.id)
    .single();

  if (profileError || !profile) {
    // If profile doesn't exist, redirect to home
    redirect("/home");
  }

  // Get avatar URL if exists
  let avatarUrl = null;
  if (profile.avatar_url) {
    const { data, error } = await supabase.storage
      .from("avatars")
      .createSignedUrl(profile.avatar_url, 90 * 24 * 60 * 60);

    if (!error && data) {
      avatarUrl = data.signedUrl;
    }
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8 max-w-2xl mx-auto py-8 px-4">
      <div>
        <h1 className="text-3xl font-bold mb-2">Edit Profile</h1>
        <p className="text-muted-foreground">
          Update your personal information and avatar
        </p>
      </div>

      <EditProfileForm
        profile={{
          id: profile.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          username: profile.username,
          email: profile.email,
          avatar_url: profile.avatar_url,
        }}
        avatarUrl={avatarUrl}
      />
    </div>
  );
}

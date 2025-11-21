"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Upload, X } from "lucide-react";
import Image from "next/image";

interface ProfileData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
}

interface EditProfileFormProps {
  profile: ProfileData;
  avatarUrl: string | null;
}

export function EditProfileForm({ profile, avatarUrl }: EditProfileFormProps) {
  const [firstName, setFirstName] = useState(profile.first_name || "");
  const [lastName, setLastName] = useState(profile.last_name || "");
  const [username, setUsername] = useState(profile.username || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(avatarUrl);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Avatar file size must be less than 5MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        setError("Avatar must be an image file");
        return;
      }

      setAvatarFile(file);
      setRemoveAvatar(false);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    setRemoveAvatar(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const supabase = createClient();
      let newAvatarUrl = profile.avatar_url;

      // Handle avatar upload
      if (avatarFile) {
        // Delete old avatar if exists
        if (profile.avatar_url) {
          await supabase.storage.from("avatars").remove([profile.avatar_url]);
        }

        // Upload new avatar
        const fileExt = avatarFile.name.split(".").pop();
        const fileName = `${profile.id}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, avatarFile);

        if (uploadError) throw uploadError;
        newAvatarUrl = fileName;
      } else if (removeAvatar && profile.avatar_url) {
        // Remove avatar
        await supabase.storage.from("avatars").remove([profile.avatar_url]);
        newAvatarUrl = null;
      }

      // Update profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          first_name: firstName || null,
          last_name: lastName || null,
          username: username || null,
          avatar_url: newAvatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (updateError) throw updateError;

      setSuccess("Profile updated successfully!");

      // Redirect to home page after a short delay
      setTimeout(() => {
        router.push("/home");
        router.refresh();
      }, 1500);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>
          Update your profile information and avatar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center gap-4 pb-6 border-b">
              <div className="relative">
                {avatarPreview ? (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden">
                    <Image
                      src={avatarPreview}
                      alt="Profile avatar"
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
                    <User className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                {avatarPreview && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center hover:bg-destructive/90"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <Label htmlFor="avatar" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">Upload Avatar</span>
                  </div>
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </Label>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Maximum file size: 5MB. Supported formats: JPG, PNG, GIF, WebP
              </p>
            </div>

            {/* Email (Read-only) */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email || ""}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Email is managed through your account settings
              </p>
            </div>

            {/* First Name */}
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            {/* Last Name */}
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            {/* Username */}
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-3 rounded-md bg-green-500/10 text-green-600 dark:text-green-400 text-sm">
                {success}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/home")}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

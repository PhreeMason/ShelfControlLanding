"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

interface DeleteAccountParams {
  identifier: string;
  confirmationText: string;
}

interface DeleteAccountResult {
  success: boolean;
  error?: string;
}

export async function deleteAccount(
  params: DeleteAccountParams
): Promise<DeleteAccountResult> {
  try {
    // Get the current user's session
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: "You must be logged in to delete your account.",
      };
    }

    // Get the user's profile to verify username or email
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("username, email")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return {
        success: false,
        error: "Could not verify your account information.",
      };
    }

    // Verify the confirmation text (trim whitespace for better UX)
    if (params.confirmationText.trim() !== "delete my account") {
      return {
        success: false,
        error: "Confirmation text does not match. Please type 'delete my account'.",
      };
    }

    // Verify the identifier matches (username or email)
    const expectedIdentifier = profile.username || profile.email || user.email;
    if (!expectedIdentifier) {
      return {
        success: false,
        error: "Could not determine your account identifier.",
      };
    }

    if (params.identifier.trim() !== expectedIdentifier) {
      return {
        success: false,
        error: "Username/email does not match.",
      };
    }

    // Sign out the user from the current session first
    await supabase.auth.signOut();

    // Use admin client to delete the user and sign out all sessions
    const adminClient = createAdminClient();
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(
      user.id,
      true // shouldLogout - signs out user from all sessions
    );

    if (deleteError) {
      console.error("Error deleting user:", deleteError);
      return {
        success: false,
        error: "An error occurred while deleting your account. Please try again.",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Unexpected error during account deletion:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

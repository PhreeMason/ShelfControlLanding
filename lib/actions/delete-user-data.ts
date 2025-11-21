"use server";

import { createClient } from "@/lib/supabase/server";

interface DeleteUserDataParams {
  confirmationText: string;
}

interface DeleteUserDataResult {
  success: boolean;
  error?: string;
}

export async function deleteUserData(
  params: DeleteUserDataParams
): Promise<DeleteUserDataResult> {
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
        error: "You must be logged in to delete your data.",
      };
    }

    // Verify the confirmation text (exact match, case-sensitive)
    if (params.confirmationText !== "I understand") {
      return {
        success: false,
        error: "Confirmation text does not match. Please type 'I understand' exactly.",
      };
    }

    // Delete all user data
    // Thanks to cascade deletes, we only need to delete the main tables
    // and the database will automatically handle related records

    // Delete deadlines - this will cascade to:
    // - deadline_progress, deadline_status, deadline_contacts, deadline_notes, deadline_tags
    // - review_tracking -> review_platforms
    // - deadline_notes -> note_hashtags
    const { error: deadlinesError } = await supabase
      .from("deadlines")
      .delete()
      .eq("user_id", user.id);

    if (deadlinesError) {
      console.error("Error deleting deadlines:", deadlinesError);
      return {
        success: false,
        error: "An error occurred while deleting your data.",
      };
    }

    // Delete other user-owned tables (not related to deadlines)
    const { error: hashtagsError } = await supabase
      .from("hashtags")
      .delete()
      .eq("user_id", user.id);

    if (hashtagsError) {
      console.error("Error deleting hashtags:", hashtagsError);
    }

    const { error: tagsError } = await supabase
      .from("tags")
      .delete()
      .eq("user_id", user.id);

    if (tagsError) {
      console.error("Error deleting tags:", tagsError);
    }

    const { error: disclosureTemplatesError } = await supabase
      .from("disclosure_templates")
      .delete()
      .eq("user_id", user.id);

    if (disclosureTemplatesError) {
      console.error("Error deleting disclosure_templates:", disclosureTemplatesError);
    }

    const { error: userSearchesError } = await supabase
      .from("user_searches")
      .delete()
      .eq("user_id", user.id);

    if (userSearchesError) {
      console.error("Error deleting user_searches:", userSearchesError);
    }

    const { error: userActivitiesError } = await supabase
      .from("user_activities")
      .delete()
      .eq("user_id", user.id);

    if (userActivitiesError) {
      console.error("Error deleting user_activities:", userActivitiesError);
    }

    const { error: csvExportLogsError } = await supabase
      .from("csv_export_logs")
      .delete()
      .eq("user_id", user.id);

    if (csvExportLogsError) {
      console.error("Error deleting csv_export_logs:", csvExportLogsError);
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Unexpected error during data deletion:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

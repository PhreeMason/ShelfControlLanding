"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteUserData } from "@/lib/actions/delete-user-data";
import { AlertTriangle } from "lucide-react";

export function DeleteUserDataDialog() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const isValid = confirmationText === "I understand";

  const handleDelete = async () => {
    if (!isValid) return;

    setIsDeleting(true);
    setError("");

    const result = await deleteUserData({
      confirmationText,
    });

    if (result.success) {
      setIsOpen(false);
      router.refresh();
    } else {
      setError(result.error || "An error occurred");
      setIsDeleting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset form when dialog is closed
      setConfirmationText("");
      setError("");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full sm:w-auto">
          <AlertTriangle className="w-4 h-4 mr-2" />
          Delete All My Data
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Delete All My Data
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left space-y-2">
            <p className="font-semibold text-foreground">
              This action cannot be undone.
            </p>
            <p>
              This will permanently delete all of your books and all
              associated data including:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm pl-2">
              <li>All due dates</li>
              <li>Reading notes and progress tracking</li>
              <li>Review tracker data</li>
              <li>Contacts, tags, and hashtags</li>
              <li>Disclosure templates</li>
            </ul>
            <p className="text-sm pt-2">
              To confirm, please type{" "}
              <span className="font-mono font-semibold">I understand</span>{" "}
              below (case-sensitive).
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="confirmation">Type &quot;I understand&quot;</Label>
            <Input
              id="confirmation"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="I understand"
              disabled={isDeleting}
            />
          </div>

          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={!isValid || isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete All My Data"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

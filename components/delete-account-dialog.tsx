"use client";

import { useState } from "react";
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
import { deleteAccount } from "@/lib/actions/delete-account";
import { AlertTriangle } from "lucide-react";

interface DeleteAccountDialogProps {
  identifier: string;
  identifierType: "username" | "email";
}

export function DeleteAccountDialog({ identifier, identifierType }: DeleteAccountDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [identifierInput, setIdentifierInput] = useState("");
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const isValid =
    confirmationText === "delete my account" && identifierInput === identifier;

  const handleDelete = async () => {
    if (!isValid) return;

    setIsDeleting(true);
    setError("");

    const result = await deleteAccount({
      identifier: identifierInput,
      confirmationText,
    });

    if (result.success) {
      // Force a hard redirect to clear all client-side state
      window.location.href = "/";
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
      setIdentifierInput("");
      setError("");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full sm:w-auto">
          <AlertTriangle className="w-4 h-4 mr-2" />
          Delete Account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Delete Account
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left space-y-2">
            <p className="font-semibold text-foreground">
              This action cannot be undone.
            </p>
            <p>
              This will permanently delete your account and remove all of your
              data from our servers.
            </p>
            <p className="text-sm">
              To confirm, please type <span className="font-mono font-semibold">delete my account</span> and your {identifierType} below.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="confirmation">Type &quot;delete my account&quot;</Label>
            <Input
              id="confirmation"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="delete my account"
              disabled={isDeleting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="identifier">
              Your {identifierType}: {identifier}
            </Label>
            <Input
              id="identifier"
              value={identifierInput}
              onChange={(e) => setIdentifierInput(e.target.value)}
              placeholder={identifier}
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
            {isDeleting ? "Deleting..." : "Delete Account"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

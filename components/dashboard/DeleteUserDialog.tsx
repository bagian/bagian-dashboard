"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  userName?: string;
  isLoading?: boolean;
}

export function DeleteUserDialog({
  open,
  onOpenChange,
  onConfirm,
  userName,
  isLoading,
}: DeleteUserDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Hapus User?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-650 dark:text-zinc-400">
            Apakah Anda yakin ingin menghapus user{" "}
            {userName && (
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{userName}</span>
            )}{" "}
            dari sistem? Tindakan ini tidak dapat dibatalkan dan akan menghapus
            semua data terkait user ini.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={isLoading}
            className="rounded-lg border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-900 dark:text-zinc-100 cursor-pointer"
          >
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-lg bg-rose-600 dark:bg-rose-750 hover:bg-rose-700 dark:hover:bg-rose-800 text-white cursor-pointer"
          >
            {isLoading ? "Menghapus..." : "Hapus User"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

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
import {Badge} from "@/components/ui/badge";

interface ChangeRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  userName?: string;
  currentRole: string;
  newRole: string;
  isLoading?: boolean;
}

export function ChangeRoleDialog({
  open,
  onOpenChange,
  onConfirm,
  userName,
  currentRole,
  newRole,
  isLoading,
}: ChangeRoleDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Ubah Role User?
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="text-zinc-600 dark:text-zinc-400 space-y-3">
              <p>
                Apakah Anda yakin ingin mengubah role user{" "}
                {userName && (
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {userName}
                  </span>
                )}
                ?
              </p>
              <div className="flex items-center gap-3 pt-2">
                <Badge
                  className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase border-none shadow-none ${
                    currentRole === "admin" || currentRole === "superadmin"
                      ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  {currentRole}
                </Badge>
                <span className="text-zinc-400">→</span>
                <Badge
                  className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase border-none shadow-none ${
                    newRole === "admin" || newRole === "superadmin"
                      ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  {newRole}
                </Badge>
              </div>
            </div>
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
            className="rounded-lg bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 cursor-pointer"
          >
            {isLoading ? "Mengubah..." : "Ubah Role"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

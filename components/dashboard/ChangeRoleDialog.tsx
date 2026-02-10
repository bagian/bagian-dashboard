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
      <AlertDialogContent className="rounded-2xl border-zinc-200">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold">
            Ubah Role User?
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="text-zinc-600 space-y-3">
              <p>
                Apakah Anda yakin ingin mengubah role user{" "}
                {userName && (
                  <span className="font-semibold text-zinc-900">
                    {userName}
                  </span>
                )}
                ?
              </p>
              <div className="flex items-center gap-3 pt-2">
                <Badge
                  className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${
                    currentRole === "admin" || currentRole === "superadmin"
                      ? "bg-zinc-900 text-white"
                      : "bg-zinc-100 text-zinc-500"
                  }`}
                >
                  {currentRole}
                </Badge>
                <span className="text-zinc-400">→</span>
                <Badge
                  className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${
                    newRole === "admin" || newRole === "superadmin"
                      ? "bg-zinc-900 text-white"
                      : "bg-zinc-100 text-zinc-500"
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
            className="rounded-lg border-zinc-200 hover:bg-zinc-50"
          >
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white"
          >
            {isLoading ? "Mengubah..." : "Ubah Role"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

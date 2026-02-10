"use client";

import {useState} from "react";
import {
  updateInvoiceStatus,
  deleteInvoice,
} from "@/app/actions/invoice-actions";
import {Button} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
import {MoreVertical, Check, X, Trash2} from "lucide-react";
import {useRouter} from "next/navigation";
import {toast} from "sonner";

interface InvoiceActionsProps {
  id: number;
  status: string;
}

export function InvoiceActions({id, status}: InvoiceActionsProps) {
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();

  const handleStatusChange = async (newStatus: "paid" | "unpaid") => {
    if (loading) return;
    setLoading(true);

    const result = await updateInvoiceStatus(id, newStatus);

    if (result.error) {
      toast.error("Gagal update status!", {
        description: result.error,
      });
    } else {
      toast.success("Status berhasil diperbarui!", {
        description: `Invoice ditandai sebagai ${newStatus === "paid" ? "Lunas" : "Belum Lunas"}`,
      });
      router.refresh();
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);

    const result = await deleteInvoice(id);

    if (result.error) {
      toast.error("Gagal menghapus invoice!", {
        description: result.error,
      });
      setLoading(false);
    } else {
      toast.success("Invoice berhasil dihapus!", {
        description: "Data invoice telah dihapus dari sistem.",
      });
      setShowDeleteDialog(false);
      router.refresh();
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="w-full flex items-center justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-zinc-100 rounded-lg ml-auto cursor-pointer"
              disabled={loading}
            >
              <MoreVertical className="h-4 w-4 text-zinc-400" />
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 rounded-xl bg-white border border-zinc-200 shadow-lg"
        >
          {status === "unpaid" ? (
            <DropdownMenuItem
              onClick={() => handleStatusChange("paid")}
              className="cursor-pointer rounded-lg"
              disabled={loading}
            >
              <Check className="h-4 w-4 mr-2 text-emerald-600" />
              <span className="text-sm">Tandai Lunas</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => handleStatusChange("unpaid")}
              className="cursor-pointer rounded-lg"
              disabled={loading}
            >
              <X className="h-4 w-4 mr-2 text-orange-600" />
              <span className="text-sm">Tandai Belum Lunas</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 rounded-lg"
            disabled={loading}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            <span className="text-sm">Hapus Invoice</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">
              Hapus Invoice?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-zinc-500">
              Tindakan ini tidak dapat dibatalkan. Invoice akan dihapus permanen
              dari sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl" disabled={loading}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 rounded-xl"
            >
              {loading ? "Menghapus..." : "Ya, Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

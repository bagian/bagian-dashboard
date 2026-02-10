"use client";

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Trash2, CheckCircle2, Loader2} from "lucide-react";
import {
  updateInvoiceStatus,
  deleteInvoice,
} from "@/app/actions/invoice-actions";
import {toast} from "sonner";

export function InvoiceActions({id, status}: {id: string; status: string}) {
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    // Panggil dengan 1 argumen sesuai file actions di atas
    const result = await updateInvoiceStatus(id);

    if (result?.success) {
      toast.success("Status diperbarui", {
        description: "Tagihan telah ditandai sebagai lunas.",
      });
    } else {
      toast.error("Gagal update status", {
        description: result?.error,
      });
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm("Hapus tagihan ini?")) return;
    setLoading(true);
    const result = await deleteInvoice(id);

    if (result?.success) {
      toast.success("Tagihan dihapus");
    } else {
      toast.error("Gagal menghapus", {
        description: result?.error,
      });
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-end gap-1">
      {status === "unpaid" && (
        <Button
          onClick={handleUpdate}
          disabled={loading}
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-emerald-600 hover:bg-emerald-50 rounded-full cursor-pointer"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )}
        </Button>
      )}
      <Button
        onClick={handleDelete}
        disabled={loading}
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-rose-600 hover:bg-rose-50 rounded-full cursor-pointer"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

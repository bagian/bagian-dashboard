"use client";

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  MoreVertical,
  Check,
  X,
  CircleDashed,
  Trash2,
  Printer,
  Pencil,
  ChevronDown,
} from "lucide-react";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {supabase} from "@/lib/supabase/client";

interface Client {
  id: string;
  email?: string;
  full_name?: string | null;
  role?: string;
}

interface EditPayload {
  name?: string;
  subject?: string;
  client_id?: string;
  user_id?: string;
  deadline?: string | null;
  [key: string]: unknown;
}

// FIX: Definisikan Interface untuk payload update database
interface UpdateDatabasePayload {
  name?: string;
  subject?: string;
  deadline?: string | null;
}

interface GlobalActionsProps {
  id: string | number;
  status: string;
  type: "invoice" | "project" | "ticket";
  tableName: "invoices" | "projects" | "tickets";
  editPayload?: EditPayload;
  clients?: Client[];
}

export function GlobalActions({
  id,
  status,
  type,
  tableName,
  editPayload,
  clients,
}: GlobalActionsProps) {
  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const router = useRouter();

  const handleStatusChange = async (newStatus: string) => {
    if (loading) return;
    setLoading(true);
    try {
      const {error} = await supabase
        .from(tableName)
        .update({status: newStatus})
        .eq("id", id);
      if (error) throw error;
      toast.success("Status berhasil diperbarui! 🎉");
      router.refresh();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      toast.error("Gagal update status!", {description: errorMessage});
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const {error} = await supabase.from(tableName).delete().eq("id", id);
      if (error) throw error;
      toast.success("Data berhasil dihapus!");
      setShowDeleteDialog(false);
      router.refresh();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      toast.error("Gagal menghapus data!", {description: errorMessage});
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    // FIX: Menggunakan tipe interface yang sudah didefinisikan alih-alih 'any'
    const updateData: UpdateDatabasePayload = {};

    if (type === "project") {
      updateData.name = formData.get("name") as string;
      updateData.deadline = (formData.get("deadline") as string) || null;
    } else if (type === "ticket") {
      updateData.subject = formData.get("name") as string;
    }

    try {
      const {error} = await supabase
        .from(tableName)
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      toast.success("Data berhasil diperbarui! 📝");
      setShowEditModal(false);
      router.refresh();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Terjadi kesalahan";
      toast.error("Gagal memperbarui data!", {description: errorMessage});
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="w-full flex items-center justify-end pr-4">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-zinc-100 rounded-lg cursor-pointer"
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
          {type === "invoice" && (
            <>
              <DropdownMenuItem
                onClick={() => router.push(`/customer/invoices/${id}/print`)}
                className="cursor-pointer rounded-lg"
              >
                <Printer className="h-4 w-4 mr-2 text-zinc-600" />
                <span className="text-sm">Cetak Invoice</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
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
            </>
          )}

          {type === "project" && (
            <>
              <DropdownMenuItem
                onClick={() => setShowEditModal(true)}
                className="cursor-pointer rounded-lg"
                disabled={loading}
              >
                <Pencil className="h-4 w-4 mr-2 text-zinc-600" />
                <span className="text-sm">Edit Data</span>
              </DropdownMenuItem>
              {status !== "completed" ? (
                <DropdownMenuItem
                  onClick={() => handleStatusChange("completed")}
                  className="cursor-pointer rounded-lg"
                  disabled={loading}
                >
                  <Check className="h-4 w-4 mr-2 text-emerald-600" />
                  <span className="text-sm">Tandai Selesai</span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => handleStatusChange("in_progress")}
                  className="cursor-pointer rounded-lg"
                  disabled={loading}
                >
                  <CircleDashed className="h-4 w-4 mr-2 text-blue-600" />
                  <span className="text-sm">Tandai Berjalan</span>
                </DropdownMenuItem>
              )}
            </>
          )}

          {type === "ticket" && (
            <>
              <DropdownMenuItem
                onClick={() => setShowEditModal(true)}
                className="cursor-pointer rounded-lg"
                disabled={loading}
              >
                <Pencil className="h-4 w-4 mr-2 text-zinc-600" />
                <span className="text-sm">Edit Tiket</span>
              </DropdownMenuItem>
              {status === "open" ? (
                <DropdownMenuItem
                  onClick={() => handleStatusChange("closed")}
                  className="cursor-pointer rounded-lg"
                  disabled={loading}
                >
                  <Check className="h-4 w-4 mr-2 text-emerald-600" />
                  <span className="text-sm">Tutup Tiket</span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => handleStatusChange("open")}
                  className="cursor-pointer rounded-lg"
                  disabled={loading}
                >
                  <CircleDashed className="h-4 w-4 mr-2 text-blue-600" />
                  <span className="text-sm">Buka Kembali</span>
                </DropdownMenuItem>
              )}
            </>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 rounded-lg"
            disabled={loading}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            <span className="text-sm">Hapus Data</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {(type === "project" || type === "ticket") && editPayload && (
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="sm:max-w-[425px] rounded-2xl border-none shadow-2xl bg-white">
            <DialogHeader>
              <DialogTitle className="font-semibold text-xl tracking-tight text-zinc-900 italic uppercase">
                {type === "project" ? "Edit Proyek" : "Edit Tiket"}
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500 font-medium italic">
                Ubah rincian {type === "project" ? "proyek" : "tiket"}.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-5 py-4">
              <div className="space-y-2 flex flex-col">
                <Label
                  htmlFor="client_name_display"
                  className="text-[10px] font-bold uppercase tracking-widest text-zinc-400"
                >
                  Client / Pemohon
                </Label>
                <Input
                  id="client_name_display"
                  value={
                    clients?.find(
                      (c) =>
                        c.id === (editPayload.client_id || editPayload.user_id),
                    )?.full_name ||
                    clients?.find(
                      (c) =>
                        c.id === (editPayload.client_id || editPayload.user_id),
                    )?.email ||
                    "Client tidak ditemukan"
                  }
                  readOnly
                  className="rounded-xl border-zinc-100 bg-zinc-50 h-11 cursor-default text-zinc-400 select-none focus-visible:ring-0 focus-visible:outline-none"
                  tabIndex={-1}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-[10px] font-bold uppercase tracking-widest text-zinc-400"
                >
                  {type === "project" ? "Nama Proyek" : "Subjek Tiket"}
                </Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={
                    (editPayload.name || editPayload.subject) as string
                  }
                  required
                  className="rounded-xl border-zinc-100 h-11"
                />
              </div>

              {type === "project" && (
                <div className="space-y-2">
                  <Label
                    htmlFor="deadline"
                    className="text-[10px] font-bold uppercase tracking-widest text-zinc-400"
                  >
                    Tenggat Waktu
                  </Label>
                  <Input
                    id="deadline"
                    name="deadline"
                    type="date"
                    defaultValue={(editPayload.deadline as string) || ""}
                    className="rounded-xl border-zinc-100 h-11 cursor-pointer"
                    onClick={(e) => e.currentTarget.showPicker()}
                  />
                </div>
              )}

              <DialogFooter className="pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-zinc-900 text-white rounded-xl py-6 font-bold uppercase tracking-widest text-[10px] shadow-lg hover:bg-zinc-800 transition-all cursor-pointer"
                >
                  {loading ? "MEMPERBARUI..." : "SIMPAN PERUBAHAN"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="rounded-2xl border-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold uppercase tracking-tight">
              Hapus Data?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-zinc-500">
              Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="rounded-xl border-zinc-200"
              disabled={loading}
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl border-none shadow-lg shadow-red-100"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

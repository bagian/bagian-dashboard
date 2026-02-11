"use client";

import {useState} from "react";
import {createInvoice} from "@/app/actions/invoice-actions";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {Plus} from "lucide-react";

interface Client {
  id: string;
  email: string;
  role?: string; // Tambahkan role
}

export function CreateInvoiceModal({clients}: {clients: Client[]}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Filter hanya client dengan role customer (bukan admin/superadmin)
  const customerOnly = clients.filter(
    (client) =>
      client.role?.toLowerCase() !== "admin" &&
      client.role?.toLowerCase() !== "superadmin",
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await createInvoice(formData);

    if (result.error) {
      toast.error("Gagal membuat invoice!", {
        description: result.error,
      });
      setLoading(false);
    } else {
      toast.success("Invoice berhasil dibuat! 🎉", {
        description: "Tagihan telah dikirim ke client.",
      });
      setOpen(false);
      setLoading(false);

      // Reset form
      e.currentTarget.reset();

      router.refresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-zinc-900 text-white font-medium rounded-xl text-xs px-6 py-5 shadow-sm hover:bg-zinc-800 transition-all cursor-pointer">
          <Plus className="h-4 w-4 mr-2" />
          Buat Tagihan Baru
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-2xl border-none shadow-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="font-semibold text-xl tracking-tight">
            Kirim Tagihan
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-500 font-medium">
            Pilih client dan masukkan detail tagihan.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          <div className="space-y-2 flex flex-col">
            <Label
              htmlFor="client_id"
              className="text-[10px] font-bold uppercase tracking-widest text-zinc-400"
            >
              Pilih Client
            </Label>
            <select
              id="client_id"
              name="client_id"
              required
              defaultValue=""
              className="flex h-11 w-full rounded-xl border border-zinc-100 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-200 transition-all appearance-none cursor-pointer"
            >
              <option value="" disabled>
                -- Pilih Client --
              </option>
              {customerOnly.length === 0 ? (
                <option disabled>Tidak ada client tersedia</option>
              ) : (
                customerOnly.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.email}
                  </option>
                ))
              )}
            </select>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="invoice_number"
              className="text-[10px] font-bold uppercase tracking-widest text-zinc-400"
            >
              Nomor Invoice
            </Label>
            <Input
              id="invoice_number"
              name="invoice_number"
              placeholder="INV/2026/001"
              required
              className="rounded-xl border-zinc-100 h-11"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="amount"
              className="text-[10px] font-bold uppercase tracking-widest text-zinc-400"
            >
              Jumlah Tagihan (Rp)
            </Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              placeholder="5000000"
              required
              className="rounded-xl border-zinc-100 h-11"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="due_date"
              className="text-[10px] font-bold uppercase tracking-widest text-zinc-400"
            >
              Tanggal Jatuh Tempo
            </Label>
            <Input
              id="due_date"
              name="due_date"
              type="date"
              required
              className="rounded-xl border-zinc-100 h-11"
            />
          </div>
          <DialogFooter className="pt-2">
            <Button
              type="submit"
              disabled={loading || customerOnly.length === 0}
              className="w-full bg-zinc-900 text-white rounded-xl py-6 font-bold uppercase tracking-widest text-[10px] shadow-lg hover:bg-zinc-800 transition-all cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "MENGIRIM..." : "KONFIRMASI & KIRIM"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

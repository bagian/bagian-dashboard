"use client";

import {useState} from "react";
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
import {createInvoice} from "@/app/actions/invoice-actions";
import {toast} from "sonner";

export function CreateInvoiceModal({
  clients,
}: {
  clients: {id: string; email: string}[];
}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleAction(formData: FormData) {
    setLoading(true);
    const result = await createInvoice(formData);

    if (result?.error) {
      toast.error("Gagal", {description: result.error});
    } else {
      toast.success("Berhasil", {description: "Tagihan telah dikirim."});
      setOpen(false);
    }
    setLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-zinc-900 text-white font-medium rounded-xl text-xs px-6 py-5 shadow-sm hover:bg-zinc-800 transition-all cursor-pointer">
          Buat Tagihan Baru
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-2xl border-none shadow-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="font-semibold text-xl tracking-tight">
            Kirim Tagihan
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-500 font-medium italic">
            Pilih client dan masukkan detail tagihan.
          </DialogDescription>
        </DialogHeader>
        <form action={handleAction} className="space-y-5 py-4">
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
              className="flex h-11 w-full rounded-xl border border-zinc-100 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-200 cursor-pointer appearance-none"
            >
              <option value="" disabled>
                -- Pilih Client --
              </option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.email}
                </option>
              ))}
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
              disabled={loading}
              className="w-full bg-zinc-900 text-white rounded-xl py-6 font-bold uppercase tracking-widest text-[10px] shadow-lg hover:bg-zinc-800 transition-all cursor-pointer"
            >
              {loading ? "MENGIRIM..." : "KONFIRMASI & KIRIM"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

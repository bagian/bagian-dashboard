"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface Client {
  id: string;
  email: string;
  full_name: string | null;
  role?: string;
}

export function CreateProjectModal({ clients }: { clients: Client[] }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const customerOnly = clients.filter((client) => {
    const role = client.role?.toLowerCase() || "user";
    return role !== "admin" && role !== "superadmin" && role !== "super admin";
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // 1. Simpan referensi form di awal
    const form = e.currentTarget;
    const formData = new FormData(form);
    e.preventDefault();
    setLoading(true);

    const client_id = formData.get("client_id") as string;
    const name = formData.get("name") as string;
    const status = formData.get("status") as string;
    const deadline = formData.get("deadline") as string;

    try {
      const { error } = await supabase.from("projects").insert([
        {
          name: name,
          client_id: client_id,
          status: status,
          deadline: deadline || null,
        },
      ]);

      if (error) {
        toast.error("Gagal menyimpan ke database!", {
          description: error.message,
        });
        setLoading(false);
        return;
      }

      toast.success("Proyek berhasil dibuat! 🎉", {
        description: "Data proyek baru telah ditambahkan ke tabel.",
      });

      // 2. Gunakan referensi 'form' yang sudah disimpan untuk mereset
      form.reset();

      setOpen(false);

      // ❌ e.currentTarget.reset(); <-- BARIS INI SUDAH SAYA HAPUS

      router.refresh();
    } catch (error) {
      toast.error("Terjadi kesalahan sistem!", {
        description:
          error instanceof Error ? error.message : "Silakan coba lagi.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-zinc-900 text-white font-medium rounded-xl text-xs px-6 py-5 shadow-sm hover:bg-zinc-800 transition-all cursor-pointer">
          <Plus className="h-4 w-4 mr-2" />
          Buat Proyek Baru
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-2xl border-none shadow-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="font-semibold text-xl tracking-tight">
            Proyek Baru
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-500 font-medium">
            Pilih client dan masukkan detail proyek.
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
            {/* Wrapper Relative untuk Arrow */}
            <div className="relative group">
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
                  <option disabled>Tidak ada user tersedia</option>
                ) : (
                  customerOnly.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.full_name || client.email}
                    </option>
                  ))
                )}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-zinc-400 pointer-events-none group-hover:text-zinc-900 transition-colors" />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-[10px] font-bold uppercase tracking-widest text-zinc-400"
            >
              Nama Proyek
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Cth: Slicing UI Dashboard"
              required
              className="rounded-xl border-zinc-100 h-11"
            />
          </div>

          <div className="space-y-2 flex flex-col">
            <Label
              htmlFor="status"
              className="text-[10px] font-bold uppercase tracking-widest text-zinc-400"
            >
              Status Proyek
            </Label>
            {/* Wrapper Relative untuk Arrow */}
            <div className="relative group">
              <select
                id="status"
                name="status"
                required
                defaultValue="in_progress"
                className="flex h-11 w-full rounded-xl border border-zinc-100 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-200 transition-all appearance-none cursor-pointer"
              >
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="draft">Draft</option>
              </select>
              <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-zinc-400 pointer-events-none group-hover:text-zinc-900 transition-colors" />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="deadline"
              className="text-[10px] font-bold uppercase tracking-widest text-zinc-400"
            >
              Tenggat Waktu (Deadline)
            </Label>
            <Input
              id="deadline"
              name="deadline"
              type="date"
              className="rounded-xl border-zinc-100 h-11 cursor-pointer block"
              onClick={(e) => e.currentTarget.showPicker()}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="submit"
              disabled={loading || customerOnly.length === 0}
              className="w-full bg-zinc-900 text-white rounded-xl py-6 font-bold uppercase tracking-widest text-[10px] shadow-lg hover:bg-zinc-800 transition-all cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "MENYIMPAN..." : "SIMPAN PROYEK"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

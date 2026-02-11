"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
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
import {Textarea} from "@/components/ui/textarea";
import {Plus, ChevronDown} from "lucide-react";
import {toast} from "sonner";
import {supabase} from "@/lib/supabase/client";

interface Client {
  id: string;
  email: string;
  full_name: string | null;
  role?: string;
}

interface CreateTicketModalProps {
  userId: string;
  clients?: Client[];
  isAdmin?: boolean;
}

export default function CreateTicketModal({
  userId,
  clients,
  isAdmin,
}: CreateTicketModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const targetUserId = isAdmin ? (formData.get("user_id") as string) : userId;
    const subject = formData.get("subject") as string;
    const description = formData.get("description") as string;

    try {
      const {error} = await supabase.from("tickets").insert([
        {
          user_id: targetUserId,
          subject: subject,
          description: description,
          status: "open",
        },
      ]);

      if (error) throw error;

      toast.success("Tiket berhasil dibuat! 🎉");
      setOpen(false);
      form.reset();
      router.refresh();
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : "Gagal membuat tiket";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-zinc-900 text-white font-medium rounded-xl text-[11px] uppercase tracking-[0.2em] px-6 py-5 shadow-sm hover:bg-zinc-800 transition-all cursor-pointer">
          <Plus className="h-4 w-4 mr-2" />
          Buat Tiket Baru
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-2xl border-none shadow-2xl bg-white">
        <DialogHeader>
          <DialogTitle className=" text-xl tracking-tighter  text-zinc-900">
            Support Ticket
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-500 font-medium italic">
            Jelaskan kendala atau permintaan proyek Anda.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          {isAdmin && clients && (
            <div className="space-y-2 flex flex-col">
              <Label
                htmlFor="user_id"
                className="text-[10px] font-bold uppercase tracking-widest text-zinc-400"
              >
                Pilih Klien
              </Label>
              <div className="relative group">
                <select
                  id="user_id"
                  name="user_id"
                  required
                  defaultValue={userId}
                  className="flex h-11 w-full rounded-xl border border-zinc-100 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-200 transition-all appearance-none cursor-pointer"
                >
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.full_name || client.email}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-zinc-400 pointer-events-none" />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label
              htmlFor="subject"
              className="text-[10px] font-bold uppercase tracking-widest text-zinc-400"
            >
              Subjek
            </Label>
            <Input
              id="subject"
              name="subject"
              placeholder="Cth: Slicing Landing Page"
              required
              className="rounded-xl border-zinc-100 h-11 focus-visible:ring-zinc-200"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-[10px] font-bold uppercase tracking-widest text-zinc-400"
            >
              Deskripsi
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Jelaskan detail kendala Anda..."
              required
              className="rounded-xl border-zinc-100 min-h-[120px] resize-none focus-visible:ring-zinc-200 text-sm"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-900 text-white rounded-xl py-6 font-bold uppercase tracking-widest text-[10px] shadow-lg hover:bg-zinc-800 transition-all cursor-pointer"
            >
              {loading ? "MENGIRIM..." : "KIRIM TIKET"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

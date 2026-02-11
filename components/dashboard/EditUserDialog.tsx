"use client";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: {
    full_name: string;
    email: string;
    company_name: string;
  }) => void;
  userData: {full_name: string; email: string; company_name: string};
  isLoading: boolean;
}

export function EditUserDialog({
  open,
  onOpenChange,
  onConfirm,
  userData,
  isLoading,
}: EditUserDialogProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onConfirm({
      full_name: formData.get("full_name") as string,
      email: formData.get("email") as string,
      company_name: formData.get("company_name") as string,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl bg-white border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-bold text-xl tracking-tight">
            Edit Profil User
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Nama Lengkap
            </Label>
            <Input
              name="full_name"
              defaultValue={userData.full_name}
              className="rounded-xl border-zinc-100"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Email
            </Label>
            <Input
              name="email"
              type="email"
              defaultValue={userData.email}
              className="rounded-xl border-zinc-100"
              required
            />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Perusahaan
            </Label>
            <Input
              name="company_name"
              defaultValue={userData.company_name}
              className="rounded-xl border-zinc-100"
            />
          </div>
          <DialogFooter className="pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-zinc-900 text-white rounded-xl py-6 font-bold uppercase text-[10px] tracking-widest"
            >
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

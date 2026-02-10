"use client";

import {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {updateProfile} from "@/app/actions/profile-actions";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {Loader2} from "lucide-react";

interface ProfileFormProps {
  profile: {
    full_name: string | null;
    company_name: string | null;
    phone: string | null;
    email: string;
  };
}

export function ProfileForm({profile}: ProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);

    if (result.error) {
      toast.error("Gagal memperbarui profil", {
        description: result.error,
      });
    } else {
      toast.success("Profil berhasil diperbarui", {
        description: "Informasi Anda telah disimpan",
      });
      router.refresh();
    }

    setLoading(false);
  };

  return (
    <Card className="border-zinc-100 shadow-sm rounded-2xl overflow-hidden bg-white">
      <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 py-4 px-8">
        <CardTitle className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
          Edit Profil
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="full_name"
              className="text-xs font-medium text-zinc-700"
            >
              Nama Lengkap
            </Label>
            <Input
              id="full_name"
              name="full_name"
              defaultValue={profile.full_name || ""}
              placeholder="Masukkan nama lengkap"
              disabled={loading}
              className="rounded-lg h-11"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="company_name"
              className="text-xs font-medium text-zinc-700"
            >
              Nama Perusahaan
            </Label>
            <Input
              id="company_name"
              name="company_name"
              defaultValue={profile.company_name || ""}
              placeholder="Masukkan nama perusahaan"
              disabled={loading}
              className="rounded-lg h-11"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="phone"
              className="text-xs font-medium text-zinc-700"
            >
              Nomor Telepon
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={profile.phone || ""}
              placeholder="08xxxxxxxxxx"
              disabled={loading}
              className="rounded-lg h-11"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-xs font-medium text-zinc-700"
            >
              Email
            </Label>
            <Input
              id="email"
              value={profile.email}
              disabled
              className="rounded-lg h-11 bg-zinc-50 text-zinc-500"
            />
            <p className="text-xs text-zinc-400 italic">
              Email tidak dapat diubah
            </p>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg h-11 font-medium cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan Perubahan"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

"use client";

import {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {updatePassword} from "@/app/actions/profile-actions";
import {toast} from "sonner";
import {Loader2, Eye, EyeOff} from "lucide-react";

export function PasswordForm() {
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await updatePassword(formData);

    if (result.error) {
      toast.error("Gagal mengubah password", {
        description: result.error,
      });
    } else {
      toast.success("Password berhasil diubah", {
        description: "Silakan gunakan password baru untuk login",
      });
      e.currentTarget.reset();
    }

    setLoading(false);
  };

  return (
    <Card className="border-zinc-100 shadow-sm rounded-2xl overflow-hidden bg-white">
      <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 py-4 px-8">
        <CardTitle className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
          Ubah Password
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label
              htmlFor="current_password"
              className="text-xs font-medium text-zinc-700"
            >
              Password Lama
            </Label>
            <div className="relative">
              <Input
                id="current_password"
                name="current_password"
                type={showCurrentPassword ? "text" : "password"}
                required
                disabled={loading}
                className="rounded-lg h-11 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="new_password"
              className="text-xs font-medium text-zinc-700"
            >
              Password Baru
            </Label>
            <div className="relative">
              <Input
                id="new_password"
                name="new_password"
                type={showNewPassword ? "text" : "password"}
                required
                disabled={loading}
                className="rounded-lg h-11 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-zinc-400 italic">Minimal 6 karakter</p>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="confirm_password"
              className="text-xs font-medium text-zinc-700"
            >
              Konfirmasi Password Baru
            </Label>
            <div className="relative">
              <Input
                id="confirm_password"
                name="confirm_password"
                type={showConfirmPassword ? "text" : "password"}
                required
                disabled={loading}
                className="rounded-lg h-11 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg h-11 font-medium cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mengubah Password...
              </>
            ) : (
              "Ubah Password"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

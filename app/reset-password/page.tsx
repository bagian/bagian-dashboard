"use client";

import {useState} from "react";
import {supabase} from "@/lib/supabase/client";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {Eye, EyeOff} from "lucide-react";
import Image from "next/image";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Password tidak cocok");
      return;
    }

    setLoading(true);
    const {error} = await supabase.auth.updateUser({password});

    if (error) {
      toast.error("Gagal memperbarui password", {description: error.message});
    } else {
      toast.success("Password diperbarui! 🎉", {
        description: "Silakan masuk dengan password baru Anda.",
      });
      router.push("/login");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-white font-sans">
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 overflow-hidden">
        <Image
          src="/img/banner/bn-mcp.png"
          alt="BG"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent z-1" />
        <div className="relative z-10 space-y-8">
          <p className="text-5xl font-bold tracking-tight text-white leading-[1.1]">
            &quot;Set Your New <br /> Secure Password.&quot;
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-[400px] space-y-12">
          <div className="space-y-3">
            <h2 className="text-4xl font-black tracking-tighter text-zinc-900 uppercase">
              New Password
            </h2>
            <p className="text-zinc-400 text-xs font-bold tracking-widest uppercase">
              Ketikkan password baru Anda di bawah ini.
            </p>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
                Password Baru
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full border-b border-zinc-100 py-3 pr-10 text-sm focus:border-zinc-900 focus:outline-none transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-zinc-300 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
                Konfirmasi Password
              </label>
              <input
                type="password"
                required
                className="w-full border-b border-zinc-100 py-3 text-sm focus:border-zinc-900 focus:outline-none transition-all"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-950 py-5 text-[11px] font-bold tracking-[0.4em] text-white transition-all hover:bg-zinc-800 disabled:bg-zinc-200 cursor-pointer uppercase"
            >
              {loading ? "UPDATING..." : "UPDATE PASSWORD"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

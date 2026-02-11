"use client";

import {useEffect, useState} from "react";
import {supabase} from "@/lib/supabase/client";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {Eye, EyeOff, ChevronLeft} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const router = useRouter();

  // Cek validitas token recovery saat halaman dibuka
  useEffect(() => {
    const checkRecoverySession = async () => {
      // 1. Paksa hanya bisa diakses dari link email (ada hash token recovery)
      if (typeof window !== "undefined") {
        const hash = window.location.hash || "";
        const fromRecoveryLink =
          hash.includes("type=recovery") || hash.includes("access_token=");

        // Jika tidak ada parameter recovery di URL, redirect ke forgot-password
        if (!fromRecoveryLink) {
          router.replace("/forgot-password");
          return;
        }
      }

      // 2. Validasi session recovery di Supabase
      const {data, error} = await supabase.auth.getUser();

      if (error || !data.user) {
        // Kemungkinan besar token invalid / expired
        setTokenError(
          "Link reset password sudah tidak valid atau telah kedaluwarsa. Silakan minta link baru.",
        );
        return;
      }
    };

    checkRecoverySession();
  }, [router]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Password tidak cocok");
      return;
    }

    setLoading(true);
    const {error} = await supabase.auth.updateUser({password});

    if (error) {
      const message = error.message.toLowerCase();

      if (message.includes("expired") || message.includes("invalid")) {
        setTokenError(
          "Link reset password ini sudah tidak berlaku. Silakan minta link baru melalui halaman Forgot Password.",
        );
        toast.error("Link reset sudah kadaluarsa", {
          description: "Silakan minta link baru dan coba lagi.",
        });
      } else {
        toast.error("Gagal memperbarui password", {
          description: error.message,
        });
      }
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
      {/* Sisi kiri: sama seperti login */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 overflow-hidden">
        <Image
          src="/img/banner/bn-mcp.png"
          alt="Workspace Background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent z-1" />
        <div className="relative z-10">
          <div className="relative h-10 w-40">
            <Image
              src="/img/logo/bagian-logo.png"
              alt="Bagian Projects Logo"
              fill
              priority
              className="object-contain object-left"
            />
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <p className="text-5xl font-bold tracking-tight text-white leading-[1.1]">
            &quot;Atur Password Baru <br />dan Amankan Akses Anda.&quot;
          </p>
        </div>
      </div>

      {/* Sisi kanan: form reset password */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 bg-white">
        <div className="w-full max-w-[400px] space-y-12">
          <div className="space-y-3">
            <Link
              href="/login"
              className="flex items-center text-xs font-bold text-zinc-400 hover:text-zinc-900 transition-all uppercase tracking-widest gap-1 group pb-10"
            >
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Login</span>
            </Link>
            <h2 className="text-4xl font-black tracking-tighter text-zinc-900">
              Reset Password
            </h2>
            <p className="text-zinc-400 text-xs">
              Masukkan password baru Anda, lalu konfirmasi sekali lagi.
            </p>
          </div>

          {tokenError ? (
            <div className="space-y-6">
              <div className="p-4 border border-red-100 bg-red-50 rounded-xl">
                <p className="text-sm font-semibold text-red-700">
                  Link reset password tidak valid
                </p>
                <p className="text-xs text-red-600 mt-1 leading-relaxed">
                  {tokenError}
                </p>
              </div>
              <Link href="/forgot-password">
                <button className="w-full bg-zinc-950 py-4 text-[11px] font-bold tracking-[0.3em] text-white transition-all hover:bg-zinc-800 uppercase shadow-2xl shadow-zinc-200 cursor-pointer">
                  KIRIM ULANG LINK RESET
                </button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleUpdatePassword} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[11px] uppercase tracking-widest text-zinc-500">
                  Password Baru
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    className="w-full border-b border-zinc-100 py-3 pr-10 text-sm focus:border-zinc-900 focus:outline-none transition-all font-medium"
                    placeholder="Minimal 8 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-zinc-300 hover:text-zinc-900 transition-colors cursor-pointer"
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
                <label className="text-[11px] uppercase tracking-widest text-zinc-500">
                  Konfirmasi Password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  className="w-full border-b border-zinc-100 py-3 text-sm focus:border-zinc-900 focus:outline-none transition-all font-medium"
                  placeholder="Ulangi password baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-zinc-950 py-5 text-[11px] font-bold tracking-[0.4em] text-white transition-all hover:bg-zinc-800 disabled:bg-zinc-200 disabled:cursor-not-allowed uppercase shadow-2xl shadow-zinc-200 cursor-pointer"
              >
                {loading ? "Menyimpan..." : "Simpan Password Baru"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

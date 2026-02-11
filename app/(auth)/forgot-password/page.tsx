"use client";

import {useState} from "react";
import {supabase} from "@/lib/supabase/client";
import Link from "next/link";
import {toast} from "sonner";
import Image from "next/image";
import {ChevronLeft} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const {error} = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/dashboard/reset-password`,
    });

    if (error) {
      toast.error("Gagal mengirim email", {description: error.message});
    } else {
      toast.success("Email terkirim! 📧", {
        description:
          "Silakan cek kotak masuk email Anda untuk instruksi reset.",
      });
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-white font-sans">
      {/* SISI KIRI: VISUAL BRANDING (KONSISTEN DENGAN LOGIN) */}
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
          <div className="relative h-10 w-full">
            <Image
              src="/img/logo/bagian-logo.png"
              alt="Bagian Projects Logo"
              fill
              className="object-contain object-left"
            />
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <p className="text-5xl font-bold tracking-tight text-white leading-[1.1]">
            &quot;Keamanan Akun Anda <br /> Adalah Prioritas Kami.&quot;
          </p>
        </div>
      </div>

      {/* SISI KANAN: FORM RESET */}
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
            <h2 className="text-4xl font-black tracking-tighter text-zinc-900 uppercase">
              Forgot Password
            </h2>
            <p className="text-zinc-400 text-xs  tracking-widest">
              Masukkan email Anda untuk menerima link pemulihan.
            </p>
          </div>
          <form onSubmit={handleResetPassword} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-widest text-zinc-500 font-bold">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full border-b border-zinc-100 py-3 text-sm focus:border-zinc-900 focus:outline-none transition-all placeholder:text-zinc-200 font-medium"
                placeholder="johndoe@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-950 py-5 text-[11px] font-bold tracking-[0.4em] text-white transition-all hover:bg-zinc-800 disabled:bg-zinc-200 disabled:cursor-not-allowed uppercase shadow-2xl shadow-zinc-200 cursor-pointer"
            >
              {loading ? "Mengirim Link..." : "Kirim Link Reset Password"}
            </button>
          </form>
          <div>
            <p className="text-xs text-zinc-400 text-center">
              tidak menerima link? Periksa folder spam atau{" "}
              <Link
                href="/forgot-password"
                className="text-zinc-900 font-bold hover:underline"
              >
                coba lagi
              </Link>
              . Jika masalah berlanjut, hubungi dukungan kami melalui{" "}
              <Link
                href="mailto:bagain.desk@gmail.com"
                className="text-zinc-900 font-bold hover:underline"
              >
                email
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import {useState} from "react";
import {supabase} from "@/lib/supabase/client";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {toast} from "sonner";
import {Eye, EyeOff} from "lucide-react";
import Image from "next/image";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // State untuk visibilitas password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Password tidak cocok!", {
        description: "Pastikan kedua password yang Anda masukkan sama.",
      });
      return;
    }

    if (password.length < 6) {
      toast.error("Password terlalu pendek!", {
        description: "Password minimal harus 6 karakter.",
      });
      return;
    }

    setLoading(true);

    const {data: authData, error: signUpError} = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          company_name: companyName,
        },
      },
    });

    if (signUpError) {
      toast.error("Registrasi gagal!", {
        description: signUpError.message,
      });
      setLoading(false);
      return;
    }

    if (authData.user) {
      const {error: profileError} = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          company_name: companyName,
          role: "user",
        })
        .eq("id", authData.user.id);

      if (profileError) {
        console.error("Profile update error:", profileError);
      }
    }

    toast.success("Registrasi berhasil! 🎉", {
      description: "Silakan login dengan akun Anda.",
    });

    setTimeout(() => {
      router.push("/login");
    }, 1000);
  };

  return (
    <div className="flex min-h-screen bg-white font-sans">
      {/* SISI KIRI: VISUAL BRANDING */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 overflow-hidden">
        {/* Layer 1: Background Image */}
        <Image
          src="/img/banner/bn-mcp.png"
          alt="Workspace Background"
          fill
          priority
          className="object-cover"
        />

        {/* Layer 2: Gradient Fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent z-1" />

        {/* Layer 3: Branding Content */}
        <div className="relative z-10">
          <div className="relative h-10 w-48">
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
            &quot;Kembangkan Bisnis Anda <br /> bersama Bagian Corps.&quot;
          </p>
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full border-2 border-white/50 overflow-hidden relative shadow-2xl">
              <Image
                src="/img/pp/pp_owr.png"
                alt="Gilang Ramadhan"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-lg font-bold text-white">Gilang Ramadhan</p>
              <p className="text-xs text-zinc-300 font-medium  mt-1 tracking-tighter">
                Owner & Founder, Bagian Corps
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SISI KANAN: FORM REGISTER */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 bg-white">
        <div className="w-full max-w-[400px] space-y-10">
          <div className="space-y-3">
            <h2 className="text-4xl font-black tracking-tighter text-zinc-900 uppercase">
              Join Us
            </h2>
            <p className="text-zinc-400 text-xs tracking-widest">
              Daftar sebagai Client Baru Bagian Projects.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-[0.3em] text-zinc-400">
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                className="w-full border-b border-zinc-100 py-3 text-sm focus:border-zinc-900 focus:outline-none transition-all placeholder:text-zinc-200 font-medium"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-[0.3em] text-zinc-400">
                Nama Perusahaan
              </label>
              <input
                type="text"
                required
                className="w-full border-b border-zinc-100 py-3 text-sm focus:border-zinc-900 focus:outline-none transition-all placeholder:text-zinc-200 font-medium"
                placeholder="PT. Contoh Indonesia"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-[0.3em] text-zinc-400">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full border-b border-zinc-100 py-3 text-sm focus:border-zinc-900 focus:outline-none transition-all placeholder:text-zinc-200 font-medium"
                placeholder="nama@perusahaan.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-[0.3em] text-zinc-400">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full border-b border-zinc-100 py-3 pr-10 text-sm focus:border-zinc-900 focus:outline-none transition-all font-medium"
                  placeholder="••••••••"
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
              <label className="text-[11px] uppercase tracking-[0.3em] text-zinc-400">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="w-full border-b border-zinc-100 py-3 pr-10 text-sm focus:border-zinc-900 focus:outline-none transition-all font-medium"
                  placeholder="Ulangi password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-zinc-300 hover:text-zinc-900 transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-950 py-5 text-[11px] font-bold tracking-[0.4em] text-white transition-all hover:bg-zinc-800 disabled:bg-zinc-200 disabled:cursor-not-allowed uppercase shadow-2xl shadow-zinc-200 cursor-pointer"
            >
              {loading ? "MENDAFTAR..." : "DAFTAR SEKARANG"}
            </button>
          </form>

          <div className="pt-8 border-t border-zinc-50">
            <p className="text-center text-[11px] text-zinc-400 font-bold uppercase tracking-widest">
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="text-zinc-950 border-b border-zinc-950 pb-0.5 ml-2cursor-pointer"
              >
                Login di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    fullName: "",
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    const newErrors = {
      fullName: "",
      companyName: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    let hasError = false;

    if (!fullName.trim()) {
      newErrors.fullName = "Nama Lengkap wajib diisi";
      hasError = true;
    }

    if (!companyName.trim()) {
      newErrors.companyName = "Nama Perusahaan wajib diisi";
      hasError = true;
    }

    if (!email.trim()) {
      newErrors.email = "Email wajib diisi";
      hasError = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Format email tidak valid";
        hasError = true;
      }
    }

    if (!password) {
      newErrors.password = "Password wajib diisi";
      hasError = true;
    } else {
      if (password.length < 8) {
        newErrors.password = "Password minimal harus 8 karakter";
        hasError = true;
      } else {
        const strongPasswordRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#^()_\-+=]).{8,}$/;
        if (!strongPasswordRegex.test(password)) {
          newErrors.password = "Password minimal 8 karakter dengan kombinasi huruf besar, huruf kecil, angka, dan simbol";
          hasError = true;
        } else if (password.toLowerCase().includes(email.toLowerCase())) {
          newErrors.password = "Password tidak boleh mengandung email Anda";
          hasError = true;
        }
      }
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi Password wajib diisi";
      hasError = true;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Password tidak cocok";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) {
      return;
    }

    setLoading(true);

    const origin = window.location.origin;

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          company_name: companyName,
        },
        emailRedirectTo: `${origin}/auth/callback?next=/login`,
      },
    });

    if (signUpError) {
      toast.error("Registrasi gagal!", {
        description: signUpError.message,
      });
      setLoading(false);
      return;
    }
    await supabase.auth.signOut();
    setLoading(false);

    router.push("/login?message=register_success");
  };

  return (
    <div className="flex min-h-screen bg-white font-sans">
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 overflow-hidden">
        <Image
          src="/img/banner/bn-mcp.webp"
          alt="Workspace Background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent z-1" />
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
              <p className="text-xs text-zinc-300 font-medium mt-1 tracking-tighter">
                Owner & Founder, Bagian Corps
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 bg-white">
        <div className="w-full max-w-[400px] space-y-10">
          <div className="space-y-3">
            <h2 className="text-4xl font-black tracking-tighter text-zinc-900 uppercase">
              Join Us
            </h2>
            <p className="text-zinc-700 text-xs tracking-widest">
              Daftar sebagai Client Baru Bagian Projects.
            </p>
          </div>

          <form onSubmit={handleRegister} noValidate className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-[0.3em] text-zinc-400 font-bold">
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                className={`w-full border-b py-3 text-sm focus:outline-none transition-all placeholder:text-zinc-200 font-medium 
                bg-transparent 
                [&:-webkit-autofill]:bg-transparent 
                [&:-webkit-autofill]:[-webkit-text-fill-color:#3f3f46] 
                [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_50px_white_inset] 
                dark:[&:-webkit-autofill]:[-webkit-text-fill-color:#3f3f46]
                  ${errors.fullName
                    ? "border-red-500 text-red-900 focus:border-red-500"
                    : "border-zinc-100 text-zinc-700 focus:border-zinc-900"
                  }`}
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) {
                    setErrors((prev) => ({ ...prev, fullName: "" }));
                  }
                }}
              />
              {errors.fullName && (
                <p className="text-red-500 text-[11px] font-semibold tracking-wide mt-1">
                  {errors.fullName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-[0.3em] text-zinc-400 font-bold">
                Nama Perusahaan
              </label>
              <input
                type="text"
                required
                className={`w-full border-b py-3 text-sm focus:outline-none transition-all placeholder:text-zinc-200 font-medium 
                bg-transparent 
                [&:-webkit-autofill]:bg-transparent 
                [&:-webkit-autofill]:[-webkit-text-fill-color:#3f3f46] 
                [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_50px_white_inset] 
                dark:[&:-webkit-autofill]:[-webkit-text-fill-color:#3f3f46]
                  ${errors.companyName
                    ? "border-red-500 text-red-900 focus:border-red-500"
                    : "border-zinc-100 text-zinc-700 focus:border-zinc-900"
                  }`}
                placeholder="PT. Contoh Indonesia"
                value={companyName}
                onChange={(e) => {
                  setCompanyName(e.target.value);
                  if (errors.companyName) {
                    setErrors((prev) => ({ ...prev, companyName: "" }));
                  }
                }}
              />
              {errors.companyName && (
                <p className="text-red-500 text-[11px] font-semibold tracking-wide mt-1">
                  {errors.companyName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-[0.3em] text-zinc-400 font-bold">
                Email Address
              </label>
              <input
                type="email"
                required
                className={`w-full border-b py-3 text-sm focus:outline-none transition-all placeholder:text-zinc-200 font-medium 
                bg-transparent 
                [&:-webkit-autofill]:bg-transparent 
                [&:-webkit-autofill]:[-webkit-text-fill-color:#3f3f46] 
                [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_50px_white_inset] 
                dark:[&:-webkit-autofill]:[-webkit-text-fill-color:#3f3f46]
                  ${errors.email
                    ? "border-red-500 text-red-900 focus:border-red-500"
                    : "border-zinc-100 text-zinc-700 focus:border-zinc-900"
                  }`}
                placeholder="nama@perusahaan.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }
                }}
              />
              {errors.email && (
                <p className="text-red-500 text-[11px] font-semibold tracking-wide mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-[0.3em] text-zinc-400 font-bold">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className={`w-full border-b py-3 pr-10 text-sm focus:outline-none transition-all font-medium
                  bg-transparent 
                  [&:-webkit-autofill]:bg-transparent 
                  [&:-webkit-autofill]:[-webkit-text-fill-color:#3f3f46] 
                  [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_50px_white_inset] 
                  dark:[&:-webkit-autofill]:[-webkit-text-fill-color:#3f3f46] ${errors.password
                      ? "border-red-500 text-red-900 focus:border-red-500"
                      : "border-zinc-100 text-zinc-700 focus:border-zinc-900"
                    }`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors((prev) => ({ ...prev, password: "" }));
                    }
                  }}
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
              {errors.password && (
                <p className="text-red-500 text-[11px] font-semibold tracking-wide mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-[0.3em] text-zinc-400 font-bold">
                Konfirmasi Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className={`w-full border-b py-3 pr-10 text-sm focus:outline-none transition-all font-medium 
                  bg-transparent 
                  [&:-webkit-autofill]:bg-transparent 
                  [&:-webkit-autofill]:[-webkit-text-fill-color:#3f3f46] 
                  [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_50px_white_inset] 
                  dark:[&:-webkit-autofill]:[-webkit-text-fill-color:#3f3f46]
                    ${errors.confirmPassword
                      ? "border-red-500 text-red-900 focus:border-red-500"
                      : "border-zinc-100 text-zinc-700 focus:border-zinc-900"
                    }`}
                  placeholder="Ulangi password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) {
                      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                    }
                  }}
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
              {errors.confirmPassword && (
                <p className="text-red-500 text-[11px] font-semibold tracking-wide mt-1">
                  {errors.confirmPassword}
                </p>
              )}
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
                className="text-zinc-950 border-b border-zinc-950 pb-0.5 ml-2 cursor-pointer"
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

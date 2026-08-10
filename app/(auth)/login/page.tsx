"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  // Initialize state directly from localStorage to avoid synchronous setState in useEffect
  const [email, setEmail] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("rememberedEmail") || "";
    }
    return "";
  });
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("rememberedEmail");
    }
    return false;
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    // Reset errors
    const newErrors = {
      email: "",
      password: "",
    };

    let hasError = false;

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
    }

    setErrors(newErrors);

    if (hasError) {
      return;
    }

    setLoading(true);

    // 2. Logika Simpan: Simpan email jika checkbox dicentang, hapus jika tidak
    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      let customError = error.message;
      if (error.message === "Invalid login credentials") {
        customError = "Email atau password salah. Silakan coba lagi.";
      }
      setLoginError(customError);
      toast.error("Login gagal!", { description: customError });
      setLoading(false);
    } else {
      toast.success("Login berhasil!", {
        description: "Mengalihkan ke dashboard...",
      });
      setTimeout(() => {
        window.location.href = "/customer";
      }, 500);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get("message");
    const error = urlParams.get("error");

    if (message === "register_success") {
      toast.success("Akun berhasil dibuat!", {
        id: "register-success-toast",
        description: "Silakan login dengan email dan password Anda.",
      });
    }

    if (message === "account_confirmed") {
      toast.success("Email berhasil dikonfirmasi!", {
        description: "Silakan login dengan akun Anda.",
      });
    }

    if (error) {
      toast.error("Terjadi kesalahan", {
        description: error,
      });
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-white dark:bg-zinc-950 font-sans">
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
          <div className="relative h-10 w-40">
            <Image
              src="/img/logo/bagian-logo.png"
              alt="Bagian Projects Logo"
              fill
              priority
              quality={100}
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

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-12 bg-white dark:bg-zinc-950">
        <div className="w-full max-w-[400px] space-y-12">
          <div className="space-y-3">
            <h2 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100">
              Welcome Back !
            </h2>
            <p className="text-zinc-400 text-xs">
              Akses dashboard client area Anda sekarang.
            </p>
          </div>

          <form onSubmit={handleLogin} noValidate className="space-y-8">
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-widest text-zinc-500 font-bold dark:text-zinc-400">
                Email Address
              </label>
              <input
                type="email"
                required
                className={`w-full border-b border-zinc-100 py-3 px-1 text-sm text-zinc-700 focus:border-zinc-900 focus:outline-none transition-all placeholder:text-zinc-200 font-medium 
                bg-transparent autofill:bg-transparent [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s] 
 ${errors.email || loginError
                    ? "border-red-500 text-red-900 focus:border-red-500"
                    : "border-zinc-100 text-zinc-700 focus:border-zinc-900 dark:border-zinc-700 dark:text-zinc-100 dark:focus:border-zinc-300"
                  }`}
                placeholder="johndoe@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }
                  if (loginError) {
                    setLoginError("");
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
              <div className="flex items-center justify-between">
                <label className="text-[11px] uppercase tracking-widest text-zinc-500 font-bold dark:text-zinc-400">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[12px] text-zinc-900 dark:text-zinc-100 dark:text-zinc-100 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className={`w-full border-b py-3 pr-10 pl-1 text-sm focus:outline-none transition-all font-medium 
                  bg-transparent autofill:bg-transparent [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:#3f3f46] dark:[&:-webkit-autofill]:[-webkit-text-fill-color:#f4f4f5] ${errors.password || loginError
                      ? "border-red-500 text-red-900 focus:border-red-500"
                      : "border-zinc-100 text-zinc-700 focus:border-zinc-900 dark:border-zinc-700 dark:text-zinc-100 dark:focus:border-zinc-300"
                    }`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors((prev) => ({ ...prev, password: "" }));
                    }
                    if (loginError) {
                      setLoginError("");
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-zinc-300 hover:text-zinc-900 dark:text-zinc-100 transition-colors cursor-pointer"
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

            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-200 text-zinc-950 focus:ring-zinc-950 cursor-pointer"
              />
              <label
                htmlFor="remember"
                className="text-[12px]  text-zinc-900 dark:text-zinc-100 tracking-wider cursor-pointer"
              >
                Remember sign in details
              </label>
            </div>

            {loginError && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-center text-xs font-semibold tracking-wide uppercase italic">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-950 py-5 text-[11px] font-bold tracking-[0.4em] text-white transition-all hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-300 disabled:bg-zinc-200 disabled:cursor-not-allowed uppercase shadow-2xl shadow-zinc-200 dark:shadow-none cursor-pointer"
            >
              {loading ? "Authenticating..." : "Sign In Now"}
            </button>
          </form>

          <div className="pt-8 border-t border-zinc-50">
            <p className="text-center text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
              Belum memiliki akun?{" "}
              <Link
                href="/register"
                className="text-zinc-950 dark:text-zinc-100 border-b border-zinc-950 dark:border-zinc-100 pb-0.5 ml-2 transition-all cursor-pointer"
              >
                Daftar Sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

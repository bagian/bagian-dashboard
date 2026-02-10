"use client";

import {useState} from "react";
import {supabase} from "@/lib/supabase/client";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {toast} from "sonner";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
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

    // 1. Sign up user
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

    // 2. Update profile dengan data lengkap
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
    <div className="flex min-h-screen items-center justify-center bg-white px-6 py-12">
      <div className="w-full max-w-[400px] space-y-8">
        {/* Logo / Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tighter">
            BAGIAN PROJECTS
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Daftar sebagai Client Baru
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Nama Lengkap
            </label>
            <input
              type="text"
              required
              className="mt-1 w-full border-b border-gray-200 py-2 text-sm focus:border-black focus:outline-none transition-colors"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Nama Perusahaan
            </label>
            <input
              type="text"
              required
              className="mt-1 w-full border-b border-gray-200 py-2 text-sm focus:border-black focus:outline-none transition-colors"
              placeholder="PT. Contoh Indonesia"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Email
            </label>
            <input
              type="email"
              required
              className="mt-1 w-full border-b border-gray-200 py-2 text-sm focus:border-black focus:outline-none transition-colors"
              placeholder="nama@perusahaan.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Password
            </label>
            <input
              type="password"
              required
              className="mt-1 w-full border-b border-gray-200 py-2 text-sm focus:border-black focus:outline-none transition-colors"
              placeholder="Min. 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Konfirmasi Password
            </label>
            <input
              type="password"
              required
              className="mt-1 w-full border-b border-gray-200 py-2 text-sm focus:border-black focus:outline-none transition-colors"
              placeholder="Ulangi password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black py-3 text-sm font-medium text-white transition-all hover:bg-zinc-800 disabled:bg-gray-400 disabled:cursor-not-allowed mt-6"
          >
            {loading ? "MENDAFTAR..." : "DAFTAR SEKARANG"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-black underline cursor-pointer">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}

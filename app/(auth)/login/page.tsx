"use client";

import {useState} from "react";
import {supabase} from "@/lib/supabase/client";
import {useRouter} from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const {error} = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      // Gunakan window.location.href agar browser melakukan full reload
      // untuk memastikan cookie terbaca sempurna oleh middleware/server
      window.location.href = "/customer";
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="w-full max-w-[350px] space-y-8">
        {/* Logo / Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tighter">
            BAGIAN PROJECTS
          </h1>
          <p className="text-sm text-gray-500 mt-2">Masuk ke Client Area</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-gray-400">
              Email
            </label>
            <input
              type="email"
              required
              className="mt-1 w-full border-b border-gray-200 py-2 text-sm focus:border-black focus:outline-none transition-colors"
              placeholder="nama@email.com"
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
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black py-3 text-sm font-medium text-white transition-all hover:bg-zinc-800 disabled:bg-gray-400"
          >
            {loading ? "AUTHENTICATING..." : "SIGN IN"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400">
          Belum punya akun?{" "}
          <span className="text-black cursor-pointer underline">
            Hubungi Admin
          </span>
        </p>
      </div>
    </div>
  );
}

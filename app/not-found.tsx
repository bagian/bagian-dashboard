"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white px-6">
      <div className="max-w-md text-center space-y-6">
        <p className="text-[25px] lg:text-9xl font-semibold tracking-[0.3em] uppercase text-zinc-500">
          404
        </p>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">
          Halaman tidak ditemukan
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Maaf, halaman yang Anda cari tidak tersedia atau sudah dipindahkan.
          Coba kembali ke halaman login atau dashboard utama.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 bg-white text-zinc-950 text-xs font-bold tracking-[0.25em] uppercase rounded-full hover:bg-zinc-100 transition-colors"
          >
            Kembali ke Login
          </Link>
          <Link
            href="/customer"
            className="px-6 py-3 border border-zinc-700 text-xs font-bold tracking-[0.25em] uppercase rounded-full hover:bg-zinc-900 transition-colors"
          >
            Buka Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

import { createSupabaseServer } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  const next = "/login";

  if (code) {
    const supabase = await createSupabaseServer();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // ✅ PERBAIKAN KRUSIAL 2:
      // User sudah terverifikasi emailnya dan otomatis mendapat session.
      // Kita hapus session tersebut agar mereka HARUS memasukkan password di halaman /login
      await supabase.auth.signOut();

      return NextResponse.redirect(
        `${origin}${next}?message=account_confirmed`
      );
    }
  }

  // Jika gagal, kembali ke login dengan error
  return NextResponse.redirect(
    `${origin}/login?error=Could not authenticate user`
  );
}

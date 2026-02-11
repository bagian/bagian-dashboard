import {createSupabaseServer} from "@/lib/supabase/server"; // Ubah nama import di sini
import {NextResponse} from "next/server";

export async function GET(request: Request) {
  const {searchParams, origin} = new URL(request.url);
  const code = searchParams.get("code");
  // Arahkan ke /customer sesuai dengan flow dashboard kamu
  const next = searchParams.get("next") ?? "/customer";

  if (code) {
    const supabase = await createSupabaseServer(); // Gunakan fungsi yang benar
    const {error} = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // User sekarang punya sesi aktif dan diarahkan ke halaman reset password
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Jika gagal, arahkan kembali ke login dengan pesan error
  return NextResponse.redirect(
    `${origin}/login?error=Could not authenticate user`,
  );
}

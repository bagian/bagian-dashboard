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
      await supabase.auth.signOut();

      return NextResponse.redirect(
        `${origin}${next}?message=account_confirmed`,
      );
    }
  }
  return NextResponse.redirect(
    `${origin}/login?error=Could not authenticate user`,
  );
}

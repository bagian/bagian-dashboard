import {NextResponse} from "next/server";
import {supabaseAdmin} from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const {email} = await request.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json(
      {exists: false, error: "Email is required"},
      {status: 400},
    );
  }

  const {data, error} = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      {exists: false, error: error.message},
      {status: 500},
    );
  }

  return NextResponse.json({exists: !!data});
}


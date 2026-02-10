import {createSupabaseServer} from "@/lib/supabase/server";
import {AlternativeDashboard} from "@/components/dashboard/main-content";

export default async function Page() {
  const supabase = await createSupabaseServer();

  // Mengambil data user langsung dari sesi autentikasi Supabase
  const {
    data: {user},
  } = await supabase.auth.getUser();

  // Mengambil data tambahan dari tabel profiles
  const {data: profile} = await supabase
    .from("profiles")
    .select("email, role")
    .eq("id", user?.id)
    .single();

  return <AlternativeDashboard profile={profile} userAuth={user} />;
}

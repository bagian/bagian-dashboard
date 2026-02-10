import {Sidebar} from "@/components/dashboard/sidebar"; // Sesuaikan path-nya
import {createSupabaseServer} from "@/lib/supabase/server";
import {redirect} from "next/navigation";
import {Topbar} from "@/components/dashboard/topbar";
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServer();
  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Ambil role user (asumsi role ada di tabel profiles)
  const {data: profile} = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role || "admin";

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      <aside className="hidden md:block h-full">
        <Sidebar role={profile?.role} />
      </aside>
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar user={user} profile={profile} />
        <main className="flex-1 overflow-y-auto bg-zinc-50/50 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

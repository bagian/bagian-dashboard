import { Sidebar } from "@/components/dashboard/SidebarComp";
import { createSupabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Topbar } from "@/components/dashboard/TopbarComp";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, email")
    .eq("id", user.id)
    .single();

  // Debugging - hapus setelah selesai
  // console.log("Layout - User ID:", user.id);
  // console.log("Layout - Profile:", profile);
  // console.log("Layout - Role:", profile?.role);

  // Pastikan role selalu ada nilainya
  const userRole = profile?.role || "customer";

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      <aside className="hidden md:block h-full">
        {/* Kirim role sebagai string yang pasti ada nilainya */}
        <Sidebar role={userRole} />
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

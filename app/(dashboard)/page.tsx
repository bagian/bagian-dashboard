import {redirect} from "next/navigation";
import {createSupabaseServer} from "@/lib/supabase/server";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServer();
  const {data, error} = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }
  return (
    <div className="min-h-screen">
      <main>{children}</main>
    </div>
  );
}

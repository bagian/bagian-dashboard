import {createSupabaseServer} from "@/lib/supabase/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {UserActions} from "@/components/dashboard/UserActions";
import {redirect} from "next/navigation";

export const dynamic = "force-dynamic";

export default async function UsersManagementPage() {
  const supabase = await createSupabaseServer();
  const {
    data: {user},
  } = await supabase.auth.getUser();

  const {data: myProfile} = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single();
  const isAdmin =
    myProfile?.role === "admin" ||
    myProfile?.role === "superadmin" ||
    user?.email === "gilang@bagian.web.id";

  if (!isAdmin) redirect("/customer/dashboard");

  const {data: allUsers} = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", {ascending: false});

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold uppercase italic">User Management</h1>
        <p className="text-xs text-zinc-400 italic font-medium text-zinc-400">
          Kelola akses dan role pengguna Bagian Projects.
        </p>
      </div>

      <Card className="border-zinc-100 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 py-4 px-8">
          <CardTitle className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400 pt-4">
            Daftar Pengguna
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50/30">
                <TableHead className="pl-8 text-[10px] uppercase font-bold text-zinc-500 h-12">
                  Nama / Email
                </TableHead>
                <TableHead className="text-[10px] uppercase font-bold text-zinc-500">
                  Perusahaan
                </TableHead>
                <TableHead className="text-[10px] uppercase font-bold text-zinc-500">
                  Role
                </TableHead>
                <TableHead className="pr-8 text-right text-[10px] uppercase font-bold text-zinc-500">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allUsers?.map((u) => (
                <TableRow
                  key={u.id}
                  className="border-zinc-50 hover:bg-zinc-50/50 transition-all"
                >
                  <TableCell className="pl-8 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-zinc-900">
                        {u.full_name || "No Name"}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono italic">
                        {u.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-zinc-500 font-medium">
                    {u.company_name || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`rounded-full px-3 text-[9px] font-bold uppercase border-none shadow-none ${
                        u.role === "admin" || u.role === "superadmin"
                          ? "bg-zinc-900 text-white"
                          : "bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-8 text-right">
                    {u.id !== user?.id && (
                      <UserActions
                        userId={u.id}
                        currentRole={u.role}
                        userName={u.full_name}
                        userEmail={u.email}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

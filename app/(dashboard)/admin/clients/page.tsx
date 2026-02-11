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
import {Users, Mail, Building2} from "lucide-react";
import {redirect} from "next/navigation";
import {UserActions} from "@/components/dashboard/UserActions";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const supabase = await createSupabaseServer();
  const {
    data: {user},
  } = await supabase.auth.getUser();

  // 1. Proteksi Halaman (Hanya Admin/Superadmin)
  const {data: profile} = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single();

  const isAdmin =
    profile?.role === "admin" ||
    profile?.role === "superadmin" ||
    user?.email === "gilang@bagian.web.id";
  if (!isAdmin) redirect("/customer");

  // 2. Ambil data user yang memiliki role 'client' atau 'user'
  const {data: clients} = await supabase
    .from("profiles")
    .select("*")
    .neq("role", "admin")
    .neq("role", "superadmin")
    .order("created_at", {ascending: false});

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase italic">
          Daftar Klien
        </h1>
        <p className="text-sm text-zinc-400 font-medium italic">
          Kelola informasi dan akses semua klien Bagian Projects.
        </p>
      </header>

      {/* Stats Mini */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-zinc-100 shadow-sm rounded-2xl p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-zinc-900 flex items-center justify-center">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Total Klien
            </p>
            <p className="text-2xl font-bold text-zinc-900">
              {clients?.length || 0}
            </p>
          </div>
        </Card>
      </div>

      <Card className="border-zinc-100 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 py-4 px-6">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-zinc-400" />
            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
              Database Klien Aktif
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-zinc-50 bg-zinc-50/30">
                <TableHead className="pl-8 text-[10px] uppercase font-bold text-zinc-500 h-12">
                  Nama & Email
                </TableHead>
                <TableHead className="text-[10px] uppercase font-bold text-zinc-500">
                  Perusahaan
                </TableHead>
                <TableHead className="text-[10px] uppercase font-bold text-zinc-500">
                  Status
                </TableHead>
                <TableHead className="pr-8 text-right text-[10px] uppercase font-bold text-zinc-500">
                  Kelola
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-48 text-center italic text-zinc-400 text-sm"
                  >
                    Belum ada klien yang terdaftar.
                  </TableCell>
                </TableRow>
              ) : (
                clients?.map((client) => (
                  <TableRow
                    key={client.id}
                    className="border-zinc-50 hover:bg-zinc-50/50 transition-all"
                  >
                    <TableCell className="pl-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-zinc-900">
                          {client.full_name || "Tanpa Nama"}
                        </span>
                        <div className="flex items-center gap-1 text-zinc-400">
                          <Mail className="h-3 w-3" />
                          <span className="text-[10px] font-mono italic">
                            {client.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-zinc-500 font-medium">
                      {client.company_name || "Personal"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="rounded-full px-3 text-[9px] font-bold uppercase bg-zinc-50 text-zinc-500 border-none"
                      >
                        {client.role || "Client"}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-8 text-right">
                      {/* Reuse UserActions untuk Promote/Delete */}
                      <UserActions
                        userId={client.id}
                        currentRole={client.role}
                        userName={client.full_name}
                        userEmail={client.email}
                        companyName={client.company_name}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

import {createSupabaseServer} from "@/lib/supabase/server";
import {supabaseAdmin} from "@/lib/supabase/admin";
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
import {Receipt} from "lucide-react";
import {cn} from "@/lib/utils";
import {CreateInvoiceModal} from "@/components/dashboard/CreateInvoiceModal";

// KUNCI PERUBAHAN: Import GlobalActions alih-alih InvoiceActions
import {GlobalActions} from "@/components/dashboard/GlobalActions";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  const supabase = await createSupabaseServer();
  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="p-8 text-center font-medium">Silahkan login kembali.</div>
    );
  }

  // 1. Ambil Data menggunakan supabaseAdmin untuk bypass RLS
  const [profilesRes, invoicesRes] = await Promise.all([
    supabaseAdmin.from("profiles").select("id, email, role"),
    supabaseAdmin
      .from("invoices")
      .select("*")
      .order("created_at", {ascending: false}),
  ]);

  const allProfiles = profilesRes.data || [];
  const allInvoices = invoicesRes.data || [];

  console.log("Profiles count:", allProfiles.length);
  console.log("Invoices count:", allInvoices.length);

  // 2. Cek Role & Jaring Pengaman Tombol
  const myProfile = allProfiles.find((p) => p.id === user.id);
  const userRole = myProfile?.role?.toLowerCase() || "";

  console.log("Current user role:", userRole);
  console.log("Current user email:", user.email);

  // TOMBOL TETAP ADA jika role admin/superadmin ATAU email cocok
  const isManagementEmail =
    user.email === "superadmin@bagian.web.id" ||
    user.email === "admin@bagian.web.id" ||
    user.email === "gilang@bagian.web.id";
  const hasManagementAccess =
    userRole === "admin" || userRole === "superadmin" || isManagementEmail;

  console.log("Has management access:", hasManagementAccess);

  // 3. Gabungkan Data (Join Manual) agar Email Klien muncul
  const displayData = allInvoices.map((inv) => ({
    ...inv,
    client_email:
      allProfiles.find((p) => p.id === inv.client_id)?.email ||
      "Email Tidak Ditemukan",
  }));

  // Filter: Admin lihat semua, Client lihat miliknya saja
  const finalData = hasManagementAccess
    ? displayData
    : displayData.filter((i) => i.client_id === user.id);

  console.log("Final data count:", finalData.length);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase italic">
            Invoices
          </h1>
          <p className="text-sm text-zinc-400 font-medium italic">
            {hasManagementAccess
              ? `Management Console (${userRole || "Admin"})`
              : "Ringkasan tagihan proyek Anda."}
          </p>
        </div>

        {/* TOMBOL UTAMA: Dipaksa muncul untuk Management */}
        {hasManagementAccess && <CreateInvoiceModal clients={allProfiles} />}
      </header>

      <Card className="border-zinc-100 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 py-4 px-6">
          <div className="flex items-center gap-2 pt-4">
            <Receipt className="h-4 w-4 text-zinc-400" />
            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
              Riwayat Tagihan {hasManagementAccess && "Semua Klien"}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-zinc-50 bg-zinc-50/30">
                <TableHead className="pl-8 text-[10px] uppercase font-bold text-zinc-500 h-12">
                  No. Invoice
                </TableHead>
                {hasManagementAccess && (
                  <TableHead className="text-[10px] uppercase font-bold text-zinc-500">
                    Klien
                  </TableHead>
                )}
                <TableHead className="text-[10px] uppercase font-bold text-zinc-500">
                  Status
                </TableHead>
                <TableHead className="text-right text-[10px] uppercase font-bold text-zinc-500">
                  Jumlah
                </TableHead>
                {hasManagementAccess && (
                  <TableHead className="pr-8 text-right text-[10px] uppercase font-bold text-zinc-500 h-12">
                    Aksi
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {finalData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={hasManagementAccess ? 5 : 3}
                    className="h-48 text-center italic text-zinc-400 text-sm"
                  >
                    Data masih kosong. Silahkan buat tagihan baru.
                  </TableCell>
                </TableRow>
              ) : (
                finalData.map((inv) => (
                  <TableRow
                    key={inv.id}
                    className="border-zinc-50 hover:bg-zinc-50/50 transition-all"
                  >
                    <TableCell className="pl-8 font-bold text-zinc-900 py-5">
                      {inv.invoice_number}
                    </TableCell>
                    {hasManagementAccess && (
                      <TableCell className="text-xs text-zinc-500 font-medium">
                        {inv.client_email}
                      </TableCell>
                    )}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-full px-3 text-[9px] font-bold uppercase border-none shadow-none",
                          inv.status === "paid"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-orange-50 text-orange-600",
                        )}
                      >
                        {inv.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold text-zinc-900 tabular-nums">
                      Rp {new Intl.NumberFormat("id-ID").format(inv.amount)}
                    </TableCell>
                    {hasManagementAccess && (
                      <TableCell className="pr-8 text-right">
                        {/* KUNCI PERUBAHAN: Pemanggilan komponen GlobalActions */}
                        <GlobalActions
                          id={inv.id}
                          status={inv.status}
                          type="invoice"
                          tableName="invoices"
                        />
                      </TableCell>
                    )}
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

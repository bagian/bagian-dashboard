import { createSupabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Receipt, Calendar, DollarSign, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateInvoiceModal } from "@/components/dashboard/CreateInvoiceModal";
import { GlobalActions } from "@/components/dashboard/GlobalActions";
import Link from "next/link";

export const revalidate = 0;
export const dynamic = "force-dynamic";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface Profile {
  email: string;
  full_name: string | null;
}

interface Invoice {
  id: string;
  invoice_number: string;
  client_id: string;
  amount: number;
  status: string;
  created_at: string;
  due_date: string | null;
  notes: string | null;
  tax_percentage: number | null;
  discount: number | null;
  profiles: Profile | null;
  invoice_items: InvoiceItem[];
}

interface DisplayInvoice extends Invoice {
  client_email: string;
  client_name: string;
  items_count: number;
}

export default async function InvoicesPage() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="p-8 text-center font-medium">Silahkan login kembali.</div>
    );
  }

  const [profilesRes, invoicesRes] = await Promise.all([
    supabaseAdmin.from("profiles").select("id, email, full_name, role"),
    supabaseAdmin
      .from("invoices")
      .select(
        `
      *,
      profiles!client_id (
        email,
        full_name
      ),
      invoice_items (*)
    `,
      )
      .order("created_at", { ascending: false }),
  ]);

  const allProfiles = profilesRes.data || [];
  const allInvoices = (invoicesRes.data || []) as Invoice[];

  const myProfile = allProfiles.find((p) => p.id === user.id);
  const userRole = myProfile?.role?.toLowerCase() || "";

  const isManagementEmail =
    user.email === "superadmin@bagian.web.id" ||
    user.email === "admin@bagian.web.id";

  const hasManagementAccess =
    userRole === "admin" || userRole === "superadmin" || isManagementEmail;

  const displayData: DisplayInvoice[] = allInvoices.map((inv) => {
    const profile = allProfiles.find((p) => p.id === inv.client_id);
    return {
      ...inv,
      client_email: profile?.email || "Email Tidak Ditemukan",
      client_name: profile?.full_name || "Nama Tidak Tersedia",
      items_count: inv.invoice_items?.length || 0,
    };
  });

  const finalData = hasManagementAccess
    ? displayData
    : displayData.filter((i) => i.client_id === user.id);

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-8 space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 uppercase">
            Invoices
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {hasManagementAccess
              ? `Management Console (${userRole || "Admin"})`
              : "Ringkasan tagihan proyek Anda."}
          </p>
        </div>

        {hasManagementAccess && <CreateInvoiceModal clients={allProfiles} />}
      </header>

      {/* Desktop View - Table */}
      <Card className="border-zinc-100 dark:border-zinc-800 shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-zinc-950 hidden lg:block">
        <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800 py-4 px-6">
          <div className="flex items-center gap-2 pt-4">
            <Receipt className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">
              Riwayat Tagihan {hasManagementAccess && "Semua Klien"}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/20">
                <TableHead className="pl-8 text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-450 h-12">
                  No. Invoice
                </TableHead>
                {hasManagementAccess && (
                  <TableHead className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-455">
                    Klien
                  </TableHead>
                )}
                <TableHead className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-455">
                  Tanggal
                </TableHead>
                <TableHead className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-455">
                  Jatuh Tempo
                </TableHead>
                <TableHead className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-455">
                  Item
                </TableHead>
                <TableHead className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-455">
                  Status
                </TableHead>
                <TableHead className="text-right text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-455">
                  Jumlah
                </TableHead>
                {hasManagementAccess && (
                  <TableHead className="pr-8 text-right text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-455 h-12">
                    Aksi
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {finalData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={hasManagementAccess ? 8 : 6}
                    className="h-48 text-center italic text-zinc-400 dark:text-zinc-550 text-sm"
                  >
                    Data masih kosong. Invoice Anda akan muncul di sini.
                  </TableCell>
                </TableRow>
              ) : (
                finalData.map((inv) => (
                  <TableRow
                    key={inv.id}
                    className="border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-all"
                  >
                    <TableCell className="pl-8 font-bold text-zinc-900 dark:text-zinc-100 py-5">
                      <Link
                        href={`/customer/invoices/${inv.id}`}
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {inv.invoice_number}
                      </Link>
                    </TableCell>
                    {hasManagementAccess && (
                      <TableCell className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                        <div className="flex flex-col">
                          <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                            {inv.client_name}
                          </span>
                          <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                            {inv.client_email}
                          </span>
                        </div>
                      </TableCell>
                    )}
                    <TableCell className="text-xs text-zinc-650 dark:text-zinc-400 font-medium">
                      {new Date(inv.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-xs text-zinc-650 dark:text-zinc-400 font-medium">
                      {inv.due_date
                        ? new Date(inv.due_date).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "-"}
                    </TableCell>
                    <TableCell className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                      <Badge
                        variant="outline"
                        className="rounded-full px-2 py-0.5 text-[9px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700"
                      >
                        {inv.items_count} item
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-full px-3 text-[9px] font-bold uppercase border-none shadow-none",
                          inv.status === "paid"
                            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                            : inv.status === "unpaid"
                              ? "bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400"
                              : "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400",
                        )}
                      >
                        {inv.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                      Rp {new Intl.NumberFormat("id-ID").format(inv.amount)}
                    </TableCell>
                    {hasManagementAccess && (
                      <TableCell className="pr-8 text-right">
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

      {/* Mobile & Tablet View - Cards */}
      <div className="lg:hidden space-y-4">
        {finalData.length === 0 ? (
          <Card className="border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <CardContent className="p-12 text-center">
              <Receipt className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
              <p className="text-sm italic text-zinc-400 dark:text-zinc-550">
                Data masih kosong. Silahkan buat tagihan baru.
              </p>
            </CardContent>
          </Card>
        ) : (
          finalData.map((inv) => (
            <Card
              key={inv.id}
              className="border-zinc-100 dark:border-zinc-800 shadow-sm rounded-2xl bg-white dark:bg-zinc-950 overflow-hidden hover:shadow-md transition-shadow"
            >
              <Link href={`/customer/invoices/${inv.id}/print`}>
                <CardContent className="p-5 space-y-4">
                  {/* Header: Invoice Number & Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1">
                        Invoice
                      </p>
                      <p className="font-black text-zinc-900 dark:text-zinc-100 text-base truncate">
                        {inv.invoice_number}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "rounded-full px-3 py-1 text-[9px] font-bold uppercase border-none shadow-none shrink-0",
                        inv.status === "paid"
                          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                          : inv.status === "unpaid"
                            ? "bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400"
                            : "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400",
                      )}
                    >
                      {inv.status}
                    </Badge>
                  </div>

                  {/* Client Info - Only for Management */}
                  {hasManagementAccess && (
                    <div className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
                      <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">
                        Klien
                      </p>
                      <p className="font-semibold text-zinc-700 dark:text-zinc-300 text-sm">
                        {inv.client_name}
                      </p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                        {inv.client_email}
                      </p>
                    </div>
                  )}

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Date */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <Calendar className="h-3 w-3 text-zinc-400 dark:text-zinc-500" />
                        <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                          Tanggal
                        </p>
                      </div>
                      <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        {new Date(inv.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    {/* Due Date */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <Calendar className="h-3 w-3 text-zinc-400 dark:text-zinc-500" />
                        <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                          Jatuh Tempo
                        </p>
                      </div>
                      <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        {inv.due_date
                          ? new Date(inv.due_date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "-"}
                      </p>
                    </div>

                    {/* Items */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <Package className="h-3 w-3 text-zinc-400 dark:text-zinc-550" />
                        <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                          Item
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="rounded-full px-2 py-0.5 text-[9px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-450 border-zinc-200 dark:border-zinc-750"
                      >
                        {inv.items_count} item
                      </Badge>
                    </div>

                    {/* Amount */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <DollarSign className="h-3 w-3 text-zinc-400 dark:text-zinc-550" />
                        <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                          Jumlah
                        </p>
                      </div>
                      <p className="text-sm font-black text-zinc-900 dark:text-zinc-100 tabular-nums">
                        Rp {new Intl.NumberFormat("id-ID").format(inv.amount)}
                      </p>
                    </div>
                  </div>

                  {/* Actions - Only for Management */}
                  {hasManagementAccess && (
                    <div className="p-2 flex justify-end bg-zinc-50/50 dark:bg-zinc-900/50 rounded-md border border-zinc-100 dark:border-zinc-800">
                      <div>
                        <span className="text-[12px] uppercase font-semibold text-zinc-700 dark:text-zinc-300">
                          Aksi
                        </span>
                      </div>
                      <GlobalActions
                        id={inv.id}
                        status={inv.status}
                        type="invoice"
                        tableName="invoices"
                      />
                    </div>
                  )}
                </CardContent>
              </Link>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

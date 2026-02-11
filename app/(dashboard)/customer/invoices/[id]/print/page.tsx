import {createSupabaseServer} from "@/lib/supabase/server";
import {supabaseAdmin} from "@/lib/supabase/admin";
import InvoiceCetak from "@/app/(dashboard)/customer/invoices/InvoiceCetak"; // Pastikan path ini benar

export const dynamic = "force-dynamic";
export const revalidate = 0;

// 1. Sesuaikan interface params untuk Next.js 15+ (harus Promise)
interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function InvoiceDetailPage({params}: PageProps) {
  // 2. Wajib di-await untuk mengambil ID-nya
  const {id} = await params;

  // 3. Pencegahan agar tidak hit database jika ID-nya "undefined"
  if (!id || id === "undefined") {
    return (
      <div className="p-8 text-center text-red-500 font-bold">
        <h1>Error: URL Tidak Valid</h1>
        <p>URL saat ini mengarah ke ID &quot;ndefined&quot;.</p>
        <p className="text-zinc-500 font-normal mt-2">
          Silakan kembali ke halaman Daftar Invoice dan pastikan tombol link-nya
          memuat ID yang benar.
        </p>
      </div>
    );
  }

  const supabase = await createSupabaseServer();
  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="p-8 text-center font-medium">Silahkan login kembali.</div>
    );
  }

  // Fetch invoice dengan invoice_items
  const {data: invoice, error} = await supabaseAdmin
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
    .eq("id", id) // Gunakan id yang sudah bersih
    .single();

  if (error) {
    return (
      <div className="p-8 text-center text-red-500 font-bold">
        <h1>Terjadi Kesalahan Query Supabase:</h1>
        <p>{error.message}</p>
        <p className="text-sm font-normal text-zinc-500 mt-2">
          Detail: {error.details || error.hint}
        </p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-8 text-center text-zinc-500 font-bold">
        Data invoice dengan ID tersebut tidak ditemukan di database.
      </div>
    );
  }

  // Transform data untuk InvoiceCetak
  const invoiceData = {
    ...invoice,
    items: invoice.invoice_items || [],
    client_email: invoice.profiles?.email || invoice.client_email || "",
    full_name: invoice.profiles?.full_name || invoice.client_name || "",
    client_phone: invoice.client_phone || "",
    client_address: invoice.client_address || "",
  };

  return <InvoiceCetak data={invoiceData} />;
}

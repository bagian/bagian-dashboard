import {supabaseAdmin} from "@/lib/supabase/admin";
import InvoiceCetak from "../../InvoiceCetak";
import {notFound} from "next/navigation";

export default async function PrintInvoicePage(props: {
  params: Promise<{id: string}>;
}) {
  const params = await props.params;
  const id = params.id;

  const {data: invoice} = await supabaseAdmin
    .from("invoices")
    .select("*")
    .eq("id", id)
    .single();

  if (!invoice) return notFound();

  const {data: profile} = await supabaseAdmin
    .from("profiles")
    .select("email, full_name")
    .eq("id", invoice.client_id)
    .single();

  const combinedData = {
    ...invoice,
    client_email: profile?.email || "Email tidak ditemukan",
    full_name: profile?.full_name || "Client",
  };

  return (
    <div className=" inset-0 pt-28 overflow-auto print:static print:inset-auto">
      <InvoiceCetak data={combinedData} />
    </div>
  );
}

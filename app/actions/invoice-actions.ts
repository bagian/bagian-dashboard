"use server";

import {createClient} from "@supabase/supabase-js";
import {revalidatePath} from "next/cache";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

export async function createInvoice(formData: FormData) {
  try {
    const {error} = await supabaseAdmin.from("invoices").insert({
      invoice_number: formData.get("invoice_number") as string,
      amount: Number(formData.get("amount")),
      client_id: formData.get("client_id") as string,
      status: "unpaid",
      due_date: formData.get("due_date") as string,
    });

    if (error) return {error: error.message};
    revalidatePath("/customer/invoices");
    return {success: true};
  } catch (err) {
    return {error: "Terjadi kesalahan sistem"};
  }
}

// FIX: Pastikan hanya menerima SATU argumen (id)
export async function updateInvoiceStatus(id: string) {
  try {
    const {error} = await supabaseAdmin
      .from("invoices")
      .update({status: "paid"})
      .eq("id", id);

    if (error) throw new Error(error.message);

    revalidatePath("/customer/invoices");
    return {success: true};
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Terjadi kesalahan sistem",
    };
  }
}

export async function deleteInvoice(id: string) {
  try {
    const {error} = await supabaseAdmin.from("invoices").delete().eq("id", id);
    if (error) throw new Error(error.message);
    revalidatePath("/customer/invoices");
    return {success: true};
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Terjadi kesalahan sistem",
    };
  }
}

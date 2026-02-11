"use server";

import {supabaseAdmin} from "@/lib/supabase/admin";
import {revalidatePath} from "next/cache";

export async function createInvoice(formData: FormData) {
  try {
    const invoiceData = {
      invoice_number: formData.get("invoice_number") as string,
      amount: Number(formData.get("amount")),
      client_id: formData.get("client_id") as string,
      status: "unpaid",
      due_date: formData.get("due_date") as string,
    };

    // console.log("Creating invoice:", invoiceData);

    const {data, error} = await supabaseAdmin
      .from("invoices")
      .insert(invoiceData)
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return {error: error.message};
    }

    // console.log("Invoice created successfully:", data);
    revalidatePath("/customer/invoices");
    return {success: true, data};
  } catch (err) {
    console.error("Unexpected error:", err);
    return {error: "Terjadi kesalahan sistem"};
  }
}

export async function updateInvoiceStatus(
  id: number,
  status: "paid" | "unpaid",
) {
  try {
    const {error} = await supabaseAdmin
      .from("invoices")
      .update({status})
      .eq("id", id);

    if (error) {
      console.error("Update error:", error);
      return {error: error.message};
    }

    revalidatePath("/customer/invoices");
    return {success: true};
  } catch (err) {
    console.error("Unexpected error:", err);
    return {error: "Terjadi kesalahan sistem"};
  }
}

export async function deleteInvoice(id: number) {
  try {
    const {error} = await supabaseAdmin.from("invoices").delete().eq("id", id);

    if (error) {
      console.error("Delete error:", error);
      return {error: error.message};
    }

    revalidatePath("/customer/invoices");
    return {success: true};
  } catch (err) {
    console.error("Unexpected error:", err);
    return {error: "Terjadi kesalahan sistem"};
  }
}

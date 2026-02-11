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

/**
 * FUNGSI BARU: Memperbarui data profil pengguna (Nama, Email, Perusahaan)
 */
export async function updateUserData(
  userId: string,
  data: {full_name: string; email: string; company_name: string},
) {
  try {
    const {error} = await supabaseAdmin
      .from("profiles")
      .update({
        full_name: data.full_name,
        email: data.email,
        company_name: data.company_name,
      })
      .eq("id", userId);

    if (error) throw error;

    // Revalidasi path agar UI langsung terupdate
    revalidatePath("/customer/users");
    revalidatePath("/admin/clients");

    return {success: true};
  } catch (error) {
    console.error("updateUserData error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Terjadi kesalahan sistem",
    };
  }
}

// Fungsi lainnya (Tetap Biarkan)
export async function updateUserRole(userId: string, newRole: string) {
  try {
    const {error} = await supabaseAdmin
      .from("profiles")
      .update({role: newRole})
      .eq("id", userId);

    if (error) throw error;
    revalidatePath("/customer/users");
    return {success: true};
  } catch (error) {
    console.error("updateUserRole error:", error);
    return {
      error: error instanceof Error ? error.message : "Terjadi kesalahan",
    };
  }
}

export async function deleteUserAccount(userId: string) {
  try {
    // 1. Hapus profil
    await supabaseAdmin.from("profiles").delete().eq("id", userId);
    // 2. Hapus auth user
    const {error} = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) throw error;

    revalidatePath("/customer/users");
    revalidatePath("/admin/clients");
    return {success: true};
  } catch (error) {
    console.error("deleteUserAccount error:", error);
    return {
      error: error instanceof Error ? error.message : "Terjadi kesalahan",
    };
  }
}

"use server";

import {createSupabaseServer} from "@/lib/supabase/server";
import {supabaseAdmin} from "@/lib/supabase/admin";
import {revalidatePath} from "next/cache";

export async function updateProfile(formData: FormData) {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: {user},
    } = await supabase.auth.getUser();

    if (!user) {
      return {error: "User tidak ditemukan"};
    }

    const full_name = formData.get("full_name") as string;
    const company_name = formData.get("company_name") as string;
    const phone = formData.get("phone") as string;

    // Update profile menggunakan supabaseAdmin
    const {error} = await supabaseAdmin
      .from("profiles")
      .update({
        full_name,
        company_name,
        phone,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      console.error("Error updating profile:", error);
      return {error: error.message};
    }

    revalidatePath("/customer/profile");
    return {success: true};
  } catch (error) {
    console.error("Server action error:", error);
    return {
      error: error instanceof Error ? error.message : "Terjadi kesalahan",
    };
  }
}

export async function updatePassword(formData: FormData) {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: {user},
    } = await supabase.auth.getUser();

    if (!user) {
      return {error: "User tidak ditemukan"};
    }

    const currentPassword = formData.get("current_password") as string;
    const newPassword = formData.get("new_password") as string;
    const confirmPassword = formData.get("confirm_password") as string;

    // Validasi
    if (newPassword !== confirmPassword) {
      return {error: "Password baru tidak cocok"};
    }

    if (newPassword.length < 6) {
      return {error: "Password minimal 6 karakter"};
    }

    // Update password
    const {error} = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error("Error updating password:", error);
      return {error: error.message};
    }

    return {success: true};
  } catch (error) {
    console.error("Server action error:", error);
    return {
      error: error instanceof Error ? error.message : "Terjadi kesalahan",
    };
  }
}

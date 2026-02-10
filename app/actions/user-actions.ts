"use server";
import {createClient} from "@supabase/supabase-js";
import {revalidatePath} from "next/cache";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {auth: {autoRefreshToken: false, persistSession: false}},
);

export async function updateUserRole(userId: string, newRole: string) {
  try {
    const {error} = await supabaseAdmin
      .from("profiles")
      .update({role: newRole})
      .eq("id", userId);

    if (error) {
      console.error("Error updating role:", error);
      throw error;
    }

    revalidatePath("/customer/users");
    return {success: true};
  } catch (error) {
    console.error("updateUserRole error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function deleteUserAccount(userId: string) {
  try {
    console.log("🗑️ Attempting to delete user:", userId);

    // 1. Hapus dari public.profiles DULU
    const {error: profileError} = await supabaseAdmin
      .from("profiles")
      .delete()
      .eq("id", userId);

    if (profileError) {
      console.error("❌ Error deleting profile:", profileError);
      throw new Error(`Profile deletion failed: ${profileError.message}`);
    }

    console.log("✅ Profile deleted successfully");

    // 2. Baru hapus dari auth.users
    const {error: authError} =
      await supabaseAdmin.auth.admin.deleteUser(userId);

    if (authError) {
      console.error("❌ Error deleting auth user:", authError);
      throw new Error(`Auth deletion failed: ${authError.message}`);
    }

    console.log("✅ Auth user deleted successfully");

    revalidatePath("/customer/users");
    return {success: true};
  } catch (error) {
    console.error("❌ deleteUserAccount error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

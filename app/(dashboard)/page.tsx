import { redirect } from "next/navigation";

/**
 * Halaman root segment (dashboard). Auth sudah di-handle oleh layout.
 * Redirect ke dashboard customer sebagai default.
 */
export default async function DashboardRootPage() {
  redirect("/customer");
}

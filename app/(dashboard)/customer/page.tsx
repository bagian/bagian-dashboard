import {createSupabaseServer} from "@/lib/supabase/server";
import {supabaseAdmin} from "@/lib/supabase/admin";
import {redirect} from "next/navigation";
import {CustomerDashboard} from "@/components/dashboard/CustomerDashboard";
import {AdminDashboard} from "@/components/dashboard/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createSupabaseServer();
  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Ambil profile
  const {data: profile} = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const userRole = profile?.role?.toLowerCase() || "customer";
  const isAdmin = userRole === "admin" || userRole === "superadmin";

  if (isAdmin) {
    // Admin Dashboard - Fetch admin stats
    const [clientsRes, invoicesRes, ticketsRes, projectsRes] =
      await Promise.all([
        supabaseAdmin
          .from("profiles")
          .select("id, email, full_name, role, created_at")
          .neq("role", "admin")
          .neq("role", "superadmin"),
        supabaseAdmin
          .from("invoices")
          .select("*, profiles!client_id(full_name, email)"),
        supabaseAdmin.from("tickets").select("*"),
        supabaseAdmin
          .from("projects")
          .select("*")
          .order("deadline", {ascending: true}),
      ]);

    const clients = clientsRes.data || [];
    const invoices = invoicesRes.data || [];
    const tickets = ticketsRes.data || [];
    const projects = projectsRes.data || [];

    const stats = {
      totalClients: clients.length,
      totalInvoices: invoices.length,
      totalRevenue: invoices.reduce((sum, inv) => sum + Number(inv.amount), 0),
      paidInvoices: invoices.filter((inv) => inv.status === "paid").length,
      unpaidInvoices: invoices.filter((inv) => inv.status === "unpaid").length,
      openTickets: tickets.filter((t) => t.status === "open").length,
      closedTickets: tickets.filter((t) => t.status === "closed").length,
      recentClients: clients
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )
        .slice(0, 5),
      recentInvoices: invoices
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )
        .slice(0, 5),
      upcomingProjects: projects
        .filter((p) => p.status !== "completed")
        .slice(0, 5),
    };

    return <AdminDashboard profile={profile} stats={stats} />;
  } else {
    // Customer Dashboard - Fetch customer stats
    const [invoicesRes, ticketsRes] = await Promise.all([
      supabaseAdmin
        .from("invoices")
        .select("*")
        .eq("client_id", user.id)
        .order("created_at", {ascending: false}),
      supabaseAdmin
        .from("tickets")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", {ascending: false}),
    ]);

    const invoices = invoicesRes.data || [];
    const tickets = ticketsRes.data || [];

    const stats = {
      totalInvoices: invoices.length,
      paidInvoices: invoices.filter((inv) => inv.status === "paid").length,
      unpaidInvoices: invoices.filter((inv) => inv.status === "unpaid").length,
      totalAmount: invoices.reduce((sum, inv) => sum + Number(inv.amount), 0),
      paidAmount: invoices
        .filter((inv) => inv.status === "paid")
        .reduce((sum, inv) => sum + Number(inv.amount), 0),
      unpaidAmount: invoices
        .filter((inv) => inv.status === "unpaid")
        .reduce((sum, inv) => sum + Number(inv.amount), 0),
      openTickets: tickets.filter((t) => t.status === "open").length,
      closedTickets: tickets.filter((t) => t.status === "closed").length,
      recentInvoices: invoices.slice(0, 3),
      recentTickets: tickets.slice(0, 3),
    };

    return <CustomerDashboard profile={profile} stats={stats} />;
  }
}

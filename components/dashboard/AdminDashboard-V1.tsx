"use client";

import {StatCard} from "@/components/dashboard/stat-card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {
  Users,
  Receipt,
  MessageSquare,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

interface AdminProfile {
  full_name?: string;
  email?: string;
  role?: string;
}

interface RecentClient {
  id: string;
  email: string;
  created_at: string;
  role: string;
}

interface RecentInvoice {
  id: number;
  invoice_number: string;
  amount: number;
  status: "paid" | "unpaid";
  created_at: string;
}

interface AdminDashboardProps {
  profile: AdminProfile | null;
  stats: {
    totalClients: number;
    totalInvoices: number;
    totalRevenue: number;
    paidInvoices: number;
    unpaidInvoices: number;
    openTickets: number;
    closedTickets: number;
    recentClients: RecentClient[];
    recentInvoices: RecentInvoice[];
  };
}

export function AdminDashboard({profile, stats}: AdminDashboardProps) {
  const displayName = profile?.full_name || "Admin";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Welcome Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-100 pb-8">
        <div className="space-y-2">
          <Badge
            variant="outline"
            className="rounded-full px-3 py-0.5 border-zinc-900 text-[10px] font-medium uppercase tracking-widest text-zinc-900"
          >
            Admin Console
          </Badge>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-900">
            Dashboard Admin
          </h1>
          <p className="text-sm text-zinc-400 font-medium">
            Kelola klien, invoice, dan support tickets.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/customer/users">
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg font-medium border-zinc-200 text-xs cursor-pointer"
            >
              <Users className="mr-2 h-3 w-3" />
              User Management
            </Button>
          </Link>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Klien"
          value={stats.totalClients.toString()}
          suffix="Clients"
        />
        <StatCard
          title="Total Invoice"
          value={stats.totalInvoices.toString()}
          suffix="Invoices"
        />
        <StatCard
          title="Total Revenue"
          value={`${(stats.totalRevenue / 1000000).toFixed(1)}M`}
          suffix="IDR"
          accent="emerald"
        />
        <StatCard
          title="Open Tickets"
          value={stats.openTickets.toString()}
          accent="orange"
        />
      </div>

      {/* Revenue Card */}
      <Card className="border-zinc-100 shadow-sm rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-2">
                Total Pendapatan
              </p>
              <p className="text-3xl font-bold">
                Rp {new Intl.NumberFormat("id-ID").format(stats.totalRevenue)}
              </p>
              <div className="flex gap-4 mt-4">
                <div>
                  <p className="text-xs text-zinc-400">Lunas</p>
                  <p className="text-sm font-semibold text-emerald-400">
                    {stats.paidInvoices} Invoice
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Belum Lunas</p>
                  <p className="text-sm font-semibold text-orange-400">
                    {stats.unpaidInvoices} Invoice
                  </p>
                </div>
              </div>
            </div>
            <TrendingUp className="h-16 w-16 text-zinc-700" />
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Clients */}
        <Card className="border-zinc-100 shadow-sm rounded-2xl">
          <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 py-4 px-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
                Klien Terbaru
              </CardTitle>
              <Link href="/customer/users">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-zinc-500 hover:text-zinc-900"
                >
                  Lihat Semua
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {stats.recentClients.slice(0, 5).map((client) => (
                <div
                  key={client.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-50 transition-colors"
                >
                  <div className="h-10 w-10 rounded-full bg-zinc-900 flex items-center justify-center text-white font-bold text-sm">
                    {client.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-zinc-900">
                      {client.email}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {new Date(client.created_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <Badge className="bg-zinc-100 text-zinc-600 text-[9px] rounded-full">
                    {client.role}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Invoices */}
        <Card className="border-zinc-100 shadow-sm rounded-2xl">
          <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 py-4 px-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
                Invoice Terbaru
              </CardTitle>
              <Link href="/customer/invoices">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-zinc-500 hover:text-zinc-900"
                >
                  Lihat Semua
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {stats.recentInvoices.slice(0, 5).map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-zinc-100 flex items-center justify-center">
                      <Receipt className="h-5 w-5 text-zinc-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-zinc-900">
                        {invoice.invoice_number}
                      </p>
                      <p className="text-xs text-zinc-400">
                        Rp{" "}
                        {new Intl.NumberFormat("id-ID").format(invoice.amount)}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                      invoice.status === "paid"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-orange-50 text-orange-600"
                    }`}
                  >
                    {invoice.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

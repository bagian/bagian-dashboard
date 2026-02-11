"use client";

import {StatCard} from "@/components/dashboard/stat-card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {
  ArrowUpRight,
  Receipt,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

// --- DEFINISI TIPE DATA (Sesuai database Supabase kamu) ---
interface Profile {
  full_name: string | null;
  email: string;
}

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  status: "paid" | "unpaid";
  due_date: string;
}

interface Ticket {
  id: string;
  subject: string;
  status: "open" | "closed";
  created_at: string;
}

interface CustomerDashboardProps {
  profile: Profile; // Berubah dari any
  stats: {
    totalInvoices: number;
    paidInvoices: number;
    unpaidInvoices: number;
    totalAmount: number;
    paidAmount: number;
    unpaidAmount: number;
    openTickets: number;
    closedTickets: number;
    recentInvoices: Invoice[]; // Berubah dari any[]
    recentTickets: Ticket[]; // Berubah dari any[]
  };
}

export function CustomerDashboard({profile, stats}: CustomerDashboardProps) {
  const displayName =
    profile?.full_name || profile?.email?.split("@")[0] || "User";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Welcome Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-100 pb-8">
        <div className="space-y-2">
          <Badge
            variant="outline"
            className="rounded-full px-3 py-0.5 border-zinc-200 text-[10px] font-medium uppercase tracking-widest text-zinc-400"
          >
            Client Portal
          </Badge>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-900">
            Selamat datang,{" "}
            <span className="text-zinc-500 font-normal capitalize">
              {displayName}
            </span>
            .
          </h1>
          <p className="text-sm text-zinc-400 font-medium">
            Pantau tagihan dan support ticket Anda.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/customer/tickets">
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg font-medium border-zinc-200 text-xs shadow-sm cursor-pointer"
            >
              <MessageSquare className="mr-2 h-3 w-3" />
              Buka Ticket
            </Button>
          </Link>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Invoice"
          value={stats.totalInvoices.toString()}
          suffix="Invoice"
        />
        <StatCard
          title="Invoice Lunas"
          value={stats.paidInvoices.toString()}
          accent="emerald"
        />
        <StatCard
          title="Invoice Belum Lunas"
          value={stats.unpaidInvoices.toString()}
          accent="orange"
        />
        <StatCard
          title="Ticket Aktif"
          value={stats.openTickets.toString()}
          suffix="Open"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Invoices */}
        <Card className="lg:col-span-2 border-zinc-100 shadow-sm rounded-2xl">
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
            {stats.recentInvoices.length === 0 ? (
              <div className="text-center py-12">
                <Receipt className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
                <p className="text-sm text-zinc-400 italic">
                  Belum ada invoice
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recentInvoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-zinc-50 transition-colors border border-zinc-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-zinc-100 flex items-center justify-center">
                        <Receipt className="h-5 w-5 text-zinc-500" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-zinc-900">
                          {invoice.invoice_number}
                        </p>
                        <p className="text-xs text-zinc-400">
                          {new Date(invoice.due_date).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-zinc-900">
                        Rp{" "}
                        {new Intl.NumberFormat("id-ID").format(invoice.amount)}
                      </p>
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
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <Card className="border-zinc-100 shadow-sm rounded-2xl bg-zinc-900 text-white">
          <CardHeader className="border-b border-zinc-800 py-4 px-6">
            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
              Ringkasan Keuangan
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold mb-2">
                Total Tagihan
              </p>
              <p className="text-2xl font-bold">
                Rp {new Intl.NumberFormat("id-ID").format(stats.totalAmount)}
              </p>
            </div>
            <div className="border-t border-zinc-800 pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs text-zinc-400">Lunas</span>
                </div>
                <span className="text-sm font-semibold text-emerald-400">
                  Rp {new Intl.NumberFormat("id-ID").format(stats.paidAmount)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <span className="text-xs text-zinc-400">Belum Lunas</span>
                </div>
                <span className="text-sm font-semibold text-orange-400">
                  Rp {new Intl.NumberFormat("id-ID").format(stats.unpaidAmount)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Support Section */}
      <Card className="border-zinc-100 shadow-sm rounded-2xl">
        <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 py-4 px-6">
          <CardTitle className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
            Support Tickets
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                <span className="text-sm font-medium text-zinc-700">
                  {stats.openTickets} Open
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                <span className="text-sm font-medium text-zinc-700">
                  {stats.closedTickets} Closed
                </span>
              </div>
            </div>
            <Link href="/customer/tickets">
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg text-xs"
              >
                Lihat Semua
                <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>

          {stats.recentTickets.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
              <p className="text-sm text-zinc-400 italic">
                Belum ada support ticket
              </p>
              <Link href="/customer/tickets">
                <Button className="mt-4 bg-zinc-900 hover:bg-zinc-800 rounded-lg">
                  Buat Ticket Baru
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-start gap-3 p-4 rounded-lg hover:bg-zinc-50 transition-colors border border-zinc-100"
                >
                  <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0">
                    <MessageSquare className="h-4 w-4 text-zinc-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-zinc-900">
                      {ticket.subject}
                    </p>
                    <p className="text-xs text-zinc-400 mt-1">
                      {new Date(ticket.created_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <Badge
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                      ticket.status === "open"
                        ? "bg-orange-50 text-orange-600"
                        : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {ticket.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

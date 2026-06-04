"use client";

import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowUpRight,
  Receipt,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  DollarSign,
  TrendingUp,
  User,
  Ticket as TicketIcon,
  Plus,
  ArrowRight,
  Wallet,
  Sparkles,
  LayoutDashboard,
  Calendar,
  FileText,
  Info,
  ChevronRight,
  Activity,
} from "lucide-react";
import Link from "next/link";

// --- DEFINISI TIPE DATA ---
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
  profile: Profile;
  stats: {
    totalInvoices: number;
    paidInvoices: number;
    unpaidInvoices: number;
    totalAmount: number;
    paidAmount: number;
    unpaidAmount: number;
    openTickets: number;
    closedTickets: number;
    recentInvoices: Invoice[];
    recentTickets: Ticket[];
  };
}

export function CustomerDashboard({ profile, stats }: CustomerDashboardProps) {
  const displayName =
    profile?.full_name || profile?.email?.split("@")[0] || "User";

  const paymentRate =
    stats.totalInvoices > 0
      ? Math.round((stats.paidInvoices / stats.totalInvoices) * 100)
      : 0;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto  sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Section dengan gradient accent */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="h-1.5 w-1.5 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-500/50" />
            <Badge className="px-3 py-1 border-zinc-200 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 bg-gradient-to-r from-zinc-50 dark:from-zinc-900 to-blue-50/30 dark:to-blue-900/10 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="h-3 w-3 text-blue-500" />
              Client Portal
            </Badge>
            <div className="ml-auto flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/30 rounded-full border border-emerald-100 dark:border-emerald-900/30">
              <Activity className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-450 uppercase tracking-wide">
                Active
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-start gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold tracking-tight bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 dark:from-white dark:via-zinc-200 dark:to-zinc-100 bg-clip-text text-transparent">
                    Welcome Back
                  </h1>
                  <p className="text-base font-semibold text-zinc-700 dark:text-zinc-300 mt-0.5">
                    {displayName}
                  </p>
                </div>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed flex  md:items-center gap-2">
                <Info className="h-4 w-4 text-zinc-400 dark:text-zinc-550 mt-0.5 flex-shrink-0" />
                <span>
                  Pantau tagihan, keuangan, dan support ticket Anda dengan mudah
                  dari satu tempat terpusat.
                </span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link href="/customer/tickets/new" className="cursor-pointer">
                <Button className="h-11 px-6 text-sm font-semibold shadow-lg hover:shadow-xl bg-gradient-to-r from-zinc-900 to-zinc-800 hover:from-zinc-800 hover:to-zinc-700 dark:from-zinc-100 dark:to-zinc-200 dark:text-zinc-900 dark:hover:from-zinc-200 dark:hover:to-zinc-300 rounded-xl transition-all duration-200 cursor-pointer group w-full">
                  <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform" />
                  Buat Ticket Baru
                </Button>
              </Link>
              <Link href="/customer/invoices" className="cursor-pointer">
                <Button
                  variant="outline"
                  className="h-11 px-6 text-sm font-semibold shadow-lg hover:shadow-xl rounded-xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-900 dark:text-zinc-100 transition-all duration-200 cursor-pointer group w-full"
                >
                  <Receipt className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  Invoice Saya
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Grid dengan gradient background yang berbeda */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Invoice - Blue accent */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 dark:from-blue-950/20 to-blue-50 dark:to-blue-900/10 rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm rounded-2xl border border-blue-100 dark:border-blue-900/30 shadow-lg hover:shadow-xl transition-all p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Receipt className="h-5 w-5 text-white" />
                </div>
                <Badge className="bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/30 text-[9px] font-bold px-2 py-0.5">
                  Total
                </Badge>
              </div>
              <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-1">
                Total Invoice
              </p>
              <p className="text-2xl font-black text-zinc-900 dark:text-white mb-1">
                {stats.totalInvoices.toLocaleString()}
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium flex items-center gap-1">
                <FileText className="h-3 w-3" />
                Invoice keseluruhan
              </p>
            </div>
          </div>

          {/* Invoice Lunas - Emerald accent */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 dark:from-emerald-950/20 to-emerald-50 dark:to-emerald-900/10 rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm rounded-2xl border border-emerald-100 dark:border-emerald-900/30 shadow-lg hover:shadow-xl transition-all p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="h-5 w-5 text-white" />
                </div>
                <Badge className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/30 text-[9px] font-bold px-2 py-0.5 flex items-center gap-1">
                  <TrendingUp className="h-2.5 w-2.5" />+{paymentRate}%
                </Badge>
              </div>
              <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-1">
                Invoice Lunas
              </p>
              <p className="text-2xl font-black text-emerald-700 dark:text-emerald-450 mb-1">
                {stats.paidInvoices.toLocaleString()}
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                Pembayaran selesai
              </p>
            </div>
          </div>

          {/* Belum Lunas - Orange accent */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-100 dark:from-orange-950/20 to-orange-50 dark:to-orange-900/10 rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm rounded-2xl border border-orange-100 dark:border-orange-900/30 shadow-lg hover:shadow-xl transition-all p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <Badge className="bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-900/30 text-[9px] font-bold px-2 py-0.5">
                  Pending
                </Badge>
              </div>
              <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-1">
                Belum Lunas
              </p>
              <p className="text-2xl font-black text-orange-700 dark:text-orange-450 mb-1">
                {stats.unpaidInvoices.toLocaleString()}
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium flex items-center gap-1">
                <AlertCircle className="h-3 w-3 text-orange-500" />
                Menunggu pembayaran
              </p>
            </div>
          </div>

          {/* Ticket Aktif - Purple accent */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100 dark:from-purple-950/20 to-purple-50 dark:to-purple-900/10 rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm rounded-2xl border border-purple-100 dark:border-purple-900/30 shadow-lg hover:shadow-xl transition-all p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <Badge className="bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900/30 text-[9px] font-bold px-2 py-0.5">
                  Active
                </Badge>
              </div>
              <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-1">
                Ticket Aktif
              </p>
              <p className="text-2xl font-black text-purple-700 dark:text-purple-450 mb-1">
                {stats.openTickets.toLocaleString()}
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium flex items-center gap-1">
                <TicketIcon className="h-3 w-3 text-purple-500" />
                Sedang diproses
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Recent Invoices dengan accent blue */}
          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white dark:bg-zinc-950">
            <CardHeader className="bg-gradient-to-r from-blue-50 dark:from-blue-950/20 to-blue-50/30 dark:to-blue-900/10 border-b border-blue-100/50 dark:border-blue-900/30 px-6 pt-6 pb-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Receipt className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-sm md:text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      Invoice Terbaru
                      <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-none text-[8px] font-bold px-2 py-0.5">
                        NEW
                      </Badge>
                    </CardTitle>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs font-medium mt-0.5 flex items-center gap-1">
                      <LayoutDashboard className="h-3 w-3 text-blue-500" />
                      {stats.recentInvoices.length} data terakhir
                    </p>
                  </div>
                </div>
                <Link
                  href="/customer/invoices"
                  className="group cursor-pointer hidden md:inline-block"
                >
                  <Button
                    variant="ghost"
                    className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-blue-700 dark:hover:text-blue-300 px-4 h-9 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all cursor-pointer"
                  >
                    Lihat Semua
                    <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {stats.recentInvoices.length === 0 ? (
                <div className="text-center py-12 px-6">
                  <div className="w-20 h-20 mx-auto mb-4 p-4 bg-gradient-to-br from-blue-100 dark:from-blue-950/20 to-blue-50 dark:to-blue-900/10 rounded-2xl flex items-center justify-center shadow-lg">
                    <Receipt className="h-10 w-10 text-blue-500" />
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                    Belum ada invoice
                  </h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6 max-w-sm mx-auto">
                    Invoice pertama Anda akan muncul di sini setelah diterbitkan
                    oleh tim kami.
                  </p>
                  <Link href="/customer/invoices" className="cursor-pointer">
                    <Button
                      size="sm"
                      className="px-6 py-2 text-sm font-semibold shadow-lg hover:shadow-xl rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-zinc-100 dark:to-zinc-200 dark:text-zinc-900 dark:hover:from-zinc-200 dark:hover:to-zinc-300 cursor-pointer"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Cek Status Invoice
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {stats.recentInvoices.map((invoice) => (
                    <Link
                      key={invoice.id}
                      href={`/customer/invoices/${invoice.id}`}
                      className="block p-5 hover:bg-gradient-to-r hover:from-blue-50/50 dark:hover:from-blue-950/20 hover:to-transparent transition-all duration-200 group cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-100 dark:from-blue-950/20 to-blue-50 dark:to-blue-900/10 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all flex-shrink-0 border border-blue-200/50 dark:border-blue-900/30">
                            <Receipt className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="space-y-1 min-w-0">
                            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors truncate uppercase tracking-tight flex items-center gap-2">
                              {invoice.invoice_number}
                              <ChevronRight className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-550 group-hover:text-blue-500 dark:group-hover:text-blue-450 group-hover:translate-x-1 transition-all" />
                            </p>
                            <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 truncate flex items-center gap-1.5">
                              <Calendar className="h-3 w-3 text-zinc-400" />
                              Tempo:{" "}
                              {new Date(invoice.due_date).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="text-right space-y-1.5 flex-shrink-0">
                          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tabular-nums flex items-center justify-end gap-1">
                            <span className="text-xs text-zinc-500 dark:text-zinc-450 font-medium">
                              Rp
                            </span>
                            {new Intl.NumberFormat("id-ID").format(
                              invoice.amount
                            )}
                          </p>
                          <Badge
                            className={`px-3 py-0.5 text-[9px] font-bold uppercase rounded-full border shadow-sm ${
                              invoice.status === "paid"
                                ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-300 shadow-emerald-100/10"
                                : "bg-orange-50 dark:bg-orange-950/50 border-orange-200 dark:border-orange-900/30 text-orange-700 dark:text-orange-355 shadow-orange-100/10"
                            }`}
                          >
                            {invoice.status === "paid" ? (
                              <span className="flex items-center gap-1">
                                <CheckCircle2 className="h-2.5 w-2.5" />
                                Lunas
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <Clock className="h-2.5 w-2.5" />
                                Pending
                              </span>
                            )}
                          </Badge>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ringkasan Keuangan dengan gradient gelap yang lebih menarik */}
          <div className="space-y-6">
            <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white hover:shadow-2xl transition-all duration-300 relative">
              {/* Efek kilau animasi */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />

              <CardHeader className="px-6 pt-6 pb-2 relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-emerald-600 backdrop-blur-md rounded-xl flex items-center justify-center border border-emerald-400/30 shadow-lg shadow-emerald-500/30">
                    <Wallet className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      Ringkasan Keuangan
                      <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[8px] font-bold px-2 py-0.5">
                        {paymentRate}%
                      </Badge>
                    </CardTitle>
                    <p className="text-zinc-400 text-xs font-medium mt-0.5 flex items-center gap-1">
                      <Activity className="h-3 w-3 text-emerald-400" />
                      {paymentRate}% tagihan berhasil dilunasi
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wide">
                      Total
                    </span>
                    <p className="text-3xl font-black tabular-nums tracking-tight bg-gradient-to-r from-white via-emerald-100 to-white bg-clip-text text-transparent">
                      Rp{" "}
                      {new Intl.NumberFormat("id-ID").format(stats.totalAmount)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-semibold uppercase tracking-wide">
                    <TrendingUp className="h-3 w-3 text-emerald-400" />
                    Akumulasi tagihan keseluruhan
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-3 relative z-10">
                <div className="space-y-3">
                  {/* Paid Amount */}
                  <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 transition-all hover:bg-white/10 hover:border-emerald-500/30 group">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center border border-emerald-400/30 shadow-lg shadow-emerald-500/30">
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-zinc-300 uppercase tracking-wide flex items-center gap-1">
                          Lunas
                          <Badge className="bg-emerald-500/20 text-emerald-300 text-[8px] px-1.5 py-0">
                            {stats.paidInvoices}
                          </Badge>
                        </p>
                      </div>
                    </div>
                    <p className="text-base font-bold text-emerald-300 tabular-nums flex items-center gap-1">
                      <span className="text-xs text-emerald-400">Rp</span>
                      {new Intl.NumberFormat("id-ID").format(stats.paidAmount)}
                    </p>
                  </div>

                  {/* Unpaid Amount */}
                  <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 transition-all hover:bg-white/10 hover:border-orange-500/30 group">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center border border-orange-400/30 shadow-lg shadow-orange-500/30">
                        <AlertCircle className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-zinc-300 uppercase tracking-wide flex items-center gap-1">
                          Sisa Tagihan
                          <Badge className="bg-orange-500/20 text-orange-300 text-[8px] px-1.5 py-0">
                            {stats.unpaidInvoices}
                          </Badge>
                        </p>
                      </div>
                    </div>
                    <p className="text-base font-bold text-orange-300 tabular-nums flex items-center gap-1">
                      <span className="text-xs text-orange-400">Rp</span>
                      {new Intl.NumberFormat("id-ID").format(
                        stats.unpaidAmount
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Support Tickets dengan accent purple */}
        <Card className="border-0 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white dark:bg-zinc-950">
          <CardHeader className="bg-gradient-to-r from-purple-50 dark:from-purple-950/20 to-purple-50/30 dark:to-purple-900/10 px-6 pt-6 pb-5 border-b border-purple-100/50 dark:border-purple-900/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <TicketIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    Support Tickets
                  </CardTitle>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs font-medium mt-0.5 flex items-center gap-2">
                    <Badge className="bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 text-[8px] font-bold px-1.5 py-0.5 flex items-center gap-0.5 border-none">
                      <Clock className="h-2.5 w-2.5" />
                      {stats.openTickets}
                    </Badge>
                    <span>•</span>
                    <Badge className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-355 text-[8px] font-bold px-1.5 py-0.5 flex items-center gap-0.5 border-none">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      {stats.closedTickets}
                    </Badge>
                  </p>
                </div>
              </div>
              <Link
                href="/customer/tickets"
                className="cursor-pointer hidden md:inline-block"
              >
                <Button className="h-9 px-5 text-xs font-semibold shadow-lg hover:shadow-xl rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 dark:from-zinc-100 dark:to-zinc-200 dark:text-zinc-900 dark:hover:from-zinc-200 dark:hover:to-zinc-300 transition-all cursor-pointer group">
                  Semua Tickets
                  <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            {stats.recentTickets.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 p-4 bg-gradient-to-br from-purple-100 dark:from-purple-950/20 to-purple-50 dark:to-purple-900/10 rounded-2xl flex items-center justify-center shadow-lg">
                  <MessageSquare className="h-10 w-10 text-purple-500" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  Belum ada ticket support
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6 max-w-md mx-auto">
                  Butuh bantuan? Buat ticket support pertama Anda dan tim kami
                  akan membantu menyelesaikannya dengan cepat.
                </p>
                <Link href="/customer/tickets/new" className="cursor-pointer">
                  <Button
                    size="sm"
                    className="px-8 py-2 text-sm font-bold shadow-lg hover:shadow-xl rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 dark:from-zinc-100 dark:to-zinc-200 dark:text-zinc-900 dark:hover:from-zinc-200 dark:hover:to-zinc-300 cursor-pointer"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Buat Ticket Baru
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                {stats.recentTickets.map((ticket) => (
                  <Link
                    key={ticket.id}
                    href={`/customer/tickets/${ticket.id}`}
                    className="group flex items-start justify-between gap-3 p-4 rounded-xl hover:bg-gradient-to-r hover:from-purple-50/50 dark:hover:from-purple-950/20 hover:to-transparent border border-zinc-100 dark:border-zinc-800 hover:border-purple-200 dark:hover:border-purple-800 hover:shadow-lg transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex gap-3 flex-1 min-w-0">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-100 dark:from-purple-950/20 to-purple-50 dark:to-purple-900/10 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all flex-shrink-0 border border-purple-200/50 dark:border-purple-900/30">
                        <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-purple-700 dark:group-hover:text-purple-400 leading-snug transition-colors">
                          {ticket.subject}
                        </h4>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3 text-zinc-400" />
                          <p className="text-[10px] text-zinc-500 dark:text-zinc-450 font-medium">
                            {new Date(ticket.created_at).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge
                        className={`px-3 py-0.5 text-[9px] font-bold uppercase rounded-full border shadow-sm ${
                          ticket.status === "open"
                            ? "bg-orange-50 dark:bg-orange-950/50 border-orange-200 dark:border-orange-900/30 text-orange-700 dark:text-orange-355 shadow-orange-100/10"
                            : "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-300 shadow-emerald-100/10"
                        }`}
                      >
                        {ticket.status === "open" ? (
                          <span className="flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5" />
                            Open
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-2.5 w-2.5" />
                            Closed
                          </span>
                        )}
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-zinc-300 dark:text-zinc-600 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

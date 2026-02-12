"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Receipt,
  TrendingUp,
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Target,
  Briefcase,
  CreditCard,
  UserPlus,
  FileText,
  Info,
  Activity,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

interface AdminProfile {
  full_name?: string;
  email?: string;
  role?: string;
}

interface RecentClient {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
  role: string;
}

interface RecentInvoice {
  id: number;
  invoice_number: string;
  amount: number;
  status: "paid" | "unpaid";
  created_at: string;
  due_date?: string;
  profiles?: { full_name: string };
}

interface Project {
  id: string;
  name: string;
  status: string;
  deadline: string;
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
    upcomingProjects: Project[];
  };
}

// Database hari libur nasional Indonesia 2026
const INDONESIAN_HOLIDAYS_2026 = [
  { date: new Date(2026, 0, 1), name: "Tahun Baru 2026" },
  { date: new Date(2026, 1, 17), name: "Isra Miraj Nabi Muhammad SAW" },
  { date: new Date(2026, 1, 28), name: "Imlek 2577 Kongzili" },
  { date: new Date(2026, 2, 3), name: "Hari Suci Nyepi Tahun Baru Saka 1948" },
  { date: new Date(2026, 2, 31), name: "Hari Raya Idul Fitri 1447 H" },
  { date: new Date(2026, 3, 1), name: "Hari Raya Idul Fitri 1447 H" },
  { date: new Date(2026, 3, 3), name: "Wafat Isa Al Masih" },
  { date: new Date(2026, 4, 1), name: "Hari Buruh Internasional" },
  { date: new Date(2026, 4, 14), name: "Kenaikan Isa Al Masih" },
  { date: new Date(2026, 4, 26), name: "Hari Raya Waisak 2570" },
  { date: new Date(2026, 5, 1), name: "Hari Lahir Pancasila" },
  { date: new Date(2026, 5, 7), name: "Hari Raya Idul Adha 1447 H" },
  { date: new Date(2026, 5, 27), name: "Tahun Baru Islam 1448 H" },
  { date: new Date(2026, 7, 17), name: "Hari Kemerdekaan RI" },
  { date: new Date(2026, 8, 5), name: "Maulid Nabi Muhammad SAW" },
  { date: new Date(2026, 11, 25), name: "Hari Raya Natal" },
];

export function AdminDashboard({ profile, stats }: AdminDashboardProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Helper untuk cek apakah tanggal adalah hari libur
  const isHoliday = (date: Date) => {
    return INDONESIAN_HOLIDAYS_2026.some(
      (holiday) =>
        holiday.date.getDate() === date.getDate() &&
        holiday.date.getMonth() === date.getMonth() &&
        holiday.date.getFullYear() === date.getFullYear(),
    );
  };

  // Helper untuk get nama hari libur
  const getHolidayName = (date: Date) => {
    const holiday = INDONESIAN_HOLIDAYS_2026.find(
      (h) =>
        h.date.getDate() === date.getDate() &&
        h.date.getMonth() === date.getMonth() &&
        h.date.getFullYear() === date.getFullYear(),
    );
    return holiday?.name || "";
  };

  const displayName =
    profile?.full_name || profile?.email?.split("@")[0] || "Admin";

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Section dengan gradient accent - mirip CustomerDashboard */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-4 border-b border-zinc-100">
            <div className="h-1.5 w-1.5 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-500/50" />
            <Badge className="px-3 py-1 border-zinc-200 text-[10px] font-bold uppercase tracking-wider text-zinc-600 bg-gradient-to-r from-zinc-50 to-blue-50/30 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="h-3 w-3 text-blue-500" />
              Admin Console
            </Badge>
            <div className="ml-auto flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
              <Activity className="h-3 w-3 text-emerald-600" />
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wide">
                Active
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-start gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold tracking-tight bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 bg-clip-text text-transparent">
                    Welcome Back
                  </h1>
                  <p className="text-base font-semibold text-zinc-700 mt-0.5">
                    {displayName}
                  </p>
                </div>
              </div>
              <p className="text-sm text-zinc-600 leading-relaxed flex md:items-center gap-2">
                <Info className="h-4 w-4 text-zinc-400 mt-0.5 flex-shrink-0" />
                <span>
                  Kelola klien, invoice, proyek, dan support tickets secara
                  efisien dari satu tempat terpusat.
                </span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link href="/customer/users" className="cursor-pointer">
                <Button className="h-11 px-6 text-sm font-semibold shadow-lg hover:shadow-xl bg-gradient-to-r from-zinc-900 to-zinc-800 hover:from-zinc-800 hover:to-zinc-700 rounded-xl transition-all duration-200 cursor-pointer group w-full">
                  <Users className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  User Management
                </Button>
              </Link>
              <Link href="/admin/projects" className="cursor-pointer">
                <Button
                  variant="outline"
                  className="h-11 px-6 text-sm font-semibold shadow-lg hover:shadow-xl rounded-xl border-zinc-200 bg-white hover:bg-zinc-50 transition-all duration-200 cursor-pointer group w-full"
                >
                  <Briefcase className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  Projects
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Grid - gaya CustomerDashboard */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-100 shadow-lg hover:shadow-xl transition-all p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-[9px] font-bold px-2 py-0.5">
                  Total
                </Badge>
              </div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
                Total Klien
              </p>
              <p className="text-2xl font-black text-zinc-900 mb-1">
                {stats.totalClients.toLocaleString()}
              </p>
              <p className="text-xs text-zinc-600 font-medium flex items-center gap-1">
                <FileText className="h-3 w-3" />
                Klien terdaftar
              </p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-100 shadow-lg hover:shadow-xl transition-all p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Receipt className="h-5 w-5 text-white" />
                </div>
                <Badge className="bg-purple-50 text-purple-700 border-purple-200 text-[9px] font-bold px-2 py-0.5">
                  Total
                </Badge>
              </div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
                Total Invoice
              </p>
              <p className="text-2xl font-black text-zinc-900 mb-1">
                {stats.totalInvoices.toLocaleString()}
              </p>
              <p className="text-xs text-zinc-600 font-medium flex items-center gap-1">
                <Receipt className="h-3 w-3" />
                Invoice keseluruhan
              </p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-100 shadow-lg hover:shadow-xl transition-all p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[9px] font-bold px-2 py-0.5 flex items-center gap-1">
                  <TrendingUp className="h-2.5 w-2.5" /> IDR
                </Badge>
              </div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
                Total Revenue
              </p>
              <p className="text-2xl font-black text-emerald-700 mb-1">
                {(stats.totalRevenue / 1000000).toFixed(1)}Jt
              </p>
              <p className="text-xs text-zinc-600 font-medium flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                Pendapatan terakumulasi
              </p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-orange-100 shadow-lg hover:shadow-xl transition-all p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                <Badge className="bg-orange-50 text-orange-700 border-orange-200 text-[9px] font-bold px-2 py-0.5">
                  Active
                </Badge>
              </div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
                Open Tickets
              </p>
              <p className="text-2xl font-black text-orange-700 mb-1">
                {stats.openTickets.toLocaleString()}
              </p>
              <p className="text-xs text-zinc-600 font-medium flex items-center gap-1">
                <AlertCircle className="h-3 w-3 text-orange-500" />
                Sedang diproses
              </p>
            </div>
          </div>
        </section>

        {/* Revenue Card - gaya Ringkasan Keuangan CustomerDashboard */}
        <section>
          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white hover:shadow-2xl transition-all duration-300 relative">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />

            <CardHeader className="px-6 pt-6 pb-2 relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-gradient-to-br from-emerald-500 to-emerald-600 backdrop-blur-md rounded-xl flex items-center justify-center border border-emerald-400/30 shadow-lg shadow-emerald-500/30">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    Total Pendapatan Terakumulasi
                    <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[8px] font-bold px-2 py-0.5">
                      IDR
                    </Badge>
                  </CardTitle>
                  <p className="text-zinc-400 text-xs font-medium mt-0.5 flex items-center gap-1">
                    <Activity className="h-3 w-3 text-emerald-400" />
                    Pendapatan dari invoice lunas
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
                    {new Intl.NumberFormat("id-ID").format(stats.totalRevenue)}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-3 relative z-10">
              <div className="space-y-3">
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
                  <p className="text-base font-bold text-emerald-300 tabular-nums">
                    {stats.paidInvoices} Invoice
                  </p>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 transition-all hover:bg-white/10 hover:border-orange-500/30 group">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center border border-orange-400/30 shadow-lg shadow-orange-500/30">
                      <Clock className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-zinc-300 uppercase tracking-wide flex items-center gap-1">
                        Belum Lunas
                        <Badge className="bg-orange-500/20 text-orange-300 text-[8px] px-1.5 py-0">
                          {stats.unpaidInvoices}
                        </Badge>
                      </p>
                    </div>
                  </div>
                  <p className="text-base font-bold text-orange-300 tabular-nums">
                    {stats.unpaidInvoices} Invoice
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Interactive Calendar & Monitoring Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border-0 shadow-xl rounded-2xl lg:col-span-1 overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white">
            <CardHeader className="bg-gradient-to-r from-zinc-50 to-zinc-50/30 border-b border-zinc-100/50 px-6 pt-6 pb-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-br from-zinc-600 to-zinc-700 rounded-xl flex items-center justify-center shadow-lg shadow-zinc-500/30">
                  <CalendarIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-sm md:text-base font-bold text-zinc-900">
                    Kalender Proyek & Tagihan
                  </CardTitle>
                  <p className="text-zinc-500 text-xs font-medium mt-0.5 flex items-center gap-1">
                    <LayoutDashboard className="h-3 w-3 text-zinc-500" />
                    Jatuh tempo & libur
                  </p>
                </div>
              </div>
            </CardHeader>

          <CardContent className="p-5">
            {/* Custom Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() - 1,
                    ),
                  )
                }
                className="h-8 w-8 flex items-center justify-center hover:bg-zinc-100 rounded-md transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4 text-zinc-600" />
              </button>
              <h3 className="text-base font-bold text-zinc-900">
                {currentMonth.toLocaleString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() + 1,
                    ),
                  )
                }
                className="h-8 w-8 flex items-center justify-center hover:bg-zinc-100 rounded-md transition-colors cursor-pointer"
              >
                <ChevronRight className="h-4 w-4 text-zinc-600" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="space-y-2">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-medium text-zinc-400 py-1"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              {(() => {
                const year = currentMonth.getFullYear();
                const month = currentMonth.getMonth();
                const firstDay = new Date(year, month, 1).getDay();
                const daysInMonth = new Date(year, month + 1, 0).getDate();
                const today = new Date();

                const days = [];
                const weeks = [];

                // Empty cells for days before month starts
                for (let i = 0; i < firstDay; i++) {
                  days.push(<div key={`empty-${i}`} className="h-9"></div>);
                }

                // Days of the month
                for (let day = 1; day <= daysInMonth; day++) {
                  const date = new Date(year, month, day);
                  const isToday =
                    today.getDate() === day &&
                    today.getMonth() === month &&
                    today.getFullYear() === year;
                  const isSunday = date.getDay() === 0;
                  const isNationalHoliday = isHoliday(date);
                  const holidayName = getHolidayName(date);

                  const invoiceAtDate = stats.recentInvoices.find(
                    (inv) =>
                      inv.due_date &&
                      new Date(inv.due_date).toDateString() ===
                        date.toDateString() &&
                      inv.status === "unpaid",
                  );

                  let dayClass =
                    "h-9 w-9 flex items-center justify-center text-sm font-medium rounded-full transition-colors relative ";

                  if (isToday) {
                    dayClass += "bg-emerald-500 text-white font-bold ";
                  } else if (isSunday || isNationalHoliday) {
                    dayClass += "text-red-500 hover:bg-red-50 ";
                  } else {
                    dayClass += "text-zinc-700 hover:bg-zinc-100 ";
                  }

                  const element = (
                    <div key={day} className="relative">
                      {invoiceAtDate || isNationalHoliday ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className={dayClass + " cursor-pointer"}>
                              {day}
                              {invoiceAtDate && (
                                <span
                                  className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full ${
                                    isToday ? "bg-white" : "bg-blue-500"
                                  }`}
                                ></span>
                              )}
                            </button>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-72 p-0 rounded-xl shadow-xl border-zinc-200 z-50 overflow-hidden right-2 relative"
                            align="center"
                          >
                            {isNationalHoliday ? (
                              <>
                                <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 text-white">
                                  <p className="text-[10px] uppercase tracking-widest font-bold opacity-90 mb-1">
                                    Hari Libur Nasional
                                  </p>
                                  <p className="text-base font-bold">
                                    {date.toLocaleDateString("id-ID", {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    })}
                                  </p>
                                </div>
                                <div className="p-4">
                                  <p className="text-sm text-zinc-900">
                                    {holidayName}
                                  </p>
                                  {invoiceAtDate && (
                                    <>
                                      <div className="mt-4 pt-4 border-t border-zinc-100">
                                        <p className="text-xs font-semibold text-zinc-500 mb-2">
                                          Invoice Jatuh Tempo
                                        </p>
                                        <div className="flex items-center justify-between">
                                          <div>
                                            <p className="text-sm font-bold text-zinc-900">
                                              {invoiceAtDate.profiles
                                                ?.full_name || "Klien"}
                                            </p>
                                            <p className="text-xs text-zinc-500">
                                              {invoiceAtDate.invoice_number}
                                            </p>
                                          </div>
                                        </div>
                                        <p className="text-base font-bold text-zinc-900 mt-2">
                                          Rp{" "}
                                          {new Intl.NumberFormat(
                                            "id-ID",
                                          ).format(invoiceAtDate.amount)}
                                        </p>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </>
                            ) : invoiceAtDate ? (
                              <>
                                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-white">
                                  <p className="text-[10px] uppercase tracking-widest font-bold opacity-90 mb-1">
                                    Invoice Jatuh Tempo
                                  </p>
                                  <p className="text-base font-bold">
                                    {date.toLocaleDateString("id-ID", {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    })}
                                  </p>
                                </div>
                                <div className="p-4 space-y-3">
                                  <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-700 font-bold text-sm">
                                      {(
                                        invoiceAtDate.profiles?.full_name ||
                                        "Klien"
                                      )
                                        .charAt(0)
                                        .toUpperCase()}
                                    </div>
                                    <div>
                                      <p className="text-sm font-bold text-zinc-900">
                                        {invoiceAtDate.profiles?.full_name ||
                                          "Klien"}
                                      </p>
                                      <p className="text-xs text-zinc-500">
                                        {invoiceAtDate.invoice_number}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="pt-3 border-t border-zinc-100">
                                    <p className="text-[10px] uppercase tracking-wider text-zinc-400 mb-1">
                                      Jumlah Tagihan
                                    </p>
                                    <p className="text-xl font-bold text-zinc-900">
                                      Rp{" "}
                                      {new Intl.NumberFormat("id-ID").format(
                                        invoiceAtDate.amount,
                                      )}
                                    </p>
                                  </div>
                                  <Badge className="bg-orange-100 text-orange-700 text-[10px] font-bold uppercase border-none px-3 py-1 w-full justify-center">
                                    Belum Dibayar
                                  </Badge>
                                </div>
                              </>
                            ) : null}
                          </PopoverContent>
                        </Popover>
                      ) : (
                        <button className={dayClass}>{day}</button>
                      )}
                    </div>
                  );

                  days.push(element);
                }

                // Create weeks
                for (let i = 0; i < days.length; i += 7) {
                  weeks.push(
                    <div key={`week-${i}`} className="grid grid-cols-7 gap-1">
                      {days.slice(i, i + 7)}
                    </div>,
                  );
                }

                return weeks;
              })()}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-5 border-t border-zinc-100">
              <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-zinc-400 mb-3">
                Legenda
              </p>
              <div className="flex md:flex-row flex-col md:items-center gap-4 md:justify-center">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-medium text-zinc-600">
                    Hari Ini
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-500"></span>
                  <span className="text-xs font-medium text-zinc-600">
                    Hari Libur
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                  <span className="text-xs font-medium text-zinc-600">
                    Tagihan Jatuh Tempo
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

          <Card className="border-0 shadow-xl rounded-2xl lg:col-span-2 overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white">
            <CardHeader className="bg-gradient-to-r from-zinc-50 to-zinc-50/30 border-b border-zinc-100/50 px-6 pt-6 pb-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gradient-to-br from-zinc-600 to-zinc-700 rounded-xl flex items-center justify-center shadow-lg shadow-zinc-500/30">
                    <Briefcase className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-sm md:text-base font-bold text-zinc-900">
                      Monitoring Pengerjaan
                    </CardTitle>
                    <p className="text-zinc-500 text-xs font-medium mt-0.5 flex items-center gap-1">
                      <Target className="h-3 w-3 text-zinc-500" />
                      Proyek aktif & menunggu pembayaran
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2">
                  <Target className="h-4 w-4 text-zinc-900" />
                  <p className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                    Proyek Aktif
                  </p>
                </div>
                {stats.upcomingProjects?.slice(0, 3).map((pj) => (
                  <div
                    key={pj.id}
                    className="p-4 rounded-xl bg-gradient-to-br from-zinc-50 to-white border border-zinc-100 hover:shadow-md transition-all group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm font-bold text-zinc-900 mb-1 group-hover:text-zinc-700 transition-colors">
                          {pj.name}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-medium flex items-center gap-1.5">
                          <Clock className="h-3 w-3" />
                          Deadline:{" "}
                          {new Date(pj.deadline).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                      <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center group-hover:bg-zinc-900 transition-colors">
                        <Briefcase className="h-4 w-4 text-zinc-500 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                  <p className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                    Menunggu Pembayaran
                  </p>
                </div>
                {stats.recentInvoices
                  .filter((i) => i.status === "unpaid")
                  .slice(0, 3)
                  .map((inv) => (
                    <div
                      key={inv.id}
                      className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-bold text-zinc-900 mb-1">
                            {inv.profiles?.full_name || "Klien"}
                          </p>
                          <p className="text-xs text-blue-600 font-bold flex items-center gap-1.5">
                            <DollarSign className="h-3 w-3" />
                            Rp{" "}
                            {new Intl.NumberFormat("id-ID").format(inv.amount)}
                          </p>
                        </div>
                        <Badge className="bg-orange-100 text-orange-700 text-[9px] font-bold uppercase px-2 py-1">
                          Unpaid
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
        </section>

        {/* Klien Terbaru & Invoice Terbaru - gaya CustomerDashboard */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-50/30 border-b border-blue-100/50 px-6 pt-6 pb-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <UserPlus className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-sm md:text-lg font-bold text-zinc-900 flex items-center gap-2">
                      Klien Terbaru
                      <Badge className="bg-blue-100 text-blue-700 text-[8px] font-bold px-2 py-0.5">
                        NEW
                      </Badge>
                    </CardTitle>
                    <p className="text-zinc-500 text-xs font-medium mt-0.5 flex items-center gap-1">
                      <LayoutDashboard className="h-3 w-3 text-blue-500" />
                      {stats.recentClients.length} klien terdaftar
                    </p>
                  </div>
                </div>
                <Link
                  href="/customer/users"
                  className="group cursor-pointer hidden md:inline-block"
                >
                  <Button
                    variant="ghost"
                    className="text-xs font-semibold text-zinc-600 hover:text-blue-700 px-4 h-9 rounded-xl hover:bg-blue-50 transition-all cursor-pointer"
                  >
                    Lihat Semua
                    <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-zinc-100">
                {stats.recentClients.slice(0, 5).map((client) => (
                  <Link
                    key={client.id}
                    href="/customer/users"
                    className="flex items-center gap-4 p-5 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-transparent transition-all duration-200 group cursor-pointer"
                  >
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center shadow-sm border border-blue-200/50 font-bold text-blue-700 text-lg flex-shrink-0">
                      {(client.full_name || client.email).charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-zinc-900 group-hover:text-blue-700 transition-colors truncate">
                        {client.full_name || client.email}
                      </p>
                      <p className="text-xs font-medium text-zinc-600 flex items-center gap-1.5 mt-0.5">
                        <CalendarIcon className="h-3 w-3 text-zinc-400" />
                        {new Date(client.created_at).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700 text-[9px] rounded-full font-bold uppercase px-2 py-0.5 border border-blue-200/50">
                      {client.role}
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-zinc-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-50/30 border-b border-purple-100/50 px-6 pt-6 pb-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <Receipt className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-sm md:text-lg font-bold text-zinc-900 flex items-center gap-2">
                      Invoice Terbaru
                      <Badge className="bg-purple-100 text-purple-700 text-[8px] font-bold px-2 py-0.5">
                        NEW
                      </Badge>
                    </CardTitle>
                    <p className="text-zinc-500 text-xs font-medium mt-0.5 flex items-center gap-1">
                      <LayoutDashboard className="h-3 w-3 text-purple-500" />
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
                    className="text-xs font-semibold text-zinc-600 hover:text-purple-700 px-4 h-9 rounded-xl hover:bg-purple-50 transition-all cursor-pointer"
                  >
                    Lihat Semua
                    <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-zinc-100">
                {stats.recentInvoices.slice(0, 5).map((invoice) => (
                  <Link
                    key={invoice.id}
                    href={`/customer/invoices/${invoice.id}/print`}
                    className="block p-5 hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-transparent transition-all duration-200 group cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all flex-shrink-0 border border-purple-200/50">
                          <Receipt className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="space-y-1 min-w-0">
                          <p className="text-sm font-bold text-zinc-900 group-hover:text-purple-700 transition-colors truncate uppercase tracking-tight flex items-center gap-2">
                            {invoice.invoice_number}
                            <ChevronRight className="h-3.5 w-3.5 text-zinc-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                          </p>
                          <p className="text-xs font-medium text-zinc-600 truncate flex items-center gap-1.5">
                            <CalendarIcon className="h-3 w-3 text-zinc-400" />
                            {invoice.due_date
                              ? `Tempo: ${new Date(invoice.due_date).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}`
                              : `Rp ${new Intl.NumberFormat("id-ID").format(invoice.amount)}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right space-y-1.5 flex-shrink-0">
                        <p className="text-sm font-bold text-zinc-900 tabular-nums">
                          Rp{" "}
                          {new Intl.NumberFormat("id-ID").format(invoice.amount)}
                        </p>
                        <Badge
                          className={`px-3 py-0.5 text-[9px] font-bold uppercase rounded-full border shadow-sm ${
                            invoice.status === "paid"
                              ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-emerald-100"
                              : "bg-orange-50 border-orange-200 text-orange-700 shadow-orange-100"
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
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

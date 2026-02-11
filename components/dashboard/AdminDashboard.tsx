"use client";

import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Receipt,
  TrendingUp,
  ArrowUpRight,
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
  TrendingDown,
} from "lucide-react";
import Link from "next/link";
import { Calendar } from "@/components/ui/calendar";
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

  const unpaidDates = stats.recentInvoices
    .filter((inv) => inv.status === "unpaid" && inv.due_date)
    .map((inv) => new Date(inv.due_date!));

  // Helper untuk cek apakah tanggal adalah hari libur
  const isHoliday = (date: Date) => {
    return INDONESIAN_HOLIDAYS_2026.some(
      (holiday) =>
        holiday.date.getDate() === date.getDate() &&
        holiday.date.getMonth() === date.getMonth() &&
        holiday.date.getFullYear() === date.getFullYear()
    );
  };

  // Helper untuk get nama hari libur
  const getHolidayName = (date: Date) => {
    const holiday = INDONESIAN_HOLIDAYS_2026.find(
      (h) =>
        h.date.getDate() === date.getDate() &&
        h.date.getMonth() === date.getMonth() &&
        h.date.getFullYear() === date.getFullYear()
    );
    return holiday?.name || "";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* Welcome Section - ENHANCED */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-100 pb-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="rounded-full px-3 py-1 border-zinc-900 text-[10px] font-medium uppercase tracking-widest text-zinc-900"
            >
              <Sparkles className="h-3 w-3 mr-1.5" />
              Admin Console
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 flex items-center gap-3">
            Dashboard Admin
          </h1>
          <p className="text-sm text-zinc-500 font-medium flex items-center gap-2">
            <Target className="h-4 w-4" />
            Kelola klien, invoice, dan support tickets secara efisien
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/customer/users">
            <Button
              size="sm"
              className="rounded-xl font-medium  text-xs cursor-pointer bg-white text-black hover:bg-zinc-900 hover:text-white transition-all shadow-sm"
            >
              <Users className="mr-2 h-4 w-4" />
              User Management
            </Button>
          </Link>
          <Link href="/admin/projects">
            <Button
              size="sm"
              className="rounded-xl font-medium bg-zinc-900 hover:bg-zinc-800 text-xs cursor-pointer transition-all shadow-sm"
            >
              <Briefcase className="mr-2 h-4 w-4" />
              Projects
            </Button>
          </Link>
        </div>
      </header>

      {/* Stats Grid - ENHANCED */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-zinc-200 shadow-sm rounded-2xl hover:shadow-md transition-shadow bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Total Klien
                </p>
                <p className="text-3xl font-bold text-zinc-900">
                  {stats.totalClients}
                </p>
                <p className="text-xs text-zinc-400 font-medium">Clients</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 shadow-sm rounded-2xl hover:shadow-md transition-shadow bg-gradient-to-br from-purple-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Total Invoice
                </p>
                <p className="text-3xl font-bold text-zinc-900">
                  {stats.totalInvoices}
                </p>
                <p className="text-xs text-zinc-400 font-medium">Invoices</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 shadow-sm rounded-2xl hover:shadow-md transition-shadow bg-gradient-to-br from-emerald-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Total Revenue
                </p>
                <p className="text-3xl font-bold text-zinc-900">
                  {(stats.totalRevenue / 1000000).toFixed(1)}Jt
                </p>
                <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  IDR
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 shadow-sm rounded-2xl hover:shadow-md transition-shadow bg-gradient-to-br from-orange-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Open Tickets
                </p>
                <p className="text-3xl font-bold text-zinc-900">
                  {stats.openTickets}
                </p>
                <p className="text-xs text-orange-600 font-semibold flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Active
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Card - ENHANCED */}
      <Card className="border-zinc-100 shadow-lg rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-zinc-700/20 to-transparent rounded-full blur-3xl"></div>
        <CardContent className="p-8 relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                </div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-400 font-bold">
                  Total Pendapatan Terakumulasi
                </p>
              </div>
              <p className="text-5xl font-bold">
                Rp {new Intl.NumberFormat("id-ID").format(stats.totalRevenue)}
              </p>
              <div className="flex gap-8 mt-6">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium mb-1">
                      Lunas
                    </p>
                    <p className="text-lg font-bold text-emerald-400">
                      {stats.paidInvoices} Invoice
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium mb-1">
                      Belum Lunas
                    </p>
                    <p className="text-lg font-bold text-orange-400">
                      {stats.unpaidInvoices} Invoice
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="h-32 w-32 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center">
                <TrendingUp className="h-16 w-16 text-emerald-400/50" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Calendar & Monitoring Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Widget - TIDAK DIUBAH */}
        <Card className="border-zinc-200 shadow-sm rounded-2xl lg:col-span-1 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-zinc-50 to-white border-b border-zinc-100 py-5 px-6">
            <div className="flex items-center gap-2 pt-3">
              <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center">
                <CalendarIcon className="h-4 w-4 text-white" />
              </div>
              <CardTitle className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-600">
                Kalender Proyek & Tagihan
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="p-5 bg-white">
            {/* Custom Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(
                      currentMonth.getFullYear(),
                      currentMonth.getMonth() - 1
                    )
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
                      currentMonth.getMonth() + 1
                    )
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
                      inv.status === "unpaid"
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
                                                ?.full_name || "Client"}
                                            </p>
                                            <p className="text-xs text-zinc-500">
                                              {invoiceAtDate.invoice_number}
                                            </p>
                                          </div>
                                        </div>
                                        <p className="text-base font-bold text-zinc-900 mt-2">
                                          Rp{" "}
                                          {new Intl.NumberFormat(
                                            "id-ID"
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
                                        invoiceAtDate.profiles?.full_name || "C"
                                      )
                                        .charAt(0)
                                        .toUpperCase()}
                                    </div>
                                    <div>
                                      <p className="text-sm font-bold text-zinc-900">
                                        {invoiceAtDate.profiles?.full_name ||
                                          "Client"}
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
                                        invoiceAtDate.amount
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
                    </div>
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

        {/* Monitoring Projects List - ENHANCED */}
        <Card className="border-zinc-200 shadow-sm rounded-2xl lg:col-span-2 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-zinc-50 to-white border-b border-zinc-100 py-5 px-6">
            <div className="flex items-center gap-2 pt-3">
              <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center">
                <Briefcase className="h-4 w-4 text-white" />
              </div>
              <CardTitle className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-600">
                Monitoring Pengerjaan
              </CardTitle>
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
      </div>

      {/* Recent Activity Grid - ENHANCED */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Clients - ENHANCED */}
        <Card className="border-zinc-200 shadow-sm rounded-2xl hover:shadow-md transition-shadow overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-zinc-100 py-5 px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 pt-3">
                <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <UserPlus className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-600">
                  Klien Terbaru
                </CardTitle>
              </div>
              <Link href="/customer/users">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-zinc-500 hover:text-zinc-900 font-medium hover:bg-zinc-100 rounded-lg cursor-pointer"
                >
                  Lihat Semua
                  <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-2">
              {stats.recentClients.slice(0, 5).map((client, idx) => (
                <div
                  key={client.id}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-50 transition-all border border-transparent hover:border-zinc-100"
                >
                  <div className="h-11 w-11 rounded-full bg-gradient-to-br from-zinc-900 to-zinc-700 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {(client.full_name || client.email).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-zinc-900 truncate">
                      {client.full_name || client.email}
                    </p>
                    <p className="text-xs text-zinc-400 flex items-center gap-1.5">
                      <CalendarIcon className="h-3 w-3" />
                      {new Date(client.created_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 text-[9px] rounded-lg font-bold uppercase px-2 py-1">
                    {client.role}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Invoices - ENHANCED */}
        <Card className="border-zinc-200 shadow-sm rounded-2xl hover:shadow-md transition-shadow overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-white border-b border-zinc-100 py-5 px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 pt-3">
                <div className="h-8 w-8 rounded-lg bg-purple-600 flex items-center justify-center">
                  <Receipt className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-600">
                  Invoice Terbaru
                </CardTitle>
              </div>
              <Link href="/customer/invoices">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-zinc-500 hover:text-zinc-900 font-medium hover:bg-zinc-100 rounded-lg cursor-pointer"
                >
                  Lihat Semua
                  <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-2">
              {stats.recentInvoices.slice(0, 5).map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 transition-all border border-transparent hover:border-zinc-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-50 flex items-center justify-center shadow-sm">
                      <Receipt className="h-5 w-5 text-zinc-600" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-zinc-900">
                        {invoice.invoice_number}
                      </p>
                      <p className="text-xs text-zinc-500 gap-1">
                        Rp{" "}
                        {new Intl.NumberFormat("id-ID").format(invoice.amount)}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={`rounded-lg px-3 py-1 text-[9px] font-bold uppercase ${
                      invoice.status === "paid"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {invoice.status === "paid" ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Paid
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Unpaid
                      </span>
                    )}
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

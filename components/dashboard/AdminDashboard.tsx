"use client";

import {StatCard} from "@/components/dashboard/stat-card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {
  Users,
  Receipt,
  TrendingUp,
  ArrowUpRight,
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {useState} from "react";

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
  profiles?: {full_name: string};
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
  {date: new Date(2026, 0, 1), name: "Tahun Baru 2026"},
  {date: new Date(2026, 1, 17), name: "Isra Miraj Nabi Muhammad SAW"},
  {date: new Date(2026, 1, 28), name: "Imlek 2577 Kongzili"},
  {date: new Date(2026, 2, 3), name: "Hari Suci Nyepi Tahun Baru Saka 1948"},
  {date: new Date(2026, 2, 31), name: "Hari Raya Idul Fitri 1447 H"},
  {date: new Date(2026, 3, 1), name: "Hari Raya Idul Fitri 1447 H"},
  {date: new Date(2026, 3, 3), name: "Wafat Isa Al Masih"},
  {date: new Date(2026, 4, 1), name: "Hari Buruh Internasional"},
  {date: new Date(2026, 4, 14), name: "Kenaikan Isa Al Masih"},
  {date: new Date(2026, 4, 26), name: "Hari Raya Waisak 2570"},
  {date: new Date(2026, 5, 1), name: "Hari Lahir Pancasila"},
  {date: new Date(2026, 5, 7), name: "Hari Raya Idul Adha 1447 H"},
  {date: new Date(2026, 5, 27), name: "Tahun Baru Islam 1448 H"},
  {date: new Date(2026, 7, 17), name: "Hari Kemerdekaan RI"},
  {date: new Date(2026, 8, 5), name: "Maulid Nabi Muhammad SAW"},
  {date: new Date(2026, 11, 25), name: "Hari Raya Natal"},
];

export function AdminDashboard({profile, stats}: AdminDashboardProps) {
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
              className="rounded-lg font-medium border-zinc-200 text-xs cursor-pointer hover:bg-zinc-900 hover:text-white transition-all"
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
      <Card className="border-zinc-100 shadow-sm rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-800 text-white overflow-hidden relative">
        <CardContent className="p-8">
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-medium mb-2">
                Total Pendapatan Terakumulasi
              </p>
              <p className="text-4xl font-semibold">
                Rp {new Intl.NumberFormat("id-ID").format(stats.totalRevenue)}
              </p>
              <div className="flex gap-6 mt-6">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">
                    Lunas
                  </p>
                  <p className="text-sm font-semibold text-emerald-400">
                    {stats.paidInvoices} Invoice
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">
                    Belum Lunas
                  </p>
                  <p className="text-sm font-semibold text-orange-400">
                    {stats.unpaidInvoices} Invoice
                  </p>
                </div>
              </div>
            </div>
            <TrendingUp className="h-24 w-24 text-zinc-700/50 absolute -right-4 -bottom-4 md:static md:h-16 md:w-16" />
          </div>
        </CardContent>
      </Card>

      {/* Interactive Calendar & Monitoring Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Widget - REDESIGNED */}
        <Card className="border-zinc-200 shadow-sm rounded-2xl lg:col-span-1 overflow-hidden">
          <CardHeader className="py-4 px-5 border-b border-zinc-100 bg-zinc-50/50 ">
            <CardTitle className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2 pt-4 ">
              <CalendarIcon className="h-4 w-4 text-zinc-400" />
              Kalender Proyek & Tagihan
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 bg-white">
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
                className="h-8 w-8 flex items-center justify-center hover:bg-zinc-100 rounded-md transition-colors"
              >
                <ChevronLeft className="h-4 w-4 text-zinc-600 cursor-pointer" />
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
                className="h-8 w-8 flex items-center justify-center hover:bg-zinc-100 rounded-md transition-colors"
              >
                <ChevronRight className="h-4 w-4 text-zinc-600 cursor-pointer" />
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
                                  className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full ${isToday ? "bg-white" : "bg-blue-500"}`}
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
              <div className="flex md:flex-row flex-col md:items-center gap-4">
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

        {/* Monitoring Projects List */}
        <Card className="border-zinc-100 shadow-sm rounded-2xl lg:col-span-2">
          <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 py-4 px-6">
            <CardTitle className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500 pt-4">
              Monitoring Pengerjaan
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-zinc-900 uppercase border-l-2 border-zinc-900 pl-2">
                    Proyek Aktif
                  </p>
                  {stats.upcomingProjects?.slice(0, 3).map((pj) => (
                    <div
                      key={pj.id}
                      className="p-3 rounded-xl bg-zinc-50 border border-zinc-100 flex justify-between items-center"
                    >
                      <div>
                        <p className="text-sm font-semibold text-zinc-900">
                          {pj.name}
                        </p>
                        <p className="text-[10px] text-zinc-400 font-medium">
                          Deadline:{" "}
                          {new Date(pj.deadline).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                      <Clock className="h-4 w-4 text-zinc-300" />
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-zinc-900 uppercase border-l-2 border-blue-500 pl-2">
                    Menunggu Pembayaran
                  </p>
                  {stats.recentInvoices
                    .filter((i) => i.status === "unpaid")
                    .slice(0, 3)
                    .map((inv) => (
                      <div
                        key={inv.id}
                        className="p-3 rounded-xl bg-blue-50/30 border border-blue-100"
                      >
                        <p className="text-sm font-semibold text-zinc-900">
                          {inv.profiles?.full_name || "Klien"}
                        </p>
                        <p className="text-[10px] text-blue-600 font-semibold mt-1 uppercase">
                          Rp {new Intl.NumberFormat("id-ID").format(inv.amount)}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Clients */}
        <Card className="border-zinc-100 shadow-sm rounded-2xl">
          <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 py-4 px-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500">
                Klien Terbaru
              </CardTitle>
              <Link href="/customer/users">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-zinc-500 hover:text-zinc-900 font-medium"
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
                  <div className="h-10 w-10 rounded-full bg-zinc-900 flex items-center justify-center text-white font-semibold text-sm">
                    {(client.full_name || client.email).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-zinc-900">
                      {client.full_name || client.email}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {new Date(client.created_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <Badge className="bg-zinc-100 text-zinc-600 text-[9px] rounded-full font-medium">
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
              <CardTitle className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500">
                Invoice Terbaru
              </CardTitle>
              <Link href="/customer/invoices">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-zinc-500 hover:text-zinc-900 font-medium"
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
                    className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase ${
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

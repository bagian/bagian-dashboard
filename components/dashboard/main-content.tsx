"use client";

import {StatCard} from "@/components/dashboard/stat-card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {ArrowUpRight, Folder, MessageSquare, Clock} from "lucide-react";
import {User} from "@supabase/supabase-js";

interface DashboardProps {
  profile: {email?: string; role?: string} | null;
  userAuth: User | null;
}

export function AlternativeDashboard({profile, userAuth}: DashboardProps) {
  const emailToUse = profile?.email || userAuth?.email || "User";
  const displayName = emailToUse !== "User" ? emailToUse.split("@")[0] : "User";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Welcome Section - Refined Typography */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-100 pb-8">
        <div className="space-y-2">
          <Badge
            variant="outline"
            className="rounded-full px-3 py-0.5 border-zinc-200 text-[10px] font-medium uppercase tracking-widest text-zinc-400"
          >
            Console v1.0
          </Badge>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-900">
            Selamat datang,{" "}
            <span className="text-zinc-500 font-normal capitalize">
              {displayName}
            </span>
            .
          </h1>
          <p className="text-sm text-zinc-400 font-medium">
            Pantau aktivitas dan status projek Anda secara real-time.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg font-medium border-zinc-200 text-xs shadow-sm"
          >
            Bantuan
          </Button>
          <Button
            size="sm"
            className="rounded-lg font-medium bg-zinc-900 hover:bg-zinc-800 text-white text-xs shadow-sm"
          >
            Live Site <ArrowUpRight className="ml-2 h-3 w-3" />
          </Button>
        </div>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {/* Stats Section - Subtle design */}
        <div className="md:col-span-2 lg:col-span-2 space-y-6">
          <StatCard title="Projek Aktif" value="01" suffix="Site" />
          <StatCard title="Status Pembayaran" value="Lunas" accent="emerald" />
        </div>

        {/* Current Sprint Card - Less Bold */}
        <div className="md:col-span-2 lg:col-span-4 bg-black text-white border border-zinc-100 rounded-2xl p-8 relative overflow-hidden group shadow-sm">
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <Badge className="bg-zinc-800 text-zinc-200 font-bold text-[9px] uppercase tracking-widest hover:bg-zinc-700 transition-colors border-none p-2 px-6">
                Sedang Dikerjakan
              </Badge>
              <span className="text-zinc-400 font-medium text-[11px]">
                Februari 2026
              </span>
            </div>
            <div className="mt-8">
              <h2 className="text-xl font-semibold tracking-tight">
                Slicing Next.js & Supabase Integration
              </h2>
              <p className="text-zinc-500 mt-3 max-w-md text-sm leading-relaxed font-medium">
                Kami sedang mengintegrasikan sistem tiket bantuan agar Anda
                dapat berinteraksi langsung dengan tim pengembang secara instan.
              </p>
            </div>
          </div>
        </div>

        {/* Activity Log - Clean spacing */}
        <div className="md:col-span-4 lg:col-span-4 bg-white border border-zinc-100 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-semibold text-xs text-zinc-400 uppercase tracking-widest">
              Aktivitas Terakhir
            </h3>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          </div>
          <div className="space-y-6">
            {[
              {
                icon: Folder,
                text: "Aset desain baru telah diunggah ke folder projek",
                time: "2 jam yang lalu",
              },
              {
                icon: MessageSquare,
                text: "Tiket bantuan #021 telah diselesaikan",
                time: "5 jam yang lalu",
              },
              {
                icon: Clock,
                text: "Fase Frontend Integration dimulai",
                time: "Kemarin",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="h-8 w-8 rounded-lg bg-zinc-50 flex items-center justify-center shrink-0 border border-gray-200">
                  <item.icon className="h-3.5 w-3.5 text-zinc-500" />
                </div>
                <div>
                  <p className="text-sm text-zinc-700 leading-snug font-medium">
                    {item.text}
                  </p>
                  <p className="text-[10px] text-zinc-400 mt-1 uppercase font-semibold tracking-wider">
                    {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Card - Subtle Tones */}
        <div className="md:col-span-2 lg:col-span-2 bg-black rounded-2xl p-8 flex flex-col justify-between shadow-sm text-white">
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-widest">
              Dukungan
            </h3>
            <p className="text-sm font-medium mt-4 leading-relaxed text-zinc-400">
              Butuh bantuan teknis atau ingin konsultasi fitur baru?
            </p>
          </div>
          <Button className="w-full mt-6 rounded-xl bg-white border border-zinc-200 text-zinc-900 hover:bg-zinc-100 font-semibold text-xs py-5 shadow-sm">
            Buka Tiket Baru
          </Button>
        </div>
      </div>
    </div>
  );
}

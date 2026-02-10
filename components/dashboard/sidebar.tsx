"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {
  LayoutDashboard,
  Ticket,
  Users,
  LogOut,
  ChevronRight,
  Receipt,
  UserCircle,
} from "lucide-react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {supabase} from "@/lib/supabase/client";

export function Sidebar({role, className}: {role: string; className?: string}) {
  const pathname = usePathname();

  const routes = [
    {label: "Overview", icon: LayoutDashboard, href: "/customer"},
    {label: "Support Tickets", icon: Ticket, href: "/customer/tickets"},
    {
      label: "Keuangan",
      icon: Receipt,
      href: "/customer/invoices",
    },
    {
      label: "Akun User",
      icon: UserCircle,
      href: "/customer/profile",
    },
    {
      label: "Clients",
      icon: Users,
      href: "/admin/clients",
      adminOnly: true,
    },
  ];

  const onLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-white border-r border-zinc-200 w-64",
        className,
      )}
    >
      <div className="p-6 h-16 flex items-center border-b border-zinc-50">
        <h1 className="text-xl font-black tracking-tighter italic">BAGIAN.</h1>
      </div>

      <div className="flex-1 px-4 py-6 space-y-1">
        {routes.map((route) => {
          if (route.adminOnly && role !== "admin") return null;
          const isActive = pathname === route.href;

          return (
            <Link key={route.href} href={route.href} className="py-1 block">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-between group px-3 h-10 transition-all cursor-pointer",
                  isActive
                    ? "bg-zinc-900 text-white hover:bg-zinc-800 hover:text-white"
                    : "text-zinc-500 hover:text-zinc-900",
                )}
              >
                <div className="flex items-center gap-3">
                  <route.icon
                    className={cn(
                      "h-4 w-4",
                      isActive
                        ? "text-white"
                        : "text-zinc-400 group-hover:text-zinc-900",
                    )}
                  />
                  <span className="text-sm font-medium">{route.label}</span>
                </div>
                {isActive && <ChevronRight className="h-3 w-3" />}
              </Button>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-zinc-100 mt-auto">
        <Button
          variant="ghost"
          className="w-full justify-start text-zinc-500 hover:text-red-600 hover:bg-red-50 transition-all group"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4 mr-3 group-hover:translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Logout</span>
        </Button>
      </div>
    </div>
  );
}

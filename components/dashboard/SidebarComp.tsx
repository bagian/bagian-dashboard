"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Ticket,
  Users,
  LogOut,
  ChevronRight,
  Receipt,
  UserCircle,
  Settings,
  FolderKanban, // Ikon untuk Projects
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

interface SidebarProps {
  role?: string;
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({
  role: initialRole = "customer",
  className,
  onNavigate,
}: SidebarProps) {
  const pathname = usePathname();

  const [userRole, setUserRole] = useState<string>(initialRole.toLowerCase());
  const [userEmail, setUserEmail] = useState<string>("");
  const [isInitializing, setIsInitializing] = useState(true); // State loading baru agar sidebar menunggu data

  useEffect(() => {
    let isMounted = true;

    const fetchUserAndRole = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user && isMounted) {
          setUserEmail(user.email || "");

          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

          if (profile?.role) {
            setUserRole(profile.role.toLowerCase());
          } else {
            setUserRole("customer");
          }
        }
      } catch (error) {
        console.error("❌ Error fetching role:", error);
        if (isMounted) setUserRole("customer");
      } finally {
        if (isMounted) setIsInitializing(false); // Selesai loading
      }
    };

    fetchUserAndRole();

    return () => {
      isMounted = false;
    };
  }, []);

  const routes = [
    {
      label: "Overview",
      icon: LayoutDashboard,
      href: "/customer",
      adminOnly: false,
    },
    {
      label: "Support Tickets",
      icon: Ticket,
      href: "/customer/tickets",
      adminOnly: false,
    },
    {
      label: "Invoices",
      icon: Receipt,
      href: "/customer/invoices",
      adminOnly: false,
    },
    {
      label: "Akun User",
      icon: UserCircle,
      href: "/customer/profile",
      adminOnly: false,
    },
    // Rute Projects diletakkan sebagai adminOnly
    {
      label: "Projects",
      icon: FolderKanban,
      href: "/admin/projects",
      adminOnly: true,
    },
    {
      label: "User Management",
      icon: Settings,
      href: "/customer/users",
      adminOnly: true,
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
        "flex flex-col h-full bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 w-64",
        className
      )}
    >
      <div className="p-6 h-16 flex items-center border-b border-zinc-50 dark:border-zinc-900">
        <h1 className="text-xl font-black tracking-tighter italic text-black dark:text-white">
          BAGIAN.
        </h1>
      </div>

      <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {/* Opsional: Render kerangka/loading state kecil saat mengecek akses agar tidak tiba-tiba muncul */}
        {isInitializing ? (
          <div className="animate-pulse space-y-3">
            <div className="h-8 bg-zinc-100 dark:bg-zinc-800 rounded w-full"></div>
            <div className="h-8 bg-zinc-100 dark:bg-zinc-800 rounded w-full"></div>
            <div className="h-8 bg-zinc-100 dark:bg-zinc-800 rounded w-full"></div>
          </div>
        ) : (
          routes.map((route) => {
            // 1. Cek dari Role Database
            const isRoleAdmin =
              userRole === "admin" || userRole === "superadmin";

            // 2. Cek dari Jalur Pintas Email
            const isManagementEmail =
              userEmail === "superadmin@bagian.web.id" ||
              userEmail === "admin@bagian.web.id" ||
              userEmail === "gilang@bagian.web.id";

            // 3. Gabungkan aksesnya (Hanya muncul jika admin)
            const isAdmin = isRoleAdmin || isManagementEmail;

            // Jika rute ini adminOnly tapi user BUKAN admin, jangan dirender (disembunyikan dari user biasa)
            const isAllowed = !route.adminOnly || isAdmin;

            if (!isAllowed) return null;

            const isActive = pathname === route.href;

            return (
              <Link key={route.href} href={route.href} className="py-1 block">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-between group px-3 h-10 transition-all cursor-pointer",
                    isActive
                      ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 hover:text-white dark:hover:text-zinc-900"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                  )}
                  onClick={onNavigate}
                >
                  <div className="flex items-center gap-3">
                    <route.icon
                      className={cn(
                        "h-4 w-4",
                        isActive
                          ? "text-white dark:text-zinc-900"
                          : "text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100"
                      )}
                    />
                    <span className="text-sm font-medium">{route.label}</span>
                  </div>
                  {isActive && <ChevronRight className="h-3 w-3" />}
                </Button>
              </Link>
            );
          })
        )}
      </div>

      <div className="p-4 border-t border-zinc-100 dark:border-zinc-900 mt-auto">
        <Button
          variant="ghost"
          className="w-full justify-start text-zinc-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/25 transition-all group cursor-pointer"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4 mr-3 group-hover:translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Logout</span>
        </Button>
      </div>
    </div>
  );
}

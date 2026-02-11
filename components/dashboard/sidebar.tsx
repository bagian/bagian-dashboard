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
  Settings,
} from "lucide-react";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {supabase} from "@/lib/supabase/client";
import {useEffect, useState} from "react";

interface SidebarProps {
  role?: string;
  className?: string;
}

export function Sidebar({
  role: initialRole = "customer",
  className,
}: SidebarProps) {
  const pathname = usePathname();

  // Initialize state with initialRole to avoid synchronous setState in useEffect
  const [userRole, setUserRole] = useState<string>(initialRole.toLowerCase());
  const [hasFetched, setHasFetched] = useState(false);

  // Fetch role dari database jika initialRole adalah "customer" atau undefined
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const {
          data: {user},
        } = await supabase.auth.getUser();

        if (user) {
          const {data: profile} = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

          if (profile?.role) {
            console.log("✅ Role fetched from client:", profile.role);
            setUserRole(profile.role.toLowerCase());
            setHasFetched(true);
          } else {
            console.warn("⚠️ Profile not found, using default role");
            setUserRole("customer");
          }
        }
      } catch (error) {
        console.error("❌ Error fetching role:", error);
        setUserRole("customer");
      }
    };

    // Only fetch if we haven't fetched yet and the initial role is the default "customer"
    if (!hasFetched && (initialRole === "customer" || !initialRole)) {
      fetchRole();
    }
  }, [initialRole, hasFetched]);

  // Debugging
  console.log("🔍 Sidebar - Initial role:", initialRole);
  console.log("🔍 Sidebar - Current role:", userRole);

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
    // MENU BARU: User Management
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
        "flex flex-col h-full bg-white border-r border-zinc-200 w-64",
        className,
      )}
    >
      <div className="p-6 h-16 flex items-center border-b border-zinc-50">
        <h1 className="text-xl font-black tracking-tighter italic">BAGIAN.</h1>
      </div>

      <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {routes.map((route) => {
          // Cek apakah user adalah admin atau superadmin
          const isAdmin = userRole === "admin" || userRole === "superadmin";

          // Jaring Pengaman Akses
          const isAllowed = !route.adminOnly || isAdmin;

          // Debugging untuk menu admin
          if (route.adminOnly) {
            console.log(`📋 Menu: ${route.label}`);
            console.log(`   - User Role: ${userRole}`);
            console.log(`   - Is Admin: ${isAdmin}`);
            console.log(`   - Is Allowed: ${isAllowed}`);
          }

          if (!isAllowed) return null;

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
          className="w-full justify-start text-zinc-500 hover:text-red-600 hover:bg-red-50 transition-all group cursor-pointer"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4 mr-3 group-hover:translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Logout</span>
        </Button>
      </div>
    </div>
  );
}

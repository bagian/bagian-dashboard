"use client";

import { Menu, Sun, Moon } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useTheme } from "next-themes";

import { Sidebar } from "./SidebarComp";
import { supabase } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";

interface TopbarProps {
  user: User | null;
  profile: {
    role?: string;
    email?: string;
    full_name?: string | null;
  } | null;
}

export function Topbar({ user, profile }: TopbarProps) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [invoiceTitle, setInvoiceTitle] = useState<string | null>(null);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchInvoice = async () => {
      const invoiceId = pathSegments[2];
      // contoh: customer / invoices / {id} / print

      if (pathSegments[1] === "invoices" && invoiceId) {
        const { data, error } = await supabase
          .from("invoices")
          .select("invoice_number") // atau name / title
          .eq("id", invoiceId)
          .single();

        if (!error && data) {
          setInvoiceTitle(data.invoice_number);
        }
      }
    };

    fetchInvoice();
  }, [pathname]);

  return (
    <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 md:px-8">
      <div className="flex items-center gap-4">
        {/* Mobile Menu */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <button className="md:hidden p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors text-zinc-900 dark:text-zinc-100">
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 border-none bg-white dark:bg-zinc-950">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
              <SheetDescription>
                Akses menu dashboard Bagian Projects
              </SheetDescription>
            </SheetHeader>

            <Sidebar
              role={profile?.role || "customer"}
              className="border-none w-full"
              onNavigate={() => setIsMobileMenuOpen(false)}
            />
          </SheetContent>
        </Sheet>

        {/* Desktop Breadcrumbs */}
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/customer"
                className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            {pathSegments.map(
              (segment, index) =>
                segment !== "customer" && (
                  <div key={index} className="flex items-center gap-2">
                    <BreadcrumbSeparator className="text-zinc-300 dark:text-zinc-700" />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="capitalize text-[11px] font-bold tracking-widest text-zinc-900 dark:text-zinc-100">
                        {pathSegments[1] === "invoices" &&
                          pathSegments[2] === segment &&
                          invoiceTitle
                          ? invoiceTitle
                          : segment}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </div>
                ),
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-4">
        {/* Toggle Theme */}
        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="p-2 hover:bg-zinc-100 bg-zinc-100/50 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer dark:bg-zinc-900"
          aria-label="Toggle Theme"
        >
          {mounted && resolvedTheme === "dark" ? (
            <Sun className="h-5 w-5 animate-in fade-in zoom-in duration-300" />
          ) : (
            <Moon className="h-5 w-5 animate-in fade-in zoom-in duration-300" />
          )}
        </button>

        {/* 2. Ubah bagian tampilan nama di sini */}
        <div className="text-right hidden sm:block">
          <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-none">
            {/* Tampilkan Full Name, jika kosong tampilkan email/role sebagai fallback */}
            {profile?.full_name || "User"}
          </p>
          <p className="text-[12px] text-zinc-400 dark:text-zinc-500 mt-1">
            {profile?.email || "Client"}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none cursor-pointer">
            <Avatar className="h-9 w-9 border-2 border-zinc-50 dark:border-zinc-900 ring-2 ring-zinc-100 dark:ring-zinc-800 transition-all hover:ring-zinc-900 dark:hover:ring-white">
              <AvatarFallback className="bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-[10px] font-bold">
                {/* Gunakan inisial dari full_name jika tersedia */}
                {profile?.full_name
                  ? profile.full_name.substring(0, 2).toUpperCase()
                  : profile?.email?.substring(0, 2).toUpperCase() || "US"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 mt-2 shadow-xl border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-xl"
          >
            <DropdownMenuLabel className="font-bold text-zinc-900 dark:text-zinc-100">
              My Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />

            <Link href="/customer/profile">
              <DropdownMenuItem className="cursor-pointer text-sm py-2 text-zinc-600 dark:text-zinc-400 focus:text-zinc-900 dark:focus:text-zinc-100 focus:bg-zinc-50 dark:focus:bg-zinc-900">
                Settings
              </DropdownMenuItem>
            </Link>

            <Link href="/customer/tickets">
              <DropdownMenuItem className="cursor-pointer text-sm py-2 text-zinc-600 dark:text-zinc-400 focus:text-zinc-900 dark:focus:text-zinc-100 focus:bg-zinc-50 dark:focus:bg-zinc-900">
                Support
              </DropdownMenuItem>
            </Link>

            <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />

            <DropdownMenuItem
              className="text-red-600 dark:text-red-400 font-medium cursor-pointer py-2 focus:bg-red-50 dark:focus:bg-red-950/20 focus:text-red-600 dark:focus:text-red-400"
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = "/login";
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

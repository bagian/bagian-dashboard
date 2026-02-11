"use client";

import { Menu } from "lucide-react";
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
import { useState } from "react";

// 1. Tambahkan full_name ke dalam Interface props
interface TopbarProps {
  user: User | null;
  profile: {
    role?: string;
    email?: string;
    full_name?: string | null; // Tambahkan ini
  } | null;
}

export function Topbar({ user, profile }: TopbarProps) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="h-16 border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 md:px-8">
      <div className="flex items-center gap-4">
        {/* Mobile Menu */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <button className="md:hidden p-2 hover:bg-zinc-100 rounded-md transition-colors">
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 border-none">
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
                className="text-[11px] font-bold uppercase tracking-widest text-zinc-400"
              >
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            {pathSegments.map(
              (segment, index) =>
                segment !== "customer" && (
                  <div key={index} className="flex items-center gap-2">
                    <BreadcrumbSeparator className="text-zinc-300" />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="capitalize text-[11px] font-bold tracking-widest text-zinc-900">
                        {segment}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </div>
                )
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-4">
        {/* 2. Ubah bagian tampilan nama di sini */}
        <div className="text-right hidden sm:block">
          <p className="text-xs font-bold text-zinc-900 leading-none">
            {/* Tampilkan Full Name, jika kosong tampilkan email/role sebagai fallback */}
            {profile?.full_name || "User"}
          </p>
          <p className="text-[12px] text-zinc-400 mt-1">
            {profile?.email || "Client"}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none cursor-pointer">
            <Avatar className="h-9 w-9 border-2 border-zinc-50 ring-2 ring-zinc-100 transition-all hover:ring-zinc-900">
              <AvatarFallback className="bg-zinc-950 text-white text-[10px] font-bold">
                {/* Gunakan inisial dari full_name jika tersedia */}
                {profile?.full_name
                  ? profile.full_name.substring(0, 2).toUpperCase()
                  : profile?.email?.substring(0, 2).toUpperCase() || "US"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 mt-2 shadow-xl border-zinc-100 rounded-xl"
          >
            <DropdownMenuLabel className="font-bold text-zinc-900">
              My Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-100" />

            <Link href="/customer/profile">
              <DropdownMenuItem className="cursor-pointer text-sm py-2 text-zinc-600 focus:text-zinc-900 focus:bg-zinc-50">
                Settings
              </DropdownMenuItem>
            </Link>

            <Link href="/customer/tickets">
              <DropdownMenuItem className="cursor-pointer text-sm py-2 text-zinc-600 focus:text-zinc-900 focus:bg-zinc-50">
                Support
              </DropdownMenuItem>
            </Link>

            <DropdownMenuSeparator className="bg-zinc-100" />

            <DropdownMenuItem
              className="text-red-600 font-medium cursor-pointer py-2 focus:bg-red-50 focus:text-red-600"
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

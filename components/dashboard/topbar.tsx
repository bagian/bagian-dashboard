"use client";

import {Menu} from "lucide-react";
import {usePathname} from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {Sidebar} from "./sidebar";
import {supabase} from "@/lib/supabase/client";
import {User} from "@supabase/supabase-js";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
interface TopbarProps {
  user: User | null;
  profile: {role?: string; email?: string} | null;
}

export function Topbar({user, profile}: TopbarProps) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  return (
    <header className="h-16 border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 md:px-8">
      <div className="flex items-center gap-4">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="md:hidden p-2 hover:bg-zinc-100 rounded-md transition-colors">
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 border-none">
            {/* Penyelamat Accessibility: SheetTitle wajib ada */}
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
              <SheetDescription>
                Akses menu dashboard Bagian Projects
              </SheetDescription>
            </SheetHeader>

            {/* Render Sidebar di dalam Sheet tanpa class h-full tambahan yang merusak layout */}
            <Sidebar
              role={profile?.role || "customer"}
              className="border-none w-full"
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
                BAGIAN
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
                ),
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-bold text-zinc-900 leading-none capitalize">
            {profile?.role || "Client"}
          </p>
          <p className="text-[10px] text-zinc-400 mt-1">{profile?.email}</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <Avatar className="h-9 w-9 border-2 border-zinc-50 ring-2 ring-zinc-100 transition-all hover:ring-zinc-900">
              <AvatarFallback className="bg-zinc-950 text-white text-[10px] font-bold">
                {profile?.email?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 mt-2 shadow-xl border-zinc-100"
          >
            <DropdownMenuLabel className="font-bold">
              My Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-sm py-2">
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-sm py-2">
              Support
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 font-medium cursor-pointer py-2"
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

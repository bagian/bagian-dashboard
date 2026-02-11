"use client";

import {Button} from "@/components/ui/button";
import {ChevronLeft, ChevronRight} from "lucide-react";
import Link from "next/link";
import {usePathname, useSearchParams} from "next/navigation";

export function Pagination({totalPages}: {totalPages: number}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  if (totalPages <= 1) return null;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-100 bg-zinc-50/30">
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex gap-2">
        <Link href={createPageURL(currentPage - 1)}>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            className="h-8 w-8 p-0 rounded-lg border-zinc-200 bg-white"
          >
            <ChevronLeft className="h-4 w-4 text-zinc-600" />
          </Button>
        </Link>
        <Link href={createPageURL(currentPage + 1)}>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            className="h-8 w-8 p-0 rounded-lg border-zinc-200 bg-white"
          >
            <ChevronRight className="h-4 w-4 text-zinc-600" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

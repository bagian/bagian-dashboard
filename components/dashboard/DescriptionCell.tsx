"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export function DescriptionCell({ description }: { description?: string | null }) {
    const [isOpen, setIsOpen] = useState(false);

    if (!description) {
        return <span className="text-xs text-zinc-400 font-medium">-</span>;
    }

    return (
        <>
            <p
                onClick={() => setIsOpen(true)}
                className="text-xs text-zinc-600 dark:text-zinc-350 line-clamp-2 font-medium cursor-pointer hover:underline hover:text-zinc-900 dark:hover:text-zinc-100 transition-all"
                title="Klik untuk melihat selengkapnya"
            >
                {description}
            </p>

            {/* Modal / Dialog Popup */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent
                    onPointerDownOutside={(e) => e.preventDefault()}
                    onEscapeKeyDown={(e) => e.preventDefault()}
                    className="sm:max-w-[500px] rounded-2xl border-none dark:border dark:border-zinc-800 shadow-2xl bg-white dark:bg-zinc-950 [&>button]:top-[26px] [&>button]:right-6"
                >
                    <DialogHeader className="border-b border-zinc-100 dark:border-zinc-800 pb-4">
                        <DialogTitle className="font-semibold text-xl tracking-tight text-zinc-900 dark:text-zinc-100">
                            Rincian Deskripsi
                        </DialogTitle>
                    </DialogHeader>

                    <div className="mt-2 max-h-[60vh] overflow-y-auto pr-2">
                        <p className="text-sm text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed font-medium">
                            {description}
                        </p>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
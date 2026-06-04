import { createSupabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { GlobalActions } from "@/components/dashboard/GlobalActions"; // ✅ Menggunakan GlobalActions
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderKanban } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { CreateProjectModal } from "@/components/dashboard/CreateProjectModal"; // ✅ Import Modal

export const revalidate = 0;
export const dynamic = "force-dynamic";

interface Project {
  id: string;
  name: string;
  client_id: string;
  status: string;
  deadline: string | null;
  created_at: string;
  description?: string;
}

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role?: string;
}

export default async function ProjectsPage() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="p-8 text-center font-medium">Silahkan login kembali.</div>
    );
  }

  // 1. Ambil data Profiles dan Projects secara paralel
  let allProfiles: Profile[] = [];
  let allProjects: Project[] = [];

  try {
    const [profilesRes, projectsRes] = await Promise.all([
      supabaseAdmin.from("profiles").select("id, email, full_name, role"),
      supabaseAdmin
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

    allProfiles = profilesRes.data || [];
    allProjects = projectsRes.data || [];
  } catch (error) {
    console.error("Gagal mengambil data:", error);
  }

  // 2. Gabungkan data (Mapping manual karena fetch terpisah)
  const displayData = allProjects.map((proj) => {
    const client = allProfiles.find((p) => p.id === proj.client_id);
    return {
      ...proj,
      client_name: client?.full_name || "Client",
      client_email: client?.email || "Email tidak ditemukan",
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* HEADER */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 uppercase">
            Projects
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manajemen proyek, klien, dan rincian pekerjaan.
          </p>
        </div>

        {/* ✅ MODAL CREATE PROJECT */}
        <CreateProjectModal clients={allProfiles} />
      </header>

      {/* TABEL PROYEK */}
      <Card className="border-zinc-100 dark:border-zinc-800 shadow-sm rounded-2xl overflow-hidden bg-white dark:bg-zinc-950">
        <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800 py-4 px-6">
          <div className="flex items-center gap-2 pt-4">
            <FolderKanban className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">
              Active Projects
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/20">
                <TableHead className="pl-8 text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-455 h-12">
                  Project Name
                </TableHead>
                <TableHead className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-455">
                  Client
                </TableHead>
                <TableHead className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-455">
                  Status
                </TableHead>
                <TableHead className="text-right text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-455">
                  Deadline
                </TableHead>
                <TableHead className="pr-8 text-right text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-455 h-12">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-48 text-center italic text-zinc-400 dark:text-zinc-500 text-sm"
                  >
                    Belum ada proyek. Silahkan buat proyek baru.
                  </TableCell>
                </TableRow>
              ) : (
                displayData.map((proj) => (
                  <TableRow
                    key={proj.id}
                    className="border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-all cursor-pointer"
                  >
                    <TableCell className="pl-8 py-5">
                      <p className="font-bold text-zinc-900 dark:text-zinc-100">{proj.name}</p>
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-1">
                        ID: {proj.id.substring(0, 8)}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="font-bold text-zinc-700 dark:text-zinc-300 text-xs">
                        {proj.client_name}
                      </p>
                      <p className="text-zinc-400 dark:text-zinc-500 text-[10px]">
                        {proj.client_email}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-full px-3 py-1 text-[9px] font-bold uppercase border-none shadow-none",
                          proj.status === "completed"
                            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                            : proj.status === "in_progress"
                              ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400",
                        )}
                      >
                        {proj.status?.replace("_", " ") || "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold text-zinc-900 dark:text-zinc-100 text-xs">
                      {proj.deadline
                        ? new Date(proj.deadline).toLocaleDateString("id-ID")
                        : "-"}
                    </TableCell>

                    {/* ✅ AKSI: Menggunakan GlobalActions */}
                    <TableCell className="pr-8 text-right">
                      <GlobalActions
                        id={proj.id}
                        status={proj.status}
                        type="project"
                        tableName="projects"
                        editPayload={proj}
                        clients={allProfiles}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

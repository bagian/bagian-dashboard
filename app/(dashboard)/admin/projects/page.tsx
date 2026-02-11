import {createSupabaseServer} from "@/lib/supabase/server";
import {supabaseAdmin} from "@/lib/supabase/admin";
// KUNCI PERUBAHAN 1: Hapus import ProjectActions, ganti dengan GlobalActions
import {GlobalActions} from "@/components/dashboard/GlobalActions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {FolderKanban, MoreVertical} from "lucide-react";
import {cn} from "@/lib/utils";
import Link from "next/link";
import {CreateProjectModal} from "@/components/dashboard/CreateProjectModal";

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
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="p-8 text-center font-medium">Silahkan login kembali.</div>
    );
  }

  // 1. Ambil data
  let allProfiles: Profile[] = [];
  let allProjects: Project[] = [];

  try {
    const [profilesRes, projectsRes] = await Promise.all([
      supabaseAdmin.from("profiles").select("id, email, full_name, role"),
      supabaseAdmin
        .from("projects")
        .select("*")
        .order("created_at", {ascending: false}),
    ]);

    allProfiles = profilesRes.data || [];
    allProjects = projectsRes.data || [];
  } catch (error) {
    console.error("Tabel projects mungkin belum dibuat:", error);
  }

  // 2. Gabungkan data
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
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 uppercase">
            Projects
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Manajemen proyek, klien, dan rincian pekerjaan.
          </p>
        </div>

        {/* PANGGIL MODAL DI SINI */}
        <CreateProjectModal clients={allProfiles} />
      </header>

      {/* TABEL PROYEK */}
      <Card className="border-zinc-100 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 py-4 px-6">
          <div className="flex items-center gap-2 pt-4">
            <FolderKanban className="h-4 w-4 text-zinc-400" />
            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
              Active Projects
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-zinc-50 bg-zinc-50/30">
                <TableHead className="pl-8 text-[10px] uppercase font-bold text-zinc-500 h-12">
                  Project Name
                </TableHead>
                <TableHead className="text-[10px] uppercase font-bold text-zinc-500">
                  Client
                </TableHead>
                <TableHead className="text-[10px] uppercase font-bold text-zinc-500">
                  Status
                </TableHead>
                <TableHead className="text-right text-[10px] uppercase font-bold text-zinc-500">
                  Deadline
                </TableHead>
                <TableHead className="pr-8 text-right text-[10px] uppercase font-bold text-zinc-500 h-12">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-48 text-center italic text-zinc-400 text-sm"
                  >
                    Belum ada proyek. Silahkan buat proyek baru.
                  </TableCell>
                </TableRow>
              ) : (
                displayData.map((proj) => (
                  <TableRow
                    key={proj.id}
                    className="border-zinc-50 hover:bg-zinc-50/50 transition-all cursor-pointer"
                  >
                    <TableCell className="pl-8 py-5">
                      <p className="font-bold text-zinc-900">{proj.name}</p>
                      <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-1">
                        ID: {proj.id.substring(0, 8)}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="font-bold text-zinc-700 text-xs">
                        {proj.client_name}
                      </p>
                      <p className="text-zinc-400 text-[10px]">
                        {proj.client_email}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-full px-3 py-1 text-[9px] font-bold uppercase border-none shadow-none",
                          proj.status === "completed"
                            ? "bg-emerald-50 text-emerald-600"
                            : proj.status === "in_progress"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-zinc-100 text-zinc-600",
                        )}
                      >
                        {proj.status?.replace("_", " ") || "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold text-zinc-900 text-xs">
                      {proj.deadline
                        ? new Date(proj.deadline).toLocaleDateString("id-ID")
                        : "-"}
                    </TableCell>

                    {/* KUNCI PERUBAHAN 2: Pemanggilan GlobalActions */}
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

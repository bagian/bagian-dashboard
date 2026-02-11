import { createSupabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CreateTicketModal from "@/components/dashboard/CreateTicketsModal";
import { GlobalActions } from "@/components/dashboard/GlobalActions";
import { Pagination } from "@/components/dashboard/Pagination";

export const revalidate = 0;

const statusVariant = {
  open: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  closed: "bg-zinc-100 text-zinc-600 border border-zinc-200",
};

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return (
      <div className="p-8 text-center font-medium">Silahkan login kembali.</div>
    );

  // 1. Ambil Data Profil & Daftar Semua User secara paralel
  const [profileRes, clientsRes] = await Promise.all([
    supabaseAdmin.from("profiles").select("role").eq("id", user.id).single(),
    supabaseAdmin.from("profiles").select("id, email, full_name, role"),
  ]);

  // Cek apakah user saat ini adalah Admin/Superadmin
  const isAdmin =
    profileRes.data?.role === "admin" ||
    profileRes.data?.role === "superadmin" ||
    user.email === "superadmin@bagian.web.id";

  // LOGIKA FILTER: Hanya ambil user yang role-nya bukan admin/superadmin untuk dropdown modal
  const allClientsRaw = clientsRes.data || [];
  const allClients = allClientsRaw.filter((client) => {
    const role = client.role?.toLowerCase() || "user";
    return role !== "admin" && role !== "superadmin" && role !== "super admin";
  });

  // 2. Logika Pagination
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;
  const itemsPerPage = 10;
  const from = (currentPage - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  // 3. Fetch Tickets (Admin lihat semua, User lihat miliknya sendiri)
  let query = supabaseAdmin
    .from("tickets")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (!isAdmin) {
    query = query.eq("user_id", user.id);
  }

  const { data: tickets, count } = await query;
  const allTickets = tickets || [];
  const totalPages = Math.ceil((count || 0) / itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-8 space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">
            Support Tickets
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Track and manage your project requests.
          </p>
        </div>
        {/* Mengirim data clients yang sudah difilter dan status admin ke modal */}
        <CreateTicketModal
          userId={user.id}
          clients={allClients}
          isAdmin={isAdmin}
        />
      </div>

      {/* TABLE SECTION */}
      <Card className="border-zinc-200 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardHeader className="border-b bg-zinc-50/60 py-4 px-6">
          <CardTitle className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
            Active Requests
          </CardTitle>
          <CardDescription className="text-xs ">
            Showing {allTickets.length} ticket(s)
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {allTickets.length === 0 ? (
            <div className="py-24 text-center text-sm text-zinc-400 ">
              No tickets yet. Create one to get started 🚀
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="bg-zinc-50/50 hover:bg-zinc-50/50">
                    <TableHead className="pl-6 text-[10px] uppercase font-bold text-zinc-500 h-12">
                      Subject
                    </TableHead>
                    <TableHead className="text-[10px] uppercase font-bold text-zinc-500">
                      Status
                    </TableHead>
                    <TableHead className="text-[10px] uppercase font-bold text-zinc-500">
                      Created
                    </TableHead>
                    <TableHead className="text-[10px] uppercase font-bold text-zinc-500">
                      Deskripsi
                    </TableHead>
                    {isAdmin && (
                      <TableHead className="text-right pr-6 text-[10px] uppercase font-bold text-zinc-500">
                        Aksi
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {allTickets.map((ticket) => (
                    <TableRow
                      key={ticket.id}
                      className="transition hover:bg-zinc-50/30 border-zinc-50"
                    >
                      <TableCell className="pl-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-zinc-900 text-sm">
                            {ticket.subject}
                          </span>
                          <span className="text-[10px] text-zinc-400 uppercase tracking-widest mt-0.5">
                            ID: {ticket.id.substring(0, 8)}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                            statusVariant[ticket.status as "open" | "closed"] ||
                            statusVariant.open
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </TableCell>

                      <TableCell className="text-sm text-zinc-500 font-medium">
                        {new Date(ticket.created_at).toLocaleDateString(
                          "id-ID"
                        )}
                      </TableCell>

                      {/* DATA DESKRIPSI BARU */}
                      <TableCell className="max-w-[300px]">
                        <p className="text-xs text-zinc-600 line-clamp-2 font-medium">
                          {ticket.description || "-"}
                        </p>
                      </TableCell>

                      {isAdmin && (
                        <TableCell className="text-right pr-6">
                          <GlobalActions
                            id={ticket.id}
                            status={ticket.status}
                            type="ticket"
                            tableName="tickets"
                            editPayload={ticket}
                            clients={allClients}
                          />
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination diletakkan di bawah Table */}
              <Pagination totalPages={totalPages} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

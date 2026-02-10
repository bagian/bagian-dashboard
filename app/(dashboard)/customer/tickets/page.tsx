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
import {Badge} from "@/components/ui/badge";
import {CreateTicketModal} from "@/components/dashboard/create-ticket-modal";

const statusVariant = {
  open: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  closed: "bg-zinc-100 text-zinc-600 border border-zinc-200",
};

export default function TicketsPage() {
  const tickets = [
    {
      id: "1",
      subject: "Slicing Landing Page",
      status: "open",
      date: "2024-02-10",
    },
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">
            Support Tickets
          </h2>
          <p className="text-sm text-zinc-500 mt-1">
            Track and manage your project requests.
          </p>
        </div>
        <CreateTicketModal />
      </div>

      {/* Table Card */}
      <Card className="border-zinc-200 shadow-sm">
        <CardHeader className="border-b bg-zinc-50/60">
          <CardTitle className="text-sm font-medium text-zinc-700">
            Active Requests
          </CardTitle>
          <CardDescription className="text-xs">
            Showing {tickets.length} ticket(s)
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {tickets.length === 0 ? (
            <div className="py-12 text-center text-sm text-zinc-500">
              No tickets yet. Create one to get started 🚀
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-50 hover:bg-zinc-50">
                  <TableHead className="pl-6">Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-6">Created</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow
                    key={ticket.id}
                    className="transition hover:bg-zinc-50/70"
                  >
                    <TableCell className="pl-6">
                      <div className="flex flex-col">
                        <span className="font-medium text-zinc-900 truncate max-w-[280px]">
                          {ticket.subject}
                        </span>
                        <span className="text-xs text-zinc-400">
                          Ticket #{ticket.id}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          statusVariant[ticket.status as "open" | "closed"]
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </TableCell>

                    <TableCell className="text-right pr-6 text-sm text-zinc-500">
                      {ticket.date}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

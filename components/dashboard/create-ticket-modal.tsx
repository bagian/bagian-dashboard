import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {X} from "lucide-react";

export function CreateTicketModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-black text-white hover:bg-zinc-800">
          New Ticket
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[440px] rounded-xl">
        <DialogHeader>
          <DialogTitle>Create Support Ticket</DialogTitle>
          <DialogDescription className="text-sm">
            Gunakan form ini untuk mengajukan pertanyaan, revisi, atau kendala
            terkait project kamu.
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <div className="space-y-4 py-4">
          <div className="space-y-1.5">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" placeholder="Contoh: Revisi warna logo" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="message">Detail Request</Label>
            <Textarea
              id="message"
              placeholder="Jelaskan kebutuhan atau kendala kamu..."
              className="min-h-[100px] resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button className="w-full bg-black text-white hover:bg-zinc-800">
            Submit Ticket
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

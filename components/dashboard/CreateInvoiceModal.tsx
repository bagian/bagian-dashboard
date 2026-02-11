"use client";

import {useState, ChangeEvent, FormEvent} from "react";
import {supabase} from "@/lib/supabase/client";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useRouter} from "next/navigation";
import {toast} from "sonner";
import {Plus, Trash2} from "lucide-react";

interface Client {
  id: string;
  email: string;
  role?: string;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  unit_price: number;
}

interface FormData {
  client_id: string;
  invoice_number: string;
  due_date: string;
  notes: string;
  tax_percentage: number;
  discount: number;
}

export function CreateInvoiceModal({clients}: {clients: Client[]}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const [items, setItems] = useState<InvoiceItem[]>([
    {description: "", quantity: 1, unit_price: 0},
  ]);

  const [formData, setFormData] = useState<FormData>({
    client_id: "",
    invoice_number: "",
    due_date: "",
    notes: "",
    tax_percentage: 0,
    discount: 0,
  });

  const customerOnly = clients.filter(
    (client) =>
      client.role?.toLowerCase() !== "admin" &&
      client.role?.toLowerCase() !== "superadmin",
  );

  const addItem = () => {
    setItems([...items, {description: "", quantity: 1, unit_price: 0}]);
  };

  const updateItem = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number,
  ) => {
    const newItems = [...items];
    if (field === "description") {
      newItems[index] = {...newItems[index], [field]: value as string};
    } else {
      newItems[index] = {...newItems[index], [field]: value as number};
    }
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0,
    );
    const tax = (subtotal * formData.tax_percentage) / 100;
    return subtotal + tax - formData.discount;
  };

  // Format angka dengan pemisah ribuan
  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat("id-ID").format(value);
  };

  // Parse string dengan pemisah ribuan menjadi number
  const parseFormattedNumber = (value: string): number => {
    const cleanValue = value.replace(/\./g, "");
    return parseFloat(cleanValue) || 0;
  };

  const handleNumberInput = (
    e: ChangeEvent<HTMLInputElement>,
    field: "tax_percentage" | "discount",
  ) => {
    const value = parseFormattedNumber(e.target.value);
    setFormData({...formData, [field]: value});
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const total = calculateTotal();

      const {data: invoice, error: invoiceError} = await supabase
        .from("invoices")
        .insert({
          invoice_number: formData.invoice_number,
          client_id: formData.client_id,
          amount: total,
          status: "unpaid",
          due_date: formData.due_date || null,
          notes: formData.notes || null,
          tax_percentage: formData.tax_percentage,
          discount: formData.discount,
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      const itemsToInsert = items.map((item) => ({
        invoice_id: invoice.id,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total: item.quantity * item.unit_price,
      }));

      const {error: itemsError} = await supabase
        .from("invoice_items")
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      toast.success("Invoice berhasil dibuat! 🎉", {
        description: "Tagihan telah dikirim ke client.",
      });
      setOpen(false);
      setItems([{description: "", quantity: 1, unit_price: 0}]);
      setFormData({
        client_id: "",
        invoice_number: "",
        due_date: "",
        notes: "",
        tax_percentage: 0,
        discount: 0,
      });
      router.refresh();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Terjadi kesalahan sistem.";
      toast.error("Gagal membuat invoice!", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-zinc-900 text-white font-medium rounded-xl text-xs px-6 py-5 shadow-sm hover:bg-zinc-800 transition-all cursor-pointer">
          <Plus className="h-4 w-4 mr-2" />
          Buat Tagihan Baru
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto rounded-2xl border-none shadow-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="font-semibold text-xl tracking-tight">
            Kirim Tagihan
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-500 font-medium">
            Pilih client dan masukkan detail tagihan beserta rincian item.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 flex flex-col">
              <Label
                htmlFor="client_id"
                className="text-[10px] font-bold uppercase tracking-widest text-zinc-400"
              >
                Pilih Client
              </Label>
              <select
                id="client_id"
                required
                value={formData.client_id}
                onChange={(e) =>
                  setFormData({...formData, client_id: e.target.value})
                }
                className="flex h-11 w-full rounded-xl border border-zinc-100 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-200 transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled>
                  -- Pilih Client --
                </option>
                {customerOnly.length === 0 ? (
                  <option disabled>Tidak ada client tersedia</option>
                ) : (
                  customerOnly.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.email}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="invoice_number"
                className="text-[10px] font-bold uppercase tracking-widest text-zinc-400"
              >
                Nomor Invoice
              </Label>
              <Input
                id="invoice_number"
                placeholder="INV/2026/001"
                required
                value={formData.invoice_number}
                onChange={(e) =>
                  setFormData({...formData, invoice_number: e.target.value})
                }
                className="rounded-xl border-zinc-100 h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="due_date"
              className="text-[10px] font-bold uppercase tracking-widest text-zinc-400"
            >
              Tanggal Jatuh Tempo
            </Label>
            <Input
              id="due_date"
              type="date"
              required
              value={formData.due_date}
              onChange={(e) =>
                setFormData({...formData, due_date: e.target.value})
              }
              className="rounded-xl border-zinc-100 h-11"
            />
          </div>

          {/* Bagian Dinamis Rincian Item */}
          <div className="pt-4 pb-2 border-t border-zinc-100">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Rincian Item
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
                className="h-8 text-[10px] font-bold uppercase tracking-widest rounded-lg"
              >
                <Plus className="h-3 w-3 mr-1" /> Tambah Item
              </Button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 bg-zinc-50 p-3 rounded-xl border border-zinc-100"
                >
                  <div className="grid grid-cols-12 gap-2 flex-1">
                    <div className="col-span-12 sm:col-span-6">
                      <Input
                        placeholder="Deskripsi Jasa / Barang"
                        required
                        value={item.description}
                        onChange={(e) =>
                          updateItem(index, "description", e.target.value)
                        }
                        className="rounded-lg border-zinc-200 h-9 text-sm bg-white"
                      />
                    </div>
                    <div className="col-span-4 sm:col-span-2">
                      <Input
                        type="number"
                        placeholder="Qty"
                        required
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(
                            index,
                            "quantity",
                            parseInt(e.target.value) || 1,
                          )
                        }
                        className="rounded-lg border-zinc-200 h-9 text-sm bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                    <div className="col-span-8 sm:col-span-4">
                      <Input
                        type="text"
                        placeholder="Harga Satuan"
                        required
                        value={
                          item.unit_price > 0
                            ? formatNumber(item.unit_price)
                            : ""
                        }
                        onChange={(e) => {
                          const value = parseFormattedNumber(e.target.value);
                          updateItem(index, "unit_price", value);
                        }}
                        className="rounded-lg border-zinc-200 h-9 text-sm bg-white"
                      />
                    </div>
                  </div>
                  {items.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeItem(index)}
                      className="h-9 w-9 p-0 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pajak, Diskon, Catatan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-zinc-100">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Pajak (%)
              </Label>
              <Input
                type="text"
                placeholder="0"
                value={
                  formData.tax_percentage > 0
                    ? formatNumber(formData.tax_percentage)
                    : ""
                }
                onChange={(e) => handleNumberInput(e, "tax_percentage")}
                className="rounded-xl border-zinc-100 h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Diskon (Rp)
              </Label>
              <Input
                type="text"
                placeholder="0"
                value={
                  formData.discount > 0 ? formatNumber(formData.discount) : ""
                }
                onChange={(e) => handleNumberInput(e, "discount")}
                className="rounded-xl border-zinc-100 h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Catatan (Opsional)
            </Label>
            <Input
              placeholder="Catatan tambahan untuk client..."
              value={formData.notes}
              onChange={(e) =>
                setFormData({...formData, notes: e.target.value})
              }
              className="rounded-xl border-zinc-100 h-11"
            />
          </div>

          <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Total Akhir
            </span>
            <span className="text-xl font-bold text-zinc-900">
              Rp {formatNumber(calculateTotal())}
            </span>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="submit"
              disabled={loading || customerOnly.length === 0}
              className="w-full bg-zinc-900 text-white rounded-xl py-6 font-bold uppercase tracking-widest text-[10px] shadow-lg hover:bg-zinc-800 transition-all cursor-pointer disabled:bg-zinc-300 disabled:text-zinc-500"
            >
              {loading ? "MENGIRIM..." : "KONFIRMASI & KIRIM"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

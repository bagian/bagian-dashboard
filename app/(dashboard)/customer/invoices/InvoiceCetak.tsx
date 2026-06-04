"use client";

import {
  Printer,
  Download,
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

interface PaymentInfo {
  bank_name?: string;
  account_number?: string;
  account_name?: string;
  swift_code?: string;
}

interface InvoiceData {
  invoice_number: string;
  amount: number;
  status: string;
  created_at: string;
  due_date?: string;
  client_email?: string;
  full_name?: string;
  client_address?: string;
  client_phone?: string;
  items?: InvoiceItem[];
  notes?: string;
  tax_percentage?: number;
  discount?: number;
  payment_info?: PaymentInfo;
}

export default function InvoiceCetak({ data }: { data: InvoiceData }) {
  // Fungsi Print Bawaan Browser (Paling Stabil)
  const handlePrint = () => {
    window.print();
  };

  const validItems = Array.isArray(data.items) ? data.items : [];

  const subtotal =
    validItems.length > 0
      ? validItems.reduce((sum, item) => sum + (Number(item.total) || 0), 0)
      : Number(data.amount) || 0;

  const taxAmount = data.tax_percentage
    ? (subtotal * Number(data.tax_percentage)) / 100
    : 0;

  const discountAmount = Number(data.discount) || 0;
  const grandTotal = subtotal + taxAmount - discountAmount;

  const getStatusStyle = () => {
    switch (data.status?.toLowerCase()) {
      case "paid":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "unpaid":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "overdue":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-zinc-100 text-zinc-700 border-zinc-200";
    }
  };

  const bankName = data.payment_info?.bank_name || "BLU BCA DIGITAL";
  const accNumber = data.payment_info?.account_number || "0005 2831 0957";
  const accName = data.payment_info?.account_name || "Gilang Ramadhan";
  const swiftCode = data.payment_info?.swift_code || "BBLUIDJAXXX";

  return (
    <div className="w-full p-4 md:p-8 font-sans print:block print:bg-white print:m-0 print:p-0">
      {/* Action Buttons */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <Link
          href="/customer/invoices"
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Kembali
        </Link>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-none bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all rounded-xl shadow-lg flex items-center justify-center gap-3 cursor-pointer"
          >
            <Printer className="h-4 w-4" /> Print
          </button>
        </div>
      </div>

      {/* Invoice Paper */}
      <div className="print-area max-w-4xl mx-auto bg-white dark:bg-zinc-950 p-6 sm:p-8 lg:p-12 shadow-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl print:rounded-none print:shadow-none print:border-0">
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-8 pb-6 border-b-2 border-zinc-100 dark:border-zinc-800">
          <div className="flex-1">
            <div className="flex items-start gap-4">
              {/* Logo Container */}
              <div className="h-12 w-12 rounded-xl bg-zinc-900 dark:bg-zinc-800 flex items-center justify-center print:bg-zinc-900 flex-shrink-0">
                <img
                  src="/img/logo/bagian-logo-non-t.png"
                  alt="Bagian Projects Logo"
                  className="h-7 w-7 object-contain"
                />
              </div>

              {/* Text Container */}
              <div className="flex flex-col items-start">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tighter uppercase mb-4 leading-none text-zinc-900 dark:text-zinc-100">
                  Invoice
                </h1>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                  Bagian Corps
                </p>
                <div
                  className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border-2 ${getStatusStyle()}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      data.status?.toLowerCase() === "paid"
                        ? "bg-emerald-500"
                        : data.status?.toLowerCase() === "unpaid"
                        ? "bg-orange-500"
                        : "bg-red-500"
                    }`}
                  ></span>
                  {data.status || "UNPAID"}
                </div>
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right w-full sm:w-auto mt-4 sm:mt-0">
            <div className="space-y-4">
              <div>
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                  Invoice Number
                </p>
                <p className="text-base sm:text-lg font-black uppercase text-zinc-900 dark:text-zinc-100 break-all">
                  {data.invoice_number}
                </p>
              </div>
              <div className="flex sm:justify-end gap-8">
                <div>
                  <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                    Issue Date
                  </p>
                  <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    {new Date(data.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                {data.due_date && (
                  <div>
                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                      Due Date
                    </p>
                    <p className="text-xs font-bold text-red-650 dark:text-red-400">
                      {new Date(data.due_date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bill From & Bill To */}
        <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-6 sm:gap-8 mb-8">
          <div>
            <p className="font-bold text-zinc-400 mb-3 tracking-[0.3em] text-[9px] uppercase border-b border-zinc-100 dark:border-zinc-800 pb-2 inline-block">
              From
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Building2 className="h-3 w-3 text-zinc-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-black text-zinc-900 dark:text-zinc-100 text-sm">
                    Bagian Corps
                  </p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Web Development & Design Agency
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-3 w-3 text-zinc-400 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-zinc-650 dark:text-zinc-400 font-medium">
                  Surabaya, East Java, Indonesia
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="h-3 w-3 text-zinc-400 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-zinc-650 dark:text-zinc-400 font-medium lowercase">
                  support@bagian.web.id
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="h-3 w-3 text-zinc-400 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-zinc-650 dark:text-zinc-400 font-medium">
                  +62 851 7429 5981
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="font-bold text-zinc-400 mb-3 tracking-[0.3em] text-[9px] uppercase border-b border-zinc-100 dark:border-zinc-800 pb-2 inline-block">
              Bill To
            </p>
            <div className="space-y-2">
              <p className="font-black text-zinc-900 dark:text-zinc-100 leading-relaxed text-sm">
                {data.full_name || "Client"}
              </p>
              {data.client_address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-3 w-3 text-zinc-400 mt-0.5 flex-shrink-0" />
                  <p className="text-[11px] text-zinc-650 dark:text-zinc-400 font-medium">
                    {data.client_address}
                  </p>
                </div>
              )}
              <div className="flex items-start gap-2">
                <Mail className="h-3 w-3 text-zinc-400 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-zinc-650 dark:text-zinc-400 font-medium lowercase break-all">
                  {data.client_email}
                </p>
              </div>
              {data.client_phone && (
                <div className="flex items-start gap-2">
                  <Phone className="h-3 w-3 text-zinc-400 mt-0.5 flex-shrink-0" />
                  <p className="text-[11px] text-zinc-650 dark:text-zinc-400 font-medium">
                    {data.client_phone}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-6 overflow-x-auto print:break-inside-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-zinc-900 dark:border-zinc-800">
                <th className="py-3 text-[9px] uppercase font-black tracking-widest text-zinc-600 dark:text-zinc-400">
                  Description
                </th>
                <th className="text-center py-3 text-[9px] uppercase font-black tracking-widest text-zinc-600 dark:text-zinc-400 hidden sm:table-cell">
                  Qty
                </th>
                <th className="text-right py-3 text-[9px] uppercase font-black tracking-widest text-zinc-600 dark:text-zinc-400 hidden sm:table-cell">
                  Rate
                </th>
                <th className="text-right py-3 text-[9px] uppercase font-black tracking-widest text-zinc-600 dark:text-zinc-400">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {validItems.length > 0 ? (
                validItems.map((item, index) => {
                  const itemTotal =
                    Number(item.total) ||
                    Number(item.quantity) * Number(item.unit_price) ||
                    0;
                  return (
                    <tr
                      key={item.id || index}
                      className="border-b border-zinc-100 dark:border-zinc-800"
                      style={{ pageBreakInside: "avoid" }}
                    >
                      <td className="py-4 font-medium text-zinc-700 dark:text-zinc-300 text-xs">
                        <div className="flex flex-col">
                          <span>{item.description}</span>
                          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 sm:hidden">
                            {item.quantity} × Rp{" "}
                            {new Intl.NumberFormat("id-ID").format(
                              Number(item.unit_price) || 0
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-center font-semibold text-zinc-600 dark:text-zinc-400 text-xs hidden sm:table-cell">
                        {item.quantity}
                      </td>
                      <td className="py-4 text-right font-semibold text-zinc-600 dark:text-zinc-400 text-xs hidden sm:table-cell">
                        Rp{" "}
                        {new Intl.NumberFormat("id-ID").format(
                          Number(item.unit_price) || 0
                        )}
                      </td>
                      <td className="py-4 text-right font-black text-zinc-900 dark:text-zinc-100 text-xs">
                        Rp {new Intl.NumberFormat("id-ID").format(itemTotal)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <td
                    className="py-4 font-medium text-zinc-700 dark:text-zinc-300 text-xs"
                    colSpan={3}
                  >
                    {data.notes
                      ? "Invoice Billing"
                      : "Project Development & Design Services"}
                  </td>
                  <td className="py-4 text-right font-black text-zinc-900 dark:text-zinc-100 text-xs">
                    Rp{" "}
                    {new Intl.NumberFormat("id-ID").format(
                      Number(data.amount) || 0
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Section */}
        <div
          className="flex flex-col sm:flex-row justify-between gap-6 mb-6"
          style={{ pageBreakInside: "avoid" }}
        >
          {data.notes ? (
            <div className="flex-1 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 print:bg-zinc-50">
              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-2">
                Notes
              </p>
              <p className="text-[11px] text-zinc-650 dark:text-zinc-400 leading-relaxed font-medium">
                {data.notes}
              </p>
            </div>
          ) : (
            <div className="flex-1"></div>
          )}

          <div className="w-full sm:w-72">
            <div className="space-y-2">
              <div className="flex justify-between items-center py-1">
                <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-405 uppercase tracking-wider">
                  Subtotal
                </p>
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  Rp {new Intl.NumberFormat("id-ID").format(subtotal)}
                </p>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between items-center py-1">
                  <p className="text-[11px] font-bold text-emerald-650 dark:text-emerald-400 uppercase tracking-wider">
                    Discount
                  </p>
                  <p className="text-xs font-bold text-emerald-650 dark:text-emerald-400">
                    - Rp {new Intl.NumberFormat("id-ID").format(discountAmount)}
                  </p>
                </div>
              )}

              {taxAmount > 0 && (
                <div className="flex justify-between items-center py-1">
                  <p className="text-[11px] font-bold text-zinc-505 dark:text-zinc-400 uppercase tracking-wider">
                    Tax ({data.tax_percentage}%)
                  </p>
                  <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    Rp {new Intl.NumberFormat("id-ID").format(taxAmount)}
                  </p>
                </div>
              )}

              <div className="border-t-2 border-zinc-900 dark:border-zinc-800 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <p className="text-[11px] font-black text-zinc-400 uppercase tracking-widest">
                    Total
                  </p>
                  <p className="text-xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100">
                    Rp {new Intl.NumberFormat("id-ID").format(grandTotal)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div
          className="bg-zinc-50 dark:bg-zinc-900/50 p-5 rounded-2xl border border-zinc-100 dark:border-zinc-800 mb-6 print:bg-zinc-50 payment-info-block"
          style={{ pageBreakInside: "avoid", breakInside: "avoid" }}
        >
          <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-3">
            Payment Information
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 print:grid-cols-4 gap-3 text-[11px] text-zinc-900 dark:text-zinc-100">
            <div>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-0.5">Bank Name</p>
              <p className="font-bold">{bankName}</p>
            </div>
            <div>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-0.5">Account Number</p>
              <p className="font-bold">{accNumber}</p>
            </div>
            <div>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-0.5">Account Name</p>
              <p className="font-bold">{accName}</p>
            </div>
            <div>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-0.5">Swift Code</p>
              <p className="font-bold">{swiftCode}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center sm:text-left"
          style={{ pageBreakInside: "avoid" }}
        >
          <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em] leading-relaxed">
            Authorized by <span className="text-zinc-900 dark:text-zinc-100">Bagian Corps</span>
          </p>
          <div className="flex justify-between">
            <p className="text-[9px] text-zinc-400 font-medium mt-1">
              This is a computer-generated document. No signature required.
            </p>
            <p className="text-[9px] text-zinc-400 font-medium mt-1">
              Thank you for choosing us.
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          html,
          body,
          main,
          section,
          div#__next {
            height: max-content !important;
            min-height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            background-color: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          nav,
          aside,
          header,
          footer,
          .no-print {
            display: none !important;
          }

          .print-area {
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }

          /* Force print background graphics for print elements */
          .print-area,
          .print-area * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Reset all colors to standard black-and-white for printing */
          :global(.dark) .print-area {
            background-color: #ffffff !important;
            color: #18181b !important;
            border-color: #e4e4e7 !important;
          }

          /* Make text readable on white paper when .dark is active */
          :global(.dark) .print-area text,
          :global(.dark) .print-area p,
          :global(.dark) .print-area span,
          :global(.dark) .print-area h1,
          :global(.dark) .print-area h2,
          :global(.dark) .print-area h3,
          :global(.dark) .print-area th,
          :global(.dark) .print-area td,
          :global(.dark) .print-area div {
            color: #18181b !important;
          }

          /* Background colors for layout sections in print */
          .print-area .bg-zinc-50,
          .print-area .payment-info-block,
          :global(.dark) .print-area .bg-zinc-50,
          :global(.dark) .print-area .payment-info-block,
          :global(.dark) .print-area .bg-zinc-900\/50,
          :global(.dark) .print-area .bg-zinc-50\/50 {
            background-color: #fafafa !important;
          }

          /* Force black background for the logo container in print */
          .print-area .bg-zinc-900,
          .print-area .print\:bg-zinc-900,
          :global(.dark) .print-area .bg-zinc-900,
          :global(.dark) .print-area .bg-zinc-800 {
            background-color: #18181b !important;
          }

          /* Status Badges in print */
          .print-area .bg-emerald-50,
          :global(.dark) .print-area .bg-emerald-950\/40 {
            background-color: #ecfdf5 !important;
            color: #047857 !important;
          }
          .print-area .bg-orange-50,
          :global(.dark) .print-area .bg-orange-950\/40 {
            background-color: #fff7ed !important;
            color: #c2410c !important;
          }
          .print-area .bg-red-50,
          :global(.dark) .print-area .bg-red-950\/40 {
            background-color: #fef2f2 !important;
            color: #b91c1c !important;
          }
        }

        @page {
          size: A4;
          margin: 10mm;
        }
      `}</style>
    </div>
  );
}

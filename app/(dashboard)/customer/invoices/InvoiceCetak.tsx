"use client";

import {Printer, Download, ArrowLeft} from "lucide-react";
import Link from "next/link";

interface InvoiceData {
  invoice_number: string;
  amount: number;
  status: string;
  created_at: string;
  due_date?: string;
  client_email?: string;
  full_name?: string;
}

export default function InvoiceCetak({data}: {data: InvoiceData}) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen p-4 md:p-12 font-sans print:bg-white print:absolute print:top-4 print:left-0 print:w-full print:m-0 print:p-0">
      <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center print:hidden">
        <Link
          href="/customer/invoices"
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-all"
        >
          <ArrowLeft size={14} /> Back
        </Link>
        <button
          onClick={handlePrint}
          className="bg-zinc-950 text-white px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200 flex items-center gap-3 cursor-pointer"
        >
          <Printer size={16} /> Print PDF
        </button>
      </div>

      {/* Area Kertas Invoice - Tambahkan class 'print-area' di sini */}
      <div className="print-area max-w-4xl mx-auto bg-white p-12 md:p-20 shadow-sm border border-zinc-100">
        {/* Header Invoice */}
        <div className="flex justify-between items-start mb-20">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">
              Invoice
            </h1>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
              Bagian Projects
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
              Invoice Number
            </p>
            <p className="text-sm font-black uppercase">
              {data.invoice_number}
            </p>
          </div>
        </div>

        {/* Informasi Klien & Detail */}
        <div className="grid grid-cols-2 gap-12 mb-20 text-[11px] uppercase tracking-widest">
          <div>
            <p className="font-bold text-zinc-400 mb-4 tracking-[0.3em]">
              Billed To
            </p>
            <p className="font-black text-zinc-900 leading-relaxed text-sm">
              {data.full_name || "Client"}
            </p>
            <p className="text-zinc-500 font-medium lowercase">
              {data.client_email}
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-zinc-400 mb-4 tracking-[0.3em]">
              Date Issued
            </p>
            <p className="font-black text-zinc-900 text-sm">
              {new Date(data.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Tabel Item */}
        <table className="w-full mb-12">
          <thead>
            <tr className="border-b-2 border-zinc-900 text-[10px] uppercase font-black tracking-widest">
              <th className="text-left py-4">Description</th>
              <th className="text-right py-4">Total</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            <tr className="border-b border-zinc-100">
              <td className="py-8 font-medium text-zinc-600">
                Website Development & UI/UX Design
              </td>
              <td className="py-8 text-right font-black text-zinc-900">
                Rp {new Intl.NumberFormat("id-ID").format(data.amount)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Total Akhir */}
        <div className="flex justify-end border-t-4 border-zinc-950 pt-6">
          <div className="text-right w-full max-w-[200px]">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">
              Grand Total
            </p>
            <p className="text-3xl font-black tracking-tighter text-zinc-900">
              Rp {new Intl.NumberFormat("id-ID").format(data.amount)}
            </p>
          </div>
        </div>

        {/* Footer Invoice */}
        <div className="mt-32 pt-12 border-t border-zinc-50 text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em] leading-relaxed">
          Authorized by **Bagian Corps**. <br />
          This is a computer-generated document. No signature required.
        </div>
      </div>

      <style jsx global>{`
        @media print {
          html,
          body,
          main,
          div#__next {
            background-color: #ffffff !important;
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
            min-height: 0 !important;
            position: relative !important; /* Agar elemen absolute bisa pas di atas */
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
            padding: 5mm 10mm !important;
            box-shadow: none !important;
            border: none !important;
          }
        }

        @page {
          size: A4;
          margin: 0;
        }
      `}</style>
    </div>
  );
}

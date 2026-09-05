import React, { useState } from 'react';
import { OrderConfirmation } from '../types';
import { OrderPaymentModal } from './OrderPaymentModal';

interface InvoiceViewProps {
  order: OrderConfirmation;
  onReturnToMarketplace: () => void;
  onUpdateOrder?: (order: OrderConfirmation) => void;
}

export const InvoiceView: React.FC<InvoiceViewProps> = ({
  order,
  onReturnToMarketplace,
  onUpdateOrder,
}) => {
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [paymentSuccessToast, setPaymentSuccessToast] = useState<{
    amount: number;
    method: string;
    cardLast4: string;
  } | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'pending'>(
    order.paymentStatus === 'pending' ? 'pending' : 'paid'
  );

  const handlePaymentSuccess = (details: {
    orderNumber: string;
    totalPaid: number;
    cardLast4: string;
    paymentMethod: string;
  }) => {
    setPaymentStatus('paid');
    const updatedOrder: OrderConfirmation = {
      ...order,
      orderNumber: details.orderNumber,
      totalPaid: details.totalPaid,
      cardLast4: details.cardLast4,
      paymentStatus: 'paid',
      paymentMethod: details.paymentMethod,
      paidAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Payment Confirmed - Preparing Morning Harvest',
    };
    if (onUpdateOrder) {
      onUpdateOrder(updatedOrder);
    }
    setPaymentSuccessToast({
      amount: details.totalPaid,
      method: details.paymentMethod,
      cardLast4: details.cardLast4,
    });
    setTimeout(() => setPaymentSuccessToast(null), 5000);
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      console.warn('Printing not permitted in iframe sandbox:', e);
    }
  };

  const handleDownloadPDF = () => {
    // Generate an authentic, formatted standalone receipt HTML file with print-to-PDF styles
    const itemsRows = order.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px 10px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #111827;">
            ${item.name}
            <div style="font-size: 11px; font-weight: normal; color: #6b7280;">Origin: ${item.origin} • ${item.unitWeight}</div>
          </td>
          <td style="padding: 12px 10px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #374151;">
            ${item.quantity}
          </td>
          <td style="padding: 12px 10px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #374151;">
            $${item.unitPrice.toFixed(2)}
          </td>
          <td style="padding: 12px 10px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600; color: #064e3b;">
            $${item.total.toFixed(2)}
          </td>
        </tr>`
      )
      .join('');

    const invoiceContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>FarmFlow Invoice #${order.orderNumber}</title>
  <style>
    @media print {
      body { margin: 0; padding: 20px; }
      .no-print { display: none; }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      max-width: 800px;
      margin: 30px auto;
      padding: 36px;
      background: #ffffff;
      color: #1f2937;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.05);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #064e3b;
      padding-bottom: 24px;
      margin-bottom: 28px;
    }
    .brand-title {
      font-size: 28px;
      font-weight: 800;
      color: #064e3b;
      margin: 0;
      letter-spacing: -0.5px;
    }
    .brand-tagline {
      font-size: 12px;
      color: #059669;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 4px;
    }
    .invoice-badge {
      background: #ecfdf5;
      color: #065f46;
      border: 1px solid #a7f3d0;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 700;
      text-align: right;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      background: #f9fafb;
      border: 1px solid #f3f4f6;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 28px;
    }
    .meta-item { font-size: 12px; color: #4b5563; }
    .meta-item strong { display: block; font-size: 14px; color: #111827; margin-top: 2px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 28px; }
    th {
      background: #f9fafb;
      text-align: left;
      padding: 10px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #6b7280;
      border-bottom: 2px solid #e5e7eb;
    }
    .summary-box {
      margin-left: auto;
      width: 320px;
      border-top: 2px solid #e5e7eb;
      padding-top: 14px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
      font-size: 13px;
      color: #4b5563;
    }
    .summary-row.total {
      border-top: 2px solid #064e3b;
      margin-top: 8px;
      padding-top: 10px;
      font-size: 18px;
      font-weight: 800;
      color: #064e3b;
    }
    .footer-note {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 11px;
      color: #6b7280;
      text-align: center;
    }
    .print-btn {
      display: inline-block;
      background: #064e3b;
      color: white;
      padding: 10px 20px;
      border-radius: 9999px;
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 20px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="no-print" style="text-align: right; margin-bottom: 16px;">
    <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
  </div>
  <div class="header">
    <div>
      <h1 class="brand-title">FarmFlow</h1>
      <div class="brand-tagline">Sunrise Harvest • Direct-to-Door Agriculture</div>
      <div style="font-size: 12px; color: #6b7280; margin-top: 6px;">
        100% Cold-Chain Refrigerated Local Produce
      </div>
    </div>
    <div class="invoice-badge">
      <div>INVOICE #${order.orderNumber}</div>
      <div style="font-size: 11px; font-weight: normal; color: #047857; margin-top: 2px;">PAID IN FULL</div>
    </div>
  </div>

  <div class="meta-grid">
    <div class="meta-item">
      Invoice Date
      <strong>${order.date}</strong>
    </div>
    <div class="meta-item">
      Delivery Window
      <strong>${order.deliveryWindow}</strong>
    </div>
    <div class="meta-item">
      Delivery Address
      <strong>104 Organic Way, Green Valley</strong>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 50%;">Harvest Item & Farm Origin</th>
        <th style="text-align: center;">Qty</th>
        <th style="text-align: right;">Unit Price</th>
        <th style="text-align: right;">Total</th>
      </tr>
    </thead>
    <tbody>
      ${itemsRows}
    </tbody>
  </table>

  <div class="summary-box">
    <div class="summary-row">
      <span>Produce Subtotal:</span>
      <span>$${order.subtotal.toFixed(2)}</span>
    </div>
    <div class="summary-row">
      <span>Zero-Emissions Delivery:</span>
      <span>${order.deliveryFee === 0 ? 'FREE ($0.00)' : `$${order.deliveryFee.toFixed(2)}`}</span>
    </div>
    <div class="summary-row">
      <span>Eco-Packaging Offset:</span>
      <span>$${order.ecoPackagingOffset.toFixed(2)}</span>
    </div>
    ${
      order.crateFee > 0
        ? `<div class="summary-row">
            <span>Wooden Crate Deposit:</span>
            <span>$${order.crateFee.toFixed(2)}</span>
          </div>`
        : ''
    }
    ${
      order.farmerTip > 0
        ? `<div class="summary-row">
            <span>Farmer Fair-Pay Direct Tip:</span>
            <span>$${order.farmerTip.toFixed(2)}</span>
          </div>`
        : ''
    }
    <div class="summary-row total">
      <span>Total Paid:</span>
      <span>$${order.totalPaid.toFixed(2)}</span>
    </div>
    <div style="font-size: 11px; color: #6b7280; text-align: right; margin-top: 6px;">
      Billed to Visa •••• ${order.cardLast4}
    </div>
  </div>

  <div class="footer-note">
    <strong>Direct Grower Impact Guarantee:</strong> 88% of your order goes straight to our regional partner farmers.<br>
    Questions regarding this invoice? Contact FarmFlow Concierge at support@farmflow.harvest or 1-800-FARM-FRESH.
  </div>
</body>
</html>`;

    // Download invoice HTML document file
    const blob = new Blob([invoiceContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice-${order.orderNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Also trigger system print-to-PDF if permitted
    setTimeout(() => {
      try {
        window.print();
      } catch (e) {
        // Fallback for sandboxed preview iframes
      }
    }, 400);

    setDownloadSuccessToast(`Invoice-${order.orderNumber}.html downloaded to your device!`);
    setTimeout(() => {
      setDownloadSuccessToast(null);
    }, 4500);
  };

  return (
    <div id="invoice-screen" className="max-w-4xl mx-auto space-y-12 pb-24 relative">
      {/* Download Success Toast */}
      {downloadSuccessToast && (
        <div
          id="invoice-download-toast"
          className="fixed top-24 right-4 md:right-10 z-50 bg-[#012d1d] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-[#92f7c3]/40 flex items-center gap-3 animate-fade-in"
        >
          <span className="material-symbols-outlined text-[#92f7c3]">download_done</span>
          <div className="text-xs font-medium">
            <span className="font-bold text-[#92f7c3] block">Invoice Saved</span>
            {downloadSuccessToast}
          </div>
          <button
            onClick={() => setDownloadSuccessToast(null)}
            className="text-white/60 hover:text-white ml-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}
      {/* Payment Success Toast */}
      {paymentSuccessToast && (
        <div
          id="invoice-payment-toast"
          className="fixed top-24 right-4 md:right-10 z-50 bg-[#012d1d] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-[#92f7c3]/50 flex items-center gap-3 animate-fade-in"
        >
          <div className="w-9 h-9 rounded-full bg-[#92f7c3] text-[#002114] flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-lg">verified</span>
          </div>
          <div className="text-xs font-medium">
            <span className="font-bold text-[#92f7c3] block">Payment Received</span>
            Payment of ${paymentSuccessToast.amount.toFixed(2)} received via {paymentSuccessToast.method}
          </div>
          <button
            onClick={() => setPaymentSuccessToast(null)}
            className="text-white/60 hover:text-white ml-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* 1. Harvest Order Confirmed Card */}
      <section className="bg-white rounded-3xl p-8 md:p-12 border border-[#c1c8c2]/30 ambient-shadow text-center">
        <div className="w-20 h-20 bg-[#92f7c3]/30 text-[#006c48] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <span className="material-symbols-outlined text-5xl">check_circle</span>
        </div>

        <span className="inline-block px-4 py-1 bg-[#006c48]/10 text-[#006c48] text-xs font-bold uppercase tracking-wider rounded-full mb-3">
          Order Confirmed
        </span>

        <h1 className="font-serif-display text-3xl md:text-5xl font-bold text-[#012d1d] mb-4">
          Harvest Order Confirmed!
        </h1>

        <p className="text-[#414844] text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-8">
          Thank you for supporting sustainable local agriculture. Your produce is scheduled for harvest at first light tomorrow morning.
        </p>

        {/* Order Meta Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-[#f8f9fa] rounded-2xl p-4 border border-[#c1c8c2]/30 text-left">
          <div className="p-3">
            <span className="text-xs text-[#414844] block mb-1">Order Identifier</span>
            <span className="font-bold text-[#012d1d] text-base font-mono">{order.orderNumber}</span>
          </div>
          <div className="p-3 border-t sm:border-t-0 sm:border-l border-[#c1c8c2]/30">
            <span className="text-xs text-[#414844] block mb-1">Delivery Window</span>
            <span className="font-bold text-[#012d1d] text-base">{order.deliveryWindow}</span>
          </div>
          <div className="p-3 border-t md:border-t-0 md:border-l border-[#c1c8c2]/30">
            <span className="text-xs text-[#414844] block mb-1">Current Status</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#006c48] animate-ping" />
              <span className="font-bold text-[#006c48] text-sm">{order.status}</span>
            </div>
          </div>
          <div className="p-3 border-t sm:border-t-0 md:border-l border-[#c1c8c2]/30 flex flex-col justify-between">
            <span className="text-xs text-[#414844] block mb-1">Payment Status</span>
            <div className="flex items-center justify-between gap-2">
              <span className={`font-bold text-xs px-2.5 py-1 rounded-full flex items-center gap-1 ${
                paymentStatus === 'paid'
                  ? 'bg-[#92f7c3]/40 text-[#006c48]'
                  : 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
              }`}>
                <span className="material-symbols-outlined text-xs">
                  {paymentStatus === 'paid' ? 'check_circle' : 'pending'}
                </span>
                <span>{paymentStatus === 'paid' ? 'Paid' : 'Due'}</span>
              </span>
              <button
                id="meta-pay-invoice-btn"
                onClick={() => setIsPaymentModalOpen(true)}
                className="px-3 py-1 bg-[#006c48] hover:bg-[#012d1d] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-xs">payments</span>
                <span>{paymentStatus === 'paid' ? 'Pay / Re-bill' : 'Pay Now'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Journey to Your Door Tracker */}
      <section className="bg-white rounded-3xl p-8 border border-[#c1c8c2]/30 ambient-shadow">
        <h2 className="font-serif-display text-2xl font-bold text-[#012d1d] mb-6">
          Journey to Your Door
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Step 1 */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#012d1d] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md">
              <span className="material-symbols-outlined text-lg">nature</span>
            </div>
            <div>
              <div className="font-bold text-[#191c1d] text-sm md:text-base">1. Sunrise Harvest</div>
              <div className="text-xs text-[#414844] mt-0.5">El-Beheira Organic Acres</div>
              <div className="text-xs text-[#006c48] font-semibold mt-1">Scheduled: 05:30 AM</div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#92f7c3] text-[#002114] flex items-center justify-center font-bold text-sm shrink-0 shadow-md">
              <span className="material-symbols-outlined text-lg">local_shipping</span>
            </div>
            <div>
              <div className="font-bold text-[#191c1d] text-sm md:text-base">2. Cold-Chain Dispatch</div>
              <div className="text-xs text-[#414844] mt-0.5">Zero-Emissions Electric Van</div>
              <div className="text-xs text-[#414844] mt-1">Estimated: 07:15 AM</div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#e1e3e4] text-[#414844] flex items-center justify-center font-bold text-sm shrink-0">
              <span className="material-symbols-outlined text-lg">home</span>
            </div>
            <div>
              <div className="font-bold text-[#191c1d] text-sm md:text-base">3. Kitchen Arrival</div>
              <div className="text-xs text-[#414844] mt-0.5">Contactless Porch Drop</div>
              <div className="text-xs text-[#414844] mt-1">Tomorrow, ~08:30 AM</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Community Impact Card */}
      <section className="bg-[#92f7c3]/25 rounded-2xl p-6 border border-[#006c48]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-3xl text-[#006c48]">volunteer_activism</span>
          <div>
            <div className="font-bold text-[#002114] text-base">Community &amp; Climate Impact</div>
            <div className="text-xs text-[#012d1d]/80">
              Directly supported {order.farmsSupported} family growers and saved {order.emissionsSavedKg} kg CO₂ emissions.
            </div>
          </div>
        </div>
        <div className="px-4 py-1.5 bg-[#012d1d] text-white text-xs font-bold rounded-full shadow-xs whitespace-nowrap">
          100% Fair Grower Pay
        </div>
      </section>

      {/* 4. Realistic Paper Receipt Style Itemized Invoice */}
      <section className="bg-white rounded-3xl p-8 md:p-12 border border-[#c1c8c2]/30 ambient-shadow relative overflow-hidden">
        {/* Jagged receipt visual accents */}
        <div className="border-b-2 border-dashed border-[#c1c8c2]/40 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="font-serif-display text-2xl font-bold text-[#012d1d]">FarmFlow Invoice</div>
            <div className="text-xs text-[#414844] mt-1">
              Issued by Green Valley Co-operative | Tax ID #CA-9481029
            </div>
          </div>
          <div className="text-left md:text-right text-xs text-[#414844]">
            <div>Date: <span className="font-bold text-[#191c1d]">{order.date}</span></div>
            <div>Billed to: <span className="font-bold text-[#191c1d]">Local Food Lover (CA)</span></div>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="overflow-x-auto mb-8">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#c1c8c2]/30 text-[#414844] text-xs uppercase font-bold tracking-wider">
                <th className="py-3 px-2">Item &amp; Farm Origin</th>
                <th className="py-3 px-2 text-center">Unit</th>
                <th className="py-3 px-2 text-center">Qty</th>
                <th className="py-3 px-2 text-right">Price</th>
                <th className="py-3 px-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c1c8c2]/20">
              {order.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#f8f9fa] transition-colors">
                  <td className="py-3 px-2">
                    <div className="font-bold text-[#191c1d]">{item.name}</div>
                    <div className="text-xs text-[#414844]">{item.origin}</div>
                  </td>
                  <td className="py-3 px-2 text-center text-[#414844]">{item.unitWeight}</td>
                  <td className="py-3 px-2 text-center font-bold text-[#191c1d]">{item.quantity}</td>
                  <td className="py-3 px-2 text-right text-[#414844]">${item.unitPrice.toFixed(2)}</td>
                  <td className="py-3 px-2 text-right font-bold text-[#012d1d]">${item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Calculation Summary */}
        <div className="border-t border-[#c1c8c2]/30 pt-6 flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Freshness guarantee & QR */}
          <div className="max-w-xs space-y-3">
            <div className="flex items-center gap-2 text-[#006c48] text-xs font-bold uppercase">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              <span>100% Sunrise Freshness Guarantee</span>
            </div>
            <p className="text-xs text-[#414844] leading-relaxed">
              Every item is harvested within 24 hours of delivery. If any product is not crisp and fresh, request an instant one-tap refund.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="w-14 h-14 bg-[#f3f4f5] border border-[#c1c8c2]/40 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-[#012d1d]">qr_code_2</span>
              </div>
              <span className="text-[11px] text-[#414844]">Scan to track harvest temperature logs &amp; driver live GPS</span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="w-full md:w-80 space-y-2.5 text-sm">
            <div className="flex justify-between text-[#414844]">
              <span>Produce Subtotal</span>
              <span className="font-medium text-[#191c1d]">${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#414844]">
              <span>Zero-Emissions Delivery</span>
              <span className="font-medium text-[#191c1d]">
                {order.deliveryFee === 0 ? 'FREE' : `$${order.deliveryFee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-[#414844]">
              <span>Eco-Packaging Offset</span>
              <span className="font-medium text-[#191c1d]">${order.ecoPackagingOffset.toFixed(2)}</span>
            </div>
            {order.crateFee > 0 && (
              <div className="flex justify-between text-[#414844]">
                <span>Returnable Wooden Crate Deposit</span>
                <span className="font-medium text-[#191c1d]">${order.crateFee.toFixed(2)}</span>
              </div>
            )}
            {order.farmerTip > 0 && (
              <div className="flex justify-between text-[#414844]">
                <span>Farmer Fair-Pay Direct Tip</span>
                <span className="font-medium text-[#006c48]">${order.farmerTip.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-[#c1c8c2]/40 pt-3 flex justify-between items-baseline font-serif-display text-xl font-bold text-[#012d1d]">
              <span>Total Paid</span>
              <span>${order.totalPaid.toFixed(2)}</span>
            </div>
            <div className="text-right text-xs text-[#414844]">
              Paid via Visa •••• {order.cardLast4}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 pt-6 border-t border-[#c1c8c2]/30 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Primary Pay Invoice Button */}
            <button
              id="pay-invoice-btn"
              onClick={() => setIsPaymentModalOpen(true)}
              className="flex items-center gap-2 px-7 py-3 rounded-full bg-[#006c48] text-white hover:bg-[#012d1d] text-sm font-bold transition-all cursor-pointer w-full sm:w-auto justify-center shadow-md hover:scale-105"
            >
              <span className="material-symbols-outlined text-lg">credit_card</span>
              <span>
                {paymentStatus === 'paid'
                  ? `Pay / Re-bill ($${order.totalPaid.toFixed(2)})`
                  : `Pay Invoice ($${order.totalPaid.toFixed(2)})`}
              </span>
            </button>

            <button
              id="download-pdf-invoice-btn"
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-[#006c48]/30 text-[#006c48] hover:bg-[#f3f4f5] text-sm font-semibold transition-colors cursor-pointer w-full sm:w-auto justify-center shadow-2xs"
            >
              <span className="material-symbols-outlined text-lg">download</span>
              <span>Download PDF</span>
            </button>

            <button
              id="print-invoice-btn"
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-3 rounded-full border border-[#c1c8c2]/40 text-[#414844] hover:bg-[#f3f4f5] text-sm font-semibold transition-colors cursor-pointer w-full sm:w-auto justify-center"
            >
              <span className="material-symbols-outlined text-lg">print</span>
              <span>Print Receipt</span>
            </button>
          </div>

          <button
            id="return-to-marketplace-btn"
            onClick={onReturnToMarketplace}
            className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#012d1d] text-white text-sm font-bold hover:bg-[#1b4332] transition-colors cursor-pointer shadow-md w-full sm:w-auto justify-center"
          >
            <span>Return to Marketplace</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </div>
      </section>

      {/* Secure Order Payment Modal */}
      <OrderPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        order={order}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

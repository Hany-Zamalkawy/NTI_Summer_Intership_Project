import React, { useState } from 'react';
import { OrderConfirmation } from '../types';

interface OrderPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderConfirmation;
  onPaymentSuccess: (details: {
    orderNumber: string;
    totalPaid: number;
    cardLast4: string;
    paymentMethod: string;
  }) => void;
}

export const OrderPaymentModal: React.FC<OrderPaymentModalProps> = ({
  isOpen,
  onClose,
  order,
  onPaymentSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet' | 'credit' | 'cash'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('08/27');
  const [cvc, setCvc] = useState('884');
  const [cardName, setCardName] = useState('Sarah Jenkins');
  const [tipPercent, setTipPercent] = useState<number>(order.farmerTip > 0 ? 10 : 0);
  const [applyCrateCredit, setApplyCrateCredit] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [saveCard, setSaveCard] = useState(true);

  if (!isOpen) return null;

  const availableCrateCredit = 6.0; // $6.00 from 3 returned crates
  const calculatedTip = Number(((order.subtotal * tipPercent) / 100).toFixed(2));
  const creditDiscount = applyCrateCredit ? availableCrateCredit : 0.0;
  const finalTotal = Math.max(
    0,
    Number((order.subtotal + order.deliveryFee + order.ecoPackagingOffset + calculatedTip - creditDiscount).toFixed(2))
  );

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const last4 = paymentMethod === 'card' ? cardNumber.slice(-4) || '4242' : 'WAL';
      const methodName =
        paymentMethod === 'card'
          ? 'Visa Card'
          : paymentMethod === 'wallet'
          ? 'Digital Wallet (Apple/Google Pay)'
          : paymentMethod === 'credit'
          ? 'Farm Crate Deposit Credit'
          : 'Pay on Doorstep Delivery';

      onPaymentSuccess({
        orderNumber: order.orderNumber,
        totalPaid: finalTotal,
        cardLast4: last4,
        paymentMethod: methodName,
      });
      onClose();
    }, 900);
  };

  return (
    <div
      id="order-payment-modal"
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-[#c1c8c2]/40 my-8 flex flex-col max-h-[92vh] animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#012d1d] via-[#004d33] to-[#012d1d] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#92f7c3]/20 text-[#92f7c3] flex items-center justify-center border border-[#92f7c3]/30">
              <span className="material-symbols-outlined text-2xl">credit_card</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#92f7c3]">
                  Secure Checkout
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#92f7c3]" />
                <span className="text-[11px] text-white/80 font-mono">#{order.orderNumber}</span>
              </div>
              <h3 className="font-serif-display text-xl font-bold">
                Pay for Harvest Order
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close payment modal"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <form onSubmit={handlePay} className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* Order Summary Snapshot */}
          <div className="bg-[#f8f9fa] rounded-2xl p-4 border border-[#c1c8c2]/30 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold text-[#414844]">
              <span>Produce Subtotal ({order.items.length} items)</span>
              <span className="font-mono text-[#191c1d]">${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#414844]">
              <span className="flex items-center gap-1">
                <span>Zero-Emission Delivery</span>
                {order.deliveryFee === 0 && (
                  <span className="text-[10px] bg-[#92f7c3]/50 text-[#006c48] px-1.5 py-0.2 rounded font-bold">
                    FREE
                  </span>
                )}
              </span>
              <span className="font-mono text-[#191c1d]">${order.deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#414844]">
              <span>100% Compostable Packaging Offset</span>
              <span className="font-mono text-[#191c1d]">${order.ecoPackagingOffset.toFixed(2)}</span>
            </div>

            {calculatedTip > 0 && (
              <div className="flex items-center justify-between text-xs font-semibold text-[#006c48]">
                <span>Farmer Appreciation Tip ({tipPercent}%)</span>
                <span className="font-mono">+${calculatedTip.toFixed(2)}</span>
              </div>
            )}

            {applyCrateCredit && (
              <div className="flex items-center justify-between text-xs font-semibold text-[#006c48]">
                <span>Returned Crate Deposit Credit</span>
                <span className="font-mono">-${creditDiscount.toFixed(2)}</span>
              </div>
            )}

            <div className="pt-2 border-t border-[#c1c8c2]/30 flex items-center justify-between text-sm font-bold text-[#012d1d]">
              <span>Total Amount Due</span>
              <span className="text-lg font-serif-display text-[#006c48]">
                ${finalTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Farmer Tip Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#414844] mb-2">
              Farmer &amp; Harvester Appreciation Tip
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[0, 10, 15, 20].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setTipPercent(pct)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    tipPercent === pct
                      ? 'bg-[#006c48] text-white border-[#006c48] shadow-xs'
                      : 'bg-white text-[#414844] border-[#c1c8c2]/40 hover:bg-[#f3f4f5]'
                  }`}
                >
                  {pct === 0 ? 'No Tip' : `${pct}% ($${((order.subtotal * pct) / 100).toFixed(2)})`}
                </button>
              ))}
            </div>
          </div>

          {/* Crate Credit Redemption Toggle */}
          <div className="p-3 bg-[#92f7c3]/20 rounded-2xl border border-[#006c48]/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006c48] text-lg">recycling</span>
              <div>
                <span className="text-xs font-bold text-[#002114] block">
                  Apply Crate Return Credit ($6.00 Available)
                </span>
                <span className="text-[11px] text-[#414844]">
                  Earned from 3 sanitized wooden crates returned
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={applyCrateCredit}
              onChange={(e) => setApplyCrateCredit(e.target.checked)}
              className="w-5 h-5 rounded text-[#006c48] accent-[#006c48] cursor-pointer"
            />
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#414844] mb-2">
              Select Payment Method
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'card', label: 'Credit Card', icon: 'credit_card' },
                { id: 'wallet', label: 'Apple/Google', icon: 'account_balance_wallet' },
                { id: 'credit', label: 'Farm Credit', icon: 'savings' },
                { id: 'cash', label: 'Doorstep', icon: 'payments' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    paymentMethod === m.id
                      ? 'bg-[#012d1d] text-white border-[#012d1d] shadow-xs'
                      : 'bg-white text-[#414844] border-[#c1c8c2]/40 hover:bg-[#f8f9fa]'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">{m.icon}</span>
                  <span className="text-xs font-semibold">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Credit Card Input Form */}
          {paymentMethod === 'card' && (
            <div className="space-y-4 bg-white rounded-2xl p-4 border border-[#c1c8c2]/40 shadow-2xs animate-fade-in">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#414844] mb-1">
                  Cardholder Full Name
                </label>
                <input
                  type="text"
                  required
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="Name on card"
                  className="w-full px-3.5 py-2.5 bg-[#f8f9fa] border border-[#c1c8c2]/40 rounded-xl text-xs font-medium text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#006c48] focus:bg-white"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#414844]">
                    Card Number
                  </label>
                  <span className="text-[10px] text-[#006c48] font-bold">VISA / MASTERCARD</span>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#717874] text-base">
                    credit_card
                  </span>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    className="w-full pl-9 pr-4 py-2.5 bg-[#f8f9fa] border border-[#c1c8c2]/40 rounded-xl text-xs font-mono text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#006c48] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#414844] mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="text"
                    required
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full px-3.5 py-2.5 bg-[#f8f9fa] border border-[#c1c8c2]/40 rounded-xl text-xs font-mono text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#006c48] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#414844] mb-1">
                    Security Code (CVC)
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    placeholder="123"
                    className="w-full px-3.5 py-2.5 bg-[#f8f9fa] border border-[#c1c8c2]/40 rounded-xl text-xs font-mono text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#006c48] focus:bg-white"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer text-xs text-[#414844]">
                <input
                  type="checkbox"
                  checked={saveCard}
                  onChange={(e) => setSaveCard(e.target.checked)}
                  className="w-4 h-4 rounded text-[#006c48] accent-[#006c48] cursor-pointer"
                />
                <span>Save card safely for future sunrise harvests</span>
              </label>
            </div>
          )}

          {/* Digital Wallet Info */}
          {paymentMethod === 'wallet' && (
            <div className="p-5 rounded-2xl bg-[#f8f9fa] border border-[#c1c8c2]/40 text-center space-y-3 animate-fade-in">
              <span className="material-symbols-outlined text-3xl text-[#006c48]">contactless</span>
              <div className="text-xs text-[#414844] leading-relaxed">
                Clicking pay will launch your browser's native Apple Pay or Google Pay wallet prompt with Touch ID / Face ID verification.
              </div>
            </div>
          )}

          {/* Farm Credit Info */}
          {paymentMethod === 'credit' && (
            <div className="p-5 rounded-2xl bg-[#92f7c3]/20 border border-[#006c48]/20 text-center space-y-2 animate-fade-in">
              <span className="material-symbols-outlined text-3xl text-[#006c48]">savings</span>
              <div className="text-xs font-bold text-[#002114]">
                Farm Balance: $48.50 Available
              </div>
              <p className="text-[11px] text-[#414844]">
                Amount of ${finalTotal.toFixed(2)} will be debited from your pre-loaded FarmFlow member balance.
              </p>
            </div>
          )}

          {/* Cash on Delivery Info */}
          {paymentMethod === 'cash' && (
            <div className="p-5 rounded-2xl bg-[#f8f9fa] border border-[#c1c8c2]/40 text-center space-y-2 animate-fade-in">
              <span className="material-symbols-outlined text-3xl text-[#012d1d]">local_shipping</span>
              <div className="text-xs font-bold text-[#012d1d]">
                Contactless Payment at Doorstep
              </div>
              <p className="text-[11px] text-[#414844]">
                Pay our cold-chain driver directly via contactless mobile tap or exact cash upon delivery ({order.deliveryWindow}).
              </p>
            </div>
          )}

          {/* Trust Guarantee */}
          <div className="flex items-center justify-center gap-4 text-[11px] text-[#717874] pt-1">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-[#006c48]">lock</span>
              256-Bit SSL Encrypted
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-[#006c48]">verified</span>
              100% Freshness Guarantee
            </span>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3 rounded-xl border border-[#c1c8c2]/40 text-xs font-bold text-[#414844] hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="confirm-pay-order-btn"
              type="submit"
              disabled={isProcessing}
              className="w-2/3 py-3.5 rounded-xl bg-[#006c48] hover:bg-[#012d1d] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authorizing Payment...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">lock</span>
                  <span>Pay ${finalTotal.toFixed(2)} Now</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

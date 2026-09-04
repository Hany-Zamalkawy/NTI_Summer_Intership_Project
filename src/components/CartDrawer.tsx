import React, { useState } from 'react';
import { Product } from '../types';
import { PAIRING_PRODUCTS } from '../data/mockData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: { [productId: number]: number };
  allProducts: Product[];
  onUpdateQuantity: (product: Product, newQty: number) => void;
  onProceedToCheckout: (packagingOption: 'standard' | 'returnable_crate', tipPercent: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  allProducts,
  onUpdateQuantity,
  onProceedToCheckout,
}) => {
  const [useReturnableCrate, setUseReturnableCrate] = useState(false);
  const [tipPercent, setTipPercent] = useState(10);

  if (!isOpen) return null;

  // Find products in cart
  const cartItems = Object.entries(cart)
    .map(([idStr, qty]) => {
      const id = parseInt(idStr, 10);
      const product = allProducts.find((p) => p.id === id);
      return { product, quantity: Number(qty) || 0 };
    })
    .filter((item): item is { product: Product; quantity: number } => Boolean(item.product && item.quantity > 0));

  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Math calculations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const freeDeliveryThreshold = 35.0;
  const isFreeDelivery = subtotal >= freeDeliveryThreshold || subtotal === 0;
  const deliveryFee = isFreeDelivery ? 0 : 4.5;
  const neededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  const ecoPackagingOffset = 0.50;
  const crateFee = useReturnableCrate ? 2.00 : 0.00;
  const tipAmount = (subtotal * tipPercent) / 100;
  const grandTotal = subtotal + deliveryFee + ecoPackagingOffset + crateFee + tipAmount;

  // Group by category
  const vegItems = cartItems.filter((i) => i.product.category === 'vegetables');
  const fruitItems = cartItems.filter((i) => i.product.category === 'fruits');
  const otherItems = cartItems.filter((i) => i.product.category === 'pantry');

  const handleCheckoutClick = () => {
    onProceedToCheckout(useReturnableCrate ? 'returnable_crate' : 'standard', tipPercent);
  };

  return (
    <div
      id="cart-drawer-backdrop"
      className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="cart-drawer-panel"
        className="w-full max-w-md bg-[#f8f9fa] h-full flex flex-col shadow-2xl overflow-hidden border-l border-[#c1c8c2]/30 animate-in slide-in-from-right duration-300"
      >
        {/* Drawer Header */}
        <div className="p-6 bg-white border-b border-[#c1c8c2]/30 flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-serif-display text-2xl font-bold text-[#012d1d]">
              Your Farm Basket
            </h2>
            <p className="text-xs text-[#414844] mt-0.5">
              Directly supporting local family growers in Green Valley
            </p>
          </div>
          <button
            id="close-cart-btn"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#f3f4f5] hover:bg-[#e1e3e4] text-[#414844] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close basket"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Free Delivery Bar */}
        <div className="p-4 bg-[#92f7c3]/20 border-b border-[#006c48]/15 shrink-0">
          <div className="flex justify-between text-xs font-semibold text-[#002114] mb-1.5">
            <span>
              {isFreeDelivery
                ? "🎉 You've unlocked FREE zero-emissions delivery!"
                : `Add $${neededForFreeDelivery.toFixed(2)} more for FREE delivery`}
            </span>
            <span>${subtotal.toFixed(2)} / $35.00</span>
          </div>
          <div className="w-full bg-[#c1ecd4] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#006c48] h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-6xl text-[#c1c8c2] mb-3">
                shopping_basket
              </span>
              <p className="font-serif-display text-xl text-[#191c1d] font-bold">
                Your basket is empty
              </p>
              <p className="text-xs text-[#414844] mt-1 max-w-xs mx-auto">
                Explore today's sunrise harvest and add fresh greens, roots, and tree-ripened fruits.
              </p>
            </div>
          ) : (
            <>
              {/* Fresh Vegetables Group */}
              {vegItems.length > 0 && (
                <div>
                  <h3 className="text-xs uppercase font-bold text-[#414844] tracking-wider mb-3">
                    Fresh Vegetables ({vegItems.length})
                  </h3>
                  <div className="space-y-3">
                    {vegItems.map(({ product, quantity }) => (
                      <div
                        key={product.id}
                        className="bg-white rounded-xl p-3 border border-[#c1c8c2]/30 flex items-center gap-3 shadow-2xs"
                      >
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-lg object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-[#191c1d] truncate">
                            {product.name}
                          </h4>
                          <div className="text-[11px] text-[#414844]">
                            {product.farm} • {product.harvestTime || 'Fresh harvest'}
                          </div>
                          <div className="text-xs font-bold text-[#012d1d] mt-1">
                            ${(product.price * quantity).toFixed(2)}
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center border border-[#c1c8c2]/40 rounded-full bg-[#f8f9fa] shadow-2xs">
                          <button
                            onClick={() => onUpdateQuantity(product, quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-[#012d1d] hover:bg-[#e1e3e4] rounded-full transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-xs">remove</span>
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-[#191c1d]">
                            {quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(product, quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-[#012d1d] hover:bg-[#e1e3e4] rounded-full transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-xs">add</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fresh Fruits Group */}
              {fruitItems.length > 0 && (
                <div>
                  <h3 className="text-xs uppercase font-bold text-[#414844] tracking-wider mb-3">
                    Fresh Fruits ({fruitItems.length})
                  </h3>
                  <div className="space-y-3">
                    {fruitItems.map(({ product, quantity }) => (
                      <div
                        key={product.id}
                        className="bg-white rounded-xl p-3 border border-[#c1c8c2]/30 flex items-center gap-3 shadow-2xs"
                      >
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-lg object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-[#191c1d] truncate">
                            {product.name}
                          </h4>
                          <div className="text-[11px] text-[#414844]">
                            {product.farm} • {product.harvestTime || 'Fresh harvest'}
                          </div>
                          <div className="text-xs font-bold text-[#012d1d] mt-1">
                            ${(product.price * quantity).toFixed(2)}
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center border border-[#c1c8c2]/40 rounded-full bg-[#f8f9fa] shadow-2xs">
                          <button
                            onClick={() => onUpdateQuantity(product, quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-[#012d1d] hover:bg-[#e1e3e4] rounded-full transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-xs">remove</span>
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-[#191c1d]">
                            {quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(product, quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-[#012d1d] hover:bg-[#e1e3e4] rounded-full transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-xs">add</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Other Items */}
              {otherItems.length > 0 && (
                <div>
                  <h3 className="text-xs uppercase font-bold text-[#414844] tracking-wider mb-3">
                    Artisan &amp; Pantry Items ({otherItems.length})
                  </h3>
                  <div className="space-y-3">
                    {otherItems.map(({ product, quantity }) => (
                      <div
                        key={product.id}
                        className="bg-white rounded-xl p-3 border border-[#c1c8c2]/30 flex items-center gap-3 shadow-2xs"
                      >
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-16 h-16 rounded-lg object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-[#191c1d] truncate">
                            {product.name}
                          </h4>
                          <div className="text-[11px] text-[#414844]">
                            {product.farm}
                          </div>
                          <div className="text-xs font-bold text-[#012d1d] mt-1">
                            ${(product.price * quantity).toFixed(2)}
                          </div>
                        </div>

                        <div className="flex items-center border border-[#c1c8c2]/40 rounded-full bg-[#f8f9fa]">
                          <button
                            onClick={() => onUpdateQuantity(product, quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-[#012d1d] hover:bg-[#e1e3e4] rounded-full transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-xs">remove</span>
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-[#191c1d]">
                            {quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(product, quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-[#012d1d] hover:bg-[#e1e3e4] rounded-full transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-xs">add</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Seasonal Recipe Suggestions Callout */}
              {vegItems.length > 0 && (
                <div className="p-3.5 bg-gradient-to-r from-[#92f7c3]/20 via-[#c1ecd4]/20 to-white rounded-2xl border border-[#006c48]/25 flex items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#006c48] text-white flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-base">skillet</span>
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#002114] truncate">
                        Recipe Ideas for Your Vegetables
                      </div>
                      <div className="text-[11px] text-[#414844] truncate">
                        Matched to {vegItems.map((v) => v.product.name.split(' ')[0]).join(', ')}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      setTimeout(() => {
                        const el = document.getElementById('seasonal-recipe-suggestions');
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 100);
                    }}
                    className="px-2.5 py-1.5 bg-[#006c48] hover:bg-[#012d1d] text-white text-[11px] font-bold rounded-lg shrink-0 cursor-pointer shadow-2xs transition-colors whitespace-nowrap"
                  >
                    View Recipes →
                  </button>
                </div>
              )}

              {/* Recommendations Reel */}
              <div className="pt-2">
                <h3 className="text-xs uppercase font-bold text-[#414844] tracking-wider mb-3">
                  Pairs Well With Your Basket
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {PAIRING_PRODUCTS.map((prod) => (
                    <div
                      key={prod.id}
                      className="bg-white rounded-xl p-2.5 border border-[#c1c8c2]/30 flex flex-col items-center text-center shadow-2xs"
                    >
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-12 h-12 rounded-lg object-cover mb-1.5"
                      />
                      <div className="font-bold text-xs text-[#191c1d] truncate w-full">
                        {prod.name}
                      </div>
                      <div className="text-[11px] text-[#414844] mb-2">
                        ${prod.price.toFixed(2)}
                      </div>
                      <button
                        onClick={() => onUpdateQuantity(prod, (cart[prod.id] || 0) + 1)}
                        className="w-full py-1 bg-[#f3f4f5] hover:bg-[#012d1d] hover:text-white rounded-md text-[11px] font-bold text-[#012d1d] transition-colors cursor-pointer"
                      >
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Packaging Choice */}
              <div className="pt-2 border-t border-[#c1c8c2]/30">
                <h3 className="text-xs uppercase font-bold text-[#414844] tracking-wider mb-2">
                  Packaging Options
                </h3>
                <label className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#c1c8c2]/30 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useReturnableCrate}
                    onChange={(e) => setUseReturnableCrate(e.target.checked)}
                    className="w-4 h-4 rounded text-[#012d1d] focus:ring-[#006c48]"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-[#191c1d]">Returnable Wooden Farm Crate</span>
                    <span className="text-[#414844] block">+$2.00 deposit (refunded on your next harvest swap)</span>
                  </div>
                </label>
              </div>

              {/* Farmer Tip Selector */}
              <div className="pt-2">
                <h3 className="text-xs uppercase font-bold text-[#414844] tracking-wider mb-2">
                  Farmer Fair-Pay Tip
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 5, 10, 15].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => setTipPercent(pct)}
                      className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        tipPercent === pct
                          ? 'bg-[#012d1d] text-white shadow-xs'
                          : 'bg-white border border-[#c1c8c2]/40 text-[#414844] hover:bg-[#f3f4f5]'
                      }`}
                    >
                      {pct === 0 ? 'None' : `${pct}%`}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer with Calculation & Proceed Button */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-white border-t border-[#c1c8c2]/30 shrink-0 space-y-3">
            <div className="space-y-1.5 text-xs text-[#414844]">
              <div className="flex justify-between">
                <span>Produce Subtotal ({totalItemCount} items)</span>
                <span className="font-medium text-[#191c1d]">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Zero-Emissions Delivery</span>
                <span className="font-medium text-[#191c1d]">
                  {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Eco-Packaging Offset</span>
                <span className="font-medium text-[#191c1d]">${ecoPackagingOffset.toFixed(2)}</span>
              </div>
              {useReturnableCrate && (
                <div className="flex justify-between">
                  <span>Returnable Crate Deposit</span>
                  <span className="font-medium text-[#191c1d]">${crateFee.toFixed(2)}</span>
                </div>
              )}
              {tipAmount > 0 && (
                <div className="flex justify-between">
                  <span>Direct Farmer Tip ({tipPercent}%)</span>
                  <span className="font-medium text-[#006c48]">${tipAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-[#c1c8c2]/30 pt-2 flex justify-between font-serif-display text-lg font-bold text-[#012d1d]">
                <span>Total Due</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              id="proceed-checkout-btn"
              onClick={handleCheckoutClick}
              className="w-full py-4 rounded-full bg-[#012d1d] text-white font-bold text-sm hover:bg-[#1b4332] transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <span>Proceed to Green Checkout</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>

            <div className="flex items-center justify-center gap-4 text-[11px] text-[#414844] pt-1">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-[#006c48]">ac_unit</span>
                <span>Cold-Chain Insulated</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-[#006c48]">check</span>
                <span>Direct Farmer Payout</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

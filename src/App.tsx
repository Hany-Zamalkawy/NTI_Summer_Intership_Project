import React, { useState } from 'react';
import { ActiveScreen, OrderConfirmation, Product, SubscriptionPlan, UserProfile } from './types';
import { ALL_PRODUCTS, VEGETABLE_PRODUCTS, FRUIT_PRODUCTS, INITIAL_CART_ITEMS } from './data/mockData';
import { SideNavBar } from './components/SideNavBar';
import { TopAppBar } from './components/TopAppBar';
import { MarketplaceView } from './components/MarketplaceView';
import { SubscriptionsView } from './components/SubscriptionsView';
import { InvoiceView } from './components/InvoiceView';
import { OrdersView } from './components/OrdersView';
import { CartDrawer } from './components/CartDrawer';
import { SeasonalAvailabilityWidget } from './components/SeasonalAvailabilityWidget';
import { YourAccountView } from './components/YourAccountView';
import { LoginBranchView } from './components/LoginBranchView';

export default function App() {
  // Navigation State
  const [currentScreen, setCurrentScreen] = useState<ActiveScreen>('marketplace');
  const [categoryTab, setCategoryTab] = useState<string>('Seasonal');

  // Drawers and Modals
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // User Profile & Authentication State (Default signed in as Sarah Jenkins for frictionless exploration)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>({
    id: 'usr_7891',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@farmflow.eco',
    phone: '(555) 382-9410',
    address: '104 Organic Way',
    aptOrSuite: 'Apt 3B',
    city: 'Green Valley',
    state: 'CA',
    zipCode: '95945',
    memberSince: 'March 2023',
    memberId: 'GV-4402',
    preferredDeliveryWindow: 'Tomorrow, 8:00 AM – 10:00 AM',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    stats: {
      produceEnjoyedLbs: 38,
      farmsSupported: 4,
      co2SavedKg: 14.8,
      ordersCompleted: 9,
    },
    preferences: {
      organicOnly: true,
      smsAlerts: true,
      pushNotifications: true,
      reusableCrateProgram: true,
    },
  });

  // Cart State (Initialized with the 2 items matching user's screenshots: 1 Romaine, 2 Strawberries)
  const [cart, setCart] = useState<{ [productId: number]: number }>({
    1: 1, // Romaine Lettuce
    5: 2, // Strawberries & Blackberries
  });

  // Dynamic order state (seeded with confirmed harvest order matching Invoice screenshot)
  const [currentOrder, setCurrentOrder] = useState<OrderConfirmation>({
    orderNumber: 'FF-89421',
    date: 'Oct 24, 2023',
    deliveryWindow: 'Tomorrow, 8:00 AM – 10:00 AM',
    status: 'Awaiting Morning Harvest',
    items: [
      {
        name: 'Crisp Romaine & Hydroponic Butterhead',
        origin: 'Mariout Greenhouses',
        unitWeight: '1 bunch',
        quantity: 1,
        unitPrice: 4.50,
        total: 4.50,
      },
      {
        name: 'Sweet Strawberries & Wild Blackberries',
        origin: 'Berry Creek Farm',
        unitWeight: '1 punnet',
        quantity: 2,
        unitPrice: 6.00,
        total: 12.00,
      },
      {
        name: 'Vine-Ripened Beefsteak Tomatoes',
        origin: 'Sunny Patch',
        unitWeight: '1 basket',
        quantity: 1,
        unitPrice: 5.20,
        total: 5.20,
      },
    ],
    subtotal: 21.70,
    deliveryFee: 0.00,
    ecoPackagingOffset: 0.50,
    crateFee: 0.00,
    farmerTip: 2.17,
    totalPaid: 24.37,
    cardLast4: '4242',
    farmsSupported: 3,
    emissionsSavedKg: 4.2,
  });

  // Quantity updater
  const handleUpdateQuantity = (product: Product, newQty: number) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (newQty <= 0) {
        delete updated[product.id];
      } else {
        updated[product.id] = newQty;
      }
      return updated;
    });
  };

  // Add custom crate to cart
  const handleAddCustomCrate = (crateName: string, items: string[], price: number) => {
    // Generate a temporary product or add individual items
    const crateProduct: Product = {
      id: 999,
      name: `${crateName} (${items.slice(0, 2).join(', ')}...)`,
      category: 'vegetables',
      farm: 'Local Green Valley Co-op',
      distanceKm: 10,
      price: price,
      unit: 'crate',
      imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1U3oAbvwZTlhdn2O9YMhDUfzPtf6XSE99fOkF3AsF8JQ57I2mmdCt4h8L3AFKgfui07Zy-tP3Ba3QXxT28SlMhlB10ZIegzDEEXQogDc4YUnTo-0EzgJ01Q5Zw7U5p0dvFQy2LO2btcGR7S_2CN0mZAaQdj4BOTFnw1l15BpLXGUkC9LAKSH5PduvBmnBR5tJRp1qEziDK4ZV6ilfAe4SENaLYsj3O9DNpf52VHxL-txbK6YyfGXFDyKQI',
    };
    handleUpdateQuantity(crateProduct, (cart[999] || 0) + 1);
  };

  // Checkout submission
  const handleProceedToCheckout = (
    packagingOption: 'standard' | 'returnable_crate',
    tipPercent: number
  ) => {
    // Build actual order from current cart
    const orderItems = Object.entries(cart)
      .map(([idStr, qty]) => {
        const id = parseInt(idStr, 10);
        const product = ALL_PRODUCTS.find((p) => p.id === id) || {
          id: 999,
          name: 'Custom Harvest Crate',
          farm: 'Local Co-op',
          unit: 'crate',
          price: 24.50,
          category: 'vegetables',
          distanceKm: 10,
          imageUrl: '',
        };
        const quantityNum = Number(qty) || 0;
        return {
          name: product.name,
          origin: product.farm,
          unitWeight: product.unit,
          quantity: quantityNum,
          unitPrice: product.price,
          total: product.price * quantityNum,
        };
      })
      .filter((i) => i.quantity > 0);

    const subtotal = orderItems.reduce((acc, i) => acc + i.total, 0);
    const deliveryFee = subtotal >= 35 ? 0 : 4.50;
    const ecoPackagingOffset = 0.50;
    const crateFee = packagingOption === 'returnable_crate' ? 2.00 : 0.00;
    const farmerTip = Number(((subtotal * tipPercent) / 100).toFixed(2));
    const totalPaid = Number(
      (subtotal + deliveryFee + ecoPackagingOffset + crateFee + farmerTip).toFixed(2)
    );

    const newOrderNumber = `FF-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder: OrderConfirmation = {
      orderNumber: newOrderNumber,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      deliveryWindow: 'Tomorrow, 8:00 AM – 10:00 AM',
      status: 'Awaiting Morning Harvest',
      items: orderItems.length > 0 ? orderItems : currentOrder.items,
      subtotal: subtotal > 0 ? subtotal : currentOrder.subtotal,
      deliveryFee,
      ecoPackagingOffset,
      crateFee,
      farmerTip,
      totalPaid: totalPaid > 0 ? totalPaid : currentOrder.totalPaid,
      cardLast4: '4242',
      farmsSupported: Math.max(1, orderItems.length),
      emissionsSavedKg: Number((orderItems.length * 1.4).toFixed(1)),
    };

    setCurrentOrder(newOrder);
    setIsCartOpen(false);
    setCurrentScreen('invoice');
  };

  // Subscription plan selection
  const handleSelectPlan = (plan: SubscriptionPlan, billingCycle: 'weekly' | 'monthly') => {
    // Add plan confirmation or transition to subscription orders
    const price = billingCycle === 'weekly' ? plan.priceWeekly : plan.priceMonthly;
    const newOrder: OrderConfirmation = {
      orderNumber: `SUB-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      deliveryWindow: 'Every Tuesday, 8:00 AM – 10:00 AM',
      status: 'Subscription Active - First Harvest Prep',
      items: [
        {
          name: `${plan.name} (${billingCycle.toUpperCase()} Subscription)`,
          origin: 'Green Valley Regenerative Farm Network',
          unitWeight: '1 box/cycle',
          quantity: 1,
          unitPrice: price,
          total: price,
        },
      ],
      subtotal: price,
      deliveryFee: 0.00,
      ecoPackagingOffset: 0.00,
      crateFee: 0.00,
      farmerTip: Number((price * 0.1).toFixed(2)),
      totalPaid: Number((price * 1.1).toFixed(2)),
      cardLast4: '4242',
      farmsSupported: 4,
      emissionsSavedKg: 8.5,
    };
    setCurrentOrder(newOrder);
    setCurrentScreen('invoice');
  };

  const totalCartCount = Object.values(cart).reduce<number>(
    (sum, q) => sum + (Number(q) || 0),
    0
  );

  const handleSelectSeasonalProduct = (productId: number) => {
    setCategoryTab('All Fresh Harvest');
    setCurrentScreen('marketplace');
    setTimeout(() => {
      const card =
        document.getElementById(`veg-card-${productId}`) ||
        document.getElementById(`fruit-card-${productId}`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.classList.add('ring-4', 'ring-[#006c48]', 'transition-all');
        setTimeout(() => {
          card.classList.remove('ring-4', 'ring-[#006c48]');
        }, 2200);
      }
    }, 150);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans text-[#191c1d]">
      {/* 1. Side Navigation Bar (Desktop) */}
      <SideNavBar
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
        cartCount={totalCartCount}
        onSelectSeasonalProduct={handleSelectSeasonalProduct}
        currentUser={currentUser}
      />

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 md:hidden flex"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="w-80 bg-white h-full p-6 flex flex-col shadow-2xl space-y-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#c1c8c2]/30 pb-4">
              <span className="font-serif-display text-2xl font-bold text-[#012d1d]">
                FarmFlow
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setCurrentScreen('marketplace');
                  setIsMobileMenuOpen(false);
                }}
                className={`py-2.5 px-3 rounded-lg text-left text-sm font-semibold flex items-center gap-2 ${
                  currentScreen === 'marketplace'
                    ? 'bg-[#f3f4f5] text-[#012d1d] font-bold'
                    : 'text-[#414844]'
                }`}
              >
                <span className="material-symbols-outlined text-base">storefront</span>
                Marketplace
              </button>
              <button
                onClick={() => {
                  setCurrentScreen('subscriptions');
                  setIsMobileMenuOpen(false);
                }}
                className={`py-2.5 px-3 rounded-lg text-left text-sm font-semibold flex items-center gap-2 ${
                  currentScreen === 'subscriptions'
                    ? 'bg-[#f3f4f5] text-[#012d1d] font-bold'
                    : 'text-[#414844]'
                }`}
              >
                <span className="material-symbols-outlined text-base">calendar_month</span>
                Subscriptions
              </button>
              <button
                onClick={() => {
                  setCurrentScreen('orders');
                  setIsMobileMenuOpen(false);
                }}
                className={`py-2.5 px-3 rounded-lg text-left text-sm font-semibold flex items-center gap-2 ${
                  currentScreen === 'orders'
                    ? 'bg-[#f3f4f5] text-[#012d1d] font-bold'
                    : 'text-[#414844]'
                }`}
              >
                <span className="material-symbols-outlined text-base">shopping_bag</span>
                Orders
              </button>
              <button
                onClick={() => {
                  setCurrentScreen('invoice');
                  setIsMobileMenuOpen(false);
                }}
                className={`py-2.5 px-3 rounded-lg text-left text-sm font-semibold flex items-center gap-2 ${
                  currentScreen === 'invoice'
                    ? 'bg-[#f3f4f5] text-[#012d1d] font-bold'
                    : 'text-[#414844]'
                }`}
              >
                <span className="material-symbols-outlined text-base">receipt_long</span>
                Invoices
              </button>
              <button
                onClick={() => {
                  setCurrentScreen('account');
                  setIsMobileMenuOpen(false);
                }}
                className={`py-2.5 px-3 rounded-lg text-left text-sm font-semibold flex items-center gap-2 ${
                  currentScreen === 'account'
                    ? 'bg-[#f3f4f5] text-[#012d1d] font-bold'
                    : 'text-[#414844]'
                }`}
              >
                <span className="material-symbols-outlined text-base">person</span>
                Your Account
              </button>
              <button
                onClick={() => {
                  setCurrentScreen('login');
                  setIsMobileMenuOpen(false);
                }}
                className={`py-2.5 px-3 rounded-lg text-left text-sm font-semibold flex items-center gap-2 ${
                  currentScreen === 'login'
                    ? 'bg-[#f3f4f5] text-[#012d1d] font-bold'
                    : 'text-[#414844]'
                }`}
              >
                <span className="material-symbols-outlined text-base">login</span>
                Sign In or Log In
              </button>
              <button
                onClick={() => {
                  setCurrentScreen('marketplace');
                  setIsMobileMenuOpen(false);
                  setTimeout(() => {
                    const el = document.getElementById('about-us-branch');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 150);
                }}
                className="py-2.5 px-3 rounded-lg text-left text-sm font-semibold text-[#414844] hover:bg-[#f3f4f5] flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base text-[#006c48]">nature_people</span>
                About Us
              </button>
            </nav>

            {/* Mobile Seasonal Availability Widget */}
            <div className="pt-2 border-t border-[#c1c8c2]/30">
              <SeasonalAvailabilityWidget
                onSelectProduct={(id) => {
                  handleSelectSeasonalProduct(id);
                  setIsMobileMenuOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Content Container (Pushed right by sidebar on desktop) */}
      <div className="md:ml-72 flex-1 flex flex-col min-w-0">
        {/* Top App Bar */}
        <TopAppBar
          currentCategoryTab={categoryTab}
          onSelectCategoryTab={(tab) => setCategoryTab(tab)}
          cartItemCount={totalCartCount}
          onOpenCart={() => setIsCartOpen(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onNavigate={(screen) => setCurrentScreen(screen)}
          currentUser={currentUser}
        />

        {/* Dynamic Views */}
        <main className="flex-1 px-4 md:px-10 pt-6">
          {currentScreen === 'marketplace' && (
            <MarketplaceView
              cart={cart}
              onUpdateQuantity={handleUpdateQuantity}
              onAddCustomCrate={handleAddCustomCrate}
              activeCategoryBranch={categoryTab}
              onSelectCategoryBranch={(branch) => setCategoryTab(branch)}
              onNavigate={(screen) => setCurrentScreen(screen)}
            />
          )}

          {currentScreen === 'subscriptions' && (
            <SubscriptionsView onSelectPlan={handleSelectPlan} />
          )}

          {currentScreen === 'invoice' && (
            <InvoiceView
              order={currentOrder}
              onReturnToMarketplace={() => setCurrentScreen('marketplace')}
            />
          )}

          {currentScreen === 'orders' && (
            <OrdersView
              currentOrder={currentOrder}
              onViewInvoice={() => setCurrentScreen('invoice')}
              onNavigateToMarketplace={() => setCurrentScreen('marketplace')}
              onUpdateOrder={(order) => setCurrentOrder(order)}
            />
          )}

          {currentScreen === 'account' && (
            <YourAccountView
              user={currentUser}
              onUpdateUser={(updated) => setCurrentUser(updated)}
              onLogout={() => setCurrentUser(null)}
              onNavigateToLogin={() => setCurrentScreen('login')}
              onNavigateToOrders={() => setCurrentScreen('orders')}
              onNavigateToSubscriptions={() => setCurrentScreen('subscriptions')}
              onNavigateToInvoice={() => setCurrentScreen('invoice')}
              onNavigateToMarketplace={() => setCurrentScreen('marketplace')}
              currentOrder={currentOrder}
            />
          )}

          {currentScreen === 'login' && (
            <LoginBranchView
              currentUser={currentUser}
              onLogin={(user) => setCurrentUser(user)}
              onLogout={() => setCurrentUser(null)}
              onNavigateToAccount={() => setCurrentScreen('account')}
              onNavigateToMarketplace={() => setCurrentScreen('marketplace')}
            />
          )}
        </main>
      </div>

      {/* 3. Slide-Over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        allProducts={ALL_PRODUCTS}
        onUpdateQuantity={handleUpdateQuantity}
        onProceedToCheckout={handleProceedToCheckout}
      />
    </div>
  );
}

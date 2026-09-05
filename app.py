"""
=============================================================================
🌿 FarmFlow - 100% Pure Python Full-Stack Application
=============================================================================
Written in simple, junior-developer friendly Python:
- Uses ONLY the standard Python library (http.server, socketserver, json, os)
- NO pip install or external frameworks needed!
- Includes both the complete Backend API and the interactive Frontend UI
- Features: Marketplace, Cart, Orders with Pay Button, Invoices with Pay Button,
  Interactive Payment Modal, Live EV Tracker, Member Account, and Sign In.
=============================================================================
"""

import http.server
import socketserver
import json
import urllib.parse
from datetime import datetime

# =============================================================================
# 1. SIMPLE IN-MEMORY DATABASE (Lists and Dictionaries)
# =============================================================================

# Catalog of fresh farm produce
FARM_PRODUCTS = [
    {
        "id": 1,
        "name": "Crisp Romaine & Hydroponic Butterhead",
        "category": "vegetables",
        "farm": "Mariout Greenhouses",
        "distance_km": 18,
        "price": 4.50,
        "unit": "bunch",
        "badge_text": "Crisp: 5/5",
        "badge_type": "crisp",
        "harvest_time": "Picked 4 hrs ago",
        "image_url": "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": 2,
        "name": "Bunched Heirloom Rainbow Carrots",
        "category": "vegetables",
        "farm": "Valley Roots Farm",
        "distance_km": 12,
        "price": 3.75,
        "unit": "bunch",
        "badge_text": "Crisp: 4.8/5",
        "badge_type": "crisp",
        "harvest_time": "Picked 5 hrs ago",
        "image_url": "https://images.unsplash.com/photo-1590868309235-ea34bed7bd7f?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": 3,
        "name": "Vine-Ripened Beefsteak & Cherry Tomatoes",
        "category": "vegetables",
        "farm": "Sunny Patch",
        "distance_km": 5,
        "price": 5.20,
        "unit": "basket",
        "badge_text": "Juicy: 5/5",
        "badge_type": "juicy",
        "harvest_time": "Picked 6 hrs ago",
        "image_url": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": 4,
        "name": "Crisp Bell Peppers (Mixed Colors)",
        "category": "vegetables",
        "farm": "River Valley Veg",
        "distance_km": 22,
        "price": 4.00,
        "unit": "3-pack",
        "badge_text": "Crisp: 4.9/5",
        "badge_type": "crisp",
        "harvest_time": "Picked 3 hrs ago",
        "image_url": "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": 5,
        "name": "Sweet Strawberries & Wild Blackberries",
        "category": "fruits",
        "farm": "Berry Creek Farm",
        "distance_km": 15,
        "price": 6.00,
        "unit": "punnet",
        "badge_text": "Sweet: 4.8/5",
        "badge_type": "sweet",
        "harvest_time": "Picked 2 hrs ago",
        "image_url": "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": 6,
        "name": "Sweet Valencia & Navel Oranges",
        "category": "fruits",
        "farm": "Citrus Grove",
        "distance_km": 35,
        "price": 6.50,
        "unit": "bag",
        "badge_text": "Sweet: 4.5/5",
        "badge_type": "sweet",
        "harvest_time": "Picked 8 hrs ago",
        "image_url": "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": 7,
        "name": "Crisp Gala & Honeycrisp Apples",
        "category": "fruits",
        "farm": "Orchard Hill",
        "distance_km": 28,
        "price": 5.00,
        "unit": "lb",
        "badge_text": "Crisp: 5/5",
        "badge_type": "crisp",
        "harvest_time": "Picked 4 hrs ago",
        "image_url": "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=80"
    },
    {
        "id": 8,
        "name": "Organic Curly Kale",
        "category": "vegetables",
        "farm": "Green Valley Co-op",
        "distance_km": 9,
        "price": 4.00,
        "unit": "bunch",
        "badge_text": "USDA Organic",
        "badge_type": "organic",
        "harvest_time": "Picked 2 hrs ago",
        "image_url": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80"
    }
]

# Curated farm box subscription plans
SUBSCRIPTION_PLANS = [
    {
        "id": "solo",
        "name": "The Solo Sprout",
        "price": 25.00,
        "cadence": "weekly",
        "items": "5-7 seasonal varieties",
        "best_for": "1-2 individuals",
        "badge": "Popular"
    },
    {
        "id": "family",
        "name": "The Family Harvest Box",
        "price": 45.00,
        "cadence": "weekly",
        "items": "8-10 seasonal vegetables + pasture eggs",
        "best_for": "3-5 family members",
        "badge": "Best Value"
    },
    {
        "id": "artisan",
        "name": "Chef's Specialty Crate",
        "price": 65.00,
        "cadence": "weekly",
        "items": "Heirloom produce + raw honey & herbs",
        "best_for": "Home gourmet chefs",
        "badge": "Gourmet"
    }
]

# User's current shopping basket (product_id -> quantity)
user_basket = {
    1: 1,  # 1 bunch of Romaine Lettuce ($4.50)
    5: 2   # 2 punnets of Strawberries ($12.00)
}

# Current active harvest order
current_order = {
    "order_number": "FF-89421",
    "date": "Oct 24, 2023",
    "delivery_window": "Tomorrow, 8:00 AM – 10:00 AM",
    "status": "Awaiting Morning Harvest",
    "items": [
        {"name": "Crisp Romaine & Hydroponic Butterhead", "origin": "Mariout Greenhouses", "quantity": 1, "unit_price": 4.50, "total": 4.50},
        {"name": "Sweet Strawberries & Wild Blackberries", "origin": "Berry Creek Farm", "quantity": 2, "unit_price": 6.00, "total": 12.00},
        {"name": "Vine-Ripened Beefsteak Tomatoes", "origin": "Sunny Patch", "quantity": 1, "unit_price": 5.20, "total": 5.20}
    ],
    "subtotal": 21.70,
    "delivery_fee": 0.00,
    "eco_packaging_offset": 0.50,
    "farmer_tip": 2.17,
    "total_paid": 24.37,
    "card_last4": "4242",
    "payment_status": "pending",  # Starts as pending so user can test Pay Now!
    "payment_method": "Visa ending in 4242",
    "paid_at": ""
}

# Historical delivered orders
past_orders_list = [
    {
        "id": "FF-78310",
        "date": "Oct 17, 2023",
        "total": 28.50,
        "items_count": 4,
        "farm": "River Valley Veg & Orchard Hill",
        "status": "Delivered"
    },
    {
        "id": "FF-69212",
        "date": "Oct 10, 2023",
        "total": 32.00,
        "items_count": 5,
        "farm": "Sunny Patch & Valley Roots Farm",
        "status": "Delivered"
    }
]

# User profile
user_profile = {
    "id": "usr_7891",
    "name": "Sarah Jenkins",
    "email": "sarah.jenkins@farmflow.eco",
    "phone": "(555) 382-9410",
    "address": "104 Organic Way, Apt 3B",
    "city": "Green Valley, CA 95945",
    "member_id": "GV-4402",
    "member_since": "March 2023",
    "crate_deposit_balance": 6.00,
    "stats": {
        "produce_enjoyed_lbs": 38,
        "farms_supported": 4,
        "co2_saved_kg": 14.8,
        "orders_completed": 9
    }
}

# =============================================================================
# 2. HELPER FUNCTIONS (Simple Junior Python Math & Business Logic)
# =============================================================================

def find_product(product_id):
    """Loops through the products list to find product by id."""
    for product in FARM_PRODUCTS:
        if product["id"] == product_id:
            return product
    return None

def calculate_cart_totals(basket, tip_percent=10.0, apply_crate_discount=False):
    """
    Step-by-step arithmetic to calculate subtotal, delivery fee, packaging,
    tips, and final grand total.
    """
    subtotal = 0.0

    # 1. Sum up item subtotals
    for product_id, qty in basket.items():
        prod = find_product(product_id)
        if prod and qty > 0:
            subtotal += prod["price"] * qty

    # 2. Free delivery over $35.00
    if subtotal >= 35.00 or subtotal == 0.0:
        delivery_fee = 0.00
    else:
        delivery_fee = 4.50

    # 3. Packaging offset ($0.50 for 100% compostable boxes)
    packaging_fee = 0.50 if subtotal > 0 else 0.00

    # 4. Farmer tip
    tip_amount = round((subtotal * tip_percent) / 100.0, 2)

    # 5. Crate deposit discount ($6.00 from returned wooden crates)
    crate_discount = 6.00 if apply_crate_discount else 0.00

    # 6. Grand total
    grand_total = subtotal + delivery_fee + packaging_fee + tip_amount - crate_discount
    grand_total = max(0.0, round(grand_total, 2))

    return {
        "subtotal": round(subtotal, 2),
        "delivery_fee": round(delivery_fee, 2),
        "eco_packaging_offset": packaging_fee,
        "farmer_tip": tip_amount,
        "crate_discount": crate_discount,
        "grand_total": grand_total,
        "free_delivery_threshold": 35.00,
        "needed_for_free_delivery": max(0.0, round(35.00 - subtotal, 2))
    }

def process_payment(order_id, payment_method="card", card_number="4242", tip_percent=10, apply_credit=False):
    """
    Junior payment processor:
    Updates order state, logs payment method, and generates receipt.
    """
    global current_order

    totals = calculate_cart_totals(user_basket, tip_percent=tip_percent, apply_crate_discount=apply_credit)

    clean_card = card_number.replace(" ", "").replace("•", "")
    last4 = clean_card[-4:] if len(clean_card) >= 4 else "4242"

    if payment_method == "wallet":
        method_name = "Apple / Google Pay"
    elif payment_method == "credit":
        method_name = "Farm Crate Return Deposit"
    elif payment_method == "cash":
        method_name = "Contactless Doorstep Delivery"
    else:
        method_name = f"Visa ending in {last4}"

    current_order["payment_status"] = "paid"
    current_order["payment_method"] = method_name
    current_order["card_last4"] = last4
    current_order["farmer_tip"] = totals["farmer_tip"]
    current_order["total_paid"] = totals["grand_total"]
    current_order["paid_at"] = datetime.now().strftime("%I:%M %p")
    current_order["status"] = "Payment Settled - Awaiting Dawn Harvest"

    return {
        "success": True,
        "message": f"Payment of ${totals['grand_total']:.2f} confirmed successfully!",
        "order_number": current_order["order_number"],
        "method": method_name,
        "total_paid": totals["grand_total"],
        "card_last4": last4,
        "paid_at": current_order["paid_at"],
        "status": current_order["status"]
    }

def reorder_past_order(past_order_id):
    """Creates a new order from a historical order and sets up payment."""
    global current_order

    found = None
    for p in past_orders_list:
        if p["id"] == past_order_id:
            found = p
            break

    if not found:
        return {"success": False, "message": "Order not found."}

    new_id = f"{past_order_id}-R"
    current_order = {
        "order_number": new_id,
        "date": datetime.now().strftime("Today, %b %d"),
        "delivery_window": "Tomorrow, 8:00 AM – 10:00 AM",
        "status": "Awaiting Payment for Tomorrow Harvest",
        "items": [
            {"name": f"{found['farm']} Seasonal Selection", "origin": found["farm"], "quantity": 1, "unit_price": found["total"], "total": found["total"]}
        ],
        "subtotal": found["total"],
        "delivery_fee": 0.00,
        "eco_packaging_offset": 0.50,
        "farmer_tip": round(found["total"] * 0.10, 2),
        "total_paid": round(found["total"] + 0.50 + round(found["total"] * 0.10, 2), 2),
        "card_last4": "4242",
        "payment_status": "pending",
        "payment_method": "Payment Pending",
        "paid_at": ""
    }
    return {"success": True, "message": f"Reorder {new_id} ready for payment!", "order": current_order}

# =============================================================================
# 3. COMPLETE INTERACTIVE HTML/JS FRONTEND (Served by Python)
# =============================================================================

HTML_FRONTEND_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FarmFlow — 100% Pure Python Marketplace & Invoices</title>
  <!-- Google Fonts & Material Symbols -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
  <!-- Tailwind CSS CDN for instant gorgeous styling -->
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #f8f9fa; color: #191c1d; }
    .font-serif { font-family: 'Playfair Display', Georgia, serif; }
    .custom-scroll::-webkit-scrollbar { width: 6px; }
    .custom-scroll::-webkit-scrollbar-thumb { background: #c1c8c2; border-radius: 999px; }
  </style>
</head>
<body class="antialiased min-h-screen flex flex-col">

  <!-- Top App Navigation -->
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#c1c8c2]/30 px-4 md:px-8 py-3.5 shadow-xs">
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
      
      <!-- Brand Logo -->
      <div class="flex items-center gap-3 cursor-pointer" onclick="showBranch('marketplace')">
        <div class="w-10 h-10 rounded-2xl bg-[#012d1d] text-[#92f7c3] flex items-center justify-center font-bold shadow-sm">
          <span class="material-symbols-outlined text-2xl">eco</span>
        </div>
        <div>
          <span class="font-serif text-xl font-bold text-[#012d1d] tracking-tight">FarmFlow</span>
          <span class="block text-[10px] text-[#006c48] font-bold uppercase tracking-wider">100% Python Full-Stack</span>
        </div>
      </div>

      <!-- Navigation Branches -->
      <nav class="hidden md:flex items-center gap-1.5 bg-[#f3f4f5] p-1.5 rounded-full border border-[#c1c8c2]/30 text-xs font-semibold">
        <button id="nav-marketplace" onclick="showBranch('marketplace')" class="nav-btn px-4 py-2 rounded-full bg-[#012d1d] text-white transition-all">Marketplace</button>
        <button id="nav-subscriptions" onclick="showBranch('subscriptions')" class="nav-btn px-4 py-2 rounded-full text-[#414844] hover:bg-white transition-all">Subscriptions</button>
        <button id="nav-orders" onclick="showBranch('orders')" class="nav-btn px-4 py-2 rounded-full text-[#414844] hover:bg-white transition-all flex items-center gap-1">
          <span>Orders</span>
          <span id="order-pending-dot" class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
        </button>
        <button id="nav-invoice" onclick="showBranch('invoice')" class="nav-btn px-4 py-2 rounded-full text-[#414844] hover:bg-white transition-all">Invoices</button>
        <button id="nav-account" onclick="showBranch('account')" class="nav-btn px-4 py-2 rounded-full text-[#414844] hover:bg-white transition-all">Your Account</button>
      </nav>

      <!-- Cart Trigger Button -->
      <button onclick="toggleCartDrawer(true)" class="flex items-center gap-2.5 px-4 py-2 bg-[#006c48] hover:bg-[#012d1d] text-white rounded-full text-xs font-bold transition-all shadow-xs">
        <span class="material-symbols-outlined text-base">shopping_basket</span>
        <span class="hidden sm:inline">Harvest Basket</span>
        <span id="cart-badge" class="px-1.5 py-0.5 bg-[#92f7c3] text-[#002114] text-[11px] rounded-full font-bold">3</span>
      </button>
    </div>
  </header>

  <!-- Global Toast Alerts -->
  <div id="toast-container" class="fixed top-20 right-4 z-50 space-y-3 pointer-events-none"></div>

  <!-- Main Content Body -->
  <main class="max-w-7xl mx-auto w-full px-4 md:px-8 py-8 flex-1">

    <!-- BRANCH 1: MARKETPLACE -->
    <section id="branch-marketplace" class="space-y-8">
      <!-- Hero Banner -->
      <div class="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#012d1d] via-[#004d33] to-[#012d1d] text-white p-8 md:p-12 shadow-md">
        <div class="max-w-xl space-y-3">
          <span class="inline-block px-3 py-1 bg-[#92f7c3]/30 text-[#92f7c3] text-xs font-bold uppercase tracking-wider rounded-full">
            Sunrise Harvest • Direct From Soil
          </span>
          <h1 class="font-serif text-3xl md:text-5xl font-bold leading-tight">
            Picked at First Dawn. On Your Table by Lunch.
          </h1>
          <p class="text-sm md:text-base text-white/90">
            Zero middlemen. Real-time temperature logging. Support family-owned regional organic farms.
          </p>
        </div>
      </div>

      <!-- Produce Grid -->
      <div>
        <div class="flex items-center justify-between mb-6">
          <h2 class="font-serif text-2xl md:text-3xl font-bold text-[#012d1d]">Today's Fresh Harvest</h2>
          <span class="text-xs text-[#414844] font-medium">8 Organic Items Available</span>
        </div>
        <div id="products-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"></div>
      </div>
    </section>

    <!-- BRANCH 2: ORDERS -->
    <section id="branch-orders" class="space-y-8 hidden max-w-4xl mx-auto">
      <div>
        <h1 class="font-serif text-3xl md:text-4xl font-bold text-[#012d1d] mb-1">Your Farm Orders</h1>
        <p class="text-sm text-[#414844]">Real-time cold-chain EV radar and order payment management.</p>
      </div>

      <!-- Active Order Card -->
      <div class="bg-white rounded-3xl p-6 md:p-8 border border-[#006c48]/30 shadow-md space-y-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[#c1c8c2]/30">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="w-2.5 h-2.5 rounded-full bg-[#006c48] animate-pulse"></span>
              <span class="font-bold text-xs uppercase text-[#006c48] tracking-wider">Active Harvest Order</span>
            </div>
            <h3 id="active-order-title" class="font-serif text-2xl font-bold text-[#012d1d]">Order #FF-89421</h3>
            <p id="active-order-meta" class="text-xs text-[#414844] mt-0.5">Tomorrow, 8:00 AM – 10:00 AM</p>
          </div>

          <!-- Pay Button in Orders -->
          <div class="flex flex-wrap items-center gap-2">
            <button id="orders-pay-btn" onclick="openPaymentModal()" class="px-6 py-2.5 bg-[#006c48] hover:bg-[#012d1d] text-white text-xs font-bold rounded-full transition-all shadow-md flex items-center gap-1.5 animate-pulse">
              <span class="material-symbols-outlined text-base">payments</span>
              <span id="orders-pay-btn-label">Pay Now ($24.37)</span>
            </button>
            <button onclick="showBranch('invoice')" class="px-5 py-2.5 bg-[#f3f4f5] hover:bg-[#012d1d] text-[#012d1d] hover:text-white text-xs font-bold rounded-full transition-colors flex items-center gap-1.5">
              <span class="material-symbols-outlined text-sm">receipt_long</span>
              <span>View Invoice</span>
            </button>
          </div>
        </div>

        <!-- Order Items List -->
        <div>
          <h4 class="text-xs font-bold uppercase text-[#414844] tracking-wider mb-3">Items in Harvest Box</h4>
          <div id="order-items-list" class="grid grid-cols-1 sm:grid-cols-2 gap-3"></div>
        </div>

        <!-- Payment Status Footer -->
        <div class="flex flex-col sm:flex-row justify-between items-center bg-[#f8f9fa] rounded-2xl p-4 border border-[#c1c8c2]/30 gap-3">
          <div class="flex items-center gap-2 text-xs text-[#002114]">
            <span class="material-symbols-outlined text-base text-[#006c48]">local_shipping</span>
            <span id="order-status-badge">Status: <strong>Awaiting Morning Harvest</strong></span>
          </div>
          <div class="flex items-center gap-3">
            <span id="order-payment-badge" class="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1">
              <span class="material-symbols-outlined text-xs">pending</span>
              <span>Payment Due: $24.37</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Past Orders with Reorder & Pay -->
      <div class="bg-white rounded-3xl p-6 md:p-8 border border-[#c1c8c2]/30 shadow-xs space-y-4">
        <h3 class="font-serif text-xl font-bold text-[#012d1d]">Past Delivered Harvests</h3>
        <div id="past-orders-container" class="space-y-3"></div>
      </div>
    </section>

    <!-- BRANCH 3: INVOICES -->
    <section id="branch-invoice" class="space-y-8 hidden max-w-4xl mx-auto">
      <div class="bg-white rounded-3xl p-8 md:p-12 border border-[#c1c8c2]/30 shadow-md text-center space-y-6">
        <div class="w-16 h-16 bg-[#92f7c3]/40 text-[#006c48] rounded-full flex items-center justify-center mx-auto shadow-inner">
          <span class="material-symbols-outlined text-4xl">receipt</span>
        </div>
        <div>
          <span class="px-3.5 py-1 bg-[#006c48]/10 text-[#006c48] text-xs font-bold uppercase rounded-full">Official Harvest Receipt</span>
          <h1 class="font-serif text-3xl md:text-4xl font-bold text-[#012d1d] mt-2">FarmFlow Invoice #FF-89421</h1>
          <p class="text-xs text-[#414844] mt-1">Direct Provenance &amp; Eco-Accounting Record</p>
        </div>

        <!-- Meta Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#f8f9fa] rounded-2xl p-4 border border-[#c1c8c2]/30 text-left text-xs">
          <div><span class="text-[#717874] block">Customer:</span><strong class="text-[#012d1d] text-sm">Sarah Jenkins (GV-4402)</strong></div>
          <div><span class="text-[#717874] block">Delivery Window:</span><strong class="text-[#012d1d] text-sm">Tomorrow, 8am – 10am</strong></div>
          <div><span class="text-[#717874] block">Payment Status:</span><strong id="invoice-meta-payment" class="text-amber-700 text-sm">Payment Due ($24.37)</strong></div>
        </div>

        <!-- Itemized Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="border-b-2 border-[#006c48] text-[#006c48] font-bold">
                <th class="py-3 px-2">Item &amp; Farm Origin</th>
                <th class="py-3 px-2 text-center">Qty</th>
                <th class="py-3 px-2 text-right">Unit Price</th>
                <th class="py-3 px-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody id="invoice-items-tbody"></tbody>
          </table>
        </div>

        <!-- Summary Totals -->
        <div class="max-w-xs ml-auto text-xs space-y-2 pt-4 border-t border-[#c1c8c2]/40 text-right">
          <div class="flex justify-between text-[#414844]"><span>Produce Subtotal:</span><strong id="inv-subtotal">$21.70</strong></div>
          <div class="flex justify-between text-[#414844]"><span>Zero-Emission Delivery:</span><strong class="text-[#006c48]">FREE</strong></div>
          <div class="flex justify-between text-[#414844]"><span>Eco-Packaging Offset:</span><strong>$0.50</strong></div>
          <div class="flex justify-between text-[#414844]"><span>Farmer Fair-Pay Tip:</span><strong id="inv-tip">$2.17</strong></div>
          <div class="flex justify-between text-base font-bold text-[#012d1d] pt-2 border-t border-[#c1c8c2]/30 font-serif">
            <span>Total Due:</span><span id="inv-total" class="text-[#006c48] text-lg">$24.37</span>
          </div>
        </div>

        <!-- INVOICE ACTION BUTTONS (Featuring PAY INVOICE BUTTON) -->
        <div class="pt-6 border-t border-[#c1c8c2]/30 flex flex-wrap items-center justify-between gap-4">
          <div class="flex flex-wrap items-center gap-3">
            <!-- Main Pay Button in Invoices -->
            <button id="invoice-pay-btn" onclick="openPaymentModal()" class="px-7 py-3 rounded-full bg-[#006c48] hover:bg-[#012d1d] text-white text-sm font-bold transition-all shadow-md flex items-center gap-2 hover:scale-105">
              <span class="material-symbols-outlined text-lg">credit_card</span>
              <span id="invoice-pay-btn-label">Pay Invoice ($24.37)</span>
            </button>
            <button onclick="window.print()" class="px-5 py-3 rounded-full border border-[#c1c8c2]/50 text-[#414844] hover:bg-[#f3f4f5] text-xs font-bold transition-colors flex items-center gap-1.5">
              <span class="material-symbols-outlined text-base">print</span>
              <span>Print Invoice</span>
            </button>
          </div>
          <button onclick="showBranch('marketplace')" class="text-xs font-bold text-[#006c48] hover:underline flex items-center gap-1">
            <span>Return to Marketplace</span>
            <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>
    </section>

    <!-- BRANCH 4: SUBSCRIPTIONS -->
    <section id="branch-subscriptions" class="space-y-8 hidden max-w-5xl mx-auto">
      <div class="text-center max-w-xl mx-auto">
        <h1 class="font-serif text-3xl md:text-4xl font-bold text-[#012d1d]">Seasonal Harvest Subscriptions</h1>
        <p class="text-sm text-[#414844] mt-1">Pause, skip, or modify your weekly organic crate anytime.</p>
      </div>
      <div id="subscriptions-container" class="grid grid-cols-1 md:grid-cols-3 gap-6"></div>
    </section>

    <!-- BRANCH 5: YOUR ACCOUNT -->
    <section id="branch-account" class="space-y-8 hidden max-w-4xl mx-auto">
      <div class="bg-white rounded-3xl p-8 border border-[#c1c8c2]/30 shadow-xs space-y-6">
        <div class="flex items-center gap-4 border-b border-[#c1c8c2]/30 pb-6">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80" class="w-16 h-16 rounded-full object-cover border-2 border-[#006c48]" alt="User">
          <div>
            <h2 class="font-serif text-2xl font-bold text-[#012d1d]">Sarah Jenkins</h2>
            <p class="text-xs text-[#414844]">Member #GV-4402 • Sustainable Patron since March 2023</p>
          </div>
        </div>
        <!-- Sustainability Stats -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div class="p-4 bg-[#f8f9fa] rounded-2xl border border-[#c1c8c2]/20"><span class="block text-2xl font-bold text-[#006c48]">38 lbs</span><span class="text-xs text-[#717874]">Produce Enjoyed</span></div>
          <div class="p-4 bg-[#f8f9fa] rounded-2xl border border-[#c1c8c2]/20"><span class="block text-2xl font-bold text-[#006c48]">4</span><span class="text-xs text-[#717874]">Farms Supported</span></div>
          <div class="p-4 bg-[#f8f9fa] rounded-2xl border border-[#c1c8c2]/20"><span class="block text-2xl font-bold text-[#006c48]">14.8 kg</span><span class="text-xs text-[#717874]">CO2 Avoided</span></div>
          <div class="p-4 bg-[#f8f9fa] rounded-2xl border border-[#c1c8c2]/20"><span class="block text-2xl font-bold text-[#006c48]">$6.00</span><span class="text-xs text-[#717874]">Crate Deposit Credit</span></div>
        </div>
      </div>
    </section>
  </main>

  <!-- CART SLIDE-OUT DRAWER -->
  <div id="cart-drawer-overlay" onclick="toggleCartDrawer(false)" class="fixed inset-0 bg-black/50 z-50 hidden transition-opacity"></div>
  <aside id="cart-drawer" class="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform translate-x-full transition-transform duration-300 flex flex-col">
    <div class="p-6 border-b border-[#c1c8c2]/30 flex items-center justify-between">
      <h3 class="font-serif text-xl font-bold text-[#012d1d] flex items-center gap-2">
        <span class="material-symbols-outlined text-[#006c48]">shopping_basket</span>
        Your Harvest Basket
      </h3>
      <button onclick="toggleCartDrawer(false)" class="w-8 h-8 rounded-full bg-[#f3f4f5] hover:bg-gray-200 flex items-center justify-center text-[#414844]">
        <span class="material-symbols-outlined text-base">close</span>
      </button>
    </div>
    <!-- Cart Items Scroll -->
    <div id="cart-items-body" class="flex-1 overflow-y-auto custom-scroll p-6 space-y-4"></div>
    <!-- Cart Footer & Checkout -->
    <div class="p-6 border-t border-[#c1c8c2]/30 bg-[#f8f9fa] space-y-3">
      <div class="flex justify-between text-sm"><span>Subtotal:</span><strong id="drawer-subtotal" class="font-mono text-base">$16.50</strong></div>
      <button onclick="checkoutAndPay()" class="w-full py-3.5 rounded-xl bg-[#006c48] hover:bg-[#012d1d] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2">
        <span class="material-symbols-outlined text-base">lock</span>
        <span>Proceed to Secure Payment</span>
      </button>
    </div>
  </aside>

  <!-- INTERACTIVE PAYMENT MODAL (Used in Orders and Invoices) -->
  <div id="payment-modal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs hidden flex items-center justify-center p-4 overflow-y-auto">
    <div class="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#c1c8c2]/30 my-8 flex flex-col">
      <!-- Modal Header -->
      <div class="p-6 bg-[#012d1d] text-white flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-[#92f7c3]/20 text-[#92f7c3] flex items-center justify-center">
            <span class="material-symbols-outlined text-2xl">credit_card</span>
          </div>
          <div>
            <span class="text-[10px] uppercase font-bold text-[#92f7c3]">Secure Checkout</span>
            <h3 class="font-serif text-lg font-bold">Pay for Harvest Order</h3>
          </div>
        </div>
        <button onclick="closePaymentModal()" class="text-white/70 hover:text-white"><span class="material-symbols-outlined">close</span></button>
      </div>

      <!-- Modal Body Form -->
      <form onsubmit="handleExecutePayment(event)" class="p-6 space-y-5 text-xs">
        <!-- Totals Snapshot -->
        <div class="bg-[#f8f9fa] p-4 rounded-2xl border border-[#c1c8c2]/30 space-y-2">
          <div class="flex justify-between text-[#414844]"><span>Produce Subtotal:</span><strong id="modal-subtotal" class="font-mono">$21.70</strong></div>
          <div class="flex justify-between text-[#414844]"><span>Zero-Emissions Delivery:</span><strong class="text-[#006c48]">FREE</strong></div>
          <div class="flex justify-between text-[#414844]"><span>Eco-Packaging Offset:</span><strong>$0.50</strong></div>
          <div id="modal-tip-row" class="flex justify-between text-[#006c48]"><span>Farmer Tip (10%):</span><strong id="modal-tip-val">+$2.17</strong></div>
          <div id="modal-credit-row" class="flex justify-between text-[#006c48] hidden"><span>Crate Return Credit:</span><strong id="modal-credit-val">-$6.00</strong></div>
          <div class="pt-2 border-t border-[#c1c8c2]/30 flex justify-between font-bold text-sm text-[#012d1d]">
            <span>Total Amount Due:</span>
            <span id="modal-grand-total" class="font-serif text-base text-[#006c48]">$24.37</span>
          </div>
        </div>

        <!-- Crate Credit Checkbox -->
        <label class="flex items-center gap-2.5 p-3 bg-[#92f7c3]/20 border border-[#006c48]/20 rounded-xl cursor-pointer">
          <input type="checkbox" id="modal-apply-crate" onchange="recalcModalTotal()" class="w-4 h-4 accent-[#006c48] rounded">
          <div>
            <strong class="text-[#002114] block">Apply Crate Return Credit ($6.00 Available)</strong>
            <span class="text-[#414844] text-[11px]">Redeem credit from 3 returned crates to discount this order</span>
          </div>
        </label>

        <!-- Payment Method Tabs -->
        <div>
          <label class="block font-bold text-[#414844] uppercase tracking-wider mb-2">Payment Method</label>
          <div class="grid grid-cols-3 gap-2 text-center">
            <label class="p-2.5 border rounded-xl cursor-pointer hover:bg-gray-50 flex flex-col items-center gap-1">
              <input type="radio" name="pay_method" value="card" checked class="accent-[#006c48]">
              <span>Credit Card</span>
            </label>
            <label class="p-2.5 border rounded-xl cursor-pointer hover:bg-gray-50 flex flex-col items-center gap-1">
              <input type="radio" name="pay_method" value="wallet" class="accent-[#006c48]">
              <span>Apple/Google</span>
            </label>
            <label class="p-2.5 border rounded-xl cursor-pointer hover:bg-gray-50 flex flex-col items-center gap-1">
              <input type="radio" name="pay_method" value="cash" class="accent-[#006c48]">
              <span>Doorstep</span>
            </label>
          </div>
        </div>

        <!-- Demo Card Input -->
        <div class="space-y-3">
          <div>
            <label class="block text-[11px] font-bold text-[#414844] mb-1">Card Number</label>
            <input type="text" id="modal-card-num" value="4242 •••• •••• 4242" class="w-full p-2.5 bg-[#f8f9fa] border border-[#c1c8c2]/40 rounded-xl font-mono text-xs focus:ring-2 focus:ring-[#006c48]">
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-[11px] font-bold text-[#414844] mb-1">Expires</label>
              <input type="text" value="08/27" class="w-full p-2.5 bg-[#f8f9fa] border border-[#c1c8c2]/40 rounded-xl font-mono text-xs">
            </div>
            <div>
              <label class="block text-[11px] font-bold text-[#414844] mb-1">CVC</label>
              <input type="password" value="884" class="w-full p-2.5 bg-[#f8f9fa] border border-[#c1c8c2]/40 rounded-xl font-mono text-xs">
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex items-center gap-3 pt-2">
          <button type="button" onclick="closePaymentModal()" class="w-1/3 py-3 border border-[#c1c8c2]/40 rounded-xl font-bold text-[#414844] hover:bg-gray-100">Cancel</button>
          <button id="modal-submit-btn" type="submit" class="w-2/3 py-3 bg-[#006c48] hover:bg-[#012d1d] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-base">lock</span>
            <span id="modal-submit-label">Pay $24.37 Now</span>
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- JAVASCRIPT APP LOGIC (Communicates with Python backend endpoints) -->
  <script>
    let appProducts = [];
    let appCart = {};
    let appOrder = {};
    let appTotals = {};

    // 1. Initialize data from Python API
    async function initApp() {
      try {
        const [prodRes, cartRes, orderRes, subRes] = await Promise.all([
          fetch('/api/products').then(r => r.json()),
          fetch('/api/cart').then(r => r.json()),
          fetch('/api/orders').then(r => r.json()),
          fetch('/api/subscriptions').then(r => r.json())
        ]);
        appProducts = prodRes;
        appCart = cartRes.basket;
        appTotals = cartRes.totals;
        appOrder = orderRes.current_order;
        
        renderProducts();
        renderCart();
        renderOrders(orderRes);
        renderInvoice();
        renderSubscriptions(subRes);
      } catch (err) {
        console.error("Error loading Python backend:", err);
      }
    }

    // 2. Navigation Switcher
    function showBranch(branchId) {
      ['marketplace', 'subscriptions', 'orders', 'invoice', 'account'].forEach(id => {
        document.getElementById('branch-' + id)?.classList.add('hidden');
        document.getElementById('nav-' + id)?.classList.remove('bg-[#012d1d]', 'text-white');
        document.getElementById('nav-' + id)?.classList.add('text-[#414844]');
      });
      document.getElementById('branch-' + branchId)?.classList.remove('hidden');
      const activeNav = document.getElementById('nav-' + branchId);
      if (activeNav) {
        activeNav.classList.add('bg-[#012d1d]', 'text-white');
        activeNav.classList.remove('text-[#414844]');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 3. Render Marketplace Cards
    function renderProducts() {
      const grid = document.getElementById('products-grid');
      grid.innerHTML = appProducts.map(p => `
        <article class="bg-white rounded-2xl overflow-hidden border border-[#c1c8c2]/30 shadow-xs hover:shadow-md transition-all flex flex-col">
          <div class="h-44 relative overflow-hidden group">
            <img src="${p.image_url}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            <span class="absolute top-3 right-3 bg-white/95 px-2.5 py-1 rounded-full text-[11px] font-bold text-[#006c48] shadow-xs">
              ${p.badge_text}
            </span>
          </div>
          <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
            <div>
              <div class="text-[11px] text-[#717874]">${p.farm} • ${p.harvest_time}</div>
              <h3 class="font-bold text-sm text-[#191c1d] mt-1 leading-snug">${p.name}</h3>
            </div>
            <div class="flex items-center justify-between pt-2 border-t border-[#c1c8c2]/20">
              <span class="font-serif text-lg font-bold text-[#012d1d]">$${p.price.toFixed(2)}<span class="text-xs font-normal text-[#717874]">/${p.unit}</span></span>
              <button onclick="updateCartQty(${p.id}, (appCart[${p.id}] || 0) + 1)" class="px-3.5 py-1.5 bg-[#006c48] hover:bg-[#012d1d] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer">
                <span>+ Add</span>
              </button>
            </div>
          </div>
        </article>
      `).join('');
    }

    // 4. Update Cart in Python Backend
    async function updateCartQty(productId, newQty) {
      const res = await fetch('/api/cart/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: json = JSON.stringify({ product_id: productId, quantity: newQty })
      });
      const data = await res.json();
      if (data.success) {
        appCart = data.basket;
        appTotals = data.totals;
        renderCart();
        showToast("Basket updated!", "Item quantity adjusted");
      }
    }

    // 5. Render Cart Drawer
    function renderCart() {
      const count = Object.values(appCart).reduce((a, b) => a + b, 0);
      document.getElementById('cart-badge').innerText = count;
      document.getElementById('drawer-subtotal').innerText = `$${appTotals.subtotal?.toFixed(2) || '0.00'}`;

      const body = document.getElementById('cart-items-body');
      const itemIds = Object.keys(appCart);
      if (itemIds.length === 0) {
        body.innerHTML = `<p class="text-center py-12 text-[#717874] text-xs">Your basket is currently empty.</p>`;
        return;
      }

      body.innerHTML = itemIds.map(id => {
        const prod = appProducts.find(p => p.id == id);
        if (!prod) return '';
        const qty = appCart[id];
        return `
          <div class="flex items-center justify-between gap-3 p-3 bg-[#f8f9fa] rounded-xl border border-[#c1c8c2]/20">
            <img src="${prod.image_url}" class="w-12 h-12 rounded-lg object-cover">
            <div class="flex-1 min-w-0">
              <h4 class="font-bold text-xs truncate">${prod.name}</h4>
              <span class="text-[11px] text-[#717874]">$${prod.price.toFixed(2)} / ${prod.unit}</span>
            </div>
            <div class="flex items-center gap-2 border rounded-lg bg-white px-2 py-1">
              <button onclick="updateCartQty(${prod.id}, ${qty - 1})" class="font-bold text-xs">-</button>
              <span class="text-xs font-bold w-4 text-center">${qty}</span>
              <button onclick="updateCartQty(${prod.id}, ${qty + 1})" class="font-bold text-xs">+</button>
            </div>
          </div>
        `;
      }).join('');
    }

    // 6. Render Orders View
    function renderOrders(data) {
      const order = data.current_order;
      document.getElementById('active-order-title').innerText = `Order #${order.order_number}`;
      document.getElementById('active-order-meta').innerText = `${order.date} • ${order.delivery_window}`;
      
      const isPaid = order.payment_status === 'paid';
      document.getElementById('order-pending-dot').style.display = isPaid ? 'none' : 'inline-block';
      
      const payBtn = document.getElementById('orders-pay-btn');
      const payLabel = document.getElementById('orders-pay-btn-label');
      const statusBadge = document.getElementById('order-payment-badge');

      if (isPaid) {
        payBtn.classList.remove('animate-pulse', 'bg-[#006c48]');
        payBtn.classList.add('bg-[#92f7c3]/30', 'text-[#006c48]', 'border', 'border-[#006c48]/30');
        payLabel.innerText = `Pay / Re-bill ($${order.total_paid.toFixed(2)})`;
        statusBadge.className = "px-3 py-1 rounded-full bg-[#92f7c3]/40 text-[#006c48] text-xs font-bold flex items-center gap-1";
        statusBadge.innerHTML = `<span class="material-symbols-outlined text-xs">check_circle</span> Paid: $${order.total_paid.toFixed(2)} (${order.payment_method})`;
      } else {
        payBtn.className = "px-6 py-2.5 bg-[#006c48] hover:bg-[#012d1d] text-white text-xs font-bold rounded-full transition-all shadow-md flex items-center gap-1.5 animate-pulse";
        payLabel.innerText = `Pay Now ($${order.total_paid.toFixed(2)})`;
        statusBadge.className = "px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1";
        statusBadge.innerHTML = `<span class="material-symbols-outlined text-xs">pending</span> Payment Due: $${order.total_paid.toFixed(2)}`;
      }

      // Order Items
      document.getElementById('order-items-list').innerHTML = order.items.map(item => `
        <div class="p-3 bg-[#f8f9fa] rounded-xl border border-[#c1c8c2]/20 flex justify-between text-xs">
          <div><strong class="block">${item.name}</strong><span class="text-[#717874]">${item.origin} • Qty: ${item.quantity}</span></div>
          <strong class="text-[#006c48]">$${item.total.toFixed(2)}</strong>
        </div>
      `).join('');

      // Past Orders
      document.getElementById('past-orders-container').innerHTML = data.past_orders.map(past => `
        <div class="p-4 bg-[#f8f9fa] rounded-2xl border border-[#c1c8c2]/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
          <div>
            <strong class="text-sm font-bold block">Order #${past.id}</strong>
            <span class="text-[#717874]">${past.date} • ${past.items_count} items from ${past.farm}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="font-bold text-sm">$${past.total.toFixed(2)}</span>
            <button onclick="reorderAndPay('${past.id}')" class="px-4 py-1.5 bg-[#006c48] text-white hover:bg-[#012d1d] rounded-full font-bold transition-all shadow-xs flex items-center gap-1">
              <span class="material-symbols-outlined text-xs">payments</span>
              <span>Reorder &amp; Pay</span>
            </button>
          </div>
        </div>
      `).join('');
    }

    // 7. Render Invoice View (with Pay Invoice Button)
    function renderInvoice() {
      const order = appOrder;
      const isPaid = order.payment_status === 'paid';

      document.getElementById('invoice-meta-payment').innerHTML = isPaid
        ? `<span class="text-[#006c48] font-bold">Paid ($${order.total_paid.toFixed(2)})</span>`
        : `<span class="text-amber-700 font-bold">Payment Due ($${order.total_paid.toFixed(2)})</span>`;

      document.getElementById('inv-subtotal').innerText = `$${order.subtotal.toFixed(2)}`;
      document.getElementById('inv-tip').innerText = `$${order.farmer_tip.toFixed(2)}`;
      document.getElementById('inv-total').innerText = `$${order.total_paid.toFixed(2)}`;

      const payBtn = document.getElementById('invoice-pay-btn');
      const payLabel = document.getElementById('invoice-pay-btn-label');
      payLabel.innerText = isPaid ? `Pay / Re-bill Invoice ($${order.total_paid.toFixed(2)})` : `Pay Invoice ($${order.total_paid.toFixed(2)})`;

      document.getElementById('invoice-items-tbody').innerHTML = order.items.map(item => `
        <tr class="border-b border-[#c1c8c2]/20">
          <td class="py-3 px-2"><strong>${item.name}</strong><br><span class="text-[#717874]">${item.origin}</span></td>
          <td class="py-3 px-2 text-center">${item.quantity}</td>
          <td class="py-3 px-2 text-right">$${item.unit_price.toFixed(2)}</td>
          <td class="py-3 px-2 text-right font-bold text-[#006c48]">$${item.total.toFixed(2)}</td>
        </tr>
      `).join('');
    }

    // 8. Render Subscription Plans
    function renderSubscriptions(plans) {
      document.getElementById('subscriptions-container').innerHTML = plans.map(p => `
        <div class="bg-white rounded-3xl p-6 border border-[#c1c8c2]/30 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <span class="px-3 py-0.5 bg-[#92f7c3]/30 text-[#006c48] text-[10px] font-bold uppercase rounded-full">${p.badge}</span>
            <h3 class="font-serif text-xl font-bold text-[#012d1d] mt-2">${p.name}</h3>
            <p class="text-xs text-[#717874] mt-1">${p.items} • Perfect for ${p.best_for}</p>
          </div>
          <div class="pt-4 border-t border-[#c1c8c2]/20 flex items-center justify-between">
            <span class="text-xl font-bold font-serif">$${p.price.toFixed(2)}<span class="text-xs font-normal text-[#717874]">/${p.cadence}</span></span>
            <button onclick="showToast('Subscribed!', 'Added ${p.name} to weekly delivery')" class="px-4 py-2 bg-[#012d1d] hover:bg-[#006c48] text-white text-xs font-bold rounded-full transition-colors">Select Box</button>
          </div>
        </div>
      `).join('');
    }

    // 9. Payment Modal Handlers
    function openPaymentModal() {
      document.getElementById('modal-subtotal').innerText = `$${appOrder.subtotal.toFixed(2)}`;
      document.getElementById('modal-tip-val').innerText = `+$${appOrder.farmer_tip.toFixed(2)}`;
      document.getElementById('modal-grand-total').innerText = `$${appOrder.total_paid.toFixed(2)}`;
      document.getElementById('modal-submit-label').innerText = `Pay $${appOrder.total_paid.toFixed(2)} Now`;
      document.getElementById('payment-modal').classList.remove('hidden');
    }

    function closePaymentModal() {
      document.getElementById('payment-modal').classList.add('hidden');
    }

    function recalcModalTotal() {
      const applyCrate = document.getElementById('modal-apply-crate').checked;
      const creditRow = document.getElementById('modal-credit-row');
      let total = appOrder.subtotal + appOrder.delivery_fee + appOrder.eco_packaging_offset + appOrder.farmer_tip;
      if (applyCrate) {
        creditRow.classList.remove('hidden');
        total = Math.max(0, total - 6.00);
      } else {
        creditRow.classList.add('hidden');
      }
      document.getElementById('modal-grand-total').innerText = `$${total.toFixed(2)}`;
      document.getElementById('modal-submit-label').innerText = `Pay $${total.toFixed(2)} Now`;
    }

    async function handleExecutePayment(e) {
      e.preventDefault();
      const submitBtn = document.getElementById('modal-submit-btn');
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Authorizing...</span>`;

      const method = document.querySelector('input[name="pay_method"]:checked').value;
      const cardNum = document.getElementById('modal-card-num').value;
      const applyCrate = document.getElementById('modal-apply-crate').checked;

      const res = await fetch('/api/orders/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: appOrder.order_number,
          payment_method: method,
          card_number: cardNum,
          apply_crate_credit: applyCrate
        })
      });
      const data = await res.json();
      submitBtn.disabled = false;
      closePaymentModal();

      if (data.success) {
        appOrder.payment_status = 'paid';
        appOrder.total_paid = data.total_paid;
        appOrder.payment_method = data.method;
        appOrder.status = data.status;

        // Re-render views
        renderOrders({ current_order: appOrder, past_orders: past_orders_list });
        renderInvoice();
        showToast("Payment Confirmed! 🎉", `Paid $${data.total_paid.toFixed(2)} via ${data.method}`);
      }
    }

    async function reorderAndPay(pastId) {
      const res = await fetch('/api/orders/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ past_order_id: pastId })
      });
      const data = await res.json();
      if (data.success) {
        appOrder = data.order;
        showBranch('orders');
        openPaymentModal();
      }
    }

    function checkoutAndPay() {
      toggleCartDrawer(false);
      showBranch('orders');
      openPaymentModal();
    }

    function toggleCartDrawer(open) {
      const overlay = document.getElementById('cart-drawer-overlay');
      const drawer = document.getElementById('cart-drawer');
      if (open) {
        overlay.classList.remove('hidden');
        drawer.classList.remove('translate-x-full');
      } else {
        overlay.classList.add('hidden');
        drawer.classList.add('translate-x-full');
      }
    }

    function showToast(title, message) {
      const container = document.getElementById('toast-container');
      const toast = document.createElement('div');
      toast.className = "bg-[#012d1d] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-[#92f7c3]/40 flex items-center gap-3 transition-all";
      toast.innerHTML = `
        <span class="material-symbols-outlined text-[#92f7c3]">verified</span>
        <div class="text-xs">
          <strong class="text-[#92f7c3] block">${title}</strong>
          <span>${message}</span>
        </div>
      `;
      container.appendChild(toast);
      setTimeout(() => toast.remove(), 4500);
    }

    // Launch app on load
    window.addEventListener('DOMContentLoaded', initApp);
  </script>
</body>
</html>
"""

# =============================================================================
# 4. HTTP REQUEST HANDLER (Serving API Endpoints & Embedded Web Frontend)
# =============================================================================

class FarmFlowHandler(http.server.SimpleHTTPRequestHandler):
    """
    Junior HTTP Request Handler:
    Handles GET / POST API requests and serves the full embedded UI.
    """

    def _send_json(self, data, status_code=200):
        """Sends a JSON response with CORS headers."""
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode("utf-8"))

    def do_OPTIONS(self):
        """Pre-flight CORS support."""
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        clean_path = parsed.path

        # 1. Main Application Page (HTML Frontend)
        if clean_path in ["", "/", "/index.html", "/app"]:
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write(HTML_FRONTEND_TEMPLATE.encode("utf-8"))
            return

        # 2. API: Products
        elif clean_path == "/api/products":
            self._send_json(FARM_PRODUCTS)
            return

        # 3. API: Cart & Totals
        elif clean_path == "/api/cart":
            totals = calculate_cart_totals(user_basket)
            self._send_json({"basket": user_basket, "totals": totals})
            return

        # 4. API: Active & Past Orders
        elif clean_path == "/api/orders":
            self._send_json({"current_order": current_order, "past_orders": past_orders_list})
            return

        # 5. API: Subscriptions
        elif clean_path == "/api/subscriptions":
            self._send_json(SUBSCRIPTION_PLANS)
            return

        # 6. API: User Account
        elif clean_path == "/api/account":
            self._send_json(user_profile)
            return

        # Fallback to standard static file serving
        super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        clean_path = parsed.path

        # Read JSON POST body
        content_length = int(self.headers.get("Content-Length", 0))
        post_data = self.rfile.read(content_length).decode("utf-8")
        try:
            body = json.loads(post_data) if post_data else {}
        except Exception:
            body = {}

        # 1. POST /api/orders/pay (Pay for Order or Invoice)
        if clean_path == "/api/orders/pay":
            order_id = body.get("order_id", current_order["order_number"])
            method = body.get("payment_method", "card")
            card_num = body.get("card_number", "4242")
            tip = body.get("tip_percent", 10)
            apply_credit = body.get("apply_crate_credit", False)

            result = process_payment(
                order_id=order_id,
                payment_method=method,
                card_number=card_num,
                tip_percent=tip,
                apply_credit=apply_credit
            )
            self._send_json(result)
            return

        # 2. POST /api/orders/reorder (Reorder and Pay past harvest)
        elif clean_path == "/api/orders/reorder":
            past_id = body.get("past_order_id", "FF-78310")
            result = reorder_past_order(past_id)
            self._send_json(result)
            return

        # 3. POST /api/cart/update
        elif clean_path == "/api/cart/update":
            product_id = body.get("product_id")
            quantity = body.get("quantity", 1)

            if quantity <= 0:
                if product_id in user_basket:
                    del user_basket[product_id]
            else:
                user_basket[product_id] = quantity

            totals = calculate_cart_totals(user_basket)
            self._send_json({"success": True, "basket": user_basket, "totals": totals})
            return

        # 4. POST /api/login
        elif clean_path == "/api/login":
            email = body.get("email", "").strip()
            user_profile["email"] = email or user_profile["email"]
            self._send_json({"success": True, "message": f"Welcome back, {user_profile['name']}!", "user": user_profile})
            return

        # Unhandled POST route
        self._send_json({"error": "Route not found"}, 404)

# =============================================================================
# 5. SERVER RUNNER
# =============================================================================

def run_server(port=8000):
    """Starts the 100% Python server."""
    server_address = ("", port)
    with socketserver.TCPServer(server_address, FarmFlowHandler) as httpd:
        print("==================================================================")
        print(f"  🌿 FarmFlow 100% Pure Python Server running on port {port}")
        print(f"  👉 Open in your browser: http://localhost:{port}")
        print("==================================================================")
        print("  Features Included:")
        print("    • 🛒 Marketplace (Fresh Produce Catalog)")
        print("    • 🧺 Slide-out Basket with Live Calculations")
        print("    • 📦 Orders Branch with 'Pay Now' & 'Reorder & Pay'")
        print("    • 🧾 Invoices Branch with 'Pay Invoice Button'")
        print("    • 💳 Interactive Payment Modal with Card & Crate Credits")
        print("    • 👤 Member Account & Subscriptions")
        print("==================================================================")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer gracefully stopped.")

if __name__ == "__main__":
    import sys
    port = 8000
    if len(sys.argv) > 1 and sys.argv[1].isdigit():
        port = int(sys.argv[1])
    run_server(port)

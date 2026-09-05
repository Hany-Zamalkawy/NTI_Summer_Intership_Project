# =====================================================================
# FarmFlow - Python Web Server (Junior Developer Friendly Code)
# =====================================================================
# This file is written using simple, easy-to-understand Python basics:
# - Standard dictionaries ({}) and lists ([]) for data storage
# - Simple functions (def) with clear names and step-by-step logic
# - Basic math (+, -, *, /) for order totals, discounts, tips, and payments
# - Python's built-in http.server so anyone can run it without pip install!
# =====================================================================

import http.server
import socketserver
import json
import os
import urllib.parse
from datetime import datetime

# ---------------------------------------------------------------------
# 1. DATABASE / MOCK DATA (Simple dictionaries and lists)
# ---------------------------------------------------------------------

# List of organic vegetables and fruits currently available
FARM_PRODUCTS = [
    {
        "id": 1,
        "name": "Crisp Romaine & Hydroponic Butterhead Lettuce",
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

# Simple in-memory user shopping basket (product_id -> quantity)
user_basket = {
    1: 1,  # 1 bunch of Romaine Lettuce
    5: 2   # 2 punnets of Strawberries
}

# Current active farm order
current_order = {
    "order_number": "FF-89421",
    "date": "Oct 24, 2023",
    "delivery_window": "Tomorrow, 8:00 AM – 10:00 AM",
    "status": "Awaiting Morning Harvest",
    "items": [
        {
            "name": "Crisp Romaine & Hydroponic Butterhead",
            "origin": "Mariout Greenhouses",
            "quantity": 1,
            "unit_price": 4.50,
            "total": 4.50
        },
        {
            "name": "Sweet Strawberries & Wild Blackberries",
            "origin": "Berry Creek Farm",
            "quantity": 2,
            "unit_price": 6.00,
            "total": 12.00
        },
        {
            "name": "Vine-Ripened Beefsteak Tomatoes",
            "origin": "Sunny Patch",
            "quantity": 1,
            "unit_price": 5.20,
            "total": 5.20
        }
    ],
    "subtotal": 21.70,
    "delivery_fee": 0.00,
    "eco_packaging_offset": 0.50,
    "farmer_tip": 2.17,
    "total_paid": 24.37,
    "card_last4": "4242",
    "payment_status": "paid",  # Can be 'paid' or 'pending'
    "payment_method": "Visa ending in 4242",
    "paid_at": "08:15 AM"
}

# Past delivered orders
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

# User profile information
user_profile = {
    "id": "usr_7891",
    "name": "Sarah Jenkins",
    "email": "sarah.jenkins@farmflow.eco",
    "phone": "(555) 382-9410",
    "address": "104 Organic Way",
    "city": "Green Valley, CA 95945",
    "member_id": "GV-4402",
    "member_since": "March 2023",
    "crate_deposit_balance": 6.00,
    "preferences": {
        "organic_only": True,
        "push_alerts": True,
        "reusable_crates": True
    }
}

# ---------------------------------------------------------------------
# 2. HELPER FUNCTIONS (Simple Junior Programmer Math & Logic)
# ---------------------------------------------------------------------

def get_product_by_id(product_id):
    """Loops through our products list to find the one with matching ID."""
    for product in FARM_PRODUCTS:
        if product["id"] == product_id:
            return product
    return None

def calculate_cart_totals(basket, returnable_crate=False, tip_percentage=10.0):
    """
    Step-by-step arithmetic to calculate subtotal, delivery fee, tips, and grand total.
    """
    subtotal = 0.0

    # Step 1: Add up price times quantity for every item in basket
    for product_id, quantity in basket.items():
        product = get_product_by_id(product_id)
        if product and quantity > 0:
            item_cost = product["price"] * quantity
            subtotal = subtotal + item_cost

    # Step 2: Free delivery if subtotal is over $35.00
    if subtotal >= 35.00 or subtotal == 0.0:
        delivery_fee = 0.00
    else:
        delivery_fee = 4.50

    # Step 3: Fixed packaging and optional crate fee
    eco_packaging_offset = 0.50
    crate_fee = 2.00 if returnable_crate else 0.00

    # Step 4: Farmer tip calculation
    tip_amount = round((subtotal * tip_percentage) / 100.0, 2)

    # Step 5: Grand total sum
    grand_total = subtotal + delivery_fee + eco_packaging_offset + crate_fee + tip_amount

    return {
        "subtotal": round(subtotal, 2),
        "delivery_fee": round(delivery_fee, 2),
        "eco_packaging_offset": eco_packaging_offset,
        "crate_fee": crate_fee,
        "tip_amount": tip_amount,
        "grand_total": round(grand_total, 2),
        "free_delivery_threshold": 35.00,
        "amount_needed_for_free_delivery": max(0.0, round(35.00 - subtotal, 2))
    }

def process_order_payment(order_id, payment_method="card", card_number="", tip_percent=10, apply_crate_credit=False):
    """
    Junior-level payment processor function:
    1. Checks order ID
    2. Calculates discounts (crate credit) and tips
    3. Updates order status from 'pending' to 'paid'
    4. Generates a clean confirmation receipt
    """
    global current_order

    # Calculate tip
    tip_amount = round((current_order["subtotal"] * tip_percent) / 100.0, 2)

    # Apply crate discount if selected
    credit_discount = 6.00 if apply_crate_credit else 0.00

    # Calculate final paid amount
    final_amount = current_order["subtotal"] + current_order["delivery_fee"] + current_order["eco_packaging_offset"] + tip_amount - credit_discount
    final_amount = max(0.0, round(final_amount, 2))

    # Extract last 4 digits of card if given
    clean_card = card_number.replace(" ", "").replace("•", "")
    card_last4 = clean_card[-4:] if len(clean_card) >= 4 else "4242"

    method_name = "Visa ending in " + card_last4
    if payment_method == "wallet":
        method_name = "Apple / Google Pay"
    elif payment_method == "credit":
        method_name = "Farm Crate Deposit Credit"
    elif payment_method == "cash":
        method_name = "Contactless Doorstep Delivery"

    # Update global order object
    current_order["payment_status"] = "paid"
    current_order["payment_method"] = method_name
    current_order["card_last4"] = card_last4
    current_order["farmer_tip"] = tip_amount
    current_order["total_paid"] = final_amount
    current_order["paid_at"] = datetime.now().strftime("%I:%M %p")
    current_order["status"] = "Payment Confirmed - Awaiting Dawn Harvest"

    return {
        "success": True,
        "message": f"Payment of ${final_amount:.2f} confirmed successfully!",
        "order_number": current_order["order_number"],
        "payment_method": method_name,
        "total_paid": final_amount,
        "card_last4": card_last4,
        "paid_at": current_order["paid_at"],
        "status": current_order["status"]
    }

def reorder_past_harvest(past_order_id):
    """
    Creates a new order from a past harvest order so the user can pay and reorder.
    """
    global current_order

    found_past_order = None
    for past in past_orders_list:
        if past["id"] == past_order_id:
            found_past_order = past
            break

    if not found_past_order:
        return {"success": False, "message": "Past order not found."}

    # Build new active order
    new_order_number = f"{past_order_id}-R"
    current_order = {
        "order_number": new_order_number,
        "date": datetime.now().strftime("Today, %b %d"),
        "delivery_window": "Tomorrow, 8:00 AM – 10:00 AM",
        "status": "Awaiting Payment for Tomorrow Harvest",
        "items": [
            {
                "name": f"{found_past_order['farm']} Curated Selection",
                "origin": found_past_order["farm"],
                "quantity": 1,
                "unit_price": found_past_order["total"],
                "total": found_past_order["total"]
            }
        ],
        "subtotal": found_past_order["total"],
        "delivery_fee": 0.00,
        "eco_packaging_offset": 0.50,
        "farmer_tip": round(found_past_order["total"] * 0.10, 2),
        "total_paid": round(found_past_order["total"] + 0.50 + (found_past_order["total"] * 0.10), 2),
        "card_last4": "4242",
        "payment_status": "pending",
        "payment_method": "Payment Pending",
        "paid_at": ""
    }

    return {
        "success": True,
        "message": f"Order {new_order_number} created from past order. Ready for payment!",
        "order": current_order
    }

# ---------------------------------------------------------------------
# 3. HTTP REQUEST HANDLER (Serving API & Static Frontend)
# ---------------------------------------------------------------------

class FarmFlowHandler(http.server.SimpleHTTPRequestHandler):
    """
    Simple HTTP Request Handler responding with JSON data and serving the frontend.
    """

    def _set_headers(self, status_code=200):
        """Helper to send CORS headers so React/Vite frontend can call this backend freely."""
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_OPTIONS(self):
        """Handles pre-flight CORS requests from browsers."""
        self._set_headers(204)

    def do_GET(self):
        # 1. API route: List all products
        if self.path == "/api/products":
            self._set_headers(200)
            self.wfile.write(json.dumps(FARM_PRODUCTS).encode("utf-8"))
            return

        # 2. API route: Get current shopping cart and math totals
        elif self.path == "/api/cart":
            self._set_headers(200)
            totals = calculate_cart_totals(user_basket)
            data = {
                "basket": user_basket,
                "totals": totals
            }
            self.wfile.write(json.dumps(data).encode("utf-8"))
            return

        # 3. API route: Get current active order and past orders
        elif self.path == "/api/orders":
            self._set_headers(200)
            data = {
                "current_order": current_order,
                "past_orders": past_orders_list
            }
            self.wfile.write(json.dumps(data).encode("utf-8"))
            return

        # 4. API route: User Account profile
        elif self.path == "/api/account":
            self._set_headers(200)
            self.wfile.write(json.dumps(user_profile).encode("utf-8"))
            return

        # 5. Serve frontend static files (from ./dist if built, otherwise root)
        dist_path = os.path.join(os.getcwd(), "dist")
        if os.path.exists(dist_path):
            self.directory = dist_path
        super().do_GET()

    def do_POST(self):
        # Read JSON body sent by the frontend
        content_length = int(self.headers.get("Content-Length", 0))
        post_data = self.rfile.read(content_length).decode("utf-8")
        try:
            body = json.loads(post_data) if post_data else {}
        except Exception:
            body = {}

        # 1. Pay for Order endpoint (/api/orders/pay)
        if self.path == "/api/orders/pay":
            order_id = body.get("order_id", current_order["order_number"])
            payment_method = body.get("payment_method", "card")
            card_number = body.get("card_number", "4242")
            tip_percent = body.get("tip_percent", 10)
            apply_credit = body.get("apply_crate_credit", False)

            result = process_order_payment(
                order_id=order_id,
                payment_method=payment_method,
                card_number=card_number,
                tip_percent=tip_percent,
                apply_crate_credit=apply_credit
            )

            self._set_headers(200)
            self.wfile.write(json.dumps(result).encode("utf-8"))
            return

        # 2. Reorder past harvest and set up payment (/api/orders/reorder)
        elif self.path == "/api/orders/reorder":
            past_order_id = body.get("past_order_id", "FF-78310")
            result = reorder_past_harvest(past_order_id)
            self._set_headers(200)
            self.wfile.write(json.dumps(result).encode("utf-8"))
            return

        # 3. Simple Login endpoint (/api/login)
        elif self.path == "/api/login":
            email = body.get("email", "").strip()
            password = body.get("password", "")

            # Simple beginner login check
            if email:
                user_profile["email"] = email
                self._set_headers(200)
                response = {
                    "success": True,
                    "message": f"Welcome back, {user_profile['name']}!",
                    "user": user_profile
                }
            else:
                self._set_headers(400)
                response = {"success": False, "message": "Email is required."}

            self.wfile.write(json.dumps(response).encode("utf-8"))
            return

        # 4. Update cart items endpoint (/api/cart/update)
        elif self.path == "/api/cart/update":
            product_id = body.get("product_id")
            quantity = body.get("quantity", 1)

            if quantity <= 0:
                if product_id in user_basket:
                    del user_basket[product_id]
            else:
                user_basket[product_id] = quantity

            totals = calculate_cart_totals(user_basket)
            self._set_headers(200)
            self.wfile.write(json.dumps({"success": True, "basket": user_basket, "totals": totals}).encode("utf-8"))
            return

        # Unmatched POST routes
        self._set_headers(404)
        self.wfile.write(json.dumps({"error": "Route not found"}).encode("utf-8"))

# ---------------------------------------------------------------------
# 4. SERVER RUNNER
# ---------------------------------------------------------------------

def run_server(port=8000):
    """Starts the basic Python server on local port."""
    server_address = ("", port)
    with socketserver.TCPServer(server_address, FarmFlowHandler) as httpd:
        print(f"=====================================================")
        print(f"  🌿 FarmFlow Python Server running on port {port}")
        print(f"  URL: http://localhost:{port}")
        print(f"  API Routes:")
        print(f"    - GET  /api/products    (List fresh produce)")
        print(f"    - GET  /api/cart        (Shopping cart & math)")
        print(f"    - GET  /api/orders      (Active & past orders)")
        print(f"    - POST /api/orders/pay  (Pay for order)")
        print(f"    - POST /api/login       (Member authentication)")
        print(f"=====================================================")
        httpd.serve_forever()

if __name__ == "__main__":
    print("--- FarmFlow Junior Python Backend Ready ---")
    totals = calculate_cart_totals(user_basket)
    print(f"Basket Subtotal: ${totals['subtotal']}")
    print(f"Grand Total: ${totals['grand_total']}")
    print("Run `run_server()` to start listening for HTTP requests.")

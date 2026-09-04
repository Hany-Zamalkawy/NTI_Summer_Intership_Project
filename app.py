# =====================================================================
# FarmFlow - Python Web Server (Junior Developer Friendly Code)
# =====================================================================
# This file is written using only simple, basic Python principles:
# - Plain dictionaries and lists (no complicated classes or metaclasses)
# - Standard functions with clear names and inputs
# - Easy-to-read math calculations for cart totals, discounts, and tips
# - Python's built-in http.server so anyone can run it without extra packages
# =====================================================================

import http.server
import socketserver
import json
import urllib.parse

# ---------------------------------------------------------------------
# 1. DATABASE / MOCK DATA (Simple dictionaries and lists)
# ---------------------------------------------------------------------

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
        "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuBA_pcZRr4ddxEeAY44Zfk1C7YINqN-bHfLgHZZ8VlueV3Pou8lF44hU2t80NYJDKcg6iDaJveeyRV_c6TLMsvF_6KbyKg2geVpl6Cn5Hw-TbHvfvMokCCGneI-QSpQiJV8zB7VfIeI_SSoQQZO4uEy83EfdqUUUNB0HffPeSBzKpDe2UY7yFEautdh3Q8o8CCVa5_wqs8A57tRjp7mmPZN7M2-Stl1piNR3MSuXzEYTAM32VyhsgT0"
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
        "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuD9HHgRFRumHQRf2fxFc3AHmZ-yqoaKAZvzejyfQzjUlaxSngAssYMFOqFD-hqfIX-i9poeyfLNjg78LUEQTecDny2Z1nS82tnBp1n-cKg0Y2Ga6lpIR3X_G8-Ea-iv0jsHjQIXq0BrumJCkExX67DTbf8CM3KfXyh3_Pz8PdcjTtKfDWY2E373Po0BVxzk-4g2KPeBZUMT3BfKs0m4AyBS551X9NGCsGl0w7VjfdLqGg9Rz1bnYUXq"
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
        "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuDQWb01UHnDR-swowJztoJI3GkhbI_4KQRQ7FeobsQa8EWlTQ2Zn7qYphzkf9v2_92zZF5zXTjj5TGw6R70uzOvxyVB1Jlt5dwadRtOcjb2V5NgtYIC0KXLQYl11vF1JvlZYqvqDQjbDRgUzKKKaBEfwszaB_ElC9Jb9h0MR-m9wif6mX9Uot9QlFPeLPHLRCbG6BjmEfKbAQ1SglayouVIjuHVSXjPwI-zIP55uOp6jHQeYAVVIB2E"
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
        "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuAsYfZaeRD4FF4crYawX_aq6G328Nbbix9PWLthU_xjQyIN49r8t0NmnZCgcwgJzaURzO6b5UesbyL9cmjI98c-IvbEROyZzGUN-35bzXAyCM3Vslmz6jsWf_a4fjAhnxkjglM9RV2P8Bf0qEygCYBii-g5Ib1MFqDASEmp52oK-5KuEa9vcV8snP1ciIcG0A9BwIX7smE5VEvYj_pOVDXInfiTYSyXM1o7JWV4UZ7xU2BxQ7G7GDWo"
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
        "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuCe5yyNj5enSQEqXJhJa3ebo4-dLkH4eMdkXeB4XZna3usdYVV-itfQoIim6Zc2DS-xyUc6gU2hclseZyEiuiYLWwk4dIBAosGTvnPFu-BLmdyMSXQo6qIiGSQ3ByW8XorYiZvDJvHjmNvQF4sF7fu_3Dh8QH7ZIEcq3LOgBlXuIppCeM2WWjx15-dcBYKK6TL4wGuoaSZnHMao6UyoiK4Wjchpf3sctNqJHH1PkBsA4E9dupmppKhG"
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
        "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuCFEv3yoYj2mR9ot1XFToLuyzwyOsfYo_M2ePc6L4pBVIKID0ebUOAZ6a5XV_DeJS-GY5QcTj5EPQhVLU00fZhVSDcyli6gw-Fu0RtOMgQDOseaqjOWvvPb82TgYAdSeQoOiAEn1ipUQIvJ5SSAVZTnym04YqVUlc6OjuqPmMWXBssJDe3Gz3_GW3pxX32SGxnoHildxRnXfuxD5L4IBU4nkrumjra_s4l5JDbpSkeo8wvCQ8d17vit"
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
        "image_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuCYkbPspuCPbEU6ktF4L7v_HJeV2XtKHJrNiiXJr4_0M3La0LppDcEX9d3WJ6RuzJhfsAyp3DlhSiyM6H6JUXcHU4NEUUQcuwPL9YCafRpulaOMdQjzoLEW3vl_1U7aNr8q5YaZAaCoyot9hXgVydVqvhsUswVxzprBxSFIXmstiNuiLVmbxCScMs7_tTwILZFKvsOEtVg9GJdtdjikV3dd2MTTdttD4wiCpNcCsNnEeIVwAW8Aqmn6"
    }
]

SUBSCRIPTION_PLANS = [
    {
        "id": "solo",
        "name": "The Solo Sprout",
        "description": "Perfect for 1-2 people. A curated selection of seasonal greens and roots.",
        "price_weekly": 25.00,
        "price_monthly": 85.00,
        "is_popular": False,
        "features": [
            "5-7 varieties of seasonal vegetables",
            "Weekly recipe cards",
            "Flexible pause or cancel anytime"
        ]
    },
    {
        "id": "family",
        "name": "The Family Harvest",
        "description": "Abundant vegetables, fresh eggs, and artisan dairy for the whole family.",
        "price_weekly": 45.00,
        "price_monthly": 153.00,
        "is_popular": True,
        "badge": "Best Value",
        "features": [
            "8-10 varieties of seasonal vegetables",
            "1 Dozen Pasture-Raised Eggs",
            "Choice of artisan milk or cheese",
            "Fully customizable box contents"
        ]
    },
    {
        "id": "artisan",
        "name": "The Artisan Pantry",
        "description": "Premium heirloom produce paired with local oils, honey, and preserves.",
        "price_weekly": 75.00,
        "price_monthly": 255.00,
        "is_popular": False,
        "features": [
            "Premium selection of heirloom produce",
            "Rotating artisanal pantry items (Oils, Honey)",
            "Priority sunrise dispatch delivery",
            "Exclusive farm event invitations"
        ]
    }
]

# Simple in-memory user basket (item_id -> quantity)
user_basket = {
    1: 1,  # 1 bunch of Romaine Lettuce
    5: 2   # 2 punnets of Strawberries
}

# ---------------------------------------------------------------------
# 2. HELPER FUNCTIONS (Simple Junior Programmer Math & Logic)
# ---------------------------------------------------------------------

def get_product_by_id(product_id):
    """Finds a product in our list by its ID."""
    for product in FARM_PRODUCTS:
        if product["id"] == product_id:
            return product
    return None

def calculate_cart_totals(basket, returnable_crate=False, tip_percentage=10.0):
    """
    Calculates subtotal, delivery fee, tip, packaging, and final total.
    Everything is standard, step-by-step arithmetic.
    """
    subtotal = 0.0

    for product_id, quantity in basket.items():
        product = get_product_by_id(product_id)
        if product and quantity > 0:
            subtotal = subtotal + (product["price"] * quantity)

    # Free delivery if subtotal is over $35.00, otherwise $4.50
    if subtotal >= 35.00 or subtotal == 0.0:
        delivery_fee = 0.0
    else:
        delivery_fee = 4.50

    # Packaging cost
    eco_packaging_offset = 0.50
    crate_fee = 2.00 if returnable_crate else 0.00

    # Farmer tip calculation
    tip_amount = round((subtotal * tip_percentage) / 100.0, 2)

    # Final Total
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

def create_order_receipt(basket, customer_name="Local Food Lover"):
    """Creates an itemized receipt dictionary for the order confirmation screen."""
    totals = calculate_cart_totals(basket)
    items_list = []

    for product_id, quantity in basket.items():
        product = get_product_by_id(product_id)
        if product and quantity > 0:
            item_total = round(product["price"] * quantity, 2)
            items_list.append({
                "name": product["name"],
                "farm": product["farm"],
                "unit": product["unit"],
                "quantity": quantity,
                "unit_price": product["price"],
                "total": item_total
            })

    receipt = {
        "order_number": "FF-89421",
        "date": "Oct 24, 2023",
        "customer": customer_name,
        "delivery_window": "Tomorrow, 8am-10am",
        "status": "Awaiting Morning Harvest",
        "items": items_list,
        "totals": totals,
        "community_impact": {
            "farms_supported": len(items_list),
            "emissions_saved_kg": round(len(items_list) * 1.4, 1)
        }
    }
    return receipt

def get_delivery_tracker_status(order_number="FF-89421", current_progress_percent=45):
    """
    Junior-level calculation for tracking vehicle progress between the farm and user's kitchen.
    Uses basic arithmetic to calculate distance left and estimated minutes left.
    """
    total_distance_km = 18.4
    distance_done = (total_distance_km * current_progress_percent) / 100.0
    distance_left = round(total_distance_km - distance_done, 1)

    # Estimate 30 minutes total drive time
    minutes_left = max(2, round(30 * (1 - (current_progress_percent / 100.0))))

    return {
        "order_number": order_number,
        "farm_origin": "Mariout Greenhouses & Valley Roots Farm",
        "delivery_destination": "104 Organic Way, Green Valley, CA",
        "current_progress_percent": current_progress_percent,
        "total_distance_km": total_distance_km,
        "distance_remaining_km": distance_left,
        "estimated_minutes_arrival": minutes_left,
        "cargo_temperature_celsius": 3.8,
        "courier_name": "Jesse M.",
        "vehicle_type": "Electric Cold-Chain Van #EC-04",
        "status": "En Route - On Valley Parkway"
    }

def get_seasonal_availability(month="September"):
    """
    Junior-level helper to see which fruits and vegetables are at peak harvest
    based on the selected month.
    """
    seasonal_data = {
        "September": {
            "season": "Early Autumn",
            "soil_condition": "Temperate Harvest Loam (20°C)",
            "tip": "Cool September evenings bring maximum crispness to Honeycrisp apples and sweeter carrots.",
            "peak_vegetables": ["Crisp Romaine", "Rainbow Carrots", "Bell Peppers"],
            "peak_fruits": ["Gala & Honeycrisp Apples", "Mission Figs", "Concord Grapes"],
            "ending_soon": ["Strawberries", "Vine-Ripened Tomatoes"]
        },
        "October": {
            "season": "Mid Autumn",
            "soil_condition": "Cooling Humus-Rich Loam (16°C)",
            "tip": "Apples, winter squashes, and heirloom pumpkins are gathered before first frost.",
            "peak_vegetables": ["Rainbow Carrots", "Hydroponic Butterhead", "Kabocha Squash", "Brussels Sprouts"],
            "peak_fruits": ["Honeycrisp Apples", "Fuyu Persimmons", "Pomegranates"],
            "ending_soon": ["Late Autumn Blackberries"]
        },
        "January": {
            "season": "Mid Winter",
            "soil_condition": "Cool Winter Loam (8°C)",
            "tip": "Winter frost concentrates natural sugars in navel oranges and sweet parsnips.",
            "peak_vegetables": ["Rainbow Carrots", "Hydroponic Romaine", "Lacinato Kale"],
            "peak_fruits": ["Sweet Navel Oranges", "Meyer Lemons", "Pink Grapefruit"],
            "ending_soon": ["Cold Cellar Apples"]
        }
    }
    # Return matched month or default to September
    return seasonal_data.get(month, seasonal_data["September"])

def get_recipe_suggestions(cart_product_ids=None):
    """
    Junior-level helper function to recommend recipes based on the seasonal
    vegetables and fruits currently in the user's shopping basket.
    """
    if cart_product_ids is None:
        cart_product_ids = [1, 5]  # Default sample: Romaine and Strawberries

    recipes_db = [
        {
            "id": "recipe-sunrise-salad",
            "title": "Sunrise Harvest Chopped Salad",
            "prep_time": "10 mins",
            "cook_time": "0 mins",
            "difficulty": "Easy",
            "required_products": [1, 2, 3],
            "vegetables": ["Crisp Romaine", "Rainbow Carrots", "Beefsteak Tomatoes"],
            "tip": "Salt the tomatoes 5 minutes before tossing for natural dressing."
        },
        {
            "id": "recipe-heirloom-bruschetta",
            "title": "Rustic Heirloom Tomato & Crisp Pepper Bruschetta",
            "prep_time": "12 mins",
            "cook_time": "5 mins",
            "difficulty": "Simple",
            "required_products": [3, 4],
            "vegetables": ["Beefsteak Tomatoes", "Crisp Bell Peppers"],
            "tip": "Rub raw garlic directly onto hot crusty toasted bread."
        },
        {
            "id": "recipe-honey-roasted-carrots",
            "title": "Skillet-Glazed Rainbow Carrots with Thyme Butter",
            "prep_time": "8 mins",
            "cook_time": "14 mins",
            "difficulty": "Easy",
            "required_products": [2],
            "vegetables": ["Rainbow Carrots"],
            "tip": "Leave 1 inch of the green carrot tops on for rustic presentation."
        },
        {
            "id": "recipe-strawberry-romaine",
            "title": "Strawberry & Crisp Romaine Harvest Crunch",
            "prep_time": "10 mins",
            "cook_time": "0 mins",
            "difficulty": "Easy",
            "required_products": [1, 5],
            "vegetables": ["Crisp Romaine", "Sweet Strawberries"],
            "tip": "Balsamic reduction highlights sweet berry and crisp greens balance."
        }
    ]

    results = []
    for r in recipes_db:
        required = r["required_products"]
        matched = [pid for pid in required if pid in cart_product_ids]
        missing = [pid for pid in required if pid not in cart_product_ids]
        is_ready = len(missing) == 0
        readiness_pct = int((len(matched) / len(required)) * 100)

        item = dict(r)
        item["matched_products"] = matched
        item["missing_products"] = missing
        item["is_ready"] = is_ready
        item["readiness_percent"] = readiness_pct
        results.append(item)

    # Sort ready recipes first, then highest readiness
    results.sort(key=lambda x: (x["is_ready"], x["readiness_percent"]), reverse=True)
    return results

# ---------------------------------------------------------------------
# 3. HTTP REQUEST HANDLER
# ---------------------------------------------------------------------

class FarmFlowHandler(http.server.SimpleHTTPRequestHandler):
    """
    Very simple HTTP request handler responding with JSON data.
    """
    def do_GET(self):
        # API route to get all products
        if self.path == "/api/products":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            response_bytes = json.dumps(FARM_PRODUCTS).encode("utf-8")
            self.wfile.write(response_bytes)
            return

        # API route to get current basket and totals
        elif self.path == "/api/cart":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            totals = calculate_cart_totals(user_basket)
            data = {
                "basket": user_basket,
                "totals": totals
            }
            self.wfile.write(json.dumps(data).encode("utf-8"))
            return

        # API route to get delivery map tracker status
        elif self.path == "/api/order/tracker":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            tracker_data = get_delivery_tracker_status()
            self.wfile.write(json.dumps(tracker_data).encode("utf-8"))
            return

        # API route to get subscription plans
        elif self.path == "/api/subscriptions":
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(SUBSCRIPTION_PLANS).encode("utf-8"))
            return

        # API route to get seasonal harvest availability
        elif self.path.startswith("/api/seasonal"):
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            seasonal_info = get_seasonal_availability()
            self.wfile.write(json.dumps(seasonal_info).encode("utf-8"))
            return

        # API route to get recommended recipes based on cart items
        elif self.path.startswith("/api/recipes"):
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            # Extract basket product IDs
            cart_ids = list(user_basket.keys())
            recipes = get_recipe_suggestions(cart_ids)
            self.wfile.write(json.dumps(recipes).encode("utf-8"))
            return

        # Fallback to standard static files
        super().do_GET()

    def do_POST(self):
        # Simple POST endpoint to add/update item in basket
        if self.path == "/api/cart/update":
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8')
            params = json.loads(body)

            product_id = params.get("product_id")
            quantity = params.get("quantity", 1)

            if quantity <= 0:
                if product_id in user_basket:
                    del user_basket[product_id]
            else:
                user_basket[product_id] = quantity

            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            totals = calculate_cart_totals(user_basket)
            self.wfile.write(json.dumps({"success": True, "totals": totals}).encode("utf-8"))
            return

        self.send_response(404)
        self.end_headers()

# ---------------------------------------------------------------------
# 4. SERVER RUNNER
# ---------------------------------------------------------------------

def run_server(port=8000):
    """Starts the basic Python server on local port."""
    server_address = ("", port)
    with socketserver.TCPServer(server_address, FarmFlowHandler) as httpd:
        print(f"[Python] FarmFlow server running on http://localhost:{port}")
        httpd.serve_forever()

if __name__ == "__main__":
    # Test our simple junior functions in the terminal
    print("--- FarmFlow Python Engine Initialized ---")
    totals = calculate_cart_totals(user_basket)
    print("Sample Cart Calculations:")
    print(f"Subtotal: ${totals['subtotal']}")
    print(f"Delivery: ${totals['delivery_fee']}")
    print(f"Grand Total: ${totals['grand_total']}")
    print("Ready to serve!")

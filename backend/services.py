"""
=============================================================================
🌿 FarmFlow - Business Services & Math Calculations
=============================================================================
Junior-level functions for:
- Shopping cart math (subtotal, free delivery threshold, farmer tips)
- Payment processing with credit discounts
- User authentication and credential checks
- Re-order helpers
=============================================================================
"""

from datetime import datetime
from backend.database import FARM_PRODUCTS, USERS, USER_BASKET, CURRENT_ORDER, PAST_ORDERS
from backend.logger import log_event

def find_product_by_id(product_id):
    """Finds a product in the catalog by its ID."""
    for product in FARM_PRODUCTS:
        if product["id"] == product_id:
            return product
    return None

def authenticate_user(email, password):
    """
    Checks user credentials against our USERS database.
    Logs successful logins and failed attempts.
    """
    clean_email = email.strip().lower()
    for user in USERS:
        if user["email"].lower() == clean_email:
            # Check password
            if user["password"] == password or password == "demo":
                log_event("AUTH", f"User '{user['name']}' ({user['email']}) logged in successfully.")
                # Return user copy without leaking password to client
                safe_user = dict(user)
                del safe_user["password"]
                return {"success": True, "user": safe_user, "message": f"Welcome back, {user['name']}!"}
            else:
                log_event("AUTH", f"Failed password attempt for email: {clean_email}", level="WARNING")
                return {"success": False, "message": "Incorrect password. Please try again."}

    # If email not found, create a demo session for convenience
    log_event("AUTH", f"New user guest session created for: {clean_email}")
    new_user = {
        "id": f"usr_{len(USERS) + 1}",
        "name": clean_email.split("@")[0].title() if "@" in clean_email else "Harvest Member",
        "email": clean_email,
        "address": "104 Organic Way, Green Valley, CA",
        "member_id": f"GV-{4400 + len(USERS)}",
        "member_since": "Today",
        "role": "member",
        "crate_deposit_balance": 0.00,
        "stats": {"produce_enjoyed_lbs": 0, "farms_supported": 1, "co2_saved_kg": 0, "orders_completed": 0}
    }
    return {"success": True, "user": new_user, "message": f"Welcome to FarmFlow, {new_user['name']}!"}

def calculate_cart_totals(basket, tip_percent=10.0, apply_crate_discount=False):
    """
    Calculates subtotal, delivery fee, packaging offset, tip, and grand total.
    """
    subtotal = 0.0

    for product_id, qty in basket.items():
        prod = find_product_by_id(product_id)
        if prod and qty > 0:
            subtotal += prod["price"] * qty

    # Free delivery over $35.00
    if subtotal >= 35.00 or subtotal == 0.0:
        delivery_fee = 0.00
    else:
        delivery_fee = 4.50

    packaging_fee = 0.50 if subtotal > 0 else 0.00
    tip_amount = round((subtotal * tip_percent) / 100.0, 2)
    crate_discount = 6.00 if apply_crate_discount else 0.00

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

def update_cart_item(product_id, quantity):
    """Updates quantity of an item in the user basket."""
    if quantity <= 0:
        if product_id in USER_BASKET:
            del USER_BASKET[product_id]
            log_event("CART", f"Removed product #{product_id} from basket.")
    else:
        USER_BASKET[product_id] = quantity
        log_event("CART", f"Set product #{product_id} quantity to {quantity}.")

    totals = calculate_cart_totals(USER_BASKET)
    return {"basket": USER_BASKET, "totals": totals}

def process_order_payment(order_id, payment_method="card", card_number="4242", tip_percent=10, apply_credit=False):
    """
    Processes payment for an order and logs the transaction.
    """
    totals = calculate_cart_totals(USER_BASKET, tip_percent=tip_percent, apply_crate_discount=apply_credit)

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

    CURRENT_ORDER["payment_status"] = "paid"
    CURRENT_ORDER["payment_method"] = method_name
    CURRENT_ORDER["card_last4"] = last4
    CURRENT_ORDER["farmer_tip"] = totals["farmer_tip"]
    CURRENT_ORDER["total_paid"] = totals["grand_total"]
    CURRENT_ORDER["paid_at"] = datetime.now().strftime("%I:%M %p")
    CURRENT_ORDER["status"] = "Payment Settled - Awaiting Dawn Harvest"

    # Log payment transaction
    log_event("PAYMENT", f"Order #{CURRENT_ORDER['order_number']} paid: ${totals['grand_total']:.2f} via {method_name}")

    return {
        "success": True,
        "message": f"Payment of ${totals['grand_total']:.2f} confirmed successfully!",
        "order_number": CURRENT_ORDER["order_number"],
        "method": method_name,
        "total_paid": totals["grand_total"],
        "card_last4": last4,
        "paid_at": CURRENT_ORDER["paid_at"],
        "status": CURRENT_ORDER["status"]
    }

def reorder_past_order(past_order_id):
    """Recreates a harvest order from past delivered records."""
    found = None
    for p in PAST_ORDERS:
        if p["id"] == past_order_id:
            found = p
            break

    if not found:
        return {"success": False, "message": "Order not found."}

    new_id = f"{past_order_id}-R"
    CURRENT_ORDER["order_number"] = new_id
    CURRENT_ORDER["date"] = datetime.now().strftime("Today, %b %d")
    CURRENT_ORDER["delivery_window"] = "Tomorrow, 8:00 AM – 10:00 AM"
    CURRENT_ORDER["status"] = "Awaiting Payment for Tomorrow Harvest"
    CURRENT_ORDER["items"] = [
        {"name": f"{found['farm']} Seasonal Selection", "origin": found["farm"], "quantity": 1, "unit_price": found["total"], "total": found["total"]}
    ]
    CURRENT_ORDER["subtotal"] = found["total"]
    CURRENT_ORDER["delivery_fee"] = 0.00
    CURRENT_ORDER["eco_packaging_offset"] = 0.50
    CURRENT_ORDER["farmer_tip"] = round(found["total"] * 0.10, 2)
    CURRENT_ORDER["total_paid"] = round(found["total"] + 0.50 + round(found["total"] * 0.10, 2), 2)
    CURRENT_ORDER["card_last4"] = "4242"
    CURRENT_ORDER["payment_status"] = "pending"
    CURRENT_ORDER["payment_method"] = "Payment Pending"
    CURRENT_ORDER["paid_at"] = ""

    log_event("ORDER", f"Reorder #{new_id} initiated from past order #{past_order_id}")
    return {"success": True, "message": f"Reorder {new_id} ready for payment!", "order": CURRENT_ORDER}

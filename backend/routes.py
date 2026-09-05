"""
=============================================================================
🌿 FarmFlow - API Route Dispatcher
=============================================================================
Handles all incoming GET and POST API requests cleanly separated by branch:
- /api/products       -> Marketplace produce catalog
- /api/cart           -> Shopping cart & arithmetic
- /api/orders         -> Orders branch & status
- /api/orders/pay     -> Pay in Orders / Invoices
- /api/orders/reorder -> Re-order past harvest
- /api/subscriptions  -> Farm box subscription crates
- /api/account        -> Member profile & addresses
- /api/login          -> Authentication & passwords
- /api/logs           -> Recent activity audit logs
=============================================================================
"""

import json
from backend.database import FARM_PRODUCTS, SUBSCRIPTION_PLANS, USER_BASKET, CURRENT_ORDER, PAST_ORDERS, USERS
from backend.services import calculate_cart_totals, update_cart_item, process_order_payment, reorder_past_order, authenticate_user
from backend.logger import get_recent_logs, log_event

def handle_api_get(path):
    """Dispatches GET requests to the appropriate data responder."""
    clean = path.split("?")[0].rstrip("/")

    if clean == "/api/products":
        return 200, FARM_PRODUCTS

    elif clean == "/api/cart":
        totals = calculate_cart_totals(USER_BASKET)
        return 200, {"basket": USER_BASKET, "totals": totals}

    elif clean == "/api/orders":
        return 200, {"current_order": CURRENT_ORDER, "past_orders": PAST_ORDERS}

    elif clean == "/api/subscriptions":
        return 200, SUBSCRIPTION_PLANS

    elif clean == "/api/account":
        # Return primary active user profile (without password)
        safe_user = dict(USERS[0])
        safe_user.pop("password", None)
        return 200, safe_user

    elif clean == "/api/logs":
        logs = get_recent_logs(30)
        return 200, {"logs": logs}

    return 404, {"error": "API route not found"}

def handle_api_post(path, body):
    """Dispatches POST requests to the appropriate service."""
    clean = path.split("?")[0].rstrip("/")

    # 1. POST /api/orders/pay (Pay button in Orders and Invoices)
    if clean == "/api/orders/pay":
        order_id = body.get("order_id", CURRENT_ORDER["order_number"])
        method = body.get("payment_method", "card")
        card_num = body.get("card_number", "4242")
        tip = body.get("tip_percent", 10)
        apply_credit = body.get("apply_crate_credit", False)

        result = process_order_payment(order_id, method, card_num, tip, apply_credit)
        return 200, result

    # 2. POST /api/orders/reorder
    elif clean == "/api/orders/reorder":
        past_id = body.get("past_order_id", "FF-78310")
        result = reorder_past_order(past_id)
        return 200, result

    # 3. POST /api/cart/update
    elif clean == "/api/cart/update":
        prod_id = body.get("product_id")
        qty = body.get("quantity", 1)
        result = update_cart_item(prod_id, qty)
        return 200, {"success": True, **result}

    # 4. POST /api/login (User authentication)
    elif clean == "/api/login":
        email = body.get("email", "")
        password = body.get("password", "")
        result = authenticate_user(email, password)
        status_code = 200 if result["success"] else 401
        return status_code, result

    return 404, {"error": "API route not found"}

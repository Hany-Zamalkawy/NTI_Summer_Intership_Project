"""
=============================================================================
🌿 FarmFlow - In-Memory Database & Data Store
=============================================================================
This file stores:
1. User accounts and Passwords (قاعدة بيانات المستخدمين وكلمات المرور)
2. Farm produce catalog (المنتجات العضوية والمزارع)
3. Subscription boxes (خطط الاشتراك)
4. Active & Historical Orders (الطلبات الحالية والسابقة)
=============================================================================
"""

# -----------------------------------------------------------------------------
# 1. USER ACCOUNTS & PASSWORDS (بيانات الدخول وكلمات المرور)
# -----------------------------------------------------------------------------
USERS = [
    {
        "id": "usr_7891",
        "name": "Sarah Jenkins",
        "email": "sarah.jenkins@farmflow.eco",
        "password": "farmflow2024",  # 🔑 Default member password
        "phone": "(555) 382-9410",
        "address": "104 Organic Way, Apt 3B",
        "city": "Green Valley, CA 95945",
        "member_id": "GV-4402",
        "member_since": "March 2023",
        "role": "member",
        "crate_deposit_balance": 6.00,
        "stats": {
            "produce_enjoyed_lbs": 38,
            "farms_supported": 4,
            "co2_saved_kg": 14.8,
            "orders_completed": 9
        }
    },
    {
        "id": "usr_admin",
        "name": "Admin Steward",
        "email": "admin@farmflow.eco",
        "password": "adminpassword123",  # 🔑 Administrator password
        "phone": "(555) 999-0000",
        "address": "1 Harvest Lane",
        "city": "Green Valley, CA 95945",
        "member_id": "ADM-001",
        "member_since": "January 2023",
        "role": "admin",
        "crate_deposit_balance": 50.00,
        "stats": {
            "produce_enjoyed_lbs": 150,
            "farms_supported": 8,
            "co2_saved_kg": 95.0,
            "orders_completed": 45
        }
    }
]

# -----------------------------------------------------------------------------
# 2. PRODUCE CATALOG (كتالوج الخضروات والفواكه العضوية)
# -----------------------------------------------------------------------------
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

# -----------------------------------------------------------------------------
# 3. SUBSCRIPTION BOX PLANS (خطط الاشتراكات)
# -----------------------------------------------------------------------------
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

# -----------------------------------------------------------------------------
# 4. SHOPPING BASKET (سلة التسوق الحالية)
# -----------------------------------------------------------------------------
USER_BASKET = {
    1: 1,  # 1 bunch of Romaine Lettuce ($4.50)
    5: 2   # 2 punnets of Strawberries ($12.00)
}

# -----------------------------------------------------------------------------
# 5. ACTIVE & PAST HARVEST ORDERS (الطلبات النشطة والسابقة)
# -----------------------------------------------------------------------------
CURRENT_ORDER = {
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
    "payment_status": "pending",  # Can be 'paid' or 'pending'
    "payment_method": "Visa ending in 4242",
    "paid_at": ""
}

PAST_ORDERS = [
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

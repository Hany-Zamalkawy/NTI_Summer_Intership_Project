"""
Python Basics - Reference Guide & Examples
"""

# ==========================================
# 1. VARIABLES & DATA TYPES
# ==========================================
# Python variables do not require explicit type declarations.
item_name = "Fresh Organic Apples"  # str (String)
unit_price = 3.50                   # float (Decimal number)
quantity = 4                        # int (Integer)
in_stock = True                     # bool (Boolean: True or False)

print(f"Item: {item_name}")
print(f"Total price: ${unit_price * quantity:.2f}")


# ==========================================
# 2. DATA STRUCTURES (LISTS & DICTIONARIES)
# ==========================================

# A List: an ordered collection that can be modified
basket = ["Apples", "Kale", "Carrots", "Strawberries"]
basket.append("Butterhead Lettuce")  # Adding an item
print(f"\nBasket items: {basket}")
print(f"First item: {basket[0]}")     # Indexing starts at 0

# A Dictionary: key-value pairs
farm_info = {
    "name": "Green Valley Farm",
    "organic": True,
    "distance_km": 12,
    "crops": ["Kale", "Carrots"]
}
print(f"Farm Name: {farm_info['name']}")


# ==========================================
# 3. CONDITIONALS (IF / ELIF / ELSE)
# ==========================================
order_total = unit_price * quantity

if order_total >= 25.0:
    shipping_cost = 0.0
    print("\nEligible for FREE shipping!")
elif order_total >= 10.0:
    shipping_cost = 2.99
    print(f"\nStandard shipping applied: ${shipping_cost}")
else:
    shipping_cost = 5.00
    print(f"\nSmall order shipping: ${shipping_cost}")


# ==========================================
# 4. LOOPS (FOR & WHILE)
# ==========================================

# For loop iterating through a list:
print("\n--- Daily Harvest Checklist ---")
for index, crop in enumerate(basket, start=1):
    print(f"{index}. Harvested: {crop}")

# While loop with a counter:
countdown = 3
print("\nCountdown to sunrise:")
while countdown > 0:
    print(f"Opening in {countdown}...")
    countdown -= 1
print("Market is open!")


# ==========================================
# 5. FUNCTIONS
# ==========================================
def calculate_final_invoice(subtotal: float, discount_percent: float = 0.0) -> float:
    """Calculates the total invoice amount after applying any discount."""
    discount_amount = subtotal * (discount_percent / 100)
    final_total = subtotal - discount_amount
    return round(final_total, 2)


if __name__ == "__main__":
    subtotal = 45.00
    discount = 10.0  # 10% off
    final_due = calculate_final_invoice(subtotal, discount)
    print(f"\nSubtotal: ${subtotal:.2f}")
    print(f"After {discount}% member discount: ${final_due:.2f}")

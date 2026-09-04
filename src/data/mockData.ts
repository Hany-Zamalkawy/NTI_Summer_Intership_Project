import { Product, SubscriptionPlan } from '../types';

export const VEGETABLE_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Crisp Romaine & Hydroponic Butterhead Lettuce",
    category: "vegetables",
    farm: "Mariout Greenhouses",
    distanceKm: 18,
    price: 4.50,
    unit: "bunch",
    badgeText: "Crisp: 5/5",
    badgeType: "crisp",
    harvestTime: "Picked 4 hrs ago",
    unitWeight: "1 bunch",
    imageUrl: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    name: "Bunched Heirloom Rainbow Carrots",
    category: "vegetables",
    farm: "Valley Roots Farm",
    distanceKm: 12,
    price: 3.75,
    unit: "bunch",
    badgeText: "Crisp: 4.8/5",
    badgeType: "crisp",
    harvestTime: "Picked 5 hrs ago",
    unitWeight: "1 bunch",
    imageUrl: "https://images.unsplash.com/photo-1590868309235-ea34bed7bd7f?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    name: "Vine-Ripened Beefsteak & Cherry Tomatoes",
    category: "vegetables",
    farm: "Sunny Patch",
    distanceKm: 5,
    price: 5.20,
    unit: "basket",
    badgeText: "Juicy: 5/5",
    badgeType: "juicy",
    harvestTime: "Picked 6 hrs ago",
    unitWeight: "1.5 kg",
    imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    name: "Crisp Bell Peppers (Mixed Colors)",
    category: "vegetables",
    farm: "River Valley Veg",
    distanceKm: 22,
    price: 4.00,
    unit: "3-pack",
    badgeText: "Crisp: 4.9/5",
    badgeType: "crisp",
    harvestTime: "Picked 3 hrs ago",
    unitWeight: "3 pack",
    imageUrl: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 8,
    name: "Organic Curly Kale",
    category: "vegetables",
    farm: "Green Valley Co-op",
    distanceKm: 9,
    price: 4.00,
    unit: "bunch",
    badgeText: "USDA Organic",
    badgeType: "organic",
    harvestTime: "Picked 2 hrs ago",
    unitWeight: "1 bunch",
    imageUrl: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80"
  }
];

export const FRUIT_PRODUCTS: Product[] = [
  {
    id: 5,
    name: "Sweet Strawberries & Wild Blackberries",
    category: "fruits",
    farm: "Berry Creek Farm",
    distanceKm: 15,
    price: 6.00,
    unit: "punnet",
    badgeText: "Sweet: 4.8/5",
    badgeType: "sweet",
    harvestTime: "Picked 4 hrs ago",
    unitWeight: "1 punnet",
    imageUrl: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: 6,
    name: "Sweet Valencia & Navel Oranges",
    category: "fruits",
    farm: "Citrus Grove",
    distanceKm: 35,
    price: 6.50,
    unit: "bag",
    badgeText: "Sweet: 4.5/5",
    badgeType: "sweet",
    harvestTime: "Picked yesterday",
    unitWeight: "3 lb bag",
    imageUrl: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 7,
    name: "Crisp Gala & Honeycrisp Apples",
    category: "fruits",
    farm: "Orchard Hill",
    distanceKm: 28,
    price: 5.00,
    unit: "lb",
    badgeText: "Crisp: 5/5",
    badgeType: "crisp",
    harvestTime: "Picked 8 hrs ago",
    unitWeight: "1 lb",
    imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 9,
    name: "Wild Blueberries",
    category: "fruits",
    farm: "Sunrise Orchards",
    distanceKm: 20,
    price: 6.50,
    unit: "pt",
    badgeText: "Picked 12 hrs ago",
    badgeType: "sweet",
    harvestTime: "Picked 12 hrs ago",
    unitWeight: "1 pt",
    imageUrl: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=800&q=80"
  }
];

export const PAIRING_PRODUCTS: Product[] = [
  {
    id: 10,
    name: "Fresh Mint",
    category: "pantry",
    farm: "Meadow Herb Farm",
    distanceKm: 8,
    price: 2.50,
    unit: "bunch",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAt01XJZRxNsypdNWvQ_GZ2PdzDWOU3qXb_SX6EMaYP-F3R1jkLL3_Dqwf-lIrtEVJ87GEhhxqOtfKyHPLAHiztiFj6WgEX5tXUBBYfXkdBbiNOxHWaEjnwO3hL3-QvcC8LkpFSHdkfmVNTFuVtH_lrcOeUC8OEy3FavIrZxkH2ogA1v0DTEbnJcRnMx6VE1lE4Bi4ZVnxzkcypuU5jUDl213jid7RuiqedcD6XY_kjTi4HW1XKQwIl"
  },
  {
    id: 11,
    name: "Local Honey",
    category: "pantry",
    farm: "Valley Apiaries",
    distanceKm: 14,
    price: 8.00,
    unit: "jar",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBkoPSIUoI6kwbFdDv2s8z9ptv8VVtB4ab5CLJ9Bt8LajK68V27plW3I9sqAnVfMyRwMjlFwpnbcg4k4SI78msHgYbnDBO_OReL2WOoSHpZLivKbP0sxaE8KqNPWDL3XyoxEuk_NUHk_gMHPhzIrT6HvKvlcwT-7u11mkYT_ldifbJfyNe2iOS5GX1HFqBuX3px9O7_rCC7hzf_xRWUy0PN8W3eDe56S2IF2Qr32R_sufW40Ug1qwyU"
  },
  {
    id: 12,
    name: "Sourdough",
    category: "pantry",
    farm: "Hearth & Stone Bakery",
    distanceKm: 6,
    price: 6.50,
    unit: "loaf",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfS8Ucpoqm0f2cL-xt6S1LA_WzUiFcMo0Q8yFhEhj48pwoIUcXSuy9oJWWBkG6pnFcpmPoA9o29PCLBbd-TzogfbnRJXL8C8Jr4q3f1rwuK-US4hsn2Qzq97LFS4SYWqtghFfue7yoy3A4Q-G24ZE9Yb_3YaOTVdknae7JPG_ZPIS5KHGNegOueSym9Ot0rUwJzWhUD_Kol9Tpzhk9ptIMzmzt2b0LRw5dOUmpxKf5nGnEXZhFXr-y"
  }
];

export const ALL_PRODUCTS = [...VEGETABLE_PRODUCTS, ...FRUIT_PRODUCTS, ...PAIRING_PRODUCTS];

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "solo",
    name: "The Solo Sprout",
    description: "Perfect for 1–2 people. A curated selection of seasonal greens and roots.",
    priceWeekly: 25,
    priceMonthly: 85,
    features: [
      "5–7 varieties of seasonal vegetables",
      "Weekly recipe cards",
      "Flexible pause or cancel anytime"
    ]
  },
  {
    id: "family",
    name: "The Family Harvest",
    description: "Abundant vegetables, fresh eggs, and artisan dairy for the whole family.",
    priceWeekly: 45,
    priceMonthly: 153,
    isPopular: true,
    badge: "Best Value",
    features: [
      "8–10 varieties of seasonal vegetables",
      "1 Dozen Pasture-Raised Eggs",
      "Choice of artisan milk or cheese",
      "Fully customizable box contents"
    ]
  },
  {
    id: "artisan",
    name: "The Artisan Pantry",
    description: "Premium heirloom produce paired with local oils, honey, and preserves.",
    priceWeekly: 75,
    priceMonthly: 255,
    features: [
      "Premium selection of heirloom produce",
      "Rotating artisanal pantry items (Oils, Honey)",
      "Priority sunrise dispatch delivery",
      "Exclusive farm event invitations"
    ]
  }
];

export const INITIAL_CART_ITEMS = [
  {
    product: VEGETABLE_PRODUCTS[0], // Crisp Romaine
    quantity: 1
  },
  {
    product: FRUIT_PRODUCTS[0], // Strawberries & Blackberries
    quantity: 2
  }
];

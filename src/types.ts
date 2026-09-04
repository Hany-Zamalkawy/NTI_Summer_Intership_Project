export interface Product {
  id: number;
  name: string;
  category: 'vegetables' | 'fruits' | 'pantry';
  farm: string;
  distanceKm: number;
  price: number;
  unit: string;
  badgeText?: string;
  badgeType?: 'crisp' | 'juicy' | 'sweet' | 'organic';
  imageUrl: string;
  harvestTime?: string;
  unitWeight?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  priceWeekly: number;
  priceMonthly: number;
  features: string[];
  isPopular?: boolean;
  badge?: string;
}

export interface OrderConfirmation {
  orderNumber: string;
  date: string;
  deliveryWindow: string;
  status: string;
  items: {
    name: string;
    origin: string;
    unitWeight: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  deliveryFee: number;
  ecoPackagingOffset: number;
  crateFee: number;
  farmerTip: number;
  totalPaid: number;
  cardLast4: string;
  farmsSupported: number;
  emissionsSavedKg: number;
}

export type ActiveScreen = 'marketplace' | 'subscriptions' | 'invoice' | 'orders' | 'account' | 'login';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  aptOrSuite?: string;
  city: string;
  state: string;
  zipCode: string;
  memberSince: string;
  memberId: string;
  preferredDeliveryWindow: string;
  avatarUrl: string;
  stats: {
    produceEnjoyedLbs: number;
    farmsSupported: number;
    co2SavedKg: number;
    ordersCompleted: number;
  };
  preferences: {
    organicOnly: boolean;
    smsAlerts: boolean;
    pushNotifications: boolean;
    reusableCrateProgram: boolean;
  };
}

export interface SeasonalItem {
  name: string;
  category: 'vegetables' | 'fruits';
  status: 'peak' | 'starting' | 'ending';
  flavorNote: string;
  farm: string;
  icon: string;
  productId?: number;
}

export interface MonthlyHarvestInfo {
  monthIndex: number;
  monthName: string;
  season: string;
  headline: string;
  soilCondition: string;
  harvestTip: string;
  items: SeasonalItem[];
}

export interface RecipeIngredient {
  name: string;
  amount: string;
  productId?: number;
  isVegetable?: boolean;
}

export interface SeasonalRecipe {
  id: string;
  title: string;
  description: string;
  prepTime: string;
  cookTime: string;
  servings: string;
  difficulty: 'Easy' | 'Simple' | 'Medium';
  category: 'Salad' | 'Warm & Roasted' | 'Quick & Fresh' | 'Skillet';
  seasonalHighlight: string;
  primaryVegetables: string[];
  requiredProductIds: number[];
  ingredients: RecipeIngredient[];
  instructions: string[];
  chefTip: string;
  imageUrl: string;
  caloriesApprox?: number;
}



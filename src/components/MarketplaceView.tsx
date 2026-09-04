import React, { useState, useEffect } from 'react';
import { Product, ActiveScreen } from '../types';
import { VEGETABLE_PRODUCTS, FRUIT_PRODUCTS } from '../data/mockData';
import { SeasonalRecipeSuggestions } from './SeasonalRecipeSuggestions';
import { AboutUsBranch } from './AboutUsBranch';

interface MarketplaceViewProps {
  cart: { [productId: number]: number };
  onUpdateQuantity: (product: Product, newQty: number) => void;
  onAddCustomCrate: (crateName: string, items: string[], price: number) => void;
  activeCategoryBranch?: string;
  onSelectCategoryBranch?: (branch: string) => void;
  onNavigate?: (screen: ActiveScreen) => void;
}

export const HARVEST_BRANCHES = [
  {
    id: 'Seasonal',
    label: 'Seasonal',
    icon: 'nest_eco_leaf',
    desc: 'Produce currently at peak seasonal flavor and nutrition',
  },
  {
    id: 'New Arrivals',
    label: 'New Arrivals',
    icon: 'bolt',
    desc: 'Freshly harvested crops picked in this morning\'s batches',
  },
  {
    id: 'Best Sellers',
    label: 'Best Sellers',
    icon: 'star',
    desc: 'Most-requested farm staples by our local community',
  },
  {
    id: 'All Fresh Harvest',
    label: 'All Fresh Harvest',
    icon: 'inventory_2',
    desc: 'Complete seasonal catalog of fruits and vegetables',
  },
  {
    id: 'Organic Leafy Greens & Roots',
    label: 'Organic Leafy Greens & Roots',
    icon: 'eco',
    desc: 'Hydroponic butterhead, crisp romaine, rainbow carrots, and curly kale',
  },
  {
    id: 'Heirloom & Greenhouse Vegetables',
    label: 'Heirloom & Greenhouse Vegetables',
    icon: 'potted_plant',
    desc: 'Vine-ripened beefsteaks, rainbow bell peppers, and protected greenhouse greens',
  },
  {
    id: 'Citrus & Sun-Ripened Fruits',
    label: 'Citrus & Sun-Ripened Fruits',
    icon: 'wb_sunny',
    desc: 'Sun-drenched Valencia oranges and crisp Honeycrisp apples',
  },
  {
    id: 'Orchard Berries & Stone Fruits',
    label: 'Orchard Berries & Stone Fruits',
    icon: 'nutrition',
    desc: 'Sweet strawberries, wild blackberries, and organic hand-picked blueberries',
  },
  {
    id: 'Your Account',
    label: 'Your Account',
    icon: 'person',
    desc: 'Member profile, soil stewardship impact metrics, and delivery preferences',
  },
  {
    id: 'Sign In or Log In',
    label: 'Sign In or Log In',
    icon: 'login',
    desc: 'Access your harvest schedule, push alerts, and member crate deposit',
  },
  {
    id: 'About Us',
    label: 'About Us',
    icon: 'nature_people',
    desc: 'Clean, nutrient-rich produce through sustainable, soil-first practices and radical transparency',
  },
];

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  cart,
  onUpdateQuantity,
  onAddCustomCrate,
  activeCategoryBranch = 'Seasonal',
  onSelectCategoryBranch,
  onNavigate,
}) => {
  // Filter state synced with parent branch if provided
  const [activeFilter, setActiveFilter] = useState<string>(activeCategoryBranch);

  useEffect(() => {
    if (activeCategoryBranch) {
      setActiveFilter(activeCategoryBranch);
    }
  }, [activeCategoryBranch]);

  const handleBranchChange = (branchId: string) => {
    setActiveFilter(branchId);
    if (onSelectCategoryBranch) {
      onSelectCategoryBranch(branchId);
    }
    if (branchId === 'Your Account') {
      if (onNavigate) onNavigate('account');
      return;
    }
    if (branchId === 'Sign In or Log In') {
      if (onNavigate) onNavigate('login');
      return;
    }
    if (branchId === 'About Us') {
      setTimeout(() => {
        const el = document.getElementById('about-us-branch');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  // Custom crate builder selections
  const [selectedVegs, setSelectedVegs] = useState<string[]>([
    'Crisp Romaine Lettuce'
  ]);
  const [selectedFruits, setSelectedFruits] = useState<string[]>([
    'Sweet Strawberries'
  ]);
  const [crateAddedAlert, setCrateAddedAlert] = useState(false);

  // Helper to toggle custom crate items
  const toggleVeg = (name: string) => {
    if (selectedVegs.includes(name)) {
      setSelectedVegs(selectedVegs.filter((item) => item !== name));
    } else {
      if (selectedVegs.length < 5) {
        setSelectedVegs([...selectedVegs, name]);
      }
    }
  };

  const toggleFruit = (name: string) => {
    if (selectedFruits.includes(name)) {
      setSelectedFruits(selectedFruits.filter((item) => item !== name));
    } else {
      if (selectedFruits.length < 3) {
        setSelectedFruits([...selectedFruits, name]);
      }
    }
  };

  // Crate dynamic calculations
  const crateItemsCount = selectedVegs.length + selectedFruits.length;
  const estimatedWeightLbs = (crateItemsCount * 1.6).toFixed(1);
  const crateBasePrice = 12.00 + (selectedVegs.length * 3.25) + (selectedFruits.length * 3.25);

  const handleAddCrate = () => {
    const allSelected = [...selectedVegs, ...selectedFruits];
    if (allSelected.length === 0) return;
    onAddCustomCrate('Custom Harvest Crate', allSelected, crateBasePrice);
    setCrateAddedAlert(true);
    setTimeout(() => setCrateAddedAlert(false), 3000);
  };

  // Branch filtering logic for Vegetables and Fruits
  const getFilteredVegetables = (): Product[] => {
    switch (activeFilter) {
      case 'Seasonal':
        return VEGETABLE_PRODUCTS.filter((v) => [1, 2, 3, 4].includes(v.id));
      case 'New Arrivals':
        return VEGETABLE_PRODUCTS.filter((v) => [8, 4, 1].includes(v.id));
      case 'Best Sellers':
        return VEGETABLE_PRODUCTS.filter((v) => [1, 3].includes(v.id));
      case 'All Fresh Harvest':
        return VEGETABLE_PRODUCTS;
      case 'Organic Leafy Greens & Roots':
        return VEGETABLE_PRODUCTS.filter((v) => [1, 2, 8].includes(v.id));
      case 'Heirloom & Greenhouse Vegetables':
        return VEGETABLE_PRODUCTS.filter((v) => [3, 4, 1].includes(v.id));
      case 'Citrus & Sun-Ripened Fruits':
      case 'Orchard Berries & Stone Fruits':
        return [];
      default:
        return VEGETABLE_PRODUCTS;
    }
  };

  const getFilteredFruits = (): Product[] => {
    switch (activeFilter) {
      case 'Seasonal':
        return FRUIT_PRODUCTS.filter((f) => [5, 7].includes(f.id));
      case 'New Arrivals':
        return FRUIT_PRODUCTS.filter((f) => [5, 9].includes(f.id));
      case 'Best Sellers':
        return FRUIT_PRODUCTS.filter((f) => [5, 6, 7].includes(f.id));
      case 'All Fresh Harvest':
        return FRUIT_PRODUCTS;
      case 'Citrus & Sun-Ripened Fruits':
        return FRUIT_PRODUCTS.filter((f) => [6, 7].includes(f.id));
      case 'Orchard Berries & Stone Fruits':
        return FRUIT_PRODUCTS.filter((f) => [5, 9].includes(f.id));
      case 'Organic Leafy Greens & Roots':
      case 'Heirloom & Greenhouse Vegetables':
        return [];
      default:
        return FRUIT_PRODUCTS;
    }
  };

  const filteredVegetables = getFilteredVegetables();
  const filteredFruits = getFilteredFruits();
  const currentBranchMeta = HARVEST_BRANCHES.find((b) => b.id === activeFilter) || HARVEST_BRANCHES[0];

  return (
    <div id="marketplace-screen" className="space-y-16 pb-20">
      {/* 1. Hero Section */}
      <section
        id="hero-banner"
        className="relative rounded-[32px] overflow-hidden min-h-[420px] flex items-end ambient-shadow group"
      >
        <div className="absolute inset-0 bg-[#012d1d]/20">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1600&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        </div>

        <div className="relative z-10 p-8 md:p-12 w-full max-w-4xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1 px-4 py-1.5 bg-[#92f7c3]/95 backdrop-blur-sm text-[#002113] text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
              <span className="material-symbols-outlined text-sm">wb_sunny</span>
              Sunrise Harvest Catalog
            </span>
            <span className="hidden sm:inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-medium rounded-full">
              Harvested Daily at Dawn
            </span>
          </div>

          <h1 className="font-serif-display text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-md leading-tight">
            Today's Sunrise Harvest:<br />
            Seasonal Vegetables &amp; Tree-Ripened Fruits
          </h1>
          <p className="text-base md:text-lg text-[#f3f4f5] max-w-2xl opacity-90 leading-relaxed">
            Picked at peak ripeness before dawn from our verified regenerative regional farms. Direct cold-chain delivery within 24 hours of harvest.
          </p>
        </div>
      </section>

      {/* 2. Filter Branches (8 User Requested Branches) */}
      <section id="category-filter-pills" className="w-full -mt-8 space-y-4">
        {/* Horizontal Scrolling Branch Pills */}
        <div className="overflow-x-auto custom-scrollbar pb-2">
          <div className="flex gap-2.5 min-w-max px-1">
            {HARVEST_BRANCHES.map((branch) => {
              const isSelected = activeFilter === branch.id;
              return (
                <button
                  key={branch.id}
                  id={`branch-btn-${branch.id.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                  onClick={() => handleBranchChange(branch.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer shadow-xs ${
                    isSelected
                      ? 'bg-[#012d1d] text-[#92f7c3] ring-2 ring-[#006c48] shadow-md -translate-y-0.5'
                      : 'bg-white text-[#414844] border border-[#c1c8c2]/40 hover:bg-[#f3f4f5] hover:text-[#012d1d]'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">
                    {branch.icon}
                  </span>
                  <span>{branch.label}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#92f7c3] ml-0.5"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Branch Status Bar */}
        <div
          id="active-branch-indicator"
          className="bg-white rounded-2xl p-4 md:px-6 border border-[#c1c8c2]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#92f7c3]/30 text-[#006c48] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">{currentBranchMeta.icon}</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#006c48] bg-[#006c48]/10 px-2.5 py-0.5 rounded-full">
                  Branch is ON
                </span>
                <span className="font-serif-display font-bold text-[#012d1d] text-base md:text-lg">
                  {currentBranchMeta.label}
                </span>
              </div>
              <p className="text-xs text-[#414844] mt-0.5">
                {currentBranchMeta.desc} • Showing {filteredVegetables.length} vegetables &amp; {filteredFruits.length} fruits
              </p>
            </div>
          </div>

          {activeFilter !== 'All Fresh Harvest' && (
            <button
              onClick={() => handleBranchChange('All Fresh Harvest')}
              className="text-xs font-bold text-[#006c48] hover:text-[#012d1d] flex items-center gap-1 self-end sm:self-center cursor-pointer px-3 py-1.5 rounded-full hover:bg-[#f3f4f5] transition-colors"
            >
              <span>View All Branches</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          )}
        </div>
      </section>

      {/* 3. Fresh Vegetables Section (Filtered by Branch) */}
      {filteredVegetables.length > 0 && (
        <section id="fresh-vegetables-section">
          <div className="flex justify-between items-end mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-serif-display text-3xl font-bold text-[#012d1d]">
                  Fresh Vegetables
                </h2>
                <span className="text-xs font-bold px-2.5 py-0.5 bg-[#006c48]/10 text-[#006c48] rounded-full">
                  {filteredVegetables.length} available
                </span>
              </div>
              <p className="text-[#414844] text-sm md:text-base">
                Picked this morning for maximum crispness &amp; soil-born sweetness.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredVegetables.map((veg) => {
              const currentQty = cart[veg.id] || 0;
              return (
                <article
                  key={veg.id}
                  id={`veg-card-${veg.id}`}
                  className="bg-[#ffffff] rounded-2xl overflow-hidden border border-[#c1c8c2]/30 hover-lift ambient-shadow flex flex-col relative"
                >
                  {/* Image Container with Badge and Controls */}
                  <div className="h-48 relative overflow-hidden group">
                    <img
                      alt={veg.name}
                      src={veg.imageUrl}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Quality Badge */}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs rounded-full px-2.5 py-1 flex items-center gap-1 shadow-xs border border-[#c1c8c2]/20">
                      <span
                        className={`material-symbols-outlined text-sm ${
                          veg.badgeType === 'juicy' ? 'text-[#6d230f]' : 'text-[#006c48]'
                        }`}
                      >
                        {veg.badgeType === 'juicy' ? 'water_drop' : 'eco'}
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          veg.badgeType === 'juicy' ? 'text-[#6d230f]' : 'text-[#006c48]'
                        }`}
                      >
                        {veg.badgeText}
                      </span>
                    </div>

                    {/* Harvest timing badge */}
                    <div className="absolute top-3 left-3 bg-[#012d1d]/85 text-white backdrop-blur-xs rounded-full px-2.5 py-1 text-[10px] font-semibold">
                      {veg.harvestTime}
                    </div>

                    {/* Quantity Incrementer overlaid bottom-right */}
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs rounded-full flex shadow-sm overflow-hidden border border-[#c1c8c2]/30">
                      <button
                        onClick={() => onUpdateQuantity(veg, Math.max(0, currentQty - 1))}
                        aria-label={`Decrease ${veg.name}`}
                        className="w-8 h-8 flex items-center justify-center text-[#012d1d] hover:bg-[#f3f4f5] transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">remove</span>
                      </button>
                      <span className="w-8 flex items-center justify-center text-sm font-semibold border-x border-[#c1c8c2]/30 text-[#012d1d]">
                        {currentQty}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(veg, currentQty + 1)}
                        aria-label={`Increase ${veg.name}`}
                        className="w-8 h-8 flex items-center justify-center text-[#012d1d] hover:bg-[#f3f4f5] transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-serif-display text-lg font-bold text-[#191c1d] mb-1 line-clamp-2">
                      {veg.name}
                    </h3>
                    <div className="flex items-center gap-1 text-[#414844] mb-4 text-xs">
                      <span className="material-symbols-outlined text-sm text-[#006c48]">location_on</span>
                      <span>{veg.farm} - {veg.distanceKm} km away</span>
                    </div>

                    <div className="mt-auto flex justify-between items-center pt-3 border-t border-[#c1c8c2]/20">
                      <span className="font-serif-display text-xl font-bold text-[#012d1d]">
                        ${veg.price.toFixed(2)}{' '}
                        <span className="text-xs text-[#414844] font-normal">
                          / {veg.unit}
                        </span>
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. Orchard-Fresh Fruits Section (Filtered by Branch) */}
      {filteredFruits.length > 0 && (
        <section id="orchard-fresh-fruits-section" className="pt-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-serif-display text-3xl font-bold text-[#012d1d]">
                  Orchard-Fresh Fruits
                </h2>
                <span className="text-xs font-bold px-2.5 py-0.5 bg-[#6d230f]/10 text-[#6d230f] rounded-full">
                  {filteredFruits.length} available
                </span>
              </div>
              <p className="text-[#414844] text-sm md:text-base">
                Tree-ripened and hand-picked for perfect natural sweetness.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Featured Wide Banner (Sweet Strawberries & Wild Blackberries) - shown when present in filtered fruits */}
            {filteredFruits.some((f) => f.id === 5) && (
              <article
                id="featured-fruit-banner"
                className="col-span-1 md:col-span-2 lg:col-span-2 rounded-2xl overflow-hidden border border-[#c1c8c2]/30 hover-lift ambient-shadow relative min-h-[300px] flex items-end group"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=1200&q=80')`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />

                <div className="relative z-10 p-6 md:p-8 w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-block px-3 py-1 bg-[#6d230f] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-xs">
                        Rich in Antioxidants
                      </span>
                      <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-medium rounded-full">
                        Berry Creek Farm
                      </span>
                    </div>
                    <h3 className="font-serif-display text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                      Sweet Strawberries &amp; Wild Blackberries
                    </h3>
                    <p className="text-sm md:text-base text-[#f3f4f5] max-w-md opacity-90">
                      100% Plastic-Free Compostable Cardboard Punnet. Harvested just hours ago with vibrant natural aroma.
                    </p>
                  </div>

                  {/* Quantity Box */}
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 flex flex-col items-center gap-3 shrink-0 shadow-lg border border-white/50">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#6d230f] text-sm">favorite</span>
                      <span className="font-bold text-xs text-[#6d230f]">Sweet: 4.8/5</span>
                    </div>
                    <div className="flex items-center shadow-xs rounded-full overflow-hidden border border-[#c1c8c2]/30 bg-white">
                      <button
                        onClick={() =>
                          onUpdateQuantity(
                            FRUIT_PRODUCTS[0],
                            Math.max(0, (cart[FRUIT_PRODUCTS[0].id] || 0) - 1)
                          )
                        }
                        className="w-9 h-9 flex items-center justify-center text-[#012d1d] hover:bg-[#f3f4f5] transition-colors cursor-pointer"
                        aria-label="Decrease Strawberries"
                      >
                        <span className="material-symbols-outlined text-sm">remove</span>
                      </button>
                      <span className="w-9 flex items-center justify-center font-bold text-sm text-[#012d1d] border-x border-[#c1c8c2]/30">
                        {cart[FRUIT_PRODUCTS[0].id] || 0}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(
                            FRUIT_PRODUCTS[0],
                            (cart[FRUIT_PRODUCTS[0].id] || 0) + 1
                          )
                        }
                        className="w-9 h-9 flex items-center justify-center text-[#012d1d] hover:bg-[#f3f4f5] transition-colors cursor-pointer"
                        aria-label="Increase Strawberries"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                      </button>
                    </div>
                    <div className="font-serif-display text-sm font-bold text-[#012d1d]">
                      ${FRUIT_PRODUCTS[0].price.toFixed(2)} / {FRUIT_PRODUCTS[0].unit}
                    </div>
                  </div>
                </div>
              </article>
            )}

            {/* Other Fruit Cards in filtered fruits */}
            {filteredFruits
              .filter((f) => f.id !== 5 || !filteredFruits.some((item) => item.id === 5))
              .map((fruit) => {
                const currentQty = cart[fruit.id] || 0;
                return (
                  <article
                    key={fruit.id}
                    id={`fruit-card-${fruit.id}`}
                    className="bg-[#ffffff] rounded-2xl overflow-hidden border border-[#c1c8c2]/30 hover-lift ambient-shadow flex flex-col relative"
                  >
                    <div className="h-48 relative overflow-hidden group">
                      <img
                        alt={fruit.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={fruit.imageUrl}
                      />
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs rounded-full px-2.5 py-1 flex items-center gap-1 shadow-xs border border-[#c1c8c2]/20">
                        <span className="material-symbols-outlined text-xs text-[#6d230f]">favorite</span>
                        <span className="text-xs font-bold text-[#6d230f]">{fruit.badgeText}</span>
                      </div>
                      <div className="absolute top-3 right-3 bg-[#012d1d]/85 text-white backdrop-blur-xs rounded-full px-2.5 py-1 text-[10px] font-semibold">
                        {fruit.harvestTime}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="font-serif-display text-lg font-bold text-[#191c1d] mb-1">
                        {fruit.name}
                      </h3>
                      <div className="flex items-center gap-1 text-[#414844] mb-4 text-xs">
                        <span className="material-symbols-outlined text-sm text-[#006c48]">location_on</span>
                        <span>{fruit.farm} - {fruit.distanceKm} km away</span>
                      </div>

                      <div className="mt-auto flex justify-between items-center pt-3 border-t border-[#c1c8c2]/20">
                        <span className="font-serif-display text-xl font-bold text-[#012d1d]">
                          ${fruit.price.toFixed(2)}{' '}
                          <span className="text-xs text-[#414844] font-normal">/ {fruit.unit}</span>
                        </span>
                        <div className="flex items-center gap-1 bg-[#f3f4f5] rounded-full border border-[#c1c8c2]/30 overflow-hidden">
                          <button
                            onClick={() =>
                              onUpdateQuantity(fruit, Math.max(0, currentQty - 1))
                            }
                            className="w-8 h-8 flex items-center justify-center text-[#012d1d] hover:bg-[#e1e3e4] cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-sm">remove</span>
                          </button>
                          <span className="w-7 text-center font-bold text-xs text-[#012d1d]">
                            {currentQty}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(fruit, currentQty + 1)}
                            className="w-8 h-8 flex items-center justify-center bg-[#1b4332] text-white hover:bg-[#012d1d] cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-sm">add</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
          </div>
        </section>
      )}

      {/* 5. Seasonal Recipe Suggestions Section */}
      <SeasonalRecipeSuggestions
        cart={cart}
        onUpdateQuantity={onUpdateQuantity}
      />

      {/* 6. Build Your Custom Harvest Crate Section */}
      <section
        id="custom-crate-builder"
        className="mt-16 bg-[#f3f4f5] rounded-[32px] p-8 md:p-12 border border-[#c1c8c2]/20 ambient-shadow"
      >
        <div className="text-center mb-10">
          <h2 className="font-serif-display text-3xl md:text-4xl font-bold text-[#012d1d] mb-3">
            Build Your Custom Harvest Crate
          </h2>
          <p className="text-[#414844] text-base md:text-lg max-w-2xl mx-auto">
            Select exactly what you need for the week. Fresh, local, and customized to your taste.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Selector Lists */}
          <div className="space-y-6">
            {/* Vegetables Checkbox Group */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif-display text-xl font-bold text-[#191c1d]">
                  Vegetables
                </h3>
                <span className="text-xs font-semibold text-[#414844] bg-white px-3 py-1 rounded-full border border-[#c1c8c2]/30 shadow-2xs">
                  Selected {selectedVegs.length} of 5
                </span>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Crisp Romaine Lettuce', farm: 'Mariout Greenhouses' },
                  { name: 'Heirloom Rainbow Carrots', farm: 'Valley Roots Farm' },
                  { name: 'Fresh Field Spinach', farm: 'Green Acres' },
                ].map((item) => {
                  const isChecked = selectedVegs.includes(item.name);
                  return (
                    <label
                      key={item.name}
                      onClick={() => toggleVeg(item.name)}
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                        isChecked
                          ? 'bg-white border-[#006c48] shadow-xs'
                          : 'bg-[#f8f9fa] border-[#c1c8c2]/30 hover:bg-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="w-5 h-5 rounded text-[#012d1d] focus:ring-[#006c48] border-[#c1c8c2]"
                      />
                      <div className="flex-1">
                        <div className="font-bold text-[#191c1d] text-sm md:text-base">
                          {item.name}
                        </div>
                        <div className="text-xs text-[#414844]">{item.farm}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Fruits Checkbox Group */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif-display text-xl font-bold text-[#191c1d]">
                  Fruits
                </h3>
                <span className="text-xs font-semibold text-[#414844] bg-white px-3 py-1 rounded-full border border-[#c1c8c2]/30 shadow-2xs">
                  Selected {selectedFruits.length} of 3
                </span>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Sweet Strawberries', farm: 'Berry Creek Farm' },
                  { name: 'Gala Apples', farm: 'Orchard Hill' },
                ].map((item) => {
                  const isChecked = selectedFruits.includes(item.name);
                  return (
                    <label
                      key={item.name}
                      onClick={() => toggleFruit(item.name)}
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                        isChecked
                          ? 'bg-white border-[#006c48] shadow-xs'
                          : 'bg-[#f8f9fa] border-[#c1c8c2]/30 hover:bg-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="w-5 h-5 rounded text-[#012d1d] focus:ring-[#006c48] border-[#c1c8c2]"
                      />
                      <div className="flex-1">
                        <div className="font-bold text-[#191c1d] text-sm md:text-base">
                          {item.name}
                        </div>
                        <div className="text-xs text-[#414844]">{item.farm}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Basket Preview Box */}
          <div className="bg-white rounded-2xl p-8 border border-[#c1c8c2]/30 shadow-sm flex flex-col items-center justify-center min-h-[420px]">
            <div className="relative w-64 h-56 mb-6 flex items-center justify-center">
              {/* Graphic crate */}
              <div className="absolute inset-0 bg-[#92f7c3]/15 rounded-[32px] border-3 border-[#006c48]/30 border-dashed animate-pulse" />
              
              <div className="relative z-10 flex flex-col items-center">
                <span className="material-symbols-outlined text-6xl text-[#006c48] mb-2">
                  shopping_basket
                </span>
                <span className="text-xs font-bold text-[#006c48] uppercase tracking-wider">
                  Farm Crate Active
                </span>
                <div className="flex flex-wrap gap-1.5 justify-center mt-3 max-w-[200px]">
                  {[...selectedVegs, ...selectedFruits].map((name) => (
                    <span
                      key={name}
                      className="px-2 py-0.5 bg-[#c1ecd4] text-[#002114] text-[11px] font-semibold rounded-full shadow-2xs"
                    >
                      {name.split(' ')[0]}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full bg-[#f8f9fa] rounded-xl p-6 border border-[#c1c8c2]/30 text-center">
              <div className="text-sm text-[#414844] mb-2">
                Estimated Total Weight:{' '}
                <span className="font-bold text-[#191c1d]">{estimatedWeightLbs} lbs</span>
              </div>
              <div className="font-serif-display text-4xl font-bold text-[#012d1d] mb-2">
                ${crateBasePrice.toFixed(2)}
              </div>
              <div className="text-xs font-semibold text-[#006c48] bg-[#92f7c3]/40 inline-block px-3 py-1 rounded-full mb-4">
                Saves ~$6 compared to supermarket prices
              </div>

              {crateAddedAlert && (
                <div className="mb-3 p-2 bg-[#92f7c3]/30 text-[#005235] text-xs font-bold rounded-lg border border-[#006c48]/20">
                  ✓ Added custom harvest crate to your basket!
                </div>
              )}

              <button
                id="add-crate-to-order-btn"
                onClick={handleAddCrate}
                className="w-full bg-[#012d1d] text-white py-3.5 rounded-full font-bold hover:bg-[#1b4332] transition-colors cursor-pointer shadow-sm"
              >
                Add Crate to Order
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Branch About Us Section */}
      <AboutUsBranch />
    </div>
  );
};

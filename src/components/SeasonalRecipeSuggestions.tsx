import React, { useState, useMemo } from 'react';
import { Product, SeasonalRecipe } from '../types';
import { SEASONAL_RECIPES } from '../data/recipes';
import { VEGETABLE_PRODUCTS, FRUIT_PRODUCTS } from '../data/mockData';

interface SeasonalRecipeSuggestionsProps {
  cart: { [productId: number]: number };
  onUpdateQuantity: (product: Product, newQty: number) => void;
}

export const SeasonalRecipeSuggestions: React.FC<SeasonalRecipeSuggestionsProps> = ({
  cart,
  onUpdateQuantity,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeRecipeModal, setActiveRecipeModal] = useState<SeasonalRecipe | null>(null);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);
  const [pantryChecked, setPantryChecked] = useState<{ [key: string]: boolean }>({});

  // Combine all catalog products for easy lookup
  const allProducts = useMemo(() => {
    return [...VEGETABLE_PRODUCTS, ...FRUIT_PRODUCTS];
  }, []);

  const getProductById = (id: number): Product | undefined => {
    return allProducts.find((p) => p.id === id);
  };

  // Identify which seasonal vegetables & produce are currently in the cart
  const cartVegetableItems = useMemo(() => {
    return VEGETABLE_PRODUCTS.filter((veg) => (cart[veg.id] || 0) > 0);
  }, [cart]);

  // Compute matched score and missing produce for each recipe
  const scoredRecipes = useMemo(() => {
    return SEASONAL_RECIPES.map((recipe) => {
      const required = recipe.requiredProductIds;
      const matched = required.filter((id) => (cart[id] || 0) > 0);
      const missing = required.filter((id) => !(cart[id] || 0));
      const readinessPercent = Math.round((matched.length / required.length) * 100);
      const isReadyToCook = missing.length === 0;

      return {
        ...recipe,
        matchedProductIds: matched,
        missingProductIds: missing,
        readinessPercent,
        isReadyToCook,
      };
    }).sort((a, b) => {
      // Prioritize 100% ready recipes, then higher match percentage
      if (a.isReadyToCook && !b.isReadyToCook) return -1;
      if (!a.isReadyToCook && b.isReadyToCook) return 1;
      return b.readinessPercent - a.readinessPercent;
    });
  }, [cart]);

  // Filter recipes based on active tab
  const filteredRecipes = useMemo(() => {
    if (selectedCategory === 'ready') {
      return scoredRecipes.filter((r) => r.isReadyToCook);
    }
    if (selectedCategory === 'salads') {
      return scoredRecipes.filter((r) => r.category === 'Salad');
    }
    if (selectedCategory === 'warm') {
      return scoredRecipes.filter((r) => r.category === 'Warm & Roasted' || r.category === 'Skillet');
    }
    return scoredRecipes;
  }, [scoredRecipes, selectedCategory]);

  const readyRecipesCount = scoredRecipes.filter((r) => r.isReadyToCook).length;

  const handleCopyRecipe = (recipe: SeasonalRecipe) => {
    const text = `🌿 ${recipe.title} (${recipe.prepTime}, ${recipe.servings})
${recipe.description}

INGREDIENTS:
${recipe.ingredients.map((ing) => `• ${ing.amount} ${ing.name}`).join('\n')}

INSTRUCTIONS:
${recipe.instructions.map((step, idx) => `${idx + 1}. ${step}`).join('\n')}

CHEF'S HARVEST TIP:
${recipe.chefTip}
— Prepared with Sunrise Harvest Produce from FarmFlow`;

    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {
        // Fallback for sandboxed iframe
      });
    }
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2800);
  };

  const togglePantryCheck = (key: string) => {
    setPantryChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section id="seasonal-recipe-suggestions" className="pt-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-[#92f7c3]/30 text-[#006c48] text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">skillet</span>
              Farm-to-Kitchen Recipes
            </span>
            {cartVegetableItems.length > 0 && (
              <span className="px-2.5 py-0.5 bg-[#c1ecd4] text-[#002114] text-xs font-semibold rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-[#006c48]">check_circle</span>
                {cartVegetableItems.length} seasonal vegetable{cartVegetableItems.length > 1 ? 's' : ''} in cart
              </span>
            )}
          </div>
          <h2 className="font-serif-display text-3xl font-bold text-[#012d1d] mb-1">
            Recipes for Your Harvest Basket
          </h2>
          <p className="text-[#414844] text-sm md:text-base max-w-2xl">
            Simple, chef-crafted recipes automatically matched to the seasonal vegetables and orchard fruits currently in your cart.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="filter-recipes-all"
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#1b4332] text-white shadow-xs'
                : 'bg-white text-[#414844] border border-[#c1c8c2]/40 hover:bg-[#f3f4f5]'
            }`}
          >
            All Suggestions ({scoredRecipes.length})
          </button>
          <button
            id="filter-recipes-ready"
            onClick={() => setSelectedCategory('ready')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              selectedCategory === 'ready'
                ? 'bg-[#006c48] text-white shadow-xs'
                : 'bg-white text-[#006c48] border border-[#006c48]/30 hover:bg-[#92f7c3]/20'
            }`}
          >
            <span className="material-symbols-outlined text-sm">restaurant</span>
            Ready to Cook ({readyRecipesCount})
          </button>
          <button
            id="filter-recipes-salads"
            onClick={() => setSelectedCategory('salads')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === 'salads'
                ? 'bg-[#1b4332] text-white shadow-xs'
                : 'bg-white text-[#414844] border border-[#c1c8c2]/40 hover:bg-[#f3f4f5]'
            }`}
          >
            Salads &amp; Raw Fresh
          </button>
          <button
            id="filter-recipes-warm"
            onClick={() => setSelectedCategory('warm')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === 'warm'
                ? 'bg-[#1b4332] text-white shadow-xs'
                : 'bg-white text-[#414844] border border-[#c1c8c2]/40 hover:bg-[#f3f4f5]'
            }`}
          >
            Warm &amp; Skillet
          </button>
        </div>
      </div>

      {/* Seasonal Cart Intelligence Ribbon */}
      <div className="mb-8 p-4 md:p-5 bg-gradient-to-r from-[#92f7c3]/20 via-[#c1ecd4]/20 to-white rounded-2xl border border-[#006c48]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#006c48] text-white flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-xl">grocery</span>
          </div>
          <div>
            <div className="text-sm font-bold text-[#012d1d]">
              {cartVegetableItems.length > 0
                ? `Cart Match: ${cartVegetableItems.map((v) => v.name.split('&')[0].trim()).join(', ')}`
                : 'Your cart does not have seasonal vegetables yet'}
            </div>
            <div className="text-xs text-[#414844]">
              {cartVegetableItems.length > 0
                ? `We've matched ${readyRecipesCount} recipe${readyRecipesCount === 1 ? '' : 's'} you can cook with what is already in your basket!`
                : 'Add Crisp Romaine, Rainbow Carrots, or Beefsteak Tomatoes to see live cooking suggestions.'}
            </div>
          </div>
        </div>

        {cartVegetableItems.length > 0 && readyRecipesCount > 0 && (
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-[#006c48]/30 shadow-2xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#006c48] animate-ping" />
            <span className="text-xs font-bold text-[#006c48]">
              {readyRecipesCount} Ready to Cook Tonight
            </span>
          </div>
        )}
      </div>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => {
          const isReady = recipe.isReadyToCook;
          const matchPercent = recipe.readinessPercent;

          return (
            <article
              key={recipe.id}
              id={`recipe-card-${recipe.id}`}
              className={`bg-white rounded-2xl overflow-hidden border transition-all duration-300 hover-lift ambient-shadow flex flex-col relative ${
                isReady
                  ? 'border-[#006c48]/50 ring-2 ring-[#006c48]/20'
                  : 'border-[#c1c8c2]/30'
              }`}
            >
              {/* Recipe Image Header */}
              <div className="h-48 relative overflow-hidden group">
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Readiness Badge */}
                <div className="absolute top-3 left-3">
                  {isReady ? (
                    <span className="px-2.5 py-1 bg-[#c1ecd4] text-[#002114] text-xs font-bold rounded-full shadow-sm flex items-center gap-1 border border-[#006c48]/30">
                      <span className="material-symbols-outlined text-sm text-[#006c48]">check_circle</span>
                      100% Ready to Cook
                    </span>
                  ) : matchPercent > 0 ? (
                    <span className="px-2.5 py-1 bg-white/95 backdrop-blur-xs text-[#012d1d] text-xs font-bold rounded-full shadow-sm flex items-center gap-1 border border-[#c1c8c2]/40">
                      <span className="material-symbols-outlined text-sm text-[#006c48]">donut_large</span>
                      {recipe.matchedProductIds.length}/{recipe.requiredProductIds.length} Produce in Cart
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur-xs text-[#414844] text-xs font-medium rounded-full shadow-sm">
                      Seasonal Inspiration
                    </span>
                  )}
                </div>

                {/* Timing & Calories Badge */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full font-medium">
                      <span className="material-symbols-outlined text-xs">schedule</span>
                      {recipe.prepTime}
                    </span>
                    <span className="bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full font-medium">
                      {recipe.difficulty}
                    </span>
                  </div>
                  {recipe.caloriesApprox && (
                    <span className="bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full font-medium">
                      ~{recipe.caloriesApprox} kcal
                    </span>
                  )}
                </div>
              </div>

              {/* Recipe Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-bold text-[#006c48] uppercase tracking-wider mb-1">
                    {recipe.seasonalHighlight}
                  </div>
                  <h3 className="font-serif-display text-xl font-bold text-[#191c1d] mb-2 leading-snug">
                    {recipe.title}
                  </h3>
                  <p className="text-xs text-[#414844] line-clamp-2 mb-4 leading-relaxed">
                    {recipe.description}
                  </p>

                  {/* Ingredients Checklist Preview */}
                  <div className="mb-4">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#414844] mb-2 flex items-center justify-between">
                      <span>Harvest Produce Needed:</span>
                      <span className="text-[#006c48]">
                        {recipe.matchedProductIds.length}/{recipe.requiredProductIds.length} available
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {recipe.ingredients
                        .filter((ing) => ing.productId)
                        .map((ing) => {
                          const isInCart = (cart[ing.productId!] || 0) > 0;
                          const product = getProductById(ing.productId!);

                          return (
                            <div
                              key={ing.name}
                              className={`flex items-center justify-between py-1 px-2 rounded-lg text-xs transition-colors ${
                                isInCart
                                  ? 'bg-[#92f7c3]/15 text-[#004d33] font-medium'
                                  : 'bg-[#f8f9fa] text-[#414844]'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 truncate mr-2">
                                <span
                                  className={`material-symbols-outlined text-sm shrink-0 ${
                                    isInCart ? 'text-[#006c48]' : 'text-[#c1c8c2]'
                                  }`}
                                >
                                  {isInCart ? 'check_box' : 'check_box_outline_blank'}
                                </span>
                                <span className="truncate">{ing.name}</span>
                              </div>

                              {isInCart ? (
                                <span className="text-[11px] font-bold text-[#006c48] shrink-0">
                                  In Cart ({cart[ing.productId!]})
                                </span>
                              ) : product ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onUpdateQuantity(product, (cart[product.id] || 0) + 1);
                                  }}
                                  className="text-[11px] font-bold text-[#012d1d] hover:text-[#006c48] bg-white border border-[#c1c8c2]/40 hover:border-[#006c48] px-2 py-0.5 rounded-full transition-colors shrink-0 flex items-center gap-0.5 cursor-pointer"
                                  title={`Add ${product.name} to cart`}
                                >
                                  <span>+ Add</span>
                                  <span>${product.price.toFixed(2)}</span>
                                </button>
                              ) : null}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-[#c1c8c2]/20 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setActiveRecipeModal(recipe)}
                    className="flex-1 py-2.5 px-3 bg-[#f3f4f5] hover:bg-[#1b4332] text-[#012d1d] hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">menu_book</span>
                    <span>View Cooking Steps</span>
                  </button>

                  {!isReady && recipe.missingProductIds.length > 0 && (
                    <button
                      onClick={() => {
                        recipe.missingProductIds.forEach((pid) => {
                          const product = getProductById(pid);
                          if (product) {
                            onUpdateQuantity(product, (cart[product.id] || 0) + 1);
                          }
                        });
                      }}
                      className="py-2.5 px-3 bg-[#012d1d] hover:bg-[#006c48] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                      title="Add all remaining harvest vegetables for this recipe"
                    >
                      <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                      <span>Complete Basket</span>
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Recipe Detail Modal */}
      {activeRecipeModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setActiveRecipeModal(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl my-8 border border-[#c1c8c2]/30 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Header */}
            <div className="relative h-60 w-full shrink-0">
              <img
                src={activeRecipeModal.imageUrl}
                alt={activeRecipeModal.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <button
                onClick={() => setActiveRecipeModal(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="inline-block px-2.5 py-0.5 bg-[#92f7c3]/90 text-[#002114] text-[11px] font-bold rounded-full mb-2">
                  {activeRecipeModal.seasonalHighlight}
                </span>
                <h3 className="font-serif-display text-2xl md:text-3xl font-bold drop-shadow-sm">
                  {activeRecipeModal.title}
                </h3>
                <div className="flex items-center gap-3 text-xs opacity-90 mt-1">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">timer</span>
                    {activeRecipeModal.prepTime} prep • {activeRecipeModal.cookTime} cook
                  </span>
                  <span>•</span>
                  <span>{activeRecipeModal.servings}</span>
                  <span>•</span>
                  <span>{activeRecipeModal.difficulty}</span>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
              <p className="text-sm text-[#414844] leading-relaxed">
                {activeRecipeModal.description}
              </p>

              {/* Chef's Agricultural Flavor Tip */}
              <div className="p-4 bg-[#92f7c3]/20 rounded-2xl border border-[#006c48]/20 flex items-start gap-3">
                <span className="material-symbols-outlined text-[#006c48] text-xl shrink-0 mt-0.5">
                  tips_and_updates
                </span>
                <div className="text-xs text-[#004d33] leading-relaxed">
                  <span className="font-bold block mb-0.5">Chef's Harvest Tip:</span>
                  {activeRecipeModal.chefTip}
                </div>
              </div>

              {/* Ingredients with Interactive Checkboxes */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-serif-display text-lg font-bold text-[#012d1d]">
                    Fresh Ingredients
                  </h4>
                  <span className="text-xs text-[#414844]">
                    Tap item to check off while cooking
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeRecipeModal.ingredients.map((ing, idx) => {
                    const key = `${activeRecipeModal.id}-${idx}`;
                    const isChecked = pantryChecked[key];
                    const isInCart = ing.productId ? (cart[ing.productId] || 0) > 0 : false;
                    const product = ing.productId ? getProductById(ing.productId) : null;

                    return (
                      <div
                        key={ing.name}
                        onClick={() => togglePantryCheck(key)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          isChecked
                            ? 'bg-[#f3f4f5] border-[#c1c8c2]/40 opacity-60 line-through'
                            : isInCart
                            ? 'bg-[#92f7c3]/15 border-[#006c48]/30'
                            : 'bg-white border-[#c1c8c2]/30 hover:bg-[#f8f9fa]'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span
                            className={`material-symbols-outlined text-base shrink-0 ${
                              isChecked
                                ? 'text-[#006c48]'
                                : isInCart
                                ? 'text-[#006c48]'
                                : 'text-[#c1c8c2]'
                            }`}
                          >
                            {isChecked ? 'check_circle' : isInCart ? 'inventory_2' : 'radio_button_unchecked'}
                          </span>
                          <span className="text-xs text-[#191c1d] truncate">
                            <strong className="font-semibold">{ing.amount}</strong> {ing.name}
                          </span>
                        </div>

                        {product && !isInCart && !isChecked && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onUpdateQuantity(product, (cart[product.id] || 0) + 1);
                            }}
                            className="shrink-0 text-[11px] font-bold text-[#006c48] hover:text-[#012d1d] bg-[#92f7c3]/30 px-2 py-0.5 rounded-full"
                          >
                            + Add ${product.price.toFixed(2)}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step-by-Step Cooking Steps */}
              <div>
                <h4 className="font-serif-display text-lg font-bold text-[#012d1d] mb-3">
                  Step-by-Step Preparation
                </h4>
                <ol className="space-y-3">
                  {activeRecipeModal.instructions.map((step, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-xs md:text-sm text-[#191c1d] leading-relaxed bg-[#f8f9fa] p-3 rounded-xl border border-[#c1c8c2]/20"
                    >
                      <span className="w-6 h-6 rounded-full bg-[#1b4332] text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 md:px-8 border-t border-[#c1c8c2]/20 bg-[#f8f9fa] flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => handleCopyRecipe(activeRecipeModal)}
                className="py-2.5 px-4 bg-white hover:bg-gray-100 text-[#012d1d] border border-[#c1c8c2]/40 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">content_copy</span>
                <span>{copiedNotification ? 'Copied to Clipboard!' : 'Copy Recipe'}</span>
              </button>

              <div className="flex items-center gap-2">
                {activeRecipeModal.missingProductIds.length > 0 ? (
                  <button
                    onClick={() => {
                      activeRecipeModal.missingProductIds.forEach((pid) => {
                        const product = getProductById(pid);
                        if (product) {
                          onUpdateQuantity(product, (cart[product.id] || 0) + 1);
                        }
                      });
                    }}
                    className="py-2.5 px-5 bg-[#012d1d] hover:bg-[#1b4332] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                    <span>Add All Missing Veggies to Basket</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-1 text-xs font-bold text-[#006c48] px-3 py-2 bg-[#92f7c3]/30 rounded-xl">
                    <span className="material-symbols-outlined text-sm">done_all</span>
                    <span>All Produce in Basket! Ready to Cook</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

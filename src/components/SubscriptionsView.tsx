import React, { useState } from 'react';
import { SUBSCRIPTION_PLANS } from '../data/mockData';
import { SubscriptionPlan } from '../types';

interface SubscriptionsViewProps {
  onSelectPlan: (plan: SubscriptionPlan, billingCycle: 'weekly' | 'monthly') => void;
}

export const SubscriptionsView: React.FC<SubscriptionsViewProps> = ({ onSelectPlan }) => {
  const [billingCycle, setBillingCycle] = useState<'weekly' | 'monthly'>('weekly');
  const [subscribedPlan, setSubscribedPlan] = useState<string | null>(null);

  const handleSubscribe = (plan: SubscriptionPlan) => {
    onSelectPlan(plan, billingCycle);
    setSubscribedPlan(plan.name);
    setTimeout(() => setSubscribedPlan(null), 4000);
  };

  return (
    <div id="subscriptions-screen" className="space-y-16 pb-20">
      {/* 1. Header Section */}
      <section className="text-center max-w-3xl mx-auto pt-6">
        <span className="inline-block px-4 py-1.5 bg-[#92f7c3]/40 text-[#006c48] text-xs font-bold uppercase tracking-wider rounded-full mb-4">
          FARM BOX SUBSCRIPTIONS
        </span>
        <h1 className="font-serif-display text-4xl md:text-5xl font-bold text-[#012d1d] mb-4">
          Cultivate Your Weekly Harvest
        </h1>
        <p className="text-[#414844] text-base md:text-lg">
          Fresh, seasonal produce directly from our fields to your table. Pause, customize, or cancel anytime.
        </p>

        {/* Weekly / Monthly Toggle */}
        <div className="mt-8 inline-flex items-center p-1.5 bg-[#e1e3e4] rounded-full border border-[#c1c8c2]/30">
          <button
            id="toggle-weekly-billing"
            onClick={() => setBillingCycle('weekly')}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer ${
              billingCycle === 'weekly'
                ? 'bg-white text-[#012d1d] shadow-sm'
                : 'text-[#414844] hover:text-[#012d1d]'
            }`}
          >
            Weekly
          </button>
          <button
            id="toggle-monthly-billing"
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              billingCycle === 'monthly'
                ? 'bg-[#012d1d] text-white shadow-sm'
                : 'text-[#414844] hover:text-[#012d1d]'
            }`}
          >
            <span>Monthly</span>
            <span className="text-[10px] bg-[#92f7c3] text-[#002114] px-2 py-0.5 rounded-full font-extrabold uppercase">
              Save 15%
            </span>
          </button>
        </div>

        {subscribedPlan && (
          <div className="mt-6 p-4 bg-[#92f7c3]/30 border border-[#006c48]/30 rounded-xl text-[#005235] text-sm font-bold animate-bounce">
            🎉 Successfully enrolled in {subscribedPlan} ({billingCycle})! Check your email for dispatch timing.
          </div>
        )}
      </section>

      {/* 2. Subscription Pricing Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isBestValue = plan.isPopular;
          const displayPrice =
            billingCycle === 'weekly' ? plan.priceWeekly : plan.priceMonthly;
          const cycleLabel = billingCycle === 'weekly' ? '/ week' : '/ month';

          return (
            <div
              key={plan.id}
              id={`plan-card-${plan.id}`}
              className={`bg-white rounded-3xl p-8 border flex flex-col relative transition-all duration-300 hover-lift ${
                isBestValue
                  ? 'border-[#006c48] shadow-xl ring-2 ring-[#006c48]/20'
                  : 'border-[#c1c8c2]/30 ambient-shadow'
              }`}
            >
              {isBestValue && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#006c48] text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full shadow-md">
                  Best Value
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-serif-display text-2xl font-bold text-[#012d1d] mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm text-[#414844] min-h-[40px] leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <div className="mb-8">
                <span className="font-serif-display text-4xl md:text-5xl font-bold text-[#012d1d]">
                  ${displayPrice.toFixed(0)}
                </span>
                <span className="text-sm text-[#414844] ml-1 font-medium">{cycleLabel}</span>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-[#191c1d]">
                    <span className="material-symbols-outlined text-[#006c48] text-lg shrink-0 mt-0.5">
                      check_circle
                    </span>
                    <span>{feat}</span>
                  </li>
                ))}
                <li className="flex items-start gap-3 text-sm text-[#191c1d]">
                  <span className="material-symbols-outlined text-[#006c48] text-lg shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span>100% Certified Local &amp; Compostable Pack</span>
                </li>
              </ul>

              <button
                id={`subscribe-btn-${plan.id}`}
                onClick={() => handleSubscribe(plan)}
                className={`w-full py-4 rounded-full font-bold text-sm transition-colors cursor-pointer ${
                  isBestValue
                    ? 'bg-[#012d1d] text-white hover:bg-[#1b4332] shadow-sm'
                    : 'bg-[#f3f4f5] text-[#012d1d] hover:bg-[#e1e3e4]'
                }`}
              >
                Subscribe to {plan.name}
              </button>
            </div>
          );
        })}
      </section>

      {/* 3. Scenic Trust Anchor Banner */}
      <section
        id="trust-anchor-banner"
        className="rounded-3xl overflow-hidden relative min-h-[280px] flex items-center p-8 md:p-12 ambient-shadow"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida/AEtjO1U3oAbvwZTlhdn2O9YMhDUfzPtf6XSE99fOkF3AsF8JQ57I2mmdCt4h8L3AFKgfui07Zy-tP3Ba3QXxT28SlMhlB10ZIegzDEEXQogDc4YUnTo-0EzgJ01Q5Zw7U5p0dvFQy2LO2btcGR7S_2CN0mZAaQdj4BOTFnw1l15BpLXGUkC9LAKSH5PduvBmnBR5tJRp1qEziDK4ZV6ilfAe4SENaLYsj3O9DNpf52VHxL-txbK6YyfGXFDyKQI')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />

        <div className="relative z-10 max-w-xl text-white">
          <h2 className="font-serif-display text-3xl font-bold mb-3">
            Grown with Intention. Delivered with Care.
          </h2>
          <p className="text-sm md:text-base opacity-90 leading-relaxed mb-6">
            Join a community committed to sustainable agriculture, zero chemical pesticides, fair farmer compensation, and exceptional taste.
          </p>
          <div className="flex items-center gap-6 text-xs text-[#92f7c3] font-semibold">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">verified</span>
              <span>100% Organic Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">electric_bolt</span>
              <span>Zero-Emissions Electric Vans</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

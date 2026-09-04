import React from 'react';

export const AboutUsBranch: React.FC = () => {
  return (
    <section
      id="about-us-branch"
      className="mt-20 pt-8 pb-12 border-t border-[#c1c8c2]/30"
      aria-label="About FarmFlow"
    >
      {/* 1. Header with Branch Tag */}
      <div className="flex flex-col items-center text-center mb-10 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#92f7c3]/30 text-[#006c48] text-xs font-bold uppercase tracking-wider mb-4 border border-[#006c48]/20 shadow-xs">
          <span className="material-symbols-outlined text-sm">nature_people</span>
          <span>Branch: About Us</span>
        </div>
        <h2 className="font-serif-display text-3xl md:text-5xl font-bold text-[#012d1d] tracking-tight leading-tight">
          Rooted in the Soil, Delivered to Your Table
        </h2>
        <p className="text-[#414844] text-sm md:text-base mt-3 max-w-xl">
          The story and values behind every sunrise harvest box we pack.
        </p>
      </div>

      {/* 2. Primary Highlight Card with User Summary */}
      <div
        id="about-us-summary-card"
        className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#012d1d] to-[#1b4332] text-white p-8 md:p-14 shadow-xl border border-[#92f7c3]/20 mb-12"
      >
        {/* Subtle decorative background accent */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-[#006c48]/30 blur-3xl pointer-events-none" />
        <div className="absolute top-8 right-8 opacity-15 hidden md:block">
          <span className="material-symbols-outlined text-9xl">psychiatry</span>
        </div>

        <div className="relative z-10 max-w-3xl">
          <span className="inline-block text-[#92f7c3] text-xs font-bold uppercase tracking-widest mb-3">
            Our Mission &amp; Promise
          </span>

          {/* User Requested Summary */}
          <blockquote className="font-serif-display text-xl sm:text-2xl md:text-3xl font-medium text-white/95 leading-relaxed tracking-wide drop-shadow-xs">
            &ldquo;Welcome to Farm Flow. We cultivate clean, nutrient-rich produce using sustainable, soil-first practices and bring it straight to your table. By cutting out the middlemen and long supply chains, our online store delivers harvest-day freshness, honest pricing, and radical transparency with every order.&rdquo;
          </blockquote>

          <div className="mt-8 flex flex-wrap items-center gap-6 pt-6 border-t border-white/15 text-xs text-white/80">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#92f7c3] text-base">eco</span>
              <span className="font-semibold text-white">Soil-First Organic Methods</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#92f7c3] text-base">local_shipping</span>
              <span className="font-semibold text-white">Direct-to-Door (Zero Middlemen)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#92f7c3] text-base">verified</span>
              <span className="font-semibold text-white">100% Radical Transparency</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Core Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {/* Pillar 1 */}
        <div
          id="pillar-soil-first"
          className="bg-white rounded-2xl p-6 border border-[#c1c8c2]/30 shadow-xs hover:border-[#006c48]/50 transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-[#92f7c3]/25 text-[#006c48] flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-2xl">potted_plant</span>
          </div>
          <h3 className="font-serif-display text-lg font-bold text-[#012d1d] mb-2">
            Sustainable, Soil-First
          </h3>
          <p className="text-xs md:text-sm text-[#414844] leading-relaxed">
            We nourish living soil biology with compost and cover crops, avoiding synthetic pesticides to produce nutrient-dense vegetables bursting with real flavor.
          </p>
        </div>

        {/* Pillar 2 */}
        <div
          id="pillar-no-middlemen"
          className="bg-white rounded-2xl p-6 border border-[#c1c8c2]/30 shadow-xs hover:border-[#006c48]/50 transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-[#92f7c3]/25 text-[#006c48] flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-2xl">transfer_within_a_station</span>
          </div>
          <h3 className="font-serif-display text-lg font-bold text-[#012d1d] mb-2">
            Zero Middlemen
          </h3>
          <p className="text-xs md:text-sm text-[#414844] leading-relaxed">
            By bypassing brokers, wholesale auctions, and holding depots, food skips days of artificial cold storage and heads straight from our fields to your kitchen.
          </p>
        </div>

        {/* Pillar 3 */}
        <div
          id="pillar-harvest-day"
          className="bg-white rounded-2xl p-6 border border-[#c1c8c2]/30 shadow-xs hover:border-[#006c48]/50 transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-[#92f7c3]/25 text-[#006c48] flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-2xl">wb_sunny</span>
          </div>
          <h3 className="font-serif-display text-lg font-bold text-[#012d1d] mb-2">
            Harvest-Day Freshness
          </h3>
          <p className="text-xs md:text-sm text-[#414844] leading-relaxed">
            Crops are harvested at sunrise when water tension and natural sugars are at their pinnacle, arriving at your doorstep within 24 hours of cutting.
          </p>
        </div>

        {/* Pillar 4 */}
        <div
          id="pillar-transparency"
          className="bg-white rounded-2xl p-6 border border-[#c1c8c2]/30 shadow-xs hover:border-[#006c48]/50 transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-[#92f7c3]/25 text-[#006c48] flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-2xl">query_stats</span>
          </div>
          <h3 className="font-serif-display text-lg font-bold text-[#012d1d] mb-2">
            Honest &amp; Transparent
          </h3>
          <p className="text-xs md:text-sm text-[#414844] leading-relaxed">
            Every item shows the exact grower, field mileage, and harvest batch. 88% of your payment flows directly into the pockets of regional family growers.
          </p>
        </div>
      </div>

      {/* 4. Transparency & Impact By the Numbers */}
      <div
        id="about-us-metrics"
        className="bg-[#f3f4f5] rounded-3xl p-8 md:p-10 border border-[#c1c8c2]/30 mb-12"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="font-serif-display text-3xl md:text-4xl font-bold text-[#012d1d]">
              &lt; 24 hrs
            </div>
            <div className="text-xs md:text-sm font-semibold text-[#414844] mt-1">
              Field to Doorstep Speed
            </div>
            <p className="text-[11px] text-[#717874] mt-0.5">Harvested at dawn daily</p>
          </div>

          <div>
            <div className="font-serif-display text-3xl md:text-4xl font-bold text-[#006c48]">
              88%
            </div>
            <div className="text-xs md:text-sm font-semibold text-[#414844] mt-1">
              Direct Farmer Fair-Share
            </div>
            <p className="text-[11px] text-[#717874] mt-0.5">vs. 15% industrial retail avg</p>
          </div>

          <div>
            <div className="font-serif-display text-3xl md:text-4xl font-bold text-[#012d1d]">
              0
            </div>
            <div className="text-xs md:text-sm font-semibold text-[#414844] mt-1">
              Middlemen &amp; Warehouses
            </div>
            <p className="text-[11px] text-[#717874] mt-0.5">100% direct supply chain</p>
          </div>

          <div>
            <div className="font-serif-display text-3xl md:text-4xl font-bold text-[#006c48]">
              100%
            </div>
            <div className="text-xs md:text-sm font-semibold text-[#414844] mt-1">
              Plastic-Free Packaging
            </div>
            <p className="text-[11px] text-[#717874] mt-0.5">Compostable &amp; returnable crates</p>
          </div>
        </div>
      </div>

      {/* 5. Bottom Footer Anchor */}
      <footer
        id="app-bottom-footer"
        className="pt-8 border-t border-[#c1c8c2]/20 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#717874]"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#012d1d] text-[#92f7c3] flex items-center justify-center font-serif-display font-bold text-base shadow-xs">
            F
          </div>
          <div>
            <div className="font-serif-display font-bold text-sm text-[#012d1d]">
              FarmFlow Agriculture Co.
            </div>
            <div>Green Valley &amp; Central Valley Regional Cooperatives</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6">
          <span className="flex items-center gap-1.5 text-[#006c48] font-semibold">
            <span className="material-symbols-outlined text-sm">verified_user</span>
            Certified Sustainable
          </span>
          <span className="flex items-center gap-1.5 text-[#006c48] font-semibold">
            <span className="material-symbols-outlined text-sm">local_shipping</span>
            Refrigerated Electric Fleet
          </span>
          <span className="flex items-center gap-1.5 text-[#006c48] font-semibold">
            <span className="material-symbols-outlined text-sm">support_agent</span>
            1-800-FARM-FRESH
          </span>
        </div>

        <div className="text-center md:text-right">
          &copy; {new Date().getFullYear()} FarmFlow Inc. All rights reserved.
        </div>
      </footer>
    </section>
  );
};

import React, { useState } from 'react';
import { MONTHLY_HARVEST_CALENDAR } from '../data/seasonalCalendar';
import { SeasonalItem } from '../types';

interface SeasonalAvailabilityWidgetProps {
  onSelectProduct?: (productId: number) => void;
  className?: string;
  isCompact?: boolean;
}

export const SeasonalAvailabilityWidget: React.FC<SeasonalAvailabilityWidgetProps> = ({
  onSelectProduct,
  className = '',
  isCompact = false,
}) => {
  // Current calendar month (0 = January, 8 = September, 9 = October)
  // Current local time is September (month 8)
  const currentMonthIndex = 8;
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonthIndex);
  const [activeFilter, setActiveFilter] = useState<'all' | 'vegetables' | 'fruits'>('all');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const monthData =
    MONTHLY_HARVEST_CALENDAR.find((m) => m.monthIndex === selectedMonth) ||
    MONTHLY_HARVEST_CALENDAR[8];

  const handlePrevMonth = () => {
    setSelectedMonth((prev) => (prev === 0 ? 11 : prev - 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth((prev) => (prev === 11 ? 0 : prev + 1));
  };

  const handleResetToCurrent = () => {
    setSelectedMonth(currentMonthIndex);
  };

  const filteredItems = monthData.items.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.category === activeFilter;
  });

  const isCurrentMonth = selectedMonth === currentMonthIndex;

  return (
    <div
      id="seasonal-availability-widget"
      className={`bg-white rounded-2xl border border-[#c1c8c2]/30 shadow-xs overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Widget Header */}
      <div className="p-3.5 bg-gradient-to-b from-[#f4f7f4] to-white border-b border-[#c1c8c2]/20">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base text-[#006c48]">
              eco
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#006c48]">
              Seasonal Harvest
            </span>
          </div>

          <div className="flex items-center gap-1">
            {!isCurrentMonth && (
              <button
                onClick={handleResetToCurrent}
                className="text-[10px] text-[#006c48] font-bold hover:underline cursor-pointer px-1.5 py-0.5 bg-[#92f7c3]/30 rounded-md"
                title="Jump to current harvest"
              >
                Now
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-5 h-5 flex items-center justify-center text-[#414844] hover:text-[#012d1d] rounded cursor-pointer"
              title={isExpanded ? 'Collapse widget' : 'Expand widget'}
            >
              <span className="material-symbols-outlined text-sm">
                {isExpanded ? 'expand_less' : 'expand_more'}
              </span>
            </button>
          </div>
        </div>

        {/* Month Selector Bar */}
        <div className="flex items-center justify-between mt-1">
          <button
            onClick={handlePrevMonth}
            className="w-6 h-6 flex items-center justify-center text-[#414844] hover:text-[#012d1d] hover:bg-black/5 rounded-full transition-colors cursor-pointer"
            aria-label="Previous Month"
          >
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>

          <div className="text-center">
            <div className="text-sm font-bold text-[#012d1d] flex items-center justify-center gap-1.5">
              <span>{monthData.monthName}</span>
              {isCurrentMonth && (
                <span className="w-2 h-2 rounded-full bg-[#006c48] inline-block animate-pulse" title="Current Month" />
              )}
            </div>
            <div className="text-[10px] font-medium text-[#86af99] uppercase tracking-wide">
              {monthData.season}
            </div>
          </div>

          <button
            onClick={handleNextMonth}
            className="w-6 h-6 flex items-center justify-center text-[#414844] hover:text-[#012d1d] hover:bg-black/5 rounded-full transition-colors cursor-pointer"
            aria-label="Next Month"
          >
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-3 space-y-3">
          {/* Quick Filter Tabs: All, Veggies, Fruits */}
          <div className="flex bg-[#f3f4f5] p-0.5 rounded-lg text-[10px] font-semibold">
            <button
              onClick={() => setActiveFilter('all')}
              className={`flex-1 py-1 rounded-md transition-colors cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-white text-[#012d1d] shadow-2xs font-bold'
                  : 'text-[#414844] hover:text-[#012d1d]'
              }`}
            >
              All ({monthData.items.length})
            </button>
            <button
              onClick={() => setActiveFilter('vegetables')}
              className={`flex-1 py-1 rounded-md transition-colors cursor-pointer ${
                activeFilter === 'vegetables'
                  ? 'bg-white text-[#012d1d] shadow-2xs font-bold'
                  : 'text-[#414844] hover:text-[#012d1d]'
              }`}
            >
              Greens & Roots
            </button>
            <button
              onClick={() => setActiveFilter('fruits')}
              className={`flex-1 py-1 rounded-md transition-colors cursor-pointer ${
                activeFilter === 'fruits'
                  ? 'bg-white text-[#012d1d] shadow-2xs font-bold'
                  : 'text-[#414844] hover:text-[#012d1d]'
              }`}
            >
              Fruits
            </button>
          </div>

          {/* Harvest Items List */}
          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-0.5 custom-scrollbar">
            {filteredItems.map((item, idx) => {
              const isPeak = item.status === 'peak';
              const isStarting = item.status === 'starting';
              const isEnding = item.status === 'ending';

              return (
                <div
                  key={idx}
                  onClick={() => item.productId && onSelectProduct && onSelectProduct(item.productId)}
                  className={`p-2 rounded-xl border text-left transition-all group ${
                    item.productId
                      ? 'hover:border-[#006c48]/50 hover:bg-[#f4f7f4] cursor-pointer'
                      : 'cursor-default'
                  } ${
                    isPeak
                      ? 'bg-white border-[#c1c8c2]/25'
                      : isEnding
                      ? 'bg-amber-50/40 border-amber-200/50'
                      : 'bg-purple-50/40 border-purple-200/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-base shrink-0 leading-none">{item.icon}</span>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#191c1d] truncate group-hover:text-[#006c48] transition-colors">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-[#414844] truncate">
                          {item.farm}
                        </div>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <div className="shrink-0">
                      {isPeak && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-[#006c48] bg-[#92f7c3]/35 px-1.5 py-0.5 rounded-full">
                          <span className="w-1 h-1 rounded-full bg-[#006c48]" />
                          Peak
                        </span>
                      )}
                      {isEnding && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full">
                          Ending
                        </span>
                      )}
                      {isStarting && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded-full">
                          Early
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Flavor / Harvest Note */}
                  <div className="mt-1 text-[10px] text-[#556058] flex items-center justify-between gap-1 border-t border-black/5 pt-1">
                    <span className="italic truncate">{item.flavorNote}</span>
                    {item.productId && (
                      <span className="text-[9px] font-semibold text-[#006c48] group-hover:underline shrink-0 flex items-center">
                        Shop &rarr;
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Monthly Soil & Agronomy Insight Box */}
          <div className="p-2.5 bg-[#f4f7f4] rounded-xl border border-[#006c48]/15 text-[10px] space-y-1">
            <div className="flex items-center justify-between text-[#006c48] font-bold">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">nest_eco_leaf</span>
                <span>Grower Note</span>
              </span>
              <span className="text-[9px] text-[#414844] font-normal">
                {monthData.soilCondition.split('(')[1]?.replace(')', '') || '20°C'}
              </span>
            </div>
            <p className="text-[#3b433e] leading-snug">
              {monthData.harvestTip}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { ActiveScreen, UserProfile } from '../types';

interface TopAppBarProps {
  currentCategoryTab: string;
  onSelectCategoryTab: (tab: string) => void;
  cartItemCount: number;
  onOpenCart: () => void;
  onToggleMobileMenu: () => void;
  onNavigate: (screen: ActiveScreen) => void;
  currentUser?: UserProfile | null;
}

const ALL_BRANCHES = [
  'Seasonal',
  'New Arrivals',
  'Best Sellers',
  'All Fresh Harvest',
  'Organic Leafy Greens & Roots',
  'Heirloom & Greenhouse Vegetables',
  'Citrus & Sun-Ripened Fruits',
  'Orchard Berries & Stone Fruits',
  'Your Account',
  'Sign In or Log In',
  'About Us',
];

export const TopAppBar: React.FC<TopAppBarProps> = ({
  currentCategoryTab,
  onSelectCategoryTab,
  cartItemCount,
  onOpenCart,
  onToggleMobileMenu,
  onNavigate,
  currentUser,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const handleTabClick = (tab: string) => {
    onSelectCategoryTab(tab);
    setIsDropdownOpen(false);

    if (tab === 'Your Account') {
      onNavigate('account');
      return;
    }
    if (tab === 'Sign In or Log In') {
      onNavigate('login');
      return;
    }

    onNavigate('marketplace');
    if (tab === 'About Us') {
      setTimeout(() => {
        const el = document.getElementById('about-us-branch');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleNotificationClick = () => {
    setNotificationToast("Sunrise Batch Harvested: Fresh Strawberries & Romaine just arrived from Berry Creek Farm!");
    setTimeout(() => setNotificationToast(null), 4000);
  };

  return (
    <header
      id="top-app-bar"
      className="sticky top-0 bg-[#f8f9fa]/90 backdrop-blur-md flex justify-between items-center h-20 px-4 md:px-10 z-30 border-b border-[#c1c8c2]/20"
    >
      {/* Mobile Menu & Title */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          id="mobile-menu-btn"
          onClick={onToggleMobileMenu}
          className="text-[#191c1d] p-2 rounded-full hover:bg-[#f3f4f5] transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>
        <button
          onClick={() => onNavigate('marketplace')}
          className="font-serif-display text-2xl font-bold text-[#012d1d]"
        >
          FarmFlow
        </button>
      </div>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex items-center gap-6 text-sm lg:text-base relative">
        {ALL_BRANCHES.slice(0, 4).map((tab) => {
          const isActive = currentCategoryTab === tab;
          return (
            <button
              key={tab}
              id={`nav-tab-${tab.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => handleTabClick(tab)}
              className={`transition-all duration-200 pb-1 cursor-pointer font-medium whitespace-nowrap ${
                isActive
                  ? 'text-[#012d1d] font-bold border-b-2 border-[#012d1d]'
                  : 'text-[#414844] hover:text-[#006c48] hover:-translate-y-0.5'
              }`}
            >
              {tab}
            </button>
          );
        })}

        {/* More Branches Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center gap-1 pb-1 font-medium transition-colors cursor-pointer text-sm ${
              ALL_BRANCHES.slice(4).includes(currentCategoryTab)
                ? 'text-[#012d1d] font-bold border-b-2 border-[#012d1d]'
                : 'text-[#414844] hover:text-[#006c48]'
            }`}
          >
            <span>{ALL_BRANCHES.slice(4).includes(currentCategoryTab) ? currentCategoryTab : 'More Harvests'}</span>
            <span className="material-symbols-outlined text-sm">
              {isDropdownOpen ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          {isDropdownOpen && (
            <div
              className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#c1c8c2]/30 py-2 z-50 animate-fade-in"
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              {ALL_BRANCHES.slice(4).map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-[#f3f4f5] transition-colors flex items-center justify-between cursor-pointer ${
                    currentCategoryTab === tab ? 'text-[#006c48] font-bold bg-[#92f7c3]/15' : 'text-[#191c1d]'
                  }`}
                >
                  <span>{tab}</span>
                  {currentCategoryTab === tab && (
                    <span className="material-symbols-outlined text-xs">check</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Trailing Actions */}
      <div className="flex items-center gap-3 md:gap-4 relative">
        {/* Notification Toast */}
        {notificationToast && (
          <div className="absolute right-0 top-14 w-80 bg-[#012d1d] text-white p-3 rounded-2xl shadow-2xl border border-[#92f7c3]/30 text-xs z-50 animate-fade-in flex items-start gap-2">
            <span className="material-symbols-outlined text-sm text-[#92f7c3]">notifications_active</span>
            <span className="flex-1">{notificationToast}</span>
            <button onClick={() => setNotificationToast(null)} className="text-white/60 hover:text-white">
              <span className="material-symbols-outlined text-xs">close</span>
            </button>
          </div>
        )}

        {/* Notifications Icon */}
        <button
          id="notifications-btn"
          onClick={handleNotificationClick}
          className="p-2 text-[#414844] hover:bg-[#f3f4f5] rounded-full transition-colors relative cursor-pointer"
          aria-label="View notifications"
        >
          <span className="material-symbols-outlined text-2xl">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#6d230f] rounded-full"></span>
        </button>

        {/* Shopping Cart Button with Badge */}
        <button
          id="cart-drawer-toggle-btn"
          onClick={onOpenCart}
          className="p-2 text-[#414844] hover:text-[#012d1d] hover:bg-[#f3f4f5] rounded-full transition-colors relative cursor-pointer"
          aria-label="Open Cart"
        >
          <span className="material-symbols-outlined text-2xl">shopping_cart</span>
          {cartItemCount > 0 && (
            <span
              id="cart-badge-count"
              className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-[#012d1d] text-white text-[11px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm"
            >
              {cartItemCount}
            </span>
          )}
        </button>

        {/* User Profile Avatar / Sign In Button */}
        <button
          id="user-profile-header-btn"
          onClick={() => onNavigate(currentUser ? 'account' : 'login')}
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#006c48]/50 hover:border-[#006c48] hover:scale-105 transition-all shrink-0 cursor-pointer shadow-xs focus:ring-2 focus:ring-[#006c48]"
          title={currentUser ? `Your Account (${currentUser.name})` : 'Sign In or Log In'}
          aria-label={currentUser ? `Your Account: ${currentUser.name}` : 'Sign In or Log In'}
        >
          {currentUser?.avatarUrl ? (
            <img
              alt={currentUser.name}
              className="w-full h-full object-cover"
              src={currentUser.avatarUrl}
            />
          ) : (
            <div className="w-full h-full bg-[#f3f4f5] text-[#006c48] flex items-center justify-center font-bold text-sm">
              <span className="material-symbols-outlined text-xl">person</span>
            </div>
          )}
        </button>
      </div>
    </header>
  );
};

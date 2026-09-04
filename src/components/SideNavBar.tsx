import React from 'react';
import { ActiveScreen, UserProfile } from '../types';
import { SeasonalAvailabilityWidget } from './SeasonalAvailabilityWidget';

interface SideNavBarProps {
  currentScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  cartCount: number;
  onSelectSeasonalProduct?: (productId: number) => void;
  currentUser?: UserProfile | null;
}

export const SideNavBar: React.FC<SideNavBarProps> = ({
  currentScreen,
  onNavigate,
  onSelectSeasonalProduct,
  currentUser,
}) => {
  return (
    <aside
      id="side-nav-bar"
      className="hidden md:flex flex-col h-screen w-72 fixed left-0 top-0 bg-[#f8f9fa] border-r border-[#c1c8c2]/20 shadow-[4px_0_16px_rgba(27,67,50,0.08)] py-6 px-4 z-40 overflow-y-auto custom-scrollbar"
    >
      {/* Brand Header */}
      <div className="mb-6 px-2 flex flex-col">
        <button
          onClick={() => onNavigate('marketplace')}
          className="text-left group cursor-pointer"
        >
          <div className="font-serif-display text-4xl font-bold text-[#012d1d] group-hover:text-[#006c48] transition-colors">
            FarmFlow
          </div>
          <span className="text-sm font-normal text-[#414844] mt-1 block">
            Green Valley, CA
          </span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <nav className="flex flex-col gap-1.5 shrink-0">
        {/* Marketplace */}
        <button
          id="nav-marketplace-btn"
          onClick={() => onNavigate('marketplace')}
          className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-left transition-all duration-300 cursor-pointer ${
            currentScreen === 'marketplace'
              ? 'text-[#012d1d] font-bold border-r-4 border-[#012d1d] bg-[#f3f4f5] shadow-xs'
              : 'text-[#414844] hover:text-[#012d1d] hover:bg-[#ffffff]'
          }`}
        >
          <span
            className="material-symbols-outlined text-xl"
            style={{ fontVariationSettings: currentScreen === 'marketplace' ? "'FILL' 1" : "'FILL' 0" }}
          >
            storefront
          </span>
          <span className="text-sm font-semibold">Marketplace</span>
        </button>

        {/* Subscriptions */}
        <button
          id="nav-subscriptions-btn"
          onClick={() => onNavigate('subscriptions')}
          className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-left transition-all duration-300 cursor-pointer ${
            currentScreen === 'subscriptions'
              ? 'text-[#012d1d] font-bold border-r-4 border-[#012d1d] bg-[#f3f4f5] shadow-xs'
              : 'text-[#414844] hover:text-[#012d1d] hover:bg-[#ffffff]'
          }`}
        >
          <span
            className="material-symbols-outlined text-xl"
            style={{ fontVariationSettings: currentScreen === 'subscriptions' ? "'FILL' 1" : "'FILL' 0" }}
          >
            calendar_today
          </span>
          <span className="text-sm font-semibold">Subscriptions</span>
        </button>

        {/* Orders */}
        <button
          id="nav-orders-btn"
          onClick={() => onNavigate('orders')}
          className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-left transition-all duration-300 cursor-pointer ${
            currentScreen === 'orders'
              ? 'text-[#012d1d] font-bold border-r-4 border-[#012d1d] bg-[#f3f4f5] shadow-xs'
              : 'text-[#414844] hover:text-[#012d1d] hover:bg-[#ffffff]'
          }`}
        >
          <span
            className="material-symbols-outlined text-xl"
            style={{ fontVariationSettings: currentScreen === 'orders' ? "'FILL' 1" : "'FILL' 0" }}
          >
            shopping_bag
          </span>
          <span className="text-sm font-semibold">Orders</span>
        </button>

        {/* Invoices */}
        <button
          id="nav-invoices-btn"
          onClick={() => onNavigate('invoice')}
          className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-left transition-all duration-300 cursor-pointer ${
            currentScreen === 'invoice'
              ? 'text-[#012d1d] font-bold border-r-4 border-[#012d1d] bg-[#f3f4f5] shadow-xs'
              : 'text-[#414844] hover:text-[#012d1d] hover:bg-[#ffffff]'
          }`}
        >
          <span
            className="material-symbols-outlined text-xl"
            style={{ fontVariationSettings: currentScreen === 'invoice' ? "'FILL' 1" : "'FILL' 0" }}
          >
            receipt_long
          </span>
          <span className="text-sm font-semibold">Invoices</span>
        </button>

        {/* Your Account Branch */}
        <button
          id="nav-your-account-btn"
          onClick={() => onNavigate('account')}
          className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-left transition-all duration-300 cursor-pointer ${
            currentScreen === 'account'
              ? 'text-[#012d1d] font-bold border-r-4 border-[#012d1d] bg-[#f3f4f5] shadow-xs'
              : 'text-[#414844] hover:text-[#012d1d] hover:bg-[#ffffff]'
          }`}
        >
          <span
            className="material-symbols-outlined text-xl"
            style={{ fontVariationSettings: currentScreen === 'account' ? "'FILL' 1" : "'FILL' 0" }}
          >
            person
          </span>
          <span className="text-sm font-semibold">Your Account</span>
        </button>

        {/* Sign In or Log In Branch */}
        <button
          id="nav-sign-in-btn"
          onClick={() => onNavigate('login')}
          className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-left transition-all duration-300 cursor-pointer ${
            currentScreen === 'login'
              ? 'text-[#012d1d] font-bold border-r-4 border-[#012d1d] bg-[#f3f4f5] shadow-xs'
              : 'text-[#414844] hover:text-[#012d1d] hover:bg-[#ffffff]'
          }`}
        >
          <span
            className="material-symbols-outlined text-xl"
            style={{ fontVariationSettings: currentScreen === 'login' ? "'FILL' 1" : "'FILL' 0" }}
          >
            login
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Sign In / Log In</span>
            {currentUser && (
              <span className="text-[10px] text-[#006c48] font-bold">
                ● Signed In ({currentUser.name.split(' ')[0]})
              </span>
            )}
          </div>
        </button>

        {/* About Us Branch */}
        <button
          id="nav-about-us-btn"
          onClick={() => {
            onNavigate('marketplace');
            setTimeout(() => {
              const el = document.getElementById('about-us-branch');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }, 100);
          }}
          className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-left transition-all duration-300 cursor-pointer text-[#414844] hover:text-[#012d1d] hover:bg-[#ffffff]"
        >
          <span className="material-symbols-outlined text-xl">
            nature_people
          </span>
          <span className="text-sm font-semibold">About Us</span>
        </button>
      </nav>

      {/* Seasonal Availability Widget in Sidebar */}
      <div className="my-4">
        <SeasonalAvailabilityWidget
          onSelectProduct={(id) => {
            onNavigate('marketplace');
            if (onSelectSeasonalProduct) onSelectSeasonalProduct(id);
          }}
        />
      </div>

      {/* Footer Links & User Profile Badge */}
      <div className="mt-auto border-t border-[#c1c8c2]/20 pt-4 flex flex-col gap-1.5 pb-2">
        {currentUser ? (
          <button
            onClick={() => onNavigate('account')}
            className="flex items-center gap-2.5 p-2 rounded-xl bg-white hover:bg-[#f3f4f5] border border-[#c1c8c2]/30 transition-all text-left cursor-pointer mb-2 shadow-2xs"
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-[#006c48]/30"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-[#012d1d] truncate">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-[#717874] truncate">
                ID: {currentUser.memberId} • Patron
              </div>
            </div>
            <span className="material-symbols-outlined text-xs text-[#717874]">chevron_right</span>
          </button>
        ) : (
          <button
            onClick={() => onNavigate('login')}
            className="flex items-center justify-between p-2 rounded-xl bg-[#92f7c3]/20 hover:bg-[#92f7c3]/30 border border-[#006c48]/20 transition-all text-left cursor-pointer mb-2"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-[#006c48]">login</span>
              <span className="text-xs font-bold text-[#006c48]">Member Sign In</span>
            </div>
            <span className="material-symbols-outlined text-xs text-[#006c48]">arrow_forward</span>
          </button>
        )}

        <button
          id="nav-settings-btn"
          onClick={() => onNavigate('account')}
          className="flex items-center gap-3 py-1.5 px-3 rounded-lg text-[#414844] hover:text-[#012d1d] hover:bg-[#ffffff] transition-all text-xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">settings</span>
          <span>Delivery &amp; Account Settings</span>
        </button>

        <button
          id="nav-support-btn"
          onClick={() => onNavigate('account')}
          className="flex items-center gap-3 py-1.5 px-3 rounded-lg text-[#414844] hover:text-[#012d1d] hover:bg-[#ffffff] transition-all text-xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-lg">support_agent</span>
          <span>Harvest Concierge Support</span>
        </button>
      </div>
    </aside>
  );
};


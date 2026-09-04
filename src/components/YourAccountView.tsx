import React, { useState } from 'react';
import { UserProfile, OrderConfirmation } from '../types';

interface YourAccountViewProps {
  user: UserProfile | null;
  onUpdateUser: (updated: UserProfile) => void;
  onLogout: () => void;
  onNavigateToLogin: () => void;
  onNavigateToOrders: () => void;
  onNavigateToSubscriptions: () => void;
  onNavigateToInvoice: () => void;
  onNavigateToMarketplace: () => void;
  currentOrder: OrderConfirmation;
}

export const YourAccountView: React.FC<YourAccountViewProps> = ({
  user,
  onUpdateUser,
  onLogout,
  onNavigateToLogin,
  onNavigateToOrders,
  onNavigateToSubscriptions,
  onNavigateToInvoice,
  onNavigateToMarketplace,
  currentOrder,
}) => {
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editName, setEditName] = useState(user?.name || 'Sarah Jenkins');
  const [editPhone, setEditPhone] = useState(user?.phone || '(555) 382-9410');
  const [editAddress, setEditAddress] = useState(user?.address || '104 Organic Way');
  const [editApt, setEditApt] = useState(user?.aptOrSuite || 'Apt 3B');
  const [editWindow, setEditWindow] = useState(
    user?.preferredDeliveryWindow || 'Tomorrow, 8:00 AM – 10:00 AM'
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Preference switches
  const [organicOnly, setOrganicOnly] = useState(user?.preferences?.organicOnly ?? true);
  const [smsAlerts, setSmsAlerts] = useState(user?.preferences?.smsAlerts ?? true);
  const [pushNotifications, setPushNotifications] = useState(
    user?.preferences?.pushNotifications ?? true
  );
  const [reusableCrateProgram, setReusableCrateProgram] = useState(
    user?.preferences?.reusableCrateProgram ?? true
  );

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const updated: UserProfile = {
      ...user,
      name: editName,
      phone: editPhone,
      address: editAddress,
      aptOrSuite: editApt,
      preferredDeliveryWindow: editWindow,
      preferences: {
        organicOnly,
        smsAlerts,
        pushNotifications,
        reusableCrateProgram,
      },
    };
    onUpdateUser(updated);
    setIsEditingAddress(false);
    triggerToast('Profile & delivery preferences updated successfully!');
  };

  // If not logged in, show an inviting guest state
  if (!user) {
    return (
      <div id="branch-account-guest" className="max-w-3xl mx-auto text-center py-16 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#92f7c3]/30 text-[#006c48] text-xs font-bold uppercase tracking-wider mb-2 border border-[#006c48]/20 shadow-xs">
          <span className="material-symbols-outlined text-sm">person</span>
          <span>Branch: Your Account</span>
        </div>
        <div className="w-20 h-20 bg-[#f3f4f5] rounded-full flex items-center justify-center mx-auto text-[#717874] border border-[#c1c8c2]/30">
          <span className="material-symbols-outlined text-4xl">account_circle</span>
        </div>
        <h1 className="font-serif-display text-3xl md:text-4xl font-bold text-[#012d1d]">
          Sign In to Access Your Account
        </h1>
        <p className="text-[#414844] max-w-md mx-auto text-sm sm:text-base leading-relaxed">
          Log in or create a co-op profile to manage harvest deliveries, review farm impact metrics, and customize your seasonal produce box.
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            id="guest-login-btn"
            onClick={onNavigateToLogin}
            className="px-8 py-3.5 bg-[#006c48] hover:bg-[#012d1d] text-white font-bold text-sm rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">login</span>
            <span>Sign In / Log In</span>
          </button>
          <button
            id="guest-marketplace-btn"
            onClick={onNavigateToMarketplace}
            className="px-6 py-3.5 bg-white hover:bg-gray-50 text-[#012d1d] font-bold text-sm rounded-xl transition-all border border-[#c1c8c2]/40 cursor-pointer"
          >
            Browse Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="branch-your-account-view" className="max-w-5xl mx-auto space-y-10 pb-24 pt-2">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="account-toast"
          className="fixed top-24 right-4 md:right-10 z-50 bg-[#012d1d] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#92f7c3]/40 flex items-center gap-3 animate-fade-in"
        >
          <span className="material-symbols-outlined text-[#92f7c3]">check_circle</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#c1c8c2]/30 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#92f7c3]/30 text-[#006c48] text-xs font-bold uppercase tracking-wider mb-2 border border-[#006c48]/20 shadow-xs">
            <span className="material-symbols-outlined text-sm">person</span>
            <span>Branch: Your Account</span>
          </div>
          <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#012d1d]">
            Member Account Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#414844] mt-1">
            Green Valley Regenerative Co-op • Soil Steward Member
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="account-switch-btn"
            onClick={onNavigateToLogin}
            className="px-4 py-2.5 bg-[#f3f4f5] hover:bg-[#e5e7e9] text-[#012d1d] font-bold text-xs rounded-xl border border-[#c1c8c2]/30 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base text-[#006c48]">swap_horiz</span>
            <span>Switch / Sign In</span>
          </button>
          <button
            id="account-logout-btn"
            onClick={() => {
              onLogout();
              triggerToast('Logged out successfully.');
            }}
            className="px-4 py-2.5 border border-red-200 text-red-700 hover:bg-red-50 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* 1. Member Profile & Impact Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#c1c8c2]/30 ambient-shadow">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#c1c8c2]/20">
          <div className="flex items-center gap-4">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-[#92f7c3]/40 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif-display text-2xl font-bold text-[#012d1d]">
                  {user.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#006c48] text-[#92f7c3] text-[11px] font-bold uppercase tracking-wider">
                  Verified Patron
                </span>
              </div>
              <p className="text-xs text-[#414844] mt-0.5">
                {user.email} • {user.phone}
              </p>
              <p className="text-xs text-[#717874] mt-0.5">
                Co-op ID: <span className="font-mono font-bold text-[#012d1d]">{user.memberId}</span> • Member Since {user.memberSince}
              </p>
            </div>
          </div>

          <button
            id="toggle-edit-profile-btn"
            onClick={() => setIsEditingAddress(!isEditingAddress)}
            className="px-5 py-2.5 bg-[#006c48]/10 hover:bg-[#006c48]/20 text-[#006c48] font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 self-start md:self-auto"
          >
            <span className="material-symbols-outlined text-base">
              {isEditingAddress ? 'close' : 'edit'}
            </span>
            <span>{isEditingAddress ? 'Cancel Editing' : 'Edit Profile & Address'}</span>
          </button>
        </div>

        {/* Impact Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-[#f8f9fa] border border-[#c1c8c2]/20 text-center">
            <span className="material-symbols-outlined text-2xl text-[#006c48] mb-1">eco</span>
            <div className="text-2xl font-bold font-serif-display text-[#012d1d]">
              {user.stats.produceEnjoyedLbs} lbs
            </div>
            <span className="text-[11px] font-semibold text-[#717874] uppercase tracking-wider">
              Harvest Enjoyed
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#f8f9fa] border border-[#c1c8c2]/20 text-center">
            <span className="material-symbols-outlined text-2xl text-[#006c48] mb-1">agriculture</span>
            <div className="text-2xl font-bold font-serif-display text-[#012d1d]">
              {user.stats.farmsSupported}
            </div>
            <span className="text-[11px] font-semibold text-[#717874] uppercase tracking-wider">
              Farms Supported
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#f8f9fa] border border-[#c1c8c2]/20 text-center">
            <span className="material-symbols-outlined text-2xl text-[#006c48] mb-1">forest</span>
            <div className="text-2xl font-bold font-serif-display text-[#012d1d]">
              {user.stats.co2SavedKg} kg
            </div>
            <span className="text-[11px] font-semibold text-[#717874] uppercase tracking-wider">
              CO₂ Saved
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#f8f9fa] border border-[#c1c8c2]/20 text-center">
            <span className="material-symbols-outlined text-2xl text-[#006c48] mb-1">receipt_long</span>
            <div className="text-2xl font-bold font-serif-display text-[#012d1d]">
              {user.stats.ordersCompleted}
            </div>
            <span className="text-[11px] font-semibold text-[#717874] uppercase tracking-wider">
              Harvests Delivered
            </span>
          </div>
        </div>
      </div>

      {/* 2. Edit Profile Modal or Form (if active) */}
      {isEditingAddress && (
        <form
          onSubmit={handleSaveProfile}
          className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#006c48]/40 shadow-lg space-y-6 animate-fade-in"
        >
          <div className="flex items-center justify-between border-b border-[#c1c8c2]/30 pb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006c48]">home_pin</span>
              <h3 className="font-serif-display text-xl font-bold text-[#012d1d]">
                Update Delivery Details & Preferences
              </h3>
            </div>
            <span className="text-xs text-[#717874]">Changes save to your current session</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#414844] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c1c8c2]/40 rounded-xl text-sm font-medium text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#006c48]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#414844] mb-1.5">
                Mobile Phone (for First-Light SMS)
              </label>
              <input
                type="text"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c1c8c2]/40 rounded-xl text-sm font-medium text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#006c48]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#414844] mb-1.5">
                Delivery Address
              </label>
              <input
                type="text"
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c1c8c2]/40 rounded-xl text-sm font-medium text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#006c48]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#414844] mb-1.5">
                Apt / Suite / Instructions
              </label>
              <input
                type="text"
                value={editApt}
                onChange={(e) => setEditApt(e.target.value)}
                placeholder="e.g. Leave on front porch"
                className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c1c8c2]/40 rounded-xl text-sm font-medium text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#006c48]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#414844] mb-1.5">
                Preferred Morning Delivery Window
              </label>
              <select
                value={editWindow}
                onChange={(e) => setEditWindow(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#c1c8c2]/40 rounded-xl text-sm font-medium text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#006c48]"
              >
                <option value="Tomorrow, 7:00 AM – 9:00 AM">Tomorrow, 7:00 AM – 9:00 AM (Early Sunrise)</option>
                <option value="Tomorrow, 8:00 AM – 10:00 AM">Tomorrow, 8:00 AM – 10:00 AM (Standard Harvest Window)</option>
                <option value="Tomorrow, 10:00 AM – 12:00 PM">Tomorrow, 10:00 AM – 12:00 PM (Midday Chill)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditingAddress(false)}
              className="px-5 py-2.5 text-xs font-bold text-[#414844] hover:bg-gray-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#006c48] hover:bg-[#012d1d] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">check</span>
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* 3. Harvest Settings & Preferences Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Delivery Address & Window Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#c1c8c2]/30 ambient-shadow space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006c48]">local_shipping</span>
              <h3 className="font-serif-display text-xl font-bold text-[#012d1d]">
                Delivery Coordinates
              </h3>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#006c48] bg-[#92f7c3]/30 px-2.5 py-0.5 rounded-full">
              Electric Cold Chain
            </span>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-[#414844]">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#f8f9fa] border border-[#c1c8c2]/20">
              <span className="material-symbols-outlined text-[#006c48] shrink-0 mt-0.5">place</span>
              <div>
                <strong className="text-[#012d1d] block font-semibold">Primary Address:</strong>
                {user.address} {user.aptOrSuite ? `, ${user.aptOrSuite}` : ''}
                <div className="text-[#717874] text-xs">
                  {user.city}, {user.state} {user.zipCode}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#f8f9fa] border border-[#c1c8c2]/20">
              <span className="material-symbols-outlined text-[#006c48] shrink-0 mt-0.5">schedule</span>
              <div>
                <strong className="text-[#012d1d] block font-semibold">Delivery Window:</strong>
                {user.preferredDeliveryWindow}
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={onNavigateToOrders}
              className="text-xs font-bold text-[#006c48] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Active Orders & Live Map</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Harvest Preferences Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#c1c8c2]/30 ambient-shadow space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006c48]">tune</span>
              <h3 className="font-serif-display text-xl font-bold text-[#012d1d]">
                Harvest Box Preferences
              </h3>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#006c48] bg-[#92f7c3]/30 px-2.5 py-0.5 rounded-full">
              Customized
            </span>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#f8f9fa] transition-all cursor-pointer">
              <div className="pr-4">
                <div className="text-xs sm:text-sm font-bold text-[#012d1d]">
                  Box Status Push Notifications
                </div>
                <div className="text-[11px] text-[#717874]">
                  Instant updates when harvested, out for delivery, and dropped
                </div>
              </div>
              <input
                type="checkbox"
                checked={pushNotifications}
                onChange={(e) => {
                  setPushNotifications(e.target.checked);
                  triggerToast('Push notification preference saved.');
                }}
                className="w-5 h-5 rounded text-[#006c48] accent-[#006c48] cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#f8f9fa] transition-all cursor-pointer border-t border-[#c1c8c2]/20">
              <div className="pr-4">
                <div className="text-xs sm:text-sm font-bold text-[#012d1d]">
                  First-Light Harvest SMS Alerts
                </div>
                <div className="text-[11px] text-[#717874]">
                  Text when our pickers begin gathering your crate at dawn
                </div>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => {
                  setSmsAlerts(e.target.checked);
                  triggerToast('SMS alerts preference saved.');
                }}
                className="w-5 h-5 rounded text-[#006c48] accent-[#006c48] cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#f8f9fa] transition-all cursor-pointer border-t border-[#c1c8c2]/20">
              <div className="pr-4">
                <div className="text-xs sm:text-sm font-bold text-[#012d1d]">
                  Returnable Wooden Crate Deposit
                </div>
                <div className="text-[11px] text-[#717874]">
                  Automatic $2.00 credit upon pickup of sanitized empty crate
                </div>
              </div>
              <input
                type="checkbox"
                checked={reusableCrateProgram}
                onChange={(e) => {
                  setReusableCrateProgram(e.target.checked);
                  triggerToast('Crate program preference saved.');
                }}
                className="w-5 h-5 rounded text-[#006c48] accent-[#006c48] cursor-pointer"
              />
            </label>
          </div>
        </div>
      </div>

      {/* 4. Active Subscription & Quick Invoicing Banner */}
      <div className="bg-[#012d1d] text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#92f7c3]/20 text-[#92f7c3] text-xs font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-sm">all_inclusive</span>
            <span>Recurring Harvest Plan</span>
          </div>
          <h3 className="font-serif-display text-2xl font-bold">
            Family Harvest Box (Weekly)
          </h3>
          <p className="text-xs text-[#c1c8c2] max-w-xl">
            10-12 seasonal farm picks delivered every Tuesday morning. Hand-harvested by El-Beheira &amp; Mariout growers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onNavigateToSubscriptions}
            className="px-5 py-2.5 bg-[#92f7c3] hover:bg-[#72e7b3] text-[#002114] font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">edit_calendar</span>
            <span>Manage Plan</span>
          </button>
          <button
            onClick={onNavigateToInvoice}
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all border border-white/20 cursor-pointer flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">receipt</span>
            <span>View Latest Receipt ({currentOrder.orderNumber})</span>
          </button>
        </div>
      </div>

      {/* 5. Quick Return to Marketplace */}
      <div className="p-6 rounded-3xl bg-[#92f7c3]/20 border border-[#006c48]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-serif-display text-lg font-bold text-[#012d1d]">
            Ready for Tomorrow's Sunrise Harvest?
          </h4>
          <p className="text-xs text-[#414844]">
            Order by 8:00 PM tonight for first-light harvest &amp; morning cold-chain delivery.
          </p>
        </div>
        <button
          onClick={onNavigateToMarketplace}
          className="px-6 py-3 bg-[#006c48] hover:bg-[#012d1d] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
        >
          Explore Fresh Produce →
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { UserProfile } from '../types';

interface LoginBranchViewProps {
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
  onNavigateToAccount: () => void;
  onNavigateToMarketplace: () => void;
}

const DEMO_USER: UserProfile = {
  id: 'usr_7891',
  name: 'Sarah Jenkins',
  email: 'sarah.jenkins@farmflow.eco',
  phone: '(555) 382-9410',
  address: '104 Organic Way',
  aptOrSuite: 'Apt 3B',
  city: 'Green Valley',
  state: 'CA',
  zipCode: '95945',
  memberSince: 'March 2023',
  memberId: 'GV-4402',
  preferredDeliveryWindow: 'Tomorrow, 8:00 AM – 10:00 AM',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  stats: {
    produceEnjoyedLbs: 38,
    farmsSupported: 4,
    co2SavedKg: 14.8,
    ordersCompleted: 9,
  },
  preferences: {
    organicOnly: true,
    smsAlerts: true,
    pushNotifications: true,
    reusableCrateProgram: true,
  },
};

export const LoginBranchView: React.FC<LoginBranchViewProps> = ({
  currentUser,
  onLogin,
  onLogout,
  onNavigateToAccount,
  onNavigateToMarketplace,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('sarah.jenkins@farmflow.eco');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDemoSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(DEMO_USER);
      triggerToast('Signed in successfully as Sarah Jenkins!');
      setTimeout(() => {
        onNavigateToAccount();
      }, 500);
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      triggerToast('Please enter an email address.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (authMode === 'login') {
        const userToSet: UserProfile = {
          ...DEMO_USER,
          email: email.trim(),
          name: email.includes('@') ? email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (l) => l.toUpperCase()) : 'Farm Member',
        };
        onLogin(userToSet);
        triggerToast(`Welcome back, ${userToSet.name}!`);
      } else {
        const newUser: UserProfile = {
          ...DEMO_USER,
          id: `usr_${Math.floor(1000 + Math.random() * 9000)}`,
          name: fullName.trim() || 'Harvest Patron',
          email: email.trim(),
          address: deliveryAddress.trim() || '104 Organic Way, Green Valley, CA',
          memberSince: 'Today',
          memberId: `GV-${Math.floor(1000 + Math.random() * 9000)}`,
          stats: {
            produceEnjoyedLbs: 0,
            farmsSupported: 1,
            co2SavedKg: 0,
            ordersCompleted: 0,
          },
        };
        onLogin(newUser);
        triggerToast(`Account created! Welcome to FarmFlow, ${newUser.name}!`);
      }
      setTimeout(() => {
        onNavigateToAccount();
      }, 500);
    }, 450);
  };

  return (
    <div id="branch-login-view" className="max-w-4xl mx-auto space-y-10 pb-20 pt-2">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="auth-toast"
          className="fixed top-24 right-4 md:right-10 z-50 bg-[#012d1d] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#92f7c3]/40 flex items-center gap-3 animate-fade-in"
        >
          <span className="material-symbols-outlined text-[#92f7c3]">verified_user</span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#92f7c3]/30 text-[#006c48] text-xs font-bold uppercase tracking-wider mb-4 border border-[#006c48]/20 shadow-xs">
          <span className="material-symbols-outlined text-sm">login</span>
          <span>Branch: Sign In or Log In</span>
        </div>
        <h1 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#012d1d] mb-3">
          {currentUser ? 'Manage Your FarmFlow Session' : 'Access Your Harvest Account'}
        </h1>
        <p className="text-[#414844] max-w-xl text-sm sm:text-base leading-relaxed">
          Sign in to view your sunrise harvest schedule, manage organic crates, trace origin soil health, and track refrigerated deliveries.
        </p>
      </div>

      {/* If already logged in, show active session banner */}
      {currentUser && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#c1c8c2]/30 ambient-shadow flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#006c48] shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#006c48] animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#006c48]">
                  Currently Signed In
                </span>
              </div>
              <h2 className="font-serif-display text-2xl font-bold text-[#012d1d]">
                {currentUser.name}
              </h2>
              <p className="text-xs text-[#414844]">
                {currentUser.email} • Member <span className="font-mono font-bold text-[#012d1d]">{currentUser.memberId}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              id="view-my-account-btn"
              onClick={onNavigateToAccount}
              className="flex-1 md:flex-none px-6 py-3 bg-[#006c48] hover:bg-[#012d1d] text-white font-bold text-sm rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">person</span>
              <span>Open Your Account</span>
            </button>
            <button
              id="sign-out-btn"
              onClick={() => {
                onLogout();
                triggerToast('You have been logged out.');
              }}
              className="px-5 py-3 border border-red-200 text-red-700 hover:bg-red-50 font-bold text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Authentication Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Auth Form Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-[#c1c8c2]/30 ambient-shadow">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center p-1 bg-[#f3f4f5] rounded-2xl mb-8 border border-[#c1c8c2]/20">
            <button
              id="tab-sign-in"
              type="button"
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                authMode === 'login'
                  ? 'bg-white text-[#012d1d] shadow-xs'
                  : 'text-[#414844] hover:text-[#012d1d]'
              }`}
            >
              <span className="material-symbols-outlined text-lg">login</span>
              <span>Sign In (Log In)</span>
            </button>
            <button
              id="tab-sign-up"
              type="button"
              onClick={() => setAuthMode('signup')}
              className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                authMode === 'signup'
                  ? 'bg-white text-[#012d1d] shadow-xs'
                  : 'text-[#414844] hover:text-[#012d1d]'
              }`}
            >
              <span className="material-symbols-outlined text-lg">how_to_reg</span>
              <span>Join Cooperative</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#414844] mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#717874] text-lg">
                    badge
                  </span>
                  <input
                    id="signup-fullname"
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-[#f8f9fa] border border-[#c1c8c2]/40 rounded-xl text-sm font-medium text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#006c48] focus:bg-white transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#414844] mb-2">
                Co-op Member Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#717874] text-lg">
                  mail
                </span>
                <input
                  id="auth-email-input"
                  type="email"
                  required
                  placeholder="name@farmflow.eco"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#f8f9fa] border border-[#c1c8c2]/40 rounded-xl text-sm font-medium text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#006c48] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#414844]">
                  Password
                </label>
                {authMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => triggerToast('Password reset link sent to your registered email.')}
                    className="text-xs font-semibold text-[#006c48] hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#717874] text-lg">
                  lock
                </span>
                <input
                  id="auth-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 bg-[#f8f9fa] border border-[#c1c8c2]/40 rounded-xl text-sm font-medium text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#006c48] focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#717874] hover:text-[#191c1d] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#414844] mb-2">
                  Delivery Street Address
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#717874] text-lg">
                    location_on
                  </span>
                  <input
                    id="signup-address"
                    type="text"
                    required
                    placeholder="e.g. 104 Organic Way, Green Valley, CA"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-[#f8f9fa] border border-[#c1c8c2]/40 rounded-xl text-sm font-medium text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#006c48] focus:bg-white transition-all"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-[#414844]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#006c48] accent-[#006c48] cursor-pointer"
                />
                <span>Remember my harvest credentials</span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 space-y-3">
              <button
                id="submit-auth-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-[#006c48] hover:bg-[#012d1d] text-white font-bold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">
                      {authMode === 'login' ? 'login' : 'check_circle'}
                    </span>
                    <span>
                      {authMode === 'login' ? 'Sign In to Harvest Account' : 'Create FarmFlow Account'}
                    </span>
                  </>
                )}
              </button>

              {/* 1-Click Demo Login Helper */}
              <button
                id="quick-demo-login-btn"
                type="button"
                onClick={handleDemoSignIn}
                className="w-full py-3 bg-[#f3f4f5] hover:bg-[#e7e9ea] text-[#012d1d] font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-[#c1c8c2]/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm text-[#006c48]">bolt</span>
                <span>Quick Sign In as Demo Member (Sarah Jenkins)</span>
              </button>
            </div>
          </form>
        </div>

        {/* Cooperative Perks Side Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#012d1d] text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-[#006c48]/30 rounded-full blur-2xl pointer-events-none" />
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#92f7c3]/20 text-[#92f7c3] text-xs font-bold uppercase tracking-wider mb-4 border border-[#92f7c3]/30">
              <span className="material-symbols-outlined text-sm">eco</span>
              <span>Member Privileges</span>
            </div>

            <h3 className="font-serif-display text-2xl font-bold mb-4 leading-snug">
              Radical Transparency With Every Sunrise Order
            </h3>

            <div className="space-y-4 text-xs text-[#c1c8c2] leading-relaxed">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#92f7c3]/20 text-[#92f7c3] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-base">nest_clock_farsight_analog</span>
                </div>
                <div>
                  <strong className="text-white block text-sm">Sunrise Harvest Priority</strong>
                  Your leafy greens, heirloom tomatoes, and berries are reserved directly at dawn.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#92f7c3]/20 text-[#92f7c3] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-base">recycling</span>
                </div>
                <div>
                  <strong className="text-white block text-sm">Zero-Waste Crate Exchange</strong>
                  Leave empty harvest totes on your porch for automatic sanitization & credit deposit.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-[#92f7c3]/20 text-[#92f7c3] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-base">notifications_active</span>
                </div>
                <div>
                  <strong className="text-white block text-sm">Status Push Updates</strong>
                  Instant notifications when your harvest is packed, en route, or safely dropped.
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/70">
              <span>Co-op Network</span>
              <span className="font-bold text-[#92f7c3]">100% Soil-First</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#92f7c3]/20 border border-[#006c48]/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#006c48] font-bold">
              <span className="material-symbols-outlined text-base">storefront</span>
              <span>Prefer browsing first?</span>
            </div>
            <button
              onClick={onNavigateToMarketplace}
              className="text-[#012d1d] font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              Back to Marketplace →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

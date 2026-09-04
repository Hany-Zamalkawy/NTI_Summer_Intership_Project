import React, { useState } from 'react';
import { OrderConfirmation } from '../types';
import { DeliveryMapTracker } from './DeliveryMapTracker';

interface OrdersViewProps {
  currentOrder: OrderConfirmation;
  onViewInvoice: () => void;
  onNavigateToMarketplace: () => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  currentOrder,
  onViewInvoice,
  onNavigateToMarketplace,
}) => {
  // Push Notification Subscription State
  const [isPushEnabled, setIsPushEnabled] = useState<boolean>(true);
  const [selectedMilestones, setSelectedMilestones] = useState<{ [key: string]: boolean }>({
    harvested: true,
    quality: true,
    dispatched: true,
    outForDelivery: true,
    delivered: true,
  });
  const [simulatedAlert, setSimulatedAlert] = useState<{
    show: boolean;
    title: string;
    message: string;
    status: string;
    time: string;
  } | null>(null);

  const primaryFarmOrigin =
    currentOrder.items.length > 0 ? currentOrder.items[0].origin : 'Mariout Greenhouses';

  const toggleMilestone = (key: string) => {
    setSelectedMilestones((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSimulateAlert = (statusType: 'harvested' | 'delivery') => {
    const alertData =
      statusType === 'harvested'
        ? {
            title: 'Sunrise Harvest Completed! 🌾',
            message: `Your harvest crate was just picked fresh at ${primaryFarmOrigin} and inspected for peak crispness. Preparing cold-chain packaging.`,
            status: 'Harvested',
            time: 'Just now (05:45 AM)',
          }
        : {
            title: 'Out for Delivery! 🚚',
            message: `Cold-Chain EV Van #4 is en route to 104 Organic Way. Driver ETA: ~18 minutes (${currentOrder.deliveryWindow}).`,
            status: 'Out for Delivery',
            time: 'Just now (07:15 AM)',
          };

    // Request native browser permission if supported
    if ('Notification' in window && Notification.permission === 'default') {
      try {
        Notification.requestPermission();
      } catch (e) {
        // Safe fallback in restricted iframes
      }
    }

    setSimulatedAlert({ show: true, ...alertData });
  };

  return (
    <div id="orders-screen" className="max-w-4xl mx-auto space-y-8 pb-24 relative">
      {/* Interactive In-App Push Notification Simulation Banner */}
      {simulatedAlert && simulatedAlert.show && (
        <div
          id="push-notification-toast"
          className="fixed top-24 right-4 md:right-10 z-50 max-w-md bg-[#012d1d] text-white p-4 rounded-2xl shadow-2xl border border-[#92f7c3]/40 animate-bounce-short flex items-start gap-3 backdrop-blur-md"
        >
          <div className="w-10 h-10 rounded-full bg-[#92f7c3] text-[#002114] flex items-center justify-center shrink-0 shadow-md">
            <span className="material-symbols-outlined text-xl">notifications_active</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#92f7c3]">
                Push Notification • {simulatedAlert.status}
              </span>
              <span className="text-[10px] text-white/70">{simulatedAlert.time}</span>
            </div>
            <h4 className="font-serif-display text-base font-bold text-white mt-0.5">
              {simulatedAlert.title}
            </h4>
            <p className="text-xs text-[#f3f4f5] opacity-90 mt-1 leading-relaxed">
              {simulatedAlert.message}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[11px] bg-white/15 px-2 py-0.5 rounded-md font-mono text-white/90">
                Order #{currentOrder.orderNumber}
              </span>
              <button
                onClick={() => setSimulatedAlert(null)}
                className="text-[11px] text-[#92f7c3] hover:underline font-bold ml-auto cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
          <button
            onClick={() => setSimulatedAlert(null)}
            className="text-white/60 hover:text-white cursor-pointer"
            aria-label="Close notification"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      <div>
        <h1 className="font-serif-display text-4xl font-bold text-[#012d1d] mb-2">
          Your Farm Orders
        </h1>
        <p className="text-[#414844] text-base">
          Track active sunrise harvest orders with real-time farm-to-doorstep radar.
        </p>
      </div>

      {/* 1. Push Notification Subscription Toggle Card */}
      <section
        id="push-notifications-subscription-card"
        className="bg-white rounded-3xl p-6 md:p-8 border border-[#c1c8c2]/30 ambient-shadow"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#c1c8c2]/20 pb-6 mb-6">
          <div className="flex items-start gap-3.5">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                isPushEnabled ? 'bg-[#006c48] text-white' : 'bg-[#f3f4f5] text-[#414844]'
              }`}
            >
              <span className="material-symbols-outlined text-2xl">
                {isPushEnabled ? 'notifications_active' : 'notifications_off'}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-display text-xl font-bold text-[#012d1d]">
                  Harvest Box Status Push Notifications
                </h3>
                <span
                  className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                    isPushEnabled
                      ? 'bg-[#92f7c3]/30 text-[#006c48]'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {isPushEnabled ? 'Subscribed' : 'Notifications Paused'}
                </span>
              </div>
              <p className="text-xs md:text-sm text-[#414844] mt-1 max-w-xl leading-relaxed">
                Receive live mobile and web alerts as your crate passes through field harvest, temperature inspection, cold-chain loading, and doorstep delivery.
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-semibold text-[#414844]">
              {isPushEnabled ? 'Active' : 'Disabled'}
            </span>
            <button
              id="push-notifications-toggle-btn"
              type="button"
              role="switch"
              aria-checked={isPushEnabled}
              onClick={() => setIsPushEnabled(!isPushEnabled)}
              className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#006c48] ${
                isPushEnabled ? 'bg-[#006c48]' : 'bg-[#c1c8c2]'
              }`}
            >
              <div
                className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                  isPushEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Milestone Subscriptions & Simulation */}
        {isPushEnabled ? (
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[#012d1d] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-[#006c48]">tune</span>
              Select which harvest events ping your device:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                {
                  key: 'harvested',
                  label: "Harvested at Dawn",
                  desc: 'Field picking & quality weigh-in',
                  icon: 'nature',
                },
                {
                  key: 'dispatched',
                  label: 'Cold-Chain Dispatched',
                  desc: 'EV refrigerated transit departure',
                  icon: 'ac_unit',
                },
                {
                  key: 'outForDelivery',
                  label: 'Out for Delivery',
                  desc: 'Driver within 15 mins of doorstep',
                  icon: 'local_shipping',
                },
                {
                  key: 'delivered',
                  label: 'Doorstep Arrival',
                  desc: 'Contactless porch drop confirmation',
                  icon: 'home',
                },
                {
                  key: 'quality',
                  label: 'Quality & Sugar Brix Pass',
                  desc: 'Sugar brix & crispness certification',
                  icon: 'verified',
                },
              ].map((milestone) => {
                const checked = selectedMilestones[milestone.key];
                return (
                  <button
                    key={milestone.key}
                    type="button"
                    onClick={() => toggleMilestone(milestone.key)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                      checked
                        ? 'bg-[#92f7c3]/15 border-[#006c48]/40 shadow-2xs'
                        : 'bg-[#f8f9fa] border-[#c1c8c2]/30 opacity-60'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-base mt-0.5 shrink-0 ${
                        checked ? 'text-[#006c48]' : 'text-[#c1c8c2]'
                      }`}
                    >
                      {checked ? 'check_box' : 'check_box_outline_blank'}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#012d1d] flex items-center gap-1">
                        <span>{milestone.label}</span>
                      </div>
                      <div className="text-[11px] text-[#414844] mt-0.5 truncate">
                        {milestone.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Test Simulation Controls */}
            <div className="pt-3 border-t border-[#c1c8c2]/20 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-[#414844]">
                <span className="material-symbols-outlined text-sm text-[#006c48]">device_hub</span>
                <span>Delivery Alerts: Web Push + SMS (+1 •••-•••-2834)</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-[#414844] font-medium hidden sm:inline">
                  Test notifications:
                </span>
                <button
                  id="simulate-harvest-alert-btn"
                  onClick={() => handleSimulateAlert('harvested')}
                  className="px-3 py-1.5 bg-[#f3f4f5] hover:bg-[#012d1d] text-[#012d1d] hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 border border-[#c1c8c2]/30"
                >
                  <span className="material-symbols-outlined text-xs">nature</span>
                  <span>Simulate 'Harvested'</span>
                </button>
                <button
                  id="simulate-delivery-alert-btn"
                  onClick={() => handleSimulateAlert('delivery')}
                  className="px-3 py-1.5 bg-[#006c48] hover:bg-[#012d1d] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <span className="material-symbols-outlined text-xs">local_shipping</span>
                  <span>Simulate 'Out for Delivery'</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-gray-50 rounded-2xl text-xs text-[#414844] flex items-center justify-between">
            <span>
              Push notifications are paused. You will not receive alerts for harvest or delivery updates.
            </span>
            <button
              onClick={() => setIsPushEnabled(true)}
              className="text-[#006c48] font-bold hover:underline cursor-pointer ml-2 shrink-0"
            >
              Resume Notifications
            </button>
          </div>
        )}
      </section>

      {/* 2. Visual Delivery Progress Tracker with Map Path */}
      <DeliveryMapTracker
        orderNumber={currentOrder.orderNumber}
        farmOrigin={primaryFarmOrigin}
        destinationAddress="104 Organic Way, Green Valley, CA"
        deliveryWindow={currentOrder.deliveryWindow}
      />

      {/* 3. Active Order Details Card */}
      <div className="bg-white rounded-3xl p-8 border border-[#006c48]/30 shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#c1c8c2]/30 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#006c48] animate-pulse" />
              <span className="font-bold text-xs uppercase text-[#006c48] tracking-wider">
                Active Order In Progress
              </span>
            </div>
            <div className="font-serif-display text-2xl font-bold text-[#012d1d]">
              Order #{currentOrder.orderNumber}
            </div>
            <div className="text-xs text-[#414844] mt-0.5">
              Placed on {currentOrder.date} • Delivery Window: {currentOrder.deliveryWindow}
            </div>
          </div>

          <button
            onClick={onViewInvoice}
            className="px-6 py-2.5 rounded-full bg-[#012d1d] text-white text-xs font-bold hover:bg-[#1b4332] transition-colors cursor-pointer shadow-xs flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">receipt_long</span>
            <span>View Full Invoice</span>
          </button>
        </div>

        {/* Items Mini List */}
        <div className="space-y-3 mb-6">
          <div className="text-xs font-bold uppercase text-[#414844] tracking-wider">
            Items in this harvest box ({currentOrder.items.length})
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentOrder.items.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-[#f8f9fa] border border-[#c1c8c2]/25 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-sm text-[#191c1d]">{item.name}</div>
                  <div className="text-xs text-[#414844]">{item.origin}</div>
                </div>
                <div className="text-right font-bold text-sm text-[#012d1d]">
                  ${item.total.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-[#92f7c3]/20 rounded-2xl p-4 border border-[#006c48]/20 gap-3">
          <div className="flex items-center gap-2 text-xs text-[#002114]">
            <span className="material-symbols-outlined text-base text-[#006c48]">local_shipping</span>
            <span>Status: <strong>{currentOrder.status}</strong></span>
          </div>
          <div className="text-xs font-bold text-[#012d1d]">
            Total: ${currentOrder.totalPaid.toFixed(2)} (Paid)
          </div>
        </div>
      </div>

      {/* 4. Historical Orders Placeholder */}
      <div className="bg-white rounded-3xl p-8 border border-[#c1c8c2]/30 ambient-shadow">
        <h2 className="font-serif-display text-xl font-bold text-[#012d1d] mb-4">
          Past Delivered Harvests
        </h2>
        <div className="space-y-4">
          {[
            {
              id: 'FF-78310',
              date: 'Oct 17, 2023',
              total: 28.50,
              itemsCount: 4,
              farm: 'River Valley Veg & Orchard Hill'
            },
            {
              id: 'FF-69212',
              date: 'Oct 10, 2023',
              total: 32.00,
              itemsCount: 5,
              farm: 'Sunny Patch & Valley Roots Farm'
            }
          ].map((pastOrder) => (
            <div
              key={pastOrder.id}
              className="p-4 rounded-2xl bg-[#f8f9fa] border border-[#c1c8c2]/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
            >
              <div>
                <div className="font-bold text-sm text-[#191c1d]">
                  Order #{pastOrder.id}
                </div>
                <div className="text-xs text-[#414844]">
                  Delivered on {pastOrder.date} • {pastOrder.itemsCount} items from {pastOrder.farm}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-sm text-[#012d1d]">
                  ${pastOrder.total.toFixed(2)}
                </span>
                <button
                  onClick={onViewInvoice}
                  className="px-4 py-1.5 rounded-full border border-[#c1c8c2]/40 text-xs font-bold text-[#414844] hover:bg-white cursor-pointer"
                >
                  View Invoice
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center pt-4">
        <button
          onClick={onNavigateToMarketplace}
          className="px-8 py-3 rounded-full bg-[#012d1d] text-white text-sm font-bold hover:bg-[#1b4332] transition-colors cursor-pointer"
        >
          Shop More Produce
        </button>
      </div>
    </div>
  );
};

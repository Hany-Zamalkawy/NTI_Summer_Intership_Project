import React, { useState, useEffect } from 'react';

interface DeliveryMapTrackerProps {
  orderNumber: string;
  farmOrigin?: string;
  destinationAddress?: string;
  deliveryWindow?: string;
}

export const DeliveryMapTracker: React.FC<DeliveryMapTrackerProps> = ({
  orderNumber,
  farmOrigin = 'Mariout Greenhouses & El-Beheira Acres',
  destinationAddress = '104 Organic Way, Green Valley, CA',
  deliveryWindow = 'Tomorrow, 8:00 AM – 10:00 AM',
}) => {
  // Progress along the route: 0 (at farm) to 100 (arrived at destination)
  const [progress, setProgress] = useState<number>(45);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'map' | 'details'>('map');

  // Realistic delivery stages
  const stages = [
    { pct: 0, label: 'Harvest Packed', time: '06:30 AM', desc: 'Packed into compostable insulated totes' },
    { pct: 25, label: 'Departed Farm', time: '07:15 AM', desc: 'Leaving Valley Roots & Mariout Greenhouses' },
    { pct: 55, label: 'En Route', time: '07:45 AM', desc: 'Electric Van #EC-04 cruising via Valley Pkwy' },
    { pct: 85, label: 'Entering Neighborhood', time: '08:15 AM', desc: '2 stops ahead in Green Valley Hills' },
    { pct: 100, label: 'Arrived at Door', time: '08:35 AM', desc: 'Contactless porch drop completed' },
  ];

  // Gentle automatic live simulation increment
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) return 20; // loop back to en-route for continuous anticipation
        return prev + 1;
      });
    }, 1800);
    return () => clearInterval(interval);
  }, [isSimulating]);

  // SVG coordinates for a winding scenic rural route from (80, 240) to (520, 90)
  // Total curve length is mapped dynamically
  // We compute approximate (x, y) along a cubic bezier curve:
  // P0 = (70, 230), P1 = (180, 310), P2 = (340, 60), P3 = (530, 110)
  const t = progress / 100;
  // Cubic Bezier interpolation: (1-t)^3*P0 + 3*(1-t)^2*t*P1 + 3*(1-t)*t^2*P2 + t^3*P3
  const p0 = { x: 70, y: 220 };
  const p1 = { x: 190, y: 310 };
  const p2 = { x: 330, y: 60 };
  const p3 = { x: 530, y: 110 };

  const oneMinusT = 1 - t;
  const vanX =
    Math.pow(oneMinusT, 3) * p0.x +
    3 * Math.pow(oneMinusT, 2) * t * p1.x +
    3 * oneMinusT * Math.pow(t, 2) * p2.x +
    Math.pow(t, 3) * p3.x;

  const vanY =
    Math.pow(oneMinusT, 3) * p0.y +
    3 * Math.pow(oneMinusT, 2) * t * p1.y +
    3 * oneMinusT * Math.pow(t, 2) * p2.y +
    Math.pow(t, 3) * p3.y;

  // Approximate distance remaining
  const totalDistanceKm = 18.4;
  const remainingKm = Math.max(0.2, ((100 - progress) / 100) * totalDistanceKm).toFixed(1);
  const estimatedMins = Math.max(2, Math.round(((100 - progress) / 100) * 32));

  return (
    <div
      id="delivery-progress-tracker"
      className="bg-white rounded-3xl border border-[#c1c8c2]/30 ambient-shadow overflow-hidden"
    >
      {/* Tracker Top Header */}
      <div className="p-6 md:p-8 bg-[#f8f9fa] border-b border-[#c1c8c2]/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#006c48] animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#006c48]">
              Live Delivery Radar
            </span>
          </div>
          <h2 className="font-serif-display text-2xl font-bold text-[#012d1d]">
            Fresh Harvest Route Tracker
          </h2>
          <p className="text-xs text-[#414844] mt-0.5">
            Order <span className="font-mono font-bold text-[#191c1d]">#{orderNumber}</span> • Dispatched via Zero-Emissions Cold-Chain Van
          </p>
        </div>

        {/* Live ETA Card */}
        <div className="bg-white rounded-2xl p-4 border border-[#c1c8c2]/30 shadow-xs flex items-center gap-4 shrink-0">
          <div className="w-12 h-12 rounded-xl bg-[#92f7c3]/30 text-[#006c48] flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">local_shipping</span>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider font-bold text-[#414844]">
              Estimated Arrival
            </div>
            <div className="text-lg font-bold text-[#012d1d] flex items-center gap-2">
              <span>in ~{estimatedMins} mins</span>
              <span className="text-xs font-normal text-[#006c48] bg-[#92f7c3]/40 px-2 py-0.5 rounded-full">
                {remainingKm} km away
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cartographic Visual Route Canvas */}
      <div className="relative bg-[#f4f7f4] border-b border-[#c1c8c2]/30 overflow-hidden select-none">
        {/* Scenic Background Terrain Texture */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#006c48" strokeWidth="0.5" strokeOpacity="0.12" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Decorative Nature Landscape Patches */}
        <div className="absolute top-4 left-10 text-[11px] font-semibold text-[#86af99] flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">nature</span>
          <span>Green Valley Organic Orchards</span>
        </div>
        <div className="absolute bottom-4 right-12 text-[11px] font-semibold text-[#86af99] flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">home_pin</span>
          <span>Residential District 4</span>
        </div>
        <div className="absolute top-1/2 left-1/3 text-[11px] font-semibold text-[#86af99]/80 flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">water</span>
          <span>River Valley Greenway</span>
        </div>

        {/* Interactive SVG Path */}
        <div className="w-full h-72 sm:h-80 md:h-96 relative flex items-center justify-center p-4">
          <svg
            viewBox="0 0 600 320"
            className="w-full h-full max-w-2xl drop-shadow-sm overflow-visible"
          >
            <defs>
              {/* Route Glow Filter */}
              <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#006c48" floodOpacity="0.3" />
              </filter>
              <linearGradient id="routeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#86af99" />
                <stop offset="60%" stopColor="#006c48" />
                <stop offset="100%" stopColor="#012d1d" />
              </linearGradient>
            </defs>

            {/* Background Road Corridor (Gray Wide) */}
            <path
              d="M 70 220 C 190 310, 330 60, 530 110"
              fill="none"
              stroke="#e1e6e2"
              strokeWidth="14"
              strokeLinecap="round"
            />

            {/* Secondary Rural Trails */}
            <path
              d="M 70 220 C 120 160, 160 140, 210 160"
              fill="none"
              stroke="#d0d7d2"
              strokeWidth="3"
              strokeDasharray="4,4"
            />
            <path
              d="M 330 60 C 370 120, 420 180, 470 200"
              fill="none"
              stroke="#d0d7d2"
              strokeWidth="3"
              strokeDasharray="4,4"
            />

            {/* Active Delivery Flow Path (Green Animated Dash) */}
            <path
              d="M 70 220 C 190 310, 330 60, 530 110"
              fill="none"
              stroke="url(#routeGradient)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="10, 6"
              className="animate-pulse"
            />

            {/* Intermediate Checkpoint / Transfer Station */}
            <g transform="translate(260, 185)">
              <circle r="6" fill="#ffffff" stroke="#006c48" strokeWidth="2.5" />
              <text x="12" y="4" fontSize="10" fontWeight="bold" fill="#012d1d">
                Cold-Chain Waypoint (4.1°C)
              </text>
            </g>

            {/* 1. Farm Origin Pin */}
            <g transform="translate(70, 220)" className="cursor-pointer">
              <circle r="20" fill="#006c48" fillOpacity="0.15" />
              <circle r="14" fill="#006c48" />
              <circle r="6" fill="#ffffff" />
              <text x="-40" y="32" fontSize="11" fontWeight="bold" fill="#012d1d">
                Farm Origin
              </text>
              <text x="-50" y="45" fontSize="9" fill="#414844">
                {farmOrigin.split('&')[0]}
              </text>
            </g>

            {/* 2. Destination Home Pin */}
            <g transform="translate(530, 110)" className="cursor-pointer">
              <circle r="22" fill="#012d1d" fillOpacity="0.15" />
              <circle r="15" fill="#012d1d" />
              <circle r="6" fill="#92f7c3" />
              <text x="-35" y="32" fontSize="11" fontWeight="bold" fill="#012d1d">
                Your Kitchen
              </text>
              <text x="-45" y="45" fontSize="9" fill="#414844">
                {destinationAddress.split(',')[0]}
              </text>
            </g>

            {/* 3. Live Courier Electric Van Position on Path */}
            <g transform={`translate(${vanX}, ${vanY})`}>
              {/* Radar pulse ripples */}
              <circle r="26" fill="#006c48" fillOpacity="0.12" className="animate-ping" />
              <circle r="18" fill="#ffffff" stroke="#006c48" strokeWidth="3" filter="url(#routeGlow)" />
              {/* Van icon center */}
              <circle r="12" fill="#006c48" />
              <text
                x="0"
                y="4"
                textAnchor="middle"
                fontSize="11"
                fill="#ffffff"
                fontFamily="sans-serif"
                fontWeight="bold"
              >
                ⚡
              </text>

              {/* Dynamic Bubble above courier */}
              <g transform="translate(0, -28)">
                <rect
                  x="-42"
                  y="-18"
                  width="84"
                  height="22"
                  rx="6"
                  fill="#012d1d"
                  opacity="0.95"
                />
                <text
                  x="0"
                  y="-4"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="10"
                  fontWeight="bold"
                >
                  Van • {progress}%
                </text>
              </g>
            </g>
          </svg>
        </div>

        {/* Live Route Telemetry Badges */}
        <div className="p-4 bg-white/90 backdrop-blur-sm border-t border-[#c1c8c2]/30 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006c48] text-base">thermostat</span>
              <span>Cargo Temp: <strong className="text-[#006c48]">3.8°C (Cold-Chain Safe)</strong></span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006c48] text-base">speed</span>
              <span>Speed: <strong>36 mph</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006c48] text-base">eco</span>
              <span>100% Electric Vehicle</span>
            </div>
          </div>

          {/* Simulation Toggle */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-[11px] text-[#414844]">Auto-Radar:</span>
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                isSimulating
                  ? 'bg-[#006c48] text-white'
                  : 'bg-[#e1e3e4] text-[#414844]'
              }`}
            >
              {isSimulating ? 'Live Pulse ON' : 'Paused'}
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Milestones & Route Waypoints */}
      <div className="p-6 md:p-8 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-serif-display text-lg font-bold text-[#012d1d]">
            Delivery Milestones &amp; Anticipation Timeline
          </h3>
          <span className="text-xs text-[#414844] font-medium">
            Next Harvest Update in ~5 mins
          </span>
        </div>

        {/* Interactive Progress Slider */}
        <div>
          <div className="flex justify-between text-xs text-[#414844] mb-2 font-medium">
            <span>Farm Gate (0%)</span>
            <span className="text-[#006c48] font-bold">Current: {progress}% Complete</span>
            <span>Your Doorstep (100%)</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => {
              setIsSimulating(false);
              setProgress(Number(e.target.value));
            }}
            className="w-full h-2.5 bg-[#e1e3e4] rounded-lg appearance-none cursor-pointer accent-[#006c48]"
          />
        </div>

        {/* Horizontal Milestone Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          {stages.map((st, idx) => {
            const isDone = progress >= st.pct;
            const isCurrent =
              progress >= st.pct && (idx === stages.length - 1 || progress < stages[idx + 1].pct);

            return (
              <button
                key={idx}
                onClick={() => {
                  setIsSimulating(false);
                  setProgress(st.pct);
                }}
                className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                  isCurrent
                    ? 'bg-[#92f7c3]/30 border-[#006c48] shadow-xs'
                    : isDone
                    ? 'bg-[#f8f9fa] border-[#c1c8c2]/30 opacity-90'
                    : 'bg-white border-[#c1c8c2]/20 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isDone
                        ? 'bg-[#006c48] text-white'
                        : 'bg-[#e1e3e4] text-[#414844]'
                    }`}
                  >
                    {isDone ? '✓' : idx + 1}
                  </span>
                  <span className="text-[10px] font-mono text-[#414844]">{st.time}</span>
                </div>
                <div className="font-bold text-xs text-[#191c1d] leading-tight">
                  {st.label}
                </div>
                <div className="text-[11px] text-[#414844] mt-1 line-clamp-2 leading-snug">
                  {st.desc}
                </div>
              </button>
            );
          })}
        </div>

        {/* Courier & Delivery Instructions Bar */}
        <div className="bg-[#f8f9fa] rounded-2xl p-4 border border-[#c1c8c2]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#012d1d] text-white flex items-center justify-center font-bold text-sm shrink-0">
              JM
            </div>
            <div>
              <div className="font-bold text-[#191c1d] text-sm">Jesse M. • Electric Van Courier</div>
              <div className="text-[#414844]">Trained in cold-chain handling &amp; organic produce care</div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => alert('Delivery instruction recorded: "Leave on front porch in shaded area."')}
              className="flex-1 sm:flex-none px-4 py-2 bg-white hover:bg-gray-50 border border-[#c1c8c2]/40 rounded-full font-bold text-[#012d1d] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">edit_note</span>
              <span>Porch Instructions</span>
            </button>
            <button
              onClick={() => alert('Driver Concierge notified: Driver will ring doorbell upon sunrise drop.')}
              className="flex-1 sm:flex-none px-4 py-2 bg-[#012d1d] hover:bg-[#1b4332] text-white rounded-full font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">notifications_active</span>
              <span>Drop Alert</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

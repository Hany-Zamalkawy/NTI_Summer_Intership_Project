# 🌿 FarmFlow — Organic Farm-to-Table Marketplace

> **Peak-fresh organic harvest marketplace, farm box subscriptions, live zero-emission delivery tracking, intelligent recipe pairing, and farm provenance invoices.**

[![React](https://img.shields.io/badge/React-19.0-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Status](https://img.shields.io/badge/Production-Ready-006c48)](#)

---

## 📖 Overview

**FarmFlow** connects local sustainable agriculture cooperatives directly to conscious consumers. Built with a desktop-first, mobile-responsive interface in **React 19**, **TypeScript**, and **Tailwind CSS**, the platform ensures absolute transparency from soil to doorstep—showcasing harvest timestamps, farm provenance distances, real-time basket recipe matching, and zero-emission refrigerated delivery routes.

---

## ✨ Key Features

### 🥕 1. Sunrise Harvest Marketplace
- **Peak Freshness Catalog**: Morning-harvested vegetables (Crisp Romaine, Heirloom Rainbow Carrots, Vine-Ripened Tomatoes, Curly Tuscan Kale) and orchard fruits with exact harvest timestamps (e.g., *"Picked 2 hrs ago"*).
- **Crispness & Flavor Badging**: Visual indicators for organic certification, water-drop crispness ratings, and farm origin distance in kilometers.
- **Branch & Category Filtration**: Quick switching between harvest branches including *Seasonal*, *New Arrivals*, *Best Sellers*, *Organic Greens & Roots*, and *Heirloom & Greenhouse*.

### 🍳 2. Farm-to-Kitchen Recipe Intelligence
- **Live Cart Ingredient Matching**: Scans items currently in your harvest basket and scores matching seasonal recipes with readiness percentages.
- **1-Click Basket Completion**: Automatically identifies missing produce items and allows users to add required recipe ingredients in a single click.
- **Interactive Cooking Modal**: Features step-by-step instructions, ingredient checklist checkboxes, chef's harvest tips, and one-tap clipboard recipe copying.

### 📦 3. Harvest Box Subscriptions
- **Flexible Plans**: Curated boxes designed for singles, couples, and families (Small Harvest, Family Organic Box, Chef's Specialty Crate).
- **Customizable Schedules**: Weekly, bi-weekly, or monthly delivery cadences with pause, skip, and customization controls.

### 🚚 4. Zero-Emission Delivery Tracker
- **Live Fleet Tracking**: Real-time refrigerated electric van visualization along delivery waypoints.
- **Climate Quality Monitor**: Displays continuous in-transit temperature monitoring (3°C–5°C) and estimated arrival time windows.

### 🧾 5. Digital Harvest Invoices & Receipts
- **Itemized Farm Transparency**: Comprehensive printable invoices itemizing farm sources, weight units, subtotal calculations, and batch lot numbers.
- **Direct Print / Export**: Native print styles tailored for clean physical receipt rendering.

### 👤 6. Member Account Hub & Authentication
- **User Profiles**: Account overview displaying harvest preferences, saved delivery addresses, and past order histories.
- **Sign-In / Registration**: Streamlined authentication flow with quick-switch demo login credentials.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 19 (Hooks, Functional Architecture) |
| **Language** | TypeScript 5.8 (Strict type safety) |
| **Styling & Design** | Tailwind CSS v4.1, Custom Glassmorphism, Material Symbols |
| **Animations** | Motion (`motion/react`) |
| **Icons** | Lucide React & Google Material Symbols |
| **Build Tool** | Vite 6.2 with Hot Module Replacement |
| **Dev Runtime** | Node.js with `tsx` & Express API compatibility |

---

## 📂 Project Structure

```text
├── .env.example               # Template for environment configuration
├── index.html                 # Application entry HTML with metadata tags
├── metadata.json              # Platform capabilities & project descriptors
├── package.json               # Package manifests and script definitions
├── python_basics.py           # Companion Python fundamentals script
├── tsconfig.json              # TypeScript compiler configuration
├── vite.config.ts             # Vite build & Tailwind CSS plugin settings
└── src/
    ├── App.tsx                # Core state coordinator & top-level layout
    ├── index.css              # Tailwind imports & custom utility classes
    ├── main.tsx               # DOM root mount entry
    ├── types.ts               # Shared TypeScript interfaces & models
    ├── data/
    │   ├── mockData.ts        # Farm catalog products, plans, and farms
    │   ├── recipes.ts         # Seasonal recipe data & cooking guides
    │   └── seasonalCalendar.ts# Monthly harvest availability calendar
    └── components/
        ├── AboutUsBranch.tsx             # Farm collective story & regenerative ethos
        ├── CartDrawer.tsx                # Slide-out basket with free-shipping bar
        ├── DeliveryMapTracker.tsx        # Interactive route map & climate metrics
        ├── InvoiceView.tsx               # Printable itemized harvest invoice
        ├── LoginBranchView.tsx           # Authentication & member sign-in
        ├── MarketplaceView.tsx           # Primary produce grid & branch filter
        ├── OrdersView.tsx                # Historic order records & reorder actions
        ├── SeasonalAvailabilityWidget.tsx# Interactive month-by-month crop calendar
        ├── SeasonalRecipeSuggestions.tsx # Kitchen recipes matched to cart produce
        ├── SideNavBar.tsx                # Collapsible desktop navigation bar
        ├── SubscriptionsView.tsx         # Recurring harvest box subscriptions
        ├── TopAppBar.tsx                 # Header with branch status & search
        └── YourAccountView.tsx           # Member settings & delivery preferences
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js** (v18.0 or higher) and **npm** installed on your machine:

```bash
node -v
npm -v
```

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/farmflow.git
   cd farmflow
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000` to interact with the application.

---

## 📜 Available Scripts

In the project root, you can execute:

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts Vite development server at `http://0.0.0.0:3000` |
| `npm run build` | Compiles production assets into `dist/` |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs `tsc --noEmit` to validate all TypeScript types |
| `npm run clean` | Cleans build artifacts and compiled distributions |

---

## 🎨 Design Philosophy

- **Farm-to-Table Palette**: Rooted in deep forest greens (`#012d1d`, `#006c48`), soft mint accents (`#92f7c3`), warm earthy ochres (`#6d230f`), and crisp neutral surfaces.
- **High-Contrast Legibility**: Strictly avoids washed-out text and complies with WCAG AA accessibility standards.
- **Anti-Slop Craftsmanship**: Mathematical padding ratios, custom rounded corners (`rounded-2xl`, `rounded-3xl`), zero purple/blue clichés, and authentic organic photography.

---

## 🐍 Bonus: Python Learning Companion

This repository includes a standalone learning script: [`python_basics.py`](./python_basics.py). It demonstrates foundational Python syntax:
- Primitive data types and string formatting
- Lists and dictionaries
- Conditional branch logic (`if`/`elif`/`else`)
- Loops (`for` enumerations, `while`)
- Reusable functions with type annotations

To run it:
```bash
python3 python_basics.py
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

*Handcrafted for fresh food lovers, local farmers, and sustainable agriculture.*

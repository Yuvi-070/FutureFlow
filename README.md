# FutureFlow — AI-Powered Investment & Trading Platform

> React 19 · Tailwind CSS v4 · Vite 8 · React Router v7

FutureFlow is a modern web application for an AI-powered investment and trading platform.
Built with a full React SPA architecture, Tailwind CSS utility-first styling, and live
TradingView chart integration.

## ✨ Features

- **Landing page** — animated hero, about section with live counters, services, projects, team, FAQ
- **Trading strategies** — Recharts-powered interactive strategy cards (Bullish, Bearish, Mean Reversion)
- **Live chart** — Full-page TradingView BTC/USD widget
- **Trader auth** — localStorage-based signup/login (demo-grade; replace with real backend)
- **Dashboard** — Portfolio overview with recent trades table and quick actions
- **Contact form** — Validated contact form with success state
- **Fully responsive** — Mobile-first design with collapsible navbar

## 🗂 Project Structure

```
src/
├── main.jsx                   # App entry
├── App.jsx                    # Router + layout composition
├── index.css                  # Tailwind v4 theme + global styles
│
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx         # Sticky nav, mobile menu, search modal
│   │   ├── Footer.jsx         # Newsletter, explore links, contact, social
│   │   └── PageHeader.jsx     # Breadcrumb hero for inner pages
│   ├── home/
│   │   ├── HeroSection.jsx    # Full-screen hero with CTA
│   │   ├── AboutSection.jsx   # About + animated counters
│   │   ├── ServicesSection.jsx
│   │   ├── ProjectsSection.jsx
│   │   ├── TeamSection.jsx    # Team cards with hover social icons
│   │   ├── FAQSection.jsx     # Accordion FAQ
│   │   └── TradingImportance.jsx
│   └── ui/
│       └── hooks.js           # useCountUp, useScrollReveal
│
└── pages/
    ├── Home.jsx
    ├── About.jsx
    ├── Services.jsx
    ├── Projects.jsx
    ├── Contact.jsx
    ├── Login.jsx              # Dark-theme trader login
    ├── Signup.jsx             # Dark-theme trader registration
    ├── Dashboard.jsx          # Post-login trading dashboard
    ├── TradeView.jsx          # TradingView full-page chart
    └── Strategies.jsx         # Recharts strategy cards

public/
└── img/                       # All images served statically
```

## 🚀 Getting Started

```bash
npm install
npm run dev       # Start development server
npm run build     # Production build → dist/
npm run preview   # Preview the production build
```

## 🎨 Theme Customisation

Brand colors are defined in `src/index.css`:

```css
@theme {
  --color-primary: #dc3545;       /* Brand red */
  --color-primary-dark: #b91c2a;
  --color-brand-dark: #1e293b;    /* Dark navy */
  --color-brand-navy: #0f172a;
}
```

Change `--color-primary` to instantly retheme all buttons, links, and accents.

## 📋 Filling in Details

| What to update | Where |
|---|---|
| Brand name / logo | `src/components/layout/Navbar.jsx` line 23, `Footer.jsx` line 37 |
| Contact address, phone, email | `src/components/layout/Footer.jsx` & `src/pages/Contact.jsx` |
| Team members | `src/components/home/TeamSection.jsx` |
| Services content | `src/components/home/ServicesSection.jsx` & `src/pages/Services.jsx` |
| Hero headline & sub-text | `src/components/home/HeroSection.jsx` |
| FAQ questions/answers | `src/components/home/FAQSection.jsx` |
| Social media links | `src/components/layout/Footer.jsx` |
| TradingView symbol | `src/pages/TradeView.jsx` (change `BINANCE:BTCUSDT`) |

## 📦 Dependencies

| Package | Version | Purpose |
|---|---|---|
| react | 19.x | UI framework |
| react-dom | 19.x | DOM renderer |
| react-router-dom | 7.x | Client-side routing |
| react-icons | 5.x | Icon components |
| recharts | 3.x | Strategy page charts |
| tailwindcss | 4.x | Utility-first CSS |
| @tailwindcss/vite | 4.x | Tailwind Vite plugin |
| vite | 8.x | Build tool |
| @vitejs/plugin-react | 6.x | React Fast Refresh |

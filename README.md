# ESTIN Average Calculator

A modern, full-stack grade calculator for students at **École Supérieure en Sciences et Technologies de l'Informatique et du Numérique (ESTIN)**. Built with Next.js 14, featuring a premium dark UI, 3D animated hero, and support for all semesters from 1CP through 2CS.

---

## ✦ Features

- **All semesters supported** — 1CP S1/S2, 2CP S1/S2, 1CS S1/S2, 2CS IA S1/S2, 2CS Cybersecurity S1/S2
- **Official grading formula** — exact module coefficients and credit weights from the ESTIN syllabus
- **Live unit averages** — weighted average computed in real time as you type
- **Pass / fail detection** — green for validated modules (≥10), red for failed ones, with credit tracking
- **Persistent state** — grades and semester are saved locally; reopen and pick up where you left off
- **Accordion layout** — units expand on tap, mobile-first design with a sticky Calculate bar
- **3D animated hero** — math-themed floating objects (helix spirals, graph nodes, matrix grids, torus knots) rendered with React Three Fiber
- **Scroll animations** — entrance effects powered by Framer Motion

---

## 🛠 Tech Stack

| Tool | Purpose |
|---|---|
| [Next.js 14](https://nextjs.org) (App Router) | Framework, SSR, routing |
| [TypeScript](https://www.typescriptlang.org) | Type safety |
| [Tailwind CSS v3](https://tailwindcss.com) | Styling |
| [Framer Motion](https://www.framer.com/motion) | Scroll animations & micro-interactions |
| [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) | 3D hero background |
| [Zustand](https://zustand-demo.pmnd.rs) + `persist` | Grade state with localStorage |
| [Vercel Analytics](https://vercel.com/analytics) | Usage analytics |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/islemredouane/ESTIN-Average-Calculator.git
cd ESTIN-Average-Calculator
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
npm start
```

---

## 📐 Grading Formula

Each module average is computed as:

```
Module Average = (Exam × 2 + TD) / 3
```

Unit and semester averages are weighted by module coefficients, following the official ESTIN grading policy.

---

## 📁 Project Structure

```
├── app/                  # Next.js App Router (layout, page, globals)
├── components/
│   ├── hero/             # 3D canvas, star field, floating geometries, hero text
│   ├── calculator/       # Unit accordion, module cards, grade inputs
│   ├── results/          # Semester summary card, unit result cards
│   ├── layout/           # Header (glass nav) and Footer (social links)
│   └── ui/               # Reusable primitives (ScrollReveal, GlassCard)
├── lib/
│   ├── data/             # Semester definitions with exact modules, coefs, credits
│   └── calculator.ts     # Pure grade calculation functions
└── store/
    └── calculatorStore.ts  # Zustand store with localStorage persistence
```

---

## 🌐 Deploy

The project is optimised for **Vercel**. Push to GitHub and import the repo on [vercel.com](https://vercel.com) — zero configuration needed.

---

## 👤 Author

**Redouane Mohamed Islem**
- GitHub: [@islemredouane](https://github.com/islemredouane)
- Instagram: [@isl8m.ai](https://www.instagram.com/isl8m.ai/)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

# Design Starter

Design Starter is a smart, interactive design system generator. It takes users through a streamlined 4-step questionnaire to understand their project's needs and automatically generates a high-fidelity design baseline, including typography systems, color palettes, and customizable grid layouts.

## 🚀 Features

- **Intelligence-Led Questionnaire**: Infers density, hierarchy, and visual voice based on product type and target vibe.
- **Dynamic Design Engine**: Generates harmonious typography scales and complementary color systems.
- **Real-Time Layout Customization**: Adjust columns, gutters, margins, and toggle sidebars with live visual feedback.
- **Interactive Previews**: Click-to-copy hex codes and live typography specimens.
- **Design Token Export**: Download your entire generated system as a high-fidelity JSON file for easy implementation.

## 🛠 Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🏃 Getting Started

### Prerequisites

- Node.js 18+ 
- npm / yarn / pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kristiankim/designstarter.git
   cd designstarter
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

- `/components/questionnaire.tsx`: The 4-step logic for system generation.
- `/components/results-view.tsx`: The primary system dashboard with interactive controls.
- `/lib/generator.ts`: The logic for mapping answers to design tokens.
- `/lib/store.ts`: Zustand store for persistence and state synchronization.

## 📄 License

MIT

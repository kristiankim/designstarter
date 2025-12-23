import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ProductType =
  | 'marketing'
  | 'consumer'
  | 'saas'
  | 'ecommerce'
  | 'devtool'
  | 'internal';

export type DesignFeel =
  | 'calm'
  | 'bold'
  | 'elegant'
  | 'playful'
  | 'technical';

export type Constraint =
  | 'standard'
  | 'high-contrast'
  | 'dense'
  | 'touch-first';

export interface DesignStarterState {
  // Questionnaire state
  step: number;
  answers: {
    productType: ProductType | null;
    feel: DesignFeel | null;
    constraint: Constraint | null;
    advanced: {
      primarySurface: 'mobile' | 'desktop' | 'responsive';
      brandVibe: number; // 0: Classic, 1: Neutral, 2: Trendy
      supportMode: 'light' | 'dark' | 'both';
    };
    projectName: string;
  };

  // Generation seeds
  seeds: {
    typography: number;
    color: number;
  };

  // Grid customization
  gridOverrides: {
    columns: number | null;
    gutter: string | null;
    margin: string | null;
    showSidebar: boolean;
  };

  // Actions
  setStep: (step: number) => void;
  setProductType: (type: ProductType) => void;
  setFeel: (feel: DesignFeel) => void;
  setConstraint: (constraint: Constraint) => void;
  updateAdvanced: (updates: Partial<DesignStarterState['answers']['advanced']>) => void;
  updateGridOverrides: (updates: Partial<DesignStarterState['gridOverrides']>) => void;
  setProjectName: (name: string) => void;
  refreshSection: (section: 'typography' | 'color') => void;
  reset: () => void;
}

export const useDesignStarterStore = create<DesignStarterState>()(
  persist(
    (set) => ({
      step: 1,
      answers: {
        productType: null,
        feel: null,
        constraint: null,
        advanced: {
          primarySurface: 'responsive',
          brandVibe: 1,
          supportMode: 'both',
        },
        projectName: '',
      },
      seeds: {
        typography: 0,
        color: 0,
      },
      gridOverrides: {
        columns: null,
        gutter: null,
        margin: null,
        showSidebar: false,
      },
      setStep: (step) => set({ step }),
      setProductType: (type) =>
        set((state) => ({
          answers: { ...state.answers, productType: type }
        })),
      setFeel: (feel) =>
        set((state) => ({
          answers: { ...state.answers, feel: feel }
        })),
      setConstraint: (constraint) =>
        set((state) => ({
          answers: { ...state.answers, constraint: constraint }
        })),
      updateAdvanced: (updates) =>
        set((state) => ({
          answers: {
            ...state.answers,
            advanced: { ...state.answers.advanced, ...updates }
          }
        })),
      updateGridOverrides: (updates) =>
        set((state) => ({
          gridOverrides: { ...state.gridOverrides, ...updates },
        })),
      setProjectName: (name) =>
        set((state) => ({
          answers: { ...state.answers, projectName: name }
        })),
      refreshSection: (section) =>
        set((state) => ({
          seeds: {
            ...state.seeds,
            [section]: state.seeds[section] + 1,
          },
        })),
      reset: () => set({
        step: 1,
        answers: {
          productType: null,
          feel: null,
          constraint: null,
          advanced: {
            primarySurface: 'responsive',
            brandVibe: 1,
            supportMode: 'both',
          },
          projectName: '',
        },
        seeds: {
          typography: 0,
          color: 0,
        },
        gridOverrides: {
          columns: null,
          gutter: null,
          margin: null,
          showSidebar: false,
        },
      }),
    }),
    {
      name: 'design-starter-storage',
    }
  )
);

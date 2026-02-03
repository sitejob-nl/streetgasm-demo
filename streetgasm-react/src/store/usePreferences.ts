import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PreferencesState {
  theme: 'dark' | 'light';
  accentColor: string;
  companyName: string;
  sidebarCollapsed: boolean;
  setTheme: (theme: 'dark' | 'light') => void;
  setAccentColor: (color: string) => void;
  setCompanyName: (name: string) => void;
  toggleSidebar: () => void;
}

export const usePreferences = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: 'dark',
      accentColor: '#fbbf24',
      companyName: 'Streetgasm',
      sidebarCollapsed: false,
      setTheme: (theme) => set({ theme }),
      setAccentColor: (accentColor) => set({ accentColor }),
      setCompanyName: (companyName) => set({ companyName }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    }),
    {
      name: 'streetgasm-preferences',
    }
  )
);

export default usePreferences;

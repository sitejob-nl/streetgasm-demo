import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PreferencesState {
    theme: 'dark' | 'light';
    accentColor: string;
    dashboardTitle: string;
    companyName: string;
    sidebarCollapsed: boolean;
    setTheme: (theme: 'dark' | 'light') => void;
    setAccentColor: (color: string) => void;
    setDashboardTitle: (title: string) => void;
    setCompanyName: (name: string) => void;
    toggleSidebar: () => void;
}

export const usePreferences = create<PreferencesState>()(
    persist(
        (set) => ({
            theme: 'dark',
            accentColor: '#fbbf24',
            dashboardTitle: 'StreetGasm Dashboard',
            companyName: 'StreetGasm',
            sidebarCollapsed: false,
            setTheme: (theme) => set({ theme }),
            setAccentColor: (accentColor) => set({ accentColor }),
            setDashboardTitle: (dashboardTitle) => set({ dashboardTitle }),
            setCompanyName: (companyName) => set({ companyName }),
            toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
        }),
        {
            name: 'streetgasm-preferences',
        }
    )
);

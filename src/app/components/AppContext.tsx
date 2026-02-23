import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppState {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  currentUser: typeof defaultUser;
  activeFamily: string;
  setActiveFamily: (id: string) => void;
}

const defaultUser = {
  id: '1',
  name: 'Priya Sharma',
  phone: '+91 98765 43210',
  avatar: 'PS',
  abhaId: '91-2847-3920-5816',
  bloodGroup: 'B+',
  age: 34,
  dob: '15 Mar 1992',
};

const AppContext = createContext<AppState>({
  darkMode: false,
  setDarkMode: () => {},
  currentUser: defaultUser,
  activeFamily: 'self',
  setActiveFamily: () => {},
});

export const useApp = () => useContext(AppContext);

export function AppProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(false);
  const [activeFamily, setActiveFamily] = useState('self');

  return (
    <AppContext.Provider value={{ darkMode, setDarkMode, currentUser: defaultUser, activeFamily, setActiveFamily }}>
      {children}
    </AppContext.Provider>
  );
}

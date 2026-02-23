import { createBrowserRouter } from 'react-router';

import AppLayout from './components/AppLayout';
import { SplashScreen, OnboardingScreens, SignInScreen, OTPScreen, ProfileSetupScreen } from './components/OnboardingFlow';
import HomeScreen from './components/HomeScreen';
import VaultScreen from './components/VaultScreen';
import TrackScreen from './components/TrackScreen';
import FamilyScreen from './components/FamilyScreen';
import AIScreen from './components/AIScreen';
import SOSScreen from './components/SOSScreen';
import { NutritionScreen, SettingsScreen, StatesScreen, DesignSystemPage } from './components/MoreScreens';

export const router = createBrowserRouter([
  { path: '/', Component: SplashScreen },
  { path: '/onboarding', Component: OnboardingScreens },
  { path: '/signin', Component: SignInScreen },
  { path: '/otp', Component: OTPScreen },
  { path: '/profile-setup', Component: ProfileSetupScreen },
  {
    path: '/app',
    Component: AppLayout,
    children: [
      { index: true, Component: HomeScreen },
      { path: 'home', Component: HomeScreen },
      { path: 'vault', Component: VaultScreen },
      { path: 'track', Component: TrackScreen },
      { path: 'family', Component: FamilyScreen },
      { path: 'ai', Component: AIScreen },
      { path: 'sos', Component: SOSScreen },
      { path: 'nutrition', Component: NutritionScreen },
      { path: 'settings', Component: SettingsScreen },
      { path: 'states', Component: StatesScreen },
      { path: 'design-system', Component: DesignSystemPage },
    ],
  },
]);

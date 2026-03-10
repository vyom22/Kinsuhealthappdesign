import { createBrowserRouter } from 'react-router';

import AppLayout from './components/AppLayout';
import { SplashScreen, OnboardingScreens, SignInScreen, OTPScreen, ProfileSetupScreen } from './components/OnboardingFlow';
import { ConsentManager } from './components/ConsentManager';
import HomeScreen from './components/HomeScreen';
import VaultScreen from './components/VaultScreen';
import TrackScreen from './components/TrackScreen';
import FamilyScreen from './components/FamilyScreen';
import AIScreen from './components/AIScreen';
import SOSScreen from './components/SOSScreen';
import { NutritionScreen, SettingsScreen, StatesScreen, DesignSystemPage } from './components/MoreScreens';
import { MedicationsScreen } from './components/MedicationsScreen';
import { ExerciseScreen } from './components/ExerciseScreen';
import { DietScreen } from './components/DietScreen';
import { SleepScreen } from './components/SleepScreen';
import { MoodScreen } from './components/MoodScreen';
import { CommunityScreen } from './components/CommunityScreen';

export const router = createBrowserRouter([
  { path: '/', Component: SplashScreen },
  { path: '/onboarding', Component: OnboardingScreens },
  { path: '/signin', Component: SignInScreen },
  { path: '/otp', Component: OTPScreen },
  { path: '/consent', Component: ConsentManager },
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
      { path: 'medications', Component: MedicationsScreen },
      { path: 'exercise', Component: ExerciseScreen },
      { path: 'diet', Component: DietScreen },
      { path: 'sleep', Component: SleepScreen },
      { path: 'mood', Component: MoodScreen },
      { path: 'community', Component: CommunityScreen },
    ],
  },
]);

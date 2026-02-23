import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AppProvider, useApp } from './components/AppContext';

function PhoneFrame() {
  return (
    <AppProvider>
      <PhoneFrameInner />
    </AppProvider>
  );
}

function PhoneFrameInner() {
  const { darkMode } = useApp();

  return (
    <div className="w-full h-dvh flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="relative w-full max-w-[390px] h-full max-h-[844px] bg-background rounded-none sm:rounded-[44px] shadow-2xl overflow-hidden sm:border-[6px] sm:border-slate-800">
        {/* Status bar indicator */}
        <div className={`absolute top-0 left-0 right-0 z-[100] pointer-events-none hidden sm:flex items-center justify-center pt-2 ${darkMode ? 'dark' : ''}`}>
          <div className="w-[120px] h-[28px] bg-black rounded-full" />
        </div>
        <div className={`size-full overflow-hidden relative ${darkMode ? 'dark' : ''}`}>
          <RouterProvider router={router} />
        </div>
      </div>
    </div>
  );
}

export default PhoneFrame;

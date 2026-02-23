import { Outlet, useNavigate, useLocation } from 'react-router';
import { Home, FolderLock, Activity, Users, Sparkles } from 'lucide-react';
import { useApp } from './AppContext';

const tabs = [
  { path: '/app/home', label: 'Home', icon: Home },
  { path: '/app/vault', label: 'Vault', icon: FolderLock },
  { path: '/app/track', label: 'Track', icon: Activity },
  { path: '/app/family', label: 'Family', icon: Users },
  { path: '/app/ai', label: 'AI', icon: Sparkles },
];

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useApp();
  const isSOSActive = location.pathname.includes('/sos');
  const hideNav = isSOSActive || location.pathname.includes('/design-system');

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <Outlet />
      </div>
      {!hideNav && (
        <nav className="flex-shrink-0 bg-card border-t border-border px-2 pb-5 pt-2">
          <div className="flex justify-around items-center">
            {tabs.map((tab) => {
              const isActive = location.pathname.startsWith(tab.path);
              const Icon = tab.icon;
              return (
                <button
                  key={tab.path}
                  onClick={() => navigate(tab.path)}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all min-w-[56px] ${
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className={`p-1 rounded-lg transition-all ${isActive ? 'bg-primary/10' : ''}`}>
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                  </div>
                  <span className={`text-[10px] ${isActive ? 'opacity-100' : 'opacity-70'}`}>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
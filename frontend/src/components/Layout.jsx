import { useEffect } from 'react';
import { Outlet, Navigate, useNavigate, NavLink } from 'react-router-dom';
import { LogOut, LayoutDashboard, Wallet, Settings, Moon, Sun } from 'lucide-react';
import { useStore } from '../store/useStore';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function Layout() {
  const { isAuthenticated, logout } = useStore();
  const navigate = useNavigate();

  // Theme logic is now handled in index.html head to prevent flash of unstyled content
  // useEffect was removed from here.

  const toggleDarkMode = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card shadow-sm flex flex-col hidden md:flex">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2">
            <Wallet className="h-6 w-6" /> FinQ
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavLink 
            to="/" 
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium",
              isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </NavLink>

          <NavLink 
            to="/settings" 
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-medium",
              isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Settings className="h-5 w-5" /> Ayarlar
          </NavLink>
        </nav>

        <div className="p-4 border-t border-border mt-auto">
          <button 
            onClick={toggleDarkMode}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <span className="dark:hidden flex items-center gap-3"><Moon className="h-5 w-5"/> Dark Mode</span>
            <span className="hidden dark:flex items-center gap-3"><Sun className="h-5 w-5"/> Light Mode</span>
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-destructive hover:bg-destructive/10 transition-colors mt-2"
          >
            <LogOut className="h-5 w-5" /> Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full relative">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card sticky top-0 z-10 w-full">
            <h1 className="text-xl font-bold text-primary flex items-center gap-2">
              <Wallet className="h-5 w-5" /> FinQ
            </h1>
            <div className="flex items-center gap-2">
              <button onClick={toggleDarkMode} className="p-2 text-muted-foreground">
                <Moon className="h-5 w-5 dark:hidden" />
                <Sun className="h-5 w-5 hidden dark:block" />
              </button>
              <button onClick={handleLogout} className="p-2 text-destructive">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
        </header>
        <div className="p-4 md:p-8 w-full max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

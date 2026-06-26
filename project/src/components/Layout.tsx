import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Shield,
  Activity,

  FileText,
  BarChart3,
  Sparkles,
  Menu,
  X,
  Hexagon,
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/profile', label: 'Ball Identity', icon: Shield },
  { path: '/lifecycle', label: 'Lifecycle', icon: Activity },
  { path: '/events', label: 'Incident Timeline', icon: FileText },
  { path: '/analytics', label: 'Research Analytics', icon: BarChart3 },
  { path: '/future', label: 'Future Research', icon: Sparkles },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-[#0a0e17] text-slate-200 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0f1623] border-r border-slate-800/50">
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800/50">
          <div className="w-8 h-8 rounded-lg bg-[#00d4ff]/10 flex items-center justify-center">
            <Hexagon className="w-5 h-5 text-[#00d4ff]" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wider text-white">BallOS</h1>
            <p className="text-[10px] text-slate-500 tracking-widest uppercase">FIFA Compliance</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-[#00d4ff]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-5 py-4 border-t border-slate-800/50">
          <div className="text-[10px] text-slate-600 tracking-widest uppercase">System Status</div>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-slate-400">All Systems Operational</span>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-[#0f1623] border-r border-slate-800/50 z-50 lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#00d4ff]/10 flex items-center justify-center">
                    <Hexagon className="w-5 h-5 text-[#00d4ff]" />
                  </div>
                  <div>
                    <h1 className="text-sm font-bold tracking-wider text-white">BallOS</h1>
                    <p className="text-[10px] text-slate-500 tracking-widest uppercase">FIFA Compliance</p>
                  </div>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-[#00d4ff]/10 text-[#00d4ff]'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#0f1623] border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#00d4ff]/10 flex items-center justify-center">
              <Hexagon className="w-4 h-4 text-[#00d4ff]" />
            </div>
            <span className="text-sm font-bold text-white">BallOS</span>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="text-slate-400 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

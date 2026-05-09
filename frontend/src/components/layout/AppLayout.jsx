import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import { Toaster } from 'react-hot-toast';

const AppLayout = () => (
  <div className="flex h-screen overflow-hidden bg-dark-primary">
    {/* Desktop sidebar */}
    <div className="hidden lg:flex">
      <Sidebar />
    </div>

    {/* Main content */}
    <main className="flex-1 overflow-y-auto scrollbar-hidden relative">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-cyber-grid bg-grid opacity-30 pointer-events-none" />
      <div className="relative z-10 p-4 lg:p-6 pb-24 lg:pb-6">
        <Outlet />
      </div>
    </main>

    {/* Mobile bottom nav */}
    <div className="lg:hidden">
      <MobileNav />
    </div>

    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: 'rgba(4, 15, 36, 0.95)',
          color: '#f0f9ff',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          fontSize: '13px',
          fontFamily: 'Inter, sans-serif'
        },
        success: { iconTheme: { primary: '#22c55e', secondary: 'rgba(4,15,36,0.95)' } },
        error: { iconTheme: { primary: '#ef4444', secondary: 'rgba(4,15,36,0.95)' } }
      }}
    />
  </div>
);

export default AppLayout;

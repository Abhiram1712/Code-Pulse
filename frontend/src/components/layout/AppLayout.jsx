import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import { Toaster } from 'react-hot-toast';

const AppLayout = () => (
  <div className="flex h-screen overflow-hidden" style={{ background: 'var(--void)' }}>
    {/* Ambient background orbs */}
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[120px] opacity-20"
        style={{ background: 'radial-gradient(circle, #00d4ff, transparent)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-[120px] opacity-15"
        style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
      <div className="absolute top-1/2 left-0 w-64 h-64 rounded-full blur-[100px] opacity-10"
        style={{ background: 'radial-gradient(circle, #e879f9, transparent)' }} />
    </div>

    {/* Desktop sidebar */}
    <div className="hidden lg:flex relative z-10">
      <Sidebar />
    </div>

    {/* Main content */}
    <main className="flex-1 overflow-y-auto scrollbar-none relative z-10">
      <div className="relative min-h-full p-4 lg:p-7 pb-24 lg:pb-8">
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
          background: 'rgba(0, 8, 20, 0.97)',
          color: '#e2e8f7',
          border: '1px solid rgba(0, 212, 255, 0.2)',
          borderRadius: '12px',
          backdropFilter: 'blur(20px)',
          fontSize: '13px',
          fontFamily: 'Space Grotesk, sans-serif',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(0,212,255,0.08)',
        },
        success: { iconTheme: { primary: '#10b981', secondary: 'rgba(0,8,20,0.97)' } },
        error: { iconTheme: { primary: '#f43f5e', secondary: 'rgba(0,8,20,0.97)' } },
      }}
    />
  </div>
);

export default AppLayout;

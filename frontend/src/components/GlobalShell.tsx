import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Crosshair, Users, Code, Info } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export default function GlobalShell() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-text-main flex flex-col font-sans relative overflow-hidden">
      {/* Background massive typography */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-5">
        <h1 className="text-[15rem] font-display whitespace-nowrap text-lavender font-bold">
          UTOPIA. DSABUDDY.
        </h1>
      </div>

      {/* Top Navigation Frame */}
      <header className="relative z-10 flex items-center justify-between p-6 border-b brutalist-border">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <Crosshair className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-bold font-display tracking-widest text-primary">DSABUDDY</h2>
          </div>
          <span className="font-mono text-xs text-text-muted opacity-80">
            {'>_'} EST_CONN: 192.168.0.1 | STATUS: SECURE
          </span>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 font-mono text-sm">
          <NavLink to="/" current={location.pathname === '/'}>DASHBOARD</NavLink>
          <NavLink to="/arena" current={location.pathname === '/arena'}>ARENA</NavLink>
          <NavLink to="/workspace" current={location.pathname === '/workspace'}>WORKSPACE</NavLink>
        </nav>

        {/* Right Info */}
        <div className="flex flex-col items-end font-mono text-xs text-text-muted gap-1">
          <span className="text-lavender">35.6762° N / 139.6503° E</span>
          <span>LOCAL_TIME: {new Date().toLocaleTimeString()}</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex">
        <Outlet />
      </main>

      {/* Footer / Status Bar */}
      <footer className="relative z-10 border-t brutalist-border p-2 flex justify-between font-mono text-[10px] text-text-muted">
        <div>[SYSTEM_KERNEL_v4.2.0]</div>
        <div className="text-primary animate-pulse">CONNECTION_ACTIVE</div>
      </footer>
    </div>
  );
}

function NavLink({ to, current, children }: { to: string; current: boolean; children: React.ReactNode }) {
  return (
    <Link to={to} className="relative group overflow-hidden">
      <span className={`block transition-colors duration-300 ${current ? 'text-primary' : 'text-text-main group-hover:text-primary'}`}>
        {current ? `[${children}]` : children}
      </span>
      {current && (
        <motion.div 
          layoutId="nav_indicator"
          className="absolute -bottom-1 left-0 right-0 h-[2px] bg-primary"
        />
      )}
    </Link>
  );
}

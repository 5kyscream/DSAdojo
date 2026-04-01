import React from 'react';
import { motion } from 'framer-motion';
import { Network, Activity, ShieldAlert, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 relative flex items-center justify-center min-h-[calc(100vh-100px)] p-8">
      
      {/* Massive Typographical Backdrop */}
      <h1 className="absolute z-0 text-[10vw] font-display font-bold text-surface opacity-30 select-none whitespace-nowrap -rotate-2">
        ADAPT OVERCOME
      </h1>

      {/* Central Floating Element representing the AI Brain */}
      <motion.div 
        animate={{ y: [0, -15, 0], rotate: [0, 1, -1, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="relative z-10 w-64 h-64 border p-4 brutalist-border flex items-center justify-center bg-background/80 backdrop-blur-md"
      >
        <Cpu className="w-24 h-24 text-lavender animate-pulse" />
        
        {/* HUD Targeting Brackets */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary"></div>

        <div className="absolute -top-6 bg-primary text-black font-mono text-xs px-2 py-0.5 font-bold">
          [CORE AI ENGINE]
        </div>
      </motion.div>

      {/* Connected Technical Callouts */}
      <div className="absolute top-32 left-32 z-10 hidden lg:block">
        <CalloutBox 
          title="DAILY TARGET" 
          value="GRAPH TRAVERSAL" 
          delay={0.1}
        />
        <svg className="absolute left-full top-1/2 w-48 h-px overflow-visible">
          <line x1="0" y1="0" x2="200" y2="40" stroke="#1f1f26" strokeWidth="1" />
          <rect x="195" y="35" width="10" height="10" fill="#ECE8E1" />
        </svg>
      </div>

      <div className="absolute bottom-32 right-32 z-10 hidden lg:block">
        <CalloutBox 
          title="CURRENT ELO" 
          value="RANK_DIAMOND // 1420" 
          delay={0.3}
          align="right"
        />
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20">
        <button 
          onClick={() => navigate('/workspace')}
          className="bg-primary text-black font-display font-bold text-2xl px-12 py-4 clip-chamfer hover:scale-105 transition-transform box-glow flex items-center gap-3 group"
        >
          <Network className="w-6 h-6 group-hover:rotate-12 transition-transform" />
          ENTER_WORKSPACE
        </button>
      </div>
    </div>
  );
}

function CalloutBox({ title, value, delay, align = "left" }: { title: string, value: string, delay: number, align?: 'left'|'right' }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: align === 'left' ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={`border brutalist-border p-3 bg-background min-w-[200px] flex flex-col ${align === 'right' ? 'items-end text-right' : 'items-start'}`}
    >
      <span className="font-mono text-[10px] text-text-muted select-none">{title}</span>
      <span className="font-display font-bold text-lg">{value}</span>
      <div className="w-full h-px bg-surface mt-2" />
    </motion.div>
  );
}

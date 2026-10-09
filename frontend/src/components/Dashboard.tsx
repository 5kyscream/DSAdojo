import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Activity, Target, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const [username, setUsername] = useState('AGENT');
  const [level, setLevel] = useState('CALIBRATING');
  const [showMatchHistory, setShowMatchHistory] = useState(false);
  const [stats, setStats] = useState({ elo: 1540, wins: 0, losses: 0, history: [] });
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem('dsabuddy_stats');
      if (raw) setStats(JSON.parse(raw));
    } catch {}

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUsername(data.user.email?.split('@')[0].toUpperCase() || 'AGENT');
        setLevel(data.user.user_metadata?.level || 'CALIBRATING');
      }
    });
  }, []);

  return (
    <div className="flex-1 bg-background relative overflow-hidden flex text-text-main w-full h-full">
      {/* Background Graphic Elements */}
      <div className="absolute inset-0 grid grid-cols-2 pointer-events-none">
        <div className="bg-background"></div>
        {/* Angular lavender backdrop replicating the screenshot design */}
        <div className="bg-[#bda6f7]/20 border-l-[1px] border-lavender/30" style={{ clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0 100%)' }}></div>
      </div>

      {/* Massive Overlapping Center Text */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-[15%] z-0 pointer-events-none w-[120%]">
        <h1 className="text-[18vw] font-display font-black text-white mix-blend-overlay opacity-30 tracking-tighter truncate w-full">
          {username}
        </h1>
      </div>

      {/* Left Metadata Pane */}
      <div className="relative z-10 p-16 flex flex-col justify-between w-1/3">
        <div>
           {/* Top abstract numeric marker */}
           <div className="font-mono text-sm tracking-widest text-primary border-b-2 border-primary w-8 pb-2 mb-2 font-bold">26.</div>
           
           <div className="font-mono text-[10px] text-text-muted mt-32 max-w-[280px] leading-loose text-justify opacity-80 border-l border-primary/30 pl-4 py-2 bg-gradient-to-r from-background to-transparent">
             TACTICAL GENIUS <b>{username}</b> USES LOGIC STRUCTURES TO ISOLATE, TRAP AND DISARM COMPILATION ERRORS.
             <br/><br/>
             THROUGH CUNNING AND ALGORITHMIC MANIPULATION, SHE FORCES ALL BUGS TO FEAR THE IDE ITSELF.
           </div>
        </div>
      </div>

      {/* Right Insights Pane (Mocking the Abilities section) */}
      <div className="relative z-10 flex-1 flex justify-end p-16">
        <div className="w-[500px] flex flex-col justify-end pb-12">
          
          <div className="flex justify-between items-end mb-8 border-b-2 border-surface pb-4">
            <h2 className="font-display font-black text-3xl tracking-widest text-primary uppercase">
              {showMatchHistory ? '[ MATCH_HISTORY ]' : '[ INSIGHTS ]'}
            </h2>
            <div className="flex gap-6 items-center text-lavender/50">
              <button 
                onClick={handleLogout} 
                className="font-mono text-[10px] font-bold text-primary border border-primary/50 px-3 py-1 hover:bg-primary hover:text-black transition-colors mr-2 clip-chamfer"
              >
                [PURGE_SESSION]
              </button>
              <button 
                onClick={() => setShowMatchHistory(prev => !prev)} 
                className="outline-none"
              >
                <Activity className={`w-6 h-6 hover:text-primary transition-colors cursor-pointer ${showMatchHistory ? 'text-primary' : ''}`} />
              </button>
              <Target className="w-6 h-6 hover:text-primary transition-colors cursor-pointer" />
              <Zap className="w-6 h-6 hover:text-primary transition-colors cursor-pointer" />
            </div>
          </div>
          
          <div className="relative">
            <AnimatePresence mode="wait">
              {!showMatchHistory ? (
                <motion.div
                  key="insights"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Main Insight Widget */}
                  <div className="bg-background/90 backdrop-blur-sm border border-surface p-8 mb-6 relative group cursor-pointer overflow-hidden clip-chamfer shadow-2xl hover:border-primary/50 transition-colors">
                    <div className="absolute top-0 right-0 bg-primary text-black font-mono text-[10px] font-bold px-3 py-1 uppercase">{level}</div>
                    <h3 className="font-display text-2xl font-bold tracking-widest mb-3 mt-4">GRAPH ALGORITHMS</h3>
                    <p className="font-mono text-[11px] text-text-muted leading-relaxed pr-4">
                      Equip yourself with filament logic arrays. Current analytics show a <span className="text-primary font-bold">42% failure rate</span> in deep-cycle traversal. The AI Engine has isolated this as your primary target for rank advancement.
                    </p>
                    <div className="mt-8 flex justify-between font-mono text-xs border-t border-surface pt-4 font-bold">
                      <span>WIN_RATE: 58%</span>
                      <span className="text-primary tracking-widest">AVG_TIME: 14m 20s</span>
                    </div>
                  </div>

                  <div className="bg-background/90 backdrop-blur-sm border border-surface p-8 relative group cursor-pointer overflow-hidden clip-chamfer shadow-2xl hover:border-lavender/50 transition-colors">
                    <div className="absolute top-0 right-0 bg-lavender text-black font-mono text-[10px] font-bold px-3 py-1">PROFICIENCY</div>
                    <h3 className="font-display text-2xl font-bold tracking-widest mb-3 mt-4 text-lavender">DYNAMIC PROGRAMMING</h3>
                    <p className="font-mono text-[11px] text-text-muted leading-relaxed pr-4">
                      Your strongest domain. Subnet optimization execution ranks in the <span className="text-lavender font-bold text-white">89th percentile</span> globally. Standby for Grandmaster tier competitive matchmaking scenarios.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="bg-background/90 backdrop-blur-sm border border-surface p-8 mb-6 relative group overflow-hidden clip-chamfer shadow-2xl transition-colors">
                     <div className="absolute top-0 right-0 bg-primary text-black font-mono text-[10px] font-bold px-3 py-1 uppercase">{stats.elo} ELO</div>
                     <h3 className="font-display text-2xl font-bold tracking-widest mb-3 mt-4">COMBAT RECORD</h3>
                     
                     <div className="flex gap-8 font-mono text-sm mb-6 border-b border-surface pb-4">
                         <div className="text-[#00FF9D]">WINS: {stats.wins}</div>
                         <div className="text-primary">LOSSES: {stats.losses}</div>
                         <div className="text-text-muted">WIN RATE: {stats.wins + stats.losses > 0 ? Math.round((stats.wins / (stats.wins + stats.losses)) * 100) : 0}%</div>
                     </div>
                     
                     <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                         {stats.history.length === 0 && <div className="text-text-muted font-mono text-xs opacity-50">No match records found in local storage.</div>}
                         {stats.history.map((match: any, idx: number) => (
                             <div key={idx} className="flex justify-between items-center bg-surface/50 p-3 border border-surface hover:border-text-muted transition-colors font-mono text-xs">
                                 <div>
                                     <span className={match.result === 'WINNER' ? 'text-[#00FF9D]' : 'text-primary'}>[{match.result}]</span>
                                     <span className="ml-3 font-bold text-white tracking-wider">{match.topic}</span>
                                     <span className="ml-3 opacity-50">vs {match.opponent}</span>
                                 </div>
                                 <div className={match.eloChange >= 0 ? 'text-[#00FF9D]' : 'text-primary'}>
                                     {match.eloChange >= 0 ? '+' : ''}{match.eloChange} ELO
                                 </div>
                             </div>
                         ))}
                     </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}

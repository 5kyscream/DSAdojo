import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { io, Socket } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

// Connect to local backend
const socket: Socket = io('http://localhost:4000');
const TOPICS = ['GRAPHS', 'DYNAMIC_PROGRAMMING', 'ARRAYS', 'RANDOM'];

export default function Arena() {
  const [matchFound, setMatchFound] = useState(false);
  const [opponent, setOpponent] = useState<{id: string, elo: number} | null>(null);
  const [queueTime, setQueueTime] = useState(0);
  const [topic, setTopic] = useState<string | null>(null);
  const navigate = useNavigate();
  const [userId] = useState(`USER_${Math.floor(Math.random() * 9000) + 1000}`);

  useEffect(() => {
    if (!topic) return;

    socket.emit('JOIN_QUEUE', { userId, elo: 1540, topic });

    socket.on('MATCH_FOUND', (data) => {
      setOpponent(data.opponent);
      setMatchFound(true);
    });

    const timer = setInterval(() => setQueueTime(t => t + 1), 1000);

    return () => {
      clearInterval(timer);
      socket.off('MATCH_FOUND');
    };
  }, [topic, userId]);

  const formatTime = (s: number) => `00:${s.toString().padStart(2, '0')}`;

  if (!topic) {
    return (
      <div className="flex-1 w-full flex bg-background relative overflow-hidden flex-col items-center justify-center p-12">
        <h1 className="text-4xl font-display text-primary font-bold mb-12 tracking-widest text-center shadow-primary/20 drop-shadow-lg">
          [SELECT_BATTLE_ENVIRONMENT]
        </h1>
        <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
          {TOPICS.map(t => (
            <button key={t} onClick={() => setTopic(t)} className="border-2 brutalist-border p-8 border-surface text-center font-mono text-xl text-text-muted hover:text-black hover:bg-primary hover:border-primary transition-colors cursor-pointer clip-chamfer group">
              {t}
              <div className="text-xs font-bold mt-2 opacity-0 group-hover:opacity-100">{'>_'} INITIALIZE</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full flex bg-background relative overflow-hidden">
      {/* Left Column - Deep Black */}
      <div className="flex-1 relative border-r-2 border-primary/20 flex flex-col justify-center p-12">
        <h1 className="text-[12vw] font-display text-surface font-bold leading-none select-none relative z-0">
          WAITING.
        </h1>
        
        <div className="absolute top-1/2 -translate-y-1/2 left-12 z-10 font-mono text-sm tracking-widest text-text-muted border brutalist-border p-6 w-80 bg-background">
          <div className="mb-4 text-primary w-fit border-b border-primary pb-1">[QUEUE_STATUS]</div>
          <div className="flex justify-between"><span>MODE:</span> <span>1v1 ELO BATTLE</span></div>
          <div className="flex justify-between"><span>MAP:</span> <span>{topic}</span></div>
          <div className="flex justify-between"><span>TIME:</span> <span>{formatTime(queueTime)}</span></div>
          <div className="mt-6 flex gap-2">
            <span className="text-primary animate-pulse w-3 h-3 bg-primary block rounded-full mt-1.5" />
            <span className="animate-pulse">Listening for sockets...</span>
          </div>
        </div>
      </div>

      {/* Right Column - Neon Red Utopia Tokyo Vibe */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: matchFound ? '0%' : '100%' }}
        transition={{ type: "spring", damping: 15 }}
        className="absolute top-0 right-0 bottom-0 w-1/2 bg-primary flex flex-col justify-center p-12 border-l-4 border-black box-shadow-xl"
      >
        <h1 className="text-[12vw] font-display text-black font-black leading-none select-none opacity-90 -rotate-2">
          MATCHED.
        </h1>
        
        {matchFound && opponent && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute top-1/2 -translate-y-1/2 right-12 z-10 w-96 border-2 border-black p-6 bg-primary text-black"
          >
            <div className="mb-4 text-black font-bold border-b-2 border-black pb-1 uppercase tracking-widest flex items-center justify-between">
              <span>[TARGET_ACQUIRED]</span>
              <span className="font-mono text-xs font-bold leading-none">{'>_'}</span>
            </div>
            <div className="font-display text-4xl mb-2 font-black">{opponent.id}</div>
            <div className="font-mono flex justify-between font-bold">
              <span>RANK:</span>
              <span>{opponent.elo} (DIAMOND)</span>
            </div>
            <div className="mt-8 border-t-2 border-black pt-4">
              <button 
                onClick={() => navigate('/workspace')} 
                className="w-full bg-black text-primary p-4 font-display font-bold text-xl clip-chamfer hover:bg-surface transition-colors focus:ring-4 ring-black/30"
              >
                ENTER {topic}
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
      
      {/* Central Glitch Overlay during transition */}
      {matchFound && (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="absolute inset-0 bg-white z-50 pointer-events-none mix-blend-difference"
        />
      )}
    </div>
  );
}

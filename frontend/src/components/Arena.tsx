import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { socket } from '../lib/socket';
import Editor from '@monaco-editor/react';

const TOPICS = ['GRAPHS', 'DYNAMIC_PROGRAMMING', 'ARRAYS', 'TREES', 'LINKED_LISTS', 'STRINGS', 'RANDOM'];

const PROBLEMS = [
  { id: 'P1', title: 'Node Penetration', topic: 'GRAPHS', difficulty: 'HARD', expectedTimeMs: 600000, desc: 'Find the shortest path to the core memory sector bypassing firewalls.', constraints: ['V <= 1000', 'Time: 1.5s'] },
  { id: 'P2', title: 'Memory Fragmentation', topic: 'ARRAYS', difficulty: 'EASY', expectedTimeMs: 300000, desc: 'Defragment a continuous block of physical memory sectors in place.', constraints: ['N <= 10^5', 'Space: O(1)'] },
  { id: 'P3', title: 'Subnet Routing', topic: 'DYNAMIC_PROGRAMMING', difficulty: 'HARD', expectedTimeMs: 1200000, desc: 'Maximize the total bandwidth routed through recursive subnets without exceeding node limits.', constraints: ['Edges <= 50000'] },
  { id: 'P4', title: 'Binary Tree Inversion', topic: 'TREES', difficulty: 'EASY', expectedTimeMs: 300000, desc: 'Invert a binary data structure to bypass access authorization.', constraints: ['Nodes <= 10^4'] },
  { id: 'P5', title: 'Cycle Detection Protocol', topic: 'LINKED_LISTS', difficulty: 'MEDIUM', expectedTimeMs: 400000, desc: 'Detect infinite loops within linear memory sequence pointers.', constraints: ['Nodes <= 10^4'] },
  { id: 'P6', title: 'Palindrome Substring Extraction', topic: 'STRINGS', difficulty: 'MEDIUM', expectedTimeMs: 500000, desc: 'Find the longest symmetric payload embedded within a data string.', constraints: ['Length <= 1000'] },
  { id: 'P7', title: 'Topological Sort Protocol', topic: 'GRAPHS', difficulty: 'MEDIUM', expectedTimeMs: 400000, desc: 'Determine the correct execution order of dependent operational modules.', constraints: ['V <= 10^4'] },
  { id: 'P8', title: 'Two Sum Cipher', topic: 'ARRAYS', difficulty: 'EASY', expectedTimeMs: 120000, desc: 'Find two memory sector addresses that sum up to the target hash value.', constraints: ['N <= 10^5'] },
  { id: 'P9', title: 'Knapsack Saturation', topic: 'DYNAMIC_PROGRAMMING', difficulty: 'HARD', expectedTimeMs: 1000000, desc: 'Maximize the value of uploaded data without exceeding the packet payload capacity.', constraints: ['Items <= 1000', 'Capacity <= 50000'] },
  { id: 'P10', title: 'Lowest Common Ancestor Node', topic: 'TREES', difficulty: 'MEDIUM', expectedTimeMs: 450000, desc: 'Find the closest shared parent node to reconnect two isolated sub-networks.', constraints: ['Nodes <= 10^5'] },
  { id: 'P11', title: 'Reverse Pointer Injection', topic: 'LINKED_LISTS', difficulty: 'EASY', expectedTimeMs: 180000, desc: 'Reverse the direction of sequential memory pointers to retrieve the hidden payload.', constraints: ['Nodes <= 5000'] },
  { id: 'P12', title: 'Longest Valid Substring', topic: 'STRINGS', difficulty: 'HARD', expectedTimeMs: 900000, desc: 'Extract the longest sequence of valid operational characters from corrupted output.', constraints: ['Length <= 10^5'] }
];

export default function Arena() {
  const [matchFound, setMatchFound] = useState(false);
  const [opponent, setOpponent] = useState<{id: string, elo: number} | null>(null);
  const [queueTime, setQueueTime] = useState(0);
  const [topic, setTopic] = useState<string | null>(null);
  const navigate = useNavigate();
  const [userId] = useState(`USER_${Math.floor(Math.random() * 9000) + 1000}`);

  // New Battle States
  const [battleStarted, setBattleStarted] = useState(false);
  const [activeProblem, setActiveProblem] = useState<any>(null);
  const [code, setCode] = useState(`function executeMatch(data) {\n  // DEFEAT YOUR OPPONENT\n  return false;\n}`);
  const [logs, setLogs] = useState<string[]>(['[ARENA SYS] Match initialized. Link established.']);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const [matchTime, setMatchTime] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate('/');
    });

    if (!topic) return;

    socket.emit('JOIN_QUEUE', { userId, elo: 1540, topic });

    socket.on('MATCH_FOUND', (data) => {
      setOpponent(data.opponent);
      setMatchFound(true);
      
      // Auto-pick problem based on topic for the match
      const p = PROBLEMS.find(p => p.topic === topic) || PROBLEMS[0];
      setActiveProblem(p);
      setCode(`function executeMatch(data) {\n  // Target: ${p.title}\n  // Write your logic here\n  return false;\n}`);
    });

    const timer = setInterval(() => setQueueTime(t => t + 1), 1000);

    return () => {
      clearInterval(timer);
      socket.off('MATCH_FOUND');
    };
  }, [topic, userId]);

  // Battle Match Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (battleStarted) {
      interval = setInterval(() => setMatchTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [battleStarted]);

  // Exec Logs hook
  useEffect(() => {
    const handleLog = (data: any) => setLogs(prev => [...prev, data.msg]);
    const handleResult = (data: any) => {
      setLogs(prev => [...prev, `[RESULT] ${data.status} | Time: ${data.time || 'N/A'} | Mem: ${data.mem || 'N/A'}`]);
      if (data.msg) setLogs(prev => [...prev, `[INFO] ${data.msg}`]);
    };

    socket.on('EXEC_LOG', handleLog);
    socket.on('EXEC_RESULT', handleResult);

    return () => {
      socket.off('EXEC_LOG', handleLog);
      socket.off('EXEC_RESULT', handleResult);
    };
  }, []);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleRunCode = () => {
    setLogs(['[ARENA SYS] Executing combat logic...']);
    socket.emit('SUBMIT_CODE', { 
      code, 
      problemId: activeProblem?.id || 'P1',
      userId,
      timeSpent: matchTime
    });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!topic) {
    return (
      <div className="flex-1 w-full flex bg-background relative overflow-hidden flex-col items-center justify-center p-12">
        <h1 className="text-4xl font-display text-primary font-bold mb-12 tracking-widest text-center shadow-primary/20 drop-shadow-lg">
          [SELECT_BATTLE_ENVIRONMENT]
        </h1>
        <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
          {TOPICS.map(t => (
            <button key={t} onClick={() => {
              let selectedTopic = t;
              if (t === 'RANDOM') {
                const otherTopics = TOPICS.filter(opt => opt !== 'RANDOM');
                selectedTopic = otherTopics[Math.floor(Math.random() * otherTopics.length)];
              }
              setTopic(selectedTopic);
            }} className="border-2 brutalist-border p-8 border-surface text-center font-mono text-xl text-text-muted hover:text-black hover:bg-primary hover:border-primary transition-colors cursor-pointer clip-chamfer group">
              {t}
              <div className="text-xs font-bold mt-2 opacity-0 group-hover:opacity-100">{'>_'} INITIALIZE</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ==== BATTLE SCREEN ====
  if (battleStarted && activeProblem) {
    return (
      <div className="flex-1 w-full h-full flex flex-col bg-background overflow-hidden relative min-h-0">
        {/* Battle Header */}
        <div className="bg-primary text-black p-4 flex justify-between items-center border-b border-black">
          <div className="flex flex-col">
            <span className="font-display font-bold text-xl uppercase tracking-widest leading-none">{userId}</span>
            <span className="text-[10px] font-mono font-bold opacity-80">1540 ELO</span>
          </div>
          
          <div className="flex flex-col items-center flex-1">
            <span className="font-display text-3xl font-black tracking-widest tabular-nums animate-pulse">{formatTime(matchTime)}</span>
            <div className="flex gap-2 items-center mt-1">
                <span className="text-[10px] font-mono border border-black px-1 uppercase tracking-widest font-bold">1v1 RANKED</span>
                <span className="text-[10px] font-mono uppercase tracking-widest font-bold">{activeProblem.topic}</span>
            </div>
          </div>

          <div className="flex flex-col text-right">
            <span className="font-display font-bold text-xl uppercase tracking-widest leading-none text-red-900">{opponent?.id || 'OPPONENT'}</span>
            <span className="text-[10px] font-mono font-bold text-red-900 opacity-80">{opponent?.elo || '???'} ELO</span>
          </div>
        </div>

        {/* Battle Workspace */}
        <div className="flex-1 flex bg-background min-w-0 min-h-0">
          
          {/* Left: Problem Desc */}
          <div className="w-[30%] flex flex-col min-h-0 border-r border-black bg-surface relative z-10">
            <div className="p-4 border-b border-black">
                <h2 className="font-display font-bold text-lg uppercase tracking-widest truncate">{activeProblem.title}</h2>
            </div>
            <div className="p-6 flex-1 overflow-auto opacity-90 font-sans tracking-wide leading-relaxed text-sm scrollbar-hide">
                <div className="flex items-center gap-2 mb-6">
                    <span className="bg-black text-primary text-[10px] px-2 py-1 font-mono">{activeProblem.difficulty}</span>
                </div>
                
                <p className="mb-6 font-mono text-sm leading-relaxed border-l-2 border-primary pl-4">{activeProblem.desc}</p>
                
                <div className="bg-background border border-black p-4 mt-8">
                    <h3 className="font-mono text-xs text-text-muted mb-2">[CONSTRAINTS]</h3>
                    <ul className="list-disc list-inside font-mono text-xs opacity-80 space-y-1">
                        {activeProblem.constraints?.map((c: string, i: number) => <li key={i}>{c}</li>)}
                    </ul>
                </div>
            </div>
          </div>
          
          {/* Right: Code Editor & Terminal */}
          <div className="flex-1 flex flex-col relative min-w-0 min-h-0">
             <div className="flex items-center justify-between px-4 py-2 border-b border-black bg-surface text-xs font-mono select-none">
                <span className="text-primary border-b border-primary pb-1 font-bold">combat_logic.js</span>
             </div>

             <div className="flex-1 relative">
               <Editor
                 height="100%"
                 defaultLanguage="javascript"
                 theme="vs-dark"
                 value={code}
                 onChange={(val) => setCode(val || '')}
                 options={{
                   minimap: { enabled: false },
                   fontFamily: 'JetBrains Mono',
                   fontSize: 14,
                   renderLineHighlight: 'none',
                   hideCursorInOverviewRuler: true
                 }}
               />
             </div>
             
             {/* Terminal */}
             <div className="h-48 border-t border-black flex flex-col bg-background">
                <div className="flex items-center justify-between p-2 border-b border-black font-mono text-[10px] text-text-muted">
                    <span className="animate-pulse">{'>_'} ARENA_CONSOLE</span>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="bg-background text-primary border border-primary px-4 py-2 hover:bg-primary hover:text-black transition-colors font-bold uppercase"
                        >
                            ABORT
                        </button>
                        <button 
                            onClick={handleRunCode}
                            className="bg-primary text-black font-bold px-8 py-2 hover:bg-white transition-colors"
                        >
                            FIRE PAYLOAD
                        </button>
                    </div>
                </div>
                <div className="p-4 font-mono text-xs flex flex-col gap-1 h-full overflow-auto scrollbar-hide">
                    {logs.map((log, i) => {
                        let color = 'text-text-muted';
                        if (log.includes('ACCEPTED')) color = 'text-[#00FF9D] font-bold';
                        else if (log.includes('WRONG_ANSWER')) color = 'text-primary font-bold';
                        else if (log.includes('ARENA SYS')) color = 'text-lavender';
                        return <span key={i} className={color}>{log}</span>;
                    })}
                    <div ref={logsEndRef} />
                </div>
             </div>
          </div>
          
        </div>
      </div>
    );
  }

  // ==== QUEUE / MATCHED SCREEN ====
  return (
    <div className="flex-1 w-full flex bg-background relative overflow-hidden">
      {/* Left Column - Deep Black */}
      <div className="flex-1 relative border-r border-black flex flex-col justify-center p-12">
        <h1 className="text-[12vw] font-display text-surface font-bold leading-none select-none relative z-0">
          WAITING.
        </h1>
        
        <div className="absolute top-1/2 -translate-y-1/2 left-12 z-10 font-mono text-sm tracking-widest text-text-muted border border-black p-6 w-80 bg-background shadow-2xl">
          <div className="mb-4 text-primary w-fit border-b border-primary pb-1">[QUEUE_STATUS]</div>
          <div className="flex justify-between"><span>MODE:</span> <span>1v1 ELO BATTLE</span></div>
          <div className="flex justify-between"><span>MAP:</span> <span>{topic}</span></div>
          <div className="flex justify-between"><span>TIME:</span> <span>{formatTime(queueTime)}</span></div>
          <div className="mt-6 flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <span className="text-primary animate-pulse w-3 h-3 bg-primary block rounded-full" />
              <span className="animate-pulse opacity-70">Listening for sockets...</span>
            </div>
            <button onClick={() => navigate('/dashboard')} className="text-xs font-bold text-primary hover:text-white underline">ABORT</button>
          </div>
        </div>
      </div>

      {/* Right Column - Neon Red Utopia Tokyo Vibe */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: matchFound ? '0%' : '100%' }}
        transition={{ type: "spring", damping: 15 }}
        className="absolute top-0 right-0 bottom-0 w-1/2 bg-primary flex flex-col justify-center p-12 border-l border-black shadow-[-20px_0_50px_rgba(255,51,102,0.1)] z-20"
      >
        <h1 className="text-[12vw] font-display text-black font-black leading-none select-none opacity-90 -rotate-2 mix-blend-overlay">
          MATCHED.
        </h1>
        
        {matchFound && opponent && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute top-1/2 -translate-y-1/2 right-12 z-30 w-96 border-2 border-black p-6 bg-primary text-black shadow-[10px_10px_0px_rgba(0,0,0,1)]"
          >
            <div className="mb-4 text-black font-bold border-b border-black pb-1 uppercase tracking-widest flex items-center justify-between">
              <span>[TARGET_ACQUIRED]</span>
              <span className="font-mono text-xs font-bold leading-none">{'>_'}</span>
            </div>
            <div className="font-display text-4xl mb-2 font-black">{opponent.id}</div>
            <div className="font-mono flex justify-between font-bold">
              <span>RANK:</span>
              <span>{opponent.elo} (DIAMOND)</span>
            </div>
            <div className="mt-8 border-t border-black pt-4">
              <button 
                onClick={() => setBattleStarted(true)} 
                className="w-full bg-black text-primary p-4 font-display font-bold text-xl uppercase hover:bg-white hover:text-black transition-colors"
              >
                ENTER COMBAT
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

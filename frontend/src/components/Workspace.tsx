import React, { useEffect, useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { socket } from '../lib/socket';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Search, Target, BrainCircuit } from 'lucide-react';

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

const TOPICS = ['ALL', 'GRAPHS', 'DYNAMIC_PROGRAMMING', 'ARRAYS', 'TREES', 'LINKED_LISTS', 'STRINGS'];
const DIFFICULTIES = ['ALL', 'EASY', 'MEDIUM', 'HARD'];

export default function Workspace() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [activeProblem, setActiveProblem] = useState(PROBLEMS[0]);

  const [code, setCode] = useState(`function executePayload(data) {\n  // Target localized logic error here\n  return false;\n}`);
  const [logs, setLogs] = useState<string[]>(['[SYS] Execution environment initialized.']);
  const [aiHints, setAiHints] = useState<string[]>(['> System ready for solo operations.']);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Timer State
  const [time, setTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Load problem template when problem changes
  useEffect(() => {
    setCode(`function executePayload(data) {\n  // Target: ${activeProblem.title}\n  // Write your logic here\n  return false;\n}`);
    setLogs([`[SYS] Loaded scenario: ${activeProblem.title}`]);
    setAiHints([`> Target acquired: ${activeProblem.topic}. Analytics show this is optimal for skill expansion.`]);
    setTime(0);
    setIsTimerRunning(false);
  }, [activeProblem]);


  useEffect(() => {
    socket.on('EXEC_LOG', (data) => {
      setLogs(prev => [...prev, data.msg]);
    });
    
    socket.on('EXEC_RESULT', (data) => {
      setLogs(prev => [...prev, `[RESULT] ${data.status} | Time: ${data.time || 'N/A'} | Mem: ${data.mem || 'N/A'}`]);
      if (data.msg) setLogs(prev => [...prev, `[INFO] ${data.msg}`]);
    });

    socket.on('AI_MENTOR_HINT', (data) => {
      setAiHints(prev => [...prev, `> ${data.hint}`]);
    });

    return () => {
      socket.off('EXEC_LOG');
      socket.off('EXEC_RESULT');
      socket.off('AI_MENTOR_HINT');
    };
  }, []);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleRunCode = () => {
    const userId = localStorage.getItem('username') || `GUEST`;
    setLogs(['[SYS] Submitting task to worker queue...']);
    socket.emit('SUBMIT_CODE', { 
      code, 
      problemId: activeProblem.id,
      userId,
      timeSpent: time
    });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const filteredProblems = PROBLEMS.filter(p => {
    if (selectedTopic !== 'ALL' && p.topic !== selectedTopic) return false;
    if (selectedDifficulty !== 'ALL' && p.difficulty !== selectedDifficulty) return false;
    return true;
  });

  return (
    <div className="flex-1 w-full h-full flex bg-background overflow-hidden relative min-h-0">
      
      {/* Collapsible Left Sidebar - Problem List */}
      <div 
        className={`bg-surface border-r border-black flex flex-col min-h-0 transition-all duration-300 ${isSidebarOpen ? 'w-80' : 'w-0 overflow-hidden'}`}
      >
        <div className="p-4 border-b border-black">
          <div className="flex items-center gap-2 text-primary font-display font-bold mb-4 uppercase tracking-widest">
            <BrainCircuit size={18} /> Problem Database
          </div>
          
          <select 
            className="w-full bg-background border border-black p-2 text-xs font-mono text-text-muted mb-2 clip-chamfer outline-none focus:border-primary"
            value={selectedTopic} onChange={e => setSelectedTopic(e.target.value)}
          >
            {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          
          <select 
            className="w-full bg-background border border-black p-2 text-xs font-mono text-text-muted clip-chamfer outline-none focus:border-primary"
            value={selectedDifficulty} onChange={e => setSelectedDifficulty(e.target.value)}
          >
            {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto p-2 scrollbar-hide">
          {filteredProblems.map(p => (
            <button
              key={p.id}
              onClick={() => setActiveProblem(p)}
              className={`w-full text-left p-4 mb-2 text-sm font-mono border transition-colors ${
                activeProblem.id === p.id 
                ? 'bg-primary border-primary text-black' 
                : 'bg-background border-black text-text-muted hover:border-primary hover:text-white'
              }`}
            >
              <div className="font-bold truncate">{p.title}</div>
              <div className="flex justify-between mt-2 text-[10px]">
                <span className="opacity-80">{p.topic}</span>
                <span className={
                  p.difficulty === 'HARD' ? 'text-red-500 font-bold' :
                  p.difficulty === 'MEDIUM' ? 'text-yellow-500 font-bold' :
                  'text-emerald-500 font-bold'
                }>[{p.difficulty}]</span>
              </div>
            </button>
          ))}
          {filteredProblems.length === 0 && (
            <div className="text-text-muted text-center text-xs font-mono p-4 opacity-50">
              No matching scenarios found
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Toggle Button */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute top-1/2 -translate-y-1/2 z-50 bg-primary text-black p-1 border border-black hover:bg-white transition-all duration-300 rounded-r-md shadow-md"
        style={{ left: isSidebarOpen ? '320px' : '0px' }}
      >
        {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      {/* Middle/Right Container */}
      <div className="flex-1 flex bg-background min-w-0 min-h-0">
        
        {/* Middle: Problem Description */}
        <div className="w-[35%] flex flex-col min-h-0 border-r border-black relative z-10 bg-background/90 min-w-0">
          <div className="p-4 border-b border-black flex items-center justify-between">
            <h2 className="font-display font-bold text-xl uppercase tracking-widest truncate">{activeProblem.title}</h2>
          </div>
          <div className="p-6 flex-1 overflow-auto opacity-90 font-sans tracking-wide leading-relaxed text-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-[10px] px-2 py-1 font-mono border border-black ${
                    activeProblem.difficulty === 'HARD' ? 'bg-red-500/20 text-red-500' :
                    activeProblem.difficulty === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-500' :
                    'bg-emerald-500/20 text-emerald-500'
                  }`}>
                {activeProblem.difficulty}
              </span>
              <span className="bg-primary/20 text-primary text-[10px] px-2 py-1 font-mono border border-primary">
                 {activeProblem.topic}
              </span>
            </div>
            
            <p className="mb-6 border-l-2 border-primary pl-4">{activeProblem.desc}</p>
            
            <div className="mb-6 bg-surface p-4 border border-surface/50">
              <h3 className="font-mono text-xs text-text-muted mb-2">[CONSTRAINTS]</h3>
              <ul className="list-disc list-inside font-mono text-xs opacity-80 space-y-1">
                {activeProblem.constraints?.map((c: string, i: number) => <li key={i}>{c}</li>)}
              </ul>
            </div>
            
            <div className="relative mt-8">
              <h3 className="font-mono text-xs text-text-muted mb-2 flex items-center gap-2"><Target size={14}/> [AI_MENTOR_TERMINAL]</h3>
              <div className="border border-lavender/30 p-4 bg-surface/50 font-mono text-xs text-lavender flex flex-col gap-2 min-h-32 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
                {aiHints.map((hint, i) => (
                  <span key={i} className={i === aiHints.length - 1 ? "animate-pulse font-bold" : "opacity-60"}>{hint}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Code Editor & Exec Console */}
        <div className="flex-1 flex flex-col relative min-w-0 min-h-0">
          
          <div className="flex items-center justify-between px-4 py-2 border-b border-black bg-surface text-xs font-mono select-none">
            <div className="flex gap-4">
              <span className="text-primary border-b border-primary pb-1">solution.js</span>
            </div>
            
            {/* Custom Timer Controls */}
            <div className="flex items-center gap-4 bg-background border border-black px-3 py-1 rounded-sm">
              <span className={`text-lg transition-colors ${isTimerRunning ? 'text-primary' : 'text-text-muted'}`}>
                {formatTime(time)}
              </span>
              <div className="flex items-center gap-1">
                <button onClick={() => setIsTimerRunning(!isTimerRunning)} className="hover:text-primary transition-colors text-text-muted">
                  {isTimerRunning ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <button onClick={() => { setIsTimerRunning(false); setTime(0); }} className="hover:text-primary transition-colors text-text-muted">
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>

            <select className="bg-transparent border-none outline-none cursor-pointer text-text-muted mix-blend-difference focus:text-primary">
              <option>JavaScript</option>
            </select>
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

          {/* Terminal/Runner Pane */}
          <div className="h-48 border-t border-black flex flex-col bg-background">
            <div className="flex items-center justify-between p-2 border-b border-black font-mono text-[10px] text-text-muted">
               <span>{'>_'} EXECUTION_CONSOLE</span>
               <button 
                 onClick={handleRunCode}
                 className="bg-primary text-black font-bold px-8 py-2 clip-chamfer hover:scale-105 hover:bg-white transition-all box-glow"
               >
                 SUBMIT LOGIC
               </button>
            </div>
            <div className="p-4 font-mono text-xs flex flex-col gap-1 h-full overflow-auto">
              {logs.map((log, i) => {
                let color = 'text-text-muted';
                if (log.includes('ACCEPTED')) color = 'text-[#00FF9D]';
                else if (log.includes('WRONG_ANSWER')) color = 'text-primary';
                else if (log.includes('[INFO]')) color = 'text-lavender';
                
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

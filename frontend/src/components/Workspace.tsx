import React, { useEffect, useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:4000');

export default function Workspace() {
  const [problem, setProblem] = useState<any>(null);
  const [code, setCode] = useState(`function executePayload(data) {\n  // Target localized logic error here\n  return false;\n}`);
  const [logs, setLogs] = useState<string[]>(['[SYS] AI Mentor Initializing...', '[SYS] Fetching tactical scenario targeting weak points...']);
  const [aiHints, setAiHints] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Analytics tracking
  const [sessionStart] = useState(Date.now());

  useEffect(() => {
    // Determine user via localStorage or default string
    const userLevel = localStorage.getItem('userLevel') || 'BEGINNER';
    const userId = localStorage.getItem('username') || `GUEST_${Math.floor(Math.random()*100)}`;
    
    // Request a targeted problem from the AI
    socket.emit('REQUEST_AI_PRACTICE', { userId, level: userLevel });

    socket.on('AI_PROBLEM_DISPENSED', (data) => {
       setProblem(data.problem);
       setLogs(prev => [...prev, `[SYS] Payload acquired: ${data.problem.title}`]);
       setAiHints([`> Target acquired: ${data.problem.topic}. Analytics show this is optimal for skill expansion.`]);
    });

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
      socket.off('AI_PROBLEM_DISPENSED');
      socket.off('EXEC_LOG');
      socket.off('EXEC_RESULT');
      socket.off('AI_MENTOR_HINT');
    };
  }, []);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleRunCode = () => {
    const timeSpent = Math.floor((Date.now() - sessionStart) / 1000);
    const userId = localStorage.getItem('username') || `GUEST`;

    setLogs(['[SYS] Submitting task to worker queue...']);
    socket.emit('SUBMIT_CODE', { 
      code, 
      problemId: problem?.id || 'P0',
      userId,
      timeSpent
    });
  };

  if (!problem) {
    return (
      <div className="flex-1 w-full bg-background flex flex-col items-center justify-center p-12">
        <h1 className="text-2xl font-mono text-primary animate-pulse tracking-widest">[CALCULATING_OPTIMAL_TACTICAL_SCENARIO]</h1>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full flex bg-background">
      {/* Left: Problem Pane */}
      <div className="w-[40%] flex flex-col border-r brutalist-border relative z-10 bg-background/90">
        <div className="p-4 border-b brutalist-border flex items-center justify-between">
          <h2 className="font-display font-bold text-xl uppercase tracking-widest">{problem.title}</h2>
          <span className="bg-primary/20 text-primary text-[10px] px-2 py-1 font-mono brutalist-border">
             {'>_'} {problem.topic}
          </span>
        </div>
        <div className="p-6 flex-1 overflow-auto opacity-90 font-sans tracking-wide leading-relaxed text-sm">
          <p className="mb-6 border-l-2 border-primary pl-4">{problem.desc}</p>
          <div className="mb-6 bg-surface p-4 border border-surface/50">
            <h3 className="font-mono text-xs text-text-muted mb-2">[CONSTRAINTS]</h3>
            <ul className="list-disc list-inside font-mono text-xs opacity-80 space-y-1">
              {problem.constraints?.map((c: string, i: number) => <li key={i}>{c}</li>)}
            </ul>
          </div>
          <div className="relative mt-auto">
            <h3 className="font-mono text-xs text-text-muted mb-2">[AI_MENTOR_TERMINAL]</h3>
            <div className="border border-lavender/30 p-4 bg-surface/50 font-mono text-xs text-lavender flex flex-col gap-2 min-h-32">
              {aiHints.map((hint, i) => (
                <span key={i} className={i === aiHints.length - 1 ? "animate-pulse font-bold" : "opacity-60"}>{hint}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right: Code Editor & Exec Console */}
      <div className="flex-1 flex flex-col relative">
        <div className="flex items-center justify-between px-4 py-2 border-b brutalist-border bg-surface text-xs font-mono select-none">
          <div className="flex gap-4">
            <span className="text-primary border-b border-primary pb-1">solution.js</span>
          </div>
          <select className="bg-transparent border-none outline-none cursor-pointer">
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
        <div className="h-48 border-t brutalist-border flex flex-col bg-background">
          <div className="flex items-center justify-between p-2 border-b brutalist-border font-mono text-[10px] text-text-muted">
             <span>{'>_'} EXECUTION_CONSOLE</span>
             <button 
               onClick={handleRunCode}
               className="bg-primary text-black font-bold px-8 py-2 clip-chamfer hover:scale-105 transition-transform box-glow"
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
  );
}

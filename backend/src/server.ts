import { GoogleGenAI } from '@google/genai';
import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);

// WebSocket Server for realtime events
const io = new Server(httpServer, {
  cors: {
    origin: '*', // Allow Vite frontend
    methods: ['GET', 'POST']
  }
});

// Initialize Gemini AI from the secure .env key
const ai_key = process.env.GEMINI_API_KEY;
const ai = ai_key ? new GoogleGenAI({ apiKey: ai_key }) : null;

// Mock Problem Database & AI Proficiency Stats
const PROBLEMS = [
  { id: 'P1', title: 'Node Penetration', topic: 'GRAPHS', expectedTimeMs: 600000, desc: 'Find the shortest path to the core memory sector bypassing firewalls.', constraints: ['V <= 1000', 'Time: 1.5s'] },
  { id: 'P2', title: 'Memory Fragmentation', topic: 'ARRAYS', expectedTimeMs: 300000, desc: 'Defragment a continuous block of physical memory sectors in place.', constraints: ['N <= 10^5', 'Space: O(1)'] },
  { id: 'P3', title: 'Subnet Routing', topic: 'DYNAMIC_PROGRAMMING', expectedTimeMs: 1200000, desc: 'Maximize the total bandwidth routed through recursive subnets without exceeding node limits.', constraints: ['Edges <= 50000'] },
  { id: 'P4', title: 'Binary Tree Inversion', topic: 'TREES', expectedTimeMs: 300000, desc: 'Invert a binary data structure to bypass access authorization.', constraints: ['Nodes <= 10^4'] },
  { id: 'P5', title: 'Cycle Detection Protocol', topic: 'LINKED_LISTS', expectedTimeMs: 400000, desc: 'Detect infinite loops within linear memory sequence pointers.', constraints: ['Nodes <= 10^4'] },
  { id: 'P6', title: 'Palindrome Substring Extraction', topic: 'STRINGS', expectedTimeMs: 500000, desc: 'Find the longest symmetric payload embedded within a data string.', constraints: ['Length <= 1000'] }
];

const userProficiency: Record<string, Record<string, { attempts: number, totalTime: number }>> = {};


// Matchmaking Queue (In-memory fallback for local demo without Redis)
interface QueuedPlayer {
  socketId: string;
  userId: string;
  elo: number;
  topic: string;
}
let matchQueue: QueuedPlayer[] = [];

io.on('connection', (socket: Socket) => {
  console.log(`[SYS] Client Connected: ${socket.id}`);

  // 1. Join Matchmaking Queue
  socket.on('JOIN_QUEUE', (data: { userId: string; elo: number, topic: string }) => {
    console.log(`[QUEUE] User ${data.userId} (Topic: ${data.topic}) joined queue.`);
    
    // Fix: Remove any existing entries for this socket to prevent React StrictMode double join
    matchQueue = matchQueue.filter(p => p.socketId !== socket.id);

    matchQueue.push({
      socketId: socket.id,
      userId: data.userId,
      elo: data.elo,
      topic: data.topic
    });

    evaluateQueue(data.topic);

  });

  // 1.5 AI Practice Dispenser
  socket.on('REQUEST_AI_PRACTICE', (data: { userId: string, level: string }) => {
    console.log(`[AI] Analyzing profile for ${data.userId} (Level: ${data.level})`);
    
    // Evaluate user proficiency dict to find their weakest topic (highest avg time or least attempts)
    const stats = userProficiency[data.userId] || {};
    let weakestTopic = 'ARRAYS'; // Default for beginners / cold start
    let worstScore = -1;

    for (const p of PROBLEMS) {
      const pStats = stats[p.topic];
      if (!pStats) {
        weakestTopic = p.topic; // Prioritize untried topics
        break;
      }
      const avgTime = pStats.totalTime / pStats.attempts;
      if (avgTime > worstScore) {
        worstScore = avgTime;
        weakestTopic = p.topic;
      }
    }

    console.log(`[AI] Weakest topic mapped: ${weakestTopic}. Dispensing targeted tactical operation.`);
    const problem = PROBLEMS.find(p => p.topic === weakestTopic)!;
    
    setTimeout(() => {
      socket.emit('AI_PROBLEM_DISPENSED', { problem });
    }, 1000); // Simulate ML inference delay
  });

  // 2. Code Execution Mock Runtime Listener
  socket.on('SUBMIT_CODE', async (data: { code: string; problemId: string, userId: string, timeSpent: number, roomId?: string }) => {
    console.log(`[EXEC] Running task ${data.problemId} for ${data.userId} - Time: ${data.timeSpent}s`);
    
    const prob = PROBLEMS.find(p => p.id === data.problemId) || PROBLEMS[0];

    // Store analytics
    if (prob) {
      if (!userProficiency[data.userId]) userProficiency[data.userId] = {};
      if (!userProficiency[data.userId][prob.topic]) userProficiency[data.userId][prob.topic] = { attempts: 0, totalTime: 0 };
      
      userProficiency[data.userId][prob.topic].attempts++;
      userProficiency[data.userId][prob.topic].totalTime += data.timeSpent;
    }

    // Simulate streaming execution logs
    setTimeout(() => socket.emit('EXEC_LOG', { msg: '[SYS] Container spun up successfully' }), 500);
    setTimeout(() => socket.emit('EXEC_LOG', { msg: '[SYS] Compiling...' }), 1000);
    
    // Process Execution & AI Hint (Requires awaits, so wrapping in internal async timeout resolver isn't perfect, just inline await with delay)
    setTimeout(async () => {
      if (data.code.includes('return true')) {
        socket.emit('EXEC_RESULT', { status: 'ACCEPTED', time: '14ms', mem: '42MB' });
        
        if (data.roomId) {
            console.log(`[MATCH] Room ${data.roomId} concluded. Winner: ${data.userId}`);
            io.to(data.roomId).emit('MATCH_OVER', { winnerId: data.userId });
        }
      } else {
        socket.emit('EXEC_RESULT', { status: 'WRONG_ANSWER', msg: 'Failed testcase 12/54' });
        
        if (ai) {
            socket.emit('AI_MENTOR_HINT', { hint: '[AI] Uplink established. Analyzing combat logic...' });
            try {
                const prompt = `You are an elite Cyberpunk DSA mentor logging into the mainframe. The user submitted this code for the problem "${prob.title}" (Topic: ${prob.topic}).\n\nProblem Description: ${prob.desc}\nConstraints: ${prob.constraints.join(', ')}\n\nUser's Code:\n${data.code}\n\nThe code failed execution.\n\nINSTRUCTIONS:\n1. If the code contains blatant syntax errors, reference errors, or gibberish (like undefined variables), call out the exact syntax failure in a strict cyberpunk tone.\n2. Otherwise, if the logic is just flawed, provide exactly ONE concise hint (max 2 sentences) to point them in the right direction.\n\nDo NOT write the code answer for them under any circumstances. Keep the tone sharp and professional.`;
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt
                });
                socket.emit('AI_MENTOR_HINT', { hint: response.text });
            } catch (err) {
                console.error("[AI ERROR] Failed to fetch Gemini hint.", err);
                socket.emit('AI_MENTOR_HINT', { hint: 'Mentor uplink severed. AI API failed to respond. Check API Key or Quota.' });
            }
        } else {
            console.error("[AI ERROR] No GEMINI_API_KEY provided.");
            socket.emit('AI_MENTOR_HINT', { hint: 'Mentor offline. No GEMINI_API_KEY detected in backend environment.' });
        }
      }
    }, 2000);
  });

  socket.on('disconnect', () => {
    console.log(`[SYS] Client Disconnected: ${socket.id}`);
    matchQueue = matchQueue.filter(p => p.socketId !== socket.id);
  });
});

// Core matching logic (Pair 2 players by Topic)
function evaluateQueue(targetTopic: string) {
  const eligiblePlayers = matchQueue.filter(p => p.topic === targetTopic);
  
  if (eligiblePlayers.length >= 2) {
    const p1 = eligiblePlayers[0];
    const p2 = eligiblePlayers[1];

    // Remove them from global queue
    matchQueue = matchQueue.filter(p => p.socketId !== p1.socketId && p.socketId !== p2.socketId);

    const roomId = `match_${p1.topic}_${Date.now()}`;

    // Force both sockets to join the isolated match room
    const s1 = io.sockets.sockets.get(p1.socketId);
    const s2 = io.sockets.sockets.get(p2.socketId);

    // If s1 is real, emit match. s2 could be ghost
    if (s1) {
      s1.join(roomId);
      s1.emit('MATCH_FOUND', {
        roomId,
        opponent: { id: p2.userId, elo: p2.elo, avatar: 'CYPHER_AVATAR' }
      });
    }

    if (s2) {
      s2.join(roomId);
      s2.emit('MATCH_FOUND', {
        roomId,
        opponent: { id: p1.userId, elo: p1.elo, avatar: 'JETT_AVATAR' }
      });
    }

    console.log(`[MATCH] Arena created: ${roomId} (${p1.userId} vs ${p2.userId})`);
  }
}

// REST API Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'Platform Systems Operational', queueSize: matchQueue.length });
});

const PORT = 4000;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`[SYS] DSADojo Backend & WS Gateway listening on port ${PORT}`);
});

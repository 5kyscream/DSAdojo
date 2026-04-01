# DSAbuddy: Next-Gen Competitive Coding Platform

Welcome to **DSAbuddy**, an AI-powered, scalable Data Structures and Algorithms practice platform that fuses the intensity of competitive tactical shooters (inspired by Valorant) with deep, adaptive technical learning.

## 🚀 Vision
To make grinding DSA questions feel like a thrilling eSports ladder climb, powered by intelligent matchmaking, rigorous backend execution engines, and a personalized AI mentor that adjusts to your precise logic gaps.

---

## 🏗️ Platform Overview

The system architecture handles upwards of 1,000+ concurrent active developers with low-latency WebSockets and isolated Docker worker nodes.

### 📚 Generated Assets Locator
All requested design documents, architectures, and sample codebase snippets are generated in this directory:

- **1. System Architecture:** `architecture/system_architecture.md` (Covers Microservices, Kong API Gateway, RabbitMQ Event Bus).
- **2. Backend Architecture:** `architecture/backend_architecture.md` (Node.js/NestJS, Python/FastAPI ML integrations).
- **3. Database Schema:** `architecture/database_schema.md` (PostgreSQL schemas, Redis cache mappings, Elasticsearch).
- **4. UI/UX Design System:** `design/ui_system_and_wireframes.md` (Color palette, Framer Motion animations, Valorant-inspired layout guidelines).
- **5. Sample Matchmaker:** `src/matchmaking/matchmaker.ts` (Redis-backed timestamp-sorted Queue algorithm in TS).
- **6. Sample AI Recommender:** `src/ai/recommender.py` (FastAPI + PyTorch mock inference model for weakness detection).
- **7. DevOps & K8s:** `k8s/deployment.yaml` and `deployment/Dockerfiles.txt` (HPA, LoadBalancers, Minimal Containers).

---

## 🔥 Key Differentiators

1. **The AI Adaptive Learning Engine:** 
   Our system tracks a granular "Skill Graph" in PostgreSQL. A PyTorch-based neural network processes your submission states (`Wrong Answer`, `TLE`) to serve precisely targeted graph or dynamic programming questions tailored to patch your weak points.

2. **The "Valorant" Style eSports Matchmaking:**
   Real-time coding duels bucketed by an ELO Rating mechanism. When two users in the `redis:queue:band` match, an aggressive "MATCH FOUND" UI animation takes over, transitioning them directly into the "Arena" code editor view.

3. **Secure Code Sandbox Engine:**
   Micro-containers leveraging `gVisor` dynamically evaluate massive memory/CPU bound test suites anonymously and asynchronously over Kafka queues.

---

Enjoy the climb to Radiant coder status!

# Backend Architecture Document

This document outlines the detailed backend architecture of the DSADojo platform, built using modern containerized microservices.

## ⚙️ Core Technology Stack
- **API Gateway:** Kong or Nginx (Rate limiting, WebSockets, Auth translation).
- **Primary Backend:** NestJS (Node.js) - highly scalable, TypeScript-native, out-of-the-box CQRS and Event Sourcing support.
- **Matchmaking Engine:** Go or Node.js with Redis (blazing fast queue sorting).
- **AI Recommendation Engine:** FastAPI (Python) - native integrations with PyTorch/TensorFlow for model serving.
- **Code Execution:** Docker sandbox cluster strictly isolated using `gVisor`.
- **Pub/Sub Broker:** Apache Kafka / RabbitMQ for inter-service communication.

## 🧱 Microservices Details

### 1. API Gateway
All client requests route through here. It validates JWTs. WebSockets (Socket.io) connect for live features (Matchmaking, AI Mentor chat) and are persisted with Redis Adapters.

### 2. User & Auth Service (NestJS)
- **Database:** PostgreSQL (`Users` table).
- **Responsibilities:** User profile operations, friends list, ELO tracking, streaks.

### 3. Problem & Syllabus Service (NestJS)
- **Database:** PostgreSQL (`Problems`), Redis cache, Elasticsearch.
- **Responsibilities:** Searching for problems by tags/difficulty via Elasticsearch. Getting problem descriptions, limits, and public test cases.

### 4. Code Execution Engine
- Takes the raw user code, problem ID, and wraps it into a task queue. 
- Worker nodes pull jobs from the queue, spin up a secure Alpine-based Linux container, run the runner script, compare exact outputs, and destroy the container.
- It returns "Accepted", "Wrong Answer", "TLE", etc., over Kafka.

### 5. Matchmaking Service
- Manages an active Redis Queue. Users are bucketed by their ELO (e.g., 1400-1500).
- When two users match exactly in the queue bucket and wait times sync up, a new room is instantiated. Both users receive a WebSocket event `{ event: "MATCH_FOUND", opponent_data: {...} }`.

### 6. AI Mentor & Analytics Service (FastAPI)
- Exposes a REST API for the frontend to send conversational input to the deep learning model.
- Maintains user weakness graphs in its PostgreSQL context memory, determining what "Hints" can be released progressively.

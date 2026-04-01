# Complete System Architecture: DSAbuddy Platform

## High-Level Overview
DSAbuddy is built as a highly scalable, microservices-based platform designed to handle 1,000+ concurrent users with real-time matchmaking, live AI-based feedback, and secure code execution.

The system is broken down into modular services orchestrated via Kubernetes (K8s) and communicating efficiently via an API Gateway and Event Bus (Kafka/RabbitMQ).

### Core Components

```mermaid
graph TD
    Client[Client (React/Next.js)] -->|HTTPS/WSS| APIGateway[API Gateway (Kong/Nginx)]
    APIGateway --> U[User Service (NestJS)]
    APIGateway --> P[Problem Service (NestJS)]
    APIGateway --> M[Matchmaking Service (Go/Node)]
    APIGateway --> E[Execution Engine (Python/Go)]
    APIGateway --> AI[AI Recommendation & Mentor (FastAPI)]

    U --> DB_User[(PostgreSQL - Users)]
    P --> DB_Prob[(PostgreSQL/Elasticsearch - Problems)]
    P --> Cache[(Redis - Problem Cache)]
    
    M --> Redis_Queue[(Redis - Active Queue/Socket.io)]
    M --> DB_Match[(PostgreSQL - Match History)]

    E --> Sandbox[Docker Sandbox Workers (Nomad/K8s)]
    
    AI --> ML_Model[PyTorch/TensorFlow Server]
    AI --> DB_AI[(PostgreSQL - AI Logs/Graph)]

    E -.->|Result Events| EventBus(Kafka/RabbitMQ)
    M -.->|Match Events| EventBus
    EventBus -.-> U
```

## Architectural Pillars

### 1. API Gateway
- **Technology:** Kong or Nginx ingress
- **Role:** Handles routing, rate-limiting, and SSL termination. Real-time connections (WebSockets for matchmaking and live mentors) are routed properly.

### 2. Microservices Layer
- **User Service:** Auth (JWT + OAuth), profile management, ELO rating updates.
- **Problem Service:** Serves problems (paginated, filtered via Elasticsearch).
- **Matchmaking Service:** A scalable Go or Node.js service managing Redis-backed queues for 1v1 and multiplayer matchups.
- **Code Execution Engine:** Secure, isolated Docker containers (e.g., Isolate daemon or gVisor) that spin up per code submission. Restricted CPU/Mem limits.
- **AI Recommendation Engine:** FastAPI microservice acting as an AI mentor. Interfaces with a fine-tuned Transformer model to simulate interviews and adjust question feeds.

### 3. Asynchronous Communication
- **Event Bus (Kafka or RabbitMQ):** Handles critical asynchronous events like "Submission Graded", "Match Concluded", or "ELO Updated" to decouple the ML service from the core flow.

### 4. Database Layer
- **PostgreSQL:** Primary ACID-compliant storage for users, transactions, and submission results.
- **Redis:** Rapid matchmaking queues, session management, leaderboards, and rate-limiting.
- **Elasticsearch:** Fast, faceted search over the extensive DSA problem library by tags and difficulty.

## Security & Scalability
- **Horizontal Scaling:** All stateless Node.js and Python API servers scale out using K8s HPAs (Horizontal Pod Autoscalers) based on CPU/Memory loads.
- **Sandbox Security:** Using `gVisor` for code execution containers guarantees that memory and networking inside the running user code cannot access host resources.
- **Anti-Cheat:** Code similarity checking runs asynchronously using Abstract Syntax Tree (AST) comparison models natively supported by the ML engine.

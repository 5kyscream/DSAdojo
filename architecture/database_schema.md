# Database Architecture & Schemas

## 1. PostgreSQL (Core Data)

### `Users` Table
- `id`: UUID (PK)
- `username`: VARCHAR (Unique)
- `email`: VARCHAR (Unique)
- `password_hash`: VARCHAR
- `elo_rating`: INT (Default: 1200)
- `streak`: INT (Default: 0)
- `created_at`: TIMESTAMP

### `Problems` Table
- `id`: UUID (PK)
- `title`: VARCHAR
- `description`: TEXT
- `difficulty`: ENUM ('Easy', 'Medium', 'Hard')
- `time_limit`: FLOAT (seconds)
- `memory_limit`: INT (MB)
- `tags`: VARCHAR[] (e.g., ['Graph', 'DFS'])

### `Submissions` Table
- `id`: UUID (PK)
- `user_id`: UUID (FK -> Users)
- `problem_id`: UUID (FK -> Problems)
- `status`: ENUM ('Accepted', 'Wrong Answer', 'TLE', 'MLE', 'Compilation Error')
- `execution_time`: FLOAT
- `language`: VARCHAR
- `code_s3_key`: VARCHAR
- `created_at`: TIMESTAMP

### `Matches` Table
- `id`: UUID (PK)
- `player1_id`: UUID (FK -> Users)
- `player2_id`: UUID (FK -> Users)
- `winner_id`: UUID (FK -> Users)
- `problem_id`: UUID (FK -> Problems)
- `start_time`: TIMESTAMP
- `end_time`: TIMESTAMP

### `SkillGraph` Table (AI tracked)
- `user_id`: UUID (FK)
- `topic`: VARCHAR
- `mastery_score`: FLOAT (0.0 to 100.0)
- `last_updated`: TIMESTAMP

---

## 2. Redis (Real-Time State)

### Matchmaking Queues
- **Key:** `queue:1v1:rating:{band}` (e.g., `queue:1v1:rating:1200_1300`)
- **Type:** Sorted Set (ZSET)
- **Score:** Exact ELO rating timestamp (sorting by wait time)
- **Value:** `user_id`

### Active Sessions
- **Key:** `session:{user_id}`
- **Type:** Hash
- **Fields:** `status` ('InMenu', 'InQueue', 'InMatch'), `current_match_id`

---

## 3. Elasticsearch (Search & Filter)
Stores denormalized problem documents to rapidly filter problems by:
```json
{
  "title": "Reverse Linked List",
  "content": "Reverse a singly linked list...",
  "tags": ["Linked List", "Recursion"],
  "difficulty": "Easy",
  "success_rate": 0.72
}
```

import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from './redis.service';
import { Socket } from 'socket.io';

@Injectable()
export class MatchmakingService {
  private readonly logger = new Logger(MatchmakingService.name);
  private readonly QUEUE_PREFIX = 'mm:queue:'; // Redis key prefix

  constructor(private readonly redisService: RedisService) {}

  /**
   * Adds a user to the matchmaking pool based on their ELO rating.
   * Uses Redis ZSET to store users ordered by the time they entered the queue.
   */
  async joinQueue(userId: string, targetElo: number, socketId: string): Promise<void> {
    const band = Math.floor(targetElo / 100) * 100; // e.g., 1250 gets bucketed to 1200
    const queueKey = `${this.QUEUE_PREFIX}${band}`;
    const timestamp = Date.now();

    // Store socket mapping for direct communication
    await this.redisService.set(`mm:session:${userId}`, socketId);
    
    // Add to sorted set in the rating band
    await this.redisService.zadd(queueKey, timestamp, userId);
    this.logger.log(`User ${userId} (ELO ${targetElo}) joined queue ${queueKey}`);

    // Trigger match evaluation for this bucket asynchronously
    this.evaluateQueue(queueKey);
  }

  /**
   * Evaluates the queue to find the two users who have waited the longest.
   * If found, pairs them and emits a MATCH_FOUND event over WebSockets.
   */
  async evaluateQueue(queueKey: string): Promise<void> {
    const queuedUsers = await this.redisService.zrange(queueKey, 0, 1);

    if (queuedUsers.length === 2) {
      const [player1, player2] = queuedUsers;

      // Atomically remove them from the queue using a transaction
      const removed = await this.redisService.zrem(queueKey, player1, player2);
      
      if (removed === 2) {
        // Successfully locked both players in a transaction
        await this.createMatch(player1, player2);
      } else {
        // Concurrency collision, rollback logic (put remaining back)
        this.logger.warn(`Failed to safely dequeue ${player1} and ${player2}`);
      }
    }
  }

  private async createMatch(player1: string, player2: string): Promise<void> {
    const matchId = `match_${Date.now()}`;
    // Fetch an appropriate problem from the Problem microservice (mocked here)
    const problemId = await this.getRandomProblemByEloBand();

    const payload = {
      matchId,
      problemId,
      players: [player1, player2],
      startsAt: Date.now() + 5000, // 5 seconds match start cinematic screen
    };

    // Broadcast setup over event bus / web sockets
    this.logger.log(`[MATCH FOUND] ${player1} VS ${player2} (Match ID: ${matchId})`);
    
    // In a real system, you emit via Socket.io Server instance here.
    // e.g. this.server.to([socket1, socket2]).emit('MATCH_READY', payload);
  }

  private async getRandomProblemByEloBand(): Promise<string> {
    return 'prob_two_sum_advanced_uuid';
  }
}

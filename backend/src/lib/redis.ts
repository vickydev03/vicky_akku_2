import Redis from "ioredis";

export const redis = new Redis("redis://redis:6379", {
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
  lazyConnect: false,
  reconnectOnError: () => true,
});

redis.on("connect", () => console.log("Redis connected"));
redis.on("error", err => console.error("Redis error", err));
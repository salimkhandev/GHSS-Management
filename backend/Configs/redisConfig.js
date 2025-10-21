const Redis = require("ioredis");

const client = new Redis({
  host: "free-insect-15458.upstash.io",
  port: 6379,
  username: "default",
  password: "ATxiAAIncDIxMzY5MWU3MjhiNTg0OTVkOTNlMTBlNjQ0OWQ4ZDBlZHAyMTU0NTg",
  family: 4, // Force IPv4
  tls: {
    rejectUnauthorized: false,
  },
  lazyConnect: false,
  maxRetriesPerRequest: 3,
  enableReadyCheck: false,
  retryStrategy(times) {
    if (times > 3) {
      console.log("❌ Failed to connect to Redis after 3 attempts");
      return null; // Stop retrying
    }
    const delay = Math.min(times * 500, 2000);
    console.log(`🔄 Retrying Redis connection (attempt ${times}/3)...`);
    return delay;
  },
});

client.once("ready", () => console.log("✅ Connected to Redis 🦞"));
client.on("error", (err) =>
  console.log("❌ Redis Error:", err.code || err.message),
);

module.exports = client;

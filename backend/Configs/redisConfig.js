const { Redis } = require("@upstash/redis");
require('dotenv').config();

let client = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  client = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  console.log("✅ Upstash Redis client initialized");
} else {
  console.log("⚠️  UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN not set - running without Redis");
}

module.exports = client;

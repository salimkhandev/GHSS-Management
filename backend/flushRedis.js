const redis = require('./Configs/redisConfig');

async function flushRedis() {
  if (!redis) {
    console.log('⚠️  Redis client not initialized - skipping cache flush');
    return;
  }

  try {
    console.log('🔄 Flushing Upstash Redis cache...');
    
    // Flush the entire database to clear all cached data
    await redis.flushdb();
    
    console.log('✅ Redis cache flushed successfully');
    console.log('📝 All cached data has been cleared to ensure consistency with database changes');
    
  } catch (err) {
    console.error('❌ Failed to flush Redis cache:', err.message);
  }
}

flushRedis();

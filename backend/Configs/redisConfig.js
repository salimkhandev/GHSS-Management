const Redis=require('ioredis')
const client = new Redis("rediss://default:AWYUAAIjcDEwOGJmOTI1OTRjODE0OTQ1YTgzZDUwMzU5NGMyOGYyNnAxMA@ideal-pika-26132.upstash.io:6379");
client.on('connect',()=>console.log('Connected to Redis 🦞'))
client.on('error',(err)=>console.log('Redis Client Error',err))

module.exports=client;

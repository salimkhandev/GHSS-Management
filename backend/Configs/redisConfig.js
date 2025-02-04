const Redis=require('ioredis')
const client = new Redis("rediss://default:ASdHAAIjcDFlNWNjNThhOWZlMGI0OTQ5ODA1ZTVkNDBmZmNiNDkzNnAxMA@bright-foxhound-10055.upstash.io:6379");
client.on('connect',()=>console.log('Connected to Redis 🦞'))
client.on('error',(err)=>console.log('Redis Client Error',err))

module.exports=client;
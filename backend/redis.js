const redis = require('redis');

(async () => {
    // Create a Redis client that connects to localhost:6379 (default Redis port)
    const client = redis.createClient({
        url: 'redis://localhost:6379' // Specify the connection URL
    });

    // Log any error events
    client.on('error', (err) => console.error('Redis Client Error', err));

    // Connect to the Redis server
    await client.connect();

    // Set a key in Redis
    await client.set('myKey', 'Hello, Redis!');

    // Retrieve the value of the key
    const value = await client.get('myKey');
    console.log('Value:', value);  // Should print: "Value: Hello, Redis!"

    // Disconnect from the Redis server
    await client.disconnect();
})();

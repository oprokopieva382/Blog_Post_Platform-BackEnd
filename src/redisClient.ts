import { createClient } from "redis";

const redisClient = createClient();

redisClient.on("error", (err)=> console.error("Redis Client Error", err));

(async ()=> {
await redisClient.connect();
console.log("Redis Client Connected")
})()

export default redisClient

import redisClient from "../redisClient";

export function cache(keyGenerator: (...args: any[]) => string, ttl: 3600) {
  return function (_: any, __: string, descriptor: PropertyDescriptor) {
    let method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cacheKey = keyGenerator(...args);
      const cachedResult = await redisClient.get(cacheKey);

      if (cachedResult) {
        return JSON.parse(cachedResult);
      }

      const result = await method.apply(this, args);
      await redisClient.set(cacheKey, JSON.stringify(result), { EX: ttl });

      return result;
    };
    return descriptor;
  };
}

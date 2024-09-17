import { Express } from "express";
import session from "express-session";
// connect-redisはtypescriptで書かれているので@typesは不要？
import RedisStore from "connect-redis";
import { createClient } from "redis";

export async function setupSession(app: Express): Promise<void> {
  const redisClient = createClient();
  const redisStore = new RedisStore({
    client: redisClient,
    prefix: "myapp",
  });

  try {
    await redisClient.connect();
    console.log("redis connection is established ...");
  } catch (e: any) {
    console.log(`redis connection error: ${e.message}`);
    throw e;
  }

  app.use(
    session({
      resave: false,
      saveUninitialized: false,
      secret: "secret",
      store: redisStore,
    })
  );
}

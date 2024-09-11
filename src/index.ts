import express, { Express } from "express";
import path from "path";
import { User } from "./models/user";
import mongoose, { ObjectId } from "mongoose";
import session from "express-session";
// connect-redisはtypescriptで書かれているので@typesは不要？
import RedisStore from "connect-redis";
import { createClient } from "redis";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

function setupMiddleware(app: Express) {
  app.set("views", path.join(__dirname, "../views"));
  app.set("view engine", "ejs");
  app.use(express.urlencoded({ extended: true }));
}

function setupRoute(app: Express) {
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.get("/", async (req, res) => {
    const userId = req.session.userId;
    const user = await User.findById(userId);
    res.render("index", { user });
  });
}

async function setupStrage() {
  try {
    // TODO: 実験で適当な認証情報をベタ書きしている、本番では.envに記載する。
    await mongoose.connect("mongodb://localhost:27017", {
      user: "akira",
      pass: "akira",
      dbName: "todo",
    });
    console.log("mongodb connection is established");
  } catch (e: any) {
    console.log(`mongodb connection error: ${e.message}`);
    throw e;
  }
}

async function setupSession(app: Express): Promise<void> {
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

async function main() {
  try {
    const app = express();
    await setupSession(app);
    setupMiddleware(app);
    setupRoute(app);
    await setupStrage();
    app.listen(3000, () => {
      console.log("server running ...");
    });
  } catch {
    console.log("setup storage error");
    console.log("stop application");
    return;
  }
}

main();

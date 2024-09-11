import express from "express";
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

const redisClient = createClient();
// デフォルトでローカルのポート6379に接続しに行く
redisClient
  .connect()
  .then(() => console.log("redis connection is established ..."))
  .catch((e) => console.log(`redis connection error: ${e.message}`));

const redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp",
});

const app = express();

app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
// TODO: 実験で適当な秘密鍵をベタ書きしている、本番では.envに記載する。
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "secret",
    store: redisStore,
  })
);

app.use("/auth", authRouter);
app.use("/user", userRouter);

app.get("/", async (req, res) => {
  const userId = req.session.userId;
  const user = await User.findById(userId);
  res.render("index", { user });
});

// TODO: 実験で適当なpassとuserをベタ書きしている、本番では.envに記載する
mongoose
  .connect("mongodb://localhost:27017", {
    user: "akira",
    pass: "akira",
    dbName: "todo",
  })
  .then(() => {
    console.log("mongodb connection is established ...");
  })
  .then(() => {
    app.listen(3000, () => {
      console.log("server running ...");
    });
  })
  .catch((e) => {
    console.log(`mongodb connection error: ${e.message}`);
  });

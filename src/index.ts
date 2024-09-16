import express, { Express } from "express";
import path from "path";
import { User } from "./models/user";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import { setupSession } from "./session";
import { setupStrage } from "./storage";

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
    res.render("index", { user, userId });
  });
  app.use((req, res) => {
    res.status(404).send("page not found ...");
  });
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
    console.log("error: stop application");
    return;
  }
}

main();

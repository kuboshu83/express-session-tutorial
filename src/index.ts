import express from "express";
import path from "path";
import { User } from "./models/user";
import mongoose from "mongoose";
import session from "express-session";

declare module "express-session" {
  interface SessionData {
    count: number;
  }
}

const app = express();

app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
// TODO: 実験で適当な秘密鍵をベタ書きしている、本番では.envに記載する。
app.use(session({ secret: "secret" }));

app.get("/", (req, res) => {
  if (!req.session.count) {
    req.session.count = 1;
  } else {
    req.session.count += 1;
  }
  console.log(req.session.count);
  console.log(req.session.id);
  res.send("todo list page ...");
});

app.post("/", async (req, res) => {
  const { name, password } = req.body;
  const user = new User({ name, password });
  const result = await user.save();
  console.log(`create user ${result.name}`);
  res.redirect("/");
});

app.get("/new", (req, res) => {
  res.render("auth/createUser");
});

app.get("/login", (req, res) => {
  res.render("auth/login");
});

app.post("/login/auth", async (req, res) => {
  const { name, password } = req.body;
  const user = await User.findOne({ name });
  if (!user || user.password !== password) {
    res.redirect("/");
  }
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

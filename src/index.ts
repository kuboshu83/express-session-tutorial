import express from "express";
import path from "path";
import { User } from "./models/user";
import mongoose, { ObjectId } from "mongoose";
import session from "express-session";

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

const app = express();

app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
// TODO: 実験で適当な秘密鍵をベタ書きしている、本番では.envに記載する。
app.use(session({ secret: "secret" }));

app.get("/", (req, res) => {
  res.send(
    `todo list page ...: ${
      req.session.userId ? req.session.userId : "anonymous"
    }`
  );
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
    return res.redirect("/");
  }
  req.session.userId = user._id.toString();
  res.redirect("/");
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

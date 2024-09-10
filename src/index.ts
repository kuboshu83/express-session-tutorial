import express from "express";
import path from "path";
import { User } from "./models/user";
import mongoose from "mongoose";

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
    const app = express();

    app.set("views", path.join(__dirname, "../views"));
    app.set("view engine", "ejs");

    app.use(express.urlencoded({ extended: true }));

    app.get("/", (req, res) => {
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

    app.listen(3000, () => {
      console.log("server running ...");
    });
  })
  .catch((e) => {
    console.log(`mongodb connection error: ${e.message}`);
  });

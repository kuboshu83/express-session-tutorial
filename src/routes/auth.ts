import express from "express";
import { User } from "../models/user";

const router = express.Router();

// base url is /auth

router.post("/", async (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) {
    return res.status(400).redirect("/auth/login");
  }
  const user = await User.findOne({ name });
  if (!user || user.password !== password) {
    return res.status(401).redirect("/auth/login");
  }
  req.session.userId = user._id.toString();
  res.redirect("/");
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});

export default router;

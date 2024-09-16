import express from "express";
import { User } from "../models/user";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) {
    const data = { errorMessage: "error: invalid name or password" };
    return res.status(400).render("auth/login", { ...data });
  }
  const user = await User.findOne({ name });
  if (!user || user.password !== password) {
    const data = { errorMessage: "error: authentication failed" };
    return res.status(401).render("auth/login", { ...data });
  }
  req.session.userId = user._id.toString();
  res.redirect("/");
});

router.get("/login", (req, res) => {
  const data = { errorMessage: null };
  res.render("auth/login", { ...data });
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

export default router;

import express from "express";
import { User } from "../models/user";

const router = express.Router();

// base url is /users
router.post("/new", async (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) {
    return res.status(400);
  }
  const user = new User({ name, password });
  const result = await user.save();
  console.log(`new user ${result.name} is created`);
  req.session.userId = result._id.toString();
  res.redirect("/");
});

router.get("/new", (req, res) => {
  res.render("auth/createUser");
});

export default router;

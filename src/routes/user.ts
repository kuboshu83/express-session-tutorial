import express from "express";
import { User } from "../models/user";

const router = express.Router();

// base url is /users
router.post("/new", async (req, res) => {
  const { name, password } = req.body;

  const user = new User({ name, password });
  try {
    // mongooseはデフォルトではsaveの直前にしかvalidateしない。
    // なので、ここで手動で実行している。
    await user.validate();
  } catch (e: any) {
    console.log(e.message);
    return res.status(400).send(`invalid name or password`);
  }

  let result;
  try {
    result = await user.save();
  } catch (e: any) {
    console.log(e.message);
    return res.status(500).send(`internal server error`);
  }
  console.log(`new user ${result.name} is created`);
  req.session.userId = result._id.toString();
  res.redirect("/");
});

router.get("/new", (req, res) => {
  res.render("auth/createUser");
});

export default router;

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
    const data = { errorMessage: `invalid name or password` };
    return res.status(400).render("auth/createuser", { ...data });
  }

  // save()の戻り値の型が複雑なので、一旦any型で宣言しておく。
  // any型を使用しない方法はまだ思いついていない。
  let result: any;
  try {
    result = await user.save();
  } catch (e: any) {
    console.log(e.message);
    const data = { errorMessage: `internal server error` };
    return res.status(500).render("auth/createuser", { ...data });
  }
  console.log(`new user ${result.name} is created`);
  req.session.userId = result._id.toString();
  res.redirect("/");
});

router.get("/new", (req, res) => {
  const data = { errorMessage: null };
  res.render("auth/createUser", { ...data });
});

export default router;

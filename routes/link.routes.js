import { Router } from "express";
import Link from "../models/Link.js";
import auth from "../middleware/auth.middleware.js";
import config from "config";
import shortid from "shortid";
const router = Router();

router.post("/generate", auth,  async (req, res) => {
  try {
    const baseUrl = "https://makeitshort69.herokuapp.com";                                          //config.get("baseUrl");
    const { from } = req.body;
    const code = shortid.generate();

    const existing = await Link.findOne({ from });

    if (existing) {
      return res.json({link: existing});                // return, чтобы код не шёл дальше.
    };

    const to = baseUrl + '/t/' + code;

    const link = new Link({ code, to, from, owner: req.user.userId });

    await link.save();
    res.status(201).json({ link });

  } catch (error) {
    res.status(500).json({ message: "Server Error! Please, try again..." });
  }
});

router.get("/", auth, async (req, res) => {
  // middleware можно так добавлять, между адрессом запроса и функцией.
  try {
    const links = await Link.find({ owner: req.user.userId });
    res.json(links); // зачем res.json(), это только при передачи данных на фронт с сервера?
  } catch (error) {
    res.status(500).json({ message: "Server Error! Please, try again..." });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const link = await Link.findById(req.params.id); // здесь не нужно искать пользователя, так как вероятно id уникальный у каждой ссылки.
    res.json(link);
  } catch (error) {
    res.status(500).json({ message: "Server Error! Please, try again..." });
  }
});

export default router;

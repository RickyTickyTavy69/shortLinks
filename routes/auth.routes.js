import { Router } from "express";
import bcrypt from "bcryptjs";
import { check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import config from "config";
import User from "../models/user.js";

const router = Router();

router.post(
  "/register",
  [
    check("email", "Некорректный email").isEmail(),
    check("password", "Минимальная длина пароля 6 символов").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      console.log("Body:", req.body);

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Некорректные данные при регистрации",
        });
      }

      const { email, password } = req.body;

      const candidate = await User.findOne({ email }); // ключ и значение совпадают.

      if (candidate) {
        return res
          .status(400)
          .json({ message: "Email already exists. Please go to Login" }); // а куда это выводится?
      }

      const hashedPassword = await bcrypt.hash(password, 12); // нужно, чтобы зашифровать пароль перед регистрацией. Чтобы сложнее было взломать.
      const user = new User({ email, password: hashedPassword });

      await user.save();

      res.status(201).json({ message: "Пользователь создан" }); // где будет видно сообщение?
    } catch (error) {
      res.status(500).json({ message: "Server Error! Please, try again..." });
    }
  }
);

router.post(
  "/login",
  [
    check("email", "The email is not correct, try again!")
      .normalizeEmail()
      .isEmail(),
    check("password", "Plese enter correct password").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Некорректные данные при входе в систему",
        });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "Пользователь не найден" }); // куда именно передается этот message?
      }

      const isMatch = await bcrypt.compare(password, user.password); // с помощью bcrypt можно не только шифровать, но и сравнивать пароли

      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "False password, please try again" });
      }

      const jwtSecret = config.get("jwtSecret");

      const token = jwt.sign(
        // для логина создаётся jwt Token, в функцию sing() передаются 3 параметра,
        { userId: user.id }, // какой то параметр пользователя, по которому создаётся токен
        config.get("jwtSecret"), // секретный ключ для создания токена.
        { expiresIn: "1h" } // время, на которое токен будет действителен
      );

      res.json({ token, userId: user.id });
    } catch (error) {
      res.status(500).json({ message: "Server Error! Please, try again..." });
    }
  }
);

export default router;

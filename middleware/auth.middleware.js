import jwt from "jsonwebtoken";
import config from "config";

export default (req, res, next) => {
  if (req.method === "OPTIONS") {
    // метод в rest.api, который проверяет доступность сервера.
    return next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1]; // в req существует такая строчка "Bearer TOKEN", которая передаётся в req с помощью jwt token.
    if (!token) {
      return res.status(401).json({ message: "Нет авторизации" });
    }

    const decoded = jwt.verify(token, config.get("jwtSecret"));
    req.user = decoded;
    next(); // в middleware значит должен быть такой метод, для продолжения выполнения запроса.
  } catch (error) {
    res.status(401).json({ message: "Нет авторизации" });
  }
};

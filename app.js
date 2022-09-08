import express from "express";
import config from "config";
import mongoose from "mongoose";
import Authrouter from "./routes/auth.routes.js";
import Linkrouter from "./routes/link.routes.js";
import Redirectrouter from "./routes/redirect.routes.js";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

app.use(express.static(path.join(__dirname, "client", "build")));
app.use(express.json({ extended: true })); // это middleware, который нужен, чтобы читать полученные данные
app.use("/api/auth", Authrouter); // из req.body. Они воспринимаются как стримы и без этого будут undefined
app.use("/api/link", Linkrouter);
app.use("/t", Redirectrouter);



if (process.env.NODE_ENV === 'production') {
  app.use( '/', express.static(path.join(__dirname, 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  })
}



const PORT = process.env.PORT  || 5000; // так можно достать переменную из config.

async function start() {
  try {
    await mongoose.connect(config.get("mongoURI"), {});
    app.listen(PORT, () =>
      console.log(`App has been started on port ${PORT}...`)
    );
  } catch (error) {
    console.log("Server Error", error);
    process.exit(1); // зачем это до сир пор не до конца понял.
  }
}

start();

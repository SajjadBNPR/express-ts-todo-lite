import { Todorouter } from "./controller/Todo";
import { Homerouter } from "./controller/Home";
import express from "express";
import * as dotenv from "dotenv";

dotenv.config();
//create app
const app = express();
//middlewares
app.use(express.json());
app.use(express.urlencoded());
//controllers
app.use("/", Homerouter);
app.use("/todo", Todorouter);
//serve app
app.listen(process.env.APP_DOMAIN, () => {
  console.log(`Example app listening on port ${process.env.APP_DOMAIN}`);
});

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Auth from "./Routes/Auth";
import Post from "./Routes/Post";

dotenv.config();

const app = express();
const http = require("http").createServer(app);

//Middleware
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
  })
);

//db connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("DB Connection ERROR", err));

app.use("/api", Auth);
app.use("/api", Post);

const port = process.env.PORT || 8000;

http.listen(port, () => console.log(`Server running on port :${port}`));

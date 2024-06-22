import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectToMongoDB from "./config/db";
import fileRouter from "./routes/fileRoutes";
import cors from "cors";

const app = express();
const port = process.env.PORT ?? 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

// Routes

app.use("/api/test", (req, res) => {
  res.send("working fine");
});

app.use("/api/file", fileRouter);

// let server: any;

const dbUrl = process.env.MONGODB_URL ?? "";
connectToMongoDB(dbUrl);
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

import express, { Handler, RequestHandler } from "express";
import cors from "cors";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());

const pool = new Pool({
  user: process.env.POSTGRES_USER || "user",
  host: process.env.POSTGRES_HOST || "localhost",
  database: process.env.POSTGRES_DB || "corn-db",
  password: process.env.POSTGRES_PASSWORD || "password",
  port: 5432,
});

const rateLimitMiddleware: RequestHandler = async ({ ip }, res, next) => {
  if (!ip) {
    res.status(400).json({ message: "no ip address" }); //  Useless but elegant 🧐
    return;
  }

  let success = true;

  try {
    const client = await pool.connect();
    const {
      rows: [result],
    } = await client.query(
      "SELECT count(*) FROM corn_log where query_time > NOW() - INTERVAL '1 minute' and   ip = $1",
      [ip]
    );

    const { count } = result;

    if (count > 0) {
      // rate limit exceeded
      res.sendStatus(429);
      success = false;
    }

    await client.query(
      "INSERT INTO corn_log (ip, success) VALUES ($1, $2) RETURNING id",
      [ip, success]
    );
    if (success) next();
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
};

app.use(rateLimitMiddleware);

app.get("/", async (_, res) => {
  res.status(200).send("200 🌽");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

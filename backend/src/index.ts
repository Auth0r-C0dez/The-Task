import "dotenv/config";
import cors from "cors";
import express from "express";
import api from "./routes/api";
import { configureStore } from "./store";

if (process.env.DATA_DIR) {
  configureStore(process.env.DATA_DIR);
}

const app = express();
const port = Number(process.env.PORT || 4000);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
].filter(Boolean) as string[];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      if (process.env.CORS_ALLOW_ALL === "true") {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
  })
);
app.use(express.json({ limit: "1mb" }));

app.use("/api", api);

app.get("/", (_req, res) => {
  res.json({
    name: "Agentic Dating API",
    docs: "/api/health",
  });
});

app.listen(port, () => {
  console.log(`Agentic Dating API listening on port ${port}`);
});

import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import generateLetterHandler from "./api/generate-letter";
import ghostwriterChatHandler from "./api/ghostwriter-chat";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Mount the serverless handlers on the Express dev / container server
app.all("/api/generate-letter", async (req: Request, res: Response) => {
  try {
    await generateLetterHandler(req as any, res as any);
  } catch (err) {
    console.error("Error in generate-letter handler:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

app.all("/api/ghostwriter-chat", async (req: Request, res: Response) => {
  try {
    await ghostwriterChatHandler(req as any, res as any);
  } catch (err) {
    console.error("Error in ghostwriter-chat handler:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

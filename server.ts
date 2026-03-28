import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Real code execution endpoint using Piston API
  app.post("/api/execute", async (req, res) => {
    const { code, language } = req.body;
    
    // Map our language IDs to Piston language IDs and versions
    const languageMap: Record<string, { language: string, version: string }> = {
      javascript: { language: "javascript", version: "18.15.0" },
      python: { language: "python", version: "3.10.0" },
      java: { language: "java", version: "15.0.2" },
      cpp: { language: "c++", version: "10.2.0" },
      typescript: { language: "typescript", version: "5.0.3" }
    };

    const pistonLang = languageMap[language];
    
    if (!pistonLang) {
      return res.status(400).json({
        stdout: "",
        stderr: `Unsupported language: ${language}`,
        exitCode: 1,
      });
    }

    try {
      const response = await fetch("https://emacs.ch/api/v2/piston/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          language: pistonLang.language,
          version: pistonLang.version,
          files: [
            {
              content: code
            }
          ]
        })
      });

      const data = await response.json();
      
      res.json({
        stdout: data.run?.stdout || "",
        stderr: data.run?.stderr || data.message || "",
        exitCode: data.run?.code || 0,
      });
    } catch (error) {
      console.error("Code execution error:", error);
      res.status(500).json({
        stdout: "",
        stderr: "Failed to execute code. Please try again later.",
        exitCode: 1,
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Error starting server:", err);
});

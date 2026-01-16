import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { nationSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/radar", async (req, res) => {
    try {
      const month = req.query.month as string | undefined;
      const nationParam = req.query.nation as string | undefined;

      const now = new Date();
      const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const defaultMonth = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, "0")}`;

      const targetMonth = month || defaultMonth;

      const nationResult = nationSchema.safeParse(nationParam || "domestic");
      if (!nationResult.success) {
        return res.status(400).json({ error: "Invalid nation parameter" });
      }
      const targetNation = nationResult.data;

      const data = await storage.getRadarData(targetMonth, targetNation);

      if (!data) {
        return res.status(404).json({
          error: "Data not found",
          month: targetMonth,
          nation: targetNation,
        });
      }

      res.json(data);
    } catch (error) {
      console.error("Error fetching radar data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/radar/months", async (_req, res) => {
    try {
      const months = await storage.getAvailableMonths();
      res.json({ months });
    } catch (error) {
      console.error("Error fetching available months:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return httpServer;
}

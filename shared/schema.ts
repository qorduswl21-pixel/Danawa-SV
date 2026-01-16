import { z } from "zod";

export const nationSchema = z.enum(["domestic", "export"]);
export type Nation = z.infer<typeof nationSchema>;

export const carModelSchema = z.object({
  id: z.string(),
  rank: z.number(),
  name: z.string(),
  brand: z.string(),
  sales: z.number(),
  prevSales: z.number(),
  momAbs: z.number(),
  momPct: z.number(),
  rankChange: z.number(),
  score: z.number(),
  isNewEntry: z.boolean(),
  nation: nationSchema,
  month: z.string(),
  danawaUrl: z.string(),
});

export type CarModel = z.infer<typeof carModelSchema>;

export const radarDataSchema = z.object({
  month: z.string(),
  nation: nationSchema,
  models: z.array(carModelSchema),
  fetchedAt: z.string(),
});

export type RadarData = z.infer<typeof radarDataSchema>;

export const radarQuerySchema = z.object({
  month: z.string().optional(),
  nation: nationSchema.optional(),
});

export type RadarQuery = z.infer<typeof radarQuerySchema>;

export const users = {
  $inferSelect: {} as { id: string; username: string; password: string },
};
export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

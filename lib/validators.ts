// lib/validators.ts
import { z } from "zod";

export const phoneRegex = /^[0-9]{10,15}$/;

export const buyerCreateSchema = z.object({
  fullName: z.string().min(2).max(80),
  email: z.string().email().optional().or(z.literal("")).transform((v) => v || null),
  phone: z.string().regex(phoneRegex),
  city: z.nativeEnum({
    Chandigarh: "Chandigarh",
    Mohali: "Mohali",
    Zirakpur: "Zirakpur",
    Panchkula: "Panchkula",
    Other: "Other"
  } as any),
  propertyType: z.nativeEnum({
    Apartment: "Apartment",
    Villa: "Villa",
    Plot: "Plot",
    Office: "Office",
    Retail: "Retail"
  } as any),
  bhk: z
    .union([z.literal("1"), z.literal("2"), z.literal("3"), z.literal("4"), z.literal("Studio")])
    .optional()
    .nullable(),
  purpose: z.enum(["Buy", "Rent"]),
  budgetMin: z.number().int().positive().optional().nullable(),
  budgetMax: z.number().int().positive().optional().nullable(),
  timeline: z.enum(["0-3m", "3-6m", ">6m", "Exploring"]),
  source: z.enum(["Website", "Referral", "Walk-in", "Call", "Other"]).transform((v) => (v === "Walk-in" ? "Walk_in" : v)),
  notes: z.string().max(1000).optional().nullable(),
  tags: z.array(z.string()).optional().nullable()
}).superRefine((data, ctx) => {
  if (data.budgetMin != null && data.budgetMax != null && data.budgetMax < data.budgetMin) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "budgetMax must be >= budgetMin", path: ["budgetMax"] });
  }
  if (["Apartment", "Villa"].includes(data.propertyType)) {
    if (!data.bhk) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "bhk is required for Apartment and Villa", path: ["bhk"] });
  } else {
    // ensure bhk not required
  }
});

export type BuyerCreateInput = z.infer<typeof buyerCreateSchema>;

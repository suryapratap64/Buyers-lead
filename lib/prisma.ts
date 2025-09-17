// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __prisma_client__: PrismaClient | undefined;
}

const prisma = global.__prisma_client__ ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") global.__prisma_client__ = prisma;

export default prisma;

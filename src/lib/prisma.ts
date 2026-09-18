// src/lib/prisma.ts
import 'dotenv/config';

// ❌ If this is: import { PrismaClient } from '@prisma/client';
// ✅ Change to match where your schema actually generated:
import { PrismaClient } from '../../generated/prisma/client.js'; // or client.ts

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
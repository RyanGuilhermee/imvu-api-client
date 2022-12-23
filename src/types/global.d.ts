import { PrismaClient, User } from '@prisma/client';

declare global {
  var prisma: PrismaClient;
}

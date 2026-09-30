const { PrismaClient } = require('@prisma/client');

const globalForPrisma = globalThis;

const prisma = globalForPrisma.__atlasPrisma ?? new PrismaClient();

globalForPrisma.__atlasPrisma = prisma;

module.exports = { prisma };

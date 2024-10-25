import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient;
}

let db: any;

db = new PrismaClient();

const initializePrisma = async () => {
  db.$queryRaw`PRAGMA busy_timeout = 5000;`;
};
initializePrisma()
  .then(() => {})
  .catch((error) => console.error(error));

export default db;

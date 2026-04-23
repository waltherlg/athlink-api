import { PrismaClient } from '@prisma/client';

import * as dotenv from 'dotenv';

dotenv.config({ path: '.development.local.env' });

const prisma = new PrismaClient();

async function main() {
  console.log('PRISMA PATH:', require.resolve('@prisma/client'));
  console.log('PRISMA CLIENT:', PrismaClient.toString());
  console.log('SEED RUNNING');
  await prisma.event.upsert({
    where: {
      sportType_code: {
        sportType: 'SHOOTING_RIFLE_PISTOL',
        code: 'AIR_RIFLE_60',
      },
    },
    update: {},
    create: {
      sportType: 'SHOOTING_RIFLE_PISTOL',
      code: 'AIR_RIFLE_60',
      name: 'Air Rifle 60',
      resultType: 'SCORE',
      maxScore: 654,
      decimals: 1,
    },
  });

  await prisma.event.upsert({
    where: {
      sportType_code: {
        sportType: 'SHOOTING_RIFLE_PISTOL',
        code: 'AIR_RIFLE_40',
      },
    },
    update: {},
    create: {
      sportType: 'SHOOTING_RIFLE_PISTOL',
      code: 'AIR_RIFLE_40',
      name: 'Air Rifle 40',
      resultType: 'SCORE',
      maxScore: 436,
      decimals: 1,
    },
  });

  await prisma.event.upsert({
    where: {
      sportType_code: {
        sportType: 'SHOOTING_RIFLE_PISTOL',
        code: 'AIR_PISTOL_60',
      },
    },
    update: {},
    create: {
      sportType: 'SHOOTING_RIFLE_PISTOL',
      code: 'AIR_PISTOL_60',
      name: 'Air Pistol 60',
      resultType: 'SCORE',
      maxScore: 600,
      decimals: 0,
    },
  });

  await prisma.event.upsert({
    where: {
      sportType_code: {
        sportType: 'SHOOTING_RIFLE_PISTOL',
        code: 'AIR_PISTOL_40',
      },
    },
    update: {},
    create: {
      sportType: 'SHOOTING_RIFLE_PISTOL',
      code: 'AIR_PISTOL_40',
      name: 'Air Pistol 40',
      resultType: 'SCORE',
      maxScore: 400,
      decimals: 0,
    },
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

import 'dotenv/config';
import { seed, reset } from 'drizzle-seed';
import { db } from '@vendly/db/server';
import { user } from '@vendly/db';
  
async function main() {
  await reset(db, { user });
  console.log('Database reset completed!');

  await seed(db, { user }, { 
    count: 10,
    seed: 12345
  });
  
  console.log('✅ Database seeded with 10 realistic users!');
}

main().catch(console.error);

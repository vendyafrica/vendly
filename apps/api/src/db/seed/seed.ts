import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { seed, reset } from 'drizzle-seed';
import { usersTable } from '../schema/users';
  
const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  await reset(db, { users: usersTable });
  console.log('Database reset completed!');

  await seed(db, { users: usersTable }, { 
    count: 10,
    seed: 12345
  });
  
  console.log('✅ Database seeded with 10 realistic users!');
}

main().catch(console.error);

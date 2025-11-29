import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import { migrate } from 'drizzle-orm/neon-http/migrator'

// Load environment variables
import { config } from 'dotenv'
config()

const runMigrate = async () => {
  if (!process.env.DATABASE_URL) {
    console.log('DATABASE_URL is not defined, skipping migrations')
    process.exit(0)
  }

  const connection = neon(process.env.DATABASE_URL)

  const db = drizzle(connection)

  console.log('⏳ Running migrations...')

  const start = Date.now()

  await migrate(db, { migrationsFolder: 'lib/db/migrations' })

  const end = Date.now()

  console.log('✅ Migrations completed in', end - start, 'ms')

  process.exit(0)
}

runMigrate().catch((err) => {
  console.error('❌ Migration failed')
  console.error(err)
  process.exit(1)
})

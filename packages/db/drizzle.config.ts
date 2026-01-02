import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { resolve } from 'path';

// Load .env from root directory
import { config } from 'dotenv';

// Try multiple possible .env locations
const possibleEnvPaths = [
  resolve(__dirname, '../../.env'), // When running from packages/db
  resolve(__dirname, '../../../.env'), // When running from apps/*/node_modules/@vendly/db
  resolve(process.cwd(), '.env'), // Current working directory
];

// Try to load .env from any of the possible locations
for (const envPath of possibleEnvPaths) {
  try {
    config({ path: envPath });
    if (process.env.DATABASE_URL) {
      break; // Stop if we found the DATABASE_URL
    }
  } catch (error) {
    // Continue to next path
  }
}

export default defineConfig({
  out: './drizzle',
  schema: './src/schema/index.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});

import { db } from './src/db.js';

console.log('Testing database connection...');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');

try {
  // Simple connection test - try to select 1
  const result = await db.select().from({ test: 'test' });
  console.log('✅ Database connection successful');
} catch (error) {
  console.error('❌ Database connection failed:', error.message);
}

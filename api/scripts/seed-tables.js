// Seed tables into the API database
// Usage:
//   cd "d:\\Table booking\\api"
//   npm install mongoose dotenv
//   node scripts/seed-tables.js
//
// Configuration via .env:
//   MONGO_URI=mongodb+srv://...
//
import { config } from 'dotenv';
import { Schema, model, connect, disconnect } from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
config({ path: path.join(__dirname, '..', '.env') });

const TableSchema = new Schema({
  number: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true },
  // Optional restaurant linkage
  restaurantId: { type: String, required: false },
}, { timestamps: true });

const Table = model('Table', TableSchema);

async function seed() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('Missing MONGO_URI in .env');
    process.exit(1);
  }

  await connect(mongoUri);
  console.log('Connected to MongoDB');

  // Define shared tables (no restaurant binding)
  const tables = Array.from({ length: 30 }, (_, i) => ({
    number: i + 1,
    isAvailable: true,
  }));

  // Clear existing tables
  await Table.deleteMany({});
  console.log('Cleared existing tables');

  // Insert new tables
  await Table.insertMany(tables);
  console.log(`Inserted ${tables.length} shared tables`);

  await disconnect();
  console.log('Done');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});

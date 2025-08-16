import dotenv from "dotenv";
import pkg from "pg";
const { Client } = pkg;

dotenv.config(); // Load .env file

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Required for Supabase
});

async function testConnection() {
  try {
    await client.connect();
    console.log("✅ Connected to the database successfully!");

    const res = await client.query("SELECT NOW()");
    console.log("Current time from DB:", res.rows[0]);

    await client.end();
  } catch (err) {
    console.error("❌ Database connection error:", err);
  }
}

testConnection();

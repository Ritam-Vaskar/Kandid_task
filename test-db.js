const postgres = require("postgres");

// Read DATABASE_URL from environment
const sql = postgres(process.env.DATABASE_URL, { ssl: "require" });

(async () => {
  try {
    const result = await sql`select now();`;
    console.log("✅ Connected! Server time:", result[0].now);
  } catch (err) {
    console.error("❌ Connection failed:", err.message);
  } finally {
    await sql.end();
  }
})();

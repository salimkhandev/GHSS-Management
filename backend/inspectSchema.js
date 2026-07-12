const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://postgres.aaolafhyxxhfdurmvcdg:1EBfJyyqFcgTd6u3@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function main() {
  const tables = ['classes', 'sections', 'students', 'teachers', 'attendance', 'push_subscriptions'];
  for (const table of tables) {
    const r = await pool.query(
      `SELECT column_name, data_type, is_nullable, column_default
       FROM information_schema.columns
       WHERE table_schema = 'public' AND table_name = $1
       ORDER BY ordinal_position`, [table]
    );
    console.log(`\n=== ${table} ===`);
    r.rows.forEach(c => console.log(`  ${c.column_name} | ${c.data_type} | nullable:${c.is_nullable} | default:${c.column_default}`));
  }
  pool.end();
}
main().catch(e => { console.error(e.message); pool.end(); });

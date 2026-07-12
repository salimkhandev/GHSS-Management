const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://postgres.aaolafhyxxhfdurmvcdg:1EBfJyyqFcgTd6u3@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

pool.query(
  "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
).then(r => {
  console.log('\nTotal tables:', r.rowCount);
  console.log('\nTable list:');
  r.rows.forEach((row, i) => console.log(`  ${i + 1}. ${row.table_name}`));
  pool.end();
}).catch(e => {
  console.error('Error:', e.message);
  pool.end();
});

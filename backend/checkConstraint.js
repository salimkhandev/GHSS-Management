
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://postgres.aaolafhyxxhfdurmvcdg:1EBfJyyqFcgTd6u3@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});
pool.query(
  `SELECT pg_get_constraintdef(c.oid) as def FROM pg_constraint c
   JOIN pg_class t ON t.oid = c.conrelid
   WHERE t.relname = 'attendance' AND c.contype = 'c'`
).then(r => {
  console.log('Constraints:');
  r.rows.forEach(x => console.log(x.def));
  pool.end();
}).catch(e => { console.error(e.message); pool.end(); });

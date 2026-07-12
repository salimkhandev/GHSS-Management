const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres.aaolafhyxxhfdurmvcdg:1EBfJyyqFcgTd6u3@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function verifyTeachers() {
  try {
    console.log('🔍 Running SELECT query to verify teacher usernames...\n');

    const result = await pool.query(`
      SELECT id, username, role, class_id, section_id 
      FROM teachers 
      ORDER BY id
    `);

    console.log(`Found ${result.rows.length} teachers:\n`);
    result.rows.forEach(t => {
      const classInfo = t.class_id ? `(Class: ${t.class_id})` : '';
      const sectionInfo = t.section_id ? `(Section: ${t.section_id})` : '';
      console.log(`   ${t.id}. ${t.username} [${t.role}] ${classInfo} ${sectionInfo}`);
    });

  } catch (err) {
    console.error('❌ Query failed:', err.message);
  } finally {
    pool.end();
  }
}

verifyTeachers();

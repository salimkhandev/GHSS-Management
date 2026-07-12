const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres.aaolafhyxxhfdurmvcdg:1EBfJyyqFcgTd6u3@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function getTeacherCredentials() {
  try {
    console.log('🔍 Getting all teacher credentials...\n');

    const result = await pool.query(`
      SELECT id, username, role, class_id, section_id 
      FROM teachers 
      WHERE role != 'admin'
      ORDER BY id
    `);

    console.log(`Found ${result.rows.length} teachers:\n`);
    result.rows.forEach(t => {
      // Password is the first name (part before underscore in username)
      const firstName = t.username.split('_')[0];
      console.log(`   ${t.id}. Username: ${t.username} | Password: ${firstName} [Class: ${t.class_id}, Section: ${t.section_id}]`);
    });

    console.log('\n📋 Format for UI credentials:');
    console.log('   teacherUsername: "FirstName_LastName"');
    console.log('   teacherPassword: "FirstName"');

  } catch (err) {
    console.error('❌ Query failed:', err.message);
  } finally {
    pool.end();
  }
}

getTeacherCredentials();

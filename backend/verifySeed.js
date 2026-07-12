const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres.aaolafhyxxhfdurmvcdg:1EBfJyyqFcgTd6u3@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function verifySeed() {
  try {
    console.log('🔍 Verifying seeded data...\n');

    // Check classes
    const classes = await pool.query('SELECT * FROM classes ORDER BY id');
    console.log(`📚 Classes: ${classes.rows.length}`);
    classes.rows.forEach(c => console.log(`   ${c.id}. ${c.name}`));

    // Check sections
    const sections = await pool.query('SELECT s.id, s.name, c.name as class_name FROM sections s JOIN classes c ON s.class_id = c.id ORDER BY s.id');
    console.log(`\n📂 Sections: ${sections.rows.length}`);
    sections.rows.forEach(s => console.log(`   ${s.id}. ${s.class_name} - ${s.name}`));

    // Check teachers
    const teachers = await pool.query('SELECT id, username, role, class_id, section_id FROM teachers ORDER BY id');
    console.log(`\n👨‍🏫 Teachers: ${teachers.rows.length}`);
    teachers.rows.forEach(t => {
      const classInfo = t.class_id ? `(Class: ${t.class_id})` : '';
      const sectionInfo = t.section_id ? `(Section: ${t.section_id})` : '';
      console.log(`   ${t.id}. ${t.username} [${t.role}] ${classInfo} ${sectionInfo}`);
    });

    // Check students
    const students = await pool.query('SELECT COUNT(*) as count FROM students');
    console.log(`\n👩‍🎓 Students: ${students.rows[0].count}`);

    // Check attendance
    const attendance = await pool.query('SELECT COUNT(*) as count FROM attendance');
    console.log(`\n📅 Attendance records: ${attendance.rows[0].count}`);

    // Sample attendance by class
    const attendanceByClass = await pool.query(`
      SELECT c.name as class_name, COUNT(*) as count 
      FROM attendance a 
      JOIN classes c ON a.class_id = c.id 
      GROUP BY c.name 
      ORDER BY c.name
    `);
    console.log(`\n📊 Attendance by class:`);
    attendanceByClass.rows.forEach(row => {
      console.log(`   ${row.class_name}: ${row.count} records`);
    });

    console.log('\n✅ Verification complete!');

  } catch (err) {
    console.error('❌ Verification failed:', err.message);
  } finally {
    pool.end();
  }
}

verifySeed();

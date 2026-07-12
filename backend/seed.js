/**
 * Seed script for GHSS Management System
 * - Deletes all existing records
 * - Seeds: classes, sections, students (up to 100/section), teachers (bcrypt hashed), attendance (2024–Jul 2026)
 * - Admin: username=admin, password=admin (bcrypt hashed)
 * - Teachers: username=FirstName_ClassName_SectionName, password=FirstName (bcrypt hashed)
 */

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: 'postgresql://postgres.aaolafhyxxhfdurmvcdg:1EBfJyyqFcgTd6u3@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false },
  max: 1, // Limit to single connection to avoid pool exhaustion
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// ─── Pakistani Muslim Male Names (large pool for uniqueness per section) ─────
const maleFirstNames = [
  'Muhammad','Ahmed','Ali','Hassan','Hussain','Ibrahim','Usman','Omar','Bilal','Tariq',
  'Asad','Zaid','Faisal','Imran','Adeel','Junaid','Saad','Hamza','Kashif','Waqas',
  'Rizwan','Shahid','Naveed','Salman','Kamran','Fahad','Danish','Zubair','Aqeel','Irfan',
  'Shoaib','Arif','Waseem','Azhar','Babar','Iqbal','Nasir','Tahir','Ejaz','Khalid',
  'Nadeem','Sameer','Rehan','Shafiq','Tauseef','Zafar','Ghulam','Amir','Raza','Mubarak',
  'Awais','Sohail','Naeem','Atif','Waheed','Amjad','Zahid','Haroon','Jamal','Siraj',
  'Tanveer','Rafiq','Pervaiz','Zeeshan','Qasim','Yasir','Mujahid','Shahzad','Adnan','Sajid',
  'Javed','Asif','Saifullah','Noman','Mohsin','Furqan','Waqar','Talha','Saud','Ahsan',
  'Umer','Waleed','Usama','Mustafa','Hasnain','Muneeb','Zain','Haris','Khawar','Suleman',
  'Azeem','Raees','Shabbir','Ilyas','Aslam','Younis','Saqib','Sarfraz','Dilawar','Khurram'
];
const maleLastNames = [
  'Khan','Malik','Ahmed','Sheikh','Qureshi','Akhtar','Butt','Chaudhry','Siddiqui','Mirza',
  'Raza','Hussain','Ali','Shah','Baig','Ansari','Farooqi','Hashmi','Abbasi','Rajput',
  'Niazi','Lodhi','Bhatti','Awan','Mughal','Gilani','Bokhari','Naqvi','Zaidi','Rizvi',
  'Cheema','Gujjar','Sandhu','Gondal','Dogar','Tarar','Warraich','Randhawa','Baloch','Arain'
];

// Shuffle array in-place (Fisher-Yates)
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Build a large unique name pool by combining first+last permutations
function buildNamePool(size) {
  const pool = new Set();
  const firstShuffled = shuffle([...maleFirstNames]);
  const lastShuffled = shuffle([...maleLastNames]);
  let fi = 0, li = 0;
  while (pool.size < size) {
    const name = `${firstShuffled[fi % firstShuffled.length]} ${lastShuffled[li % lastShuffled.length]}`;
    pool.add(name);
    fi++;
    if (fi % firstShuffled.length === 0) { li++; shuffle(firstShuffled); }
  }
  return shuffle([...pool]);
}

// Teacher names — male only
function randomMaleName() {
  const first = maleFirstNames[Math.floor(Math.random() * maleFirstNames.length)];
  const last = maleLastNames[Math.floor(Math.random() * maleLastNames.length)];
  return `${first} ${last}`;
}

// Pakistani subject names
const subjects = [
  'Mathematics','Physics','Chemistry','Biology','English','Urdu',
  'Islamiyat','Pakistan Studies','Computer Science','Economics','Accounting'
];

// ─── Class / Section config ──────────────────────────────────────────────────
const classConfig = [
  { name: '6',  sections: ['A','B','C'] },
  { name: '7',  sections: ['A','B','C'] },
  { name: '8',  sections: ['A','B','C'] },
  { name: '9',  sections: ['A','B','C'] },
  { name: '10', sections: ['A','B','C'] },
  { name: '11', sections: ['A','B'] },
  { name: '12', sections: ['A','B'] },
];

// ─── Date helpers ─────────────────────────────────────────────────────────────
function getSchoolDays(startDate, endDate) {
  const days = [];
  const cur = new Date(startDate);
  while (cur <= endDate) {
    const dow = cur.getDay(); // 0=Sun,6=Sat
    // Pakistan school week: Mon–Sat (skip Sunday)
    if (dow !== 0) {
      days.push(cur.toISOString().split('T')[0]);
    }
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

// Sample ~3 days per week to make it realistic, not every single day
function sampleDays(days, sampleRate = 0.6) {
  return days.filter(() => Math.random() < sampleRate);
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check if we should resume or start fresh
    const existingClasses = await client.query('SELECT name FROM classes ORDER BY name');
    const resumeMode = false; // Force fresh start as requested by user

    if (resumeMode) {
      console.log('🔄 Resume mode detected - existing data found');
      console.log(`   Existing classes: ${existingClasses.rows.map(r => r.name).join(', ')}`);
      // In resume mode, we need to reset sequences to avoid conflicts
      const maxClassId = await client.query('SELECT MAX(id) as max_id FROM classes');
      if (maxClassId.rows[0].max_id) {
        await client.query(`SELECT setval('classes_id_seq', ${maxClassId.rows[0].max_id}, true)`);
      }
      const maxSectionId = await client.query('SELECT MAX(id) as max_id FROM sections');
      if (maxSectionId.rows[0].max_id) {
        await client.query(`SELECT setval('sections_id_seq', ${maxSectionId.rows[0].max_id}, true)`);
      }
      const maxStudentId = await client.query('SELECT MAX(id) as max_id FROM students');
      if (maxStudentId.rows[0].max_id) {
        await client.query(`SELECT setval('students_id_seq', ${maxStudentId.rows[0].max_id}, true)`);
      }
      const maxTeacherId = await client.query('SELECT MAX(id) as max_id FROM teachers');
      if (maxTeacherId.rows[0].max_id) {
        await client.query(`SELECT setval('teachers_id_seq', ${maxTeacherId.rows[0].max_id}, true)`);
      }
      const maxAttendanceId = await client.query('SELECT MAX(id) as max_id FROM attendance');
      if (maxAttendanceId.rows[0].max_id) {
        await client.query(`SELECT setval('attendance_id_seq', ${maxAttendanceId.rows[0].max_id}, true)`);
      }
    } else {
      console.log('🗑  Clearing existing data...');
      // Delete in correct dependency order
      await client.query('DELETE FROM attendance');
      await client.query('DELETE FROM students');
      await client.query('DELETE FROM teachers');
      await client.query('DELETE FROM sections');
      await client.query('DELETE FROM classes');
      // Reset sequences
      await client.query("SELECT setval('attendance_id_seq', 1, false)");
      await client.query("SELECT setval('students_id_seq', 1, false)");
      await client.query("SELECT setval('teachers_id_seq', 1, false)");
      await client.query("SELECT setval('sections_id_seq', 1, false)");
      await client.query("SELECT setval('classes_id_seq', 1, false)");
      console.log('✅ Existing data cleared.\n');
    }

    // ── 1. Admin ──────────────────────────────────────────────────────────────
    if (!resumeMode) {
      console.log('👤 Inserting admin...');
      const adminHash = await bcrypt.hash('admin', 10);
      await client.query(
        'INSERT INTO teachers (username, password, role) VALUES ($1, $2, $3)',
        ['admin', adminHash, 'admin']
      );
      console.log('   admin / admin  [role: admin]\n');
    } else {
      console.log('👤 Admin already exists, skipping...\n');
    }

    // ── 2. Classes ────────────────────────────────────────────────────────────
    console.log('🏫 Inserting classes...');
    const classIds = {}; // name -> id
    for (const cls of classConfig) {
      const r = await client.query(
        'INSERT INTO classes (name) VALUES ($1) RETURNING id', [cls.name]
      );
      classIds[cls.name] = r.rows[0].id;
      console.log(`   Class ${cls.name} → id ${r.rows[0].id}`);
    }

    // ── 3. Sections + Teachers + Students + Attendance ────────────────────────
    const allSchoolDays = getSchoolDays(new Date('2024-01-01'), new Date('2026-07-10'));
    // Reduce attendance days to avoid overwhelming the database
    const sampledSchoolDays = sampleDays(allSchoolDays, 0.3); // Reduced from 0.6 to 0.3

    for (const cls of classConfig) {
      const classId = classIds[cls.name];

      for (const secName of cls.sections) {
        // 3a. Section
        const secR = await client.query(
          'INSERT INTO sections (name, class_id) VALUES ($1, $2) RETURNING id',
          [secName, classId]
        );
        const sectionId = secR.rows[0].id;
        console.log(`\n📂 Class ${cls.name} | Section ${secName} → section_id ${sectionId}`);

        // 3b. Teacher for this section (male only)
        const subject = subjects[Math.floor(Math.random() * subjects.length)];
        const teacherFullName = randomMaleName();
        const teacherFirstName = teacherFullName.split(' ')[0];
        // username: e.g. "Ahmed_Khan" (FirstName_LastName)
        const teacherUsername = teacherFullName.replace(/\s+/g, '_');
        const teacherHash = await bcrypt.hash(teacherFirstName, 10);
        await client.query(
          'INSERT INTO teachers (username, password, class_id, section_id, role) VALUES ($1, $2, $3, $4, $5)',
          [teacherUsername, teacherHash, classId, sectionId, 'teacher']
        );
        console.log(`   👨‍🏫 Teacher: ${teacherUsername} | password: ${teacherFirstName} | subject: ${subject}`);

        // 3c. Students (20–25 per section) — further reduced for stability
        const studentCount = 20 + Math.floor(Math.random() * 6); // 20–25
        const sectionNamePool = buildNamePool(studentCount + 20); // slightly larger to ensure uniqueness
        const studentIds = [];
        for (let s = 0; s < studentCount; s++) {
          const studentName = sectionNamePool[s];
          const sR = await client.query(
            'INSERT INTO students (name, class_id, section_id) VALUES ($1, $2, $3) RETURNING id',
            [studentName, classId, sectionId]
          );
          studentIds.push(sR.rows[0].id);
        }
        console.log(`   👩‍🎓 ${studentCount} students inserted`);

        // 3d. Attendance — sample ~30% of school days for variety
        const attendanceDays = sampledSchoolDays;
        console.log(`   📅 Taking attendance on ${attendanceDays.length} days...`);

        // Batch insert attendance in smaller chunks to avoid connection timeouts
        const CHUNK = 100; // Reduced from 500 to 100
        let attendanceRows = [];
        let totalInserted = 0;
        for (const day of attendanceDays) {
          for (const studentId of studentIds) {
            // ~85% present, ~15% absent — realistic school attendance
            const status = Math.random() < 0.85 ? 'Present' : 'Absent';
            attendanceRows.push(`(${studentId}, ${classId}, ${sectionId}, '${day}', '${status}')`);
          }
          // Insert in chunks
          if (attendanceRows.length >= CHUNK) {
            await client.query(
              `INSERT INTO attendance (student_id, class_id, section_id, attendance_date, status) VALUES ${attendanceRows.join(',')}`
            );
            totalInserted += attendanceRows.length;
            attendanceRows = [];
            console.log(`   📊 Progress: ${totalInserted} attendance records inserted...`);
            // Small delay to avoid overwhelming the database
            await new Promise(resolve => setTimeout(resolve, 100));
          }
        }
        if (attendanceRows.length > 0) {
          await client.query(
            `INSERT INTO attendance (student_id, class_id, section_id, attendance_date, status) VALUES ${attendanceRows.join(',')}`
          );
          totalInserted += attendanceRows.length;
        }
        console.log(`   ✅ Attendance inserted (${totalInserted} total records)`);
      }
    }

    await client.query('COMMIT');
    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📋 Login credentials:');
    console.log('   ADMIN  → username: admin     | password: admin');
    console.log('   TEACHER → username: FirstName_LastName | password: FirstName');
    console.log('   e.g.   → username: Ahmed_Khan | password: Ahmed');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Seed failed, rolled back:', err.message);
    throw err;
  } finally {
    client.release();
    pool.end();
  }
}

seed();

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: 'postgresql://postgres.aaolafhyxxhfdurmvcdg:1EBfJyyqFcgTd6u3@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

// Pakistani Muslim Male Names
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

function randomMaleName() {
  const first = maleFirstNames[Math.floor(Math.random() * maleFirstNames.length)];
  const last = maleLastNames[Math.floor(Math.random() * maleLastNames.length)];
  return `${first} ${last}`;
}

async function updateTeacherUsernames() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    console.log('🔄 Updating teacher usernames...\n');

    // Get all teachers except admin
    const teachers = await client.query(
      "SELECT id, username, password FROM teachers WHERE role != 'admin' ORDER BY id"
    );

    console.log(`Found ${teachers.rows.length} teachers to update\n`);

    for (const teacher of teachers.rows) {
      // Generate new FirstName_LastName format
      const newFullName = randomMaleName();
      const newUsername = newFullName.replace(/\s+/g, '_');
      const firstName = newFullName.split(' ')[0];
      
      // Hash the new password (first name)
      const newPasswordHash = await bcrypt.hash(firstName, 10);
      
      // Update the teacher
      await client.query(
        'UPDATE teachers SET username = $1, password = $2 WHERE id = $3',
        [newUsername, newPasswordHash, teacher.id]
      );
      
      console.log(`✅ Updated teacher ${teacher.id}: ${teacher.username} → ${newUsername} (password: ${firstName})`);
    }

    await client.query('COMMIT');
    console.log('\n🎉 All teacher usernames updated successfully!');
    console.log('\n📋 New login credentials:');
    console.log('   ADMIN  → username: admin     | password: admin');
    console.log('   TEACHER → username: FirstName_LastName | password: FirstName');
    console.log('   e.g.   → username: Ahmed_Khan | password: Ahmed');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Update failed, rolled back:', err.message);
    throw err;
  } finally {
    client.release();
    pool.end();
  }
}

updateTeacherUsernames();

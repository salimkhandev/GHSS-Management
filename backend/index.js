const express = require('express');
const pool = require('./Routes/dbConfig')
const app = express();
const cors = require('cors')
const cookieParser = require('cookie-parser');

const teacherAdmin=require('./Routes/authRoutes/teacherAdminAuth')
const classSectionRoutes = require('./Routes/ClassesSections/ClassesSections'); // Adjust the path as needed
const studentRoutes = require('./Routes/Students/students');
const bulkupload = require('./Routes/Students/bulkupload')
const studentsAttendance = require('./Routes/attendanceRoutes/attendanceRoutes');
const dailyAttenPercentage = require('./Routes/AttenPercentageForPieChart/dailyAttenPercentage');
const monthlyAttenPercentage = require('./Routes/AttenPercentageForPieChart/monthlyAttenPercentage');
const overallAttenPercentage = require('./Routes/AttenPercentageForPieChart/overallAttenPercentage');
const attenBasedSectionsPerformance = require('./Routes/AttenPercentageForPieChart/attenBasedSectionsPerformance');
const Top10StudentsAtten = require('./Routes/AttenPercentageForPieChart/Top10StudentsAtten');
const verifyTokenAsAdmin=require('./Routes/RBA/verifyTokenAsAdmin')
const verifyTokenAsTeacher=require('./Routes/RBA/verifyTokenAsTeacher')
const myclasssection=require('./ClassesSectionsRedis')
// const attendanceGroupedByDate =require('./Routes/attendanceRoutes/attendanceGroupedByDate')


// Use cookie-parser middleware
app.use(cookieParser());
app.use(cors({
   origin: [
      'https://ghss-management.vercel.app', // Production frontend
      'http://localhost:5173'               // Local development frontend
   ],
   credentials: true // Allow cookies to be sent
}));

// app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use('/', classSectionRoutes);
app.use('/', myclasssection);
app.use('/', studentsAttendance);
app.use('/', teacherAdmin);
app.use('/', studentRoutes); // Use student routes
app.use('/students/bulk', bulkupload);
// app.use('/attendanceGroupedByDate', attendanceGroupedByDate);
app.use('/verify-token-asAdmin', verifyTokenAsAdmin);
app.use('/verify-token-asTeacher', verifyTokenAsTeacher);
app.use('/dailyAttenPercentage', dailyAttenPercentage); // Use attendance percentage routes
app.use('/monthlyAttenPercentage', monthlyAttenPercentage); // Use attendance percentage routes
app.use('/overallAttenPercentage', overallAttenPercentage); // Use attendance percentage routes
app.use('/attenBasedSectionsPerformance', attenBasedSectionsPerformance); // Use attendance percentage routes
app.use('/Top10StudentsAtten', Top10StudentsAtten); // Use attendance percentage routes


app.get('/', (req, res) => {
   res.json("Hello from backend")
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});



const express = require('express');
const pool = require('./dbConfig')
const app = express();
const cors = require('cors')
const cookieParser = require('cookie-parser');


const classSectionRoutes = require('./Routes/classSectionRoutes'); // Adjust the path as needed
const studentRoutes = require('./Routes/registerStudent');
const bulkupload = require('./Routes/bulkupload')
const studentsAttendance = require('./Routes/studentsAttendance');



// Use cookie-parser middleware
app.use(cookieParser());
// app.use(cors({
//    origin: 'https://ghss-management.vercel.app', // Your frontend's origin
//    credentials: true // Allow cookies to be sent
// }));
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());


app.use('/', classSectionRoutes);
app.use('/', studentsAttendance);
app.use('/students/bulk', bulkupload);
app.use('/', studentRoutes); // Use student routes

app.get('/', (req, res) => {
   res.json("helo salim")
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});

// Parent Component
// import { useState, useEffect } from 'react';
import StudentRegistrationForm from './StudentRegistrationForm';
import StudentBulkUpload from './StudentBulkUpload';
// import axios from 'axios';

function StudentForm() {
  
    return (
        <div>
            <StudentRegistrationForm  />
            <StudentBulkUpload />
        </div>
    );
}

export default StudentForm;

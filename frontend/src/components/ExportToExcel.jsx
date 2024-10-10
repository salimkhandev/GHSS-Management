import * as XLSX from 'xlsx';
import { Button } from '@mui/material';
import { saveAs } from 'file-saver';
import PropTypes from 'prop-types';
import FileDownloadIcon from '@mui/icons-material/FileDownload'; // Importing the icon

const ExportToExcel = ({ students }) => {
    const filteredStudents = students.map(({ id, ...rest }) => rest);

    const handleExport = () => {
        // Extract class and section from the first row of the sheet
        const firstStudent = filteredStudents.length > 0 ? filteredStudents[0] : {};
        const className = firstStudent.class_name || 'class';
        const sectionName = firstStudent.section_name || 'section';
        const fileName = `${className.replace(/\s/g, '-')}_section-${sectionName.replace(/\s/g, '-')}.xlsx`;

        const ws = XLSX.utils.json_to_sheet(filteredStudents);
        
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Students');

        // Generate Excel file
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' });

        // Save the Excel file
        saveAs(data, fileName);
    };

    return (
        <Button startIcon={<FileDownloadIcon />} variant="contained" sx={{textTransform:'none',marginTop:'22px'}} color="primary" onClick={handleExport}>
            Export to Excel
        </Button>
    );
};
// Define prop types for the component
ExportToExcel.propTypes = {
    students: PropTypes.arrayOf(    
        PropTypes.shape({
            id: PropTypes.number, // You can specify more properties if needed
            name: PropTypes.string,
            age: PropTypes.number
        })
    ).isRequired
};

export default ExportToExcel;

import * as XLSX from 'xlsx';
import { Button } from '@mui/material';
import { saveAs } from 'file-saver';
import PropTypes from 'prop-types';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const ExportToExcel = ({ students = [], data = [] }) => {
    // Use either students or data prop, whichever is provided
    const dataToExport = students.length > 0 ? students : data;

    // Return null if no data to export
    if (!dataToExport || dataToExport.length === 0) {
        return null;
    }

    // Filter out the id field from the data
    const filteredData = dataToExport.map(({ id, ...rest }) => rest);

    const handleExport = () => {
        // Extract class and section from the first row for filename
        const firstItem = filteredData[0] || {};
        const className = firstItem.class_name || 'students';
        const sectionName = firstItem.section_name || '';

        // Generate filename
        const fileName = sectionName
            ? `${className.replace(/\s/g, '-')}_section-${sectionName.replace(/\s/g, '-')}.xlsx`
            : `${className.replace(/\s/g, '-')}.xlsx`;

        // Create worksheet from data
        const ws = XLSX.utils.json_to_sheet(filteredData);

        // Create workbook and append worksheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Students');

        // Generate Excel file
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: 'application/octet-stream' });

        // Save the Excel file
        saveAs(data, fileName);
    };

    return (
        <Button
            startIcon={<FileDownloadIcon />}
            variant="contained"
            color="primary"
            onClick={handleExport}
            size="small"
            sx={{
                textTransform: 'none',
                borderRadius: 2,
                fontWeight: 600,
            }}
        >
            Export to Excel
        </Button>
    );
};

// Define prop types for the component
ExportToExcel.propTypes = {
    students: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            student_name: PropTypes.string,
            class_name: PropTypes.string,
            section_name: PropTypes.string,
        })
    ),
    data: PropTypes.arrayOf(PropTypes.object),
};

ExportToExcel.defaultProps = {
    students: [],
    data: [],
};

export default ExportToExcel;

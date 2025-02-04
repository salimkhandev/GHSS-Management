import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  Button, CircularProgress, MenuItem, Select, 
  Typography, FormControl, InputLabel, Snackbar 
} from "@mui/material";

const Classes = ({
  selectedClass: originalClass,
  selectedSection: originalSection,
  studentIds,
  selectedSectionName,
  totalSelectedStudents,
  setFilteredStudents,
  handleSelectAllChange
}) => {
  const [classes, setClasses] = useState([]);
  const [targetSections, setTargetSections] = useState([]);
  const [targetClassId, setTargetClassId] = useState(null);
  const [targetSectionId, setTargetSectionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  // Determine initial target class based on original class
  useEffect(() => {
    const newClassId = originalClass === 7 ? 7 : originalClass + 1;
    setTargetClassId(newClassId);
  }, [originalClass]);

  // Fetch all classes on mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('https://ghss-management-backend.vercel.app/classes');
        setClasses(response.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    fetchClasses();
  }, []);

  // Fetch sections when target class changes
  useEffect(() => {
    const fetchTargetSections = async () => {
      if (!targetClassId) return;

      try {
        const externalSection = getExternalSection(originalClass, selectedSectionName);
        const response = await axios.post(
          'https://ghss-management-backend.vercel.app/getsec',
          { class_id: targetClassId }
        );

        setTargetSections(response.data);
        const matchedSection = response.data.find(sec => sec.name === externalSection);
        if (matchedSection) setTargetSectionId(matchedSection.id);
        
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };

    fetchTargetSections();
  }, [targetClassId, originalClass, selectedSectionName]);

  const getExternalSection = (originalClass, sectionName) => {
    if (originalClass === 7) {
      return sectionName === 'A' ? 'B' : 'A';
    }
    return sectionName;
  };

  const handleClassChange = (event) => {
    const classId = event.target.value;
    const selectedClass = classes.find(cls => cls.id === classId);
    setTargetClassId(classId);
    setTargetSectionId(''); // Reset section when class changes
  };

  const handlePromoteStudents = async () => {
    if (!targetClassId || !targetSectionId) return;

    setLoading(true);
    try {
      await axios.post('https://ghss-management-backend.vercel.app/promotestd', {
        selectedClassId: targetClassId,
        selectedSectionId: targetSectionId,
        originalSelectedClass: originalClass,
        originalSelectedSection: originalSection,
        studentIds
      });

      setSnackbar({
        open: true,
        message: `${totalSelectedStudents} student${totalSelectedStudents !== 1 ? 's' : ''} promoted successfully!`
      });

      setTimeout(() => {
        setFilteredStudents([]);
        handleSelectAllChange();
      }, 2000);

    } catch (error) {
      console.error('Promotion error:', error);
      setSnackbar({ open: true, message: "Error promoting students" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="promotion-target">
      <FormControl fullWidth margin="normal">
        <InputLabel>Target Class</InputLabel>
        <Select
          value={targetClassId || ''}
          onChange={handleClassChange}
          label="Target Class"
          disabled={loading}
        >
          {classes.map(cls => (
            <MenuItem key={cls.id} value={cls.id}>
              {cls.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Target Section</InputLabel>
        <Select
          value={targetSectionId}
          onChange={(e) => setTargetSectionId(e.target.value)}
          label="Target Section"
          disabled={!targetClassId || loading}
        >
          {targetSections.map(sec => (
            <MenuItem key={sec.id} value={sec.id}>
              {sec.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        onClick={handlePromoteStudents}
        disabled={!targetSectionId || loading}
        style={{ marginTop: 16 }}
      >
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          `Promote ${totalSelectedStudents} Student${totalSelectedStudents !== 1 ? 's' : ''}`
        )}
      </Button>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        message={snackbar.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />
    </div>
  );
};

export default Classes;
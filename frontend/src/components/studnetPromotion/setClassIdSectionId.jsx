
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, CircularProgress, MenuItem, Select, Typography, FormControl, InputLabel } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";

const Classes = ({ selectedClass, selectedSection, studentIds, selectedSectionName, totalSelectedStudents, setFilteredStudents, handleSelectAllChange }) => {
  const [classes, setClasses] = useState([]);
  const [section, setSection] = useState([]);
  const [ClassName, setClassName] = useState('');

  const [selectedClassId, setSelectedClassId] = useState(selectedClass);
  const [bringClassSec, setBringClassSec ] = useState();
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [loading, setLoading] = useState(false);
  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: "" });
  };
  useEffect(() => {
    const newClassId = selectedClass === 7 ? 7 : selectedClass + 1;
    setSelectedClassId(newClassId);
    setBringClassSec(newClassId);
  }, [selectedClass]);



  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const responseCls = await axios.get('http://localhost:3000/classes');
        setClasses(responseCls.data);
      } catch (error) {
        console.error("Error fetching the classes data:", error);
      }
    };

    fetchClasses();
  }, []);
// useEffect(() => {

// }, [third]);

  const handleChangeSec = (id,name) => {
    setSection([])
    let class_id = id
    setSelectedClassId(class_id);
    setBringClassSec(class_id);
    setClassName(name)
    

  };

useEffect(() => {

let class_id;
if (bringClassSec) {
  class_id = bringClassSec
}
  let externalSection;
  if (selectedClass === 7 && selectedSectionName === 'A' && (!ClassName || ClassName==='Class 12')) {
  
    externalSection = 'B';

    
  }
  
  else if (selectedClass === 7 && selectedSectionName === 'B' && (!ClassName  || ClassName === 'Class 12')) {
  
    externalSection = 'A';
    
  }
  else{

    externalSection = selectedSectionName;
  }
 
  const fetchSections = async () => {

  try {
    const responseSec = await axios.post('http://localhost:3000/getsec', { class_id });
    setSection(responseSec.data);
   
    
    const matchedSection = responseSec.data.find((sec) => sec.name === externalSection);

    // If a matching section is found, set its section_id to selectedSectionId
    if (matchedSection) {

      setSelectedSectionId(matchedSection.id);
    } else {
      console.log('No matching section found.');
    }


  } catch (err) {
    console.log(err);
  }}                                                          
  fetchSections();
}, [selectedClassId,bringClassSec,selectedSectionName,selectedClass,ClassName]);

  const handleSelectedSection = (e) => {
   
    
      const section_id = e.target.value;
      setSelectedSectionId(section_id);

    
  };

  const handleSubmit = async () => {
    setLoading(true); // Show loader
    try {
      const response = await axios.post('http://localhost:3000/promotestd', {
        selectedClassId: selectedClassId, // Local state value
        selectedSectionId: selectedSectionId, // Local state value
        originalSelectedClass: selectedClass, // Prop value
        originalSelectedSection: selectedSection, // Prop value
        studentIds: studentIds // Pass selected student IDs
      });
      console.log('Response from server:', response.data);
      setSnackbar({
        open: true, message: `${totalSelectedStudents || 0} student${totalSelectedStudents > 1 ? 's' : ''} successfully promoted!`
});
      setTimeout(() => {
        setFilteredStudents([]);
        handleSelectAllChange()
      }, 3000); // Adjust the delay (in milliseconds) as needed

    } catch (error) {
      console.error('Error sending data:', error);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  return (
    <div>
      <FormControl fullWidth variant="outlined" margin="normal">
        <InputLabel id="class-select-label">Select a class</InputLabel>
        <Select
          labelId="class-select-label"
          value={selectedClassId}
          // onChange={handleChangeSec}
          onChange={(event) => {
            const selectedId = event.target.value;
            const selectedClass = classes.find(cls => cls.id === selectedId);
            handleChangeSec(selectedId, selectedClass?.name);
          }}
          label="Select a class"
          
        >
          <MenuItem value=""><em>Select a class</em></MenuItem>
          {classes.map(cls => (
            <MenuItem value={cls.id} key={cls.id}>
              {cls.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>


        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel id="section-select-label">Select a section</InputLabel>
          <Select
            labelId="section-select-label"
            value={selectedSectionId}
            onChange={handleSelectedSection}
            label="Select a section"
          >
            <MenuItem value=""><em>Select a section</em></MenuItem>
            {section.map(sec => (
              <MenuItem value={sec.id} key={sec.id}>
                {sec.name}
                </MenuItem>
            ))}
          </Select>
        </FormControl>
     

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={loading} // Disable button while loading
        style={{ marginTop: '16px' }}
      >
        {loading ? <CircularProgress size={24} /> : 'Promote'}
      </Button>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />
    </div>
  );
};

export default Classes;



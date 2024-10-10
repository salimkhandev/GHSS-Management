import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

function MyComponent() {
    const [sectionModalOpen, setSectionModalOpen] = useState(false);

    const handleOpen = () => {
        setSectionModalOpen(true);
    };

    const handleClose = () => {
        setSectionModalOpen(false);
    };

    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleOpen}>
                Open Modal
            </Button>
            <Modal open={sectionModalOpen} onClose={handleClose}>
       
                <select name="opt" id="opt">
                    <option value="">hi</option>
                    <option value="">hi</option>
                    <option value="">hi</option>
                    <option value="">hi</option>
                </select>
            </Modal>
        </div>
    );
}

export default MyComponent;
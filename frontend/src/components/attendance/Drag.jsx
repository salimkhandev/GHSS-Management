import React, { useCallback, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";

const ProfileUploader = () => {
    const [profilePic, setProfilePic] = useState("https://via.placeholder.com/150");
    const fileInputRef = useRef(null); // Creating a reference for the file input

    // Handle file selection
    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                setProfilePic(event.target.result);
                fileInputRef.current.blur(); // Ensure file input loses focus
            };
            fileInputRef.current.value = ""; // Reset file input value
        }
    }, []);


    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: "image/*",
        noClick: true,  // Disable default click-to-select behavior
    });

    // Open file dialog when drop area is clicked
    const handleOpenFileDialog = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div
                {...getRootProps()}
                onClick={handleOpenFileDialog} // Open the file dialog when the area is clicked
                className={`border-2 border-dashed w-64 h-64 flex flex-col justify-center items-center bg-white rounded-lg shadow-lg cursor-pointer transition duration-300 
                ${isDragActive ? "border-blue-500" : "border-gray-400"}`}
            >
                <input
                    {...getInputProps()}
                    ref={fileInputRef} // Reference the input element
                    style={{ display: "none" }} // Hide the file input element
                />
                <img className="w-24 h-24 rounded-full object-cover mb-4" src={profilePic} alt="Profile" />
                <p className="text-gray-600 text-sm">Drag & Drop or Click to Upload</p>
            </div>
        </div>
    );
};

export default ProfileUploader;

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

const ProfileUploader = () => {
    const [profilePic, setProfilePic] = useState("https://via.placeholder.com/150");

    // Handle file selection
    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setProfilePic(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: "image/*" });

    return (
        <div  {...getRootProps()} className="flex justify-center items-center h-screen bg-gray-100">
            <div
               
                className={`border-2 border-dashed w-64 h-64 flex flex-col justify-center items-center bg-white rounded-lg shadow-lg cursor-pointer transition duration-300 
        ${isDragActive ? "border-blue-500" : "border-gray-400"}`}
            >
                <input {...getInputProps()} />
                <img className="w-24 h-24 rounded-full object-cover mb-4" src={profilePic} alt="Profile" />
                <p className="text-gray-600 text-sm">Drag & Drop or Click to Upload</p>
            </div>
        </div>
    );
};

export default ProfileUploader;

import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadIcon from "@mui/icons-material/Upload";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { SnackbarProvider, useSnackbar } from "notistack";
import { memo, useCallback, useEffect, useState } from "react";
import Cropper from "react-easy-crop";
// import { useAuth } from '../admin/AuthProvider';

const ProfilePicManager = ({ showModal, setShowModal, imageUrl, setImageUrl, onImageUpdate }) => {
    const { enqueueSnackbar } = useSnackbar();
    // const [imageUrl, setImageUrl] = useState(null);
    const [file, setFile] = useState(null);
    const [image, setImage] = useState(null); // Image for cropping
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    // const [showModal, setShowModal] = useState(false); // Modal state
    // const [keepProfilePicUpdated, setKeepProfilePicUpdated] = useState(false);
    // const [username, setUsername] = useState('');
    // const { isAuthenticated, isAuthenticatedTeacher, login, logout } = useAuth();

    // Fetch the current profile picture
    // useEffect(() => {
    //     const fetchProfilePic = async () => {
    //         setLoading(true);
    //         try {
    //             const response = await axios.get("http://localhost:3000/profile-pic", { withCredentials: true });
    //             setImageUrl(`${response.data.imageUrl}?t=${Date.now()}`);
    //             setUsername(response.data.teacherName);
    //         } catch (error) {
    //         //   enqueueSnackbar("Failed to fetch profile picture.", { variant: "error" });
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     fetchProfilePic();
    // }, [keepProfilePicUpdated]);

    // Handle file selection
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    // Handle cropping
    const onCropComplete = useCallback((_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const getCroppedImage = async () => {
        return new Promise((resolve, reject) => {
            if (!image || !croppedAreaPixels) return reject("No image to crop!");

            const croppedCanvas = document.createElement("canvas");
            const ctx = croppedCanvas.getContext("2d");
            const img = new Image();
            img.src = image;

            img.onload = () => {
                croppedCanvas.width = croppedAreaPixels.width;
                croppedCanvas.height = croppedAreaPixels.height;
                ctx.drawImage(
                    img,
                    croppedAreaPixels.x,
                    croppedAreaPixels.y,
                    croppedAreaPixels.width,
                    croppedAreaPixels.height,
                    0,
                    0,
                    croppedAreaPixels.width,
                    croppedAreaPixels.height
                );
                resolve(croppedCanvas.toDataURL("image/png"));
            };
            img.onerror = (err) => reject(err);
        });
    };

    const handleUpload = async () => {
        if (!croppedAreaPixels) return enqueueSnackbar("Please crop the image before uploading.", { variant: "warning" });

    
        setLoading(true);

        try {
            const croppedImageDataUrl = await getCroppedImage();
            const formData = new FormData();
            formData.append("profilePic", dataURLtoFile(croppedImageDataUrl, file.name));

            const response = await axios.post("https://ghss-management-backend.vercel.app/upload-profile", formData, {
            // const response = await axios.post("http://localhost:3000/upload-profile", formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            });

            // setImageUrl();
            setImageUrl(`${response.data.imageUrl}?t=${Date.now()}`);
            onImageUpdate(`${response.data.imageUrl}?t=${Date.now()}`);
            setShowModal(false);
            setImage(null);
            // setShowModal(false);
            // onImageUpdate(response.data.imageUrl);
            // setKeepProfilePicUpdated(!keepProfilePicUpdated);
                // setImageUrl(null);
        // setImage(null);
            enqueueSnackbar("Profile picture uploaded successfully!", { variant: "success" });
        } catch (error) {
            enqueueSnackbar("Failed to upload profile picture.", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    // Delete Profile Picture
    const handleDelete = async () => {
        setDeleteLoading(true);
        try {
            await axios.delete("https://ghss-management-backend.vercel.app/delete-profile-pic", { withCredentials: true });
            // await axios.delete("http://localhost:3000/delete-profile-pic", { withCredentials: true });
            setImageUrl(null);
            setShowModal(false);
            enqueueSnackbar("Profile picture deleted successfully!", { variant: "success" });
        } catch (error) {
            enqueueSnackbar("Failed to delete profile picture.", { variant: "error" });
        } finally {
            setDeleteLoading(false);
        }
    };

    // Convert dataURL to File
    const dataURLtoFile = (dataUrl, filename) => {
        const arr = dataUrl.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };

    return (
        <>
         

{/* {(isAuthenticated || isAuthenticatedTeacher) && (<div className="text-center">
    <div onClick={() => setShowModal(true)} className="mb-2 cursor-pointer">
        <div className="w-20 h-20 rounded-full mx-auto border-blue-500 border-4 flex justify-center items-center overflow-hidden bg-gray-200">
            {loading ? (
                <CircularProgress sx={{ color: "green", width: "80%", height: "80%" }} />
                
            ) : imageUrl ? (
                <img key={imageUrl} src={imageUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
                <img src="/images/defaultPicPerson.svg" alt="Profile" className="w-full h-full object-cover" />
            )}
        </div>
        <h3 className="text-lg font-bold text-white mt-2">{username}</h3>
    </div>
</div>)} */}


            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-transparent border-2 border-blue-700 p-4 rounded-lg shadow-xl max-w-sm w-full relative">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-[0px] right-0 text-red-200 hover:bg-blue-300 hover:text-red-500 p-1 m-1 rounded-full transition duration-300"
                        >
                            <CloseIcon className="w-5 h-5" />
                        </button>

                        {/* Image in condition */}
                        {image && (
                            <div className="relative w-80 h-60 border-2  border-gray-400 rounded-md shadow-md hover:border-blue-400 transition duration-300">
                                <Cropper
                                    image={image}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    cropShape="round"
                                    showGrid={false}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={onCropComplete}
                                />
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="space-x-4 flex justify-center mt-4">
                            {/* Delete Button (only visible when imageUrl exists) */}
                            {!image && imageUrl && (
                                <button
                                    onClick={handleDelete}
                                    className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg border border-white hover:bg-red-600 focus:ring-2 focus:ring-red-400 transition duration-300 ease-in-out"
                                >
                                    {deleteLoading ? "Deleting..." : (
                                        <span className="flex items-center">
                                            <DeleteIcon className="w-6 h-6 mr-2" />
                                            Delete
                                        </span>
                                    )}
                                </button>
                            )}

                            {/* Hidden File Input */}
                            <input type="file" accept="image/*" onChange={handleFileChange} id="fileInput" className="hidden" />

                            {/* Upload & Done Buttons */}
                            {image ? (
                                <button
                                    onClick={handleUpload}
                                    className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-400 transition duration-300 ease-in-out"
                                >
                                    {loading ? <CircularProgress size={20} color="inherit" /> : "Done"}
                                </button>
                            ) : (
                                <label
                                    htmlFor="fileInput"
                                    className="bg-blue-500 text-white border border-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 transition duration-300 ease-in-out cursor-pointer flex items-center"
                                >
                                    <UploadIcon className="mr-2" />
                                    Upload
                                </label>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </>
    );
    };

const ProfilePicManagerWithSnackbar = (props) => (
    <SnackbarProvider maxSnack={3}>
        <ProfilePicManager {...props} />
    </SnackbarProvider>
);

export default ProfilePicManagerWithSnackbar;

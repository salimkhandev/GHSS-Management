import { 
    AddAPhoto as AddPhotoIcon,
    Close as CloseIcon,
    Delete as DeleteIcon,
    PhotoCamera as PhotoCameraIcon,
    Upload as UploadIcon 
} from "@mui/icons-material";
import { 
    Box,
    Button, 
    CircularProgress,
    IconButton,
    Typography 
} from "@mui/material";
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
            if (selectedFile.size > 5000000) { // 5MB limit
                enqueueSnackbar("File size should be less than 5MB", { variant: "error" });
                return;
            }
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => setImage(reader.result);
            reader.readAsDataURL(selectedFile);
        }
    };

    // Handle cropping
    const onCropComplete = useCallback((_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const getCroppedImage = async () => {
        try {
            if (!image || !croppedAreaPixels) throw new Error("No image to crop!");

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const img = new Image();
            
            return new Promise((resolve) => {
                img.onload = () => {
                    canvas.width = croppedAreaPixels.width;
                    canvas.height = croppedAreaPixels.height;
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
                    resolve(canvas.toDataURL("image/jpeg", 0.8)); // Compress to 80% quality
                };
                img.src = image;
            });
        } catch (error) {
            enqueueSnackbar("Error processing image", { variant: "error" });
            throw error;
        }
    };

    const handleUpload = async () => {
        if (!croppedAreaPixels) {
            enqueueSnackbar("Please crop the image before uploading", { variant: "warning" });
            return;
        }

        setLoading(true);
        try {
            const croppedImageDataUrl = await getCroppedImage();
            const formData = new FormData();
            formData.append("profilePic", dataURLtoFile(croppedImageDataUrl, file.name));

            const response = await axios.post(
                "https://ghss-management-backend.vercel.app/upload-profile", 
                formData, 
                {
                    withCredentials: true,
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            setImageUrl(`${response.data.imageUrl}?t=${Date.now()}`);
            onImageUpdate(`${response.data.imageUrl}?t=${Date.now()}`);
            setShowModal(false);
            setImage(null);
            enqueueSnackbar("Profile picture updated successfully!", { variant: "success" });
        } catch (error) {
            enqueueSnackbar("Failed to upload profile picture", { variant: "error" });
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
            enqueueSnackbar("Failed to delete profile picture", { variant: "error" });
        } finally {
            setDeleteLoading(false);
        }
    };

    // Convert dataURL to File
    const dataURLtoFile = (dataUrl, filename) => {
        const arr = dataUrl.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        const u8arr = new Uint8Array(bstr.length);
        for (let i = 0; i < bstr.length; i++) {
            u8arr[i] = bstr.charCodeAt(i);
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
                <Box
                    sx={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1300,
                        backdropFilter: 'blur(4px)'
                    }}
                >
                    <Box
                        sx={{
                            backgroundColor: 'white',
                            borderRadius: 2,
                            p: 3,
                            width: '90%',
                            maxWidth: 500,
                            position: 'relative',
                            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.2)',
                            border: '2px solid #1976d2'
                        }}
                    >
                        <IconButton
                            onClick={() => setShowModal(false)}
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                color: 'grey.500',
                                '&:hover': {
                                    color: 'error.main',
                                    backgroundColor: 'error.light'
                                }
                            }}
                        >
                            <CloseIcon />
                        </IconButton>

                        <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 600 }}>
                            Update Profile Picture
                        </Typography>

                        {image ? (
                            <Box
                                sx={{
                                    position: 'relative',
                                    height: 300,
                                    width: '100%',
                                    backgroundColor: '#f5f5f5',
                                    borderRadius: 1,
                                    overflow: 'hidden'
                                }}
                            >
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
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    height: 200,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#f5f5f5',
                                    borderRadius: 1,
                                    border: '2px dashed #1976d2',
                                    mb: 2
                                }}
                            >
                                <AddPhotoIcon sx={{ fontSize: 48, color: '#1976d2', mb: 1 }} />
                                <Typography color="textSecondary">
                                    Click to select an image
                                </Typography>
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'center' }}>
                            {!image && imageUrl && (
                                <Button
                                    onClick={handleDelete}
                                    disabled={deleteLoading}
                                    variant="contained"
                                    color="error"
                                    startIcon={deleteLoading ? <CircularProgress size={20} /> : <DeleteIcon />}
                                    sx={{
                                        background: 'linear-gradient(45deg, #f44336 30%, #e57373 90%)',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #d32f2f 30%, #f44336 90%)'
                                        }
                                    }}
                                >
                                    Delete
                                </Button>
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                id="fileInput"
                                style={{ display: 'none' }}
                            />

                            {image ? (
                                <Button
                                    onClick={handleUpload}
                                    disabled={loading}
                                    variant="contained"
                                    startIcon={loading ? <CircularProgress size={20} /> : <UploadIcon />}
                                    sx={{
                                        background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                                        '&:hover': {
                                            background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)'
                                        }
                                    }}
                                >
                                    Upload
                                </Button>
                            ) : (
                                <label htmlFor="fileInput">
                                    <Button
                                        component="span"
                                        variant="contained"
                                        startIcon={<PhotoCameraIcon />}
                                        sx={{
                                            background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                                            '&:hover': {
                                                background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)'
                                            }
                                        }}
                                    >
                                        Select Image
                                    </Button>
                                </label>
                            )}
                        </Box>
                    </Box>
                </Box>
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

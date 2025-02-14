import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Cropper from "react-easy-crop";
import { CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UploadIcon from "@mui/icons-material/Upload";
import DeleteIcon from "@mui/icons-material/Delete";
import { SnackbarProvider, useSnackbar } from "notistack";

const ProfilePicManager = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [imageUrl, setImageUrl] = useState(null);
    const [file, setFile] = useState(null);
    const [image, setImage] = useState(null); // Image for cropping
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showModal, setShowModal] = useState(false); // Modal state
    const [keepProfilePicUpdated, setKeepProfilePicUpdated] = useState(false);

    // Fetch the current profile picture
    useEffect(() => {
        const fetchProfilePic = async () => {
            setLoading(true);
            try {
                const response = await axios.get("http://localhost:3000/profile-pic", { withCredentials: true });
                setImageUrl(`${response.data.imageUrl}?t=${Date.now()}`);
            } catch (error) {
              
            } finally {
                setLoading(false);
            }
        };
        fetchProfilePic();
    }, [keepProfilePicUpdated]);

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

            const response = await axios.post("http://localhost:3000/upload-profile", formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            });

            setImageUrl(`${response.data.imageUrl}?t=${Date.now()}`);
            setShowModal(false);
            setKeepProfilePicUpdated(!keepProfilePicUpdated);
                setImageUrl(null);
        setImage(null);
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
            await axios.delete("http://localhost:3000/delete-profile-pic", { withCredentials: true });
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
        <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-lg space-y-6">
            <h2 className="text-2xl font-semibold text-center">Manage Profile Picture</h2>

            <div className="text-center">
                <div onClick={() => setShowModal(true)} className="cursor-pointer">
                    {imageUrl ? (
                        <img key={imageUrl} src={imageUrl} alt="Profile" className="w-40 h-40 rounded-full mx-auto object-cover" />
                    ) : loading ? (
                        <div className="w-40 h-40 rounded-full mx-auto bg-gray-200 flex justify-center items-center">
                            <CircularProgress sx={{ color: "black", width: "100%" }} />
                        </div>
                    ) : (
                        <div className="w-40 h-40 rounded-full mx-auto bg-gray-200 flex justify-center items-center">
                            <img src="/images/defaultPicPerson.svg" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50  flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <button
                            onClick={() => setShowModal(false)}
                            className="text-gray-800 px-4 py-2 relative left-[295px] top-[-18px] rounded-lg hover:bg-gray-200 transition"
                        >
                            <CloseIcon />
                        </button>
                        {image && (
                            <div className="relative w-80 h-60">
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

                        <div className="space-x-4 flex justify-center">
                            {!image && imageUrl && (
                                <button
                                    onClick={handleDelete}
                                    className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition ease-in-out"
                                >
                                    {deleteLoading ? "Deleting..." : (
                                        <span className="flex items-center">
                                            <DeleteIcon className="w-6 h-6 mr-2" />
                                            Delete
                                        </span>
                                    )}
                                </button>
                            )}
                            <input type="file" accept="image/*" onChange={handleFileChange} id="fileInput" className="hidden" />
                            {image ? (
                                <button
                                    onClick={handleUpload}
                                    className="bg-green-500 text-white mt-4 font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition ease-in-out"
                                >
                                    {loading ?  <CircularProgress size={20} color="inherit" />  : "Done"}
                                </button>
                            ) : (
                                <label
                                    htmlFor="fileInput"
                                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition ease-in-out cursor-pointer"
                                >
                                    <UploadIcon className="mr-1" />
                                    Upload
                                </label>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default () => (
    <SnackbarProvider maxSnack={3}>
        <ProfilePicManager />
    </SnackbarProvider>
);

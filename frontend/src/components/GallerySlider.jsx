import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import AOS from "aos";
import "aos/dist/aos.css"; // Don't forget to import AOS CSS
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import logo from "/images/ghssLogo.png"; // Ensure the path to your logo is correct

const images = [
    { src: "/images/carousel1.jpg", alt: "School Building" },
    { src: "/images/carousel2.jpg", alt: "School Building" },
    { src: "/images/carousel3.jpg", alt: "School Building" },
    { src: "/images/carousel4.jpg", alt: "School Building" },
    { src: "/images/carousel5.jpg", alt: "School Building" },
    { src: "/images/carousel6.jpg", alt: "School Building" },
    { src: "/images/carousel7.jpg", alt: "School Building" },
    { src: "/images/carousel8.jpg", alt: "School Building" },
    { src: "/images/carousel9.jpg", alt: "School Building" },
];

const NextArrow = ({ onClick }) => (
    <ArrowForwardIos
        onClick={onClick}
        sx={{
            position: "absolute",
            top: "50%",
            right: "35px",
            transform: "translateY(-50%)",
            color: "#fff",
            fontSize: "2rem",
            cursor: "pointer",
            zIndex: 2,
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: "50%",
            padding: "8px",
        }}
    />
);

const PrevArrow = ({ onClick }) => (
    <ArrowBackIos
        onClick={onClick}
        sx={{
            position: "absolute",
            top: "50%",
            left: "35px",
            transform: "translateY(-50%)",
            color: "#fff",
            fontSize: "2rem",
            cursor: "pointer",
            zIndex: 2,
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: "50%",
            padding: "8px",
        }}
    />
);

const GallerySlider = () => {
    const [showSlider, setShowSlider] = useState(false);

    useEffect(() => {
        AOS.init({ duration: 1000 });
        const timer = setTimeout(() => {
            setShowSlider(true);
        }, 3000); // Show slider after 3 seconds

        return () => clearTimeout(timer); // Clean up timer on component unmount
    }, []);

    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
            {/* Welcome Message */}
            {!showSlider && (
                <div
                    className="flex items-center justify-center w-full h-screen bg-gray-100"
                    data-aos="fade-in"
                    data-aos-duration="2000"
                >
                    <Typography variant="h1" align="center" sx={{ fontSize: "3rem", color: "#3f51b5", fontWeight: "bold" }}>
                        Welcome to Our School!
                    </Typography>
                </div>
            )}

            {/* Main Content */}
            {showSlider && (
                <Box sx={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#f4f4f4" }}>
                    {/* Logo at the Top */}
                    <div >
                        <img
                            src={logo}
                            alt="School Logo"
                            className="h-32 w-32 object-contain mx-auto" // Larger logo size
                        />
                    </div>

                    {/* Gallery */}
                    <Slider {...settings} style={{ width: "90vw", maxWidth: "1000px" }}>
                        {images.map((image, index) => (
                            <Box key={index} sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: ['4px'] }}>
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                    style={{
                                        width: "100%",
                                        height: "80vh",
                                        objectFit: "cover",
                                        border: "10px solid gray",
                                        borderRadius: "20px",
                                        boxShadow: "0px 8px 20px rgba(1, 1, 1, 0.1)",
                                    }}
                                />
                            </Box>
                        ))}
                    </Slider>
                </Box>
            )}
        </div>
    );
};

export default GallerySlider;

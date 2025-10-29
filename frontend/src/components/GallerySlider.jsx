import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import AOS from "aos";
import "aos/dist/aos.css"; // Don't forget to import AOS CSS
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

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
        <div className="bg-gray-100 min-h-screen">
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
                <Box sx={{ width: "100vw", height: "100vh", position: "relative", backgroundColor: "#000" }}>
                    {/* Gallery - full viewport */}
                    <Slider {...settings} style={{ width: "100vw", height: "100vh" }}>
                        {images.map((image, index) => (
                            <Box key={index} sx={{ width: "100vw", height: "100vh" }}>
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                    style={{
                                        width: "100vw",
                                        height: "100vh",
                                        objectFit: "cover",
                                        display: "block",
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

NextArrow.propTypes = {
    onClick: PropTypes.func,
};

PrevArrow.propTypes = {
    onClick: PropTypes.func,
};

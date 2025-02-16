import React, { useEffect, useState } from "react";
import logo from "/images/ghssLogo.png"; // Ensure the path to your logo is correct
import Slider from "react-slick";
import { Box, Typography } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import AOS from "aos";
import "aos/dist/aos.css"; // Don't forget to import AOS CSS
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
          className="flex items-center flex-col justify-center w-full h-screen bg-gray-100"
          data-aos="fade-in"
          data-aos-duration="2000"
        >
          <div>
            <img
              src={logo}
              alt="School Logo"
              className="h-60 w-60 object-contain mx-auto mb-32" // Larger logo size
            />
          </div>
          <Typography variant="h1" align="center" sx={{ fontSize: "3rem", color: "#3f51b5", fontWeight: "bold" }}>
            Welcome to GHSS Luqman Banda
          </Typography>
        </div>
      )}

      {/* Main Content */}
      {showSlider && (
        <Box
          sx={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f4f4f4",
          }}
        >
          {/* Gallery */}
          <Slider {...settings} style={{ width: "100vw", position: 'absolute', top: '30px', maxWidth: "100vw" }}>
            {images.map((image, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100vh", // Ensures the slider takes up full viewport height
                }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  style={{
                    width: "100%",
                    height: "100vh", // Ensure it fills the screen height
                    objectFit: "cover", // Ensures the image fully covers the screen
                    border: "none", // No border around the image
                    borderRadius: "0", // No rounded corners
                    boxSizing: "border-box", // Ensures proper layout without border overflow
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

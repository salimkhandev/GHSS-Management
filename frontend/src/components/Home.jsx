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
      position: 'absolute',
      top: '50%',
      right: { xs: '-20px', sm: '-30px', md: '-40px' },
      transform: 'translateY(-50%)',
      color: '#fff',
      fontSize: { xs: '2.5rem', sm: '3rem' },
      cursor: 'pointer',
      zIndex: 2,
      backgroundColor: 'rgba(25, 118, 210, 0.7)',
      borderRadius: '50%',
      padding: { xs: '12px', sm: '15px' },
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: { xs: '45px', sm: '55px' },
      height: { xs: '45px', sm: '55px' },
      '&:hover': {
        backgroundColor: 'rgba(25, 118, 210, 0.9)',
        transform: 'translateY(-50%) scale(1.1)',
        boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)',
      },
    }}
  />
);

const PrevArrow = ({ onClick }) => (
  <ArrowBackIos
    onClick={onClick}
    sx={{
      position: 'absolute',
      top: '50%',
      left: { xs: '-20px', sm: '-30px', md: '-40px' },
      transform: 'translateY(-50%)',
      color: '#fff',
      fontSize: { xs: '2.5rem', sm: '3rem' },
      cursor: 'pointer',
      zIndex: 2,
      backgroundColor: 'rgba(25, 118, 210, 0.7)',
      borderRadius: '50%',
      padding: { xs: '12px', sm: '15px' },
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: { xs: '45px', sm: '55px' },
      height: { xs: '45px', sm: '55px' },
      '&:hover': {
        backgroundColor: 'rgba(25, 118, 210, 0.9)',
        transform: 'translateY(-50%) scale(1.1)',
        boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)',
      },
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
    <div className="min-h-screen flex flex-col items-center justify-center" 
      style={{ 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e3eeff 100%)' 
      }}
    >
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
            width: '100%',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e3eeff 100%)',
            padding: { xs: '40px 20px', sm: '60px 40px' },
          }}
        >
          {/* Gallery with Frame Design */}
          <Box
            sx={{
              width: '85%',
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '20px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '12px',
                left: '12px',
                right: '12px',
                bottom: '12px',
                border: '2px solid #1976d2',
                borderRadius: '12px',
                pointerEvents: 'none',
                opacity: 0.3
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: '6px',
                left: '6px',
                right: '6px',
                bottom: '6px',
                border: '1px solid #1976d2',
                borderRadius: '14px',
                pointerEvents: 'none',
                opacity: 0.2
              }
            }}
          >
            <Slider {...settings}>
              {images.map((image, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '75vh',
                    padding: '25px', // Increased padding for frame effect
                    backgroundColor: '#ffffff',
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: '65vh',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: '-8px',
                        left: '-8px',
                        right: '-8px',
                        bottom: '-8px',
                        border: '1px solid #1976d2',
                        borderRadius: '14px',
                        opacity: 0.2
                      }
                    }}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Slider>
          </Box>
        </Box>
      )}
    </div>
  );
};

export default GallerySlider;

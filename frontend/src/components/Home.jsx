import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { Box, Typography, Container } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import logo from "/images/ghssLogo.png";

const images = [
  { src: "/images/image.png", alt: "School Building" },
  { src: "/images/image.png", alt: "School Building" },
  { src: "/images/image.png", alt: "School Building" },
];

const NextArrow = ({ onClick }) => (
  <ArrowForwardIos
    onClick={onClick}
    sx={{
      position: 'absolute',
      top: '50%',
      right: { xs: '10px', md: '20px' },
      transform: 'translateY(-50%)',
      color: '#fff',
      fontSize: { xs: '1.5rem', md: '2rem' },
      cursor: 'pointer',
      zIndex: 2,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: '50%',
      padding: { xs: '8px', md: '12px' },
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        transform: 'translateY(-50%) scale(1.1)',
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
      left: { xs: '10px', md: '20px' },
      transform: 'translateY(-50%)',
      color: '#fff',
      fontSize: { xs: '1.5rem', md: '2rem' },
      cursor: 'pointer',
      zIndex: 2,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: '50%',
      padding: { xs: '8px', md: '12px' },
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        transform: 'translateY(-50%) scale(1.1)',
      },
    }}
  />
);

const GallerySlider = () => {
  const [showSlider, setShowSlider] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSlider(true);
    }, 3000);

    return () => clearTimeout(timer);
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
    fade: true,
    cssEase: 'linear',
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5',
        py: { xs: 2, md: 4 },
      }}
    >
      <AnimatePresence mode="wait">
        {!showSlider && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            style={{ width: '100%', textAlign: 'center' }}
          >
            <Container maxWidth="md">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <Box
                  component="img"
                  src={logo}
                  alt="School Logo"
                  sx={{
                    height: { xs: 120, sm: 180, md: 240 },
                    width: { xs: 120, sm: 180, md: 240 },
                    objectFit: 'contain',
                    mx: 'auto',
                    mb: { xs: 3, md: 6 },
                  }}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
                    fontWeight: 700,
                    color: '#333',
                    px: 2,
                  }}
                >
                  Welcome to GHSS Luqman Banda
                </Typography>
              </motion.div>
            </Container>
          </motion.div>
        )}

        {showSlider && (
          <motion.div
            key="slider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            style={{ width: '100%', height: '100%' }}
          >
            <Container
              maxWidth="xl"
              sx={{
                px: { xs: 2, sm: 3, md: 4 },
                height: '100%',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  maxWidth: '1200px',
                  mx: 'auto',
                  height: '100%',
                }}
              >
                <Slider {...settings}>
                  {images.map((image, index) => (
                    <Box key={index}>
                      <Box
                        sx={{
                          height: { xs: '50vh', sm: '60vh', md: '70vh' },
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Box
                          component="img"
                          src={image.src}
                          alt={image.alt}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Slider>
              </Box>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default GallerySlider;

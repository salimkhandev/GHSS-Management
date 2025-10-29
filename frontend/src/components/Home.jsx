import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { Box, Container, Typography, useMediaQuery } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import logo from "/images/ghssLogo.png";

const images = [
  { src: "/images/image.jpg", alt: "School Building" },
  { src: "/images/image.jpg", alt: "School Building" },
  { src: "/images/image.jpg", alt: "School Building" },
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
  const isMobile = useMediaQuery('(max-width:600px)');
  const appBarHeight = isMobile ? 56 : 64; // typical MUI AppBar heights
  const viewportMinusAppBar = `calc(100vh - ${appBarHeight}px)`;

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
    <Box sx={{ height: viewportMinusAppBar, overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        {!showSlider && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            style={{ width: '100%', textAlign: 'center', height: viewportMinusAppBar, display: 'flex', alignItems: 'center' }}
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
            style={{ width: '100vw', height: viewportMinusAppBar }}
          >
            <Box sx={{ width: '100vw', height: viewportMinusAppBar }}>
              <Slider {...settings}>
                {images.map((image, index) => (
                  <Box key={index} sx={{ width: '100vw', height: viewportMinusAppBar }}>
                    <Box
                      component="img"
                      src={image.src}
                      alt={image.alt}
                      sx={{
                        width: '100vw',
                        height: viewportMinusAppBar,
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </Box>
                ))}
              </Slider>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default GallerySlider;

NextArrow.propTypes = {
  onClick: PropTypes.func,
};

PrevArrow.propTypes = {
  onClick: PropTypes.func,
};

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
  { text: "Welcome to GHSS Luqman Banda - Excellence in Education" },
  { text: "Empowering Students for a Bright Future" },
  { text: "Quality Education with Modern Facilities" },
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
      backgroundColor: 'rgba(26, 35, 126, 0.6)',
      borderRadius: '50%',
      padding: { xs: '8px', md: '12px' },
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      '&:hover': {
        backgroundColor: 'rgba(26, 35, 126, 0.8)',
        transform: 'translateY(-50%) scale(1.1)',
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)',
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
      backgroundColor: 'rgba(26, 35, 126, 0.6)',
      borderRadius: '50%',
      padding: { xs: '8px', md: '12px' },
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      '&:hover': {
        backgroundColor: 'rgba(26, 35, 126, 0.8)',
        transform: 'translateY(-50%) scale(1.1)',
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)',
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
    autoplaySpeed: 2500,
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
                    filter: 'drop-shadow(0 8px 16px rgba(26, 35, 126, 0.2))',
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
                    fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' },
                    fontWeight: 700,
                    fontFamily: '"Poppins", sans-serif',
                    color: 'var(--color-primary)',
                    px: 2,
                    textShadow: '0 2px 8px rgba(26, 35, 126, 0.15)',
                    letterSpacing: '-0.5px',
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
                  <Box key={index} sx={{ width: '100vw', height: viewportMinusAppBar, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gradient-primary)' }}>
                    <Typography
                      variant="h2"
                      sx={{
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                        fontWeight: 700,
                        fontFamily: '"Poppins", sans-serif',
                        color: 'white',
                        textAlign: 'center',
                        px: { xs: 2, sm: 4, md: 6 },
                        textShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                      }}
                    >
                      {image.text}
                    </Typography>
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

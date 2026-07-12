import * as React from "react";
import { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
// import { SnackbarProvider, useSnackbar } from "notistack";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import {
  AdminPanelSettings as AdminIcon,
  Key as KeyIcon,
  ExitToApp as LogoutIcon,
  School as SchoolIcon,
  SupervisorAccount as TeacherAdminIcon,
  Warning as WarningIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  Dialog,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "./admin/AuthProvider";
import ProfilePicManager from "./teacher/ProfilePic.jsx";

import apiBase from "../config/api";

const THEME_COLORS = {
  primary: "var(--color-primary)",
  secondary: "var(--color-primary-light)",
  accent: "var(--color-accent)",
  hover: "var(--color-accent-dark)",
  text: "var(--color-text-on-dark)",
  danger: "var(--color-danger)",
};

// Add these modal styles
const modalStyles = {
  dialog: {
    "& .MuiDialog-paper": {
      borderRadius: 3,
      border: "none",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
      background: "linear-gradient(135deg, var(--color-surface), var(--color-surface-raised))",
      padding: { xs: 2, sm: 3 },
      width: { xs: "95%", sm: "80%", md: "70%" },
      maxWidth: "800px",
      minWidth: { sm: "400px" },
      overflow: "hidden",
      animation: "modalFadeIn 0.3s ease-out",
    },
    "& .MuiBackdrop-root": {
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      backdropFilter: "blur(5px)",
    },
  },
  credentialsBox: {
    backgroundColor: "rgba(255, 248, 220, 0.9)",
    borderRadius: 2,
    padding: { xs: 1.5, sm: 2 },
    margin: { xs: 1, sm: 2 },
    border: "1px solid var(--color-warning)",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    animation: "slideDown 0.3s ease-out",
  },
  title: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: { xs: 1, sm: 2 },
    borderBottom: "2px solid var(--color-border)",
    marginBottom: 2,
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: { xs: "column", sm: "row" },
    gap: { xs: 1.5, sm: 2 },
    padding: { xs: 2, sm: 3 },
    justifyContent: "center",
    width: "100%",
  },
  button: (color) => ({
    minWidth: { xs: "100%", sm: "180px" },
    padding: "12px 24px",
    borderRadius: 2,
    fontWeight: 600,
    textTransform: "none",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    backgroundColor: color,
    color: "white",
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    "& .MuiSvgIcon-root": {
      fontSize: "24px",
      transition: "transform 0.3s ease",
    },
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      backgroundColor: `${color}dd`, // Adding transparency to hover color
      "& .MuiSvgIcon-root": {
        transform: "scale(1.1) rotate(10deg)",
      },
    },
  }),
  alertDialog: {
    overlay: {
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      backdropFilter: "blur(4px)",
      zIndex: 9999,
      animation: "fadeIn 0.2s ease-out",
    },
    content: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "white",
      borderRadius: "16px",
      padding: "24px",
      width: "90%",
      maxWidth: "420px",
      boxShadow: "0 24px 48px rgba(0, 0, 0, 0.3)",
      zIndex: 10000,
      animation: "slideUp 0.3s ease-out",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: 700,
      color: "var(--color-primary)",
      marginBottom: "12px",
      fontFamily: "'Poppins', sans-serif",
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    description: {
      fontSize: "1rem",
      color: "var(--color-text-secondary)",
      marginBottom: "24px",
      lineHeight: 1.6,
      fontFamily: "'Poppins', sans-serif",
    },
    footer: {
      display: "flex",
      gap: "12px",
      justifyContent: "flex-end",
    },
    cancelButton: {
      padding: "10px 24px",
      borderRadius: "8px",
      border: "2px solid var(--color-border)",
      backgroundColor: "white",
      color: "var(--color-text-secondary)",
      fontWeight: 600,
      fontSize: "0.95rem",
      cursor: "pointer",
      transition: "all 0.2s ease",
      fontFamily: "'Poppins', sans-serif",
    },
    confirmButton: {
      padding: "10px 24px",
      borderRadius: "8px",
      border: "none",
      background: "var(--gradient-danger)",
      color: "white",
      fontWeight: 600,
      fontSize: "0.95rem",
      cursor: "pointer",
      transition: "all 0.2s ease",
      fontFamily: "'Poppins', sans-serif",
      boxShadow: "0 4px 12px rgba(211, 47, 47, 0.3)",
    },
  },
};

// Add this new styled menu icon component
const AnimatedMenuIcon = ({ isOpen, onClick }) => (
  <motion.div
    initial={false}
    animate={isOpen ? "open" : "closed"}
    onClick={onClick}
    className="cursor-pointer"
    style={{
      width: 40,
      height: 40,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(5px)",
    }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
  >
    <motion.div
      style={{
        width: 20,
        height: 20,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          style={{
            width: "100%",
            height: 2,
            borderRadius: 10,
            backgroundColor: "white",
            transformOrigin: "left",
          }}
          variants={{
            open: {
              y: index === 1 ? 0 : 0,
              rotate: index === 1 ? 0 : index === 0 ? 45 : -45,
              x: index === 1 ? 20 : 0,
              opacity: index === 1 ? 0 : 1,
            },
            closed: {
              y: 0,
              rotate: 0,
              x: 0,
              opacity: 1,
            },
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      ))}
    </motion.div>
  </motion.div>
);

const MenuIconButton = ({ onClick }) => {
  const [hasAnimated, setHasAnimated] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setHasAnimated(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      animate={
        !hasAnimated
          ? {
              scale: [1, 1.09, 1.15, 1.2, 1],
            }
          : {}
      }
      transition={{
        duration: 2.5,
        ease: "easeInOut",
      }}
    >
      <IconButton
        onClick={onClick}
        sx={{
          width: 40,
          height: 40,
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08))",
          backdropFilter: "blur(8px)",
          borderRadius: "12px",
          border: "1.5px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          position: "relative",
          overflow: "visible",
          transition: "all 0.3s ease",
          "&:hover": {
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15))",
            transform: "scale(1.08)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            border: "1.5px solid rgba(255, 255, 255, 0.3)",
          },
          "& .MuiSvgIcon-root": {
            fontSize: 20,
            color: "rgba(255, 255, 255, 0.9)",
            filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))",
            transition: "all 0.3s ease",
          },
          "&:hover .MuiSvgIcon-root": {
            color: "rgba(255, 255, 255, 1)",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
            transform: "rotate(10deg)",
          },
        }}
      >
        <MenuIcon />
      </IconButton>
    </motion.div>
  );
};

export default function TopDrawerWithToggle() {
  const navigate = useNavigate();

  // const [RoleOpen, setRoleOpen] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // const toggleRoleDrawer = (state) => (event) => {
  //     if (event?.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) return;
  //     setRoleOpen(state);
  // };

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    setShowRoleModal(false); // Close modal after selection
  };

  const [open, setOpen] = useState(false);
  const [expandedSections, setExpandedSections] = React.useState({
    0: true,
    1: true,
    2: true,
  });
  const {
    isAuthenticatedAdmin,
    isAuthenticatedTeacher,
    logEvent,
    setLogEventHandler,
  } = useAuth();
  // const [keepProfilePicUpdated, setKeepProfilePicUpdated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [username, setUsername] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (selectedRole === "admin") {
      navigate("/admin");
      // close the modal
      setShowRoleModal(false);
      // close the drawer
      setOpen(false);
      // reset the selected role
      setSelectedRole(null);
      // close the role modal
    } else if (selectedRole === "teacher") {
      navigate("/teacherLogin");
      // close the modal
      setShowRoleModal(false);
      // close the drawer
      setOpen(false);
      // reset the selected role
      setSelectedRole(null);
    } else if (selectedRole === "teacherAdmin") {
      navigate("/teacherAdminLogin");
      // close the modal
      setShowRoleModal(false);
      // close the drawer
      setOpen(false);
      // reset the selected role
      setSelectedRole(null);
    }
  }, [selectedRole, navigate]);

  useEffect(() => {
    const fetchProfilePic = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${apiBase}/profile-pic`, {
          withCredentials: true,
        });

        if (response.data.imageUrl) {
          setImageUrl(`${response.data.imageUrl}?t=${Date.now()}`);
        }
        setUsername(response.data.teacherName);
      } catch (error) {
        // Silently handle 401 errors when user is not authenticated
        if (error.response?.status !== 401) {
          console.error("Failed to fetch profile picture:", error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfilePic();
  }, [logEvent]);

  // Update the toggleDrawer function
  const toggleDrawer = (state) => (event) => {
    if (
      event?.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpen(state);
    setIsMenuOpen(state);
  };

  const toggleSection = (index) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  // use fetch to logout

  const handleLogout = async () => {
    try {
      await fetch(`${apiBase}/logout`, {
        method: "POST",
        credentials: "include", // Ensures cookies are sent
      });
      setLogEventHandler();
      setImageUrl(null);
      setUsername("");
      navigate("/"); // Redirect to home
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Menu Sections with Links
  const menuItems = [
    {
      title: "Teachers Portal",
      links: [
        { label: "Take Attendance", path: "/TakeAtten" },
        // { label: "Login for your class", path: "/TeacherLogin" },
        { label: "Update Attendance Status", path: "/updateAttenStatus" },
      ],
    },
    {
      title: "Admin Portal",
      links: [
        { label: "Assign Class", path: "/TeacherRegistration" },
        { label: "Register New Admin", path: "/AdminRegistration" },
        { label: "Promote Students to Next Class", path: "/promote" },
        { label: "Register New Students", path: "/admission" },
      ],
    },
  ];

  const list = () => (
    <Box
      sx={{
        width: 280,
        height: "100%",
        backgroundColor: "var(--color-primary)",
        color: THEME_COLORS.text,
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        borderRight: "none",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          borderRadius: "4px",
        },
      }}
      role="presentation"
    >
      {(isAuthenticatedAdmin || isAuthenticatedTeacher) && (
        <>
          <Button
            startIcon={<LogoutIcon />}
            sx={{
              color: THEME_COLORS.text,
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.06) 100%)",
              border: "1px solid rgba(255,255,255,0.2)",
              textAlign: "left",
              fontSize: "0.9rem",
              fontFamily: "'Poppins', sans-serif",
              textTransform: "none",
              margin: "16px",
              padding: "10px 14px",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              transition: "all 0.3s ease",
              "& .MuiButton-startIcon .MuiSvgIcon-root": {
                color: "var(--color-danger)",
              },
              "&:hover": {
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.10) 100%)",
                border: "1px solid rgba(255,255,255,0.3)",
                transform: "translateY(-1px)",
                boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
              },
              "&:active": {
                transform: "translateY(0)",
                boxShadow: "0 3px 10px rgba(0, 0, 0, 0.15)",
              },
            }}
            onClick={() => setShowLogoutDialog(true)}
          >
            Logout
          </Button>

          <AlertDialog.Root
            open={showLogoutDialog}
            onOpenChange={setShowLogoutDialog}
          >
            <AlertDialog.Portal>
              <AlertDialog.Overlay style={modalStyles.alertDialog.overlay} />
              <AlertDialog.Content style={modalStyles.alertDialog.content}>
                <AlertDialog.Title style={modalStyles.alertDialog.title}>
                  <>
                    <WarningIcon sx={{ fontSize: 32, color: "var(--color-danger)" }} />
                    Confirm Logout
                  </>
                </AlertDialog.Title>
                <AlertDialog.Description
                  style={modalStyles.alertDialog.description}
                >
                  Are you sure you want to logout? You will need to login again
                  to access your account.
                </AlertDialog.Description>
                <div style={modalStyles.alertDialog.footer}>
                  <AlertDialog.Cancel asChild>
                    <button
                      style={modalStyles.alertDialog.cancelButton}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "var(--color-surface-raised)";
                        e.target.style.borderColor = "var(--color-border)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "white";
                        e.target.style.borderColor = "var(--color-border)";
                      }}
                    >
                      Cancel
                    </button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action asChild>
                    <button
                      style={modalStyles.alertDialog.confirmButton}
                      onClick={handleLogout}
                      onMouseEnter={(e) => {
                        e.target.style.background = "var(--gradient-danger)";
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow =
                          "0 6px 16px rgba(211, 47, 47, 0.4)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "var(--gradient-danger)";
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow =
                          "0 4px 12px rgba(211, 47, 47, 0.3)";
                      }}
                    >
                      Yes, Logout
                    </button>
                  </AlertDialog.Action>
                </div>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog.Root>
        </>
      )}

      {isAuthenticatedAdmin || isAuthenticatedTeacher ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 2.5,
            px: 2,
            gap: 1,
          }}
        >
          <Box
            onClick={() => setShowModal(true)}
            sx={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2.5px solid rgba(255,255,255,0.4)',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'border-color 0.2s, box-shadow 0.2s',
              boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.85)',
                boxShadow: '0 4px 18px rgba(0,0,0,0.45)',
              },
            }}
          >
            {loading ? (
              <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(255,255,255,0.1)' }}>
                <CircularProgress size={30} sx={{ color: 'var(--color-text-on-dark)' }} />
              </Box>
            ) : imageUrl ? (
              <img
                src={imageUrl}
                alt="Profile"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  background: 'var(--gradient-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography sx={{ color: 'var(--color-text-on-dark)', fontWeight: 700, fontSize: '1.4rem', fontFamily: "'Poppins',sans-serif" }}>
                  {username ? username.charAt(0).toUpperCase() : '?'}
                </Typography>
              </Box>
            )}
          </Box>

          {username && (
            <Typography
              sx={{
                color: 'var(--color-text-on-dark)',
                fontWeight: 600,
                fontSize: '0.9rem',
                fontFamily: "'Poppins', sans-serif",
                letterSpacing: '0.3px',
                textAlign: 'center',
                mt: 0.5
              }}
            >
              {username}
            </Typography>
          )}

          {/* Upload modal */}
          {showModal && (
            <ProfilePicManager
              showModal={showModal}
              setShowModal={setShowModal}
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              onImageUpdate={setImageUrl}
            />
          )}
        </Box>
      ) : (
        <div>
          {/* <Drawer anchor="left" open={RoleOpen} onClose={toggleRoleDrawer(false)}> */}
          <Box sx={{ width: 280, color: "white", height: "100%" }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                onClick={() => setShowRoleModal(true)}
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  margin: "10px",
                  padding: "8px 24px",
                  borderRadius: "12px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textTransform: "capitalize",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(5px)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.2)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Login
              </Button>
            </motion.div>
          </Box>
          {/* </Drawer> */}

          <Dialog
            open={showRoleModal}
            onClose={() => setShowRoleModal(false)}
            sx={{
              ...modalStyles.dialog,
              "& .MuiDialog-paper": {
                animation: "modalFadeIn 0.3s ease-out",
                backgroundColor: "var(--color-surface-raised)",
              },
            }}
          >
            <Box sx={modalStyles.title}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  fontFamily: "'Poppins', sans-serif",
                  color: "var(--color-text-primary)",
                }}
              >
                Select Role
              </Typography>
              <IconButton
                onClick={() => setShowRoleModal(false)}
                sx={{
                  color: "var(--color-text-secondary)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "rotate(90deg)",
                    backgroundColor: "rgba(0,0,0,0.05)",
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <Box sx={modalStyles.buttonsContainer}>
              <Button
                onClick={() => handleRoleSelection("admin")}
                startIcon={<AdminIcon />}
                sx={modalStyles.button("var(--color-danger)")}
              >
                Admin
              </Button>
              <Button
                onClick={() => handleRoleSelection("teacher")}
                startIcon={<SchoolIcon />}
                sx={modalStyles.button("var(--color-success)")}
              >
                Teacher
              </Button>
              <Button
                onClick={() => handleRoleSelection("teacherAdmin")}
                startIcon={<TeacherAdminIcon />}
                // use nowrap
                sx={{
                  ...modalStyles.button("var(--color-accent)"),
                  whiteSpace: "nowrap",
                }}
              >
                Teacher & Admin
              </Button>
            </Box>
          </Dialog>
        </div>
      )}

      <Divider sx={{ backgroundColor: "white" }} />

      {/* Close Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
        <IconButton
          onClick={toggleDrawer(false)}
          sx={{
            color: "white",
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08))",
            backdropFilter: "blur(10px)",
            border: "1.5px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "12px",
            width: 44,
            height: 44,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            transition: "all 0.3s ease",
            "&:hover": {
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.15))",
              border: "1.5px solid rgba(255, 255, 255, 0.35)",
              transform: "rotate(90deg) scale(1.05)",
              boxShadow: "0 6px 16px rgba(0, 0, 0, 0.3)",
            },
            "&:active": {
              transform: "rotate(90deg) scale(0.95)",
            },
          }}
        >
          <CloseIcon
            sx={{
              fontSize: 24,
              color: "white",
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
            }}
          />
        </IconButton>
      </Box>

      {/* Menu Sections */}

      {menuItems.map((section, index) => (
        <React.Fragment key={index}>
          <List>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => toggleSection(index)}
                sx={{
                  backgroundColor: expandedSections[index]
                    ? THEME_COLORS.accent
                    : THEME_COLORS.secondary,
                  margin: "4px 8px",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: THEME_COLORS.hover,
                    transform: "translateX(4px)",
                  },
                }}
              >
                {section.title === "Teachers Portal" ? (
                  <SchoolIcon sx={{ mr: 2, fontSize: 24 }} />
                ) : (
                  <AdminIcon sx={{ mr: 2, fontSize: 24 }} />
                )}

                <ListItemText
                  primary={section.title}
                  primaryTypographyProps={{
                    sx: {
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                      fontSize: "1rem",
                    },
                  }}
                />
                {expandedSections[index] ? (
                  <ExpandLessIcon />
                ) : (
                  <ExpandMoreIcon />
                )}
              </ListItemButton>
            </ListItem>

            <Collapse in={expandedSections[index]} timeout="auto" unmountOnExit>
              {section.links.map((item, idx) => (
                <ListItem key={idx} disablePadding>
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    onClick={toggleDrawer(false)}
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      padding: "8px 16px",
                      marginLeft: "24px",
                      marginRight: "8px",
                      marginY: "2px",
                      borderRadius: "8px",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "'Poppins', sans-serif",
                            fontWeight: 400,
                            color: THEME_COLORS.text,
                            fontSize: "0.875rem",
                          }}
                        >
                          {item.label}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </Collapse>
          </List>
          {index !== menuItems.length - 1 && (
            <Divider
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                margin: "8px 16px",
              }}
            />
          )}
        </React.Fragment>
      ))}
    </Box>
  );

  return (
    <div>
      <MenuIconButton onClick={toggleDrawer(true)} />
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
    </div>
  );
}

// Add CSS animations
const style = document.createElement("style");
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translate(-50%, -45%);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%);
        }
    }
`;
document.head.appendChild(style);

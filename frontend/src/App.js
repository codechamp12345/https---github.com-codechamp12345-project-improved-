import React, { useState, useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import { Box, CssBaseline } from "@mui/material";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Login from "./components/Login";
import Footer from "./components/Footer";
import EarnCredits from "./components/EarnCredits";
import Contact from "./components/Contact";
import EmailVerification from "./components/EmailVerification";
import AboutUs from "./components/AboutUs";
import AdminLogin from "./components/admin/AdminLogin";
import AdminNavbar from "./components/admin/AdminNavbar";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminTasks from "./components/admin/AdminTasks";
import BuyPointsPage from "./pages/BuyPointsPage";
import { useSelector } from 'react-redux';
import ProtectedRoute from './components/admin/ProtectedRoute';
import Dashboard from './components/Dashboard';

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      main: "#1e4d5c",
      dark: "#153741",
      light: "#2a8a7d",
    },
    secondary: {
      main: "#f7a072",
      dark: "#e88a5c",
      light: "#ffb69e",
    },
    background: {
      default: mode === "dark" ? "#121212" : "#ffffff",
      paper: mode === "dark" ? "#1e1e1e" : "#ffffff",
    },
    text: {
      primary: mode === "dark" ? "#ffffff" : "#000000",
      secondary: mode === "dark" ? "#b0b0b0" : "#666666",
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
    h2: {
      fontWeight: 700,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          transition: "background-color 0.3s ease",
          backgroundColor: mode === "dark" ? "#121212" : "#ffffff",
          color: mode === "dark" ? "#ffffff" : "#000000",
        },
      },
    },
  },
});

const Cursor = styled("div")(({ theme }) => ({
  display: theme.palette.mode === "dark" ? "block" : "none",
  position: "fixed",
  width: "200px",
  height: "200px",
  background:
    "radial-gradient(circle, rgba(255,215,0,0.1) 0%, rgba(255,215,0,0) 70%)",
  borderRadius: "50%",
  pointerEvents: "none",
  transform: "translate(-50%, -50%)",
  transition: "opacity 0.3s ease",
  zIndex: 9999,
}));

const DarkModeOverlay = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  pointerEvents: "none",
  zIndex: 9998,
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      theme.palette.mode === "dark"
        ? "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 60%)"
        : "none",
    transition: "opacity 0.3s ease",
  },
}));

function AppContent() {
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.auth);
  const isAdminRoute = location.pathname.startsWith('/admin');
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || 'light';
  });
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  useEffect(() => {
    if (!isAdminRoute) {
      const handleMouseMove = (e) => {
        setCursorPos({ x: e.clientX, y: e.clientY });
        document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
        document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [isAdminRoute]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: "100vh", 
        display: "flex", 
        flexDirection: "column",
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
        transition: "background-color 0.3s ease, color 0.3s ease"
      }}>
        <ToastContainer position="top-right" autoClose={3000} />
        {isAdminRoute ? <AdminNavbar /> : <Navbar toggleTheme={toggleTheme} />}
        <Box sx={{ 
          flex: 1, 
          display: "flex", 
          flexDirection: "column",
          bgcolor: theme.palette.background.default,
          color: theme.palette.text.primary,
          transition: "background-color 0.3s ease, color 0.3s ease"
        }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/earn-credits" element={<EarnCredits />} />
            <Route path="/buy-points" element={<BuyPointsPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/dashboard" element={userInfo ? <Dashboard /> : <Navigate to="/login" />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <Box sx={{ 
                    flex: 1, 
                    display: "flex", 
                    flexDirection: "column",
                    bgcolor: theme.palette.background.default,
                    color: theme.palette.text.primary
                  }}>
                    <AdminDashboard />
                  </Box>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/tasks"
              element={
                <ProtectedRoute>
                  <Box sx={{ 
                    flex: 1, 
                    display: "flex", 
                    flexDirection: "column",
                    bgcolor: theme.palette.background.default,
                    color: theme.palette.text.primary
                  }}>
                    <AdminTasks />
                  </Box>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Box>
        {!isAdminRoute && (
          <>
            <Cursor
              style={{
                left: `${cursorPos.x}px`,
                top: `${cursorPos.y}px`,
                opacity: mode === "dark" ? 1 : 0,
              }}
            />
            <DarkModeOverlay />
          </>
        )}
        {!isAdminRoute && <Footer />}
      </Box>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

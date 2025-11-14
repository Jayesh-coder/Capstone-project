import { AppBar, Toolbar, Typography, Container, Box, Button, Divider } from '@mui/material'
import { Link, Routes, Route, Outlet } from 'react-router-dom'
// import './App.css'
import Home from './Home.jsx';
import About from './About.jsx';
import NotFound from './NotFound.jsx';
import styles from './App.module.css';
import { AuthContext } from './AuthProvider.jsx';
import { useContext,useState } from 'react';

function toggleDarkMode(darkMode,setDarkMode) {
  setDarkMode(!darkMode);
}

function Layout() {
  const { isLogged, login, logout } = useContext(AuthContext);
  const [darkMode, setDarkMode] = useState(false);
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: darkMode ? "#1a1a1a" : "#f8f9fa",
        color: darkMode ? "#fff" : "#000",
        transition: "background-color 0.3s ease",
      }}
    >

      <AppBar position="sticky" sx={{ background: darkMode ? "#351c3fff" : "#610464ff", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
        <Toolbar sx={{ justifyContent: 'space-between', py: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '0.5px', fontSize: '1.2rem' }}>
              IncidentTracker
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ my: 1, backgroundColor: "rgba(255,255,255,0.2)" }} />
            {isLogged && (
              <Box sx={{ display: 'flex', gap: 2.5 }}>
                <Link className={styles.navLink} to="/">Home</Link>
                <Link className={styles.navLink} to="/about">About</Link>
                {/* <Link className={styles.navLink} to="/does-not-exist">404 Test</Link> */}
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button 
              size="small" 
              sx={{ color: 'white', textTransform: 'none', fontWeight: 500 }}
              onClick={() => toggleDarkMode(darkMode, setDarkMode)}
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </Button>
            <Divider orientation="vertical" flexItem sx={{ my: 1, backgroundColor: "rgba(255,255,255,0.2)" }} />
            <Button
              size="small"
              sx={{ color: 'white', textTransform: 'none', fontWeight: 600 }}
              onClick={isLogged ? logout : login}
            >
              {isLogged ? 'Logout' : 'Login'}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, pt: 2 }}>
        <Outlet />
      </Container>
    </Box>
  )
}

function App() {
  
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </>
  )
}

export default App

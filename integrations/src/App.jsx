import { AppBar, Toolbar, Typography, Container, Box, Button } from '@mui/material'
import { Link, Routes, Route, Outlet } from 'react-router-dom'
// import './App.css'
import Home from './Home.jsx';
import About from './About.jsx';
import NotFound from './NotFound.jsx';
import styles from './App.module.css';
import { AuthContext } from './AuthProvider.jsx';
import { useContext,useState } from 'react';

function toggleDarkMode(darkMode,setDarkMode) {
  if(darkMode)
    setDarkMode(false);
  else
    setDarkMode(true);
}

function Layout() {
  const { isLogged, login, logout } = useContext(AuthContext);
  const [darkMode, setDarkMode] = useState(false);
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: darkMode ? "#484646ff" : "#fafafa",
        color: darkMode ? "#fff" : "#000",
      }}
    >

      <AppBar>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <div>
            <Typography>Company name</Typography>
            <Link className={styles.link} onClick={()=>toggleDarkMode(darkMode,setDarkMode)}>{(darkMode)?'Light⛅':'Dark🌙'}</Link>
          </div>
          {isLogged?(<>
            <Link className={styles.link} to="/">Home</Link>
            <Link className={styles.link} to="/about">About</Link>
            <Link className={styles.link} to="/does-not-exist">404 Test</Link>
            <Link className={styles.link} onClick={logout}>Logout</Link>
          </>):(
            '')}

          <Link className={styles.link} onClick={login}>{isLogged?'Login':'Login to ServiceNow'}</Link>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 8, pt: 3 }}>
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

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { NavContextProvider } from './contexts/NavContext';

// hooks
import { useAuthContext } from './hooks/useAuthContext';

// components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import OnlineUsers from './components/OnlineUsers';

// pages
import Dashboard from './pages/dashboard/Dashboard';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import Create from './pages/create/Create';
import Project from './pages/project/Project';

// styles
import styles from './App.module.css';

function App() {
  const { user, authIsReady } = useAuthContext();

  return (
    <div className={styles.app}>
      {/* once authIsReady = true, then the wrapped elements will render */}
      {authIsReady && (
        // BrowserRouter needs to wrap all code that utilises react-router
        <BrowserRouter>
          {user && <Sidebar />}
          <div className={styles.centerContentContainer}>
            {/* all components that need access to the NavContext state object must be wrapped with NavContextProvider */}
            <NavContextProvider>
              <Navbar />
              {/* Routes ensures only one route at a time is active, also Route must always be a child of Routes, Route can't be rendered on its own */}
              <Routes>
                {/* Route defines the url path that needs to be navigated to by the user, in order to load the defined component (or jsx code) */}
                {/* if user isn't logged in (i.e. if user object is null), then redirect them to /login */}
                <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
                <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
                <Route path="/create" element={!user ? <Navigate to="/login" /> : <Create />} />
                {/* :id is a route parameter, a dynamic value that is defined from the link the user clicks to get here, i.e. <Link to={`/project/${project.id}`}></Link> */}
                <Route path="/project/:id" element={!user ? <Navigate to="/login" /> : <Project />} />
                {/* catch-all route, will show the 404 page if no other paths above match with the url the user is navigating to */}
                <Route path="*" element={<Navigate to="/oops" />} />
              </Routes>
            </NavContextProvider>
          </div>
          {user && <OnlineUsers />}
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;

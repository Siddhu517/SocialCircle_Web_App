import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Gallery from "./pages/Gallery";
import Friends from "./pages/Friends";
import FirstPage from "./pages/FirstPage";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserProvider } from "./context/Context";
import { Navigate } from "react-router-dom";

function App() {
  const isAuth = Boolean(localStorage.getItem("auth"));
  return (
    <>
      <BrowserRouter>
        <UserProvider>
          <ToastContainer />
          <Routes>
            <Route
              path="/"
              element={isAuth ? <Home /> : <Navigate to="/login" />}
            />
            {/*  <Route path="/" element={<Home />} /> */}
            <Route path="/login" element={<FirstPage />} />
            <Route path="/register" element={<FirstPage />} />
            <Route path="/reset-password" element={<FirstPage />} />

            <Route path="/" element={<Navigate replace to="/login" />} />
            <Route
              path="/profile"
              element={isAuth ? <Profile /> : <Navigate to="/" />}
            />
            <Route
              path="/settings"
              element={isAuth ? <Settings /> : <Navigate to="/" />}
            />
            <Route
              path="/gallery"
              element={isAuth ? <Gallery /> : <Navigate to="/" />}
            />
            <Route
              path="/friend/:username"
              element={isAuth ? <Friends /> : <Navigate to="/" />}
            />
          </Routes>
        </UserProvider>
      </BrowserRouter>
    </>
  );
}

export default App;

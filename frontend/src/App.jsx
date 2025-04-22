import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import GenerateProgramPage from "./pages/GenerateProgramPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuth0 } from "@auth0/auth0-react";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div>
      <div className="fixed inset-0 -z-1">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background"></div>
        <div className="absolute inset-0 bg-[linear-gradient(var(--cyber-grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--cyber-grid-color)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      </div>
      <BrowserRouter>
        <Navbar />
        <main className="pt-24 flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route
              path="/generate"
              element={
                <ProtectedRoute>
                  <GenerateProgramPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </BrowserRouter>
      {/* <Footer></Footer> */}
    </div>
  );
}

export default App;

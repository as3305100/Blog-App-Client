import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getUser, refreshAccessToken } from "./services/user.js";
import { login, logout } from "./store/slices/authSlice.js";
import { Outlet, useNavigate } from "react-router-dom";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    async function refreshAccess() {
      const response = await refreshAccessToken();

      if (!response.success) {
        navigate("/login");
      }
    }

    setInterval(() => {
      refreshAccess()
    }, 3.8 * 60 * 60 * 1000)
  }, []);

  useEffect(() => {
    async function renewToken() {
      const result = await refreshAccessToken();
      if (result.success) {
        const response = await getUser();
        if (response.success) {
          dispatch(login(response.data));
        } else {
          dispatch(logout());
        }
      } else {
        navigate("/login");
      }
      setLoading(false);
    }

    renewToken();
  }, []);

  return !loading ? (
    <div className="min-h-screen flex flex-wrap content-between bg-gray-100">
      <div className="w-full block">
        <Header />
        <Outlet />
        <Footer />
      </div>
    </div>
  ) : null;
}

export default App;

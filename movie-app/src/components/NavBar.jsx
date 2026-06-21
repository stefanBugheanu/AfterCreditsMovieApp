import { useNavigate } from "react-router-dom";
import NavbarLink from "./navbarComponents/NavbarLink";
import SearchBar from "./navbarComponents/SearchBar";
import { useState, useEffect } from "react";
import { clearRecentlyViewedForUser } from "../utils/recentlyViewedUtils";

export default function NavBar() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");

  const getUsername = () => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) return storedUsername;

    const token = localStorage.getItem("token");
    if (!token) return "";

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.username || payload.sub || "";
    } catch (error) {
      console.error("Error decoding token:", error);
      return "";
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (token) {
        setIsAuthenticated(true);
        setUsername(getUsername());
      } else {
        setIsAuthenticated(false);
        setUsername("");
      }
    };

    checkAuth();

    const handleStorageChange = (e) => {
      if (e.key === "token" || e.key === "username") {
        checkAuth();
      }
    };

    const handleAuthChange = () => checkAuth();

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    const userToLogout = getUsername();
    if (userToLogout) {
      clearRecentlyViewedForUser(userToLogout);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    setUsername("");
    window.dispatchEvent(new Event("authChange"));
    navigate("/");
  };

  const ProfileCircle = ({ username }) => {
    const initials = username.slice(0, 2).toUpperCase();
    return (
      <button
        onClick={() => navigate("/profile")}
        className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm focus:outline-none"
      >
        {initials}
      </button>
    );
  };

  return (
    <nav className="text-white  flex items-center justify-between gap-5 p-4 bg-transparent">
      <div className="flex items-center gap-5">
        <h1 className="text-4xl  bg-gradient-to-r from-orange-200 to-orange-500 bg-clip-text text-transparent">
          After Credits
        </h1>
        <NavbarLink to={"/"}>Home</NavbarLink>
        {isAuthenticated && (
          <>
            <NavbarLink to={"/watchlist"}>Watchlist</NavbarLink>
            <NavbarLink to={"/profile"}>Profile</NavbarLink>
          </>
        )}
      </div>
      <div className="flex gap-2 items-center">
        <SearchBar />
        {!isAuthenticated ? (
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
            >
              Login
            </button>
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <ProfileCircle username={username} />
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

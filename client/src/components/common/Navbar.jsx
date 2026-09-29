import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Avatar from "./Avatar";
import Badge from "./Badge";

export const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          Blog<span>ify</span>
        </Link>

        <nav>
          <ul className="navbar-nav">
            <li>
              <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} end>
                Explore
              </NavLink>
            </li>

            {user ? (
              <>
                <li>
                  <NavLink to="/create-post" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                    ✍️ Write
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/bookmarks" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                    Bookmarks
                  </NavLink>
                </li>
                {isAdmin && (
                  <li>
                    <NavLink to="/admin" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                      <Badge variant="admin">Admin Panel</Badge>
                    </NavLink>
                  </li>
                )}
                <li>
                  <NavLink
                    to="/profile"
                    className="nav-link"
                    style={{ display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <Avatar src={user.profileImageURL} alt={user.fullName} size="sm" />
                    <span>{user.fullName.split(" ")[0]}</span>
                  </NavLink>
                </li>
                <li>
                  <button onClick={handleLogout} className="btn btn-outline btn-sm">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/login" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
                    Login
                  </NavLink>
                </li>
                <li>
                  <Link to="/register" className="btn btn-primary btn-sm">
                    Get Started
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

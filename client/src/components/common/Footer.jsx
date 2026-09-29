import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
        <p style={{ fontWeight: 600, color: "var(--text-main)" }}>
          Blog<span style={{ color: "var(--primary)" }}>ify</span> — A modern, distraction-free publishing platform.
        </p>
        <div style={{ display: "flex", gap: "20px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
          <Link to="/" style={{ textDecoration: "underline" }}>Articles</Link>
          <Link to="/bookmarks" style={{ textDecoration: "underline" }}>Saved Reads</Link>
          <Link to="/create-post" style={{ textDecoration: "underline" }}>Publish Story</Link>
        </div>
        <p style={{ fontSize: "0.8rem", color: "var(--text-light)", marginTop: "4px" }}>
          &copy; {new Date().getFullYear()} Blogify Inc. Built with MERN Stack.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

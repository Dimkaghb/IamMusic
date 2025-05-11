import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={styles.navbar}>
      <h1 className={styles.logo}>I AM MUSIC</h1>
      <div className={styles.navLinks}>
        {isLoggedIn ? (
          <>
            <span className={styles.welcomeText}>Welcome, {user.name}</span>
            <button className={styles.link} onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <button className={styles.link} onClick={() => navigate('/login')}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
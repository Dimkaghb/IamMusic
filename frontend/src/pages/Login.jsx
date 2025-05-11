import React, { useState } from "react";
import Navbar from "../Components/Navvbar";
import axios from "axios";
import styles from './Login.module.css'
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3001/api/users/login", {
        email,
        password,
      });
      login(res.data.user); // update context and localStorage
      console.log("User logged in:", res.data);
      navigate("/main");
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert("Login failed.");
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Welcome back!!!</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className={styles.button}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
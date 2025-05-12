import React, { useState } from "react";
import Navbar from "../Components/Navvbar";
import styles from "./Register.module.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from '../config';



const Register = () => {


  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/api/users`, {
        name,
        email,
        password,
      });
      console.log("User registered:", res.data);
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error.response.data);
      alert("Registration failed. Check the console for details.");
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Create Your Account</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <button  type="submit" className={styles.button} >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
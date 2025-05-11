import React from "react";
import Navbar from "../Components/Navvbar";
import styles from "./Welcome.module.css";
import { Link } from "react-router";

const Welcome = () => {
  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.hero}>
        <h2 className={styles.title}>
          Explore Song Lyrics <br /> and Their Stories
        </h2>
        <p className={styles.subtitle}>
          Dive into your favorite tracks, discover the meaning behind every line,
          and connect with the artists’ thoughts.
        </p>
        <Link to="/register" className={styles.button}>Get Started</Link>
      </div>
    </div>
  );
};

export default Welcome;

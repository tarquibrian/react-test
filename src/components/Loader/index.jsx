import React from "react";
import styles from "./loader.module.css";

const Loader = () => {
  return (
    <div className={styles.linear__loader}>
      <div className={styles["ipl-progress-indicator-head"]}>
        <div className={styles["first-indicator"]}></div>
        <div className={styles["second-indicator"]}></div>
      </div>
    </div>
  );
};

export default Loader;

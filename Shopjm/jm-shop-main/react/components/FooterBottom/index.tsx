//@ts-nocheck
import React from "react";
import styles from "./style.css";
import vtex from "../../../assets/footer/vtex.svg";
import vinci from "../../../assets/footer/vinci.svg";

export default ({ children }) => {
  return (
    <div className={styles.copy}>
      <div className={["max-container", styles.content].join(" ")}>
        {children[0]}
        <div className="spacer"></div>
        <div className={styles.payment}>{children[1]}</div>
        <div className={styles.vtex}>
          powered by:
          <img src={vtex} alt="" />
        </div>
       
        </div>
      </div>

  );
};
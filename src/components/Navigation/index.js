import React from "react";
import { Link } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
import styles from "./style.module.css";

const Navigation = () => (
  <div>
    <ul>
      <li className={styles.brand}>
        <Link to={ROUTES.LANDING}>Home</Link>
      </li>
      <li>
        <Link to={ROUTES.PLAY}>Play</Link>
      </li>
      <li>
        <Link to={ROUTES.LEADERBOARD}>Leaderboard</Link>
      </li>
    </ul>
  </div>
);

export default Navigation;

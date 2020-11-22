import React from "react";
import { Link } from "react-router-dom";
import styles from "./style.module.css";
import * as ROUTES from "../../constants/routes";

const LandingPage = () => {
  return (
    <div className={styles.landingPage}>
      <h1>Welcome!</h1>
      <div className={styles.content}>
        <p>
          So you want to learn more about the constellations above your head,
          you're in the good place. By trying to make the best score at our{" "}
          <Link to={ROUTES.PLAY}>game</Link> and reach the top of the{" "}
          <Link to={ROUTES.LEADERBOARD}>leaderboard</Link> you'll learn to
          indentify some of the main constellations in the sky.
        </p>
      </div>
      <Link to={ROUTES.PLAY}>
        <button className="full large">Start the game</button>
      </Link>
      <div className={styles.content}>
        <p>
          This is a beta version of the web application, so all you can do for
          now is learn about how consellations look like. After some feedback we
          will progressively be adding more content about them.
        </p>
        <p>
          If you are a developer and you want to build something similar, this
          was made using react and this{" "}
          <a href="https://www.npmjs.com/package/react-constellation-sketcher">
            component
          </a>{" "}
          that I recommend you to check out. I also use this{" "}
          <a href="https://www.strudel.org.uk/lookUP/">API</a> to display the
          live pictures of each constellations. Since it is not too much data to
          take care of, I only used Firebase to save the scores to the
          leaderboard.
        </p>
      </div>
    </div>
  );
};

export default LandingPage;

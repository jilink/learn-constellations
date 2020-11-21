import React from "react";
import styles from "./App.module.css";
import * as ROUTES from "./constants/routes";
import GameContainer from "./components/Game";
import ScoreBoard from "./components/ScoreBoard";
import Navigation from "./components/Navigation";
import { BrowserRouter as Router, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <div className={styles.container}>
        <Navigation />
        {/*<Route exact path={ROUTES.LANDING} component={LandingPage} />*/}
        <Route path={ROUTES.PLAY} component={GameContainer} />
        <Route path={ROUTES.LEADERBOARD} component={ScoreBoard} />
      </div>
    </Router>
  );
};

export default App;

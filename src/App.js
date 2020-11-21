import React from "react";
import styles from "./App.module.css";
import GameContainer from "./components/Game/index";
import ScoreBoard from "./components/ScoreBoard/index";

const App = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Learn Constellations</h1>
      <GameContainer />
    </div>
  );
};

export default App;

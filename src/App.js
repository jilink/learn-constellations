import React, { useEffect } from "react";
import axios from "axios";
import styles from "./App.module.css";
import ConstellationSketcher, {
  constellationNames,
  categories,
} from "react-constellation-sketcher";

const API_BASE = "https://www.strudel.org.uk/lookUP/json/?name=";
const getConstellationUrl = (name) => `${API_BASE}${name}`;

const Constellation = ({ name, img }) => {
  return (
    <div>
      <p>{name}</p>
      <img src={img} />
    </div>
  );
};

const GameContainer = () => {
  const [constellation, setConstellation] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  useEffect(() => {
    getRandomConstellation();
  }, []);
  const getRandomConstellation = () => {
    setIsLoading(true);
    const index = Math.floor(Math.random() * constellationNames.length);

    axios
      .get(getConstellationUrl(constellationNames[index]))
      .then((response) => {
        setConstellation(response.data);
        setIsLoading(false);
      });
  };

  const handleNextConstellation = () => {
    getRandomConstellation();
  };

  return (
    <div>
      {isLoading ? (
        <p> Loading ...</p>
      ) : (
        <Constellation
          name={constellation.target.name}
          img={constellation.image.src}
        />
      )}
      <button onClick={handleNextConstellation}>NEXT</button>
    </div>
  );
};

const App = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Learn Constellations</h1>
      <GameContainer />
    </div>
  );
};

export default App;

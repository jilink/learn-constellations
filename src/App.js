import React, { useEffect } from "react";
import axios from "axios";
import styles from "./App.module.css";
import ConstellationSketcher, {
  constellationNames,
  categories,
} from "react-constellation-sketcher";

const API_BASE = "https://www.strudel.org.uk/lookUP/json/?name=";
const getConstellationUrl = (name) => `${API_BASE}${name}`;

const Constellation = ({ onAnswer, name, answers, img }) => {
  return (
    <div>
      <img src={img} />
      {answers.map((answer) => (
        <button onClick={onAnswer} key={answer}>
          {answer}
        </button>
      ))}
    </div>
  );
};

const GameContainer = () => {
  const [constellation, setConstellation] = React.useState([]);
  const [answers, setAnswers] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    setRandomConstellation();
  }, []);

  useEffect(() => {
    if (constellation.target) setRandomAnwsers(constellation.target.name);
  }, [constellation]);

  const setRandomConstellation = () => {
    setIsLoading(true);
    const index = Math.floor(Math.random() * constellationNames.length);
    axios
      .get(getConstellationUrl(constellationNames[index]))
      .then((response) => {
        setConstellation(response.data);
        setIsLoading(false);
      });
  };

  const setRandomAnwsers = (rightAnswer) => {
    const tmpAnswers = [];
    tmpAnswers.push(rightAnswer);
    while (tmpAnswers.length < 3) {
      const addToEnd = Math.random() <= 0.5; // 1/2
      const index = Math.floor(Math.random() * constellationNames.length);
      const tmpConstellation = constellationNames[index];
      if (tmpConstellation !== rightAnswer) {
        if (addToEnd) {
          tmpAnswers.push(tmpConstellation);
        } else {
          tmpAnswers.unshift(tmpConstellation);
        }
      }
    }
    console.log("right", rightAnswer);
    console.log("array", tmpAnswers);
    setAnswers(tmpAnswers);
  };

  const handleNextConstellation = () => {
    setRandomConstellation();
  };

  return (
    <div>
      {isLoading ? (
        <p> Loading ...</p>
      ) : (
        <Constellation
          name={constellation.target.name}
          answers={answers}
          img={constellation.image.src}
          onAnswer={handleNextConstellation}
        />
      )}
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

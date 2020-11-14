import React, { useEffect } from "react";
import axios from "axios";
import styles from "./style.module.css";

import ConstellationSketcher, {
  constellationNames,
  categories,
} from "react-constellation-sketcher";

const API_BASE = "https://www.strudel.org.uk/lookUP/json/?name=";
const getConstellationUrl = (name) => `${API_BASE}${name}`;

const Constellation = ({ onAnswer, name, answers, img }) => {
  return (
    <>
      <ConstellationSketcher constellation={name} width="500" height="500" />
      <div className={styles.answers}>
        {answers.map((answer) => (
          <button onClick={() => onAnswer(answer)} key={answer}>
            {answer}
          </button>
        ))}
      </div>
    </>
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
    console.log("array", tmpAnswers);
    setAnswers(tmpAnswers);
  };

  const handleAnswer = (answer) => {
    if (answer === constellation.target.name) {
      console.log("BRAVO BG");
    } else {
      console.log("Nooooo Poto :///", constellation.target.name);
    }
    setRandomConstellation();
  };

  return (
    <div className={styles.gameContainer}>
      {isLoading ? (
        <p> Loading ...</p>
      ) : (
        <Constellation
          name={constellation.target.name}
          answers={answers}
          img={constellation.image.src}
          onAnswer={handleAnswer}
        />
      )}
    </div>
  );
};

export default GameContainer;

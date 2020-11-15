import React, { useEffect } from "react";
import axios from "axios";
import styles from "./style.module.css";

import ConstellationSketcher, {
  constellationNames,
  categories,
} from "react-constellation-sketcher";

const API_BASE = "https://www.strudel.org.uk/lookUP/json/?name=";
const getConstellationUrl = (name) => `${API_BASE}${name}`;

const Score = ({ score }) => {
  return (
    <div className={styles.scoreContainer}>
      <span>SCORE: {score}</span>
      <span>BEST:</span>
    </div>
  );
};

const Constellation = ({
  showAnswer = false,
  onAnswer,
  onNext,
  name,
  answers,
  img,
}) => {
  return (
    <>
      <ConstellationSketcher constellation={name} width="500" height="500" />
      <div className={styles.answers}>
        {answers.map((answer) =>
          showAnswer ? (
            <button
              className={answer[1] ? styles.rightAnswer : styles.wrongAnswer}
              onClick={() => onAnswer(answer[0])}
              key={answer[0]}
            >
              {answer[0]}
            </button>
          ) : (
            <button onClick={() => onAnswer(answer[0])} key={answer[0]}>
              {answer[0]}
            </button>
          )
        )}
      </div>
      {showAnswer ? (
        <>
          <button onClick={onNext}>Next constellation</button>
          <div className="column">
            <p>
              Learn more about{" "}
              <a target="_blank" href={img}>
                {name}
              </a>
            </p>
            <img src={img} />
          </div>
        </>
      ) : null}
    </>
  );
};

const GameContainer = () => {
  const [constellation, setConstellation] = React.useState([]);
  const [answers, setAnswers] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showAnswer, setShowAnswer] = React.useState(false);
  const [score, setScore] = React.useState(0);

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
    tmpAnswers.push([rightAnswer, true]);
    while (tmpAnswers.length < 3) {
      const addToEnd = Math.random() <= 0.5; // 1/2
      const index = Math.floor(Math.random() * constellationNames.length);
      const tmpConstellation = constellationNames[index];
      if (tmpConstellation !== rightAnswer) {
        if (addToEnd) {
          tmpAnswers.push([tmpConstellation, false]);
        } else {
          tmpAnswers.unshift([tmpConstellation, false]);
        }
      }
    }
    console.log("array", tmpAnswers);
    setAnswers(tmpAnswers);
  };

  const handleAnswer = (answer) => {
    setShowAnswer(true);
    if (answer === constellation.target.name) {
      setScore(score + 2);
    } else if (score > 0) {
      setScore(score - 1);
    }
  };
  const handleNext = () => {
    setShowAnswer(false);
    setRandomConstellation();
  };

  return (
    <div className="column">
      <Score score={score} />
      <div className={styles.gameContainer}>
        {isLoading ? (
          <p> Loading ...</p>
        ) : (
          <Constellation
            showAnswer={showAnswer}
            name={constellation.target.name}
            answers={answers}
            img={constellation.image.src}
            onAnswer={handleAnswer}
            onNext={handleNext}
          />
        )}
      </div>
    </div>
  );
};

export default GameContainer;

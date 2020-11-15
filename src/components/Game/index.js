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

const constellationReducer = (state, action) => {
  switch (action.type) {
    case "CONSTELLATION_FETCH_INIT":
      return { ...state, isLoading: true };
    case "CONSTELLATION_FETCH_SUCCESS":
      return { ...state, isLoading: false, data: action.payload };
    case "CONSTELLATION_FETCH_SUCCESS":
      return { ...state, isLoading: false, isError: true };
    case "CONSTELLATION_FETCH_SUCCESS":
      return { ...state, isLoading: false, isError: true };
    case "HAS_ANSWERED":
      return { ...state, showAnswer: true, score: action.payload };
    case "HIDE_ANSWER":
      return { ...state, showAnswer: false };
    case "SET_ANSWERS":
      return { ...state, answers: action.payload };

    default:
      throw new Error();
  }
};

const GameContainer = () => {
  const [constellation, dispatchConstellation] = React.useReducer(
    constellationReducer,
    {
      data: [],
      isLoading: true,
      isError: false,
      showAnswer: false,
      score: 0,
      answers: [],
    }
  );

  useEffect(() => {
    setRandomConstellation();
  }, []);

  useEffect(() => {
    if (constellation.data.target)
      setRandomAnwsers(constellation.data.target.name);
  }, [constellation.data]);

  const setRandomConstellation = () => {
    dispatchConstellation({
      type: "CONSTELLATION_FETCH_INIT",
    });
    const index = Math.floor(Math.random() * constellationNames.length);
    axios
      .get(getConstellationUrl(constellationNames[index]))
      .then((response) => {
        dispatchConstellation({
          type: "CONSTELLATION_FETCH_SUCCESS",
          payload: response.data,
        });
      })
      .catch((error) => {
        dispatchConstellation({
          type: "CONSTELLATION_FETCH_ERROR",
        });
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
    dispatchConstellation({ type: "SET_ANSWERS", payload: tmpAnswers });
  };

  const handleAnswer = (answer) => {
    let tmpScore = constellation.score;
    if (answer === constellation.data.target.name) {
      tmpScore += 2;
    } else if (tmpScore > 0) {
      tmpScore -= 1;
    }
    dispatchConstellation({
      type: "HAS_ANSWERED",
      payload: tmpScore,
    });
  };

  const handleNext = () => {
    dispatchConstellation({
      type: "HIDE_ANSWER",
    });
    setRandomConstellation();
  };

  return (
    <div className="column">
      <Score score={constellation.score} />
      <div className={styles.gameContainer}>
        {constellation.isError && <p>Something went wrong</p>}
        {constellation.isLoading ? (
          <p> Loading ...</p>
        ) : (
          <Constellation
            showAnswer={constellation.showAnswer}
            name={constellation.data.target.name}
            answers={constellation.answers}
            img={constellation.data.image.src}
            onAnswer={handleAnswer}
            onNext={handleNext}
          />
        )}
      </div>
    </div>
  );
};

export default GameContainer;

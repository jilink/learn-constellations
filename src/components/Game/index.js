import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./style.module.css";
import ReactLoading from "react-loading";
import ProgressBar from "react-bootstrap/ProgressBar";
import SaveScore from "../SaveScore/index";
import ScoreBoard from "../ScoreBoard/index";

import ConstellationSketcher, {
  constellationNames,
  categories,
} from "react-constellation-sketcher";

const API_BASE = "https://www.strudel.org.uk/lookUP/json/?name=";
const getConstellationUrl = (name) => `${API_BASE}${name}`;

const Score = ({ score, best }) => {
  return (
    <div className={styles.scoreContainer}>
      <span>SCORE: {score}</span>
      <span>BEST: {best}</span>
    </div>
  );
};

const Constellation = ({
  showAnswer = false,
  gameEnded = false,
  onAnswer,
  onNext,
  onReplay,
  name,
  answers,
  img,
  score,
}) => {
  return (
    <>
      <ConstellationSketcher constellation={name} width="500" height="500" />
      <div className={styles.answers}>
        {answers.map((answer) =>
          showAnswer ? (
            <button
              disabled
              className={answer[1] ? styles.rightAnswer : styles.wrongAnswer}
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
          {gameEnded ? (
            <div className={`column ${styles.finalScore}`}>
              <h5>Your score is {score}</h5>
              <SaveScore score={score} />
              <button className={styles.full} onClick={onReplay}>
                Play again
              </button>
            </div>
          ) : (
            <button className={styles.full} onClick={onNext}>
              Next constellation
            </button>
          )}
          <div className="column">
            <p>
              Here's a live picture of{" "}
              <a target="_blank" href={img}>
                {name}
              </a>
            </p>
          </div>
        </>
      ) : null}
    </>
  );
};

const constellationReducer = (state, action) => {
  switch (action.type) {
    case "RESET_STATE":
      return {
        ...state,
        best: localStorage.getItem("best") || 0,
        isLoading: true,
        isError: false,
        showAnswer: false,
        gameEnded: false,
        score: 0,
        answers: [],
        questions: action.questions,
      };
    case "CONSTELLATION_FETCH_INIT":
      return { ...state, isLoading: true };
    case "CONSTELLATION_FETCH_SUCCESS":
      return { ...state, isLoading: false, data: action.payload };
    case "CONSTELLATION_FETCH_ERROR":
      return { ...state, isLoading: false, isError: true };
    case "HAS_ANSWERED":
      if (action.questions) {
        return {
          ...state,
          showAnswer: true,
          score: action.payload,
          questions: action.questions,
        };
      } else if (action.payload > localStorage.getItem("best")) {
        localStorage.setItem("best", action.payload);
        return {
          ...state,
          showAnswer: true,
          score: action.payload,
          best: action.payload,
          questions: 0,
          gameEnded: true,
        };
      } else {
        return {
          ...state,
          showAnswer: true,
          score: action.payload,
          questions: 0,
          gameEnded: true,
        };
      }

    case "NEXT_CONSTELLATION":
      return { ...state, showAnswer: false };
    case "SET_ANSWERS":
      return { ...state, answers: action.payload };
    default:
      throw new Error();
  }
};

const QuestionProgress = ({ left, total }) => {
  const [now, setNow] = React.useState(0);
  const computeNow = () => {
    const percent = ((total - left) * 100) / total;
    setNow(percent);
  };
  useEffect(() => {
    computeNow();
  }, [left]);
  return <ProgressBar variant="info" now={now} />;
};

const GameContainer = ({ questions = 15 }) => {
  const [constellation, dispatchConstellation] = React.useReducer(
    constellationReducer,
    {
      data: [],
      isLoading: true,
      isError: false,
      showAnswer: false,
      gameEnded: false,
      score: 0,
      best: localStorage.getItem("best") || 0,
      answers: [],
      questions: questions,
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
      let index = Math.floor(Math.random() * constellationNames.length);
      let tmpConstellation = constellationNames[index];
      if (
        tmpConstellation !== rightAnswer &&
        !tmpAnswers.includes(tmpConstellation)
      ) {
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
      questions: constellation.questions - 1,
    });
  };

  const handleNext = () => {
    if (constellation.questions) {
      dispatchConstellation({
        type: "NEXT_CONSTELLATION",
      });
      setRandomConstellation();
    }
  };

  const handlePlayAgain = () => {
    dispatchConstellation({
      type: "RESET_STATE",
      questions: questions,
    });
    setRandomConstellation();
  };

  return (
    <div className="column">
      <div className={styles.upInformations}>
        <Score score={constellation.score} best={constellation.best} />
        <QuestionProgress left={constellation.questions} total={questions} />
      </div>
      <div className={styles.gameContainer}>
        {constellation.isError && <p>Something went wrong</p>}
        {constellation.isLoading ? (
          <ReactLoading
            type={"spin"}
            color={"#5643fd"}
            height={"20%"}
            width={"20%"}
          />
        ) : (
          <Constellation
            showAnswer={constellation.showAnswer}
            gameEnded={constellation.gameEnded}
            name={constellation.data.target.name}
            answers={constellation.answers}
            img={constellation.data.image.src}
            onAnswer={handleAnswer}
            onNext={handleNext}
            onReplay={handlePlayAgain}
            score={constellation.score}
          />
        )}
      </div>
      <ScoreBoard limit={3} />
    </div>
  );
};

export default GameContainer;

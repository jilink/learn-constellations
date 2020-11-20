import React from "react";
import Firebase, { FirebaseContext } from "../Firebase/index";

const ScoreBoard = () => {
  const [scoreList, setScoreList] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  React.useEffect(() => {
    const firebase = new Firebase();
    firebase.getTopScore(10, setScoreList).then((response) => {
      setIsLoading(false);
    });
  }, []);

  return (
    <div>
      {isLoading ? (
        <p> loading </p>
      ) : (
        <div>
          {scoreList.map((info, index) => (
            <p key={info.username + index}>
              {info.username}score {info.score}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScoreBoard;

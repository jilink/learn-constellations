import React from "react";
import Firebase, { FirebaseContext } from "../Firebase/index";

const ScoreBoard = () => {
  const firebase = new Firebase();
  const [scoreList, setScoreList] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  React.useEffect(() => {
    setIsLoading(true);
    firebase.getTopScore(10).then((response) => {
      setScoreList(response);
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

import React from "react";
import Firebase, { FirebaseContext } from "../Firebase/index";
import Table from "react-bootstrap/Table";
import styles from "./style.module.css";

const ScoreBoard = ({ limit = 10 }) => {
  const [scoreList, setScoreList] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  React.useEffect(() => {
    const firebase = new Firebase();
    firebase.getTopScore(limit, setScoreList).then((response) => {
      setIsLoading(false);
    });
  }, []);

  return (
    <div>
      {isLoading ? (
        <p> loading </p>
      ) : (
        <Table
          bordered
          striped
          size="sm"
          variant="dark"
          className={styles.customTable}
        >
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {scoreList.map((info, index) => (
              <tr key={info.username + index}>
                <td>{index + 1}</td>
                <td>{info.username}</td>
                <td>{info.score}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ScoreBoard;

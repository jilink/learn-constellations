import app from "firebase/app";
import "firebase/database";

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_ID,
  measurementId: process.env.REACT_MEASUREMENT_ID,
};

class Firebase {
  constructor() {
    if (!app.apps.length) {
      app.initializeApp(config);
    }
  }
  writeNewScore(username, score) {
    app.database().ref("normal").push().set({
      username: username,
      score: score,
    });
  }
  async getTopScore(
    limit = 10,
    callback = (scoreList) => {
      console.log("callback", scoreList);
    },
    type = "normal"
  ) {
    const ref = app.database().ref(type);
    const scoreList = [];
    await ref
      .orderByChild("score")
      .limitToLast(limit)
      .on("value", (snapshot) => {
        snapshot.forEach((snap) => {
          scoreList.unshift(snap.val());
        });
        callback(scoreList);
      });
    return [];
  }
}

export default Firebase;

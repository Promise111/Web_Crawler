const { parentPort } = require("node:worker_threads");
const admin = require("firebase-admin");
const path = require("node:path");

let firebaseConfig = {
  credential: admin.credential.cert(path.join(__dirname, "admin.json")),
//   apiKey: "AIzaSyB2xkaT1wWn4EWHEk206nUTKnLtfi4klco",
//   authDomain: "web-worker1.firebaseapp.com",
//   databaseURL: "https://web-worker1.firebaseio.com",
//   projectId: "web-worker1",
//   storageBucket: "web-worker1.appspot.com",
//   messagingSenderId: "390530352979",
//   appId: "1:390530352979:web:9663e416c36224ed6a03a6",
};

admin.initializeApp(firebaseConfig);
let db = admin.firestore();
let date = new Date();
let currentDate = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;

parentPort.once("message", (message) => {
  //   console.log(message);
  //   parentPort.postMessage({ message, name: "Ihunna Promise" });
  console.log("Recieved data from mainWorker...");
  db.collection("Rates")
    .doc(currentDate)
    .set({ rates: JSON.stringify(message) })
    .then(() => {
      parentPort.postMessage("Data saved successfully");
    })
    .catch((error) => {
      console.log(error.message);
    });
});

const { Worker, isMainThread, parentPort } = require("worker_threads");

// const worker = new Worker("./worker.js");
// worker.once("message", (j) => console.log(j));
// worker.postMessage(30);
// console.log(isMainThread);

// worker.on("message", (j) => {
//   console.log(j);
// });

if (isMainThread) {
  const worker = new Worker(__filename);
  worker.once("message", (message) => {
    console.log(message, 2);
  });
  worker.postMessage("Main Thread: Hi!");
} else {
  parentPort.once("message", (message) => {
    console.log(message, 1);
    parentPort.postMessage("Worker Thread: Hello!");
  });
}

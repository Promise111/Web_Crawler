const { parentPort } = require("worker_threads");

parentPort.once("message", (data) => {
  let j = data;
  for (let i = 0; i < 60000000; i++) {
    j++;
  }

  parentPort.postMessage(j);
});

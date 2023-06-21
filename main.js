const { Worker, parentPort } = require("node:worker_threads");
const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");

async function fetchData(url) {
  console.log("Crawling data...");
  // make http call to url
  let response = await axios(url).catch((err) => console.log(err));

  if (response.status !== 200) {
    console.log("Error occurred while fetching data");
    return;
  }
  return response;
}

const workerDir = path.join(__dirname, "dbWorker.js");

const mainFunc = async () => {
  const url = "https://www.iban.com/exchange-rates";
  let res = await fetchData(url);

  if (!res?.data) {
    console.log("Invalid data Obj");
    return;
  }
  const html = res?.data;

  let dataObj = new Object();
  const $ = cheerio.load(html);

  const statsTable = $(
    ".table.table-bordered.table-hover.downloads > tbody > tr"
  );
  statsTable.each(function () {
    let title = $(this).find("td").text();
    let newStr = title.split("\t");
    newStr.shift();
    console.log(newStr);
    formatStr(newStr, dataObj);
  });

  return dataObj;
};

mainFunc().then((res) => {
  const worker = new Worker(workerDir);
  console.log("sending crawled data to dbWorker.js...");
  worker.postMessage(res);
  worker.on("message", (message) => {
    console.log(message);
  });
});

function formatStr(arr, dataObj){
  // regex to match all the words before the first digit
  let regExp = /[^A-Z]*(^\D+)/ 
  let newArr = arr[0].split(regExp); // split array element 0 using the regExp rule
  dataObj[newArr[1]] = newArr[2]; // store object 
}
const worker = new Worker(new URL("./work.js", import.meta.url));

worker.postMessage({
  question: "lucky number?",
});

worker.onmessage = (message) => {
  console.log(message.data.answer);
};

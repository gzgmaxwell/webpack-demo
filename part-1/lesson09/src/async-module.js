function getComponent() {
  // import函数返回的结果是一个promise
  return import("lodash").then(({ default: _ }) => {
    const ele = document.createElement("div");
    ele.innerHTML = _.join(["C", "WEBPACK"], " ");
    return ele;
  });
}

getComponent().then((ele) => {
  document.body.appendChild(ele);
});

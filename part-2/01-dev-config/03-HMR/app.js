import "./style.css";
import "./input";

const button = document.createElement("button");
button.textContent = "添加";
button.addEventListener("click", () => {
  const div = document.createElement("div");
  div.classList.add("square");
  document.body.appendChild(div);
});

document.body.appendChild(button);

if (module.hot) {
  // 接受一个文件，当它变化时热替换
  module.hot.accept("./input.js", () => {});
}

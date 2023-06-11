import HomeList from "./HomeList";

// 异步引入模块,nav为定义的模块名，Header是nav中expopes属性定义的key值
import("nav/Header").then((Header) => {
  const div = document.createElement("div");
  div.innerHTML = HomeList(5);
  div.appendChild(Header.default());
  document.body.appendChild(div);
});

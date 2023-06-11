import helloWorld from "./hello-world";
import imgsrc from "./assets/用户用例图.png";
import svgsrc from "./assets/二手交易.svg";
import txt from "./assets/webpack-source.txt";
import jpgsrc from "./assets/6.jpg";
import "./style.css";
import "./style.less";
import Data from "./assets/data.xml";
import Notes from "./assets/data.csv";
import toml from "./assets/data.toml";
import yaml from "./assets/data.yaml";
import json from "./assets/data.json";
import _ from "lodash";
import "./async-module";

helloWorld();

const img = document.createElement("img");
img.src = imgsrc;
document.body.appendChild(img);

const svg = document.createElement("img");
svg.src = svgsrc;
svg.style.cssText = "width:600px;height:200px";
document.body.appendChild(svg);

const block = document.createElement("div");
block.textContent = txt;
block.style.cssText = "width:200px;height:200px;background: aliceblue";
block.classList.add("block-bg");
document.body.appendChild(block);

const jpg = document.createElement("img");
jpg.src = jpgsrc;
jpg.style.cssText = "width:600px;height:200px";
document.body.appendChild(jpg);

document.body.classList.add("hello");

const span = document.createElement("span");
span.classList.add("icon");
span.innerHTML = "Hello world";
document.body.appendChild(span);

console.log(Data);
console.log(Notes);
console.log(toml);
console.log(toml.owner);
console.log(yaml);
console.log(yaml.owner);
console.log(json);
console.log(_.join(["hello", "world"], "--"));

const btn = document.createElement("button");
btn.textContent = "加法";
btn.addEventListener("click", () => {
  // 修改打包的js文件名: /**/
  import(
    /* webpackChunkName: 'math', webpackPrefetch: true */ "./math.js"
  ).then(({ add }) => {
    console.log(add(23, 232));
  });
});
document.body.appendChild(btn);

import helloWorld from "./hello-world";
import imgsrc from "./assets/用户用例图.png";
import svgsrc from "./assets/二手交易.svg";
import txt from "./assets/webpack-source.txt";
import jpgsrc from "./assets/6.jpg";

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
document.body.appendChild(block);

const jpg = document.createElement("img");
jpg.src = jpgsrc;
jpg.style.cssText = "width:600px;height:200px";
document.body.appendChild(jpg);

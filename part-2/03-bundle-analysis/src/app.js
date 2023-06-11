import styles from "./app.css";
import "./app.global.css";

const div = document.createElement("div");
div.textContent = "hello";
div.classList.add(styles.box);
div.classList.add("word");
document.body.appendChild(div);

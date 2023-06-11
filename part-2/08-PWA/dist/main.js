/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ (() => {

eval("console.log(\"hello webpack\");\r\nconsole.log(navigator);\r\n\r\n// 判断是否支持service worker\r\nif (\"serviceWorker\" in navigator) {\r\n  console.log(\"enter\");\r\n  window.addEventListener(\"load\", () => {\r\n    // 返回的是个注册成功的promise对象\r\n    navigator.serviceWorker\r\n      .register(\"/service-worker.js\")\r\n      .then((registration) => {\r\n        console.log(\"注册成功\", registration);\r\n      })\r\n      .catch((registrationError) => {\r\n        console.log(registrationError);\r\n      });\r\n  });\r\n}\r\n\n\n//# sourceURL=webpack://08-pwa/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/index.js"]();
/******/ 	
/******/ })()
;
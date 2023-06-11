console.log("hello webpack");
console.log(navigator);

// 判断是否支持service worker
if ("serviceWorker" in navigator) {
  console.log("enter");
  window.addEventListener("load", () => {
    // 返回的是个注册成功的promise对象
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("注册成功", registration);
      })
      .catch((registrationError) => {
        console.log(registrationError);
      });
  });
}

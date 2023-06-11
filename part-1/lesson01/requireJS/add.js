const add = (x, y) => x + y;

// define([]，第一个参数是依赖的其他模块，func，第二个参数是回调函数，是模块对外暴露的接口)
define([], function () {
  return add;
});

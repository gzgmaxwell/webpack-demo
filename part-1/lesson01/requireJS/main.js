// 第一个参数是依赖模块的数组，它访问参照的目录点在引用的html文件，注意相对路径的书写
// 第二个参数是回调函数，指向了define的第二个函数
require(["./add", "./minus"], function (add, minus) {
  console.log(add(1, 2));
});

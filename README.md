# 一、Webpack-基础篇

https://lab.puji.design/webpack-getting-started-manual/ webpack学习笔记

## 1、wepack介绍

### 1.1 解决作用域问题

场景：

用script标签引入js文件，将所有的代码都直接打包到一个文件中，会使得所有变量成为全局变量，污染全局作用域。所以需要代码拆分，使得代码模块化。

#### **gulp**

底层使用**IFFE**，return需要暴露的变量实现。存在大量无用的代码，文件体积太大，会影响构建和加载效率的问题。所以提出了代码拆分的想法



#### **commonJS**

这是一种在**nodeJS环境**下（浏览器环境下无法直接使用）的解决方法，通过**module.exports和require**实现模块化。

```js
// math.js
const add = (x, y) => x + y;
const minus = (x, y) => x - y;

module.exports = {
  add,
  minus,
};

// server.js
const math = require("./math");
console.log(math.add(1, 3));
```



#### **requireJS**

在浏览器下使用的，可以使类似commonJs的模块在浏览器运行。通过**define和require**实现

```js
//add.js
const add = (x, y) => x + y;
// define([]，第一个参数是依赖的其他模块，func，第二个参数是回调函数，是模块对外暴露的接口)
define([], function () {
  return add;
});

// main.js
// 第一个参数是依赖模块的数组，它访问参照的目录点在引用的html文件，注意相对路径的书写
// 第二个参数是回调函数，指向了define的第二个函数
require(["./add", "./minus"], function (add, minus) {
  console.log(add(1, 2));
});

// index.html
<!-- data-main：加载的入口js文件 -->
<script
      src="https://cdn.bootcdn.net/ajax/libs/require.js/2.3.6/require.js"
      data-main="./main.js"
></script>
```



#### ECMAScript

对于web项目，模块逐渐成为ECMAScript的标准，使用**export和impor**t实现。

```js
// add.js
const add = (x, y) => x + y;
export default add;、
```

```html
<!-- 如果不加type，会报错Uncaught SyntaxError: Cannot use import statement outside a module，
    加上type="module"之后，会报错跨域需要搭建一个本地的http server环境，使用npx拉取一个线上的http server
    Access to script at 'file:///D:/vscode/WebpackDemo/ECMAScript/add.js' from origin 'null' has been blocked by CORS policy
    npx可以实现当某一个模块本地不存在时，可以从网上安装一个模块-->
    <script type="module">
      import add from "./add.js";
      console.log(add(1, 2));
      console.log("hello world");
    </script>
```



#### webpack

可以实现打包JS应用程序，也可以扩展支持很多的静态资源打包，并同时支持ES的模块化和commonJS



### 1.2 webpack与竞品的比较

#### parcel

配置简单，一般无需做其他的配置开箱即用。适合构建一个简单，可以快速运行的应用。

#### rollup.js

用标准化的格式编写代码，如ES6，通过减少无用的代码，尽可能的缩小包的体积。一般只能用来打包js。适合构建一个简单的类库，只需要导入很少的第三方的库。

#### Vite

是未来vue的搭建工具，可以完成开发，编译，发布，demo。Vite采用**基于ESModule**的构建方式，可以**按需编译，支持模块热更新**等。

#### webpack

适合复杂的，需要继承很多第三方库，需要拆分代码，需要使用静态资源文件，支持common.js，esModule的应用。

webpack除了可以引入js，还可以使用内置的资源模块asset modules来引入任何的其他类型资源。



## 2.  webpack基本使用

### 2.1 webpack.config.js

搭建基本的环境

```python
npm install @babel/core @babel/preset-env babel-loader clean-webpack-plugin core-js html-webpack-plugin ts-loader typescript webpack webpack-cli webpack-dev-server less less-loader css-loader style-loader postcss postcss-loader postcss-preset-env -D
```

webpack.config.js配置文件，名字固定，由webpack自动读取

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const toml = require("toml");
const yaml = require("yaml");
const json = require("json");

module.exports = (env) => {
  console.log(env);
  return {
    entry: {
      index: "./src/index.js",
      another: "./src/another-module.js",
    },

    output: {
      // filename: "bundle.js",
      // [name]是入口chunk的key的名字
      filename: "scripts/[name].[contenthash].js",
      path: path.resolve(__dirname, "./dist"),
      // 清理当前打包之外的文件
      clean: true,
      // webpack默认生成文件名：[contenthash]，根据文件的内容生成一个哈希的字符串
      // [ext]表示源文件的扩展名
      assetModuleFilename: "images/[contenthash][ext]",
      publicPath: "http://localhost:8080/",
    },

    mode: env.production ? "production" : "development",

    // 将代码直接映射到打包好的js文件中
    devtool: "inline-source-map",

    // HtmlWebpackPlugin: index.html的自动生成，有对应的srcipt标签引入文件
    plugins: [
      new HtmlWebpackPlugin({
        // 基于template对应的文件打包生成html
        template: "./index.html",
        filename: "app.html",
        // script标签的生成位置
        inject: "body",
      }),
      new MiniCssExtractPlugin({
        filename: "styles/[contenthash].css",
      }),
    ],

    // webpack-dev-server实际没有输出任何的文件，它将打包好的bundle.js放在了内存里
    devServer: {
      // 指定server的根目录
      static: "./dist",
    },

    module: {
      rules: [
        {
          test: /\.png$/,
          type: "asset/resource",
          generator: {
            filename: "images/[contenthash][ext]",
          },
        },
        {
          test: /\.svg$/,
          type: "asset/inline",
        },
        {
          test: /\.txt$/,
          type: "asset/source",
        },
        {
          test: /\.jpg$/,
          type: "asset",
          parser: {
            // 自定义是否在dist下创建新文件的临界值
            dataUrlCondition: {
              maxSize: 4 * 1024 * 1024, // 即4mb
            },
          },
        },
        {
          test: /\.(css|less)$/,
          // css-loader用于打包，正确识别css文件
          // style-loader去真正引入css文件
          // 顺序是不可以颠倒的，会从右向左使用
          // use: ["style-loader", "css-loader", "less-loader"],
          use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)/,
          type: "asset/resource",
        },
        {
          test: /\.(csv|tsv)$/,
          use: "csv-loader",
        },
        {
          test: /\.xml$/,
          use: "xml-loader",
        },
        {
          test: /\.toml$/,
          type: "json",
          parser: {
            parse: toml.parse,
          },
        },
        {
          test: /\.yaml$/,
          type: "json",
          parser: {
            parse: yaml.parse,
          },
        },
        {
          test: /\.json$/,
          type: "json",
          parser: {
            parse: json.parse,
          },
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
              // plugins: [["@babel/plugin-transform-runtime"]],
            },
          },
        },
      ],
    },

    // 优化相关的配置
    optimization: {
      minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],

      // 抽离公共代码的插件
      splitChunks: {
        // chunks: "all",
        // 缓存组，缓存第三方文件
        cacheGroups: {
          // vendor:提取公共方法
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
        },
      },
    },
  };
};

```

- mode
  - **development** 开发模式：会将 process.env.NODE_ENV 的值设为 development。启用 NameChunksPlugin 和 NameModulesPlugin。特点是能让代码本地调试运行的环境。
  - **production** 生产模式：会将 process.env.NODE_ENV 的值设为 production。启用 FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, OccurrenceOrderPlugin, SideEffectsFlagPlugin 和 UglifyJsPlugin。特点是能让代码优化上线运行的环境。
  - **none**：



### 2.2 plugin

https://webpack.js.org/plugins/ webpack官网插件

webpack会记载文件之间的依赖关系，将其交给webpack编译器，加工生成目标文件。在编译的过程中，需要plugins来辅助完成如打包优化，资源管理等功能。



### 2.3 webpack-dev-server

打包实时更新，不需要手动重新执行打包的命令。当源代码改变时，会自动重新运行，打包新的文件。

```
npx webpack --watch
```



webpack-dev-server提供了一个基本的web server，并且具有live reloading（实时加载）的功能。不但能监测文件的变化重新编译，还能实现浏览器的自动刷新



安装

```
npm install webpack-dev-server -D
```





## 3. 资源模块

### 3.1 资源模块类型

通过四种类型模块来替换所有的loader，包括

- **asset/resource：会发送单独的文件并导出URL，在dist文件会有对应的资源。**
- **asset/inline：会导出资源的Data URL，在dist文件不会有对应的资源**。URL不是一个图片的URL，而是一个Data URL base64的格式。
- **asset/source：会导出资源的源代码**
- **asset：通用资源类型，会在导出一个Data URL和发送一个单独的文件之间自动进行选择**，即在asset/inline和asset/resource之间选择。默认webpack会判断加载资源的大小，当资源文件大于8k时，就会创建一个资源，即使用asset/resource。这个临界值也是可以自定义的，通过parser.dataUrlCondition.maxSize。



**指定打包资源的文件名和路径有两种方式，在output中添加assetModuleFilename属性或在rules里添加generator属性，其中generator的优先级要更高。**

```js
// 方法一：
output: {
    // webpack默认生成文件名：[contenthash]，根据文件的内容生成一个哈希的字符串
    // [ext]表示源文件的扩展名
    assetModuleFilename: "images/[contenthash][ext]",
  },
      
// 方法二：
module: {
    rules: [
      {
        test: /\.png$/,
        type: "asset/resource",
        generator: {
          filename: "images/test.png",
        },
      },
    ],
  },
```





## 4. 管理资源

### 4.1 加载css

webpack可以解析js,json类的文件，loader可以让webpack去解析其他类型的文件，并将其转化为有效的模块。

当通过require或import去解析一个对应类型的文件时，**在将文件打包之前，先使用use属性对应的loader转化**。

**loader可以让webpack去处理其他类型的文件，并将它们转化为有效的模块**。



**css-loader可以正确的将引入的css文件中定义的类添加到对应的元素上，但是在head中并没有引入css文件，导致样式不生效。**

**单独的css-loader无法完成，还需要style-loader，它可以将css文件引入。**

webpack支持链式调用，链式上的每一个loader都可以对文件进行转换，会将转换后的内容传递给下一个loader。webpack期望最后一个loader会返回js。它还可以解析css预处理语言如less,scss。**less-loader需要放在最右侧，第一个执行**

```js
{
        test: /\.(css|less)$/,
        // css-loader用于打包，正确识别css文件
        // style-loader去真正引入css文件
        // 顺序是不可以颠倒的，会从右向左使用
        use: ["style-loader", "css-loader", "less-loader"],
},
```



### 4.2 抽离css

4.1的操作可以完成css的引入，但是引入的方式是在head中增加了多个style实现的。

**mini-css-extract-plugin可以css代码放到单独的文件中，用link标签加载**。它是基于webpack5构建的。



plugins

```js
plugins: [
	-------
    new MiniCssExtractPlugin({
      filename: "styles/[contenthash].css",
    }),
  ],
```

rules

```js
{
        test: /\.(css|less)$/,
        // css-loader用于打包，正确识别css文件
        // style-loader去真正引入css文件
        // 顺序是不可以颠倒的，会从右向左使用
        // use: ["style-loader", "css-loader", "less-loader"],
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
},
```



### 4.3 压缩css

**css-minimizer-webpack-plugin可以压缩css文件。**

```js
// 优化相关的配置
  optimization: {
    minimizer: [new CssMinimizerPlugin()],
  },
```



### 4.4 加载fonts

**在css3中新增了webfont，可以在css中加载一个font字体库，就可以去自定义icon图标。**

使用asset module可以接受并加载任何文件，然后将其输出到构建目录。

```css
@font-face {
  font-family: "iconfont";
  src: url(./assets/hfWV8YURk7f_zuX6JKgUt.woff) format("woff");
}

.icon {
  font-family: "iconfont";
  font-size: 30px;
}

```



### 4.5 加载csv,xml

此外，可以加载的资源还有数据，如JSON，CSV等。类型NodeHS，JSON的支持实际上是内置的，import导入就可以正常运行。要导入CSV,TSV,XML，可以使用csv-loader，xml-loader。

```
npm install csv-loader xml-loader -D
```

xml文件会转换为JS对象，csv会转换为数组。

```js
	  {
        test: /\.(csv|tsv)$/,
        use: "csv-loader",
      },
      {
        test: /\.xml$/,
        use: "xml-loader",
      },
```





### 4.6 加载json,yml,toml

```
npm install toml yaml json -D
```

```js
	  {
        test: /\.toml$/,
        type: "json",
        parser: {
          parse: toml.parse,
        },
      },
      {
        test: /\.yaml$/,
        type: "json",
        parser: {
          parse: yaml.parse,
        },
      },
      {
        test: /\.json$/,
        type: "json",
        parser: {
          parse: json.parse,
        },
      },
```





## 5. js编译

### 5.1 babel-loader

ES6的代码会被直接打包到dist中，如果浏览器不支持ES6的话，会运行失败。因此需要将其转化为ES5的代码。

```
npm install babel-loader @babel/core @babel/preset-env -D
```

- **babel-loader：在Webpack里应用babel解析ES6的桥梁**
- **@babel/core：babel核心模块**
- **babel/preset-env：babel预设，一组babel插件的集合**

代码中既可以加载本地自己写的js，也可以加载全局里的node_modules里的js文件(不需要babel-loader的编译)，所以需要排除node_modues中的代码。



### 5.2 regeneratorRuntime

regeneratorRuntime 是webpack打包生成的全局辅助函数，由babel生成，用于兼容async/await的语法。 

```python
# 这个包包含了regeneratorRuntime，运行时需要
npm install @babel/runtime -D

# 在需要regeneratorRuntime的地方自动require导包，编译时需要
npm install @babel/plugin-transform-runtime -D
```

修改babel配置

```js
{
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            // plugins: [["@babel/plugin-transform-runtime"]],
          },
        },
      },
```





## 6. 代码分离

### 6.1 代码分离方法

webpack可以将代码分离到不同的bundle中，按需加载bundle，或者并行加载bundle。代码分离可以用于获取更小的bundle，以及控制资源加载的优先级。

常用的代码分离方法有三种：

- **配置入口起点：使用entry配置，手动地分离代码。如果是多个入口，那么这些多个入口的文件会在每个包中分别地重复打包。**
- **防止重复的分离方法：在入口使用entry dependencies或者SplitChunkPlugin去重和分离代码。**
- **动态导入：通过模块的内联函数import调用来分离代码。**



### 6.2 入口起点

需要同时配置entry和output两个对象。当前配置下，如果有两个文件引入了同样的库，库会被打包两次。

```js
	entry: {
    index: "./src/index.js",
    another: "./src/another-module.js",
  },

  output: {
    // filename: "bundle.js",
    // [name]是入口chunk的key的名字
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "./dist"),
    // 清理当前打包之外的文件
    clean: true,
    // webpack默认生成文件名：[contenthash]，根据文件的内容生成一个哈希的字符串
    // [ext]表示源文件的扩展名
    assetModuleFilename: "images/[contenthash][ext]",
  },
```



### 6.3 防止重复

**需要配置entry.dependOn option选项，可以将一些公共的文件抽离成单独的chunk，在多个chunk之间共享代码。**

```js
entry: {
    index: { import: "./src/index.js", dependOn: "shared" },
    another: {
      import: "./src/another-module.js",
      dependOn: "shared",
    },
    // shared这个名字是自定义的，表示共享模块
    // 当以上两个文件中都有lodash时，就会把lodash抽离出来
    shared: "lodash",
  },
```



**还可以使用webpack内置的插件split-chunks-plugin，可以将模块依赖的公共的一些文件抽离成单独的chunk。**

```js
// 优化相关的配置
  optimization: {
    minimizer: [new CssMinimizerPlugin()],

    // 抽离公共代码的插件
    splitChunks: {
      chunks: "all",
    },
  },
```



### 6.4 动态导入

当设计动态代码拆分时，webpack提供了两种类似的技术。

**第一种，也是推荐的方式，使用ECMASrcipt提供的import语法。**

**第二种，webpack的遗留功能，使用webpack特定的require.ensure。**



只有动态导入时，webpack就可以正常打包。

```js
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
```

**当动态+静态混合时，就需要开启splitChunks选项**



### 6.5 懒加载

懒加载或按需加载，是一种优化网页或应用的方式。实际上是先把代码在一些逻辑断点处分离开，然后在代码块中完成某些操作后，立即引用或即将引用另外一些新的代码块。懒加载可以加快应用的初始加载速度，减轻它的总体体积。

**在函数内部调用import函数，可以实现懒加载。**

**import的资源前加/* webpackChunkName: 'math' */ ，可以修改打包的文件名。**

```js
() => {
  // 修改打包的js文件名: /**/
  import(/* webpackChunkName: 'math' */ "./math.js").then(({ add }) => {
    console.log(add(23, 232));
  });
}
```





### 6.6 预获取和预加载

wepackv4.6+增加了预获取和预加载等待支持。

在声明import时，可以使用下面这些内置指令，让webpack输出“source hint”资源提示，来告知浏览器：

- **prefetch预获取：将来某些导航下可能需要的资源。**
- **preload预加载：当前导航下可能需要的资源。**



prefetch

**注释webpackPrefetch 会使得在head中增加一个link标签，对应src会在首页面加载完毕，网络空闲的时候再去加载打包好的math.bundle.js。在需要动态导入资源时，会再次加载。**

```js
import(/* webpackChunkName: 'math', webpackPrefetch:true */ "./math.js").then(
    ({ add }) => {
      console.log(add(23, 232));
    }
  );
```

```html
<link rel="prefetch" as="script" href="file:///D:/vscode/WebpackDemo/lesson08/dist/math.bundle.js">
```



preload

**注释webpackPreload在首页面加载时不会下载src，在动态导入时再加载，与懒加载效果类似。preload可以实现模块并行加载。**

```js
import(/* webpackChunkName: 'math', webpackPreload:true */ "./math.js").then(
    ({ add }) => {
      console.log(add(23, 232));
    }
  );
```





## 7. 缓存

### 7.1 输出业务代码

**获取资源是比较耗时的，可以通过命中缓存，降低网络流量，使网站的加载速度更快。**

**部署新版本时，如果不更改资源的文件名，浏览器可能会认为文件未被更新，从而使用缓存，会对获取新版本造成影响。**

**确保webpack打包生成的文件可以被客户端缓存，并且在文件内容发生变化时，还能够请求到新的文件。**



可以通过替换**out.filename中的substitutions设置**，来定义输出文件的名称。**webpack提供了一种使用substitution（可替换模板字符串）的方式。通过带括号字符串来模板化文件名**。其中**[contenthash] substitution 将根据资源内容构建出唯一hash**。当资源内容发生变化时，[contenthash]也会变化。

```js
output: {
    // filename: "bundle.js",
    // [name]是入口chunk的key的名字
    filename: "[name].[contenthash].js",
  },
```



### 7.2 缓存第三方库

将第三方库library提取到单独的wendor chunk文件中，是比较推荐的做法。第三库很少频繁修改，可以利用client长效缓存机制，命中缓存来消除请求，并减少向server获取资源，保持client和server代码版本一直。

**在optimization.splitChunks添加cacheGroups参数并构建：**

```js
splitChunks: {
      // chunks: "all",
      // 缓存组，缓存第三方文件
      cacheGroups: {
        // vendor:提取公共方法
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
```



### 7.3 文件放在文件夹中

目前js文件都在dist文件夹的根目录下，需要把它们放到一个文件夹下：

```js
filename: "scripts/[name].[contenthash].js",
```



## 8. 拆分开发和生产环境配置

### 8.1 公共路径

目前只能手动调整mode选项切换环境，并且很多配置在生产环境和开发环境中是不一致的。

**公共路径，即使用publicPath配置，可以指定所有资源的基础路径。**在开发环境中，通常有一个assets文件夹，与索引页面处于同一级别，但生产环境可能会将其托管至CDN。可以指定前缀，使得引用路径变为绝对引用。

```js
output: {
    publicPath: "http://localhost:8080/",
  },
```

```html
<script
      defer
      src="http://localhost:8080/scripts/vendors.29025132a649c43205f8.js"
    ></script>
```



### 8.2 环境变量

environment variable环境变量可以消除webpack.config.js在开发环境和生产环境之间的差异。

**weback命令行环境配置的--env参数，可以传入任意数量的环境变量。而在 webpack.config.js中可以访问到这些环境变量。例如，--env production或--env goal=local。**

对于我们的 webpack配置，有一个必须要修改之处。通常, module.exports指向配置对象。要使用env 变量，你必须将module.exports转换成一个函数:

```python
# 命令行可以增加指定环境的参数
npx webpack --env production
```

```js
module.exports = (env) => {
    return {
        mode: env.production ? "production" : "development",
    }
}
```



**重新在生产环境下打包后的文件，是未被压缩的。原因是配置了optimization.minimizer对css进行压缩，需要再重新配置一下webpack开箱即用的terser来压缩js代码。（只有在生产环境下压缩，开发环境不压缩）**

```
npm install terser-webpack-plugin -D
```

```js
const Terser = require("terser-webpack-plugin");

optimization: {
      minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
    },
  };
```



### 8.3 拆分配置文件

思路：将不同环境的配置文件拆分为两个文件

```python
# -c 指定配置文件 
npx webpack -c ./webpack.config.dev.js
```





### 8.4 npm脚本

配置npm脚本，来简化命令行输入，此时可以省略npx：

```js
// 配置简化命令
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "npx webpack serve -c ./config/webpack.config.dev.js",
    "build": "npx webpack -c ./config/webpack.config.dev.js"
  },
      
// 执行
npm run start
```





### 8.5 提取公共配置

将两个配置中的公共部分提取到common文件中，使用webpack-merge实现深合并。

```
npm install webpack-merge -D
```

```js
const { merge } = require("webpack-merge");

const commonConfig = require("./webpack.config.common");
const productionConfig = require("./webpack.config.prod");
const developmentConfig = require("./webpack.config.dev");

module.exports = (env) => {
  switch (true) {
    case env.development:
      return merge(commonConfig, developmentConfig);
    case env.production:
      return merge(commonConfig, productionConfig);

    default:
      return new Error("No match configuration was found");
  }
};
```





# 二、webpack-高级篇

## 1. 开发效率与开发规范

### 1.1 source-map

开发环境最不可少的功能是-debug，source-map可以将报错信息映射到源码上。**webpack已经内置了source-map的功能**，我们只需要通过简单的配置，将可以开启它。

```js
module.exports = {
	devtool: 'source-map'
}
```



**当我们执行打包命令之后，我们发现bundle的最后一行总是会多出一个注释，指向打包出的bundle.map.js(sourcemap文件)。sourcemap文件用来描述源码文件和bundle文件的代码位置映射关系。基于它，我们将bundle文件的错误信息映射到源码文件上。**

除了'source-map'外，还可以基于我们的需求设置其他值，webpack—-devtool一共提供了7种SourceMap模式:

| 模式                    | 解释                                                         |
| :---------------------- | ------------------------------------------------------------ |
| eval                    | 每个module会封装到eval里包裹起来执行，并且会在末尾追加注释//@sourceURL，dev下默认值 |
| source-map              | 生成一个SourceMap文件                                        |
| hidden-source-map       | 和source-map一样，但不会在bundle未尾追加注释。能生成map，**不能锁定行数** |
| inline-source-map       | 生成一个DataUrl形式的SourceMap文件，不会单独打包一个map文件  |
| eval-source-map         | 每个module会通过eval()来执行．并目生成一个DataUrl形式的SourceMap |
| cheap-source-map        | 生成一个没有列信息 (column-mappings)的SourceMaps文件，不包含loader的source-map，**js编译后无法锁定行数** |
| cheap-module-source-map | (**推荐使用**)生成一个没有列信息的SourceMaps文件，同时loader的sourcemap也简化为只包含对应行 |



要注意的是，生产环境我们一般不会开启source-map功能，主要有两点原因：

- 通过bundle和sourcemap文件，可以反编译出源码―-—-也就是说，线上产物有soucemap文件的话，就意味着有暴漏源码的风险。
- 2我们可以观察到,sourcemap文件的体积相对比较巨大。



### 1.2 devServer

开发环境下，我们往往需要启动一个web服务，读取打包产物。webpack内置了这样的功能，我们只需要简单的配置就可以开启它。

```
yarn add webpack-dev-server -D
```



**devServer.proxy基于强大的中间件 http-proxy-middleware 实现的**，因此它支持很多的配置项。我们基于此，可以做应对绝大多数开发场景的定制化配置。

#### 基础使用

```js
devServer: {
    static: path.resolve(__dirname, "./dist"),
    // 设置是否在服务器端进行代码压缩，以减少传输过程中的数据大小
    // Accept-Encoding: gzip，说明服务器到客户端传输的过程中，文件是被压缩的
    compress: true,
    port: 3000,
  },
```



#### 添加响应头

有些场景需求下，我们需要为所有响应添加headers，来对资源的请求和响应打入标志，以便做一些安全防范，或者方便发生异常后做请求的链路追踪。比如:

```js
devServer: {
    static: path.resolve(__dirname, "./dist"),
    headers: {
      "X-Access-Token": "adfasdfa",
    },
  },
```

​		headers的配置也可以传一个函数︰

```js
headers: () => {
      return {
        "X-Bar": ["key1=value1"],
      };
    },
```



#### 开启代理

我们打包出的js bundle里有时会有一些对特定接口的网络请求(ajax/fetch)。为了解决跨域，我们可以使用devServer自带的proxy

```js
devServer: {
    proxy: {
      "/api": "http://localhost:9000",
    },
  },
      
// app.js
fetch("/api/hello")
  .then((res) => res.text())
  .then((res) => {
    console.log(res);
  });
```



#### https

将本地的http服务变成https服务，配置

```js
devServer: {
    https: true,
  },
```

注意，此时我们访问http:/localhost:port是无法访问我们的服务的，我们需要在地址栏里加前缀: https。注意:由于默认配置使用的是自签名证书，所以有的浏览器会告诉你是不安全的，但我们依然可以继续访问它。当然我们也可以提供自己的证书――如果有的话:

```js
devServer: {
    https: true,
    cacert: './server.pem',
    pfx : './server.pfx ',
    key : './ server.key ' ,
    cert: './server.crt ' ,
    passphrase: 'webpack-dev-server ',
    requestCert: true,
  },
```



#### http2

http2是自带https的自签名证书的

```
devServer: {
    http2: true,
  },
```



#### historyApiFallback

如果我们的应用是个SPA(单页面应用)，当路由到/some时(可以直接在地址栏里输入)，会发现此时刷新页面后，控制台会报错。

```
GET http://localhost:3000/some 404 (Not Found)
```

此时打开network，刷新并查看，就会发现问题所在-—―浏览器把这个路由当作了静态资源地址去请求。此时并没有打包出/some这样的资源，所以这个访问无疑是404的。**此时可以通过配置来提供页面代替任何404的静态资源响应:**

```js
// 此时实际上是跳到了根页面下
devServer: {
    historyApiFallback: true,
  },
```



此时重启服务刷新后发现请求变成了index.html。当然，在多数业务场景下，我们需要根据不同的访问路径定制替代的页面，这种情况下，我们可以使用rewrites这个配置项。类似这样:

```js
module.exports = {
	devServer:{
		historyApiFallback: {
            rewrites: [
                {from: /^\/$/,to: '/views/landing.html/'}
            ]
        }
	}
}
```



#### 开发服务器主机

如果你在开发环境中起了一个devserve服务，并期望你的同事能访问到它，你只需要配置:

```js
module.exports = {
	devServer:{
		host: '0.0.0.0'
	}
}
```



### 1.3 模块热替换与热加载

#### 模块热替换

**模块热替换会在应用程序运行过程中，替换、添加或删除模块，而无需重新加载整个页面。**

启动webpack的热模块替换特性，需要配置devServer.hot参数

```js
devServer: {
    hot: true,
},
```

**css文件可以直接实现热替换**，如果你配置了style-loader，那么现在已经同样支持样式文件的热替换功能了。这是因为style-loader的实现使用了module.hot.accept，在css依赖模块更新之后，会对style标签打补丁。从而实现了这个功能。



**js文件需要加上以下，才能实现热替换**。webpack5实现热替换，实际使用的是webpack5开箱即用的HotModuleReplacementPlugin，只需要配置devServer.hot即可。

```js
if (module.hot) {
  // 接受一个文件，当它变化时热替换，回调函数在热替换时执行
  module.hot.accept("./input.js",() => {
    
  });
}
```

```python
# 浏览器中
[webpack-dev-server] Server started: Hot Module Replacement enabled, Live Reloading enabled, Progress disabled, Overlay enabled.
[webpack-dev-server] App updated. Recompiling...
[webpack-dev-server] App hot update...
[HMR] Checking for updates on the server...
[HMR] Updated modules:
[HMR]  - ./input.js
[HMR] App is up to date.
```



#### 模块热加载

**热加载（文件更新时，自动刷新我们的服务和页面）新版的webpack-dev-server默认已经开启了热加载的功能。它对应的参数是devServer.liveReload，默认为true。注意，如果想要关掉它，要将liveReload设置为false的同时，也要关闭hot**

```js
devServer: {
    liveReload: false, // 默认为true，即开启热更新功能
  },
```



### 1.4 ESLint

#### 单独使用

eslint是用来扫描我们所写的代码是否符合规范的工具。严格意义上来说, eslint配置跟webpack无关，但在工程化开发环境中，它往往是不可或缺的。

```
npm install eslint  @eslint/create-config -D
```



配置eslint，只需要在根目录下添加一个.**eslintrc**文件(或者.eslintrc.json,.js等)。当然，我们可以使用eslint工具来自动生成它:

```python
npx eslint --init
# 或
npm init @eslint/config
```

```json
{
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": "airbnb-base",
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
    }
}

```

并生成了一个配置文件(.eslintrc.json)，这样我们就完成了eslint的基本规则配置。eslint配置文件里的配置项含义如下:

1. **env**：指定脚本的运行环境。每种环境都有一组特定的预定义全局变量。此处使用的 browser预定义了浏览器
    环境中的全局变量，es6启用除了modules 以外的所有ECMAScript 6特性（该选项会自动设置ecmaVersion解析器选项为6)。

2. **globals**：脚本在执行期间访问的额外的全局变量。也就是env环境中中未预定义，但我们又需要使用的全局变量

3. **extends**：扩展，检测中使用的预定义的规则集合。

4. **rules**： 启用的规则及其各自的错误级别，会合并extends中的同名规则，定义冲突时优先级更高。

5. **parserOotions**：ESLint允许你指定你想要支持的JavaScript 语言选项。

   **ecmaFeatures 是个对象，表示你想使用的额外的语言特性，这里 jsx代表启用JSX**。

   **ecmaVersion用来指定支持的ECMAScript版本**。默认为5，即仅支持es5，你可以使用6、7、8、9或10来指定你想要使用的ECMAScript 版本。你也可以用使用年份命名的版本号指定为2015(同6) ，2016(同7)，或2017(同8)或2018(同9)或2019(same as 10)。上面的env中启用了es6，自动设置了ecmaVersion解析器选项为6。

   **plugins**：是一个npm包，通常输出eslint 内部未定义的规则实现。rules和extends中定义的规则，并不都在eslint内部中有实现。比如 extends中的plugin:react/recommended，其中定义了规则开关和等级，但是这些规则如何生效的逻辑是在其对应的件‘react'中实现的。



检查文件是否有错误

```
npx eslint ./src/app.js
```



#### 配合webpack

结合webpack的打包编译功能，可以实现eslint实时提示报错而不必等待命令行执行命令。

```
npm i eslint-webpack-plugin -D
```

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");

module.exports = {
  mode: "development",

  entry: "./src/app.js",

  plugin: [new HtmlWebpackPlugin(), new ESLintPlugin()],
};

```



### 1.5 git-hooks与husky

#### git-hooks

为了保证提交的代码符合规范，可以在上传代码时进行校验。常用husky来协助进行代码提交时的eslint校验。在使用husky之前，我们先来研究一下git-hooks。

```python
(base) D:\vscode\WebpackDemo\part-2\01-dev-config\04-esllint>cd .git

(base) D:\vscode\WebpackDemo\part-2\01-dev-config\04-esllint\.git>cd hooks

(base) D:\vscode\WebpackDemo\part-2\01-dev-config\04-esllint\.git\hooks> touch pre-commit
    
vim pre-commit
npx eslint ./src
# 配置自定义的git-hooks
git config core.hooksPath .mygithooks
```



#### husky

> Modern native Git hooks made easy

```js
// 第一步：安装
npm i husky -D

// 第二步 enable git-hook
px husky install
husky - Git hooks installed

// 第三步：配置脚本
"scripts": {
    "prepare": "husky install"
  },
      
// 创建hook
npx husky add .husky/pre-commit "npm test"
git add .husky/pre-commit
```





## 2. 模块与依赖

### 2.1 模块解析(resolve)

webpack通过**Resolvers实现了模块之间的依赖和引用**。

所引用的模块可以是来自应用程序的代码，也可以是第三方库。**resolver帮助webpack 从每个require/import 语句中，中，找到需要引入到 bundle 中的模块代码。当打包模块时, webpack使用enhanced-resolve来解析文件路径（webpack_resolver的代码实现很有思想, webpack基于此进行treeshaking）**



#### 模块路径解析规则

通过内置的enhanced-resolve，webpack 能解析三种文件路径:

- **绝对路径**：由于已经获得文件的绝对路径，因此不需要再做进一步解析。
- **相对路径**：这种情况下，使用 import或 require的资源文件所处的目录，被认为是上下文目录。**在import/require中给定的相对路径，enhanced-resolve会拼接此上下文路径，来生成模块的绝对路径(path.resolve(_dirname, RelativePath**）
- **模块路径**：即node_modules路径，在node_modules中寻找

   

可以给某个文件的路径起个别名

```js
// 此后@就指向了src
resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
```



自定义同名文件优先加载顺序

```js
// 按数组定义顺序加载
extensions: [".json", ".js"],
```



### 2.2 外部扩展

有时候我们为了减小bundle的体积，从而把一些不变的第三方库用cdn的形式引入进来，比如jQuery。

webpack 为此提供了externals的配置属性，可以配置外部扩展模块。



- 手动引入

  需要手动在html中添加对应的cdn链接script标签，然后在webpack.config.js中添加externals属性

```js
  externals: {
    // key: 与引用的包名一致
    // value: script标签加载的对象所暴露出来的值
    jquery: "jQuery",
  },

// app.js
import $ from "jquery";
console.log($);

// index.html
 <script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.6.3/jquery.js"></script>
```



- webpack自动引入

```js
// 定义外部资源引入的形式
  externalsType: "script",
  externals: {
    // key: 与引用的包名一致
    // value: script标签加载的cdn对象所暴露出来的值
    jquery: [
      "https://cdn.bootcdn.net/ajax/libs/jquery/3.6.3/jquery.js",
      // 第二个参数为暴露的对象名
      "jQuery",
    ],
  },
```



### 2.3 依赖图

每当一个文件依赖另一个文件时，webpack会直接将文件视为依赖关系。这使得webpack可以获取非代码资源，如images，fonts等，并会它们作为依赖提供给应用程序。当webpack开始工作时，它会根据配置，从入口entry开始，webpack会递归地构建一个依赖关系图。这个依赖图包含着应用程序的每个模块，然后将所有模块打包为bundle（也就是output的配置项）



bundle分析工具，可视化打包产物的依赖图

webpack-bundle-analyzer：一个plugin和CLI工具，它将bundle 内容展示为一个便捷的、交互式、可缩放的树状图形式

```
npm i webpack-bundle-analyzer -D
```

```js
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
module.exports = {
  plugins: [new HtmlWebpackPlugin(), new BundleAnalyzerPlugin()],
};

```





## 3. 扩展功能

### 3.1 postCSS与CSS模块

PostCSS是一个用JavaScript 工具和插件转换CSS代码的工具。比如可以使用 Autoprefixer插件自动获取浏览器的流行度和能够支持的属性，并根据这些数据帮我们自动的为CSS规则添加前缀，将最新的CSS语法转换为大多数浏览器都能理解的语法。



#### postCSS

PosetCSS 与 Webpack 结合，需要安装 style-loader , css-loader , postcss-loader 三个loader：

```python
# autoprefixer 可以加载一些样式的前缀
# postcss-nested 可以写一些嵌套样式
npm i style-loader css-loader postcss-loader autoprefixer postcss-nested -D
```

**在postcss.config.js中配置相关的css插件**

```
module.exports = {
  plugins: [require("autoprefixer")],
};
```

**package.json中约定浏览器版本：**

```json
  // 全球浏览器的使用率大于1%，浏览器最近的两个版本
  "broeserslist": [
    "> 1%",
    "last 2 versions"
  ]
```



#### css模块

解决css命名冲突

```js
// webpack.config.js
module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              // 开启css模块
              modules: true,
            },
          },
          "postcss-loader",
        ],
      },
    ],
  },
```

```js
import "./app.css";

const div = document.createElement("div");
div.textContent = "hello";
div.classList.add("box");
document.body.appendChild(div);

```



**此时，会将类名生成为一个唯一的哈希值去唯一标识类名，而元素中的类名还是原始定义的类名，导致样式无法生效。**

```html
<style>
body {
  background-color: red;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}

   body .jiiwoQM4RBXA8T7kGVrB {
    width: 100px;
    height: 100px;
    background-color: yellow;
  }
</style>

<body>
	<div class="box">hello</div>
</body>

```



所以需要将css作为模块导入，来保证

```js
import styles from "./app.css";

const div = document.createElement("div");
div.textContent = "hello";
div.classList.add(styles.box);
document.body.appendChild(div);
```



#### 部分开启css模块

全局样式可以使用 .global前缀，如：

- *.global.css普通模块，直接引入文件即可使用
- *.css css module 模式，需要按模块导入import styles from "./app.css"

```js
// CSS module
{
        // 不带global的css文件
        test: new RegExp(`^(?!.*\\.global).*\\.css`),
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                // 允许配置生成的本地标识符(ident),开发环境使用 '[path][name]__[local]',生产环境使用 '[hash:base64]'
                // [local] 占位符包含原始的类。
                localIdentName: "[hash:base64:6]",
              },
            },
          },
          "postcss-loader",
        ],
        exclude: [path.resolve(__dirname, "node_modules")],
      },
      // 普通模式
      {
        test: new RegExp(`^(.*\\.global).*\\.css`),
        use: ["style-loader", "css-loader", "postcss-loader"],
        exclude: [path.resolve(__dirname, "node_modules")],
      },
```

app.global.css

```css
.word {
  font-size: 30px;
}
```

app.js

```js
import styles from "./app.css";
import "./app.global.css";

const div = document.createElement("div");
div.textContent = "hello";
div.classList.add(styles.box);
div.classList.add("word");
document.body.appendChild(div);
```



### 3.2 web works

 **web works提供了后台处理线程的API，可以用来完成复杂耗时的工作，把它后台处理，让js线程不阻塞UI线程的渲染，避免浏览器被阻塞。**webpack5内置了打包work.js的功能，会打包出“src_work_js.js"的文件

work.js

```js
// 接受主线程发送的信息
self.onmessage = (message) => {
  self.postMessage({
    answer: 1111,
  });
};

```

app.js

```js
const worker = new Worker(new URL("./work.js", import.meta.url));

worker.postMessage({
  question: "lucky number?",
});

worker.onmessage = (message) => {
  console.log(message.data.answer);
};

```



### 3.3 TypeScript

webpack工程化环境中继承TS

```
npm i typescript ts-loader @types/lodash -D
```

接下来我们需要在项目根目录下添加一个ts的配置文件---—-tsconfig.json，我们可以用ts自带的工具来自动化生成它

```
npx tsc -init
```

生成了一个tsconfig.json，里面注释掉了绝大多数配置

```json
"rootDir": "./src" /* Specify the root folder within your source files. */,
"outDir": "./dist" /* Specify an output folder for all emitted files. */,
```

webpack.config.js

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
module.exports = {
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    // 自定义解析顺序，优先解析ts
    extensions: [".ts", ".js"],
  },
};

```



## 4. 多页面应用

### 4.1 entry配置

- 基础使用

  ```js
  entry: "./src/app.js“
  ```

- **将多个不相关文件打包到一个bundle中，数组顺序即打包顺序**

  除了加载本地的模块，还可以加载node_modules下的第三方模块

  ```js
  entry: ["./src/app.js", "./src/app2.js","lodash"],
  ```

- 多入口

  **此时，如果main里的文件引用了lodash，lodash会被重复打包，需要dependOn声明依赖**

  ```js
  entry: {
      main: ["./src/app.js", "./src/app2.js"],
      lodash: "lodash",
    },
  ```

- 多入口，声明依赖

  **dependOn指向的是entry里定义的键名而不是值**

  ```js
  entry: {
      main: {
        import: ["./src/app.js", "./src/app2.js"],
        // main内部打包的文件可能依赖于lodash，而lodash已经被单独打包，不需要再main再打包
        dependOn: "lodash",
      },
      lodash: "lodash",
    },
  ```



### 4.2 自定义html模版配置

#### html-webpack-plugin

```js
plugins: [
    new HtmlWebpackPlugin({
      // 可以将index.html中的内容在webpack.config.js中定义
      title: "SPA APP",
      template: "./index.html",
      // 定义打包文件的引入位置
      inject: "body",
    }),
  ],
```

index.html

```html
<title><%= htmlWebpackPlugin.options.title %></title>
```

htmlWebpackPlugin插件提供了对象htmlWebpackPlugin，可以在html中读取到webpack.config.js中配置的值



#### 多页面载入不同chunk

通过chunks属性自定义需要引入的chunk

```js
plugins: [
    new HtmlWebpackPlugin({
      // chunk即entry中配置的项,默认会引入全部chunk
      chunks: ["main"],
    }),
  ],
```



### 4.3 多页面环境搭建

**默认new 一个HtmlWebpackPlugin，会将所有的entry生成到一个html文件中，根据chunks属性对应加载chunk**

**如果不指定chunks，默认两个HtmlWebpackPlugin对应生成的html会加载全部从chunk**。

new多个HtmlWebpackPlugin，指定生成不同的模板

```js
plugins: [
    new HtmlWebpackPlugin({
      // 可以将index.html中的内容在webpack.config.js中定义
      title: "SPA APP",
      template: "./index.html",
      // 定义打包文件的引入位置
      inject: "body",
      // chunk即entry中配置的项,默认会引入全部chunk
      chunks: ["main", "lodash"],
      filename: "chanel1/index.html",
      publicPath: "http://www.a.com/",
    }),

    new HtmlWebpackPlugin({
      template: "./index2.html",
      inject: "body",
      chunks: ["main2", "lodash"],
      filename: "chanel2/index2.html",
      publicPath: "http://www.b.com/",
    }),
  ],
```





## 5. Tree Shaking

### 5.1 定义

**Tree shaking指移出js上下文中未使用的代码**，这些未引用代码称为dead code。它主要依赖于ES6的静态结构特性，如import和export

**webpack2内置了ES6模块和未使用模块检测能力，webpack4继续继承了这些能力。通过webpack.config.js的side effects属性，向compiler提示，表明哪些模块是纯ES6模块，来安全地删除文件中未使用的模块。**只会保留使用了的代码，即使导入未引用也会被删除。

```js
// webpack.config.js
optimization: {
    usedExports: true,
  },
```



### 5.2 sideEffects

webpack是无法100%进行tree shaking的，有些代码只要导入就会对应用产生影响，如全局的样式表等**。这些文件是有副作用的，Webpack认为具有副作用的文件是不应该进行tree shaking的**。在不知道哪些文件有副作用的时候，是不能进行打包的。

webpack4视所有代码是有副作用的，免于删除一些必要的文件，也就导致Webpack默认是不进行tree shaking的。

**webpack5默认是进行tree shaking的，需要sideEffects告知哪些代码是具有副作用的，它的可以为true，false或数组。**

- "sideEffects": true，所有的代码都是有副作用的
- "sideEffects": false，所有的代码都是没有副作用的
- "sideEffects": []，可以自定义哪些文件是有副作用的

```json
// package.json
"sideEffects": [
    "*.css",
    "*.global.js"
  ],
```



## 6. 渐进式网络应用程序PWA

### 6.1 非离线环境下运行

渐进式网络应用程序PWA，是一种可以提供类似原生应用程序体验的web apps，即在浏览器端实现类似原生应用程序的体验。最主要的功能是在离线环境下继续运行的功能。

通常情况下，真正的用户是通过网络访问web app;用户的浏览器会与一个提供所需资源（例如,.html， .js 和 .css文件)的 server通讯。

我们通过搭建一个拥有更多基础特性的server来测试这种离线体验。这里使用http-server package，还要修改package.json的scripts

```
npm i http-server -D
```

package.json

```json
"scripts": {
    "start": "http-server dist"
  },
```



webpack-dev-server 创建的服务是在线的，启动时，编译的代码都放在内存里，修改代码无法将代码重新打包生成到dist里。需要开启writeToDist属性，让http-server处理./dist的文件

```js
devServer: {
    devMiddleware: {
      writeToDist: true,
    },
  },
```



如果你之前没有操作过，先得运行命令npm run build 来构建你的项目。然后运行命令npm start



### 6.2 workbox

安装插件

```
npm i workbox-webpack-plugin -D
```

webpack.config.js

```js
const WorkboxPlugin = require("workbox-webpack-plugin");
module.exports = {
  plugins: [
    new WorkboxPlugin.GenerateSW({
      // 快速启动 ServiceWorkers
      clientsClaim: true,
      // 不允许遗留旧的ServiceWorkers
      skipWaiting: true,
    }),
  ],
};

```

现在打包会生成service-worker.js和workbox.哈希值.js文件，前者是主文件，后者是被引用的文件。当前已经创建了work box，但还未在浏览器注册service worker，故还无法使用。



### 6.3 注册service worker

index.js

```js
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
```





## 7. shimming 预置依赖

### 7.1 shimming预置全局变量

webpack compiler能够识别ES6的模块，然而第三方的库可能会去引用一些全局的依赖，这些库可能会创建一些导出的全局变量。

shim另一个极其有用的作用，利用polyfill扩展能力支持更多用户时，按需加载。

出于演示目的，例如把这个应用程序中的模块依赖，改为一个**全局变量依赖**。要实现这些，我们需要使用 ProvidePlugin插件。

**使用ProvidePlugin后，能够在Webpack编译的每个模块中，通过访问一个变量来获取一个package。如果webpack看到模块中引用这个变量，就会在最终的bundle中引入给定的package。**

```js
const webpack = require("webpack");
module.exports = {
  plugins: [
    new HtmlWebpackPlugin(),
    // 设置全局模块
    new webpack.ProvidePlugin({
      _: "lodash",
    }),
  ],
};

```

**此时lodash就不用import，可以作为全局模块直接使用了**



### 7.2 细粒度 shimming 

一些遗留模块依赖的 this 指向的是 window对象。当模块运行在CommonJS上下文中，这将会变成一个问题，也就是说此时的 this 指向的是module.exports。在这种情况下，你**可以通过使用imports-loader 覆盖this 指向**

```
npm i imports-loader -D
```

```js
module: {
    rules: [
      {
        test: require.resolve("./src/index.js"),
        // this指向了window
        use: "imports-loader?wrapper=window",
      },
    ],
  },
```



### 7.3 全局expots

某个library创建出一个全局变量，其他consumer使用这个变量。可以在项目配置中，添加一个小模块来演示说明

```
npm i exports-loader -D
```

globals.js指的是外部的文件，一般不知道是如何导出的，所以在配置文件中去定义一些导出，从而可以单独地使用一些模块

```js
{
        test: require.resolve("./src/globals.js"),
        // 按照commonjs的方式导出一个file变量
        // multiple表示导出一个key-value类型的
        // helpers.parse为值，parse为键
        use: "exports-loader?type=commonjs&exports=file,multiple|helpers.parse|parse",
      },
```



### 7.4 polyfills

有很多方法来加载 polyfill。例如，想要引入ababel/polyfill 我们只需如下操作:

```
npm install @babel/polyfill -S
```

然后，使用import将其引入到我们的主bundle文件:

```js
import "@babel/polyfill";
console.log(Array.from([1，2，3]，x→x+x))
```

注意，**这种方式优先考虑正确性，而不考虑 bundle体积大小。为了安全和可靠,polyfill/shim必须运行于所有其他代码之前，而且需要同步加载，或者说，需要在所有polyfill/shim 加载之后，再去加载所有应用程序代码。**社区中存在许多误解，即现代浏览器”不需要“polyfill，或者polyfill/shim仅用于添加缺失功能。实际上，**它们通常用于修复损坏实现**，即使是在最现代的浏览器中，也会出现这种情况。因此，**最佳实践仍然是，不加选择地和同步地加载所有 polyfill/shim，尽管这会导致额外的 bundle体积成本**。



### 7.5 优化polyfill

**不建议使用import ababel/polyfilll。因为这样做的缺点是会全局引入整个polyfill包。不但包的体积大,而且还会污染全局环境。**

babel-preset-env package通过 browserslist 来转译那些你浏览器中不支持的特性。**这个preset使用useBuiltIns选项，默认值是 false，这种方式可以将全局 babel-polyfill导入，改进为更细粒度的import格式:**

```
npm i babel-loader @babel/core @babel/preset-env core-js@3 -D 
```

```js
{
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  // browserList里定义的内容
                  targets: ["last 1 version", "> 1%"],
                  useBuiltIns: "usage",
                  corejs: 3,
                },
              ],
            ],
          },
        },
      },
```

此时就无需在代码中import @babel/polyfill了



## 8. Library

### 8.1 构建library

webpack除了打包应用程序外，还可以用来打包JavaScript Library。

#### script标签

```js
module.exports = {
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "mylib.js",
    library: "mylib",
  },
};
```

```html
  <body>
    <!-- mylib会绑在window对象上 -->
    <script src="../dist/mylib.js"></script>
    <script>
      console.log(mylib.add(5, 6));
    </script>
  </body>
```

然而它只能通过被script标签引用而发挥作用，它不能运行在CommonJS、AMD、Node.,js等环境中。



#### CommonJs module

```js
module.exports = {
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "mylib.js",
    library: {
      name: "mylib",
      type: "commonjs",
    },
  },
};
```

```js
const webpackNumbers = require( 'webpack-numbers ' );
webpackNumbers.wordToNum( 'Two '); 
```

​		

#### AMD module

```js
require( [ ' webpackNumbers ']，function (webpackNumbers) {
    webpackNumbers.wordToNum( 'Two ');
}
// 或
<script type="module">
      import { add } from "../dist/mylib.js";
      console.log(add(2, 3));
</script>
```

```js
module.exports = {
  experiments: { outputModule: true },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "mylib.js",
    library: {
      //   name: "mylib",
      // 当type=module时，name是不能设置的
      type: "module",
    },
  },
};
```



#### UMD

可以支持script标签，commonJS和AMD。对于ES module的的支持尚不完善

```js
module.exports = {
  //   experiments: { outputModule: true },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "mylib.js",
    library: {
      name: "mylib",
      // 当type=module时，name是不能设置的
      type: "umd",
    },
    // 用全局的this代替self
    globalObject: "globalThis",
  },
};
```



### 8.2 构建轮子

在dist下就打包好了webpack-number.js

```js
module.exports = {
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "webpack-numbers.js",
    library: {
      name: "webpackNumbers",
      // 当type=module时，name是不能设置的
      type: "umd",
    },
    // 用全局的this代替self
    globalObject: "globalThis",
  },
  externals: {
    lodash: {
      commonjs: "lodash",
      commonjs2: "lodash",
      amd: "lodash",
      root: "_",
    },
  },
};
```



### 8.3 发布npm-package

1. 登录https://www.npmjs.com/，打开我的packages

2. 在命令行输入，确保连接的是官网 https://registry.npmjs.org/

   ```
   npm config get registry
   
   // 修改源地址
   npm config set registry http://registry.npmjs.org 
   ```

   注：淘宝镜像为https://registry.npm.taobao.org/

3. 登录账户，跳转官网登录

   ```
   npm adduser
   ```

4. 修改package.json的入口为打包后的入口

   ```json
   {
     "main": "dist/webpack-numbers.js",
   }
   ```

5. 命令行输入，发布包

   ```
   npm publish
   ```

   注：package.json的version需要高于上一次的版本，初次发包版本要高于1.0.0，否则会报错：400 Bad Request - PUT https://registry.npmjs.org/10-library - Cannot publish over previously published version "1.0.0".



## 9. module federation模块联邦

模块联邦可以通过webpack5实现使用其他模块的资源

**remotes：引用的外部模块资源**，key是引用的模块名（即模块的name），值是 name+访问地址

**exposes：向外暴露的资源模块**，key是访问时引用的路径，值是当前模块下的路径



search-webpack.config.js

```js
const { ModuleFederationPlugin } = require("webpack").container;
module.exports = {
  plugins: [
    new HtmlWebpackPlugin(),
    new ModuleFederationPlugin({
      name: "search",
      filename: "remoteEntry.js",
      exposes: {},
      remotes: {
        nav: "nav@http://localhost:3003/remoteEntry.js",
        home: "home@http://localhost:3001/remoteEntry.js",
      },
    }),
  ],
};

```

nav- webpack.config.js

```js
const { ModuleFederationPlugin } = require("webpack").container;
module.exports = {
  plugins: [
    new HtmlWebpackPlugin(),
    new ModuleFederationPlugin({
      // 别的组件需要通过name访问当前组件
      name: "nav",
      filename: "remoteEntry.js",
      remotes: {},
      exposes: {
        // key:拼接路径
        "./Header": "./src/Header.js",
      },
      // 共享第三方模块，会被单独打包
      shared: {},
    }),
  ],
};

```



search-index.js

**引用模块联邦下的其他模块需要异步引入，即使用import()函数导入，nav为定义的模块名，/Header是nav中expopes属性定义的key值**

```js
Promise.all([import("nav/Header"), import("home/HomeList")]).then(
  ([{ default: Header }, { default: HomeList }]) => {
    document.body.appendChild(Header());
    document.body.innerHTML += HomeList(3);
  }
);

```



## 10. 提升构建性能

### 10.1 通用构建优化

webpack性能提升通常指

- 通过webpack提升项目性能，如首屏到达时间

- 提高webpack构建编译性能，提高打包速度，降低打包时间

  

webpack5的优化包括三个环境：

#### 通用环境

1. **更新到最新版本**，包括wabpack，nodeJs，npm，yarn。较新的版本能够构建更高效的模块树，以及提高解析速度。

2. **将loader应用于最少数量的必要模块**，如include指定目录，exclude排除不需要的目录

3. **引导bootstrap**，每个额外的loader和plugin都有其启动时间，尽可能少使用工具。

4. **解析**，以下可以提升解析速度

   - 减少resolve.modules，resolve.extensions，resolve.mainFiles，resolvedescriptionFiles中条目数量，它们会增加文件系统的调用次数

   - 如果不适用symlinks（如npm link或yarn link），可以设置resolve.symlinks:false

   - 如果使用自定义resolve plugin规则，并且没有指定context上下文，可以设置resolve。cacheWithContext: false

5. **小即快：较少编译结果的整体大小，尽量保持chunk体积小**

   - 使用数量更少/体积更小的library
   - 在SPA中使用SplitChunksPlugin
   - 在SPA中使用SplitChunksPlugin，并开启saync模式
   - 移除未使用代码
   - 只编译当前正在开发的代码

6. **持久化缓存**

   在webpack配置中使用cache选项，使用package.json中的“postinstall"清除缓存目录

   将cache类型设置为内存或文件系统，memory选项告诉webpack在内存中存储缓存，不允许额外配置

   ```js
   module.exports = {
       cache: {
           type: "memory"
       }
   }
   ```

7. **自定义plugin/loader**

   要对它们进行概要分析，以免引入性能问题。

8. **process plugin**

   将process plugin从webpack中删除，可以缩短构建时间。注：process plugin可能不会为快速构建提供太多价值。

9. **dll**

   ddl是一个动态链接的技术，使用dllPlugin为更改不频繁的代码生成单独的编译结果，可以提升编译速度，尽管增加了构建过程的复杂程度。

   webpack.config.js

   ```js
   const webpack = require("webpack");
   module.exports = {
     plugins: [
       new webpack.DllReferencePlugin({
         manifest: path.resolve(__dirname, "./dll/manifest.json"),
       }),
     ],
   };
   
   ```

   webpack.dll.config.js

   ```js
   const path = require("path");
   const webpack = require("webpack");
   module.exports = {
     mode: "production",
     // 配置的是node_modules里安装的第三方的包
     entry: {
       jquery: ["jquery"],
     },
     output: {
       filename: "[name].js",
       path: path.resolve(__dirname, "dll"),
       library: "[name]_[hash]",
     },
     plugins: [
       new webpack.DllPlugin({
         name: "[name]_[hash]",
         path: path.resolve(__dirname, "dll/manifest.json"),
       }),
     ],
   };
   
   ```

   package.json

   ```json
   "scripts": {
       "dll": "webpack --config ./webpack.dll.config.js"
     },
   ```

   **执行脚本，会生成一个dll文件，下面包括打包好的jquery，license文件和manifest文件。此后执行npx webpack，打包时间会被缩短，manifest文件会告知已经打包好的文件，无需再次打包，使得打包产物体积缩小，直接引用打包好的ddl目录下的文件即可。**

   ```
   npm run dll
   ```

   

   **以上只是提供了构建效率，实际上打包的html中只引用了打包好的main.js，并未引入dll下的打包产物。还需要引入dll下的产物。**

   安装plugin

   ```
   npm i add-asset-html-webpack-plugin -D
   ```

   ```js
   const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");
   module.exports = {
     plugins: [
       new AddAssetHtmlPlugin({
         filepath: path.resolve(__dirname, "./dll/jquery.js"),
         publicPath: "./",
       }),
     ],
   };
   ```

10. **worker pool**（多线程打包）

    thread-loader可以将非常消耗资源的loader分流给一个work pool。**thread-loader启动开销较大，只适合非常耗时的loader**

    可以将worker pool定义在loader前面，把loader放入某个worker pool中运行。

    **不要使用太多的worker，因为Node.js的 runtime和loader都有启动开销。最小化 worker和 main process(主进程)之间的模块传输。进程间通讯(IPC, inter process communication)是非常消耗资源的**

    ```
    npm i thread-loader -D
    ```

    ```js
    module.exports = {
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
              {
                loader: "babel-loader",
                options: {
                  presets: ["@babel/preset-env"],
                },
              },
              {
                loader: "thread-loader",
                options: {
                  workers: 2,
                },
              },
            ],
          },
        ],
      },
    };
    ```



#### 开发环境

1. **增量编译**

   使用webpack的watch mode（监听模式），而不使用其他工具来watch文件和调用webpack。内置的watch mode会记录时间戳并将此信息传递给compilation以使缓存失效。

   某些配置环境中，watch mode会回退到poll mode（轮询模式）。监听许多文件会导致CPU大量负载。在这些情况下，可以使用watchOptions.poll 来增加轮询的间隔时间。

2. **在内存中编译**

   下面几个工具通过咋内存中（而不是写入磁盘）编译和serve资源来提高性能

   - webpack-dev-server
   - webpack-hot-middleware
   - webpack-dev-middleware

3. **stats.toJson加速**

   webpack4默认使用stats.toJson()输出大量数据，除非在增量步骤中做必要的统计，否则请避免获取stats对象的部分内容。

   webpack-dev-server 在v3.1.3以后的版本，包含一个重要的性能修复，即最小化每个增量构建步骤中，从stats对象获取的数据量。

4. **devtool**

   需要注意的是不同的devtool设置，会导致性能差异。

   - eval：性能最好，但不能转译代码
   - cheap-source-map：较差一点的map质量
   - eval-source-map：增量编译

   **在大多数情况下，最佳选择是eval-cheap-module-source-map**

5. **避免在生产环境才用到的工具**

   某些utility, plugin和loader都只用于生产环境。例如，在开发环境下使用TerserPlugin 来 minify(压缩)和mangle(混淆破坏)代码。通常在开发环境下，应该排除以下这些工具∶

   -  TerserPlugin
   - [fullhash]/[chunkhash]/[contenthash].
   - AggressiveSplittingPlugin
   - .AggressiveMergingPlugin
   - ModuleConcatenationPlugin

6. **最小化entry chunk**

   Webpack只会在文件系统中输出已经更新的chunk。某些配置选项（HMR，output.chunkFilename 的[name]/[chunkhash]/[contenthash]，[fullhash]）来说，除了对已经更新的 chunk无效之外，对于entry chunk 也不会生效。

   确保在生成entry chunk时，尽量减少其体积以提高性能。以下配置为运行时代码创建了一个额外的chunk，所以生成代价较低:

   ```js
   module.exports = {
       optimization:{
           runtimeChunk: true,
       }
   }
   ```

7. **避免额外的优化步骤**

   Webpack通过执行额外的算法任务，来优化输出结果的体积和加载性能。这些优化适用于小型代码库，但是在大型代码库中却非常耗费性能

   ```js
   modules.exports = {
       optimizations: {
           remoAvailabelModules: false,
           remoEmptyChunks: false,
           splitChunks: false,
       }
   }
   
   ```

8. **输出结果不携带路径信息**

   Webpack 会在输出的bundle 中生成路径信息。然而，在打包数干个模块的项目中，这会导致造成垃圾回收性能压力。

   ```js
   module.exports = {
       output: {
           pathinfo: false,
       }
   }
   ```

9. **typescript loader**

   可以为loader传入transpileOnly选项，以缩短使用ts-loader时的构建时间。使用此选项，会关闭类型检查。如果要再次开启类型检查，使用ForkTsCheckerWebpackPlugin。使用此插件会将检查过程移至单独的进程，可以加快TypeScript 的类型检查和 ESLint插入的速度。

   ```js
   {
               test: /\.tsx$/,
               use: [
                 {
                   loader: "ts-loader",
                   options: {
                     transpileOnly: true,
                   },
                 },
               ],
             },
   ```



#### 生产环境

1. **不启用source-map**

   source-map相当消耗资源

# React Playground
## 1. 项目介绍
React Playground 是一个在线编辑器，可以在线编辑、编译、运行 React 代码，支持 TypeScript、Less 等多种语言，支持代码分享、主题切换等功能
## 2. 项目启动
```bash
pnpm install
pnpm dev
```
## 3. 项目亮点
- 用 @monaco-editor/react 实现了网页版 typescript 编辑器，并且实现了自动类型导入
- 通过 @babel/standalone 实现了文件编译，并且写了一个 babel 插件实现了 import 的 source 的修改
- 通过 blob url 来内联引入其他模块的代码，通过 import maps 来引入 react、react-dom 等第三方包的代码
- 通过 iframe 实现了预览功能，并且通过 postMessage 和父窗口通信来显示代码运行时的错误
- 基于 css 变量 + context 实现了主题切换功能
- 通过 fflate + btoa 实现了文件内容的编码、解码，可以通过链接分享代码
- 通过 Performance 分析性能问题，并通过 Web Worker 拆分编译逻辑到 worker 线程来进行性能优化，消除了 long lask
- 通过 less.js 修改版实现了 less 在 Web Worker 中的编译
## 4. 项目遇到的问题
### 1. less.js的支持问题
#### 问题描述
less.js 本身不支持 Web Worker，因为 less.js 依赖于 window 对象，而 Web Worker 中没有 window 对象
#### 解决方案
1. 把 less.js 的执行步骤放在主线程中执行，然后通过 postMessage 传递编译结果（在主进程中执行）
2. 在后端编译 less 文件，然后传递编译结果给前端（前端项目不可取）
3. 尝试删除 less.js 中与本项目不必要的内容，本项目中仅需 render 过程，所以删除了与render无关的代码，在compile之前统一处理less，将less转为css后做常规处理
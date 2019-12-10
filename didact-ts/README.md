# Didact-ts


参考文章[Build your own React](https://pomb.us/build-your-own-react/)

* jsx注解实现自定义jsx解析
```js
/** @jsx Didact.createElement */
```
这好像是利用了react的jsx解析器，然后做一些自定义；如何从0开始配置jsx呢？

* requestIdleCallback
* [window.requestIdleCallback()](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback) 在浏览器空闲时执行
  * [window.requestAnimationFrame](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame) 下次重绘前调用

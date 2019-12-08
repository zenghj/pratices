export {}

// 修改"全局声明"必须在模块内部, 所以至少要有 export{}字样
// https://juejin.im/post/5dcbc9e2e51d451bcb39f123
declare global {
  interface Window {
    requestIdleCallback
  }
}
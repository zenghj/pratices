# v-prefetch

Prefetch dynamic imported route components when the route link target gets into the viewport.

## usage

```js
import Vue from 'vue'
import VPrefetch from 'v-prefetch'
import router from './router'

Vue.directive(VPrefetch.name, VPrefetch.getInstance({router}))
```

```html
<!-- SomeComponent组件进入视口时开始预加载“/about”路由组件 -->
<SomeComponent v-prefetch="{
    to: '/about'
  }"
></SomeComponent>
```

There is an [example](./example)
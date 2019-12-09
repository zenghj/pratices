import Vue,  { ComponentOptions, PluginFunction, AsyncComponent } from 'vue'
import {default as VueRouter, Location, Route} from 'vue-router'
import { supportIntersectionObserver } from'./utils'

type Component = ComponentOptions<Vue> | typeof Vue | AsyncComponent

interface VPrefetchBinding {
  value: {
    to: RouteConfig;
    prefetchFiles: Array<String>;
      // timeout: Number;
  }
}
interface BindOptions {
  el,
  binding: VPrefetchBinding,
  vnode,
}

// https://stackoverflow.com/questions/41385059/possible-to-extend-types-in-typescript
type PrefetchComponent = Component & {
  _vPrefetched: Boolean
}

type RouteConfig = String | Location | Route

class PrefetchDelegate {
  obeserver: IntersectionObserver;
  prefetched: Boolean;
  bindOptions: BindOptions;
  router: VueRouter;

  constructor(router, bindOptions:BindOptions) {
    this.router = router
    this.prefetched = false;
    this.bindOptions = bindOptions;
    this.obeserver = supportIntersectionObserver && new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.prefetch()
        }
      })
    })
    this.obeserver.observe(bindOptions.el)
  }

  prefetch() {
    if (this.prefetched) return;
    this.prefetched = true;
    this.prefetchRoute();
    // this.prefetchFiles();
    this.destroy();
  }
  resolveRoute() {
    return this.bindOptions.binding.value.to;
  }
  prefetchRoute() {
    if (this.router) {
      const route = this.resolveRoute()
      const Components = this.router.getMatchedComponents(
        /* todo 联合类型传参类型问题*/
        // this.resolveRoute())
        <any>route)
        .filter((Component:PrefetchComponent) => typeof Component === 'function' &&
          /* todo ts 报错问题*/
         !Component._vPrefetched);
      Components.forEach((Component:PrefetchComponent) => {
        if (typeof Component === 'function') {
          console.log('prefetch', route)
          ;(Component as Function)();
          Component._vPrefetched = true
        }
      })
    }
  }
  prefetchFiles() {
    console.warn(
      'this feature is not support now'
    )
  }
  destroy() {
    if (this.obeserver) {
      this.obeserver.unobserve(this.bindOptions.el)
      this.obeserver.disconnect()
      this.obeserver = null
    }
  }
  
}

export default {
  name: 'prefetch',
  getInstance({router}: {router:VueRouter}) {
    return {
      bind(el, binding:VPrefetchBinding, vnode) {
        // console.log('VPrefetch',this) // this是undefined
        const prefetchDelegate:PrefetchDelegate = new PrefetchDelegate(router, {el, binding, vnode})
        el._prefetchDelegate = prefetchDelegate
      },
      unbind(el,) {
        const prefetchDelegate:PrefetchDelegate = el._prefetchDelegate
        prefetchDelegate.destroy()
      }
    }
  }
}

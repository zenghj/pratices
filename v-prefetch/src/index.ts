import Vue from 'vue'
import {default as VueRouter, Location, Route} from 'vue-router'
import { supportIntersectionObserver } from'./utils'

interface VPrefetchBinding {
  value: {
    to: String | Location | Route;
    prefetchFiles: Array<String>;
      // timeout: Number;
  }
}
interface BindOptions {
  el,
  binding: VPrefetchBinding,
  vnode,
}
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
    this.prefetchFiles();
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
        .filter((Component) => typeof Component === 'function' &&
          /* todo ts 报错问题*/
         !Component._v_prefetched);
      Components.forEach((Component) => {
        if (typeof Component === 'function') {
          console.log('prefetch', route)
          Component();
          Component._v_prefetched = true
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

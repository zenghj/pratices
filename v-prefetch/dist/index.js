"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var PrefetchDelegate = /** @class */ (function () {
    function PrefetchDelegate(router, bindOptions) {
        var _this = this;
        this.router = router;
        this.prefetched = false;
        this.bindOptions = bindOptions;
        this.obeserver = utils_1.supportIntersectionObserver && new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    _this.prefetch();
                }
            });
        });
        this.obeserver.observe(bindOptions.el);
    }
    PrefetchDelegate.prototype.prefetch = function () {
        if (this.prefetched)
            return;
        this.prefetched = true;
        this.prefetchRoute();
        // this.prefetchFiles();
        this.destroy();
    };
    PrefetchDelegate.prototype.resolveRoute = function () {
        return this.bindOptions.binding.value.to;
    };
    PrefetchDelegate.prototype.prefetchRoute = function () {
        if (this.router) {
            var route_1 = this.resolveRoute();
            var Components = this.router.getMatchedComponents(
            /* todo 联合类型传参类型问题*/
            // this.resolveRoute())
            route_1)
                .filter(function (Component) { return typeof Component === 'function' &&
                /* todo ts 报错问题*/
                !Component._vPrefetched; });
            Components.forEach(function (Component) {
                if (typeof Component === 'function') {
                    console.log('prefetch', route_1);
                    Component();
                    Component._vPrefetched = true;
                }
            });
        }
    };
    PrefetchDelegate.prototype.prefetchFiles = function () {
        console.warn('this feature is not support now');
    };
    PrefetchDelegate.prototype.destroy = function () {
        if (this.obeserver) {
            this.obeserver.unobserve(this.bindOptions.el);
            this.obeserver.disconnect();
            this.obeserver = null;
        }
    };
    return PrefetchDelegate;
}());
exports.default = {
    name: 'prefetch',
    getInstance: function (_a) {
        var router = _a.router;
        return {
            bind: function (el, binding, vnode) {
                // console.log('VPrefetch',this) // this是undefined
                var prefetchDelegate = new PrefetchDelegate(router, { el: el, binding: binding, vnode: vnode });
                el._prefetchDelegate = prefetchDelegate;
            },
            unbind: function (el) {
                var prefetchDelegate = el._prefetchDelegate;
                prefetchDelegate.destroy();
            }
        };
    }
};

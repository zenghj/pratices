"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var VPrefetch = /** @class */ (function () {
    function VPrefetch() {
    }
    Object.defineProperty(VPrefetch, "instance", {
        get: function () {
            if (this._instance)
                return this._instance;
            this._instance = new VPrefetch();
            return this._instance;
        },
        enumerable: true,
        configurable: true
    });
    VPrefetch.prototype.bind = function (el, binding, vnode) {
        console.log(el, binding, vnode);
    };
    VPrefetch.dName = 'prefetch';
    return VPrefetch;
}());
exports.VPrefetch = VPrefetch;
console.log('d ver', vue_1.default.version);
exports.default = {
    VPrefetch: VPrefetch,
    install: function () {
        vue_1.default.directive(VPrefetch.dName, VPrefetch.instance);
    }
};

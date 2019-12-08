import { default as VueRouter, Location, Route } from 'vue-router';
interface VPrefetchBinding {
    value: {
        to: String | Location | Route;
        prefetchFiles: Array<String>;
    };
}
declare const _default: {
    name: string;
    getInstance({ router }: {
        router: VueRouter;
    }): {
        bind(el: any, binding: VPrefetchBinding, vnode: any): void;
        unbind(el: any): void;
    };
};
export default _default;

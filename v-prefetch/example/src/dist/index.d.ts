export declare class VPrefetch {
    private static _instance;
    static dName: string;
    static get instance(): VPrefetch;
    bind(el: any, binding: any, vnode: any): void;
}
declare const _default: {
    VPrefetch: typeof VPrefetch;
    install(): void;
};
export default _default;

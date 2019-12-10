interface DidactElementProps {
    children: DidactElement[];
    [propName: string]: any;
}
interface DidactElement {
    type: string;
    props: DidactElementProps;
}
declare function createElement(type: string, props: any, ...children: any[]): DidactElement;
declare function render(element: any, container: any): void;
declare function useState(initial: any): any[];
declare const Didact: {
    createElement: typeof createElement;
    render: typeof render;
    useState: typeof useState;
};
export default Didact;

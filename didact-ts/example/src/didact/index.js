"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
function createElement(type, props) {
    var children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        children[_i - 2] = arguments[_i];
    }
    return {
        type: type,
        props: __assign(__assign({}, props), { children: children.map(function (child) {
                return typeof child === "object"
                    ? child
                    : createTextElement(child);
            }) }),
    };
}
function createTextElement(text) {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: text,
            children: [],
        },
    };
}
function createDom(fiber) {
    var dom = fiber.type == "TEXT_ELEMENT"
        ? document.createTextNode("")
        : document.createElement(fiber.type);
    updateDom(dom, {}, fiber.props);
    return dom;
}
var isEvent = function (key) { return key.startsWith("on"); };
var isProperty = function (key) {
    return key !== "children" && !isEvent(key);
};
/**
 * 是否更新为新的值
 * @param prev
 * @param next
 */
var isNew = function (prev, next) { return function (key) {
    return prev[key] !== next[key];
}; };
/**
 * 是否不存在了，即需要执行删除操作
 * @param prev
 * @param next
 */
var isGone = function (prev, next) { return function (key) { return !(key in next); }; };
function updateDom(dom, prevProps, nextProps) {
    if (prevProps === void 0) { prevProps = {}; }
    if (nextProps === void 0) { nextProps = {}; }
    //Remove old or changed event listeners
    Object.keys(prevProps)
        .filter(isEvent)
        .filter(function (key) {
        return !(key in nextProps) ||
            isNew(prevProps, nextProps)(key);
    })
        .forEach(function (name) {
        var eventType = name
            .toLowerCase()
            .substring(2);
        dom.removeEventListener(eventType, prevProps[name]);
    });
    // Remove old properties
    Object.keys(prevProps)
        .filter(isProperty)
        .filter(isGone(prevProps, nextProps))
        .forEach(function (name) {
        dom[name] = "";
    });
    // Set new or changed properties
    Object.keys(nextProps)
        .filter(isProperty)
        .filter(isNew(prevProps, nextProps))
        .forEach(function (name) {
        dom[name] = nextProps[name];
    });
    // Add event listeners
    Object.keys(nextProps)
        .filter(isEvent)
        .filter(isNew(prevProps, nextProps))
        .forEach(function (name) {
        var eventType = name
            .toLowerCase()
            .substring(2);
        dom.addEventListener(eventType, nextProps[name]);
    });
}
function commitRoot() {
    deletions.forEach(commitWork);
    commitWork(wipRoot.child);
    currentRoot = wipRoot;
    wipRoot = null;
}
function commitWork(fiber) {
    if (!fiber) {
        return;
    }
    console.log(fiber);
    var domParentFiber = fiber.parent;
    while (!domParentFiber.dom) {
        domParentFiber = domParentFiber.parent;
    }
    var domParent = domParentFiber.dom;
    if (fiber.effectTag === "PLACEMENT" &&
        fiber.dom != null) {
        domParent.appendChild(fiber.dom);
    }
    else if (fiber.effectTag === "UPDATE" &&
        fiber.dom != null) {
        updateDom(fiber.dom, fiber.alternate.props, fiber.props);
    }
    else if (fiber.effectTag === "DELETION") {
        commitDeletion(fiber, domParent);
    }
    commitWork(fiber.child);
    commitWork(fiber.sibling);
}
function commitDeletion(fiber, domParent) {
    if (fiber.dom) {
        domParent.removeChild(fiber.dom);
    }
    else {
        commitDeletion(fiber.child, domParent);
    }
}
function render(element, container) {
    wipRoot = {
        dom: container,
        props: {
            children: [element],
        },
        alternate: currentRoot,
    };
    deletions = [];
    nextUnitOfWork = wipRoot;
}
/**
 * 下一个将要处理的Fiber
 */
var nextUnitOfWork = null;
var currentRoot = null;
var wipRoot = null;
var deletions = null;
function workLoop(deadline) {
    var shouldYield = false;
    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
        shouldYield = deadline.timeRemaining() < 1;
    }
    if (!nextUnitOfWork && wipRoot) {
        commitRoot();
    }
    window.requestIdleCallback(workLoop);
}
window.requestIdleCallback(workLoop);
function performUnitOfWork(fiber) {
    var isFunctionComponent = fiber.type instanceof Function;
    if (isFunctionComponent) {
        updateFunctionComponent(fiber);
    }
    else {
        updateHostComponent(fiber);
    }
    if (fiber.child) {
        return fiber.child;
    }
    var nextFiber = fiber;
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling;
        }
        nextFiber = nextFiber.parent;
    }
}
var wipFiber = null;
var hookIndex = null;
function updateFunctionComponent(fiber) {
    wipFiber = fiber;
    hookIndex = 0;
    wipFiber.hooks = [];
    var children = [fiber.type(fiber.props)];
    reconcileChildren(fiber, children);
}
function useState(initial) {
    var oldHook = wipFiber.alternate &&
        wipFiber.alternate.hooks &&
        wipFiber.alternate.hooks[hookIndex];
    var hook = {
        state: oldHook ? oldHook.state : initial,
        queue: [],
    };
    var actions = oldHook ? oldHook.queue : [];
    actions.forEach(function (action) {
        hook.state = action(hook.state);
    });
    var setState = function (action) {
        hook.queue.push(action);
        wipRoot = {
            dom: currentRoot.dom,
            props: currentRoot.props,
            alternate: currentRoot,
        };
        nextUnitOfWork = wipRoot;
        deletions = [];
    };
    wipFiber.hooks.push(hook);
    hookIndex++;
    return [hook.state, setState];
}
function updateHostComponent(fiber) {
    if (!fiber.dom) {
        fiber.dom = createDom(fiber);
    }
    reconcileChildren(fiber, fiber.props && fiber.props.children);
}
/**
 * 遍历子节点，确定子节点的增删改操作
 * @param wipFiber
 * @param elements
 */
function reconcileChildren(wipFiber, elements) {
    if (elements === void 0) { elements = []; }
    var index = 0;
    var oldFiber = wipFiber.alternate && wipFiber.alternate.child;
    var prevSibling = null;
    while (index < elements.length ||
        oldFiber != null) {
        var element = elements[index];
        var newFiber = null;
        var sameType = oldFiber &&
            element &&
            element.type == oldFiber.type;
        if (sameType) {
            newFiber = {
                type: oldFiber.type,
                props: element.props,
                dom: oldFiber.dom,
                parent: wipFiber,
                alternate: oldFiber,
                effectTag: "UPDATE",
            };
        }
        // element存在，则为替换旧节点
        if (element && !sameType) {
            newFiber = {
                type: element.type,
                props: element.props,
                dom: null,
                parent: wipFiber,
                alternate: null,
                effectTag: "PLACEMENT",
            };
        }
        // element不存在，则为删除旧节点，将需要删除的旧节点收集到deletions
        if (oldFiber && !sameType) {
            oldFiber.effectTag = "DELETION";
            deletions.push(oldFiber);
        }
        if (oldFiber) {
            oldFiber = oldFiber.sibling;
        }
        if (index === 0) {
            wipFiber.child = newFiber;
        }
        else if (element) {
            prevSibling.sibling = newFiber;
        }
        prevSibling = newFiber;
        index++;
    }
}
var Didact = {
    createElement: createElement,
    render: render,
    useState: useState,
};
exports.default = Didact;

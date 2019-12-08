"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inBrowser = typeof window !== 'undefined';
exports.supportIntersectionObserver = exports.inBrowser && window.IntersectionObserver;

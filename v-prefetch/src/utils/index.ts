export const inBrowser = typeof window !== 'undefined'
export const supportIntersectionObserver =
  inBrowser && window.IntersectionObserver
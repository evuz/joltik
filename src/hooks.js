import { Render, updateElement } from "./render";

const stack = [];
const buckets = new Map();

export function dispatcherBuilder(component) {
  const fn = component.type;
  if (fn.__isDispatcher__) {
    return fn;
  }

  const d = dispatcher;
  d.__isDispatcher__ = true;
  d.__component__ = component;

  return d;

  function dispatcher(...args) {
    stack.push(dispatcher);
    const bucket = getCurrentBucket();
    bucket.currentHook = 0;
    try {
      return fn(...args);
    } finally {
      stack.pop();
    }
  }
}

export function useState(initialValue) {
  const bucket = getCurrentBucket();
  const indexHook = bucket.currentHook;
  bucket.hooks[bucket.currentHook] =
    bucket.hooks[bucket.currentHook] === undefined
      ? initialValue
      : bucket.hooks[bucket.currentHook];

  function setState(newVal = null) {
    bucket.hooks[indexHook] = newVal;
    updateElement(
      bucket.__dispatcher.__node__.parentNode,
      bucket.__dispatcher.__component__,
      bucket.__dispatcher.__currentElement__
    );
  }
  return [bucket.hooks[bucket.currentHook++], setState];
}

export function useEffect(callback, depArray) {
  let hasChangedDeps = true;
  const bucket = getCurrentBucket();
  const hasNoDeps = !depArray;
  const deps = bucket.hooks[bucket.currentHook];

  if (deps) {
    hasChangedDeps = !depArray.every((el, i) => el === deps[i]);
  }

  if (hasNoDeps || hasChangedDeps) {
    callback();
    bucket.hooks[bucket.currentHook] = depArray;
  }

  bucket.currentHook++;
}

function getCurrentBucket() {
  const el = stack[stack.length - 1];

  if (!el) {
    throw Error("You need to create a dispatcher before using hooks");
  }

  if (!buckets.has(el)) {
    buckets.set(el, {
      currentHook: 0,
      hooks: [],
      __dispatcher: el
    });
  }
  return buckets.get(el);
}

export function enableHooks() {
  Render.functionalComponent = renderFunctionalComponent;
}

function renderFunctionalComponent(component) {
  const props = Object.assign({}, component.props, {
    children: component.children
  });
  component.type = dispatcherBuilder(component);
  const element = component.type(props);
  component.type.__currentElement__ = element;
  return element;
}

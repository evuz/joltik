const stack = [];
const buckets = new Map();

export function dispatcherBuilder(fn) {
  if (fn.__isDispatcher) {
    return fn;
  }

  const r = dispatcher;
  r.__isDispatcher = true;

  return r;

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
  if (!buckets.has(el)) {
    buckets.set(el, {
      currentHook: 0,
      hooks: []
    });
  }
  return buckets.get(el);
}

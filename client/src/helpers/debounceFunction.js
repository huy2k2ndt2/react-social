export const debounce = (callback, delay, ...rest) => {
  if (!delay) delay = 1000;
  let timerId;

  return () => {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }

    timerId = setTimeout(() => {
      callback(...rest);
    }, delay);
  };
};

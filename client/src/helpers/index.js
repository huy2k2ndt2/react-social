export const checkExit = (array, value) => array.includes(value);

export const addElment = (array, value, callback, isFrist = true) => {
  const isExit =
    (callback && callback(array, value)) || checkExit(array, value);

  if (isExit) return array;
  return isFrist ? [...array, value] : [...array, value];
};

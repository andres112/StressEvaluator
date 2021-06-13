export const removeEmpty = function(obj) {
  for (let p in obj) {
    if (!obj[p]) {
      delete obj[p];
    }
  }
  return obj;
};

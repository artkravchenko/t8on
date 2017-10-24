module.exports = function merge(object, source) {
  if (typeof source === 'undefined' || source === null) {
    return object;
  }

  // eslint-disable-next-line no-var
  for (var v0, v1, k, keys = Object.keys(source), l = keys.length, i = 0; i < l; ++i) {
    k = keys[i], v1 = source[k];
    if (typeof v1 !== 'undefined') {
      v0 = object[k];
      if (
        typeof v1 === 'object' && v1 !== null &&
        typeof v0 === 'object' && v0 !== null
      ) {
        merge(v0, v1);
      } else {
        object[k] = v1;
      }
    }
  }

  return object;
};

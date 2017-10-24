module.exports = function deprecate(f, message) {
  let called = false;
  return function deprecated() {
    if (!called) {
      called = true;
      // eslint-disable-next-line no-console
      console.warn(message);
    }
    return f.apply(null, arguments);
  };
};

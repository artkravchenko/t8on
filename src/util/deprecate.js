module.exports = (f, message) => {
  const g = function () {
    if (!this.calledBefore) {
      this.calledBefore = true;
      // eslint-disable-next-line no-console
      console.warn(message);
    }
    return f.apply(null, arguments);
  };

  return g;
};

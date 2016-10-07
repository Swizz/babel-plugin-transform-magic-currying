function _magicCurrying(fn) {
  return function _magicCurrying_fn() {
    var params = Array.prototype.slice.call(arguments);

    if (params.length >= fn.length) {
      return fn.apply(this, params);
    }

    return function _magicCurrying() {
      var next = Array.prototype.slice.call(arguments);
      return _magicCurrying_fn.apply(this, params.concat(next));
    };
  };
}

const add0 = _magicCurrying((a, b) => a + b);

const add1 = _magicCurrying((a, b) => {
  return a + b;
});

foo(_magicCurrying((a, b) => a + b));

foo(_magicCurrying((a, b) => {
  return a + b;
}));

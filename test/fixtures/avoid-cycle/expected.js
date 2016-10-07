const add0 = _magicCurrying(function add0(a, b) {
  return a + b;
});

const add1 = _magicCurrying((a, b) => a + b);

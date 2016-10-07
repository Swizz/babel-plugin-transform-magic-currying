const add = _magicCurrying(function add(a, b) {
  return a + b;
});

foo(_magicCurrying(function add(a, b) {
  return a + b;
}));

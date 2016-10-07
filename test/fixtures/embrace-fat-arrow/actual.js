const add0 = (a, b) => a + b;

const add1 = (a, b) => {
  return a + b;
};

foo((a, b) => a + b);

foo((a, b) => {
  return a + b;
});

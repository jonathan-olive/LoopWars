const test = function (...args) {
  args.map((val) => console.log(val));
};

test('one', 'two');

const names = ' Palpatine dooop';
const temp = 'P';
console.log(names.indexOf(temp));

const obj1 = {
  test: function sum() {
    return 'free';
  },
};
var yum = 'hello';
console.log(Object.getOwnPropertyNames(test));
console.log(obj1.test);

/* eslint-disable no-unused-vars */
/* eslint-disable no-empty */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-var */
/* eslint-disable func-names */
/* eslint-disable no-new-func */

var mapByProps = function (objs, props = "") {
  const propsLiteral = `{${props.split(" ").join(",")}}`;
  return objs.map(new Function(propsLiteral, `return ${propsLiteral}`));
};

function luhnCheck(numString = "0000 0000 0000 0000") {
  const digitRegex = /^\d$/;
  const testDigit = digitRegex.test.bind(digitRegex);
  const digits = numString
    .split("") // -> array of char
    .filter(testDigit) // -> array of digits
    .map(Number); // -> array of 0..9 number

  for (let i = 0; i < digits.length; i++) {
    if ((i % 2) === 1) {
      const index = digits.length - 1 - i;
      const doubleDigit = digits[index] * 2;
      digits[index] = (Math.trunc(doubleDigit / 10) + doubleDigit % 10) % 10;
    }
  }
  console.log(digits.join(""));
  const digitsSum = digits.reduce((acc, digit) => acc + digit, 0);
  return digitsSum;
  return (digitsSum % 10) === 0;
}

// const a = {
//   pun(arg) {
//     this.arg = arg;
//   },

//   callback: () => {
//     console.log(this.arg);
//   },
// };

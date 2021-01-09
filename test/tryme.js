/* eslint-disable no-var */
/* eslint-disable func-names */
/* eslint-disable no-new-func */

var mapByProps = function (objs, props = "") {
  const propsLiteral = `{${props.split(" ").join(",")}}`;
  return objs.map(new Function(propsLiteral, `return ${propsLiteral}`));
};
// const a = {
//   pun(arg) {
//     this.arg = arg;
//   },

//   callback: () => {
//     console.log(this.arg);
//   },
// };

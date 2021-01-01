// { response } = require("express");
// Express = require("express");
// app = Express();
// port = 8080;

// const { compile } = require("pug");

// app.get("/", (request, response) => {
//   response.send("touch sou");
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}!`);
// });
const a = {
  pun(arg) {
    this.arg = arg;
  },

  callback: () => {
    console.log(this.arg);
  },
};
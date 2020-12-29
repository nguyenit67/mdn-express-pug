// { response } = require("express");
// Express = require("express");
// app = Express();
// port = 8080;

// app.get("/", (request, response) => {
//   response.send("touch sou");
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}!`);
// });

Object.getPrototypeOf(new class {
  book_count(callback) {
    Book.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
  }
  book_instance_count(callback) {
    BookInstance.countDocuments({}, callback);
  }
  book_instance_available_count(callback) {
    BookInstance.countDocuments({ status: "Available" }, callback);
  }
  author_count(callback) {
    Author.countDocuments({}, callback);
  }
  genre_count(callback) {
    Genre.countDocuments({}, callback);
  }
});

taskLiterals = {
  book_count(callback) {
    Book.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
  },
  book_instance_count(callback) {
    BookInstance.countDocuments({}, callback);
  },
  book_instance_available_count(callback) {
    BookInstance.countDocuments({ status: "Available" }, callback);
  },
  author_count(callback) {
    Author.countDocuments({}, callback);
  },
  genre_count(callback) {
    Genre.countDocuments({}, callback);
  },
};

// taskLiterals = Object.create()



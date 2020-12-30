const async = require("async");

const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookinstance");

module.exports = new (class {
  index(req, res) {
    const tasks = {
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

    async.parallel(tasks, (err, results) => {
      // console.log(":DevEnv 👋 log", JSON.stringify(results));
      res.render("index", {
        title: "Local Library Home",
        error: err,
        data: results,
      });
    });
  }

  book_list(req, res, next) {
    Book.find({}, "title author")
      .populate("author")
      .exec((error, book_list) => {
        if (error) {
          return next(error);
        }
        res.render("book_list", { title: "Book List", book_list });
      });
  }

  // Display detail page for a specific book.
  book_detail(req, res) {
    res.send(`NOT IMPLEMENTED: book detail: ${req.params.id}`);
  }

  // Display book create form on GET.
  book_create_get(req, res) {
    res.send("NOT IMPLEMENTED: book create GET");
  }

  // Handle book create on POST.
  book_create_post(req, res) {
    res.send("NOT IMPLEMENTED: book create POST");
  }

  // Display book delete form on GET.
  book_delete_get(req, res) {
    res.send("NOT IMPLEMENTED: book delete GET");
  }

  // Handle book delete on POST.
  book_delete_post(req, res) {
    res.send("NOT IMPLEMENTED: book delete POST");
  }

  // Display book update form on GET.
  book_update_get(req, res) {
    res.send("NOT IMPLEMENTED: book update GET");
  }

  // Handle book update on POST.
  book_update_post(req, res) {
    res.send("NOT IMPLEMENTED: book update POST");
  }
})();

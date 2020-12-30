const async = require("async");

const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookinstance");


module.exports = new class {
  genre_list(req, res, next) {
    Genre.find()
      .sort([["name", "ascending"]])
      .exec((error, genre_list) => {
        if (error) {
          next(error);
        }
        res.render("genre_list", { title: "Genre List", genre_list });
      });
  }

  // Display detail page for a specific genre.
  genre_detail(req, res, next) {
    async.parallel({
      genre(callback) {
        Genre.findById(req.params.id)
          .exec(callback);
      },

      genre_books(callback) {
        Book.find({ genre: req.params.id })
          .exec(callback);
      },

    }, function (error, results) {
      if (error) { return next(error); }
      if (results.genre == null) { // No results.
        const err404 = new Error("Genre not found");
        err404.status = 404;
        return next(err404);
      }
      // Successful, so render
      res.render("genre_detail", { title: "Genre Detail", ...results });
    });
  }

  // Display genre create form on GET.
  genre_create_get(req, res) {
    res.send("NOT IMPLEMENTED: genre create GET");
  }

  // Handle genre create on POST.
  genre_create_post(req, res) {
    res.send("NOT IMPLEMENTED: genre create POST");
  }

  // Display genre delete form on GET.
  genre_delete_get(req, res) {
    res.send("NOT IMPLEMENTED: genre delete GET");
  }

  // Handle genre delete on POST.
  genre_delete_post(req, res) {
    res.send("NOT IMPLEMENTED: genre delete POST");
  }

  // Display genre update form on GET.
  genre_update_get(req, res) {
    res.send("NOT IMPLEMENTED: genre update GET");
  }

  // Handle genre update on POST.
  genre_update_post(req, res) {
    res.send("NOT IMPLEMENTED: genre update POST");
  }
}();

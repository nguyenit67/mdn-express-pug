/* eslint-disable func-names */
/* eslint-disable no-unused-vars */
const async = require("async");

const { body, validationResult } = require("express-validator");

const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookinstance");

exports.genre_list = function (req, res, next) {
  Genre.find()
    .sort([["name", "ascending"]])
    .exec((error, genre_list) => {
      if (error) {
        next(error);
      }
      res.render("genre_list", { title: "Genre List", genre_list });
    });
};

// Display detail page for a specific genre.
exports.genre_detail = function (req, res, next) {
  async.parallel({
    genre(callback) {
      Genre.findById(req.params.id)
        .exec(callback);
    },

    genre_s_books(callback) {
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
    res.render("genre_detail",
      { title: "Genre Detail 🕵️‍♂️🚧🔞",
        genre: results.genre,
        genre_books: results.genre_s_books,
      });
  });
};

// Display genre create form on GET.
exports.genre_create_get = (req, res, next) => {
  res.render("genre_form", { title: "Create Genre" });
};

// Handle genre create on POST.
exports.genre_create_post = [
  body("name", "Genre name required!").trim().isLength({ min: 2 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      res.render("genre_form", {
        title: "Create Genre",
        errors: errors.array(),
        genre,
      });

    }
    else {
      Genre.findOne({ name: new RegExp(`^${genre.name}$`, "i") })
        .exec((findError, found_genre) => {
          if (findError) {
            next(findError);
          }
          if (found_genre) {
            res.redirect(found_genre.url);

          }
          else {
            genre.save((saveErr) => {
              if (saveErr) { return next(saveErr); }
              res.redirect(genre.url);
            });
          }

        });
    }
  },
];

// Display genre delete form on GET.
exports.genre_delete_get = function (req, res, next) {
  async.parallel({
    genre: (callback) => {
      Genre.findById(req.params.id).exec(callback);
    },
    genre_s_books: (callback) => {
      Book.find({ genre: req.params.id }).exec(callback);
    },
  }, function (err, results) {
    if (err) { return next(err); }
    // eslint-disable-next-line eqeqeq
    if (undefined == results.genre) { // No results.
      res.redirect("/catalog/genres");
    }
    // Successful, so render.
    res.render("genre_delete",
      { title: "Delete Genre",
        genre: results.genre,
        genre_books: results.genre_s_books,
      });
  });
};

// Handle genre delete on POST.
exports.genre_delete_post = function (req, res, next) {
  async.parallel({
    genre: (callback) => {
      Genre.findById(req.params.id).exec(callback);
    },
    genre_s_books: (callback) => {
      Book.find({ genre: req.params.id }).exec(callback);
    },
  },
  function (err, results) {

    if (err) { return next(err); }

    if (results.genre_s_books.length > 0) {
      res.render("genre_delete", {
        title: "Delete Genre",
        genre: results.genre,
        genre_books: results.genre_s_books,
      });
    }
    else {
      Genre.findByIdAndRemove(req.body.genreid, (findAndRmError) => {
        if (findAndRmError) {
          return next(findAndRmError);
        }

        res.redirect("/catalog/genres");
      });
    }
  });
};

// Display genre update form on GET.
exports.genre_update_get = function (req, res, next) {
  Genre.findById(req.params.id)
    .exec((err, genre) => {
      if (err) { return next(err); }

      res.render("genre_form", {
        title: `Update Genre ${genre.name}`,
        genre,
      });
    });
};

// Handle genre update on POST.
exports.genre_update_post = [
  body("name", "Genre name required!").trim().isLength({ min: 2 }).escape()
    .custom((name, { req }) => {
      return Genre.findOne({
        $and: [
          { name },
          { _id: { $ne: req.body.genreid } },
        ],
      }).then((genre) => {
        if (genre) {
          throw new Error("Genre Exist!");
        }
      });
    }),

  function (req, res, next) {

    const errors = validationResult(req);

    const genre = new Genre({
      name: req.body.name,
      _id: req.body.genreid,
    });

    if (!errors.isEmpty()) {
      res.render("genre_form", {
        title: `Update Genre ${genre.name}`,
        errors: errors.array(),
        genre,
      });
    }
    else {
      Genre.findByIdAndUpdate(req.body.genreid, genre, {},
        (findAndUpdError, thegenre) => {
          if (findAndUpdError) { return next(findAndUpdError); }

          res.redirect(thegenre.url);
        });
    }
  }];

const async = require("async");

const { body, validationResult } = require("express-validator");

const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookinstance");


  exports.genre_list = function(req, res, next) {
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
  exports.genre_detail = function(req, res, next) {
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
  exports.genre_create_get = function(req, res) {
    res.render("genre_form", { title: "Create Genre" });
  }

  // Handle genre create on POST.
  exports.genre_create_post = [
    body("name", "Genre name required!").trim().isLength({min: 1}).escape(),
    (req, res, next) => {
      const errors = validationResult(req);

      const genre = new Genre({ name: req.body.name });

      if (!errors.isEmpty()) {
        res.render("$1", {
          title: "$1",
          errors: errors.array(),
          genre,
        });
        return;
      }
      else {
        Genre.findOne({ name: genre.name })
          .exec((err, found_genre) => {
              if (err) {
                next(err);
              }
              if (found_genre) {
                res.redirect(found_genre.url);

              }
              else {
                genre.save((err) => {
                    if (err) { return next(err); }
                    res.redirect(genre.url);
                  });
              }

            });
      }
    }
  ];

  // Display genre delete form on GET.
  exports.genre_delete_get = function(req, res) {
    res.send("NOT IMPLEMENTED: genre delete GET");
  }

  // Handle genre delete on POST.
  exports.genre_delete_post = function(req, res) {
    res.send("NOT IMPLEMENTED: genre delete POST");
  }

  // Display genre update form on GET.
  exports.genre_update_get=function(req, res) {
    res.send("NOT IMPLEMENTED: genre update GET");
  }

  // Handle genre update on POST.
  exports.genre_update_post=function(req, res) {
    res.send("NOT IMPLEMENTED: genre update POST");
  }

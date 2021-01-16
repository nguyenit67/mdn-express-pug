const async = require("async");

const { body, validationResult } = require("express-validator");
const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookinstance");

module.exports = new class {
  author_list(req, res, next) {
    Author.find()
      .sort([["family_name", "ascending"]])
      .exec((error, list_authors) => {
        if (error) {
          return next(error);
        }
        // Successful, so render
        res.render("author_list", { title: "Author List", author_list: list_authors });
      });
  }

  // Display detail page for a specific Author.
  author_detail(req, res, next) {
    async.parallel({
      author: (callback) => {
        Author.findById(req.params.id)
          .exec(callback);
      },

      author_books: (callback) => {
        Book.find({ author: req.params.id }, "title summary")
          .exec(callback);
      },

    }, function (error, results) {
      if (error) { return next(error); }

      if (results.author == null) { // No results.
        const err404 = new Error("Author not found");
        err404.status = 404;
        return next(err404);
      }
      // Successful, so render
      res.render("author_detail", { title: "Author Detail", ...results });
    });
  }

  // Display Author create form on GET.
  author_create_get(req, res, next) {
    res.render("author_form", { title: "Create Author" });
  }

  // Handle Author create on POST.
  get author_create_post() {
    return [
      body("first_name").trim().isLength({ min: 1 }).escape()
        .withMessage("First name must be specified.")
        .isAlphanumeric()
        .withMessage("First name has non-alphanumeric characters."),

      body("family_name").trim().isLength({ min: 1 }).escape()
        .withMessage("Family name must be specified.")
        .isAlphanumeric()
        .withMessage("Family name has non-alphanumeric characters."),

      body("date_of_birth", "Invalid date of birth").optional({ checkFalsy: true }).isISO8601().toDate(),

      body("date_of_death", "Invalid date of death")
        .optional({ checkFalsy: true })
        // stop when blank
        .isISO8601()
        .bail()
        // stop when not ISO
        .toDate()
        .if((_value, { req }) => (req.body.date_of_birth instanceof Date))
        .if((date_of_death) => (date_of_death instanceof Date))
        // compare ONLY WHEN both fields are valid Date objects
        .custom((date_of_death, { req }) => {
          return (req.body.date_of_birth < date_of_death);
        })
        .withMessage("“Death must come after Birth” – Invalid date of death"),
      (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          // There are errors. Render form again with sanitized values/errors messages.
          res.render("author_form", { title: "Create Author", author: req.body, errors: errors.array() });

        }
        else {
          // Data from form is valid.

          // Create an Author object with escaped and trimmed data.
          const author = new Author(
            {
              first_name: req.body.first_name,
              family_name: req.body.family_name,
              date_of_birth: req.body.date_of_birth,
              date_of_death: req.body.date_of_death,
            },
          );
          author.save((err) => {
            if (err) { return next(err); }
            // Successful - redirect to new author record.
            res.redirect(author.url);
          });
        }
      },
    ];
  }

  // Display Author delete form on GET.
  author_delete_get(req, res, next) {
    async.parallel({
      author: (callback) => {
        Author.findById(req.params.id).exec(callback);
      },
      authors_books: (callback) => {
        Book.find({ author: req.params.id }).exec(callback);
      },
    }, function (err, results) {
      if (err) { return next(err); }
      // eslint-disable-next-line eqeqeq
      if (undefined == results.author) { // No results.
        res.redirect("/catalog/authors");
      }
      // Successful, so render.
      res.render("author_delete",
        { title: "Delete Author",
          author: results.author,
          author_books: results.authors_books,
        });
    });
  }

  // Handle Author delete on POST.
  author_delete_post(req, res, next) {
    async.parallel({
      author(callback) {
        Author.findById(req.body.authorid).exec(callback);
      },
      authors_books(callback) {
        Book.find({ author: req.body.authorid }).exec(callback);
      },
    }, function (err, results) {
      if (err) { return next(err); }
      // Success
      if (results.authors_books.length > 0) {
        // Author has books. Render in same way as for GET route.
        res.render("author_delete",
          { title: "Delete Author",
            author: results.author,
            author_books: results.authors_books,
          });

      }
      else {
        // Author has no books. Delete object and redirect to the list of authors.
        Author.findByIdAndRemove(req.body.authorid, function (findAndRmError) {
          if (findAndRmError) { return next(findAndRmError); }
          // Success - go to author list
          res.redirect("/catalog/authors");
        });
      }
    });
  }

  // Display Author update form on GET.
  author_update_get(req, res, next) {
    Author.findById(req.params.id,
      function (err, author) {
        if (err) { return next(err); }

        res.render("author_form", {
          title: "Edit Author",
          author,
        });
      });
  }

  // Handle Author update on POST.
  get author_update_post() {
    return [
      body("first_name").trim().isLength({ min: 1 }).escape()
        .withMessage("First name must be specified.")
        .isAlphanumeric()
        .withMessage("First name has non-alphanumeric characters."),

      body("family_name").trim().isLength({ min: 1 }).escape()
        .withMessage("Family name must be specified.")
        .isAlphanumeric()
        .withMessage("Family name has non-alphanumeric characters."),

      body("date_of_birth", "Invalid date of birth").optional({ checkFalsy: true }).isISO8601().toDate(),

      body("date_of_death", "Invalid date of death")
        .optional({ checkFalsy: true })
        // stop when blank
        .isISO8601()
        .bail()
        // stop when not ISO
        .toDate()
        .if((_value, { req }) => (req.body.date_of_birth instanceof Date))
        .if((date_of_death) => (date_of_death instanceof Date))
        // compare ONLY WHEN both fields are valid Date objects
        .custom((date_of_death, { req }) => {
          return (req.body.date_of_birth < date_of_death);
        })
        .withMessage("“Death must come after Birth” – Invalid date of death"),
      (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        const author = new Author(
          {
            _id: req.params.id, // #! VIP REQUIRED!
            first_name: req.body.first_name,
            family_name: req.body.family_name,
            date_of_birth: req.body.date_of_birth,
            date_of_death: req.body.date_of_death,
          },
        );

        if (!errors.isEmpty()) {
          // There are errors. Render form again with sanitized values/errors messages.
          res.render("author_form", {
            title: "Edit Author",
            author,
            errors: errors.array(),
          });
        }
        else {
          // Data from form is valid.

          // Update an Author object with escaped and trimmed data.
          Author.findByIdAndUpdate(req.params.id, author, {},
            (findAndUpdError, theauthor) => {
              if (findAndUpdError) { return next(findAndUpdError); }
              // Successful - redirect to new author record.
              res.redirect(theauthor.url);
            },
          );
        }
      },
    ];
  }
}();

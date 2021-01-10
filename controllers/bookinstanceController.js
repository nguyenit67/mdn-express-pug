/* eslint-disable camelcase */
const { body, validationResult } = require("express-validator");
const BookInstance = require("../models/bookinstance");
const Book = require("../models/book");

module.exports = new (class {
  bookinstance_list(req, res, next) {
    BookInstance.find()
      .populate("book")
      .exec((error, bookinstance_list) => {
        if (error) {
          return next(error);
        }
        res.render("bookinstance_list", { title: "Book Instance List", bookinstance_list });
      });
  }

  // Display detail page for a specific bookinstance.
  bookinstance_detail(req, res, next) {
    BookInstance.findById(req.params.id)
      .populate("book")
      .exec((error, bookinstance) => {
        if (error) { return next(error); }

        if (bookinstance == null) { // No results.
          const err404 = new Error("Genre not found");
          err404.status = 404;
          return next(err404);
        }
        // Successful, so render
        res.render("bookinstance_detail", { title: `Copy: ${bookinstance.book.title}`, bookinstance });
      });
  }

  // Display bookinstance create form on GET.
  bookinstance_create_get(req, res, next) {
    Book.find({}, "title")
      .exec((err, book_list) => {
        if (err) {
          return next(err);
        }
        res.render("bookinstance_form",
          { title: "Create BookInstance",
            book_list,
            status_enum: BookInstance.schema.path("status").enumValues,
          });
      });
  }

  // Handle bookinstance create on POST.
  get bookinstance_create_post() {
    return [
      // Validate and sanitise fields.
      body("book", "Book must be specified").trim().isLength({ min: 1 }).escape(),
      body("book").custom((value) => {
        return Book.findById(value).then((book) => {
          if (!book) {
            return Promise.reject(new Error("Book not found! :<"));
          }
        }).catch((err) => {
          return Promise.reject(new Error("Book not found! :<"));
        });
      }),
      body("imprint", "Imprint must be specified").trim().isLength({ min: 1 }).escape(),
      body("status").escape(),
      body("due_back", "Invalid date").optional({ checkFalsy: true }).isISO8601().toDate(),
      (req, res, next) => {
        const errors = validationResult(req);
        const bookinstance = new BookInstance(
          { book: req.body.book,
            imprint: req.body.imprint,
            status: req.body.status,
            due_back: req.body.due_back,
          });

        if (errors.isEmpty()) {
          bookinstance.save((saveErr) => {
            if (saveErr) {
              return next(saveErr);
            }
            res.redirect(bookinstance.url);
          });
        }
        else {
          Book.find({}, "title")
            .exec((err, book_list) => {
              if (err) { return next(err); }

              let selected_book = bookinstance.book?.toString();
              if ("book" in errors.mapped()) {
                selected_book = null;
              }
              // Successful, so render.
              res.render("bookinstance_form",
                { title: "Create BookInstance",
                  book_list,
                  bookinstance,
                  selected_book,
                  errors: errors.array(),
                  status_enum: BookInstance.schema.path("status").enumValues,
                });
            });
        }
      },

    ];
  }

  // Display bookinstance delete form on GET.
  bookinstance_delete_get(req, res, next) {
    BookInstance.findById(req.params.id)
      .populate("book")
      .exec((err, bookinstance) => {
        // network error or db error
        if (err) {
          return next(err);
        }

        res.render("bookinstance_delete", { title: "Delete BookInstance", bookinstance });
      });
  }

  // Handle bookinstance delete on POST.
  bookinstance_delete_post(req, res, next) {
    // Book Copy has no dependencies. Delete object and redirect to the list of copies.
    BookInstance.findByIdAndRemove(req.body.bookinstance_id, (findAndRmError) => {
      if (findAndRmError) {
        return next(findAndRmError);
      }
      // Success - go to book instance list
      res.redirect("/catalog/bookinstances");
    });
  }

  // Display bookinstance update form on GET.
  bookinstance_update_get(req, res, next) {
    res.send("NOT IMPLEMENTED: bookinstance update GET");
  }

  // Handle bookinstance update on POST.
  bookinstance_update_post(req, res, next) {
    res.send("NOT IMPLEMENTED: bookinstance update POST");
  }
})();

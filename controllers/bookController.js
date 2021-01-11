const async = require("async");

const { body, validationResult } = require("express-validator");
const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookinstance");

// eslint-disable-next-line no-unused-vars
exports.index = (req, res, next) => {
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
};

exports.book_list = (req, res, next) => {
  Book.find({}, "title author")
    .populate("author")
    .exec((error, book_list) => {
      if (error) {
        return next(error);
      }
      res.render("book_list", { title: "Book List", book_list });
    });
};

// Display detail page for a specific book.
exports.book_detail = (req, res, next) => {
  // exports.genre_detail = (req, res, next) => {
  async.parallel({
    book: (callback) => {
      Book.findById(req.params.id)
        .populate("author")
        .populate("genre")
        .exec(callback);
    },

    book_instances: (callback) => {
      BookInstance.find({ book: req.params.id })
        .exec(callback);
    },
  },
  (error, results) => {
    if (error) { return next(error); }
    if (results.book == null) { // No results.
      const err404 = new Error("Book not found");
      err404.status = 404;
      return next(err404);
    }
    // Successful, so render
    res.render("book_detail", { title: "Book Detail", ...results });
  });
  // }
};

/**
 * @param {dbQueryCallback} callback_all
 */
const getAuthorsAndGenres = (callback_all) => {
  async.parallel({
    author_list: (callback) => {
      Author.find().exec(callback);
    },

    genre_list: (callback) => {
      Genre.find().exec(callback);
    },
  }, callback_all);
};

/**
 * @callback dbQueryCallback
 * @param {(anyErrors|Error)[]} err - DB query rrors
 * @param {{author_list: "models.Author"[], genre_list: "models.Genre"[]}} results - DB query results
 */
// Display book create form on GET.
exports.book_create_get = (req, res, next) => {
  getAuthorsAndGenres((err, results) => {
    if (err) {
      next(err);
    }
    res.render("book_form", { title: "Create Book", ...results });
  });
};

// Handle book create on POST.
exports.book_create_post = [
  // Convert the genres to an arrray
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (undefined === req.body.genre) {
        req.body.genre = [];
      }
      else {
        req.body.genre = new Array(req.body.genre);
      }
    }
    next();
  },
  body("title", "Title must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("author", "Author must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("summary", "Summary must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("isbn", "ISBN must not be empty").trim().isLength({ min: 1 }).escape(),
  body("genre.*").escape(), // your OK w/ this???
  (req, res, next) => {
    const errors = validationResult(req);
    const book = new Book({ // book from CLIENT user input
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
    });
    if (errors.isEmpty()) {
      book.save((saveErr) => {
        if (saveErr) {
          return next(saveErr);
        }
        res.redirect(book.url);
      });
    }
    else {
      getAuthorsAndGenres((err, results) => {
        if (err) {
          return next(err);
        }

        // Mark our selected genres as checked
        // eslint-ERROR iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Separately, loops should be avoided in favor of array iterations.
        // eslint-disable-next-line no-restricted-syntax
        for (const genreElem of results.genre_list) {
          if (book.genre.includes(genreElem._id)) {
            genreElem.checked = "true";
          }
        }

        res.render("book_form", {
          title: "Create Book", book, ...results, errors: errors.array(),
        });
      });
    }
  },

];

// Display book delete form on GET.
// eslint-disable-next-line no-unused-vars
exports.book_delete_get = (req, res, next) => {
  async.parallel({
    book: (callback) => {
      Book.findById(req.params.id).exec(callback);
    },
    book_copies: (callback) => {
      BookInstance.find({ book: req.params.id }).exec(callback);
    },
  }, (err, results) => {
    if (err) {
      return next(err);
    }

    if (results.book == null) {
      res.redirect("/catalog/books");
    }

    res.render("book_delete",
      { title: "Delete Book",
        book: results.book,
        book_copies: results.book_copies,
      });
  });
};

// Handle book delete on POST.
// eslint-disable-next-line no-unused-vars
exports.book_delete_post = (req, res, next) => {
  async.parallel({
    book: (callback) => {
      Book.findById(req.params.id).exec(callback);
    },
    book_copies: (callback) => {
      BookInstance.find({ book: req.params.id }).exec(callback);
    },
  }, function (err, results) {
    if (err) {
      return next(err);
    }

    if (results.book == null) {
      res.redirect("/catalog/books");
    }

    if (results.book_copies.length > 0) {
      res.render("book_delete",
        {
          title: "Delete Book",
          book: results.book,
          book_copies: results.book_copies,
        });
    }
    else {
      Book.findByIdAndRemove(req.body.bookid, (findAndRmError) => {
        if (findAndRmError) {
          return next(findAndRmError);
        }

        res.redirect("/catalog/books");
      });
    }

  });

};

// Display book update form on GET.
exports.book_update_get = (req, res, next) => {
  async.parallel({
    book: (callback) => {
      Book.findById(req.params.id)
        .populate("author")
        .populate("genre")
        .exec(callback);
    },
    author_list: (callback) => {
      Author.find(callback);
    },
    genre_list: (callback) => {
      Genre.find(callback);
    },
  }, function (err, results) {
    // Network Error or some DB related stuff
    if (err) {
      return next(err);
    }
    const { book, author_list } = results; // book from DATABASE

    if (book == null) { // No book
      const err404 = new Error("Book not found");
      err404.status = 404;
      return next(err404);
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const genreRs of results.genre_list) {
      const genreRsIdString = genreRs._id.toString();
      genreRs.checked = false;

      // eslint-disable-next-line no-restricted-syntax
      for (const genreItem of book.genre) {
        if (genreRsIdString === genreItem._id.toString()) {
          genreRs.checked = true;
          break;
        }
      }
    }
    res.render("book_form", {
      title: `Update Book: ${book.title}`,
      book,
      author_list,
      genre_list: results.genre_list,
    });
  });
};

// Handle book update on POST.
exports.book_update_post = [
  // Convert the genres to an arrray
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (undefined === req.body.genre) {
        req.body.genre = [];
      }
      else {
        req.body.genre = new Array(req.body.genre);
      }
    }
    next();
  },
  body("title", "Title must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("author", "Author must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("summary", "Summary must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("isbn", "ISBN must not be empty").trim().isLength({ min: 1 }).escape(),
  body("genre.*").escape(), // your OK w/ this???
  (req, res, next) => {
    const errors = validationResult(req);
    const book = new Book( // book from CLIENT user input
      { // This is required!
        _id: req.params.id,
        // or a new ID will be assigned!
        title: req.body.title,
        author: req.body.author,
        summary: req.body.summary,
        isbn: req.body.isbn,
        genre: req.body.genre,
      });

    if (errors.isEmpty()) {
      Book.findByIdAndUpdate(req.params.id, book, {}, function (err, thebook) {
        if (err) {
          return next(err);
        }
        res.redirect(thebook.url);
      });
    }
    else {
      getAuthorsAndGenres((err, results) => {
        if (err) {
          return next(err);
        }

        // Mark our selected genres as checked

        // ⚠ eslint-ERROR iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Separately, loops should be avoided in favor of array iterations.

        // eslint-disable-next-line no-restricted-syntax
        for (const genreElem of results.genre_list) {
          if (book.genre.includes(genreElem._id)) {
            genreElem.checked = "true";
          }
        }

        res.render("book_form",
          { title: `Update Book: ${book.title || book._id}`,
            book,
            author_list: results.author_list,
            genre_list: results.genre_list,
            errors: errors.array(),
          });
      });
    }
  },

];

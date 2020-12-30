/* eslint-disable camelcase */
const BookInstance = require("../models/bookinstance");

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
      .exec(function (error, bookinstance) {
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
  bookinstance_create_get(req, res) {
    res.send("NOT IMPLEMENTED: bookinstance create GET");
  }

  // Handle bookinstance create on POST.
  bookinstance_create_post(req, res) {
    res.send("NOT IMPLEMENTED: bookinstance create POST");
  }

  // Display bookinstance delete form on GET.
  bookinstance_delete_get(req, res) {
    res.send("NOT IMPLEMENTED: bookinstance delete GET");
  }

  // Handle bookinstance delete on POST.
  bookinstance_delete_post(req, res) {
    res.send("NOT IMPLEMENTED: bookinstance delete POST");
  }

  // Display bookinstance update form on GET.
  bookinstance_update_get(req, res) {
    res.send("NOT IMPLEMENTED: bookinstance update GET");
  }

  // Handle bookinstance update on POST.
  bookinstance_update_post(req, res) {
    res.send("NOT IMPLEMENTED: bookinstance update POST");
  }
})();

var Book = require("../models/book");

module.exports = new class {

  index(req, res) {
    res.send('NOT IMPLEMENTED: Site Home Page');
  }

  book_list(req, res) {
    res.send("NOT IMPLEMENTED: book list");
  }

  // Display detail page for a specific book.
  book_detail(req, res) {
    res.send("NOT IMPLEMENTED: book detail: " + req.params.id);
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
};

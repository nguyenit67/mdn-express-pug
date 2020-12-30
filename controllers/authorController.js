const Author = require("../models/author");

module.exports = new class {
  author_list(req, res, next) {
    Author.find()
      .sort([["family_name", "ascending"]])
      .exec(function (error, list_authors) {
        if (error) {
          return next(error);
        }
        // Successful, so render
        res.render("author_list", { title: "Author List", author_list: list_authors });
      });
  }

  // Display detail page for a specific Author.
  author_detail(req, res) {
    res.send(`NOT IMPLEMENTED: Author detail: ${req.params.id}`);
  }

  // Display Author create form on GET.
  author_create_get(req, res) {
    res.send("NOT IMPLEMENTED: Author create GET");
  }

  // Handle Author create on POST.
  author_create_post(req, res) {
    res.send("NOT IMPLEMENTED: Author create POST");
  }

  // Display Author delete form on GET.
  author_delete_get(req, res) {
    res.send("NOT IMPLEMENTED: Author delete GET");
  }

  // Handle Author delete on POST.
  author_delete_post(req, res) {
    res.send("NOT IMPLEMENTED: Author delete POST");
  }

  // Display Author update form on GET.
  author_update_get(req, res) {
    res.send("NOT IMPLEMENTED: Author update GET");
  }

  // Handle Author update on POST.
  author_update_post(req, res) {
    res.send("NOT IMPLEMENTED: Author update POST");
  }
}();

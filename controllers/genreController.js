var Genre = require("../models/genre");

module.exports = new class {
  genre_list(req, res) {
    res.send("NOT IMPLEMENTED: genre list");
  }

  // Display detail page for a specific genre.
  genre_detail(req, res) {
    res.send("NOT IMPLEMENTED: genre detail: " + req.params.id);
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
};

var BookInstance = require("../models/bookinstance");

module.exports = new class {
  bookinstance_list(req, res) {
    res.send("NOT IMPLEMENTED: bookinstance list");
  }

  // Display detail page for a specific bookinstance.
  bookinstance_detail(req, res) {
    res.send("NOT IMPLEMENTED: bookinstance detail: " + req.params.id);
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
};

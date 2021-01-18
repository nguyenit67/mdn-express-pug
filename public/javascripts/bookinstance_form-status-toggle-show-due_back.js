console.log("hilo");
// eslint-disable-next-line no-undef
const $ = jQuery;

$(document).ready(function () {
  const toggleShowDueBack = function (event) {
    console.log(this);
    console.log(this.value);
    const target = $("#status")[0];

    console.log(target);
    console.log(target.value);

    if (target.value !== "" && target.value !== "Available") {
      $(".n-due-back-group").css("height", "70px"); // show
    }
    else {
      $(".n-due-back-group").css("height", "0"); // hide
    }
  };

  toggleShowDueBack();
  $("#status").on("input", toggleShowDueBack);
});
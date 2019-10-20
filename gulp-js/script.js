function scroll() {
  $(".anchor-element").click(function(e) {
    e.preventDefault();
    var jumpId = $(this).attr("href");
    $("body, html").animate(
      {
        scrollTop: $(jumpId).offset().top
      },
      "slow"
    );
  });
}

function smooth_scroll() {
  $("a.scroll").each(function() {
    $(this).on("click", function(event) {
      if (this.hash !== "") {
        event.preventDefault();
        var hash = this.hash;
        $("html, body").animate(
          {
            scrollTop: $(hash).offset().top
          },
          1000,
          function() {
            $(".header__container").addClass("active");
          }
        );
      }
    });
  });
}

// Run functions on load
$(function() {
  scroll();
});

(function($) {

    var init = function() {

        $('.back-to-top').on("click", function(e) {
            $('html, body').animate({
                scrollTop: 0
            }, '50');
        });

        //Privacy Links
        var $footerLinks = $(".footer-links");
        ATVI.utils.addPrivacyLinks($footerLinks);

    };

    $(init);

})(jQuery);
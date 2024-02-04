(function($) {

    var init = function() {

        $('.spyro-hamburger').on("click", toggleMenuActive);
        $('.menu-close').on("click", toggleMenuActive);

        $(window).on("load", initMobileScroll); //after page load, init mobile scroll

    };

    var toggleMenuActive = function(e) {
        $('#spyro-menu').toggleClass('active');
    };

    var initMobileScroll = function() {

        //Clicking on header links

        var $menuLink = $("#spyro-menu a");

        var $orderLink = $(".spyro-order-link a");

        $orderLink.on("click", scrollToHash);

        $menuLink.on("click", function(e) {
            toggleMenuActive(); // close menu
            scrollToHash.call(this, e);
        });

        //On page load

        var pageHash = window.location.hash; //get the value of the # in the url
        if (pageHash) scrollTo(pageHash); //if url has hash

    };

    var scrollToHash = function(e) {

        e.preventDefault(); //prevents from reloading page

        var url = $(this).attr("href"); //grab url of link
        var hash = url.split("#")[1]; //get hash value of link. e.g: gallery, buy, social, home

        scrollTo("#" + hash);

    };

    var scrollTo = function(element) {

        $('html, body').animate({
            scrollTop: $(element).offset().top
        }, 500);

    };

    $(init);

})(jQuery);
(function() {

    var init = function() {

        initNavAnalytics();

    };

    var initNavAnalytics = function() {

        if (!dataLayer && !digitalData) return;

        //Main Nav
        var $topNavLink = $("#spyro-menu a");

        $topNavLink.on("click", function() {

            dataLayer.push({
                action: "main nav",
                category: "navigation",
                event: "event",
                label: $(this).data("entext") //inner text of link

            });

        });

        //Purchase
        var $purchaseBtn = $(".spyro-order-link a");

        $purchaseBtn.on("click", function() {

            dataLayer.push({
                action: "main nav",
                category: "navigation",
                event: "event",
                label: "Order Game",
                destinationUrl: $(this).attr("href")

            });

        });

    };

    $(init);

})();
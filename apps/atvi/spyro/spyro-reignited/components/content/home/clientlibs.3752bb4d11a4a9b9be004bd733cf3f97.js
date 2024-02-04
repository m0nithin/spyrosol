(function($) {

    var init = function() {

        // Carousel First Slide Navigation

        $('#game-1').on("click", function(e) {
            $("#slick-slide-control01").click();
        });

        $('#game-2').on("click", function(e) {
            $("#slick-slide-control02").click();
        });

        $('#game-3').on("click", function(e) {
            $("#slick-slide-control03").click();
        });


        // Social Links URL
        // NOTE: ATVI Column Layout and Layout Containers don't have a Link To option in dialog

        $('#fb-link').append("<a href='https://www.facebook.com/spyro/' target='_blank'></a>");
        $('#twitter-link').append("<a href='https://twitter.com/spyrothedragon/' target='_blank'></a>");
        $('#insta-link').append("<a href='https://www.instagram.com/spyro/' target='_blank'></a>");
        $('#youtube-link').append("<a href='https://www.youtube.com/spyrothedragon/' target='_blank'></a>");


    };

    $(init);

})(jQuery);
(function() {

    var init = function() {

        initAnalytics();

    };

    var initAnalytics = function() {

        if (!dataLayer && !digitalData) return;

        //Main Nav
        var $socialLinks = $(".social-link a");

        $socialLinks.on("click", function() {

            //Check if link is social platform link
            var socialPlatform = '';
            var fullHref = $(this).attr("href");

            if (fullHref.includes("facebook.com")) socialPlatform = "facebook";
            else if (fullHref.includes("twitter.com")) socialPlatform = "twitter";
            else if (fullHref.includes("instagram.com")) socialPlatform = "instagram";
            else if (fullHref.includes("youtube.com")) socialPlatform = "youtube";
            else if (fullHref.includes("tiktok.com")) socialPlatform = "tiktok";
            else if (fullHref.includes("linkedin.com")) socialPlatform = "linkedin";
            else if (fullHref.includes("discord.gg")) socialPlatform = "discord";

            dataLayer.push({
                event: "social",
                category: "social",
                action: socialPlatform,
                label: fullHref

            });

        });

    };

    $(init);

})();
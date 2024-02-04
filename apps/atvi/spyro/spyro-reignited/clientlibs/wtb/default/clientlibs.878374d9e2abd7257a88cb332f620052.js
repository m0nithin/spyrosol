var SPYRO = SPYRO || {};

(function($, ATVI) {

    ATVI.library.withDependency("wtb-component", function() {
        var where = ATVI.components.wheretobuy,
            consts = where.constants;

        console.log('pewpew');
        var isOriginalLocale = function(context) {
            return where.config.opts.defaults.regions == context.status.regions;
        };


        where.getButtonState = function(context) {

            var retailersArr = context.listsObj.retailers[0].elems,
                url = (retailersArr.length) ? retailersArr[0].id : undefined,
                tag = (retailersArr.length) ? retailersArr[0].tags : '',
                val;
            if (isOriginalLocale(context)) {
                var arrGrep = $.grep(where.bundleBuyButtonStatus, function(n) {
                        return n.id == context.status.bundles;
                    }),
                    dataNode = arrGrep[0],
                    hasOverride = (dataNode) ? dataNode.buttonOverride : false,
                    platformMatch = undefined;

                if (hasOverride) {
                    var opArr = dataNode.buttonOverridePlatforms;
                    platformMatch = opArr.indexOf(context.status.platforms) > -1 || opArr[0] == "all";
                }

                if (url == '#unavailable' || url == 'unavailable' || url == '') val = where.bundleBuyButtonStatus.default.buttonValue;
                else if (tag.toLowerCase() == 'download') val = 'download';
                else if (dataNode && dataNode.buttonValue && hasOverride && platformMatch) val = dataNode.buttonValue;
                else val = where.bundleBuyButtonStatus.default.buttonValue;

            } else {
                if (url == '#unavailable' || url == 'unavailable' || url == 'coming-soon' || url == '') val = where.bundleBuyButtonStatus.default.buttonValue;
                else if (tag.toLowerCase() == 'download') val = 'download';
                else val = where.bundleBuyButtonStatus.default.buttonValue;
            }

            return val;
        };


    });



})(jQuery, ATVI);
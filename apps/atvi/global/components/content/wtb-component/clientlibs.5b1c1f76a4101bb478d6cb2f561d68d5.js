ATVI.plugins = ATVI.plugins || {};
ATVI.plugins.selectric = true;
// NOTE::  this has been modified to return camelCase classnames
/*! Selectric ϟ v1.13.0 (2017-08-21) - git.io/tjl9sQ - Copyright (c) 2017 Leonardo Santos - MIT License */
! function(e) {
    "function" == typeof define && define.amd ? define(["jquery"], e) : "object" == typeof module && module.exports ? module.exports = function(t, s) {
        return void 0 === s && (s = "undefined" != typeof window ? require("jquery") : require("jquery")(t)), e(s), s
    } : e(jQuery)
}(function(e) {
    "use strict";
    var t = e(document),
        s = e(window),
        l = ["a", "e", "i", "o", "u", "n", "c", "y"],
        i = [/[\xE0-\xE5]/g, /[\xE8-\xEB]/g, /[\xEC-\xEF]/g, /[\xF2-\xF6]/g, /[\xF9-\xFC]/g, /[\xF1]/g, /[\xE7]/g, /[\xFD-\xFF]/g],
        n = function(t, s) {
            var l = this;
            l.element = t, l.$element = e(t), l.state = {
                multiple: !!l.$element.attr("multiple"),
                enabled: !1,
                opened: !1,
                currValue: -1,
                selectedIdx: -1,
                highlightedIdx: -1
            }, l.eventTriggers = {
                open: l.open,
                close: l.close,
                destroy: l.destroy,
                refresh: l.refresh,
                init: l.init
            }, l.init(s)
        };
    n.prototype = {
        utils: {
            isMobile: function() {
                return /android|ip(hone|od|ad)/i.test(navigator.userAgent)
            },
            escapeRegExp: function(e) {
                return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
            },
            replaceDiacritics: function(e) {
                for (var t = i.length; t--;) e = e.toLowerCase().replace(i[t], l[t]);
                return e
            },
            format: function(e) {
                var t = arguments;
                return ("" + e).replace(/\{(?:(\d+)|(\w+))\}/g, function(e, s, l) {
                    return l && t[1] ? t[1][l] : t[s]
                })
            },
            nextEnabledItem: function(e, t) {
                for (; e[t = (t + 1) % e.length].disabled;);
                return t
            },
            previousEnabledItem: function(e, t) {
                for (; e[t = (t > 0 ? t : e.length) - 1].disabled;);
                return t
            },
            toDash: function(e) {
                return e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()
            },
            triggerCallback: function(t, s) {
                var l = s.element,
                    i = s.options["on" + t],
                    n = [l].concat([].slice.call(arguments).slice(1));
                e.isFunction(i) && i.apply(l, n), e(l).trigger("selectric-" + this.toDash(t), n)
            },
            arrayToClassname: function(t) {
                var s = e.grep(t, function(e) {
                    return !!e
                });
                return e.trim(s.join(" "))
            }
        },
        init: function(t) {
            var s = this;
            if (s.options = e.extend(!0, {}, e.fn.selectric.defaults, s.options, t), s.utils.triggerCallback("BeforeInit", s), s.destroy(!0), s.options.disableOnMobile && s.utils.isMobile()) return void(s.disableOnMobile = !0);
            s.classes = s.getClassNames();
            var l = e("<input/>", {
                    class: s.classes.input,
                    readonly: s.utils.isMobile()
                }),
                i = e("<div/>", {
                    class: s.classes.items,
                    tabindex: -1
                }),
                n = e("<div/>", {
                    class: s.classes.scroll
                }),
                a = e("<div/>", {
                    class: s.classes.prefix,
                    html: s.options.arrowButtonMarkup
                }),
                o = e("<span/>", {
                    class: "label"
                }),
                r = s.$element.wrap("<div/>").parent().append(a.prepend(o), i, l),
                u = e("<div/>", {
                    class: s.classes.hideselect
                });
            s.elements = {
                input: l,
                items: i,
                itemsScroll: n,
                wrapper: a,
                label: o,
                outerWrapper: r
            }, s.options.nativeOnMobile && s.utils.isMobile() && (s.elements.input = void 0, u.addClass(s.classes.prefix + "-is-native"), s.$element.on("change", function() {
                s.refresh()
            })), s.$element.on(s.eventTriggers).wrap(u), s.originalTabindex = s.$element.prop("tabindex"), s.$element.prop("tabindex", -1), s.populate(), s.activate(), s.utils.triggerCallback("Init", s)
        },
        activate: function() {
            var e = this,
                t = e.elements.items.closest(":visible").children(":hidden").addClass(e.classes.tempshow),
                s = e.$element.width();
            t.removeClass(e.classes.tempshow), e.utils.triggerCallback("BeforeActivate", e), e.elements.outerWrapper.prop("class", e.utils.arrayToClassname([e.classes.wrapper, e.$element.prop("class").replace(/\S+/g, e.classes.prefix + "-$&"), e.options.responsive ? e.classes.responsive : ""])), e.options.inheritOriginalWidth && s > 0 && e.elements.outerWrapper.width(s), e.unbindEvents(), e.$element.prop("disabled") ? (e.elements.outerWrapper.addClass(e.classes.disabled), e.elements.input && e.elements.input.prop("disabled", !0)) : (e.state.enabled = !0, e.elements.outerWrapper.removeClass(e.classes.disabled), e.$li = e.elements.items.removeAttr("style").find("li"), e.bindEvents()), e.utils.triggerCallback("Activate", e)
        },
        getClassNames: function() {
            var t = this,
                s = t.options.customClass,
                l = {};
            return e.each("Input Items Open Disabled TempShow HideSelect Wrapper Focus Hover Responsive Above Below Scroll Group GroupLabel".split(" "), function(e, i) {
                var n = s.prefix + i;
                l[i.toLowerCase()] = s.camelCase ? n : t.utils.toDash(n)
            }), l.prefix = s.prefix, l
        },
        setLabel: function() {
            var t = this,
                s = t.options.labelBuilder;
            if (t.state.multiple) {
                var l = e.isArray(t.state.currValue) ? t.state.currValue : [t.state.currValue];
                l = 0 === l.length ? [0] : l;
                var i = e.map(l, function(s) {
                    return e.grep(t.lookupItems, function(e) {
                        return e.index === s
                    })[0]
                });
                i = e.grep(i, function(t) {
                    return i.length > 1 || 0 === i.length ? "" !== e.trim(t.value) : t
                }), i = e.map(i, function(l) {
                    return e.isFunction(s) ? s(l) : t.utils.format(s, l)
                }), t.options.multiple.maxLabelEntries && (i.length >= t.options.multiple.maxLabelEntries + 1 ? (i = i.slice(0, t.options.multiple.maxLabelEntries), i.push(e.isFunction(s) ? s({
                    text: "..."
                }) : t.utils.format(s, {
                    text: "..."
                }))) : i.slice(i.length - 1)), t.elements.label.html(i.join(t.options.multiple.separator))
            } else {
                var n = t.lookupItems[t.state.currValue];
                t.elements.label.html(e.isFunction(s) ? s(n) : t.utils.format(s, n))
            }
        },
        populate: function() {
            var t = this,
                s = t.$element.children(),
                l = t.$element.find("option"),
                i = l.filter(":selected"),
                n = l.index(i),
                a = 0,
                o = t.state.multiple ? [] : 0;
            i.length > 1 && t.state.multiple && (n = [], i.each(function() {
                n.push(e(this).index())
            })), t.state.currValue = ~n ? n : o, t.state.selectedIdx = t.state.currValue, t.state.highlightedIdx = t.state.currValue, t.items = [], t.lookupItems = [], s.length && (s.each(function(s) {
                var l = e(this);
                if (l.is("optgroup")) {
                    var i = {
                        element: l,
                        label: l.prop("label"),
                        groupDisabled: l.prop("disabled"),
                        items: []
                    };
                    l.children().each(function(s) {
                        var l = e(this);
                        i.items[s] = t.getItemData(a, l, i.groupDisabled || l.prop("disabled")), t.lookupItems[a] = i.items[s], a++
                    }), t.items[s] = i
                } else t.items[s] = t.getItemData(a, l, l.prop("disabled")), t.lookupItems[a] = t.items[s], a++
            }), t.setLabel(), t.elements.items.append(t.elements.itemsScroll.html(t.getItemsMarkup(t.items))))
        },
        getItemData: function(t, s, l) {
            var i = this;
            return {
                index: t,
                element: s,
                value: s.val(),
                className: s.prop("class"),
                text: s.html(),
                slug: e.trim(i.utils.replaceDiacritics(s.html())),
                selected: s.prop("selected"),
                disabled: l
            }
        },
        getItemsMarkup: function(t) {
            var s = this,
                l = "<ul>";
            return e.isFunction(s.options.listBuilder) && s.options.listBuilder && (t = s.options.listBuilder(t)), e.each(t, function(t, i) {
                void 0 !== i.label ? (l += s.utils.format('<ul class="{1}"><li class="{2}">{3}</li>', s.utils.arrayToClassname([s.classes.group, i.groupDisabled ? "disabled" : "", i.element.prop("class")]), s.classes.grouplabel, i.element.prop("label")), e.each(i.items, function(e, t) {
                    l += s.getItemMarkup(t.index, t)
                }), l += "</ul>") : l += s.getItemMarkup(i.index, i)
            }), l + "</ul>"
        },
        getItemMarkup: function(t, s) {
            var l = this,
                i = l.options.optionsItemBuilder,
                n = {
                    value: s.value,
                    text: s.text,
                    slug: s.slug,
                    index: s.index
                };
            return l.utils.format('<li data-index="{1}" class="{2}">{3}</li>', t, l.utils.arrayToClassname([s.className, t === l.items.length - 1 ? "last" : "", s.disabled ? "disabled" : "", s.selected ? "selected" : ""]), e.isFunction(i) ? l.utils.format(i(s, this.$element, t), s) : l.utils.format(i, n))
        },
        unbindEvents: function() {
            var e = this;
            e.elements.wrapper.add(e.$element).add(e.elements.outerWrapper).add(e.elements.input).off(".sl")
        },
        bindEvents: function() {
            var t = this;
            t.elements.outerWrapper.on("mouseenter.sl mouseleave.sl", function(s) {
                e(this).toggleClass(t.classes.hover, "mouseenter" === s.type), t.options.openOnHover && (clearTimeout(t.closeTimer), "mouseleave" === s.type ? t.closeTimer = setTimeout(e.proxy(t.close, t), t.options.hoverIntentTimeout) : t.open())
            }), t.elements.wrapper.on("click.sl", function(e) {
                t.state.opened ? t.close() : t.open(e)
            }), t.options.nativeOnMobile && t.utils.isMobile() || (t.$element.on("focus.sl", function() {
                t.elements.input.focus()
            }), t.elements.input.prop({
                tabindex: t.originalTabindex,
                disabled: !1
            }).on("keydown.sl", e.proxy(t.handleKeys, t)).on("focusin.sl", function(e) {
                t.elements.outerWrapper.addClass(t.classes.focus), t.elements.input.one("blur", function() {
                    t.elements.input.blur()
                }), t.options.openOnFocus && !t.state.opened && t.open(e)
            }).on("focusout.sl", function() {
                t.elements.outerWrapper.removeClass(t.classes.focus)
            }).on("input propertychange", function() {
                var s = t.elements.input.val(),
                    l = new RegExp("^" + t.utils.escapeRegExp(s), "i");
                clearTimeout(t.resetStr), t.resetStr = setTimeout(function() {
                    t.elements.input.val("")
                }, t.options.keySearchTimeout), s.length && e.each(t.items, function(e, s) {
                    if (!s.disabled && l.test(s.text) || l.test(s.slug)) return void t.highlight(e)
                })
            })), t.$li.on({
                mousedown: function(e) {
                    e.preventDefault(), e.stopPropagation()
                },
                click: function() {
                    return t.select(e(this).data("index")), !1
                }
            })
        },
        handleKeys: function(t) {
            var s = this,
                l = t.which,
                i = s.options.keys,
                n = e.inArray(l, i.previous) > -1,
                a = e.inArray(l, i.next) > -1,
                o = e.inArray(l, i.select) > -1,
                r = e.inArray(l, i.open) > -1,
                u = s.state.highlightedIdx,
                p = n && 0 === u || a && u + 1 === s.items.length,
                c = 0;
            if (13 !== l && 32 !== l || t.preventDefault(), n || a) {
                if (!s.options.allowWrap && p) return;
                n && (c = s.utils.previousEnabledItem(s.lookupItems, u)), a && (c = s.utils.nextEnabledItem(s.lookupItems, u)), s.highlight(c)
            }
            if (o && s.state.opened) return s.select(u), void(s.state.multiple && s.options.multiple.keepMenuOpen || s.close());
            r && !s.state.opened && s.open()
        },
        refresh: function() {
            var e = this;
            e.populate(), e.activate(), e.utils.triggerCallback("Refresh", e)
        },
        setOptionsDimensions: function() {
            var e = this,
                t = e.elements.items.closest(":visible").children(":hidden").addClass(e.classes.tempshow),
                s = e.options.maxHeight,
                l = e.elements.items.outerWidth(),
                i = e.elements.wrapper.outerWidth() - (l - e.elements.items.width());
            !e.options.expandToItemText || i > l ? e.finalWidth = i : (e.elements.items.css("overflow", "scroll"), e.elements.outerWrapper.width(9e4), e.finalWidth = e.elements.items.width(), e.elements.items.css("overflow", ""), e.elements.outerWrapper.width("")), e.elements.items.width(e.finalWidth).height() > s && e.elements.items.height(s), t.removeClass(e.classes.tempshow)
        },
        isInViewport: function() {
            var e = this;
            if (!0 === e.options.forceRenderAbove) e.elements.outerWrapper.addClass(e.classes.above);
            else if (!0 === e.options.forceRenderBelow) e.elements.outerWrapper.addClass(e.classes.below);
            else {
                var t = s.scrollTop(),
                    l = s.height(),
                    i = e.elements.outerWrapper.offset().top,
                    n = e.elements.outerWrapper.outerHeight(),
                    a = i + n + e.itemsHeight <= t + l,
                    o = i - e.itemsHeight > t,
                    r = !a && o,
                    u = !r;
                e.elements.outerWrapper.toggleClass(e.classes.above, r), e.elements.outerWrapper.toggleClass(e.classes.below, u)
            }
        },
        detectItemVisibility: function(t) {
            var s = this,
                l = s.$li.filter("[data-index]");
            s.state.multiple && (t = e.isArray(t) && 0 === t.length ? 0 : t, t = e.isArray(t) ? Math.min.apply(Math, t) : t);
            var i = l.eq(t).outerHeight(),
                n = l[t].offsetTop,
                a = s.elements.itemsScroll.scrollTop(),
                o = n + 2 * i;
            s.elements.itemsScroll.scrollTop(o > a + s.itemsHeight ? o - s.itemsHeight : n - i < a ? n - i : a)
        },
        open: function(s) {
            var l = this;
            if (l.options.nativeOnMobile && l.utils.isMobile()) return !1;
            l.utils.triggerCallback("BeforeOpen", l), s && (s.preventDefault(), l.options.stopPropagation && s.stopPropagation()), l.state.enabled && (l.setOptionsDimensions(), e("." + l.classes.hideselect, "." + l.classes.open).children().selectric("close"), l.state.opened = !0, l.itemsHeight = l.elements.items.outerHeight(), l.itemsInnerHeight = l.elements.items.height(), l.elements.outerWrapper.addClass(l.classes.open), l.elements.input.val(""), s && "focusin" !== s.type && l.elements.input.focus(), setTimeout(function() {
                t.on("click.sl", e.proxy(l.close, l)).on("scroll.sl", e.proxy(l.isInViewport, l))
            }, 1), l.isInViewport(), l.options.preventWindowScroll && t.on("mousewheel.sl DOMMouseScroll.sl", "." + l.classes.scroll, function(t) {
                var s = t.originalEvent,
                    i = e(this).scrollTop(),
                    n = 0;
                "detail" in s && (n = -1 * s.detail), "wheelDelta" in s && (n = s.wheelDelta), "wheelDeltaY" in s && (n = s.wheelDeltaY), "deltaY" in s && (n = -1 * s.deltaY), (i === this.scrollHeight - l.itemsInnerHeight && n < 0 || 0 === i && n > 0) && t.preventDefault()
            }), l.detectItemVisibility(l.state.selectedIdx), l.highlight(l.state.multiple ? -1 : l.state.selectedIdx), l.utils.triggerCallback("Open", l))
        },
        close: function() {
            var e = this;
            e.utils.triggerCallback("BeforeClose", e), t.off(".sl"), e.elements.outerWrapper.removeClass(e.classes.open), e.state.opened = !1, e.utils.triggerCallback("Close", e)
        },
        change: function() {
            var t = this;
            t.utils.triggerCallback("BeforeChange", t), t.state.multiple ? (e.each(t.lookupItems, function(e) {
                t.lookupItems[e].selected = !1, t.$element.find("option").prop("selected", !1)
            }), e.each(t.state.selectedIdx, function(e, s) {
                t.lookupItems[s].selected = !0, t.$element.find("option").eq(s).prop("selected", !0)
            }), t.state.currValue = t.state.selectedIdx, t.setLabel(), t.utils.triggerCallback("Change", t)) : t.state.currValue !== t.state.selectedIdx && (t.$element.prop("selectedIndex", t.state.currValue = t.state.selectedIdx).data("value", t.lookupItems[t.state.selectedIdx].text), t.setLabel(), t.utils.triggerCallback("Change", t))
        },
        highlight: function(e) {
            var t = this,
                s = t.$li.filter("[data-index]").removeClass("highlighted");
            t.utils.triggerCallback("BeforeHighlight", t), void 0 === e || -1 === e || t.lookupItems[e].disabled || (s.eq(t.state.highlightedIdx = e).addClass("highlighted"), t.detectItemVisibility(e), t.utils.triggerCallback("Highlight", t))
        },
        select: function(t) {
            var s = this,
                l = s.$li.filter("[data-index]");
            if (s.utils.triggerCallback("BeforeSelect", s, t), void 0 !== t && -1 !== t && !s.lookupItems[t].disabled) {
                if (s.state.multiple) {
                    s.state.selectedIdx = e.isArray(s.state.selectedIdx) ? s.state.selectedIdx : [s.state.selectedIdx];
                    var i = e.inArray(t, s.state.selectedIdx); - 1 !== i ? s.state.selectedIdx.splice(i, 1) : s.state.selectedIdx.push(t), l.removeClass("selected").filter(function(t) {
                        return -1 !== e.inArray(t, s.state.selectedIdx)
                    }).addClass("selected")
                } else l.removeClass("selected").eq(s.state.selectedIdx = t).addClass("selected");
                s.state.multiple && s.options.multiple.keepMenuOpen || s.close(), s.change(), s.utils.triggerCallback("Select", s, t)
            }
        },
        destroy: function(e) {
            var t = this;
            t.state && t.state.enabled && (t.elements.items.add(t.elements.wrapper).add(t.elements.input).remove(), e || t.$element.removeData("selectric").removeData("value"), t.$element.prop("tabindex", t.originalTabindex).off(".sl").off(t.eventTriggers).unwrap().unwrap(), t.state.enabled = !1)
        }
    }, e.fn.selectric = function(t) {
        return this.each(function() {
            var s = e.data(this, "selectric");
            s && !s.disableOnMobile ? "string" == typeof t && s[t] ? s[t]() : s.init(t) : e.data(this, "selectric", new n(this, t))
        })
    }, e.fn.selectric.defaults = {
        onChange: function(t) {
            e(t).change()
        },
        maxHeight: 300,
        keySearchTimeout: 500,
        arrowButtonMarkup: '<b class="button">&#x25be;</b>',
        disableOnMobile: !1,
        nativeOnMobile: !0,
        openOnFocus: !0,
        openOnHover: !1,
        hoverIntentTimeout: 500,
        expandToItemText: !1,
        responsive: !1,
        preventWindowScroll: !0,
        inheritOriginalWidth: !1,
        allowWrap: !0,
        forceRenderAbove: !1,
        forceRenderBelow: !1,
        stopPropagation: !0,
        optionsItemBuilder: "{text}",
        labelBuilder: "{text}",
        listBuilder: !1,
        keys: {
            previous: [37, 38],
            next: [39, 40],
            select: [9, 13, 27],
            open: [13, 32, 37, 38, 39, 40],
            close: [9, 27]
        },
        customClass: {
            prefix: "selectric",
            camelCase: 1
        },
        multiple: {
            separator: ", ",
            keepMenuOpen: !0,
            maxLabelEntries: !1
        }
    }
});

try {
    pswtb
} catch (ex) {
    pswtb = {}
}
if (!pswtb.loader) {
    pswtb.loader = {
        lsc: [],
        waitLoad: function() {
            var e = pswtb.loader;
            if (e.finish) {
                for (var t = 0; t < e.lsc.length; t++)
                    e.finish(e.lsc[t].wcid);
                window.clearInterval(e.waitLoadTimer);
                e.waitLoadTimer = null
            } else {
                if (!e.waitLoadTimer) e.waitLoadTimer = window.setInterval(e.waitLoad, 20)
            }
        },
        show: function(e) {
            for (var t = 0; t < this.lsc.length; t++)
                if (this.lsc[t].wcid === e.widgetConfigurationId) {
                    this.lsc[t].ops.push(e);
                    return
                }
            var n = document.createElement("script");
            n.type = "text/javascript";
            var r = e.server;
            n.language = "javascript";
            n.src = "//cdn.pricespider.com/1/lib/ps-widget.js";

            var o = document.createElement("meta");
            o.name = "ps-country";
            o.content = e.country;

            var p = document.createElement("meta");
            p.name = "ps-language";
            p.content = e.lang;

            var q = document.createElement("meta");
            q.name = "ps-key";
            q.content = e.widgetConfigurationId;

            this.lsc.push({
                wcid: e.widgetConfigurationId,
                ops: [e]
            });
            if (navigator.userAgent.match(/msie [6-7]/i)) {
                document.write('<' + 'script type="' + n.type + '" src="' + n.src.replace(/d=al&/i, "") + '"><' + "/script>");
                this.waitLoad();
                return
            }
            var i = navigator.userAgent.match(/msie [8-9]/i);
            n.async = true;
            //if(i)n.onreadystatechange=new Function("if ((/loaded|completed/i).test(this.readyState)) pswtb.loader.finish('"+e.widgetConfigurationId+"');");
            //else n.onload=new Function("pswtb.loader.finish('"+e.widgetConfigurationId+"');");
            document.getElementsByTagName("head")[0].appendChild(q);
            document.getElementsByTagName("head")[0].appendChild(o);
            document.getElementsByTagName("head")[0].appendChild(p);
            document.getElementsByTagName("head")[0].appendChild(n);
        }
    }
}





ATVI.components.wheretobuy = ATVI.components.wheretobuy || {};

(function($, ATVI) {
    var where = ATVI.components.wheretobuy;

    where.localeCodes = {
        "ar": "sa",
        "da": "dk",
        "en": "us",
        "en_CA": "ca",
        "en_AR": "ae",
        "en_AU": "au",
        "en_GB": "gb",
        "en_NZ": "nz",
        "en_ZA": "za",
        "fr_BE": "be",
        "fr_CA": "ca-fr",
        "es_MX": "mx",
        "ja": "jp",
        "ko": "kp",
        "nl_BE": "be",
        "pt_BR": "br",
        "sv": "se",
        "zh_CN": "cn-s",
        "zh_TW": "tw"
    };

})(jQuery, ATVI);


ATVI.components.wheretobuy = ATVI.components.wheretobuy || {};

(function($, ATVI) {

    var where = ATVI.components.wheretobuy;

    var registry = ATVI.utils.createRegistry(),
        unique = 0,
        sku,
        cc;

    var consts = where.constants = {};

    // classnames
    consts.CN_COMPONENT = '.atvi-wheretobuy';
    consts.CN_SELECTCONTAINER = '.wtb-select';
    consts.CN_SELECTFIELDS = '.wtb-field';
    consts.CN_BUYBUTTONCONTAINER = '.order-button';
    consts.CN_BUYBUTTON = '.wtb-button';
    consts.CN_BUYBUTTONTEXT = '.buy-button-text';
    consts.CN_BOXART = '.product-img';
    consts.CN_EMPTYRETAILERS = '.empty-retailers';
    consts.CN_BUNDLECONTENT = '.bundle-specific-content';
    consts.CN_PLATFORMCONTENT = '.platform-specific-content';
    consts.CN_BUNDLESENTRY = '.bundles-entry';
    consts.CN_PLATFORMSENTRY = '.platforms-entry';
    consts.CN_REGIONSENTRY = '.regions-entry';
    consts.CN_RETAILERSENTRY = '.retailers-entry';
    consts.CN_SELECTRICWRAPPER = '.selectricWrapper, .selectric-wrapper';
    consts.CN_SELECTRICITEMS = '.selectricItems, .selectric-items';
    consts.CN_SELECTED = '.selected';

    // classes
    consts.HIDE = 'hidden';
    consts.SELECTED = 'selected';
    consts.NORETAILER = 'no-retailer';

    // data-attributes
    consts.DATA_OPTIONID = 'option-item-id';
    consts.DATA_BUYBUTTONTEXT = 'buy-button-text';

    // PriceSpider
    consts.PS_ID = '1715-59d4f55aa6e10e0012b3f323';
    consts.PS_COOKIENAME = 'PS_CTID';
    consts.PS_SKUMODE = 'sku-mode';
    consts.PS_INITIALIZED = 'initialized';
    consts.PS_WIDGET = 'ps-widget';
    consts.PS_ATTR = 'ps-sku';


    where.PScountryCodes = {
        "United States": "US",
        "Canada": "CA",
        "Deutschland": "DE",
        "France": "FR",
        "Australia": "AU",
        "United Kingdom": "UK",
        "Italia": "IT",
        "Espana": "ES",
        "España": "ES",
        "Arabic": "AR"
    };

    where.init = function($el, config) {
        var reg = registry.register($el),
            context = reg.context;

        context.wrapper = $el;
        context.config = config;
        context.status = {
            bundles: undefined,
            regions: undefined,
            platforms: undefined,
            retailers: undefined,
            retailerTypes: undefined
        };
        context.listsObj = {};
        buildContextLists(context);
        where.setStatusHandlers(context);

        setupRetailersList(context);
        setupButtons(context);
        where.updateImage(context, context.config.data.wtb.rows);

        where.setDefaults(context);

        if (ATVI.localeDetector) {
            if (ATVI.localeDetector.country) {
                where.handleLocaleDetection(context, {
                    firedAfterPageLoad: false
                });
            } else {
                document.addEventListener('localeDetectionReady', function() {
                    where.handleLocaleDetection(context, {
                        firedAfterPageLoad: true
                    });
                });
            }
        }

    };

    where.buildConfigObj = function(jsonObj) {
        if (!jsonObj) return;
        var rows = jsonObj.rows,
            fields = ['bundles', 'regions', 'platforms'],
            fieldsData = {
                bundles: [],
                regions: [],
                platforms: [],
                rows: rows
            },
            compositeObj = {
                regions: [],
                platforms: [],
                bundles: []
            },
            customizedData = {},
            customizedDataTypes = ['bundles', 'regions', 'platforms'],
            retailerTypes = [],
            dataType, bundle, platform, row;

        customizedData.bundles = {};
        customizedData.bundles.id = (where.wtbBundlesId.length) ? where.wtbBundlesId : [];
        customizedData.bundles.label = (where.wtbBundlesLabel) ? where.wtbBundlesLabel : [];
        customizedData.platforms = {};
        customizedData.platforms.id = (where.wtbPlatformsId.length) ? where.wtbPlatformsId : [];
        customizedData.platforms.label = (where.wtbPlatformsLabel) ? where.wtbPlatformsLabel : [];
        customizedData.regions = {};
        customizedData.regions.id = Object.keys(ATVI.countryCodes);
        customizedData.regions.label = (Object.values) ? Object.values(ATVI.countryCodes) : objectValuesPolyfill(ATVI.countryCodes);


        for (dataType = 0; dataType < customizedDataTypes.length; dataType++) {
            var type = customizedDataTypes[dataType],
                index;
            customizedData[type]['processed'] = [];
            for (index = 0; index < customizedData[type]['id'].length; index++) {
                customizedData[type]['processed'].push({
                    id: customizedData[type]['id'][index],
                    text: customizedData[type]['label'][index]
                });
            }
        }

        for (row = 0; row < rows.length; row++) {
            $.each(fields, function(i, val) {
                var entry = rows[row][val];
                compositeObj[val].push(entry);
            });

            var rType = rows[row].retailer.type;
            if (rType.length && isNaN(rType)) {
                if (!retailerTypes.length) retailerTypes.push({
                    id: rType,
                    text: rType
                });
                else {
                    var present = [],
                        j;
                    for (j = 0; j < retailerTypes.length; j++) {
                        if (retailerTypes[j].id == rType) present.push(retailerTypes[j].id);
                    }
                    if (present.indexOf(rType) < 0) retailerTypes.push({
                        id: rType,
                        text: rType
                    });
                }
            }
        }

        $.each(compositeObj, function(key, val) {
            var idArr = compositeObj[key].filter(uniqueVals);
            if (!fieldsData[key].length) {
                $.each(idArr, function(i, val) {
                    var textVal = (customizedData[key] && customizedData[key]['processed']) ? scanForValue(customizedData[key]['processed'], val) : val;
                    fieldsData[key].push({
                        id: val,
                        text: textVal
                    });
                });
            }
        });

        if (retailerTypes.length) fieldsData.retailerTypes = retailerTypes;

        return fieldsData;

        function scanForValue(arr, target) {
            var i;
            for (i = 0; i < arr.length; i++) {
                if (arr[i].id == target) return arr[i].text;
            }
            return target;
        }
    };

    where.setDefaults = function(context) {
        var defaults = context.config.opts.defaults,
            query = ATVI.utils.getQueryParameters(true),
            defaultRegion = where.processDefaultRegion(context, defaults.regions);
        defaults.regions = defaultRegion;
        if (query.bundles) defaults.bundles = query.bundles;
        if (query.platforms) defaults.platforms = query.platforms;
        if (query.regions) defaults.regions = query.regions;

        where.useValues(context, defaults);
    };

    var buildContextLists = function(context) {
        var $el = context.wrapper,
            lo = context.listsObj,
            listItems = getArrayOfSelections(context);
        for (var i = 0; i < listItems.length; i++) {
            var item = listItems[i];
            if (context.config.data.wtb.retailerTypes && item.type == 'retailerTypes' && context.config.data.wtb.retailerTypes.length < 2) continue;
            lo[item.type] = lo[item.type] || [];
            var listType = getListType(item.$el);
            var list = buildContextList(context, item.$el, listType, item.type);
            item.$el.append(list.$el);
            lo[item.type].push(list);
            if (listType == 'selectbox') where.onSelectboxCreate(context, list.$el, list);
        }
    };

    var buildContextList = function(context, $el, listType, field) {
        var selectionLists = context.config.data.wtb,
            selList = selectionLists[field] = where.processSelectionList(context, field, selectionLists[field]) || selectionLists[field],
            list = where.listBuilderUtils[listType](context, selList || [], $el, field);
        list.field = field;
        return list;
    };

    var getListType = function($list) {
        if ($list.hasClass('selectbox')) return 'selectbox';
        return 'list';
    };


    where.setStatusHandlers = function(context) {
        var status = context.status,
            data = context.config.data.wtb,
            listsObj = context.listsObj;

        var setupOnChangeForType = function(type) {
            if (!listsObj.hasOwnProperty(type) || type == 'retailers') return;
            var arr = listsObj[type];
            for (var i = 0; i < arr.length; i++) {
                arr[i].onChange(function(ev) {
                    ev = ev || {};
                    ev.type = type;
                    handleSelectionChange(ev);
                });
            }
        };

        var handleSelectionChange = function(ev) {
            where.updateStatus(context, ev.type, ev.value);
            var possibleRows = where.widenPossibleRows(context, ev.type);
            where.updateForPossibleRows(context, possibleRows);
            if (ATVI.analytics) {
                where.updateAnalyticsObject(context);
                where.sendStatusEvent(context, ev);
            }
        };

        for (var type in listsObj) {
            setupOnChangeForType(type);
        }

    };

    var setupRetailersList = function(context) {
        var robjs = context.listsObj.retailers;

        for (var i = 0; i < robjs.length; i++) {
            var list = robjs[i];
            list.updateElems([]);
            list.onChange(function(ev) {
                var newVal = ev.value;
                where.updateButtonLink(context, newVal);
                if (ev) {
                    ev.value = ev.text || ev.value;
                    ev.oldValue = ev.oldText || ev.oldValue;
                }
                if (ATVI.analytics) {
                    where.updateAnalyticsObject(context);
                    where.sendStatusEvent(context, ev);
                }
            });
        }
    };

    var setupButtons = function(context) {
        context.wrapper.find(consts.CN_BUYBUTTON).click(function(e) {
            where.onWtbButtonClick(e, context, $(this));
        });
    };

    where.onWtbButtonClick = function(e, context, $this) {
        where.sendButtonClickEvent(context, $this);
        var href = $this.attr('href');

        if (!href || href == '#') e.preventDefault();
        if (context.skuMode) where.launchExistingPswtbModal(context.lastSku, context);
    };

    where.launchExistingPswtbModal = function(sku, context) {
        var pc = getPswtbContainer(sku, context);
        if (pc) pc[0].click();
    };

    var getPriorityList = function(context, exclude) {
        var opts = context.config.opts;
        opts.priority = opts.priority || ['bundles', 'regions', 'platforms'];

        return opts.priority.filter(function(element) {
            return element != exclude;
        });
    };

    where.updateStatus = function(context, field, value) {
        context.status[field] = value;
        var arr = context.listsObj[field] || [];
        for (var i = 0; i < arr.length; i++) {
            arr[i].setValue(value);
        }
        where.onStatusUpdate(context, field);
    };

    var returnPossibleRows = function(context) {
        var status = context.status,
            dataRows = context.config.data.wtb.rows,
            ret = dataRows.slice(0);
        for (var field in status) {
            if (!status.hasOwnProperty(field)) continue;
            if (status[field]) ret = ret.filter(function(row) {
                if (field == 'retailerTypes' && status.retailerTypes) return row.retailer.type == status.retailerTypes;
                return row[field] == status[field];
            });
        }
        return ret;
    };

    var buildRetailerList = function(context, rows) {
        var w = context.wrapper,
            listsObj = context.listsObj,
            bundle = (listsObj.bundles) ? context.status.bundles : true,
            region = (listsObj.regions) ? context.status.regions : true,
            platform = (listsObj.platforms) ? context.status.platforms : true,
            retailerType = (listsObj.retailerTypes && context.status.retailerTypes) ? context.status.retailerTypes : true;

        var elems = [],
            skuElems = [];

        if (bundle && region && platform) {
            for (var i = 0; i < rows.length; i++) {
                var retailer = rows[i].retailer,
                    retailerObj = {
                        id: retailer.link,
                        text: retailer.name,
                        tags: retailer.notes,
                        type: retailer.type
                    };

                if ((retailer.name || "").trim().toLowerCase() == "sku") {
                    skuElems.push(retailerObj);
                } else {
                    if (retailerObj.tags == 'preferred') elems.unshift(retailerObj);
                    else elems.push(retailerObj);
                }
            }
        }

        if (skuElems.length) {
            w.addClass(consts.PS_SKUMODE);
            context.skuMode = true;
            elems = [];
            setupPsRetailers(context, skuElems);

        } else {
            w.removeClass(consts.PS_SKUMODE);
            context.skuMode = false;
        }

        if (context.skuMode) where.hideRetailerSelection(context);
        else where.showRetailerSelection(context);

        var v;
        var robjs = context.listsObj.retailers;
        for (var i = 0; i < robjs.length; i++) {
            robjs[i].updateElems(elems);
            v = v || robjs[i].getValue();
        }

        var elems = context.listsObj.retailers[0].elems,
            isInRetailersList = scanForRetailer(v, elems);

        if (elems.length && !isInRetailersList && v != elems[0].id) v = elems[0].id;

        if (elems.length) {
            where.onPopulatedRetailers(context);
        } else {
            where.onEmptyRetailers(context);
        }

        where.updateButtonLink(context, v);
    };

    var setupPsRetailers = function(context, arr) {
        var cc = context.status.regions.toUpperCase(),
            sku = arr[0].id;

        if (context.lastSku != sku && window.pswtb) {
            context.lastSku = sku;
            var pswtbContainer = getPswtbContainer(sku, context);

            if (pswtbContainer.hasClass(consts.PS_INITIALIZED)) {
                if (window.console) console.log("using SKU: " + sku);
            } else {
                if (window.console) console.log("initiating SKU: " + sku);
                pswtbContainer.addClass(consts.PS_INITIALIZED);

                var psOpts = {
                    widgetConfigurationId: consts.PS_ID,
                    sku: sku,
                    container: pswtbContainer[0],
                    country: cc,
                    lang: ATVI.pageLocale
                };
                var psCookie = (ATVI.utils.getCookie(consts.PS_COOKIENAME, true) || "").trim();
                if (psCookie) psOpts.customTrackingId = psCookie;

                pswtb.loader.show(psOpts);
                $('meta[name="ps-country"]').attr('content', cc);

            }
        }
    };

    var getPswtbContainer = function(sku, context) {
        if (!sku) return;
        var cs = context.pswtbContainers = context.pswtbContainers || {};
        if (cs[sku]) return cs[sku];
        if (!context) return;
        cs[sku] = $('<div>').addClass(consts.PS_WIDGET).attr(consts.PS_ATTR, sku).appendTo(context.wrapper);
        if (typeof PriceSpider !== 'undefined') PriceSpider.rebind();
        return cs[sku];
    };

    where.getPswtbContainer = getPswtbContainer;
    where.buildRetailerList = buildRetailerList;

    var lb = where.listBuilderUtils = {};

    lb.list = function(context, elems) {
        var lis, ret = lb.generic(context, 'list', elems),
            $listWrapper = ret.$el = $('<ul>');


        ret.updateElems = function() {
            $listWrapper.html('');
            var elems = ret.elems;
            for (var i = 0; i < elems.length; i++) {
                var elemClass = elems[i].id.toLowerCase().replace(' ', '-');
                var li = $('<li>').addClass('possible ' + elemClass).appendTo($listWrapper);
                $('<a>', {
                    class: elemClass + ' atvi-no-instrument'
                }).html(elems[i].text).attr('href', '#').appendTo(li);
            }
            lis = $listWrapper.find('li');
            lis.find('a').click(function(e) {
                e.preventDefault();
                var $this = $(this);
                var ev = {
                    original: e,
                    wrapper: $listWrapper,
                    target: $this,
                    oldValue: ret.getValue(),
                    oldText: ret.getText()
                };
                ret.setValueIndex(lis.index($this.parent()), ev);
            });

        };

        ret.readValue = function() {
            var ind = lis.index(lis.filter(consts.CN_SELECTED));
            if (ind >= 0) return ret.elems[ind].id;
            pl
        };

        ret.updateView = function() {
            lis.removeClass(consts.SELECTED);
            var i = ret.getValueIndex();
            if (i >= 0) lis.eq(i).addClass(consts.SELECTED);
        };

        ret.updateElems(elems);
        return ret;
    };

    lb.selectbox = function(context, elems, wrapper, field) {
        var ret = lb.generic(context, 'select', elems),
            $selectWrapper = ret.$el = $('<select>'),
            includeDefaultOption = wrapper.hasClass('withdefault');

        ret.buildFromElems = function() {
            $selectWrapper.html('');
            var elems = ret.elems;
            if (elems.length == 0) {
                $('<option>', {
                    value: 'blank'
                }).appendTo($selectWrapper);
            } else {
                if (includeDefaultOption) {
                    $('<option>', {
                        class: 'possible',
                        value: ''
                    }).html(context.config.opts.defaultText[field] || '').appendTo($selectWrapper);
                }
                for (var i = 0; i < elems.length; i++) {
                    $('<option>', {
                        class: 'possible',
                        value: elems[i].id
                    }).html(elems[i].text).appendTo($selectWrapper);
                }
            }
        };

        ret.readValue = function() {
            return $selectWrapper.val();
        };
        ret.updateView = function() {
            var v = ret.getValue(),
                sv = $selectWrapper.val();
            if (!v && (!sv || sv == 'blank')) return;
            if (v == sv) return;
            $selectWrapper.val(v);
        };
        $selectWrapper.on('change', function(e) {
            var ev = {
                original: e,
                wrapper: $selectWrapper,
                target: $selectWrapper,
                oldValue: ret.getValue(),
                oldText: ret.getText()
            };
            var sv = ret.readValue();
            if (sv == 'blank') sv = null;
            ret.setValue(sv, ev);
        });

        ret.updateElems(elems);
        return ret;
    };

    lb.generic = function(context, type, elems) {
        var ret = {
                type: type,
                elems: elems
            },
            index = -1,
            val, changeQueue = [];
        ret.getValue = function() {
            return val;
        };
        ret.getValueIndex = function() {
            return index;
        };
        ret.setValue = function(v, triggerEv) {
            if (v == val) return;
            var m = -1;
            for (var i = 0; i < ret.elems.length; i++) {
                if (ret.elems[i].id == v) {
                    m = i;
                    break;
                }
            }
            if (m == -1 && v) return;
            ret.setValueIndex(m, triggerEv);
        };
        ret.setValueIndex = function(i, triggerEv) {
            if (i >= ret.elems.length || i < -1 || i == index) return;
            index = i;
            val = i == -1 ? null : ret.elems[i].id;
            ret.updateView();
            if (triggerEv) {
                triggerEv.value = val;
                triggerEv.text = ret.getText();
                ret.triggerChange(triggerEv);
            }
        };
        ret.getText = function() {
            var i = ret.getValueIndex();
            if (i < 0 || i >= (ret.elems || []).length) return "";
            return ret.elems[i].text || "";
        };
        ret.findText = function(t) {
            var a = ret.elems || [];
            for (var i = 0; i < a.length; i++) {
                if (a[i].text == t) return i;
            }
            return -1;
        };
        ret.onChange = function(c) {
            changeQueue.push(c);
        };
        ret.triggerChange = function(ev) {
            for (var i = 0; i < changeQueue.length; i++) changeQueue[i](ev);
        };
        ret.updateView = function() {};
        ret.updateElems = function(elems) {
            ret.elems = elems;
            var curr = ret.getValue(),
                currText = ret.getText();
            ret.setValue();
            ret.buildFromElems(true);
            ret.setValue(ret.readValue());
            if (curr) ret.setValue(curr);
            if (currText) {
                var ti = ret.findText(currText);
                if (ti >= 0) ret.setValueIndex(ti);
            }
            if (ret.$el) elems.length ? ret.$el.removeClass('empty') : ret.$el.addClass('empty');
            if (ret.type == 'select') {
                where.onSelectboxUpdate(context, ret.$el, ret);
            }
        };
        return ret;
    };

    where.useValues = function(context, d) {
        var listsObj = context.listsObj;
        for (var field in d) {
            if (!d.hasOwnProperty(field)) continue;
            where.updateStatus(context, field, d[field]);
            var v = null,
                arr = listsObj[field] || [];
            for (var i = 0; i < arr.length; i++) {
                v = v || arr[i].getValue();
            }
            where.updateStatus(context, field, v);
        }
        where.updateForPossibleRows(context, where.widenPossibleRows(context));
        where.updateButtons(context);
    };

    where.widenPossibleRows = function(context, excluded) {
        var possibleRows = returnPossibleRows(context);
        if (context.widenSelection) {
            var priorityList = getPriorityList(context, excluded);
            while (possibleRows.length == 0 && priorityList.length) {
                where.updateStatus(context, priorityList.pop(), null);
                possibleRows = returnPossibleRows(context);
            }
        }
        return possibleRows;
    };

    where.updateForPossibleRows = function(context, possibleRows) {
        where.updateImage(context, possibleRows);
        where.buildRetailerList(context, possibleRows);
        where.checkForLonelyOptions(context);
    };

    where.updateImage = function(context, rows) {
        if (!rows || !rows.length) return;
        var imgRoot = context.config.opts.imageRootDirectory || "";
        var url = imgRoot + rows[0].img;
        var imgs = context.wrapper.find(consts.CN_BOXART);
        imgs.filter('.background').css('background-image', 'url("' + url + '")');
        imgs.not('.background').html('<img src="' + url + '">');
    };

    where.updateButtons = function(context) {
        var v = where.scanComponentValues(context, 'retailers').value;
        where.updateButtonLink(context, v);
        where.updateAnalyticsObject(context);
    };

    where.updateButtonData = function(context) {
        var $button = context.wrapper.find(consts.CN_BUYBUTTON);
        $button.attr({
            'data-platform-id': context.status.platforms,
            'data-bundle-id': context.status.bundles,
            'data-region-id': context.status.regions,
            'data-retailer-id': (context.skuMode) ? 'pricespider' : where.scanComponentValues(context, 'retailers').value
        });
    };

    where.updateButtonLink = function(context, url) {
        var $button = context.wrapper.find(consts.CN_BUYBUTTON);

        if (context.skuMode) {
            $button.attr('target', '').attr('href', '#').removeClass(consts.NORETAILER);
        } else {
            if (url != null) $button.attr('target', '_blank').attr('href', url).removeClass(consts.NORETAILER);
            else $button.attr('target', '').attr('href', '#').addClass(consts.NORETAILER);
            where.checkForLonelyOptions(context);
        }

        where.updateButtonData(context);
    };

    where.scanComponentValues = function(context, field) {
        var arr = context.listsObj[field];
        if (!arr) return {};
        for (var i = 0; i < arr.length; i++) {
            var v = arr[i].getValue();
            if (v) return {
                value: v,
                text: arr[i].getText()
            };
        }
        return {};
    };

    where.updateAnalyticsObject = function(context) {
        if (!ATVI.analytics) return;
        var dd = window.digitalData;
        if (!dd || !context || !context.wrapper) return;

        var format = function(s) {
            return (s || "").trim().toLowerCase().replace(/\s+/g, '-');
        };
        var prod = {},
            attr = prod.attributes = {},
            info = prod.productInfo = {},
            status = context.status || {};
        info.productName = format(context.wrapper.attr('data-product-name') || 'default');
        attr.platform = format(status.platforms);
        attr.region = format(status.regions);
        var retailerLink = context.wrapper.find('.selection-type-retailers select').val();
        if (retailerLink) attr.vendor = format(context.wrapper.find('.selection-type-retailers select option:selected').text()) || retailerLink;
        info.productID = format(status.bundles);
        dd.product = prod;
    };

    where.sendStatusEvent = function(context, ev) {
        if (!ATVI.analytics) return;
        var status = context.status;
        ev = ev || {};
        var data = {};
        if (ev.value) data.value = ev.value;
        if (ev.oldValue) data.old_value = ev.oldValue;
        if (ev.type) data.field = ev.type;
        var details = ATVI.analytics.findComponentId(ev.target ? ev.target : context.wrapper);
        where.sendAnalyticsEvent(context, 'wheretobuy-status-update', details, data);
    };

    where.sendButtonClickEvent = function(context, $el) {
        if (!ATVI.analytics) return;
        var details = ATVI.analytics.findComponentId($el);
        where.updateAnalyticsObject(context);
        where.sendAnalyticsEvent(context, 'wtb-button-click', details, {
            button_text: $el.text().trim()
        });
    };

    where.sendAnalyticsEvent = function(context, type, details, data) {
        if (!ATVI.analytics) return;
        var status = context.status,
            buttonStatus = where.getButtonState(context);
        data.bundle = status.bundles || "";
        var retailerData = where.scanComponentValues(context, 'retailers');
        data.retailer = retailerData.text || "";
        data.retailerLink = retailerData.value || getRetailerLinkFromBundleId(context, data.bundle) || "";
        data.region = status.regions || "";
        data.platform = status.platforms || "";
        ATVI.analytics.sendEvent(type, details, data);
        if (dataLayer && type == 'wtb-button-click') {
            var obj = {
                event: 'purchase',
                category: (buttonStatus) ? buttonStatus : 'purchase',
                action: ATVI.dataLayerGameName + ':' + data.platform,
                label: data.bundle + ':' + data.retailerLink,
                destinationURL: data.retailerLink,
                pageURL: window.location.href,
                gameName: ATVI.dataLayerGameName,
                platform: data.platform,
                productBundle: data.bundle,
                country: data.region,
                itpType: buttonStatus
            };
            dataLayer.push(obj);
        }
    };

    var getRetailerLinkFromBundleId = function(context, bundleId) {
        var d = context.config.data.wtb.rows,
            row = $.grep(d, function(entry) {
                return (entry.regions == context.status.regions && entry.platforms == context.status.platforms && entry.bundles == bundleId);
            });
        if (!row.length) return false;
        return row[0].retailer.link;
    };

    where.onEmptyRetailers = function(context) {
        where.checkEmptyRetailers(context);
        var er = context.wrapper.find(consts.CN_EMPTYRETAILERS);
        if (!er.length) return;
        var arr = context.listsObj.retailers || [];
        for (var i = 0; i < arr.length; i++) {
            arr[i].$el.parents('.selectbox').first().hide();
        }
        if (context.skuMode) er.hide();
        else er.show();
    };



    where.onPopulatedRetailers = function(context) {
        var arr = context.listsObj.retailers || [];
        for (var i = 0; i < arr.length; i++) {
            arr[i].$el.parents('.selectbox').first().show();
        }
        context.wrapper.find(consts.CN_EMPTYRETAILERS).hide();
    };

    where.onSelectboxCreate = function(context, $el, listObj) {
        if (ATVI.plugins.selectric && listObj.type == 'select') {
            $(function() {
                $el.selectric({
                    disableOnMobile: false,
                    nativeOnMobile: false,
                    optionsItemBuilder: function(itemData) {
                        return '<span data-' + consts.DATA_OPTIONID + '="' + itemData.value + '"></span>' + itemData.text;
                    },
                    onInit: function() {
                        where.filterPlatformsByBundle(context);
                        where.filterBundlesByRegion(context);
                    }
                });

                where.checkForLonelyOptions(context);
            });
        } else {
            $el.find('option').each(function() {
                where.cleanText(this);
            });
        }
    };

    where.onSelectboxUpdate = function(context, $el, listObj) {
        $el.find('option').each(function() {
            where.cleanText(this);
        });
        where.refreshSelectBox(context, $el);
    };

    where.onStatusUpdate = function(context, field) {
        if (field == 'regions') where.filterBundlesByRegion(context);
        where.updateButtonData(context);
    };

    where.processSelectionList = function(context, key, list) {
        if (!context.fieldsSorted) {
            context.fieldsSorted = true;
            where.sortFields(context);
            where.sortRows(context);
        }
        return list;
    };


    // ***  UTILS  ***

    where.getContext = function($el) {
        return registry.get($el);
    };

    where.refreshSelectBox = function(context, $el) {
        var bundleId = context.status.bundles,
            platformId = context.status.platforms;
        if (context.wrapper.find(consts.CN_SELECTRICWRAPPER).length) $el.selectric('refresh');

        if ($el.parents(consts.CN_BUNDLESENTRY).length) {
            where.filterPlatformsByBundle(context);
        }

        if (context.wrapper.find(consts.CN_BUNDLECONTENT).length > 1 ||
            context.wrapper.find(consts.CN_PLATFORMCONTENT).length > 1) {
            var $bundleEls = context.wrapper.find(consts.CN_BUNDLECONTENT),
                $platformEls = context.wrapper.find(consts.CN_PLATFORMCONTENT);

            if (bundleId) where.filterContentByType($bundleEls, 'bundle', context.status.bundles);
            if (platformId) where.filterContentByType($platformEls, 'platform', context.status.platforms);
        }

        if (bundleId && context.status.regions) where.filterBundlesByRegion(context);
        if (bundleId && platformId) where.filterButtonText(context);
        context.wrapper.attr({
            'data-current-bundle': context.status.bundles,
            'data-current-platform': context.status.platforms,
            'data-current-region': context.status.regions
        });
    };

    // type === 'bundle' or 'platform'
    where.filterContentByType = function($els, type, id) {
        var $parents = $els.parent();
        if (id == "") id = 'default';
        // find any parents with no matching child >>> show the 'default' child
        $parents.each(function() {
            var thisParent = $(this);
            if (!thisParent.children('[data-' + type + '-id=' + id + ']').length) {
                thisParent.children().hide().filter(function() {
                    return $(this).data(type + '-id') == 'default';
                }).show();
            } else {
                thisParent.children().hide().filter(function() {
                    return $(this).data(type + '-id') == id;
                }).show();
            }
        });
    };

    where.filterBundlesByRegion = function(context) {
        if (!context.wrapper.find(consts.CN_SELECTRICWRAPPER).length) return;
        var rows = context.config.data.wtb.rows,
            bundles = context.listsObj.bundles[0].elems,
            options = context.wrapper.find(consts.CN_BUNDLESENTRY).find(consts.CN_SELECTRICITEMS).find('li'),
            thisRegion = context.status.regions || context.config.opts.defaults.regions,
            i;
        options.removeClass(consts.HIDE);
        for (i = 0; i < bundles.length; i++) {
            var thisBundle = bundles[i].id,
                newBundleArr;
            newBundleArr = $.grep(rows, function(item, j) {
                return (item.regions == thisRegion && item.bundles == thisBundle);
            });
            if (newBundleArr.length) continue;
            else {
                var targetOption;
                targetOption = options.filter(function() {
                    return $(this).find('span').data(consts.DATA_OPTIONID) == thisBundle;
                });
                if (targetOption.length) targetOption.addClass(consts.HIDE);
            }
        }
    };

    where.filterPlatformsByBundle = function(context) {
        if (!context.wrapper.find(consts.CN_SELECTRICWRAPPER).length) return;
        var rows = context.config.data.wtb.rows,
            platforms = context.listsObj.platforms[0].elems,
            platformsEls = context.wrapper.find(consts.CN_PLATFORMSENTRY).find(consts.CN_SELECTRICITEMS).find('li'),
            thisRegion = context.status.regions || context.config.opts.defaults.regions,
            i;
        platformsEls.removeClass(consts.HIDE);
        for (i = 0; i < platforms.length; i++) {
            var thisPlatform = platforms[i].id,
                newPlatformArr = $.grep(rows, function(item, j) {
                    return (item.regions == thisRegion && item.bundles == context.status.bundles && item.platforms == thisPlatform);
                });
            if (newPlatformArr.length) continue;
            else {
                var targetPlatform = platformsEls.filter(function() {
                    return $(this).find('span').data(consts.DATA_OPTIONID) == thisPlatform;
                });
                if (targetPlatform.length) {
                    var selectWrapper = context.wrapper.find(consts.CN_SELECTCONTAINER + consts.CN_PLATFORMSENTRY).find(consts.CN_SELECTRICWRAPPER),
                        $targetSelect = selectWrapper.find('select'),
                        currentIndex = $targetSelect.prop('selectedIndex'),
                        possibleRows = $.grep(rows, function(thing, k) {
                            return (thing.regions == thisRegion && thing.bundles == context.status.bundles)
                        });

                    targetPlatform.addClass(consts.HIDE);

                    if (thisPlatform == context.status.platforms) {
                        var newPlatform = (possibleRows.length) ? possibleRows[0].platforms : false,
                            newIndex;
                        if (newPlatform) {
                            newIndex = $targetSelect.children().filter(function() {
                                return $(this)[0].value == newPlatform
                            }).index();
                            $targetSelect.prop('selectedIndex', newIndex).selectric('refresh');
                            where.updateStatus(context, 'platforms', newPlatform);
                        }
                    }
                }
            }
        }
    };

    where.checkForLonelyOptions = function(context) {
        var rows = context.config.data.wtb.rows,
            obj = context.listsObj;

        $.each(obj, function() {
            var thisNode = $(this),
                fieldName = thisNode[0].field,
                thisRegion = context.status.regions || context.config.opts.defaults.regions;

            if (fieldName === 'retailers' && thisNode[0].elems.length === 1) {
                var url = context.listsObj.retailers[0].elems[0].id,
                    selectWrapper = context.wrapper.find(consts.CN_SELECTCONTAINER + consts.CN_RETAILERSENTRY).find(consts.CN_SELECTRICWRAPPER);

                selectWrapper.find('select').prop('selectedIndex', 1).selectric('refresh');
                where.updateButtonLonelyRetailer(context, url);
            }

            if (fieldName == 'platforms') {
                var platforms = context.listsObj.platforms[0].elems,
                    platformsEls = context.wrapper.find(consts.CN_PLATFORMSENTRY).find(consts.CN_SELECTRICITEMS).find('li'),
                    availablePlatformArr = [],
                    i;

                for (i = 0; i < platforms.length; i++) {
                    var newPlatformArr = $.grep(rows, function(item, j) {
                        return (item.regions == thisRegion && item.bundles == context.status.bundles && item.platforms == platforms[i].id);
                    });
                    if (newPlatformArr.length) {
                        availablePlatformArr.push(platforms[i].id);
                        continue;
                    }
                }
                if (availablePlatformArr.length == 1) {
                    var selectWrapper = context.wrapper.find(consts.CN_SELECTCONTAINER + consts.CN_PLATFORMSENTRY).find(consts.CN_SELECTRICWRAPPER),
                        $targetSelect = selectWrapper.find('select'),
                        index, possibleRows;

                    if (selectWrapper.find('li').length > 1) {
                        index = platformsEls.filter(function() {
                            return $(this).find('span').data(consts.DATA_OPTIONID) == availablePlatformArr[0];
                        }).index();
                    } else index = 1;

                    if ($targetSelect.prop('selectedIndex') == index) return;
                    $targetSelect.prop('selectedIndex', index).selectric('refresh');
                    where.updateStatus(context, 'platforms', availablePlatformArr[0]);
                    i
                }
            }
        });
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

            if (url == '#unavailable' || url == 'unavailable' || url == '') val = 'coming-soon';
            else if (tag.toLowerCase() == 'download') val = 'download';
            else if (dataNode && dataNode.buttonValue && hasOverride && platformMatch) val = dataNode.buttonValue;
            else val = where.bundleBuyButtonStatus.default.buttonValue;

        } else {
            if (url == '#unavailable' || url == 'unavailable' || url == 'coming-soon' || url == '') val = 'coming-soon';
            else if (tag.toLowerCase() == 'download') val = 'download';
            else val = where.bundleBuyButtonStatus.default.buttonValue;
        }

        return val;
    };

    where.filterButtonText = function(context) {
        var $button = context.wrapper.find(consts.CN_BUYBUTTON),
            $spans = context.wrapper.find(consts.CN_BUYBUTTONCONTAINER + ' ' + consts.CN_BUYBUTTONTEXT),
            defaultState = where.bundleBuyButtonStatus.default.buttonValue,
            buttonVal = where.getButtonState(context);

        if (!context.skuMode) where.showRetailerSelection(context);
        where.enableBuyButton(context);
        $spans.hide();

        if (buttonVal != defaultState) {
            where.hideRetailerSelection(context);
            $spans.filter(function() {
                return $(this).data(consts.DATA_BUYBUTTONTEXT) == buttonVal;
            }).show();
        } else {
            $spans.filter(function() {
                return $(this).data(consts.DATA_BUYBUTTONTEXT) == defaultState;
            }).show();
        }

        if (buttonVal == 'coming-soon') where.disableBuyButton(context);
        $button.attr('data-button-type', buttonVal);
    };

    var isOriginalLocale = function(context) {
        return where.config.opts.defaults.regions == context.status.regions;
    };

    where.hideRetailerSelection = function(context, transition) {
        var $el = context.wrapper.find(consts.CN_RETAILERSENTRY);
        if (transition) $el.addClass(consts.HIDE);
        else $el.hide();
    };

    where.showRetailerSelection = function(context, transition) {
        var $el = context.wrapper.find(consts.CN_RETAILERSENTRY);
        if (transition) $el.removeClass(consts.HIDE);
        else $el.show();
    };

    where.disableBuyButton = function(context) {
        context.wrapper.find(consts.CN_BUYBUTTON).addClass('unavailable');
    };

    where.enableBuyButton = function(context) {
        context.wrapper.find(consts.CN_BUYBUTTON).removeClass('unavailable');
    };

    where.updateButtonLonelyRetailer = function(context, url) {
        var $button = context.wrapper.find(consts.CN_BUYBUTTON);

        if (context.skuMode) {
            $button.attr('target', '').attr('href', '#').removeClass(consts.NORETAILER);
        } else {
            if (url != null) $button.attr('target', '_blank').attr('href', url).removeClass(consts.NORETAILER);
            else $button.attr('target', '').attr('href', '#').addClass(consts.NORETAILER);
        }
    };

    where.cleanText = function(el) {
        var $el = $(el),
            div = $('<div>').html($el.html());
        $el.text(div.text());
    };

    where.checkEmptyRetailers = function(context) {
        if (context.skuMode && context.lastSku) return;
    };

    where.sortFields = function(context) {
        if (!where.wtbBundlesOrder && !where.wtbPlatformsOrder) return;
        var obj = context.config.data.wtb,
            allBundles = obj.bundles,
            allPlatforms = obj.platforms;

        var bundleOrder = (where.wtbBundlesOrder) ? $.map(where.wtbBundlesOrder, $.trim) : false,
            platformOrder = (where.wtbPlatformsOrder) ? $.map(where.wtbPlatformsOrder, $.trim) : false;

        // make sure all items are in the array
        if (allBundles.length && bundleOrder.length < allBundles.length + 1) {
            var newArr = [],
                i;
            for (i = 0; i < allBundles.length; i++) {
                var id = (bundleOrder.indexOf(allBundles[i]['id']) == -1) ? allBundles[i]['id'] : undefined;
                if (id) newArr.push(id);
            }
            bundleOrder = bundleOrder.concat(newArr);
        }
        if (allPlatforms.length && platformOrder.length < allPlatforms.length + 1) {
            var newArr = [],
                i;
            for (i = 0; i < allPlatforms.length; i++) {
                var id = (platformOrder.indexOf(allPlatforms[i]['id']) == -1) ? allPlatforms[i]['id'] : undefined;
                if (id) newArr.push(id);
            }
            platformOrder = platformOrder.concat(newArr);
        }

        if (bundleOrder) obj.bundles.sort(getSorter(bundleOrder));
        if (platformOrder) obj.platforms.sort(getSorter(platformOrder));
    };

    var getSorter = function(arr) {
        var index = function(o) {
            return arr.indexOf(o.id) || 100;
        };
        return function(a, b) {
            return index(a) - index(b);
        };
    };

    where.sortRows = function(context) {
        var rows = context.config.data.wtb.rows;

        for (var i = 0; i < rows.length; i++) {
            rows[i].initialIndex = i;
        }

        rows.sort(function(a, b) {
            if (a.bundles == 'standard' && b.bundles == 'standard') {
                return a.retailer.name > b.retailer.name ? 1 : -1;
            }
            return a.initialIndex > b.initialIndex ? 1 : -1;
        });
    };

    where.processDefaultRegion = function(context, defaultRegion) {
        var localeArr = Object.keys(where.localeCodes),
            isLocaleCode = (localeArr.indexOf(defaultRegion) > -1) ? true : false,
            ret = defaultRegion;
        if (isLocaleCode) {
            ret = where.localeCodes[defaultRegion];
        }
        if (where.detectedLocale) {
            ret = where.detectedLocale;
        }
        return ret;
    };

    where.handleLocaleDetection = function(context, obj) {
        where.detectedLocale = ATVI.localeDetector.country;
        var region = where.processDetectedLocale(context);
        if (region != context.status.regions) {
            where.updateStatus(context, 'regions', region);
            where.updateForPossibleRows(context, where.widenPossibleRows(context));
            where.updateButtons(context);
        }
        if (obj.firedAfterPageLoad) where.refreshSelectBox(context, $('.wtb-select.regions-entry select'));
    };

    where.processDetectedLocale = function(context) {
        var str = context.status.regions,
            detectedLocale = where.detectedLocale,
            regionsArr = context.config.data.wtb.regions.map(function(o) {
                return o.id;
            });
        if (regionsArr.indexOf(detectedLocale) > -1 && !ATVI.utils.getQueryParameters().regions) str = detectedLocale;
        return str;
    };

    var getAllRegions = function(context) {
        return context.config.data.wtb.regions.map(function(o) {
            return o.id;
        });
    };

    var getArrayOfSelections = function(context) {
        return context.wrapper.find(consts.CN_SELECTFIELDS).map(function() {
            return {
                type: this.className.match(/selection-type-(\w+)/)[1],
                $el: $(this)
            };
        });
    };

    var uniqueVals = function(val, i, self) {
        return self.indexOf(val) === i;
    };

    var scanForRetailer = function(val, arr) {
        var i;
        for (i = 0; i < arr.length; i++) {
            if (arr[i].id == val) return true;
        }
        return false;
    };

    var objectValuesPolyfill = function(obj) {
        var arr = [];
        $.each(obj, function(k, v) {
            arr.push(v);
        });
        return arr;
    };

})(jQuery, ATVI);


ATVI.library.registerLibrary("wtb-component");
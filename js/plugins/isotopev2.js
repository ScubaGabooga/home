
/*!
 * Isotope v2.0.1
 * Filter & sort magical layouts
 * http://isotope.metafizzy.co
 */

/**
 * Isotope v1.5.25
 */
(function(a, b, c) {
    "use strict";
    var d = a.document,
        e = a.Modernizr,
        f = function(a) {
            return a.charAt(0).toUpperCase() + a.slice(1)
        },
        g = "Moz Webkit O Ms".split(" "),
        h = function(a) {
            var b = d.documentElement.style,
                c;
            if (typeof b[a] == "string") return a;
            a = f(a);
            for (var e = 0, h = g.length; e < h; e++) {
                c = g[e] + a;
                if (typeof b[c] == "string") return c
            }
        },
        i = h("transform"),
        j = h("transitionProperty"),
        k = {
            csstransforms: function() {
                return !!i
            },
            csstransitions: function() {
                return !!j
            }
        },
        l;
    if (e)
        for (l in k) e.hasOwnProperty(l) || e.addTest(l, k[l]);
    else {
        e = a.Modernizr = {
            _version: "1.6ish: miniModernizr for Isotope"
        };
        var m = " ",
            n;
        for (l in k) n = k[l](), e[l] = n, m += " " + (n ? "" : "no-") + l;
        b("html").addClass(m)
    }
    if (e.csstransforms) {
        var o = e.csstransforms3d ? {
                translate: function(a) {
                    return "translate3d(" + a[0] + "px, " + a[1] + "px, 0) "
                },
                scale: function(a) {
                    return "scale3d(" + a + ", " + a + ", 1) "
                }
            } : {
                translate: function(a) {
                    return "translate(" + a[0] + "px, " + a[1] + "px) "
                },
                scale: function(a) {
                    return "scale(" + a + ") "
                }
            },
            p = function(a, c, d) {
                var e = b.data(a, "isoTransform") || {},
                    f = {},
                    g, h = {},
                    j;
                f[c] = d, b.extend(e, f);
                for (g in e) j = e[g], h[g] = o[g](j);
                var k = h.translate || "",
                    l = h.scale || "",
                    m = k + l;
                b.data(a, "isoTransform", e), a.style[i] = m
            };
        b.cssNumber.scale = !0, b.cssHooks.scale = {
            set: function(a, b) {
                p(a, "scale", b)
            },
            get: function(a, c) {
                var d = b.data(a, "isoTransform");
                return d && d.scale ? d.scale : 1
            }
        }, b.fx.step.scale = function(a) {
            b.cssHooks.scale.set(a.elem, a.now + a.unit)
        }, b.cssNumber.translate = !0, b.cssHooks.translate = {
            set: function(a, b) {
                p(a, "translate", b)
            },
            get: function(a, c) {
                var d = b.data(a, "isoTransform");
                return d && d.translate ? d.translate : [0, 0]
            }
        }
    }
    var q, r;
    e.csstransitions && (q = {
        WebkitTransitionProperty: "webkitTransitionEnd",
        MozTransitionProperty: "transitionend",
        OTransitionProperty: "oTransitionEnd otransitionend",
        transitionProperty: "transitionend"
    }[j], r = h("transitionDuration"));

    b.Isotope = function(a, c, d) {
        this.element = b(c), this._create(a), this._init(d)
    };
    var v = ["width", "height"],
        w = b(a);
    b.Isotope.settings = {
        resizable: !0,
        layoutMode: "masonry",
        containerClass: "isotope",
        itemClass: "isotope-item",
        hiddenClass: "isotope-hidden",
        hiddenStyle: {
            opacity: 0,
            scale: .001
        },
        visibleStyle: {
            opacity: 1,
            scale: 1
        },
        containerStyle: {
            position: "relative",
            overflow: "hidden"
        },
        animationEngine: "best-available",
        animationOptions: {
            queue: !1,
            duration: 800
        },
        sortBy: "original-order",
        sortAscending: !0,
        resizesContainer: !0,
        transformsEnabled: !0,
        itemPositionDataEnabled: !1
    }, b.Isotope.prototype = {
        _create: function(a) {
            this.options = b.extend({}, b.Isotope.settings, a), this.styleQueue = [], this.elemCount = 0;
            var c = this.element[0].style;
            this.originalStyle = {};
            var d = v.slice(0);
            for (var e in this.options.containerStyle) d.push(e);
            for (var f = 0, g = d.length; f < g; f++) e = d[f], this.originalStyle[e] = c[e] || "";
            this.element.css(this.options.containerStyle), this._updateAnimationEngine(), this._updateUsingTransforms();
            var h = {
                "original-order": function(a, b) {
                    return b.elemCount++, b.elemCount
                },
                random: function() {
                    return Math.random()
                }
            };
            this.options.getSortData = b.extend(this.options.getSortData, h), this.reloadItems(), this.offset = {
                left: parseInt(this.element.css("padding-left") || 0, 10),
                top: parseInt(this.element.css("padding-top") || 0, 10)
            };
            var i = this;
            setTimeout(function() {
                i.element.addClass(i.options.containerClass)
            }, 0), this.options.resizable && w.bind("smartresize.isotope", function() {
                i.resize()
            }), this.element.delegate("." + this.options.hiddenClass, "click", function() {
                return !1
            })
        },
        _getAtoms: function(a) {
            var b = this.options.itemSelector,
                c = b ? a.filter(b).add(a.find(b)) : a,
                d = {
                    position: "absolute"
                };
            return c = c.filter(function(a, b) {
                return b.nodeType === 1
            }), this.usingTransforms && (d.left = 0, d.top = 0), c.css(d).addClass(this.options.itemClass), this.updateSortData(c, !0), c
        },
        _init: function(a) {
            this.$filteredAtoms = this._filter(this.$allAtoms), this._sort(), this.reLayout(a)
        },
        option: function(a) {
            if (b.isPlainObject(a)) {
                this.options = b.extend(!0, this.options, a);
                var c;
                for (var d in a) c = "_update" + f(d), this[c] && this[c]()
            }
        },
        _updateAnimationEngine: function() {
            var a = this.options.animationEngine.toLowerCase().replace(/[ _\-]/g, ""),
                b;
            switch (a) {
                case "css":
                case "none":
                    b = !1;
                    break;
                case "jquery":
                    b = !0;
                    break;
                default:
                    b = !e.csstransitions
            }
            this.isUsingJQueryAnimation = b, this._updateUsingTransforms()
        },
        _updateTransformsEnabled: function() {
            this._updateUsingTransforms()
        },
        _updateUsingTransforms: function() {
            var a = this.usingTransforms = this.options.transformsEnabled && e.csstransforms && e.csstransitions && !this.isUsingJQueryAnimation;
            a || (delete this.options.hiddenStyle.scale, delete this.options.visibleStyle.scale), this.getPositionStyles = a ? this._translate : this._positionAbs
        },
        _filter: function(a) {
            var b = this.options.filter === "" ? "*" : this.options.filter;
            if (!b) return a;
            var c = this.options.hiddenClass,
                d = "." + c,
                e = a.filter(d),
                f = e;
            if (b !== "*") {
                f = e.filter(b);
                var g = a.not(d).not(b).addClass(c);
                this.styleQueue.push({
                    $el: g,
                    style: this.options.hiddenStyle
                })
            }
            return this.styleQueue.push({
                $el: f,
                style: this.options.visibleStyle
            }), f.removeClass(c), a.filter(b)
        },
        updateSortData: function(a, c) {
            var d = this,
                e = this.options.getSortData,
                f, g;
            a.each(function() {
                f = b(this), g = {};
                for (var a in e) !c && a === "original-order" ? g[a] = b.data(this, "isotope-sort-data")[a] : g[a] = e[a](f, d);
                b.data(this, "isotope-sort-data", g)
            })
        },
        _sort: function() {
            var a = this.options.sortBy,
                b = this._getSorter,
                c = this.options.sortAscending ? 1 : -1,
                d = function(d, e) {
                    var f = b(d, a),
                        g = b(e, a);
                    return f === g && a !== "original-order" && (f = b(d, "original-order"), g = b(e, "original-order")), (f > g ? 1 : f < g ? -1 : 0) * c
                };
            this.$filteredAtoms.sort(d)
        },

        
        _getSorter: function(a, c) {
            return b.data(a, "isotope-sort-data")[c]
        },
        _positionAbs: function(a, b) {
            return {
                left: a,
                top: b
            }
        },
        _pushPosition: function(a, b, c) {
            b = Math.round(b + this.offset.left), c = Math.round(c + this.offset.top);
            var d = this.getPositionStyles(b, c);
            this.styleQueue.push({
                $el: a,
                style: d
            }), this.options.itemPositionDataEnabled && a.data("isotope-item-position", {
                x: b,
                y: c
            })
        },
        layout: function(a, b) {
            var c = this.options.layoutMode;
            this["_" + c + "Layout"](a);
            if (this.options.resizesContainer) {
                var d = this["_" + c + "GetContainerSize"]();
                this.styleQueue.push({
                    $el: this.element,
                    style: d
                })
            }
            this._processStyleQueue(a, b), this.isLaidOut = !0
        },
        _processStyleQueue: function(a, c) {
            var d = this.isLaidOut ? this.isUsingJQueryAnimation ? "animate" : "css" : "css",
                f = this.options.animationOptions,
                g = this.options.onLayout,
                h, i, j, k;
            i = function(a, b) {
                b.$el[d](b.style, f)
            };
            if (this._isInserting && this.isUsingJQueryAnimation) i = function(a, b) {
                h = b.$el.hasClass("no-transition") ? "css" : d, b.$el[h](b.style, f)
            };
            else if (c || g || f.complete) {
                var l = !1,
                    m = [c, g, f.complete],
                    n = this;
                j = !0, k = function() {
                    if (l) return;
                    var b;
                    for (var c = 0, d = m.length; c < d; c++) b = m[c], typeof b == "function" && b.call(n.element, a, n);
                    l = !0
                };
                if (this.isUsingJQueryAnimation && d === "animate") f.complete = k, j = !1;
                else if (e.csstransitions) {
                    var o = 0,
                        p = this.styleQueue[0],
                        s = p && p.$el,
                        t;
                    while (!s || !s.length) {
                        t = this.styleQueue[o++];
                        if (!t) return;
                        s = t.$el
                    }
                    var u = parseFloat(getComputedStyle(s[0])[r]);
                    u > 0 && (i = function(a, b) {
                        b.$el[d](b.style, f).one(q, k)
                    }, j = !1)
                }
            }
            b.each(this.styleQueue, i), j && k(), this.styleQueue = []
        },
        reLayout: function(a) {
            this["_" + this.options.layoutMode + "Reset"](), this.layout(this.$filteredAtoms, a)
        },
        reloadItems: function() {
            this.$allAtoms = this._getAtoms(this.element.children())
        },
        _getSegments: function(a) {
            var b = this.options.layoutMode,
                c = a ? "rowHeight" : "columnWidth",
                d = a ? "height" : "width",
                e = a ? "rows" : "cols",
                g = this.element[d](),
                h, i = this.options[b] && this.options[b][c] || this.$filteredAtoms["outer" + f(d)](!0) || g;
            h = Math.floor(g / i), h = Math.max(h, 1), this[b][e] = h, this[b][c] = i
        },
        _masonryReset: function() {
            this.masonry = {}, this._getSegments();
            var a = this.masonry.cols;
            this.masonry.colYs = [];
            while (a--) this.masonry.colYs.push(0)
        },
        _masonryLayout: function(a) {
            var c = this,
                d = c.masonry;
            a.each(function() {
                var a = b(this),
                    e = Math.ceil(a.outerWidth(!0) / d.columnWidth);
                e = Math.min(e, d.cols);
                if (e === 1) c._masonryPlaceBrick(a, d.colYs);
                else {
                    var f = d.cols + 1 - e,
                        g = [],
                        h, i;
                    for (i = 0; i < f; i++) h = d.colYs.slice(i, i + e), g[i] = Math.max.apply(Math, h);
                    c._masonryPlaceBrick(a, g)
                }
            })
        },
        _masonryPlaceBrick: function(a, b) {
            var c = Math.min.apply(Math, b),
                d = 0;
            for (var e = 0, f = b.length; e < f; e++)
                if (b[e] === c) {
                    d = e;
                    break
                }
            var g = this.masonry.columnWidth * d,
                h = c;
            this._pushPosition(a, g, h);
            var i = c + a.outerHeight(!0),
                j = this.masonry.cols + 1 - f;
            for (e = 0; e < j; e++) this.masonry.colYs[d + e] = i
        },
        _masonryGetContainerSize: function() {
            var a = Math.max.apply(Math, this.masonry.colYs);
            return {
                height: a
            }
        }
    };


    











    var x = function(b) {
        a.console && a.console.error(b)
    };
    b.fn.isotope = function(a, c) {
        if (typeof a == "string") {
            var d = Array.prototype.slice.call(arguments, 1);
            this.each(function() {
                var c = b.data(this, "isotope");
                if (!c) {
                    x("cannot call methods on isotope prior to initialization; attempted to call method '" + a + "'");
                    return
                }
                if (!b.isFunction(c[a]) || a.charAt(0) === "_") {
                    x("no such method '" + a + "' for isotope instance");
                    return
                }
                c[a].apply(c, d)
            })
        } else this.each(function() {
            var d = b.data(this, "isotope");
            d ? (d.option(a), d._init(c)) : b.data(this, "isotope", new b.Isotope(a, this, c))
        });
        return this;
    }
})(window, jQuery);
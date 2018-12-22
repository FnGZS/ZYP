var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
    return typeof t;
} : function(t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
};

!function(t, e) {
    "object" === ("undefined" == typeof exports ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : t.WeCropper = e();
}(void 0, function() {
    var o = void 0, e = [ "touchstarted", "touchmoved", "touchended" ];
    function l(t) {
        return "function" == typeof t;
    }
    function r(o) {
        for (var n = [], t = arguments.length - 1; 0 < t--; ) n[t] = arguments[t + 1];
        e.forEach(function(t, e) {
            void 0 !== n[e] && (o[t] = n[e]);
        });
    }
    var n = {}, a = {
        id: {
            default: "cropper",
            get: function() {
                return n.id;
            },
            set: function(t) {
                "string" != typeof t && console.error("id：" + t + " is invalid"), n.id = t;
            }
        },
        width: {
            default: 750,
            get: function() {
                return n.width;
            },
            set: function(t) {
                "number" != typeof t && console.error("width：" + t + " is invalid"), n.width = t;
            }
        },
        height: {
            default: 750,
            get: function() {
                return n.height;
            },
            set: function(t) {
                "number" != typeof t && console.error("height：" + t + " is invalid"), n.height = t;
            }
        },
        scale: {
            default: 2.5,
            get: function() {
                return n.scale;
            },
            set: function(t) {
                "number" != typeof t && console.error("scale：" + t + " is invalid"), n.scale = t;
            }
        },
        zoom: {
            default: 5,
            get: function() {
                return n.zoom;
            },
            set: function(t) {
                "number" != typeof t ? console.error("zoom：" + t + " is invalid") : (t < 0 || 10 < t) && console.error("zoom should be ranged in 0 ~ 10"), 
                n.zoom = t;
            }
        },
        src: {
            default: "cropper",
            get: function() {
                return n.src;
            },
            set: function(t) {
                "string" != typeof t && console.error("id：" + t + " is invalid"), n.src = t;
            }
        },
        cut: {
            default: {},
            get: function() {
                return n.cut;
            },
            set: function(t) {
                "object" !== (void 0 === t ? "undefined" : _typeof(t)) && console.error("id：" + t + " is invalid"), 
                n.cut = t;
            }
        },
        onReady: {
            default: null,
            get: function() {
                return n.ready;
            },
            set: function(t) {
                n.ready = t;
            }
        },
        onBeforeImageLoad: {
            default: null,
            get: function() {
                return n.beforeImageLoad;
            },
            set: function(t) {
                n.beforeImageLoad = t;
            }
        },
        onImageLoad: {
            default: null,
            get: function() {
                return n.imageLoad;
            },
            set: function(t) {
                n.imageLoad = t;
            }
        },
        onBeforeDraw: {
            default: null,
            get: function() {
                return n.beforeDraw;
            },
            set: function(t) {
                n.beforeDraw = t;
            }
        }
    };
    var f = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};
    var t, i = (function(u, h) {
        !function(t) {
            var e = h, o = u && u.exports == e && u, n = "object" == (void 0 === f ? "undefined" : _typeof(f)) && f;
            n.global !== n && n.window !== n || (t = n);
            var r = function(t) {
                this.message = t;
            };
            (r.prototype = new Error()).name = "InvalidCharacterError";
            var d = function(t) {
                throw new r(t);
            }, s = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", c = /[\t\n\f\r ]/g, a = {
                encode: function(t) {
                    t = String(t), /[^\0-\xFF]/.test(t) && d("The string to be encoded contains characters outside of the Latin1 range.");
                    for (var e, o, n, r, a = t.length % 3, i = "", c = -1, u = t.length - a; ++c < u; ) e = t.charCodeAt(c) << 16, 
                    o = t.charCodeAt(++c) << 8, n = t.charCodeAt(++c), i += s.charAt((r = e + o + n) >> 18 & 63) + s.charAt(r >> 12 & 63) + s.charAt(r >> 6 & 63) + s.charAt(63 & r);
                    return 2 == a ? (e = t.charCodeAt(c) << 8, o = t.charCodeAt(++c), i += s.charAt((r = e + o) >> 10) + s.charAt(r >> 4 & 63) + s.charAt(r << 2 & 63) + "=") : 1 == a && (r = t.charCodeAt(c), 
                    i += s.charAt(r >> 2) + s.charAt(r << 4 & 63) + "=="), i;
                },
                decode: function(t) {
                    var e = (t = String(t).replace(c, "")).length;
                    e % 4 == 0 && (e = (t = t.replace(/==?$/, "")).length), (e % 4 == 1 || /[^+a-zA-Z0-9/]/.test(t)) && d("Invalid character: the string to be decoded is not correctly encoded.");
                    for (var o, n, r = 0, a = "", i = -1; ++i < e; ) n = s.indexOf(t.charAt(i)), o = r % 4 ? 64 * o + n : n, 
                    r++ % 4 && (a += String.fromCharCode(255 & o >> (-2 * r & 6)));
                    return a;
                },
                version: "0.1.0"
            };
            if (e && !e.nodeType) if (o) o.exports = a; else for (var i in a) a.hasOwnProperty(i) && (e[i] = a[i]); else t.base64 = a;
        }(f);
    }(t = {
        exports: {}
    }, t.exports), t.exports);
    function x(t) {
        var e = "";
        if ("string" == typeof t) e = t; else for (var o = 0; o < t.length; o++) e += String.fromCharCode(t[o]);
        return i.encode(e);
    }
    function c(t, e, o, n, r, a, i) {
        var c, u, d, s, h, f;
        void 0 === i && (i = function() {}), void 0 === a && (a = "png"), a = "image/" + a.toLowerCase().replace(/jpg/i, "jpeg").match(/png|jpeg|bmp|gif/)[0], 
        /bmp/.test(a) ? (c = t, u = e, d = o, s = n, h = r, f = function(t) {
            var e = function(t) {
                var e = t.width, o = t.height, n = e * o * 3, r = n + 54, a = [ 66, 77, 255 & r, r >> 8 & 255, r >> 16 & 255, r >> 24 & 255, 0, 0, 0, 0, 54, 0, 0, 0 ], i = [ 40, 0, 0, 0, 255 & e, e >> 8 & 255, e >> 16 & 255, e >> 24 & 255, 255 & o, o >> 8 & 255, o >> 16 & 255, o >> 24 & 255, 1, 0, 24, 0, 0, 0, 0, 0, 255 & n, n >> 8 & 255, n >> 16 & 255, n >> 24 & 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ], c = (4 - 3 * e % 4) % 4, u = t.data, d = "", s = e << 2, h = o, f = String.fromCharCode;
                do {
                    for (var l = s * (h - 1), g = "", v = 0; v < e; v++) {
                        var p = v << 2;
                        g += f(u[l + p + 2]) + f(u[l + p + 1]) + f(u[l + p]);
                    }
                    for (var y = 0; y < c; y++) g += String.fromCharCode(0);
                    d += g;
                } while (--h);
                return x(a.concat(i)) + x(d);
            }(t);
            l(i) && i("data:" + ("image/" + a) + ";base64," + e);
        }, wx.canvasGetImageData({
            canvasId: c,
            x: u,
            y: d,
            width: s,
            height: h,
            success: function(t) {
                f(t);
            },
            fail: function(t) {
                f(null), console.error("canvasGetImageData error: " + t);
            }
        })) : console.error("暂不支持生成'" + a + "'类型的base64图片");
    }
    var g = function(t, e) {
        return void 0 === t && (t = {}), void 0 === e && (e = function() {}), c(t.canvasId, t.x, t.y, t.width, t.height, "bmp", e);
    };
    var u = {
        touchStart: function(t) {
            var e = t.touches, o = e[0], n = e[1];
            r(this, !0, null, null), this.__oneTouchStart(o), 2 <= t.touches.length && this.__twoTouchStart(o, n);
        },
        touchMove: function(t) {
            var e = t.touches, o = e[0], n = e[1];
            r(this, null, !0), 1 === t.touches.length && this.__oneTouchMove(o), 2 <= t.touches.length && this.__twoTouchMove(o, n);
        },
        touchEnd: function(t) {
            r(this, !1, !1, !0), this.__xtouchEnd();
        }
    };
    var d = function(t) {
        var e, o, n = this, r = {};
        return e = n, o = a, Object.defineProperties(e, o), Object.keys(a).forEach(function(t) {
            r[t] = a[t].default;
        }), Object.assign(n, r, t), n.prepare(), n.attachPage(), n.createCtx(), n.observer(), 
        n.cutt(), n.methods(), n.init(), n.update(), n;
    };
    return d.prototype.init = function() {
        var t = this, e = t.src;
        return t.version = "1.2.0", "function" == typeof t.onReady && t.onReady(t.ctx, t), 
        e && t.pushOrign(e), r(t, !1, !1, !1), t.oldScale = 1, t.newScale = 1, t;
    }, Object.assign(d.prototype, u), d.prototype.prepare = function() {
        var e = this, t = (o || (o = wx.getSystemInfoSync()), o).windowWidth;
        e.attachPage = function() {
            var t = getCurrentPages();
            t[t.length - 1].wecropper = e;
        }, e.createCtx = function() {
            var t = e.id;
            t ? e.ctx = wx.createCanvasContext(t) : console.error("constructor: create canvas context failed, 'id' must be valuable");
        }, e.deviceRadio = t / 750;
    }, d.prototype.observer = function() {
        var n = this, r = [ "ready", "beforeImageLoad", "beforeDraw", "imageLoad" ];
        n.on = function(t, e) {
            var o;
            return -1 < r.indexOf(t) ? "function" == typeof e && ("ready" === t ? e(n) : n["on" + (o = t, 
            o.charAt(0).toUpperCase() + o.slice(1))] = e) : console.error("event: " + t + " is invalid"), 
            n;
        };
    }, d.prototype.methods = function() {
        var a = this, i = a.id, c = a.deviceRadio, t = a.width, e = a.height, o = a.cut, u = o.x;
        void 0 === u && (u = 0);
        var d = o.y;
        void 0 === d && (d = 0);
        var s = o.width;
        void 0 === s && (s = t);
        var h = o.height;
        void 0 === h && (h = e), a.updateCanvas = function() {
            return a.croperTarget && a.ctx.drawImage(a.croperTarget, a.imgLeft, a.imgTop, a.scaleWidth, a.scaleHeight), 
            l(a.onBeforeDraw) && a.onBeforeDraw(a.ctx, a), a.setBoundStyle(), a.ctx.draw(), 
            a;
        }, a.pushOrign = function(t) {
            return a.src = t, l(a.onBeforeImageLoad) && a.onBeforeImageLoad(a.ctx, a), wx.getImageInfo({
                src: t,
                success: function(t) {
                    var e = t.width / t.height;
                    a.croperTarget = t.path, e < s / h ? (a.rectX = u, a.baseWidth = s, a.baseHeight = s / e, 
                    a.rectY = d - Math.abs((h - a.baseHeight) / 2)) : (a.rectY = d, a.baseWidth = h * e, 
                    a.baseHeight = h, a.rectX = u - Math.abs((s - a.baseWidth) / 2)), a.imgLeft = a.rectX, 
                    a.imgTop = a.rectY, a.scaleWidth = a.baseWidth, a.scaleHeight = a.baseHeight, a.updateCanvas(), 
                    l(a.onImageLoad) && a.onImageLoad(a.ctx, a);
                }
            }), a.update(), a;
        }, a.getCropperBase64 = function(t) {
            void 0 === t && (t = function() {}), g({
                canvasId: i,
                x: u,
                y: d,
                width: s,
                height: h
            }, t);
        }, a.getCropperImage = function() {
            for (var t = [], e = arguments.length; e--; ) t[e] = arguments[e];
            var o = toString.call(t[0]), n = t[t.length - 1];
            switch (o) {
              case "[object Object]":
                var r = t[0].quality;
                void 0 === r && (r = 10), "number" != typeof r ? console.error("quality：" + r + " is invalid") : (r < 0 || 10 < r) && console.error("quality should be ranged in 0 ~ 10"), 
                wx.canvasToTempFilePath({
                    canvasId: i,
                    x: u,
                    y: d,
                    width: s,
                    height: h,
                    destWidth: s * r / (10 * c),
                    destHeight: h * r / (10 * c),
                    success: function(t) {
                        l(n) && n.call(a, t.tempFilePath);
                    },
                    fail: function(t) {
                        l(n) && n.call(a, null);
                    }
                });
                break;

              case "[object Function]":
                wx.canvasToTempFilePath({
                    canvasId: i,
                    x: u,
                    y: d,
                    width: s,
                    height: h,
                    destWidth: s / c,
                    destHeight: h / c,
                    success: function(t) {
                        l(n) && n.call(a, t.tempFilePath);
                    },
                    fail: function(t) {
                        l(n) && n.call(a, null);
                    }
                });
            }
            return a;
        };
    }, d.prototype.cutt = function() {
        var a = this, i = a.width, c = a.height, t = a.cut, u = t.x;
        void 0 === u && (u = 0);
        var d = t.y;
        void 0 === d && (d = 0);
        var s = t.width;
        void 0 === s && (s = i);
        var h = t.height;
        void 0 === h && (h = c), a.outsideBound = function(t, e) {
            a.imgLeft = u <= t ? u : a.scaleWidth + t - u <= s ? u + s - a.scaleWidth : t, a.imgTop = d <= e ? d : a.scaleHeight + e - d <= h ? d + h - a.scaleHeight : e;
        }, a.setBoundStyle = function(t) {
            void 0 === t && (t = {});
            var e = t.color;
            void 0 === e && (e = "#04b00f");
            var o = t.mask;
            void 0 === o && (o = "rgba(0, 0, 0, 0.3)");
            var n = t.lineWidth;
            void 0 === n && (n = 1);
            var r = [ {
                start: {
                    x: u - n,
                    y: d + 10 - n
                },
                step1: {
                    x: u - n,
                    y: d - n
                },
                step2: {
                    x: u + 10 - n,
                    y: d - n
                }
            }, {
                start: {
                    x: u - n,
                    y: d + h - 10 + n
                },
                step1: {
                    x: u - n,
                    y: d + h + n
                },
                step2: {
                    x: u + 10 - n,
                    y: d + h + n
                }
            }, {
                start: {
                    x: u + s - 10 + n,
                    y: d - n
                },
                step1: {
                    x: u + s + n,
                    y: d - n
                },
                step2: {
                    x: u + s + n,
                    y: d + 10 - n
                }
            }, {
                start: {
                    x: u + s + n,
                    y: d + h - 10 + n
                },
                step1: {
                    x: u + s + n,
                    y: d + h + n
                },
                step2: {
                    x: u + s - 10 + n,
                    y: d + h + n
                }
            } ];
            a.ctx.beginPath(), a.ctx.setFillStyle(o), a.ctx.fillRect(0, 0, u, c), a.ctx.fillRect(u, 0, s, d), 
            a.ctx.fillRect(u, d + h, s, c - d - h), a.ctx.fillRect(u + s, 0, i - u - s, c), 
            a.ctx.fill(), r.forEach(function(t) {
                a.ctx.beginPath(), a.ctx.setStrokeStyle(e), a.ctx.setLineWidth(n), a.ctx.moveTo(t.start.x, t.start.y), 
                a.ctx.lineTo(t.step1.x, t.step1.y), a.ctx.lineTo(t.step2.x, t.step2.y), a.ctx.stroke();
            });
        };
    }, d.prototype.update = function() {
        var v = this;
        v.src && (v.__oneTouchStart = function(t) {
            v.touchX0 = Math.round(t.x), v.touchY0 = Math.round(t.y);
        }, v.__oneTouchMove = function(t) {
            var e, o;
            if (v.touchended) return v.updateCanvas();
            e = Math.round(t.x - v.touchX0), o = Math.round(t.y - v.touchY0);
            var n = Math.round(v.rectX + e), r = Math.round(v.rectY + o);
            v.outsideBound(n, r), v.updateCanvas();
        }, v.__twoTouchStart = function(t, e) {
            var o, n, r;
            v.touchX1 = Math.round(v.rectX + v.scaleWidth / 2), v.touchY1 = Math.round(v.rectY + v.scaleHeight / 2), 
            o = Math.round(e.x - t.x), n = Math.round(e.y - t.y), r = Math.round(Math.sqrt(o * o + n * n)), 
            v.oldDistance = r;
        }, v.__twoTouchMove = function(t, e) {
            var o, n, r, a, i, c, u, d = v.oldScale, s = v.oldDistance, h = v.scale, f = v.zoom;
            v.newScale = (o = d, n = s, r = f, a = t, i = e, c = Math.round(i.x - a.x), u = Math.round(i.y - a.y), 
            o + .001 * r * (Math.round(Math.sqrt(c * c + u * u)) - n)), v.newScale <= 1 && (v.newScale = 1), 
            v.newScale >= h && (v.newScale = h), v.scaleWidth = Math.round(v.newScale * v.baseWidth), 
            v.scaleHeight = Math.round(v.newScale * v.baseHeight);
            var l = Math.round(v.touchX1 - v.scaleWidth / 2), g = Math.round(v.touchY1 - v.scaleHeight / 2);
            v.outsideBound(l, g), v.updateCanvas();
        }, v.__xtouchEnd = function() {
            v.oldScale = v.newScale, v.rectX = v.imgLeft, v.rectY = v.imgTop;
        });
    }, d;
});
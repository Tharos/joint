/*! JointJS v3.0.4 (2019-08-02) - JavaScript diagramming library


This Source Code Form is subject to the terms of the Mozilla Public
License, v. 2.0. If a copy of the MPL was not distributed with this
file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('backbone'), require('lodash'), require('jquery')) :
    typeof define === 'function' && define.amd ? define(['exports', 'backbone', 'lodash', 'jquery'], factory) :
    (global = global || self, factory(global.joint = {}, global.Backbone, global._, global.$));
}(this, function (exports, Backbone, _, $) { 'use strict';

    Backbone = Backbone && Backbone.hasOwnProperty('default') ? Backbone['default'] : Backbone;
    _ = _ && _.hasOwnProperty('default') ? _['default'] : _;
    $ = $ && $.hasOwnProperty('default') ? $['default'] : $;

    // https://tc39.github.io/ecma262/#sec-array.prototype.includes
    if (!Array.prototype.includes) {
        Object.defineProperty(Array.prototype, 'includes', {
            value: function(searchElement, fromIndex) {

                // 1. Let O be ? ToObject(this value).
                if (this == null) {
                    throw new TypeError('"this" is null or not defined');
                }

                var o = Object(this);

                // 2. Let len be ? ToLength(? Get(O, "length")).
                var len = o.length >>> 0;

                // 3. If len is 0, return false.
                if (len === 0) {
                    return false;
                }

                // 4. Let n be ? ToInteger(fromIndex).
                //    (If fromIndex is undefined, this step produces the value 0.)
                var n = fromIndex | 0;

                // 5. If n ≥ 0, then
                //  a. Let k be n.
                // 6. Else n < 0,
                //  a. Let k be len + n.
                //  b. If k < 0, let k be 0.
                var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

                function sameValueZero(x, y) {
                    return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
                }

                // 7. Repeat, while k < len
                while (k < len) {
                    // a. Let elementK be the result of ? Get(O, ! ToString(k)).
                    // b. If SameValueZero(searchElement, elementK) is true, return true.
                    // c. Increase k by 1.
                    if (sameValueZero(o[k], searchElement)) {
                        return true;
                    }
                    k++;
                }

                // 8. Return false
                return false;
            }
        });
    }

    // https://tc39.github.io/ecma262/#sec-array.prototype.find
    if (!Array.prototype.find) {
        Object.defineProperty(Array.prototype, 'find', {
            value: function(predicate) {
                // 1. Let O be ? ToObject(this value).
                if (this == null) {
                    throw new TypeError('"this" is null or not defined');
                }

                var o = Object(this);

                // 2. Let len be ? ToLength(? Get(O, "length")).
                var len = o.length >>> 0;

                // 3. If IsCallable(predicate) is false, throw a TypeError exception.
                if (typeof predicate !== 'function') {
                    throw new TypeError('predicate must be a function');
                }

                // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
                var thisArg = arguments[1];

                // 5. Let k be 0.
                var k = 0;

                // 6. Repeat, while k < len
                while (k < len) {
                    // a. Let Pk be ! ToString(k).
                    // b. Let kValue be ? Get(O, Pk).
                    // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                    // d. If testResult is true, return kValue.
                    var kValue = o[k];
                    if (predicate.call(thisArg, kValue, k, o)) {
                        return kValue;
                    }
                    // e. Increase k by 1.
                    k++;
                }

                // 7. Return undefined.
                return undefined;
            }
        });
    }

    // Production steps of ECMA-262, Edition 6, 22.1.2.1
    if (!Array.from) {
        Array.from = (function() {
            var toStr = Object.prototype.toString;
            var isCallable = function(fn) {
                return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
            };
            var toInteger = function(value) {
                var number = Number(value);
                if (isNaN(number)) { return 0; }
                if (number === 0 || !isFinite(number)) { return number; }
                return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
            };
            var maxSafeInteger = Math.pow(2, 53) - 1;
            var toLength = function(value) {
                var len = toInteger(value);
                return Math.min(Math.max(len, 0), maxSafeInteger);
            };

            // The length property of the from method is 1.
            return function from(arrayLike/*, mapFn, thisArg */) {
                // 1. Let C be the this value.
                var C = this;

                // 2. Let items be ToObject(arrayLike).
                var items = Object(arrayLike);

                // 3. ReturnIfAbrupt(items).
                if (arrayLike == null) {
                    throw new TypeError('Array.from requires an array-like object - not null or undefined');
                }

                // 4. If mapfn is undefined, then let mapping be false.
                var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
                var T;
                if (typeof mapFn !== 'undefined') {
                    // 5. else
                    // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
                    if (!isCallable(mapFn)) {
                        throw new TypeError('Array.from: when provided, the second argument must be a function');
                    }

                    // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
                    if (arguments.length > 2) {
                        T = arguments[2];
                    }
                }

                // 10. Let lenValue be Get(items, "length").
                // 11. Let len be ToLength(lenValue).
                var len = toLength(items.length);

                // 13. If IsConstructor(C) is true, then
                // 13. a. Let A be the result of calling the [[Construct]] internal method
                // of C with an argument list containing the single item len.
                // 14. a. Else, Let A be ArrayCreate(len).
                var A = isCallable(C) ? Object(new C(len)) : new Array(len);

                // 16. Let k be 0.
                var k = 0;
                // 17. Repeat, while k < len… (also steps a - h)
                var kValue;
                while (k < len) {
                    kValue = items[k];
                    if (mapFn) {
                        A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
                    } else {
                        A[k] = kValue;
                    }
                    k += 1;
                }
                // 18. Let putStatus be Put(A, "length", len, true).
                A.length = len;
                // 20. Return A.
                return A;
            };
        }());
    }

    // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
    if (!Array.prototype.findIndex) {
        Object.defineProperty(Array.prototype, 'findIndex', {
            value: function(predicate) {
                // 1. Let O be ? ToObject(this value).
                if (this == null) {
                    throw new TypeError('"this" is null or not defined');
                }

                var o = Object(this);

                // 2. Let len be ? ToLength(? Get(O, "length")).
                var len = o.length >>> 0;

                // 3. If IsCallable(predicate) is false, throw a TypeError exception.
                if (typeof predicate !== 'function') {
                    throw new TypeError('predicate must be a function');
                }

                // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
                var thisArg = arguments[1];

                // 5. Let k be 0.
                var k = 0;

                // 6. Repeat, while k < len
                while (k < len) {
                    // a. Let Pk be ! ToString(k).
                    // b. Let kValue be ? Get(O, Pk).
                    // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                    // d. If testResult is true, return k.
                    var kValue = o[k];
                    if (predicate.call(thisArg, kValue, k, o)) {
                        return k;
                    }
                    // e. Increase k by 1.
                    k++;
                }

                // 7. Return -1.
                return -1;
            }
        });
    }

    (function() {

        /**
         * version: 0.3.0
         * git://github.com/davidchambers/Base64.js.git
         */

        var object = typeof exports != 'undefined' ? exports : this; // #8: web workers
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

        function InvalidCharacterError(message) {
            this.message = message;
        }

        InvalidCharacterError.prototype = new Error;
        InvalidCharacterError.prototype.name = 'InvalidCharacterError';

        // encoder
        // [https://gist.github.com/999166] by [https://github.com/nignag]
        object.btoa || (
            object.btoa = function(input) {
                var str = String(input);
                for (
                    // initialize result and counter
                    var block, charCode, idx = 0, map = chars, output = '';
                    // if the next str index does not exist:
                    //   change the mapping table to "="
                    //   check if d has no fractional digits
                    str.charAt(idx | 0) || (map = '=', idx % 1);
                    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
                    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
                ) {
                    charCode = str.charCodeAt(idx += 3 / 4);
                    if (charCode > 0xFF) {
                        throw new InvalidCharacterError('\'btoa\' failed: The string to be encoded contains characters outside of the Latin1 range.');
                    }
                    block = block << 8 | charCode;
                }
                return output;
            });

        // decoder
        // [https://gist.github.com/1020396] by [https://github.com/atk]
        object.atob || (
            object.atob = function(input) {
                var str = String(input).replace(/=+$/, '');
                if (str.length % 4 == 1) {
                    throw new InvalidCharacterError('\'atob\' failed: The string to be decoded is not correctly encoded.');
                }
                for (
                    // initialize result and counters
                    var bc = 0, bs, buffer, idx = 0, output = '';
                    // get next character
                    // eslint-disable-next-line no-cond-assign
                    buffer = str.charAt(idx++);
                    // character found in table? initialize bit storage and add its ascii value;
                    ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
                    // and if not first of each 4 characters,
                    // convert the first 8 bits to one ascii character
                    bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
                ) {
                    // try to find character in table (0-63, not found => -1)
                    buffer = chars.indexOf(buffer);
                }
                return output;
            });

    }());

    Number.isFinite = Number.isFinite || function(value) {
        return typeof value === 'number' && isFinite(value);
    };

    //The following works because NaN is the only value in javascript which is not equal to itself.
    Number.isNaN = Number.isNaN || function(value) {
        return value !== value;
    };

    if (!String.prototype.includes) {
        String.prototype.includes = function(search, start) {
            if (typeof start !== 'number') {
                start = 0;
            }

            if (start + search.length > this.length) {
                return false;
            } else {
                return this.indexOf(search, start) !== -1;
            }
        };
    }

    if (!String.prototype.startsWith) {
        String.prototype.startsWith = function(searchString, position){
            return this.substr(position || 0, searchString.length) === searchString;
        };
    }

    (function() {

        if (typeof Uint8Array !== 'undefined' || typeof window === 'undefined') {
            return;
        }

        function subarray(start, end) {
            return this.slice(start, end);
        }

        function set_(array, offset) {

            if (arguments.length < 2) {
                offset = 0;
            }
            for (var i = 0, n = array.length; i < n; ++i, ++offset) {
                this[offset] = array[i] & 0xFF;
            }
        }

        // we need typed arrays
        function TypedArray(arg1) {

            var result;
            if (typeof arg1 === 'number') {
                result = new Array(arg1);
                for (var i = 0; i < arg1; ++i) {
                    result[i] = 0;
                }
            } else {
                result = arg1.slice(0);
            }
            result.subarray = subarray;
            result.buffer = result;
            result.byteLength = result.length;
            result.set = set_;
            if (typeof arg1 === 'object' && arg1.buffer) {
                result.buffer = arg1.buffer;
            }

            return result;
        }

        window.Uint8Array = TypedArray;
        window.Uint32Array = TypedArray;
        window.Int32Array = TypedArray;
    })();

    /**
     * make xhr.response = 'arraybuffer' available for the IE9
     */
    (function() {

        if (typeof XMLHttpRequest === 'undefined') {
            return;
        }

        if ('response' in XMLHttpRequest.prototype ||
            'mozResponseArrayBuffer' in XMLHttpRequest.prototype ||
            'mozResponse' in XMLHttpRequest.prototype ||
            'responseArrayBuffer' in XMLHttpRequest.prototype) {
            return;
        }

        Object.defineProperty(XMLHttpRequest.prototype, 'response', {
            get: function() {
                /* global VBArray:true */
                return new Uint8Array(new VBArray(this.responseBody).toArray());
            }
        });
    })();

    // Geometry library.
    // -----------------

    // Declare shorthands to the most used math functions.
    var math = Math;
    var abs = math.abs;
    var cos = math.cos;
    var sin = math.sin;
    var sqrt = math.sqrt;
    var min = math.min;
    var max = math.max;
    var atan2 = math.atan2;
    var round = math.round;
    var floor = math.floor;
    var PI = math.PI;
    var pow = math.pow;

    var bezier = {

        // Cubic Bezier curve path through points.
        // @deprecated
        // @param {array} points Array of points through which the smooth line will go.
        // @return {array} SVG Path commands as an array
        curveThroughPoints: function(points) {

            console.warn('deprecated');

            return new Path(Curve.throughPoints(points)).serialize();
        },

        // Get open-ended Bezier Spline Control Points.
        // @deprecated
        // @param knots Input Knot Bezier spline points (At least two points!).
        // @param firstControlPoints Output First Control points. Array of knots.length - 1 length.
        // @param secondControlPoints Output Second Control points. Array of knots.length - 1 length.
        getCurveControlPoints: function(knots) {

            console.warn('deprecated');

            var firstControlPoints = [];
            var secondControlPoints = [];
            var n = knots.length - 1;
            var i;

            // Special case: Bezier curve should be a straight line.
            if (n == 1) {
                // 3P1 = 2P0 + P3
                firstControlPoints[0] = new Point(
                    (2 * knots[0].x + knots[1].x) / 3,
                    (2 * knots[0].y + knots[1].y) / 3
                );

                // P2 = 2P1 – P0
                secondControlPoints[0] = new Point(
                    2 * firstControlPoints[0].x - knots[0].x,
                    2 * firstControlPoints[0].y - knots[0].y
                );

                return [firstControlPoints, secondControlPoints];
            }

            // Calculate first Bezier control points.
            // Right hand side vector.
            var rhs = [];

            // Set right hand side X values.
            for (i = 1; i < n - 1; i++) {
                rhs[i] = 4 * knots[i].x + 2 * knots[i + 1].x;
            }

            rhs[0] = knots[0].x + 2 * knots[1].x;
            rhs[n - 1] = (8 * knots[n - 1].x + knots[n].x) / 2.0;

            // Get first control points X-values.
            var x = this.getFirstControlPoints(rhs);

            // Set right hand side Y values.
            for (i = 1; i < n - 1; ++i) {
                rhs[i] = 4 * knots[i].y + 2 * knots[i + 1].y;
            }

            rhs[0] = knots[0].y + 2 * knots[1].y;
            rhs[n - 1] = (8 * knots[n - 1].y + knots[n].y) / 2.0;

            // Get first control points Y-values.
            var y = this.getFirstControlPoints(rhs);

            // Fill output arrays.
            for (i = 0; i < n; i++) {
                // First control point.
                firstControlPoints.push(new Point(x[i], y[i]));

                // Second control point.
                if (i < n - 1) {
                    secondControlPoints.push(new Point(
                        2 * knots [i + 1].x - x[i + 1],
                        2 * knots[i + 1].y - y[i + 1]
                    ));

                } else {
                    secondControlPoints.push(new Point(
                        (knots[n].x + x[n - 1]) / 2,
                        (knots[n].y + y[n - 1]) / 2)
                    );
                }
            }

            return [firstControlPoints, secondControlPoints];
        },

        // Divide a Bezier curve into two at point defined by value 't' <0,1>.
        // Using deCasteljau algorithm. http://math.stackexchange.com/a/317867
        // @deprecated
        // @param control points (start, control start, control end, end)
        // @return a function that accepts t and returns 2 curves.
        getCurveDivider: function(p0, p1, p2, p3) {

            console.warn('deprecated');

            var curve = new Curve(p0, p1, p2, p3);

            return function divideCurve(t) {

                var divided = curve.divide(t);

                return [{
                    p0: divided[0].start,
                    p1: divided[0].controlPoint1,
                    p2: divided[0].controlPoint2,
                    p3: divided[0].end
                }, {
                    p0: divided[1].start,
                    p1: divided[1].controlPoint1,
                    p2: divided[1].controlPoint2,
                    p3: divided[1].end
                }];
            };
        },

        // Solves a tridiagonal system for one of coordinates (x or y) of first Bezier control points.
        // @deprecated
        // @param rhs Right hand side vector.
        // @return Solution vector.
        getFirstControlPoints: function(rhs) {

            console.warn('deprecated');

            var n = rhs.length;
            // `x` is a solution vector.
            var x = [];
            var tmp = [];
            var b = 2.0;

            x[0] = rhs[0] / b;

            // Decomposition and forward substitution.
            for (var i = 1; i < n; i++) {
                tmp[i] = 1 / b;
                b = (i < n - 1 ? 4.0 : 3.5) - tmp[i];
                x[i] = (rhs[i] - x[i - 1]) / b;
            }

            for (i = 1; i < n; i++) {
                // Backsubstitution.
                x[n - i - 1] -= tmp[n - i] * x[n - i];
            }

            return x;
        },

        // Solves an inversion problem -- Given the (x, y) coordinates of a point which lies on
        // a parametric curve x = x(t)/w(t), y = y(t)/w(t), ﬁnd the parameter value t
        // which corresponds to that point.
        // @deprecated
        // @param control points (start, control start, control end, end)
        // @return a function that accepts a point and returns t.
        getInversionSolver: function(p0, p1, p2, p3) {

            console.warn('deprecated');

            var curve = new Curve(p0, p1, p2, p3);

            return function solveInversion(p) {

                return curve.closestPointT(p);
            };
        }
    };

    var Curve = function(p1, p2, p3, p4) {

        if (!(this instanceof Curve)) {
            return new Curve(p1, p2, p3, p4);
        }

        if (p1 instanceof Curve) {
            return new Curve(p1.start, p1.controlPoint1, p1.controlPoint2, p1.end);
        }

        this.start = new Point(p1);
        this.controlPoint1 = new Point(p2);
        this.controlPoint2 = new Point(p3);
        this.end = new Point(p4);
    };

    // Curve passing through points.
    // Ported from C# implementation by Oleg V. Polikarpotchkin and Peter Lee (http://www.codeproject.com/KB/graphics/BezierSpline.aspx).
    // @param {array} points Array of points through which the smooth line will go.
    // @return {array} curves.
    Curve.throughPoints = (function() {

        // Get open-ended Bezier Spline Control Points.
        // @param knots Input Knot Bezier spline points (At least two points!).
        // @param firstControlPoints Output First Control points. Array of knots.length - 1 length.
        // @param secondControlPoints Output Second Control points. Array of knots.length - 1 length.
        function getCurveControlPoints(knots) {

            var firstControlPoints = [];
            var secondControlPoints = [];
            var n = knots.length - 1;
            var i;

            // Special case: Bezier curve should be a straight line.
            if (n == 1) {
                // 3P1 = 2P0 + P3
                firstControlPoints[0] = new Point(
                    (2 * knots[0].x + knots[1].x) / 3,
                    (2 * knots[0].y + knots[1].y) / 3
                );

                // P2 = 2P1 – P0
                secondControlPoints[0] = new Point(
                    2 * firstControlPoints[0].x - knots[0].x,
                    2 * firstControlPoints[0].y - knots[0].y
                );

                return [firstControlPoints, secondControlPoints];
            }

            // Calculate first Bezier control points.
            // Right hand side vector.
            var rhs = [];

            // Set right hand side X values.
            for (i = 1; i < n - 1; i++) {
                rhs[i] = 4 * knots[i].x + 2 * knots[i + 1].x;
            }

            rhs[0] = knots[0].x + 2 * knots[1].x;
            rhs[n - 1] = (8 * knots[n - 1].x + knots[n].x) / 2.0;

            // Get first control points X-values.
            var x = getFirstControlPoints(rhs);

            // Set right hand side Y values.
            for (i = 1; i < n - 1; ++i) {
                rhs[i] = 4 * knots[i].y + 2 * knots[i + 1].y;
            }

            rhs[0] = knots[0].y + 2 * knots[1].y;
            rhs[n - 1] = (8 * knots[n - 1].y + knots[n].y) / 2.0;

            // Get first control points Y-values.
            var y = getFirstControlPoints(rhs);

            // Fill output arrays.
            for (i = 0; i < n; i++) {
                // First control point.
                firstControlPoints.push(new Point(x[i], y[i]));

                // Second control point.
                if (i < n - 1) {
                    secondControlPoints.push(new Point(
                        2 * knots [i + 1].x - x[i + 1],
                        2 * knots[i + 1].y - y[i + 1]
                    ));

                } else {
                    secondControlPoints.push(new Point(
                        (knots[n].x + x[n - 1]) / 2,
                        (knots[n].y + y[n - 1]) / 2
                    ));
                }
            }

            return [firstControlPoints, secondControlPoints];
        }

        // Solves a tridiagonal system for one of coordinates (x or y) of first Bezier control points.
        // @param rhs Right hand side vector.
        // @return Solution vector.
        function getFirstControlPoints(rhs) {

            var n = rhs.length;
            // `x` is a solution vector.
            var x = [];
            var tmp = [];
            var b = 2.0;

            x[0] = rhs[0] / b;

            // Decomposition and forward substitution.
            for (var i = 1; i < n; i++) {
                tmp[i] = 1 / b;
                b = (i < n - 1 ? 4.0 : 3.5) - tmp[i];
                x[i] = (rhs[i] - x[i - 1]) / b;
            }

            for (i = 1; i < n; i++) {
                // Backsubstitution.
                x[n - i - 1] -= tmp[n - i] * x[n - i];
            }

            return x;
        }

        return function(points) {

            if (!points || (Array.isArray(points) && points.length < 2)) {
                throw new Error('At least 2 points are required');
            }

            var controlPoints = getCurveControlPoints(points);

            var curves = [];
            var n = controlPoints[0].length;
            for (var i = 0; i < n; i++) {

                var controlPoint1 = new Point(controlPoints[0][i].x, controlPoints[0][i].y);
                var controlPoint2 = new Point(controlPoints[1][i].x, controlPoints[1][i].y);

                curves.push(new Curve(points[i], controlPoint1, controlPoint2, points[i + 1]));
            }

            return curves;
        };
    })();

    Curve.prototype = {

        // Returns a bbox that tightly envelops the curve.
        bbox: function() {

            var start = this.start;
            var controlPoint1 = this.controlPoint1;
            var controlPoint2 = this.controlPoint2;
            var end = this.end;

            var x0 = start.x;
            var y0 = start.y;
            var x1 = controlPoint1.x;
            var y1 = controlPoint1.y;
            var x2 = controlPoint2.x;
            var y2 = controlPoint2.y;
            var x3 = end.x;
            var y3 = end.y;

            var points = new Array(); // local extremes
            var tvalues = new Array(); // t values of local extremes
            var bounds = [new Array(), new Array()];

            var a, b, c, t;
            var t1, t2;
            var b2ac, sqrtb2ac;

            for (var i = 0; i < 2; ++i) {

                if (i === 0) {
                    b = 6 * x0 - 12 * x1 + 6 * x2;
                    a = -3 * x0 + 9 * x1 - 9 * x2 + 3 * x3;
                    c = 3 * x1 - 3 * x0;

                } else {
                    b = 6 * y0 - 12 * y1 + 6 * y2;
                    a = -3 * y0 + 9 * y1 - 9 * y2 + 3 * y3;
                    c = 3 * y1 - 3 * y0;
                }

                if (abs(a) < 1e-12) { // Numerical robustness
                    if (abs(b) < 1e-12) { // Numerical robustness
                        continue;
                    }

                    t = -c / b;
                    if ((0 < t) && (t < 1)) { tvalues.push(t); }

                    continue;
                }

                b2ac = b * b - 4 * c * a;
                sqrtb2ac = sqrt(b2ac);

                if (b2ac < 0) { continue; }

                t1 = (-b + sqrtb2ac) / (2 * a);
                if ((0 < t1) && (t1 < 1)) { tvalues.push(t1); }

                t2 = (-b - sqrtb2ac) / (2 * a);
                if ((0 < t2) && (t2 < 1)) { tvalues.push(t2); }
            }

            var j = tvalues.length;
            var jlen = j;
            var mt;
            var x, y;

            while (j--) {
                t = tvalues[j];
                mt = 1 - t;

                x = (mt * mt * mt * x0) + (3 * mt * mt * t * x1) + (3 * mt * t * t * x2) + (t * t * t * x3);
                bounds[0][j] = x;

                y = (mt * mt * mt * y0) + (3 * mt * mt * t * y1) + (3 * mt * t * t * y2) + (t * t * t * y3);
                bounds[1][j] = y;

                points[j] = { X: x, Y: y };
            }

            tvalues[jlen] = 0;
            tvalues[jlen + 1] = 1;

            points[jlen] = { X: x0, Y: y0 };
            points[jlen + 1] = { X: x3, Y: y3 };

            bounds[0][jlen] = x0;
            bounds[1][jlen] = y0;

            bounds[0][jlen + 1] = x3;
            bounds[1][jlen + 1] = y3;

            tvalues.length = jlen + 2;
            bounds[0].length = jlen + 2;
            bounds[1].length = jlen + 2;
            points.length = jlen + 2;

            var left = min.apply(null, bounds[0]);
            var top = min.apply(null, bounds[1]);
            var right = max.apply(null, bounds[0]);
            var bottom = max.apply(null, bounds[1]);

            return new Rect(left, top, (right - left), (bottom - top));
        },

        clone: function() {

            return new Curve(this.start, this.controlPoint1, this.controlPoint2, this.end);
        },

        // Returns the point on the curve closest to point `p`
        closestPoint: function(p, opt) {

            return this.pointAtT(this.closestPointT(p, opt));
        },

        closestPointLength: function(p, opt) {

            opt = opt || {};
            var precision = (opt.precision === undefined) ? this.PRECISION : opt.precision;
            var subdivisions = (opt.subdivisions === undefined) ? this.getSubdivisions({ precision: precision }) : opt.subdivisions;
            var localOpt = { precision: precision, subdivisions: subdivisions };

            return this.lengthAtT(this.closestPointT(p, localOpt), localOpt);
        },

        closestPointNormalizedLength: function(p, opt) {

            opt = opt || {};
            var precision = (opt.precision === undefined) ? this.PRECISION : opt.precision;
            var subdivisions = (opt.subdivisions === undefined) ? this.getSubdivisions({ precision: precision }) : opt.subdivisions;
            var localOpt = { precision: precision, subdivisions: subdivisions };

            var cpLength = this.closestPointLength(p, localOpt);
            if (!cpLength) { return 0; }

            var length = this.length(localOpt);
            if (length === 0) { return 0; }

            return cpLength / length;
        },

        // Returns `t` of the point on the curve closest to point `p`
        closestPointT: function(p, opt) {

            opt = opt || {};
            var precision = (opt.precision === undefined) ? this.PRECISION : opt.precision;
            var subdivisions = (opt.subdivisions === undefined) ? this.getSubdivisions({ precision: precision }) : opt.subdivisions;
            // does not use localOpt

            // identify the subdivision that contains the point:
            var investigatedSubdivision;
            var investigatedSubdivisionStartT; // assume that subdivisions are evenly spaced
            var investigatedSubdivisionEndT;
            var distFromStart; // distance of point from start of baseline
            var distFromEnd; // distance of point from end of baseline
            var chordLength; // distance between start and end of the subdivision
            var minSumDist; // lowest observed sum of the two distances
            var n = subdivisions.length;
            var subdivisionSize = (n ? (1 / n) : 0);
            for (var i = 0; i < n; i++) {

                var currentSubdivision = subdivisions[i];

                var startDist = currentSubdivision.start.distance(p);
                var endDist = currentSubdivision.end.distance(p);
                var sumDist = startDist + endDist;

                // check that the point is closest to current subdivision and not any other
                if (!minSumDist || (sumDist < minSumDist)) {
                    investigatedSubdivision = currentSubdivision;

                    investigatedSubdivisionStartT = i * subdivisionSize;
                    investigatedSubdivisionEndT = (i + 1) * subdivisionSize;

                    distFromStart = startDist;
                    distFromEnd = endDist;

                    chordLength = currentSubdivision.start.distance(currentSubdivision.end);

                    minSumDist = sumDist;
                }
            }

            var precisionRatio = pow(10, -precision);

            // recursively divide investigated subdivision:
            // until distance between baselinePoint and closest path endpoint is within 10^(-precision)
            // then return the closest endpoint of that final subdivision
            while (true) {

                // check if we have reached at least one required observed precision
                // - calculated as: the difference in distances from point to start and end divided by the distance
                // - note that this function is not monotonic = it doesn't converge stably but has "teeth"
                // - the function decreases while one of the endpoints is fixed but "jumps" whenever we switch
                // - this criterion works well for points lying far away from the curve
                var startPrecisionRatio = (distFromStart ? (abs(distFromStart - distFromEnd) / distFromStart) : 0);
                var endPrecisionRatio = (distFromEnd ? (abs(distFromStart - distFromEnd) / distFromEnd) : 0);
                var hasRequiredPrecision = ((startPrecisionRatio < precisionRatio) || (endPrecisionRatio < precisionRatio));

                // check if we have reached at least one required minimal distance
                // - calculated as: the subdivision chord length multiplied by precisionRatio
                // - calculation is relative so it will work for arbitrarily large/small curves and their subdivisions
                // - this is a backup criterion that works well for points lying "almost at" the curve
                var hasMinimalStartDistance = (distFromStart ? (distFromStart < (chordLength * precisionRatio)) : true);
                var hasMinimalEndDistance = (distFromEnd ? (distFromEnd < (chordLength * precisionRatio)) : true);
                var hasMinimalDistance = (hasMinimalStartDistance || hasMinimalEndDistance);

                // do we stop now?
                if (hasRequiredPrecision || hasMinimalDistance) {
                    return ((distFromStart <= distFromEnd) ? investigatedSubdivisionStartT : investigatedSubdivisionEndT);
                }

                // otherwise, set up for next iteration
                var divided = investigatedSubdivision.divide(0.5);
                subdivisionSize /= 2;

                var startDist1 = divided[0].start.distance(p);
                var endDist1 = divided[0].end.distance(p);
                var sumDist1 = startDist1 + endDist1;

                var startDist2 = divided[1].start.distance(p);
                var endDist2 = divided[1].end.distance(p);
                var sumDist2 = startDist2 + endDist2;

                if (sumDist1 <= sumDist2) {
                    investigatedSubdivision = divided[0];

                    investigatedSubdivisionEndT -= subdivisionSize; // subdivisionSize was already halved

                    distFromStart = startDist1;
                    distFromEnd = endDist1;

                } else {
                    investigatedSubdivision = divided[1];

                    investigatedSubdivisionStartT += subdivisionSize; // subdivisionSize was already halved

                    distFromStart = startDist2;
                    distFromEnd = endDist2;
                }
            }
        },

        closestPointTangent: function(p, opt) {

            return this.tangentAtT(this.closestPointT(p, opt));
        },

        // Returns `true` if the area surrounded by the curve contains the point `p`.
        // Implements the even-odd algorithm (self-intersections are "outside").
        // Closes open curves (always imagines a closing segment).
        // Precision may be adjusted by passing an `opt` object.
        containsPoint: function(p, opt) {

            var polyline = this.toPolyline(opt);
            return polyline.containsPoint(p);
        },

        // Divides the curve into two at requested `ratio` between 0 and 1 with precision better than `opt.precision`; optionally using `opt.subdivisions` provided.
        // For a function that uses `t`, use Curve.divideAtT().
        divideAt: function(ratio, opt) {

            if (ratio <= 0) { return this.divideAtT(0); }
            if (ratio >= 1) { return this.divideAtT(1); }

            var t = this.tAt(ratio, opt);

            return this.divideAtT(t);
        },

        // Divides the curve into two at requested `length` with precision better than requested `opt.precision`; optionally using `opt.subdivisions` provided.
        divideAtLength: function(length, opt) {

            var t = this.tAtLength(length, opt);

            return this.divideAtT(t);
        },

        // Divides the curve into two at point defined by `t` between 0 and 1.
        // Using de Casteljau's algorithm (http://math.stackexchange.com/a/317867).
        // Additional resource: https://pomax.github.io/bezierinfo/#decasteljau
        divideAtT: function(t) {

            var start = this.start;
            var controlPoint1 = this.controlPoint1;
            var controlPoint2 = this.controlPoint2;
            var end = this.end;

            // shortcuts for `t` values that are out of range
            if (t <= 0) {
                return [
                    new Curve(start, start, start, start),
                    new Curve(start, controlPoint1, controlPoint2, end)
                ];
            }

            if (t >= 1) {
                return [
                    new Curve(start, controlPoint1, controlPoint2, end),
                    new Curve(end, end, end, end)
                ];
            }

            var dividerPoints = this.getSkeletonPoints(t);

            var startControl1 = dividerPoints.startControlPoint1;
            var startControl2 = dividerPoints.startControlPoint2;
            var divider = dividerPoints.divider;
            var dividerControl1 = dividerPoints.dividerControlPoint1;
            var dividerControl2 = dividerPoints.dividerControlPoint2;

            // return array with two new curves
            return [
                new Curve(start, startControl1, startControl2, divider),
                new Curve(divider, dividerControl1, dividerControl2, end)
            ];
        },

        // Returns the distance between the curve's start and end points.
        endpointDistance: function() {

            return this.start.distance(this.end);
        },

        // Checks whether two curves are exactly the same.
        equals: function(c) {

            return !!c &&
                this.start.x === c.start.x &&
                this.start.y === c.start.y &&
                this.controlPoint1.x === c.controlPoint1.x &&
                this.controlPoint1.y === c.controlPoint1.y &&
                this.controlPoint2.x === c.controlPoint2.x &&
                this.controlPoint2.y === c.controlPoint2.y &&
                this.end.x === c.end.x &&
                this.end.y === c.end.y;
        },

        // Returns five helper points necessary for curve division.
        getSkeletonPoints: function(t) {

            var start = this.start;
            var control1 = this.controlPoint1;
            var control2 = this.controlPoint2;
            var end = this.end;

            // shortcuts for `t` values that are out of range
            if (t <= 0) {
                return {
                    startControlPoint1: start.clone(),
                    startControlPoint2: start.clone(),
                    divider: start.clone(),
                    dividerControlPoint1: control1.clone(),
                    dividerControlPoint2: control2.clone()
                };
            }

            if (t >= 1) {
                return {
                    startControlPoint1: control1.clone(),
                    startControlPoint2: control2.clone(),
                    divider: end.clone(),
                    dividerControlPoint1: end.clone(),
                    dividerControlPoint2: end.clone()
                };
            }

            var midpoint1 = (new Line(start, control1)).pointAt(t);
            var midpoint2 = (new Line(control1, control2)).pointAt(t);
            var midpoint3 = (new Line(control2, end)).pointAt(t);

            var subControl1 = (new Line(midpoint1, midpoint2)).pointAt(t);
            var subControl2 = (new Line(midpoint2, midpoint3)).pointAt(t);

            var divider = (new Line(subControl1, subControl2)).pointAt(t);

            var output = {
                startControlPoint1: midpoint1,
                startControlPoint2: subControl1,
                divider: divider,
                dividerControlPoint1: subControl2,
                dividerControlPoint2: midpoint3
            };

            return output;
        },

        // Returns a list of curves whose flattened length is better than `opt.precision`.
        // That is, observed difference in length between recursions is less than 10^(-3) = 0.001 = 0.1%
        // (Observed difference is not real precision, but close enough as long as special cases are covered)
        // (That is why skipping iteration 1 is important)
        // As a rule of thumb, increasing `precision` by 1 requires two more division operations
        // - Precision 0 (endpointDistance) - total of 2^0 - 1 = 0 operations (1 subdivision)
        // - Precision 1 (<10% error) - total of 2^2 - 1 = 3 operations (4 subdivisions)
        // - Precision 2 (<1% error) - total of 2^4 - 1 = 15 operations requires 4 division operations on all elements (15 operations total) (16 subdivisions)
        // - Precision 3 (<0.1% error) - total of 2^6 - 1 = 63 operations - acceptable when drawing (64 subdivisions)
        // - Precision 4 (<0.01% error) - total of 2^8 - 1 = 255 operations - high resolution, can be used to interpolate `t` (256 subdivisions)
        // (Variation of 1 recursion worse or better is possible depending on the curve, doubling/halving the number of operations accordingly)
        getSubdivisions: function(opt) {

            opt = opt || {};
            var precision = (opt.precision === undefined) ? this.PRECISION : opt.precision;
            // not using opt.subdivisions
            // not using localOpt

            var subdivisions = [new Curve(this.start, this.controlPoint1, this.controlPoint2, this.end)];
            if (precision === 0) { return subdivisions; }

            var previousLength = this.endpointDistance();

            var precisionRatio = pow(10, -precision);

            // recursively divide curve at `t = 0.5`
            // until the difference between observed length at subsequent iterations is lower than precision
            var iteration = 0;
            while (true) {
                iteration += 1;

                // divide all subdivisions
                var newSubdivisions = [];
                var numSubdivisions = subdivisions.length;
                for (var i = 0; i < numSubdivisions; i++) {

                    var currentSubdivision = subdivisions[i];
                    var divided = currentSubdivision.divide(0.5); // dividing at t = 0.5 (not at middle length!)
                    newSubdivisions.push(divided[0], divided[1]);
                }

                // measure new length
                var length = 0;
                var numNewSubdivisions = newSubdivisions.length;
                for (var j = 0; j < numNewSubdivisions; j++) {

                    var currentNewSubdivision = newSubdivisions[j];
                    length += currentNewSubdivision.endpointDistance();
                }

                // check if we have reached required observed precision
                // sine-like curves may have the same observed length in iteration 0 and 1 - skip iteration 1
                // not a problem for further iterations because cubic curves cannot have more than two local extrema
                // (i.e. cubic curves cannot intersect the baseline more than once)
                // therefore two subsequent iterations cannot produce sampling with equal length
                var observedPrecisionRatio = ((length !== 0) ? ((length - previousLength) / length) : 0);
                if (iteration > 1 && observedPrecisionRatio < precisionRatio) {
                    return newSubdivisions;
                }

                // otherwise, set up for next iteration
                subdivisions = newSubdivisions;
                previousLength = length;
            }
        },

        isDifferentiable: function() {

            var start = this.start;
            var control1 = this.controlPoint1;
            var control2 = this.controlPoint2;
            var end = this.end;

            return !(start.equals(control1) && control1.equals(control2) && control2.equals(end));
        },

        // Returns flattened length of the curve with precision better than `opt.precision`; or using `opt.subdivisions` provided.
        length: function(opt) {

            opt = opt || {};
            var precision = (opt.precision === undefined) ? this.PRECISION : opt.precision; // opt.precision only used in getSubdivisions() call
            var subdivisions = (opt.subdivisions === undefined) ? this.getSubdivisions({ precision: precision }) : opt.subdivisions;
            // not using localOpt

            var length = 0;
            var n = subdivisions.length;
            for (var i = 0; i < n; i++) {

                var currentSubdivision = subdivisions[i];
                length += currentSubdivision.endpointDistance();
            }

            return length;
        },

        // Returns distance along the curve up to `t` with precision better than requested `opt.precision`. (Not using `opt.subdivisions`.)
        lengthAtT: function(t, opt) {

            if (t <= 0) { return 0; }

            opt = opt || {};
            var precision = (opt.precision === undefined) ? this.PRECISION : opt.precision;
            // not using opt.subdivisions
            // not using localOpt

            var subCurve = this.divide(t)[0];
            var subCurveLength = subCurve.length({ precision: precision });

            return subCurveLength;
        },

        // Returns point at requested `ratio` between 0 and 1 with precision better than `opt.precision`; optionally using `opt.subdivisions` provided.
        // Mirrors Line.pointAt() function.
        // For a function that tracks `t`, use Curve.pointAtT().
        pointAt: function(ratio, opt) {

            if (ratio <= 0) { return this.start.clone(); }
            if (ratio >= 1) { return this.end.clone(); }

            var t = this.tAt(ratio, opt);

            return this.pointAtT(t);
        },

        // Returns point at requested `length` with precision better than requested `opt.precision`; optionally using `opt.subdivisions` provided.
        pointAtLength: function(length, opt) {

            var t = this.tAtLength(length, opt);

            return this.pointAtT(t);
        },

        // Returns the point at provided `t` between 0 and 1.
        // `t` does not track distance along curve as it does in Line objects.
        // Non-linear relationship, speeds up and slows down as curve warps!
        // For linear length-based solution, use Curve.pointAt().
        pointAtT: function(t) {

            if (t <= 0) { return this.start.clone(); }
            if (t >= 1) { return this.end.clone(); }

            return this.getSkeletonPoints(t).divider;
        },

        // Default precision
        PRECISION: 3,

        scale: function(sx, sy, origin) {

            this.start.scale(sx, sy, origin);
            this.controlPoint1.scale(sx, sy, origin);
            this.controlPoint2.scale(sx, sy, origin);
            this.end.scale(sx, sy, origin);
            return this;
        },

        // Returns a tangent line at requested `ratio` with precision better than requested `opt.precision`; or using `opt.subdivisions` provided.
        tangentAt: function(ratio, opt) {

            if (!this.isDifferentiable()) { return null; }

            if (ratio < 0) { ratio = 0; }
            else if (ratio > 1) { ratio = 1; }

            var t = this.tAt(ratio, opt);

            return this.tangentAtT(t);
        },

        // Returns a tangent line at requested `length` with precision better than requested `opt.precision`; or using `opt.subdivisions` provided.
        tangentAtLength: function(length, opt) {

            if (!this.isDifferentiable()) { return null; }

            var t = this.tAtLength(length, opt);

            return this.tangentAtT(t);
        },

        // Returns a tangent line at requested `t`.
        tangentAtT: function(t) {

            if (!this.isDifferentiable()) { return null; }

            if (t < 0) { t = 0; }
            else if (t > 1) { t = 1; }

            var skeletonPoints = this.getSkeletonPoints(t);

            var p1 = skeletonPoints.startControlPoint2;
            var p2 = skeletonPoints.dividerControlPoint1;

            var tangentStart = skeletonPoints.divider;

            var tangentLine = new Line(p1, p2);
            tangentLine.translate(tangentStart.x - p1.x, tangentStart.y - p1.y); // move so that tangent line starts at the point requested

            return tangentLine;
        },

        // Returns `t` at requested `ratio` with precision better than requested `opt.precision`; optionally using `opt.subdivisions` provided.
        tAt: function(ratio, opt) {

            if (ratio <= 0) { return 0; }
            if (ratio >= 1) { return 1; }

            opt = opt || {};
            var precision = (opt.precision === undefined) ? this.PRECISION : opt.precision;
            var subdivisions = (opt.subdivisions === undefined) ? this.getSubdivisions({ precision: precision }) : opt.subdivisions;
            var localOpt = { precision: precision, subdivisions: subdivisions };

            var curveLength = this.length(localOpt);
            var length = curveLength * ratio;

            return this.tAtLength(length, localOpt);
        },

        // Returns `t` at requested `length` with precision better than requested `opt.precision`; optionally using `opt.subdivisions` provided.
        // Uses `precision` to approximate length within `precision` (always underestimates)
        // Then uses a binary search to find the `t` of a subdivision endpoint that is close (within `precision`) to the `length`, if the curve was as long as approximated
        // As a rule of thumb, increasing `precision` by 1 causes the algorithm to go 2^(precision - 1) deeper
        // - Precision 0 (chooses one of the two endpoints) - 0 levels
        // - Precision 1 (chooses one of 5 points, <10% error) - 1 level
        // - Precision 2 (<1% error) - 3 levels
        // - Precision 3 (<0.1% error) - 7 levels
        // - Precision 4 (<0.01% error) - 15 levels
        tAtLength: function(length, opt) {

            var fromStart = true;
            if (length < 0) {
                fromStart = false; // negative lengths mean start calculation from end point
                length = -length; // absolute value
            }

            opt = opt || {};
            var precision = (opt.precision === undefined) ? this.PRECISION : opt.precision;
            var subdivisions = (opt.subdivisions === undefined) ? this.getSubdivisions({ precision: precision }) : opt.subdivisions;
            var localOpt = { precision: precision, subdivisions: subdivisions };

            // identify the subdivision that contains the point at requested `length`:
            var investigatedSubdivision;
            var investigatedSubdivisionStartT; // assume that subdivisions are evenly spaced
            var investigatedSubdivisionEndT;
            //var baseline; // straightened version of subdivision to investigate
            //var baselinePoint; // point on the baseline that is the requested distance away from start
            var baselinePointDistFromStart; // distance of baselinePoint from start of baseline
            var baselinePointDistFromEnd; // distance of baselinePoint from end of baseline
            var l = 0; // length so far
            var n = subdivisions.length;
            var subdivisionSize = 1 / n;
            for (var i = 0; i < n; i++) {
                var index = (fromStart ? i : (n - 1 - i));

                var currentSubdivision = subdivisions[i];
                var d = currentSubdivision.endpointDistance(); // length of current subdivision

                if (length <= (l + d)) {
                    investigatedSubdivision = currentSubdivision;

                    investigatedSubdivisionStartT = index * subdivisionSize;
                    investigatedSubdivisionEndT = (index + 1) * subdivisionSize;

                    baselinePointDistFromStart = (fromStart ? (length - l) : ((d + l) - length));
                    baselinePointDistFromEnd = (fromStart ? ((d + l) - length) : (length - l));

                    break;
                }

                l += d;
            }

            if (!investigatedSubdivision) { return (fromStart ? 1 : 0); } // length requested is out of range - return maximum t
            // note that precision affects what length is recorded
            // (imprecise measurements underestimate length by up to 10^(-precision) of the precise length)
            // e.g. at precision 1, the length may be underestimated by up to 10% and cause this function to return 1

            var curveLength = this.length(localOpt);

            var precisionRatio = pow(10, -precision);

            // recursively divide investigated subdivision:
            // until distance between baselinePoint and closest path endpoint is within 10^(-precision)
            // then return the closest endpoint of that final subdivision
            while (true) {

                // check if we have reached required observed precision
                var observedPrecisionRatio;

                observedPrecisionRatio = ((curveLength !== 0) ? (baselinePointDistFromStart / curveLength) : 0);
                if (observedPrecisionRatio < precisionRatio) { return investigatedSubdivisionStartT; }
                observedPrecisionRatio = ((curveLength !== 0) ? (baselinePointDistFromEnd / curveLength) : 0);
                if (observedPrecisionRatio < precisionRatio) { return investigatedSubdivisionEndT; }

                // otherwise, set up for next iteration
                var newBaselinePointDistFromStart;
                var newBaselinePointDistFromEnd;

                var divided = investigatedSubdivision.divide(0.5);
                subdivisionSize /= 2;

                var baseline1Length = divided[0].endpointDistance();
                var baseline2Length = divided[1].endpointDistance();

                if (baselinePointDistFromStart <= baseline1Length) { // point at requested length is inside divided[0]
                    investigatedSubdivision = divided[0];

                    investigatedSubdivisionEndT -= subdivisionSize; // sudivisionSize was already halved

                    newBaselinePointDistFromStart = baselinePointDistFromStart;
                    newBaselinePointDistFromEnd = baseline1Length - newBaselinePointDistFromStart;

                } else { // point at requested length is inside divided[1]
                    investigatedSubdivision = divided[1];

                    investigatedSubdivisionStartT += subdivisionSize; // subdivisionSize was already halved

                    newBaselinePointDistFromStart = baselinePointDistFromStart - baseline1Length;
                    newBaselinePointDistFromEnd = baseline2Length - newBaselinePointDistFromStart;
                }

                baselinePointDistFromStart = newBaselinePointDistFromStart;
                baselinePointDistFromEnd = newBaselinePointDistFromEnd;
            }
        },

        // Returns an array of points that represents the curve when flattened, up to `opt.precision`; or using `opt.subdivisions` provided.
        // Flattened length is no more than 10^(-precision) away from real curve length.
        toPoints: function(opt) {

            opt = opt || {};
            var precision = (opt.precision === undefined) ? this.PRECISION : opt.precision; // opt.precision only used in getSubdivisions() call
            var subdivisions = (opt.subdivisions === undefined) ? this.getSubdivisions({ precision: precision }) : opt.subdivisions;
            // not using localOpt

            var points = [subdivisions[0].start.clone()];
            var n = subdivisions.length;
            for (var i = 0; i < n; i++) {

                var currentSubdivision = subdivisions[i];
                points.push(currentSubdivision.end.clone());
            }

            return points;
        },

        // Returns a polyline that represents the curve when flattened, up to `opt.precision`; or using `opt.subdivisions` provided.
        // Flattened length is no more than 10^(-precision) away from real curve length.
        toPolyline: function(opt) {

            return new Polyline(this.toPoints(opt));
        },

        toString: function() {

            return this.start + ' ' + this.controlPoint1 + ' ' + this.controlPoint2 + ' ' + this.end;
        },

        translate: function(tx, ty) {

            this.start.translate(tx, ty);
            this.controlPoint1.translate(tx, ty);
            this.controlPoint2.translate(tx, ty);
            this.end.translate(tx, ty);
            return this;
        }
    };

    Curve.prototype.divide = Curve.prototype.divideAtT;

    var Ellipse = function(c, a, b) {

        if (!(this instanceof Ellipse)) {
            return new Ellipse(c, a, b);
        }

        if (c instanceof Ellipse) {
            return new Ellipse(new Point(c.x, c.y), c.a, c.b);
        }

        c = new Point(c);
        this.x = c.x;
        this.y = c.y;
        this.a = a;
        this.b = b;
    };

    Ellipse.fromRect = function(rect) {

        rect = new Rect(rect);
        return new Ellipse(rect.center(), rect.width / 2, rect.height / 2);
    };

    Ellipse.prototype = {

        bbox: function() {

            return new Rect(this.x - this.a, this.y - this.b, 2 * this.a, 2 * this.b);
        },

        /**
         * @returns {g.Point}
         */
        center: function() {

            return new Point(this.x, this.y);
        },

        clone: function() {

            return new Ellipse(this);
        },

        /**
         * @param {g.Point} p
         * @returns {boolean}
         */
        containsPoint: function(p) {

            return this.normalizedDistance(p) <= 1;
        },

        equals: function(ellipse) {

            return !!ellipse &&
                ellipse.x === this.x &&
                ellipse.y === this.y &&
                ellipse.a === this.a &&
                ellipse.b === this.b;
        },

        // inflate by dx and dy
        // @param dx {delta_x} representing additional size to x
        // @param dy {delta_y} representing additional size to y -
        // dy param is not required -> in that case y is sized by dx
        inflate: function(dx, dy) {
            if (dx === undefined) {
                dx = 0;
            }

            if (dy === undefined) {
                dy = dx;
            }

            this.a += 2 * dx;
            this.b += 2 * dy;

            return this;
        },

        intersectionWithLine: function(line) {

            var intersections = [];
            var a1 = line.start;
            var a2 = line.end;
            var rx = this.a;
            var ry = this.b;
            var dir = line.vector();
            var diff = a1.difference(new Point(this));
            var mDir = new Point(dir.x / (rx * rx), dir.y / (ry * ry));
            var mDiff = new Point(diff.x / (rx * rx), diff.y / (ry * ry));

            var a = dir.dot(mDir);
            var b = dir.dot(mDiff);
            var c = diff.dot(mDiff) - 1.0;
            var d = b * b - a * c;

            if (d < 0) {
                return null;
            } else if (d > 0) {
                var root = sqrt(d);
                var ta = (-b - root) / a;
                var tb = (-b + root) / a;

                if ((ta < 0 || 1 < ta) && (tb < 0 || 1 < tb)) {
                    // if ((ta < 0 && tb < 0) || (ta > 1 && tb > 1)) outside else inside
                    return null;
                } else {
                    if (0 <= ta && ta <= 1) { intersections.push(a1.lerp(a2, ta)); }
                    if (0 <= tb && tb <= 1) { intersections.push(a1.lerp(a2, tb)); }
                }
            } else {
                var t = -b / a;
                if (0 <= t && t <= 1) {
                    intersections.push(a1.lerp(a2, t));
                } else {
                    // outside
                    return null;
                }
            }

            return intersections;
        },

        // Find point on me where line from my center to
        // point p intersects my boundary.
        // @param {number} angle If angle is specified, intersection with rotated ellipse is computed.
        intersectionWithLineFromCenterToPoint: function(p, angle) {

            p = new Point(p);

            if (angle) { p.rotate(new Point(this.x, this.y), angle); }

            var dx = p.x - this.x;
            var dy = p.y - this.y;
            var result;

            if (dx === 0) {
                result = this.bbox().pointNearestToPoint(p);
                if (angle) { return result.rotate(new Point(this.x, this.y), -angle); }
                return result;
            }

            var m = dy / dx;
            var mSquared = m * m;
            var aSquared = this.a * this.a;
            var bSquared = this.b * this.b;

            var x = sqrt(1 / ((1 / aSquared) + (mSquared / bSquared)));
            x = dx < 0 ? -x : x;

            var y = m * x;
            result = new Point(this.x + x, this.y + y);

            if (angle) { return result.rotate(new Point(this.x, this.y), -angle); }
            return result;
        },

        /**
         * @param {g.Point} point
         * @returns {number} result < 1 - inside ellipse, result == 1 - on ellipse boundary, result > 1 - outside
         */
        normalizedDistance: function(point) {

            var x0 = point.x;
            var y0 = point.y;
            var a = this.a;
            var b = this.b;
            var x = this.x;
            var y = this.y;

            return ((x0 - x) * (x0 - x)) / (a * a) + ((y0 - y) * (y0 - y)) / (b * b);
        },

        /** Compute angle between tangent and x axis
         * @param {g.Point} p Point of tangency, it has to be on ellipse boundaries.
         * @returns {number} angle between tangent and x axis
         */
        tangentTheta: function(p) {

            var refPointDelta = 30;
            var x0 = p.x;
            var y0 = p.y;
            var a = this.a;
            var b = this.b;
            var center = this.bbox().center();
            var m = center.x;
            var n = center.y;

            var q1 = x0 > center.x + a / 2;
            var q3 = x0 < center.x - a / 2;

            var y, x;
            if (q1 || q3) {
                y = x0 > center.x ? y0 - refPointDelta : y0 + refPointDelta;
                x = (a * a / (x0 - m)) - (a * a * (y0 - n) * (y - n)) / (b * b * (x0 - m)) + m;

            } else {
                x = y0 > center.y ? x0 + refPointDelta : x0 - refPointDelta;
                y = (b * b / (y0 - n)) - (b * b * (x0 - m) * (x - m)) / (a * a * (y0 - n)) + n;
            }

            return (new Point(x, y)).theta(p);

        },

        toString: function() {

            return (new Point(this.x, this.y)).toString() + ' ' + this.a + ' ' + this.b;
        }
    };

    var Line = function(p1, p2) {

        if (!(this instanceof Line)) {
            return new Line(p1, p2);
        }

        if (p1 instanceof Line) {
            return new Line(p1.start, p1.end);
        }

        this.start = new Point(p1);
        this.end = new Point(p2);
    };

    Line.prototype = {

        // @returns the angle of incline of the line.
        angle: function() {

            var horizontalPoint = new Point(this.start.x + 1, this.start.y);
            return this.start.angleBetween(this.end, horizontalPoint);
        },

        bbox: function() {

            var left = min(this.start.x, this.end.x);
            var top = min(this.start.y, this.end.y);
            var right = max(this.start.x, this.end.x);
            var bottom = max(this.start.y, this.end.y);

            return new Rect(left, top, (right - left), (bottom - top));
        },

        // @return the bearing (cardinal direction) of the line. For example N, W, or SE.
        // @returns {String} One of the following bearings : NE, E, SE, S, SW, W, NW, N.
        bearing: function() {

            var lat1 = toRad(this.start.y);
            var lat2 = toRad(this.end.y);
            var lon1 = this.start.x;
            var lon2 = this.end.x;
            var dLon = toRad(lon2 - lon1);
            var y = sin(dLon) * cos(lat2);
            var x = cos(lat1) * sin(lat2) - sin(lat1) * cos(lat2) * cos(dLon);
            var brng = toDeg(atan2(y, x));

            var bearings = ['NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];

            var index = brng - 22.5;
            if (index < 0)
                { index += 360; }
            index = parseInt(index / 45);

            return bearings[index];
        },

        clone: function() {

            return new Line(this.start, this.end);
        },

        // @return {point} the closest point on the line to point `p`
        closestPoint: function(p) {

            return this.pointAt(this.closestPointNormalizedLength(p));
        },

        closestPointLength: function(p) {

            return this.closestPointNormalizedLength(p) * this.length();
        },

        // @return {number} the normalized length of the closest point on the line to point `p`
        closestPointNormalizedLength: function(p) {

            var product = this.vector().dot((new Line(this.start, p)).vector());
            var cpNormalizedLength = min(1, max(0, product / this.squaredLength()));

            // cpNormalizedLength returns `NaN` if this line has zero length
            // we can work with that - if `NaN`, return 0
            if (cpNormalizedLength !== cpNormalizedLength) { return 0; } // condition evaluates to `true` if and only if cpNormalizedLength is `NaN`
            // (`NaN` is the only value that is not equal to itself)

            return cpNormalizedLength;
        },

        closestPointTangent: function(p) {

            return this.tangentAt(this.closestPointNormalizedLength(p));
        },

        // Returns `true` if the point lies on the line.
        containsPoint: function(p) {

            var start = this.start;
            var end = this.end;

            if (start.cross(p, end) !== 0) { return false; }
            // else: cross product of 0 indicates that this line and the vector to `p` are collinear

            var length = this.length();
            if ((new Line(start, p)).length() > length) { return false; }
            if ((new Line(p, end)).length() > length) { return false; }
            // else: `p` lies between start and end of the line

            return true;
        },

        // Divides the line into two at requested `ratio` between 0 and 1.
        divideAt: function(ratio) {

            var dividerPoint = this.pointAt(ratio);

            // return array with two lines
            return [
                new Line(this.start, dividerPoint),
                new Line(dividerPoint, this.end)
            ];
        },

        // Divides the line into two at requested `length`.
        divideAtLength: function(length) {

            var dividerPoint = this.pointAtLength(length);

            // return array with two new lines
            return [
                new Line(this.start, dividerPoint),
                new Line(dividerPoint, this.end)
            ];
        },

        equals: function(l) {

            return !!l &&
                this.start.x === l.start.x &&
                this.start.y === l.start.y &&
                this.end.x === l.end.x &&
                this.end.y === l.end.y;
        },

        // @return {point} Point where I'm intersecting a line.
        // @return [point] Points where I'm intersecting a rectangle.
        // @see Squeak Smalltalk, LineSegment>>intersectionWith:
        intersect: function(shape, opt) {

            if (shape instanceof Line ||
                shape instanceof Rect ||
                shape instanceof Polyline ||
                shape instanceof Ellipse ||
                shape instanceof Path
            ) {
                var intersection = shape.intersectionWithLine(this, opt);

                // Backwards compatibility
                if (intersection && (shape instanceof Line)) {
                    intersection = intersection[0];
                }

                return intersection;
            }

            return null;
        },

        intersectionWithLine: function(line) {

            var pt1Dir = new Point(this.end.x - this.start.x, this.end.y - this.start.y);
            var pt2Dir = new Point(line.end.x - line.start.x, line.end.y - line.start.y);
            var det = (pt1Dir.x * pt2Dir.y) - (pt1Dir.y * pt2Dir.x);
            var deltaPt = new Point(line.start.x - this.start.x, line.start.y - this.start.y);
            var alpha = (deltaPt.x * pt2Dir.y) - (deltaPt.y * pt2Dir.x);
            var beta = (deltaPt.x * pt1Dir.y) - (deltaPt.y * pt1Dir.x);

            if (det === 0 || alpha * det < 0 || beta * det < 0) {
                // No intersection found.
                return null;
            }

            if (det > 0) {
                if (alpha > det || beta > det) {
                    return null;
                }

            } else {
                if (alpha < det || beta < det) {
                    return null;
                }
            }

            return [new Point(
                this.start.x + (alpha * pt1Dir.x / det),
                this.start.y + (alpha * pt1Dir.y / det)
            )];
        },

        isDifferentiable: function() {

            return !this.start.equals(this.end);
        },

        // @return {double} length of the line
        length: function() {

            return sqrt(this.squaredLength());
        },

        // @return {point} my midpoint
        midpoint: function() {

            return new Point(
                (this.start.x + this.end.x) / 2,
                (this.start.y + this.end.y) / 2
            );
        },

        // @return {point} my point at 't' <0,1>
        pointAt: function(t) {

            var start = this.start;
            var end = this.end;

            if (t <= 0) { return start.clone(); }
            if (t >= 1) { return end.clone(); }

            return start.lerp(end, t);
        },

        pointAtLength: function(length) {

            var start = this.start;
            var end = this.end;

            var fromStart = true;
            if (length < 0) {
                fromStart = false; // negative lengths mean start calculation from end point
                length = -length; // absolute value
            }

            var lineLength = this.length();
            if (length >= lineLength) { return (fromStart ? end.clone() : start.clone()); }

            return this.pointAt((fromStart ? (length) : (lineLength - length)) / lineLength);
        },

        // @return {number} the offset of the point `p` from the line. + if the point `p` is on the right side of the line, - if on the left and 0 if on the line.
        pointOffset: function(p) {

            // Find the sign of the determinant of vectors (start,end), where p is the query point.
            p = new Point(p);
            var start = this.start;
            var end = this.end;
            var determinant = ((end.x - start.x) * (p.y - start.y) - (end.y - start.y) * (p.x - start.x));

            return determinant / this.length();
        },

        rotate: function(origin, angle) {

            this.start.rotate(origin, angle);
            this.end.rotate(origin, angle);
            return this;
        },

        round: function(precision) {

            var f = pow(10, precision || 0);
            this.start.x = round(this.start.x * f) / f;
            this.start.y = round(this.start.y * f) / f;
            this.end.x = round(this.end.x * f) / f;
            this.end.y = round(this.end.y * f) / f;
            return this;
        },

        scale: function(sx, sy, origin) {

            this.start.scale(sx, sy, origin);
            this.end.scale(sx, sy, origin);
            return this;
        },

        // @return {number} scale the line so that it has the requested length
        setLength: function(length) {

            var currentLength = this.length();
            if (!currentLength) { return this; }

            var scaleFactor = length / currentLength;
            return this.scale(scaleFactor, scaleFactor, this.start);
        },

        // @return {integer} length without sqrt
        // @note for applications where the exact length is not necessary (e.g. compare only)
        squaredLength: function() {

            var x0 = this.start.x;
            var y0 = this.start.y;
            var x1 = this.end.x;
            var y1 = this.end.y;
            return (x0 -= x1) * x0 + (y0 -= y1) * y0;
        },

        tangentAt: function(t) {

            if (!this.isDifferentiable()) { return null; }

            var start = this.start;
            var end = this.end;

            var tangentStart = this.pointAt(t); // constrains `t` between 0 and 1

            var tangentLine = new Line(start, end);
            tangentLine.translate(tangentStart.x - start.x, tangentStart.y - start.y); // move so that tangent line starts at the point requested

            return tangentLine;
        },

        tangentAtLength: function(length) {

            if (!this.isDifferentiable()) { return null; }

            var start = this.start;
            var end = this.end;

            var tangentStart = this.pointAtLength(length);

            var tangentLine = new Line(start, end);
            tangentLine.translate(tangentStart.x - start.x, tangentStart.y - start.y); // move so that tangent line starts at the point requested

            return tangentLine;
        },

        toString: function() {

            return this.start.toString() + ' ' + this.end.toString();
        },

        translate: function(tx, ty) {

            this.start.translate(tx, ty);
            this.end.translate(tx, ty);
            return this;
        },

        // @return vector {point} of the line
        vector: function() {

            return new Point(this.end.x - this.start.x, this.end.y - this.start.y);
        }
    };

    // For backwards compatibility:
    Line.prototype.intersection = Line.prototype.intersect;

    // Accepts path data string, array of segments, array of Curves and/or Lines, or a Polyline.
    // Path created is not guaranteed to be a valid (serializable) path (might not start with an M).
    var Path = function(arg) {

        if (!(this instanceof Path)) {
            return new Path(arg);
        }

        if (typeof arg === 'string') { // create from a path data string
            return new Path.parse(arg);
        }

        this.segments = [];

        var i;
        var n;

        if (!arg) ; else if (Array.isArray(arg) && arg.length !== 0) { // if arg is a non-empty array
            // flatten one level deep
            // so we can chain arbitrary Path.createSegment results
            arg = arg.reduce(function(acc, val) {
                return acc.concat(val);
            }, []);

            n = arg.length;
            if (arg[0].isSegment) { // create from an array of segments
                for (i = 0; i < n; i++) {

                    var segment = arg[i];

                    this.appendSegment(segment);
                }

            } else { // create from an array of Curves and/or Lines
                var previousObj = null;
                for (i = 0; i < n; i++) {

                    var obj = arg[i];

                    if (!((obj instanceof Line) || (obj instanceof Curve))) {
                        throw new Error('Cannot construct a path segment from the provided object.');
                    }

                    if (i === 0) { this.appendSegment(Path.createSegment('M', obj.start)); }

                    // if objects do not link up, moveto segments are inserted to cover the gaps
                    if (previousObj && !previousObj.end.equals(obj.start)) { this.appendSegment(Path.createSegment('M', obj.start)); }

                    if (obj instanceof Line) {
                        this.appendSegment(Path.createSegment('L', obj.end));

                    } else if (obj instanceof Curve) {
                        this.appendSegment(Path.createSegment('C', obj.controlPoint1, obj.controlPoint2, obj.end));
                    }

                    previousObj = obj;
                }
            }

        } else if (arg.isSegment) { // create from a single segment
            this.appendSegment(arg);

        } else if (arg instanceof Line) { // create from a single Line
            this.appendSegment(Path.createSegment('M', arg.start));
            this.appendSegment(Path.createSegment('L', arg.end));

        } else if (arg instanceof Curve) { // create from a single Curve
            this.appendSegment(Path.createSegment('M', arg.start));
            this.appendSegment(Path.createSegment('C', arg.controlPoint1, arg.controlPoint2, arg.end));

        } else if (arg instanceof Polyline) { // create from a Polyline
            if (!(arg.points && (arg.points.length !== 0))) { return; } // if Polyline has no points, leave Path empty

            n = arg.points.length;
            for (i = 0; i < n; i++) {

                var point = arg.points[i];

                if (i === 0) { this.appendSegment(Path.createSegment('M', point)); }
                else { this.appendSegment(Path.createSegment('L', point)); }
            }

        } else { // unknown object
            throw new Error('Cannot construct a path from the provided object.');
        }
    };

    // More permissive than V.normalizePathData and Path.prototype.serialize.
    // Allows path data strings that do not start with a Moveto command (unlike SVG specification).
    // Does not require spaces between elements; commas are allowed, separators may be omitted when unambiguous (e.g. 'ZM10,10', 'L1.6.8', 'M100-200').
    // Allows for command argument chaining.
    // Throws an error if wrong number of arguments is provided with a command.
    // Throws an error if an unrecognized path command is provided (according to Path.segmentTypes). Only a subset of SVG commands is currently supported (L, C, M, Z).
    Path.parse = function(pathData) {

        if (!pathData) { return new Path(); }

        var path = new Path();

        var commandRe = /(?:[a-zA-Z] *)(?:(?:-?\d+(?:\.\d+)?(?:e[-+]?\d+)? *,? *)|(?:-?\.\d+ *,? *))+|(?:[a-zA-Z] *)(?! |\d|-|\.)/g;
        var commands = pathData.match(commandRe);

        var numCommands = commands.length;
        for (var i = 0; i < numCommands; i++) {

            var command = commands[i];
            var argRe = /(?:[a-zA-Z])|(?:(?:-?\d+(?:\.\d+)?(?:e[-+]?\d+)?))|(?:(?:-?\.\d+))/g;
            var args = command.match(argRe);

            var segment = Path.createSegment.apply(this, args); // args = [type, coordinate1, coordinate2...]
            path.appendSegment(segment);
        }

        return path;
    };

    // Create a segment or an array of segments.
    // Accepts unlimited points/coords arguments after `type`.
    Path.createSegment = function(type) {
        var arguments$1 = arguments;


        if (!type) { throw new Error('Type must be provided.'); }

        var segmentConstructor = Path.segmentTypes[type];
        if (!segmentConstructor) { throw new Error(type + ' is not a recognized path segment type.'); }

        var args = [];
        var n = arguments.length;
        for (var i = 1; i < n; i++) { // do not add first element (`type`) to args array
            args.push(arguments$1[i]);
        }

        return applyToNew(segmentConstructor, args);
    };

    Path.prototype = {

        // Accepts one segment or an array of segments as argument.
        // Throws an error if argument is not a segment or an array of segments.
        appendSegment: function(arg) {

            var segments = this.segments;
            var numSegments = segments.length;
            // works even if path has no segments

            var currentSegment;

            var previousSegment = ((numSegments !== 0) ? segments[numSegments - 1] : null); // if we are appending to an empty path, previousSegment is null
            var nextSegment = null;

            if (!Array.isArray(arg)) { // arg is a segment
                if (!arg || !arg.isSegment) { throw new Error('Segment required.'); }

                currentSegment = this.prepareSegment(arg, previousSegment, nextSegment);
                segments.push(currentSegment);

            } else { // arg is an array of segments
                // flatten one level deep
                // so we can chain arbitrary Path.createSegment results
                arg = arg.reduce(function(acc, val) {
                    return acc.concat(val);
                }, []);

                if (!arg[0].isSegment) { throw new Error('Segments required.'); }

                var n = arg.length;
                for (var i = 0; i < n; i++) {

                    var currentArg = arg[i];
                    currentSegment = this.prepareSegment(currentArg, previousSegment, nextSegment);
                    segments.push(currentSegment);
                    previousSegment = currentSegment;
                }
            }
        },

        // Returns the bbox of the path.
        // If path has no segments, returns null.
        // If path has only invisible segments, returns bbox of the end point of last segment.
        bbox: function() {

            var segments = this.segments;
            var numSegments = segments.length;
            if (numSegments === 0) { return null; } // if segments is an empty array

            var bbox;
            for (var i = 0; i < numSegments; i++) {

                var segment = segments[i];
                if (segment.isVisible) {
                    var segmentBBox = segment.bbox();
                    bbox = bbox ? bbox.union(segmentBBox) : segmentBBox;
                }
            }

            if (bbox) { return bbox; }

            // if the path has only invisible elements, return end point of last segment
            var lastSegment = segments[numSegments - 1];
            return new Rect(lastSegment.end.x, lastSegment.end.y, 0, 0);
        },

        // Returns a new path that is a clone of this path.
        clone: function() {

            var segments = this.segments;
            var numSegments = segments.length;
            // works even if path has no segments

            var path = new Path();
            for (var i = 0; i < numSegments; i++) {

                var segment = segments[i].clone();
                path.appendSegment(segment);
            }

            return path;
        },

        closestPoint: function(p, opt) {

            var t = this.closestPointT(p, opt);
            if (!t) { return null; }

            return this.pointAtT(t);
        },

        closestPointLength: function(p, opt) {

            opt = opt || {};
            var precision = (opt.precision === undefined) ? this.PRECISION : opt.precision;
            var segmentSubdivisions = (opt.segmentSubdivisions === undefined) ? this.getSegmentSubdivisions({ precision: precision }) : opt.segmentSubdivisions;
            var localOpt = { precision: precision, segmentSubdivisions: segmentSubdivisions };

            var t = this.closestPointT(p, localOpt);
            if (!t) { return 0; }

            return this.lengthAtT(t, localOpt);
        },

        closestPointNormalizedLength: function(p, opt) {

            opt = opt || {};
            var precision = (opt.precision === undefined) ? this.PRECISION : opt.precision;
            var segmentSubdivisions = (opt.segmentSubdivisions === undefined) ? this.getSegmentSubdivisions({ precision: precision }) : opt.segmentSubdivisions;
            var localOpt = { precision: precision, segmentSubdivisions: segmentSubdivisions };

            var cpLength = this.closestPointLength(p, localOpt);
            if (cpLength === 0) { return 0; } // shortcut

            var length = this.length(localOpt);
            if (length === 0) { return 0; } // prevents division by zero

            return cpLength / length;
        },

        // Private function.
        closestPointT: function(p, opt) {

            var segments = this.segments;
            var numSegments = segments.length;
            if (numSegments === 0) { return null; } // if segments is an empty array

            opt = opt || {};
            var precision = (opt.precision === undefined) ? this.PRECISION : opt.precision;
            var segmentSubdivisions = (opt.segmentSubdivisions === undefined) ? this.getSegmentSubdivisions({ precision: precision }) : opt.segmentSubdivisions;
            // not using localOpt

            var closestPointT;
            var minSquaredDistance = Infinity;
            for (var i = 0; i < numSegments; i++) {

                var segment = segments[i];
                var subdivisions = segmentSubdivisions[i];

                if (segment.isVisible) {
                    var segmentClosestPointT = segment.closestPointT(p, {
                        precision: precision,
                        subdivisions: subdivisions
                    });
                    var segmentClosestPoint = segment.pointAtT(segmentClosestPointT);
                    var squaredDistance = (new Line(segmentClosestPoint, p)).squaredLength();

                    if (squaredDistance < minSquaredDistance) {
                        closestPointT = { segmentIndex: i, value: segmentClosestPointT };
                        minSquaredDistance = squaredDistance;
                    }
                }
            }

            if (closestPointT) { return closestPointT; }

            // if no visible segment, return end of last segment
            return { segmentIndex: numSegments - 1, value: 1 };
        },

        closestPointTangent: function(p, opt) {

            var segments = this.segments;
            var numSegments = segments.length;
            if (numSegments === 0) { return null; } // if segments is an empty array

            opt = opt || {};
            var precision = (opt.precision === undefined) ? this.PRECISION : opt.precision;
            var segmentSubdivisions = (opt.segmentSubdivisions === undefined) ? this.getSegmentSubdivisions({ precision: precision }) : opt.segmentSubdivisions;
            // not using localOpt

            var closestPointTangent;
            var minSquaredDistance = Infinity;
            for (var i = 0; i < numSegments; i++) {

                var segment = segments[i];
                var subdivisions = segmentSubdivisions[i];

                if (segment.isDifferentiable()) {
                    var segmentClosestPointT = segment.closestPointT(p, {
                        precision: precision,
                        subdivisions: subdivisions
                    });
                    var segmentClosestPoint = segment.pointAtT(segmentClosestPointT);
                    var squaredDistance = (new Line(segmentClosestPoint, p)).squaredLength();

                    if (squaredDistance < minSquaredDistance) {
                        closestPointTangent = segment.tangentAtT(segmentClosestPointT);
                        minSquaredDistance = squaredDistance;
                    }
                }
            }

            if (closestPointTangent) { return closestPointTangent; }

            // if no valid segment, return null
            return null;
        },

        // Returns `true` if the area surrounded by the path contains the point `p`.
        // Implements the even-odd algorithm (self-intersections are "outside").
        // Closes open paths (always imagines a final closing segment).
        // Precision may be adjusted by passing an `opt` object.
        containsPoint: function(p, opt) {

            var polylines = this.toPolylines(opt);
            if (!polylines) { return false; } // shortcut (this path has no polylines)

            var numPolylines = polylines.length;

            // how many component polylines does `p` lie within?
            var numIntersections = 0;
            for (var i = 0; i < numPolylines; i++) {
                var polyline = polylines[i];
                if (polyline.containsPoint(p)) {
                    // `p` lies within this polyline
                    numIntersections++;
                }
            }

            // returns `true` for odd numbers of intersections (even-odd algorithm)
            return ((numIntersections % 2) === 1);
        },

        // Divides the path into two at requested `ratio` between 0 and 1 with precision better than `opt.precision`; optionally using `opt.subdivisions` provided.
        divideAt: function(ratio, opt) {

            var segments = this.segments;
            var numSegments = segments.length;
            if (numSegments === 0) { return null; } // if segments is an empty array

            if (ratio < 0) { ratio = 0; }
            if (ratio > 1) { ratio = 1; }

            opt = opt || {};
            var precision = (opt.precision === undefined) ? this.PRECISION : opt.precision;
            var segmentSubdivisions = (opt.segmentSubdivisions === undefined) ? this.getSegmentSubdivisions({ precision: precision }) : opt.segmentSubdivisions;
            var localOpt = { precision: precision, segmentSubdivisions: segmentSubdivisions };

            var pathLength = this.length(localOpt);
            var length = pathLength * ratio;

            return this.divideAtLength(length, localOpt);
        },

        // Divides the path into two at requested `length` with precision better than requested `opt.precision`; optionally using `opt.subdivisions` provided.
        divideAtLength: function(length, opt) {

            var numSegments = this.segments.length;
            if (numSegments === 0) { return null; } // if segments is an empty array

            var fromStart = true;
            if (length < 0) {
                fromStart = false; // negative lengths mean start calculation from end point
                length = -length; // absolute value
            }

            opt = opt || {};
            var precision = (opt.precision === undefined) ? this.PRECISION : opt.precision;
            var segmentSubdivisions = (opt.segmentSubdivisions === undefined) ? this.getSegmentSubdivisions({ precision: precision }) : opt.segmentSubdivisions;
            // not using localOpt

            var i;
            var segment;

            // identify the segment to divide:

            var l = 0; // length so far
            var divided;
            var dividedSegmentIndex;
            var lastValidSegment; // visible AND differentiable
            var lastValidSegmentIndex;
            var t;
            for (i = 0; i < numSegments; i++) {
                var index = (fromStart ? i : (numSegments - 1 - i));

                segment = this.getSegment(index);
                var subdivisions = segmentSubdivisions[index];
                var d = segment.length({ precision: precision, subdivisions: subdivisions });

                if (segment.isDifferentiable()) { // segment is not just a point
                    lastValidSegment = segment;
                    lastValidSegmentIndex = index;

                    if (length <= (l + d)) {
                        dividedSegmentIndex = index;
                        divided = segment.divideAtLength(((fromStart ? 1 : -1) * (length - l)), {
                            precision: precision,
                            subdivisions: subdivisions
                        });
                        break;
                    }
                }

                l += d;
            }

            if (!lastValidSegment) { // no valid segment found
                return null;
            }

            // else: the path contains at least one valid segment

            if (!divided) { // the desired length is greater than the length of the path
                dividedSegmentIndex = lastValidSegmentIndex;
                t = (fromStart ? 1 : 0);
                divided = lastValidSegment.divideAtT(t);
            }

            // create a copy of this path and replace the identified segment with its two divided parts:

            var pathCopy = this.clone();
            pathCopy.replaceSegment(dividedSegmentIndex, divided);

            var divisionStartIndex = dividedSegmentIndex;
            var divisionMidIndex = dividedSegmentIndex + 1;
            var divisionEndIndex = dividedSegmentIndex + 2;

            // do not insert the part if it looks like a point
            if (!divided[0].isDifferentiable()) {
                pathCopy.removeSegment(divisionStartIndex);
                divisionMidIndex -= 1;
                divisionEndIndex -= 1;
            }

            // insert a Moveto segment to ensure secondPath will be valid:
            var movetoEnd = pathCopy.getSegment(divisionMidIndex).start;
            pathCopy.insertSegment(divisionMidIndex, Path.createSegment('M', movetoEnd));
            divisionEndIndex += 1;

            // do not insert the part if it looks like a point
            if (!divided[1].isDifferentiable()) {
                pathCopy.removeSegment(divisionEndIndex - 1);
                divisionEndIndex -= 1;
            }

            // ensure that Closepath segments in secondPath will be assigned correct subpathStartSegment:

            var secondPathSegmentIndexConversion = divisionEndIndex - divisionStartIndex - 1;
            for (i = divisionEndIndex; i < pathCopy.segments.length; i++) {

                var originalSegment = this.getSegment(i - secondPathSegmentIndexConversion);
                segment = pathCopy.getSegment(i);

                if ((segment.type === 'Z') && !originalSegment.subpathStartSegment.end.equals(segment.subpathStartSegment.end)) {
                    // pathCopy segment's subpathStartSegment is different from original segment's one
                    // convert this Closepath segment to a Lineto and replace it in pathCopy
                    var convertedSegment = Path.createSegment('L', originalSegment.end);
                    pathCopy.replaceSegment(i, convertedSegment);
                }
            }

            // distribute pathCopy segments into two paths and return those:

            var firstPath = new Path(pathCopy.segments.slice(0, divisionMidIndex));
            var secondPath = new Path(pathCopy.segments.slice(divisionMidIndex));

            return [firstPath, secondPath];
        },

        // Checks whether two paths are exactly the same.
        // If `p` is undefined or null, returns false.
        equals: function(p) {

            if (!p) { return false; }

            var segments = this.segments;
            var otherSegments = p.segments;

            var numSegments = segments.length;
            if (otherSegments.length !== numSegments) { return false; } // if the two paths have different number of segments, they cannot be equal

            for (var i = 0; i < numSegments; i++) {

                var segment = segments[i];
                var otherSegment = otherSegments[i];

                // as soon as an inequality is found in segments, return false
                if ((segment.type !== otherSegment.type) || (!segment.equals(otherSegment))) { return false; }
            }

            // if no inequality found in segments, return true
            return true;
        },

        // Accepts negative indices.
        // Throws an error if path has no segments.
        // Throws an error if index is out of range.
        getSegment: function(index) {

            var segments = this.segments;
            var numSegments = segments.length;
            if (numSegments === 0) { throw new Error('Path has no segments.'); }

            if (index < 0) { index = numSegments + index; } // convert negative indices to positive
            if (index >= numSegments || index < 0) { throw new Error('Index out of range.'); }

            return segments[index];
        },

        // Returns an array of segment subdivisions, with precision better than requested `opt.precision`.
        getSegmentSubdivisions: function(opt) {

            var segments = this.segments;
            var numSegments = segments.length;
            // works even if path has no segments

            opt = opt || {};
            var precision = (opt.precision === undefined) ? this.PRECISION : opt.precision;
            // not using opt.segmentSubdivisions
            // not using localOpt

            var segmentSubdivisions = [];
            for (var i = 0; i < numSegments; i++) {

                var segment = segments[i];
                var subdivisions = segment.getSubdivisions({ precision: precision });
                segmentSubdivisions.push(subdivisions);
            }

            return segmentSubdivisions;
        },

        // Insert `arg` at given `index`.
        // `index = 0` means insert at the beginning.
        // `index = segments.length` means insert at the end.
        // Accepts negative indices, from `-1` to `-(segments.length + 1)`.
        // Accepts one segment or an array of segments as argument.
        // Throws an error if index is out of range.
        // Throws an error if argument is not a segment or an array of segments.
        insertSegment: function(index, arg) {

            var segments = this.segments;
            var numSegments = segments.length;
            // works even if path has no segments

            // note that these are incremented comapared to getSegments()
            // we can insert after last element (note that this changes the meaning of index -1)
            if (index < 0) { index = numSegments + index + 1; } // convert negative indices to positive
            if (index > numSegments || index < 0) { throw new Error('Index out of range.'); }

            var currentSegment;

            var previousSegment = null;
            var nextSegment = null;

            if (numSegments !== 0) {
                if (index >= 1) {
                    previousSegment = segments[index - 1];
                    nextSegment = previousSegment.nextSegment; // if we are inserting at end, nextSegment is null

                } else { // if index === 0
                    // previousSegment is null
                    nextSegment = segments[0];
                }
            }

            if (!Array.isArray(arg)) {
                if (!arg || !arg.isSegment) { throw new Error('Segment required.'); }

                currentSegment = this.prepareSegment(arg, previousSegment, nextSegment);
                segments.splice(index, 0, currentSegment);

            } else {
                // flatten one level deep
                // so we can chain arbitrary Path.createSegment results
                arg = arg.reduce(function(acc, val) {
                    return acc.concat(val);
                }, []);

                if (!arg[0].isSegment) { throw new Error('Segments required.'); }

                var n = arg.length;
                for (var i = 0; i < n; i++) {

                    var currentArg = arg[i];
                    currentSegment = this.prepareSegment(currentArg, previousSegment, nextSegment);
                    segments.splice((index + i), 0, currentSegment); // incrementing index to insert subsequent segments after inserted segments
                    previousSegment = currentSegment;
                }
            }
        },

        intersectionWithLine: function(line, opt) {

            var intersection = null;
            var polylines = this.toPolylines(opt);
            if (!polylines) { return null; }
            for (var i = 0, n = polylines.length; i < n; i++) {
                var polyline = polylines[i];
                var polylineIntersection = line.intersect(polyline);
                if (polylineIntersection) {
                    intersection || (intersection = []);
                    if (Array.isArray(polylineIntersection)) {
                        Array.prototype.push.apply(intersection, polylineIntersection);
                    } else {
                        intersection.push(polylineIntersection);
                    }
                }
            }

            return intersection;
        },

        isDifferentiable: function() {

            var segments = this.segments;
            var numSegments = segments.length;

            for (var i = 0; i < numSegments; i++) {

                var segment = segments[i];
                // as soon as a differentiable segment is found in segments, return true
                if (segment.isDifferentiable()) { return true; }
            }

            // if no differentiable segment is found in segments, return false
            return false;
        },

        // Checks whether current path segments are valid.
        // Note that d is allowed to be empty - should disable rendering of the path.
        isValid: function() {

            var segments = this.segments;
            var isValid = (segments.length === 0) || (segments[0].type === 'M'); // either empty or first segment is a Moveto
            return isValid;
        },

        // Returns length of the path, with precision better than requested `opt.precision`; or using `opt.segmentSubdivisions` provided.
        // If path has no segments, returns 0.
        length: function(opt) {

            var segments = this.segments;
            var numSegments = segments.length;
            if (numSegments === 0) { return 0; } // if segments is an empty array

            opt = opt || {};
            var precision = (opt.precision === undefined) ? this.PRECISION : opt.precision; // opt.precision only used in getSegmentSubdivisions() call
            var segmentSubdivisions = (opt.segmentSubdivisions === undefined) ? this.getSegmentSubdivisions({ precision: precision }) : opt.segmentSubdivisions;
            // not using localOpt

            var length = 0;
            for (var i = 0; i < numSegments; i++) {

                var segment = segments[i];
                var subdivisions = segmentSubdivisions[i];
                length += segment.length({ subdivisions: subdivisions });
            }

            return length;
        },

        // Private function.
        lengthAtT: function(t, opt) {

            var segments = this.segments;
            var numSegments = segments.length;
            if (numSegments === 0) { return 0; } // if segments is an empty array

            var segmentIndex = t.segmentIndex;
            if (segmentIndex < 0) { return 0; } // regardless of t.value

            var tValue = t.value;
            if (segmentIndex >= numSegments) {
                segmentIndex = numSegments - 1;
                tValue = 1;
            } else if (tValue < 0) { tValue = 0; }
            else if (tValue > 1) { tValue = 1; }

            opt = opt || {};
            var precision = (opt.precision === undefined) ? this.PRECISION : opt.precision;
            var segmentSubdivisions = (opt.segmentSubdivisions === undefined) ? this.getSegmentSubdivisions({ precision: precision }) : opt.segmentSubdivisions;
            // not using localOpt

            var subdivisions;
            var length = 0;
            for (var i = 0; i < segmentIndex; i++) {

                var segment = segments[i];
                subdivisions = segmentSubdivisions[i];
                length += segment.length({ precisison: precision, subdivisions: subdivisions });
            }

            segment = segments[segmentIndex];
            subdivisions = segmentSubdivisions[segmentIndex];
            length += segment.lengthAtT(tValue, { precisison: precision, subdivisions: subdivisions });

            return length;
        },

        // Returns point at requested `ratio` between 0 and 1, with precision better than requested `opt.precision`; optionally using `opt.segmentSubdivisions` provided.
        pointAt: function(ratio, opt) {

            var segments = this.segments;
            var numSegments = segments.length;
            if (numSegments === 0) { return null; } // if segments is an empty array

            if (ratio <= 0) { return this.start.clone(); }
            if (ratio >= 1) { return this.end.clone(); }

            opt = opt || {};
            var precision = (opt.precision === undefined) ? this.PRECISION : opt.precision;
            var segmentSubdivisions = (opt.segmentSubdivisions === undefined) ? this.getSegmentSubdivisions({ precision: precision }) : opt.segmentSubdivisions;
            var localOpt = { precision: precision, segmentSubdivisions: segmentSubdivisions };

            var pathLength = this.length(localOpt);
            var length = pathLength * ratio;

            return this.pointAtLength(length, localOpt);
        },

        // Returns point at requested `length`, with precision better than requested `opt.precision`; optionally using `opt.segmentSubdivisions` provided.
        // Accepts negative length.
        pointAtLength: function(length, opt) {

            var segments = this.segments;
            var numSegments = segments.length;
            if (numSegments === 0) { return null; } // if segments is an empty array

            if (length === 0) { return this.start.clone(); }

            var fromStart = true;
            if (length < 0) {
                fromStart = false; // negative lengths mean start calculation from end point
                length = -length; // absolute value
            }

            opt = opt || {};
            var precision = (opt.precision === undefined) ? this.PRECISION : opt.precision;
            var segmentSubdivisions = (opt.segmentSubdivisions === undefined) ? this.getSegmentSubdivisions({ precision: precision }) : opt.segmentSubdivisions;
            // not using localOpt

            var lastVisibleSegment;
            var l = 0; // length so far
            for (var i = 0; i < numSegments; i++) {
                var index = (fromStart ? i : (numSegments - 1 - i));

                var segment = segments[index];
                var subdivisions = segmentSubdivisions[index];
                var d = segment.length({ precision: precision, subdivisions: subdivisions });

                if (segment.isVisible) {
                    if (length <= (l + d)) {
                        return segment.pointAtLength(((fromStart ? 1 : -1) * (length - l)), {
                            precision: precision,
                            subdivisions: subdivisions
                        });
                    }

                    lastVisibleSegment = segment;
                }

                l += d;
            }

            // if length requested is higher than the length of the path, return last visible segment endpoint
            if (lastVisibleSegment) { return (fromStart ? lastVisibleSegment.end : lastVisibleSegment.start); }

            // if no visible segment, return last segment end point (no matter if fromStart or no)
            var lastSegment = segments[numSegments - 1];
            return lastSegment.end.clone();
        },

        // Private function.
        pointAtT: function(t) {

            var segments = this.segments;
            var numSegments = segments.length;
            if (numSegments === 0) { return null; } // if segments is an empty array

            var segmentIndex = t.segmentIndex;
            if (segmentIndex < 0) { return segments[0].pointAtT(0); }
            if (segmentIndex >= numSegments) { return segments[numSegments - 1].pointAtT(1); }

            var tValue = t.value;
            if (tValue < 0) { tValue = 0; }
            else if (tValue > 1) { tValue = 1; }

            return segments[segmentIndex].pointAtT(tValue);
        },

        // Default precision
        PRECISION: 3,

        // Helper method for adding segments.
        prepareSegment: function(segment, previousSegment, nextSegment) {

            // insert after previous segment and before previous segment's next segment
            segment.previousSegment = previousSegment;
            segment.nextSegment = nextSegment;
            if (previousSegment) { previousSegment.nextSegment = segment; }
            if (nextSegment) { nextSegment.previousSegment = segment; }

            var updateSubpathStart = segment;
            if (segment.isSubpathStart) {
                segment.subpathStartSegment = segment; // assign self as subpath start segment
                updateSubpathStart = nextSegment; // start updating from next segment
            }

            // assign previous segment's subpath start (or self if it is a subpath start) to subsequent segments
            if (updateSubpathStart) { this.updateSubpathStartSegment(updateSubpathStart); }

            return segment;
        },

        // Remove the segment at `index`.
        // Accepts negative indices, from `-1` to `-segments.length`.
        // Throws an error if path has no segments.
        // Throws an error if index is out of range.
        removeSegment: function(index) {

            var segments = this.segments;
            var numSegments = segments.length;
            if (numSegments === 0) { throw new Error('Path has no segments.'); }

            if (index < 0) { index = numSegments + index; } // convert negative indices to positive
            if (index >= numSegments || index < 0) { throw new Error('Index out of range.'); }

            var removedSegment = segments.splice(index, 1)[0];
            var previousSegment = removedSegment.previousSegment;
            var nextSegment = removedSegment.nextSegment;

            // link the previous and next segments together (if present)
            if (previousSegment) { previousSegment.nextSegment = nextSegment; } // may be null
            if (nextSegment) { nextSegment.previousSegment = previousSegment; } // may be null

            // if removed segment used to start a subpath, update all subsequent segments until another subpath start segment is reached
            if (removedSegment.isSubpathStart && nextSegment) { this.updateSubpathStartSegment(nextSegment); }
        },

        // Replace the segment at `index` with `arg`.
        // Accepts negative indices, from `-1` to `-segments.length`.
        // Accepts one segment or an array of segments as argument.
        // Throws an error if path has no segments.
        // Throws an error if index is out of range.
        // Throws an error if argument is not a segment or an array of segments.
        replaceSegment: function(index, arg) {

            var segments = this.segments;
            var numSegments = segments.length;
            if (numSegments === 0) { throw new Error('Path has no segments.'); }

            if (index < 0) { index = numSegments + index; } // convert negative indices to positive
            if (index >= numSegments || index < 0) { throw new Error('Index out of range.'); }

            var currentSegment;

            var replacedSegment = segments[index];
            var previousSegment = replacedSegment.previousSegment;
            var nextSegment = replacedSegment.nextSegment;

            var updateSubpathStart = replacedSegment.isSubpathStart; // boolean: is an update of subpath starts necessary?

            if (!Array.isArray(arg)) {
                if (!arg || !arg.isSegment) { throw new Error('Segment required.'); }

                currentSegment = this.prepareSegment(arg, previousSegment, nextSegment);
                segments.splice(index, 1, currentSegment); // directly replace

                if (updateSubpathStart && currentSegment.isSubpathStart) { updateSubpathStart = false; } // already updated by `prepareSegment`

            } else {
                // flatten one level deep
                // so we can chain arbitrary Path.createSegment results
                arg = arg.reduce(function(acc, val) {
                    return acc.concat(val);
                }, []);

                if (!arg[0].isSegment) { throw new Error('Segments required.'); }

                segments.splice(index, 1);

                var n = arg.length;
                for (var i = 0; i < n; i++) {

                    var currentArg = arg[i];
                    currentSegment = this.prepareSegment(currentArg, previousSegment, nextSegment);
                    segments.splice((index + i), 0, currentSegment); // incrementing index to insert subsequent segments after inserted segments
                    previousSegment = currentSegment;

                    if (updateSubpathStart && currentSegment.isSubpathStart) { updateSubpathStart = false; } // already updated by `prepareSegment`
                }
            }

            // if replaced segment used to start a subpath and no new subpath start was added, update all subsequent segments until another subpath start segment is reached
            if (updateSubpathStart && nextSegment) { this.updateSubpathStartSegment(nextSegment); }
        },

        scale: function(sx, sy, origin) {

            var segments = this.segments;
            var numSegments = segments.length;

            for (var i = 0; i < numSegments; i++) {

                var segment = segments[i];
                segment.scale(sx, sy, origin);
            }

            return this;
        },

        segmentAt: function(ratio, opt) {

            var index = this.segmentIndexAt(ratio, opt);
            if (!index) { return null; }

            return this.getSegment(index);
        },

        // Accepts negative length.
        segmentAtLength: function(length, opt) {

            var index = this.segmentIndexAtLength(length, opt);
            if (!index) { return null; }

            return this.getSegment(index);
        },

        segmentIndexAt: function(ratio, opt) {

            var segments = this.segments;
            var numSegments = segments.length;
            if (numSegments === 0) { return null; } // if segments is an empty array

            if (ratio < 0) { ratio = 0; }
            if (ratio > 1) { ratio = 1; }

            opt = opt || {};
            var precision = (opt.precision === undefined) ? this.PRECISION : opt.precision;
            var segmentSubdivisions = (opt.segmentSubdivisions === undefined) ? this.getSegmentSubdivisions({ precision: precision }) : opt.segmentSubdivisions;
            var localOpt = { precision: precision, segmentSubdivisions: segmentSubdivisions };

            var pathLength = this.length(localOpt);
            var length = pathLength * ratio;

            return this.segmentIndexAtLength(length, localOpt);
        },

        // Accepts negative length.
        segmentIndexAtLength: function(length, opt) {

            var segments = this.segments;
            var numSegments = segments.length;
            if (numSegments === 0) { return null; } // if segments is an empty array

            var fromStart = true;
            if (length < 0) {
                fromStart = false; // negative lengths mean start calculation from end point
                length = -length; // absolute value
            }

            opt = opt || {};
            var precision = (opt.precision === undefined) ? this.PRECISION : opt.precision;
            var segmentSubdivisions = (opt.segmentSubdivisions === undefined) ? this.getSegmentSubdivisions({ precision: precision }) : opt.segmentSubdivisions;
            // not using localOpt

            var lastVisibleSegmentIndex = null;
            var l = 0; // length so far
            for (var i = 0; i < numSegments; i++) {
                var index = (fromStart ? i : (numSegments - 1 - i));

                var segment = segments[index];
                var subdivisions = segmentSubdivisions[index];
                var d = segment.length({ precision: precision, subdivisions: subdivisions });

                if (segment.isVisible) {
                    if (length <= (l + d)) { return index; }
                    lastVisibleSegmentIndex = index;
                }

                l += d;
            }

            // if length requested is higher than the length of the path, return last visible segment index
            // if no visible segment, return null
            return lastVisibleSegmentIndex;
        },

        // Returns a string that can be used to reconstruct the path.
        // Additional error checking compared to toString (must start with M segment).
        serialize: function() {

            if (!this.isValid()) { throw new Error('Invalid path segments.'); }

            return this.toString();
        },

        // Returns tangent line at requested `ratio` between 0 and 1, with precision better than requested `opt.precision`; optionally using `opt.segmentSubdivisions` provided.
        tangentAt: function(ratio, opt) {

            var segments = this.segments;
            var numSegments = segments.length;
            if (numSegments === 0) { return null; } // if segments is an empty array

            if (ratio < 0) { ratio = 0; }
            if (ratio > 1) { ratio = 1; }

            opt = opt || {};
            var precision = (opt.precision === undefined) ? this.PRECISION : opt.precision;
            var segmentSubdivisions = (opt.segmentSubdivisions === undefined) ? this.getSegmentSubdivisions({ precision: precision }) : opt.segmentSubdivisions;
            var localOpt = { precision: precision, segmentSubdivisions: segmentSubdivisions };

            var pathLength = this.length(localOpt);
            var length = pathLength * ratio;

            return this.tangentAtLength(length, localOpt);
        },

        // Returns tangent line at requested `length`, with precision better than requested `opt.precision`; optionally using `opt.segmentSubdivisions` provided.
        // Accepts negative length.
        tangentAtLength: function(length, opt) {

            var segments = this.segments;
            var numSegments = segments.length;
            if (numSegments === 0) { return null; } // if segments is an empty array

            var fromStart = true;
            if (length < 0) {
                fromStart = false; // negative lengths mean start calculation from end point
                length = -length; // absolute value
            }

            opt = opt || {};
            var precision = (opt.precision === undefined) ? this.PRECISION : opt.precision;
            var segmentSubdivisions = (opt.segmentSubdivisions === undefined) ? this.getSegmentSubdivisions({ precision: precision }) : opt.segmentSubdivisions;
            // not using localOpt

            var lastValidSegment; // visible AND differentiable (with a tangent)
            var l = 0; // length so far
            for (var i = 0; i < numSegments; i++) {
                var index = (fromStart ? i : (numSegments - 1 - i));

                var segment = segments[index];
                var subdivisions = segmentSubdivisions[index];
                var d = segment.length({ precision: precision, subdivisions: subdivisions });

                if (segment.isDifferentiable()) {
                    if (length <= (l + d)) {
                        return segment.tangentAtLength(((fromStart ? 1 : -1) * (length - l)), {
                            precision: precision,
                            subdivisions: subdivisions
                        });
                    }

                    lastValidSegment = segment;
                }

                l += d;
            }

            // if length requested is higher than the length of the path, return tangent of endpoint of last valid segment
            if (lastValidSegment) {
                var t = (fromStart ? 1 : 0);
                return lastValidSegment.tangentAtT(t);
            }

            // if no valid segment, return null
            return null;
        },

        // Private function.
        tangentAtT: function(t) {

            var segments = this.segments;
            var numSegments = segments.length;
            if (numSegments === 0) { return null; } // if segments is an empty array

            var segmentIndex = t.segmentIndex;
            if (segmentIndex < 0) { return segments[0].tangentAtT(0); }
            if (segmentIndex >= numSegments) { return segments[numSegments - 1].tangentAtT(1); }

            var tValue = t.value;
            if (tValue < 0) { tValue = 0; }
            else if (tValue > 1) { tValue = 1; }

            return segments[segmentIndex].tangentAtT(tValue);
        },

        toPoints: function(opt) {

            var segments = this.segments;
            var numSegments = segments.length;
            if (numSegments === 0) { return null; } // if segments is an empty array

            opt = opt || {};
            var precision = (opt.precision === undefined) ? this.PRECISION : opt.precision;
            var segmentSubdivisions = (opt.segmentSubdivisions === undefined) ? this.getSegmentSubdivisions({ precision: precision }) : opt.segmentSubdivisions;

            var points = [];
            var partialPoints = [];
            for (var i = 0; i < numSegments; i++) {
                var segment = segments[i];
                if (segment.isVisible) {
                    var currentSegmentSubdivisions = segmentSubdivisions[i];
                    if (currentSegmentSubdivisions.length > 0) {
                        var subdivisionPoints = currentSegmentSubdivisions.map(function(curve) {
                            return curve.start;
                        });
                        Array.prototype.push.apply(partialPoints, subdivisionPoints);
                    } else {
                        partialPoints.push(segment.start);
                    }
                } else if (partialPoints.length > 0) {
                    partialPoints.push(segments[i - 1].end);
                    points.push(partialPoints);
                    partialPoints = [];
                }
            }

            if (partialPoints.length > 0) {
                partialPoints.push(this.end);
                points.push(partialPoints);
            }
            return points;
        },

        toPolylines: function(opt) {

            var polylines = [];
            var points = this.toPoints(opt);
            if (!points) { return null; }
            for (var i = 0, n = points.length; i < n; i++) {
                polylines.push(new Polyline(points[i]));
            }

            return polylines;
        },

        toString: function() {

            var segments = this.segments;
            var numSegments = segments.length;

            var pathData = '';
            for (var i = 0; i < numSegments; i++) {

                var segment = segments[i];
                pathData += segment.serialize() + ' ';
            }

            return pathData.trim();
        },

        translate: function(tx, ty) {

            var segments = this.segments;
            var numSegments = segments.length;

            for (var i = 0; i < numSegments; i++) {

                var segment = segments[i];
                segment.translate(tx, ty);
            }

            return this;
        },

        // Helper method for updating subpath start of segments, starting with the one provided.
        updateSubpathStartSegment: function(segment) {

            var previousSegment = segment.previousSegment; // may be null
            while (segment && !segment.isSubpathStart) {

                // assign previous segment's subpath start segment to this segment
                if (previousSegment) { segment.subpathStartSegment = previousSegment.subpathStartSegment; } // may be null
                else { segment.subpathStartSegment = null; } // if segment had no previous segment, assign null - creates an invalid path!

                previousSegment = segment;
                segment = segment.nextSegment; // move on to the segment after etc.
            }
        }
    };

    Object.defineProperty(Path.prototype, 'start', {
        // Getter for the first visible endpoint of the path.

        configurable: true,

        enumerable: true,

        get: function() {

            var segments = this.segments;
            var numSegments = segments.length;
            if (numSegments === 0) { return null; }

            for (var i = 0; i < numSegments; i++) {

                var segment = segments[i];
                if (segment.isVisible) { return segment.start; }
            }

            // if no visible segment, return last segment end point
            return segments[numSegments - 1].end;
        }
    });

    Object.defineProperty(Path.prototype, 'end', {
        // Getter for the last visible endpoint of the path.

        configurable: true,

        enumerable: true,

        get: function() {

            var segments = this.segments;
            var numSegments = segments.length;
            if (numSegments === 0) { return null; }

            for (var i = numSegments - 1; i >= 0; i--) {

                var segment = segments[i];
                if (segment.isVisible) { return segment.end; }
            }

            // if no visible segment, return last segment end point
            return segments[numSegments - 1].end;
        }
    });

    /*
        Point is the most basic object consisting of x/y coordinate.

        Possible instantiations are:
        * `Point(10, 20)`
        * `new Point(10, 20)`
        * `Point('10 20')`
        * `Point(Point(10, 20))`
    */
    var Point = function(x, y) {

        if (!(this instanceof Point)) {
            return new Point(x, y);
        }

        if (typeof x === 'string') {
            var xy = x.split(x.indexOf('@') === -1 ? ' ' : '@');
            x = parseFloat(xy[0]);
            y = parseFloat(xy[1]);

        } else if (Object(x) === x) {
            y = x.y;
            x = x.x;
        }

        this.x = x === undefined ? 0 : x;
        this.y = y === undefined ? 0 : y;
    };

    // Alternative constructor, from polar coordinates.
    // @param {number} Distance.
    // @param {number} Angle in radians.
    // @param {point} [optional] Origin.
    Point.fromPolar = function(distance, angle, origin) {

        origin = (origin && new Point(origin)) || new Point(0, 0);
        var x = abs(distance * cos(angle));
        var y = abs(distance * sin(angle));
        var deg = normalizeAngle(toDeg(angle));

        if (deg < 90) {
            y = -y;

        } else if (deg < 180) {
            x = -x;
            y = -y;

        } else if (deg < 270) {
            x = -x;
        }

        return new Point(origin.x + x, origin.y + y);
    };

    // Create a point with random coordinates that fall into the range `[x1, x2]` and `[y1, y2]`.
    Point.random = function(x1, x2, y1, y2) {

        return new Point(random(x1, x2), random(y1, y2));
    };

    Point.prototype = {

        chooseClosest: function(points) {

            var n = points.length;
            if (n === 1) { return new Point(points[0]); }
            var closest = null;
            var minSqrDistance = Infinity;
            for (var i = 0; i < n; i++) {
                var p = new Point(points[i]);
                var sqrDistance = this.squaredDistance(p);
                if (sqrDistance < minSqrDistance) {
                    closest = p;
                    minSqrDistance = sqrDistance;
                }
            }
            return closest;
        },

        // If point lies outside rectangle `r`, return the nearest point on the boundary of rect `r`,
        // otherwise return point itself.
        // (see Squeak Smalltalk, Point>>adhereTo:)
        adhereToRect: function(r) {

            if (r.containsPoint(this)) {
                return this;
            }

            this.x = min(max(this.x, r.x), r.x + r.width);
            this.y = min(max(this.y, r.y), r.y + r.height);
            return this;
        },

        // Compute the angle between vector from me to p1 and the vector from me to p2.
        // ordering of points p1 and p2 is important!
        // theta function's angle convention:
        // returns angles between 0 and 180 when the angle is counterclockwise
        // returns angles between 180 and 360 to convert clockwise angles into counterclockwise ones
        // returns NaN if any of the points p1, p2 is coincident with this point
        angleBetween: function(p1, p2) {

            var angleBetween = (this.equals(p1) || this.equals(p2)) ? NaN : (this.theta(p2) - this.theta(p1));

            if (angleBetween < 0) {
                angleBetween += 360; // correction to keep angleBetween between 0 and 360
            }

            return angleBetween;
        },

        // Return the bearing between me and the given point.
        bearing: function(point) {

            return (new Line(this, point)).bearing();
        },

        // Returns change in angle from my previous position (-dx, -dy) to my new position
        // relative to ref point.
        changeInAngle: function(dx, dy, ref) {

            // Revert the translation and measure the change in angle around x-axis.
            return this.clone().offset(-dx, -dy).theta(ref) - this.theta(ref);
        },

        clone: function() {

            return new Point(this);
        },

        // Returns the cross product of this point relative to two other points
        // this point is the common point
        // point p1 lies on the first vector, point p2 lies on the second vector
        // watch out for the ordering of points p1 and p2!
        // positive result indicates a clockwise ("right") turn from first to second vector
        // negative result indicates a counterclockwise ("left") turn from first to second vector
        // zero indicates that the first and second vector are collinear
        // note that the above directions are reversed from the usual answer on the Internet
        // that is because we are in a left-handed coord system (because the y-axis points downward)
        cross: function(p1, p2) {

            return (p1 && p2) ? (((p2.x - this.x) * (p1.y - this.y)) - ((p2.y - this.y) * (p1.x - this.x))) : NaN;
        },

        difference: function(dx, dy) {

            if ((Object(dx) === dx)) {
                dy = dx.y;
                dx = dx.x;
            }

            return new Point(this.x - (dx || 0), this.y - (dy || 0));
        },

        // Returns distance between me and point `p`.
        distance: function(p) {

            return (new Line(this, p)).length();
        },

        // Returns the dot product of this point with given other point
        dot: function(p) {

            return p ? (this.x * p.x + this.y * p.y) : NaN;
        },

        equals: function(p) {

            return !!p &&
                this.x === p.x &&
                this.y === p.y;
        },

        // Linear interpolation
        lerp: function(p, t) {

            var x = this.x;
            var y = this.y;
            return new Point((1 - t) * x + t * p.x, (1 - t) * y + t * p.y);
        },

        magnitude: function() {

            return sqrt((this.x * this.x) + (this.y * this.y)) || 0.01;
        },

        // Returns a manhattan (taxi-cab) distance between me and point `p`.
        manhattanDistance: function(p) {

            return abs(p.x - this.x) + abs(p.y - this.y);
        },

        // Move point on line starting from ref ending at me by
        // distance distance.
        move: function(ref, distance) {

            var theta = toRad((new Point(ref)).theta(this));
            var offset = this.offset(cos(theta) * distance, -sin(theta) * distance);
            return offset;
        },

        // Scales x and y such that the distance between the point and the origin (0,0) is equal to the given length.
        normalize: function(length) {

            var scale = (length || 1) / this.magnitude();
            return this.scale(scale, scale);
        },

        // Offset me by the specified amount.
        offset: function(dx, dy) {

            if ((Object(dx) === dx)) {
                dy = dx.y;
                dx = dx.x;
            }

            this.x += dx || 0;
            this.y += dy || 0;
            return this;
        },

        // Returns a point that is the reflection of me with
        // the center of inversion in ref point.
        reflection: function(ref) {

            return (new Point(ref)).move(this, this.distance(ref));
        },

        // Rotate point by angle around origin.
        // Angle is flipped because this is a left-handed coord system (y-axis points downward).
        rotate: function(origin, angle) {

            origin = origin || new Point(0, 0);

            angle = toRad(normalizeAngle(-angle));
            var cosAngle = cos(angle);
            var sinAngle = sin(angle);

            var x = (cosAngle * (this.x - origin.x)) - (sinAngle * (this.y - origin.y)) + origin.x;
            var y = (sinAngle * (this.x - origin.x)) + (cosAngle * (this.y - origin.y)) + origin.y;

            this.x = x;
            this.y = y;
            return this;
        },

        round: function(precision) {

            var f = pow(10, precision || 0);
            this.x = round(this.x * f) / f;
            this.y = round(this.y * f) / f;
            return this;
        },

        // Scale point with origin.
        scale: function(sx, sy, origin) {

            origin = (origin && new Point(origin)) || new Point(0, 0);
            this.x = origin.x + sx * (this.x - origin.x);
            this.y = origin.y + sy * (this.y - origin.y);
            return this;
        },

        snapToGrid: function(gx, gy) {

            this.x = snapToGrid(this.x, gx);
            this.y = snapToGrid(this.y, gy || gx);
            return this;
        },

        squaredDistance: function(p) {

            return (new Line(this, p)).squaredLength();
        },

        // Compute the angle between me and `p` and the x axis.
        // (cartesian-to-polar coordinates conversion)
        // Return theta angle in degrees.
        theta: function(p) {

            p = new Point(p);

            // Invert the y-axis.
            var y = -(p.y - this.y);
            var x = p.x - this.x;
            var rad = atan2(y, x); // defined for all 0 corner cases

            // Correction for III. and IV. quadrant.
            if (rad < 0) {
                rad = 2 * PI + rad;
            }

            return 180 * rad / PI;
        },

        toJSON: function() {

            return { x: this.x, y: this.y };
        },

        // Converts rectangular to polar coordinates.
        // An origin can be specified, otherwise it's 0@0.
        toPolar: function(o) {

            o = (o && new Point(o)) || new Point(0, 0);
            var x = this.x;
            var y = this.y;
            this.x = sqrt((x - o.x) * (x - o.x) + (y - o.y) * (y - o.y)); // r
            this.y = toRad(o.theta(new Point(x, y)));
            return this;
        },

        toString: function() {

            return this.x + '@' + this.y;
        },

        update: function(x, y) {

            this.x = x || 0;
            this.y = y || 0;
            return this;
        },

        // Compute the angle between the vector from 0,0 to me and the vector from 0,0 to p.
        // Returns NaN if p is at 0,0.
        vectorAngle: function(p) {

            var zero = new Point(0, 0);
            return zero.angleBetween(this, p);
        }
    };

    Point.prototype.translate = Point.prototype.offset;

    var Polyline = function(points) {

        if (!(this instanceof Polyline)) {
            return new Polyline(points);
        }

        if (typeof points === 'string') {
            return new Polyline.parse(points);
        }

        this.points = (Array.isArray(points) ? points.map(Point) : []);
    };

    Polyline.parse = function(svgString) {
        svgString = svgString.trim();
        if (svgString === '') { return new Polyline(); }

        var points = [];

        var coords = svgString.split(/\s*,\s*|\s+/);
        var n = coords.length;
        for (var i = 0; i < n; i += 2) {
            points.push({ x: +coords[i], y: +coords[i + 1] });
        }

        return new Polyline(points);
    };

    Polyline.prototype = {

        bbox: function() {

            var x1 = Infinity;
            var x2 = -Infinity;
            var y1 = Infinity;
            var y2 = -Infinity;

            var points = this.points;
            var numPoints = points.length;
            if (numPoints === 0) { return null; } // if points array is empty

            for (var i = 0; i < numPoints; i++) {

                var point = points[i];
                var x = point.x;
                var y = point.y;

                if (x < x1) { x1 = x; }
                if (x > x2) { x2 = x; }
                if (y < y1) { y1 = y; }
                if (y > y2) { y2 = y; }
            }

            return new Rect(x1, y1, x2 - x1, y2 - y1);
        },

        clone: function() {

            var points = this.points;
            var numPoints = points.length;
            if (numPoints === 0) { return new Polyline(); } // if points array is empty

            var newPoints = [];
            for (var i = 0; i < numPoints; i++) {

                var point = points[i].clone();
                newPoints.push(point);
            }

            return new Polyline(newPoints);
        },

        closestPoint: function(p) {

            var cpLength = this.closestPointLength(p);

            return this.pointAtLength(cpLength);
        },

        closestPointLength: function(p) {

            var points = this.points;
            var numPoints = points.length;
            if (numPoints === 0) { return 0; } // if points array is empty
            if (numPoints === 1) { return 0; } // if there is only one point

            var cpLength;
            var minSqrDistance = Infinity;
            var length = 0;
            var n = numPoints - 1;
            for (var i = 0; i < n; i++) {

                var line = new Line(points[i], points[i + 1]);
                var lineLength = line.length();

                var cpNormalizedLength = line.closestPointNormalizedLength(p);
                var cp = line.pointAt(cpNormalizedLength);

                var sqrDistance = cp.squaredDistance(p);
                if (sqrDistance < minSqrDistance) {
                    minSqrDistance = sqrDistance;
                    cpLength = length + (cpNormalizedLength * lineLength);
                }

                length += lineLength;
            }

            return cpLength;
        },

        closestPointNormalizedLength: function(p) {

            var cpLength = this.closestPointLength(p);
            if (cpLength === 0) { return 0; } // shortcut

            var length = this.length();
            if (length === 0) { return 0; } // prevents division by zero

            return cpLength / length;
        },

        closestPointTangent: function(p) {

            var cpLength = this.closestPointLength(p);

            return this.tangentAtLength(cpLength);
        },

        // Returns `true` if the area surrounded by the polyline contains the point `p`.
        // Implements the even-odd SVG algorithm (self-intersections are "outside").
        // (Uses horizontal rays to the right of `p` to look for intersections.)
        // Closes open polylines (always imagines a final closing segment).
        containsPoint: function(p) {

            var points = this.points;
            var numPoints = points.length;
            if (numPoints === 0) { return false; } // shortcut (this polyline has no points)

            var x = p.x;
            var y = p.y;

            // initialize a final closing segment by creating one from last-first points on polyline
            var startIndex = numPoints - 1; // start of current polyline segment
            var endIndex = 0; // end of current polyline segment
            var numIntersections = 0;
            for (; endIndex < numPoints; endIndex++) {
                var start = points[startIndex];
                var end = points[endIndex];
                if (p.equals(start)) { return true; } // shortcut (`p` is a point on polyline)

                var segment = new Line(start, end); // current polyline segment
                if (segment.containsPoint(p)) { return true; } // shortcut (`p` lies on a polyline segment)

                // do we have an intersection?
                if (((y <= start.y) && (y > end.y)) || ((y > start.y) && (y <= end.y))) {
                    // this conditional branch IS NOT entered when `segment` is collinear/coincident with `ray`
                    // (when `y === start.y === end.y`)
                    // this conditional branch IS entered when `segment` touches `ray` at only one point
                    // (e.g. when `y === start.y !== end.y`)
                    // since this branch is entered again for the following segment, the two touches cancel out

                    var xDifference = (((start.x - x) > (end.x - x)) ? (start.x - x) : (end.x - x));
                    if (xDifference >= 0) {
                        // segment lies at least partially to the right of `p`
                        var rayEnd = new Point((x + xDifference), y); // right
                        var ray = new Line(p, rayEnd);

                        if (segment.intersect(ray)) {
                            // an intersection was detected to the right of `p`
                            numIntersections++;
                        }
                    } // else: `segment` lies completely to the left of `p` (i.e. no intersection to the right)
                }

                // move to check the next polyline segment
                startIndex = endIndex;
            }

            // returns `true` for odd numbers of intersections (even-odd algorithm)
            return ((numIntersections % 2) === 1);
        },

        // Returns a convex-hull polyline from this polyline.
        // Implements the Graham scan (https://en.wikipedia.org/wiki/Graham_scan).
        // Output polyline starts at the first element of the original polyline that is on the hull, then continues clockwise.
        // Minimal polyline is found (only vertices of the hull are reported, no collinear points).
        convexHull: function() {

            var i;
            var n;

            var points = this.points;
            var numPoints = points.length;
            if (numPoints === 0) { return new Polyline(); } // if points array is empty

            // step 1: find the starting point - point with the lowest y (if equality, highest x)
            var startPoint;
            for (i = 0; i < numPoints; i++) {
                if (startPoint === undefined) {
                    // if this is the first point we see, set it as start point
                    startPoint = points[i];

                } else if (points[i].y < startPoint.y) {
                    // start point should have lowest y from all points
                    startPoint = points[i];

                } else if ((points[i].y === startPoint.y) && (points[i].x > startPoint.x)) {
                    // if two points have the lowest y, choose the one that has highest x
                    // there are no points to the right of startPoint - no ambiguity about theta 0
                    // if there are several coincident start point candidates, first one is reported
                    startPoint = points[i];
                }
            }

            // step 2: sort the list of points
            // sorting by angle between line from startPoint to point and the x-axis (theta)

            // step 2a: create the point records = [point, originalIndex, angle]
            var sortedPointRecords = [];
            for (i = 0; i < numPoints; i++) {

                var angle = startPoint.theta(points[i]);
                if (angle === 0) {
                    angle = 360; // give highest angle to start point
                    // the start point will end up at end of sorted list
                    // the start point will end up at beginning of hull points list
                }

                var entry = [points[i], i, angle];
                sortedPointRecords.push(entry);
            }

            // step 2b: sort the list in place
            sortedPointRecords.sort(function(record1, record2) {
                // returning a negative number here sorts record1 before record2
                // if first angle is smaller than second, first angle should come before second

                var sortOutput = record1[2] - record2[2];  // negative if first angle smaller
                if (sortOutput === 0) {
                    // if the two angles are equal, sort by originalIndex
                    sortOutput = record2[1] - record1[1]; // negative if first index larger
                    // coincident points will be sorted in reverse-numerical order
                    // so the coincident points with lower original index will be considered first
                }

                return sortOutput;
            });

            // step 2c: duplicate start record from the top of the stack to the bottom of the stack
            if (sortedPointRecords.length > 2) {
                var startPointRecord = sortedPointRecords[sortedPointRecords.length - 1];
                sortedPointRecords.unshift(startPointRecord);
            }

            // step 3a: go through sorted points in order and find those with right turns
            // we want to get our results in clockwise order
            var insidePoints = {}; // dictionary of points with left turns - cannot be on the hull
            var hullPointRecords = []; // stack of records with right turns - hull point candidates

            var currentPointRecord;
            var currentPoint;
            var lastHullPointRecord;
            var lastHullPoint;
            var secondLastHullPointRecord;
            var secondLastHullPoint;
            while (sortedPointRecords.length !== 0) {

                currentPointRecord = sortedPointRecords.pop();
                currentPoint = currentPointRecord[0];

                // check if point has already been discarded
                // keys for insidePoints are stored in the form 'point.x@point.y@@originalIndex'
                if (insidePoints.hasOwnProperty(currentPointRecord[0] + '@@' + currentPointRecord[1])) {
                    // this point had an incorrect turn at some previous iteration of this loop
                    // this disqualifies it from possibly being on the hull
                    continue;
                }

                var correctTurnFound = false;
                while (!correctTurnFound) {

                    if (hullPointRecords.length < 2) {
                        // not enough points for comparison, just add current point
                        hullPointRecords.push(currentPointRecord);
                        correctTurnFound = true;

                    } else {
                        lastHullPointRecord = hullPointRecords.pop();
                        lastHullPoint = lastHullPointRecord[0];
                        secondLastHullPointRecord = hullPointRecords.pop();
                        secondLastHullPoint = secondLastHullPointRecord[0];

                        var crossProduct = secondLastHullPoint.cross(lastHullPoint, currentPoint);

                        if (crossProduct < 0) {
                            // found a right turn
                            hullPointRecords.push(secondLastHullPointRecord);
                            hullPointRecords.push(lastHullPointRecord);
                            hullPointRecords.push(currentPointRecord);
                            correctTurnFound = true;

                        } else if (crossProduct === 0) {
                            // the three points are collinear
                            // three options:
                            // there may be a 180 or 0 degree angle at lastHullPoint
                            // or two of the three points are coincident
                            var THRESHOLD = 1e-10; // we have to take rounding errors into account
                            var angleBetween = lastHullPoint.angleBetween(secondLastHullPoint, currentPoint);
                            if (abs(angleBetween - 180) < THRESHOLD) { // rouding around 180 to 180
                                // if the cross product is 0 because the angle is 180 degrees
                                // discard last hull point (add to insidePoints)
                                //insidePoints.unshift(lastHullPoint);
                                insidePoints[lastHullPointRecord[0] + '@@' + lastHullPointRecord[1]] = lastHullPoint;
                                // reenter second-to-last hull point (will be last at next iter)
                                hullPointRecords.push(secondLastHullPointRecord);
                                // do not do anything with current point
                                // correct turn not found

                            } else if (lastHullPoint.equals(currentPoint) || secondLastHullPoint.equals(lastHullPoint)) {
                                // if the cross product is 0 because two points are the same
                                // discard last hull point (add to insidePoints)
                                //insidePoints.unshift(lastHullPoint);
                                insidePoints[lastHullPointRecord[0] + '@@' + lastHullPointRecord[1]] = lastHullPoint;
                                // reenter second-to-last hull point (will be last at next iter)
                                hullPointRecords.push(secondLastHullPointRecord);
                                // do not do anything with current point
                                // correct turn not found

                            } else if (abs(((angleBetween + 1) % 360) - 1) < THRESHOLD) { // rounding around 0 and 360 to 0
                                // if the cross product is 0 because the angle is 0 degrees
                                // remove last hull point from hull BUT do not discard it
                                // reenter second-to-last hull point (will be last at next iter)
                                hullPointRecords.push(secondLastHullPointRecord);
                                // put last hull point back into the sorted point records list
                                sortedPointRecords.push(lastHullPointRecord);
                                // we are switching the order of the 0deg and 180deg points
                                // correct turn not found
                            }

                        } else {
                            // found a left turn
                            // discard last hull point (add to insidePoints)
                            //insidePoints.unshift(lastHullPoint);
                            insidePoints[lastHullPointRecord[0] + '@@' + lastHullPointRecord[1]] = lastHullPoint;
                            // reenter second-to-last hull point (will be last at next iter of loop)
                            hullPointRecords.push(secondLastHullPointRecord);
                            // do not do anything with current point
                            // correct turn not found
                        }
                    }
                }
            }
            // at this point, hullPointRecords contains the output points in clockwise order
            // the points start with lowest-y,highest-x startPoint, and end at the same point

            // step 3b: remove duplicated startPointRecord from the end of the array
            if (hullPointRecords.length > 2) {
                hullPointRecords.pop();
            }

            // step 4: find the lowest originalIndex record and put it at the beginning of hull
            var lowestHullIndex; // the lowest originalIndex on the hull
            var indexOfLowestHullIndexRecord = -1; // the index of the record with lowestHullIndex
            n = hullPointRecords.length;
            for (i = 0; i < n; i++) {

                var currentHullIndex = hullPointRecords[i][1];

                if (lowestHullIndex === undefined || currentHullIndex < lowestHullIndex) {
                    lowestHullIndex = currentHullIndex;
                    indexOfLowestHullIndexRecord = i;
                }
            }

            var hullPointRecordsReordered = [];
            if (indexOfLowestHullIndexRecord > 0) {
                var newFirstChunk = hullPointRecords.slice(indexOfLowestHullIndexRecord);
                var newSecondChunk = hullPointRecords.slice(0, indexOfLowestHullIndexRecord);
                hullPointRecordsReordered = newFirstChunk.concat(newSecondChunk);

            } else {
                hullPointRecordsReordered = hullPointRecords;
            }

            var hullPoints = [];
            n = hullPointRecordsReordered.length;
            for (i = 0; i < n; i++) {
                hullPoints.push(hullPointRecordsReordered[i][0]);
            }

            return new Polyline(hullPoints);
        },

        // Checks whether two polylines are exactly the same.
        // If `p` is undefined or null, returns false.
        equals: function(p) {

            if (!p) { return false; }

            var points = this.points;
            var otherPoints = p.points;

            var numPoints = points.length;
            if (otherPoints.length !== numPoints) { return false; } // if the two polylines have different number of points, they cannot be equal

            for (var i = 0; i < numPoints; i++) {

                var point = points[i];
                var otherPoint = p.points[i];

                // as soon as an inequality is found in points, return false
                if (!point.equals(otherPoint)) { return false; }
            }

            // if no inequality found in points, return true
            return true;
        },

        intersectionWithLine: function(l) {
            var line = new Line(l);
            var intersections = [];
            var points = this.points;
            for (var i = 0, n = points.length - 1; i < n; i++) {
                var a = points[i];
                var b = points[i + 1];
                var l2 = new Line(a, b);
                var int = line.intersectionWithLine(l2);
                if (int) { intersections.push(int[0]); }
            }
            return (intersections.length > 0) ? intersections : null;
        },

        isDifferentiable: function() {

            var points = this.points;
            var numPoints = points.length;
            if (numPoints === 0) { return false; }

            var n = numPoints - 1;
            for (var i = 0; i < n; i++) {

                var a = points[i];
                var b = points[i + 1];
                var line = new Line(a, b);

                // as soon as a differentiable line is found between two points, return true
                if (line.isDifferentiable()) { return true; }
            }

            // if no differentiable line is found between pairs of points, return false
            return false;
        },

        length: function() {

            var points = this.points;
            var numPoints = points.length;
            if (numPoints === 0) { return 0; } // if points array is empty

            var length = 0;
            var n = numPoints - 1;
            for (var i = 0; i < n; i++) {
                length += points[i].distance(points[i + 1]);
            }

            return length;
        },

        pointAt: function(ratio) {

            var points = this.points;
            var numPoints = points.length;
            if (numPoints === 0) { return null; } // if points array is empty
            if (numPoints === 1) { return points[0].clone(); } // if there is only one point

            if (ratio <= 0) { return points[0].clone(); }
            if (ratio >= 1) { return points[numPoints - 1].clone(); }

            var polylineLength = this.length();
            var length = polylineLength * ratio;

            return this.pointAtLength(length);
        },

        pointAtLength: function(length) {

            var points = this.points;
            var numPoints = points.length;
            if (numPoints === 0) { return null; } // if points array is empty
            if (numPoints === 1) { return points[0].clone(); } // if there is only one point

            var fromStart = true;
            if (length < 0) {
                fromStart = false; // negative lengths mean start calculation from end point
                length = -length; // absolute value
            }

            var l = 0;
            var n = numPoints - 1;
            for (var i = 0; i < n; i++) {
                var index = (fromStart ? i : (n - 1 - i));

                var a = points[index];
                var b = points[index + 1];
                var line = new Line(a, b);
                var d = a.distance(b);

                if (length <= (l + d)) {
                    return line.pointAtLength((fromStart ? 1 : -1) * (length - l));
                }

                l += d;
            }

            // if length requested is higher than the length of the polyline, return last endpoint
            var lastPoint = (fromStart ? points[numPoints - 1] : points[0]);
            return lastPoint.clone();
        },

        scale: function(sx, sy, origin) {

            var points = this.points;
            var numPoints = points.length;
            if (numPoints === 0) { return this; } // if points array is empty

            for (var i = 0; i < numPoints; i++) {
                points[i].scale(sx, sy, origin);
            }

            return this;
        },

        tangentAt: function(ratio) {

            var points = this.points;
            var numPoints = points.length;
            if (numPoints === 0) { return null; } // if points array is empty
            if (numPoints === 1) { return null; } // if there is only one point

            if (ratio < 0) { ratio = 0; }
            if (ratio > 1) { ratio = 1; }

            var polylineLength = this.length();
            var length = polylineLength * ratio;

            return this.tangentAtLength(length);
        },

        tangentAtLength: function(length) {

            var points = this.points;
            var numPoints = points.length;
            if (numPoints === 0) { return null; } // if points array is empty
            if (numPoints === 1) { return null; } // if there is only one point

            var fromStart = true;
            if (length < 0) {
                fromStart = false; // negative lengths mean start calculation from end point
                length = -length; // absolute value
            }

            var lastValidLine; // differentiable (with a tangent)
            var l = 0; // length so far
            var n = numPoints - 1;
            for (var i = 0; i < n; i++) {
                var index = (fromStart ? i : (n - 1 - i));

                var a = points[index];
                var b = points[index + 1];
                var line = new Line(a, b);
                var d = a.distance(b);

                if (line.isDifferentiable()) { // has a tangent line (line length is not 0)
                    if (length <= (l + d)) {
                        return line.tangentAtLength((fromStart ? 1 : -1) * (length - l));
                    }

                    lastValidLine = line;
                }

                l += d;
            }

            // if length requested is higher than the length of the polyline, return last valid endpoint
            if (lastValidLine) {
                var ratio = (fromStart ? 1 : 0);
                return lastValidLine.tangentAt(ratio);
            }

            // if no valid line, return null
            return null;
        },

        toString: function() {

            return this.points + '';
        },

        translate: function(tx, ty) {

            var points = this.points;
            var numPoints = points.length;
            if (numPoints === 0) { return this; } // if points array is empty

            for (var i = 0; i < numPoints; i++) {
                points[i].translate(tx, ty);
            }

            return this;
        },

        // Return svgString that can be used to recreate this line.
        serialize: function() {

            var points = this.points;
            var numPoints = points.length;
            if (numPoints === 0) { return ''; } // if points array is empty

            var output = '';
            for (var i = 0; i < numPoints; i++) {

                var point = points[i];
                output += point.x + ',' + point.y + ' ';
            }

            return output.trim();
        }
    };

    Object.defineProperty(Polyline.prototype, 'start', {
        // Getter for the first point of the polyline.

        configurable: true,

        enumerable: true,

        get: function() {

            var points = this.points;
            var numPoints = points.length;
            if (numPoints === 0) { return null; } // if points array is empty

            return this.points[0];
        },
    });

    Object.defineProperty(Polyline.prototype, 'end', {
        // Getter for the last point of the polyline.

        configurable: true,

        enumerable: true,

        get: function() {

            var points = this.points;
            var numPoints = points.length;
            if (numPoints === 0) { return null; } // if points array is empty

            return this.points[numPoints - 1];
        },
    });

    var Rect = function(x, y, w, h) {

        if (!(this instanceof Rect)) {
            return new Rect(x, y, w, h);
        }

        if ((Object(x) === x)) {
            y = x.y;
            w = x.width;
            h = x.height;
            x = x.x;
        }

        this.x = x === undefined ? 0 : x;
        this.y = y === undefined ? 0 : y;
        this.width = w === undefined ? 0 : w;
        this.height = h === undefined ? 0 : h;
    };

    Rect.fromEllipse = function(e) {

        e = new Ellipse(e);
        return new Rect(e.x - e.a, e.y - e.b, 2 * e.a, 2 * e.b);
    };

    Rect.prototype = {

        // Find my bounding box when I'm rotated with the center of rotation in the center of me.
        // @return r {rectangle} representing a bounding box
        bbox: function(angle) {

            if (!angle) { return this.clone(); }

            var theta = toRad(angle);
            var st = abs(sin(theta));
            var ct = abs(cos(theta));
            var w = this.width * ct + this.height * st;
            var h = this.width * st + this.height * ct;
            return new Rect(this.x + (this.width - w) / 2, this.y + (this.height - h) / 2, w, h);
        },

        bottomLeft: function() {

            return new Point(this.x, this.y + this.height);
        },

        bottomLine: function() {

            return new Line(this.bottomLeft(), this.bottomRight());
        },

        bottomMiddle: function() {

            return new Point(this.x + this.width / 2, this.y + this.height);
        },

        center: function() {

            return new Point(this.x + this.width / 2, this.y + this.height / 2);
        },

        clone: function() {

            return new Rect(this);
        },

        // @return {bool} true if point p is inside me.
        containsPoint: function(p) {

            p = new Point(p);
            return p.x >= this.x && p.x <= this.x + this.width && p.y >= this.y && p.y <= this.y + this.height;
        },

        // @return {bool} true if rectangle `r` is inside me.
        containsRect: function(r) {

            var r0 = new Rect(this).normalize();
            var r1 = new Rect(r).normalize();
            var w0 = r0.width;
            var h0 = r0.height;
            var w1 = r1.width;
            var h1 = r1.height;

            if (!w0 || !h0 || !w1 || !h1) {
                // At least one of the dimensions is 0
                return false;
            }

            var x0 = r0.x;
            var y0 = r0.y;
            var x1 = r1.x;
            var y1 = r1.y;

            w1 += x1;
            w0 += x0;
            h1 += y1;
            h0 += y0;

            return x0 <= x1 && w1 <= w0 && y0 <= y1 && h1 <= h0;
        },

        corner: function() {

            return new Point(this.x + this.width, this.y + this.height);
        },

        // @return {boolean} true if rectangles are equal.
        equals: function(r) {

            var mr = (new Rect(this)).normalize();
            var nr = (new Rect(r)).normalize();
            return mr.x === nr.x && mr.y === nr.y && mr.width === nr.width && mr.height === nr.height;
        },

        // inflate by dx and dy, recompute origin [x, y]
        // @param dx {delta_x} representing additional size to x
        // @param dy {delta_y} representing additional size to y -
        // dy param is not required -> in that case y is sized by dx
        inflate: function(dx, dy) {

            if (dx === undefined) {
                dx = 0;
            }

            if (dy === undefined) {
                dy = dx;
            }

            this.x -= dx;
            this.y -= dy;
            this.width += 2 * dx;
            this.height += 2 * dy;

            return this;
        },

        // @return {rect} if rectangles intersect, {null} if not.
        intersect: function(r) {

            var myOrigin = this.origin();
            var myCorner = this.corner();
            var rOrigin = r.origin();
            var rCorner = r.corner();

            // No intersection found
            if (rCorner.x <= myOrigin.x ||
                rCorner.y <= myOrigin.y ||
                rOrigin.x >= myCorner.x ||
                rOrigin.y >= myCorner.y) { return null; }

            var x = max(myOrigin.x, rOrigin.x);
            var y = max(myOrigin.y, rOrigin.y);

            return new Rect(x, y, min(myCorner.x, rCorner.x) - x, min(myCorner.y, rCorner.y) - y);
        },

        intersectionWithLine: function(line) {

            var r = this;
            var rectLines = [r.topLine(), r.rightLine(), r.bottomLine(), r.leftLine()];
            var points = [];
            var dedupeArr = [];
            var pt, i;

            var n = rectLines.length;
            for (i = 0; i < n; i++) {

                pt = line.intersect(rectLines[i]);
                if (pt !== null && dedupeArr.indexOf(pt.toString()) < 0) {
                    points.push(pt);
                    dedupeArr.push(pt.toString());
                }
            }

            return points.length > 0 ? points : null;
        },

        // Find point on my boundary where line starting
        // from my center ending in point p intersects me.
        // @param {number} angle If angle is specified, intersection with rotated rectangle is computed.
        intersectionWithLineFromCenterToPoint: function(p, angle) {

            p = new Point(p);
            var center = new Point(this.x + this.width / 2, this.y + this.height / 2);
            var result;

            if (angle) { p.rotate(center, angle); }

            // (clockwise, starting from the top side)
            var sides = [
                this.topLine(),
                this.rightLine(),
                this.bottomLine(),
                this.leftLine()
            ];
            var connector = new Line(center, p);

            for (var i = sides.length - 1; i >= 0; --i) {
                var intersection = sides[i].intersection(connector);
                if (intersection !== null) {
                    result = intersection;
                    break;
                }
            }
            if (result && angle) { result.rotate(center, -angle); }
            return result;
        },

        leftLine: function() {

            return new Line(this.topLeft(), this.bottomLeft());
        },

        leftMiddle: function() {

            return new Point(this.x, this.y + this.height / 2);
        },

        maxRectScaleToFit: function(rect, origin) {

            rect = new Rect(rect);
            origin || (origin = rect.center());

            var sx1, sx2, sx3, sx4, sy1, sy2, sy3, sy4;
            var ox = origin.x;
            var oy = origin.y;

            // Here we find the maximal possible scale for all corner points (for x and y axis) of the rectangle,
            // so when the scale is applied the point is still inside the rectangle.

            sx1 = sx2 = sx3 = sx4 = sy1 = sy2 = sy3 = sy4 = Infinity;

            // Top Left
            var p1 = rect.topLeft();
            if (p1.x < ox) {
                sx1 = (this.x - ox) / (p1.x - ox);
            }
            if (p1.y < oy) {
                sy1 = (this.y - oy) / (p1.y - oy);
            }
            // Bottom Right
            var p2 = rect.bottomRight();
            if (p2.x > ox) {
                sx2 = (this.x + this.width - ox) / (p2.x - ox);
            }
            if (p2.y > oy) {
                sy2 = (this.y + this.height - oy) / (p2.y - oy);
            }
            // Top Right
            var p3 = rect.topRight();
            if (p3.x > ox) {
                sx3 = (this.x + this.width - ox) / (p3.x - ox);
            }
            if (p3.y < oy) {
                sy3 = (this.y - oy) / (p3.y - oy);
            }
            // Bottom Left
            var p4 = rect.bottomLeft();
            if (p4.x < ox) {
                sx4 = (this.x - ox) / (p4.x - ox);
            }
            if (p4.y > oy) {
                sy4 = (this.y + this.height - oy) / (p4.y - oy);
            }

            return {
                sx: min(sx1, sx2, sx3, sx4),
                sy: min(sy1, sy2, sy3, sy4)
            };
        },

        maxRectUniformScaleToFit: function(rect, origin) {

            var scale = this.maxRectScaleToFit(rect, origin);
            return min(scale.sx, scale.sy);
        },

        // Move and expand me.
        // @param r {rectangle} representing deltas
        moveAndExpand: function(r) {

            this.x += r.x || 0;
            this.y += r.y || 0;
            this.width += r.width || 0;
            this.height += r.height || 0;
            return this;
        },

        // Normalize the rectangle; i.e., make it so that it has a non-negative width and height.
        // If width < 0 the function swaps the left and right corners,
        // and it swaps the top and bottom corners if height < 0
        // like in http://qt-project.org/doc/qt-4.8/qrectf.html#normalized
        normalize: function() {

            var newx = this.x;
            var newy = this.y;
            var newwidth = this.width;
            var newheight = this.height;
            if (this.width < 0) {
                newx = this.x + this.width;
                newwidth = -this.width;
            }
            if (this.height < 0) {
                newy = this.y + this.height;
                newheight = -this.height;
            }
            this.x = newx;
            this.y = newy;
            this.width = newwidth;
            this.height = newheight;
            return this;
        },

        // Offset me by the specified amount.
        offset: function(dx, dy) {

            // pretend that this is a point and call offset()
            // rewrites x and y according to dx and dy
            return Point.prototype.offset.call(this, dx, dy);
        },

        origin: function() {

            return new Point(this.x, this.y);
        },

        // @return {point} a point on my boundary nearest to the given point.
        // @see Squeak Smalltalk, Rectangle>>pointNearestTo:
        pointNearestToPoint: function(point) {

            point = new Point(point);
            if (this.containsPoint(point)) {
                var side = this.sideNearestToPoint(point);
                switch (side) {
                    case 'right':
                        return new Point(this.x + this.width, point.y);
                    case 'left':
                        return new Point(this.x, point.y);
                    case 'bottom':
                        return new Point(point.x, this.y + this.height);
                    case 'top':
                        return new Point(point.x, this.y);
                }
            }
            return point.adhereToRect(this);
        },

        rightLine: function() {

            return new Line(this.topRight(), this.bottomRight());
        },

        rightMiddle: function() {

            return new Point(this.x + this.width, this.y + this.height / 2);
        },

        round: function(precision) {

            var f = pow(10, precision || 0);
            this.x = round(this.x * f) / f;
            this.y = round(this.y * f) / f;
            this.width = round(this.width * f) / f;
            this.height = round(this.height * f) / f;
            return this;
        },

        // Scale rectangle with origin.
        scale: function(sx, sy, origin) {

            origin = this.origin().scale(sx, sy, origin);
            this.x = origin.x;
            this.y = origin.y;
            this.width *= sx;
            this.height *= sy;
            return this;
        },

        // @return {string} (left|right|top|bottom) side which is nearest to point
        // @see Squeak Smalltalk, Rectangle>>sideNearestTo:
        sideNearestToPoint: function(point) {

            point = new Point(point);
            var distToLeft = point.x - this.x;
            var distToRight = (this.x + this.width) - point.x;
            var distToTop = point.y - this.y;
            var distToBottom = (this.y + this.height) - point.y;
            var closest = distToLeft;
            var side = 'left';

            if (distToRight < closest) {
                closest = distToRight;
                side = 'right';
            }
            if (distToTop < closest) {
                closest = distToTop;
                side = 'top';
            }
            if (distToBottom < closest) {
                // closest = distToBottom;
                side = 'bottom';
            }
            return side;
        },

        snapToGrid: function(gx, gy) {

            var origin = this.origin().snapToGrid(gx, gy);
            var corner = this.corner().snapToGrid(gx, gy);
            this.x = origin.x;
            this.y = origin.y;
            this.width = corner.x - origin.x;
            this.height = corner.y - origin.y;
            return this;
        },

        toJSON: function() {

            return { x: this.x, y: this.y, width: this.width, height: this.height };
        },

        topLine: function() {

            return new Line(this.topLeft(), this.topRight());
        },

        topMiddle: function() {

            return new Point(this.x + this.width / 2, this.y);
        },

        topRight: function() {

            return new Point(this.x + this.width, this.y);
        },

        toString: function() {

            return this.origin().toString() + ' ' + this.corner().toString();
        },

        // @return {rect} representing the union of both rectangles.
        union: function(rect) {

            rect = new Rect(rect);
            var myOrigin = this.origin();
            var myCorner = this.corner();
            var rOrigin = rect.origin();
            var rCorner = rect.corner();

            var originX = min(myOrigin.x, rOrigin.x);
            var originY = min(myOrigin.y, rOrigin.y);
            var cornerX = max(myCorner.x, rCorner.x);
            var cornerY = max(myCorner.y, rCorner.y);

            return new Rect(originX, originY, cornerX - originX, cornerY - originY);
        }
    };

    Rect.prototype.bottomRight = Rect.prototype.corner;

    Rect.prototype.topLeft = Rect.prototype.origin;

    Rect.prototype.translate = Rect.prototype.offset;

    var scale = {

        // Return the `value` from the `domain` interval scaled to the `range` interval.
        linear: function(domain, range, value) {

            var domainSpan = domain[1] - domain[0];
            var rangeSpan = range[1] - range[0];
            return (((value - domain[0]) / domainSpan) * rangeSpan + range[0]) || 0;
        }
    };

    var normalizeAngle = function(angle) {

        return (angle % 360) + (angle < 0 ? 360 : 0);
    };

    var snapToGrid = function(value, gridSize) {

        return gridSize * round(value / gridSize);
    };

    var toDeg = function(rad) {

        return (180 * rad / PI) % 360;
    };

    var toRad = function(deg, over360) {

        over360 = over360 || false;
        deg = over360 ? deg : (deg % 360);
        return deg * PI / 180;
    };

    // Return a random integer from the interval [min,max], inclusive.
    var random = function(min, max) {

        if (max === undefined) {
            // use first argument as max, min is 0
            max = (min === undefined) ? 1 : min;
            min = 0;

        } else if (max < min) {
            // switch max and min
            var temp = min;
            min = max;
            max = temp;
        }

        return floor((math.random() * (max - min + 1)) + min);
    };

    // For backwards compatibility:
    var ellipse = Ellipse;
    var line = Line;
    var point = Point;
    var rect = Rect;

    // Local helper function.
    // Use an array of arguments to call a constructor (function called with `new`).
    // Adapted from https://stackoverflow.com/a/8843181/2263595
    // It is not necessary to use this function if the arguments can be passed separately (i.e. if the number of arguments is limited).
    // - If that is the case, use `new constructor(arg1, arg2)`, for example.
    // It is not necessary to use this function if the function that needs an array of arguments is not supposed to be used as a constructor.
    // - If that is the case, use `f.apply(thisArg, [arg1, arg2...])`, for example.
    function applyToNew(constructor, argsArray) {
        // The `new` keyword can only be applied to functions that take a limited number of arguments.
        // - We can fake that with .bind().
        // - It calls a function (`constructor`, here) with the arguments that were provided to it - effectively transforming an unlimited number of arguments into limited.
        // - So `new (constructor.bind(thisArg, arg1, arg2...))`
        // - `thisArg` can be anything (e.g. null) because `new` keyword resets context to the constructor object.
        // We need to pass in a variable number of arguments to the bind() call.
        // - We can use .apply().
        // - So `new (constructor.bind.apply(constructor, [thisArg, arg1, arg2...]))`
        // - `thisArg` can still be anything because `new` overwrites it.
        // Finally, to make sure that constructor.bind overwriting is not a problem, we switch to `Function.prototype.bind`.
        // - So, the final version is `new (Function.prototype.bind.apply(constructor, [thisArg, arg1, arg2...]))`

        // The function expects `argsArray[0]` to be `thisArg`.
        // - This means that whatever is sent as the first element will be ignored.
        // - The constructor will only see arguments starting from argsArray[1].
        // - So, a new dummy element is inserted at the start of the array.
        argsArray.unshift(null);

        return new (Function.prototype.bind.apply(constructor, argsArray));
    }

    // Local helper function.
    // Add properties from arguments on top of properties from `obj`.
    // This allows for rudimentary inheritance.
    // - The `obj` argument acts as parent.
    // - This function creates a new object that inherits all `obj` properties and adds/replaces those that are present in arguments.
    // - A high-level example: calling `extend(Vehicle, Car)` would be akin to declaring `class Car extends Vehicle`.
    function extend(obj) {
        var arguments$1 = arguments;

        // In JavaScript, the combination of a constructor function (e.g. `g.Line = function(...) {...}`) and prototype (e.g. `g.Line.prototype = {...}) is akin to a C++ class.
        // - When inheritance is not necessary, we can leave it at that. (This would be akin to calling extend with only `obj`.)
        // - But, what if we wanted the `g.Line` quasiclass to inherit from another quasiclass (let's call it `g.GeometryObject`) in JavaScript?
        // - First, realize that both of those quasiclasses would still have their own separate constructor function.
        // - So what we are actually saying is that we want the `g.Line` prototype to inherit from `g.GeometryObject` prototype.
        // - This method provides a way to do exactly that.
        // - It copies parent prototype's properties, then adds extra ones from child prototype/overrides parent prototype properties with child prototype properties.
        // - Therefore, to continue with the example above:
        //   - `g.Line.prototype = extend(g.GeometryObject.prototype, linePrototype)`
        //   - Where `linePrototype` is a properties object that looks just like `g.Line.prototype` does right now.
        //   - Then, `g.Line` would allow the programmer to access to all methods currently in `g.Line.Prototype`, plus any non-overridden methods from `g.GeometryObject.prototype`.
        //   - In that aspect, `g.GeometryObject` would then act like the parent of `g.Line`.
        // - Multiple inheritance is also possible, if multiple arguments are provided.
        // - What if we wanted to add another level of abstraction between `g.GeometryObject` and `g.Line` (let's call it `g.LinearObject`)?
        //   - `g.Line.prototype = extend(g.GeometryObject.prototype, g.LinearObject.prototype, linePrototype)`
        //   - The ancestors are applied in order of appearance.
        //   - That means that `g.Line` would have inherited from `g.LinearObject` that would have inherited from `g.GeometryObject`.
        //   - Any number of ancestors may be provided.
        // - Note that neither `obj` nor any of the arguments need to actually be prototypes of any JavaScript quasiclass, that was just a simplified explanation.
        // - We can create a new object composed from the properties of any number of other objects (since they do not have a constructor, we can think of those as interfaces).
        //   - `extend({ a: 1, b: 2 }, { b: 10, c: 20 }, { c: 100, d: 200 })` gives `{ a: 1, b: 10, c: 100, d: 200 }`.
        //   - Basically, with this function, we can emulate the `extends` keyword as well as the `implements` keyword.
        // - Therefore, both of the following are valid:
        //   - `Lineto.prototype = extend(Line.prototype, segmentPrototype, linetoPrototype)`
        //   - `Moveto.prototype = extend(segmentPrototype, movetoPrototype)`

        var i;
        var n;

        var args = [];
        n = arguments.length;
        for (i = 1; i < n; i++) { // skip over obj
            args.push(arguments$1[i]);
        }

        if (!obj) { throw new Error('Missing a parent object.'); }
        var child = Object.create(obj);

        n = args.length;
        for (i = 0; i < n; i++) {

            var src = args[i];

            var inheritedProperty;
            var key;
            for (key in src) {

                if (src.hasOwnProperty(key)) {
                    delete child[key]; // delete property inherited from parent
                    inheritedProperty = Object.getOwnPropertyDescriptor(src, key); // get new definition of property from src
                    Object.defineProperty(child, key, inheritedProperty); // re-add property with new definition (includes getter/setter methods)
                }
            }
        }

        return child;
    }

    // Path segment interface:
    var segmentPrototype = {

        // virtual
        bbox: function() {

            throw new Error('Declaration missing for virtual function.');
        },

        // virtual
        clone: function() {

            throw new Error('Declaration missing for virtual function.');
        },

        // virtual
        closestPoint: function() {

            throw new Error('Declaration missing for virtual function.');
        },

        // virtual
        closestPointLength: function() {

            throw new Error('Declaration missing for virtual function.');
        },

        // virtual
        closestPointNormalizedLength: function() {

            throw new Error('Declaration missing for virtual function.');
        },

        // Redirect calls to closestPointNormalizedLength() function if closestPointT() is not defined for segment.
        closestPointT: function(p) {

            if (this.closestPointNormalizedLength) { return this.closestPointNormalizedLength(p); }

            throw new Error('Neither closestPointT() nor closestPointNormalizedLength() function is implemented.');
        },

        // virtual
        closestPointTangent: function() {

            throw new Error('Declaration missing for virtual function.');
        },

        // virtual
        divideAt: function() {

            throw new Error('Declaration missing for virtual function.');
        },

        // virtual
        divideAtLength: function() {

            throw new Error('Declaration missing for virtual function.');
        },

        // Redirect calls to divideAt() function if divideAtT() is not defined for segment.
        divideAtT: function(t) {

            if (this.divideAt) { return this.divideAt(t); }

            throw new Error('Neither divideAtT() nor divideAt() function is implemented.');
        },

        // virtual
        equals: function() {

            throw new Error('Declaration missing for virtual function.');
        },

        // virtual
        getSubdivisions: function() {

            throw new Error('Declaration missing for virtual function.');
        },

        // virtual
        isDifferentiable: function() {

            throw new Error('Declaration missing for virtual function.');
        },

        isSegment: true,

        isSubpathStart: false, // true for Moveto segments

        isVisible: true, // false for Moveto segments

        // virtual
        length: function() {

            throw new Error('Declaration missing for virtual function.');
        },

        // Return a fraction of result of length() function if lengthAtT() is not defined for segment.
        lengthAtT: function(t) {

            if (t <= 0) { return 0; }

            var length = this.length();

            if (t >= 1) { return length; }

            return length * t;
        },

        nextSegment: null, // needed for subpath start segment updating

        // virtual
        pointAt: function() {

            throw new Error('Declaration missing for virtual function.');
        },

        // virtual
        pointAtLength: function() {

            throw new Error('Declaration missing for virtual function.');
        },

        // Redirect calls to pointAt() function if pointAtT() is not defined for segment.
        pointAtT: function(t) {

            if (this.pointAt) { return this.pointAt(t); }

            throw new Error('Neither pointAtT() nor pointAt() function is implemented.');
        },

        previousSegment: null, // needed to get segment start property

        subpathStartSegment: null, // needed to get Closepath segment end property

        // virtual
        scale: function() {

            throw new Error('Declaration missing for virtual function.');
        },

        // virtual
        serialize: function() {

            throw new Error('Declaration missing for virtual function.');
        },

        // virtual
        tangentAt: function() {

            throw new Error('Declaration missing for virtual function.');
        },

        // virtual
        tangentAtLength: function() {

            throw new Error('Declaration missing for virtual function.');
        },

        // Redirect calls to tangentAt() function if tangentAtT() is not defined for segment.
        tangentAtT: function(t) {

            if (this.tangentAt) { return this.tangentAt(t); }

            throw new Error('Neither tangentAtT() nor tangentAt() function is implemented.');
        },

        // virtual
        toString: function() {

            throw new Error('Declaration missing for virtual function.');
        },

        // virtual
        translate: function() {

            throw new Error('Declaration missing for virtual function.');
        }
    };

    // usually directly assigned
    // getter for Closepath
    Object.defineProperty(segmentPrototype, 'end', {

        configurable: true,

        enumerable: true,

        writable: true
    });

    // always a getter
    // always throws error for Moveto
    Object.defineProperty(segmentPrototype, 'start', {
        // get a reference to the end point of previous segment

        configurable: true,

        enumerable: true,

        get: function() {

            if (!this.previousSegment) { throw new Error('Missing previous segment. (This segment cannot be the first segment of a path; OR segment has not yet been added to a path.)'); }

            return this.previousSegment.end;
        }
    });

    // virtual
    Object.defineProperty(segmentPrototype, 'type', {

        configurable: true,

        enumerable: true,

        get: function() {

            throw new Error('Bad segment declaration. No type specified.');
        }
    });

    // Path segment implementations:
    var Lineto = function() {
        var arguments$1 = arguments;


        var args = [];
        var n = arguments.length;
        for (var i = 0; i < n; i++) {
            args.push(arguments$1[i]);
        }

        if (!(this instanceof Lineto)) { // switching context of `this` to Lineto when called without `new`
            return applyToNew(Lineto, args);
        }

        if (n === 0) {
            throw new Error('Lineto constructor expects a line, 1 point, or 2 coordinates (none provided).');
        }

        var outputArray;

        if (args[0] instanceof Line) { // lines provided
            if (n === 1) {
                this.end = args[0].end.clone();
                return this;

            } else {
                throw new Error('Lineto constructor expects a line, 1 point, or 2 coordinates (' + n + ' lines provided).');
            }

        } else if (typeof args[0] === 'string' || typeof args[0] === 'number') { // coordinates provided
            if (n === 2) {
                this.end = new Point(+args[0], +args[1]);
                return this;

            } else if (n < 2) {
                throw new Error('Lineto constructor expects a line, 1 point, or 2 coordinates (' + n + ' coordinates provided).');

            } else { // this is a poly-line segment
                var segmentCoords;
                outputArray = [];
                for (i = 0; i < n; i += 2) { // coords come in groups of two

                    segmentCoords = args.slice(i, i + 2); // will send one coord if args.length not divisible by 2
                    outputArray.push(applyToNew(Lineto, segmentCoords));
                }
                return outputArray;
            }

        } else { // points provided (needs to be last to also cover plain objects with x and y)
            if (n === 1) {
                this.end = new Point(args[0]);
                return this;

            } else { // this is a poly-line segment
                var segmentPoint;
                outputArray = [];
                for (i = 0; i < n; i += 1) {

                    segmentPoint = args[i];
                    outputArray.push(new Lineto(segmentPoint));
                }
                return outputArray;
            }
        }
    };

    var linetoPrototype = {

        clone: function() {

            return new Lineto(this.end);
        },

        divideAt: function(ratio) {

            var line = new Line(this.start, this.end);
            var divided = line.divideAt(ratio);
            return [
                new Lineto(divided[0]),
                new Lineto(divided[1])
            ];
        },

        divideAtLength: function(length) {

            var line = new Line(this.start, this.end);
            var divided = line.divideAtLength(length);
            return [
                new Lineto(divided[0]),
                new Lineto(divided[1])
            ];
        },

        getSubdivisions: function() {

            return [];
        },

        isDifferentiable: function() {

            if (!this.previousSegment) { return false; }

            return !this.start.equals(this.end);
        },

        scale: function(sx, sy, origin) {

            this.end.scale(sx, sy, origin);
            return this;
        },

        serialize: function() {

            var end = this.end;
            return this.type + ' ' + end.x + ' ' + end.y;
        },

        toString: function() {

            return this.type + ' ' + this.start + ' ' + this.end;
        },

        translate: function(tx, ty) {

            this.end.translate(tx, ty);
            return this;
        }
    };

    Object.defineProperty(linetoPrototype, 'type', {

        configurable: true,

        enumerable: true,

        value: 'L'
    });

    Lineto.prototype = extend(segmentPrototype, Line.prototype, linetoPrototype);

    var Curveto = function() {
        var arguments$1 = arguments;


        var args = [];
        var n = arguments.length;
        for (var i = 0; i < n; i++) {
            args.push(arguments$1[i]);
        }

        if (!(this instanceof Curveto)) { // switching context of `this` to Curveto when called without `new`
            return applyToNew(Curveto, args);
        }

        if (n === 0) {
            throw new Error('Curveto constructor expects a curve, 3 points, or 6 coordinates (none provided).');
        }

        var outputArray;

        if (args[0] instanceof Curve) { // curves provided
            if (n === 1) {
                this.controlPoint1 = args[0].controlPoint1.clone();
                this.controlPoint2 = args[0].controlPoint2.clone();
                this.end = args[0].end.clone();
                return this;

            } else {
                throw new Error('Curveto constructor expects a curve, 3 points, or 6 coordinates (' + n + ' curves provided).');
            }

        } else if (typeof args[0] === 'string' || typeof args[0] === 'number') { // coordinates provided
            if (n === 6) {
                this.controlPoint1 = new Point(+args[0], +args[1]);
                this.controlPoint2 = new Point(+args[2], +args[3]);
                this.end = new Point(+args[4], +args[5]);
                return this;

            } else if (n < 6) {
                throw new Error('Curveto constructor expects a curve, 3 points, or 6 coordinates (' + n + ' coordinates provided).');

            } else { // this is a poly-bezier segment
                var segmentCoords;
                outputArray = [];
                for (i = 0; i < n; i += 6) { // coords come in groups of six

                    segmentCoords = args.slice(i, i + 6); // will send fewer than six coords if args.length not divisible by 6
                    outputArray.push(applyToNew(Curveto, segmentCoords));
                }
                return outputArray;
            }

        } else { // points provided (needs to be last to also cover plain objects with x and y)
            if (n === 3) {
                this.controlPoint1 = new Point(args[0]);
                this.controlPoint2 = new Point(args[1]);
                this.end = new Point(args[2]);
                return this;

            } else if (n < 3) {
                throw new Error('Curveto constructor expects a curve, 3 points, or 6 coordinates (' + n + ' points provided).');

            } else { // this is a poly-bezier segment
                var segmentPoints;
                outputArray = [];
                for (i = 0; i < n; i += 3) { // points come in groups of three

                    segmentPoints = args.slice(i, i + 3); // will send fewer than three points if args.length is not divisible by 3
                    outputArray.push(applyToNew(Curveto, segmentPoints));
                }
                return outputArray;
            }
        }
    };

    var curvetoPrototype = {

        clone: function() {

            return new Curveto(this.controlPoint1, this.controlPoint2, this.end);
        },

        divideAt: function(ratio, opt) {

            var curve = new Curve(this.start, this.controlPoint1, this.controlPoint2, this.end);
            var divided = curve.divideAt(ratio, opt);
            return [
                new Curveto(divided[0]),
                new Curveto(divided[1])
            ];
        },

        divideAtLength: function(length, opt) {

            var curve = new Curve(this.start, this.controlPoint1, this.controlPoint2, this.end);
            var divided = curve.divideAtLength(length, opt);
            return [
                new Curveto(divided[0]),
                new Curveto(divided[1])
            ];
        },

        divideAtT: function(t) {

            var curve = new Curve(this.start, this.controlPoint1, this.controlPoint2, this.end);
            var divided = curve.divideAtT(t);
            return [
                new Curveto(divided[0]),
                new Curveto(divided[1])
            ];
        },

        isDifferentiable: function() {

            if (!this.previousSegment) { return false; }

            var start = this.start;
            var control1 = this.controlPoint1;
            var control2 = this.controlPoint2;
            var end = this.end;

            return !(start.equals(control1) && control1.equals(control2) && control2.equals(end));
        },

        scale: function(sx, sy, origin) {

            this.controlPoint1.scale(sx, sy, origin);
            this.controlPoint2.scale(sx, sy, origin);
            this.end.scale(sx, sy, origin);
            return this;
        },

        serialize: function() {

            var c1 = this.controlPoint1;
            var c2 = this.controlPoint2;
            var end = this.end;
            return this.type + ' ' + c1.x + ' ' + c1.y + ' ' + c2.x + ' ' + c2.y + ' ' + end.x + ' ' + end.y;
        },

        toString: function() {

            return this.type + ' ' + this.start + ' ' + this.controlPoint1 + ' ' + this.controlPoint2 + ' ' + this.end;
        },

        translate: function(tx, ty) {

            this.controlPoint1.translate(tx, ty);
            this.controlPoint2.translate(tx, ty);
            this.end.translate(tx, ty);
            return this;
        }
    };

    Object.defineProperty(curvetoPrototype, 'type', {

        configurable: true,

        enumerable: true,

        value: 'C'
    });

    Curveto.prototype = extend(segmentPrototype, Curve.prototype, curvetoPrototype);

    var Moveto = function() {
        var arguments$1 = arguments;


        var args = [];
        var n = arguments.length;
        for (var i = 0; i < n; i++) {
            args.push(arguments$1[i]);
        }

        if (!(this instanceof Moveto)) { // switching context of `this` to Moveto when called without `new`
            return applyToNew(Moveto, args);
        }

        if (n === 0) {
            throw new Error('Moveto constructor expects a line, a curve, 1 point, or 2 coordinates (none provided).');
        }

        var outputArray;

        if (args[0] instanceof Line) { // lines provided
            if (n === 1) {
                this.end = args[0].end.clone();
                return this;

            } else {
                throw new Error('Moveto constructor expects a line, a curve, 1 point, or 2 coordinates (' + n + ' lines provided).');
            }

        } else if (args[0] instanceof Curve) { // curves provided
            if (n === 1) {
                this.end = args[0].end.clone();
                return this;

            } else {
                throw new Error('Moveto constructor expects a line, a curve, 1 point, or 2 coordinates (' + n + ' curves provided).');
            }

        } else if (typeof args[0] === 'string' || typeof args[0] === 'number') { // coordinates provided
            if (n === 2) {
                this.end = new Point(+args[0], +args[1]);
                return this;

            } else if (n < 2) {
                throw new Error('Moveto constructor expects a line, a curve, 1 point, or 2 coordinates (' + n + ' coordinates provided).');

            } else { // this is a moveto-with-subsequent-poly-line segment
                var segmentCoords;
                outputArray = [];
                for (i = 0; i < n; i += 2) { // coords come in groups of two

                    segmentCoords = args.slice(i, i + 2); // will send one coord if args.length not divisible by 2
                    if (i === 0) { outputArray.push(applyToNew(Moveto, segmentCoords)); }
                    else { outputArray.push(applyToNew(Lineto, segmentCoords)); }
                }
                return outputArray;
            }

        } else { // points provided (needs to be last to also cover plain objects with x and y)
            if (n === 1) {
                this.end = new Point(args[0]);
                return this;

            } else { // this is a moveto-with-subsequent-poly-line segment
                var segmentPoint;
                outputArray = [];
                for (i = 0; i < n; i += 1) { // points come one by one

                    segmentPoint = args[i];
                    if (i === 0) { outputArray.push(new Moveto(segmentPoint)); }
                    else { outputArray.push(new Lineto(segmentPoint)); }
                }
                return outputArray;
            }
        }
    };

    var movetoPrototype = {

        bbox: function() {

            return null;
        },

        clone: function() {

            return new Moveto(this.end);
        },

        closestPoint: function() {

            return this.end.clone();
        },

        closestPointNormalizedLength: function() {

            return 0;
        },

        closestPointLength: function() {

            return 0;
        },

        closestPointT: function() {

            return 1;
        },

        closestPointTangent: function() {

            return null;
        },

        divideAt: function() {

            return [
                this.clone(),
                this.clone()
            ];
        },

        divideAtLength: function() {

            return [
                this.clone(),
                this.clone()
            ];
        },

        equals: function(m) {

            return this.end.equals(m.end);
        },

        getSubdivisions: function() {

            return [];
        },

        isDifferentiable: function() {

            return false;
        },

        isSubpathStart: true,

        isVisible: false,

        length: function() {

            return 0;
        },

        lengthAtT: function() {

            return 0;
        },

        pointAt: function() {

            return this.end.clone();
        },

        pointAtLength: function() {

            return this.end.clone();
        },

        pointAtT: function() {

            return this.end.clone();
        },

        scale: function(sx, sy, origin) {

            this.end.scale(sx, sy, origin);
            return this;
        },

        serialize: function() {

            var end = this.end;
            return this.type + ' ' + end.x + ' ' + end.y;
        },

        tangentAt: function() {

            return null;
        },

        tangentAtLength: function() {

            return null;
        },

        tangentAtT: function() {

            return null;
        },

        toString: function() {

            return this.type + ' ' + this.end;
        },

        translate: function(tx, ty) {

            this.end.translate(tx, ty);
            return this;
        }
    };

    Object.defineProperty(movetoPrototype, 'start', {

        configurable: true,

        enumerable: true,

        get: function() {

            throw new Error('Illegal access. Moveto segments should not need a start property.');
        }
    });

    Object.defineProperty(movetoPrototype, 'type', {

        configurable: true,

        enumerable: true,

        value: 'M'
    });

    Moveto.prototype = extend(segmentPrototype, movetoPrototype); // does not inherit from any other geometry object

    var Closepath = function() {
        var arguments$1 = arguments;


        var args = [];
        var n = arguments.length;
        for (var i = 0; i < n; i++) {
            args.push(arguments$1[i]);
        }

        if (!(this instanceof Closepath)) { // switching context of `this` to Closepath when called without `new`
            return applyToNew(Closepath, args);
        }

        if (n > 0) {
            throw new Error('Closepath constructor expects no arguments.');
        }

        return this;
    };

    var closepathPrototype = {

        clone: function() {

            return new Closepath();
        },

        divideAt: function(ratio) {

            var line = new Line(this.start, this.end);
            var divided = line.divideAt(ratio);
            return [
                // if we didn't actually cut into the segment, first divided part can stay as Z
                (divided[1].isDifferentiable() ? new Lineto(divided[0]) : this.clone()),
                new Lineto(divided[1])
            ];
        },

        divideAtLength: function(length) {

            var line = new Line(this.start, this.end);
            var divided = line.divideAtLength(length);
            return [
                // if we didn't actually cut into the segment, first divided part can stay as Z
                (divided[1].isDifferentiable() ? new Lineto(divided[0]) : this.clone()),
                new Lineto(divided[1])
            ];
        },

        getSubdivisions: function() {

            return [];
        },

        isDifferentiable: function() {

            if (!this.previousSegment || !this.subpathStartSegment) { return false; }

            return !this.start.equals(this.end);
        },

        scale: function() {

            return this;
        },

        serialize: function() {

            return this.type;
        },

        toString: function() {

            return this.type + ' ' + this.start + ' ' + this.end;
        },

        translate: function() {

            return this;
        }
    };

    Object.defineProperty(closepathPrototype, 'end', {
        // get a reference to the end point of subpath start segment

        configurable: true,

        enumerable: true,

        get: function() {

            if (!this.subpathStartSegment) { throw new Error('Missing subpath start segment. (This segment needs a subpath start segment (e.g. Moveto); OR segment has not yet been added to a path.)'); }

            return this.subpathStartSegment.end;
        }
    });

    Object.defineProperty(closepathPrototype, 'type', {

        configurable: true,

        enumerable: true,

        value: 'Z'
    });

    Closepath.prototype = extend(segmentPrototype, Line.prototype, closepathPrototype);

    var segmentTypes = Path.segmentTypes = {
        L: Lineto,
        C: Curveto,
        M: Moveto,
        Z: Closepath,
        z: Closepath
    };

    Path.regexSupportedData = new RegExp('^[\\s\\d' + Object.keys(segmentTypes).join('') + ',.]*$');

    Path.isDataSupported = function(data) {

        if (typeof data !== 'string') { return false; }
        return this.regexSupportedData.test(data);
    };

    var g = ({
        bezier: bezier,
        Curve: Curve,
        Ellipse: Ellipse,
        Line: Line,
        Path: Path,
        Point: Point,
        Polyline: Polyline,
        Rect: Rect,
        scale: scale,
        normalizeAngle: normalizeAngle,
        snapToGrid: snapToGrid,
        toDeg: toDeg,
        toRad: toRad,
        random: random,
        ellipse: ellipse,
        line: line,
        point: point,
        rect: rect
    });

    // Vectorizer.

    var V = (function() {

        var hasSvg = typeof window === 'object' &&
            !!(
                window.SVGAngle ||
                document.implementation.hasFeature('http://www.w3.org/TR/SVG11/feature#BasicStructure', '1.1')
            );

        // SVG support is required.
        if (!hasSvg) {

            // Return a function that throws an error when it is used.
            return function() {
                throw new Error('SVG is required to use Vectorizer.');
            };
        }

        // XML namespaces.
        var ns = {
            svg: 'http://www.w3.org/2000/svg',
            xmlns: 'http://www.w3.org/2000/xmlns/',
            xml: 'http://www.w3.org/XML/1998/namespace',
            xlink: 'http://www.w3.org/1999/xlink',
            xhtml: 'http://www.w3.org/1999/xhtml'
        };

        var SVGVersion = '1.1';

        // Declare shorthands to the most used math functions.
        var math = Math;
        var PI = math.PI;
        var atan2 = math.atan2;
        var sqrt = math.sqrt;
        var min = math.min;
        var max = math.max;
        var cos = math.cos;
        var sin = math.sin;

        var V = function(el, attrs, children) {

            // This allows using V() without the new keyword.
            if (!(this instanceof V)) {
                return V.apply(Object.create(V.prototype), arguments);
            }

            if (!el) { return; }

            if (V.isV(el)) {
                el = el.node;
            }

            attrs = attrs || {};

            if (V.isString(el)) {

                if (el.toLowerCase() === 'svg') {

                    // Create a new SVG canvas.
                    el = V.createSvgDocument();

                } else if (el[0] === '<') {

                    // Create element from an SVG string.
                    // Allows constructs of type: `document.appendChild(V('<rect></rect>').node)`.

                    var svgDoc = V.createSvgDocument(el);

                    // Note that `V()` might also return an array should the SVG string passed as
                    // the first argument contain more than one root element.
                    if (svgDoc.childNodes.length > 1) {

                        // Map child nodes to `V`s.
                        var arrayOfVels = [];
                        var i, len;

                        for (i = 0, len = svgDoc.childNodes.length; i < len; i++) {

                            var childNode = svgDoc.childNodes[i];
                            arrayOfVels.push(new V(document.importNode(childNode, true)));
                        }

                        return arrayOfVels;
                    }

                    el = document.importNode(svgDoc.firstChild, true);

                } else {

                    el = document.createElementNS(ns.svg, el);
                }

                V.ensureId(el);
            }

            this.node = el;

            this.setAttributes(attrs);

            if (children) {
                this.append(children);
            }

            return this;
        };

        var VPrototype = V.prototype;

        Object.defineProperty(VPrototype, 'id', {
            enumerable: true,
            get: function() {
                return this.node.id;
            },
            set: function(id) {
                this.node.id = id;
            }
        });

        /**
         * @param {SVGGElement} toElem
         * @returns {SVGMatrix}
         */
        VPrototype.getTransformToElement = function(target) {
            var node = this.node;
            if (V.isSVGGraphicsElement(target) && V.isSVGGraphicsElement(node)) {
                var targetCTM = V.toNode(target).getScreenCTM();
                var nodeCTM = node.getScreenCTM();
                if (targetCTM && nodeCTM) {
                    return targetCTM.inverse().multiply(nodeCTM);
                }
            }
            // Could not get actual transformation matrix
            return V.createSVGMatrix();
        };

        /**
         * @param {SVGMatrix} matrix
         * @param {Object=} opt
         * @returns {Vectorizer|SVGMatrix} Setter / Getter
         */
        VPrototype.transform = function(matrix, opt) {

            var node = this.node;
            if (V.isUndefined(matrix)) {
                return V.transformStringToMatrix(this.attr('transform'));
            }

            if (opt && opt.absolute) {
                return this.attr('transform', V.matrixToTransformString(matrix));
            }

            var svgTransform = V.createSVGTransform(matrix);
            node.transform.baseVal.appendItem(svgTransform);
            return this;
        };

        VPrototype.translate = function(tx, ty, opt) {

            opt = opt || {};
            ty = ty || 0;

            var transformAttr = this.attr('transform') || '';
            var transform = V.parseTransformString(transformAttr);
            transformAttr = transform.value;
            // Is it a getter?
            if (V.isUndefined(tx)) {
                return transform.translate;
            }

            transformAttr = transformAttr.replace(/translate\([^)]*\)/g, '').trim();

            var newTx = opt.absolute ? tx : transform.translate.tx + tx;
            var newTy = opt.absolute ? ty : transform.translate.ty + ty;
            var newTranslate = 'translate(' + newTx + ',' + newTy + ')';

            // Note that `translate()` is always the first transformation. This is
            // usually the desired case.
            this.attr('transform', (newTranslate + ' ' + transformAttr).trim());
            return this;
        };

        VPrototype.rotate = function(angle, cx, cy, opt) {

            opt = opt || {};

            var transformAttr = this.attr('transform') || '';
            var transform = V.parseTransformString(transformAttr);
            transformAttr = transform.value;

            // Is it a getter?
            if (V.isUndefined(angle)) {
                return transform.rotate;
            }

            transformAttr = transformAttr.replace(/rotate\([^)]*\)/g, '').trim();

            angle %= 360;

            var newAngle = opt.absolute ? angle : transform.rotate.angle + angle;
            var newOrigin = (cx !== undefined && cy !== undefined) ? ',' + cx + ',' + cy : '';
            var newRotate = 'rotate(' + newAngle + newOrigin + ')';

            this.attr('transform', (transformAttr + ' ' + newRotate).trim());
            return this;
        };

        // Note that `scale` as the only transformation does not combine with previous values.
        VPrototype.scale = function(sx, sy) {

            sy = V.isUndefined(sy) ? sx : sy;

            var transformAttr = this.attr('transform') || '';
            var transform = V.parseTransformString(transformAttr);
            transformAttr = transform.value;

            // Is it a getter?
            if (V.isUndefined(sx)) {
                return transform.scale;
            }

            transformAttr = transformAttr.replace(/scale\([^)]*\)/g, '').trim();

            var newScale = 'scale(' + sx + ',' + sy + ')';

            this.attr('transform', (transformAttr + ' ' + newScale).trim());
            return this;
        };

        // Get SVGRect that contains coordinates and dimension of the real bounding box,
        // i.e. after transformations are applied.
        // If `target` is specified, bounding box will be computed relatively to `target` element.
        VPrototype.bbox = function(withoutTransformations, target) {

            var box;
            var node = this.node;
            var ownerSVGElement = node.ownerSVGElement;

            // If the element is not in the live DOM, it does not have a bounding box defined and
            // so fall back to 'zero' dimension element.
            if (!ownerSVGElement) {
                return new Rect(0, 0, 0, 0);
            }

            try {

                box = node.getBBox();

            } catch (e) {

                // Fallback for IE.
                box = {
                    x: node.clientLeft,
                    y: node.clientTop,
                    width: node.clientWidth,
                    height: node.clientHeight
                };
            }

            if (withoutTransformations) {
                return new Rect(box);
            }

            var matrix = this.getTransformToElement(target || ownerSVGElement);

            return V.transformRect(box, matrix);
        };

        // Returns an SVGRect that contains coordinates and dimensions of the real bounding box,
        // i.e. after transformations are applied.
        // Fixes a browser implementation bug that returns incorrect bounding boxes for groups of svg elements.
        // Takes an (Object) `opt` argument (optional) with the following attributes:
        // (Object) `target` (optional): if not undefined, transform bounding boxes relative to `target`; if undefined, transform relative to this
        // (Boolean) `recursive` (optional): if true, recursively enter all groups and get a union of element bounding boxes (svg bbox fix); if false or undefined, return result of native function this.node.getBBox();
        VPrototype.getBBox = function(opt) {

            var options = {};

            var outputBBox;
            var node = this.node;
            var ownerSVGElement = node.ownerSVGElement;

            // If the element is not in the live DOM, it does not have a bounding box defined and
            // so fall back to 'zero' dimension element.
            // If the element is not an SVGGraphicsElement, we could not measure the bounding box either
            if (!ownerSVGElement || !V.isSVGGraphicsElement(node)) {
                return new Rect(0, 0, 0, 0);
            }

            if (opt) {
                if (opt.target) { // check if target exists
                    options.target = V.toNode(opt.target); // works for V objects, jquery objects, and node objects
                }
                if (opt.recursive) {
                    options.recursive = opt.recursive;
                }
            }

            if (!options.recursive) {
                try {
                    outputBBox = node.getBBox();
                } catch (e) {
                    // Fallback for IE.
                    outputBBox = {
                        x: node.clientLeft,
                        y: node.clientTop,
                        width: node.clientWidth,
                        height: node.clientHeight
                    };
                }

                if (!options.target) {
                    // transform like this (that is, not at all)
                    return new Rect(outputBBox);
                } else {
                    // transform like target
                    var matrix = this.getTransformToElement(options.target);
                    return V.transformRect(outputBBox, matrix);
                }
            } else { // if we want to calculate the bbox recursively
                // browsers report correct bbox around svg elements (one that envelops the path lines tightly)
                // but some browsers fail to report the same bbox when the elements are in a group (returning a looser bbox that also includes control points, like node.getClientRect())
                // this happens even if we wrap a single svg element into a group!
                // this option setting makes the function recursively enter all the groups from this and deeper, get bboxes of the elements inside, then return a union of those bboxes

                var children = this.children();
                var n = children.length;

                if (n === 0) {
                    return this.getBBox({ target: options.target, recursive: false });
                }

                // recursion's initial pass-through setting:
                // recursive passes-through just keep the target as whatever was set up here during the initial pass-through
                if (!options.target) {
                    // transform children/descendants like this (their parent/ancestor)
                    options.target = this;
                } // else transform children/descendants like target

                for (var i = 0; i < n; i++) {
                    var currentChild = children[i];

                    var childBBox;

                    // if currentChild is not a group element, get its bbox with a nonrecursive call
                    if (currentChild.children().length === 0) {
                        childBBox = currentChild.getBBox({ target: options.target, recursive: false });
                    } else {
                        // if currentChild is a group element (determined by checking the number of children), enter it with a recursive call
                        childBBox = currentChild.getBBox({ target: options.target, recursive: true });
                    }

                    if (!outputBBox) {
                        // if this is the first iteration
                        outputBBox = childBBox;
                    } else {
                        // make a new bounding box rectangle that contains this child's bounding box and previous bounding box
                        outputBBox = outputBBox.union(childBBox);
                    }
                }

                return outputBBox;
            }
        };

        // Text() helpers

        function createTextPathNode(attrs, vel) {
            attrs || (attrs = {});
            var textPathElement = V('textPath');
            var d = attrs.d;
            if (d && attrs['xlink:href'] === undefined) {
                // If `opt.attrs` is a plain string, consider it to be directly the
                // SVG path data for the text to go along (this is a shortcut).
                // Otherwise if it is an object and contains the `d` property, then this is our path.
                // Wrap the text in the SVG <textPath> element that points
                // to a path defined by `opt.attrs` inside the `<defs>` element.
                var linkedPath = V('path').attr('d', d).appendTo(vel.defs());
                textPathElement.attr('xlink:href', '#' + linkedPath.id);
            }
            if (V.isObject(attrs)) {
                // Set attributes on the `<textPath>`. The most important one
                // is the `xlink:href` that points to our newly created `<path/>` element in `<defs/>`.
                // Note that we also allow the following construct:
                // `t.text('my text', { textPath: { 'xlink:href': '#my-other-path' } })`.
                // In other words, one can completely skip the auto-creation of the path
                // and use any other arbitrary path that is in the document.
                textPathElement.attr(attrs);
            }
            return textPathElement.node;
        }

        function annotateTextLine(lineNode, lineAnnotations, opt) {
            opt || (opt = {});
            var includeAnnotationIndices = opt.includeAnnotationIndices;
            var eol = opt.eol;
            var lineHeight = opt.lineHeight;
            var baseSize = opt.baseSize;
            var maxFontSize = 0;
            var fontMetrics = {};
            var lastJ = lineAnnotations.length - 1;
            for (var j = 0; j <= lastJ; j++) {
                var annotation = lineAnnotations[j];
                var fontSize = null;
                if (V.isObject(annotation)) {
                    var annotationAttrs = annotation.attrs;
                    var vTSpan = V('tspan', annotationAttrs);
                    var tspanNode = vTSpan.node;
                    var t = annotation.t;
                    if (eol && j === lastJ) { t += eol; }
                    tspanNode.textContent = t;
                    // Per annotation className
                    var annotationClass = annotationAttrs['class'];
                    if (annotationClass) { vTSpan.addClass(annotationClass); }
                    // If `opt.includeAnnotationIndices` is `true`,
                    // set the list of indices of all the applied annotations
                    // in the `annotations` attribute. This list is a comma
                    // separated list of indices.
                    if (includeAnnotationIndices) { vTSpan.attr('annotations', annotation.annotations); }
                    // Check for max font size
                    fontSize = parseFloat(annotationAttrs['font-size']);
                    if (fontSize === undefined) { fontSize = baseSize; }
                    if (fontSize && fontSize > maxFontSize) { maxFontSize = fontSize; }
                } else {
                    if (eol && j === lastJ) { annotation += eol; }
                    tspanNode = document.createTextNode(annotation || ' ');
                    if (baseSize && baseSize > maxFontSize) { maxFontSize = baseSize; }
                }
                lineNode.appendChild(tspanNode);
            }

            if (maxFontSize) { fontMetrics.maxFontSize = maxFontSize; }
            if (lineHeight) {
                fontMetrics.lineHeight = lineHeight;
            } else if (maxFontSize) {
                fontMetrics.lineHeight = (maxFontSize * 1.2);
            }
            return fontMetrics;
        }

        var emRegex = /em$/;

        function convertEmToPx(em, fontSize) {
            var numerical = parseFloat(em);
            if (emRegex.test(em)) { return numerical * fontSize; }
            return numerical;
        }

        function calculateDY(alignment, linesMetrics, baseSizePx, lineHeight) {
            if (!Array.isArray(linesMetrics)) { return 0; }
            var n = linesMetrics.length;
            if (!n) { return 0; }
            var lineMetrics = linesMetrics[0];
            var flMaxFont = convertEmToPx(lineMetrics.maxFontSize, baseSizePx) || baseSizePx;
            var rLineHeights = 0;
            var lineHeightPx = convertEmToPx(lineHeight, baseSizePx);
            for (var i = 1; i < n; i++) {
                lineMetrics = linesMetrics[i];
                var iLineHeight = convertEmToPx(lineMetrics.lineHeight, baseSizePx) || lineHeightPx;
                rLineHeights += iLineHeight;
            }
            var llMaxFont = convertEmToPx(lineMetrics.maxFontSize, baseSizePx) || baseSizePx;
            var dy;
            switch (alignment) {
                case 'middle':
                    dy = (flMaxFont / 2) - (0.15 * llMaxFont) - (rLineHeights / 2);
                    break;
                case 'bottom':
                    dy = -(0.25 * llMaxFont) - rLineHeights;
                    break;
                default:
                case 'top':
                    dy = (0.8 * flMaxFont);
                    break;
            }
            return dy;
        }

        VPrototype.text = function(content, opt) {

            if (content && typeof content !== 'string') { throw new Error('Vectorizer: text() expects the first argument to be a string.'); }

            // Replace all spaces with the Unicode No-break space (http://www.fileformat.info/info/unicode/char/a0/index.htm).
            // IE would otherwise collapse all spaces into one.
            content = V.sanitizeText(content);
            opt || (opt = {});

            // End of Line character
            var eol = opt.eol;
            // Text along path
            var textPath = opt.textPath;
            // Vertical shift
            var verticalAnchor = opt.textVerticalAnchor;
            var namedVerticalAnchor = (verticalAnchor === 'middle' || verticalAnchor === 'bottom' || verticalAnchor === 'top');
            // Horizontal shift applied to all the lines but the first.
            var x = opt.x;
            if (x === undefined) { x = this.attr('x') || 0; }
            // Annotations
            var iai = opt.includeAnnotationIndices;
            var annotations = opt.annotations;
            if (annotations && !V.isArray(annotations)) { annotations = [annotations]; }
            // Shift all the <tspan> but first by one line (`1em`)
            var defaultLineHeight = opt.lineHeight;
            var autoLineHeight = (defaultLineHeight === 'auto');
            var lineHeight = (autoLineHeight) ? '1.5em' : (defaultLineHeight || '1em');
            // Clearing the element
            this.empty();
            this.attr({
                // Preserve spaces. In other words, we do not want consecutive spaces to get collapsed to one.
                'xml:space': 'preserve',
                // An empty text gets rendered into the DOM in webkit-based browsers.
                // In order to unify this behaviour across all browsers
                // we rather hide the text element when it's empty.
                'display': (content) ? null : 'none'
            });
            // Set default font-size if none
            var fontSize = parseFloat(this.attr('font-size'));
            if (!fontSize) {
                fontSize = 16;
                if (namedVerticalAnchor || annotations) { this.attr('font-size', fontSize); }
            }

            var doc = document;
            var containerNode;
            if (textPath) {
                // Now all the `<tspan>`s will be inside the `<textPath>`.
                if (typeof textPath === 'string') { textPath = { d: textPath }; }
                containerNode = createTextPathNode(textPath, this);
            } else {
                containerNode = doc.createDocumentFragment();
            }
            var offset = 0;
            var lines = content.split('\n');
            var linesMetrics = [];
            var annotatedY;
            for (var i = 0, lastI = lines.length - 1; i <= lastI; i++) {
                var dy = lineHeight;
                var lineClassName = 'v-line';
                var lineNode = doc.createElementNS(ns.svg, 'tspan');
                var line$$1 = lines[i];
                var lineMetrics;
                if (line$$1) {
                    if (annotations) {
                        // Find the *compacted* annotations for this line.
                        var lineAnnotations = V.annotateString(line$$1, annotations, {
                            offset: -offset,
                            includeAnnotationIndices: iai
                        });
                        lineMetrics = annotateTextLine(lineNode, lineAnnotations, {
                            includeAnnotationIndices: iai,
                            eol: (i !== lastI && eol),
                            lineHeight: (autoLineHeight) ? null : lineHeight,
                            baseSize: fontSize
                        });
                        // Get the line height based on the biggest font size in the annotations for this line.
                        var iLineHeight = lineMetrics.lineHeight;
                        if (iLineHeight && autoLineHeight && i !== 0) { dy = iLineHeight; }
                        if (i === 0) { annotatedY = lineMetrics.maxFontSize * 0.8; }
                    } else {
                        if (eol && i !== lastI) { line$$1 += eol; }
                        lineNode.textContent = line$$1;
                    }
                } else {
                    // Make sure the textContent is never empty. If it is, add a dummy
                    // character and make it invisible, making the following lines correctly
                    // relatively positioned. `dy=1em` won't work with empty lines otherwise.
                    lineNode.textContent = '-';
                    lineClassName += ' v-empty-line';
                    // 'opacity' needs to be specified with fill, stroke. Opacity without specification
                    // is not applied in Firefox
                    var lineNodeStyle = lineNode.style;
                    lineNodeStyle.fillOpacity = 0;
                    lineNodeStyle.strokeOpacity = 0;
                    if (annotations) { lineMetrics = {}; }
                }
                if (lineMetrics) { linesMetrics.push(lineMetrics); }
                if (i > 0) { lineNode.setAttribute('dy', dy); }
                // Firefox requires 'x' to be set on the first line when inside a text path
                if (i > 0 || textPath) { lineNode.setAttribute('x', x); }
                lineNode.className.baseVal = lineClassName;
                containerNode.appendChild(lineNode);
                offset += line$$1.length + 1;      // + 1 = newline character.
            }
            // Y Alignment calculation
            if (namedVerticalAnchor) {
                if (annotations) {
                    dy = calculateDY(verticalAnchor, linesMetrics, fontSize, lineHeight);
                } else if (verticalAnchor === 'top') {
                    // A shortcut for top alignment. It does not depend on font-size nor line-height
                    dy = '0.8em';
                } else {
                    var rh; // remaining height
                    if (lastI > 0) {
                        rh = parseFloat(lineHeight) || 1;
                        rh *= lastI;
                        if (!emRegex.test(lineHeight)) { rh /= fontSize; }
                    } else {
                        // Single-line text
                        rh = 0;
                    }
                    switch (verticalAnchor) {
                        case 'middle':
                            dy = (0.3 - (rh / 2)) + 'em';
                            break;
                        case 'bottom':
                            dy = (-rh - 0.3) + 'em';
                            break;
                    }
                }
            } else {
                if (verticalAnchor === 0) {
                    dy = '0em';
                } else if (verticalAnchor) {
                    dy = verticalAnchor;
                } else {
                    // No vertical anchor is defined
                    dy = 0;
                    // Backwards compatibility - we change the `y` attribute instead of `dy`.
                    if (this.attr('y') === null) { this.attr('y', annotatedY || '0.8em'); }
                }
            }
            containerNode.firstChild.setAttribute('dy', dy);
            // Appending lines to the element.
            this.append(containerNode);
            return this;
        };

        /**
         * @public
         * @param {string} name
         * @returns {Vectorizer}
         */
        VPrototype.removeAttr = function(name) {

            var qualifiedName = V.qualifyAttr(name);
            var el = this.node;

            if (qualifiedName.ns) {
                if (el.hasAttributeNS(qualifiedName.ns, qualifiedName.local)) {
                    el.removeAttributeNS(qualifiedName.ns, qualifiedName.local);
                }
            } else if (el.hasAttribute(name)) {
                el.removeAttribute(name);
            }
            return this;
        };

        VPrototype.attr = function(name, value) {

            if (V.isUndefined(name)) {

                // Return all attributes.
                var attributes = this.node.attributes;
                var attrs = {};

                for (var i = 0; i < attributes.length; i++) {
                    attrs[attributes[i].name] = attributes[i].value;
                }

                return attrs;
            }

            if (V.isString(name) && V.isUndefined(value)) {
                return this.node.getAttribute(name);
            }

            if (typeof name === 'object') {

                for (var attrName in name) {
                    if (name.hasOwnProperty(attrName)) {
                        this.setAttribute(attrName, name[attrName]);
                    }
                }

            } else {

                this.setAttribute(name, value);
            }

            return this;
        };

        VPrototype.normalizePath = function() {

            var tagName = this.tagName();
            if (tagName === 'PATH') {
                this.attr('d', V.normalizePathData(this.attr('d')));
            }

            return this;
        };

        VPrototype.remove = function() {

            if (this.node.parentNode) {
                this.node.parentNode.removeChild(this.node);
            }

            return this;
        };

        VPrototype.empty = function() {

            while (this.node.firstChild) {
                this.node.removeChild(this.node.firstChild);
            }

            return this;
        };

        /**
         * @private
         * @param {object} attrs
         * @returns {Vectorizer}
         */
        VPrototype.setAttributes = function(attrs) {

            for (var key in attrs) {
                if (attrs.hasOwnProperty(key)) {
                    this.setAttribute(key, attrs[key]);
                }
            }

            return this;
        };

        VPrototype.append = function(els) {

            if (!V.isArray(els)) {
                els = [els];
            }

            for (var i = 0, len = els.length; i < len; i++) {
                this.node.appendChild(V.toNode(els[i]));
            }

            return this;
        };

        VPrototype.prepend = function(els) {

            var child = this.node.firstChild;
            return child ? V(child).before(els) : this.append(els);
        };

        VPrototype.before = function(els) {

            var node = this.node;
            var parent = node.parentNode;

            if (parent) {

                if (!V.isArray(els)) {
                    els = [els];
                }

                for (var i = 0, len = els.length; i < len; i++) {
                    parent.insertBefore(V.toNode(els[i]), node);
                }
            }

            return this;
        };

        VPrototype.appendTo = function(node) {
            V.toNode(node).appendChild(this.node);
            return this;
        };

        VPrototype.svg = function() {

            return this.node instanceof window.SVGSVGElement ? this : V(this.node.ownerSVGElement);
        };

        VPrototype.tagName = function() {

            return this.node.tagName.toUpperCase();
        };

        VPrototype.defs = function() {
            var context = this.svg() || this;
            var defsNode = context.node.getElementsByTagName('defs')[0];
            if (defsNode) { return V(defsNode); }
            return V('defs').appendTo(context);
        };

        VPrototype.clone = function() {

            var clone = V(this.node.cloneNode(true/* deep */));
            // Note that clone inherits also ID. Therefore, we need to change it here.
            clone.node.id = V.uniqueId();
            return clone;
        };

        VPrototype.findOne = function(selector) {

            var found = this.node.querySelector(selector);
            return found ? V(found) : undefined;
        };

        VPrototype.find = function(selector) {

            var vels = [];
            var nodes = this.node.querySelectorAll(selector);

            if (nodes) {

                // Map DOM elements to `V`s.
                for (var i = 0; i < nodes.length; i++) {
                    vels.push(V(nodes[i]));
                }
            }

            return vels;
        };

        // Returns an array of V elements made from children of this.node.
        VPrototype.children = function() {

            var children = this.node.childNodes;

            var outputArray = [];
            for (var i = 0; i < children.length; i++) {
                var currentChild = children[i];
                if (currentChild.nodeType === 1) {
                    outputArray.push(V(children[i]));
                }
            }
            return outputArray;
        };

        // Find an index of an element inside its container.
        VPrototype.index = function() {

            var index = 0;
            var node = this.node.previousSibling;

            while (node) {
                // nodeType 1 for ELEMENT_NODE
                if (node.nodeType === 1) { index++; }
                node = node.previousSibling;
            }

            return index;
        };

        VPrototype.findParentByClass = function(className, terminator) {

            var ownerSVGElement = this.node.ownerSVGElement;
            var node = this.node.parentNode;

            while (node && node !== terminator && node !== ownerSVGElement) {

                var vel = V(node);
                if (vel.hasClass(className)) {
                    return vel;
                }

                node = node.parentNode;
            }

            return null;
        };

        // https://jsperf.com/get-common-parent
        VPrototype.contains = function(el) {

            var a = this.node;
            var b = V.toNode(el);
            var bup = b && b.parentNode;

            return (a === bup) || !!(bup && bup.nodeType === 1 && (a.compareDocumentPosition(bup) & 16));
        };

        // Convert global point into the coordinate space of this element.
        VPrototype.toLocalPoint = function(x, y) {

            var svg = this.svg().node;

            var p = svg.createSVGPoint();
            p.x = x;
            p.y = y;

            try {

                var globalPoint = p.matrixTransform(svg.getScreenCTM().inverse());
                var globalToLocalMatrix = this.getTransformToElement(svg).inverse();

            } catch (e) {
                // IE9 throws an exception in odd cases. (`Unexpected call to method or property access`)
                // We have to make do with the original coordianates.
                return p;
            }

            return globalPoint.matrixTransform(globalToLocalMatrix);
        };

        VPrototype.translateCenterToPoint = function(p) {

            var bbox = this.getBBox({ target: this.svg() });
            var center = bbox.center();

            this.translate(p.x - center.x, p.y - center.y);
            return this;
        };

        // Efficiently auto-orient an element. This basically implements the orient=auto attribute
        // of markers. The easiest way of understanding on what this does is to imagine the element is an
        // arrowhead. Calling this method on the arrowhead makes it point to the `position` point while
        // being auto-oriented (properly rotated) towards the `reference` point.
        // `target` is the element relative to which the transformations are applied. Usually a viewport.
        VPrototype.translateAndAutoOrient = function(position, reference, target) {

            position = new Point(position);
            reference =  new Point(reference);
            target || (target = this.svg());

            // Clean-up previously set transformations except the scale. If we didn't clean up the
            // previous transformations then they'd add up with the old ones. Scale is an exception as
            // it doesn't add up, consider: `this.scale(2).scale(2).scale(2)`. The result is that the
            // element is scaled by the factor 2, not 8.
            var scale$$1 = this.scale();
            this.attr('transform', '');
            var bbox = this.getBBox({ target: target }).scale(scale$$1.sx, scale$$1.sy);

            // 1. Translate to origin.
            var translateToOrigin = V.createSVGTransform();
            translateToOrigin.setTranslate(-bbox.x - bbox.width / 2, -bbox.y - bbox.height / 2);

            // 2. Rotate around origin.
            var rotateAroundOrigin = V.createSVGTransform();
            var angle = position.angleBetween(reference, position.clone().offset(1, 0));
            if (angle) { rotateAroundOrigin.setRotate(angle, 0, 0); }

            // 3. Translate to the `position` + the offset (half my width) towards the `reference` point.
            var translateFromOrigin = V.createSVGTransform();
            var finalPosition = position.clone().move(reference, bbox.width / 2);
            translateFromOrigin.setTranslate(2 * position.x - finalPosition.x, 2 * position.y - finalPosition.y);

            // 4. Get the current transformation matrix of this node
            var ctm = this.getTransformToElement(target);

            // 5. Apply transformations and the scale
            var transform = V.createSVGTransform();
            transform.setMatrix(
                translateFromOrigin.matrix.multiply(
                    rotateAroundOrigin.matrix.multiply(
                        translateToOrigin.matrix.multiply(
                            ctm.scale(scale$$1.sx, scale$$1.sy)))));

            this.attr('transform', V.matrixToTransformString(transform.matrix));

            return this;
        };

        VPrototype.animateAlongPath = function(attrs, path) {

            path = V.toNode(path);

            var id = V.ensureId(path);
            var animateMotion = V('animateMotion', attrs);
            var mpath = V('mpath', { 'xlink:href': '#' + id });

            animateMotion.append(mpath);

            this.append(animateMotion);
            try {
                animateMotion.node.beginElement();
            } catch (e) {
                // Fallback for IE 9.
                // Run the animation programmatically if FakeSmile (`http://leunen.me/fakesmile/`) present
                if (document.documentElement.getAttribute('smiling') === 'fake') {
                    /* global getTargets:true, Animator:true, animators:true id2anim:true */
                    // Register the animation. (See `https://answers.launchpad.net/smil/+question/203333`)
                    var animation = animateMotion.node;
                    animation.animators = [];

                    var animationID = animation.getAttribute('id');
                    if (animationID) { id2anim[animationID] = animation; }

                    var targets = getTargets(animation);
                    for (var i = 0, len = targets.length; i < len; i++) {
                        var target = targets[i];
                        var animator = new Animator(animation, target, i);
                        animators.push(animator);
                        animation.animators[i] = animator;
                        animator.register();
                    }
                }
            }
            return this;
        };

        VPrototype.hasClass = function(className) {

            return new RegExp('(\\s|^)' + className + '(\\s|$)').test(this.node.getAttribute('class'));
        };

        VPrototype.addClass = function(className) {

            if (className && !this.hasClass(className)) {
                var prevClasses = this.node.getAttribute('class') || '';
                this.node.setAttribute('class', (prevClasses + ' ' + className).trim());
            }

            return this;
        };

        VPrototype.removeClass = function(className) {

            if (className && this.hasClass(className)) {
                var newClasses = this.node.getAttribute('class').replace(new RegExp('(\\s|^)' + className + '(\\s|$)', 'g'), '$2');
                this.node.setAttribute('class', newClasses);
            }

            return this;
        };

        VPrototype.toggleClass = function(className, toAdd) {

            var toRemove = V.isUndefined(toAdd) ? this.hasClass(className) : !toAdd;

            if (toRemove) {
                this.removeClass(className);
            } else {
                this.addClass(className);
            }

            return this;
        };

        // Interpolate path by discrete points. The precision of the sampling
        // is controlled by `interval`. In other words, `sample()` will generate
        // a point on the path starting at the beginning of the path going to the end
        // every `interval` pixels.
        // The sampler can be very useful for e.g. finding intersection between two
        // paths (finding the two closest points from two samples).
        VPrototype.sample = function(interval) {

            interval = interval || 1;
            var node = this.node;
            var length = node.getTotalLength();
            var samples = [];
            var distance = 0;
            var sample;
            while (distance < length) {
                sample = node.getPointAtLength(distance);
                samples.push({ x: sample.x, y: sample.y, distance: distance });
                distance += interval;
            }
            return samples;
        };

        VPrototype.convertToPath = function() {

            var path = V('path');
            path.attr(this.attr());
            var d = this.convertToPathData();
            if (d) {
                path.attr('d', d);
            }
            return path;
        };

        VPrototype.convertToPathData = function() {

            var tagName = this.tagName();

            switch (tagName) {
                case 'PATH':
                    return this.attr('d');
                case 'LINE':
                    return V.convertLineToPathData(this.node);
                case 'POLYGON':
                    return V.convertPolygonToPathData(this.node);
                case 'POLYLINE':
                    return V.convertPolylineToPathData(this.node);
                case 'ELLIPSE':
                    return V.convertEllipseToPathData(this.node);
                case 'CIRCLE':
                    return V.convertCircleToPathData(this.node);
                case 'RECT':
                    return V.convertRectToPathData(this.node);
            }

            throw new Error(tagName + ' cannot be converted to PATH.');
        };

        V.prototype.toGeometryShape = function() {
            var x, y, width, height, cx, cy, r, rx, ry, points, d, x1, x2, y1, y2;
            switch (this.tagName()) {

                case 'RECT':
                    x = parseFloat(this.attr('x')) || 0;
                    y = parseFloat(this.attr('y')) || 0;
                    width = parseFloat(this.attr('width')) || 0;
                    height = parseFloat(this.attr('height')) || 0;
                    return new Rect(x, y, width, height);

                case 'CIRCLE':
                    cx = parseFloat(this.attr('cx')) || 0;
                    cy = parseFloat(this.attr('cy')) || 0;
                    r = parseFloat(this.attr('r')) || 0;
                    return new Ellipse({ x: cx, y: cy }, r, r);

                case 'ELLIPSE':
                    cx = parseFloat(this.attr('cx')) || 0;
                    cy = parseFloat(this.attr('cy')) || 0;
                    rx = parseFloat(this.attr('rx')) || 0;
                    ry = parseFloat(this.attr('ry')) || 0;
                    return new Ellipse({ x: cx, y: cy }, rx, ry);

                case 'POLYLINE':
                    points = V.getPointsFromSvgNode(this);
                    return new Polyline(points);

                case 'POLYGON':
                    points = V.getPointsFromSvgNode(this);
                    if (points.length > 1) { points.push(points[0]); }
                    return new Polyline(points);

                case 'PATH':
                    d = this.attr('d');
                    if (!Path.isDataSupported(d)) { d = V.normalizePathData(d); }
                    return new Path(d);

                case 'LINE':
                    x1 = parseFloat(this.attr('x1')) || 0;
                    y1 = parseFloat(this.attr('y1')) || 0;
                    x2 = parseFloat(this.attr('x2')) || 0;
                    y2 = parseFloat(this.attr('y2')) || 0;
                    return new Line({ x: x1, y: y1 }, { x: x2, y: y2 });
            }

            // Anything else is a rectangle
            return this.getBBox();
        };

        // Find the intersection of a line starting in the center
        // of the SVG `node` ending in the point `ref`.
        // `target` is an SVG element to which `node`s transformations are relative to.
        // Note that `ref` point must be in the coordinate system of the `target` for this function to work properly.
        // Returns a point in the `target` coordinate system (the same system as `ref` is in) if
        // an intersection is found. Returns `undefined` otherwise.
        VPrototype.findIntersection = function(ref, target) {

            var svg = this.svg().node;
            target = target || svg;
            var bbox = this.getBBox({ target: target });
            var center = bbox.center();

            if (!bbox.intersectionWithLineFromCenterToPoint(ref)) { return undefined; }

            var spot;
            var tagName = this.tagName();

            // Little speed up optimization for `<rect>` element. We do not do conversion
            // to path element and sampling but directly calculate the intersection through
            // a transformed geometrical rectangle.
            if (tagName === 'RECT') {

                var gRect = new Rect(
                    parseFloat(this.attr('x') || 0),
                    parseFloat(this.attr('y') || 0),
                    parseFloat(this.attr('width')),
                    parseFloat(this.attr('height'))
                );
                // Get the rect transformation matrix with regards to the SVG document.
                var rectMatrix = this.getTransformToElement(target);
                // Decompose the matrix to find the rotation angle.
                var rectMatrixComponents = V.decomposeMatrix(rectMatrix);
                // Now we want to rotate the rectangle back so that we
                // can use `intersectionWithLineFromCenterToPoint()` passing the angle as the second argument.
                var resetRotation = svg.createSVGTransform();
                resetRotation.setRotate(-rectMatrixComponents.rotation, center.x, center.y);
                var rect$$1 = V.transformRect(gRect, resetRotation.matrix.multiply(rectMatrix));
                spot = (new Rect(rect$$1)).intersectionWithLineFromCenterToPoint(ref, rectMatrixComponents.rotation);

            } else if (tagName === 'PATH' || tagName === 'POLYGON' || tagName === 'POLYLINE' || tagName === 'CIRCLE' || tagName === 'ELLIPSE') {

                var pathNode = (tagName === 'PATH') ? this : this.convertToPath();
                var samples = pathNode.sample();
                var minDistance = Infinity;
                var closestSamples = [];

                var i, sample, gp, centerDistance, refDistance, distance;

                for (i = 0; i < samples.length; i++) {

                    sample = samples[i];
                    // Convert the sample point in the local coordinate system to the global coordinate system.
                    gp = V.createSVGPoint(sample.x, sample.y);
                    gp = gp.matrixTransform(this.getTransformToElement(target));
                    sample = new Point(gp);
                    centerDistance = sample.distance(center);
                    // Penalize a higher distance to the reference point by 10%.
                    // This gives better results. This is due to
                    // inaccuracies introduced by rounding errors and getPointAtLength() returns.
                    refDistance = sample.distance(ref) * 1.1;
                    distance = centerDistance + refDistance;

                    if (distance < minDistance) {
                        minDistance = distance;
                        closestSamples = [{ sample: sample, refDistance: refDistance }];
                    } else if (distance < minDistance + 1) {
                        closestSamples.push({ sample: sample, refDistance: refDistance });
                    }
                }

                closestSamples.sort(function(a, b) {
                    return a.refDistance - b.refDistance;
                });

                if (closestSamples[0]) {
                    spot = closestSamples[0].sample;
                }
            }

            return spot;
        };

        /**
         * @private
         * @param {string} name
         * @param {string} value
         * @returns {Vectorizer}
         */
        VPrototype.setAttribute = function(name, value) {

            var el = this.node;

            if (value === null) {
                this.removeAttr(name);
                return this;
            }

            var qualifiedName = V.qualifyAttr(name);

            if (qualifiedName.ns) {
                // Attribute names can be namespaced. E.g. `image` elements
                // have a `xlink:href` attribute to set the source of the image.
                el.setAttributeNS(qualifiedName.ns, name, value);
            } else if (name === 'id') {
                el.id = value;
            } else {
                el.setAttribute(name, value);
            }

            return this;
        };

        // Create an SVG document element.
        // If `content` is passed, it will be used as the SVG content of the `<svg>` root element.
        V.createSvgDocument = function(content) {

            if (content) {
                var XMLString = "<svg xmlns=\"" + (ns.svg) + "\" xmlns:xlink=\"" + (ns.xlink) + "\" version=\"" + SVGVersion + "\">" + content + "</svg>";
                var ref = V.parseXML(XMLString, { async: false });
                var documentElement = ref.documentElement;
                return documentElement;
            }

            var svg = document.createElementNS(ns.svg, 'svg');
            svg.setAttributeNS(ns.xmlns, 'xmlns:xlink', ns.xlink);
            svg.setAttribute('version', SVGVersion);
            return svg;
        };

        V.idCounter = 0;

        // A function returning a unique identifier for this client session with every call.
        V.uniqueId = function() {

            return 'v-' + (++V.idCounter);
        };

        V.toNode = function(el) {

            return V.isV(el) ? el.node : (el.nodeName && el || el[0]);
        };

        V.ensureId = function(node) {

            node = V.toNode(node);
            return node.id || (node.id = V.uniqueId());
        };

        // Replace all spaces with the Unicode No-break space (http://www.fileformat.info/info/unicode/char/a0/index.htm).
        // IE would otherwise collapse all spaces into one. This is used in the text() method but it is
        // also exposed so that the programmer can use it in case he needs to. This is useful e.g. in tests
        // when you want to compare the actual DOM text content without having to add the unicode character in
        // the place of all spaces.
        V.sanitizeText = function(text) {

            return (text || '').replace(/ /g, '\u00A0');
        };

        V.isUndefined = function(value) {

            return typeof value === 'undefined';
        };

        V.isString = function(value) {

            return typeof value === 'string';
        };

        V.isObject = function(value) {

            return value && (typeof value === 'object');
        };

        V.isArray = Array.isArray;

        V.parseXML = function(data, opt) {

            opt = opt || {};

            var xml;

            try {
                var parser = new DOMParser();

                if (!V.isUndefined(opt.async)) {
                    parser.async = opt.async;
                }

                xml = parser.parseFromString(data, 'text/xml');
            } catch (error) {
                xml = undefined;
            }

            if (!xml || xml.getElementsByTagName('parsererror').length) {
                throw new Error('Invalid XML: ' + data);
            }

            return xml;
        };

        /**
         * @param {string} name
         * @returns {{ns: string|null, local: string}} namespace and attribute name
         */
        V.qualifyAttr = function(name) {

            if (name.indexOf(':') !== -1) {
                var combinedKey = name.split(':');
                return {
                    ns: ns[combinedKey[0]],
                    local: combinedKey[1]
                };
            }

            return {
                ns: null,
                local: name
            };
        };

        V.transformRegex = /(\w+)\(([^,)]+),?([^)]+)?\)/gi;
        V.transformSeparatorRegex = /[ ,]+/;
        V.transformationListRegex = /^(\w+)\((.*)\)/;

        V.transformStringToMatrix = function(transform) {

            var transformationMatrix = V.createSVGMatrix();
            var matches = transform && transform.match(V.transformRegex);
            if (!matches) {
                return transformationMatrix;
            }

            for (var i = 0, n = matches.length; i < n; i++) {
                var transformationString = matches[i];

                var transformationMatch = transformationString.match(V.transformationListRegex);
                if (transformationMatch) {
                    var sx, sy, tx, ty, angle;
                    var ctm = V.createSVGMatrix();
                    var args = transformationMatch[2].split(V.transformSeparatorRegex);
                    switch (transformationMatch[1].toLowerCase()) {
                        case 'scale':
                            sx = parseFloat(args[0]);
                            sy = (args[1] === undefined) ? sx : parseFloat(args[1]);
                            ctm = ctm.scaleNonUniform(sx, sy);
                            break;
                        case 'translate':
                            tx = parseFloat(args[0]);
                            ty = parseFloat(args[1]);
                            ctm = ctm.translate(tx, ty);
                            break;
                        case 'rotate':
                            angle = parseFloat(args[0]);
                            tx = parseFloat(args[1]) || 0;
                            ty = parseFloat(args[2]) || 0;
                            if (tx !== 0 || ty !== 0) {
                                ctm = ctm.translate(tx, ty).rotate(angle).translate(-tx, -ty);
                            } else {
                                ctm = ctm.rotate(angle);
                            }
                            break;
                        case 'skewx':
                            angle = parseFloat(args[0]);
                            ctm = ctm.skewX(angle);
                            break;
                        case 'skewy':
                            angle = parseFloat(args[0]);
                            ctm = ctm.skewY(angle);
                            break;
                        case 'matrix':
                            ctm.a = parseFloat(args[0]);
                            ctm.b = parseFloat(args[1]);
                            ctm.c = parseFloat(args[2]);
                            ctm.d = parseFloat(args[3]);
                            ctm.e = parseFloat(args[4]);
                            ctm.f = parseFloat(args[5]);
                            break;
                        default:
                            continue;
                    }

                    transformationMatrix = transformationMatrix.multiply(ctm);
                }

            }
            return transformationMatrix;
        };

        V.matrixToTransformString = function(matrix) {
            matrix || (matrix = true);

            return 'matrix(' +
                (matrix.a !== undefined ? matrix.a : 1) + ',' +
                (matrix.b !== undefined ? matrix.b : 0) + ',' +
                (matrix.c !== undefined ? matrix.c : 0) + ',' +
                (matrix.d !== undefined ? matrix.d : 1) + ',' +
                (matrix.e !== undefined ? matrix.e : 0) + ',' +
                (matrix.f !== undefined ? matrix.f : 0) +
                ')';
        };

        V.parseTransformString = function(transform) {

            var translate, rotate, scale$$1;

            if (transform) {

                var separator = V.transformSeparatorRegex;

                // Allow reading transform string with a single matrix
                if (transform.trim().indexOf('matrix') >= 0) {

                    var matrix = V.transformStringToMatrix(transform);
                    var decomposedMatrix = V.decomposeMatrix(matrix);

                    translate = [decomposedMatrix.translateX, decomposedMatrix.translateY];
                    scale$$1 = [decomposedMatrix.scaleX, decomposedMatrix.scaleY];
                    rotate = [decomposedMatrix.rotation];

                    var transformations = [];
                    if (translate[0] !== 0 || translate[1] !== 0) {
                        transformations.push('translate(' + translate + ')');
                    }
                    if (scale$$1[0] !== 1 || scale$$1[1] !== 1) {
                        transformations.push('scale(' + scale$$1 + ')');
                    }
                    if (rotate[0] !== 0) {
                        transformations.push('rotate(' + rotate + ')');
                    }
                    transform = transformations.join(' ');

                } else {

                    var translateMatch = transform.match(/translate\((.*?)\)/);
                    if (translateMatch) {
                        translate = translateMatch[1].split(separator);
                    }
                    var rotateMatch = transform.match(/rotate\((.*?)\)/);
                    if (rotateMatch) {
                        rotate = rotateMatch[1].split(separator);
                    }
                    var scaleMatch = transform.match(/scale\((.*?)\)/);
                    if (scaleMatch) {
                        scale$$1 = scaleMatch[1].split(separator);
                    }
                }
            }

            var sx = (scale$$1 && scale$$1[0]) ? parseFloat(scale$$1[0]) : 1;

            return {
                value: transform,
                translate: {
                    tx: (translate && translate[0]) ? parseInt(translate[0], 10) : 0,
                    ty: (translate && translate[1]) ? parseInt(translate[1], 10) : 0
                },
                rotate: {
                    angle: (rotate && rotate[0]) ? parseInt(rotate[0], 10) : 0,
                    cx: (rotate && rotate[1]) ? parseInt(rotate[1], 10) : undefined,
                    cy: (rotate && rotate[2]) ? parseInt(rotate[2], 10) : undefined
                },
                scale: {
                    sx: sx,
                    sy: (scale$$1 && scale$$1[1]) ? parseFloat(scale$$1[1]) : sx
                }
            };
        };

        V.deltaTransformPoint = function(matrix, point$$1) {

            var dx = point$$1.x * matrix.a + point$$1.y * matrix.c + 0;
            var dy = point$$1.x * matrix.b + point$$1.y * matrix.d + 0;
            return { x: dx, y: dy };
        };

        V.decomposeMatrix = function(matrix) {

            // @see https://gist.github.com/2052247

            // calculate delta transform point
            var px = V.deltaTransformPoint(matrix, { x: 0, y: 1 });
            var py = V.deltaTransformPoint(matrix, { x: 1, y: 0 });

            // calculate skew
            var skewX = ((180 / PI) * atan2(px.y, px.x) - 90);
            var skewY = ((180 / PI) * atan2(py.y, py.x));

            return {

                translateX: matrix.e,
                translateY: matrix.f,
                scaleX: sqrt(matrix.a * matrix.a + matrix.b * matrix.b),
                scaleY: sqrt(matrix.c * matrix.c + matrix.d * matrix.d),
                skewX: skewX,
                skewY: skewY,
                rotation: skewX // rotation is the same as skew x
            };
        };

        // Return the `scale` transformation from the following equation:
        // `translate(tx, ty) . rotate(angle) . scale(sx, sy) === matrix(a,b,c,d,e,f)`
        V.matrixToScale = function(matrix) {

            var a, b, c, d;
            if (matrix) {
                a = V.isUndefined(matrix.a) ? 1 : matrix.a;
                d = V.isUndefined(matrix.d) ? 1 : matrix.d;
                b = matrix.b;
                c = matrix.c;
            } else {
                a = d = 1;
            }
            return {
                sx: b ? sqrt(a * a + b * b) : a,
                sy: c ? sqrt(c * c + d * d) : d
            };
        };

        // Return the `rotate` transformation from the following equation:
        // `translate(tx, ty) . rotate(angle) . scale(sx, sy) === matrix(a,b,c,d,e,f)`
        V.matrixToRotate = function(matrix) {

            var p = { x: 0, y: 1 };
            if (matrix) {
                p = V.deltaTransformPoint(matrix, p);
            }

            return {
                angle: normalizeAngle(toDeg(atan2(p.y, p.x)) - 90)
            };
        };

        // Return the `translate` transformation from the following equation:
        // `translate(tx, ty) . rotate(angle) . scale(sx, sy) === matrix(a,b,c,d,e,f)`
        V.matrixToTranslate = function(matrix) {

            return {
                tx: (matrix && matrix.e) || 0,
                ty: (matrix && matrix.f) || 0
            };
        };

        V.isV = function(object) {

            return object instanceof V;
        };

        // For backwards compatibility:
        V.isVElement = V.isV;

        // Element implements `getBBox()`, `getCTM()` and `getScreenCTM()`
        // https://developer.mozilla.org/en-US/docs/Web/API/SVGGraphicsElement
        V.isSVGGraphicsElement = function(node) {
            if (!node) { return false; }
            node = V.toNode(node);
            // IE/Edge does not implement SVGGraphicsElement interface, thus check for `getScreenCTM` below
            return node instanceof SVGElement && typeof node.getScreenCTM === 'function';
        };

        var svgDocument = V('svg').node;

        V.createSVGMatrix = function(matrix) {

            var svgMatrix = svgDocument.createSVGMatrix();
            for (var component in matrix) {
                svgMatrix[component] = matrix[component];
            }

            return svgMatrix;
        };

        V.createSVGTransform = function(matrix) {

            if (!V.isUndefined(matrix)) {

                if (!(matrix instanceof SVGMatrix)) {
                    matrix = V.createSVGMatrix(matrix);
                }

                return svgDocument.createSVGTransformFromMatrix(matrix);
            }

            return svgDocument.createSVGTransform();
        };

        V.createSVGPoint = function(x, y) {

            var p = svgDocument.createSVGPoint();
            p.x = x;
            p.y = y;
            return p;
        };

        V.transformRect = function(r, matrix) {

            var p = svgDocument.createSVGPoint();

            p.x = r.x;
            p.y = r.y;
            var corner1 = p.matrixTransform(matrix);

            p.x = r.x + r.width;
            p.y = r.y;
            var corner2 = p.matrixTransform(matrix);

            p.x = r.x + r.width;
            p.y = r.y + r.height;
            var corner3 = p.matrixTransform(matrix);

            p.x = r.x;
            p.y = r.y + r.height;
            var corner4 = p.matrixTransform(matrix);

            var minX = min(corner1.x, corner2.x, corner3.x, corner4.x);
            var maxX = max(corner1.x, corner2.x, corner3.x, corner4.x);
            var minY = min(corner1.y, corner2.y, corner3.y, corner4.y);
            var maxY = max(corner1.y, corner2.y, corner3.y, corner4.y);

            return new Rect(minX, minY, maxX - minX, maxY - minY);
        };

        V.transformPoint = function(p, matrix) {

            return new Point(V.createSVGPoint(p.x, p.y).matrixTransform(matrix));
        };

        V.transformLine = function(l, matrix) {

            return new Line(
                V.transformPoint(l.start, matrix),
                V.transformPoint(l.end, matrix)
            );
        };

        V.transformPolyline = function(p, matrix) {

            var inPoints = (p instanceof Polyline) ? p.points : p;
            if (!V.isArray(inPoints)) { inPoints = []; }
            var outPoints = [];
            for (var i = 0, n = inPoints.length; i < n; i++) { outPoints[i] = V.transformPoint(inPoints[i], matrix); }
            return new Polyline(outPoints);
        };

        // Convert a style represented as string (e.g. `'fill="blue"; stroke="red"'`) to
        // an object (`{ fill: 'blue', stroke: 'red' }`).
        V.styleToObject = function(styleString) {
            var ret = {};
            var styles = styleString.split(';');
            for (var i = 0; i < styles.length; i++) {
                var style = styles[i];
                var pair = style.split('=');
                ret[pair[0].trim()] = pair[1].trim();
            }
            return ret;
        };

        // Inspired by d3.js https://github.com/mbostock/d3/blob/master/src/svg/arc.js
        V.createSlicePathData = function(innerRadius, outerRadius, startAngle, endAngle) {

            var svgArcMax = 2 * PI - 1e-6;
            var r0 = innerRadius;
            var r1 = outerRadius;
            var a0 = startAngle;
            var a1 = endAngle;
            var da = (a1 < a0 && (da = a0, a0 = a1, a1 = da), a1 - a0);
            var df = da < PI ? '0' : '1';
            var c0 = cos(a0);
            var s0 = sin(a0);
            var c1 = cos(a1);
            var s1 = sin(a1);

            return (da >= svgArcMax)
                ? (r0
                    ? 'M0,' + r1
                    + 'A' + r1 + ',' + r1 + ' 0 1,1 0,' + (-r1)
                    + 'A' + r1 + ',' + r1 + ' 0 1,1 0,' + r1
                    + 'M0,' + r0
                    + 'A' + r0 + ',' + r0 + ' 0 1,0 0,' + (-r0)
                    + 'A' + r0 + ',' + r0 + ' 0 1,0 0,' + r0
                    + 'Z'
                    : 'M0,' + r1
                    + 'A' + r1 + ',' + r1 + ' 0 1,1 0,' + (-r1)
                    + 'A' + r1 + ',' + r1 + ' 0 1,1 0,' + r1
                    + 'Z')
                : (r0
                    ? 'M' + r1 * c0 + ',' + r1 * s0
                    + 'A' + r1 + ',' + r1 + ' 0 ' + df + ',1 ' + r1 * c1 + ',' + r1 * s1
                    + 'L' + r0 * c1 + ',' + r0 * s1
                    + 'A' + r0 + ',' + r0 + ' 0 ' + df + ',0 ' + r0 * c0 + ',' + r0 * s0
                    + 'Z'
                    : 'M' + r1 * c0 + ',' + r1 * s0
                    + 'A' + r1 + ',' + r1 + ' 0 ' + df + ',1 ' + r1 * c1 + ',' + r1 * s1
                    + 'L0,0'
                    + 'Z');
        };

        // Merge attributes from object `b` with attributes in object `a`.
        // Note that this modifies the object `a`.
        // Also important to note that attributes are merged but CSS classes are concatenated.
        V.mergeAttrs = function(a, b) {

            for (var attr in b) {

                if (attr === 'class') {
                    // Concatenate classes.
                    a[attr] = a[attr] ? a[attr] + ' ' + b[attr] : b[attr];
                } else if (attr === 'style') {
                    // `style` attribute can be an object.
                    if (V.isObject(a[attr]) && V.isObject(b[attr])) {
                        // `style` stored in `a` is an object.
                        a[attr] = V.mergeAttrs(a[attr], b[attr]);
                    } else if (V.isObject(a[attr])) {
                        // `style` in `a` is an object but it's a string in `b`.
                        // Convert the style represented as a string to an object in `b`.
                        a[attr] = V.mergeAttrs(a[attr], V.styleToObject(b[attr]));
                    } else if (V.isObject(b[attr])) {
                        // `style` in `a` is a string, in `b` it's an object.
                        a[attr] = V.mergeAttrs(V.styleToObject(a[attr]), b[attr]);
                    } else {
                        // Both styles are strings.
                        a[attr] = V.mergeAttrs(V.styleToObject(a[attr]), V.styleToObject(b[attr]));
                    }
                } else {
                    a[attr] = b[attr];
                }
            }

            return a;
        };

        V.annotateString = function(t, annotations, opt) {

            annotations = annotations || [];
            opt = opt || {};

            var offset = opt.offset || 0;
            var compacted = [];
            var batch;
            var ret = [];
            var item;
            var prev;

            for (var i = 0; i < t.length; i++) {

                item = ret[i] = t[i];

                for (var j = 0; j < annotations.length; j++) {

                    var annotation = annotations[j];
                    var start = annotation.start + offset;
                    var end = annotation.end + offset;

                    if (i >= start && i < end) {
                        // Annotation applies.
                        if (V.isObject(item)) {
                            // There is more than one annotation to be applied => Merge attributes.
                            item.attrs = V.mergeAttrs(V.mergeAttrs({}, item.attrs), annotation.attrs);
                        } else {
                            item = ret[i] = { t: t[i], attrs: annotation.attrs };
                        }
                        if (opt.includeAnnotationIndices) {
                            (item.annotations || (item.annotations = [])).push(j);
                        }
                    }
                }

                prev = ret[i - 1];

                if (!prev) {

                    batch = item;

                } else if (V.isObject(item) && V.isObject(prev)) {
                    // Both previous item and the current one are annotations. If the attributes
                    // didn't change, merge the text.
                    if (JSON.stringify(item.attrs) === JSON.stringify(prev.attrs)) {
                        batch.t += item.t;
                    } else {
                        compacted.push(batch);
                        batch = item;
                    }

                } else if (V.isObject(item)) {
                    // Previous item was a string, current item is an annotation.
                    compacted.push(batch);
                    batch = item;

                } else if (V.isObject(prev)) {
                    // Previous item was an annotation, current item is a string.
                    compacted.push(batch);
                    batch = item;

                } else {
                    // Both previous and current item are strings.
                    batch = (batch || '') + item;
                }
            }

            if (batch) {
                compacted.push(batch);
            }

            return compacted;
        };

        V.findAnnotationsAtIndex = function(annotations, index) {

            var found = [];

            if (annotations) {

                annotations.forEach(function(annotation) {

                    if (annotation.start < index && index <= annotation.end) {
                        found.push(annotation);
                    }
                });
            }

            return found;
        };

        V.findAnnotationsBetweenIndexes = function(annotations, start, end) {

            var found = [];

            if (annotations) {

                annotations.forEach(function(annotation) {

                    if ((start >= annotation.start && start < annotation.end) || (end > annotation.start && end <= annotation.end) || (annotation.start >= start && annotation.end < end)) {
                        found.push(annotation);
                    }
                });
            }

            return found;
        };

        // Shift all the text annotations after character `index` by `offset` positions.
        V.shiftAnnotations = function(annotations, index, offset) {

            if (annotations) {

                annotations.forEach(function(annotation) {

                    if (annotation.start < index && annotation.end >= index) {
                        annotation.end += offset;
                    } else if (annotation.start >= index) {
                        annotation.start += offset;
                        annotation.end += offset;
                    }
                });
            }

            return annotations;
        };

        V.convertLineToPathData = function(line$$1) {

            line$$1 = V(line$$1);
            var d = [
                'M', line$$1.attr('x1'), line$$1.attr('y1'),
                'L', line$$1.attr('x2'), line$$1.attr('y2')
            ].join(' ');
            return d;
        };

        V.convertPolygonToPathData = function(polygon) {

            var points = V.getPointsFromSvgNode(polygon);
            if (points.length === 0) { return null; }

            return V.svgPointsToPath(points) + ' Z';
        };

        V.convertPolylineToPathData = function(polyline) {

            var points = V.getPointsFromSvgNode(polyline);
            if (points.length === 0) { return null; }

            return V.svgPointsToPath(points);
        };

        V.svgPointsToPath = function(points) {

            for (var i = 0, n = points.length; i < n; i++) {
                points[i] = points[i].x + ' ' + points[i].y;
            }

            return 'M ' + points.join(' L');
        };

        V.getPointsFromSvgNode = function(node) {

            node = V.toNode(node);
            var points = [];
            var nodePoints = node.points;
            if (nodePoints) {
                for (var i = 0, n = nodePoints.numberOfItems; i < n; i++) {
                    points.push(nodePoints.getItem(i));
                }
            }

            return points;
        };

        V.KAPPA = 0.551784;

        V.convertCircleToPathData = function(circle) {

            circle = V(circle);
            var cx = parseFloat(circle.attr('cx')) || 0;
            var cy = parseFloat(circle.attr('cy')) || 0;
            var r = parseFloat(circle.attr('r'));
            var cd = r * V.KAPPA; // Control distance.

            var d = [
                'M', cx, cy - r,    // Move to the first point.
                'C', cx + cd, cy - r, cx + r, cy - cd, cx + r, cy, // I. Quadrant.
                'C', cx + r, cy + cd, cx + cd, cy + r, cx, cy + r, // II. Quadrant.
                'C', cx - cd, cy + r, cx - r, cy + cd, cx - r, cy, // III. Quadrant.
                'C', cx - r, cy - cd, cx - cd, cy - r, cx, cy - r, // IV. Quadrant.
                'Z'
            ].join(' ');
            return d;
        };

        V.convertEllipseToPathData = function(ellipse$$1) {

            ellipse$$1 = V(ellipse$$1);
            var cx = parseFloat(ellipse$$1.attr('cx')) || 0;
            var cy = parseFloat(ellipse$$1.attr('cy')) || 0;
            var rx = parseFloat(ellipse$$1.attr('rx'));
            var ry = parseFloat(ellipse$$1.attr('ry')) || rx;
            var cdx = rx * V.KAPPA; // Control distance x.
            var cdy = ry * V.KAPPA; // Control distance y.

            var d = [
                'M', cx, cy - ry,    // Move to the first point.
                'C', cx + cdx, cy - ry, cx + rx, cy - cdy, cx + rx, cy, // I. Quadrant.
                'C', cx + rx, cy + cdy, cx + cdx, cy + ry, cx, cy + ry, // II. Quadrant.
                'C', cx - cdx, cy + ry, cx - rx, cy + cdy, cx - rx, cy, // III. Quadrant.
                'C', cx - rx, cy - cdy, cx - cdx, cy - ry, cx, cy - ry, // IV. Quadrant.
                'Z'
            ].join(' ');
            return d;
        };

        V.convertRectToPathData = function(rect$$1) {

            rect$$1 = V(rect$$1);

            return V.rectToPath({
                x: parseFloat(rect$$1.attr('x')) || 0,
                y: parseFloat(rect$$1.attr('y')) || 0,
                width: parseFloat(rect$$1.attr('width')) || 0,
                height: parseFloat(rect$$1.attr('height')) || 0,
                rx: parseFloat(rect$$1.attr('rx')) || 0,
                ry: parseFloat(rect$$1.attr('ry')) || 0
            });
        };

        // Convert a rectangle to SVG path commands. `r` is an object of the form:
        // `{ x: [number], y: [number], width: [number], height: [number], top-ry: [number], top-ry: [number], bottom-rx: [number], bottom-ry: [number] }`,
        // where `x, y, width, height` are the usual rectangle attributes and [top-/bottom-]rx/ry allows for
        // specifying radius of the rectangle for all its sides (as opposed to the built-in SVG rectangle
        // that has only `rx` and `ry` attributes).
        V.rectToPath = function(r) {

            var d;
            var x = r.x;
            var y = r.y;
            var width = r.width;
            var height = r.height;
            var topRx = min(r.rx || r['top-rx'] || 0, width / 2);
            var bottomRx = min(r.rx || r['bottom-rx'] || 0, width / 2);
            var topRy = min(r.ry || r['top-ry'] || 0, height / 2);
            var bottomRy = min(r.ry || r['bottom-ry'] || 0, height / 2);

            if (topRx || bottomRx || topRy || bottomRy) {
                d = [
                    'M', x, y + topRy,
                    'v', height - topRy - bottomRy,
                    'a', bottomRx, bottomRy, 0, 0, 0, bottomRx, bottomRy,
                    'h', width - 2 * bottomRx,
                    'a', bottomRx, bottomRy, 0, 0, 0, bottomRx, -bottomRy,
                    'v', -(height - bottomRy - topRy),
                    'a', topRx, topRy, 0, 0, 0, -topRx, -topRy,
                    'h', -(width - 2 * topRx),
                    'a', topRx, topRy, 0, 0, 0, -topRx, topRy,
                    'Z'
                ];
            } else {
                d = [
                    'M', x, y,
                    'H', x + width,
                    'V', y + height,
                    'H', x,
                    'V', y,
                    'Z'
                ];
            }

            return d.join(' ');
        };

        // Take a path data string
        // Return a normalized path data string
        // If data cannot be parsed, return 'M 0 0'
        // Adapted from Rappid normalizePath polyfill
        // Highly inspired by Raphael Library (www.raphael.com)
        V.normalizePathData = (function() {

            var spaces = '\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029';
            var pathCommand = new RegExp('([a-z])[' + spaces + ',]*((-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?[' + spaces + ']*,?[' + spaces + ']*)+)', 'ig');
            var pathValues = new RegExp('(-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?)[' + spaces + ']*,?[' + spaces + ']*', 'ig');

            var math = Math;
            var PI = math.PI;
            var sin = math.sin;
            var cos = math.cos;
            var tan = math.tan;
            var asin = math.asin;
            var sqrt = math.sqrt;
            var abs = math.abs;

            function q2c(x1, y1, ax, ay, x2, y2) {

                var _13 = 1 / 3;
                var _23 = 2 / 3;
                return [(_13 * x1) + (_23 * ax), (_13 * y1) + (_23 * ay), (_13 * x2) + (_23 * ax), (_13 * y2) + (_23 * ay), x2, y2];
            }

            function a2c(x1, y1, rx, ry, angle, large_arc_flag, sweep_flag, x2, y2, recursive) {
                // for more information of where this math came from visit:
                // http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes

                var _120 = (PI * 120) / 180;
                var rad = (PI / 180) * (+angle || 0);
                var res = [];
                var xy;

                var rotate = function(x, y, rad) {

                    var X = (x * cos(rad)) - (y * sin(rad));
                    var Y = (x * sin(rad)) + (y * cos(rad));
                    return { x: X, y: Y };
                };

                if (!recursive) {
                    xy = rotate(x1, y1, -rad);
                    x1 = xy.x;
                    y1 = xy.y;

                    xy = rotate(x2, y2, -rad);
                    x2 = xy.x;
                    y2 = xy.y;

                    var x = (x1 - x2) / 2;
                    var y = (y1 - y2) / 2;
                    var h = ((x * x) / (rx * rx)) + ((y * y) / (ry * ry));

                    if (h > 1) {
                        h = sqrt(h);
                        rx = h * rx;
                        ry = h * ry;
                    }

                    var rx2 = rx * rx;
                    var ry2 = ry * ry;

                    var k = ((large_arc_flag == sweep_flag) ? -1 : 1) * sqrt(abs(((rx2 * ry2) - (rx2 * y * y) - (ry2 * x * x)) / ((rx2 * y * y) + (ry2 * x * x))));

                    var cx = ((k * rx * y) / ry) + ((x1 + x2) / 2);
                    var cy = ((k * -ry * x) / rx) + ((y1 + y2) / 2);

                    var f1 = asin(((y1 - cy) / ry).toFixed(9));
                    var f2 = asin(((y2 - cy) / ry).toFixed(9));

                    f1 = ((x1 < cx) ? (PI - f1) : f1);
                    f2 = ((x2 < cx) ? (PI - f2) : f2);

                    if (f1 < 0) { f1 = (PI * 2) + f1; }
                    if (f2 < 0) { f2 = (PI * 2) + f2; }

                    if ((sweep_flag && f1) > f2) { f1 = f1 - (PI * 2); }
                    if ((!sweep_flag && f2) > f1) { f2 = f2 - (PI * 2); }

                } else {
                    f1 = recursive[0];
                    f2 = recursive[1];
                    cx = recursive[2];
                    cy = recursive[3];
                }

                var df = f2 - f1;

                if (abs(df) > _120) {
                    var f2old = f2;
                    var x2old = x2;
                    var y2old = y2;

                    f2 = f1 + (_120 * (((sweep_flag && f2) > f1) ? 1 : -1));
                    x2 = cx + (rx * cos(f2));
                    y2 = cy + (ry * sin(f2));

                    res = a2c(x2, y2, rx, ry, angle, 0, sweep_flag, x2old, y2old, [f2, f2old, cx, cy]);
                }

                df = f2 - f1;

                var c1 = cos(f1);
                var s1 = sin(f1);
                var c2 = cos(f2);
                var s2 = sin(f2);

                var t = tan(df / 4);

                var hx = (4 / 3) * (rx * t);
                var hy = (4 / 3) * (ry * t);

                var m1 = [x1, y1];
                var m2 = [x1 + (hx * s1), y1 - (hy * c1)];
                var m3 = [x2 + (hx * s2), y2 - (hy * c2)];
                var m4 = [x2, y2];

                m2[0] = (2 * m1[0]) - m2[0];
                m2[1] = (2 * m1[1]) - m2[1];

                if (recursive) {
                    return [m2, m3, m4].concat(res);

                } else {
                    res = [m2, m3, m4].concat(res).join().split(',');

                    var newres = [];
                    var ii = res.length;
                    for (var i = 0; i < ii; i++) {
                        newres[i] = (i % 2) ? rotate(res[i - 1], res[i], rad).y : rotate(res[i], res[i + 1], rad).x;
                    }

                    return newres;
                }
            }

            function parsePathString(pathString) {

                if (!pathString) { return null; }

                var paramCounts = { a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0 };
                var data = [];

                String(pathString).replace(pathCommand, function(a, b, c) {

                    var params = [];
                    var name = b.toLowerCase();
                    c.replace(pathValues, function(a, b) {
                        if (b) { params.push(+b); }
                    });

                    if ((name === 'm') && (params.length > 2)) {
                        data.push([b].concat(params.splice(0, 2)));
                        name = 'l';
                        b = ((b === 'm') ? 'l' : 'L');
                    }

                    while (params.length >= paramCounts[name]) {
                        data.push([b].concat(params.splice(0, paramCounts[name])));
                        if (!paramCounts[name]) { break; }
                    }
                });

                return data;
            }

            function pathToAbsolute(pathArray) {

                if (!Array.isArray(pathArray) || !Array.isArray(pathArray && pathArray[0])) { // rough assumption
                    pathArray = parsePathString(pathArray);
                }

                // if invalid string, return 'M 0 0'
                if (!pathArray || !pathArray.length) { return [['M', 0, 0]]; }

                var res = [];
                var x = 0;
                var y = 0;
                var mx = 0;
                var my = 0;
                var start = 0;
                var pa0;

                var ii = pathArray.length;
                for (var i = start; i < ii; i++) {

                    var r = [];
                    res.push(r);

                    var pa = pathArray[i];
                    pa0 = pa[0];

                    if (pa0 != pa0.toUpperCase()) {
                        r[0] = pa0.toUpperCase();

                        var jj;
                        var j;
                        switch (r[0]) {
                            case 'A':
                                r[1] = pa[1];
                                r[2] = pa[2];
                                r[3] = pa[3];
                                r[4] = pa[4];
                                r[5] = pa[5];
                                r[6] = +pa[6] + x;
                                r[7] = +pa[7] + y;
                                break;

                            case 'V':
                                r[1] = +pa[1] + y;
                                break;

                            case 'H':
                                r[1] = +pa[1] + x;
                                break;

                            case 'M':
                                mx = +pa[1] + x;
                                my = +pa[2] + y;

                                jj = pa.length;
                                for (j = 1; j < jj; j++) {
                                    r[j] = +pa[j] + ((j % 2) ? x : y);
                                }
                                break;

                            default:
                                jj = pa.length;
                                for (j = 1; j < jj; j++) {
                                    r[j] = +pa[j] + ((j % 2) ? x : y);
                                }
                                break;
                        }
                    } else {
                        var kk = pa.length;
                        for (var k = 0; k < kk; k++) {
                            r[k] = pa[k];
                        }
                    }

                    switch (r[0]) {
                        case 'Z':
                            x = +mx;
                            y = +my;
                            break;

                        case 'H':
                            x = r[1];
                            break;

                        case 'V':
                            y = r[1];
                            break;

                        case 'M':
                            mx = r[r.length - 2];
                            my = r[r.length - 1];
                            x = r[r.length - 2];
                            y = r[r.length - 1];
                            break;

                        default:
                            x = r[r.length - 2];
                            y = r[r.length - 1];
                            break;
                    }
                }

                return res;
            }

            function normalize(path) {

                var p = pathToAbsolute(path);
                var attrs = { x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null };

                function processPath(path, d, pcom) {

                    var nx, ny;

                    if (!path) { return ['C', d.x, d.y, d.x, d.y, d.x, d.y]; }

                    if (!(path[0] in { T: 1, Q: 1 })) {
                        d.qx = null;
                        d.qy = null;
                    }

                    switch (path[0]) {
                        case 'M':
                            d.X = path[1];
                            d.Y = path[2];
                            break;

                        case 'A':
                            if (parseFloat(path[1]) === 0 || parseFloat(path[2]) === 0) {
                                // https://www.w3.org/TR/SVG/paths.html#ArcOutOfRangeParameters
                                // "If either rx or ry is 0, then this arc is treated as a
                                // straight line segment (a "lineto") joining the endpoints."
                                path = ['L', path[6], path[7]];
                            } else {
                                path = ['C'].concat(a2c.apply(0, [d.x, d.y].concat(path.slice(1))));
                            }
                            break;

                        case 'S':
                            if (pcom === 'C' || pcom === 'S') { // In 'S' case we have to take into account, if the previous command is C/S.
                                nx = (d.x * 2) - d.bx;          // And reflect the previous
                                ny = (d.y * 2) - d.by;          // command's control point relative to the current point.
                            } else {                            // or some else or nothing
                                nx = d.x;
                                ny = d.y;
                            }
                            path = ['C', nx, ny].concat(path.slice(1));
                            break;

                        case 'T':
                            if (pcom === 'Q' || pcom === 'T') { // In 'T' case we have to take into account, if the previous command is Q/T.
                                d.qx = (d.x * 2) - d.qx;        // And make a reflection similar
                                d.qy = (d.y * 2) - d.qy;        // to case 'S'.
                            } else {                            // or something else or nothing
                                d.qx = d.x;
                                d.qy = d.y;
                            }
                            path = ['C'].concat(q2c(d.x, d.y, d.qx, d.qy, path[1], path[2]));
                            break;

                        case 'Q':
                            d.qx = path[1];
                            d.qy = path[2];
                            path = ['C'].concat(q2c(d.x, d.y, path[1], path[2], path[3], path[4]));
                            break;

                        case 'H':
                            path = ['L'].concat(path[1], d.y);
                            break;

                        case 'V':
                            path = ['L'].concat(d.x, path[1]);
                            break;

                        case 'L':
                            break;

                        case 'Z':
                            break;
                    }

                    return path;
                }

                function fixArc(pp, i) {

                    if (pp[i].length > 7) {

                        pp[i].shift();
                        var pi = pp[i];

                        while (pi.length) {
                            pcoms[i] = 'A'; // if created multiple 'C's, their original seg is saved
                            pp.splice(i++, 0, ['C'].concat(pi.splice(0, 6)));
                        }

                        pp.splice(i, 1);
                        ii = p.length;
                    }
                }

                var pcoms = []; // path commands of original path p
                var pfirst = ''; // temporary holder for original path command
                var pcom = ''; // holder for previous path command of original path

                var ii = p.length;
                for (var i = 0; i < ii; i++) {
                    if (p[i]) { pfirst = p[i][0]; } // save current path command

                    if (pfirst !== 'C') { // C is not saved yet, because it may be result of conversion
                        pcoms[i] = pfirst; // Save current path command
                        if (i > 0) { pcom = pcoms[i - 1]; } // Get previous path command pcom
                    }

                    p[i] = processPath(p[i], attrs, pcom); // Previous path command is inputted to processPath

                    if (pcoms[i] !== 'A' && pfirst === 'C') { pcoms[i] = 'C'; } // 'A' is the only command
                    // which may produce multiple 'C's
                    // so we have to make sure that 'C' is also 'C' in original path

                    fixArc(p, i); // fixArc adds also the right amount of 'A's to pcoms

                    var seg = p[i];
                    var seglen = seg.length;

                    attrs.x = seg[seglen - 2];
                    attrs.y = seg[seglen - 1];

                    attrs.bx = parseFloat(seg[seglen - 4]) || attrs.x;
                    attrs.by = parseFloat(seg[seglen - 3]) || attrs.y;
                }

                // make sure normalized path data string starts with an M segment
                if (!p[0][0] || p[0][0] !== 'M') {
                    p.unshift(['M', 0, 0]);
                }

                return p;
            }

            return function(pathData) {
                return normalize(pathData).join(',').split(',').join(' ');
            };
        })();

        V.namespace = ns;

        V.g = g;

        return V;

    })();

    var config = {
        // When set to `true` the cell selectors could be defined as CSS selectors.
        // If not, only JSON Markup selectors are taken into account.
        // export let useCSSSelectors = true;
        useCSSSelectors: true,
        // The class name prefix config is for advanced use only.
        // Be aware that if you change the prefix, the JointJS CSS will no longer function properly.
        // export let classNamePrefix = 'joint-';
        // export let defaultTheme = 'default';
        classNamePrefix: 'joint-',
        defaultTheme: 'default'
    };

    var addClassNamePrefix = function(className) {

        if (!className) { return className; }

        return className.toString().split(' ').map(function(_className) {

            if (_className.substr(0, config.classNamePrefix.length) !== config.classNamePrefix) {
                _className = config.classNamePrefix + _className;
            }

            return _className;

        }).join(' ');
    };

    var removeClassNamePrefix = function(className) {

        if (!className) { return className; }

        return className.toString().split(' ').map(function(_className) {

            if (_className.substr(0, config.classNamePrefix.length) === config.classNamePrefix) {
                _className = _className.substr(config.classNamePrefix.length);
            }

            return _className;

        }).join(' ');
    };

    var parseDOMJSON = function(json, namespace) {

        var selectors = {};
        var groupSelectors = {};
        var svgNamespace = V.namespace.svg;

        var ns = namespace || svgNamespace;
        var fragment = document.createDocumentFragment();
        var queue = [json, fragment, ns];
        while (queue.length > 0) {
            ns = queue.pop();
            var parentNode = queue.pop();
            var siblingsDef = queue.pop();
            for (var i = 0, n = siblingsDef.length; i < n; i++) {
                var nodeDef = siblingsDef[i];
                // TagName
                if (!nodeDef.hasOwnProperty('tagName')) { throw new Error('json-dom-parser: missing tagName'); }
                var tagName = nodeDef.tagName;
                // Namespace URI
                if (nodeDef.hasOwnProperty('namespaceURI')) { ns = nodeDef.namespaceURI; }
                var node = document.createElementNS(ns, tagName);
                var svg = (ns === svgNamespace);

                var wrapper = (svg) ? V : $;
                // Attributes
                var attributes = nodeDef.attributes;
                if (attributes) { wrapper(node).attr(attributes); }
                // Style
                var style = nodeDef.style;
                if (style) { $(node).css(style); }
                // ClassName
                if (nodeDef.hasOwnProperty('className')) {
                    var className = nodeDef.className;
                    if (svg) {
                        node.className.baseVal = className;
                    } else {
                        node.className = className;
                    }
                }
                // TextContent
                if (nodeDef.hasOwnProperty('textContent')) {
                    node.textContent = nodeDef.textContent;
                }
                // Selector
                if (nodeDef.hasOwnProperty('selector')) {
                    var nodeSelector = nodeDef.selector;
                    if (selectors[nodeSelector]) { throw new Error('json-dom-parser: selector must be unique'); }
                    selectors[nodeSelector] = node;
                    wrapper(node).attr('joint-selector', nodeSelector);
                }
                // Groups
                if (nodeDef.hasOwnProperty('groupSelector')) {
                    var nodeGroups = nodeDef.groupSelector;
                    if (!Array.isArray(nodeGroups)) { nodeGroups = [nodeGroups]; }
                    for (var j = 0, m = nodeGroups.length; j < m; j++) {
                        var nodeGroup = nodeGroups[j];
                        var group = groupSelectors[nodeGroup];
                        if (!group) { group = groupSelectors[nodeGroup] = []; }
                        group.push(node);
                    }
                }
                parentNode.appendChild(node);
                // Children
                var childrenDef = nodeDef.children;
                if (Array.isArray(childrenDef)) { queue.push(childrenDef, node, ns); }
            }
        }
        return {
            fragment: fragment,
            selectors: selectors,
            groupSelectors: groupSelectors
        };
    };

    // Return a simple hash code from a string. See http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/.
    var hashCode = function(str) {

        var hash = 0;
        if (str.length === 0) { return hash; }
        for (var i = 0; i < str.length; i++) {
            var c = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + c;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    };

    var getByPath = function(obj, path, delim) {

        var keys = Array.isArray(path) ? path.slice() : path.split(delim || '/');
        var key;

        while (keys.length) {
            key = keys.shift();
            if (Object(obj) === obj && key in obj) {
                obj = obj[key];
            } else {
                return undefined;
            }
        }
        return obj;
    };

    var setByPath = function(obj, path, value, delim) {

        var keys = Array.isArray(path) ? path : path.split(delim || '/');

        var diver = obj;
        var i = 0;

        for (var len = keys.length; i < len - 1; i++) {
            // diver creates an empty object if there is no nested object under such a key.
            // This means that one can populate an empty nested object with setByPath().
            diver = diver[keys[i]] || (diver[keys[i]] = {});
        }
        diver[keys[len - 1]] = value;

        return obj;
    };

    var unsetByPath = function(obj, path, delim) {

        delim = delim || '/';

        var pathArray = Array.isArray(path) ? path.slice() : path.split(delim);

        var propertyToRemove = pathArray.pop();
        if (pathArray.length > 0) {

            // unsetting a nested attribute
            var parent = getByPath(obj, pathArray, delim);

            if (parent) {
                delete parent[propertyToRemove];
            }

        } else {

            // unsetting a primitive attribute
            delete obj[propertyToRemove];
        }

        return obj;
    };

    var flattenObject = function(obj, delim, stop) {

        delim = delim || '/';
        var ret = {};

        for (var key in obj) {

            if (!obj.hasOwnProperty(key)) { continue; }

            var shouldGoDeeper = typeof obj[key] === 'object';
            if (shouldGoDeeper && stop && stop(obj[key])) {
                shouldGoDeeper = false;
            }

            if (shouldGoDeeper) {

                var flatObject = flattenObject(obj[key], delim, stop);

                for (var flatKey in flatObject) {
                    if (!flatObject.hasOwnProperty(flatKey)) { continue; }
                    ret[key + delim + flatKey] = flatObject[flatKey];
                }

            } else {

                ret[key] = obj[key];
            }
        }

        return ret;
    };

    var uuid = function() {

        // credit: http://stackoverflow.com/posts/2117523/revisions

        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (Math.random() * 16) | 0;
            var v = (c === 'x') ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    // Generate global unique id for obj and store it as a property of the object.
    var guid = function(obj) {

        guid.id = guid.id || 1;
        obj.id = (obj.id === undefined ? 'j_' + guid.id++ : obj.id);
        return obj.id;
    };

    var toKebabCase = function(string) {

        return string.replace(/[A-Z]/g, '-$&').toLowerCase();
    };

    var normalizeEvent = function(evt) {

        var normalizedEvent = evt;
        var touchEvt = evt.originalEvent && evt.originalEvent.changedTouches && evt.originalEvent.changedTouches[0];
        if (touchEvt) {
            for (var property in evt) {
                // copy all the properties from the input event that are not
                // defined on the touch event (functions included).
                if (touchEvt[property] === undefined) {
                    touchEvt[property] = evt[property];
                }
            }
            normalizedEvent = touchEvt;
        }

        // IE: evt.target could be set to SVGElementInstance for SVGUseElement
        var target = normalizedEvent.target;
        if (target) {
            var useElement = target.correspondingUseElement;
            if (useElement) { normalizedEvent.target = useElement; }
        }

        return normalizedEvent;
    };

    var nextFrame = (function() {

        var raf;

        if (typeof window !== 'undefined') {

            raf = window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame;
        }

        if (!raf) {

            var lastTime = 0;

            raf = function(callback) {

                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = setTimeout(function() {
                    callback(currTime + timeToCall);
                }, timeToCall);

                lastTime = currTime + timeToCall;

                return id;
            };
        }

        return function(callback, context) {
            var rest = [], len = arguments.length - 2;
            while ( len-- > 0 ) rest[ len ] = arguments[ len + 2 ];

            return (context !== undefined)
                ? raf(callback.bind.apply(callback, [ context ].concat( rest )))
                : raf(callback);
        };

    })();

    var cancelFrame = (function() {

        var caf;
        var client = typeof window != 'undefined';

        if (client) {

            caf = window.cancelAnimationFrame ||
                window.webkitCancelAnimationFrame ||
                window.webkitCancelRequestAnimationFrame ||
                window.msCancelAnimationFrame ||
                window.msCancelRequestAnimationFrame ||
                window.oCancelAnimationFrame ||
                window.oCancelRequestAnimationFrame ||
                window.mozCancelAnimationFrame ||
                window.mozCancelRequestAnimationFrame;
        }

        caf = caf || clearTimeout;

        return client ? caf.bind(window) : caf;

    })();

    /**
     * @deprecated
     */
    var shapePerimeterConnectionPoint = function(linkView, view, magnet, reference) {

        var bbox;
        var spot;

        if (!magnet) {

            // There is no magnet, try to make the best guess what is the
            // wrapping SVG element. This is because we want this "smart"
            // connection points to work out of the box without the
            // programmer to put magnet marks to any of the subelements.
            // For example, we want the function to work on basic.Path elements
            // without any special treatment of such elements.
            // The code below guesses the wrapping element based on
            // one simple assumption. The wrapping elemnet is the
            // first child of the scalable group if such a group exists
            // or the first child of the rotatable group if not.
            // This makese sense because usually the wrapping element
            // is below any other sub element in the shapes.
            var scalable = view.$('.scalable')[0];
            var rotatable = view.$('.rotatable')[0];

            if (scalable && scalable.firstChild) {

                magnet = scalable.firstChild;

            } else if (rotatable && rotatable.firstChild) {

                magnet = rotatable.firstChild;
            }
        }

        if (magnet) {

            spot = V(magnet).findIntersection(reference, linkView.paper.cells);
            if (!spot) {
                bbox = V(magnet).getBBox({ target: linkView.paper.cells });
            }

        } else {

            bbox = view.model.getBBox();
            spot = bbox.intersectionWithLineFromCenterToPoint(reference);
        }
        return spot || bbox.center();
    };

    var isPercentage = function(val) {

        return isString(val) && val.slice(-1) === '%';
    };

    var parseCssNumeric = function(val, restrictUnits) {

        function getUnit(validUnitExp) {

            // one or more numbers, followed by
            // any number of (
            //  `.`, followed by
            //  one or more numbers
            // ), followed by
            // `validUnitExp`, followed by
            // end of string
            var matches = new RegExp('(?:\\d+(?:\\.\\d+)*)(' + validUnitExp + ')$').exec(val);

            if (!matches) { return null; }
            return matches[1];
        }

        var number = parseFloat(val);

        // if `val` cannot be parsed as a number, return `null`
        if (Number.isNaN(number)) { return null; }

        // else: we know `output.value`
        var output = {};
        output.value = number;

        // determine the unit
        var validUnitExp;
        if (restrictUnits == null) {
            // no restriction
            // accept any unit, as well as no unit
            validUnitExp = '[A-Za-z]*';

        } else if (Array.isArray(restrictUnits)) {
            // if this is an empty array, top restriction - return `null`
            if (restrictUnits.length === 0) { return null; }

            // else: restriction - an array of valid unit strings
            validUnitExp = restrictUnits.join('|');

        } else if (isString(restrictUnits)) {
            // restriction - a single valid unit string
            validUnitExp = restrictUnits;
        }
        var unit = getUnit(validUnitExp);

        // if we found no matches for `restrictUnits`, return `null`
        if (unit === null) { return null; }

        // else: we know the unit
        output.unit = unit;
        return output;
    };

    var breakText = function(text, size, styles, opt) {

        opt = opt || {};
        styles = styles || {};

        var width = size.width;
        var height = size.height;

        var svgDocument = opt.svgDocument || V('svg').node;
        var textSpan = V('tspan').node;
        var textElement = V('text').attr(styles).append(textSpan).node;
        var textNode = document.createTextNode('');

        // Prevent flickering
        textElement.style.opacity = 0;
        // Prevent FF from throwing an uncaught exception when `getBBox()`
        // called on element that is not in the render tree (is not measurable).
        // <tspan>.getComputedTextLength() returns always 0 in this case.
        // Note that the `textElement` resp. `textSpan` can become hidden
        // when it's appended to the DOM and a `display: none` CSS stylesheet
        // rule gets applied.
        textElement.style.display = 'block';
        textSpan.style.display = 'block';

        textSpan.appendChild(textNode);
        svgDocument.appendChild(textElement);

        if (!opt.svgDocument) {

            document.body.appendChild(svgDocument);
        }

        var separator = opt.separator || ' ';
        var eol = opt.eol || '\n';
        var hyphen = opt.hyphen ? new RegExp(opt.hyphen) : /[^\w\d]/;

        var words = text.split(separator);
        var full = [];
        var lines = [];
        var p, h;
        var lineHeight;

        for (var i = 0, l = 0, len = words.length; i < len; i++) {

            var word = words[i];

            if (!word) { continue; }

            if (eol && word.indexOf(eol) >= 0) {
                // word cotains end-of-line character
                if (word.length > 1) {
                    // separate word and continue cycle
                    var eolWords = word.split(eol);
                    for (var j = 0, jl = eolWords.length - 1; j < jl; j++) {
                        eolWords.splice(2 * j + 1, 0, eol);
                    }
                    Array.prototype.splice.apply(words, [i, 1].concat(eolWords));
                    i--;
                    len += eolWords.length - 1;
                } else {
                    // creates new line
                    l++;
                }
                continue;
            }


            textNode.data = lines[l] ? lines[l] + ' ' + word : word;

            if (textSpan.getComputedTextLength() <= width) {

                // the current line fits
                lines[l] = textNode.data;

                if (p || h) {
                    // We were partitioning. Put rest of the word onto next line
                    full[l++] = true;

                    // cancel partitioning and splitting by hyphens
                    p = 0;
                    h = 0;
                }

            } else {

                if (!lines[l] || p) {

                    var partition = !!p;

                    p = word.length - 1;

                    if (partition || !p) {

                        // word has only one character.
                        if (!p) {

                            if (!lines[l]) {

                                // we won't fit this text within our rect
                                lines = [];

                                break;
                            }

                            // partitioning didn't help on the non-empty line
                            // try again, but this time start with a new line

                            // cancel partitions created
                            words.splice(i, 2, word + words[i + 1]);

                            // adjust word length
                            len--;

                            full[l++] = true;
                            i--;

                            continue;
                        }

                        // move last letter to the beginning of the next word
                        words[i] = word.substring(0, p);
                        words[i + 1] = word.substring(p) + words[i + 1];

                    } else {

                        if (h) {
                            // cancel splitting and put the words together again
                            words.splice(i, 2, words[i] + words[i + 1]);
                            h = 0;
                        } else {
                            var hyphenIndex = word.search(hyphen);
                            if (hyphenIndex > -1 && hyphenIndex !== word.length - 1 && hyphenIndex !== 0) {
                                h = hyphenIndex + 1;
                                p = 0;
                            }

                            // We initiate partitioning or splitting
                            // split the long word into two words
                            words.splice(i, 1, word.substring(0, h || p), word.substring(h|| p));
                            // adjust words length
                            len++;

                        }

                        if (l && !full[l - 1]) {
                            // if the previous line is not full, try to fit max part of
                            // the current word there
                            l--;
                        }
                    }

                    i--;

                    continue;
                }

                l++;
                i--;
            }

            // if size.height is defined we have to check whether the height of the entire
            // text exceeds the rect height
            if (height !== undefined) {

                if (lineHeight === undefined) {

                    var heightValue;

                    // use the same defaults as in V.prototype.text
                    if (styles.lineHeight === 'auto') {
                        heightValue = { value: 1.5, unit: 'em' };
                    } else {
                        heightValue = parseCssNumeric(styles.lineHeight, ['em']) || { value: 1, unit: 'em' };
                    }

                    lineHeight = heightValue.value;
                    if (heightValue.unit === 'em') {
                        lineHeight *= textElement.getBBox().height;
                    }
                }

                if (lineHeight * lines.length > height) {

                    // remove overflowing lines
                    var lastL = Math.floor(height / lineHeight) - 1;
                    lines.splice(lastL + 1);

                    // add ellipsis
                    var ellipsis = opt.ellipsis;
                    if (!ellipsis || lastL < 0) { break; }
                    if (typeof ellipsis !== 'string') { ellipsis = '\u2026'; }

                    var lastLine = lines[lastL];
                    var k = lastLine.length;
                    var lastLineWithOmission, lastChar, separatorChar;
                    do {
                        lastChar = lastLine[k];
                        lastLineWithOmission = lastLine.substring(0, k);
                        if (!lastChar) {
                            separatorChar = (typeof separator === 'string') ? separator : ' ';
                            lastLineWithOmission += separatorChar;
                        } else if (lastChar.match(separator)) {
                            lastLineWithOmission += lastChar;
                        }
                        lastLineWithOmission += ellipsis;
                        textNode.data = lastLineWithOmission;
                        if (textSpan.getComputedTextLength() <= width) {
                            lines[lastL] = lastLineWithOmission;
                            break;
                        }
                        k--;
                    } while (k >= 0);
                    break;
                }
            }
        }

        if (opt.svgDocument) {

            // svg document was provided, remove the text element only
            svgDocument.removeChild(textElement);

        } else {

            // clean svg document
            document.body.removeChild(svgDocument);
        }

        return lines.join(eol);
    };

    // Sanitize HTML
    // Based on https://gist.github.com/ufologist/5a0da51b2b9ef1b861c30254172ac3c9
    // Parses a string into an array of DOM nodes.
    // Then outputs it back as a string.
    var sanitizeHTML = function(html) {

        // Ignores tags that are invalid inside a <div> tag (e.g. <body>, <head>)

        // If documentContext (second parameter) is not specified or given as `null` or `undefined`, a new document is used.
        // Inline events will not execute when the HTML is parsed; this includes, for example, sending GET requests for images.

        // If keepScripts (last parameter) is `false`, scripts are not executed.
        var output = $($.parseHTML('<div>' + html + '</div>', null, false));

        output.find('*').each(function() { // for all nodes
            var currentNode = this;

            $.each(currentNode.attributes, function() { // for all attributes in each node
                var currentAttribute = this;

                var attrName = currentAttribute.name;
                var attrValue = currentAttribute.value;

                // Remove attribute names that start with "on" (e.g. onload, onerror...).
                // Remove attribute values that start with "javascript:" pseudo protocol (e.g. `href="javascript:alert(1)"`).
                if (attrName.indexOf('on') === 0 || attrValue.indexOf('javascript:') === 0) {
                    $(currentNode).removeAttr(attrName);
                }
            });
        });

        return output.html();
    };

    // Download `blob` as file with `fileName`.
    // Does not work in IE9.
    var downloadBlob = function(blob, fileName) {

        if (window.navigator.msSaveBlob) { // requires IE 10+
            // pulls up a save dialog
            window.navigator.msSaveBlob(blob, fileName);

        } else { // other browsers
            // downloads directly in Chrome and Safari

            // presents a save/open dialog in Firefox
            // Firefox bug: `from` field in save dialog always shows `from:blob:`
            // https://bugzilla.mozilla.org/show_bug.cgi?id=1053327

            var url = window.URL.createObjectURL(blob);
            var link = document.createElement('a');

            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(url); // mark the url for garbage collection
        }
    };

    // Download `dataUri` as file with `fileName`.
    // Does not work in IE9.
    var downloadDataUri = function(dataUri, fileName) {

        var blob = dataUriToBlob(dataUri);
        downloadBlob(blob, fileName);
    };

    // Convert an uri-encoded data component (possibly also base64-encoded) to a blob.
    var dataUriToBlob = function(dataUri) {

        // first, make sure there are no newlines in the data uri
        dataUri = dataUri.replace(/\s/g, '');
        dataUri = decodeURIComponent(dataUri);

        var firstCommaIndex = dataUri.indexOf(','); // split dataUri as `dataTypeString`,`data`

        var dataTypeString = dataUri.slice(0, firstCommaIndex); // e.g. 'data:image/jpeg;base64'
        var mimeString = dataTypeString.split(':')[1].split(';')[0]; // e.g. 'image/jpeg'

        var data = dataUri.slice(firstCommaIndex + 1);
        var decodedString;
        if (dataTypeString.indexOf('base64') >= 0) { // data may be encoded in base64
            decodedString = atob(data); // decode data
        } else {
            // convert the decoded string to UTF-8
            decodedString = unescape(encodeURIComponent(data));
        }
        // write the bytes of the string to a typed array
        var ia = new Uint8Array(decodedString.length);
        for (var i = 0; i < decodedString.length; i++) {
            ia[i] = decodedString.charCodeAt(i);
        }

        return new Blob([ia], { type: mimeString }); // return the typed array as Blob
    };

    // Read an image at `url` and return it as base64-encoded data uri.
    // The mime type of the image is inferred from the `url` file extension.
    // If data uri is provided as `url`, it is returned back unchanged.
    // `callback` is a method with `err` as first argument and `dataUri` as second argument.
    // Works with IE9.
    var imageToDataUri = function(url, callback) {

        if (!url || url.substr(0, 'data:'.length) === 'data:') {
            // No need to convert to data uri if it is already in data uri.

            // This not only convenient but desired. For example,
            // IE throws a security error if data:image/svg+xml is used to render
            // an image to the canvas and an attempt is made to read out data uri.
            // Now if our image is already in data uri, there is no need to render it to the canvas
            // and so we can bypass this error.

            // Keep the async nature of the function.
            return setTimeout(function() {
                callback(null, url);
            }, 0);
        }

        // chrome, IE10+
        var modernHandler = function(xhr, callback) {

            if (xhr.status === 200) {

                var reader = new FileReader();

                reader.onload = function(evt) {
                    var dataUri = evt.target.result;
                    callback(null, dataUri);
                };

                reader.onerror = function() {
                    callback(new Error('Failed to load image ' + url));
                };

                reader.readAsDataURL(xhr.response);
            } else {
                callback(new Error('Failed to load image ' + url));
            }
        };

        var legacyHandler = function(xhr, callback) {

            var Uint8ToString = function(u8a) {
                var CHUNK_SZ = 0x8000;
                var c = [];
                for (var i = 0; i < u8a.length; i += CHUNK_SZ) {
                    c.push(String.fromCharCode.apply(null, u8a.subarray(i, i + CHUNK_SZ)));
                }
                return c.join('');
            };

            if (xhr.status === 200) {

                var bytes = new Uint8Array(xhr.response);

                var suffix = (url.split('.').pop()) || 'png';
                var map = {
                    'svg': 'svg+xml'
                };
                var meta = 'data:image/' + (map[suffix] || suffix) + ';base64,';
                var b64encoded = meta + btoa(Uint8ToString(bytes));
                callback(null, b64encoded);
            } else {
                callback(new Error('Failed to load image ' + url));
            }
        };

        var xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);
        xhr.addEventListener('error', function() {
            callback(new Error('Failed to load image ' + url));
        });

        xhr.responseType = window.FileReader ? 'blob' : 'arraybuffer';

        xhr.addEventListener('load', function() {
            if (window.FileReader) {
                modernHandler(xhr, callback);
            } else {
                legacyHandler(xhr, callback);
            }
        });

        xhr.send();
    };

    var getElementBBox = function(el) {

        var $el = $(el);
        if ($el.length === 0) {
            throw new Error('Element not found');
        }

        var element = $el[0];
        var doc = element.ownerDocument;
        var clientBBox = element.getBoundingClientRect();

        var strokeWidthX = 0;
        var strokeWidthY = 0;

        // Firefox correction
        if (element.ownerSVGElement) {

            var vel = V(element);
            var bbox = vel.getBBox({ target: vel.svg() });

            // if FF getBoundingClientRect includes stroke-width, getBBox doesn't.
            // To unify this across all browsers we need to adjust the final bBox with `stroke-width` value.
            strokeWidthX = (clientBBox.width - bbox.width);
            strokeWidthY = (clientBBox.height - bbox.height);
        }

        return {
            x: clientBBox.left + window.pageXOffset - doc.documentElement.offsetLeft + strokeWidthX / 2,
            y: clientBBox.top + window.pageYOffset - doc.documentElement.offsetTop + strokeWidthY / 2,
            width: clientBBox.width - strokeWidthX,
            height: clientBBox.height - strokeWidthY
        };
    };


    // Highly inspired by the jquery.sortElements plugin by Padolsey.
    // See http://james.padolsey.com/javascript/sorting-elements-with-jquery/.
    var sortElements = function(elements, comparator) {

        var $elements = $(elements);
        var placements = $elements.map(function() {

            var sortElement = this;
            var parentNode = sortElement.parentNode;
            // Since the element itself will change position, we have
            // to have some way of storing it's original position in
            // the DOM. The easiest way is to have a 'flag' node:
            var nextSibling = parentNode.insertBefore(document.createTextNode(''), sortElement.nextSibling);

            return function() {

                if (parentNode === this) {
                    throw new Error('You can\'t sort elements if any one is a descendant of another.');
                }

                // Insert before flag:
                parentNode.insertBefore(this, nextSibling);
                // Remove flag:
                parentNode.removeChild(nextSibling);
            };
        });

        return Array.prototype.sort.call($elements, comparator).each(function(i) {
            placements[i].call(this);
        });
    };

    // Sets attributes on the given element and its descendants based on the selector.
    // `attrs` object: { [SELECTOR1]: { attrs1 }, [SELECTOR2]: { attrs2}, ... } e.g. { 'input': { color : 'red' }}
    var setAttributesBySelector = function(element, attrs) {

        var $element = $(element);

        forIn(attrs, function(attrs, selector) {
            var $elements = $element.find(selector).addBack().filter(selector);
            // Make a special case for setting classes.
            // We do not want to overwrite any existing class.
            if (has(attrs, 'class')) {
                $elements.addClass(attrs['class']);
                attrs = omit(attrs, 'class');
            }
            $elements.attr(attrs);
        });
    };

    // Return a new object with all four sides (top, right, bottom, left) in it.
    // Value of each side is taken from the given argument (either number or object).
    // Default value for a side is 0.
    // Examples:
    // normalizeSides(5) --> { top: 5, right: 5, bottom: 5, left: 5 }
    // normalizeSides({ horizontal: 5 }) --> { top: 0, right: 5, bottom: 0, left: 5 }
    // normalizeSides({ left: 5 }) --> { top: 0, right: 0, bottom: 0, left: 5 }
    // normalizeSides({ horizontal: 10, left: 5 }) --> { top: 0, right: 10, bottom: 0, left: 5 }
    // normalizeSides({ horizontal: 0, left: 5 }) --> { top: 0, right: 0, bottom: 0, left: 5 }
    var normalizeSides = function(box) {

        if (Object(box) !== box) { // `box` is not an object
            var val = 0; // `val` left as 0 if `box` cannot be understood as finite number
            if (isFinite(box)) { val = +box; } // actually also accepts string numbers (e.g. '100')

            return { top: val, right: val, bottom: val, left: val };
        }

        // `box` is an object
        var top, right, bottom, left;
        top = right = bottom = left = 0;

        if (isFinite(box.vertical)) { top = bottom = +box.vertical; }
        if (isFinite(box.horizontal)) { right = left = +box.horizontal; }

        if (isFinite(box.top)) { top = +box.top; } // overwrite vertical
        if (isFinite(box.right)) { right = +box.right; } // overwrite horizontal
        if (isFinite(box.bottom)) { bottom = +box.bottom; } // overwrite vertical
        if (isFinite(box.left)) { left = +box.left; } // overwrite horizontal

        return { top: top, right: right, bottom: bottom, left: left };
    };

    var timing = {

        linear: function(t) {
            return t;
        },

        quad: function(t) {
            return t * t;
        },

        cubic: function(t) {
            return t * t * t;
        },

        inout: function(t) {
            if (t <= 0) { return 0; }
            if (t >= 1) { return 1; }
            var t2 = t * t;
            var t3 = t2 * t;
            return 4 * (t < .5 ? t3 : 3 * (t - t2) + t3 - .75);
        },

        exponential: function(t) {
            return Math.pow(2, 10 * (t - 1));
        },

        bounce: function(t) {
            for (var a = 0, b = 1; 1; a += b, b /= 2) {
                if (t >= (7 - 4 * a) / 11) {
                    var q = (11 - 6 * a - 11 * t) / 4;
                    return -q * q + b * b;
                }
            }
        },

        reverse: function(f) {
            return function(t) {
                return 1 - f(1 - t);
            };
        },

        reflect: function(f) {
            return function(t) {
                return .5 * (t < .5 ? f(2 * t) : (2 - f(2 - 2 * t)));
            };
        },

        clamp: function(f, n, x) {
            n = n || 0;
            x = x || 1;
            return function(t) {
                var r = f(t);
                return r < n ? n : r > x ? x : r;
            };
        },

        back: function(s) {
            if (!s) { s = 1.70158; }
            return function(t) {
                return t * t * ((s + 1) * t - s);
            };
        },

        elastic: function(x) {
            if (!x) { x = 1.5; }
            return function(t) {
                return Math.pow(2, 10 * (t - 1)) * Math.cos(20 * Math.PI * x / 3 * t);
            };
        }
    };

    var interpolate = {

        number: function(a, b) {
            var d = b - a;
            return function(t) {
                return a + d * t;
            };
        },

        object: function(a, b) {
            var s = Object.keys(a);
            return function(t) {
                var i, p;
                var r = {};
                for (i = s.length - 1; i != -1; i--) {
                    p = s[i];
                    r[p] = a[p] + (b[p] - a[p]) * t;
                }
                return r;
            };
        },

        hexColor: function(a, b) {

            var ca = parseInt(a.slice(1), 16);
            var cb = parseInt(b.slice(1), 16);
            var ra = ca & 0x0000ff;
            var rd = (cb & 0x0000ff) - ra;
            var ga = ca & 0x00ff00;
            var gd = (cb & 0x00ff00) - ga;
            var ba = ca & 0xff0000;
            var bd = (cb & 0xff0000) - ba;

            return function(t) {

                var r = (ra + rd * t) & 0x000000ff;
                var g = (ga + gd * t) & 0x0000ff00;
                var b = (ba + bd * t) & 0x00ff0000;

                return '#' + (1 << 24 | r | g | b).toString(16).slice(1);
            };
        },

        unit: function(a, b) {

            var r = /(-?[0-9]*.[0-9]*)(px|em|cm|mm|in|pt|pc|%)/;
            var ma = r.exec(a);
            var mb = r.exec(b);
            var p = mb[1].indexOf('.');
            var f = p > 0 ? mb[1].length - p - 1 : 0;
            a = +ma[1];
            var d = +mb[1] - a;
            var u = ma[2];

            return function(t) {
                return (a + d * t).toFixed(f) + u;
            };
        }
    };

    // SVG filters.
    // (values in parentheses are default values)
    var filter = {

        // `color` ... outline color ('blue')
        // `width`... outline width (1)
        // `opacity` ... outline opacity (1)
        // `margin` ... gap between outline and the element (2)
        outline: function(args) {

            var tpl = '<filter><feFlood flood-color="${color}" flood-opacity="${opacity}" result="colored"/><feMorphology in="SourceAlpha" result="morphedOuter" operator="dilate" radius="${outerRadius}" /><feMorphology in="SourceAlpha" result="morphedInner" operator="dilate" radius="${innerRadius}" /><feComposite result="morphedOuterColored" in="colored" in2="morphedOuter" operator="in"/><feComposite operator="xor" in="morphedOuterColored" in2="morphedInner" result="outline"/><feMerge><feMergeNode in="outline"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';

            var margin = Number.isFinite(args.margin) ? args.margin : 2;
            var width = Number.isFinite(args.width) ? args.width : 1;

            return template(tpl)({
                color: args.color || 'blue',
                opacity: Number.isFinite(args.opacity) ? args.opacity : 1,
                outerRadius: margin + width,
                innerRadius: margin
            });
        },

        // `color` ... color ('red')
        // `width`... width (1)
        // `blur` ... blur (0)
        // `opacity` ... opacity (1)
        highlight: function(args) {

            var tpl = '<filter><feFlood flood-color="${color}" flood-opacity="${opacity}" result="colored"/><feMorphology result="morphed" in="SourceGraphic" operator="dilate" radius="${width}"/><feComposite result="composed" in="colored" in2="morphed" operator="in"/><feGaussianBlur result="blured" in="composed" stdDeviation="${blur}"/><feBlend in="SourceGraphic" in2="blured" mode="normal"/></filter>';

            return template(tpl)({
                color: args.color || 'red',
                width: Number.isFinite(args.width) ? args.width : 1,
                blur: Number.isFinite(args.blur) ? args.blur : 0,
                opacity: Number.isFinite(args.opacity) ? args.opacity : 1
            });
        },

        // `x` ... horizontal blur (2)
        // `y` ... vertical blur (optional)
        blur: function(args) {

            var x = Number.isFinite(args.x) ? args.x : 2;

            return template('<filter><feGaussianBlur stdDeviation="${stdDeviation}"/></filter>')({
                stdDeviation: Number.isFinite(args.y) ? [x, args.y] : x
            });
        },

        // `dx` ... horizontal shift (0)
        // `dy` ... vertical shift (0)
        // `blur` ... blur (4)
        // `color` ... color ('black')
        // `opacity` ... opacity (1)
        dropShadow: function(args) {

            var tpl = 'SVGFEDropShadowElement' in window
                ? '<filter><feDropShadow stdDeviation="${blur}" dx="${dx}" dy="${dy}" flood-color="${color}" flood-opacity="${opacity}"/></filter>'
                : '<filter><feGaussianBlur in="SourceAlpha" stdDeviation="${blur}"/><feOffset dx="${dx}" dy="${dy}" result="offsetblur"/><feFlood flood-color="${color}"/><feComposite in2="offsetblur" operator="in"/><feComponentTransfer><feFuncA type="linear" slope="${opacity}"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>';

            return template(tpl)({
                dx: args.dx || 0,
                dy: args.dy || 0,
                opacity: Number.isFinite(args.opacity) ? args.opacity : 1,
                color: args.color || 'black',
                blur: Number.isFinite(args.blur) ? args.blur : 4
            });
        },

        // `amount` ... the proportion of the conversion (1). A value of 1 (default) is completely grayscale. A value of 0 leaves the input unchanged.
        grayscale: function(args) {

            var amount = Number.isFinite(args.amount) ? args.amount : 1;

            return template('<filter><feColorMatrix type="matrix" values="${a} ${b} ${c} 0 0 ${d} ${e} ${f} 0 0 ${g} ${b} ${h} 0 0 0 0 0 1 0"/></filter>')({
                a: 0.2126 + 0.7874 * (1 - amount),
                b: 0.7152 - 0.7152 * (1 - amount),
                c: 0.0722 - 0.0722 * (1 - amount),
                d: 0.2126 - 0.2126 * (1 - amount),
                e: 0.7152 + 0.2848 * (1 - amount),
                f: 0.0722 - 0.0722 * (1 - amount),
                g: 0.2126 - 0.2126 * (1 - amount),
                h: 0.0722 + 0.9278 * (1 - amount)
            });
        },

        // `amount` ... the proportion of the conversion (1). A value of 1 (default) is completely sepia. A value of 0 leaves the input unchanged.
        sepia: function(args) {

            var amount = Number.isFinite(args.amount) ? args.amount : 1;

            return template('<filter><feColorMatrix type="matrix" values="${a} ${b} ${c} 0 0 ${d} ${e} ${f} 0 0 ${g} ${h} ${i} 0 0 0 0 0 1 0"/></filter>')({
                a: 0.393 + 0.607 * (1 - amount),
                b: 0.769 - 0.769 * (1 - amount),
                c: 0.189 - 0.189 * (1 - amount),
                d: 0.349 - 0.349 * (1 - amount),
                e: 0.686 + 0.314 * (1 - amount),
                f: 0.168 - 0.168 * (1 - amount),
                g: 0.272 - 0.272 * (1 - amount),
                h: 0.534 - 0.534 * (1 - amount),
                i: 0.131 + 0.869 * (1 - amount)
            });
        },

        // `amount` ... the proportion of the conversion (1). A value of 0 is completely un-saturated. A value of 1 (default) leaves the input unchanged.
        saturate: function(args) {

            var amount = Number.isFinite(args.amount) ? args.amount : 1;

            return template('<filter><feColorMatrix type="saturate" values="${amount}"/></filter>')({
                amount: 1 - amount
            });
        },

        // `angle` ...  the number of degrees around the color circle the input samples will be adjusted (0).
        hueRotate: function(args) {

            return template('<filter><feColorMatrix type="hueRotate" values="${angle}"/></filter>')({
                angle: args.angle || 0
            });
        },

        // `amount` ... the proportion of the conversion (1). A value of 1 (default) is completely inverted. A value of 0 leaves the input unchanged.
        invert: function(args) {

            var amount = Number.isFinite(args.amount) ? args.amount : 1;

            return template('<filter><feComponentTransfer><feFuncR type="table" tableValues="${amount} ${amount2}"/><feFuncG type="table" tableValues="${amount} ${amount2}"/><feFuncB type="table" tableValues="${amount} ${amount2}"/></feComponentTransfer></filter>')({
                amount: amount,
                amount2: 1 - amount
            });
        },

        // `amount` ... proportion of the conversion (1). A value of 0 will create an image that is completely black. A value of 1 (default) leaves the input unchanged.
        brightness: function(args) {

            return template('<filter><feComponentTransfer><feFuncR type="linear" slope="${amount}"/><feFuncG type="linear" slope="${amount}"/><feFuncB type="linear" slope="${amount}"/></feComponentTransfer></filter>')({
                amount: Number.isFinite(args.amount) ? args.amount : 1
            });
        },

        // `amount` ... proportion of the conversion (1). A value of 0 will create an image that is completely black. A value of 1 (default) leaves the input unchanged.
        contrast: function(args) {

            var amount = Number.isFinite(args.amount) ? args.amount : 1;

            return template('<filter><feComponentTransfer><feFuncR type="linear" slope="${amount}" intercept="${amount2}"/><feFuncG type="linear" slope="${amount}" intercept="${amount2}"/><feFuncB type="linear" slope="${amount}" intercept="${amount2}"/></feComponentTransfer></filter>')({
                amount: amount,
                amount2: .5 - amount / 2
            });
        }
    };

    var format = {

        // Formatting numbers via the Python Format Specification Mini-language.
        // See http://docs.python.org/release/3.1.3/library/string.html#format-specification-mini-language.
        // Heavilly inspired by the D3.js library implementation.
        number: function(specifier, value, locale) {

            locale = locale || {

                currency: ['$', ''],
                decimal: '.',
                thousands: ',',
                grouping: [3]
            };

            // See Python format specification mini-language: http://docs.python.org/release/3.1.3/library/string.html#format-specification-mini-language.
            // [[fill]align][sign][symbol][0][width][,][.precision][type]
            var re = /(?:([^{])?([<>=^]))?([+\- ])?([$#])?(0)?(\d+)?(,)?(\.-?\d+)?([a-z%])?/i;

            var match = re.exec(specifier);
            var fill = match[1] || ' ';
            var align = match[2] || '>';
            var sign = match[3] || '';
            var symbol = match[4] || '';
            var zfill = match[5];
            var width = +match[6];
            var comma = match[7];
            var precision = match[8];
            var type = match[9];
            var scale = 1;
            var prefix = '';
            var suffix = '';
            var integer = false;

            if (precision) { precision = +precision.substring(1); }

            if (zfill || fill === '0' && align === '=') {
                zfill = fill = '0';
                align = '=';
                if (comma) { width -= Math.floor((width - 1) / 4); }
            }

            switch (type) {
                case 'n':
                    comma = true;
                    type = 'g';
                    break;
                case '%':
                    scale = 100;
                    suffix = '%';
                    type = 'f';
                    break;
                case 'p':
                    scale = 100;
                    suffix = '%';
                    type = 'r';
                    break;
                case 'b':
                case 'o':
                case 'x':
                case 'X':
                    if (symbol === '#') { prefix = '0' + type.toLowerCase(); }
                    break;
                case 'c':
                case 'd':
                    integer = true;
                    precision = 0;
                    break;
                case 's':
                    scale = -1;
                    type = 'r';
                    break;
            }

            if (symbol === '$') {
                prefix = locale.currency[0];
                suffix = locale.currency[1];
            }

            // If no precision is specified for `'r'`, fallback to general notation.
            if (type == 'r' && !precision) { type = 'g'; }

            // Ensure that the requested precision is in the supported range.
            if (precision != null) {
                if (type == 'g') { precision = Math.max(1, Math.min(21, precision)); }
                else if (type == 'e' || type == 'f') { precision = Math.max(0, Math.min(20, precision)); }
            }

            var zcomma = zfill && comma;

            // Return the empty string for floats formatted as ints.
            if (integer && (value % 1)) { return ''; }

            // Convert negative to positive, and record the sign prefix.
            var negative = value < 0 || value === 0 && 1 / value < 0 ? (value = -value, '-') : sign;

            var fullSuffix = suffix;

            // Apply the scale, computing it from the value's exponent for si format.
            // Preserve the existing suffix, if any, such as the currency symbol.
            if (scale < 0) {
                var unit = this.prefix(value, precision);
                value = unit.scale(value);
                fullSuffix = unit.symbol + suffix;
            } else {
                value *= scale;
            }

            // Convert to the desired precision.
            value = this.convert(type, value, precision);

            // Break the value into the integer part (before) and decimal part (after).
            var i = value.lastIndexOf('.');
            var before = i < 0 ? value : value.substring(0, i);
            var after = i < 0 ? '' : locale.decimal + value.substring(i + 1);

            function formatGroup(value) {

                var i = value.length;
                var t = [];
                var j = 0;
                var g = locale.grouping[0];
                while (i > 0 && g > 0) {
                    t.push(value.substring(i -= g, i + g));
                    g = locale.grouping[j = (j + 1) % locale.grouping.length];
                }
                return t.reverse().join(locale.thousands);
            }

            // If the fill character is not `'0'`, grouping is applied before padding.
            if (!zfill && comma && locale.grouping) {

                before = formatGroup(before);
            }

            var length = prefix.length + before.length + after.length + (zcomma ? 0 : negative.length);
            var padding = length < width ? new Array(length = width - length + 1).join(fill) : '';

            // If the fill character is `'0'`, grouping is applied after padding.
            if (zcomma) { before = formatGroup(padding + before); }

            // Apply prefix.
            negative += prefix;

            // Rejoin integer and decimal parts.
            value = before + after;

            return (align === '<' ? negative + value + padding
                : align === '>' ? padding + negative + value
                    : align === '^' ? padding.substring(0, length >>= 1) + negative + value + padding.substring(length)
                        : negative + (zcomma ? value : padding + value)) + fullSuffix;
        },

        // Formatting string via the Python Format string.
        // See https://docs.python.org/2/library/string.html#format-string-syntax)
        string: function(formatString, value) {

            var fieldDelimiterIndex;
            var fieldDelimiter = '{';
            var endPlaceholder = false;
            var formattedStringArray = [];

            while ((fieldDelimiterIndex = formatString.indexOf(fieldDelimiter)) !== -1) {

                var pieceFormattedString, formatSpec, fieldName;

                pieceFormattedString = formatString.slice(0, fieldDelimiterIndex);

                if (endPlaceholder) {
                    formatSpec = pieceFormattedString.split(':');
                    fieldName = formatSpec.shift().split('.');
                    pieceFormattedString = value;

                    for (var i = 0; i < fieldName.length; i++)
                        { pieceFormattedString = pieceFormattedString[fieldName[i]]; }

                    if (formatSpec.length)
                        { pieceFormattedString = this.number(formatSpec, pieceFormattedString); }
                }

                formattedStringArray.push(pieceFormattedString);

                formatString = formatString.slice(fieldDelimiterIndex + 1);
                endPlaceholder = !endPlaceholder;
                fieldDelimiter = (endPlaceholder) ? '}' : '{';
            }
            formattedStringArray.push(formatString);

            return formattedStringArray.join('');
        },

        convert: function(type, value, precision) {

            switch (type) {
                case 'b':
                    return value.toString(2);
                case 'c':
                    return String.fromCharCode(value);
                case 'o':
                    return value.toString(8);
                case 'x':
                    return value.toString(16);
                case 'X':
                    return value.toString(16).toUpperCase();
                case 'g':
                    return value.toPrecision(precision);
                case 'e':
                    return value.toExponential(precision);
                case 'f':
                    return value.toFixed(precision);
                case 'r':
                    return (value = this.round(value, this.precision(value, precision))).toFixed(Math.max(0, Math.min(20, this.precision(value * (1 + 1e-15), precision))));
                default:
                    return value + '';
            }
        },

        round: function(value, precision) {

            return precision
                ? Math.round(value * (precision = Math.pow(10, precision))) / precision
                : Math.round(value);
        },

        precision: function(value, precision) {

            return precision - (value ? Math.ceil(Math.log(value) / Math.LN10) : 1);
        },

        prefix: function(value, precision) {

            var prefixes = ['y', 'z', 'a', 'f', 'p', 'n', 'µ', 'm', '', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'].map(function(d, i) {
                var k = Math.pow(10, Math.abs(8 - i) * 3);
                return {
                    scale: i > 8 ? function(d) {
                        return d / k;
                    } : function(d) {
                        return d * k;
                    },
                    symbol: d
                };
            });

            var i = 0;
            if (value) {
                if (value < 0) { value *= -1; }
                if (precision) { value = this.round(value, this.precision(value, precision)); }
                i = 1 + Math.floor(1e-12 + Math.log(value) / Math.LN10);
                i = Math.max(-24, Math.min(24, Math.floor((i <= 0 ? i + 1 : i - 1) / 3) * 3));
            }
            return prefixes[8 + i / 3];
        }
    };

    /*
        Pre-compile the HTML to be used as a template.
    */
    var template = function(html) {

        /*
            Must support the variation in templating syntax found here:
            https://lodash.com/docs#template
        */
        var regex = /<%= ([^ ]+) %>|\$\{ ?([^{} ]+) ?\}|\{\{([^{} ]+)\}\}/g;

        return function(data) {

            data = data || {};

            return html.replace(regex, function(match) {

                var args = Array.from(arguments);
                var attr = args.slice(1, 4).find(function(_attr) {
                    return !!_attr;
                });

                var attrArray = attr.split('.');
                var value = data[attrArray.shift()];

                while (value !== undefined && attrArray.length) {
                    value = value[attrArray.shift()];
                }

                return value !== undefined ? value : '';
            });
        };
    };

    /**
     * @param {Element} el Element, which content is intent to display in full-screen mode, 'window.top.document.body' is default.
     */
    var toggleFullScreen = function(el) {

        var topDocument = window.top.document;
        el = el || topDocument.body;

        function prefixedResult(el, prop) {

            var prefixes = ['webkit', 'moz', 'ms', 'o', ''];
            for (var i = 0; i < prefixes.length; i++) {
                var prefix = prefixes[i];
                var propName = prefix ? (prefix + prop) : (prop.substr(0, 1).toLowerCase() + prop.substr(1));
                if (el[propName] !== undefined) {
                    return isFunction(el[propName]) ? el[propName]() : el[propName];
                }
            }
        }

        if (prefixedResult(topDocument, 'FullscreenElement') || prefixedResult(topDocument, 'FullScreenElement')) {
            prefixedResult(topDocument, 'ExitFullscreen') || // Spec.
            prefixedResult(topDocument, 'CancelFullScreen'); // Firefox
        } else {
            prefixedResult(el, 'RequestFullscreen') || // Spec.
            prefixedResult(el, 'RequestFullScreen'); // Firefox
        }
    };

    // Deprecated
    // Copy all the properties to the first argument from the following arguments.
    // All the properties will be overwritten by the properties from the following
    // arguments. Inherited properties are ignored.
    var mixin = _.assign;

    // Deprecated
    // Copy all properties to the first argument from the following
    // arguments only in case if they don't exists in the first argument.
    // All the function propererties in the first argument will get
    // additional property base pointing to the extenders same named
    // property function's call method.
    var supplement = _.defaults;

    // Same as `mixin()` but deep version.
    var deepMixin = mixin;

    // Deprecated
    // Same as `supplement()` but deep version.
    var deepSupplement = _.defaultsDeep;

    // Replacements for deprecated functions
    var assign = _.assign;
    var defaults = _.defaults;
    // no better-named replacement for `deepMixin`
    var defaultsDeep = _.defaultsDeep;

    // Lodash 3 vs 4 incompatible
    var invoke = _.invokeMap || _.invoke;
    var sortedIndex = _.sortedIndexBy || _.sortedIndex;
    var uniq = _.uniqBy || _.uniq;

    var clone = _.clone;
    var cloneDeep = _.cloneDeep;
    var isEmpty = _.isEmpty;
    var isEqual = _.isEqual;
    var isFunction = _.isFunction;
    var isPlainObject = _.isPlainObject;
    var toArray = _.toArray;
    var debounce = _.debounce;
    var groupBy = _.groupBy;
    var sortBy = _.sortBy;
    var flattenDeep = _.flattenDeep;
    var without = _.without;
    var difference = _.difference;
    var intersection = _.intersection;
    var union = _.union;
    var has = _.has;
    var result = _.result;
    var omit = _.omit;
    var pick = _.pick;
    var bindAll = _.bindAll;
    var forIn = _.forIn;
    var camelCase = _.camelCase;
    var uniqueId = _.uniqueId;

    var merge = function() {
        if (_.mergeWith) {
            var args = Array.from(arguments);
            var last = args[args.length - 1];

            var customizer = isFunction(last) ? last : noop;
            args.push(function(a, b) {
                var customResult = customizer(a, b);
                if (customResult !== undefined) {
                    return customResult;
                }

                if (Array.isArray(a) && !Array.isArray(b)) {
                    return b;
                }
            });

            return _.mergeWith.apply(this, args);
        }
        return _.merge.apply(this, arguments);
    };

    var isBoolean = function(value) {
        var toString = Object.prototype.toString;
        return value === true || value === false || (!!value && typeof value === 'object' && toString.call(value) === '[object Boolean]');
    };

    var isObject = function(value) {
        return !!value && (typeof value === 'object' || typeof value === 'function');
    };

    var isNumber = function(value) {
        var toString = Object.prototype.toString;
        return typeof value === 'number' || (!!value && typeof value === 'object' && toString.call(value) === '[object Number]');
    };

    var isString = function(value) {
        var toString = Object.prototype.toString;
        return typeof value === 'string' || (!!value && typeof value === 'object' && toString.call(value) === '[object String]');
    };

    var noop = function() {
    };

    // Clone `cells` returning an object that maps the original cell ID to the clone. The number
    // of clones is exactly the same as the `cells.length`.
    // This function simply clones all the `cells`. However, it also reconstructs
    // all the `source/target` and `parent/embed` references within the `cells`.
    // This is the main difference from the `cell.clone()` method. The
    // `cell.clone()` method works on one single cell only.
    // For example, for a graph: `A --- L ---> B`, `cloneCells([A, L, B])`
    // returns `[A2, L2, B2]` resulting to a graph: `A2 --- L2 ---> B2`, i.e.
    // the source and target of the link `L2` is changed to point to `A2` and `B2`.
    function cloneCells(cells) {

        cells = uniq(cells);

        // A map of the form [original cell ID] -> [clone] helping
        // us to reconstruct references for source/target and parent/embeds.
        // This is also the returned value.
        var cloneMap = toArray(cells).reduce(function(map, cell) {
            map[cell.id] = cell.clone();
            return map;
        }, {});

        toArray(cells).forEach(function(cell) {

            var clone$$1 = cloneMap[cell.id];
            // assert(clone exists)

            if (clone$$1.isLink()) {
                var source = clone$$1.source();
                var target = clone$$1.target();
                if (source.id && cloneMap[source.id]) {
                    // Source points to an element and the element is among the clones.
                    // => Update the source of the cloned link.
                    clone$$1.prop('source/id', cloneMap[source.id].id);
                }
                if (target.id && cloneMap[target.id]) {
                    // Target points to an element and the element is among the clones.
                    // => Update the target of the cloned link.
                    clone$$1.prop('target/id', cloneMap[target.id].id);
                }
            }

            // Find the parent of the original cell
            var parent = cell.get('parent');
            if (parent && cloneMap[parent]) {
                clone$$1.set('parent', cloneMap[parent].id);
            }

            // Find the embeds of the original cell
            var embeds = toArray(cell.get('embeds')).reduce(function(newEmbeds, embed) {
                // Embedded cells that are not being cloned can not be carried
                // over with other embedded cells.
                if (cloneMap[embed]) {
                    newEmbeds.push(cloneMap[embed].id);
                }
                return newEmbeds;
            }, []);

            if (!isEmpty(embeds)) {
                clone$$1.set('embeds', embeds);
            }
        });

        return cloneMap;
    }

    function setWrapper(attrName, dimension) {
        return function(value, refBBox) {
            var isValuePercentage = isPercentage(value);
            value = parseFloat(value);
            if (isValuePercentage) {
                value /= 100;
            }

            var attrs = {};
            if (isFinite(value)) {
                var attrValue = (isValuePercentage || value >= 0 && value <= 1)
                    ? value * refBBox[dimension]
                    : Math.max(value + refBBox[dimension], 0);
                attrs[attrName] = attrValue;
            }

            return attrs;
        };
    }

    function positionWrapper(axis, dimension, origin) {
        return function(value, refBBox) {
            var valuePercentage = isPercentage(value);
            value = parseFloat(value);
            if (valuePercentage) {
                value /= 100;
            }

            var delta;
            if (isFinite(value)) {
                var refOrigin = refBBox[origin]();
                if (valuePercentage || value > 0 && value < 1) {
                    delta = refOrigin[axis] + refBBox[dimension] * value;
                } else {
                    delta = refOrigin[axis] + value;
                }
            }

            var point$$1 = Point();
            point$$1[axis] = delta || 0;
            return point$$1;
        };
    }

    function offsetWrapper(axis, dimension, corner) {
        return function(value, nodeBBox) {
            var delta;
            if (value === 'middle') {
                delta = nodeBBox[dimension] / 2;
            } else if (value === corner) {
                delta = nodeBBox[dimension];
            } else if (isFinite(value)) {
                // TODO: or not to do a breaking change?
                delta = (value > -1 && value < 1) ? (-nodeBBox[dimension] * value) : -value;
            } else if (isPercentage(value)) {
                delta = nodeBBox[dimension] * parseFloat(value) / 100;
            } else {
                delta = 0;
            }

            var point$$1 = Point();
            point$$1[axis] = -(nodeBBox[axis] + delta);
            return point$$1;
        };
    }

    function shapeWrapper(shapeConstructor, opt) {
        var cacheName = 'joint-shape';
        var resetOffset = opt && opt.resetOffset;
        return function(value, refBBox, node) {
            var $node = $(node);
            var cache = $node.data(cacheName);
            if (!cache || cache.value !== value) {
                // only recalculate if value has changed
                var cachedShape = shapeConstructor(value);
                cache = {
                    value: value,
                    shape: cachedShape,
                    shapeBBox: cachedShape.bbox()
                };
                $node.data(cacheName, cache);
            }

            var shape = cache.shape.clone();
            var shapeBBox = cache.shapeBBox.clone();
            var shapeOrigin = shapeBBox.origin();
            var refOrigin = refBBox.origin();

            shapeBBox.x = refOrigin.x;
            shapeBBox.y = refOrigin.y;

            var fitScale = refBBox.maxRectScaleToFit(shapeBBox, refOrigin);
            // `maxRectScaleToFit` can give Infinity if width or height is 0
            var sx = (shapeBBox.width === 0 || refBBox.width === 0) ? 1 : fitScale.sx;
            var sy = (shapeBBox.height === 0 || refBBox.height === 0) ? 1 : fitScale.sy;

            shape.scale(sx, sy, shapeOrigin);
            if (resetOffset) {
                shape.translate(-shapeOrigin.x, -shapeOrigin.y);
            }

            return shape;
        };
    }

    // `d` attribute for SVGPaths
    function dWrapper(opt) {
        function pathConstructor(value) {
            return new Path(V.normalizePathData(value));
        }

        var shape = shapeWrapper(pathConstructor, opt);
        return function(value, refBBox, node) {
            var path = shape(value, refBBox, node);
            return {
                d: path.serialize()
            };
        };
    }

    // `points` attribute for SVGPolylines and SVGPolygons
    function pointsWrapper(opt) {
        var shape = shapeWrapper(Polyline, opt);
        return function(value, refBBox, node) {
            var polyline = shape(value, refBBox, node);
            return {
                points: polyline.serialize()
            };
        };
    }

    function atConnectionWrapper(method, opt) {
        var zeroVector = new Point(1, 0);
        return function(value) {
            var p, angle;
            var tangent = this[method](value);
            if (tangent) {
                angle = (opt.rotate) ? tangent.vector().vectorAngle(zeroVector) : 0;
                p = tangent.start;
            } else {
                p = this.path.start;
                angle = 0;
            }
            if (angle === 0) { return { transform: 'translate(' + p.x + ',' + p.y + ')' }; }
            return { transform: 'translate(' + p.x + ',' + p.y + ') rotate(' + angle + ')' };
        };
    }

    function isTextInUse(lineHeight, node, attrs) {
        return (attrs.text !== undefined);
    }

    function isLinkView() {
        return this.model.isLink();
    }

    function contextMarker(context) {
        var marker = {};
        // Stroke
        // The context 'fill' is disregared here. The usual case is to use the marker with a connection
        // (for which 'fill' attribute is set to 'none').
        var stroke = context.stroke;
        if (typeof stroke === 'string') {
            marker['stroke'] = stroke;
            marker['fill'] = stroke;
        }
        // Opacity
        // Again the context 'fill-opacity' is ignored.
        var strokeOpacity = context.strokeOpacity;
        if (strokeOpacity === undefined) { strokeOpacity = context['stroke-opacity']; }
        if (strokeOpacity === undefined) { strokeOpacity = context.opacity; }
        if (strokeOpacity !== undefined) {
            marker['stroke-opacity'] = strokeOpacity;
            marker['fill-opacity'] = strokeOpacity;
        }
        return marker;
    }

    var attributesNS = {

        xlinkHref: {
            set: 'xlink:href'
        },

        xlinkShow: {
            set: 'xlink:show'
        },

        xlinkRole: {
            set: 'xlink:role'
        },

        xlinkType: {
            set: 'xlink:type'
        },

        xlinkArcrole: {
            set: 'xlink:arcrole'
        },

        xlinkTitle: {
            set: 'xlink:title'
        },

        xlinkActuate: {
            set: 'xlink:actuate'
        },

        xmlSpace: {
            set: 'xml:space'
        },

        xmlBase: {
            set: 'xml:base'
        },

        xmlLang: {
            set: 'xml:lang'
        },

        preserveAspectRatio: {
            set: 'preserveAspectRatio'
        },

        requiredExtension: {
            set: 'requiredExtension'
        },

        requiredFeatures: {
            set: 'requiredFeatures'
        },

        systemLanguage: {
            set: 'systemLanguage'
        },

        externalResourcesRequired: {
            set: 'externalResourceRequired'
        },

        filter: {
            qualify: isPlainObject,
            set: function(filter$$1) {
                return 'url(#' + this.paper.defineFilter(filter$$1) + ')';
            }
        },

        fill: {
            qualify: isPlainObject,
            set: function(fill) {
                return 'url(#' + this.paper.defineGradient(fill) + ')';
            }
        },

        stroke: {
            qualify: isPlainObject,
            set: function(stroke) {
                return 'url(#' + this.paper.defineGradient(stroke) + ')';
            }
        },

        sourceMarker: {
            qualify: isPlainObject,
            set: function(marker, refBBox, node, attrs) {
                marker = assign(contextMarker(attrs), marker);
                return { 'marker-start': 'url(#' + this.paper.defineMarker(marker) + ')' };
            }
        },

        targetMarker: {
            qualify: isPlainObject,
            set: function(marker, refBBox, node, attrs) {
                marker = assign(contextMarker(attrs), { 'transform': 'rotate(180)' }, marker);
                return { 'marker-end': 'url(#' + this.paper.defineMarker(marker) + ')' };
            }
        },

        vertexMarker: {
            qualify: isPlainObject,
            set: function(marker, refBBox, node, attrs) {
                marker = assign(contextMarker(attrs), marker);
                return { 'marker-mid': 'url(#' + this.paper.defineMarker(marker) + ')' };
            }
        },

        text: {
            qualify: function(text, node, attrs) {
                return !attrs.textWrap || !isPlainObject(attrs.textWrap);
            },
            set: function(text, refBBox, node, attrs) {
                var $node = $(node);
                var cacheName = 'joint-text';
                var cache = $node.data(cacheName);
                var textAttrs = pick(attrs, 'lineHeight', 'annotations', 'textPath', 'x', 'textVerticalAnchor', 'eol');
                var fontSize = textAttrs.fontSize = attrs['font-size'] || attrs['fontSize'];
                var textHash = JSON.stringify([text, textAttrs]);
                // Update the text only if there was a change in the string
                // or any of its attributes.
                if (cache === undefined || cache !== textHash) {
                    // Chrome bug:
                    // Tspans positions defined as `em` are not updated
                    // when container `font-size` change.
                    if (fontSize) { node.setAttribute('font-size', fontSize); }
                    // Text Along Path Selector
                    var textPath = textAttrs.textPath;
                    if (isObject(textPath)) {
                        var pathSelector = textPath.selector;
                        if (typeof pathSelector === 'string') {
                            var pathNode = this.findBySelector(pathSelector)[0];
                            if (pathNode instanceof SVGPathElement) {
                                textAttrs.textPath = assign({ 'xlink:href': '#' + pathNode.id }, textPath);
                            }
                        }
                    }
                    V(node).text('' + text, textAttrs);
                    $node.data(cacheName, textHash);
                }
            }
        },

        textWrap: {
            qualify: isPlainObject,
            set: function(value, refBBox, node, attrs) {
                // option `width`
                var width = value.width || 0;
                if (isPercentage(width)) {
                    refBBox.width *= parseFloat(width) / 100;
                } else if (width <= 0) {
                    refBBox.width += width;
                } else {
                    refBBox.width = width;
                }
                // option `height`
                var height = value.height || 0;
                if (isPercentage(height)) {
                    refBBox.height *= parseFloat(height) / 100;
                } else if (height <= 0) {
                    refBBox.height += height;
                } else {
                    refBBox.height = height;
                }
                // option `text`
                var wrappedText;
                var text = value.text;
                if (text === undefined) { text = attrs.text; }
                if (text !== undefined) {
                    wrappedText = breakText('' + text, refBBox, {
                        'font-weight': attrs['font-weight'] || attrs.fontWeight,
                        'font-size': attrs['font-size'] || attrs.fontSize,
                        'font-family': attrs['font-family'] || attrs.fontFamily,
                        'lineHeight': attrs.lineHeight
                    }, {
                        // Provide an existing SVG Document here
                        // instead of creating a temporary one over again.
                        svgDocument: this.paper.svg,
                        ellipsis: value.ellipsis,
                        hyphen: value.hyphen
                    });
                } else {
                    wrappedText = '';
                }
                attributesNS.text.set.call(this, wrappedText, refBBox, node, attrs);
            }
        },

        title: {
            qualify: function(title, node) {
                // HTMLElement title is specified via an attribute (i.e. not an element)
                return node instanceof SVGElement;
            },
            set: function(title, refBBox, node) {
                var $node = $(node);
                var cacheName = 'joint-title';
                var cache = $node.data(cacheName);
                if (cache === undefined || cache !== title) {
                    $node.data(cacheName, title);
                    // Generally <title> element should be the first child element of its parent.
                    var firstChild = node.firstChild;
                    if (firstChild && firstChild.tagName.toUpperCase() === 'TITLE') {
                        // Update an existing title
                        firstChild.textContent = title;
                    } else {
                        // Create a new title
                        var titleNode = document.createElementNS(node.namespaceURI, 'title');
                        titleNode.textContent = title;
                        node.insertBefore(titleNode, firstChild);
                    }
                }
            }
        },

        lineHeight: {
            qualify: isTextInUse
        },

        textVerticalAnchor: {
            qualify: isTextInUse
        },

        textPath: {
            qualify: isTextInUse
        },

        annotations: {
            qualify: isTextInUse
        },

        // `port` attribute contains the `id` of the port that the underlying magnet represents.
        port: {
            set: function(port) {
                return (port === null || port.id === undefined) ? port : port.id;
            }
        },

        // `style` attribute is special in the sense that it sets the CSS style of the subelement.
        style: {
            qualify: isPlainObject,
            set: function(styles, refBBox, node) {
                $(node).css(styles);
            }
        },

        html: {
            set: function(html, refBBox, node) {
                $(node).html(html + '');
            }
        },

        ref: {
            // We do not set `ref` attribute directly on an element.
            // The attribute itself does not qualify for relative positioning.
        },

        // if `refX` is in [0, 1] then `refX` is a fraction of bounding box width
        // if `refX` is < 0 then `refX`'s absolute values is the right coordinate of the bounding box
        // otherwise, `refX` is the left coordinate of the bounding box

        refX: {
            position: positionWrapper('x', 'width', 'origin')
        },

        refY: {
            position: positionWrapper('y', 'height', 'origin')
        },

        // `ref-dx` and `ref-dy` define the offset of the subelement relative to the right and/or bottom
        // coordinate of the reference element.

        refDx: {
            position: positionWrapper('x', 'width', 'corner')
        },

        refDy: {
            position: positionWrapper('y', 'height', 'corner')
        },

        // 'ref-width'/'ref-height' defines the width/height of the subelement relatively to
        // the reference element size
        // val in 0..1         ref-width = 0.75 sets the width to 75% of the ref. el. width
        // val < 0 || val > 1  ref-height = -20 sets the height to the ref. el. height shorter by 20

        refWidth: {
            set: setWrapper('width', 'width')
        },

        refHeight: {
            set: setWrapper('height', 'height')
        },

        refRx: {
            set: setWrapper('rx', 'width')
        },

        refRy: {
            set: setWrapper('ry', 'height')
        },

        refRInscribed: {
            set: (function(attrName) {
                var widthFn = setWrapper(attrName, 'width');
                var heightFn = setWrapper(attrName, 'height');
                return function(value, refBBox) {
                    var fn = (refBBox.height > refBBox.width) ? widthFn : heightFn;
                    return fn(value, refBBox);
                };
            })('r')
        },

        refRCircumscribed: {
            set: function(value, refBBox) {
                var isValuePercentage = isPercentage(value);
                value = parseFloat(value);
                if (isValuePercentage) {
                    value /= 100;
                }

                var diagonalLength = Math.sqrt((refBBox.height * refBBox.height) + (refBBox.width * refBBox.width));

                var rValue;
                if (isFinite(value)) {
                    if (isValuePercentage || value >= 0 && value <= 1) { rValue = value * diagonalLength; }
                    else { rValue = Math.max(value + diagonalLength, 0); }
                }

                return { r: rValue };
            }
        },

        refCx: {
            set: setWrapper('cx', 'width')
        },

        refCy: {
            set: setWrapper('cy', 'height')
        },

        // `x-alignment` when set to `middle` causes centering of the subelement around its new x coordinate.
        // `x-alignment` when set to `right` uses the x coordinate as referenced to the right of the bbox.

        xAlignment: {
            offset: offsetWrapper('x', 'width', 'right')
        },

        // `y-alignment` when set to `middle` causes centering of the subelement around its new y coordinate.
        // `y-alignment` when set to `bottom` uses the y coordinate as referenced to the bottom of the bbox.

        yAlignment: {
            offset: offsetWrapper('y', 'height', 'bottom')
        },

        resetOffset: {
            offset: function(val, nodeBBox) {
                return (val)
                    ? { x: -nodeBBox.x, y: -nodeBBox.y }
                    : { x: 0, y: 0 };
            }

        },

        refDResetOffset: {
            set: dWrapper({ resetOffset: true })
        },

        refDKeepOffset: {
            set: dWrapper({ resetOffset: false })
        },

        refPointsResetOffset: {
            set: pointsWrapper({ resetOffset: true })
        },

        refPointsKeepOffset: {
            set: pointsWrapper({ resetOffset: false })
        },

        // LinkView Attributes

        connection: {
            qualify: isLinkView,
            set: function() {
                return { d: this.getSerializedConnection() };
            }
        },

        atConnectionLengthKeepGradient: {
            qualify: isLinkView,
            set: atConnectionWrapper('getTangentAtLength', { rotate: true })
        },

        atConnectionLengthIgnoreGradient: {
            qualify: isLinkView,
            set: atConnectionWrapper('getTangentAtLength', { rotate: false })
        },

        atConnectionRatioKeepGradient: {
            qualify: isLinkView,
            set: atConnectionWrapper('getTangentAtRatio', { rotate: true })
        },

        atConnectionRatioIgnoreGradient: {
            qualify: isLinkView,
            set: atConnectionWrapper('getTangentAtRatio', { rotate: false })
        }
    };

    // Aliases
    attributesNS.refR = attributesNS.refRInscribed;
    attributesNS.refD = attributesNS.refDResetOffset;
    attributesNS.refPoints = attributesNS.refPointsResetOffset;
    attributesNS.atConnectionLength = attributesNS.atConnectionLengthKeepGradient;
    attributesNS.atConnectionRatio = attributesNS.atConnectionRatioKeepGradient;

    // This allows to combine both absolute and relative positioning
    // refX: 50%, refX2: 20
    attributesNS.refX2 = attributesNS.refX;
    attributesNS.refY2 = attributesNS.refY;
    attributesNS.refWidth2 = attributesNS.refWidth;
    attributesNS.refHeight2 = attributesNS.refHeight;

    // Aliases for backwards compatibility
    attributesNS['ref-x'] = attributesNS.refX;
    attributesNS['ref-y'] = attributesNS.refY;
    attributesNS['ref-dy'] = attributesNS.refDy;
    attributesNS['ref-dx'] = attributesNS.refDx;
    attributesNS['ref-width'] = attributesNS.refWidth;
    attributesNS['ref-height'] = attributesNS.refHeight;
    attributesNS['x-alignment'] = attributesNS.xAlignment;
    attributesNS['y-alignment'] = attributesNS.yAlignment;

    var attributes = attributesNS;

    // Cell base model.
    // --------------------------

    var Cell = Backbone.Model.extend({

        // This is the same as Backbone.Model with the only difference that is uses util.merge
        // instead of just _.extend. The reason is that we want to mixin attributes set in upper classes.
        constructor: function(attributes$$1, options) {

            var defaults$$1;
            var attrs = attributes$$1 || {};
            this.cid = uniqueId('c');
            this.attributes = {};
            if (options && options.collection) { this.collection = options.collection; }
            if (options && options.parse) { attrs = this.parse(attrs, options) || {}; }
            if ((defaults$$1 = result(this, 'defaults'))) {
                //<custom code>
                // Replaced the call to _.defaults with util.merge.
                attrs = merge({}, defaults$$1, attrs);
                //</custom code>
            }
            this.set(attrs, options);
            this.changed = {};
            this.initialize.apply(this, arguments);
        },

        translate: function(dx, dy, opt) {

            throw new Error('Must define a translate() method.');
        },

        toJSON: function() {

            var defaultAttrs = this.constructor.prototype.defaults.attrs || {};
            var attrs = this.attributes.attrs;
            var finalAttrs = {};

            // Loop through all the attributes and
            // omit the default attributes as they are implicitly reconstructable by the cell 'type'.
            forIn(attrs, function(attr, selector) {

                var defaultAttr = defaultAttrs[selector];

                forIn(attr, function(value, name) {

                    // attr is mainly flat though it might have one more level (consider the `style` attribute).
                    // Check if the `value` is object and if yes, go one level deep.
                    if (isObject(value) && !Array.isArray(value)) {

                        forIn(value, function(value2, name2) {

                            if (!defaultAttr || !defaultAttr[name] || !isEqual(defaultAttr[name][name2], value2)) {

                                finalAttrs[selector] = finalAttrs[selector] || {};
                                (finalAttrs[selector][name] || (finalAttrs[selector][name] = {}))[name2] = value2;
                            }
                        });

                    } else if (!defaultAttr || !isEqual(defaultAttr[name], value)) {
                        // `value` is not an object, default attribute for such a selector does not exist
                        // or it is different than the attribute value set on the model.

                        finalAttrs[selector] = finalAttrs[selector] || {};
                        finalAttrs[selector][name] = value;
                    }
                });
            });

            var attributes$$1 = cloneDeep(omit(this.attributes, 'attrs'));
            attributes$$1.attrs = finalAttrs;

            return attributes$$1;
        },

        initialize: function(options) {

            if (!options || !options.id) {

                this.set('id', this.generateId(), { silent: true });
            }

            this._transitionIds = {};

            // Collect ports defined in `attrs` and keep collecting whenever `attrs` object changes.
            this.processPorts();
            this.on('change:attrs', this.processPorts, this);
        },

        generateId: function() {
            return uuid();
        },

        /**
         * @deprecated
         */
        processPorts: function() {

            // Whenever `attrs` changes, we extract ports from the `attrs` object and store it
            // in a more accessible way. Also, if any port got removed and there were links that had `target`/`source`
            // set to that port, we remove those links as well (to follow the same behaviour as
            // with a removed element).

            var previousPorts = this.ports;

            // Collect ports from the `attrs` object.
            var ports = {};
            forIn(this.get('attrs'), function(attrs, selector) {

                if (attrs && attrs.port) {

                    // `port` can either be directly an `id` or an object containing an `id` (and potentially other data).
                    if (attrs.port.id !== undefined) {
                        ports[attrs.port.id] = attrs.port;
                    } else {
                        ports[attrs.port] = { id: attrs.port };
                    }
                }
            });

            // Collect ports that have been removed (compared to the previous ports) - if any.
            // Use hash table for quick lookup.
            var removedPorts = {};
            forIn(previousPorts, function(port, id) {

                if (!ports[id]) { removedPorts[id] = true; }
            });

            // Remove all the incoming/outgoing links that have source/target port set to any of the removed ports.
            if (this.graph && !isEmpty(removedPorts)) {

                var inboundLinks = this.graph.getConnectedLinks(this, { inbound: true });
                inboundLinks.forEach(function(link) {

                    if (removedPorts[link.get('target').port]) { link.remove(); }
                });

                var outboundLinks = this.graph.getConnectedLinks(this, { outbound: true });
                outboundLinks.forEach(function(link) {

                    if (removedPorts[link.get('source').port]) { link.remove(); }
                });
            }

            // Update the `ports` object.
            this.ports = ports;
        },

        remove: function(opt) {

            opt = opt || {};

            // Store the graph in a variable because `this.graph` won't' be accessbile after `this.trigger('remove', ...)` down below.
            var graph = this.graph;
            if (!graph) {
                // The collection is a common backbone collection (not the graph collection).
                if (this.collection) { this.collection.remove(this, opt); }
                return this;
            }

            graph.startBatch('remove');

            // First, unembed this cell from its parent cell if there is one.
            var parentCell = this.getParentCell();
            if (parentCell) { parentCell.unembed(this); }

            // Remove also all the cells, which were embedded into this cell
            var embeddedCells = this.getEmbeddedCells();
            for (var i = 0, n = embeddedCells.length; i < n; i++) {
                var embed = embeddedCells[i];
                if (embed) { embed.remove(opt); }
            }

            this.trigger('remove', this, graph.attributes.cells, opt);

            graph.stopBatch('remove');

            return this;
        },

        toFront: function(opt) {

            var graph = this.graph;
            if (graph) {

                opt = opt || {};

                var z = graph.maxZIndex();

                var cells;

                if (opt.deep) {
                    cells = this.getEmbeddedCells({ deep: true, breadthFirst: true });
                    cells.unshift(this);
                } else {
                    cells = [this];
                }

                z = z - cells.length + 1;

                var collection = graph.get('cells');
                var shouldUpdate = (collection.indexOf(this) !== (collection.length - cells.length));
                if (!shouldUpdate) {
                    shouldUpdate = cells.some(function(cell, index) {
                        return cell.get('z') !== z + index;
                    });
                }

                if (shouldUpdate) {
                    this.startBatch('to-front');

                    z = z + cells.length;

                    cells.forEach(function(cell, index) {
                        cell.set('z', z + index, opt);
                    });

                    this.stopBatch('to-front');
                }
            }

            return this;
        },

        toBack: function(opt) {

            var graph = this.graph;
            if (graph) {

                opt = opt || {};

                var z = graph.minZIndex();

                var cells;

                if (opt.deep) {
                    cells = this.getEmbeddedCells({ deep: true, breadthFirst: true });
                    cells.unshift(this);
                } else {
                    cells = [this];
                }

                var collection = graph.get('cells');
                var shouldUpdate = (collection.indexOf(this) !== 0);
                if (!shouldUpdate) {
                    shouldUpdate = cells.some(function(cell, index) {
                        return cell.get('z') !== z + index;
                    });
                }

                if (shouldUpdate) {
                    this.startBatch('to-back');

                    z -= cells.length;

                    cells.forEach(function(cell, index) {
                        cell.set('z', z + index, opt);
                    });

                    this.stopBatch('to-back');
                }
            }

            return this;
        },

        parent: function(parent, opt) {

            // getter
            if (parent === undefined) { return this.get('parent'); }
            // setter
            return this.set('parent', parent, opt);
        },

        embed: function(cell, opt) {

            if (this === cell || this.isEmbeddedIn(cell)) {

                throw new Error('Recursive embedding not allowed.');

            } else {

                this.startBatch('embed');

                var embeds = assign([], this.get('embeds'));

                // We keep all element ids after link ids.
                embeds[cell.isLink() ? 'unshift' : 'push'](cell.id);

                cell.parent(this.id, opt);
                this.set('embeds', uniq(embeds), opt);

                this.stopBatch('embed');
            }

            return this;
        },

        unembed: function(cell, opt) {

            this.startBatch('unembed');

            cell.unset('parent', opt);
            this.set('embeds', without(this.get('embeds'), cell.id), opt);

            this.stopBatch('unembed');

            return this;
        },

        getParentCell: function() {

            // unlike link.source/target, cell.parent stores id directly as a string
            var parentId = this.parent();
            var graph = this.graph;

            return (parentId && graph && graph.getCell(parentId)) || null;
        },

        // Return an array of ancestor cells.
        // The array is ordered from the parent of the cell
        // to the most distant ancestor.
        getAncestors: function() {

            var ancestors = [];

            if (!this.graph) {
                return ancestors;
            }

            var parentCell = this.getParentCell();
            while (parentCell) {
                ancestors.push(parentCell);
                parentCell = parentCell.getParentCell();
            }

            return ancestors;
        },

        getEmbeddedCells: function(opt) {

            opt = opt || {};

            // Cell models can only be retrieved when this element is part of a collection.
            // There is no way this element knows about other cells otherwise.
            // This also means that calling e.g. `translate()` on an element with embeds before
            // adding it to a graph does not translate its embeds.
            if (this.graph) {

                var cells;

                if (opt.deep) {

                    if (opt.breadthFirst) {

                        // breadthFirst algorithm
                        cells = [];
                        var queue = this.getEmbeddedCells();

                        while (queue.length > 0) {

                            var parent = queue.shift();
                            cells.push(parent);
                            queue.push.apply(queue, parent.getEmbeddedCells());
                        }

                    } else {

                        // depthFirst algorithm
                        cells = this.getEmbeddedCells();
                        cells.forEach(function(cell) {
                            cells.push.apply(cells, cell.getEmbeddedCells(opt));
                        });
                    }

                } else {

                    cells = toArray(this.get('embeds')).map(this.graph.getCell, this.graph);
                }

                return cells;
            }
            return [];
        },

        isEmbeddedIn: function(cell, opt) {

            var cellId = isString(cell) ? cell : cell.id;
            var parentId = this.parent();

            opt = defaults({ deep: true }, opt);

            // See getEmbeddedCells().
            if (this.graph && opt.deep) {

                while (parentId) {
                    if (parentId === cellId) {
                        return true;
                    }
                    parentId = this.graph.getCell(parentId).parent();
                }

                return false;

            } else {

                // When this cell is not part of a collection check
                // at least whether it's a direct child of given cell.
                return parentId === cellId;
            }
        },

        // Whether or not the cell is embedded in any other cell.
        isEmbedded: function() {

            return !!this.parent();
        },

        // Isolated cloning. Isolated cloning has two versions: shallow and deep (pass `{ deep: true }` in `opt`).
        // Shallow cloning simply clones the cell and returns a new cell with different ID.
        // Deep cloning clones the cell and all its embedded cells recursively.
        clone: function(opt) {

            opt = opt || {};

            if (!opt.deep) {
                // Shallow cloning.

                var clone$$1 = Backbone.Model.prototype.clone.apply(this, arguments);
                // We don't want the clone to have the same ID as the original.
                clone$$1.set('id', this.generateId());
                // A shallow cloned element does not carry over the original embeds.
                clone$$1.unset('embeds');
                // And can not be embedded in any cell
                // as the clone is not part of the graph.
                clone$$1.unset('parent');

                return clone$$1;

            } else {
                // Deep cloning.

                // For a deep clone, simply call `graph.cloneCells()` with the cell and all its embedded cells.
                return toArray(cloneCells([this].concat(this.getEmbeddedCells({ deep: true }))));
            }
        },

        // A convenient way to set nested properties.
        // This method merges the properties you'd like to set with the ones
        // stored in the cell and makes sure change events are properly triggered.
        // You can either set a nested property with one object
        // or use a property path.
        // The most simple use case is:
        // `cell.prop('name/first', 'John')` or
        // `cell.prop({ name: { first: 'John' } })`.
        // Nested arrays are supported too:
        // `cell.prop('series/0/data/0/degree', 50)` or
        // `cell.prop({ series: [ { data: [ { degree: 50 } ] } ] })`.
        prop: function(props, value, opt) {

            var delim = '/';
            var _isString = isString(props);

            if (_isString || Array.isArray(props)) {
                // Get/set an attribute by a special path syntax that delimits
                // nested objects by the colon character.

                if (arguments.length > 1) {

                    var path;
                    var pathArray;

                    if (_isString) {
                        path = props;
                        pathArray = path.split('/');
                    } else {
                        path = props.join(delim);
                        pathArray = props.slice();
                    }

                    var property = pathArray[0];
                    var pathArrayLength = pathArray.length;

                    opt = opt || {};
                    opt.propertyPath = path;
                    opt.propertyValue = value;
                    opt.propertyPathArray = pathArray;

                    if (pathArrayLength === 1) {
                        // Property is not nested. We can simply use `set()`.
                        return this.set(property, value, opt);
                    }

                    var update = {};
                    // Initialize the nested object. Subobjects are either arrays or objects.
                    // An empty array is created if the sub-key is an integer. Otherwise, an empty object is created.
                    // Note that this imposes a limitation on object keys one can use with Inspector.
                    // Pure integer keys will cause issues and are therefore not allowed.
                    var initializer = update;
                    var prevProperty = property;

                    for (var i = 1; i < pathArrayLength; i++) {
                        var pathItem = pathArray[i];
                        var isArrayIndex = Number.isFinite(_isString ? Number(pathItem) : pathItem);
                        initializer = initializer[prevProperty] = isArrayIndex ? [] : {};
                        prevProperty = pathItem;
                    }

                    // Fill update with the `value` on `path`.
                    update = setByPath(update, pathArray, value, '/');

                    var baseAttributes = merge({}, this.attributes);
                    // if rewrite mode enabled, we replace value referenced by path with
                    // the new one (we don't merge).
                    opt.rewrite && unsetByPath(baseAttributes, path, '/');

                    // Merge update with the model attributes.
                    var attributes$$1 = merge(baseAttributes, update);
                    // Finally, set the property to the updated attributes.
                    return this.set(property, attributes$$1[property], opt);

                } else {

                    return getByPath(this.attributes, props, delim);
                }
            }

            return this.set(merge({}, this.attributes, props), value);
        },

        // A convenient way to unset nested properties
        removeProp: function(path, opt) {

            opt = opt || {};

            var pathArray = Array.isArray(path) ? path : path.split('/');

            // Once a property is removed from the `attrs` attribute
            // the cellView will recognize a `dirty` flag and re-render itself
            // in order to remove the attribute from SVG element.
            var property = pathArray[0];
            if (property === 'attrs') { opt.dirty = true; }

            if (pathArray.length === 1) {
                // A top level property
                return this.unset(path, opt);
            }

            // A nested property
            var nestedPath = pathArray.slice(1);
            var propertyValue = cloneDeep(this.get(property));

            unsetByPath(propertyValue, nestedPath, '/');

            return this.set(property, propertyValue, opt);
        },

        // A convenient way to set nested attributes.
        attr: function(attrs, value, opt) {

            var args = Array.from(arguments);
            if (args.length === 0) {
                return this.get('attrs');
            }

            if (Array.isArray(attrs)) {
                args[0] = ['attrs'].concat(attrs);
            } else if (isString(attrs)) {
                // Get/set an attribute by a special path syntax that delimits
                // nested objects by the colon character.
                args[0] = 'attrs/' + attrs;

            } else {

                args[0] = { 'attrs' : attrs };
            }

            return this.prop.apply(this, args);
        },

        // A convenient way to unset nested attributes
        removeAttr: function(path, opt) {

            if (Array.isArray(path)) {

                return this.removeProp(['attrs'].concat(path));
            }

            return this.removeProp('attrs/' + path, opt);
        },

        transition: function(path, value, opt, delim) {

            delim = delim || '/';

            var defaults$$1 = {
                duration: 100,
                delay: 10,
                timingFunction: timing.linear,
                valueFunction: interpolate.number
            };

            opt = assign(defaults$$1, opt);

            var firstFrameTime = 0;
            var interpolatingFunction;

            var setter = function(runtime) {

                var id, progress, propertyValue;

                firstFrameTime = firstFrameTime || runtime;
                runtime -= firstFrameTime;
                progress = runtime / opt.duration;

                if (progress < 1) {
                    this._transitionIds[path] = id = nextFrame(setter);
                } else {
                    progress = 1;
                    delete this._transitionIds[path];
                }

                propertyValue = interpolatingFunction(opt.timingFunction(progress));

                opt.transitionId = id;

                this.prop(path, propertyValue, opt);

                if (!id) { this.trigger('transition:end', this, path); }

            }.bind(this);

            var initiator = function(callback) {

                this.stopTransitions(path);

                interpolatingFunction = opt.valueFunction(getByPath(this.attributes, path, delim), value);

                this._transitionIds[path] = nextFrame(callback);

                this.trigger('transition:start', this, path);

            }.bind(this);

            return setTimeout(initiator, opt.delay, setter);
        },

        getTransitions: function() {

            return Object.keys(this._transitionIds);
        },

        stopTransitions: function(path, delim) {

            delim = delim || '/';

            var pathArray = path && path.split(delim);

            Object.keys(this._transitionIds).filter(pathArray && function(key) {

                return isEqual(pathArray, key.split(delim).slice(0, pathArray.length));

            }).forEach(function(key) {

                cancelFrame(this._transitionIds[key]);

                delete this._transitionIds[key];

                this.trigger('transition:end', this, key);

            }, this);

            return this;
        },

        // A shorcut making it easy to create constructs like the following:
        // `var el = (new joint.shapes.basic.Rect).addTo(graph)`.
        addTo: function(graph, opt) {

            graph.addCell(this, opt);
            return this;
        },

        // A shortcut for an equivalent call: `paper.findViewByModel(cell)`
        // making it easy to create constructs like the following:
        // `cell.findView(paper).highlight()`
        findView: function(paper) {

            return paper.findViewByModel(this);
        },

        isElement: function() {

            return false;
        },

        isLink: function() {

            return false;
        },

        startBatch: function(name, opt) {

            if (this.graph) { this.graph.startBatch(name, assign({}, opt, { cell: this })); }
            return this;
        },

        stopBatch: function(name, opt) {

            if (this.graph) { this.graph.stopBatch(name, assign({}, opt, { cell: this })); }
            return this;
        },

        getChangeFlag: function(attributes$$1) {

            var flag = 0;
            if (!attributes$$1) { return flag; }
            for (var key in attributes$$1) {
                if (!attributes$$1.hasOwnProperty(key) || !this.hasChanged(key)) { continue; }
                flag |= attributes$$1[key];
            }
            return flag;
        },

        angle: function() {

            // To be overridden.
            return 0;
        },

        position: function() {

            // To be overridden.
            return new Point(0, 0);
        },

        getPointFromConnectedLink: function() {

            // To be overridden
            return new Point();
        },

        getBBox: function() {

            // To be overridden
            return new Rect(0, 0, 0, 0);
        }

    }, {

        getAttributeDefinition: function(attrName) {

            var defNS = this.attributes;
            var globalDefNS = attributes;
            return (defNS && defNS[attrName]) || globalDefNS[attrName];
        },

        define: function(type, defaults$$1, protoProps, staticProps) {

            protoProps = assign({
                defaults: defaultsDeep({ type: type }, defaults$$1, this.prototype.defaults)
            }, protoProps);

            var Cell = this.extend(protoProps, staticProps);
            // es5 backward compatibility
            /* global joint: true */
            if (typeof joint !== 'undefined' && has(joint, 'shapes')) {
                setByPath(joint.shapes, type, Cell, '.');
            }
            /* global joint: false */
            return Cell;
        }
    });

    var wrapWith = function(object, methods, wrapper) {

        if (isString(wrapper)) {

            if (!wrappers[wrapper]) {
                throw new Error('Unknown wrapper: "' + wrapper + '"');
            }

            wrapper = wrappers[wrapper];
        }

        if (!isFunction(wrapper)) {
            throw new Error('Wrapper must be a function.');
        }

        toArray(methods).forEach(function(method) {
            object[method] = wrapper(object[method]);
        });
    };

    var wrappers = {

        cells: function(fn) {

            return function() {

                var args = Array.from(arguments);
                var n = args.length;
                var cells = n > 0 && args[0] || [];
                var opt = n > 1 && args[n - 1] || {};

                if (!Array.isArray(cells)) {

                    if (opt instanceof Cell) {
                        cells = args;
                    } else if (cells instanceof Cell) {
                        if (args.length > 1) {
                            args.pop();
                        }
                        cells = args;
                    }
                }

                if (opt instanceof Cell) {
                    opt = {};
                }

                return fn.call(this, cells, opt);
            };
        }

    };



    var index = ({
        wrapWith: wrapWith,
        wrappers: wrappers,
        addClassNamePrefix: addClassNamePrefix,
        removeClassNamePrefix: removeClassNamePrefix,
        parseDOMJSON: parseDOMJSON,
        hashCode: hashCode,
        getByPath: getByPath,
        setByPath: setByPath,
        unsetByPath: unsetByPath,
        flattenObject: flattenObject,
        uuid: uuid,
        guid: guid,
        toKebabCase: toKebabCase,
        normalizeEvent: normalizeEvent,
        nextFrame: nextFrame,
        cancelFrame: cancelFrame,
        shapePerimeterConnectionPoint: shapePerimeterConnectionPoint,
        isPercentage: isPercentage,
        parseCssNumeric: parseCssNumeric,
        breakText: breakText,
        sanitizeHTML: sanitizeHTML,
        downloadBlob: downloadBlob,
        downloadDataUri: downloadDataUri,
        dataUriToBlob: dataUriToBlob,
        imageToDataUri: imageToDataUri,
        getElementBBox: getElementBBox,
        sortElements: sortElements,
        setAttributesBySelector: setAttributesBySelector,
        normalizeSides: normalizeSides,
        timing: timing,
        interpolate: interpolate,
        filter: filter,
        format: format,
        template: template,
        toggleFullScreen: toggleFullScreen,
        mixin: mixin,
        supplement: supplement,
        deepMixin: deepMixin,
        deepSupplement: deepSupplement,
        assign: assign,
        defaults: defaults,
        defaultsDeep: defaultsDeep,
        invoke: invoke,
        sortedIndex: sortedIndex,
        uniq: uniq,
        clone: clone,
        cloneDeep: cloneDeep,
        isEmpty: isEmpty,
        isEqual: isEqual,
        isFunction: isFunction,
        isPlainObject: isPlainObject,
        toArray: toArray,
        debounce: debounce,
        groupBy: groupBy,
        sortBy: sortBy,
        flattenDeep: flattenDeep,
        without: without,
        difference: difference,
        intersection: intersection,
        union: union,
        has: has,
        result: result,
        omit: omit,
        pick: pick,
        bindAll: bindAll,
        forIn: forIn,
        camelCase: camelCase,
        uniqueId: uniqueId,
        merge: merge,
        isBoolean: isBoolean,
        isObject: isObject,
        isNumber: isNumber,
        isString: isString,
        noop: noop,
        cloneCells: cloneCells
    });

    function portTransformAttrs(point$$1, angle, opt) {

        var trans = point$$1.toJSON();

        trans.angle = angle || 0;

        return defaults({}, opt, trans);
    }

    function lineLayout(ports, p1, p2) {
        return ports.map(function(port, index, ports) {
            var p = this.pointAt(((index + 0.5) / ports.length));
            // `dx`,`dy` per port offset option
            if (port.dx || port.dy) {
                p.offset(port.dx || 0, port.dy || 0);
            }

            return portTransformAttrs(p.round(), 0, port);
        }, line(p1, p2));
    }

    function ellipseLayout(ports, elBBox, startAngle, stepFn) {

        var center = elBBox.center();
        var ratio = elBBox.width / elBBox.height;
        var p1 = elBBox.topMiddle();

        var ellipse$$1 = Ellipse.fromRect(elBBox);

        return ports.map(function(port, index, ports) {

            var angle = startAngle + stepFn(index, ports.length);
            var p2 = p1.clone()
                .rotate(center, -angle)
                .scale(ratio, 1, center);

            var theta = port.compensateRotation ? -ellipse$$1.tangentTheta(p2) : 0;

            // `dx`,`dy` per port offset option
            if (port.dx || port.dy) {
                p2.offset(port.dx || 0, port.dy || 0);
            }

            // `dr` delta radius option
            if (port.dr) {
                p2.move(center, port.dr);
            }

            return portTransformAttrs(p2.round(), theta, port);
        });
    }

    // Creates a point stored in arguments
    function argPoint(bbox, args) {

        var x = args.x;
        if (isString(x)) {
            x = parseFloat(x) / 100 * bbox.width;
        }

        var y = args.y;
        if (isString(y)) {
            y = parseFloat(y) / 100 * bbox.height;
        }

        return point(x || 0, y || 0);
    }


    /**
     * @param {Array<Object>} ports
     * @param {g.Rect} elBBox
     * @param {Object=} opt opt Group options
     * @returns {Array<g.Point>}
     */
    var absolute = function(ports, elBBox, opt) {
        //TODO v.talas angle
        return ports.map(argPoint.bind(null, elBBox));
    };

    /**
     * @param {Array<Object>} ports
     * @param {g.Rect} elBBox
     * @param {Object=} opt opt Group options
     * @returns {Array<g.Point>}
     */
    var fn = function(ports, elBBox, opt) {
        return opt.fn(ports, elBBox, opt);
    };

    /**
     * @param {Array<Object>} ports
     * @param {g.Rect} elBBox
     * @param {Object=} opt opt Group options
     * @returns {Array<g.Point>}
     */
    var line$1 = function(ports, elBBox, opt) {

        var start = argPoint(elBBox, opt.start || elBBox.origin());
        var end = argPoint(elBBox, opt.end || elBBox.corner());

        return lineLayout(ports, start, end);
    };

    /**
     * @param {Array<Object>} ports
     * @param {g.Rect} elBBox
     * @param {Object=} opt opt Group options
     * @returns {Array<g.Point>}
     */
    var left = function(ports, elBBox, opt) {
        return lineLayout(ports, elBBox.origin(), elBBox.bottomLeft());
    };

    /**
     * @param {Array<Object>} ports
     * @param {g.Rect} elBBox
     * @param {Object=} opt opt Group options
     * @returns {Array<g.Point>}
     */
    var right = function(ports, elBBox, opt) {
        return lineLayout(ports, elBBox.topRight(), elBBox.corner());
    };

    /**
     * @param {Array<Object>} ports
     * @param {g.Rect} elBBox
     * @param {Object=} opt opt Group options
     * @returns {Array<g.Point>}
     */
    var top = function(ports, elBBox, opt) {
        return lineLayout(ports, elBBox.origin(), elBBox.topRight());
    };

    /**
     * @param {Array<Object>} ports
     * @param {g.Rect} elBBox
     * @param {Object=} opt opt Group options
     * @returns {Array<g.Point>}
     */
    var bottom = function(ports, elBBox, opt) {
        return lineLayout(ports, elBBox.bottomLeft(), elBBox.corner());
    };

    /**
     * @param {Array<Object>} ports
     * @param {g.Rect} elBBox
     * @param {Object=} opt Group options
     * @returns {Array<g.Point>}
     */
    var ellipseSpread = function(ports, elBBox, opt) {

        var startAngle = opt.startAngle || 0;
        var stepAngle = opt.step || 360 / ports.length;

        return ellipseLayout(ports, elBBox, startAngle, function(index) {
            return index * stepAngle;
        });
    };

    /**
     * @param {Array<Object>} ports
     * @param {g.Rect} elBBox
     * @param {Object=} opt Group options
     * @returns {Array<g.Point>}
     */
    var ellipse$1 = function(ports, elBBox, opt) {

        var startAngle = opt.startAngle || 0;
        var stepAngle = opt.step || 20;

        return ellipseLayout(ports, elBBox, startAngle, function(index, count) {
            return (index + 0.5 - count / 2) * stepAngle;
        });
    };

    var Port = ({
        absolute: absolute,
        fn: fn,
        line: line$1,
        left: left,
        right: right,
        top: top,
        bottom: bottom,
        ellipseSpread: ellipseSpread,
        ellipse: ellipse$1
    });

    function labelAttributes(opt1, opt2) {

        return defaultsDeep({}, opt1, opt2, {
            x: 0,
            y: 0,
            angle: 0,
            attrs: {
                '.': {
                    y: '0',
                    'text-anchor': 'start'
                }
            }
        });
    }

    function outsideLayout(portPosition, elBBox, autoOrient, opt) {

        opt = defaults({}, opt, { offset: 15 });
        var angle = elBBox.center().theta(portPosition);
        var x = getBBoxAngles(elBBox);

        var tx, ty, y, textAnchor;
        var offset = opt.offset;
        var orientAngle = 0;

        if (angle < x[1] || angle > x[2]) {
            y = '.3em';
            tx = offset;
            ty = 0;
            textAnchor = 'start';
        } else if (angle < x[0]) {
            y = '0';
            tx = 0;
            ty = -offset;
            if (autoOrient) {
                orientAngle = -90;
                textAnchor = 'start';
            } else {
                textAnchor = 'middle';
            }
        } else if (angle < x[3]) {
            y = '.3em';
            tx = -offset;
            ty = 0;
            textAnchor = 'end';
        } else {
            y = '.6em';
            tx = 0;
            ty = offset;
            if (autoOrient) {
                orientAngle = 90;
                textAnchor = 'start';
            } else {
                textAnchor = 'middle';
            }
        }

        var round = Math.round;
        return labelAttributes({
            x: round(tx),
            y: round(ty),
            angle: orientAngle,
            attrs: {
                '.': {
                    y: y,
                    'text-anchor': textAnchor
                }
            }
        });
    }

    function getBBoxAngles(elBBox) {

        var center = elBBox.center();

        var tl = center.theta(elBBox.origin());
        var bl = center.theta(elBBox.bottomLeft());
        var br = center.theta(elBBox.corner());
        var tr = center.theta(elBBox.topRight());

        return [tl, tr, br, bl];
    }

    function insideLayout(portPosition, elBBox, autoOrient, opt) {

        var angle = elBBox.center().theta(portPosition);
        opt = defaults({}, opt, { offset: 15 });

        var tx, ty, y, textAnchor;
        var offset = opt.offset;
        var orientAngle = 0;

        var bBoxAngles = getBBoxAngles(elBBox);

        if (angle < bBoxAngles[1] || angle > bBoxAngles[2]) {
            y = '.3em';
            tx = -offset;
            ty = 0;
            textAnchor = 'end';
        } else if (angle < bBoxAngles[0]) {
            y = '.6em';
            tx = 0;
            ty = offset;
            if (autoOrient) {
                orientAngle = 90;
                textAnchor = 'start';
            } else {
                textAnchor = 'middle';
            }
        } else if (angle < bBoxAngles[3]) {
            y = '.3em';
            tx = offset;
            ty = 0;
            textAnchor = 'start';
        } else {
            y = '0em';
            tx = 0;
            ty = -offset;
            if (autoOrient) {
                orientAngle = -90;
                textAnchor = 'start';
            } else {
                textAnchor = 'middle';
            }
        }

        var round = Math.round;
        return labelAttributes({
            x: round(tx),
            y: round(ty),
            angle: orientAngle,
            attrs: {
                '.': {
                    y: y,
                    'text-anchor': textAnchor
                }
            }
        });
    }

    function radialLayout(portCenterOffset, autoOrient, opt) {

        opt = defaults({}, opt, { offset: 20 });

        var origin = point(0, 0);
        var angle = -portCenterOffset.theta(origin);
        var orientAngle = angle;
        var offset = portCenterOffset.clone()
            .move(origin, opt.offset)
            .difference(portCenterOffset)
            .round();

        var y = '.3em';
        var textAnchor;

        if ((angle + 90) % 180 === 0) {
            textAnchor = autoOrient ? 'end' : 'middle';
            if (!autoOrient && angle === -270) {
                y = '0em';
            }
        } else if (angle > -270 && angle < -90) {
            textAnchor = 'start';
            orientAngle = angle - 180;
        } else {
            textAnchor = 'end';
        }

        var round = Math.round;
        return labelAttributes({
            x: round(offset.x),
            y: round(offset.y),
            angle: autoOrient ? orientAngle : 0,
            attrs: {
                '.': {
                    y: y,
                    'text-anchor': textAnchor
                }
            }
        });
    }

    var manual = function(portPosition, elBBox, opt) {
        return labelAttributes(opt, elBBox);
    };

    var left$1 = function(portPosition, elBBox, opt) {
        return labelAttributes(opt, { x: -15, attrs: { '.': { y: '.3em', 'text-anchor': 'end' }}});
    };

    var right$1 = function(portPosition, elBBox, opt) {
        return labelAttributes(opt, { x: 15, attrs: { '.': { y: '.3em', 'text-anchor': 'start' }}});
    };

    var top$1 = function(portPosition, elBBox, opt) {
        return labelAttributes(opt, { y: -15, attrs: { '.': { 'text-anchor': 'middle' }}});
    };

    var bottom$1 = function(portPosition, elBBox, opt) {
        return labelAttributes(opt, { y: 15, attrs: { '.': { y: '.6em', 'text-anchor': 'middle' }}});
    };

    var outsideOriented = function(portPosition, elBBox, opt) {
        return outsideLayout(portPosition, elBBox, true, opt);
    };

    var outside = function(portPosition, elBBox, opt) {
        return outsideLayout(portPosition, elBBox, false, opt);
    };

    var insideOriented = function(portPosition, elBBox, opt) {
        return insideLayout(portPosition, elBBox, true, opt);
    };

    var inside = function(portPosition, elBBox, opt) {
        return insideLayout(portPosition, elBBox, false, opt);
    };

    var radial = function(portPosition, elBBox, opt) {
        return radialLayout(portPosition.difference(elBBox.center()), false, opt);
    };

    var radialOriented = function(portPosition, elBBox, opt) {
        return radialLayout(portPosition.difference(elBBox.center()), true, opt);
    };

    var PortLabel = ({
        manual: manual,
        left: left$1,
        right: right$1,
        top: top$1,
        bottom: bottom$1,
        outsideOriented: outsideOriented,
        outside: outside,
        insideOriented: insideOriented,
        inside: inside,
        radial: radial,
        radialOriented: radialOriented
    });

    var PortData = function(data) {

        var clonedData = cloneDeep(data) || {};
        this.ports = [];
        this.groups = {};
        this.portLayoutNamespace = Port;
        this.portLabelLayoutNamespace = PortLabel;

        this._init(clonedData);
    };

    PortData.prototype = {

        getPorts: function() {
            return this.ports;
        },

        getGroup: function(name) {
            return this.groups[name] || {};
        },

        getPortsByGroup: function(groupName) {

            return this.ports.filter(function(port) {
                return port.group === groupName;
            });
        },

        getGroupPortsMetrics: function(groupName, elBBox) {

            var group = this.getGroup(groupName);
            var ports = this.getPortsByGroup(groupName);

            var groupPosition = group.position || {};
            var groupPositionName = groupPosition.name;
            var namespace = this.portLayoutNamespace;
            if (!namespace[groupPositionName]) {
                groupPositionName = 'left';
            }

            var groupArgs = groupPosition.args || {};
            var portsArgs = ports.map(function(port) {
                return port && port.position && port.position.args;
            });
            var groupPortTransformations = namespace[groupPositionName](portsArgs, elBBox, groupArgs);

            var accumulator = {
                ports: ports,
                result: []
            };

            toArray(groupPortTransformations).reduce(function(res, portTransformation, index) {
                var port = res.ports[index];
                res.result.push({
                    portId: port.id,
                    portTransformation: portTransformation,
                    labelTransformation: this._getPortLabelLayout(port, Point(portTransformation), elBBox),
                    portAttrs: port.attrs,
                    portSize: port.size,
                    labelSize: port.label.size
                });
                return res;
            }.bind(this), accumulator);

            return accumulator.result;
        },

        _getPortLabelLayout: function(port, portPosition, elBBox) {

            var namespace = this.portLabelLayoutNamespace;
            var labelPosition = port.label.position.name || 'left';

            if (namespace[labelPosition]) {
                return namespace[labelPosition](portPosition, elBBox, port.label.position.args);
            }

            return null;
        },

        _init: function(data) {

            // prepare groups
            if (isObject(data.groups)) {
                var groups = Object.keys(data.groups);
                for (var i = 0, n = groups.length; i < n; i++) {
                    var key = groups[i];
                    this.groups[key] = this._evaluateGroup(data.groups[key]);
                }
            }

            // prepare ports
            var ports = toArray(data.items);
            for (var j = 0, m = ports.length; j < m; j++) {
                this.ports.push(this._evaluatePort(ports[j]));
            }
        },

        _evaluateGroup: function(group) {

            return merge(group, {
                position: this._getPosition(group.position, true),
                label: this._getLabel(group, true)
            });
        },

        _evaluatePort: function(port) {

            var evaluated = assign({}, port);

            var group = this.getGroup(port.group);

            evaluated.markup = evaluated.markup || group.markup;
            evaluated.attrs = merge({}, group.attrs, evaluated.attrs);
            evaluated.position = this._createPositionNode(group, evaluated);
            evaluated.label = merge({}, group.label, this._getLabel(evaluated));
            evaluated.z = this._getZIndex(group, evaluated);
            evaluated.size = assign({}, group.size, evaluated.size);

            return evaluated;
        },

        _getZIndex: function(group, port) {

            if (isNumber(port.z)) {
                return port.z;
            }
            if (isNumber(group.z) || group.z === 'auto') {
                return group.z;
            }
            return 'auto';
        },

        _createPositionNode: function(group, port) {

            return merge({
                name: 'left',
                args: {}
            }, group.position, { args: port.args });
        },

        _getPosition: function(position, setDefault) {

            var args = {};
            var positionName;

            if (isFunction(position)) {
                positionName = 'fn';
                args.fn = position;
            } else if (isString(position)) {
                positionName = position;
            } else if (position === undefined) {
                positionName = setDefault ? 'left' : null;
            } else if (Array.isArray(position)) {
                positionName = 'absolute';
                args.x = position[0];
                args.y = position[1];
            } else if (isObject(position)) {
                positionName = position.name;
                assign(args, position.args);
            }

            var result$$1 = { args: args };

            if (positionName) {
                result$$1.name = positionName;
            }
            return result$$1;
        },

        _getLabel: function(item, setDefaults) {

            var label = item.label || {};

            var ret = label;
            ret.position = this._getPosition(label.position, setDefaults);

            return ret;
        }
    };

    var elementPortPrototype = {

        _initializePorts: function() {

            this._createPortData();
            this.on('change:ports', function() {

                this._processRemovedPort();
                this._createPortData();
            }, this);
        },

        /**
         * remove links tied wiht just removed element
         * @private
         */
        _processRemovedPort: function() {

            var current = this.get('ports') || {};
            var currentItemsMap = {};

            toArray(current.items).forEach(function(item) {
                currentItemsMap[item.id] = true;
            });

            var previous = this.previous('ports') || {};
            var removed = {};

            toArray(previous.items).forEach(function(item) {
                if (!currentItemsMap[item.id]) {
                    removed[item.id] = true;
                }
            });

            var graph = this.graph;
            if (graph && !isEmpty(removed)) {

                var inboundLinks = graph.getConnectedLinks(this, { inbound: true });
                inboundLinks.forEach(function(link) {

                    if (removed[link.get('target').port]) { link.remove(); }
                });

                var outboundLinks = graph.getConnectedLinks(this, { outbound: true });
                outboundLinks.forEach(function(link) {

                    if (removed[link.get('source').port]) { link.remove(); }
                });
            }
        },

        /**
         * @returns {boolean}
         */
        hasPorts: function() {

            var ports = this.prop('ports/items');
            return Array.isArray(ports) && ports.length > 0;
        },

        /**
         * @param {string} id
         * @returns {boolean}
         */
        hasPort: function(id) {

            return this.getPortIndex(id) !== -1;
        },

        /**
         * @returns {Array<object>}
         */
        getPorts: function() {

            return cloneDeep(this.prop('ports/items')) || [];
        },

        /**
         * @param {string} id
         * @returns {object}
         */
        getPort: function(id) {

            return cloneDeep(toArray(this.prop('ports/items')).find(function(port) {
                return port.id && port.id === id;
            }));
        },

        /**
         * @param {string} groupName
         * @returns {Object<portId, {x: number, y: number, angle: number}>}
         */
        getPortsPositions: function(groupName) {

            var portsMetrics = this._portSettingsData.getGroupPortsMetrics(groupName, Rect(this.size()));

            return portsMetrics.reduce(function(positions, metrics) {
                var transformation = metrics.portTransformation;
                positions[metrics.portId] = {
                    x: transformation.x,
                    y: transformation.y,
                    angle: transformation.angle
                };
                return positions;
            }, {});
        },

        /**
         * @param {string|Port} port port id or port
         * @returns {number} port index
         */
        getPortIndex: function(port) {

            var id = isObject(port) ? port.id : port;

            if (!this._isValidPortId(id)) {
                return -1;
            }

            return toArray(this.prop('ports/items')).findIndex(function(item) {
                return item.id === id;
            });
        },

        /**
         * @param {object} port
         * @param {object} [opt]
         * @returns {joint.dia.Element}
         */
        addPort: function(port, opt) {

            if (!isObject(port) || Array.isArray(port)) {
                throw new Error('Element: addPort requires an object.');
            }

            var ports = assign([], this.prop('ports/items'));
            ports.push(port);
            this.prop('ports/items', ports, opt);

            return this;
        },

        /**
         * @param {string} portId
         * @param {string|object=} path
         * @param {*=} value
         * @param {object=} opt
         * @returns {joint.dia.Element}
         */
        portProp: function(portId, path, value, opt) {

            var index = this.getPortIndex(portId);

            if (index === -1) {
                throw new Error('Element: unable to find port with id ' + portId);
            }

            var args = Array.prototype.slice.call(arguments, 1);
            if (Array.isArray(path)) {
                args[0] = ['ports', 'items', index].concat(path);
            } else if (isString(path)) {

                // Get/set an attribute by a special path syntax that delimits
                // nested objects by the colon character.
                args[0] = ['ports/items/', index, '/', path].join('');

            } else {

                args = ['ports/items/' + index];
                if (isPlainObject(path)) {
                    args.push(path);
                    args.push(value);
                }
            }

            return this.prop.apply(this, args);
        },

        _validatePorts: function() {

            var portsAttr = this.get('ports') || {};

            var errorMessages = [];
            portsAttr = portsAttr || {};
            var ports = toArray(portsAttr.items);

            ports.forEach(function(p) {

                if (typeof p !== 'object') {
                    errorMessages.push('Element: invalid port ', p);
                }

                if (!this._isValidPortId(p.id)) {
                    p.id = this.generatePortId();
                }
            }, this);

            if (uniq(ports, 'id').length !== ports.length) {
                errorMessages.push('Element: found id duplicities in ports.');
            }

            return errorMessages;
        },

        generatePortId: function() {
            return this.generateId();
        },

        /**
         * @param {string} id port id
         * @returns {boolean}
         * @private
         */
        _isValidPortId: function(id) {

            return id !== null && id !== undefined && !isObject(id);
        },

        addPorts: function(ports, opt) {

            if (ports.length) {
                this.prop('ports/items', assign([], this.prop('ports/items')).concat(ports), opt);
            }

            return this;
        },

        removePort: function(port, opt) {

            var options = opt || {};
            var ports = assign([], this.prop('ports/items'));

            var index = this.getPortIndex(port);

            if (index !== -1) {
                ports.splice(index, 1);
                options.rewrite = true;
                this.prop('ports/items', ports, options);
            }

            return this;
        },

        removePorts: function(portsForRemoval, opt) {

            var options;

            if (Array.isArray(portsForRemoval)) {
                options = opt || {};

                if (portsForRemoval.length) {
                    options.rewrite = true;
                    var currentPorts = assign([], this.prop('ports/items'));
                    var remainingPorts = currentPorts.filter(function(cp) {
                        return !portsForRemoval.some(function(rp) {
                            var rpId = isObject(rp) ? rp.id : rp;
                            return cp.id === rpId;
                        });
                    });
                    this.prop('ports/items', remainingPorts, options);
                }
            } else {
                options = portsForRemoval || {};
                options.rewrite = true;
                this.prop('ports/items', [], options);
            }

            return this;
        },

        /**
         * @private
         */
        _createPortData: function() {

            var err = this._validatePorts();

            if (err.length > 0) {
                this.set('ports', this.previous('ports'));
                throw new Error(err.join(' '));
            }

            var prevPortData;

            if (this._portSettingsData) {

                prevPortData = this._portSettingsData.getPorts();
            }

            this._portSettingsData = new PortData(this.get('ports'));

            var curPortData = this._portSettingsData.getPorts();

            if (prevPortData) {

                var added = curPortData.filter(function(item) {
                    if (!prevPortData.find(function(prevPort) {
                        return prevPort.id === item.id;
                    })) {
                        return item;
                    }
                });

                var removed = prevPortData.filter(function(item) {
                    if (!curPortData.find(function(curPort) {
                        return curPort.id === item.id;
                    })) {
                        return item;
                    }
                });

                if (removed.length > 0) {
                    this.trigger('ports:remove', this, removed);
                }

                if (added.length > 0) {
                    this.trigger('ports:add', this, added);
                }
            }
        }
    };

    var elementViewPortPrototype = {

        portContainerMarkup: 'g',
        portMarkup: [{
            tagName: 'circle',
            selector: 'circle',
            attributes: {
                'r': 10,
                'fill': '#FFFFFF',
                'stroke': '#000000'
            }
        }],
        portLabelMarkup: [{
            tagName: 'text',
            selector: 'text',
            attributes: {
                'fill': '#000000'
            }
        }],
        /** @type {Object<string, {portElement: Vectorizer, portLabelElement: Vectorizer}>} */
        _portElementsCache: null,

        /**
         * @private
         */
        _initializePorts: function() {
            this._cleanPortsCache();
        },

        /**
         * @typedef {Object} Port
         *
         * @property {string} id
         * @property {Object} position
         * @property {Object} label
         * @property {Object} attrs
         * @property {string} markup
         * @property {string} group
         */

        /**
         * @private
         */
        _refreshPorts: function() {

            this._removePorts();
            this._cleanPortsCache();
            this._renderPorts();
        },

        _cleanPortsCache: function() {
            this._portElementsCache = {};
        },

        /**
         * @private
         */
        _renderPorts: function() {

            // references to rendered elements without z-index
            var elementReferences = [];
            var elem = this._getContainerElement();

            for (var i = 0, count = elem.node.childNodes.length; i < count; i++) {
                elementReferences.push(elem.node.childNodes[i]);
            }

            var portsGropsByZ = groupBy(this.model._portSettingsData.getPorts(), 'z');
            var withoutZKey = 'auto';

            // render non-z first
            toArray(portsGropsByZ[withoutZKey]).forEach(function(port) {
                var portElement = this._getPortElement(port);
                elem.append(portElement);
                elementReferences.push(portElement);
            }, this);

            var groupNames = Object.keys(portsGropsByZ);
            for (var k = 0; k < groupNames.length; k++) {
                var groupName = groupNames[k];
                if (groupName !== withoutZKey) {
                    var z = parseInt(groupName, 10);
                    this._appendPorts(portsGropsByZ[groupName], z, elementReferences);
                }
            }

            this._updatePorts();
        },

        /**
         * @returns {V}
         * @private
         */
        _getContainerElement: function() {

            return this.rotatableNode || this.vel;
        },

        /**
         * @param {Array<Port>}ports
         * @param {number} z
         * @param refs
         * @private
         */
        _appendPorts: function(ports, z, refs) {

            var containerElement = this._getContainerElement();
            var portElements = toArray(ports).map(this._getPortElement, this);

            if (refs[z] || z < 0) {
                V(refs[Math.max(z, 0)]).before(portElements);
            } else {
                containerElement.append(portElements);
            }
        },

        /**
         * Try to get element from cache,
         * @param port
         * @returns {*}
         * @private
         */
        _getPortElement: function(port) {

            if (this._portElementsCache[port.id]) {
                return this._portElementsCache[port.id].portElement;
            }
            return this._createPortElement(port);
        },

        findPortNode: function(portId, selector) {
            var portCache = this._portElementsCache[portId];
            if (!portCache) { return null; }
            var portRoot = portCache.portContentElement.node;
            var portSelectors = portCache.portContentSelectors;
            return this.findBySelector(selector, portRoot, portSelectors)[0];
        },

        /**
         * @private
         */
        _updatePorts: function() {

            // layout ports without group
            this._updatePortGroup(undefined);
            // layout ports with explicit group
            var groupsNames = Object.keys(this.model._portSettingsData.groups);
            groupsNames.forEach(this._updatePortGroup, this);
        },

        /**
         * @private
         */
        _removePorts: function() {
            invoke(this._portElementsCache, 'portElement.remove');
        },

        /**
         * @param {Port} port
         * @returns {V}
         * @private
         */
        _createPortElement: function(port) {

            var portElement;
            var labelElement;

            var portContainerElement = V(this.portContainerMarkup).addClass('joint-port');

            var portMarkup = this._getPortMarkup(port);
            var portSelectors;
            if (Array.isArray(portMarkup)) {
                var portDoc = this.parseDOMJSON(portMarkup, portContainerElement.node);
                var portFragment = portDoc.fragment;
                if (portFragment.childNodes.length > 1) {
                    portElement = V('g').append(portFragment);
                } else {
                    portElement = V(portFragment.firstChild);
                }
                portSelectors = portDoc.selectors;
            } else {
                portElement = V(portMarkup);
                if (Array.isArray(portElement)) {
                    portElement = V('g').append(portElement);
                }
            }

            if (!portElement) {
                throw new Error('ElementView: Invalid port markup.');
            }

            portElement.attr({
                'port': port.id,
                'port-group': port.group
            });

            var labelMarkup = this._getPortLabelMarkup(port.label);
            var labelSelectors;
            if (Array.isArray(labelMarkup)) {
                var labelDoc = this.parseDOMJSON(labelMarkup, portContainerElement.node);
                var labelFragment = labelDoc.fragment;
                if (labelFragment.childNodes.length > 1) {
                    labelElement = V('g').append(labelFragment);
                } else {
                    labelElement = V(labelFragment.firstChild);
                }
                labelSelectors = labelDoc.selectors;
            } else {
                labelElement = V(labelMarkup);
                if (Array.isArray(labelElement)) {
                    labelElement = V('g').append(labelElement);
                }
            }

            if (!labelElement) {
                throw new Error('ElementView: Invalid port label markup.');
            }

            var portContainerSelectors;
            if (portSelectors && labelSelectors) {
                for (var key in labelSelectors) {
                    if (portSelectors[key] && key !== this.selector) { throw new Error('ElementView: selectors within port must be unique.'); }
                }
                portContainerSelectors = assign({}, portSelectors, labelSelectors);
            } else {
                portContainerSelectors = portSelectors || labelSelectors;
            }

            portContainerElement.append([
                portElement.addClass('joint-port-body'),
                labelElement.addClass('joint-port-label')
            ]);

            this._portElementsCache[port.id] = {
                portElement: portContainerElement,
                portLabelElement: labelElement,
                portSelectors: portContainerSelectors,
                portLabelSelectors: labelSelectors,
                portContentElement: portElement,
                portContentSelectors: portSelectors
            };

            return portContainerElement;
        },

        /**
         * @param {string=} groupName
         * @private
         */
        _updatePortGroup: function(groupName) {

            var elementBBox = Rect(this.model.size());
            var portsMetrics = this.model._portSettingsData.getGroupPortsMetrics(groupName, elementBBox);

            for (var i = 0, n = portsMetrics.length; i < n; i++) {
                var metrics = portsMetrics[i];
                var portId = metrics.portId;
                var cached = this._portElementsCache[portId] || {};
                var portTransformation = metrics.portTransformation;
                this.applyPortTransform(cached.portElement, portTransformation);
                this.updateDOMSubtreeAttributes(cached.portElement.node, metrics.portAttrs, {
                    rootBBox: new Rect(metrics.portSize),
                    selectors: cached.portSelectors
                });

                var labelTransformation = metrics.labelTransformation;
                if (labelTransformation) {
                    this.applyPortTransform(cached.portLabelElement, labelTransformation, (-portTransformation.angle || 0));
                    this.updateDOMSubtreeAttributes(cached.portLabelElement.node, labelTransformation.attrs, {
                        rootBBox: new Rect(metrics.labelSize),
                        selectors: cached.portLabelSelectors
                    });
                }
            }
        },

        /**
         * @param {Vectorizer} element
         * @param {{dx:number, dy:number, angle: number, attrs: Object, x:number: y:number}} transformData
         * @param {number=} initialAngle
         * @constructor
         */
        applyPortTransform: function(element, transformData, initialAngle) {

            var matrix = V.createSVGMatrix()
                .rotate(initialAngle || 0)
                .translate(transformData.x || 0, transformData.y || 0)
                .rotate(transformData.angle || 0);

            element.transform(matrix, { absolute: true });
        },

        /**
         * @param {Port} port
         * @returns {string}
         * @private
         */
        _getPortMarkup: function(port) {

            return port.markup || this.model.get('portMarkup') || this.model.portMarkup || this.portMarkup;
        },

        /**
         * @param {Object} label
         * @returns {string}
         * @private
         */
        _getPortLabelMarkup: function(label) {

            return label.markup || this.model.get('portLabelMarkup') || this.model.portLabelMarkup || this.portLabelMarkup;
        }
    };

    // Element base model.
    // -----------------------------

    var Element$1 = Cell.extend({

        defaults: {
            position: { x: 0, y: 0 },
            size: { width: 1, height: 1 },
            angle: 0
        },

        initialize: function() {

            this._initializePorts();
            Cell.prototype.initialize.apply(this, arguments);
        },

        /**
         * @abstract
         */
        _initializePorts: function() {
            // implemented in ports.js
        },

        _refreshPorts: function() {
            // implemented in ports.js
        },

        isElement: function() {

            return true;
        },

        position: function(x, y, opt) {

            var isSetter = isNumber(y);

            opt = (isSetter ? opt : x) || {};

            // option `parentRelative` for setting the position relative to the element's parent.
            if (opt.parentRelative) {

                // Getting the parent's position requires the collection.
                // Cell.parent() holds cell id only.
                if (!this.graph) { throw new Error('Element must be part of a graph.'); }

                var parent = this.getParentCell();
                var parentPosition = parent && !parent.isLink()
                    ? parent.get('position')
                    : { x: 0, y: 0 };
            }

            if (isSetter) {

                if (opt.parentRelative) {
                    x += parentPosition.x;
                    y += parentPosition.y;
                }

                if (opt.deep) {
                    var currentPosition = this.get('position');
                    this.translate(x - currentPosition.x, y - currentPosition.y, opt);
                } else {
                    this.set('position', { x: x, y: y }, opt);
                }

                return this;

            } else { // Getter returns a geometry point.

                var elementPosition = Point(this.get('position'));

                return opt.parentRelative
                    ? elementPosition.difference(parentPosition)
                    : elementPosition;
            }
        },

        translate: function(tx, ty, opt) {

            tx = tx || 0;
            ty = ty || 0;

            if (tx === 0 && ty === 0) {
                // Like nothing has happened.
                return this;
            }

            opt = opt || {};
            // Pass the initiator of the translation.
            opt.translateBy = opt.translateBy || this.id;

            var position = this.get('position') || { x: 0, y: 0 };

            if (opt.restrictedArea && opt.translateBy === this.id) {

                // We are restricting the translation for the element itself only. We get
                // the bounding box of the element including all its embeds.
                // All embeds have to be translated the exact same way as the element.
                var bbox = this.getBBox({ deep: true });
                var ra = opt.restrictedArea;
                //- - - - - - - - - - - - -> ra.x + ra.width
                // - - - -> position.x      |
                // -> bbox.x
                //                ▓▓▓▓▓▓▓   |
                //         ░░░░░░░▓▓▓▓▓▓▓
                //         ░░░░░░░░░        |
                //   ▓▓▓▓▓▓▓▓░░░░░░░
                //   ▓▓▓▓▓▓▓▓               |
                //   <-dx->                     | restricted area right border
                //         <-width->        |   ░ translated element
                //   <- - bbox.width - ->       ▓ embedded element
                var dx = position.x - bbox.x;
                var dy = position.y - bbox.y;
                // Find the maximal/minimal coordinates that the element can be translated
                // while complies the restrictions.
                var x = Math.max(ra.x + dx, Math.min(ra.x + ra.width + dx - bbox.width, position.x + tx));
                var y = Math.max(ra.y + dy, Math.min(ra.y + ra.height + dy - bbox.height, position.y + ty));
                // recalculate the translation taking the restrictions into account.
                tx = x - position.x;
                ty = y - position.y;
            }

            var translatedPosition = {
                x: position.x + tx,
                y: position.y + ty
            };

            // To find out by how much an element was translated in event 'change:position' handlers.
            opt.tx = tx;
            opt.ty = ty;

            if (opt.transition) {

                if (!isObject(opt.transition)) { opt.transition = {}; }

                this.transition('position', translatedPosition, assign({}, opt.transition, {
                    valueFunction: interpolate.object
                }));

                // Recursively call `translate()` on all the embeds cells.
                invoke(this.getEmbeddedCells(), 'translate', tx, ty, opt);

            } else {

                this.startBatch('translate', opt);
                this.set('position', translatedPosition, opt);
                invoke(this.getEmbeddedCells(), 'translate', tx, ty, opt);
                this.stopBatch('translate', opt);
            }

            return this;
        },

        size: function(width, height, opt) {

            var currentSize = this.get('size');
            // Getter
            // () signature
            if (width === undefined) {
                return {
                    width: currentSize.width,
                    height: currentSize.height
                };
            }
            // Setter
            // (size, opt) signature
            if (isObject(width)) {
                opt = height;
                height = isNumber(width.height) ? width.height : currentSize.height;
                width = isNumber(width.width) ? width.width : currentSize.width;
            }

            return this.resize(width, height, opt);
        },

        resize: function(width, height, opt) {

            opt = opt || {};

            this.startBatch('resize', opt);

            if (opt.direction) {

                var currentSize = this.get('size');

                switch (opt.direction) {

                    case 'left':
                    case 'right':
                        // Don't change height when resizing horizontally.
                        height = currentSize.height;
                        break;

                    case 'top':
                    case 'bottom':
                        // Don't change width when resizing vertically.
                        width = currentSize.width;
                        break;
                }

                // Get the angle and clamp its value between 0 and 360 degrees.
                var angle = normalizeAngle(this.get('angle') || 0);

                var quadrant = {
                    'top-right': 0,
                    'right': 0,
                    'top-left': 1,
                    'top': 1,
                    'bottom-left': 2,
                    'left': 2,
                    'bottom-right': 3,
                    'bottom': 3
                }[opt.direction];

                if (opt.absolute) {

                    // We are taking the element's rotation into account
                    quadrant += Math.floor((angle + 45) / 90);
                    quadrant %= 4;
                }

                // This is a rectangle in size of the un-rotated element.
                var bbox = this.getBBox();

                // Pick the corner point on the element, which meant to stay on its place before and
                // after the rotation.
                var fixedPoint = bbox[['bottomLeft', 'corner', 'topRight', 'origin'][quadrant]]();

                // Find  an image of the previous indent point. This is the position, where is the
                // point actually located on the screen.
                var imageFixedPoint = Point(fixedPoint).rotate(bbox.center(), -angle);

                // Every point on the element rotates around a circle with the centre of rotation
                // in the middle of the element while the whole element is being rotated. That means
                // that the distance from a point in the corner of the element (supposed its always rect) to
                // the center of the element doesn't change during the rotation and therefore it equals
                // to a distance on un-rotated element.
                // We can find the distance as DISTANCE = (ELEMENTWIDTH/2)^2 + (ELEMENTHEIGHT/2)^2)^0.5.
                var radius = Math.sqrt((width * width) + (height * height)) / 2;

                // Now we are looking for an angle between x-axis and the line starting at image of fixed point
                // and ending at the center of the element. We call this angle `alpha`.

                // The image of a fixed point is located in n-th quadrant. For each quadrant passed
                // going anti-clockwise we have to add 90 degrees. Note that the first quadrant has index 0.
                //
                // 3 | 2
                // --c-- Quadrant positions around the element's center `c`
                // 0 | 1
                //
                var alpha = quadrant * Math.PI / 2;

                // Add an angle between the beginning of the current quadrant (line parallel with x-axis or y-axis
                // going through the center of the element) and line crossing the indent of the fixed point and the center
                // of the element. This is the angle we need but on the un-rotated element.
                alpha += Math.atan(quadrant % 2 == 0 ? height / width : width / height);

                // Lastly we have to deduct the original angle the element was rotated by and that's it.
                alpha -= toRad(angle);

                // With this angle and distance we can easily calculate the centre of the un-rotated element.
                // Note that fromPolar constructor accepts an angle in radians.
                var center = Point.fromPolar(radius, alpha, imageFixedPoint);

                // The top left corner on the un-rotated element has to be half a width on the left
                // and half a height to the top from the center. This will be the origin of rectangle
                // we were looking for.
                var origin = Point(center).offset(width / -2, height / -2);

                // Resize the element (before re-positioning it).
                this.set('size', { width: width, height: height }, opt);

                // Finally, re-position the element.
                this.position(origin.x, origin.y, opt);

            } else {

                // Resize the element.
                this.set('size', { width: width, height: height }, opt);
            }

            this.stopBatch('resize', opt);

            return this;
        },

        scale: function(sx, sy, origin, opt) {

            var scaledBBox = this.getBBox().scale(sx, sy, origin);
            this.startBatch('scale', opt);
            this.position(scaledBBox.x, scaledBBox.y, opt);
            this.resize(scaledBBox.width, scaledBBox.height, opt);
            this.stopBatch('scale');
            return this;
        },

        fitEmbeds: function(opt) {

            opt = opt || {};

            // Getting the children's size and position requires the collection.
            // Cell.get('embdes') helds an array of cell ids only.
            if (!this.graph) { throw new Error('Element must be part of a graph.'); }

            var embeddedCells = this.getEmbeddedCells();

            if (embeddedCells.length > 0) {

                this.startBatch('fit-embeds', opt);

                if (opt.deep) {
                    // Recursively apply fitEmbeds on all embeds first.
                    invoke(embeddedCells, 'fitEmbeds', opt);
                }

                // Compute cell's size and position  based on the children bbox
                // and given padding.
                var bbox = this.graph.getCellsBBox(embeddedCells);
                var padding = normalizeSides(opt.padding);

                // Apply padding computed above to the bbox.
                bbox.moveAndExpand({
                    x: -padding.left,
                    y: -padding.top,
                    width: padding.right + padding.left,
                    height: padding.bottom + padding.top
                });

                // Set new element dimensions finally.
                this.set({
                    position: { x: bbox.x, y: bbox.y },
                    size: { width: bbox.width, height: bbox.height }
                }, opt);

                this.stopBatch('fit-embeds');
            }

            return this;
        },

        // Rotate element by `angle` degrees, optionally around `origin` point.
        // If `origin` is not provided, it is considered to be the center of the element.
        // If `absolute` is `true`, the `angle` is considered is absolute, i.e. it is not
        // the difference from the previous angle.
        rotate: function(angle, absolute, origin, opt) {

            if (origin) {

                var center = this.getBBox().center();
                var size = this.get('size');
                var position = this.get('position');
                center.rotate(origin, this.get('angle') - angle);
                var dx = center.x - size.width / 2 - position.x;
                var dy = center.y - size.height / 2 - position.y;
                this.startBatch('rotate', { angle: angle, absolute: absolute, origin: origin });
                this.position(position.x + dx, position.y + dy, opt);
                this.rotate(angle, absolute, null, opt);
                this.stopBatch('rotate');

            } else {

                this.set('angle', absolute ? angle : (this.get('angle') + angle) % 360, opt);
            }

            return this;
        },

        angle: function() {
            return normalizeAngle(this.get('angle') || 0);
        },

        getBBox: function(opt) {

            opt = opt || {};

            if (opt.deep && this.graph) {

                // Get all the embedded elements using breadth first algorithm,
                // that doesn't use recursion.
                var elements = this.getEmbeddedCells({ deep: true, breadthFirst: true });
                // Add the model itself.
                elements.push(this);

                return this.graph.getCellsBBox(elements);
            }

            var position = this.get('position');
            var size = this.get('size');

            return new Rect(position.x, position.y, size.width, size.height);
        },

        getPointFromConnectedLink: function(link, endType) {
            // Center of the model
            var bbox = this.getBBox();
            var center = bbox.center();
            // Center of a port
            var endDef = link.get(endType);
            if (!endDef) { return center; }
            var portId = endDef.port;
            if (!portId) { return center; }
            var portGroup = this.portProp(portId, ['group']);
            var portsPositions = this.getPortsPositions(portGroup);
            var portCenter = new Point(portsPositions[portId]).offset(bbox.origin());
            var angle = this.angle();
            if (angle) { portCenter.rotate(center, -angle); }
            return portCenter;
        }
    });

    assign(Element$1.prototype, elementPortPrototype);

    var views = {};

    var View = Backbone.View.extend({

        options: {},
        theme: null,
        themeClassNamePrefix: addClassNamePrefix('theme-'),
        requireSetThemeOverride: false,
        defaultTheme: config.defaultTheme,
        children: null,
        childNodes: null,

        UPDATE_PRIORITY: 2,

        constructor: function(options) {

            this.requireSetThemeOverride = options && !!options.theme;
            this.options = assign({}, this.options, options);

            Backbone.View.call(this, options);
        },

        initialize: function() {

            views[this.cid] = this;

            this.setTheme(this.options.theme || this.defaultTheme);
            this.init();
        },

        unmount: function() {
            if (this.svgElement) {
                this.vel.remove();
            } else {
                this.$el.remove();
            }
        },

        renderChildren: function(children) {
            children || (children = result(this, 'children'));
            if (children) {
                var isSVG = this.svgElement;
                var namespace = V.namespace[isSVG ? 'svg' : 'xhtml'];
                var doc = parseDOMJSON(children, namespace);
                (isSVG ? this.vel : this.$el).empty().append(doc.fragment);
                this.childNodes = doc.selectors;
            }
            return this;
        },

        findAttribute: function(attributeName, node) {

            var currentNode = node;

            while (currentNode && currentNode.nodeType === 1) {
                var attributeValue = currentNode.getAttribute(attributeName);
                // attribute found
                if (attributeValue) { return attributeValue; }
                // do not climb up the DOM
                if (currentNode === this.el) { return null; }
                // try parent node
                currentNode = currentNode.parentNode;
            }

            return null;
        },

        // Override the Backbone `_ensureElement()` method in order to create an
        // svg element (e.g., `<g>`) node that wraps all the nodes of the Cell view.
        // Expose class name setter as a separate method.
        _ensureElement: function() {
            if (!this.el) {
                var tagName = result(this, 'tagName');
                var attrs = assign({}, result(this, 'attributes'));
                var style = assign({}, result(this, 'style'));
                if (this.id) { attrs.id = result(this, 'id'); }
                this.setElement(this._createElement(tagName));
                this._setAttributes(attrs);
                this._setStyle(style);
            } else {
                this.setElement(result(this, 'el'));
            }
            this._ensureElClassName();
        },

        _setAttributes: function(attrs) {
            if (this.svgElement) {
                this.vel.attr(attrs);
            } else {
                this.$el.attr(attrs);
            }
        },

        _setStyle: function(style) {
            this.$el.css(style);
        },

        _createElement: function(tagName) {
            if (this.svgElement) {
                return document.createElementNS(V.namespace.svg, tagName);
            } else {
                return document.createElement(tagName);
            }
        },

        // Utilize an alternative DOM manipulation API by
        // adding an element reference wrapped in Vectorizer.
        _setElement: function(el) {
            this.$el = el instanceof Backbone.$ ? el : Backbone.$(el);
            this.el = this.$el[0];
            if (this.svgElement) { this.vel = V(this.el); }
        },

        _ensureElClassName: function() {
            var className = result(this, 'className');
            if (!className) { return; }
            var prefixedClassName = addClassNamePrefix(className);
            // Note: className removal here kept for backwards compatibility only
            if (this.svgElement) {
                this.vel.removeClass(className).addClass(prefixedClassName);
            } else {
                this.$el.removeClass(className).addClass(prefixedClassName);
            }
        },

        init: function() {
            // Intentionally empty.
            // This method is meant to be overridden.
        },

        onRender: function() {
            // Intentionally empty.
            // This method is meant to be overridden.
        },

        confirmUpdate: function() {
            // Intentionally empty.
            // This method is meant to be overridden.
            return 0;
        },

        setTheme: function(theme, opt) {

            opt = opt || {};

            // Theme is already set, override is required, and override has not been set.
            // Don't set the theme.
            if (this.theme && this.requireSetThemeOverride && !opt.override) {
                return this;
            }

            this.removeThemeClassName();
            this.addThemeClassName(theme);
            this.onSetTheme(this.theme/* oldTheme */, theme/* newTheme */);
            this.theme = theme;

            return this;
        },

        addThemeClassName: function(theme) {

            theme = theme || this.theme;

            var className = this.themeClassNamePrefix + theme;

            if (this.svgElement) {
                this.vel.addClass(className);
            } else {
                this.$el.addClass(className);
            }

            return this;
        },

        removeThemeClassName: function(theme) {

            theme = theme || this.theme;

            var className = this.themeClassNamePrefix + theme;

            if (this.svgElement) {
                this.vel.removeClass(className);
            } else {
                this.$el.removeClass(className);
            }

            return this;
        },

        onSetTheme: function(oldTheme, newTheme) {
            // Intentionally empty.
            // This method is meant to be overridden.
        },

        remove: function() {

            this.onRemove();
            this.undelegateDocumentEvents();

            views[this.cid] = null;

            Backbone.View.prototype.remove.apply(this, arguments);

            return this;
        },

        onRemove: function() {
            // Intentionally empty.
            // This method is meant to be overridden.
        },

        getEventNamespace: function() {
            // Returns a per-session unique namespace
            return '.joint-event-ns-' + this.cid;
        },

        delegateElementEvents: function(element, events, data) {
            if (!events) { return this; }
            data || (data = {});
            var eventNS = this.getEventNamespace();
            for (var eventName in events) {
                var method = events[eventName];
                if (typeof method !== 'function') { method = this[method]; }
                if (!method) { continue; }
                $(element).on(eventName + eventNS, data, method.bind(this));
            }
            return this;
        },

        undelegateElementEvents: function(element) {
            $(element).off(this.getEventNamespace());
            return this;
        },

        delegateDocumentEvents: function(events, data) {
            events || (events = result(this, 'documentEvents'));
            return this.delegateElementEvents(document, events, data);
        },

        undelegateDocumentEvents: function() {
            return this.undelegateElementEvents(document);
        },

        eventData: function(evt, data) {
            if (!evt) { throw new Error('eventData(): event object required.'); }
            var currentData = evt.data;
            var key = '__' + this.cid + '__';
            if (data === undefined) {
                if (!currentData) { return {}; }
                return currentData[key] || {};
            }
            currentData || (currentData = evt.data = {});
            currentData[key] || (currentData[key] = {});
            assign(currentData[key], data);
            return this;
        },

        stopPropagation: function(evt) {
            this.eventData(evt, { propagationStopped: true });
            return this;
        },

        isPropagationStopped: function(evt) {
            return !!this.eventData(evt).propagationStopped;
        }

    }, {

        extend: function() {

            var args = Array.from(arguments);

            // Deep clone the prototype and static properties objects.
            // This prevents unexpected behavior where some properties are overwritten outside of this function.
            var protoProps = args[0] && assign({}, args[0]) || {};
            var staticProps = args[1] && assign({}, args[1]) || {};

            // Need the real render method so that we can wrap it and call it later.
            var renderFn = protoProps.render || (this.prototype && this.prototype.render) || null;

            /*
                Wrap the real render method so that:
                    .. `onRender` is always called.
                    .. `this` is always returned.
            */
            protoProps.render = function() {

                if (typeof renderFn === 'function') {
                    // Call the original render method.
                    renderFn.apply(this, arguments);
                }

                if (this.render.__render__ === renderFn) {
                    // Should always call onRender() method.
                    // Should call it only once when renderFn is actual prototype method i.e. not the wrapper
                    this.onRender();
                }

                // Should always return itself.
                return this;
            };

            protoProps.render.__render__ = renderFn;

            return Backbone.View.extend.call(this, protoProps, staticProps);
        }
    });

    var index$1 = ({
        views: views,
        View: View
    });

    // CellView base view and controller.
    // --------------------------------------------

    // This is the base view and controller for `ElementView` and `LinkView`.
    var CellView = View.extend({

        tagName: 'g',

        svgElement: true,

        selector: 'root',

        metrics: null,

        className: function() {

            var classNames = ['cell'];
            var type = this.model.get('type');

            if (type) {

                type.toLowerCase().split('.').forEach(function(value, index, list) {
                    classNames.push('type-' + list.slice(0, index + 1).join('-'));
                });
            }

            return classNames.join(' ');
        },

        _presentationAttributes: null,
        _flags: null,

        setFlags: function() {
            var flags = {};
            var attributes = {};
            var shift = 0;
            var i, n, label;
            var presentationAttributes = this.presentationAttributes;
            for (var attribute in presentationAttributes) {
                if (!presentationAttributes.hasOwnProperty(attribute)) { continue; }
                var labels = presentationAttributes[attribute];
                if (!Array.isArray(labels)) { labels = [labels]; }
                for (i = 0, n = labels.length; i < n; i++) {
                    label = labels[i];
                    var flag = flags[label];
                    if (!flag) {
                        flag = flags[label] = 1<<(shift++);
                    }
                    attributes[attribute] |= flag;
                }
            }
            var initFlag = this.initFlag;
            if (!Array.isArray(initFlag)) { initFlag = [initFlag]; }
            for (i = 0, n = initFlag.length; i < n; i++) {
                label = initFlag[i];
                if (!flags[label]) { flags[label] = 1<<(shift++); }
            }

            // 26 - 30 are reserved for paper flags
            // 31+ overflows maximal number
            if (shift > 25) { throw new Error('dia.CellView: Maximum number of flags exceeded.'); }

            this._flags = flags;
            this._presentationAttributes = attributes;
        },

        hasFlag: function(flag, label) {
            return flag & this.getFlag(label);
        },

        removeFlag: function(flag, label) {
            return flag ^ (flag & this.getFlag(label));
        },

        getFlag: function(label) {
            var flags = this._flags;
            if (!flags) { return 0; }
            var flag = 0;
            if (Array.isArray(label)) {
                for (var i = 0, n = label.length; i < n; i++) { flag |= flags[label[i]]; }
            } else {
                flag |= flags[label];
            }
            return flag;
        },

        attributes: function() {
            var cell = this.model;
            return {
                'model-id': cell.id,
                'data-type': cell.attributes.type
            };
        },

        constructor: function(options) {

            // Make sure a global unique id is assigned to this view. Store this id also to the properties object.
            // The global unique id makes sure that the same view can be rendered on e.g. different machines and
            // still be associated to the same object among all those clients. This is necessary for real-time
            // collaboration mechanism.
            options.id = options.id || guid(this);

            View.call(this, options);
        },

        initialize: function() {

            this.setFlags();

            View.prototype.initialize.apply(this, arguments);

            this.cleanNodesCache();

            // Store reference to this to the <g> DOM element so that the view is accessible through the DOM tree.
            this.$el.data('view', this);

            this.startListening();
        },

        startListening: function() {
            this.listenTo(this.model, 'change', this.onAttributesChange);
        },

        onAttributesChange: function(model, opt) {
            var flag = model.getChangeFlag(this._presentationAttributes);
            if (opt.updateHandled || !flag) { return; }
            if (opt.dirty && this.hasFlag(flag, 'UPDATE')) { flag |= this.getFlag('RENDER'); }
            // TODO: tool changes does not need to be sync
            // Fix Segments tools
            if (opt.tool) { opt.async = false; }
            var paper = this.paper;
            if (paper) { paper.requestViewUpdate(this, flag, this.UPDATE_PRIORITY, opt); }
        },

        parseDOMJSON: function(markup, root) {

            var doc = parseDOMJSON(markup);
            var selectors = doc.selectors;
            var groups = doc.groupSelectors;
            for (var group in groups) {
                if (selectors[group]) { throw new Error('dia.CellView: ambiguous group selector'); }
                selectors[group] = groups[group];
            }
            if (root) {
                var rootSelector = this.selector;
                if (selectors[rootSelector]) { throw new Error('dia.CellView: ambiguous root selector.'); }
                selectors[rootSelector] = root;
            }
            return { fragment: doc.fragment, selectors: selectors };
        },

        // Return `true` if cell link is allowed to perform a certain UI `feature`.
        // Example: `can('vertexMove')`, `can('labelMove')`.
        can: function(feature) {

            var interactive = isFunction(this.options.interactive)
                ? this.options.interactive(this)
                : this.options.interactive;

            return (isObject(interactive) && interactive[feature] !== false) ||
                (isBoolean(interactive) && interactive !== false);
        },

        findBySelector: function(selector, root, selectors) {

            root || (root = this.el);
            selectors || (selectors = this.selectors);

            // These are either descendants of `this.$el` of `this.$el` itself.
            // `.` is a special selector used to select the wrapping `<g>` element.
            if (!selector || selector === '.') { return [root]; }
            if (selectors) {
                var nodes = selectors[selector];
                if (nodes) {
                    if (Array.isArray(nodes)) { return nodes; }
                    return [nodes];
                }
            }

            // Maintaining backwards compatibility
            // e.g. `circle:first` would fail with querySelector() call
            if (config.useCSSSelectors) { return $(root).find(selector).toArray(); }

            return [];
        },

        notify: function(eventName) {

            if (this.paper) {

                var args = Array.prototype.slice.call(arguments, 1);

                // Trigger the event on both the element itself and also on the paper.
                this.trigger.apply(this, [eventName].concat(args));

                // Paper event handlers receive the view object as the first argument.
                this.paper.trigger.apply(this.paper, [eventName, this].concat(args));
            }
        },

        getBBox: function(opt) {

            var bbox;
            if (opt && opt.useModelGeometry) {
                var model = this.model;
                bbox = model.getBBox().bbox(model.angle());
            } else {
                bbox = this.getNodeBBox(this.el);
            }

            return this.paper.localToPaperRect(bbox);
        },

        getNodeBBox: function(magnet) {

            var rect$$1 = this.getNodeBoundingRect(magnet);
            var magnetMatrix = this.getNodeMatrix(magnet);
            var translateMatrix = this.getRootTranslateMatrix();
            var rotateMatrix = this.getRootRotateMatrix();
            return V.transformRect(rect$$1, translateMatrix.multiply(rotateMatrix).multiply(magnetMatrix));
        },

        getNodeUnrotatedBBox: function(magnet) {

            var rect$$1 = this.getNodeBoundingRect(magnet);
            var magnetMatrix = this.getNodeMatrix(magnet);
            var translateMatrix = this.getRootTranslateMatrix();
            return V.transformRect(rect$$1, translateMatrix.multiply(magnetMatrix));
        },

        getRootTranslateMatrix: function() {

            var model = this.model;
            var position = model.position();
            var mt = V.createSVGMatrix().translate(position.x, position.y);
            return mt;
        },

        getRootRotateMatrix: function() {

            var mr = V.createSVGMatrix();
            var model = this.model;
            var angle = model.angle();
            if (angle) {
                var bbox = model.getBBox();
                var cx = bbox.width / 2;
                var cy = bbox.height / 2;
                mr = mr.translate(cx, cy).rotate(angle).translate(-cx, -cy);
            }
            return mr;
        },

        highlight: function(el, opt) {

            el = !el ? this.el : this.$(el)[0] || this.el;

            // set partial flag if the highlighted element is not the entire view.
            opt = opt || {};
            opt.partial = (el !== this.el);

            this.notify('cell:highlight', el, opt);
            return this;
        },

        unhighlight: function(el, opt) {

            el = !el ? this.el : this.$(el)[0] || this.el;

            opt = opt || {};
            opt.partial = el != this.el;

            this.notify('cell:unhighlight', el, opt);
            return this;
        },

        // Find the closest element that has the `magnet` attribute set to `true`. If there was not such
        // an element found, return the root element of the cell view.
        findMagnet: function(el) {

            var $el = this.$(el);
            var $rootEl = this.$el;

            if ($el.length === 0) {
                $el = $rootEl;
            }

            do {

                var magnet = $el.attr('magnet');
                if ((magnet || $el.is($rootEl)) && magnet !== 'false') {
                    return $el[0];
                }

                $el = $el.parent();

            } while ($el.length > 0);

            // If the overall cell has set `magnet === false`, then return `undefined` to
            // announce there is no magnet found for this cell.
            // This is especially useful to set on cells that have 'ports'. In this case,
            // only the ports have set `magnet === true` and the overall element has `magnet === false`.
            return undefined;
        },

        // Construct a unique selector for the `el` element within this view.
        // `prevSelector` is being collected through the recursive call.
        // No value for `prevSelector` is expected when using this method.
        getSelector: function(el, prevSelector) {

            var selector;

            if (el === this.el) {
                if (typeof prevSelector === 'string') { selector = '> ' + prevSelector; }
                return selector;
            }

            if (el) {

                var nthChild = V(el).index() + 1;
                selector = el.tagName + ':nth-child(' + nthChild + ')';

                if (prevSelector) {
                    selector += ' > ' + prevSelector;
                }

                selector = this.getSelector(el.parentNode, selector);
            }

            return selector;
        },

        getLinkEnd: function(magnet, x, y, link, endType) {

            var model = this.model;
            var id = model.id;
            var port = this.findAttribute('port', magnet);
            // Find a unique `selector` of the element under pointer that is a magnet.
            var selector = magnet.getAttribute('joint-selector');

            var end = { id: id };
            if (selector != null) { end.magnet = selector; }
            if (port != null) {
                end.port = port;
                if (!model.hasPort(port) && !selector) {
                    // port created via the `port` attribute (not API)
                    end.selector = this.getSelector(magnet);
                }
            } else if (selector == null && this.el !== magnet) {
                end.selector = this.getSelector(magnet);
            }

            var paper = this.paper;
            var connectionStrategy = paper.options.connectionStrategy;
            if (typeof connectionStrategy === 'function') {
                var strategy = connectionStrategy.call(paper, end, this, magnet, new Point(x, y), link, endType, paper);
                if (strategy) { end = strategy; }
            }

            return end;
        },

        getMagnetFromLinkEnd: function(end) {

            var root = this.el;
            var port = end.port;
            var selector = end.magnet;
            var model = this.model;
            var magnet;
            if (port != null && model.isElement() && model.hasPort(port)) {
                magnet = this.findPortNode(port, selector) || root;
            } else {
                if (!selector) { selector = end.selector; }
                if (!selector && port != null) {
                    // link end has only `id` and `port` property referencing
                    // a port created via the `port` attribute (not API).
                    selector = '[port="' + port + '"]';
                }
                magnet = this.findBySelector(selector, root, this.selectors)[0];
            }

            return magnet;
        },

        getAttributeDefinition: function(attrName) {

            return this.model.constructor.getAttributeDefinition(attrName);
        },

        setNodeAttributes: function(node, attrs) {

            if (!isEmpty(attrs)) {
                if (node instanceof SVGElement) {
                    V(node).attr(attrs);
                } else {
                    $(node).attr(attrs);
                }
            }
        },

        processNodeAttributes: function(node, attrs) {

            var attrName, attrVal, def, i, n;
            var normalAttrs, setAttrs, positionAttrs, offsetAttrs;
            var relatives = [];
            // divide the attributes between normal and special
            for (attrName in attrs) {
                if (!attrs.hasOwnProperty(attrName)) { continue; }
                attrVal = attrs[attrName];
                def = this.getAttributeDefinition(attrName);
                if (def && (!isFunction(def.qualify) || def.qualify.call(this, attrVal, node, attrs))) {
                    if (isString(def.set)) {
                        normalAttrs || (normalAttrs = {});
                        normalAttrs[def.set] = attrVal;
                    }
                    if (attrVal !== null) {
                        relatives.push(attrName, def);
                    }
                } else {
                    normalAttrs || (normalAttrs = {});
                    normalAttrs[toKebabCase(attrName)] = attrVal;
                }
            }

            // handle the rest of attributes via related method
            // from the special attributes namespace.
            for (i = 0, n = relatives.length; i < n; i+=2) {
                attrName = relatives[i];
                def = relatives[i+1];
                attrVal = attrs[attrName];
                if (isFunction(def.set)) {
                    setAttrs || (setAttrs = {});
                    setAttrs[attrName] = attrVal;
                }
                if (isFunction(def.position)) {
                    positionAttrs || (positionAttrs = {});
                    positionAttrs[attrName] = attrVal;
                }
                if (isFunction(def.offset)) {
                    offsetAttrs || (offsetAttrs = {});
                    offsetAttrs[attrName] = attrVal;
                }
            }

            return {
                raw: attrs,
                normal: normalAttrs,
                set: setAttrs,
                position: positionAttrs,
                offset: offsetAttrs
            };
        },

        updateRelativeAttributes: function(node, attrs, refBBox, opt) {

            opt || (opt = {});

            var attrName, attrVal, def;
            var rawAttrs = attrs.raw || {};
            var nodeAttrs = attrs.normal || {};
            var setAttrs = attrs.set;
            var positionAttrs = attrs.position;
            var offsetAttrs = attrs.offset;

            for (attrName in setAttrs) {
                attrVal = setAttrs[attrName];
                def = this.getAttributeDefinition(attrName);
                // SET - set function should return attributes to be set on the node,
                // which will affect the node dimensions based on the reference bounding
                // box. e.g. `width`, `height`, `d`, `rx`, `ry`, `points
                var setResult = def.set.call(this, attrVal, refBBox.clone(), node, rawAttrs);
                if (isObject(setResult)) {
                    assign(nodeAttrs, setResult);
                } else if (setResult !== undefined) {
                    nodeAttrs[attrName] = setResult;
                }
            }

            if (node instanceof HTMLElement) {
                // TODO: setting the `transform` attribute on HTMLElements
                // via `node.style.transform = 'matrix(...)';` would introduce
                // a breaking change (e.g. basic.TextBlock).
                this.setNodeAttributes(node, nodeAttrs);
                return;
            }

            // The final translation of the subelement.
            var nodeTransform = nodeAttrs.transform;
            var nodeMatrix = V.transformStringToMatrix(nodeTransform);
            var nodePosition = Point(nodeMatrix.e, nodeMatrix.f);
            if (nodeTransform) {
                nodeAttrs = omit(nodeAttrs, 'transform');
                nodeMatrix.e = nodeMatrix.f = 0;
            }

            // Calculate node scale determined by the scalable group
            // only if later needed.
            var sx, sy, translation;
            if (positionAttrs || offsetAttrs) {
                var nodeScale = this.getNodeScale(node, opt.scalableNode);
                sx = nodeScale.sx;
                sy = nodeScale.sy;
            }

            var positioned = false;
            for (attrName in positionAttrs) {
                attrVal = positionAttrs[attrName];
                def = this.getAttributeDefinition(attrName);
                // POSITION - position function should return a point from the
                // reference bounding box. The default position of the node is x:0, y:0 of
                // the reference bounding box or could be further specify by some
                // SVG attributes e.g. `x`, `y`
                translation = def.position.call(this, attrVal, refBBox.clone(), node, rawAttrs);
                if (translation) {
                    nodePosition.offset(Point(translation).scale(sx, sy));
                    positioned || (positioned = true);
                }
            }

            // The node bounding box could depend on the `size` set from the previous loop.
            // Here we know, that all the size attributes have been already set.
            this.setNodeAttributes(node, nodeAttrs);

            var offseted = false;
            if (offsetAttrs) {
                // Check if the node is visible
                var nodeBoundingRect = this.getNodeBoundingRect(node);
                if (nodeBoundingRect.width > 0 && nodeBoundingRect.height > 0) {
                    var nodeBBox = V.transformRect(nodeBoundingRect, nodeMatrix).scale(1 / sx, 1 / sy);
                    for (attrName in offsetAttrs) {
                        attrVal = offsetAttrs[attrName];
                        def = this.getAttributeDefinition(attrName);
                        // OFFSET - offset function should return a point from the element
                        // bounding box. The default offset point is x:0, y:0 (origin) or could be further
                        // specify with some SVG attributes e.g. `text-anchor`, `cx`, `cy`
                        translation = def.offset.call(this, attrVal, nodeBBox, node, rawAttrs);
                        if (translation) {
                            nodePosition.offset(Point(translation).scale(sx, sy));
                            offseted || (offseted = true);
                        }
                    }
                }
            }

            // Do not touch node's transform attribute if there is no transformation applied.
            if (nodeTransform !== undefined || positioned || offseted) {
                // Round the coordinates to 1 decimal point.
                nodePosition.round(1);
                nodeMatrix.e = nodePosition.x;
                nodeMatrix.f = nodePosition.y;
                node.setAttribute('transform', V.matrixToTransformString(nodeMatrix));
                // TODO: store nodeMatrix metrics?
            }
        },

        getNodeScale: function(node, scalableNode) {

            // Check if the node is a descendant of the scalable group.
            var sx, sy;
            if (scalableNode && scalableNode.contains(node)) {
                var scale$$1 = scalableNode.scale();
                sx = 1 / scale$$1.sx;
                sy = 1 / scale$$1.sy;
            } else {
                sx = 1;
                sy = 1;
            }

            return { sx: sx, sy: sy };
        },

        cleanNodesCache: function() {
            this.metrics = {};
        },

        nodeCache: function(magnet) {

            var metrics = this.metrics;
            // Don't use cache? It most likely a custom view with overridden update.
            if (!metrics) { return {}; }
            var id = V.ensureId(magnet);
            var value = metrics[id];
            if (!value) { value = metrics[id] = {}; }
            return value;
        },

        getNodeData: function(magnet) {

            var metrics = this.nodeCache(magnet);
            if (!metrics.data) { metrics.data = {}; }
            return metrics.data;
        },

        getNodeBoundingRect: function(magnet) {

            var metrics = this.nodeCache(magnet);
            if (metrics.boundingRect === undefined) { metrics.boundingRect = V(magnet).getBBox(); }
            return new Rect(metrics.boundingRect);
        },

        getNodeMatrix: function(magnet) {

            var metrics = this.nodeCache(magnet);
            if (metrics.magnetMatrix === undefined) {
                var target = this.rotatableNode || this.el;
                metrics.magnetMatrix = V(magnet).getTransformToElement(target);
            }
            return V.createSVGMatrix(metrics.magnetMatrix);
        },

        getNodeShape: function(magnet) {

            var metrics = this.nodeCache(magnet);
            if (metrics.geometryShape === undefined) { metrics.geometryShape = V(magnet).toGeometryShape(); }
            return metrics.geometryShape.clone();
        },

        isNodeConnection: function(node) {
            return this.model.isLink() && (!node || node === this.el);
        },

        findNodesAttributes: function(attrs, root, selectorCache, selectors) {

            var i, n, nodeAttrs, nodeId;
            var nodesAttrs = {};
            var mergeIds = [];
            for (var selector in attrs) {
                if (!attrs.hasOwnProperty(selector)) { continue; }
                var selected = selectorCache[selector] = this.findBySelector(selector, root, selectors);
                for (i = 0, n = selected.length; i < n; i++) {
                    var node = selected[i];
                    nodeId = V.ensureId(node);
                    nodeAttrs = attrs[selector];
                    // "unique" selectors are selectors that referencing a single node (defined by `selector`)
                    // groupSelector referencing a single node is not "unique"
                    var unique = (selectors && selectors[selector] === node);
                    var prevNodeAttrs = nodesAttrs[nodeId];
                    if (prevNodeAttrs) {
                        // Note, that nodes referenced by deprecated `CSS selectors` are not taken into account.
                        // e.g. css:`.circle` and selector:`circle` can be applied in a random order
                        if (!prevNodeAttrs.array) {
                            mergeIds.push(nodeId);
                            prevNodeAttrs.array = true;
                            prevNodeAttrs.attributes = [prevNodeAttrs.attributes];
                            prevNodeAttrs.selectedLength = [prevNodeAttrs.selectedLength];
                        }
                        var attributes = prevNodeAttrs.attributes;
                        var selectedLength = prevNodeAttrs.selectedLength;
                        if (unique) {
                            // node referenced by `selector`
                            attributes.unshift(nodeAttrs);
                            selectedLength.unshift(-1);
                        } else {
                            // node referenced by `groupSelector`
                            var sortIndex = sortedIndex(selectedLength, n);
                            attributes.splice(sortIndex, 0, nodeAttrs);
                            selectedLength.splice(sortIndex, 0, n);
                        }
                    } else {
                        nodesAttrs[nodeId] = {
                            attributes: nodeAttrs,
                            selectedLength: unique ? -1 : n,
                            node: node,
                            array: false
                        };
                    }
                }
            }

            for (i = 0, n = mergeIds.length; i < n; i++) {
                nodeId = mergeIds[i];
                nodeAttrs = nodesAttrs[nodeId];
                nodeAttrs.attributes = merge.apply(void 0, [ {} ].concat( nodeAttrs.attributes.reverse() ));
            }

            return nodesAttrs;
        },

        getEventTarget: function(evt, opt) {
            if ( opt === void 0 ) opt = {};

            // Touchmove/Touchend event's target is not reflecting the element under the coordinates as mousemove does.
            // It holds the element when a touchstart triggered.
            var target = evt.target;
            var type = evt.type;
            var clientX = evt.clientX; if ( clientX === void 0 ) clientX = 0;
            var clientY = evt.clientY; if ( clientY === void 0 ) clientY = 0;
            if (opt.fromPoint || type === 'touchmove' || type === 'touchend') {
                return document.elementFromPoint(clientX, clientY);
            }

            return target;
        },

        // Default is to process the `model.attributes.attrs` object and set attributes on subelements based on the selectors,
        // unless `attrs` parameter was passed.
        updateDOMSubtreeAttributes: function(rootNode, attrs, opt) {

            opt || (opt = {});
            opt.rootBBox || (opt.rootBBox = Rect());
            opt.selectors || (opt.selectors = this.selectors); // selector collection to use

            // Cache table for query results and bounding box calculation.
            // Note that `selectorCache` needs to be invalidated for all
            // `updateAttributes` calls, as the selectors might pointing
            // to nodes designated by an attribute or elements dynamically
            // created.
            var selectorCache = {};
            var bboxCache = {};
            var relativeItems = [];
            var item, node, nodeAttrs, nodeData, processedAttrs;

            var roAttrs = opt.roAttributes;
            var nodesAttrs = this.findNodesAttributes(roAttrs || attrs, rootNode, selectorCache, opt.selectors);
            // `nodesAttrs` are different from all attributes, when
            // rendering only  attributes sent to this method.
            var nodesAllAttrs = (roAttrs)
                ? this.findNodesAttributes(attrs, rootNode, selectorCache, opt.selectors)
                : nodesAttrs;

            for (var nodeId in nodesAttrs) {
                nodeData = nodesAttrs[nodeId];
                nodeAttrs = nodeData.attributes;
                node = nodeData.node;
                processedAttrs = this.processNodeAttributes(node, nodeAttrs);

                if (!processedAttrs.set && !processedAttrs.position && !processedAttrs.offset) {
                    // Set all the normal attributes right on the SVG/HTML element.
                    this.setNodeAttributes(node, processedAttrs.normal);

                } else {

                    var nodeAllAttrs = nodesAllAttrs[nodeId] && nodesAllAttrs[nodeId].attributes;
                    var refSelector = (nodeAllAttrs && (nodeAttrs.ref === undefined))
                        ? nodeAllAttrs.ref
                        : nodeAttrs.ref;

                    var refNode;
                    if (refSelector) {
                        refNode = (selectorCache[refSelector] || this.findBySelector(refSelector, rootNode, opt.selectors))[0];
                        if (!refNode) {
                            throw new Error('dia.ElementView: "' + refSelector + '" reference does not exist.');
                        }
                    } else {
                        refNode = null;
                    }

                    item = {
                        node: node,
                        refNode: refNode,
                        processedAttributes: processedAttrs,
                        allAttributes: nodeAllAttrs
                    };

                    // If an element in the list is positioned relative to this one, then
                    // we want to insert this one before it in the list.
                    var itemIndex = relativeItems.findIndex(function(item) {
                        return item.refNode === node;
                    });

                    if (itemIndex > -1) {
                        relativeItems.splice(itemIndex, 0, item);
                    } else {
                        relativeItems.push(item);
                    }
                }
            }

            var rotatableMatrix;
            for (var i = 0, n = relativeItems.length; i < n; i++) {
                item = relativeItems[i];
                node = item.node;
                refNode = item.refNode;

                // Find the reference element bounding box. If no reference was provided, we
                // use the optional bounding box.
                var vRotatable = V(opt.rotatableNode);
                var refNodeId = refNode ? V.ensureId(refNode) : '';
                var isRefNodeRotatable = !!vRotatable && !!refNode && vRotatable.contains(refNode);
                var unrotatedRefBBox = bboxCache[refNodeId];
                if (!unrotatedRefBBox) {
                    // Get the bounding box of the reference element relative to the `rotatable` `<g>` (without rotation)
                    // or to the root `<g>` element if no rotatable group present if reference node present.
                    // Uses the bounding box provided.
                    var transformationTarget = (isRefNodeRotatable) ? vRotatable : rootNode;
                    unrotatedRefBBox = bboxCache[refNodeId] = (refNode)
                        ? V(refNode).getBBox({ target: transformationTarget })
                        : opt.rootBBox;
                }

                if (roAttrs) {
                    // if there was a special attribute affecting the position amongst passed-in attributes
                    // we have to merge it with the rest of the element's attributes as they are necessary
                    // to update the position relatively (i.e `ref-x` && 'ref-dx')
                    processedAttrs = this.processNodeAttributes(node, item.allAttributes);
                    this.mergeProcessedAttributes(processedAttrs, item.processedAttributes);

                } else {
                    processedAttrs = item.processedAttributes;
                }

                var refBBox = unrotatedRefBBox;
                if (isRefNodeRotatable && !vRotatable.contains(node)) {
                    // if the referenced node is inside the rotatable group while the updated node is outside,
                    // we need to take the rotatable node transformation into account
                    if (!rotatableMatrix) { rotatableMatrix = V.transformStringToMatrix(vRotatable.attr('transform')); }
                    refBBox = V.transformRect(unrotatedRefBBox, rotatableMatrix);
                }

                this.updateRelativeAttributes(node, processedAttrs, refBBox, opt);
            }
        },

        mergeProcessedAttributes: function(processedAttrs, roProcessedAttrs) {

            processedAttrs.set || (processedAttrs.set = {});
            processedAttrs.position || (processedAttrs.position = {});
            processedAttrs.offset || (processedAttrs.offset = {});

            assign(processedAttrs.set, roProcessedAttrs.set);
            assign(processedAttrs.position, roProcessedAttrs.position);
            assign(processedAttrs.offset, roProcessedAttrs.offset);

            // Handle also the special transform property.
            var transform = processedAttrs.normal && processedAttrs.normal.transform;
            if (transform !== undefined && roProcessedAttrs.normal) {
                roProcessedAttrs.normal.transform = transform;
            }
            processedAttrs.normal = roProcessedAttrs.normal;
        },

        onRemove: function() {
            this.removeTools();
        },

        _toolsView: null,

        hasTools: function(name) {
            var toolsView = this._toolsView;
            if (!toolsView) { return false; }
            if (!name) { return true; }
            return (toolsView.getName() === name);
        },

        addTools: function(toolsView) {

            this.removeTools();

            if (toolsView) {
                this._toolsView = toolsView;
                toolsView.configure({ relatedView: this });
                toolsView.listenTo(this.paper, 'tools:event', this.onToolEvent.bind(this));
                toolsView.mount();
            }
            return this;
        },

        updateTools: function(opt) {

            var toolsView = this._toolsView;
            if (toolsView) { toolsView.update(opt); }
            return this;
        },

        removeTools: function() {

            var toolsView = this._toolsView;
            if (toolsView) {
                toolsView.remove();
                this._toolsView = null;
            }
            return this;
        },

        hideTools: function() {

            var toolsView = this._toolsView;
            if (toolsView) { toolsView.hide(); }
            return this;
        },

        showTools: function() {

            var toolsView = this._toolsView;
            if (toolsView) { toolsView.show(); }
            return this;
        },

        onToolEvent: function(event) {
            switch (event) {
                case 'remove':
                    this.removeTools();
                    break;
                case 'hide':
                    this.hideTools();
                    break;
                case 'show':
                    this.showTools();
                    break;
            }
        },

        // Interaction. The controller part.
        // ---------------------------------

        // Interaction is handled by the paper and delegated to the view in interest.
        // `x` & `y` parameters passed to these functions represent the coordinates already snapped to the paper grid.
        // If necessary, real coordinates can be obtained from the `evt` event object.

        // These functions are supposed to be overriden by the views that inherit from `joint.dia.Cell`,
        // i.e. `joint.dia.Element` and `joint.dia.Link`.

        pointerdblclick: function(evt, x, y) {

            this.notify('cell:pointerdblclick', evt, x, y);
        },

        pointerclick: function(evt, x, y) {

            this.notify('cell:pointerclick', evt, x, y);
        },

        contextmenu: function(evt, x, y) {

            this.notify('cell:contextmenu', evt, x, y);
        },

        pointerdown: function(evt, x, y) {

            if (this.model.graph) {
                this.model.startBatch('pointer');
                this._graph = this.model.graph;
            }

            this.notify('cell:pointerdown', evt, x, y);
        },

        pointermove: function(evt, x, y) {

            this.notify('cell:pointermove', evt, x, y);
        },

        pointerup: function(evt, x, y) {

            this.notify('cell:pointerup', evt, x, y);

            if (this._graph) {
                // we don't want to trigger event on model as model doesn't
                // need to be member of collection anymore (remove)
                this._graph.stopBatch('pointer', { cell: this.model });
                delete this._graph;
            }
        },

        mouseover: function(evt) {

            this.notify('cell:mouseover', evt);
        },

        mouseout: function(evt) {

            this.notify('cell:mouseout', evt);
        },

        mouseenter: function(evt) {

            this.notify('cell:mouseenter', evt);
        },

        mouseleave: function(evt) {

            this.notify('cell:mouseleave', evt);
        },

        mousewheel: function(evt, x, y, delta) {

            this.notify('cell:mousewheel', evt, x, y, delta);
        },

        onevent: function(evt, eventName, x, y) {

            this.notify(eventName, evt, x, y);
        },

        onmagnet: function() {

            // noop
        },

        magnetpointerdblclick: function() {

            // noop
        },

        magnetcontextmenu: function() {

            // noop
        },

        checkMouseleave: function checkMouseleave(evt) {
            var ref = this;
            var paper = ref.paper;
            if (paper.isAsync()) {
                // Do the updates of the current view synchronously now
                paper.dumpView(this);
            }
            var target = this.getEventTarget(evt, { fromPoint: true });
            var view = paper.findView(target);
            if (view === this) { return; }
            // Leaving the current view
            this.mouseleave(evt);
            if (!view) { return; }
            // Entering another view
            view.mouseenter(evt);
        },

        setInteractivity: function(value) {

            this.options.interactive = value;
        }
    }, {

        addPresentationAttributes: function(presentationAttributes) {
            return merge({}, this.prototype.presentationAttributes, presentationAttributes, function(a, b) {
                if (!a || !b) { return; }
                if (typeof a === 'string') { a = [a]; }
                if (typeof b === 'string') { b = [b]; }
                if (Array.isArray(a) && Array.isArray(b)) { return uniq(a.concat(b)); }
            });
        }
    });

    // Element base view and controller.
    // -------------------------------------------

    var ElementView = CellView.extend({

        /**
         * @abstract
         */
        _removePorts: function() {
            // implemented in ports.js
        },

        /**
         *
         * @abstract
         */
        _renderPorts: function() {
            // implemented in ports.js
        },

        className: function() {

            var classNames = CellView.prototype.className.apply(this).split(' ');

            classNames.push('element');

            return classNames.join(' ');
        },

        initialize: function() {

            CellView.prototype.initialize.apply(this, arguments);

            this._initializePorts();
        },

        presentationAttributes: {
            'attrs': ['UPDATE'],
            'position': ['TRANSLATE'],
            'size': ['RESIZE', 'PORTS'],
            'angle': ['ROTATE'],
            'markup': ['RENDER'],
            'ports': ['PORTS']
        },

        initFlag: ['RENDER'],

        UPDATE_PRIORITY: 0,

        confirmUpdate: function(flag, opt) {
            var useCSSSelectors = config.useCSSSelectors;
            if (this.hasFlag(flag, 'PORTS')) {
                this._removePorts();
                this._cleanPortsCache();
            }
            if (this.hasFlag(flag, 'RENDER')) {
                this.render();
                flag = this.removeFlag(flag, ['RENDER', 'UPDATE', 'RESIZE', 'TRANSLATE', 'ROTATE', 'PORTS']);
                return flag;
            }
            if (this.hasFlag(flag, 'RESIZE')) {
                this.resize(opt);
                // Resize method is calling `update()` internally
                flag = this.removeFlag(flag, ['RESIZE', 'UPDATE']);
            }
            if (this.hasFlag(flag, 'UPDATE')) {
                this.update(this.model, null, opt);
                flag = this.removeFlag(flag, 'UPDATE');
                if (useCSSSelectors) {
                    // `update()` will render ports when useCSSSelectors are enabled
                    flag = this.removeFlag(flag, 'PORTS');
                }
            }
            if (this.hasFlag(flag, 'TRANSLATE')) {
                this.translate();
                flag = this.removeFlag(flag, 'TRANSLATE');
            }
            if (this.hasFlag(flag, 'ROTATE')) {
                this.rotate();
                flag = this.removeFlag(flag, 'ROTATE');
            }
            if (this.hasFlag(flag, 'PORTS')) {
                this._renderPorts();
                flag = this.removeFlag(flag, 'PORTS');
            }
            return flag;
        },

        /**
         * @abstract
         */
        _initializePorts: function() {

        },

        update: function(_$$1, renderingOnlyAttrs) {

            this.cleanNodesCache();

            // When CSS selector strings are used, make sure no rule matches port nodes.
            var useCSSSelectors = config.useCSSSelectors;
            if (useCSSSelectors) { this._removePorts(); }

            var model = this.model;
            var modelAttrs = model.attr();
            this.updateDOMSubtreeAttributes(this.el, modelAttrs, {
                rootBBox: new Rect(model.size()),
                selectors: this.selectors,
                scalableNode: this.scalableNode,
                rotatableNode: this.rotatableNode,
                // Use rendering only attributes if they differs from the model attributes
                roAttributes: (renderingOnlyAttrs === modelAttrs) ? null : renderingOnlyAttrs
            });

            if (useCSSSelectors) { this._renderPorts(); }
        },

        rotatableSelector: 'rotatable',
        scalableSelector: 'scalable',
        scalableNode: null,
        rotatableNode: null,

        // `prototype.markup` is rendered by default. Set the `markup` attribute on the model if the
        // default markup is not desirable.
        renderMarkup: function() {

            var element = this.model;
            var markup = element.get('markup') || element.markup;
            if (!markup) { throw new Error('dia.ElementView: markup required'); }
            if (Array.isArray(markup)) { return this.renderJSONMarkup(markup); }
            if (typeof markup === 'string') { return this.renderStringMarkup(markup); }
            throw new Error('dia.ElementView: invalid markup');
        },

        renderJSONMarkup: function(markup) {

            var doc = this.parseDOMJSON(markup, this.el);
            var selectors = this.selectors = doc.selectors;
            this.rotatableNode = V(selectors[this.rotatableSelector]) || null;
            this.scalableNode = V(selectors[this.scalableSelector]) || null;
            // Fragment
            this.vel.append(doc.fragment);
        },

        renderStringMarkup: function(markup) {

            var vel = this.vel;
            vel.append(V(markup));
            // Cache transformation groups
            this.rotatableNode = vel.findOne('.rotatable');
            this.scalableNode = vel.findOne('.scalable');

            var selectors = this.selectors = {};
            selectors[this.selector] = this.el;
        },

        render: function() {

            this.vel.empty();
            this.renderMarkup();
            if (this.scalableNode) {
                // Double update is necessary for elements with the scalable group only
                // Note the resize() triggers the other `update`.
                this.update();
            }
            this.resize();
            if (this.rotatableNode) {
                // Translate transformation is applied on `this.el` while the rotation transformation
                // on `this.rotatableNode`
                this.rotate();
                this.translate();
            } else {
                this.updateTransformation();
            }
            if (!config.useCSSSelectors) { this._renderPorts(); }
            return this;
        },

        resize: function(opt) {

            if (this.scalableNode) { return this.sgResize(opt); }
            if (this.model.attributes.angle) { this.rotate(); }
            this.update();
        },

        translate: function() {

            if (this.rotatableNode) { return this.rgTranslate(); }
            this.updateTransformation();
        },

        rotate: function() {

            if (this.rotatableNode) {
                this.rgRotate();
                // It's necessary to call the update for the nodes outside
                // the rotatable group referencing nodes inside the group
                this.update();
                return;
            }
            this.updateTransformation();
        },

        updateTransformation: function() {

            var transformation = this.getTranslateString();
            var rotateString = this.getRotateString();
            if (rotateString) { transformation += ' ' + rotateString; }
            this.vel.attr('transform', transformation);
        },

        getTranslateString: function() {

            var position = this.model.attributes.position;
            return 'translate(' + position.x + ',' + position.y + ')';
        },

        getRotateString: function() {
            var attributes = this.model.attributes;
            var angle = attributes.angle;
            if (!angle) { return null; }
            var size = attributes.size;
            return 'rotate(' + angle + ',' + (size.width / 2) + ',' + (size.height / 2) + ')';
        },

        // Rotatable & Scalable Group
        // always slower, kept mainly for backwards compatibility

        rgRotate: function() {

            this.rotatableNode.attr('transform', this.getRotateString());
        },

        rgTranslate: function() {

            this.vel.attr('transform', this.getTranslateString());
        },

        sgResize: function(opt) {

            var model = this.model;
            var angle = model.angle();
            var size = model.size();
            var scalable = this.scalableNode;

            // Getting scalable group's bbox.
            // Due to a bug in webkit's native SVG .getBBox implementation, the bbox of groups with path children includes the paths' control points.
            // To work around the issue, we need to check whether there are any path elements inside the scalable group.
            var recursive = false;
            if (scalable.node.getElementsByTagName('path').length > 0) {
                // If scalable has at least one descendant that is a path, we need to switch to recursive bbox calculation.
                // If there are no path descendants, group bbox calculation works and so we can use the (faster) native function directly.
                recursive = true;
            }
            var scalableBBox = scalable.getBBox({ recursive: recursive });

            // Make sure `scalableBbox.width` and `scalableBbox.height` are not zero which can happen if the element does not have any content. By making
            // the width/height 1, we prevent HTML errors of the type `scale(Infinity, Infinity)`.
            var sx = (size.width / (scalableBBox.width || 1));
            var sy = (size.height / (scalableBBox.height || 1));
            scalable.attr('transform', 'scale(' + sx + ',' + sy + ')');

            // Now the interesting part. The goal is to be able to store the object geometry via just `x`, `y`, `angle`, `width` and `height`
            // Order of transformations is significant but we want to reconstruct the object always in the order:
            // resize(), rotate(), translate() no matter of how the object was transformed. For that to work,
            // we must adjust the `x` and `y` coordinates of the object whenever we resize it (because the origin of the
            // rotation changes). The new `x` and `y` coordinates are computed by canceling the previous rotation
            // around the center of the resized object (which is a different origin then the origin of the previous rotation)
            // and getting the top-left corner of the resulting object. Then we clean up the rotation back to what it originally was.

            // Cancel the rotation but now around a different origin, which is the center of the scaled object.
            var rotatable = this.rotatableNode;
            var rotation = rotatable && rotatable.attr('transform');
            if (rotation) {

                rotatable.attr('transform', rotation + ' rotate(' + (-angle) + ',' + (size.width / 2) + ',' + (size.height / 2) + ')');
                var rotatableBBox = scalable.getBBox({ target: this.paper.cells });

                // Store new x, y and perform rotate() again against the new rotation origin.
                model.set('position', { x: rotatableBBox.x, y: rotatableBBox.y }, assign({ updateHandled: true }, opt));
                this.translate();
                this.rotate();
            }

            // Update must always be called on non-rotated element. Otherwise, relative positioning
            // would work with wrong (rotated) bounding boxes.
            this.update();
        },

        // Embedding mode methods.
        // -----------------------

        prepareEmbedding: function(data) {

            data || (data = {});

            var model = data.model || this.model;
            var paper = data.paper || this.paper;
            var graph = paper.model;

            model.startBatch('to-front');

            // Bring the model to the front with all his embeds.
            model.toFront({ deep: true, ui: true });

            // Note that at this point cells in the collection are not sorted by z index (it's running in the batch, see
            // the dia.Graph._sortOnChangeZ), so we can't assume that the last cell in the collection has the highest z.
            var maxZ = graph.getElements().reduce(function(max, cell) {
                return Math.max(max, cell.attributes.z || 0);
            }, 0);

            // Move to front also all the inbound and outbound links that are connected
            // to any of the element descendant. If we bring to front only embedded elements,
            // links connected to them would stay in the background.
            var connectedLinks = graph.getConnectedLinks(model, { deep: true, includeEnclosed: true });
            connectedLinks.forEach(function(link) {
                if (link.attributes.z <= maxZ) { link.set('z', maxZ + 1, { ui: true }); }
            });

            model.stopBatch('to-front');

            // Before we start looking for suitable parent we remove the current one.
            var parentId = model.parent();
            if (parentId) {
                graph.getCell(parentId).unembed(model, { ui: true });
            }
        },

        processEmbedding: function(data) {

            data || (data = {});

            var model = data.model || this.model;
            var paper = data.paper || this.paper;
            var paperOptions = paper.options;

            var candidates = [];
            if (isFunction(paperOptions.findParentBy)) {
                var parents = toArray(paperOptions.findParentBy.call(paper.model, this));
                candidates = parents.filter(function(el) {
                    return el instanceof Cell && this.model.id !== el.id && !el.isEmbeddedIn(this.model);
                }.bind(this));
            } else {
                candidates = paper.model.findModelsUnderElement(model, { searchBy: paperOptions.findParentBy });
            }

            if (paperOptions.frontParentOnly) {
                // pick the element with the highest `z` index
                candidates = candidates.slice(-1);
            }

            var newCandidateView = null;
            var prevCandidateView = data.candidateEmbedView;

            // iterate over all candidates starting from the last one (has the highest z-index).
            for (var i = candidates.length - 1; i >= 0; i--) {

                var candidate = candidates[i];

                if (prevCandidateView && prevCandidateView.model.id == candidate.id) {

                    // candidate remains the same
                    newCandidateView = prevCandidateView;
                    break;

                } else {

                    var view = candidate.findView(paper);
                    if (paperOptions.validateEmbedding.call(paper, this, view)) {

                        // flip to the new candidate
                        newCandidateView = view;
                        break;
                    }
                }
            }

            if (newCandidateView && newCandidateView != prevCandidateView) {
                // A new candidate view found. Highlight the new one.
                this.clearEmbedding(data);
                data.candidateEmbedView = newCandidateView.highlight(null, { embedding: true });
            }

            if (!newCandidateView && prevCandidateView) {
                // No candidate view found. Unhighlight the previous candidate.
                this.clearEmbedding(data);
            }
        },

        clearEmbedding: function(data) {

            data || (data = {});

            var candidateView = data.candidateEmbedView;
            if (candidateView) {
                // No candidate view found. Unhighlight the previous candidate.
                candidateView.unhighlight(null, { embedding: true });
                data.candidateEmbedView = null;
            }
        },

        finalizeEmbedding: function(data) {

            data || (data = {});

            var candidateView = data.candidateEmbedView;
            var model = data.model || this.model;
            var paper = data.paper || this.paper;

            if (candidateView) {

                // We finished embedding. Candidate view is chosen to become the parent of the model.
                candidateView.model.embed(model, { ui: true });
                candidateView.unhighlight(null, { embedding: true });

                data.candidateEmbedView = null;
            }

            invoke(paper.model.getConnectedLinks(model, { deep: true }), 'reparent', { ui: true });
        },

        getDelegatedView: function() {

            var view = this;
            var model = view.model;
            var paper = view.paper;

            while (view) {
                if (model.isLink()) { break; }
                if (!model.isEmbedded() || view.can('stopDelegation')) { return view; }
                model = model.getParentCell();
                view = paper.findViewByModel(model);
            }

            return null;
        },

        // Interaction. The controller part.
        // ---------------------------------

        notifyPointerdown: function notifyPointerdown(evt, x, y) {
            CellView.prototype.pointerdown.call(this, evt, x, y);
            this.notify('element:pointerdown', evt, x, y);
        },

        notifyPointermove: function notifyPointermove(evt, x, y) {
            CellView.prototype.pointermove.call(this, evt, x, y);
            this.notify('element:pointermove', evt, x, y);
        },

        notifyPointerup: function notifyPointerup(evt, x, y) {
            this.notify('element:pointerup', evt, x, y);
            CellView.prototype.pointerup.call(this, evt, x, y);
        },

        pointerdblclick: function(evt, x, y) {

            CellView.prototype.pointerdblclick.apply(this, arguments);
            this.notify('element:pointerdblclick', evt, x, y);
        },

        pointerclick: function(evt, x, y) {

            CellView.prototype.pointerclick.apply(this, arguments);
            this.notify('element:pointerclick', evt, x, y);
        },

        contextmenu: function(evt, x, y) {

            CellView.prototype.contextmenu.apply(this, arguments);
            this.notify('element:contextmenu', evt, x, y);
        },

        pointerdown: function(evt, x, y) {

            if (this.isPropagationStopped(evt)) { return; }

            this.notifyPointerdown(evt, x, y);
            this.dragStart(evt, x, y);
        },

        pointermove: function(evt, x, y) {

            var data = this.eventData(evt);

            switch (data.action) {
                case 'magnet':
                    this.dragMagnet(evt, x, y);
                    break;
                case 'move':
                    (data.delegatedView || this).drag(evt, x, y);
                // eslint: no-fallthrough=false
                default:
                    this.notifyPointermove(evt, x, y);
                    break;
            }

            // Make sure the element view data is passed along.
            // It could have been wiped out in the handlers above.
            this.eventData(evt, data);
        },

        pointerup: function(evt, x, y) {

            var data = this.eventData(evt);
            switch (data.action) {
                case 'magnet':
                    this.dragMagnetEnd(evt, x, y);
                    break;
                case 'move':
                    (data.delegatedView || this).dragEnd(evt, x, y);
                // eslint: no-fallthrough=false
                default:
                    this.notifyPointerup(evt, x, y);
            }

            var magnet = data.targetMagnet;
            if (magnet) { this.magnetpointerclick(evt, magnet, x, y); }

            this.checkMouseleave(evt);
        },

        mouseover: function(evt) {

            CellView.prototype.mouseover.apply(this, arguments);
            this.notify('element:mouseover', evt);
        },

        mouseout: function(evt) {

            CellView.prototype.mouseout.apply(this, arguments);
            this.notify('element:mouseout', evt);
        },

        mouseenter: function(evt) {

            CellView.prototype.mouseenter.apply(this, arguments);
            this.notify('element:mouseenter', evt);
        },

        mouseleave: function(evt) {

            CellView.prototype.mouseleave.apply(this, arguments);
            this.notify('element:mouseleave', evt);
        },

        mousewheel: function(evt, x, y, delta) {

            CellView.prototype.mousewheel.apply(this, arguments);
            this.notify('element:mousewheel', evt, x, y, delta);
        },

        onmagnet: function(evt, x, y) {

            this.dragMagnetStart(evt, x, y);
        },

        magnetpointerdblclick: function(evt, magnet, x, y) {

            this.notify('element:magnet:pointerdblclick', evt, magnet, x, y);
        },

        magnetcontextmenu: function(evt, magnet, x, y) {

            this.notify('element:magnet:contextmenu', evt, magnet, x, y);
        },

        // Drag Start Handlers

        dragStart: function(evt, x, y) {

            var view = this.getDelegatedView();
            if (!view || !view.can('elementMove')) { return; }

            this.eventData(evt, {
                action: 'move',
                delegatedView: view
            });

            view.eventData(evt, {
                pointerOffset: view.model.position().difference(x, y),
                restrictedArea: this.paper.getRestrictedArea(view)
            });
        },

        dragMagnetStart: function(evt, x, y) {

            if (!this.can('addLinkFromMagnet')) { return; }

            var magnet = evt.currentTarget;
            var paper = this.paper;
            this.eventData(evt, { targetMagnet: magnet });
            evt.stopPropagation();

            if (paper.options.validateMagnet(this, magnet)) {

                if (paper.options.magnetThreshold <= 0) {
                    this.dragLinkStart(evt, magnet, x, y);
                }

                this.eventData(evt, { action: 'magnet' });
                this.stopPropagation(evt);

            } else {

                this.pointerdown(evt, x, y);
            }

            paper.delegateDragEvents(this, evt.data);
        },

        dragLinkStart: function(evt, magnet, x, y) {

            this.model.startBatch('add-link');

            var linkView = this.addLinkFromMagnet(magnet, x, y);

            // backwards compatibility events
            linkView.notifyPointerdown(evt, x, y);

            linkView.eventData(evt, linkView.startArrowheadMove('target', { whenNotAllowed: 'remove' }));
            this.eventData(evt, { linkView: linkView });
        },

        addLinkFromMagnet: function(magnet, x, y) {

            var paper = this.paper;
            var graph = paper.model;

            var link = paper.getDefaultLink(this, magnet);
            link.set({
                source: this.getLinkEnd(magnet, x, y, link, 'source'),
                target: { x: x, y: y }
            }).addTo(graph, {
                async: false,
                ui: true
            });

            return link.findView(paper);
        },

        // Drag Handlers

        drag: function(evt, x, y) {

            var paper = this.paper;
            var grid = paper.options.gridSize;
            var element = this.model;
            var data = this.eventData(evt);
            var pointerOffset = data.pointerOffset;
            var restrictedArea = data.restrictedArea;
            var embedding = data.embedding;

            // Make sure the new element's position always snaps to the current grid
            var elX = snapToGrid(x + pointerOffset.x, grid);
            var elY = snapToGrid(y + pointerOffset.y, grid);

            element.position(elX, elY, { restrictedArea: restrictedArea, deep: true, ui: true });

            if (paper.options.embeddingMode) {
                if (!embedding) {
                    // Prepare the element for embedding only if the pointer moves.
                    // We don't want to do unnecessary action with the element
                    // if an user only clicks/dblclicks on it.
                    this.prepareEmbedding(data);
                    embedding = true;
                }
                this.processEmbedding(data);
            }

            this.eventData(evt, {
                embedding: embedding
            });
        },

        dragMagnet: function(evt, x, y) {

            var data = this.eventData(evt);
            var linkView = data.linkView;
            if (linkView) {
                linkView.pointermove(evt, x, y);
            } else {
                var paper = this.paper;
                var magnetThreshold = paper.options.magnetThreshold;
                var currentTarget = this.getEventTarget(evt);
                var targetMagnet = data.targetMagnet;
                if (magnetThreshold === 'onleave') {
                    // magnetThreshold when the pointer leaves the magnet
                    if (targetMagnet === currentTarget || V(targetMagnet).contains(currentTarget)) { return; }
                } else {
                    // magnetThreshold defined as a number of movements
                    if (paper.eventData(evt).mousemoved <= magnetThreshold) { return; }
                }
                this.dragLinkStart(evt, targetMagnet, x, y);
            }
        },

        // Drag End Handlers

        dragEnd: function(evt, x, y) {

            var data = this.eventData(evt);
            if (data.embedding) { this.finalizeEmbedding(data); }
        },

        dragMagnetEnd: function(evt, x, y) {

            var data = this.eventData(evt);
            var linkView = data.linkView;
            if (!linkView) { return; }
            linkView.pointerup(evt, x, y);
            this.model.stopBatch('add-link');
        },

        magnetpointerclick: function(evt, magnet, x, y) {
            var paper = this.paper;
            if (paper.eventData(evt).mousemoved > paper.options.clickThreshold) { return; }
            this.notify('element:magnet:pointerclick', evt, magnet, x, y);
        }

    });

    assign(ElementView.prototype, elementViewPortPrototype);

    var env = {

        _results: {},

        _tests: {

            svgforeignobject: function() {
                return !!document.createElementNS &&
                    /SVGForeignObject/.test(({}).toString.call(document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')));
            }
        },

        addTest: function(name, fn) {

            return this._tests[name] = fn;
        },

        test: function(name) {

            var fn = this._tests[name];

            if (!fn) {
                throw new Error('Test not defined ("' + name + '"). Use `joint.env.addTest(name, fn) to add a new test.`');
            }

            var result = this._results[name];

            if (typeof result !== 'undefined') {
                return result;
            }

            try {
                result = fn();
            } catch (error) {
                result = false;
            }

            // Cache the test result.
            this._results[name] = result;

            return result;
        }
    };

    var Generic = Element$1.define('basic.Generic', {
        attrs: {
            '.': { fill: '#ffffff', stroke: 'none' }
        }
    });

    var Rect$1 = Generic.define('basic.Rect', {
        attrs: {
            'rect': {
                fill: '#ffffff',
                stroke: '#000000',
                width: 100,
                height: 60
            },
            'text': {
                fill: '#000000',
                text: '',
                'font-size': 14,
                'ref-x': .5,
                'ref-y': .5,
                'text-anchor': 'middle',
                'y-alignment': 'middle',
                'font-family': 'Arial, helvetica, sans-serif'
            }
        }
    }, {
        markup: '<g class="rotatable"><g class="scalable"><rect/></g><text/></g>'
    });

    var TextView = ElementView.extend({

        presentationAttributes: ElementView.addPresentationAttributes({
            // The element view is not automatically re-scaled to fit the model size
            // when the attribute 'attrs' is changed.
            attrs: ['SCALE']
        }),

        confirmUpdate: function() {
            var flags = ElementView.prototype.confirmUpdate.apply(this, arguments);
            if (this.hasFlag(flags, 'SCALE')) {
                this.resize();
                flags = this.removeFlag(flags, 'SCALE');
            }
            return flags;
        }
    });

    var Text = Generic.define('basic.Text', {
        attrs: {
            'text': {
                'font-size': 18,
                fill: '#000000'
            }
        }
    }, {
        markup: '<g class="rotatable"><g class="scalable"><text/></g></g>',
    });

    var Circle = Generic.define('basic.Circle', {
        size: { width: 60, height: 60 },
        attrs: {
            'circle': {
                fill: '#ffffff',
                stroke: '#000000',
                r: 30,
                cx: 30,
                cy: 30
            },
            'text': {
                'font-size': 14,
                text: '',
                'text-anchor': 'middle',
                'ref-x': .5,
                'ref-y': .5,
                'y-alignment': 'middle',
                fill: '#000000',
                'font-family': 'Arial, helvetica, sans-serif'
            }
        }
    }, {
        markup: '<g class="rotatable"><g class="scalable"><circle/></g><text/></g>',
    });

    var Ellipse$1 = Generic.define('basic.Ellipse', {
        size: { width: 60, height: 40 },
        attrs: {
            'ellipse': {
                fill: '#ffffff',
                stroke: '#000000',
                rx: 30,
                ry: 20,
                cx: 30,
                cy: 20
            },
            'text': {
                'font-size': 14,
                text: '',
                'text-anchor': 'middle',
                'ref-x': .5,
                'ref-y': .5,
                'y-alignment': 'middle',
                fill: '#000000',
                'font-family': 'Arial, helvetica, sans-serif'
            }
        }
    }, {
        markup: '<g class="rotatable"><g class="scalable"><ellipse/></g><text/></g>',
    });

    var Polygon = Generic.define('basic.Polygon', {
        size: { width: 60, height: 40 },
        attrs: {
            'polygon': {
                fill: '#ffffff',
                stroke: '#000000'
            },
            'text': {
                'font-size': 14,
                text: '',
                'text-anchor': 'middle',
                'ref-x': .5,
                'ref-dy': 20,
                'y-alignment': 'middle',
                fill: '#000000',
                'font-family': 'Arial, helvetica, sans-serif'
            }
        }
    }, {
        markup: '<g class="rotatable"><g class="scalable"><polygon/></g><text/></g>',
    });

    var Polyline$1 = Generic.define('basic.Polyline', {
        size: { width: 60, height: 40 },
        attrs: {
            'polyline': {
                fill: '#ffffff',
                stroke: '#000000'
            },
            'text': {
                'font-size': 14,
                text: '',
                'text-anchor': 'middle',
                'ref-x': .5,
                'ref-dy': 20,
                'y-alignment': 'middle',
                fill: '#000000',
                'font-family': 'Arial, helvetica, sans-serif'
            }
        }
    }, {
        markup: '<g class="rotatable"><g class="scalable"><polyline/></g><text/></g>',
    });

    var Image = Generic.define('basic.Image', {
        attrs: {
            'text': {
                'font-size': 14,
                text: '',
                'text-anchor': 'middle',
                'ref-x': .5,
                'ref-dy': 20,
                'y-alignment': 'middle',
                fill: '#000000',
                'font-family': 'Arial, helvetica, sans-serif'
            }
        }
    }, {
        markup: '<g class="rotatable"><g class="scalable"><image/></g><text/></g>',
    });

    var Path$1 = Generic.define('basic.Path', {
        size: { width: 60, height: 60 },
        attrs: {
            'path': {
                fill: '#ffffff',
                stroke: '#000000'
            },
            'text': {
                'font-size': 14,
                text: '',
                'text-anchor': 'middle',
                'ref': 'path',
                'ref-x': .5,
                'ref-dy': 10,
                fill: '#000000',
                'font-family': 'Arial, helvetica, sans-serif'
            }
        }

    }, {
        markup: '<g class="rotatable"><g class="scalable"><path/></g><text/></g>',
    });

    var Rhombus = Path$1.define('basic.Rhombus', {
        attrs: {
            'path': {
                d: 'M 30 0 L 60 30 30 60 0 30 z'
            },
            'text': {
                'ref-y': .5,
                'ref-dy': null,
                'y-alignment': 'middle'
            }
        }
    });

    var svgForeignObjectSupported = env.test('svgforeignobject');

    var TextBlock = Generic.define('basic.TextBlock', {
        // see joint.css for more element styles
        attrs: {
            rect: {
                fill: '#ffffff',
                stroke: '#000000',
                width: 80,
                height: 100
            },
            text: {
                fill: '#000000',
                'font-size': 14,
                'font-family': 'Arial, helvetica, sans-serif'
            },
            '.content': {
                text: '',
                'ref-x': .5,
                'ref-y': .5,
                'y-alignment': 'middle',
                'x-alignment': 'middle'
            }
        },

        content: ''
    }, {
        markup: [
            '<g class="rotatable">',
            '<g class="scalable"><rect/></g>',
            svgForeignObjectSupported
                ? '<foreignObject class="fobj"><body xmlns="http://www.w3.org/1999/xhtml"><div class="content"/></body></foreignObject>'
                : '<text class="content"/>',
            '</g>'
        ].join(''),

        initialize: function() {

            this.listenTo(this, 'change:size', this.updateSize);
            this.listenTo(this, 'change:content', this.updateContent);
            this.updateSize(this, this.get('size'));
            this.updateContent(this, this.get('content'));
            Generic.prototype.initialize.apply(this, arguments);
        },

        updateSize: function(cell, size) {

            // Selector `foreignObject' doesn't work across all browsers, we're using class selector instead.
            // We have to clone size as we don't want attributes.div.style to be same object as attributes.size.
            this.attr({
                '.fobj': assign({}, size),
                div: {
                    style: assign({}, size)
                }
            });
        },

        updateContent: function(cell, content) {

            if (svgForeignObjectSupported) {

                // Content element is a <div> element.
                this.attr({
                    '.content': {
                        html: sanitizeHTML(content)
                    }
                });

            } else {

                // Content element is a <text> element.
                // SVG elements don't have innerHTML attribute.
                this.attr({
                    '.content': {
                        text: content
                    }
                });
            }
        },

        // Here for backwards compatibility:
        setForeignObjectSize: function() {

            this.updateSize.apply(this, arguments);
        },

        // Here for backwards compatibility:
        setDivContent: function() {

            this.updateContent.apply(this, arguments);
        }
    });

    // TextBlockView implements the fallback for IE when no foreignObject exists and
    // the text needs to be manually broken.
    var TextBlockView = ElementView.extend({

        presentationAttributes: svgForeignObjectSupported
            ? ElementView.prototype.presentationAttributes
            : ElementView.addPresentationAttributes({
                content: ['CONTENT'],
                size: ['CONTENT']
            }),

        initFlag: ['RENDER', 'CONTENT'],

        confirmUpdate: function() {
            var flags = ElementView.prototype.confirmUpdate.apply(this, arguments);
            if (this.hasFlag(flags, 'CONTENT')) {
                this.updateContent(this.model);
                flags = this.removeFlag(flags, 'CONTENT');
            }
            return flags;
        },

        update: function(_$$1, renderingOnlyAttrs) {

            var model = this.model;

            if (!svgForeignObjectSupported) {

                // Update everything but the content first.
                var noTextAttrs = omit(renderingOnlyAttrs || model.get('attrs'), '.content');
                ElementView.prototype.update.call(this, model, noTextAttrs);

                if (!renderingOnlyAttrs || has(renderingOnlyAttrs, '.content')) {
                    // Update the content itself.
                    this.updateContent(model, renderingOnlyAttrs);
                }

            } else {

                ElementView.prototype.update.call(this, model, renderingOnlyAttrs);
            }
        },

        updateContent: function(cell, renderingOnlyAttrs) {

            // Create copy of the text attributes
            var textAttrs = merge({}, (renderingOnlyAttrs || cell.get('attrs'))['.content']);

            textAttrs = omit(textAttrs, 'text');

            // Break the content to fit the element size taking into account the attributes
            // set on the model.
            var text = breakText(cell.get('content'), cell.get('size'), textAttrs, {
                // measuring sandbox svg document
                svgDocument: this.paper.svg
            });

            // Create a new attrs with same structure as the model attrs { text: { *textAttributes* }}
            var attrs = setByPath({}, '.content', textAttrs, '/');

            // Replace text attribute with the one we just processed.
            attrs['.content'].text = text;

            // Update the view using renderingOnlyAttributes parameter.
            ElementView.prototype.update.call(this, cell, attrs);
        }
    });

    var basic = ({
        Generic: Generic,
        Rect: Rect$1,
        TextView: TextView,
        Text: Text,
        Circle: Circle,
        Ellipse: Ellipse$1,
        Polygon: Polygon,
        Polyline: Polyline$1,
        Image: Image,
        Path: Path$1,
        Rhombus: Rhombus,
        TextBlock: TextBlock,
        TextBlockView: TextBlockView
    });

    // Link base model.
    // --------------------------

    var Link = Cell.extend({

        // The default markup for links.
        markup: [
            '<path class="connection" stroke="black" d="M 0 0 0 0"/>',
            '<path class="marker-source" fill="black" stroke="black" d="M 0 0 0 0"/>',
            '<path class="marker-target" fill="black" stroke="black" d="M 0 0 0 0"/>',
            '<path class="connection-wrap" d="M 0 0 0 0"/>',
            '<g class="labels"/>',
            '<g class="marker-vertices"/>',
            '<g class="marker-arrowheads"/>',
            '<g class="link-tools"/>'
        ].join(''),

        toolMarkup: [
            '<g class="link-tool">',
            '<g class="tool-remove" event="remove">',
            '<circle r="11" />',
            '<path transform="scale(.8) translate(-16, -16)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z" />',
            '<title>Remove link.</title>',
            '</g>',
            '<g class="tool-options" event="link:options">',
            '<circle r="11" transform="translate(25)"/>',
            '<path fill="white" transform="scale(.55) translate(29, -16)" d="M31.229,17.736c0.064-0.571,0.104-1.148,0.104-1.736s-0.04-1.166-0.104-1.737l-4.377-1.557c-0.218-0.716-0.504-1.401-0.851-2.05l1.993-4.192c-0.725-0.91-1.549-1.734-2.458-2.459l-4.193,1.994c-0.647-0.347-1.334-0.632-2.049-0.849l-1.558-4.378C17.165,0.708,16.588,0.667,16,0.667s-1.166,0.041-1.737,0.105L12.707,5.15c-0.716,0.217-1.401,0.502-2.05,0.849L6.464,4.005C5.554,4.73,4.73,5.554,4.005,6.464l1.994,4.192c-0.347,0.648-0.632,1.334-0.849,2.05l-4.378,1.557C0.708,14.834,0.667,15.412,0.667,16s0.041,1.165,0.105,1.736l4.378,1.558c0.217,0.715,0.502,1.401,0.849,2.049l-1.994,4.193c0.725,0.909,1.549,1.733,2.459,2.458l4.192-1.993c0.648,0.347,1.334,0.633,2.05,0.851l1.557,4.377c0.571,0.064,1.148,0.104,1.737,0.104c0.588,0,1.165-0.04,1.736-0.104l1.558-4.377c0.715-0.218,1.399-0.504,2.049-0.851l4.193,1.993c0.909-0.725,1.733-1.549,2.458-2.458l-1.993-4.193c0.347-0.647,0.633-1.334,0.851-2.049L31.229,17.736zM16,20.871c-2.69,0-4.872-2.182-4.872-4.871c0-2.69,2.182-4.872,4.872-4.872c2.689,0,4.871,2.182,4.871,4.872C20.871,18.689,18.689,20.871,16,20.871z"/>',
            '<title>Link options.</title>',
            '</g>',
            '</g>'
        ].join(''),

        doubleToolMarkup: undefined,

        // The default markup for showing/removing vertices. These elements are the children of the .marker-vertices element (see `this.markup`).
        // Only .marker-vertex and .marker-vertex-remove element have special meaning. The former is used for
        // dragging vertices (changing their position). The latter is used for removing vertices.
        vertexMarkup: [
            '<g class="marker-vertex-group" transform="translate(<%= x %>, <%= y %>)">',
            '<circle class="marker-vertex" idx="<%= idx %>" r="10" />',
            '<path class="marker-vertex-remove-area" idx="<%= idx %>" d="M16,5.333c-7.732,0-14,4.701-14,10.5c0,1.982,0.741,3.833,2.016,5.414L2,25.667l5.613-1.441c2.339,1.317,5.237,2.107,8.387,2.107c7.732,0,14-4.701,14-10.5C30,10.034,23.732,5.333,16,5.333z" transform="translate(5, -33)"/>',
            '<path class="marker-vertex-remove" idx="<%= idx %>" transform="scale(.8) translate(9.5, -37)" d="M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z">',
            '<title>Remove vertex.</title>',
            '</path>',
            '</g>'
        ].join(''),

        arrowheadMarkup: [
            '<g class="marker-arrowhead-group marker-arrowhead-group-<%= end %>">',
            '<path class="marker-arrowhead" end="<%= end %>" d="M 26 0 L 0 13 L 26 26 z" />',
            '</g>'
        ].join(''),

        // may be overwritten by user to change default label (its markup, attrs, position)
        defaultLabel: undefined,

        // deprecated
        // may be overwritten by user to change default label markup
        // lower priority than defaultLabel.markup
        labelMarkup: undefined,

        // private
        _builtins: {
            defaultLabel: {
                // builtin default markup:
                // used if neither defaultLabel.markup
                // nor label.markup is set
                markup: [
                    {
                        tagName: 'rect',
                        selector: 'rect' // faster than tagName CSS selector
                    }, {
                        tagName: 'text',
                        selector: 'text' // faster than tagName CSS selector
                    }
                ],
                // builtin default attributes:
                // applied only if builtin default markup is used
                attrs: {
                    text: {
                        fill: '#000000',
                        fontSize: 14,
                        textAnchor: 'middle',
                        yAlignment: 'middle',
                        pointerEvents: 'none'
                    },
                    rect: {
                        ref: 'text',
                        fill: '#ffffff',
                        rx: 3,
                        ry: 3,
                        refWidth: 1,
                        refHeight: 1,
                        refX: 0,
                        refY: 0
                    }
                },
                // builtin default position:
                // used if neither defaultLabel.position
                // nor label.position is set
                position: {
                    distance: 0.5
                }
            }
        },

        defaults: {
            type: 'link',
            source: {},
            target: {}
        },

        isLink: function() {

            return true;
        },

        disconnect: function(opt) {

            return this.set({
                source: { x: 0, y: 0 },
                target: { x: 0, y: 0 }
            }, opt);
        },

        source: function(source, args, opt) {

            // getter
            if (source === undefined) {
                return clone(this.get('source'));
            }

            // setter
            var setSource;
            var setOpt;

            // `source` is a cell
            // take only its `id` and combine with `args`
            var isCellProvided = source instanceof Cell;
            if (isCellProvided) { // three arguments
                setSource = clone(args) || {};
                setSource.id = source.id;
                setOpt = opt;
                return this.set('source', setSource, setOpt);
            }

            // `source` is a point-like object
            // for example, a g.Point
            // take only its `x` and `y` and combine with `args`
            var isPointProvided = !isPlainObject(source);
            if (isPointProvided) { // three arguments
                setSource = clone(args) || {};
                setSource.x = source.x;
                setSource.y = source.y;
                setOpt = opt;
                return this.set('source', setSource, setOpt);
            }

            // `source` is an object
            // no checking
            // two arguments
            setSource = source;
            setOpt = args;
            return this.set('source', setSource, setOpt);
        },

        target: function(target, args, opt) {

            // getter
            if (target === undefined) {
                return clone(this.get('target'));
            }

            // setter
            var setTarget;
            var setOpt;

            // `target` is a cell
            // take only its `id` argument and combine with `args`
            var isCellProvided = target instanceof Cell;
            if (isCellProvided) { // three arguments
                setTarget = clone(args) || {};
                setTarget.id = target.id;
                setOpt = opt;
                return this.set('target', setTarget, setOpt);
            }

            // `target` is a point-like object
            // for example, a g.Point
            // take only its `x` and `y` and combine with `args`
            var isPointProvided = !isPlainObject(target);
            if (isPointProvided) { // three arguments
                setTarget = clone(args) || {};
                setTarget.x = target.x;
                setTarget.y = target.y;
                setOpt = opt;
                return this.set('target', setTarget, setOpt);
            }

            // `target` is an object
            // no checking
            // two arguments
            setTarget = target;
            setOpt = args;
            return this.set('target', setTarget, setOpt);
        },

        router: function(name, args, opt) {

            // getter
            if (name === undefined) {
                var router = this.get('router');
                if (!router) {
                    if (this.get('manhattan')) { return { name: 'orthogonal' }; } // backwards compatibility
                    return null;
                }
                if (typeof router === 'object') { return clone(router); }
                return router; // e.g. a function
            }

            // setter
            var isRouterProvided = ((typeof name === 'object') || (typeof name === 'function'));
            var localRouter = isRouterProvided ? name : { name: name, args: args };
            var localOpt = isRouterProvided ? args : opt;

            return this.set('router', localRouter, localOpt);
        },

        connector: function(name, args, opt) {

            // getter
            if (name === undefined) {
                var connector = this.get('connector');
                if (!connector) {
                    if (this.get('smooth')) { return { name: 'smooth' }; } // backwards compatibility
                    return null;
                }
                if (typeof connector === 'object') { return clone(connector); }
                return connector; // e.g. a function
            }

            // setter
            var isConnectorProvided = ((typeof name === 'object' || typeof name === 'function'));
            var localConnector = isConnectorProvided ? name : { name: name, args: args };
            var localOpt = isConnectorProvided ? args : opt;

            return this.set('connector', localConnector, localOpt);
        },

        // Labels API

        // A convenient way to set labels. Currently set values will be mixined with `value` if used as a setter.
        label: function(idx, label, opt) {

            var labels = this.labels();

            idx = (isFinite(idx) && idx !== null) ? (idx | 0) : 0;
            if (idx < 0) { idx = labels.length + idx; }

            // getter
            if (arguments.length <= 1) { return this.prop(['labels', idx]); }
            // setter
            return this.prop(['labels', idx], label, opt);
        },

        labels: function(labels, opt) {

            // getter
            if (arguments.length === 0) {
                labels = this.get('labels');
                if (!Array.isArray(labels)) { return []; }
                return labels.slice();
            }
            // setter
            if (!Array.isArray(labels)) { labels = []; }
            return this.set('labels', labels, opt);
        },

        insertLabel: function(idx, label, opt) {

            if (!label) { throw new Error('dia.Link: no label provided'); }

            var labels = this.labels();
            var n = labels.length;
            idx = (isFinite(idx) && idx !== null) ? (idx | 0) : n;
            if (idx < 0) { idx = n + idx + 1; }

            labels.splice(idx, 0, label);
            return this.labels(labels, opt);
        },

        // convenience function
        // add label to end of labels array
        appendLabel: function(label, opt) {

            return this.insertLabel(-1, label, opt);
        },

        removeLabel: function(idx, opt) {

            var labels = this.labels();
            idx = (isFinite(idx) && idx !== null) ? (idx | 0) : -1;

            labels.splice(idx, 1);
            return this.labels(labels, opt);
        },

        // Vertices API

        vertex: function(idx, vertex, opt) {

            var vertices = this.vertices();

            idx = (isFinite(idx) && idx !== null) ? (idx | 0) : 0;
            if (idx < 0) { idx = vertices.length + idx; }

            // getter
            if (arguments.length <= 1) { return this.prop(['vertices', idx]); }

            // setter
            var setVertex = this._normalizeVertex(vertex);
            return this.prop(['vertices', idx], setVertex, opt);
        },

        vertices: function(vertices, opt) {

            // getter
            if (arguments.length === 0) {
                vertices = this.get('vertices');
                if (!Array.isArray(vertices)) { return []; }
                return vertices.slice();
            }

            // setter
            if (!Array.isArray(vertices)) { vertices = []; }
            var setVertices = [];
            for (var i = 0; i < vertices.length; i++) {
                var vertex = vertices[i];
                var setVertex = this._normalizeVertex(vertex);
                setVertices.push(setVertex);
            }
            return this.set('vertices', setVertices, opt);
        },

        insertVertex: function(idx, vertex, opt) {

            if (!vertex) { throw new Error('dia.Link: no vertex provided'); }

            var vertices = this.vertices();
            var n = vertices.length;
            idx = (isFinite(idx) && idx !== null) ? (idx | 0) : n;
            if (idx < 0) { idx = n + idx + 1; }

            var setVertex = this._normalizeVertex(vertex);
            vertices.splice(idx, 0, setVertex);
            return this.vertices(vertices, opt);
        },

        removeVertex: function(idx, opt) {

            var vertices = this.vertices();
            idx = (isFinite(idx) && idx !== null) ? (idx | 0) : -1;

            vertices.splice(idx, 1);
            return this.vertices(vertices, opt);
        },

        _normalizeVertex: function(vertex) {

            // is vertex a point-like object?
            // for example, a g.Point
            var isPointProvided = !isPlainObject(vertex);
            if (isPointProvided) { return { x: vertex.x, y: vertex.y }; }

            // else: return vertex unchanged
            return vertex;
        },

        // Transformations

        translate: function(tx, ty, opt) {

            // enrich the option object
            opt = opt || {};
            opt.translateBy = opt.translateBy || this.id;
            opt.tx = tx;
            opt.ty = ty;

            return this.applyToPoints(function(p) {
                return { x: (p.x || 0) + tx, y: (p.y || 0) + ty };
            }, opt);
        },

        scale: function(sx, sy, origin, opt) {

            return this.applyToPoints(function(p) {
                return Point(p).scale(sx, sy, origin).toJSON();
            }, opt);
        },

        applyToPoints: function(fn, opt) {

            if (!isFunction(fn)) {
                throw new TypeError('dia.Link: applyToPoints expects its first parameter to be a function.');
            }

            var attrs = {};

            var source = this.source();
            if (!source.id) {
                attrs.source = fn(source);
            }

            var target = this.target();
            if (!target.id) {
                attrs.target = fn(target);
            }

            var vertices = this.vertices();
            if (vertices.length > 0) {
                attrs.vertices = vertices.map(fn);
            }

            return this.set(attrs, opt);
        },

        getSourcePoint: function() {
            var sourceCell = this.getSourceCell();
            if (!sourceCell) { return new Point(this.source()); }
            return sourceCell.getPointFromConnectedLink(this, 'source');
        },

        getTargetPoint: function() {
            var targetCell = this.getTargetCell();
            if (!targetCell) { return new Point(this.target()); }
            return targetCell.getPointFromConnectedLink(this, 'target');
        },

        getPointFromConnectedLink: function(/* link, endType */) {
            return this.getPolyline().pointAt(0.5);
        },

        getPolyline: function() {
            var points = [this.getSourcePoint(), this.getTargetPoint()];
            var vertices = this.vertices();
            if (vertices.length > 0) {
                Array.prototype.push.apply(points, vertices.map(Point));
            }
            return new Polyline(points);
        },

        getBBox: function() {
            return this.getPolyline().bbox();
        },

        reparent: function(opt) {

            var newParent;

            if (this.graph) {

                var source = this.getSourceElement();
                var target = this.getTargetElement();
                var prevParent = this.getParentCell();

                if (source && target) {
                    if (source === target || source.isEmbeddedIn(target)) {
                        newParent = target;
                    } else if (target.isEmbeddedIn(source)) {
                        newParent = source;
                    } else {
                        newParent = this.graph.getCommonAncestor(source, target);
                    }
                }

                if (prevParent && (!newParent || newParent.id !== prevParent.id)) {
                    // Unembed the link if source and target has no common ancestor
                    // or common ancestor changed
                    prevParent.unembed(this, opt);
                }

                if (newParent) {
                    newParent.embed(this, opt);
                }
            }

            return newParent;
        },

        hasLoop: function(opt) {

            opt = opt || {};

            var sourceId = this.source().id;
            var targetId = this.target().id;

            if (!sourceId || !targetId) {
                // Link "pinned" to the paper does not have a loop.
                return false;
            }

            var loop = sourceId === targetId;

            // Note that there in the deep mode a link can have a loop,
            // even if it connects only a parent and its embed.
            // A loop "target equals source" is valid in both shallow and deep mode.
            if (!loop && opt.deep && this.graph) {

                var sourceElement = this.getSourceCell();
                var targetElement = this.getTargetCell();

                loop = sourceElement.isEmbeddedIn(targetElement) || targetElement.isEmbeddedIn(sourceElement);
            }

            return loop;
        },

        // unlike source(), this method returns null if source is a point
        getSourceCell: function() {

            var source = this.source();
            var graph = this.graph;

            return (source && source.id && graph && graph.getCell(source.id)) || null;
        },

        getSourceElement: function() {
            var cell = this;
            var visited = {};
            do {
                if (visited[cell.id]) { return null; }
                visited[cell.id] = true;
                cell = cell.getSourceCell();
            } while (cell && cell.isLink());
            return cell;
        },

        // unlike target(), this method returns null if target is a point
        getTargetCell: function() {

            var target = this.target();
            var graph = this.graph;

            return (target && target.id && graph && graph.getCell(target.id)) || null;
        },

        getTargetElement: function() {
            var cell = this;
            var visited = {};
            do {
                if (visited[cell.id]) { return null; }
                visited[cell.id] = true;
                cell = cell.getTargetCell();
            } while (cell && cell.isLink());
            return cell;
        },

        // Returns the common ancestor for the source element,
        // target element and the link itself.
        getRelationshipAncestor: function() {

            var connectionAncestor;

            if (this.graph) {

                var cells = [
                    this,
                    this.getSourceElement(), // null if source is a point
                    this.getTargetElement() // null if target is a point
                ].filter(function(item) {
                    return !!item;
                });

                connectionAncestor = this.graph.getCommonAncestor.apply(this.graph, cells);
            }

            return connectionAncestor || null;
        },

        // Is source, target and the link itself embedded in a given cell?
        isRelationshipEmbeddedIn: function(cell) {

            var cellId = (isString(cell) || isNumber(cell)) ? cell : cell.id;
            var ancestor = this.getRelationshipAncestor();

            return !!ancestor && (ancestor.id === cellId || ancestor.isEmbeddedIn(cellId));
        },

        // Get resolved default label.
        _getDefaultLabel: function() {

            var defaultLabel = this.get('defaultLabel') || this.defaultLabel || {};

            var label = {};
            label.markup = defaultLabel.markup || this.get('labelMarkup') || this.labelMarkup;
            label.position = defaultLabel.position;
            label.attrs = defaultLabel.attrs;
            label.size = defaultLabel.size;

            return label;
        }
    }, {

        endsEqual: function(a, b) {

            var portsEqual = a.port === b.port || !a.port && !b.port;
            return a.id === b.id && portsEqual;
        }
    });

    // ELEMENTS

    var Rectangle = Element$1.define('standard.Rectangle', {
        attrs: {
            body: {
                refWidth: '100%',
                refHeight: '100%',
                strokeWidth: 2,
                stroke: '#000000',
                fill: '#FFFFFF'
            },
            label: {
                textVerticalAnchor: 'middle',
                textAnchor: 'middle',
                refX: '50%',
                refY: '50%',
                fontSize: 14,
                fill: '#333333'
            }
        }
    }, {
        markup: [{
            tagName: 'rect',
            selector: 'body',
        }, {
            tagName: 'text',
            selector: 'label'
        }]
    });

    var Circle$1 = Element$1.define('standard.Circle', {
        attrs: {
            body: {
                refCx: '50%',
                refCy: '50%',
                refR: '50%',
                strokeWidth: 2,
                stroke: '#333333',
                fill: '#FFFFFF'
            },
            label: {
                textVerticalAnchor: 'middle',
                textAnchor: 'middle',
                refX: '50%',
                refY: '50%',
                fontSize: 14,
                fill: '#333333'
            }
        }
    }, {
        markup: [{
            tagName: 'circle',
            selector: 'body'
        }, {
            tagName: 'text',
            selector: 'label'
        }]
    });

    var Ellipse$2 = Element$1.define('standard.Ellipse', {
        attrs: {
            body: {
                refCx: '50%',
                refCy: '50%',
                refRx: '50%',
                refRy: '50%',
                strokeWidth: 2,
                stroke: '#333333',
                fill: '#FFFFFF'
            },
            label: {
                textVerticalAnchor: 'middle',
                textAnchor: 'middle',
                refX: '50%',
                refY: '50%',
                fontSize: 14,
                fill: '#333333'
            }
        }
    }, {
        markup: [{
            tagName: 'ellipse',
            selector: 'body'
        }, {
            tagName: 'text',
            selector: 'label'
        }]
    });

    var Path$2 = Element$1.define('standard.Path', {
        attrs: {
            body: {
                refD: 'M 0 0 L 10 0 10 10 0 10 Z',
                strokeWidth: 2,
                stroke: '#333333',
                fill: '#FFFFFF'
            },
            label: {
                textVerticalAnchor: 'middle',
                textAnchor: 'middle',
                refX: '50%',
                refY: '50%',
                fontSize: 14,
                fill: '#333333'
            }
        }
    }, {
        markup: [{
            tagName: 'path',
            selector: 'body'
        }, {
            tagName: 'text',
            selector: 'label'
        }]
    });

    var Polygon$1 = Element$1.define('standard.Polygon', {
        attrs: {
            body: {
                refPoints: '0 0 10 0 10 10 0 10',
                strokeWidth: 2,
                stroke: '#333333',
                fill: '#FFFFFF'
            },
            label: {
                textVerticalAnchor: 'middle',
                textAnchor: 'middle',
                refX: '50%',
                refY: '50%',
                fontSize: 14,
                fill: '#333333'
            }
        }
    }, {
        markup: [{
            tagName: 'polygon',
            selector: 'body'
        }, {
            tagName: 'text',
            selector: 'label'
        }]
    });

    var Polyline$2 = Element$1.define('standard.Polyline', {
        attrs: {
            body: {
                refPoints: '0 0 10 0 10 10 0 10 0 0',
                strokeWidth: 2,
                stroke: '#333333',
                fill: '#FFFFFF'
            },
            label: {
                textVerticalAnchor: 'middle',
                textAnchor: 'middle',
                refX: '50%',
                refY: '50%',
                fontSize: 14,
                fill: '#333333'
            }
        }
    }, {
        markup: [{
            tagName: 'polyline',
            selector: 'body'
        }, {
            tagName: 'text',
            selector: 'label'
        }]
    });

    var Image$1 = Element$1.define('standard.Image', {
        attrs: {
            image: {
                refWidth: '100%',
                refHeight: '100%',
                // xlinkHref: '[URL]'
            },
            label: {
                textVerticalAnchor: 'top',
                textAnchor: 'middle',
                refX: '50%',
                refY: '100%',
                refY2: 10,
                fontSize: 14,
                fill: '#333333'
            }
        }
    }, {
        markup: [{
            tagName: 'image',
            selector: 'image'
        }, {
            tagName: 'text',
            selector: 'label'
        }]
    });

    var BorderedImage = Element$1.define('standard.BorderedImage', {
        attrs: {
            border: {
                refWidth: '100%',
                refHeight: '100%',
                stroke: '#333333',
                strokeWidth: 2
            },
            background: {
                refWidth: -1,
                refHeight: -1,
                x: 0.5,
                y: 0.5,
                fill: '#FFFFFF'
            },
            image: {
                // xlinkHref: '[URL]'
                refWidth: -1,
                refHeight: -1,
                x: 0.5,
                y: 0.5
            },
            label: {
                textVerticalAnchor: 'top',
                textAnchor: 'middle',
                refX: '50%',
                refY: '100%',
                refY2: 10,
                fontSize: 14,
                fill: '#333333'
            }
        }
    }, {
        markup: [{
            tagName: 'rect',
            selector: 'background',
            attributes: {
                'stroke': 'none'
            }
        }, {
            tagName: 'image',
            selector: 'image'
        }, {
            tagName: 'rect',
            selector: 'border',
            attributes: {
                'fill': 'none'
            }
        }, {
            tagName: 'text',
            selector: 'label'
        }]
    });

    var EmbeddedImage = Element$1.define('standard.EmbeddedImage', {
        attrs: {
            body: {
                refWidth: '100%',
                refHeight: '100%',
                stroke: '#333333',
                fill: '#FFFFFF',
                strokeWidth: 2
            },
            image: {
                // xlinkHref: '[URL]'
                refWidth: '30%',
                refHeight: -20,
                x: 10,
                y: 10,
                preserveAspectRatio: 'xMidYMin'
            },
            label: {
                textVerticalAnchor: 'top',
                textAnchor: 'left',
                refX: '30%',
                refX2: 20, // 10 + 10
                refY: 10,
                fontSize: 14,
                fill: '#333333'
            }
        }
    }, {
        markup: [{
            tagName: 'rect',
            selector: 'body'
        }, {
            tagName: 'image',
            selector: 'image'
        }, {
            tagName: 'text',
            selector: 'label'
        }]
    });

    var InscribedImage = Element$1.define('standard.InscribedImage', {
        attrs: {
            border: {
                refRx: '50%',
                refRy: '50%',
                refCx: '50%',
                refCy: '50%',
                stroke: '#333333',
                strokeWidth: 2
            },
            background: {
                refRx: '50%',
                refRy: '50%',
                refCx: '50%',
                refCy: '50%',
                fill: '#FFFFFF'
            },
            image: {
                // The image corners touch the border when its size is Math.sqrt(2) / 2 = 0.707.. ~= 70%
                refWidth: '68%',
                refHeight: '68%',
                // The image offset is calculated as (100% - 68%) / 2
                refX: '16%',
                refY: '16%',
                preserveAspectRatio: 'xMidYMid'
                // xlinkHref: '[URL]'
            },
            label: {
                textVerticalAnchor: 'top',
                textAnchor: 'middle',
                refX: '50%',
                refY: '100%',
                refY2: 10,
                fontSize: 14,
                fill: '#333333'
            }
        }
    }, {
        markup: [{
            tagName: 'ellipse',
            selector: 'background'
        }, {
            tagName: 'image',
            selector: 'image'
        }, {
            tagName: 'ellipse',
            selector: 'border',
            attributes: {
                'fill': 'none'
            }
        }, {
            tagName: 'text',
            selector: 'label'
        }]
    });

    var HeaderedRectangle = Element$1.define('standard.HeaderedRectangle', {
        attrs: {
            body: {
                refWidth: '100%',
                refHeight: '100%',
                strokeWidth: 2,
                stroke: '#000000',
                fill: '#FFFFFF'
            },
            header: {
                refWidth: '100%',
                height: 30,
                strokeWidth: 2,
                stroke: '#000000',
                fill: '#FFFFFF'
            },
            headerText: {
                textVerticalAnchor: 'middle',
                textAnchor: 'middle',
                refX: '50%',
                refY: 15,
                fontSize: 16,
                fill: '#333333'
            },
            bodyText: {
                textVerticalAnchor: 'middle',
                textAnchor: 'middle',
                refX: '50%',
                refY: '50%',
                refY2: 15,
                fontSize: 14,
                fill: '#333333'
            }
        }
    }, {
        markup: [{
            tagName: 'rect',
            selector: 'body'
        }, {
            tagName: 'rect',
            selector: 'header'
        }, {
            tagName: 'text',
            selector: 'headerText'
        }, {
            tagName: 'text',
            selector: 'bodyText'
        }]
    });

    var CYLINDER_TILT = 10;

    var Cylinder = Element$1.define('standard.Cylinder', {
        attrs: {
            body: {
                lateralArea: CYLINDER_TILT,
                fill: '#FFFFFF',
                stroke: '#333333',
                strokeWidth: 2
            },
            top: {
                refCx: '50%',
                cy: CYLINDER_TILT,
                refRx: '50%',
                ry: CYLINDER_TILT,
                fill: '#FFFFFF',
                stroke: '#333333',
                strokeWidth: 2
            },
            label: {
                textVerticalAnchor: 'middle',
                textAnchor: 'middle',
                refX: '50%',
                refY: '100%',
                refY2: 15,
                fontSize: 14,
                fill: '#333333'
            }
        }
    }, {
        markup: [{
            tagName: 'path',
            selector: 'body'
        }, {
            tagName: 'ellipse',
            selector: 'top'
        }, {
            tagName: 'text',
            selector: 'label'
        }],

        topRy: function(t, opt) {
            // getter
            if (t === undefined) { return this.attr('body/lateralArea'); }

            // setter
            var isPercentageSetter = isPercentage(t);

            var bodyAttrs = { lateralArea: t };
            var topAttrs = isPercentageSetter
                ? { refCy: t, refRy: t, cy: null, ry: null }
                : { refCy: null, refRy: null, cy: t, ry: t };

            return this.attr({ body: bodyAttrs, top: topAttrs }, opt);
        }

    }, {
        attributes: {
            lateralArea: {
                set: function(t, refBBox) {
                    var isPercentageSetter = isPercentage(t);
                    if (isPercentageSetter) { t = parseFloat(t) / 100; }

                    var x = refBBox.x;
                    var y = refBBox.y;
                    var w = refBBox.width;
                    var h = refBBox.height;

                    // curve control point variables
                    var rx = w / 2;
                    var ry = isPercentageSetter ? (h * t) : t;

                    var kappa = V.KAPPA;
                    var cx = kappa * rx;
                    var cy = kappa * (isPercentageSetter ? (h * t) : t);

                    // shape variables
                    var xLeft = x;
                    var xCenter = x + (w / 2);
                    var xRight = x + w;

                    var ySideTop = y + ry;
                    var yCurveTop = ySideTop - ry;
                    var ySideBottom = y + h - ry;
                    var yCurveBottom = y + h;

                    // return calculated shape
                    var data = [
                        'M', xLeft, ySideTop,
                        'L', xLeft, ySideBottom,
                        'C', x, (ySideBottom + cy), (xCenter - cx), yCurveBottom, xCenter, yCurveBottom,
                        'C', (xCenter + cx), yCurveBottom, xRight, (ySideBottom + cy), xRight, ySideBottom,
                        'L', xRight, ySideTop,
                        'C', xRight, (ySideTop - cy), (xCenter + cx), yCurveTop, xCenter, yCurveTop,
                        'C', (xCenter - cx), yCurveTop, xLeft, (ySideTop - cy), xLeft, ySideTop,
                        'Z'
                    ];
                    return { d: data.join(' ') };
                }
            }
        }
    });

    var foLabelMarkup = {
        tagName: 'foreignObject',
        selector: 'foreignObject',
        attributes: {
            'overflow': 'hidden'
        },
        children: [{
            tagName: 'div',
            namespaceURI: 'http://www.w3.org/1999/xhtml',
            selector: 'label',
            style: {
                width: '100%',
                height: '100%',
                position: 'static',
                backgroundColor: 'transparent',
                textAlign: 'center',
                margin: 0,
                padding: '0px 5px',
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }
        }]
    };

    var svgLabelMarkup = {
        tagName: 'text',
        selector: 'label',
        attributes: {
            'text-anchor': 'middle'
        }
    };

    var labelMarkup = (env.test('svgforeignobject')) ? foLabelMarkup : svgLabelMarkup;

    var TextBlock$1 = Element$1.define('standard.TextBlock', {
        attrs: {
            body: {
                refWidth: '100%',
                refHeight: '100%',
                stroke: '#333333',
                fill: '#ffffff',
                strokeWidth: 2
            },
            foreignObject: {
                refWidth: '100%',
                refHeight: '100%'
            },
            label: {
                style: {
                    fontSize: 14
                }
            }
        }
    }, {
        markup: [{
            tagName: 'rect',
            selector: 'body'
        }, labelMarkup]
    }, {
        attributes: {
            text: {
                set: function(text, refBBox, node, attrs) {
                    if (node instanceof HTMLElement) {
                        node.textContent = text;
                    } else {
                        // No foreign object
                        var style = attrs.style || {};
                        var wrapValue = { text: text, width: -5, height: '100%' };
                        var wrapAttrs = assign({ textVerticalAnchor: 'middle' }, style);
                        attributes.textWrap.set.call(this, wrapValue, refBBox, node, wrapAttrs);
                        return { fill: style.color || null };
                    }
                },
                position: function(text, refBBox, node) {
                    // No foreign object
                    if (node instanceof SVGElement) { return refBBox.center(); }
                }
            }
        }
    });

    // LINKS

    var Link$1 = Link.define('standard.Link', {
        attrs: {
            line: {
                connection: true,
                stroke: '#333333',
                strokeWidth: 2,
                strokeLinejoin: 'round',
                targetMarker: {
                    'type': 'path',
                    'd': 'M 10 -5 0 0 10 5 z'
                }
            },
            wrapper: {
                connection: true,
                strokeWidth: 10,
                strokeLinejoin: 'round'
            }
        }
    }, {
        markup: [{
            tagName: 'path',
            selector: 'wrapper',
            attributes: {
                'fill': 'none',
                'cursor': 'pointer',
                'stroke': 'transparent',
                'stroke-linecap': 'round'
            }
        }, {
            tagName: 'path',
            selector: 'line',
            attributes: {
                'fill': 'none',
                'pointer-events': 'none'
            }
        }]
    });

    var DoubleLink = Link.define('standard.DoubleLink', {
        attrs: {
            line: {
                connection: true,
                stroke: '#DDDDDD',
                strokeWidth: 4,
                strokeLinejoin: 'round',
                targetMarker: {
                    type: 'path',
                    stroke: '#000000',
                    d: 'M 10 -3 10 -10 -2 0 10 10 10 3'
                }
            },
            outline: {
                connection: true,
                stroke: '#000000',
                strokeWidth: 6,
                strokeLinejoin: 'round'
            }
        }
    }, {
        markup: [{
            tagName: 'path',
            selector: 'outline',
            attributes: {
                'fill': 'none'
            }
        }, {
            tagName: 'path',
            selector: 'line',
            attributes: {
                'fill': 'none'
            }
        }]
    });

    var ShadowLink = Link.define('standard.ShadowLink', {
        attrs: {
            line: {
                connection: true,
                stroke: '#FF0000',
                strokeWidth: 20,
                strokeLinejoin: 'round',
                targetMarker: {
                    'type': 'path',
                    'stroke': 'none',
                    'd': 'M 0 -10 -10 0 0 10 z'
                },
                sourceMarker: {
                    'type': 'path',
                    'stroke': 'none',
                    'd': 'M -10 -10 0 0 -10 10 0 10 0 -10 z'
                }
            },
            shadow: {
                connection: true,
                refX: 3,
                refY: 6,
                stroke: '#000000',
                strokeOpacity: 0.2,
                strokeWidth: 20,
                strokeLinejoin: 'round',
                targetMarker: {
                    'type': 'path',
                    'd': 'M 0 -10 -10 0 0 10 z',
                    'stroke': 'none'
                },
                sourceMarker: {
                    'type': 'path',
                    'stroke': 'none',
                    'd': 'M -10 -10 0 0 -10 10 0 10 0 -10 z'
                }
            }
        }
    }, {
        markup: [{
            tagName: 'path',
            selector: 'shadow',
            attributes: {
                'fill': 'none'
            }
        }, {
            tagName: 'path',
            selector: 'line',
            attributes: {
                'fill': 'none'
            }
        }]
    });

    var standard = ({
        Rectangle: Rectangle,
        Circle: Circle$1,
        Ellipse: Ellipse$2,
        Path: Path$2,
        Polygon: Polygon$1,
        Polyline: Polyline$2,
        Image: Image$1,
        BorderedImage: BorderedImage,
        EmbeddedImage: EmbeddedImage,
        InscribedImage: InscribedImage,
        HeaderedRectangle: HeaderedRectangle,
        Cylinder: Cylinder,
        TextBlock: TextBlock$1,
        Link: Link$1,
        DoubleLink: DoubleLink,
        ShadowLink: ShadowLink
    });

    // default size of jump if not specified in options
    var JUMP_SIZE = 5;

    // available jump types
    // first one taken as default
    var JUMP_TYPES = ['arc', 'gap', 'cubic'];

    // takes care of math. error for case when jump is too close to end of line
    var CLOSE_PROXIMITY_PADDING = 1;

    // list of connector types not to jump over.
    var IGNORED_CONNECTORS = ['smooth'];

    /**
     * Transform start/end and route into series of lines
     * @param {g.point} sourcePoint start point
     * @param {g.point} targetPoint end point
     * @param {g.point[]} route optional list of route
     * @return {g.line[]} [description]
     */
    function createLines(sourcePoint, targetPoint, route) {
        // make a flattened array of all points
        var points = [].concat(sourcePoint, route, targetPoint);
        return points.reduce(function(resultLines, point$$1, idx) {
            // if there is a next point, make a line with it
            var nextPoint = points[idx + 1];
            if (nextPoint != null) {
                resultLines[idx] = line(point$$1, nextPoint);
            }
            return resultLines;
        }, []);
    }

    function setupUpdating(jumpOverLinkView) {
        var updateList = jumpOverLinkView.paper._jumpOverUpdateList;

        // first time setup for this paper
        if (updateList == null) {
            updateList = jumpOverLinkView.paper._jumpOverUpdateList = [];
            jumpOverLinkView.paper.on('cell:pointerup', updateJumpOver);
            jumpOverLinkView.paper.model.on('reset', function() {
                updateList = jumpOverLinkView.paper._jumpOverUpdateList = [];
            });
        }

        // add this link to a list so it can be updated when some other link is updated
        if (updateList.indexOf(jumpOverLinkView) < 0) {
            updateList.push(jumpOverLinkView);

            // watch for change of connector type or removal of link itself
            // to remove the link from a list of jump over connectors
            jumpOverLinkView.listenToOnce(jumpOverLinkView.model, 'change:connector remove', function() {
                updateList.splice(updateList.indexOf(jumpOverLinkView), 1);
            });
        }
    }

    /**
     * Handler for a batch:stop event to force
     * update of all registered links with jump over connector
     * @param {object} batchEvent optional object with info about batch
     */
    function updateJumpOver() {
        var updateList = this._jumpOverUpdateList;
        for (var i = 0; i < updateList.length; i++) {
            updateList[i].update();
        }
    }

    /**
     * Utility function to collect all intersection poinst of a single
     * line against group of other lines.
     * @param {g.line} line where to find points
     * @param {g.line[]} crossCheckLines lines to cross
     * @return {g.point[]} list of intersection points
     */
    function findLineIntersections(line$$1, crossCheckLines) {
        return toArray(crossCheckLines).reduce(function(res, crossCheckLine) {
            var intersection$$1 = line$$1.intersection(crossCheckLine);
            if (intersection$$1) {
                res.push(intersection$$1);
            }
            return res;
        }, []);
    }

    /**
     * Sorting function for list of points by their distance.
     * @param {g.point} p1 first point
     * @param {g.point} p2 second point
     * @return {number} squared distance between points
     */
    function sortPoints(p1, p2) {
        return line(p1, p2).squaredLength();
    }

    /**
     * Split input line into multiple based on intersection points.
     * @param {g.line} line input line to split
     * @param {g.point[]} intersections poinst where to split the line
     * @param {number} jumpSize the size of jump arc (length empty spot on a line)
     * @return {g.line[]} list of lines being split
     */
    function createJumps(line$$1, intersections, jumpSize) {
        return intersections.reduce(function(resultLines, point$$1, idx) {
            // skipping points that were merged with the previous line
            // to make bigger arc over multiple lines that are close to each other
            if (point$$1.skip === true) {
                return resultLines;
            }

            // always grab the last line from buffer and modify it
            var lastLine = resultLines.pop() || line$$1;

            // calculate start and end of jump by moving by a given size of jump
            var jumpStart = point(point$$1).move(lastLine.start, -(jumpSize));
            var jumpEnd = point(point$$1).move(lastLine.start, +(jumpSize));

            // now try to look at the next intersection point
            var nextPoint = intersections[idx + 1];
            if (nextPoint != null) {
                var distance = jumpEnd.distance(nextPoint);
                if (distance <= jumpSize) {
                    // next point is close enough, move the jump end by this
                    // difference and mark the next point to be skipped
                    jumpEnd = nextPoint.move(lastLine.start, distance);
                    nextPoint.skip = true;
                }
            } else {
                // this block is inside of `else` as an optimization so the distance is
                // not calculated when we know there are no other intersection points
                var endDistance = jumpStart.distance(lastLine.end);
                // if the end is too close to possible jump, draw remaining line instead of a jump
                if (endDistance < jumpSize * 2 + CLOSE_PROXIMITY_PADDING) {
                    resultLines.push(lastLine);
                    return resultLines;
                }
            }

            var startDistance = jumpEnd.distance(lastLine.start);
            if (startDistance < jumpSize * 2 + CLOSE_PROXIMITY_PADDING) {
                // if the start of line is too close to jump, draw that line instead of a jump
                resultLines.push(lastLine);
                return resultLines;
            }

            // finally create a jump line
            var jumpLine = line(jumpStart, jumpEnd);
            // it's just simple line but with a `isJump` property
            jumpLine.isJump = true;

            resultLines.push(
                line(lastLine.start, jumpStart),
                jumpLine,
                line(jumpEnd, lastLine.end)
            );
            return resultLines;
        }, []);
    }

    /**
     * Assemble `D` attribute of a SVG path by iterating given lines.
     * @param {g.line[]} lines source lines to use
     * @param {number} jumpSize the size of jump arc (length empty spot on a line)
     * @return {string}
     */
    function buildPath(lines, jumpSize, jumpType) {

        var path = new Path();
        var segment;

        // first move to the start of a first line
        segment = Path.createSegment('M', lines[0].start);
        path.appendSegment(segment);

        // make a paths from lines
        toArray(lines).forEach(function(line$$1, index) {

            if (line$$1.isJump) {
                var angle, diff;

                var control1, control2;

                if (jumpType === 'arc') { // approximates semicircle with 2 curves
                    angle = -90;
                    // determine rotation of arc based on difference between points
                    diff = line$$1.start.difference(line$$1.end);
                    // make sure the arc always points up (or right)
                    var xAxisRotate = Number((diff.x < 0) || (diff.x === 0 && diff.y < 0));
                    if (xAxisRotate) { angle += 180; }

                    var midpoint = line$$1.midpoint();
                    var centerLine = new Line(midpoint, line$$1.end).rotate(midpoint, angle);

                    var halfLine;

                    // first half
                    halfLine = new Line(line$$1.start, midpoint);

                    control1 = halfLine.pointAt(2 / 3).rotate(line$$1.start, angle);
                    control2 = centerLine.pointAt(1 / 3).rotate(centerLine.end, -angle);

                    segment = Path.createSegment('C', control1, control2, centerLine.end);
                    path.appendSegment(segment);

                    // second half
                    halfLine = new Line(midpoint, line$$1.end);

                    control1 = centerLine.pointAt(1 / 3).rotate(centerLine.end, angle);
                    control2 = halfLine.pointAt(1 / 3).rotate(line$$1.end, -angle);

                    segment = Path.createSegment('C', control1, control2, line$$1.end);
                    path.appendSegment(segment);

                } else if (jumpType === 'gap') {
                    segment = Path.createSegment('M', line$$1.end);
                    path.appendSegment(segment);

                } else if (jumpType === 'cubic') { // approximates semicircle with 1 curve
                    angle = line$$1.start.theta(line$$1.end);

                    var xOffset = jumpSize * 0.6;
                    var yOffset = jumpSize * 1.35;

                    // determine rotation of arc based on difference between points
                    diff = line$$1.start.difference(line$$1.end);
                    // make sure the arc always points up (or right)
                    xAxisRotate = Number((diff.x < 0) || (diff.x === 0 && diff.y < 0));
                    if (xAxisRotate) { yOffset *= -1; }

                    control1 = Point(line$$1.start.x + xOffset, line$$1.start.y + yOffset).rotate(line$$1.start, angle);
                    control2 = Point(line$$1.end.x - xOffset, line$$1.end.y + yOffset).rotate(line$$1.end, angle);

                    segment = Path.createSegment('C', control1, control2, line$$1.end);
                    path.appendSegment(segment);
                }

            } else {
                segment = Path.createSegment('L', line$$1.end);
                path.appendSegment(segment);
            }
        });

        return path;
    }

    /**
     * Actual connector function that will be run on every update.
     * @param {g.point} sourcePoint start point of this link
     * @param {g.point} targetPoint end point of this link
     * @param {g.point[]} route of this link
     * @param {object} opt options
     * @property {number} size optional size of a jump arc
     * @return {string} created `D` attribute of SVG path
     */
    var jumpover = function(sourcePoint, targetPoint, route, opt) { // eslint-disable-line max-params

        setupUpdating(this);

        var raw = opt.raw;
        var jumpSize = opt.size || JUMP_SIZE;
        var jumpType = opt.jump && ('' + opt.jump).toLowerCase();
        var ignoreConnectors = opt.ignoreConnectors || IGNORED_CONNECTORS;

        // grab the first jump type as a default if specified one is invalid
        if (JUMP_TYPES.indexOf(jumpType) === -1) {
            jumpType = JUMP_TYPES[0];
        }

        var paper = this.paper;
        var graph = paper.model;
        var allLinks = graph.getLinks();

        // there is just one link, draw it directly
        if (allLinks.length === 1) {
            return buildPath(
                createLines(sourcePoint, targetPoint, route),
                jumpSize, jumpType
            );
        }

        var thisModel = this.model;
        var thisIndex = allLinks.indexOf(thisModel);
        var defaultConnector = paper.options.defaultConnector || {};

        // not all links are meant to be jumped over.
        var links = allLinks.filter(function(link, idx) {

            var connector = link.get('connector') || defaultConnector;

            // avoid jumping over links with connector type listed in `ignored connectors`.
            if (toArray(ignoreConnectors).includes(connector.name)) {
                return false;
            }
            // filter out links that are above this one and  have the same connector type
            // otherwise there would double hoops for each intersection
            if (idx > thisIndex) {
                return connector.name !== 'jumpover';
            }
            return true;
        });

        // find views for all links
        var linkViews = links.map(function(link) {
            return paper.findViewByModel(link);
        });

        // create lines for this link
        var thisLines = createLines(
            sourcePoint,
            targetPoint,
            route
        );

        // create lines for all other links
        var linkLines = linkViews.map(function(linkView) {
            if (linkView == null) {
                return [];
            }
            if (linkView === this) {
                return thisLines;
            }
            return createLines(
                linkView.sourcePoint,
                linkView.targetPoint,
                linkView.route
            );
        }, this);

        // transform lines for this link by splitting with jump lines at
        // points of intersection with other links
        var jumpingLines = thisLines.reduce(function(resultLines, thisLine) {
            // iterate all links and grab the intersections with this line
            // these are then sorted by distance so the line can be split more easily

            var intersections = links.reduce(function(res, link, i) {
                // don't intersection with itself
                if (link !== thisModel) {

                    var lineIntersections = findLineIntersections(thisLine, linkLines[i]);
                    res.push.apply(res, lineIntersections);
                }
                return res;
            }, []).sort(function(a, b) {
                return sortPoints(thisLine.start, a) - sortPoints(thisLine.start, b);
            });

            if (intersections.length > 0) {
                // split the line based on found intersection points
                resultLines.push.apply(resultLines, createJumps(thisLine, intersections, jumpSize));
            } else {
                // without any intersection the line goes uninterrupted
                resultLines.push(thisLine);
            }
            return resultLines;
        }, []);

        var path = buildPath(jumpingLines, jumpSize, jumpType);
        return (raw) ? path : path.serialize();
    };

    var normal = function(sourcePoint, targetPoint, route, opt) {

        var raw = opt && opt.raw;
        var points = [sourcePoint].concat(route).concat([targetPoint]);

        var polyline = new Polyline(points);
        var path = new Path(polyline);

        return (raw) ? path : path.serialize();
    };

    var rounded = function(sourcePoint, targetPoint, route, opt) {

        opt || (opt = {});

        var offset = opt.radius || 10;
        var raw = opt.raw;
        var path = new Path();
        var segment;

        segment = Path.createSegment('M', sourcePoint);
        path.appendSegment(segment);

        var _13 = 1 / 3;
        var _23 = 2 / 3;

        var curr;
        var prev, next;
        var prevDistance, nextDistance;
        var startMove, endMove;
        var roundedStart, roundedEnd;
        var control1, control2;

        for (var index = 0, n = route.length; index < n; index++) {

            curr = new Point(route[index]);

            prev = route[index - 1] || sourcePoint;
            next = route[index + 1] || targetPoint;

            prevDistance = nextDistance || (curr.distance(prev) / 2);
            nextDistance = curr.distance(next) / 2;

            startMove = -Math.min(offset, prevDistance);
            endMove = -Math.min(offset, nextDistance);

            roundedStart = curr.clone().move(prev, startMove).round();
            roundedEnd = curr.clone().move(next, endMove).round();

            control1 = new Point((_13 * roundedStart.x) + (_23 * curr.x), (_23 * curr.y) + (_13 * roundedStart.y));
            control2 = new Point((_13 * roundedEnd.x) + (_23 * curr.x), (_23 * curr.y) + (_13 * roundedEnd.y));

            segment = Path.createSegment('L', roundedStart);
            path.appendSegment(segment);

            segment = Path.createSegment('C', control1, control2, roundedEnd);
            path.appendSegment(segment);
        }

        segment = Path.createSegment('L', targetPoint);
        path.appendSegment(segment);

        return (raw) ? path : path.serialize();
    };

    var smooth = function(sourcePoint, targetPoint, route, opt) {

        var raw = opt && opt.raw;
        var path;

        if (route && route.length !== 0) {

            var points = [sourcePoint].concat(route).concat([targetPoint]);
            var curves = Curve.throughPoints(points);

            path = new Path(curves);

        } else {
            // if we have no route, use a default cubic bezier curve
            // cubic bezier requires two control points
            // the control points have `x` midway between source and target
            // this produces an S-like curve

            path = new Path();

            var segment;

            segment = Path.createSegment('M', sourcePoint);
            path.appendSegment(segment);

            if ((Math.abs(sourcePoint.x - targetPoint.x)) >= (Math.abs(sourcePoint.y - targetPoint.y))) {
                var controlPointX = (sourcePoint.x + targetPoint.x) / 2;

                segment = Path.createSegment('C', controlPointX, sourcePoint.y, controlPointX, targetPoint.y, targetPoint.x, targetPoint.y);
                path.appendSegment(segment);

            } else {
                var controlPointY = (sourcePoint.y + targetPoint.y) / 2;

                segment = Path.createSegment('C', sourcePoint.x, controlPointY, targetPoint.x, controlPointY, targetPoint.x, targetPoint.y);
                path.appendSegment(segment);

            }
        }

        return (raw) ? path : path.serialize();
    };



    var connectors = ({
        jumpover: jumpover,
        normal: normal,
        rounded: rounded,
        smooth: smooth
    });

    var stroke = {

        defaultOptions: {

            padding: 3,
            rx: 0,
            ry: 0,
            attrs: {
                'stroke-width': 3,
                'stroke': '#FEB663'
            }
        },

        _views: {},

        getHighlighterId: function(magnetEl, opt) {

            return magnetEl.id + JSON.stringify(opt);
        },

        removeHighlighter: function(id) {
            if (this._views[id]) {
                this._views[id].remove();
                this._views[id] = null;
            }
        },

        /**
         * @param {joint.dia.CellView} cellView
         * @param {Element} magnetEl
         * @param {object=} opt
         */
        highlight: function(cellView, magnetEl, opt) {

            var id = this.getHighlighterId(magnetEl, opt);

            // Only highlight once.
            if (this._views[id]) { return; }

            var options = defaults(opt || {}, this.defaultOptions);

            var magnetVel = V(magnetEl);
            var magnetBBox;

            try {

                var pathData = magnetVel.convertToPathData();

            } catch (error) {

                // Failed to get path data from magnet element.
                // Draw a rectangle around the entire cell view instead.
                magnetBBox = magnetVel.bbox(true/* without transforms */);
                pathData = V.rectToPath(assign({}, options, magnetBBox));
            }

            var highlightVel = V('path').attr({
                'd': pathData,
                'pointer-events': 'none',
                'vector-effect': 'non-scaling-stroke',
                'fill': 'none'
            }).attr(options.attrs);

            if (cellView.isNodeConnection(magnetEl)) {

                highlightVel.attr('d', cellView.getSerializedConnection());

            } else {

                var highlightMatrix = magnetVel.getTransformToElement(cellView.el);

                // Add padding to the highlight element.
                var padding = options.padding;
                if (padding) {

                    magnetBBox || (magnetBBox = magnetVel.bbox(true));

                    var cx = magnetBBox.x + (magnetBBox.width / 2);
                    var cy = magnetBBox.y + (magnetBBox.height / 2);

                    magnetBBox = V.transformRect(magnetBBox, highlightMatrix);

                    var width = Math.max(magnetBBox.width, 1);
                    var height = Math.max(magnetBBox.height, 1);
                    var sx = (width + padding) / width;
                    var sy = (height + padding) / height;

                    var paddingMatrix = V.createSVGMatrix({
                        a: sx,
                        b: 0,
                        c: 0,
                        d: sy,
                        e: cx - sx * cx,
                        f: cy - sy * cy
                    });

                    highlightMatrix = highlightMatrix.multiply(paddingMatrix);
                }

                highlightVel.transform(highlightMatrix);
            }

            // joint.mvc.View will handle the theme class name and joint class name prefix.
            var highlightView = this._views[id] = new View({
                svgElement: true,
                className: 'highlight-stroke',
                el: highlightVel.node
            });

            // Remove the highlight view when the cell is removed from the graph.
            var removeHandler = this.removeHighlighter.bind(this, id);
            var cell = cellView.model;
            highlightView.listenTo(cell, 'remove', removeHandler);
            highlightView.listenTo(cell.graph, 'reset', removeHandler);

            cellView.vel.append(highlightVel);
        },

        /**
         * @param {joint.dia.CellView} cellView
         * @param {Element} magnetEl
         * @param {object=} opt
         */
        unhighlight: function(cellView, magnetEl, opt) {

            this.removeHighlighter(this.getHighlighterId(magnetEl, opt));
        }
    };

    var opacity = {

        /**
         * @param {joint.dia.CellView} cellView
         * @param {Element} magnetEl
         */
        highlight: function(cellView, magnetEl) {

            V(magnetEl).addClass(addClassNamePrefix('highlight-opacity'));
        },

        /**
         * @param {joint.dia.CellView} cellView
         * @param {Element} magnetEl
         */
        unhighlight: function(cellView, magnetEl) {

            V(magnetEl).removeClass(addClassNamePrefix('highlight-opacity'));
        }
    };

    var addClass = {

        className: addClassNamePrefix('highlighted'),

        /**
         * @param {joint.dia.CellView} cellView
         * @param {Element} magnetEl
         * @param {object=} opt
         */
        highlight: function(cellView, magnetEl, opt) {

            var options = opt || {};
            var className = options.className || this.className;
            V(magnetEl).addClass(className);
        },

        /**
         * @param {joint.dia.CellView} cellView
         * @param {Element} magnetEl
         * @param {object=} opt
         */
        unhighlight: function(cellView, magnetEl, opt) {

            var options = opt || {};
            var className = options.className || this.className;
            V(magnetEl).removeClass(className);
        }
    };



    var highlighters = ({
        stroke: stroke,
        opacity: opacity,
        addClass: addClass
    });

    function offset(p1, p2, offset) {

        if (!isFinite(offset)) { return p1; }
        var length = p1.distance(p2);
        if (offset === 0 && length > 0) { return p1; }
        return p1.move(p2, -Math.min(offset, length - 1));
    }

    function stroke$1(magnet) {

        var stroke = magnet.getAttribute('stroke-width');
        if (stroke === null) { return 0; }
        return parseFloat(stroke) || 0;
    }

    // Connection Points

    function anchorIntersection(line$$1, view, magnet, opt) {

        return offset(line$$1.end, line$$1.start, opt.offset);
    }

    function bboxIntersection(line$$1, view, magnet, opt) {

        var bbox = view.getNodeBBox(magnet);
        if (opt.stroke) { bbox.inflate(stroke$1(magnet) / 2); }
        var intersections = line$$1.intersect(bbox);
        var cp = (intersections)
            ? line$$1.start.chooseClosest(intersections)
            : line$$1.end;
        return offset(cp, line$$1.start, opt.offset);
    }

    function rectangleIntersection(line$$1, view, magnet, opt) {

        var angle = view.model.angle();
        if (angle === 0) {
            return bboxIntersection(line$$1, view, magnet, opt);
        }

        var bboxWORotation = view.getNodeUnrotatedBBox(magnet);
        if (opt.stroke) { bboxWORotation.inflate(stroke$1(magnet) / 2); }
        var center = bboxWORotation.center();
        var lineWORotation = line$$1.clone().rotate(center, angle);
        var intersections = lineWORotation.setLength(1e6).intersect(bboxWORotation);
        var cp = (intersections)
            ? lineWORotation.start.chooseClosest(intersections).rotate(center, -angle)
            : line$$1.end;
        return offset(cp, line$$1.start, opt.offset);
    }

    function findShapeNode(magnet) {
        if (!magnet) { return null; }
        var node = magnet;
        do {
            var tagName = node.tagName;
            if (typeof tagName !== 'string') { return null; }
            tagName = tagName.toUpperCase();
            if (tagName === 'G') {
                node = node.firstElementChild;
            } else if (tagName === 'TITLE') {
                node = node.nextElementSibling;
            } else { break; }
        } while (node);
        return node;
    }

    var BNDR_SUBDIVISIONS = 'segmentSubdivisons';
    var BNDR_SHAPE_BBOX = 'shapeBBox';

    function boundaryIntersection(line$$1, view, magnet, opt) {

        var node, intersection$$1;
        var selector = opt.selector;
        var anchor = line$$1.end;

        if (typeof selector === 'string') {
            node = view.findBySelector(selector)[0];
        } else if (Array.isArray(selector)) {
            node = getByPath(magnet, selector);
        } else {
            node = findShapeNode(magnet);
        }

        if (!V.isSVGGraphicsElement(node)) {
            if (node === magnet || !V.isSVGGraphicsElement(magnet)) { return anchor; }
            node = magnet;
        }

        var localShape = view.getNodeShape(node);
        var magnetMatrix = view.getNodeMatrix(node);
        var translateMatrix = view.getRootTranslateMatrix();
        var rotateMatrix = view.getRootRotateMatrix();
        var targetMatrix = translateMatrix.multiply(rotateMatrix).multiply(magnetMatrix);
        var localMatrix = targetMatrix.inverse();
        var localLine = V.transformLine(line$$1, localMatrix);
        var localRef = localLine.start.clone();
        var data = view.getNodeData(node);

        if (opt.insideout === false) {
            if (!data[BNDR_SHAPE_BBOX]) { data[BNDR_SHAPE_BBOX] = localShape.bbox(); }
            var localBBox = data[BNDR_SHAPE_BBOX];
            if (localBBox.containsPoint(localRef)) { return anchor; }
        }

        // Caching segment subdivisions for paths
        var pathOpt;
        if (localShape instanceof Path) {
            var precision = opt.precision || 2;
            if (!data[BNDR_SUBDIVISIONS]) { data[BNDR_SUBDIVISIONS] = localShape.getSegmentSubdivisions({ precision: precision }); }
            pathOpt = {
                precision: precision,
                segmentSubdivisions: data[BNDR_SUBDIVISIONS]
            };
        }

        if (opt.extrapolate === true) { localLine.setLength(1e6); }

        intersection$$1 = localLine.intersect(localShape, pathOpt);
        if (intersection$$1) {
            // More than one intersection
            if (V.isArray(intersection$$1)) { intersection$$1 = localRef.chooseClosest(intersection$$1); }
        } else if (opt.sticky === true) {
            // No intersection, find the closest point instead
            if (localShape instanceof Rect) {
                intersection$$1 = localShape.pointNearestToPoint(localRef);
            } else if (localShape instanceof Ellipse) {
                intersection$$1 = localShape.intersectionWithLineFromCenterToPoint(localRef);
            } else {
                intersection$$1 = localShape.closestPoint(localRef, pathOpt);
            }
        }

        var cp = (intersection$$1) ? V.transformPoint(intersection$$1, targetMatrix) : anchor;
        var cpOffset = opt.offset || 0;
        if (opt.stroke) { cpOffset += stroke$1(node) / 2; }

        return offset(cp, line$$1.start, cpOffset);
    }

    var anchor = anchorIntersection;
    var bbox = bboxIntersection;
    var rectangle = rectangleIntersection;
    var boundary = boundaryIntersection;

    var connectionPoints = ({
        anchor: anchor,
        bbox: bbox,
        rectangle: rectangle,
        boundary: boundary
    });

    function abs2rel(value, max) {

        if (max === 0) { return '0%'; }
        return Math.round(value / max * 100) + '%';
    }

    function pin(relative) {

        return function(end, view, magnet, coords) {
            var fn = (view.isNodeConnection(magnet)) ? pinnedLinkEnd : pinnedElementEnd;
            return fn(relative, end, view, magnet, coords);
        };
    }

    function pinnedElementEnd(relative, end, view, magnet, coords) {

        var angle = view.model.angle();
        var bbox = view.getNodeUnrotatedBBox(magnet);
        var origin = view.model.getBBox().center();
        coords.rotate(origin, angle);
        var dx = coords.x - bbox.x;
        var dy = coords.y - bbox.y;

        if (relative) {
            dx = abs2rel(dx, bbox.width);
            dy = abs2rel(dy, bbox.height);
        }

        end.anchor = {
            name: 'topLeft',
            args: {
                dx: dx,
                dy: dy,
                rotate: true
            }
        };

        return end;
    }

    function pinnedLinkEnd(relative, end, view, _magnet, coords) {

        var connection = view.getConnection();
        if (!connection) { return end; }
        var length = connection.closestPointLength(coords);
        if (relative) {
            var totalLength = connection.length();
            end.anchor = {
                name: 'connectionRatio',
                args: {
                    ratio: length / totalLength
                }
            };
        } else {
            end.anchor = {
                name: 'connectionLength',
                args: {
                    length: length
                }
            };
        }
        return end;
    }

    var useDefaults = noop;
    var pinAbsolute = pin(false);
    var pinRelative = pin(true);

    var index$2 = ({
        useDefaults: useDefaults,
        pinAbsolute: pinAbsolute,
        pinRelative: pinRelative
    });

    // Does not make any changes to vertices.
    // Returns the arguments that are passed to it, unchanged.
    var normal$1 = function(vertices, opt, linkView) {

        return vertices;
    };

    // Routes the link always to/from a certain side
    //
    // Arguments:
    //   padding ... gap between the element and the first vertex. :: Default 40.
    //   side ... 'left' | 'right' | 'top' | 'bottom' :: Default 'bottom'.
    //
    var oneSide = function(vertices, opt, linkView) {

        var side = opt.side || 'bottom';
        var padding = normalizeSides(opt.padding || 40);

        // LinkView contains cached source an target bboxes.
        // Note that those are Geometry rectangle objects.
        var sourceBBox = linkView.sourceBBox;
        var targetBBox = linkView.targetBBox;
        var sourcePoint = sourceBBox.center();
        var targetPoint = targetBBox.center();

        var coordinate, dimension, direction;

        switch (side) {
            case 'bottom':
                direction = 1;
                coordinate = 'y';
                dimension = 'height';
                break;
            case 'top':
                direction = -1;
                coordinate = 'y';
                dimension = 'height';
                break;
            case 'left':
                direction = -1;
                coordinate = 'x';
                dimension = 'width';
                break;
            case 'right':
                direction = 1;
                coordinate = 'x';
                dimension = 'width';
                break;
            default:
                throw new Error('Router: invalid side');
        }

        // move the points from the center of the element to outside of it.
        sourcePoint[coordinate] += direction * (sourceBBox[dimension] / 2 + padding[side]);
        targetPoint[coordinate] += direction * (targetBBox[dimension] / 2 + padding[side]);

        // make link orthogonal (at least the first and last vertex).
        if ((direction * (sourcePoint[coordinate] - targetPoint[coordinate])) > 0) {
            targetPoint[coordinate] = sourcePoint[coordinate];
        } else {
            sourcePoint[coordinate] = targetPoint[coordinate];
        }

        return [sourcePoint].concat(vertices, targetPoint);
    };

    // bearing -> opposite bearing
    var opposites = {
        N: 'S',
        S: 'N',
        E: 'W',
        W: 'E'
    };

    // bearing -> radians
    var radians = {
        N: -Math.PI / 2 * 3,
        S: -Math.PI / 2,
        E: 0,
        W: Math.PI
    };

    // HELPERS //

    // returns a point `p` where lines p,p1 and p,p2 are perpendicular and p is not contained
    // in the given box
    function freeJoin(p1, p2, bbox) {

        var p = new Point(p1.x, p2.y);
        if (bbox.containsPoint(p)) { p = new Point(p2.x, p1.y); }
        // kept for reference
        // if (bbox.containsPoint(p)) p = null;

        return p;
    }

    // returns either width or height of a bbox based on the given bearing
    function getBBoxSize(bbox, bearing) {

        return bbox[(bearing === 'W' || bearing === 'E') ? 'width' : 'height'];
    }

    // simple bearing method (calculates only orthogonal cardinals)
    function getBearing(from, to) {

        if (from.x === to.x) { return (from.y > to.y) ? 'N' : 'S'; }
        if (from.y === to.y) { return (from.x > to.x) ? 'W' : 'E'; }
        return null;
    }

    // transform point to a rect
    function getPointBox(p) {

        return new Rect(p.x, p.y, 0, 0);
    }

    function getPaddingBox(opt) {

        // if both provided, opt.padding wins over opt.elementPadding
        var sides = normalizeSides(opt.padding || opt.elementPadding || 20);

        return {
            x: -sides.left,
            y: -sides.top,
            width: sides.left + sides.right,
            height: sides.top + sides.bottom
        };
    }

    // return source bbox
    function getSourceBBox(linkView, opt) {

        return linkView.sourceBBox.clone().moveAndExpand(getPaddingBox(opt));
    }

    // return target bbox
    function getTargetBBox(linkView, opt) {

        return linkView.targetBBox.clone().moveAndExpand(getPaddingBox(opt));
    }

    // return source anchor
    function getSourceAnchor(linkView, opt) {

        if (linkView.sourceAnchor) { return linkView.sourceAnchor; }

        // fallback: center of bbox
        var sourceBBox = getSourceBBox(linkView, opt);
        return sourceBBox.center();
    }

    // return target anchor
    function getTargetAnchor(linkView, opt) {

        if (linkView.targetAnchor) { return linkView.targetAnchor; }

        // fallback: center of bbox
        var targetBBox = getTargetBBox(linkView, opt);
        return targetBBox.center(); // default
    }

    // PARTIAL ROUTERS //

    function vertexVertex(from, to, bearing) {

        var p1 = new Point(from.x, to.y);
        var p2 = new Point(to.x, from.y);
        var d1 = getBearing(from, p1);
        var d2 = getBearing(from, p2);
        var opposite = opposites[bearing];

        var p = (d1 === bearing || (d1 !== opposite && (d2 === opposite || d2 !== bearing))) ? p1 : p2;

        return { points: [p], direction: getBearing(p, to) };
    }

    function elementVertex(from, to, fromBBox) {

        var p = freeJoin(from, to, fromBBox);

        return { points: [p], direction: getBearing(p, to) };
    }

    function vertexElement(from, to, toBBox, bearing) {

        var route = {};

        var points = [new Point(from.x, to.y), new Point(to.x, from.y)];
        var freePoints = points.filter(function(pt) {
            return !toBBox.containsPoint(pt);
        });
        var freeBearingPoints = freePoints.filter(function(pt) {
            return getBearing(pt, from) !== bearing;
        });

        var p;

        if (freeBearingPoints.length > 0) {
            // Try to pick a point which bears the same direction as the previous segment.

            p = freeBearingPoints.filter(function(pt) {
                return getBearing(from, pt) === bearing;
            }).pop();
            p = p || freeBearingPoints[0];

            route.points = [p];
            route.direction = getBearing(p, to);

        } else {
            // Here we found only points which are either contained in the element or they would create
            // a link segment going in opposite direction from the previous one.
            // We take the point inside element and move it outside the element in the direction the
            // route is going. Now we can join this point with the current end (using freeJoin).

            p = difference(points, freePoints)[0];

            var p2 = (new Point(to)).move(p, -getBBoxSize(toBBox, bearing) / 2);
            var p1 = freeJoin(p2, from, toBBox);

            route.points = [p1, p2];
            route.direction = getBearing(p2, to);
        }

        return route;
    }

    function elementElement(from, to, fromBBox, toBBox) {

        var route = elementVertex(to, from, toBBox);
        var p1 = route.points[0];

        if (fromBBox.containsPoint(p1)) {

            route = elementVertex(from, to, fromBBox);
            var p2 = route.points[0];

            if (toBBox.containsPoint(p2)) {

                var fromBorder = (new Point(from)).move(p2, -getBBoxSize(fromBBox, getBearing(from, p2)) / 2);
                var toBorder = (new Point(to)).move(p1, -getBBoxSize(toBBox, getBearing(to, p1)) / 2);
                var mid = (new Line(fromBorder, toBorder)).midpoint();

                var startRoute = elementVertex(from, mid, fromBBox);
                var endRoute = vertexVertex(mid, to, startRoute.direction);

                route.points = [startRoute.points[0], endRoute.points[0]];
                route.direction = endRoute.direction;
            }
        }

        return route;
    }

    // Finds route for situations where one element is inside the other.
    // Typically the route is directed outside the outer element first and
    // then back towards the inner element.
    function insideElement(from, to, fromBBox, toBBox, bearing) {

        var route = {};
        var boundary = fromBBox.union(toBBox).inflate(1);

        // start from the point which is closer to the boundary
        var reversed = boundary.center().distance(to) > boundary.center().distance(from);
        var start = reversed ? to : from;
        var end = reversed ? from : to;

        var p1, p2, p3;

        if (bearing) {
            // Points on circle with radius equals 'W + H` are always outside the rectangle
            // with width W and height H if the center of that circle is the center of that rectangle.
            p1 = Point.fromPolar(boundary.width + boundary.height, radians[bearing], start);
            p1 = boundary.pointNearestToPoint(p1).move(p1, -1);

        } else {
            p1 = boundary.pointNearestToPoint(start).move(start, 1);
        }

        p2 = freeJoin(p1, end, boundary);

        if (p1.round().equals(p2.round())) {
            p2 = Point.fromPolar(boundary.width + boundary.height, toRad(p1.theta(start)) + Math.PI / 2, end);
            p2 = boundary.pointNearestToPoint(p2).move(end, 1).round();
            p3 = freeJoin(p1, p2, boundary);
            route.points = reversed ? [p2, p3, p1] : [p1, p3, p2];

        } else {
            route.points = reversed ? [p2, p1] : [p1, p2];
        }

        route.direction = reversed ? getBearing(p1, to) : getBearing(p2, to);

        return route;
    }

    // MAIN ROUTER //

    // Return points through which a connection needs to be drawn in order to obtain an orthogonal link
    // routing from source to target going through `vertices`.
    function orthogonal(vertices, opt, linkView) {

        var sourceBBox = getSourceBBox(linkView, opt);
        var targetBBox = getTargetBBox(linkView, opt);

        var sourceAnchor = getSourceAnchor(linkView, opt);
        var targetAnchor = getTargetAnchor(linkView, opt);

        // if anchor lies outside of bbox, the bbox expands to include it
        sourceBBox = sourceBBox.union(getPointBox(sourceAnchor));
        targetBBox = targetBBox.union(getPointBox(targetAnchor));

        vertices = toArray(vertices).map(Point);
        vertices.unshift(sourceAnchor);
        vertices.push(targetAnchor);

        var bearing; // bearing of previous route segment

        var orthogonalVertices = []; // the array of found orthogonal vertices to be returned
        for (var i = 0, max = vertices.length - 1; i < max; i++) {

            var route = null;

            var from = vertices[i];
            var to = vertices[i + 1];

            var isOrthogonal = !!getBearing(from, to);

            if (i === 0) { // source

                if (i + 1 === max) { // route source -> target

                    // Expand one of the elements by 1px to detect situations when the two
                    // elements are positioned next to each other with no gap in between.
                    if (sourceBBox.intersect(targetBBox.clone().inflate(1))) {
                        route = insideElement(from, to, sourceBBox, targetBBox);

                    } else if (!isOrthogonal) {
                        route = elementElement(from, to, sourceBBox, targetBBox);
                    }

                } else { // route source -> vertex

                    if (sourceBBox.containsPoint(to)) {
                        route = insideElement(from, to, sourceBBox, getPointBox(to).moveAndExpand(getPaddingBox(opt)));

                    } else if (!isOrthogonal) {
                        route = elementVertex(from, to, sourceBBox);
                    }
                }

            } else if (i + 1 === max) { // route vertex -> target

                // prevent overlaps with previous line segment
                var isOrthogonalLoop = isOrthogonal && getBearing(to, from) === bearing;

                if (targetBBox.containsPoint(from) || isOrthogonalLoop) {
                    route = insideElement(from, to, getPointBox(from).moveAndExpand(getPaddingBox(opt)), targetBBox, bearing);

                } else if (!isOrthogonal) {
                    route = vertexElement(from, to, targetBBox, bearing);
                }

            } else if (!isOrthogonal) { // route vertex -> vertex
                route = vertexVertex(from, to, bearing);
            }

            // applicable to all routes:

            // set bearing for next iteration
            if (route) {
                Array.prototype.push.apply(orthogonalVertices, route.points);
                bearing = route.direction;

            } else {
                // orthogonal route and not looped
                bearing = getBearing(from, to);
            }

            // push `to` point to identified orthogonal vertices array
            if (i + 1 < max) {
                orthogonalVertices.push(to);
            }
        }

        return orthogonalVertices;
    }

    var config$1 = {

        // size of the step to find a route (the grid of the manhattan pathfinder)
        step: 10,

        // the number of route finding loops that cause the router to abort
        // returns fallback route instead
        maximumLoops: 2000,

        // the number of decimal places to round floating point coordinates
        precision: 1,

        // maximum change of direction
        maxAllowedDirectionChange: 90,

        // should the router use perpendicular linkView option?
        // does not connect anchor of element but rather a point close-by that is orthogonal
        // this looks much better
        perpendicular: true,

        // should the source and/or target not be considered as obstacles?
        excludeEnds: [], // 'source', 'target'

        // should certain types of elements not be considered as obstacles?
        excludeTypes: ['basic.Text'],

        // possible starting directions from an element
        startDirections: ['top', 'right', 'bottom', 'left'],

        // possible ending directions to an element
        endDirections: ['top', 'right', 'bottom', 'left'],

        // specify the directions used above and what they mean
        directionMap: {
            top: { x: 0, y: -1 },
            right: { x: 1, y: 0 },
            bottom: { x: 0, y: 1 },
            left: { x: -1, y: 0 }
        },

        // cost of an orthogonal step
        cost: function() {

            return this.step;
        },

        // an array of directions to find next points on the route
        // different from start/end directions
        directions: function() {

            var step = this.step;
            var cost = this.cost();

            return [
                { offsetX: step, offsetY: 0, cost: cost },
                { offsetX: 0, offsetY: step, cost: cost },
                { offsetX: -step, offsetY: 0, cost: cost },
                { offsetX: 0, offsetY: -step, cost: cost }
            ];
        },

        // a penalty received for direction change
        penalties: function() {

            return {
                0: 0,
                45: this.step / 2,
                90: this.step / 2
            };
        },

        // padding applied on the element bounding boxes
        paddingBox: function() {

            var step = this.step;

            return {
                x: -step,
                y: -step,
                width: 2 * step,
                height: 2 * step
            };
        },

        // a router to use when the manhattan router fails
        // (one of the partial routes returns null)
        fallbackRouter: function(vertices, opt, linkView) {

            if (!isFunction(orthogonal)) {
                throw new Error('Manhattan requires the orthogonal router as default fallback.');
            }

            return orthogonal(vertices, assign({}, config$1, opt), linkView);
        },

        /* Deprecated */
        // a simple route used in situations when main routing method fails
        // (exceed max number of loop iterations, inaccessible)
        fallbackRoute: function(from, to, opt) {

            return null; // null result will trigger the fallbackRouter

            // left for reference:
            /*// Find an orthogonal route ignoring obstacles.

            var point = ((opt.previousDirAngle || 0) % 180 === 0)
                    ? new g.Point(from.x, to.y)
                    : new g.Point(to.x, from.y);

            return [point];*/
        },

        // if a function is provided, it's used to route the link while dragging an end
        // i.e. function(from, to, opt) { return []; }
        draggingRoute: null
    };

    // HELPER CLASSES //

    // Map of obstacles
    // Helper structure to identify whether a point lies inside an obstacle.
    function ObstacleMap(opt) {

        this.map = {};
        this.options = opt;
        // tells how to divide the paper when creating the elements map
        this.mapGridSize = 100;
    }

    ObstacleMap.prototype.build = function(graph, link) {

        var opt = this.options;

        // source or target element could be excluded from set of obstacles
        var excludedEnds = toArray(opt.excludeEnds).reduce(function(res, item) {

            var end = link.get(item);
            if (end) {
                var cell = graph.getCell(end.id);
                if (cell) {
                    res.push(cell);
                }
            }

            return res;
        }, []);

        // Exclude any embedded elements from the source and the target element.
        var excludedAncestors = [];

        var source = graph.getCell(link.get('source').id);
        if (source) {
            excludedAncestors = union(excludedAncestors, source.getAncestors().map(function(cell) {
                return cell.id;
            }));
        }

        var target = graph.getCell(link.get('target').id);
        if (target) {
            excludedAncestors = union(excludedAncestors, target.getAncestors().map(function(cell) {
                return cell.id;
            }));
        }

        // Builds a map of all elements for quicker obstacle queries (i.e. is a point contained
        // in any obstacle?) (a simplified grid search).
        // The paper is divided into smaller cells, where each holds information about which
        // elements belong to it. When we query whether a point lies inside an obstacle we
        // don't need to go through all obstacles, we check only those in a particular cell.
        var mapGridSize = this.mapGridSize;

        graph.getElements().reduce(function(map, element) {

            var isExcludedType = toArray(opt.excludeTypes).includes(element.get('type'));
            var isExcludedEnd = excludedEnds.find(function(excluded) {
                return excluded.id === element.id;
            });
            var isExcludedAncestor = excludedAncestors.includes(element.id);

            var isExcluded = isExcludedType || isExcludedEnd || isExcludedAncestor;
            if (!isExcluded) {
                var bbox = element.getBBox().moveAndExpand(opt.paddingBox);

                var origin = bbox.origin().snapToGrid(mapGridSize);
                var corner = bbox.corner().snapToGrid(mapGridSize);

                for (var x = origin.x; x <= corner.x; x += mapGridSize) {
                    for (var y = origin.y; y <= corner.y; y += mapGridSize) {
                        var gridKey = x + '@' + y;
                        map[gridKey] = map[gridKey] || [];
                        map[gridKey].push(bbox);
                    }
                }
            }

            return map;
        }, this.map);

        return this;
    };

    ObstacleMap.prototype.isPointAccessible = function(point$$1) {

        var mapKey = point$$1.clone().snapToGrid(this.mapGridSize).toString();

        return toArray(this.map[mapKey]).every(function(obstacle) {
            return !obstacle.containsPoint(point$$1);
        });
    };

    // Sorted Set
    // Set of items sorted by given value.
    function SortedSet() {
        this.items = [];
        this.hash = {};
        this.values = {};
        this.OPEN = 1;
        this.CLOSE = 2;
    }

    SortedSet.prototype.add = function(item, value) {

        if (this.hash[item]) {
            // item removal
            this.items.splice(this.items.indexOf(item), 1);
        } else {
            this.hash[item] = this.OPEN;
        }

        this.values[item] = value;

        var index = sortedIndex(this.items, item, function(i) {
            return this.values[i];
        }.bind(this));

        this.items.splice(index, 0, item);
    };

    SortedSet.prototype.remove = function(item) {

        this.hash[item] = this.CLOSE;
    };

    SortedSet.prototype.isOpen = function(item) {

        return this.hash[item] === this.OPEN;
    };

    SortedSet.prototype.isClose = function(item) {

        return this.hash[item] === this.CLOSE;
    };

    SortedSet.prototype.isEmpty = function() {

        return this.items.length === 0;
    };

    SortedSet.prototype.pop = function() {

        var item = this.items.shift();
        this.remove(item);
        return item;
    };

    // HELPERS //

    // return source bbox
    function getSourceBBox$1(linkView, opt) {

        // expand by padding box
        if (opt && opt.paddingBox) { return linkView.sourceBBox.clone().moveAndExpand(opt.paddingBox); }

        return linkView.sourceBBox.clone();
    }

    // return target bbox
    function getTargetBBox$1(linkView, opt) {

        // expand by padding box
        if (opt && opt.paddingBox) { return linkView.targetBBox.clone().moveAndExpand(opt.paddingBox); }

        return linkView.targetBBox.clone();
    }

    // return source anchor
    function getSourceAnchor$1(linkView, opt) {

        if (linkView.sourceAnchor) { return linkView.sourceAnchor; }

        // fallback: center of bbox
        var sourceBBox = getSourceBBox$1(linkView, opt);
        return sourceBBox.center();
    }

    // return target anchor
    function getTargetAnchor$1(linkView, opt) {

        if (linkView.targetAnchor) { return linkView.targetAnchor; }

        // fallback: center of bbox
        var targetBBox = getTargetBBox$1(linkView, opt);
        return targetBBox.center(); // default
    }

    // returns a direction index from start point to end point
    // corrects for grid deformation between start and end
    function getDirectionAngle(start, end, numDirections, grid, opt) {

        var quadrant = 360 / numDirections;
        var angleTheta = start.theta(fixAngleEnd(start, end, grid, opt));
        var normalizedAngle = normalizeAngle(angleTheta + (quadrant / 2));
        return quadrant * Math.floor(normalizedAngle / quadrant);
    }

    // helper function for getDirectionAngle()
    // corrects for grid deformation
    // (if a point is one grid steps away from another in both dimensions,
    // it is considered to be 45 degrees away, even if the real angle is different)
    // this causes visible angle discrepancies if `opt.step` is much larger than `paper.gridSize`
    function fixAngleEnd(start, end, grid, opt) {

        var step = opt.step;

        var diffX = end.x - start.x;
        var diffY = end.y - start.y;

        var gridStepsX = diffX / grid.x;
        var gridStepsY = diffY / grid.y;

        var distanceX = gridStepsX * step;
        var distanceY = gridStepsY * step;

        return new Point(start.x + distanceX, start.y + distanceY);
    }

    // return the change in direction between two direction angles
    function getDirectionChange(angle1, angle2) {

        var directionChange = Math.abs(angle1 - angle2);
        return (directionChange > 180) ? (360 - directionChange) : directionChange;
    }

    // fix direction offsets according to current grid
    function getGridOffsets(directions, grid, opt) {

        var step = opt.step;

        toArray(opt.directions).forEach(function(direction) {

            direction.gridOffsetX = (direction.offsetX / step) * grid.x;
            direction.gridOffsetY = (direction.offsetY / step) * grid.y;
        });
    }

    // get grid size in x and y dimensions, adapted to source and target positions
    function getGrid(step, source, target) {

        return {
            source: source.clone(),
            x: getGridDimension(target.x - source.x, step),
            y: getGridDimension(target.y - source.y, step)
        };
    }

    // helper function for getGrid()
    function getGridDimension(diff, step) {

        // return step if diff = 0
        if (!diff) { return step; }

        var absDiff = Math.abs(diff);
        var numSteps = Math.round(absDiff / step);

        // return absDiff if less than one step apart
        if (!numSteps) { return absDiff; }

        // otherwise, return corrected step
        var roundedDiff = numSteps * step;
        var remainder = absDiff - roundedDiff;
        var stepCorrection = remainder / numSteps;

        return step + stepCorrection;
    }

    // return a clone of point snapped to grid
    function snapToGrid$1(point$$1, grid) {

        var source = grid.source;

        var snappedX = snapToGrid(point$$1.x - source.x, grid.x) + source.x;
        var snappedY = snapToGrid(point$$1.y - source.y, grid.y) + source.y;

        return new Point(snappedX, snappedY);
    }

    // round the point to opt.precision
    function round$1(point$$1, precision) {

        return point$$1.round(precision);
    }

    // snap to grid and then round the point
    function align(point$$1, grid, precision) {

        return round$1(snapToGrid$1(point$$1.clone(), grid), precision);
    }

    // return a string representing the point
    // string is rounded in both dimensions
    function getKey(point$$1) {

        return point$$1.clone().toString();
    }

    // return a normalized vector from given point
    // used to determine the direction of a difference of two points
    function normalizePoint(point$$1) {

        return new Point(
            point$$1.x === 0 ? 0 : Math.abs(point$$1.x) / point$$1.x,
            point$$1.y === 0 ? 0 : Math.abs(point$$1.y) / point$$1.y
        );
    }

    // PATHFINDING //

    // reconstructs a route by concatenating points with their parents
    function reconstructRoute(parents, points, tailPoint, from, to, grid, opt) {

        var route = [];

        var prevDiff = normalizePoint(to.difference(tailPoint));

        // tailPoint is assumed to be aligned already
        var currentKey = getKey(tailPoint);
        var parent = parents[currentKey];

        var point$$1;
        while (parent) {

            // point is assumed to be aligned already
            point$$1 = points[currentKey];

            var diff = normalizePoint(point$$1.difference(parent));
            if (!diff.equals(prevDiff)) {
                route.unshift(point$$1);
                prevDiff = diff;
            }

            // parent is assumed to be aligned already
            currentKey = getKey(parent);
            parent = parents[currentKey];
        }

        // leadPoint is assumed to be aligned already
        var leadPoint = points[currentKey];

        var fromDiff = normalizePoint(leadPoint.difference(from));
        if (!fromDiff.equals(prevDiff)) {
            route.unshift(leadPoint);
        }

        return route;
    }

    // heuristic method to determine the distance between two points
    function estimateCost(from, endPoints) {

        var min = Infinity;

        for (var i = 0, len = endPoints.length; i < len; i++) {
            var cost = from.manhattanDistance(endPoints[i]);
            if (cost < min) { min = cost; }
        }

        return min;
    }

    // find points around the bbox taking given directions into account
    // lines are drawn from anchor in given directions, intersections recorded
    // if anchor is outside bbox, only those directions that intersect get a rect point
    // the anchor itself is returned as rect point (representing some directions)
    // (since those directions are unobstructed by the bbox)
    function getRectPoints(anchor, bbox, directionList, grid, opt) {

        var precision = opt.precision;
        var directionMap = opt.directionMap;

        var anchorCenterVector = anchor.difference(bbox.center());

        var keys = isObject(directionMap) ? Object.keys(directionMap) : [];
        var dirList = toArray(directionList);
        var rectPoints = keys.reduce(function(res, key) {

            if (dirList.includes(key)) {
                var direction = directionMap[key];

                // create a line that is guaranteed to intersect the bbox if bbox is in the direction
                // even if anchor lies outside of bbox
                var endpoint = new Point(
                    anchor.x + direction.x * (Math.abs(anchorCenterVector.x) + bbox.width),
                    anchor.y + direction.y * (Math.abs(anchorCenterVector.y) + bbox.height)
                );
                var intersectionLine = new Line(anchor, endpoint);

                // get the farther intersection, in case there are two
                // (that happens if anchor lies next to bbox)
                var intersections = intersectionLine.intersect(bbox) || [];
                var numIntersections = intersections.length;
                var farthestIntersectionDistance;
                var farthestIntersection = null;
                for (var i = 0; i < numIntersections; i++) {
                    var currentIntersection = intersections[i];
                    var distance = anchor.squaredDistance(currentIntersection);
                    if ((farthestIntersectionDistance === undefined) || (distance > farthestIntersectionDistance)) {
                        farthestIntersectionDistance = distance;
                        farthestIntersection = currentIntersection;
                    }
                }

                // if an intersection was found in this direction, it is our rectPoint
                if (farthestIntersection) {
                    var point$$1 = align(farthestIntersection, grid, precision);

                    // if the rectPoint lies inside the bbox, offset it by one more step
                    if (bbox.containsPoint(point$$1)) {
                        point$$1 = align(point$$1.offset(direction.x * grid.x, direction.y * grid.y), grid, precision);
                    }

                    // then add the point to the result array
                    // aligned
                    res.push(point$$1);
                }
            }

            return res;
        }, []);

        // if anchor lies outside of bbox, add it to the array of points
        if (!bbox.containsPoint(anchor)) {
            // aligned
            rectPoints.push(align(anchor, grid, precision));
        }

        return rectPoints;
    }

    // finds the route between two points/rectangles (`from`, `to`) implementing A* algorithm
    // rectangles get rect points assigned by getRectPoints()
    function findRoute(from, to, map, opt) {

        var precision = opt.precision;

        // Get grid for this route.

        var sourceAnchor, targetAnchor;

        if (from instanceof Rect) { // `from` is sourceBBox
            sourceAnchor = round$1(getSourceAnchor$1(this, opt).clone(), precision);
        } else {
            sourceAnchor = round$1(from.clone(), precision);
        }

        if (to instanceof Rect) { // `to` is targetBBox
            targetAnchor = round$1(getTargetAnchor$1(this, opt).clone(), precision);
        } else {
            targetAnchor = round$1(to.clone(), precision);
        }

        var grid = getGrid(opt.step, sourceAnchor, targetAnchor);

        // Get pathfinding points.

        var start, end; // aligned with grid by definition
        var startPoints, endPoints; // assumed to be aligned with grid already

        // set of points we start pathfinding from
        if (from instanceof Rect) { // `from` is sourceBBox
            start = sourceAnchor;
            startPoints = getRectPoints(start, from, opt.startDirections, grid, opt);

        } else {
            start = sourceAnchor;
            startPoints = [start];
        }

        // set of points we want the pathfinding to finish at
        if (to instanceof Rect) { // `to` is targetBBox
            end = targetAnchor;
            endPoints = getRectPoints(targetAnchor, to, opt.endDirections, grid, opt);

        } else {
            end = targetAnchor;
            endPoints = [end];
        }

        // take into account only accessible rect points (those not under obstacles)
        startPoints = startPoints.filter(map.isPointAccessible, map);
        endPoints = endPoints.filter(map.isPointAccessible, map);

        // Check that there is an accessible route point on both sides.
        // Otherwise, use fallbackRoute().
        if (startPoints.length > 0 && endPoints.length > 0) {

            // The set of tentative points to be evaluated, initially containing the start points.
            // Rounded to nearest integer for simplicity.
            var openSet = new SortedSet();
            // Keeps reference to actual points for given elements of the open set.
            var points = {};
            // Keeps reference to a point that is immediate predecessor of given element.
            var parents = {};
            // Cost from start to a point along best known path.
            var costs = {};

            for (var i = 0, n = startPoints.length; i < n; i++) {
                // startPoint is assumed to be aligned already
                var startPoint = startPoints[i];

                var key = getKey(startPoint);

                openSet.add(key, estimateCost(startPoint, endPoints));
                points[key] = startPoint;
                costs[key] = 0;
            }

            var previousRouteDirectionAngle = opt.previousDirectionAngle; // undefined for first route
            var isPathBeginning = (previousRouteDirectionAngle === undefined);

            // directions
            var direction, directionChange;
            var directions = opt.directions;
            getGridOffsets(directions, grid, opt);

            var numDirections = directions.length;

            var endPointsKeys = toArray(endPoints).reduce(function(res, endPoint) {
                // endPoint is assumed to be aligned already

                var key = getKey(endPoint);
                res.push(key);
                return res;
            }, []);

            // main route finding loop
            var loopsRemaining = opt.maximumLoops;
            while (!openSet.isEmpty() && loopsRemaining > 0) {

                // remove current from the open list
                var currentKey = openSet.pop();
                var currentPoint = points[currentKey];
                var currentParent = parents[currentKey];
                var currentCost = costs[currentKey];

                var isRouteBeginning = (currentParent === undefined); // undefined for route starts
                var isStart = currentPoint.equals(start); // (is source anchor or `from` point) = can leave in any direction

                var previousDirectionAngle;
                if (!isRouteBeginning) { previousDirectionAngle = getDirectionAngle(currentParent, currentPoint, numDirections, grid, opt); } // a vertex on the route
                else if (!isPathBeginning) { previousDirectionAngle = previousRouteDirectionAngle; } // beginning of route on the path
                else if (!isStart) { previousDirectionAngle = getDirectionAngle(start, currentPoint, numDirections, grid, opt); } // beginning of path, start rect point
                else { previousDirectionAngle = null; } // beginning of path, source anchor or `from` point

                // check if we reached any endpoint
                var samePoints = isEqual(startPoints, endPoints);
                var skipEndCheck = (isRouteBeginning && samePoints);
                if (!skipEndCheck && (endPointsKeys.indexOf(currentKey) >= 0)) {
                    opt.previousDirectionAngle = previousDirectionAngle;
                    return reconstructRoute(parents, points, currentPoint, start, end, grid, opt);
                }

                // go over all possible directions and find neighbors
                for (i = 0; i < numDirections; i++) {
                    direction = directions[i];

                    var directionAngle = direction.angle;
                    directionChange = getDirectionChange(previousDirectionAngle, directionAngle);

                    // if the direction changed rapidly, don't use this point
                    // any direction is allowed for starting points
                    if (!(isPathBeginning && isStart) && directionChange > opt.maxAllowedDirectionChange) { continue; }

                    var neighborPoint = align(currentPoint.clone().offset(direction.gridOffsetX, direction.gridOffsetY), grid, precision);
                    var neighborKey = getKey(neighborPoint);

                    // Closed points from the openSet were already evaluated.
                    if (openSet.isClose(neighborKey) || !map.isPointAccessible(neighborPoint)) { continue; }

                    // We can only enter end points at an acceptable angle.
                    if (endPointsKeys.indexOf(neighborKey) >= 0) { // neighbor is an end point

                        var isNeighborEnd = neighborPoint.equals(end); // (is target anchor or `to` point) = can be entered in any direction

                        if (!isNeighborEnd) {
                            var endDirectionAngle = getDirectionAngle(neighborPoint, end, numDirections, grid, opt);
                            var endDirectionChange = getDirectionChange(directionAngle, endDirectionAngle);

                            if (endDirectionChange > opt.maxAllowedDirectionChange) { continue; }
                        }
                    }

                    // The current direction is ok.

                    var neighborCost = direction.cost;
                    var neighborPenalty = isStart ? 0 : opt.penalties[directionChange]; // no penalties for start point
                    var costFromStart = currentCost + neighborCost + neighborPenalty;

                    if (!openSet.isOpen(neighborKey) || (costFromStart < costs[neighborKey])) {
                        // neighbor point has not been processed yet
                        // or the cost of the path from start is lower than previously calculated

                        points[neighborKey] = neighborPoint;
                        parents[neighborKey] = currentPoint;
                        costs[neighborKey] = costFromStart;
                        openSet.add(neighborKey, costFromStart + estimateCost(neighborPoint, endPoints));
                    }
                }

                loopsRemaining--;
            }
        }

        // no route found (`to` point either wasn't accessible or finding route took
        // way too much calculation)
        return opt.fallbackRoute.call(this, start, end, opt);
    }

    // resolve some of the options
    function resolveOptions(opt) {

        opt.directions = result(opt, 'directions');
        opt.penalties = result(opt, 'penalties');
        opt.paddingBox = result(opt, 'paddingBox');
        opt.padding = result(opt, 'padding');

        if (opt.padding) {
            // if both provided, opt.padding wins over opt.paddingBox
            var sides = normalizeSides(opt.padding);
            opt.paddingBox = {
                x: -sides.left,
                y: -sides.top,
                width: sides.left + sides.right,
                height: sides.top + sides.bottom
            };
        }

        toArray(opt.directions).forEach(function(direction) {

            var point1 = new Point(0, 0);
            var point2 = new Point(direction.offsetX, direction.offsetY);

            direction.angle = normalizeAngle(point1.theta(point2));
        });
    }

    // initialization of the route finding
    function router(vertices, opt, linkView) {

        resolveOptions(opt);

        // enable/disable linkView perpendicular option
        linkView.options.perpendicular = !!opt.perpendicular;

        var sourceBBox = getSourceBBox$1(linkView, opt);
        var targetBBox = getTargetBBox$1(linkView, opt);

        var sourceAnchor = getSourceAnchor$1(linkView, opt);
        //var targetAnchor = getTargetAnchor(linkView, opt);

        // pathfinding
        var map = (new ObstacleMap(opt)).build(linkView.paper.model, linkView.model);
        var oldVertices = toArray(vertices).map(Point);
        var newVertices = [];
        var tailPoint = sourceAnchor; // the origin of first route's grid, does not need snapping

        // find a route by concatenating all partial routes (routes need to pass through vertices)
        // source -> vertex[1] -> ... -> vertex[n] -> target
        var to, from;

        for (var i = 0, len = oldVertices.length; i <= len; i++) {

            var partialRoute = null;

            from = to || sourceBBox;
            to = oldVertices[i];

            if (!to) {
                // this is the last iteration
                // we ran through all vertices in oldVertices
                // 'to' is not a vertex.

                to = targetBBox;

                // If the target is a point (i.e. it's not an element), we
                // should use dragging route instead of main routing method if it has been provided.
                var isEndingAtPoint = !linkView.model.get('source').id || !linkView.model.get('target').id;

                if (isEndingAtPoint && isFunction(opt.draggingRoute)) {
                    // Make sure we are passing points only (not rects).
                    var dragFrom = (from === sourceBBox) ? sourceAnchor : from;
                    var dragTo = to.origin();

                    partialRoute = opt.draggingRoute.call(linkView, dragFrom, dragTo, opt);
                }
            }

            // if partial route has not been calculated yet use the main routing method to find one
            partialRoute = partialRoute || findRoute.call(linkView, from, to, map, opt);

            if (partialRoute === null) { // the partial route cannot be found
                return opt.fallbackRouter(vertices, opt, linkView);
            }

            var leadPoint = partialRoute[0];

            // remove the first point if the previous partial route had the same point as last
            if (leadPoint && leadPoint.equals(tailPoint)) { partialRoute.shift(); }

            // save tailPoint for next iteration
            tailPoint = partialRoute[partialRoute.length - 1] || tailPoint;

            Array.prototype.push.apply(newVertices, partialRoute);
        }

        return newVertices;
    }

    // public function
    var manhattan = function(vertices, opt, linkView) {
        return router(vertices, assign({}, config$1, opt), linkView);
    };

    var config$2 = {

        maxAllowedDirectionChange: 45,

        // cost of a diagonal step
        diagonalCost: function() {

            var step = this.step;
            return Math.ceil(Math.sqrt(step * step << 1));
        },

        // an array of directions to find next points on the route
        // different from start/end directions
        directions: function() {

            var step = this.step;
            var cost = this.cost();
            var diagonalCost = this.diagonalCost();

            return [
                { offsetX: step, offsetY: 0, cost: cost },
                { offsetX: step, offsetY: step, cost: diagonalCost },
                { offsetX: 0, offsetY: step, cost: cost },
                { offsetX: -step, offsetY: step, cost: diagonalCost },
                { offsetX: -step, offsetY: 0, cost: cost },
                { offsetX: -step, offsetY: -step, cost: diagonalCost },
                { offsetX: 0, offsetY: -step, cost: cost },
                { offsetX: step, offsetY: -step, cost: diagonalCost }
            ];
        },

        // a simple route used in situations when main routing method fails
        // (exceed max number of loop iterations, inaccessible)
        fallbackRoute: function(from, to, opt) {

            // Find a route which breaks by 45 degrees ignoring all obstacles.

            var theta = from.theta(to);

            var route = [];

            var a = { x: to.x, y: from.y };
            var b = { x: from.x, y: to.y };

            if (theta % 180 > 90) {
                var t = a;
                a = b;
                b = t;
            }

            var p1 = (theta % 90) < 45 ? a : b;
            var l1 = new Line(from, p1);

            var alpha = 90 * Math.ceil(theta / 90);

            var p2 = Point.fromPolar(l1.squaredLength(), toRad(alpha + 135), p1);
            var l2 = new Line(to, p2);

            var intersectionPoint = l1.intersection(l2);
            var point$$1 = intersectionPoint ? intersectionPoint : to;

            var directionFrom = intersectionPoint ? point$$1 : from;

            var quadrant = 360 / opt.directions.length;
            var angleTheta = directionFrom.theta(to);
            var normalizedAngle = normalizeAngle(angleTheta + (quadrant / 2));
            var directionAngle = quadrant * Math.floor(normalizedAngle / quadrant);

            opt.previousDirectionAngle = directionAngle;

            if (point$$1) { route.push(point$$1.round()); }
            route.push(to);

            return route;
        }
    };

    // public function
    var metro = function(vertices, opt, linkView) {

        if (!isFunction(manhattan)) {
            throw new Error('Metro requires the manhattan router.');
        }

        return manhattan(vertices, assign({}, config$2, opt), linkView);
    };



    var routers = ({
        normal: normal$1,
        oneSide: oneSide,
        orthogonal: orthogonal,
        manhattan: manhattan,
        metro: metro
    });

    function connectionRatio(view, _magnet, _refPoint, opt) {

        var ratio = ('ratio' in opt) ? opt.ratio : 0.5;
        return view.getPointAtRatio(ratio);
    }

    function connectionLength(view, _magnet, _refPoint, opt) {

        var length = ('length' in opt) ? opt.length : 20;
        return view.getPointAtLength(length);
    }

    function _connectionPerpendicular(view, _magnet, refPoint, opt) {

        var OFFSET = 1e6;
        var path = view.getConnection();
        var segmentSubdivisions = view.getConnectionSubdivisions();
        var verticalLine = new Line(refPoint.clone().offset(0, OFFSET), refPoint.clone().offset(0, -OFFSET));
        var horizontalLine = new Line(refPoint.clone().offset(OFFSET, 0), refPoint.clone().offset(-OFFSET, 0));
        var verticalIntersections = verticalLine.intersect(path, { segmentSubdivisions: segmentSubdivisions });
        var horizontalIntersections = horizontalLine.intersect(path, { segmentSubdivisions: segmentSubdivisions });
        var intersections = [];
        if (verticalIntersections) { Array.prototype.push.apply(intersections, verticalIntersections); }
        if (horizontalIntersections) { Array.prototype.push.apply(intersections, horizontalIntersections); }
        if (intersections.length > 0) { return refPoint.chooseClosest(intersections); }
        if ('fallbackAt' in opt) {
            return getPointAtLink(view, opt.fallbackAt);
        }
        return connectionClosest(view, _magnet, refPoint, opt);
    }

    function _connectionClosest(view, _magnet, refPoint, _opt) {

        var closestPoint = view.getClosestPoint(refPoint);
        if (!closestPoint) { return new Point(); }
        return closestPoint;
    }

    function resolveRef(fn) {
        return function(view, magnet, ref, opt) {
            if (ref instanceof Element) {
                var refView = this.paper.findView(ref);
                var refPoint;
                if (refView) {
                    if (refView.isNodeConnection(ref)) {
                        var distance = ('fixedAt' in opt) ? opt.fixedAt : '50%';
                        refPoint = getPointAtLink(refView, distance);
                    } else {
                        refPoint = refView.getNodeBBox(ref).center();
                    }
                } else {
                    // Something went wrong
                    refPoint = new Point();
                }
                return fn.call(this, view, magnet, refPoint, opt);
            }
            return fn.apply(this, arguments);
        };
    }

    function getPointAtLink(view, value) {
        var parsedValue = parseFloat(value);
        if (isPercentage(value)) {
            return view.getPointAtRatio(parsedValue / 100);
        } else {
            return view.getPointAtLength(parsedValue);
        }
    }
    var connectionPerpendicular = resolveRef(_connectionPerpendicular);
    var connectionClosest = resolveRef(_connectionClosest);

    var linkAnchors = ({
        resolveRef: resolveRef,
        connectionRatio: connectionRatio,
        connectionLength: connectionLength,
        connectionPerpendicular: connectionPerpendicular,
        connectionClosest: connectionClosest
    });

    function bboxWrapper(method) {

        return function(view, magnet, ref, opt) {

            var rotate = !!opt.rotate;
            var bbox = (rotate) ? view.getNodeUnrotatedBBox(magnet) : view.getNodeBBox(magnet);
            var anchor = bbox[method]();

            var dx = opt.dx;
            if (dx) {
                var dxPercentage = isPercentage(dx);
                dx = parseFloat(dx);
                if (isFinite(dx)) {
                    if (dxPercentage) {
                        dx /= 100;
                        dx *= bbox.width;
                    }
                    anchor.x += dx;
                }
            }

            var dy = opt.dy;
            if (dy) {
                var dyPercentage = isPercentage(dy);
                dy = parseFloat(dy);
                if (isFinite(dy)) {
                    if (dyPercentage) {
                        dy /= 100;
                        dy *= bbox.height;
                    }
                    anchor.y += dy;
                }
            }

            return (rotate) ? anchor.rotate(view.model.getBBox().center(), -view.model.angle()) : anchor;
        };
    }

    function _perpendicular(view, magnet, refPoint, opt) {

        var angle = view.model.angle();
        var bbox = view.getNodeBBox(magnet);
        var anchor = bbox.center();
        var topLeft = bbox.origin();
        var bottomRight = bbox.corner();

        var padding = opt.padding;
        if (!isFinite(padding)) { padding = 0; }

        if ((topLeft.y + padding) <= refPoint.y && refPoint.y <= (bottomRight.y - padding)) {
            var dy = (refPoint.y - anchor.y);
            anchor.x += (angle === 0 || angle === 180) ? 0 : dy * 1 / Math.tan(toRad(angle));
            anchor.y += dy;
        } else if ((topLeft.x + padding) <= refPoint.x && refPoint.x <= (bottomRight.x - padding)) {
            var dx = (refPoint.x - anchor.x);
            anchor.y += (angle === 90 || angle === 270) ? 0 : dx * Math.tan(toRad(angle));
            anchor.x += dx;
        }

        return anchor;
    }

    function _midSide(view, magnet, refPoint, opt) {

        var rotate = !!opt.rotate;
        var bbox, angle, center;
        if (rotate) {
            bbox = view.getNodeUnrotatedBBox(magnet);
            center = view.model.getBBox().center();
            angle = view.model.angle();
        } else {
            bbox = view.getNodeBBox(magnet);
        }

        var padding = opt.padding;
        if (isFinite(padding)) { bbox.inflate(padding); }

        if (rotate) { refPoint.rotate(center, angle); }

        var side = bbox.sideNearestToPoint(refPoint);
        var anchor;
        switch (side) {
            case 'left':
                anchor = bbox.leftMiddle();
                break;
            case 'right':
                anchor = bbox.rightMiddle();
                break;
            case 'top':
                anchor = bbox.topMiddle();
                break;
            case 'bottom':
                anchor = bbox.bottomMiddle();
                break;
        }

        return (rotate) ? anchor.rotate(center, -angle) : anchor;
    }

    // Can find anchor from model, when there is no selector or the link end
    // is connected to a port
    function _modelCenter(view, _magnet, _refPoint, opt, endType) {
        return view.model.getPointFromConnectedLink(this.model, endType).offset(opt.dx, opt.dy);
    }

    //joint.anchors
    var center = bboxWrapper('center');
    var top$2 = bboxWrapper('topMiddle');
    var bottom$2 = bboxWrapper('bottomMiddle');
    var left$2 = bboxWrapper('leftMiddle');
    var right$2 = bboxWrapper('rightMiddle');
    var topLeft = bboxWrapper('origin');
    var topRight = bboxWrapper('topRight');
    var bottomLeft = bboxWrapper('bottomLeft');
    var bottomRight = bboxWrapper('corner');
    var perpendicular = resolveRef(_perpendicular);
    var midSide = resolveRef(_midSide);
    var modelCenter = _modelCenter;

    var anchors = ({
        center: center,
        top: top$2,
        bottom: bottom$2,
        left: left$2,
        right: right$2,
        topLeft: topLeft,
        topRight: topRight,
        bottomLeft: bottomLeft,
        bottomRight: bottomRight,
        perpendicular: perpendicular,
        midSide: midSide,
        modelCenter: modelCenter
    });

    var GraphCells = Backbone.Collection.extend({

        initialize: function(models, opt) {

            // Set the optional namespace where all model classes are defined.
            if (opt.cellNamespace) {
                this.cellNamespace = opt.cellNamespace;
            } else {
                /* global joint: true */
                this.cellNamespace = typeof joint !== 'undefined' && has(joint, 'shapes') ? joint.shapes : null;
                /* global joint: false */
            }


            this.graph = opt.graph;
        },

        model: function(attrs, opt) {

            var collection = opt.collection;
            var namespace = collection.cellNamespace;

            // Find the model class in the namespace or use the default one.
            var ModelClass = (attrs.type === 'link')
                ? Link
                : getByPath(namespace, attrs.type, '.') || Element$1;

            var cell = new ModelClass(attrs, opt);
            // Add a reference to the graph. It is necessary to do this here because this is the earliest place
            // where a new model is created from a plain JS object. For other objects, see `joint.dia.Graph>>_prepareCell()`.
            if (!opt.dry) {
                cell.graph = collection.graph;
            }

            return cell;
        },

        // `comparator` makes it easy to sort cells based on their `z` index.
        comparator: function(model) {

            return model.get('z') || 0;
        }
    });


    var Graph = Backbone.Model.extend({

        _batches: {},

        initialize: function(attrs, opt) {

            opt = opt || {};

            // Passing `cellModel` function in the options object to graph allows for
            // setting models based on attribute objects. This is especially handy
            // when processing JSON graphs that are in a different than JointJS format.
            var cells = new GraphCells([], {
                model: opt.cellModel,
                cellNamespace: opt.cellNamespace,
                graph: this
            });
            Backbone.Model.prototype.set.call(this, 'cells', cells);

            // Make all the events fired in the `cells` collection available.
            // to the outside world.
            cells.on('all', this.trigger, this);

            // Backbone automatically doesn't trigger re-sort if models attributes are changed later when
            // they're already in the collection. Therefore, we're triggering sort manually here.
            this.on('change:z', this._sortOnChangeZ, this);

            // `joint.dia.Graph` keeps an internal data structure (an adjacency list)
            // for fast graph queries. All changes that affect the structure of the graph
            // must be reflected in the `al` object. This object provides fast answers to
            // questions such as "what are the neighbours of this node" or "what
            // are the sibling links of this link".

            // Outgoing edges per node. Note that we use a hash-table for the list
            // of outgoing edges for a faster lookup.
            // [nodeId] -> Object [edgeId] -> true
            this._out = {};
            // Ingoing edges per node.
            // [nodeId] -> Object [edgeId] -> true
            this._in = {};
            // `_nodes` is useful for quick lookup of all the elements in the graph, without
            // having to go through the whole cells array.
            // [node ID] -> true
            this._nodes = {};
            // `_edges` is useful for quick lookup of all the links in the graph, without
            // having to go through the whole cells array.
            // [edgeId] -> true
            this._edges = {};

            cells.on('add', this._restructureOnAdd, this);
            cells.on('remove', this._restructureOnRemove, this);
            cells.on('reset', this._restructureOnReset, this);
            cells.on('change:source', this._restructureOnChangeSource, this);
            cells.on('change:target', this._restructureOnChangeTarget, this);
            cells.on('remove', this._removeCell, this);
        },

        _sortOnChangeZ: function() {

            this.get('cells').sort();
        },

        _restructureOnAdd: function(cell) {

            if (cell.isLink()) {
                this._edges[cell.id] = true;
                var source = cell.source();
                var target = cell.target();
                if (source.id) {
                    (this._out[source.id] || (this._out[source.id] = {}))[cell.id] = true;
                }
                if (target.id) {
                    (this._in[target.id] || (this._in[target.id] = {}))[cell.id] = true;
                }
            } else {
                this._nodes[cell.id] = true;
            }
        },

        _restructureOnRemove: function(cell) {

            if (cell.isLink()) {
                delete this._edges[cell.id];
                var source = cell.source();
                var target = cell.target();
                if (source.id && this._out[source.id] && this._out[source.id][cell.id]) {
                    delete this._out[source.id][cell.id];
                }
                if (target.id && this._in[target.id] && this._in[target.id][cell.id]) {
                    delete this._in[target.id][cell.id];
                }
            } else {
                delete this._nodes[cell.id];
            }
        },

        _restructureOnReset: function(cells) {

            // Normalize into an array of cells. The original `cells` is GraphCells Backbone collection.
            cells = cells.models;

            this._out = {};
            this._in = {};
            this._nodes = {};
            this._edges = {};

            cells.forEach(this._restructureOnAdd, this);
        },

        _restructureOnChangeSource: function(link) {

            var prevSource = link.previous('source');
            if (prevSource.id && this._out[prevSource.id]) {
                delete this._out[prevSource.id][link.id];
            }
            var source = link.source();
            if (source.id) {
                (this._out[source.id] || (this._out[source.id] = {}))[link.id] = true;
            }
        },

        _restructureOnChangeTarget: function(link) {

            var prevTarget = link.previous('target');
            if (prevTarget.id && this._in[prevTarget.id]) {
                delete this._in[prevTarget.id][link.id];
            }
            var target = link.get('target');
            if (target.id) {
                (this._in[target.id] || (this._in[target.id] = {}))[link.id] = true;
            }
        },

        // Return all outbound edges for the node. Return value is an object
        // of the form: [edgeId] -> true
        getOutboundEdges: function(node) {

            return (this._out && this._out[node]) || {};
        },

        // Return all inbound edges for the node. Return value is an object
        // of the form: [edgeId] -> true
        getInboundEdges: function(node) {

            return (this._in && this._in[node]) || {};
        },

        toJSON: function() {

            // Backbone does not recursively call `toJSON()` on attributes that are themselves models/collections.
            // It just clones the attributes. Therefore, we must call `toJSON()` on the cells collection explicitly.
            var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
            json.cells = this.get('cells').toJSON();
            return json;
        },

        fromJSON: function(json, opt) {

            if (!json.cells) {

                throw new Error('Graph JSON must contain cells array.');
            }

            return this.set(json, opt);
        },

        set: function(key, val, opt) {

            var attrs;

            // Handle both `key`, value and {key: value} style arguments.
            if (typeof key === 'object') {
                attrs = key;
                opt = val;
            } else {
                (attrs = {})[key] = val;
            }

            // Make sure that `cells` attribute is handled separately via resetCells().
            if (attrs.hasOwnProperty('cells')) {
                this.resetCells(attrs.cells, opt);
                attrs = omit(attrs, 'cells');
            }

            // The rest of the attributes are applied via original set method.
            return Backbone.Model.prototype.set.call(this, attrs, opt);
        },

        clear: function(opt) {

            opt = assign({}, opt, { clear: true });

            var collection = this.get('cells');

            if (collection.length === 0) { return this; }

            this.startBatch('clear', opt);

            // The elements come after the links.
            var cells = collection.sortBy(function(cell) {
                return cell.isLink() ? 1 : 2;
            });

            do {

                // Remove all the cells one by one.
                // Note that all the links are removed first, so it's
                // safe to remove the elements without removing the connected
                // links first.
                cells.shift().remove(opt);

            } while (cells.length > 0);

            this.stopBatch('clear');

            return this;
        },

        _prepareCell: function(cell, opt) {

            var attrs;
            if (cell instanceof Backbone.Model) {
                attrs = cell.attributes;
                if (!cell.graph && (!opt || !opt.dry)) {
                    // An element can not be member of more than one graph.
                    // A cell stops being the member of the graph after it's explicitly removed.
                    cell.graph = this;
                }
            } else {
                // In case we're dealing with a plain JS object, we have to set the reference
                // to the `graph` right after the actual model is created. This happens in the `model()` function
                // of `joint.dia.GraphCells`.
                attrs = cell;
            }

            if (!isString(attrs.type)) {
                throw new TypeError('dia.Graph: cell type must be a string.');
            }

            return cell;
        },

        minZIndex: function() {

            var firstCell = this.get('cells').first();
            return firstCell ? (firstCell.get('z') || 0) : 0;
        },

        maxZIndex: function() {

            var lastCell = this.get('cells').last();
            return lastCell ? (lastCell.get('z') || 0) : 0;
        },

        addCell: function(cell, opt) {

            if (Array.isArray(cell)) {

                return this.addCells(cell, opt);
            }

            if (cell instanceof Backbone.Model) {

                if (!cell.has('z')) {
                    cell.set('z', this.maxZIndex() + 1);
                }

            } else if (cell.z === undefined) {

                cell.z = this.maxZIndex() + 1;
            }

            this.get('cells').add(this._prepareCell(cell, opt), opt || {});

            return this;
        },

        addCells: function(cells, opt) {

            if (cells.length === 0) { return this; }

            cells = flattenDeep(cells);
            opt.maxPosition = opt.position = cells.length - 1;

            this.startBatch('add', opt);
            cells.forEach(function(cell) {
                this.addCell(cell, opt);
                opt.position--;
            }, this);
            this.stopBatch('add', opt);

            return this;
        },

        // When adding a lot of cells, it is much more efficient to
        // reset the entire cells collection in one go.
        // Useful for bulk operations and optimizations.
        resetCells: function(cells, opt) {

            var preparedCells = toArray(cells).map(function(cell) {
                return this._prepareCell(cell, opt);
            }, this);
            this.get('cells').reset(preparedCells, opt);

            return this;
        },

        removeCells: function(cells, opt) {

            if (cells.length) {

                this.startBatch('remove');
                invoke(cells, 'remove', opt);
                this.stopBatch('remove');
            }

            return this;
        },

        _removeCell: function(cell, collection, options) {

            options = options || {};

            if (!options.clear) {
                // Applications might provide a `disconnectLinks` option set to `true` in order to
                // disconnect links when a cell is removed rather then removing them. The default
                // is to remove all the associated links.
                if (options.disconnectLinks) {

                    this.disconnectLinks(cell, options);

                } else {

                    this.removeLinks(cell, options);
                }
            }
            // Silently remove the cell from the cells collection. Silently, because
            // `joint.dia.Cell.prototype.remove` already triggers the `remove` event which is
            // then propagated to the graph model. If we didn't remove the cell silently, two `remove` events
            // would be triggered on the graph model.
            this.get('cells').remove(cell, { silent: true });

            if (cell.graph === this) {
                // Remove the element graph reference only if the cell is the member of this graph.
                cell.graph = null;
            }
        },

        // Get a cell by `id`.
        getCell: function(id) {

            return this.get('cells').get(id);
        },

        getCells: function() {

            return this.get('cells').toArray();
        },

        getElements: function() {

            return Object.keys(this._nodes).map(this.getCell, this);
        },

        getLinks: function() {

            return Object.keys(this._edges).map(this.getCell, this);
        },

        getFirstCell: function() {

            return this.get('cells').first();
        },

        getLastCell: function() {

            return this.get('cells').last();
        },

        // Get all inbound and outbound links connected to the cell `model`.
        getConnectedLinks: function(model, opt) {

            opt = opt || {};

            var indirect = opt.indirect;
            var inbound = opt.inbound;
            var outbound = opt.outbound;
            if ((inbound === undefined) && (outbound === undefined)) {
                inbound = outbound = true;
            }

            // the final array of connected link models
            var links = [];
            // a hash table of connected edges of the form: [edgeId] -> true
            // used for quick lookups to check if we already added a link
            var edges = {};

            if (outbound) {
                addOutbounds(this, model);
            }
            if (inbound) {
                addInbounds(this, model);
            }

            function addOutbounds(graph, model) {
                forIn(graph.getOutboundEdges(model.id), function(_$$1, edge) {
                    // skip links that were already added
                    // (those must be self-loop links)
                    // (because they are inbound and outbound edges of the same two elements)
                    if (edges[edge]) { return; }
                    var link = graph.getCell(edge);
                    links.push(link);
                    edges[edge] = true;
                    if (indirect) {
                        if (inbound) { addInbounds(graph, link); }
                        if (outbound) { addOutbounds(graph, link); }
                    }
                }.bind(graph));
                if (indirect && model.isLink()) {
                    var outCell = model.getTargetCell();
                    if (outCell && outCell.isLink()) {
                        if (!edges[outCell.id]) {
                            links.push(outCell);
                            addOutbounds(graph, outCell);
                        }
                    }
                }
            }

            function addInbounds(graph, model) {
                forIn(graph.getInboundEdges(model.id), function(_$$1, edge) {
                    // skip links that were already added
                    // (those must be self-loop links)
                    // (because they are inbound and outbound edges of the same two elements)
                    if (edges[edge]) { return; }
                    var link = graph.getCell(edge);
                    links.push(link);
                    edges[edge] = true;
                    if (indirect) {
                        if (inbound) { addInbounds(graph, link); }
                        if (outbound) { addOutbounds(graph, link); }
                    }
                }.bind(graph));
                if (indirect && model.isLink()) {
                    var inCell = model.getSourceCell();
                    if (inCell && inCell.isLink()) {
                        if (!edges[inCell.id]) {
                            links.push(inCell);
                            addInbounds(graph, inCell);
                        }
                    }
                }
            }

            // if `deep` option is `true`, check also all the links that are connected to any of the descendant cells
            if (opt.deep) {

                var embeddedCells = model.getEmbeddedCells({ deep: true });

                // in the first round, we collect all the embedded elements
                var embeddedElements = {};
                embeddedCells.forEach(function(cell) {
                    if (cell.isElement()) {
                        embeddedElements[cell.id] = true;
                    }
                });

                embeddedCells.forEach(function(cell) {
                    if (cell.isLink()) { return; }
                    if (outbound) {
                        forIn(this.getOutboundEdges(cell.id), function(exists, edge) {
                            if (!edges[edge]) {
                                var edgeCell = this.getCell(edge);
                                var sourceId = edgeCell.source().id;
                                var targetId = edgeCell.target().id;

                                // if `includeEnclosed` option is falsy, skip enclosed links
                                if (!opt.includeEnclosed
                                    && (sourceId && embeddedElements[sourceId])
                                    && (targetId && embeddedElements[targetId])) {
                                    return;
                                }

                                links.push(this.getCell(edge));
                                edges[edge] = true;
                            }
                        }.bind(this));
                    }
                    if (inbound) {
                        forIn(this.getInboundEdges(cell.id), function(exists, edge) {
                            if (!edges[edge]) {
                                var edgeCell = this.getCell(edge);
                                var sourceId = edgeCell.source().id;
                                var targetId = edgeCell.target().id;

                                // if `includeEnclosed` option is falsy, skip enclosed links
                                if (!opt.includeEnclosed
                                    && (sourceId && embeddedElements[sourceId])
                                    && (targetId && embeddedElements[targetId])) {
                                    return;
                                }

                                links.push(this.getCell(edge));
                                edges[edge] = true;
                            }
                        }.bind(this));
                    }
                }, this);
            }

            return links;
        },

        getNeighbors: function(model, opt) {

            opt || (opt = {});

            var inbound = opt.inbound;
            var outbound = opt.outbound;
            if (inbound === undefined && outbound === undefined) {
                inbound = outbound = true;
            }

            var neighbors = this.getConnectedLinks(model, opt).reduce(function(res, link) {

                var source = link.source();
                var target = link.target();
                var loop = link.hasLoop(opt);

                // Discard if it is a point, or if the neighbor was already added.
                if (inbound && has(source, 'id') && !res[source.id]) {

                    var sourceElement = this.getCell(source.id);
                    if (sourceElement.isElement()) {
                        if (loop || (sourceElement && sourceElement !== model && (!opt.deep || !sourceElement.isEmbeddedIn(model)))) {
                            res[source.id] = sourceElement;
                        }
                    }
                }

                // Discard if it is a point, or if the neighbor was already added.
                if (outbound && has(target, 'id') && !res[target.id]) {

                    var targetElement = this.getCell(target.id);
                    if (targetElement.isElement()) {
                        if (loop || (targetElement && targetElement !== model && (!opt.deep || !targetElement.isEmbeddedIn(model)))) {
                            res[target.id] = targetElement;
                        }
                    }
                }

                return res;
            }.bind(this), {});

            if (model.isLink()) {
                if (inbound) {
                    var sourceCell = model.getSourceCell();
                    if (sourceCell && sourceCell.isElement() && !neighbors[sourceCell.id]) {
                        neighbors[sourceCell.id] = sourceCell;
                    }
                }
                if (outbound) {
                    var targetCell = model.getTargetCell();
                    if (targetCell && targetCell.isElement() && !neighbors[targetCell.id]) {
                        neighbors[targetCell.id] = targetCell;
                    }
                }
            }

            return toArray(neighbors);
        },

        getCommonAncestor: function(/* cells */) {

            var cellsAncestors = Array.from(arguments).map(function(cell) {

                var ancestors = [];
                var parentId = cell.get('parent');

                while (parentId) {

                    ancestors.push(parentId);
                    parentId = this.getCell(parentId).get('parent');
                }

                return ancestors;

            }, this);

            cellsAncestors = cellsAncestors.sort(function(a, b) {
                return a.length - b.length;
            });

            var commonAncestor = toArray(cellsAncestors.shift()).find(function(ancestor) {
                return cellsAncestors.every(function(cellAncestors) {
                    return cellAncestors.includes(ancestor);
                });
            });

            return this.getCell(commonAncestor);
        },

        // Find the whole branch starting at `element`.
        // If `opt.deep` is `true`, take into account embedded elements too.
        // If `opt.breadthFirst` is `true`, use the Breadth-first search algorithm, otherwise use Depth-first search.
        getSuccessors: function(element, opt) {

            opt = opt || {};
            var res = [];
            // Modify the options so that it includes the `outbound` neighbors only. In other words, search forwards.
            this.search(element, function(el) {
                if (el !== element) {
                    res.push(el);
                }
            }, assign({}, opt, { outbound: true }));
            return res;
        },

        cloneCells: cloneCells,
        // Clone the whole subgraph (including all the connected links whose source/target is in the subgraph).
        // If `opt.deep` is `true`, also take into account all the embedded cells of all the subgraph cells.
        // Return a map of the form: [original cell ID] -> [clone].
        cloneSubgraph: function(cells, opt) {

            var subgraph = this.getSubgraph(cells, opt);
            return this.cloneCells(subgraph);
        },

        // Return `cells` and all the connected links that connect cells in the `cells` array.
        // If `opt.deep` is `true`, return all the cells including all their embedded cells
        // and all the links that connect any of the returned cells.
        // For example, for a single shallow element, the result is that very same element.
        // For two elements connected with a link: `A --- L ---> B`, the result for
        // `getSubgraph([A, B])` is `[A, L, B]`. The same goes for `getSubgraph([L])`, the result is again `[A, L, B]`.
        getSubgraph: function(cells, opt) {

            opt = opt || {};

            var subgraph = [];
            // `cellMap` is used for a quick lookup of existence of a cell in the `cells` array.
            var cellMap = {};
            var elements = [];
            var links = [];

            toArray(cells).forEach(function(cell) {
                if (!cellMap[cell.id]) {
                    subgraph.push(cell);
                    cellMap[cell.id] = cell;
                    if (cell.isLink()) {
                        links.push(cell);
                    } else {
                        elements.push(cell);
                    }
                }

                if (opt.deep) {
                    var embeds = cell.getEmbeddedCells({ deep: true });
                    embeds.forEach(function(embed) {
                        if (!cellMap[embed.id]) {
                            subgraph.push(embed);
                            cellMap[embed.id] = embed;
                            if (embed.isLink()) {
                                links.push(embed);
                            } else {
                                elements.push(embed);
                            }
                        }
                    });
                }
            });

            links.forEach(function(link) {
                // For links, return their source & target (if they are elements - not points).
                var source = link.source();
                var target = link.target();
                if (source.id && !cellMap[source.id]) {
                    var sourceElement = this.getCell(source.id);
                    subgraph.push(sourceElement);
                    cellMap[sourceElement.id] = sourceElement;
                    elements.push(sourceElement);
                }
                if (target.id && !cellMap[target.id]) {
                    var targetElement = this.getCell(target.id);
                    subgraph.push(this.getCell(target.id));
                    cellMap[targetElement.id] = targetElement;
                    elements.push(targetElement);
                }
            }, this);

            elements.forEach(function(element) {
                // For elements, include their connected links if their source/target is in the subgraph;
                var links = this.getConnectedLinks(element, opt);
                links.forEach(function(link) {
                    var source = link.source();
                    var target = link.target();
                    if (!cellMap[link.id] && source.id && cellMap[source.id] && target.id && cellMap[target.id]) {
                        subgraph.push(link);
                        cellMap[link.id] = link;
                    }
                });
            }, this);

            return subgraph;
        },

        // Find all the predecessors of `element`. This is a reverse operation of `getSuccessors()`.
        // If `opt.deep` is `true`, take into account embedded elements too.
        // If `opt.breadthFirst` is `true`, use the Breadth-first search algorithm, otherwise use Depth-first search.
        getPredecessors: function(element, opt) {

            opt = opt || {};
            var res = [];
            // Modify the options so that it includes the `inbound` neighbors only. In other words, search backwards.
            this.search(element, function(el) {
                if (el !== element) {
                    res.push(el);
                }
            }, assign({}, opt, { inbound: true }));
            return res;
        },

        // Perform search on the graph.
        // If `opt.breadthFirst` is `true`, use the Breadth-first Search algorithm, otherwise use Depth-first search.
        // By setting `opt.inbound` to `true`, you can reverse the direction of the search.
        // If `opt.deep` is `true`, take into account embedded elements too.
        // `iteratee` is a function of the form `function(element) {}`.
        // If `iteratee` explicitly returns `false`, the searching stops.
        search: function(element, iteratee, opt) {

            opt = opt || {};
            if (opt.breadthFirst) {
                this.bfs(element, iteratee, opt);
            } else {
                this.dfs(element, iteratee, opt);
            }
        },

        // Breadth-first search.
        // If `opt.deep` is `true`, take into account embedded elements too.
        // If `opt.inbound` is `true`, reverse the search direction (it's like reversing all the link directions).
        // `iteratee` is a function of the form `function(element, distance) {}`.
        // where `element` is the currently visited element and `distance` is the distance of that element
        // from the root `element` passed the `bfs()`, i.e. the element we started the search from.
        // Note that the `distance` is not the shortest or longest distance, it is simply the number of levels
        // crossed till we visited the `element` for the first time. It is especially useful for tree graphs.
        // If `iteratee` explicitly returns `false`, the searching stops.
        bfs: function(element, iteratee, opt) {

            opt = opt || {};
            var visited = {};
            var distance = {};
            var queue = [];

            queue.push(element);
            distance[element.id] = 0;

            while (queue.length > 0) {
                var next = queue.shift();
                if (!visited[next.id]) {
                    visited[next.id] = true;
                    if (iteratee(next, distance[next.id]) === false) { return; }
                    this.getNeighbors(next, opt).forEach(function(neighbor) {
                        distance[neighbor.id] = distance[next.id] + 1;
                        queue.push(neighbor);
                    });
                }
            }
        },

        // Depth-first search.
        // If `opt.deep` is `true`, take into account embedded elements too.
        // If `opt.inbound` is `true`, reverse the search direction (it's like reversing all the link directions).
        // `iteratee` is a function of the form `function(element, distance) {}`.
        // If `iteratee` explicitly returns `false`, the search stops.
        dfs: function(element, iteratee, opt, _visited, _distance) {

            opt = opt || {};
            var visited = _visited || {};
            var distance = _distance || 0;
            if (iteratee(element, distance) === false) { return; }
            visited[element.id] = true;

            this.getNeighbors(element, opt).forEach(function(neighbor) {
                if (!visited[neighbor.id]) {
                    this.dfs(neighbor, iteratee, opt, visited, distance + 1);
                }
            }, this);
        },

        // Get all the roots of the graph. Time complexity: O(|V|).
        getSources: function() {

            var sources = [];
            forIn(this._nodes, function(exists, node) {
                if (!this._in[node] || isEmpty(this._in[node])) {
                    sources.push(this.getCell(node));
                }
            }.bind(this));
            return sources;
        },

        // Get all the leafs of the graph. Time complexity: O(|V|).
        getSinks: function() {

            var sinks = [];
            forIn(this._nodes, function(exists, node) {
                if (!this._out[node] || isEmpty(this._out[node])) {
                    sinks.push(this.getCell(node));
                }
            }.bind(this));
            return sinks;
        },

        // Return `true` if `element` is a root. Time complexity: O(1).
        isSource: function(element) {

            return !this._in[element.id] || isEmpty(this._in[element.id]);
        },

        // Return `true` if `element` is a leaf. Time complexity: O(1).
        isSink: function(element) {

            return !this._out[element.id] || isEmpty(this._out[element.id]);
        },

        // Return `true` is `elementB` is a successor of `elementA`. Return `false` otherwise.
        isSuccessor: function(elementA, elementB) {

            var isSuccessor = false;
            this.search(elementA, function(element) {
                if (element === elementB && element !== elementA) {
                    isSuccessor = true;
                    return false;
                }
            }, { outbound: true });
            return isSuccessor;
        },

        // Return `true` is `elementB` is a predecessor of `elementA`. Return `false` otherwise.
        isPredecessor: function(elementA, elementB) {

            var isPredecessor = false;
            this.search(elementA, function(element) {
                if (element === elementB && element !== elementA) {
                    isPredecessor = true;
                    return false;
                }
            }, { inbound: true });
            return isPredecessor;
        },

        // Return `true` is `elementB` is a neighbor of `elementA`. Return `false` otherwise.
        // `opt.deep` controls whether to take into account embedded elements as well. See `getNeighbors()`
        // for more details.
        // If `opt.outbound` is set to `true`, return `true` only if `elementB` is a successor neighbor.
        // Similarly, if `opt.inbound` is set to `true`, return `true` only if `elementB` is a predecessor neighbor.
        isNeighbor: function(elementA, elementB, opt) {

            opt = opt || {};

            var inbound = opt.inbound;
            var outbound = opt.outbound;
            if ((inbound === undefined) && (outbound === undefined)) {
                inbound = outbound = true;
            }

            var isNeighbor = false;

            this.getConnectedLinks(elementA, opt).forEach(function(link) {

                var source = link.source();
                var target = link.target();

                // Discard if it is a point.
                if (inbound && has(source, 'id') && (source.id === elementB.id)) {
                    isNeighbor = true;
                    return false;
                }

                // Discard if it is a point, or if the neighbor was already added.
                if (outbound && has(target, 'id') && (target.id === elementB.id)) {
                    isNeighbor = true;
                    return false;
                }
            });

            return isNeighbor;
        },

        // Disconnect links connected to the cell `model`.
        disconnectLinks: function(model, opt) {

            this.getConnectedLinks(model).forEach(function(link) {

                link.set((link.source().id === model.id ? 'source' : 'target'), { x: 0, y: 0 }, opt);
            });
        },

        // Remove links connected to the cell `model` completely.
        removeLinks: function(model, opt) {

            invoke(this.getConnectedLinks(model), 'remove', opt);
        },

        // Find all elements at given point
        findModelsFromPoint: function(p) {

            return this.getElements().filter(function(el) {
                return el.getBBox().containsPoint(p);
            });
        },

        // Find all elements in given area
        findModelsInArea: function(rect$$1, opt) {

            rect$$1 = rect(rect$$1);
            opt = defaults(opt || {}, { strict: false });

            var method = opt.strict ? 'containsRect' : 'intersect';

            return this.getElements().filter(function(el) {
                return rect$$1[method](el.getBBox());
            });
        },

        // Find all elements under the given element.
        findModelsUnderElement: function(element, opt) {

            opt = defaults(opt || {}, { searchBy: 'bbox' });

            var bbox = element.getBBox();
            var elements = (opt.searchBy === 'bbox')
                ? this.findModelsInArea(bbox)
                : this.findModelsFromPoint(bbox[opt.searchBy]());

            // don't account element itself or any of its descendants
            return elements.filter(function(el) {
                return element.id !== el.id && !el.isEmbeddedIn(element);
            });
        },


        // Return bounding box of all elements.
        getBBox: function() {

            return this.getCellsBBox(this.getCells());
        },

        // Return the bounding box of all cells in array provided.
        getCellsBBox: function(cells, opt) {
            opt || (opt = {});
            return toArray(cells).reduce(function(memo, cell) {
                var rect$$1 = cell.getBBox(opt);
                if (!rect$$1) { return memo; }
                var angle = cell.angle();
                if (angle) { rect$$1 = rect$$1.bbox(angle); }
                if (memo) {
                    return memo.union(rect$$1);
                }
                return rect$$1;
            }, null);
        },

        translate: function(dx, dy, opt) {

            // Don't translate cells that are embedded in any other cell.
            var cells = this.getCells().filter(function(cell) {
                return !cell.isEmbedded();
            });

            invoke(cells, 'translate', dx, dy, opt);

            return this;
        },

        resize: function(width, height, opt) {

            return this.resizeCells(width, height, this.getCells(), opt);
        },

        resizeCells: function(width, height, cells, opt) {

            // `getBBox` method returns `null` if no elements provided.
            // i.e. cells can be an array of links
            var bbox = this.getCellsBBox(cells);
            if (bbox) {
                var sx = Math.max(width / bbox.width, 0);
                var sy = Math.max(height / bbox.height, 0);
                invoke(cells, 'scale', sx, sy, bbox.origin(), opt);
            }

            return this;
        },

        startBatch: function(name, data) {

            data = data || {};
            this._batches[name] = (this._batches[name] || 0) + 1;

            return this.trigger('batch:start', assign({}, data, { batchName: name }));
        },

        stopBatch: function(name, data) {

            data = data || {};
            this._batches[name] = (this._batches[name] || 0) - 1;

            return this.trigger('batch:stop', assign({}, data, { batchName: name }));
        },

        hasActiveBatch: function(name) {

            var batches = this._batches;
            var names;

            if (arguments.length === 0) {
                names = toArray(batches);
            } else if (Array.isArray(name)) {
                names = name;
            } else {
                names = [name];
            }

            return names.some(function (batch) { return batches[batch] > 0; });
        }

    }, {

        validations: {

            multiLinks: function(graph, link) {

                // Do not allow multiple links to have the same source and target.
                var source = link.source();
                var target = link.target();

                if (source.id && target.id) {

                    var sourceModel = link.getSourceCell();
                    if (sourceModel) {

                        var connectedLinks = graph.getConnectedLinks(sourceModel, { outbound: true });
                        var sameLinks = connectedLinks.filter(function(_link) {

                            var _source = _link.source();
                            var _target = _link.target();

                            return _source && _source.id === source.id &&
                                (!_source.port || (_source.port === source.port)) &&
                                _target && _target.id === target.id &&
                                (!_target.port || (_target.port === target.port));

                        });

                        if (sameLinks.length > 1) {
                            return false;
                        }
                    }
                }

                return true;
            },

            linkPinning: function(graph, link) {
                return link.source().id && link.target().id;
            }
        }

    });

    wrapWith(Graph.prototype, ['resetCells', 'addCells', 'removeCells'], wrappers.cells);

    // Link base view and controller.
    // ----------------------------------------

    var LinkView = CellView.extend({

        className: function() {

            var classNames = CellView.prototype.className.apply(this).split(' ');

            classNames.push('link');

            return classNames.join(' ');
        },

        options: {

            shortLinkLength: 105,
            doubleLinkTools: false,
            longLinkLength: 155,
            linkToolsOffset: 40,
            doubleLinkToolsOffset: 65,
            sampleInterval: 50,
        },

        _labelCache: null,
        _labelSelectors: null,
        _markerCache: null,
        _V: null,
        _dragData: null, // deprecated

        metrics: null,
        decimalsRounding: 2,

        initialize: function() {

            CellView.prototype.initialize.apply(this, arguments);

            // `_.labelCache` is a mapping of indexes of labels in the `this.get('labels')` array to
            // `<g class="label">` nodes wrapped by Vectorizer. This allows for quick access to the
            // nodes in `updateLabelPosition()` in order to update the label positions.
            this._labelCache = {};

            // a cache of label selectors
            this._labelSelectors = {};

            // keeps markers bboxes and positions again for quicker access
            this._markerCache = {};

            // cache of default markup nodes
            this._V = {};

            // connection path metrics
            this.metrics = {};
        },

        presentationAttributes: {
            markup: ['RENDER'],
            attrs: ['UPDATE'],
            router: ['UPDATE'],
            connector: ['UPDATE'],
            smooth: ['UPDATE'],
            manhattan: ['UPDATE'],
            toolMarkup: ['TOOLS'],
            labels: ['LABELS'],
            labelMarkup: ['LABELS'],
            vertices: ['VERTICES', 'UPDATE'],
            vertexMarkup: ['VERTICES'],
            source: ['SOURCE', 'UPDATE'],
            target: ['TARGET', 'UPDATE']
        },

        initFlag: ['RENDER', 'SOURCE', 'TARGET'],

        UPDATE_PRIORITY: 1,

        confirmUpdate: function(flags, opt) {

            opt || (opt = {});

            if (this.hasFlag(flags, 'SOURCE')) {
                if (!this.updateEndProperties('source')) { return flags; }
                flags = this.removeFlag(flags, 'SOURCE');
            }

            if (this.hasFlag(flags, 'TARGET')) {
                if (!this.updateEndProperties('target')) { return flags; }
                flags = this.removeFlag(flags, 'TARGET');
            }

            var ref = this;
            var paper = ref.paper;
            var sourceView = ref.sourceView;
            var targetView = ref.targetView;
            if (paper && ((sourceView && !paper.isViewMounted(sourceView)) || (targetView && !paper.isViewMounted(targetView)))) {
                // Wait for the sourceView and targetView to be rendered
                return flags;
            }

            if (this.hasFlag(flags, 'RENDER')) {
                this.render();
                flags = this.removeFlag(flags, ['RENDER', 'UPDATE', 'VERTICES', 'TOOLS', 'LABELS']);
                return flags;
            }

            if (this.hasFlag(flags, 'VERTICES')) {
                this.renderVertexMarkers();
                flags = this.removeFlag(flags, 'VERTICES');
            }

            var ref$1 = this;
            var model = ref$1.model;
            var attributes = model.attributes;

            if (this.hasFlag(flags, 'UPDATE')) {
                this.update(model, null, opt);
                flags = this.removeFlag(flags, ['UPDATE', 'TOOLS', 'LABELS']);
                return flags;
            }

            if (this.hasFlag(flags, 'TOOLS')) {
                this.renderTools().updateToolsPosition();
                flags = this.removeFlag(flags, 'TOOLS');
            }

            if (this.hasFlag(flags, 'LABELS')) {
                this.onLabelsChange(model, attributes.labels, opt);
                flags = this.removeFlag(flags, 'LABELS');
            }

            return flags;
        },

        onLabelsChange: function(link, labels, opt) {

            var requireRender = true;

            var previousLabels = this.model.previous('labels');

            if (previousLabels) {
                // Here is an optimization for cases when we know, that change does
                // not require re-rendering of all labels.
                if (('propertyPathArray' in opt) && ('propertyValue' in opt)) {
                    // The label is setting by `prop()` method
                    var pathArray = opt.propertyPathArray || [];
                    var pathLength = pathArray.length;
                    if (pathLength > 1) {
                        // We are changing a single label here e.g. 'labels/0/position'
                        var labelExists = !!previousLabels[pathArray[1]];
                        if (labelExists) {
                            if (pathLength === 2) {
                                // We are changing the entire label. Need to check if the
                                // markup is also being changed.
                                requireRender = ('markup' in Object(opt.propertyValue));
                            } else if (pathArray[2] !== 'markup') {
                                // We are changing a label property but not the markup
                                requireRender = false;
                            }
                        }
                    }
                }
            }

            if (requireRender) {
                this.renderLabels();
            } else {
                this.updateLabels();
            }

            this.updateLabelPositions();
        },

        // Rendering.
        // ----------

        render: function() {

            this.vel.empty();
            this._V = {};
            this.renderMarkup();
            // rendering labels has to be run after the link is appended to DOM tree. (otherwise <Text> bbox
            // returns zero values)
            this.renderLabels();
            this.update();

            return this;
        },

        renderMarkup: function() {

            var link = this.model;
            var markup = link.get('markup') || link.markup;
            if (!markup) { throw new Error('dia.LinkView: markup required'); }
            if (Array.isArray(markup)) { return this.renderJSONMarkup(markup); }
            if (typeof markup === 'string') { return this.renderStringMarkup(markup); }
            throw new Error('dia.LinkView: invalid markup');
        },

        renderJSONMarkup: function(markup) {

            var doc = this.parseDOMJSON(markup, this.el);
            // Selectors
            this.selectors = doc.selectors;
            // Fragment
            this.vel.append(doc.fragment);
        },

        renderStringMarkup: function(markup) {

            // A special markup can be given in the `properties.markup` property. This might be handy
            // if e.g. arrowhead markers should be `<image>` elements or any other element than `<path>`s.
            // `.connection`, `.connection-wrap`, `.marker-source` and `.marker-target` selectors
            // of elements with special meaning though. Therefore, those classes should be preserved in any
            // special markup passed in `properties.markup`.
            var children = V(markup);
            // custom markup may contain only one children
            if (!Array.isArray(children)) { children = [children]; }
            // Cache all children elements for quicker access.
            var cache = this._V; // vectorized markup;
            for (var i = 0, n = children.length; i < n; i++) {
                var child = children[i];
                var className = child.attr('class');
                if (className) {
                    // Strip the joint class name prefix, if there is one.
                    className = removeClassNamePrefix(className);
                    cache[$.camelCase(className)] = child;
                }
            }
            // partial rendering
            this.renderTools();
            this.renderVertexMarkers();
            this.renderArrowheadMarkers();
            this.vel.append(children);
        },

        _getLabelMarkup: function(labelMarkup) {

            if (!labelMarkup) { return undefined; }

            if (Array.isArray(labelMarkup)) { return this.parseDOMJSON(labelMarkup, null); }
            if (typeof labelMarkup === 'string') { return this._getLabelStringMarkup(labelMarkup); }
            throw new Error('dia.linkView: invalid label markup');
        },

        _getLabelStringMarkup: function(labelMarkup) {

            var children = V(labelMarkup);
            var fragment = document.createDocumentFragment();

            if (!Array.isArray(children)) {
                fragment.appendChild(children.node);

            } else {
                for (var i = 0, n = children.length; i < n; i++) {
                    var currentChild = children[i].node;
                    fragment.appendChild(currentChild);
                }
            }

            return { fragment: fragment, selectors: {}}; // no selectors
        },

        // Label markup fragment may come wrapped in <g class="label" />, or not.
        // If it doesn't, add the <g /> container here.
        _normalizeLabelMarkup: function(markup) {

            if (!markup) { return undefined; }

            var fragment = markup.fragment;
            if (!(markup.fragment instanceof DocumentFragment) || !markup.fragment.hasChildNodes()) { throw new Error('dia.LinkView: invalid label markup.'); }

            var vNode;
            var childNodes = fragment.childNodes;

            if ((childNodes.length > 1) || childNodes[0].nodeName.toUpperCase() !== 'G') {
                // default markup fragment is not wrapped in <g />
                // add a <g /> container
                vNode = V('g').append(fragment);
            } else {
                vNode = V(childNodes[0]);
            }

            vNode.addClass('label');

            return { node: vNode.node, selectors: markup.selectors };
        },

        renderLabels: function() {

            var cache = this._V;
            var vLabels = cache.labels;
            var labelCache = this._labelCache = {};
            var labelSelectors = this._labelSelectors = {};
            var model = this.model;
            var labels = model.attributes.labels || [];
            var labelsCount = labels.length;

            if (labelsCount === 0) {
                if (vLabels) { vLabels.remove(); }
                return this;
            }

            if (vLabels) {
                vLabels.empty();
            }  else {
                // there is no label container in the markup but some labels are defined
                // add a <g class="labels" /> container
                vLabels = cache.labels = V('g').addClass('labels');
            }

            var container = vLabels.node;

            for (var i = 0; i < labelsCount; i++) {

                var label = labels[i];
                var labelMarkup = this._normalizeLabelMarkup(this._getLabelMarkup(label.markup));
                var labelNode;
                var selectors;
                if (labelMarkup) {

                    labelNode = labelMarkup.node;
                    selectors = labelMarkup.selectors;

                } else {

                    var builtinDefaultLabel =  model._builtins.defaultLabel;
                    var builtinDefaultLabelMarkup = this._normalizeLabelMarkup(this._getLabelMarkup(builtinDefaultLabel.markup));
                    var defaultLabel = model._getDefaultLabel();
                    var defaultLabelMarkup = this._normalizeLabelMarkup(this._getLabelMarkup(defaultLabel.markup));
                    var defaultMarkup = defaultLabelMarkup || builtinDefaultLabelMarkup;

                    labelNode = defaultMarkup.node;
                    selectors = defaultMarkup.selectors;
                }

                labelNode.setAttribute('label-idx', i); // assign label-idx
                container.appendChild(labelNode);
                labelCache[i] = labelNode; // cache node for `updateLabels()` so it can just update label node positions

                var rootSelector = this.selector;
                if (selectors[rootSelector]) { throw new Error('dia.LinkView: ambiguous label root selector.'); }
                selectors[rootSelector] = labelNode;

                labelSelectors[i] = selectors; // cache label selectors for `updateLabels()`
            }

            if (!container.parentNode) {
                this.el.appendChild(container);
            }

            this.updateLabels();

            return this;
        },

        // merge default label attrs into label attrs
        // keep `undefined` or `null` because `{}` means something else
        _mergeLabelAttrs: function(hasCustomMarkup, labelAttrs, defaultLabelAttrs, builtinDefaultLabelAttrs) {

            if (labelAttrs === null) { return null; }
            if (labelAttrs === undefined) {

                if (defaultLabelAttrs === null) { return null; }
                if (defaultLabelAttrs === undefined) {

                    if (hasCustomMarkup) { return undefined; }
                    return builtinDefaultLabelAttrs;
                }

                if (hasCustomMarkup) { return defaultLabelAttrs; }
                return merge({}, builtinDefaultLabelAttrs, defaultLabelAttrs);
            }

            if (hasCustomMarkup) { return merge({}, defaultLabelAttrs, labelAttrs); }
            return merge({}, builtinDefaultLabelAttrs, defaultLabelAttrs, labelAttrs);
        },

        updateLabels: function() {

            if (!this._V.labels) { return this; }

            var model = this.model;
            var labels = model.get('labels') || [];
            var canLabelMove = this.can('labelMove');

            var builtinDefaultLabel = model._builtins.defaultLabel;
            var builtinDefaultLabelAttrs = builtinDefaultLabel.attrs;

            var defaultLabel = model._getDefaultLabel();
            var defaultLabelMarkup = defaultLabel.markup;
            var defaultLabelAttrs = defaultLabel.attrs;

            for (var i = 0, n = labels.length; i < n; i++) {

                var labelNode = this._labelCache[i];
                labelNode.setAttribute('cursor', (canLabelMove ? 'move' : 'default'));

                var selectors = this._labelSelectors[i];

                var label = labels[i];
                var labelMarkup = label.markup;
                var labelAttrs = label.attrs;

                var attrs = this._mergeLabelAttrs(
                    (labelMarkup || defaultLabelMarkup),
                    labelAttrs,
                    defaultLabelAttrs,
                    builtinDefaultLabelAttrs
                );

                this.updateDOMSubtreeAttributes(labelNode, attrs, {
                    rootBBox: new Rect(label.size),
                    selectors: selectors
                });
            }

            return this;
        },

        renderTools: function() {

            if (!this._V.linkTools) { return this; }

            // Tools are a group of clickable elements that manipulate the whole link.
            // A good example of this is the remove tool that removes the whole link.
            // Tools appear after hovering the link close to the `source` element/point of the link
            // but are offset a bit so that they don't cover the `marker-arrowhead`.

            var $tools = $(this._V.linkTools.node).empty();
            var toolTemplate = template(this.model.get('toolMarkup') || this.model.toolMarkup);
            var tool = V(toolTemplate());

            $tools.append(tool.node);

            // Cache the tool node so that the `updateToolsPosition()` can update the tool position quickly.
            this._toolCache = tool;

            // If `doubleLinkTools` is enabled, we render copy of the tools on the other side of the
            // link as well but only if the link is longer than `longLinkLength`.
            if (this.options.doubleLinkTools) {

                var tool2;
                if (this.model.get('doubleToolMarkup') || this.model.doubleToolMarkup) {
                    toolTemplate = template(this.model.get('doubleToolMarkup') || this.model.doubleToolMarkup);
                    tool2 = V(toolTemplate());
                } else {
                    tool2 = tool.clone();
                }

                $tools.append(tool2.node);
                this._tool2Cache = tool2;
            }

            return this;
        },

        renderVertexMarkers: function() {

            if (!this._V.markerVertices) { return this; }

            var $markerVertices = $(this._V.markerVertices.node).empty();

            // A special markup can be given in the `properties.vertexMarkup` property. This might be handy
            // if default styling (elements) are not desired. This makes it possible to use any
            // SVG elements for .marker-vertex and .marker-vertex-remove tools.
            var markupTemplate = template(this.model.get('vertexMarkup') || this.model.vertexMarkup);

            this.model.vertices().forEach(function(vertex, idx) {
                $markerVertices.append(V(markupTemplate(assign({ idx: idx }, vertex))).node);
            });

            return this;
        },

        renderArrowheadMarkers: function() {

            // Custom markups might not have arrowhead markers. Therefore, jump of this function immediately if that's the case.
            if (!this._V.markerArrowheads) { return this; }

            var $markerArrowheads = $(this._V.markerArrowheads.node);

            $markerArrowheads.empty();

            // A special markup can be given in the `properties.vertexMarkup` property. This might be handy
            // if default styling (elements) are not desired. This makes it possible to use any
            // SVG elements for .marker-vertex and .marker-vertex-remove tools.
            var markupTemplate = template(this.model.get('arrowheadMarkup') || this.model.arrowheadMarkup);

            this._V.sourceArrowhead = V(markupTemplate({ end: 'source' }));
            this._V.targetArrowhead = V(markupTemplate({ end: 'target' }));

            $markerArrowheads.append(this._V.sourceArrowhead.node, this._V.targetArrowhead.node);

            return this;
        },

        // Updating.
        // ---------

        // Default is to process the `attrs` object and set attributes on subelements based on the selectors.
        update: function(model, attributes, opt) {

            opt || (opt = {});

            this.cleanNodesCache();

            // update the link path
            this.updateConnection(opt);

            // update SVG attributes defined by 'attrs/'.
            this.updateDOMSubtreeAttributes(this.el, this.model.attr(), { selectors: this.selectors });

            this.updateDefaultConnectionPath();

            // update the label position etc.
            this.updateLabelPositions();
            this.updateToolsPosition();
            this.updateArrowheadMarkers();

            this.updateTools(opt);

            // *Deprecated*
            // Local perpendicular flag (as opposed to one defined on paper).
            // Could be enabled inside a connector/router. It's valid only
            // during the update execution.
            this.options.perpendicular = null;

            return this;
        },

        removeRedundantLinearVertices: function(opt) {
            var link = this.model;
            var vertices = link.vertices();
            var conciseVertices = [];
            var n = vertices.length;
            var m = 0;
            for (var i = 0; i < n; i++) {
                var current = new Point(vertices[i]).round();
                var prev = new Point(conciseVertices[m - 1] || this.sourceAnchor).round();
                if (prev.equals(current)) { continue; }
                var next = new Point(vertices[i + 1] || this.targetAnchor).round();
                if (prev.equals(next)) { continue; }
                var line$$1 = new Line(prev, next);
                if (line$$1.pointOffset(current) === 0) { continue; }
                conciseVertices.push(vertices[i]);
                m++;
            }
            if (n === m) { return 0; }
            link.vertices(conciseVertices, opt);
            return (n - m);
        },

        updateDefaultConnectionPath: function() {

            var cache = this._V;

            if (cache.connection) {
                cache.connection.attr('d', this.getSerializedConnection());
            }

            if (cache.connectionWrap) {
                cache.connectionWrap.attr('d', this.getSerializedConnection());
            }

            if (cache.markerSource && cache.markerTarget) {
                this._translateAndAutoOrientArrows(cache.markerSource, cache.markerTarget);
            }
        },

        getEndView: function(type) {
            switch (type) {
                case 'source':
                    return this.sourceView || null;
                case 'target':
                    return this.targetView || null;
                default:
                    throw new Error('dia.LinkView: type parameter required.');
            }
        },

        getEndAnchor: function(type) {
            switch (type) {
                case 'source':
                    return new Point(this.sourceAnchor);
                case 'target':
                    return new Point(this.targetAnchor);
                default:
                    throw new Error('dia.LinkView: type parameter required.');
            }
        },

        getEndMagnet: function(type) {
            switch (type) {
                case 'source':
                    var sourceView = this.sourceView;
                    if (!sourceView) { break; }
                    return this.sourceMagnet || sourceView.el;
                case 'target':
                    var targetView = this.targetView;
                    if (!targetView) { break; }
                    return this.targetMagnet || targetView.el;
                default:
                    throw new Error('dia.LinkView: type parameter required.');
            }
            return null;
        },

        updateConnection: function(opt) {

            opt = opt || {};

            var model = this.model;
            var route, path;

            if (opt.translateBy && model.isRelationshipEmbeddedIn(opt.translateBy)) {
                // The link is being translated by an ancestor that will
                // shift source point, target point and all vertices
                // by an equal distance.
                var tx = opt.tx || 0;
                var ty = opt.ty || 0;

                route = (new Polyline(this.route)).translate(tx, ty).points;

                // translate source and target connection and marker points.
                this._translateConnectionPoints(tx, ty);

                // translate the path itself
                path = this.path;
                path.translate(tx, ty);

            } else {

                var vertices = model.vertices();
                // 1. Find Anchors

                var anchors = this.findAnchors(vertices);
                var sourceAnchor = this.sourceAnchor = anchors.source;
                var targetAnchor = this.targetAnchor = anchors.target;

                // 2. Find Route
                route = this.findRoute(vertices, opt);

                // 3. Find Connection Points
                var connectionPoints = this.findConnectionPoints(route, sourceAnchor, targetAnchor);
                var sourcePoint = this.sourcePoint = connectionPoints.source;
                var targetPoint = this.targetPoint = connectionPoints.target;

                // 3b. Find Marker Connection Point - Backwards Compatibility
                var markerPoints = this.findMarkerPoints(route, sourcePoint, targetPoint);

                // 4. Find Connection
                path = this.findPath(route, markerPoints.source || sourcePoint, markerPoints.target || targetPoint);
            }

            this.route = route;
            this.path = path;
            this.metrics = {};
        },

        findMarkerPoints: function(route, sourcePoint, targetPoint) {

            var firstWaypoint = route[0];
            var lastWaypoint = route[route.length - 1];

            // Move the source point by the width of the marker taking into account
            // its scale around x-axis. Note that scale is the only transform that
            // makes sense to be set in `.marker-source` attributes object
            // as all other transforms (translate/rotate) will be replaced
            // by the `translateAndAutoOrient()` function.
            var cache = this._markerCache;
            // cache source and target points
            var sourceMarkerPoint, targetMarkerPoint;

            if (this._V.markerSource) {

                cache.sourceBBox = cache.sourceBBox || this._V.markerSource.getBBox();
                sourceMarkerPoint = Point(sourcePoint).move(
                    firstWaypoint || targetPoint,
                    cache.sourceBBox.width * this._V.markerSource.scale().sx * -1
                ).round();
            }

            if (this._V.markerTarget) {

                cache.targetBBox = cache.targetBBox || this._V.markerTarget.getBBox();
                targetMarkerPoint = Point(targetPoint).move(
                    lastWaypoint || sourcePoint,
                    cache.targetBBox.width * this._V.markerTarget.scale().sx * -1
                ).round();
            }

            // if there was no markup for the marker, use the connection point.
            cache.sourcePoint = sourceMarkerPoint || sourcePoint.clone();
            cache.targetPoint = targetMarkerPoint || targetPoint.clone();

            return {
                source: sourceMarkerPoint,
                target: targetMarkerPoint
            };
        },

        findAnchorsOrdered: function(firstEndType, firstRef, secondEndType, secondRef) {

            var firstAnchor, secondAnchor;
            var firstAnchorRef, secondAnchorRef;
            var model = this.model;
            var firstDef = model.get(firstEndType);
            var secondDef = model.get(secondEndType);
            var firstView = this.getEndView(firstEndType);
            var secondView = this.getEndView(secondEndType);
            var firstMagnet = this.getEndMagnet(firstEndType);
            var secondMagnet = this.getEndMagnet(secondEndType);

            // Anchor first
            if (firstView) {
                if (firstRef) {
                    firstAnchorRef = new Point(firstRef);
                } else if (secondView) {
                    firstAnchorRef = secondMagnet;
                } else {
                    firstAnchorRef = new Point(secondDef);
                }
                firstAnchor = this.getAnchor(firstDef.anchor, firstView, firstMagnet, firstAnchorRef, firstEndType);
            } else {
                firstAnchor = new Point(firstDef);
            }

            // Anchor second
            if (secondView) {
                secondAnchorRef = new Point(secondRef || firstAnchor);
                secondAnchor = this.getAnchor(secondDef.anchor, secondView, secondMagnet, secondAnchorRef, secondEndType);
            } else {
                secondAnchor = new Point(secondDef);
            }

            var res = {};
            res[firstEndType] = firstAnchor;
            res[secondEndType] = secondAnchor;
            return res;
        },

        findAnchors: function(vertices) {

            var model = this.model;
            var firstVertex = vertices[0];
            var lastVertex = vertices[vertices.length - 1];

            if (model.target().priority && !model.source().priority) {
                // Reversed order
                return this.findAnchorsOrdered('target', lastVertex, 'source', firstVertex);
            }

            // Usual order
            return this.findAnchorsOrdered('source', firstVertex, 'target', lastVertex);
        },

        findConnectionPoints: function(route, sourceAnchor, targetAnchor) {

            var firstWaypoint = route[0];
            var lastWaypoint = route[route.length - 1];
            var model = this.model;
            var sourceDef = model.get('source');
            var targetDef = model.get('target');
            var sourceView = this.sourceView;
            var targetView = this.targetView;
            var paperOptions = this.paper.options;
            var sourceMagnet, targetMagnet;

            // Connection Point Source
            var sourcePoint;
            if (sourceView && !sourceView.isNodeConnection(this.sourceMagnet)) {
                sourceMagnet = (this.sourceMagnet || sourceView.el);
                var sourceConnectionPointDef = sourceDef.connectionPoint || paperOptions.defaultConnectionPoint;
                var sourcePointRef = firstWaypoint || targetAnchor;
                var sourceLine = new Line(sourcePointRef, sourceAnchor);
                sourcePoint = this.getConnectionPoint(sourceConnectionPointDef, sourceView, sourceMagnet, sourceLine, 'source');
            } else {
                sourcePoint = sourceAnchor;
            }
            // Connection Point Target
            var targetPoint;
            if (targetView && !targetView.isNodeConnection(this.targetMagnet)) {
                targetMagnet = (this.targetMagnet || targetView.el);
                var targetConnectionPointDef = targetDef.connectionPoint || paperOptions.defaultConnectionPoint;
                var targetPointRef = lastWaypoint || sourceAnchor;
                var targetLine = new Line(targetPointRef, targetAnchor);
                targetPoint = this.getConnectionPoint(targetConnectionPointDef, targetView, targetMagnet, targetLine, 'target');
            } else {
                targetPoint = targetAnchor;
            }

            return {
                source: sourcePoint,
                target: targetPoint
            };
        },

        getAnchor: function(anchorDef, cellView, magnet, ref, endType) {

            var isConnection = cellView.isNodeConnection(magnet);
            var paperOptions = this.paper.options;
            if (!anchorDef) {
                if (isConnection) {
                    anchorDef = paperOptions.defaultLinkAnchor;
                } else {
                    if (paperOptions.perpendicularLinks || this.options.perpendicular) {
                        // Backwards compatibility
                        // If `perpendicularLinks` flag is set on the paper and there are vertices
                        // on the link, then try to find a connection point that makes the link perpendicular
                        // even though the link won't point to the center of the targeted object.
                        anchorDef = { name: 'perpendicular' };
                    } else {
                        anchorDef = paperOptions.defaultAnchor;
                    }
                }
            }

            if (!anchorDef) { throw new Error('Anchor required.'); }
            var anchorFn;
            if (typeof anchorDef === 'function') {
                anchorFn = anchorDef;
            } else {
                var anchorName = anchorDef.name;
                var anchorNamespace = isConnection ? 'linkAnchorNamespace' : 'anchorNamespace';
                anchorFn = paperOptions[anchorNamespace][anchorName];
                if (typeof anchorFn !== 'function') { throw new Error('Unknown anchor: ' + anchorName); }
            }
            var anchor = anchorFn.call(this, cellView, magnet, ref, anchorDef.args || {}, endType, this);
            if (!anchor) { return new Point(); }
            return anchor.round(this.decimalsRounding);
        },


        getConnectionPoint: function(connectionPointDef, view, magnet, line$$1, endType) {

            var connectionPoint;
            var anchor = line$$1.end;
            var paperOptions = this.paper.options;

            // Backwards compatibility
            if (typeof paperOptions.linkConnectionPoint === 'function') {
                var linkConnectionMagnet = (magnet === view.el) ? undefined : magnet;
                connectionPoint = paperOptions.linkConnectionPoint(this, view, linkConnectionMagnet, line$$1.start, endType);
                if (connectionPoint) { return connectionPoint; }
            }

            if (!connectionPointDef) { return anchor; }
            var connectionPointFn;
            if (typeof connectionPointDef === 'function') {
                connectionPointFn = connectionPointDef;
            } else {
                var connectionPointName = connectionPointDef.name;
                connectionPointFn = paperOptions.connectionPointNamespace[connectionPointName];
                if (typeof connectionPointFn !== 'function') { throw new Error('Unknown connection point: ' + connectionPointName); }
            }
            connectionPoint = connectionPointFn.call(this, line$$1, view, magnet, connectionPointDef.args || {}, endType, this);
            if (!connectionPoint) { return anchor; }
            return connectionPoint.round(this.decimalsRounding);
        },

        _translateConnectionPoints: function(tx, ty) {

            var cache = this._markerCache;

            cache.sourcePoint.offset(tx, ty);
            cache.targetPoint.offset(tx, ty);
            this.sourcePoint.offset(tx, ty);
            this.targetPoint.offset(tx, ty);
            this.sourceAnchor.offset(tx, ty);
            this.targetAnchor.offset(tx, ty);
        },

        // if label position is a number, normalize it to a position object
        // this makes sure that label positions can be merged properly
        _normalizeLabelPosition: function(labelPosition) {

            if (typeof labelPosition === 'number') { return { distance: labelPosition, offset: null, angle: 0, args: null }; }
            return labelPosition;
        },

        updateLabelPositions: function() {

            if (!this._V.labels) { return this; }

            var path = this.path;
            if (!path) { return this; }

            // This method assumes all the label nodes are stored in the `this._labelCache` hash table
            // by their indices in the `this.get('labels')` array. This is done in the `renderLabels()` method.

            var model = this.model;
            var labels = model.get('labels') || [];
            if (!labels.length) { return this; }

            var builtinDefaultLabel = model._builtins.defaultLabel;
            var builtinDefaultLabelPosition = builtinDefaultLabel.position;

            var defaultLabel = model._getDefaultLabel();
            var defaultLabelPosition = this._normalizeLabelPosition(defaultLabel.position);

            var defaultPosition = merge({}, builtinDefaultLabelPosition, defaultLabelPosition);

            for (var idx = 0, n = labels.length; idx < n; idx++) {
                var label = labels[idx];
                var labelPosition = this._normalizeLabelPosition(label.position);
                var position = merge({}, defaultPosition, labelPosition);
                var transformationMatrix = this._getLabelTransformationMatrix(position);
                this._labelCache[idx].setAttribute('transform', V.matrixToTransformString(transformationMatrix));
            }

            return this;
        },

        updateToolsPosition: function() {

            if (!this._V.linkTools) { return this; }

            // Move the tools a bit to the target position but don't cover the `sourceArrowhead` marker.
            // Note that the offset is hardcoded here. The offset should be always
            // more than the `this.$('.marker-arrowhead[end="source"]')[0].bbox().width` but looking
            // this up all the time would be slow.

            var scale$$1 = '';
            var offset = this.options.linkToolsOffset;
            var connectionLength = this.getConnectionLength();

            // Firefox returns connectionLength=NaN in odd cases (for bezier curves).
            // In that case we won't update tools position at all.
            if (!Number.isNaN(connectionLength)) {

                // If the link is too short, make the tools half the size and the offset twice as low.
                if (connectionLength < this.options.shortLinkLength) {
                    scale$$1 = 'scale(.5)';
                    offset /= 2;
                }

                var toolPosition = this.getPointAtLength(offset);

                this._toolCache.attr('transform', 'translate(' + toolPosition.x + ', ' + toolPosition.y + ') ' + scale$$1);

                if (this.options.doubleLinkTools && connectionLength >= this.options.longLinkLength) {

                    var doubleLinkToolsOffset = this.options.doubleLinkToolsOffset || offset;

                    toolPosition = this.getPointAtLength(connectionLength - doubleLinkToolsOffset);
                    this._tool2Cache.attr('transform', 'translate(' + toolPosition.x + ', ' + toolPosition.y + ') ' + scale$$1);
                    this._tool2Cache.attr('visibility', 'visible');

                } else if (this.options.doubleLinkTools) {

                    this._tool2Cache.attr('visibility', 'hidden');
                }
            }

            return this;
        },

        updateArrowheadMarkers: function() {

            if (!this._V.markerArrowheads) { return this; }

            // getting bbox of an element with `display="none"` in IE9 ends up with access violation
            if ($.css(this._V.markerArrowheads.node, 'display') === 'none') { return this; }

            var sx = this.getConnectionLength() < this.options.shortLinkLength ? .5 : 1;
            this._V.sourceArrowhead.scale(sx);
            this._V.targetArrowhead.scale(sx);

            this._translateAndAutoOrientArrows(this._V.sourceArrowhead, this._V.targetArrowhead);

            return this;
        },

        updateEndProperties: function(endType) {

            var ref = this;
            var model = ref.model;
            var paper = ref.paper;
            var endViewProperty = endType + "View";
            var endDef = model.get(endType);
            var endId = endDef && endDef.id;

            if (!endId) {
                // the link end is a point ~ rect 0x0
                this[endViewProperty] = null;
                this.updateEndMagnet(endType);
                return true;
            }

            var endModel = paper.getModelById(endId);
            if (!endModel) { throw new Error('LinkView: invalid ' + endType + ' cell.'); }

            var endView = endModel.findView(paper);
            if (!endView) {
                // A view for a model should always exist
                return false;
            }

            this[endViewProperty] = endView;
            this.updateEndMagnet(endType);
            return true;
        },

        updateEndMagnet: function(endType) {

            var endMagnetProperty = endType + "Magnet";
            var endView = this.getEndView(endType);
            if (endView) {
                var connectedMagnet = endView.getMagnetFromLinkEnd(this.model.get(endType));
                if (connectedMagnet === endView.el) { connectedMagnet = null; }
                this[endMagnetProperty] = connectedMagnet;
            } else {
                this[endMagnetProperty] = null;
            }
        },

        _translateAndAutoOrientArrows: function(sourceArrow, targetArrow) {

            // Make the markers "point" to their sticky points being auto-oriented towards
            // `targetPosition`/`sourcePosition`. And do so only if there is a markup for them.
            var route = toArray(this.route);
            if (sourceArrow) {
                sourceArrow.translateAndAutoOrient(
                    this.sourcePoint,
                    route[0] || this.targetPoint,
                    this.paper.cells
                );
            }

            if (targetArrow) {
                targetArrow.translateAndAutoOrient(
                    this.targetPoint,
                    route[route.length - 1] || this.sourcePoint,
                    this.paper.cells
                );
            }
        },

        _getLabelPositionAngle: function(idx) {

            var labelPosition = this.model.label(idx).position || {};
            return (labelPosition.angle || 0);
        },

        _getLabelPositionArgs: function(idx) {

            var labelPosition = this.model.label(idx).position || {};
            return labelPosition.args;
        },

        _getDefaultLabelPositionArgs: function() {

            var defaultLabel = this.model._getDefaultLabel();
            var defaultLabelPosition = defaultLabel.position || {};
            return defaultLabelPosition.args;
        },

        // merge default label position args into label position args
        // keep `undefined` or `null` because `{}` means something else
        _mergeLabelPositionArgs: function(labelPositionArgs, defaultLabelPositionArgs) {

            if (labelPositionArgs === null) { return null; }
            if (labelPositionArgs === undefined) {

                if (defaultLabelPositionArgs === null) { return null; }
                return defaultLabelPositionArgs;
            }

            return merge({}, defaultLabelPositionArgs, labelPositionArgs);
        },

        // Add default label at given position at end of `labels` array.
        // Four signatures:
        // - obj, obj = point, opt
        // - obj, num, obj = point, angle, opt
        // - num, num, obj = x, y, opt
        // - num, num, num, obj = x, y, angle, opt
        // Assigns relative coordinates by default:
        // `opt.absoluteDistance` forces absolute coordinates.
        // `opt.reverseDistance` forces reverse absolute coordinates (if absoluteDistance = true).
        // `opt.absoluteOffset` forces absolute coordinates for offset.
        // Additional args:
        // `opt.keepGradient` auto-adjusts the angle of the label to match path gradient at position.
        // `opt.ensureLegibility` rotates labels so they are never upside-down.
        addLabel: function(p1, p2, p3, p4) {

            // normalize data from the four possible signatures
            var localX;
            var localY;
            var localAngle = 0;
            var localOpt;
            if (typeof p1 !== 'number') {
                // {x, y} object provided as first parameter
                localX = p1.x;
                localY = p1.y;
                if (typeof p2 === 'number') {
                    // angle and opt provided as second and third parameters
                    localAngle = p2;
                    localOpt = p3;
                } else {
                    // opt provided as second parameter
                    localOpt = p2;
                }
            } else {
                // x and y provided as first and second parameters
                localX = p1;
                localY = p2;
                if (typeof p3 === 'number') {
                    // angle and opt provided as third and fourth parameters
                    localAngle = p3;
                    localOpt = p4;
                } else {
                    // opt provided as third parameter
                    localOpt = p3;
                }
            }

            // merge label position arguments
            var defaultLabelPositionArgs = this._getDefaultLabelPositionArgs();
            var labelPositionArgs = localOpt;
            var positionArgs = this._mergeLabelPositionArgs(labelPositionArgs, defaultLabelPositionArgs);

            // append label to labels array
            var label = { position: this.getLabelPosition(localX, localY, localAngle, positionArgs) };
            var idx = -1;
            this.model.insertLabel(idx, label, localOpt);
            return idx;
        },

        // Add a new vertex at calculated index to the `vertices` array.
        addVertex: function(x, y, opt) {

            // accept input in form `{ x, y }, opt` or `x, y, opt`
            var isPointProvided = (typeof x !== 'number');
            var localX = isPointProvided ? x.x : x;
            var localY = isPointProvided ? x.y : y;
            var localOpt = isPointProvided ? y : opt;

            var vertex = { x: localX, y: localY };
            var idx = this.getVertexIndex(localX, localY);
            this.model.insertVertex(idx, vertex, localOpt);
            return idx;
        },

        // Send a token (an SVG element, usually a circle) along the connection path.
        // Example: `link.findView(paper).sendToken(V('circle', { r: 7, fill: 'green' }).node)`
        // `opt.duration` is optional and is a time in milliseconds that the token travels from the source to the target of the link. Default is `1000`.
        // `opt.directon` is optional and it determines whether the token goes from source to target or other way round (`reverse`)
        // `opt.connection` is an optional selector to the connection path.
        // `callback` is optional and is a function to be called once the token reaches the target.
        sendToken: function(token, opt, callback) {

            function onAnimationEnd(vToken, callback) {
                return function() {
                    vToken.remove();
                    if (typeof callback === 'function') {
                        callback();
                    }
                };
            }

            var duration, isReversed, selector;
            if (isObject(opt)) {
                duration = opt.duration;
                isReversed = (opt.direction === 'reverse');
                selector = opt.connection;
            } else {
                // Backwards compatibility
                duration = opt;
                isReversed = false;
                selector = null;
            }

            duration = duration || 1000;

            var animationAttributes = {
                dur: duration + 'ms',
                repeatCount: 1,
                calcMode: 'linear',
                fill: 'freeze'
            };

            if (isReversed) {
                animationAttributes.keyPoints = '1;0';
                animationAttributes.keyTimes = '0;1';
            }

            var vToken = V(token);
            var connection;
            if (typeof selector === 'string') {
                // Use custom connection path.
                connection = this.findBySelector(selector, this.el, this.selectors)[0];
            } else {
                // Select connection path automatically.
                var cache = this._V;
                connection = (cache.connection) ? cache.connection.node : this.el.querySelector('path');
            }

            if (!(connection instanceof SVGPathElement)) {
                throw new Error('dia.LinkView: token animation requires a valid connection path.');
            }

            vToken
                .appendTo(this.paper.cells)
                .animateAlongPath(animationAttributes, connection);

            setTimeout(onAnimationEnd(vToken, callback), duration);
        },

        findRoute: function(vertices) {

            vertices || (vertices = []);

            var namespace = routers;
            var router = this.model.router();
            var defaultRouter = this.paper.options.defaultRouter;

            if (!router) {
                if (defaultRouter) { router = defaultRouter; }
                else { return vertices.map(Point); } // no router specified
            }

            var routerFn = isFunction(router) ? router : namespace[router.name];
            if (!isFunction(routerFn)) {
                throw new Error('dia.LinkView: unknown router: "' + router.name + '".');
            }

            var args = router.args || {};

            var route = routerFn.call(
                this, // context
                vertices, // vertices
                args, // options
                this // linkView
            );

            if (!route) { return vertices.map(Point); }
            return route;
        },

        // Return the `d` attribute value of the `<path>` element representing the link
        // between `source` and `target`.
        findPath: function(route, sourcePoint, targetPoint) {

            var namespace = connectors;
            var connector = this.model.connector();
            var defaultConnector = this.paper.options.defaultConnector;

            if (!connector) {
                connector = defaultConnector || {};
            }

            var connectorFn = isFunction(connector) ? connector : namespace[connector.name];
            if (!isFunction(connectorFn)) {
                throw new Error('dia.LinkView: unknown connector: "' + connector.name + '".');
            }

            var args = clone(connector.args || {});
            args.raw = true; // Request raw g.Path as the result.

            var path = connectorFn.call(
                this, // context
                sourcePoint, // start point
                targetPoint, // end point
                route, // vertices
                args, // options
                this // linkView
            );

            if (typeof path === 'string') {
                // Backwards compatibility for connectors not supporting `raw` option.
                path = new Path(V.normalizePathData(path));
            }

            return path;
        },

        // Public API.
        // -----------

        getConnection: function() {

            var path = this.path;
            if (!path) { return null; }

            return path.clone();
        },

        getSerializedConnection: function() {

            var path = this.path;
            if (!path) { return null; }

            var metrics = this.metrics;
            if (metrics.hasOwnProperty('data')) { return metrics.data; }
            var data = path.serialize();
            metrics.data = data;
            return data;
        },

        getConnectionSubdivisions: function() {

            var path = this.path;
            if (!path) { return null; }

            var metrics = this.metrics;
            if (metrics.hasOwnProperty('segmentSubdivisions')) { return metrics.segmentSubdivisions; }
            var subdivisions = path.getSegmentSubdivisions();
            metrics.segmentSubdivisions = subdivisions;
            return subdivisions;
        },

        getConnectionLength: function() {

            var path = this.path;
            if (!path) { return 0; }

            var metrics = this.metrics;
            if (metrics.hasOwnProperty('length')) { return metrics.length; }
            var length = path.length({ segmentSubdivisions: this.getConnectionSubdivisions() });
            metrics.length = length;
            return length;
        },

        getPointAtLength: function(length) {

            var path = this.path;
            if (!path) { return null; }

            return path.pointAtLength(length, { segmentSubdivisions: this.getConnectionSubdivisions() });
        },

        getPointAtRatio: function(ratio) {

            var path = this.path;
            if (!path) { return null; }
            if (isPercentage(ratio)) { ratio = parseFloat(ratio) / 100; }
            return path.pointAt(ratio, { segmentSubdivisions: this.getConnectionSubdivisions() });
        },

        getTangentAtLength: function(length) {

            var path = this.path;
            if (!path) { return null; }

            return path.tangentAtLength(length, { segmentSubdivisions: this.getConnectionSubdivisions() });
        },

        getTangentAtRatio: function(ratio) {

            var path = this.path;
            if (!path) { return null; }

            return path.tangentAt(ratio, { segmentSubdivisions: this.getConnectionSubdivisions() });
        },

        getClosestPoint: function(point$$1) {

            var path = this.path;
            if (!path) { return null; }

            return path.closestPoint(point$$1, { segmentSubdivisions: this.getConnectionSubdivisions() });
        },

        getClosestPointLength: function(point$$1) {

            var path = this.path;
            if (!path) { return null; }

            return path.closestPointLength(point$$1, { segmentSubdivisions: this.getConnectionSubdivisions() });
        },

        getClosestPointRatio: function(point$$1) {

            var path = this.path;
            if (!path) { return null; }

            return path.closestPointNormalizedLength(point$$1, { segmentSubdivisions: this.getConnectionSubdivisions() });
        },

        // Get label position object based on two provided coordinates, x and y.
        // (Used behind the scenes when user moves labels around.)
        // Two signatures:
        // - num, num, obj = x, y, options
        // - num, num, num, obj = x, y, angle, options
        // Accepts distance/offset options = `absoluteDistance: boolean`, `reverseDistance: boolean`, `absoluteOffset: boolean`
        // - `absoluteOffset` is necessary in order to move beyond connection endpoints
        // Additional options = `keepGradient: boolean`, `ensureLegibility: boolean`
        getLabelPosition: function(x, y, p3, p4) {

            var position = {};

            // normalize data from the two possible signatures
            var localAngle = 0;
            var localOpt;
            if (typeof p3 === 'number') {
                // angle and opt provided as third and fourth argument
                localAngle = p3;
                localOpt = p4;
            } else {
                // opt provided as third argument
                localOpt = p3;
            }

            // save localOpt as `args` of the position object that is passed along
            if (localOpt) { position.args = localOpt; }

            // identify distance/offset settings
            var isDistanceRelative = !(localOpt && localOpt.absoluteDistance); // relative by default
            var isDistanceAbsoluteReverse = (localOpt && localOpt.absoluteDistance && localOpt.reverseDistance); // non-reverse by default
            var isOffsetAbsolute = localOpt && localOpt.absoluteOffset; // offset is non-absolute by default

            // find closest point t
            var path = this.path;
            var pathOpt = { segmentSubdivisions: this.getConnectionSubdivisions() };
            var labelPoint = new Point(x, y);
            var t = path.closestPointT(labelPoint, pathOpt);

            // DISTANCE:
            var labelDistance = path.lengthAtT(t, pathOpt);
            if (isDistanceRelative) { labelDistance = (labelDistance / this.getConnectionLength()) || 0; } // fix to prevent NaN for 0 length
            if (isDistanceAbsoluteReverse) { labelDistance = (-1 * (this.getConnectionLength() - labelDistance)) || 1; } // fix for end point (-0 => 1)
            position.distance = labelDistance;

            // OFFSET:
            // use absolute offset if:
            // - opt.absoluteOffset is true,
            // - opt.absoluteOffset is not true but there is no tangent
            var tangent;
            if (!isOffsetAbsolute) { tangent = path.tangentAtT(t); }
            var labelOffset;
            if (tangent) {
                labelOffset = tangent.pointOffset(labelPoint);
            } else {
                var closestPoint = path.pointAtT(t);
                var labelOffsetDiff = labelPoint.difference(closestPoint);
                labelOffset = { x: labelOffsetDiff.x, y: labelOffsetDiff.y };
            }
            position.offset = labelOffset;

            // ANGLE:
            position.angle = localAngle;

            return position;
        },

        _getLabelTransformationMatrix: function(labelPosition) {

            var labelDistance;
            var labelAngle = 0;
            var args = {};
            if (typeof labelPosition === 'number') {
                labelDistance = labelPosition;
            } else if (typeof labelPosition.distance === 'number') {
                args = labelPosition.args || {};
                labelDistance = labelPosition.distance;
                labelAngle = labelPosition.angle || 0;
            } else {
                throw new Error('dia.LinkView: invalid label position distance.');
            }

            var isDistanceRelative = ((labelDistance > 0) && (labelDistance <= 1));

            var labelOffset = 0;
            var labelOffsetCoordinates = { x: 0, y: 0 };
            if (labelPosition.offset) {
                var positionOffset = labelPosition.offset;
                if (typeof positionOffset === 'number') { labelOffset = positionOffset; }
                if (positionOffset.x) { labelOffsetCoordinates.x = positionOffset.x; }
                if (positionOffset.y) { labelOffsetCoordinates.y = positionOffset.y; }
            }

            var isOffsetAbsolute = ((labelOffsetCoordinates.x !== 0) || (labelOffsetCoordinates.y !== 0) || labelOffset === 0);

            var isKeepGradient = args.keepGradient;
            var isEnsureLegibility = args.ensureLegibility;

            var path = this.path;
            var pathOpt = { segmentSubdivisions: this.getConnectionSubdivisions() };

            var distance = isDistanceRelative ? (labelDistance * this.getConnectionLength()) : labelDistance;
            var tangent = path.tangentAtLength(distance, pathOpt);

            var translation;
            var angle = labelAngle;
            if (tangent) {
                if (isOffsetAbsolute) {
                    translation = tangent.start;
                    translation.offset(labelOffsetCoordinates);
                } else {
                    var normal$$1 = tangent.clone();
                    normal$$1.rotate(tangent.start, -90);
                    normal$$1.setLength(labelOffset);
                    translation = normal$$1.end;
                }
                if (isKeepGradient) {
                    angle = (tangent.angle() + labelAngle);
                    if (isEnsureLegibility) {
                        angle = normalizeAngle(((angle + 90) % 180) - 90);
                    }
                }
            } else {
                // fallback - the connection has zero length
                translation = path.start;
                if (isOffsetAbsolute) { translation.offset(labelOffsetCoordinates); }
            }

            return V.createSVGMatrix()
                .translate(translation.x, translation.y)
                .rotate(angle);
        },

        getLabelCoordinates: function(labelPosition) {

            var transformationMatrix = this._getLabelTransformationMatrix(labelPosition);
            return new Point(transformationMatrix.e, transformationMatrix.f);
        },

        getVertexIndex: function(x, y) {

            var model = this.model;
            var vertices = model.vertices();

            var vertexLength = this.getClosestPointLength(new Point(x, y));

            var idx = 0;
            for (var n = vertices.length; idx < n; idx++) {
                var currentVertex = vertices[idx];
                var currentVertexLength = this.getClosestPointLength(currentVertex);
                if (vertexLength < currentVertexLength) { break; }
            }

            return idx;
        },

        // Interaction. The controller part.
        // ---------------------------------

        notifyPointerdown: function notifyPointerdown(evt, x, y) {
            CellView.prototype.pointerdown.call(this, evt, x, y);
            this.notify('link:pointerdown', evt, x, y);
        },

        notifyPointermove: function notifyPointermove(evt, x, y) {
            CellView.prototype.pointermove.call(this, evt, x, y);
            this.notify('link:pointermove', evt, x, y);
        },

        notifyPointerup: function notifyPointerup(evt, x, y) {
            this.notify('link:pointerup', evt, x, y);
            CellView.prototype.pointerup.call(this, evt, x, y);
        },

        pointerdblclick: function(evt, x, y) {

            CellView.prototype.pointerdblclick.apply(this, arguments);
            this.notify('link:pointerdblclick', evt, x, y);
        },

        pointerclick: function(evt, x, y) {

            CellView.prototype.pointerclick.apply(this, arguments);
            this.notify('link:pointerclick', evt, x, y);
        },

        contextmenu: function(evt, x, y) {

            CellView.prototype.contextmenu.apply(this, arguments);
            this.notify('link:contextmenu', evt, x, y);
        },

        pointerdown: function(evt, x, y) {

            this.notifyPointerdown(evt, x, y);

            // Backwards compatibility for the default markup
            var className = evt.target.getAttribute('class');
            switch (className) {

                case 'marker-vertex':
                    this.dragVertexStart(evt, x, y);
                    return;

                case 'marker-vertex-remove':
                case 'marker-vertex-remove-area':
                    this.dragVertexRemoveStart(evt, x, y);
                    return;

                case 'marker-arrowhead':
                    this.dragArrowheadStart(evt, x, y);
                    return;

                case 'connection':
                case 'connection-wrap':
                    this.dragConnectionStart(evt, x, y);
                    return;

                case 'marker-source':
                case 'marker-target':
                    return;
            }

            this.dragStart(evt, x, y);
        },

        pointermove: function(evt, x, y) {

            // Backwards compatibility
            var dragData = this._dragData;
            if (dragData) { this.eventData(evt, dragData); }

            var data = this.eventData(evt);
            switch (data.action) {

                case 'vertex-move':
                    this.dragVertex(evt, x, y);
                    break;

                case 'label-move':
                    this.dragLabel(evt, x, y);
                    break;

                case 'arrowhead-move':
                    this.dragArrowhead(evt, x, y);
                    break;

                case 'move':
                    this.drag(evt, x, y);
                    break;
            }

            // Backwards compatibility
            if (dragData) { assign(dragData, this.eventData(evt)); }

            this.notifyPointermove(evt, x, y);
        },

        pointerup: function(evt, x, y) {

            // Backwards compatibility
            var dragData = this._dragData;
            if (dragData) {
                this.eventData(evt, dragData);
                this._dragData = null;
            }

            var data = this.eventData(evt);
            switch (data.action) {

                case 'vertex-move':
                    this.dragVertexEnd(evt, x, y);
                    break;

                case 'label-move':
                    this.dragLabelEnd(evt, x, y);
                    break;

                case 'arrowhead-move':
                    this.dragArrowheadEnd(evt, x, y);
                    break;

                case 'move':
                    this.dragEnd(evt, x, y);
            }

            this.notifyPointerup(evt, x, y);
            this.checkMouseleave(evt);
        },

        mouseover: function(evt) {

            CellView.prototype.mouseover.apply(this, arguments);
            this.notify('link:mouseover', evt);
        },

        mouseout: function(evt) {

            CellView.prototype.mouseout.apply(this, arguments);
            this.notify('link:mouseout', evt);
        },

        mouseenter: function(evt) {

            CellView.prototype.mouseenter.apply(this, arguments);
            this.notify('link:mouseenter', evt);
        },

        mouseleave: function(evt) {

            CellView.prototype.mouseleave.apply(this, arguments);
            this.notify('link:mouseleave', evt);
        },

        mousewheel: function(evt, x, y, delta) {

            CellView.prototype.mousewheel.apply(this, arguments);
            this.notify('link:mousewheel', evt, x, y, delta);
        },

        onevent: function(evt, eventName, x, y) {

            // Backwards compatibility
            var linkTool = V(evt.target).findParentByClass('link-tool', this.el);
            if (linkTool) {
                // No further action to be executed
                evt.stopPropagation();

                // Allow `interactive.useLinkTools=false`
                if (this.can('useLinkTools')) {
                    if (eventName === 'remove') {
                        // Built-in remove event
                        this.model.remove({ ui: true });
                        // Do not trigger link pointerdown
                        return;

                    } else {
                        // link:options and other custom events inside the link tools
                        this.notify(eventName, evt, x, y);
                    }
                }

                this.notifyPointerdown(evt, x, y);

            } else {
                CellView.prototype.onevent.apply(this, arguments);
            }
        },

        onlabel: function(evt, x, y) {

            this.notifyPointerdown(evt, x, y);

            this.dragLabelStart(evt, x, y);

            var stopPropagation = this.eventData(evt).stopPropagation;
            if (stopPropagation) { evt.stopPropagation(); }
        },

        // Drag Start Handlers

        dragConnectionStart: function(evt, x, y) {

            if (!this.can('vertexAdd')) { return; }

            // Store the index at which the new vertex has just been placed.
            // We'll be update the very same vertex position in `pointermove()`.
            var vertexIdx = this.addVertex({ x: x, y: y }, { ui: true });
            this.eventData(evt, {
                action: 'vertex-move',
                vertexIdx: vertexIdx
            });
        },

        dragLabelStart: function(evt, x, y) {

            if (!this.can('labelMove')) {
                // Backwards compatibility:
                // If labels can't be dragged no default action is triggered.
                this.eventData(evt, { stopPropagation: true });
                return;
            }

            var labelNode = evt.currentTarget;
            var labelIdx = parseInt(labelNode.getAttribute('label-idx'), 10);

            var positionAngle = this._getLabelPositionAngle(labelIdx);
            var labelPositionArgs = this._getLabelPositionArgs(labelIdx);
            var defaultLabelPositionArgs = this._getDefaultLabelPositionArgs();
            var positionArgs = this._mergeLabelPositionArgs(labelPositionArgs, defaultLabelPositionArgs);

            this.eventData(evt, {
                action: 'label-move',
                labelIdx: labelIdx,
                positionAngle: positionAngle,
                positionArgs: positionArgs,
                stopPropagation: true
            });

            this.paper.delegateDragEvents(this, evt.data);
        },

        dragVertexStart: function(evt, x, y) {

            if (!this.can('vertexMove')) { return; }

            var vertexNode = evt.target;
            var vertexIdx = parseInt(vertexNode.getAttribute('idx'), 10);
            this.eventData(evt, {
                action: 'vertex-move',
                vertexIdx: vertexIdx
            });
        },

        dragVertexRemoveStart: function(evt, x, y) {

            if (!this.can('vertexRemove')) { return; }

            var removeNode = evt.target;
            var vertexIdx = parseInt(removeNode.getAttribute('idx'), 10);
            this.model.removeVertex(vertexIdx);
        },

        dragArrowheadStart: function(evt, x, y) {

            if (!this.can('arrowheadMove')) { return; }

            var arrowheadNode = evt.target;
            var arrowheadType = arrowheadNode.getAttribute('end');
            var data = this.startArrowheadMove(arrowheadType, { ignoreBackwardsCompatibility: true });

            this.eventData(evt, data);
        },

        dragStart: function(evt, x, y) {

            if (!this.can('linkMove')) { return; }

            this.eventData(evt, {
                action: 'move',
                dx: x,
                dy: y
            });
        },

        // Drag Handlers
        dragLabel: function(evt, x, y) {

            var data = this.eventData(evt);
            var label = { position: this.getLabelPosition(x, y, data.positionAngle, data.positionArgs) };
            this.model.label(data.labelIdx, label);
        },

        dragVertex: function(evt, x, y) {

            var data = this.eventData(evt);
            this.model.vertex(data.vertexIdx, { x: x, y: y }, { ui: true });
        },

        dragArrowhead: function(evt, x, y) {

            var data = this.eventData(evt);

            if (this.paper.options.snapLinks) {

                this._snapArrowhead(x, y, data);

            } else {

                this._connectArrowhead(this.getEventTarget(evt), x, y, data);
            }
        },

        drag: function(evt, x, y) {

            var data = this.eventData(evt);
            this.model.translate(x - data.dx, y - data.dy, { ui: true });
            this.eventData(evt, {
                dx: x,
                dy: y
            });
        },

        // Drag End Handlers

        dragLabelEnd: function() {
            // noop
        },

        dragVertexEnd: function() {
            // noop
        },

        dragArrowheadEnd: function(evt, x, y) {

            var data = this.eventData(evt);
            var paper = this.paper;

            if (paper.options.snapLinks) {
                this._snapArrowheadEnd(data);
            } else {
                this._connectArrowheadEnd(data, x, y);
            }

            if (!paper.linkAllowed(this)) {
                // If the changed link is not allowed, revert to its previous state.
                this._disallow(data);
            } else {
                this._finishEmbedding(data);
                this._notifyConnectEvent(data, evt);
            }

            this._afterArrowheadMove(data);
        },

        dragEnd: function() {
            // noop
        },

        _disallow: function(data) {

            switch (data.whenNotAllowed) {

                case 'remove':
                    this.model.remove({ ui: true });
                    break;

                case 'revert':
                default:
                    this.model.set(data.arrowhead, data.initialEnd, { ui: true });
                    break;
            }
        },

        _finishEmbedding: function(data) {

            // Reparent the link if embedding is enabled
            if (this.paper.options.embeddingMode && this.model.reparent()) {
                // Make sure we don't reverse to the original 'z' index (see afterArrowheadMove()).
                data.z = null;
            }
        },

        _notifyConnectEvent: function(data, evt) {

            var arrowhead = data.arrowhead;
            var initialEnd = data.initialEnd;
            var currentEnd = this.model.prop(arrowhead);
            var endChanged = currentEnd && !Link.endsEqual(initialEnd, currentEnd);
            if (endChanged) {
                var paper = this.paper;
                if (initialEnd.id) {
                    this.notify('link:disconnect', evt, paper.findViewByModel(initialEnd.id), data.initialMagnet, arrowhead);
                }
                if (currentEnd.id) {
                    this.notify('link:connect', evt, paper.findViewByModel(currentEnd.id), data.magnetUnderPointer, arrowhead);
                }
            }
        },

        _snapArrowhead: function(x, y, data) {

            // checking view in close area of the pointer

            var r = this.paper.options.snapLinks.radius || 50;
            var viewsInArea = this.paper.findViewsInArea({ x: x - r, y: y - r, width: 2 * r, height: 2 * r });

            var prevClosestView = data.closestView || null;
            var prevClosestMagnet = data.closestMagnet || null;

            data.closestView = data.closestMagnet = null;

            var distance;
            var minDistance = Number.MAX_VALUE;
            var pointer = Point(x, y);
            var paper = this.paper;

            viewsInArea.forEach(function(view) {

                // skip connecting to the element in case '.': { magnet: false } attribute present
                if (view.el.getAttribute('magnet') !== 'false') {

                    // find distance from the center of the model to pointer coordinates
                    distance = view.model.getBBox().center().distance(pointer);

                    // the connection is looked up in a circle area by `distance < r`
                    if (distance < r && distance < minDistance) {

                        if (prevClosestMagnet === view.el || paper.options.validateConnection.apply(
                            paper, data.validateConnectionArgs(view, null)
                        )) {
                            minDistance = distance;
                            data.closestView = view;
                            data.closestMagnet = view.el;
                        }
                    }
                }

                view.$('[magnet]').each(function(index, magnet) {

                    var bbox = view.getNodeBBox(magnet);

                    distance = pointer.distance({
                        x: bbox.x + bbox.width / 2,
                        y: bbox.y + bbox.height / 2
                    });

                    if (distance < r && distance < minDistance) {

                        if (prevClosestMagnet === magnet || paper.options.validateConnection.apply(
                            paper, data.validateConnectionArgs(view, magnet)
                        )) {
                            minDistance = distance;
                            data.closestView = view;
                            data.closestMagnet = magnet;
                        }
                    }

                }.bind(this));

            }, this);

            var end;
            var closestView = data.closestView;
            var closestMagnet = data.closestMagnet;
            var endType = data.arrowhead;
            var newClosestMagnet = (prevClosestMagnet !== closestMagnet);
            if (prevClosestView && newClosestMagnet) {
                prevClosestView.unhighlight(prevClosestMagnet, {
                    connecting: true,
                    snapping: true
                });
            }

            if (closestView) {

                if (!newClosestMagnet) { return; }

                closestView.highlight(closestMagnet, {
                    connecting: true,
                    snapping: true
                });
                end = closestView.getLinkEnd(closestMagnet, x, y, this.model, endType);

            } else {
                end = { x: x, y: y };
            }

            this.model.set(endType, end || { x: x, y: y }, { ui: true });
        },

        _snapArrowheadEnd: function(data) {

            // Finish off link snapping.
            // Everything except view unhighlighting was already done on pointermove.
            var closestView = data.closestView;
            var closestMagnet = data.closestMagnet;
            if (closestView && closestMagnet) {

                closestView.unhighlight(closestMagnet, { connecting: true, snapping: true });
                data.magnetUnderPointer = closestView.findMagnet(closestMagnet);
            }

            data.closestView = data.closestMagnet = null;
        },

        _connectArrowhead: function(target, x, y, data) {

            // checking views right under the pointer

            if (data.eventTarget !== target) {
                // Unhighlight the previous view under pointer if there was one.
                if (data.magnetUnderPointer) {
                    data.viewUnderPointer.unhighlight(data.magnetUnderPointer, {
                        connecting: true
                    });
                }

                data.viewUnderPointer = this.paper.findView(target);
                if (data.viewUnderPointer) {
                    // If we found a view that is under the pointer, we need to find the closest
                    // magnet based on the real target element of the event.
                    data.magnetUnderPointer = data.viewUnderPointer.findMagnet(target);

                    if (data.magnetUnderPointer && this.paper.options.validateConnection.apply(
                        this.paper,
                        data.validateConnectionArgs(data.viewUnderPointer, data.magnetUnderPointer)
                    )) {
                        // If there was no magnet found, do not highlight anything and assume there
                        // is no view under pointer we're interested in reconnecting to.
                        // This can only happen if the overall element has the attribute `'.': { magnet: false }`.
                        if (data.magnetUnderPointer) {
                            data.viewUnderPointer.highlight(data.magnetUnderPointer, {
                                connecting: true
                            });
                        }
                    } else {
                        // This type of connection is not valid. Disregard this magnet.
                        data.magnetUnderPointer = null;
                    }
                } else {
                    // Make sure we'll unset previous magnet.
                    data.magnetUnderPointer = null;
                }
            }

            data.eventTarget = target;

            this.model.set(data.arrowhead, { x: x, y: y }, { ui: true });
        },

        _connectArrowheadEnd: function(data, x, y) {

            var view = data.viewUnderPointer;
            var magnet = data.magnetUnderPointer;
            if (!magnet || !view) { return; }

            view.unhighlight(magnet, { connecting: true });

            var endType = data.arrowhead;
            var end = view.getLinkEnd(magnet, x, y, this.model, endType);
            this.model.set(endType, end, { ui: true });
        },

        _beforeArrowheadMove: function(data) {

            data.z = this.model.get('z');
            this.model.toFront();

            // Let the pointer propagate through the link view elements so that
            // the `evt.target` is another element under the pointer, not the link itself.
            var style = this.el.style;
            data.pointerEvents = style.pointerEvents;
            style.pointerEvents = 'none';

            if (this.paper.options.markAvailable) {
                this._markAvailableMagnets(data);
            }
        },

        _afterArrowheadMove: function(data) {

            if (data.z !== null) {
                this.model.set('z', data.z, { ui: true });
                data.z = null;
            }

            // Put `pointer-events` back to its original value. See `_beforeArrowheadMove()` for explanation.
            this.el.style.pointerEvents = data.pointerEvents;

            if (this.paper.options.markAvailable) {
                this._unmarkAvailableMagnets(data);
            }
        },

        _createValidateConnectionArgs: function(arrowhead) {
            // It makes sure the arguments for validateConnection have the following form:
            // (source view, source magnet, target view, target magnet and link view)
            var args = [];

            args[4] = arrowhead;
            args[5] = this;

            var oppositeArrowhead;
            var i = 0;
            var j = 0;

            if (arrowhead === 'source') {
                i = 2;
                oppositeArrowhead = 'target';
            } else {
                j = 2;
                oppositeArrowhead = 'source';
            }

            var end = this.model.get(oppositeArrowhead);

            if (end.id) {
                var view = args[i] = this.paper.findViewByModel(end.id);
                var magnet = view.getMagnetFromLinkEnd(end);
                if (magnet === view.el) { magnet = undefined; }
                args[i + 1] = magnet;
            }

            function validateConnectionArgs(cellView, magnet) {
                args[j] = cellView;
                args[j + 1] = cellView.el === magnet ? undefined : magnet;
                return args;
            }

            return validateConnectionArgs;
        },

        _markAvailableMagnets: function(data) {

            function isMagnetAvailable(view, magnet) {
                var paper = view.paper;
                var validate = paper.options.validateConnection;
                return validate.apply(paper, this.validateConnectionArgs(view, magnet));
            }

            var paper = this.paper;
            var elements = paper.model.getCells();
            data.marked = {};

            for (var i = 0, n = elements.length; i < n; i++) {
                var view = elements[i].findView(paper);

                if (!view) {
                    continue;
                }

                var magnets = Array.prototype.slice.call(view.el.querySelectorAll('[magnet]'));
                if (view.el.getAttribute('magnet') !== 'false') {
                    // Element wrapping group is also a magnet
                    magnets.push(view.el);
                }

                var availableMagnets = magnets.filter(isMagnetAvailable.bind(data, view));

                if (availableMagnets.length > 0) {
                    // highlight all available magnets
                    for (var j = 0, m = availableMagnets.length; j < m; j++) {
                        view.highlight(availableMagnets[j], { magnetAvailability: true });
                    }
                    // highlight the entire view
                    view.highlight(null, { elementAvailability: true });

                    data.marked[view.model.id] = availableMagnets;
                }
            }
        },

        _unmarkAvailableMagnets: function(data) {

            var markedKeys = Object.keys(data.marked);
            var id;
            var markedMagnets;

            for (var i = 0, n = markedKeys.length; i < n; i++) {
                id = markedKeys[i];
                markedMagnets = data.marked[id];

                var view = this.paper.findViewByModel(id);
                if (view) {
                    for (var j = 0, m = markedMagnets.length; j < m; j++) {
                        view.unhighlight(markedMagnets[j], { magnetAvailability: true });
                    }
                    view.unhighlight(null, { elementAvailability: true });
                }
            }

            data.marked = null;
        },

        startArrowheadMove: function(end, opt) {

            opt || (opt = {});

            // Allow to delegate events from an another view to this linkView in order to trigger arrowhead
            // move without need to click on the actual arrowhead dom element.
            var data = {
                action: 'arrowhead-move',
                arrowhead: end,
                whenNotAllowed: opt.whenNotAllowed || 'revert',
                initialMagnet: this[end + 'Magnet'] || (this[end + 'View'] ? this[end + 'View'].el : null),
                initialEnd: clone(this.model.get(end)),
                validateConnectionArgs: this._createValidateConnectionArgs(end)
            };

            this._beforeArrowheadMove(data);

            if (opt.ignoreBackwardsCompatibility !== true) {
                this._dragData = data;
            }

            return data;
        }
    });

    Object.defineProperty(LinkView.prototype, 'sourceBBox', {

        enumerable: true,

        get: function() {
            var sourceView = this.sourceView;
            if (!sourceView) {
                var sourceDef = this.model.source();
                return new Rect(sourceDef.x, sourceDef.y);
            }
            var sourceMagnet = this.sourceMagnet;
            if (sourceView.isNodeConnection(sourceMagnet)) {
                return new Rect(this.sourceAnchor);
            }
            return sourceView.getNodeBBox(sourceMagnet || sourceView.el);
        }

    });

    Object.defineProperty(LinkView.prototype, 'targetBBox', {

        enumerable: true,

        get: function() {
            var targetView = this.targetView;
            if (!targetView) {
                var targetDef = this.model.target();
                return new Rect(targetDef.x, targetDef.y);
            }
            var targetMagnet = this.targetMagnet;
            if (targetView.isNodeConnection(targetMagnet)) {
                return new Rect(this.targetAnchor);
            }
            return targetView.getNodeBBox(targetMagnet || targetView.el);
        }
    });

    var sortingTypes = {
        NONE: 'sorting-none',
        APPROX: 'sorting-approximate',
        EXACT: 'sorting-exact'
    };

    var FLAG_INSERT = 1<<30;
    var FLAG_REMOVE = 1<<29;

    var MOUNT_BATCH_SIZE = 1000;
    var UPDATE_BATCH_SIZE = Infinity;
    var MIN_PRIORITY = 2;

    var Paper = View.extend({

        className: 'paper',

        options: {

            width: 800,
            height: 600,
            origin: { x: 0, y: 0 }, // x,y coordinates in top-left corner
            gridSize: 1,

            // Whether or not to draw the grid lines on the paper's DOM element.
            // e.g drawGrid: true, drawGrid: { color: 'red', thickness: 2 }
            drawGrid: false,

            // Whether or not to draw the background on the paper's DOM element.
            // e.g. background: { color: 'lightblue', image: '/paper-background.png', repeat: 'flip-xy' }
            background: false,

            perpendicularLinks: false,
            elementView: ElementView,
            linkView: LinkView,
            snapLinks: false, // false, true, { radius: value }

            // When set to FALSE, an element may not have more than 1 link with the same source and target element.
            multiLinks: true,

            // For adding custom guard logic.
            guard: function(evt, view) {

                // FALSE means the event isn't guarded.
                return false;
            },

            highlighting: {
                'default': {
                    name: 'stroke',
                    options: {
                        padding: 3
                    }
                },
                magnetAvailability: {
                    name: 'addClass',
                    options: {
                        className: 'available-magnet'
                    }
                },
                elementAvailability: {
                    name: 'addClass',
                    options: {
                        className: 'available-cell'
                    }
                }
            },

            // Prevent the default context menu from being displayed.
            preventContextMenu: true,

            // Prevent the default action for blank:pointer<action>.
            preventDefaultBlankAction: true,

            // Restrict the translation of elements by given bounding box.
            // Option accepts a boolean:
            //  true - the translation is restricted to the paper area
            //  false - no restrictions
            // A method:
            // restrictTranslate: function(elementView) {
            //     var parentId = elementView.model.get('parent');
            //     return parentId && this.model.getCell(parentId).getBBox();
            // },
            // Or a bounding box:
            // restrictTranslate: { x: 10, y: 10, width: 790, height: 590 }
            restrictTranslate: false,

            // Marks all available magnets with 'available-magnet' class name and all available cells with
            // 'available-cell' class name. Marks them when dragging a link is started and unmark
            // when the dragging is stopped.
            markAvailable: false,

            // Defines what link model is added to the graph after an user clicks on an active magnet.
            // Value could be the Backbone.model or a function returning the Backbone.model
            // defaultLink: function(elementView, magnet) { return condition ? new customLink1() : new customLink2() }
            defaultLink: new Link,

            // A connector that is used by links with no connector defined on the model.
            // e.g. { name: 'rounded', args: { radius: 5 }} or a function
            defaultConnector: { name: 'normal' },

            // A router that is used by links with no router defined on the model.
            // e.g. { name: 'oneSide', args: { padding: 10 }} or a function
            defaultRouter: { name: 'normal' },

            defaultAnchor: { name: 'center' },

            defaultLinkAnchor: { name: 'connectionRatio' },

            defaultConnectionPoint: { name: 'bbox' },

            /* CONNECTING */

            connectionStrategy: null,

            // Check whether to add a new link to the graph when user clicks on an a magnet.
            validateMagnet: function(cellView, magnet) {
                return magnet.getAttribute('magnet') !== 'passive';
            },

            // Check whether to allow or disallow the link connection while an arrowhead end (source/target)
            // being changed.
            validateConnection: function(cellViewS, magnetS, cellViewT, magnetT, end, linkView) {
                return (end === 'target' ? cellViewT : cellViewS) instanceof ElementView;
            },

            /* EMBEDDING */

            // Enables embedding. Re-parent the dragged element with elements under it and makes sure that
            // all links and elements are visible taken the level of embedding into account.
            embeddingMode: false,

            // Check whether to allow or disallow the element embedding while an element being translated.
            validateEmbedding: function(childView, parentView) {
                // by default all elements can be in relation child-parent
                return true;
            },

            // Determines the way how a cell finds a suitable parent when it's dragged over the paper.
            // The cell with the highest z-index (visually on the top) will be chosen.
            findParentBy: 'bbox', // 'bbox'|'center'|'origin'|'corner'|'topRight'|'bottomLeft'

            // If enabled only the element on the very front is taken into account for the embedding.
            // If disabled the elements under the dragged view are tested one by one
            // (from front to back) until a valid parent found.
            frontParentOnly: true,

            // Interactive flags. See online docs for the complete list of interactive flags.
            interactive: {
                labelMove: false
            },

            // When set to true the links can be pinned to the paper.
            // i.e. link source/target can be a point e.g. link.get('source') ==> { x: 100, y: 100 };
            linkPinning: true,

            // Custom validation after an interaction with a link ends.
            // Recognizes a function. If `false` is returned, the link is disallowed (removed or reverted)
            // (linkView, paper) => boolean
            allowLink: null,

            // Allowed number of mousemove events after which the pointerclick event will be still triggered.
            clickThreshold: 0,

            // Number of required mousemove events before the first pointermove event will be triggered.
            moveThreshold: 0,

            // Number of required mousemove events before the a link is created out of the magnet.
            // Or string `onleave` so the link is created when the pointer leaves the magnet
            magnetThreshold: 0,

            // Rendering Options

            sorting: sortingTypes.EXACT,

            frozen: false,

            onViewUpdate: function(view, flag, opt, paper) {
                if ((flag & FLAG_INSERT) || opt.mounting) { return; }
                paper.requestConnectedLinksUpdate(view, opt);
            },

            onViewPostponed: function(view, flag /* paper */) {
                return this.forcePostponedViewUpdate(view, flag);
            },

            viewport: null,

            // Default namespaces

            cellViewNamespace: null,

            highlighterNamespace: highlighters,

            anchorNamespace: anchors,

            linkAnchorNamespace: linkAnchors,

            connectionPointNamespace: connectionPoints
        },

        events: {
            'dblclick': 'pointerdblclick',
            'contextmenu': 'contextmenu',
            'mousedown': 'pointerdown',
            'touchstart': 'pointerdown',
            'mouseover': 'mouseover',
            'mouseout': 'mouseout',
            'mouseenter': 'mouseenter',
            'mouseleave': 'mouseleave',
            'mousewheel': 'mousewheel',
            'DOMMouseScroll': 'mousewheel',
            'mouseenter .joint-cell': 'mouseenter',
            'mouseleave .joint-cell': 'mouseleave',
            'mouseenter .joint-tools': 'mouseenter',
            'mouseleave .joint-tools': 'mouseleave',
            'mousedown .joint-cell [event]': 'onevent', // interaction with cell with `event` attribute set
            'touchstart .joint-cell [event]': 'onevent',
            'mousedown .joint-cell [magnet]': 'onmagnet', // interaction with cell with `magnet` attribute set
            'touchstart .joint-cell [magnet]': 'onmagnet',
            'dblclick .joint-cell [magnet]': 'magnetpointerdblclick',
            'contextmenu .joint-cell [magnet]': 'magnetcontextmenu',
            'mousedown .joint-link .label': 'onlabel', // interaction with link label
            'touchstart .joint-link .label': 'onlabel',
            'dragstart .joint-cell image': 'onImageDragStart' // firefox fix
        },

        documentEvents: {
            'mousemove': 'pointermove',
            'touchmove': 'pointermove',
            'mouseup': 'pointerup',
            'touchend': 'pointerup',
            'touchcancel': 'pointerup'
        },

        svg: null,
        viewport: null,
        defs: null,
        tools: null,
        $background: null,
        layers: null,
        $grid: null,
        $document: null,

        _highlights: null,
        _zPivots: null,
        // For storing the current transformation matrix (CTM) of the paper's viewport.
        _viewportMatrix: null,
        // For verifying whether the CTM is up-to-date. The viewport transform attribute
        // could have been manipulated directly.
        _viewportTransformString: null,
        // Updates data (priorities, unmounted views etc.)
        _updates: null,

        SORT_DELAYING_BATCHES: ['add', 'to-front', 'to-back'],
        UPDATE_DELAYING_BATCHES: ['translate'],
        MIN_SCALE: 1e-6,

        init: function() {

            var ref = this;
            var options = ref.options;
            var el = ref.el;
            if (!options.cellViewNamespace) {
                /* global joint: true */
                options.cellViewNamespace = typeof joint !== 'undefined' && has(joint, 'shapes') ? joint.shapes : null;
                /* global joint: false */
            }

            var model = this.model = options.model || new Graph;

            this.setGrid(options.drawGrid);
            this.cloneOptions();
            this.render();
            this.setDimensions();
            this.startListening();

            // Hash of all cell views.
            this._views = {};
            // z-index pivots
            this._zPivots = {};
            // Reference to the paper owner document
            this.$document = $(el.ownerDocument);
            // Highlighters references
            this._highlights = {};
            // Render existing cells in the graph
            this.resetViews(model.attributes.cells.models);
            // Start the Rendering Loop
            if (!this.isFrozen() && this.isAsync()) { this.updateViewsAsync(); }
        },

        _resetUpdates: function() {
            return this._updates = {
                id: null,
                priorities: [{}, {}, {}],
                unmountedCids: [],
                mountedCids: [],
                unmounted: {},
                mounted: {},
                count: 0,
                keyFrozen: false,
                freezeKey: null,
                sort: false
            };
        },

        startListening: function() {
            var model = this.model;
            this.listenTo(model, 'add', this.onCellAdded)
                .listenTo(model, 'remove', this.onCellRemoved)
                .listenTo(model, 'change', this.onCellChange)
                .listenTo(model, 'reset', this.onGraphReset)
                .listenTo(model, 'sort', this.onGraphSort)
                .listenTo(model, 'batch:stop', this.onGraphBatchStop);
            this.on('cell:highlight', this.onCellHighlight)
                .on('cell:unhighlight', this.onCellUnhighlight)
                .on('scale translate', this.update);
        },

        onCellAdded: function(cell, _$$1, opt) {
            var position = opt.position;
            if (this.isAsync() || !isNumber(position)) {
                this.renderView(cell, opt);
            } else {
                if (opt.maxPosition === position) { this.freeze({ key: 'addCells' }); }
                this.renderView(cell, opt);
                if (position === 0) { this.unfreeze({ key: 'addCells' }); }
            }
        },

        onCellRemoved: function(cell, _$$1, opt) {
            var view = this.findViewByModel(cell);
            if (view) { this.requestViewUpdate(view, FLAG_REMOVE, view.UPDATE_PRIORITY, opt); }
        },

        onCellChange: function(cell, opt) {
            if (cell === this.model.attributes.cells) { return; }
            if (cell.hasChanged('z') && this.options.sorting === sortingTypes.APPROX) {
                var view = this.findViewByModel(cell);
                if (view) { this.requestViewUpdate(view, FLAG_INSERT, view.UPDATE_PRIORITY, opt); }
            }
        },

        onGraphReset: function(collection, opt) {
            this.removeZPivots();
            this.resetViews(collection.models, opt);
        },

        onGraphSort: function() {
            if (this.model.hasActiveBatch(this.SORT_DELAYING_BATCHES)) { return; }
            this.sortViews();
        },

        onGraphBatchStop: function(data) {
            if (this.isFrozen()) { return; }
            var name = data && data.batchName;
            var graph = this.model;
            if (!this.isAsync()) {
                var updateDelayingBatches = this.UPDATE_DELAYING_BATCHES;
                if (updateDelayingBatches.includes(name) && !graph.hasActiveBatch(updateDelayingBatches)) {
                    this.updateViews(data);
                }
            }
            var sortDelayingBatches = this.SORT_DELAYING_BATCHES;
            if (sortDelayingBatches.includes(name) && !graph.hasActiveBatch(sortDelayingBatches)) {
                this.sortViews();
            }
        },

        cloneOptions: function() {

            var options = this.options;

            // This is a fix for the case where two papers share the same options.
            // Changing origin.x for one paper would change the value of origin.x for the other.
            // This prevents that behavior.
            options.origin = assign({}, options.origin);
            options.defaultConnector = assign({}, options.defaultConnector);
            // Return the default highlighting options into the user specified options.
            options.highlighting = defaultsDeep(
                {},
                options.highlighting,
                this.constructor.prototype.options.highlighting
            );

            // Default cellView namespace for ES5
            /* global joint: true */
            if (!options.cellViewNamespace && typeof joint !== 'undefined' && has(joint, 'shapes')) {
                options.cellViewNamespace = joint.shapes;
            }
            /* global joint: false */
        },

        children: function() {
            var ns = V.namespace;
            return [{
                namespaceURI: ns.xhtml,
                tagName: 'div',
                className: addClassNamePrefix('paper-background'),
                selector: 'background'
            }, {
                namespaceURI: ns.xhtml,
                tagName: 'div',
                className: addClassNamePrefix('paper-grid'),
                selector: 'grid'
            }, {
                namespaceURI: ns.svg,
                tagName: 'svg',
                attributes: {
                    'width': '100%',
                    'height': '100%',
                    'xmlns:xlink': ns.xlink
                },
                selector: 'svg',
                children: [{
                    // Append `<defs>` element to the SVG document. This is useful for filters and gradients.
                    // It's desired to have the defs defined before the viewport (e.g. to make a PDF document pick up defs properly).
                    tagName: 'defs',
                    selector: 'defs'
                }, {
                    tagName: 'g',
                    className: addClassNamePrefix('layers'),
                    selector: 'layers',
                    children: [{
                        tagName: 'g',
                        className: addClassNamePrefix('cells-layer viewport'),
                        selector: 'cells',
                    }, {
                        tagName: 'g',
                        className: addClassNamePrefix('tools-layer'),
                        selector: 'tools'
                    }]
                }]
            }];
        },

        render: function() {

            this.renderChildren();
            var ref = this;
            var childNodes = ref.childNodes;
            var options = ref.options;
            var svg = childNodes.svg;
            var cells = childNodes.cells;
            var defs = childNodes.defs;
            var tools = childNodes.tools;
            var layers = childNodes.layers;
            var background = childNodes.background;
            var grid = childNodes.grid;

            this.svg = svg;
            this.defs = defs;
            this.tools = tools;
            this.cells = cells;
            this.layers = layers;
            this.$background = $(background);
            this.$grid = $(grid);

            V.ensureId(svg);

            // backwards compatibility
            this.viewport = cells;

            if (options.background) {
                this.drawBackground(options.background);
            }

            if (options.drawGrid) {
                this.drawGrid();
            }

            return this;
        },

        update: function() {

            if (this.options.drawGrid) {
                this.drawGrid();
            }

            if (this._background) {
                this.updateBackgroundImage(this._background);
            }

            return this;
        },

        matrix: function(ctm) {

            var viewport = this.layers;

            // Getter:
            if (ctm === undefined) {

                var transformString = viewport.getAttribute('transform');

                if ((this._viewportTransformString || null) === transformString) {
                    // It's ok to return the cached matrix. The transform attribute has not changed since
                    // the matrix was stored.
                    ctm = this._viewportMatrix;
                } else {
                    // The viewport transform attribute has changed. Measure the matrix and cache again.
                    ctm = viewport.getCTM();
                    this._viewportMatrix = ctm;
                    this._viewportTransformString = transformString;
                }

                // Clone the cached current transformation matrix.
                // If no matrix previously stored the identity matrix is returned.
                return V.createSVGMatrix(ctm);
            }

            // Setter:
            ctm = V.createSVGMatrix(ctm);
            var ctmString = V.matrixToTransformString(ctm);
            viewport.setAttribute('transform', ctmString);

            this._viewportMatrix = ctm;
            this._viewportTransformString = viewport.getAttribute('transform');

            return this;
        },

        clientMatrix: function() {

            return V.createSVGMatrix(this.cells.getScreenCTM());
        },

        requestConnectedLinksUpdate: function(view, opt) {
            if (view instanceof CellView) {
                var model = view.model;
                var links = this.model.getConnectedLinks(model);
                for (var j = 0, n = links.length; j < n; j++) {
                    var link = links[j];
                    var linkView = this.findViewByModel(link);
                    if (!linkView) { continue; }
                    var flagLabels = ['UPDATE'];
                    if (link.getTargetCell() === model) { flagLabels.push('TARGET'); }
                    if (link.getSourceCell() === model) { flagLabels.push('SOURCE'); }
                    this.scheduleViewUpdate(linkView, linkView.getFlag(flagLabels), linkView.UPDATE_PRIORITY, opt);
                }
            }
        },

        forcePostponedViewUpdate: function(view, flag) {
            if (!view || !(view instanceof CellView)) { return false; }
            var model = view.model;
            if (model.isElement()) { return false; }
            if ((flag & view.getFlag(['SOURCE', 'TARGET'])) === 0) {
                // LinkView is waiting for the target or the source cellView to be rendered
                // This can happen when the cells are not in the viewport.
                var sourceFlag = 0;
                var sourceView = this.findViewByModel(model.getSourceCell());
                if (sourceView && !this.isViewMounted(sourceView)) {
                    sourceFlag = this.dumpView(sourceView);
                    view.updateEndMagnet('source');
                }
                var targetFlag = 0;
                var targetView = this.findViewByModel(model.getTargetCell());
                if (targetView && !this.isViewMounted(targetView)) {
                    targetFlag = this.dumpView(targetView);
                    view.updateEndMagnet('target');
                }
                if (sourceFlag === 0 && targetFlag === 0) {
                    return !!this.dumpView(view);
                }
            }
            return false;
        },

        requestViewUpdate: function(view, flag, priority, opt) {
            opt || (opt = {});
            this.scheduleViewUpdate(view, flag, priority, opt);
            var isAsync = this.isAsync();
            if (this.isFrozen() || (isAsync && opt.async !== false)) { return; }
            if (this.model.hasActiveBatch(this.UPDATE_DELAYING_BATCHES)) { return; }
            var stats = this.updateViews(opt);
            if (isAsync) { this.trigger('render:done', stats, opt); }
        },

        scheduleViewUpdate: function(view, type, priority, opt) {
            var updates = this._updates;
            var priorityUpdates = updates.priorities[priority];
            if (!priorityUpdates) { priorityUpdates = updates.priorities[priority] = {}; }
            var currentType = priorityUpdates[view.cid] || 0;
            // prevent cycling
            if ((currentType & type) === type) { return; }
            if (!currentType) { updates.count++; }
            if (type & FLAG_REMOVE && currentType & FLAG_INSERT) {
                // When a view is removed we need to remove the insert flag as this is a reinsert
                priorityUpdates[view.cid] ^= FLAG_INSERT;
            } else if (type & FLAG_INSERT && currentType & FLAG_REMOVE) {
                // When a view is added we need to remove the remove flag as this is view was previously removed
                priorityUpdates[view.cid] ^= FLAG_REMOVE;
            }
            priorityUpdates[view.cid] |= type;
            var viewUpdateFn = this.options.onViewUpdate;
            if (typeof viewUpdateFn === 'function') { viewUpdateFn.call(this, view, type, opt || {}, this); }
        },

        dumpViewUpdate: function(view) {
            if (!view) { return 0; }
            var updates = this._updates;
            var cid = view.cid;
            var priorityUpdates = updates.priorities[view.UPDATE_PRIORITY];
            var flag = this.registerMountedView(view) | priorityUpdates[cid];
            delete priorityUpdates[cid];
            return flag;
        },

        dumpView: function(view, opt) {
            var flag = this.dumpViewUpdate(view);
            if (!flag) { return 0; }
            return this.updateView(view, flag, opt);
        },

        updateView: function(view, flag, opt) {
            if (!view) { return 0; }
            if (view instanceof CellView) {
                if (flag & FLAG_REMOVE) {
                    this.removeView(view.model);
                    return 0;
                }
                if (flag & FLAG_INSERT) {
                    this.insertView(view);
                    flag ^= FLAG_INSERT;
                }
            }
            if (!flag) { return 0; }
            return view.confirmUpdate(flag, opt || {});
        },

        requireView: function(model, opt) {
            var view = this.findViewByModel(model);
            if (!view) { return null; }
            this.dumpView(view, opt);
            return view;
        },

        registerUnmountedView: function(view) {
            var cid = view.cid;
            var updates = this._updates;
            if (cid in updates.unmounted) { return 0; }
            var flag = updates.unmounted[cid] |= FLAG_INSERT;
            updates.unmountedCids.push(cid);
            delete updates.mounted[cid];
            return flag;
        },

        registerMountedView: function(view) {
            var cid = view.cid;
            var updates = this._updates;
            if (cid in updates.mounted) { return 0; }
            updates.mounted[cid] = true;
            updates.mountedCids.push(cid);
            var flag = updates.unmounted[cid] || 0;
            delete updates.unmounted[cid];
            return flag;
        },

        isViewMounted: function(view) {
            if (!view) { return false; }
            var cid = view.cid;
            var updates = this._updates;
            return (cid in updates.mounted);
        },

        dumpViews: function(opt) {
            var passingOpt = defaults({}, opt, { viewport: null });
            this.checkViewport(passingOpt);
            this.updateViews(passingOpt);
        },

        updateViews: function(opt) {
            var stats;
            var updateCount = 0;
            var batchCount = 0;
            var priority = MIN_PRIORITY;
            do {
                batchCount++;
                stats = this.updateViewsBatch(opt);
                updateCount += stats.updated;
                priority = Math.min(stats.priority, priority);
            } while (!stats.empty);
            return { updated: updateCount, batches: batchCount, priority: priority };
        },

        updateViewsAsync: function(opt, data) {
            opt || (opt = {});
            data || (data = { processed: 0, priority: MIN_PRIORITY });
            var updates = this._updates;
            var id = updates.id;
            if (id) {
                cancelFrame(id);
                var stats = this.updateViewsBatch(opt);
                var passingOpt = defaults({}, opt, {
                    mountBatchSize: MOUNT_BATCH_SIZE - stats.mounted,
                    unmountBatchSize: MOUNT_BATCH_SIZE - stats.unmounted
                });
                var checkStats = this.checkViewport(passingOpt);
                var unmountCount = checkStats.unmounted;
                var mountCount = checkStats.mounted;
                var processed = data.processed;
                var total = updates.count;
                if (stats.updated > 0) {
                    // Some updates have been just processed
                    processed += stats.updated + stats.unmounted;
                    stats.processed = processed;
                    data.priority = Math.min(stats.priority, data.priority);
                    if (stats.empty && mountCount === 0) {
                        stats.unmounted += unmountCount;
                        stats.mounted += mountCount;
                        stats.priority = data.priority;
                        this.trigger('render:done', stats, opt);
                        data.processed = 0;
                        updates.count = 0;
                    } else {
                        data.processed = processed;
                    }
                }
                // Progress callback
                var progressFn = opt.progress;
                if (total && typeof progressFn === 'function') {
                    progressFn.call(this, stats.empty, processed, total, stats, this);
                }
                // The current frame could have been canceled in a callback
                if (updates.id !== id) { return; }
            }
            updates.id = nextFrame(this.updateViewsAsync, this, opt, data);
        },

        updateViewsBatch: function(opt) {
            opt || (opt = {});
            var batchSize = opt.batchSize || UPDATE_BATCH_SIZE;
            var updates = this._updates;
            var updateCount = 0;
            var postponeCount = 0;
            var unmountCount = 0;
            var mountCount = 0;
            var maxPriority = MIN_PRIORITY;
            var empty = true;
            var options = this.options;
            var priorities = updates.priorities;
            var viewportFn = 'viewport' in opt ? opt.viewport : options.viewport;
            if (typeof viewportFn !== 'function') { viewportFn = null; }
            var postponeViewFn = options.onViewPostponed;
            if (typeof postponeViewFn !== 'function') { postponeViewFn = null; }
            main: for (var priority = 0, n = priorities.length; priority < n; priority++) {
                var priorityUpdates = priorities[priority];
                for (var cid in priorityUpdates) {
                    if (updateCount >= batchSize) {
                        empty = false;
                        break main;
                    }
                    var view = views[cid];
                    if (!view) {
                        // This should not occur
                        delete priorityUpdates[cid];
                        continue;
                    }
                    var currentFlag = priorityUpdates[cid];
                    var isDetached = cid in updates.unmounted;
                    if (viewportFn && !viewportFn.call(this, view, isDetached, this)) {
                        // Unmount View
                        if (!isDetached) {
                            this.registerUnmountedView(view);
                            view.unmount();
                        }
                        updates.unmounted[cid] |= currentFlag;
                        delete priorityUpdates[cid];
                        unmountCount++;
                        continue;
                    }
                    // Mount View
                    if (isDetached) {
                        currentFlag |= FLAG_INSERT;
                        mountCount++;
                    }
                    currentFlag |= this.registerMountedView(view);
                    var leftoverFlag = this.updateView(view, currentFlag, opt);
                    if (leftoverFlag > 0) {
                        // View update has not finished completely
                        priorityUpdates[cid] = leftoverFlag;
                        if (!postponeViewFn || !postponeViewFn.call(this, view, leftoverFlag, this) || priorityUpdates[cid]) {
                            postponeCount++;
                            empty = false;
                            continue;
                        }
                    }
                    if (maxPriority > priority) { maxPriority = priority; }
                    updateCount++;
                    delete priorityUpdates[cid];
                }
            }
            return {
                priority: maxPriority,
                updated: updateCount,
                postponed: postponeCount,
                unmounted: unmountCount,
                mounted: mountCount,
                empty: empty
            };
        },

        checkUnmountedViews: function(viewportFn, opt) {
            opt || (opt  = {});
            var mountCount = 0;
            if (typeof viewportFn !== 'function') { viewportFn = null; }
            var batchSize = 'mountBatchSize' in opt ? opt.mountBatchSize : Infinity;
            var updates = this._updates;
            var unmountedCids = updates.unmountedCids;
            var unmounted = updates.unmounted;
            for (var i = 0, n = Math.min(unmountedCids.length, batchSize); i < n; i++) {
                var cid = unmountedCids[i];
                if (!(cid in unmounted)) { continue; }
                var view = views[cid];
                if (!view) { continue; }
                if (viewportFn && !viewportFn.call(this, view, true, this)) {
                    // Push at the end of all unmounted ids, so this can be check later again
                    unmountedCids.push(cid);
                    continue;
                }
                mountCount++;
                var flag = this.registerMountedView(view);
                if (flag) { this.scheduleViewUpdate(view, flag, view.UPDATE_PRIORITY, { mounting: true }); }
            }
            // Get rid of views, that have been mounted
            unmountedCids.splice(0, i);
            return mountCount;
        },

        checkMountedViews: function(viewportFn, opt) {
            opt || (opt = {});
            var unmountCount = 0;
            if (typeof viewportFn !== 'function') { return unmountCount; }
            var batchSize = 'unmountBatchSize' in opt ? opt.unmountBatchSize : Infinity;
            var updates = this._updates;
            var mountedCids = updates.mountedCids;
            var mounted = updates.mounted;
            for (var i = 0, n = Math.min(mountedCids.length, batchSize); i < n; i++) {
                var cid = mountedCids[i];
                if (!(cid in mounted)) { continue; }
                var view = views[cid];
                if (!view) { continue; }
                if (viewportFn.call(this, view, true)) {
                    // Push at the end of all mounted ids, so this can be check later again
                    mountedCids.push(cid);
                    continue;
                }
                unmountCount++;
                var flag = this.registerUnmountedView(view);
                if (flag) { view.unmount(); }
            }
            // Get rid of views, that have been unmounted
            mountedCids.splice(0, i);
            return unmountCount;
        },

        checkViewport: function(opt) {
            var passingOpt = defaults({}, opt, {
                mountBatchSize: Infinity,
                unmountBatchSize: Infinity
            });
            var viewportFn = 'viewport' in passingOpt ? passingOpt.viewport : this.options.viewport;
            var unmountedCount = this.checkMountedViews(viewportFn, passingOpt);
            if (unmountedCount > 0) {
                // Do not check views, that have been just unmounted and pushed at the end of the cids array
                var unmountedCids = this._updates.unmountedCids;
                passingOpt.mountBatchSize = Math.min(unmountedCids.length - unmountedCount, passingOpt.mountBatchSize);
            }
            var mountedCount = this.checkUnmountedViews(viewportFn, passingOpt);
            return {
                mounted: mountedCount,
                unmounted: unmountedCount
            };
        },

        freeze: function(opt) {
            opt || (opt = {});
            var updates = this._updates;
            var key = opt.key;
            var isFrozen = this.options.frozen;
            var freezeKey = updates.freezeKey;
            if (key && key !== freezeKey)  {
                // key passed, but the paper is already freezed with another key
                if (isFrozen && freezeKey) { return; }
                updates.freezeKey = key;
                updates.keyFrozen = isFrozen;
            }
            this.options.frozen = true;
            var id = updates.id;
            updates.id = null;
            if (this.isAsync() && id) { cancelFrame(id); }
        },

        unfreeze: function(opt) {
            opt || (opt = {});
            var updates = this._updates;
            var key = opt.key;
            var freezeKey = updates.freezeKey;
            // key passed, but the paper is already freezed with another key
            if (key && freezeKey && key !== freezeKey) { return; }
            updates.freezeKey = null;
            // key passed, but the paper is already freezed
            if (key && key === freezeKey && updates.keyFrozen) { return; }
            if (this.isAsync()) {
                this.freeze();
                this.updateViewsAsync(opt);
            } else {
                this.updateViews(opt);
            }
            this.options.frozen = updates.keyFrozen = false;
            if (updates.sort) {
                this.sortViews();
                updates.sort = false;
            }
        },

        isAsync: function() {
            return !!this.options.async;
        },

        isFrozen: function() {
            return !!this.options.frozen;
        },

        isExactSorting: function() {
            return this.options.sorting === sortingTypes.EXACT;
        },

        onRemove: function() {

            this.freeze();
            //clean up all DOM elements/views to prevent memory leaks
            this.removeViews();
        },

        getComputedSize: function() {

            var options = this.options;
            var w = options.width;
            var h = options.height;
            if (!isNumber(w)) { w = this.el.clientWidth; }
            if (!isNumber(h)) { h = this.el.clientHeight; }
            return { width: w, height: h };
        },

        setDimensions: function(width, height) {

            var options = this.options;
            var w = (width === undefined) ? options.width : width;
            var h = (height === undefined) ? options.height : height;
            this.options.width = w;
            this.options.height = h;
            if (isNumber(w)) { w = Math.round(w); }
            if (isNumber(h)) { h = Math.round(h); }
            this.$el.css({
                width: (w === null) ? '' : w,
                height: (h === null) ? '' : h
            });
            var computedSize = this.getComputedSize();
            this.trigger('resize', computedSize.width, computedSize.height);
        },

        setOrigin: function(ox, oy) {

            return this.translate(ox || 0, oy || 0, { absolute: true });
        },

        // Expand/shrink the paper to fit the content. Snap the width/height to the grid
        // defined in `gridWidth`, `gridHeight`. `padding` adds to the resulting width/height of the paper.
        // When options { fitNegative: true } it also translates the viewport in order to make all
        // the content visible.
        fitToContent: function(gridWidth, gridHeight, padding, opt) { // alternatively function(opt)

            if (isObject(gridWidth)) {
                // first parameter is an option object
                opt = gridWidth;
                gridWidth = opt.gridWidth || 1;
                gridHeight = opt.gridHeight || 1;
                padding = opt.padding || 0;

            } else {

                opt || (opt = {});
                gridWidth = gridWidth || 1;
                gridHeight = gridHeight || 1;
                padding = padding || 0;
            }

            // Calculate the paper size to accomodate all the graph's elements.

            padding = normalizeSides(padding);

            var area = ('contentArea' in opt) ? new Rect(opt.contentArea) : this.getContentArea(opt);

            var currentScale = this.scale();
            var currentTranslate = this.translate();
            var sx = currentScale.sx;
            var sy = currentScale.sy;

            area.x *= sx;
            area.y *= sy;
            area.width *= sx;
            area.height *= sy;

            var calcWidth = Math.max(Math.ceil((area.width + area.x) / gridWidth), 1) * gridWidth;
            var calcHeight = Math.max(Math.ceil((area.height + area.y) / gridHeight), 1) * gridHeight;

            var tx = 0;
            var ty = 0;

            if ((opt.allowNewOrigin == 'negative' && area.x < 0) || (opt.allowNewOrigin == 'positive' && area.x >= 0) || opt.allowNewOrigin == 'any') {
                tx = Math.ceil(-area.x / gridWidth) * gridWidth;
                tx += padding.left;
                calcWidth += tx;
            }

            if ((opt.allowNewOrigin == 'negative' && area.y < 0) || (opt.allowNewOrigin == 'positive' && area.y >= 0) || opt.allowNewOrigin == 'any') {
                ty = Math.ceil(-area.y / gridHeight) * gridHeight;
                ty += padding.top;
                calcHeight += ty;
            }

            calcWidth += padding.right;
            calcHeight += padding.bottom;

            // Make sure the resulting width and height are greater than minimum.
            calcWidth = Math.max(calcWidth, opt.minWidth || 0);
            calcHeight = Math.max(calcHeight, opt.minHeight || 0);

            // Make sure the resulting width and height are lesser than maximum.
            calcWidth = Math.min(calcWidth, opt.maxWidth || Number.MAX_VALUE);
            calcHeight = Math.min(calcHeight, opt.maxHeight || Number.MAX_VALUE);

            var computedSize = this.getComputedSize();
            var dimensionChange = calcWidth != computedSize.width || calcHeight != computedSize.height;
            var originChange = tx != currentTranslate.tx || ty != currentTranslate.ty;

            // Change the dimensions only if there is a size discrepency or an origin change
            if (originChange) {
                this.translate(tx, ty);
            }
            if (dimensionChange) {
                this.setDimensions(calcWidth, calcHeight);
            }

            return new Rect(-tx / sx, -ty / sy, calcWidth / sx, calcHeight / sy);
        },

        scaleContentToFit: function(opt) {

            opt || (opt = {});

            var contentBBox, contentLocalOrigin;
            if ('contentArea' in opt) {
                var contentArea = opt.contentArea;
                contentBBox = this.localToPaperRect(contentArea);
                contentLocalOrigin = new Point(contentArea);
            } else {
                contentBBox = this.getContentBBox(opt);
                contentLocalOrigin = this.paperToLocalPoint(contentBBox);
            }

            if (!contentBBox.width || !contentBBox.height) { return; }

            defaults(opt, {
                padding: 0,
                preserveAspectRatio: true,
                scaleGrid: null,
                minScale: 0,
                maxScale: Number.MAX_VALUE
                //minScaleX
                //minScaleY
                //maxScaleX
                //maxScaleY
                //fittingBBox
            });

            var padding = opt.padding;

            var minScaleX = opt.minScaleX || opt.minScale;
            var maxScaleX = opt.maxScaleX || opt.maxScale;
            var minScaleY = opt.minScaleY || opt.minScale;
            var maxScaleY = opt.maxScaleY || opt.maxScale;

            var fittingBBox;
            if (opt.fittingBBox) {
                fittingBBox = opt.fittingBBox;
            } else {
                var currentTranslate = this.translate();
                var computedSize = this.getComputedSize();
                fittingBBox = {
                    x: currentTranslate.tx,
                    y: currentTranslate.ty,
                    width: computedSize.width,
                    height: computedSize.height
                };
            }

            fittingBBox = new Rect(fittingBBox).inflate(-padding);

            var currentScale = this.scale();

            var newSx = fittingBBox.width / contentBBox.width * currentScale.sx;
            var newSy = fittingBBox.height / contentBBox.height * currentScale.sy;

            if (opt.preserveAspectRatio) {
                newSx = newSy = Math.min(newSx, newSy);
            }

            // snap scale to a grid
            if (opt.scaleGrid) {

                var gridSize = opt.scaleGrid;

                newSx = gridSize * Math.floor(newSx / gridSize);
                newSy = gridSize * Math.floor(newSy / gridSize);
            }

            // scale min/max boundaries
            newSx = Math.min(maxScaleX, Math.max(minScaleX, newSx));
            newSy = Math.min(maxScaleY, Math.max(minScaleY, newSy));

            var origin = this.options.origin;
            var newOx = fittingBBox.x - contentLocalOrigin.x * newSx - origin.x;
            var newOy = fittingBBox.y - contentLocalOrigin.y * newSy - origin.y;

            this.scale(newSx, newSy);
            this.translate(newOx, newOy);
        },

        // Return the dimensions of the content area in local units (without transformations).
        getContentArea: function(opt) {

            if (opt && opt.useModelGeometry) {
                var graph = this.model;
                return graph.getCellsBBox(graph.getCells(), { includeLinks: true }) || new Rect();
            }

            return V(this.cells).getBBox();
        },

        // Return the dimensions of the content bbox in the paper units (as it appears on screen).
        getContentBBox: function(opt) {

            return this.localToPaperRect(this.getContentArea(opt));
        },

        // Returns a geometry rectangle represeting the entire
        // paper area (coordinates from the left paper border to the right one
        // and the top border to the bottom one).
        getArea: function() {

            return this.paperToLocalRect(this.getComputedSize());
        },

        getRestrictedArea: function() {

            var restrictedArea;

            if (isFunction(this.options.restrictTranslate)) {
                // A method returning a bounding box
                restrictedArea = this.options.restrictTranslate.apply(this, arguments);
            } else if (this.options.restrictTranslate === true) {
                // The paper area
                restrictedArea = this.getArea();
            } else {
                // Either false or a bounding box
                restrictedArea = this.options.restrictTranslate || null;
            }

            return restrictedArea;
        },

        createViewForModel: function(cell) {

            // A class taken from the paper options.
            var optionalViewClass;

            // A default basic class (either dia.ElementView or dia.LinkView)
            var defaultViewClass;

            // A special class defined for this model in the corresponding namespace.
            // e.g. joint.shapes.basic.Rect searches for joint.shapes.basic.RectView
            var namespace = this.options.cellViewNamespace;
            var type = cell.get('type') + 'View';
            var namespaceViewClass = getByPath(namespace, type, '.');

            if (cell.isLink()) {
                optionalViewClass = this.options.linkView;
                defaultViewClass = LinkView;
            } else {
                optionalViewClass = this.options.elementView;
                defaultViewClass = ElementView;
            }

            // a) the paper options view is a class (deprecated)
            //  1. search the namespace for a view
            //  2. if no view was found, use view from the paper options
            // b) the paper options view is a function
            //  1. call the function from the paper options
            //  2. if no view was return, search the namespace for a view
            //  3. if no view was found, use the default
            var ViewClass = (optionalViewClass.prototype instanceof Backbone.View)
                ? namespaceViewClass || optionalViewClass
                : optionalViewClass.call(this, cell) || namespaceViewClass || defaultViewClass;

            return new ViewClass({
                model: cell,
                interactive: this.options.interactive
            });
        },

        removeView: function(cell) {

            var id = cell.id;
            var view = this._views[id];
            if (view) {
                view.remove();
                delete this._views[id];
            }
            return view;
        },

        renderView: function(cell, opt) {

            var id = cell.id;
            var views$$1 = this._views;
            var view, flag;
            if (id in views$$1) {
                view = views$$1[id];
                flag = FLAG_INSERT;
            } else {
                view = views$$1[cell.id] = this.createViewForModel(cell);
                view.paper = this;
                flag = FLAG_INSERT | view.getFlag(view.initFlag);
            }
            this.requestViewUpdate(view, flag, view.UPDATE_PRIORITY, opt);
            return view;
        },

        onImageDragStart: function() {
            // This is the only way to prevent image dragging in Firefox that works.
            // Setting -moz-user-select: none, draggable="false" attribute or user-drag: none didn't help.

            return false;
        },

        resetViews: function(cells, opt) {
            opt || (opt = {});
            cells || (cells = []);
            this._resetUpdates();
            // clearing views removes any event listeners
            this.removeViews();
            this.freeze({ key: 'reset' });
            for (var i = 0, n = cells.length; i < n; i++) {
                this.renderView(cells[i], opt);
            }
            this.unfreeze({ key: 'reset' });
            this.sortViews();
        },

        removeViews: function() {

            invoke(this._views, 'remove');

            this._views = {};
        },

        sortViews: function() {

            if (!this.isExactSorting()) {
                // noop
                return;
            }
            if (this.isFrozen()) {
                // sort views once unfrozen
                this._updates.sort = true;
                return;
            }
            this.sortViewsExact();
        },

        sortViewsExact: function() {

            // Run insertion sort algorithm in order to efficiently sort DOM elements according to their
            // associated model `z` attribute.

            var $cells = $(this.cells).children('[model-id]');
            var cells = this.model.get('cells');

            sortElements($cells, function(a, b) {
                var cellA = cells.get(a.getAttribute('model-id'));
                var cellB = cells.get(b.getAttribute('model-id'));
                var zA = cellA.attributes.z || 0;
                var zB = cellB.attributes.z || 0;
                return (zA === zB) ? 0 : (zA < zB) ? -1 : 1;
            });
        },


        insertView: function(view) {
            var layer = this.cells;
            switch (this.options.sorting) {
                case sortingTypes.APPROX:
                    var z = view.model.get('z');
                    var pivot = this.addZPivot(z);
                    layer.insertBefore(view.el, pivot);
                    break;
                case sortingTypes.EXACT:
                default:
                    layer.appendChild(view.el);
                    break;
            }
        },

        addZPivot: function(z) {
            z = +z;
            z || (z = 0);
            var pivots = this._zPivots;
            var pivot = pivots[z];
            if (pivot) { return pivot; }
            pivot = pivots[z] = document.createComment('z-index:' + (z + 1));
            var neighborZ = -Infinity;
            for (var currentZ in pivots) {
                currentZ = +currentZ;
                if (currentZ < z && currentZ > neighborZ) {
                    neighborZ = currentZ;
                    if (neighborZ === z - 1) { continue; }
                }
            }
            var layer = this.cells;
            if (neighborZ !== -Infinity) {
                var neighborPivot = pivots[neighborZ];
                // Insert After
                layer.insertBefore(pivot, neighborPivot.nextSibling);
            } else {
                // First Child
                layer.insertBefore(pivot, layer.firstChild);
            }
            return pivot;
        },

        removeZPivots: function() {
            var ref = this;
            var pivots = ref._zPivots;
            var viewport = ref.viewport;
            for (var z in pivots) { viewport.removeChild(pivots[z]); }
            this._zPivots = {};
        },

        scale: function(sx, sy, ox, oy) {

            // getter
            if (sx === undefined) {
                return V.matrixToScale(this.matrix());
            }

            // setter
            if (sy === undefined) {
                sy = sx;
            }
            if (ox === undefined) {
                ox = 0;
                oy = 0;
            }

            var translate = this.translate();

            if (ox || oy || translate.tx || translate.ty) {
                var newTx = translate.tx - ox * (sx - 1);
                var newTy = translate.ty - oy * (sy - 1);
                this.translate(newTx, newTy);
            }

            sx = Math.max(sx || 0, this.MIN_SCALE);
            sy = Math.max(sy || 0, this.MIN_SCALE);

            var ctm = this.matrix();
            ctm.a = sx;
            ctm.d = sy;

            this.matrix(ctm);

            this.trigger('scale', sx, sy, ox, oy);

            return this;
        },

        // Experimental - do not use in production.
        rotate: function(angle, cx, cy) {

            // getter
            if (angle === undefined) {
                return V.matrixToRotate(this.matrix());
            }

            // setter

            // If the origin is not set explicitely, rotate around the center. Note that
            // we must use the plain bounding box (`this.el.getBBox()` instead of the one that gives us
            // the real bounding box (`bbox()`) including transformations).
            if (cx === undefined) {
                var bbox$$1 = this.cells.getBBox();
                cx = bbox$$1.width / 2;
                cy = bbox$$1.height / 2;
            }

            var ctm = this.matrix().translate(cx, cy).rotate(angle).translate(-cx, -cy);
            this.matrix(ctm);

            return this;
        },

        translate: function(tx, ty) {

            // getter
            if (tx === undefined) {
                return V.matrixToTranslate(this.matrix());
            }

            // setter

            var ctm = this.matrix();
            ctm.e = tx || 0;
            ctm.f = ty || 0;

            this.matrix(ctm);

            var newTranslate = this.translate();
            var origin = this.options.origin;
            origin.x = newTranslate.tx;
            origin.y = newTranslate.ty;

            this.trigger('translate', newTranslate.tx, newTranslate.ty);

            if (this.options.drawGrid) {
                this.drawGrid();
            }

            return this;
        },

        // Find the first view climbing up the DOM tree starting at element `el`. Note that `el` can also
        // be a selector or a jQuery object.
        findView: function($el) {

            var el = isString($el)
                ? this.cells.querySelector($el)
                : $el instanceof $ ? $el[0] : $el;

            var id = this.findAttribute('model-id', el);
            if (id) { return this._views[id]; }

            return undefined;
        },

        // Find a view for a model `cell`. `cell` can also be a string or number representing a model `id`.
        findViewByModel: function(cell) {

            var id = (isString(cell) || isNumber(cell)) ? cell : (cell && cell.id);

            return this._views[id];
        },

        // Find all views at given point
        findViewsFromPoint: function(p) {

            p = new Point(p);

            var views$$1 = this.model.getElements().map(this.findViewByModel, this);

            return views$$1.filter(function(view) {
                return view && view.vel.getBBox({ target: this.cells }).containsPoint(p);
            }, this);
        },

        // Find all views in given area
        findViewsInArea: function(rect$$1, opt) {

            opt = defaults(opt || {}, { strict: false });
            rect$$1 = new Rect(rect$$1);

            var views$$1 = this.model.getElements().map(this.findViewByModel, this);
            var method = opt.strict ? 'containsRect' : 'intersect';

            return views$$1.filter(function(view) {
                return view && rect$$1[method](view.vel.getBBox({ target: this.cells }));
            }, this);
        },

        removeTools: function() {
            this.dispatchToolsEvent('remove');
            return this;
        },

        hideTools: function() {
            this.dispatchToolsEvent('hide');
            return this;
        },

        showTools: function() {
            this.dispatchToolsEvent('show');
            return this;
        },

        dispatchToolsEvent: function(event) {
            var ref;

            var args = [], len = arguments.length - 1;
            while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];
            if (typeof event !== 'string') { return; }
            (ref = this).trigger.apply(ref, [ 'tools:event', event ].concat( args ));
        },


        getModelById: function(id) {

            return this.model.getCell(id);
        },

        snapToGrid: function(x, y) {

            // Convert global coordinates to the local ones of the `viewport`. Otherwise,
            // improper transformation would be applied when the viewport gets transformed (scaled/rotated).
            return this.clientToLocalPoint(x, y).snapToGrid(this.options.gridSize);
        },

        localToPaperPoint: function(x, y) {
            // allow `x` to be a point and `y` undefined
            var localPoint = new Point(x, y);
            var paperPoint = V.transformPoint(localPoint, this.matrix());
            return paperPoint;
        },

        localToPaperRect: function(x, y, width, height) {
            // allow `x` to be a rectangle and rest arguments undefined
            var localRect = new Rect(x, y, width, height);
            var paperRect = V.transformRect(localRect, this.matrix());
            return paperRect;
        },

        paperToLocalPoint: function(x, y) {
            // allow `x` to be a point and `y` undefined
            var paperPoint = new Point(x, y);
            var localPoint = V.transformPoint(paperPoint, this.matrix().inverse());
            return localPoint;
        },

        paperToLocalRect: function(x, y, width, height) {
            // allow `x` to be a rectangle and rest arguments undefined
            var paperRect = new Rect(x, y, width, height);
            var localRect = V.transformRect(paperRect, this.matrix().inverse());
            return localRect;
        },

        localToClientPoint: function(x, y) {
            // allow `x` to be a point and `y` undefined
            var localPoint = new Point(x, y);
            var clientPoint = V.transformPoint(localPoint, this.clientMatrix());
            return clientPoint;
        },

        localToClientRect: function(x, y, width, height) {
            // allow `x` to be a point and `y` undefined
            var localRect = new Rect(x, y, width, height);
            var clientRect = V.transformRect(localRect, this.clientMatrix());
            return clientRect;
        },

        // Transform client coordinates to the paper local coordinates.
        // Useful when you have a mouse event object and you'd like to get coordinates
        // inside the paper that correspond to `evt.clientX` and `evt.clientY` point.
        // Example: var localPoint = paper.clientToLocalPoint({ x: evt.clientX, y: evt.clientY });
        clientToLocalPoint: function(x, y) {
            // allow `x` to be a point and `y` undefined
            var clientPoint = new Point(x, y);
            var localPoint = V.transformPoint(clientPoint, this.clientMatrix().inverse());
            return localPoint;
        },

        clientToLocalRect: function(x, y, width, height) {
            // allow `x` to be a point and `y` undefined
            var clientRect = new Rect(x, y, width, height);
            var localRect = V.transformRect(clientRect, this.clientMatrix().inverse());
            return localRect;
        },

        localToPagePoint: function(x, y) {

            return this.localToPaperPoint(x, y).offset(this.pageOffset());
        },

        localToPageRect: function(x, y, width, height) {

            return this.localToPaperRect(x, y, width, height).offset(this.pageOffset());
        },

        pageToLocalPoint: function(x, y) {

            var pagePoint = new Point(x, y);
            var paperPoint = pagePoint.difference(this.pageOffset());
            return this.paperToLocalPoint(paperPoint);
        },

        pageToLocalRect: function(x, y, width, height) {

            var pageOffset = this.pageOffset();
            var paperRect = new Rect(x, y, width, height);
            paperRect.x -= pageOffset.x;
            paperRect.y -= pageOffset.y;
            return this.paperToLocalRect(paperRect);
        },

        clientOffset: function() {

            var clientRect = this.svg.getBoundingClientRect();
            return new Point(clientRect.left, clientRect.top);
        },

        pageOffset: function() {

            return this.clientOffset().offset(window.scrollX, window.scrollY);
        },

        linkAllowed: function(linkView) {

            if (!(linkView instanceof LinkView)) {
                throw new Error('Must provide a linkView.');
            }

            var link = linkView.model;
            var paperOptions = this.options;
            var graph = this.model;
            var ns = graph.constructor.validations;

            if (!paperOptions.multiLinks) {
                if (!ns.multiLinks.call(this, graph, link)) { return false; }
            }

            if (!paperOptions.linkPinning) {
                // Link pinning is not allowed and the link is not connected to the target.
                if (!ns.linkPinning.call(this, graph, link)) { return false; }
            }

            if (typeof paperOptions.allowLink === 'function') {
                if (!paperOptions.allowLink.call(this, linkView, this)) { return false; }
            }

            return true;
        },

        getDefaultLink: function(cellView, magnet) {

            return isFunction(this.options.defaultLink)
            // default link is a function producing link model
                ? this.options.defaultLink.call(this, cellView, magnet)
            // default link is the Backbone model
                : this.options.defaultLink.clone();
        },

        // Cell highlighting.
        // ------------------

        resolveHighlighter: function(opt) {

            opt = opt || {};
            var highlighterDef = opt.highlighter;
            var paperOpt = this.options;

            /*
                    Expecting opt.highlighter to have the following structure:
                    {
                        name: 'highlighter-name',
                        options: {
                            some: 'value'
                        }
                    }
                */
            if (highlighterDef === undefined) {

                // check for built-in types
                var type = ['embedding', 'connecting', 'magnetAvailability', 'elementAvailability'].find(function(type) {
                    return !!opt[type];
                });

                highlighterDef = (type && paperOpt.highlighting[type]) || paperOpt.highlighting['default'];
            }

            // Do nothing if opt.highlighter is falsey.
            // This allows the case to not highlight cell(s) in certain cases.
            // For example, if you want to NOT highlight when embedding elements.
            if (!highlighterDef) { return false; }

            // Allow specifying a highlighter by name.
            if (isString(highlighterDef)) {
                highlighterDef = {
                    name: highlighterDef
                };
            }

            var name = highlighterDef.name;
            var highlighter = paperOpt.highlighterNamespace[name];

            // Highlighter validation
            if (!highlighter) {
                throw new Error('Unknown highlighter ("' + name + '")');
            }
            if (typeof highlighter.highlight !== 'function') {
                throw new Error('Highlighter ("' + name + '") is missing required highlight() method');
            }
            if (typeof highlighter.unhighlight !== 'function') {
                throw new Error('Highlighter ("' + name + '") is missing required unhighlight() method');
            }

            return {
                highlighter: highlighter,
                options: highlighterDef.options || {},
                name: name
            };
        },

        onCellHighlight: function(cellView, magnetEl, opt) {

            opt = this.resolveHighlighter(opt);
            if (!opt) { return; }
            if (!magnetEl.id) {
                magnetEl.id = V.uniqueId();
            }

            var key = opt.name + magnetEl.id + JSON.stringify(opt.options);
            if (!this._highlights[key]) {

                var highlighter = opt.highlighter;
                highlighter.highlight(cellView, magnetEl, assign({}, opt.options));

                this._highlights[key] = {
                    cellView: cellView,
                    magnetEl: magnetEl,
                    opt: opt.options,
                    highlighter: highlighter
                };
            }
        },

        onCellUnhighlight: function(cellView, magnetEl, opt) {

            opt = this.resolveHighlighter(opt);
            if (!opt) { return; }

            var key = opt.name + magnetEl.id + JSON.stringify(opt.options);
            var highlight = this._highlights[key];
            if (highlight) {

                // Use the cellView and magnetEl that were used by the highlighter.highlight() method.
                highlight.highlighter.unhighlight(highlight.cellView, highlight.magnetEl, highlight.opt);

                this._highlights[key] = null;
            }
        },

        // Interaction.
        // ------------

        pointerdblclick: function(evt) {

            evt.preventDefault();

            // magnetpointerdblclick can stop propagation

            evt = normalizeEvent(evt);

            var view = this.findView(evt.target);
            if (this.guard(evt, view)) { return; }

            var localPoint = this.snapToGrid(evt.clientX, evt.clientY);

            if (view) {
                view.pointerdblclick(evt, localPoint.x, localPoint.y);

            } else {
                this.trigger('blank:pointerdblclick', evt, localPoint.x, localPoint.y);
            }
        },

        pointerclick: function(evt) {

            // magnetpointerclick can stop propagation

            var data = this.eventData(evt);
            // Trigger event only if mouse has not moved.
            if (data.mousemoved <= this.options.clickThreshold) {

                evt = normalizeEvent(evt);

                var view = this.findView(evt.target);
                if (this.guard(evt, view)) { return; }

                var localPoint = this.snapToGrid(evt.clientX, evt.clientY);

                if (view) {
                    view.pointerclick(evt, localPoint.x, localPoint.y);

                } else {
                    this.trigger('blank:pointerclick', evt, localPoint.x, localPoint.y);
                }
            }
        },

        contextmenu: function(evt) {

            if (this.options.preventContextMenu) { evt.preventDefault(); }

            evt = normalizeEvent(evt);

            var view = this.findView(evt.target);
            if (this.guard(evt, view)) { return; }

            var localPoint = this.snapToGrid(evt.clientX, evt.clientY);

            if (view) {
                view.contextmenu(evt, localPoint.x, localPoint.y);

            } else {
                this.trigger('blank:contextmenu', evt, localPoint.x, localPoint.y);
            }
        },

        pointerdown: function(evt) {

            // onmagnet stops propagation when `addLinkFromMagnet` is allowed
            // onevent can stop propagation

            evt = normalizeEvent(evt);

            var view = this.findView(evt.target);
            if (this.guard(evt, view)) { return; }

            var localPoint = this.snapToGrid(evt.clientX, evt.clientY);

            if (view) {

                evt.preventDefault();
                view.pointerdown(evt, localPoint.x, localPoint.y);

            } else {

                if (this.options.preventDefaultBlankAction) { evt.preventDefault(); }

                this.trigger('blank:pointerdown', evt, localPoint.x, localPoint.y);
            }

            this.delegateDragEvents(view, evt.data);
        },

        pointermove: function(evt) {

            // mouse moved counter
            var data = this.eventData(evt);
            data.mousemoved || (data.mousemoved = 0);
            var mousemoved = ++data.mousemoved;

            if (mousemoved <= this.options.moveThreshold) { return; }

            evt = normalizeEvent(evt);

            var localPoint = this.snapToGrid(evt.clientX, evt.clientY);

            var view = data.sourceView;
            if (view) {
                view.pointermove(evt, localPoint.x, localPoint.y);
            } else {
                this.trigger('blank:pointermove', evt, localPoint.x, localPoint.y);
            }

            this.eventData(evt, data);
        },

        pointerup: function(evt) {

            this.undelegateDocumentEvents();

            var normalizedEvt = normalizeEvent(evt);

            var localPoint = this.snapToGrid(normalizedEvt.clientX, normalizedEvt.clientY);

            var view = this.eventData(evt).sourceView;
            if (view) {
                view.pointerup(normalizedEvt, localPoint.x, localPoint.y);
            } else {
                this.trigger('blank:pointerup', normalizedEvt, localPoint.x, localPoint.y);
            }

            if (!normalizedEvt.isPropagationStopped()) {
                this.pointerclick($.Event(evt, { type: 'click', data: evt.data }));
            }

            evt.stopImmediatePropagation();
            this.delegateEvents();
        },

        mouseover: function(evt) {

            evt = normalizeEvent(evt);

            var view = this.findView(evt.target);
            if (this.guard(evt, view)) { return; }

            if (view) {
                view.mouseover(evt);

            } else {
                if (this.el === evt.target) { return; } // prevent border of paper from triggering this
                this.trigger('blank:mouseover', evt);
            }
        },

        mouseout: function(evt) {

            evt = normalizeEvent(evt);

            var view = this.findView(evt.target);
            if (this.guard(evt, view)) { return; }

            if (view) {
                view.mouseout(evt);

            } else {
                if (this.el === evt.target) { return; } // prevent border of paper from triggering this
                this.trigger('blank:mouseout', evt);
            }
        },

        mouseenter: function(evt) {

            evt = normalizeEvent(evt);

            var view = this.findView(evt.target);
            if (this.guard(evt, view)) { return; }
            var relatedView = this.findView(evt.relatedTarget);
            if (view) {
                // mouse moved from tool over view?
                if (relatedView === view) { return; }
                view.mouseenter(evt);
            } else {
                if (relatedView) { return; }
                // `paper` (more descriptive), not `blank`
                this.trigger('paper:mouseenter', evt);
            }
        },

        mouseleave: function(evt) {

            evt = normalizeEvent(evt);

            var view = this.findView(evt.target);
            if (this.guard(evt, view)) { return; }
            var relatedView = this.findView(evt.relatedTarget);
            if (view) {
                // mouse moved from view over tool?
                if (relatedView === view) { return; }
                view.mouseleave(evt);
            } else {
                if (relatedView) { return; }
                // `paper` (more descriptive), not `blank`
                this.trigger('paper:mouseleave', evt);
            }
        },

        mousewheel: function(evt) {

            evt = normalizeEvent(evt);

            var view = this.findView(evt.target);
            if (this.guard(evt, view)) { return; }

            var originalEvent = evt.originalEvent;
            var localPoint = this.snapToGrid(originalEvent.clientX, originalEvent.clientY);
            var delta = Math.max(-1, Math.min(1, (originalEvent.wheelDelta || -originalEvent.detail)));

            if (view) {
                view.mousewheel(evt, localPoint.x, localPoint.y, delta);

            } else {
                this.trigger('blank:mousewheel', evt, localPoint.x, localPoint.y, delta);
            }
        },

        onevent: function(evt) {

            var eventNode = evt.currentTarget;
            var eventName = eventNode.getAttribute('event');
            if (eventName) {
                var view = this.findView(eventNode);
                if (view) {

                    evt = normalizeEvent(evt);
                    if (this.guard(evt, view)) { return; }

                    var localPoint = this.snapToGrid(evt.clientX, evt.clientY);
                    view.onevent(evt, eventName, localPoint.x, localPoint.y);
                }
            }
        },

        magnetEvent: function(evt, handler) {

            var magnetNode = evt.currentTarget;
            var magnetValue = magnetNode.getAttribute('magnet');
            if (magnetValue) {
                var view = this.findView(magnetNode);
                if (view) {
                    evt = normalizeEvent(evt);
                    if (this.guard(evt, view)) { return; }
                    var localPoint = this.snapToGrid(evt.clientX, evt.clientY);
                    handler.call(this, view, evt, magnetNode, localPoint.x, localPoint.y);
                }
            }
        },

        onmagnet: function(evt) {

            this.magnetEvent(evt, function(view, evt, _$$1, x, y) {
                view.onmagnet(evt, x, y);
            });
        },


        magnetpointerdblclick: function(evt) {

            this.magnetEvent(evt, function(view, evt, magnet, x, y) {
                view.magnetpointerdblclick(evt, magnet, x, y);
            });
        },

        magnetcontextmenu: function(evt) {

            if (this.options.preventContextMenu) { evt.preventDefault(); }
            this.magnetEvent(evt, function(view, evt, magnet, x, y) {
                view.magnetcontextmenu(evt, magnet, x, y);
            });
        },

        onlabel: function(evt) {

            var labelNode = evt.currentTarget;
            var view = this.findView(labelNode);
            if (view) {

                evt = normalizeEvent(evt);
                if (this.guard(evt, view)) { return; }

                var localPoint = this.snapToGrid(evt.clientX, evt.clientY);
                view.onlabel(evt, localPoint.x, localPoint.y);
            }
        },

        getPointerArgs: function getPointerArgs(evt) {
            var normalizedEvt = normalizeEvent(evt);
            var ref = this.snapToGrid(normalizedEvt.clientX, normalizedEvt.clientY);
            var x = ref.x;
            var y = ref.y;
            return [normalizedEvt, x, y];
        },

        delegateDragEvents: function(view, data) {

            data || (data = {});
            this.eventData({ data: data }, { sourceView: view || null, mousemoved: 0 });
            this.delegateDocumentEvents(null, data);
            this.undelegateEvents();
        },

        // Guard the specified event. If the event is not interesting, guard returns `true`.
        // Otherwise, it returns `false`.
        guard: function(evt, view) {

            if (evt.type === 'mousedown' && evt.button === 2) {
                // handled as `contextmenu` type
                return true;
            }

            if (this.options.guard && this.options.guard(evt, view)) {
                return true;
            }

            if (evt.data && evt.data.guarded !== undefined) {
                return evt.data.guarded;
            }

            if (view && view.model && (view.model instanceof Cell)) {
                return false;
            }

            if (this.svg === evt.target || this.el === evt.target || $.contains(this.svg, evt.target)) {
                return false;
            }

            return true;    // Event guarded. Paper should not react on it in any way.
        },

        setGridSize: function(gridSize) {

            this.options.gridSize = gridSize;

            if (this.options.drawGrid) {
                this.drawGrid();
            }

            return this;
        },

        clearGrid: function() {

            if (this.$grid) {
                this.$grid.css('backgroundImage', 'none');
            }
            return this;
        },

        _getGridRefs: function() {

            if (!this._gridCache) {

                this._gridCache = {
                    root: V('svg', { width: '100%', height: '100%' }, V('defs')),
                    patterns: {},
                    add: function(id, vel) {
                        V(this.root.node.childNodes[0]).append(vel);
                        this.patterns[id] = vel;
                        this.root.append(V('rect', { width: '100%', height: '100%', fill: 'url(#' + id + ')' }));
                    },
                    get: function(id) {
                        return this.patterns[id];
                    },
                    exist: function(id) {
                        return this.patterns[id] !== undefined;
                    }
                };
            }

            return this._gridCache;
        },

        setGrid: function(drawGrid) {

            this.clearGrid();

            this._gridCache = null;
            this._gridSettings = [];

            var optionsList = Array.isArray(drawGrid) ? drawGrid : [drawGrid || {}];
            optionsList.forEach(function(item) {
                this._gridSettings.push.apply(this._gridSettings, this._resolveDrawGridOption(item));
            }, this);
            return this;
        },

        _resolveDrawGridOption: function(opt) {

            var namespace = this.constructor.gridPatterns;
            if (isString(opt) && Array.isArray(namespace[opt])) {
                return namespace[opt].map(function(item) {
                    return assign({}, item);
                });
            }

            var options = opt || { args: [{}] };
            var isArray = Array.isArray(options);
            var name = options.name;

            if (!isArray && !name && !options.markup) {
                name = 'dot';
            }

            if (name && Array.isArray(namespace[name])) {
                var pattern = namespace[name].map(function(item) {
                    return assign({}, item);
                });

                var args = Array.isArray(options.args) ? options.args : [options.args || {}];

                defaults(args[0], omit(opt, 'args'));
                for (var i = 0; i < args.length; i++) {
                    if (pattern[i]) {
                        assign(pattern[i], args[i]);
                    }
                }
                return pattern;
            }

            return isArray ? options : [options];
        },

        drawGrid: function(opt) {

            var gridSize = this.options.gridSize;
            if (gridSize <= 1) {
                return this.clearGrid();
            }

            var localOptions = Array.isArray(opt) ? opt : [opt];

            var ctm = this.matrix();
            var refs = this._getGridRefs();

            this._gridSettings.forEach(function(gridLayerSetting, index) {

                var id = 'pattern_' + index;
                var options = merge(gridLayerSetting, localOptions[index], {
                    sx: ctm.a || 1,
                    sy: ctm.d || 1,
                    ox: ctm.e || 0,
                    oy: ctm.f || 0
                });

                options.width = gridSize * (ctm.a || 1) * (options.scaleFactor || 1);
                options.height = gridSize * (ctm.d || 1) * (options.scaleFactor || 1);

                if (!refs.exist(id)) {
                    refs.add(id, V('pattern', { id: id, patternUnits: 'userSpaceOnUse' }, V(options.markup)));
                }

                var patternDefVel = refs.get(id);

                if (isFunction(options.update)) {
                    options.update(patternDefVel.node.childNodes[0], options);
                }

                var x = options.ox % options.width;
                if (x < 0) { x += options.width; }

                var y = options.oy % options.height;
                if (y < 0) { y += options.height; }

                patternDefVel.attr({
                    x: x,
                    y: y,
                    width: options.width,
                    height: options.height
                });
            });

            var patternUri = new XMLSerializer().serializeToString(refs.root.node);
            patternUri = 'url(data:image/svg+xml;base64,' + btoa(patternUri) + ')';

            this.$grid.css('backgroundImage', patternUri);

            return this;
        },

        updateBackgroundImage: function(opt) {

            opt = opt || {};

            var backgroundPosition = opt.position || 'center';
            var backgroundSize = opt.size || 'auto auto';

            var currentScale = this.scale();
            var currentTranslate = this.translate();

            // backgroundPosition
            if (isObject(backgroundPosition)) {
                var x = currentTranslate.tx + (currentScale.sx * (backgroundPosition.x || 0));
                var y = currentTranslate.ty + (currentScale.sy * (backgroundPosition.y || 0));
                backgroundPosition = x + 'px ' + y + 'px';
            }

            // backgroundSize
            if (isObject(backgroundSize)) {
                backgroundSize = new Rect(backgroundSize).scale(currentScale.sx, currentScale.sy);
                backgroundSize = backgroundSize.width + 'px ' + backgroundSize.height + 'px';
            }

            this.$background.css({
                backgroundSize: backgroundSize,
                backgroundPosition: backgroundPosition
            });
        },

        drawBackgroundImage: function(img, opt) {

            // Clear the background image if no image provided
            if (!(img instanceof HTMLImageElement)) {
                this.$background.css('backgroundImage', '');
                return;
            }

            opt = opt || {};

            var backgroundImage;
            var backgroundSize = opt.size;
            var backgroundRepeat = opt.repeat || 'no-repeat';
            var backgroundOpacity = opt.opacity || 1;
            var backgroundQuality = Math.abs(opt.quality) || 1;
            var backgroundPattern = this.constructor.backgroundPatterns[camelCase(backgroundRepeat)];

            if (isFunction(backgroundPattern)) {
                // 'flip-x', 'flip-y', 'flip-xy', 'watermark' and custom
                img.width *= backgroundQuality;
                img.height *= backgroundQuality;
                var canvas = backgroundPattern(img, opt);
                if (!(canvas instanceof HTMLCanvasElement)) {
                    throw new Error('dia.Paper: background pattern must return an HTML Canvas instance');
                }

                backgroundImage = canvas.toDataURL('image/png');
                backgroundRepeat = 'repeat';
                if (isObject(backgroundSize)) {
                    // recalculate the tile size if an object passed in
                    backgroundSize.width *= canvas.width / img.width;
                    backgroundSize.height *= canvas.height / img.height;
                } else if (backgroundSize === undefined) {
                    // calcule the tile size if no provided
                    opt.size = {
                        width: canvas.width / backgroundQuality,
                        height: canvas.height / backgroundQuality
                    };
                }
            } else {
                // backgroundRepeat:
                // no-repeat', 'round', 'space', 'repeat', 'repeat-x', 'repeat-y'
                backgroundImage = img.src;
                if (backgroundSize === undefined) {
                    // pass the image size for  the backgroundSize if no size provided
                    opt.size = {
                        width: img.width,
                        height: img.height
                    };
                }
            }

            this.$background.css({
                opacity: backgroundOpacity,
                backgroundRepeat: backgroundRepeat,
                backgroundImage: 'url(' + backgroundImage + ')'
            });

            this.updateBackgroundImage(opt);
        },

        updateBackgroundColor: function(color) {

            this.$el.css('backgroundColor', color || '');
        },

        drawBackground: function(opt) {

            opt = opt || {};

            this.updateBackgroundColor(opt.color);

            if (opt.image) {
                opt = this._background = cloneDeep(opt);
                var img = document.createElement('img');
                img.onload = this.drawBackgroundImage.bind(this, img, opt);
                img.src = opt.image;
            } else {
                this.drawBackgroundImage(null);
                this._background = null;
            }

            return this;
        },

        setInteractivity: function(value) {

            this.options.interactive = value;

            invoke(this._views, 'setInteractivity', value);
        },

        // Paper definitions.
        // ------------------

        isDefined: function(defId) {

            return !!this.svg.getElementById(defId);
        },

        defineFilter: function(filter$$1) {

            if (!isObject(filter$$1)) {
                throw new TypeError('dia.Paper: defineFilter() requires 1. argument to be an object.');
            }

            var filterId = filter$$1.id;
            var name = filter$$1.name;
            // Generate a hash code from the stringified filter definition. This gives us
            // a unique filter ID for different definitions.
            if (!filterId) {
                filterId = name + this.svg.id + hashCode(JSON.stringify(filter$$1));
            }
            // If the filter already exists in the document,
            // we're done and we can just use it (reference it using `url()`).
            // If not, create one.
            if (!this.isDefined(filterId)) {

                var namespace = filter;
                var filterSVGString = namespace[name] && namespace[name](filter$$1.args || {});
                if (!filterSVGString) {
                    throw new Error('Non-existing filter ' + name);
                }

                // Set the filter area to be 3x the bounding box of the cell
                // and center the filter around the cell.
                var filterAttrs = assign({
                    filterUnits: 'objectBoundingBox',
                    x: -1,
                    y: -1,
                    width: 3,
                    height: 3
                }, filter$$1.attrs, {
                    id: filterId
                });

                V(filterSVGString, filterAttrs).appendTo(this.defs);
            }

            return filterId;
        },

        defineGradient: function(gradient) {

            if (!isObject(gradient)) {
                throw new TypeError('dia.Paper: defineGradient() requires 1. argument to be an object.');
            }

            var gradientId = gradient.id;
            var type = gradient.type;
            var stops = gradient.stops;
            // Generate a hash code from the stringified filter definition. This gives us
            // a unique filter ID for different definitions.
            if (!gradientId) {
                gradientId = type + this.svg.id + hashCode(JSON.stringify(gradient));
            }
            // If the gradient already exists in the document,
            // we're done and we can just use it (reference it using `url()`).
            // If not, create one.
            if (!this.isDefined(gradientId)) {

                var stopTemplate = template('<stop offset="${offset}" stop-color="${color}" stop-opacity="${opacity}"/>');
                var gradientStopsStrings = toArray(stops).map(function(stop) {
                    return stopTemplate({
                        offset: stop.offset,
                        color: stop.color,
                        opacity: Number.isFinite(stop.opacity) ? stop.opacity : 1
                    });
                });

                var gradientSVGString = [
                    '<' + type + '>',
                    gradientStopsStrings.join(''),
                    '</' + type + '>'
                ].join('');

                var gradientAttrs = assign({ id: gradientId }, gradient.attrs);

                V(gradientSVGString, gradientAttrs).appendTo(this.defs);
            }

            return gradientId;
        },

        defineMarker: function(marker) {

            if (!isObject(marker)) {
                throw new TypeError('dia.Paper: defineMarker() requires 1. argument to be an object.');
            }

            var markerId = marker.id;

            // Generate a hash code from the stringified filter definition. This gives us
            // a unique filter ID for different definitions.
            if (!markerId) {
                markerId = this.svg.id + hashCode(JSON.stringify(marker));
            }

            if (!this.isDefined(markerId)) {

                var attrs = omit(marker, 'type', 'userSpaceOnUse');
                var pathMarker = V('marker', {
                    id: markerId,
                    orient: 'auto',
                    overflow: 'visible',
                    markerUnits: marker.markerUnits || 'userSpaceOnUse'
                }, [
                    V(marker.type || 'path', attrs)
                ]);

                pathMarker.appendTo(this.defs);
            }

            return markerId;
        }

    }, {

        sorting: sortingTypes,

        backgroundPatterns: {

            flipXy: function(img) {
                // d b
                // q p

                var canvas = document.createElement('canvas');
                var imgWidth = img.width;
                var imgHeight = img.height;

                canvas.width = 2 * imgWidth;
                canvas.height = 2 * imgHeight;

                var ctx = canvas.getContext('2d');
                // top-left image
                ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
                // xy-flipped bottom-right image
                ctx.setTransform(-1, 0, 0, -1, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
                // x-flipped top-right image
                ctx.setTransform(-1, 0, 0, 1, canvas.width, 0);
                ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
                // y-flipped bottom-left image
                ctx.setTransform(1, 0, 0, -1, 0, canvas.height);
                ctx.drawImage(img, 0, 0, imgWidth, imgHeight);

                return canvas;
            },

            flipX: function(img) {
                // d b
                // d b

                var canvas = document.createElement('canvas');
                var imgWidth = img.width;
                var imgHeight = img.height;

                canvas.width = imgWidth * 2;
                canvas.height = imgHeight;

                var ctx = canvas.getContext('2d');
                // left image
                ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
                // flipped right image
                ctx.translate(2 * imgWidth, 0);
                ctx.scale(-1, 1);
                ctx.drawImage(img, 0, 0, imgWidth, imgHeight);

                return canvas;
            },

            flipY: function(img) {
                // d d
                // q q

                var canvas = document.createElement('canvas');
                var imgWidth = img.width;
                var imgHeight = img.height;

                canvas.width = imgWidth;
                canvas.height = imgHeight * 2;

                var ctx = canvas.getContext('2d');
                // top image
                ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
                // flipped bottom image
                ctx.translate(0, 2 * imgHeight);
                ctx.scale(1, -1);
                ctx.drawImage(img, 0, 0, imgWidth, imgHeight);

                return canvas;
            },

            watermark: function(img, opt) {
                //   d
                // d

                opt = opt || {};

                var imgWidth = img.width;
                var imgHeight = img.height;

                var canvas = document.createElement('canvas');
                canvas.width = imgWidth * 3;
                canvas.height = imgHeight * 3;

                var ctx = canvas.getContext('2d');
                var angle = isNumber(opt.watermarkAngle) ? -opt.watermarkAngle : -20;
                var radians = toRad(angle);
                var stepX = canvas.width / 4;
                var stepY = canvas.height / 4;

                for (var i = 0; i < 4; i++) {
                    for (var j = 0; j < 4; j++) {
                        if ((i + j) % 2 > 0) {
                            // reset the current transformations
                            ctx.setTransform(1, 0, 0, 1, (2 * i - 1) * stepX, (2 * j - 1) * stepY);
                            ctx.rotate(radians);
                            ctx.drawImage(img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
                        }
                    }
                }

                return canvas;
            }
        },

        gridPatterns: {
            dot: [{
                color: '#AAAAAA',
                thickness: 1,
                markup: 'rect',
                update: function(el, opt) {
                    V(el).attr({
                        width: opt.thickness * opt.sx,
                        height: opt.thickness * opt.sy,
                        fill: opt.color
                    });
                }
            }],
            fixedDot: [{
                color: '#AAAAAA',
                thickness: 1,
                markup: 'rect',
                update: function(el, opt) {
                    var size = opt.sx <= 1 ? opt.thickness * opt.sx : opt.thickness;
                    V(el).attr({ width: size, height: size, fill: opt.color });
                }
            }],
            mesh: [{
                color: '#AAAAAA',
                thickness: 1,
                markup: 'path',
                update: function(el, opt) {

                    var d;
                    var width = opt.width;
                    var height = opt.height;
                    var thickness = opt.thickness;

                    if (width - thickness >= 0 && height - thickness >= 0) {
                        d = ['M', width, 0, 'H0 M0 0 V0', height].join(' ');
                    } else {
                        d = 'M 0 0 0 0';
                    }

                    V(el).attr({ 'd': d, stroke: opt.color, 'stroke-width': opt.thickness });
                }
            }],
            doubleMesh: [{
                color: '#AAAAAA',
                thickness: 1,
                markup: 'path',
                update: function(el, opt) {

                    var d;
                    var width = opt.width;
                    var height = opt.height;
                    var thickness = opt.thickness;

                    if (width - thickness >= 0 && height - thickness >= 0) {
                        d = ['M', width, 0, 'H0 M0 0 V0', height].join(' ');
                    } else {
                        d = 'M 0 0 0 0';
                    }

                    V(el).attr({ 'd': d, stroke: opt.color, 'stroke-width': opt.thickness });
                }
            }, {
                color: '#000000',
                thickness: 3,
                scaleFactor: 4,
                markup: 'path',
                update: function(el, opt) {

                    var d;
                    var width = opt.width;
                    var height = opt.height;
                    var thickness = opt.thickness;

                    if (width - thickness >= 0 && height - thickness >= 0) {
                        d = ['M', width, 0, 'H0 M0 0 V0', height].join(' ');
                    } else {
                        d = 'M 0 0 0 0';
                    }

                    V(el).attr({ 'd': d, stroke: opt.color, 'stroke-width': opt.thickness });
                }
            }]
        }
    });

    var ToolView = View.extend({
        name: null,
        tagName: 'g',
        className: 'tool',
        svgElement: true,
        _visible: true,

        init: function() {
            var name = this.name;
            if (name) { this.vel.attr('data-tool-name', name); }
        },

        configure: function(view, toolsView) {
            this.relatedView = view;
            this.paper = view.paper;
            this.parentView = toolsView;
            this.simulateRelatedView(this.el);
            return this;
        },

        simulateRelatedView: function(el) {
            if (el) { el.setAttribute('model-id', this.relatedView.model.id); }
        },

        getName: function() {
            return this.name;
        },

        show: function() {
            this.el.style.display = '';
            this._visible = true;
        },

        hide: function() {
            this.el.style.display = 'none';
            this._visible = false;
        },

        isVisible: function() {
            return !!this._visible;
        },

        focus: function() {
            var opacity = this.options.focusOpacity;
            if (isFinite(opacity)) { this.el.style.opacity = opacity; }
            this.parentView.focusTool(this);
        },

        blur: function() {
            this.el.style.opacity = '';
            this.parentView.blurTool(this);
        },

        update: function() {
            // to be overridden
        }
    });

    var ToolsView = View.extend({
        tagName: 'g',
        className: 'tools',
        svgElement: true,
        tools: null,
        options: {
            tools: null,
            relatedView: null,
            name: null,
            component: false
        },

        configure: function(options) {
            options = assign(this.options, options);
            var tools = options.tools;
            if (!Array.isArray(tools)) { return this; }
            var relatedView = options.relatedView;
            if (!(relatedView instanceof CellView)) { return this; }
            var views$$1 = this.tools = [];
            for (var i = 0, n = tools.length; i < n; i++) {
                var tool = tools[i];
                if (!(tool instanceof ToolView)) { continue; }
                tool.configure(relatedView, this);
                tool.render();
                this.vel.append(tool.el);
                views$$1.push(tool);
            }
            return this;
        },

        getName: function() {
            return this.options.name;
        },

        update: function(opt) {

            opt || (opt = {});
            var tools = this.tools;
            if (!tools) { return; }
            for (var i = 0, n = tools.length; i < n; i++) {
                var tool = tools[i];
                if (opt.tool !== tool.cid && tool.isVisible()) {
                    tool.update();
                }
            }
            return this;
        },

        focusTool: function(focusedTool) {

            var tools = this.tools;
            if (!tools) { return this; }
            for (var i = 0, n = tools.length; i < n; i++) {
                var tool = tools[i];
                if (focusedTool === tool) {
                    tool.show();
                } else {
                    tool.hide();
                }
            }
            return this;
        },

        blurTool: function(blurredTool) {
            var tools = this.tools;
            if (!tools) { return this; }
            for (var i = 0, n = tools.length; i < n; i++) {
                var tool = tools[i];
                if (tool !== blurredTool && !tool.isVisible()) {
                    tool.show();
                    tool.update();
                }
            }
            return this;
        },

        hide: function() {
            return this.focusTool(null);
        },

        show: function() {
            return this.blurTool(null);
        },

        onRemove: function() {

            var tools = this.tools;
            if (!tools) { return this; }
            for (var i = 0, n = tools.length; i < n; i++) {
                tools[i].remove();
            }
            this.tools = null;
        },

        mount: function() {
            var options = this.options;
            var relatedView = options.relatedView;
            if (relatedView) {
                var container = (options.component) ? relatedView.el : relatedView.paper.tools;
                container.appendChild(this.el);
            }
            return this;
        }

    });



    var index$3 = ({
        Graph: Graph,
        attributes: attributes,
        Cell: Cell,
        CellView: CellView,
        Element: Element$1,
        ElementView: ElementView,
        Link: Link,
        LinkView: LinkView,
        Paper: Paper,
        ToolView: ToolView,
        ToolsView: ToolsView
    });

    function getAnchor(coords, view, magnet) {
        // take advantage of an existing logic inside of the
        // pin relative connection strategy
        var end = pinRelative.call(
            this.paper,
            {},
            view,
            magnet,
            coords,
            this.model
        );
        return end.anchor;
    }

    function snapAnchor(coords, view, magnet, type, relatedView, toolView) {
        var snapRadius = toolView.options.snapRadius;
        var isSource = (type === 'source');
        var refIndex = (isSource ? 0 : -1);
        var ref = this.model.vertex(refIndex) || this.getEndAnchor(isSource ? 'target' : 'source');
        if (ref) {
            if (Math.abs(ref.x - coords.x) < snapRadius) { coords.x = ref.x; }
            if (Math.abs(ref.y - coords.y) < snapRadius) { coords.y = ref.y; }
        }
        return coords;
    }

    // Vertex Handles
    var VertexHandle = View.extend({
        tagName: 'circle',
        svgElement: true,
        className: 'marker-vertex',
        events: {
            mousedown: 'onPointerDown',
            touchstart: 'onPointerDown',
            dblclick: 'onDoubleClick'
        },
        documentEvents: {
            mousemove: 'onPointerMove',
            touchmove: 'onPointerMove',
            mouseup: 'onPointerUp',
            touchend: 'onPointerUp',
            touchcancel: 'onPointerUp'
        },
        attributes: {
            'r': 6,
            'fill': '#33334F',
            'stroke': '#FFFFFF',
            'stroke-width': 2,
            'cursor': 'move'
        },
        position: function(x, y) {
            this.vel.attr({ cx: x, cy: y });
        },
        onPointerDown: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            this.options.paper.undelegateEvents();
            this.delegateDocumentEvents(null, evt.data);
            this.trigger('will-change', this, evt);
        },
        onPointerMove: function(evt) {
            this.trigger('changing', this, evt);
        },
        onDoubleClick: function(evt) {
            this.trigger('remove', this, evt);
        },
        onPointerUp: function(evt) {
            this.trigger('changed', this, evt);
            this.undelegateDocumentEvents();
            this.options.paper.delegateEvents();
        }
    });

    var Vertices = ToolView.extend({
        name: 'vertices',
        options: {
            handleClass: VertexHandle,
            snapRadius: 20,
            redundancyRemoval: true,
            vertexAdding: true,
            stopPropagation: true
        },
        children: [{
            tagName: 'path',
            selector: 'connection',
            className: 'joint-vertices-path',
            attributes: {
                'fill': 'none',
                'stroke': 'transparent',
                'stroke-width': 10,
                'cursor': 'cell'
            }
        }],
        handles: null,
        events: {
            'mousedown .joint-vertices-path': 'onPathPointerDown',
            'touchstart .joint-vertices-path': 'onPathPointerDown'
        },
        onRender: function() {
            if (this.options.vertexAdding) {
                this.renderChildren();
                this.updatePath();
            }
            this.resetHandles();
            this.renderHandles();
            return this;
        },
        update: function() {
            var relatedView = this.relatedView;
            var vertices = relatedView.model.vertices();
            if (vertices.length === this.handles.length) {
                this.updateHandles();
            } else {
                this.resetHandles();
                this.renderHandles();
            }
            if (this.options.vertexAdding) {
                this.updatePath();
            }
            return this;
        },
        resetHandles: function() {
            var handles = this.handles;
            this.handles = [];
            this.stopListening();
            if (!Array.isArray(handles)) { return; }
            for (var i = 0, n = handles.length; i < n; i++) {
                handles[i].remove();
            }
        },
        renderHandles: function() {
            var relatedView = this.relatedView;
            var vertices = relatedView.model.vertices();
            for (var i = 0, n = vertices.length; i < n; i++) {
                var vertex = vertices[i];
                var handle = new (this.options.handleClass)({ index: i, paper: this.paper });
                handle.render();
                handle.position(vertex.x, vertex.y);
                this.simulateRelatedView(handle.el);
                handle.vel.appendTo(this.el);
                this.handles.push(handle);
                this.startHandleListening(handle);
            }
        },
        updateHandles: function() {
            var relatedView = this.relatedView;
            var vertices = relatedView.model.vertices();
            for (var i = 0, n = vertices.length; i < n; i++) {
                var vertex = vertices[i];
                var handle = this.handles[i];
                if (!handle) { return; }
                handle.position(vertex.x, vertex.y);
            }
        },
        updatePath: function() {
            var connection = this.childNodes.connection;
            if (connection) { connection.setAttribute('d', this.relatedView.getSerializedConnection()); }
        },
        startHandleListening: function(handle) {
            var relatedView = this.relatedView;
            if (relatedView.can('vertexMove')) {
                this.listenTo(handle, 'will-change', this.onHandleWillChange);
                this.listenTo(handle, 'changing', this.onHandleChanging);
                this.listenTo(handle, 'changed', this.onHandleChanged);
            }
            if (relatedView.can('vertexRemove')) {
                this.listenTo(handle, 'remove', this.onHandleRemove);
            }
        },
        getNeighborPoints: function(index) {
            var linkView = this.relatedView;
            var vertices = linkView.model.vertices();
            var prev = (index > 0) ? vertices[index - 1] : linkView.sourceAnchor;
            var next = (index < vertices.length - 1) ? vertices[index + 1] : linkView.targetAnchor;
            return {
                prev: new Point(prev),
                next: new Point(next)
            };
        },
        onHandleWillChange: function(_handle, evt) {
            this.focus();
            var ref = this;
            var relatedView = ref.relatedView;
            var options = ref.options;
            relatedView.model.startBatch('vertex-move', { ui: true, tool: this.cid });
            if (!options.stopPropagation) { relatedView.notifyPointerdown.apply(relatedView, relatedView.paper.getPointerArgs(evt)); }
        },
        onHandleChanging: function(handle, evt) {
            var ref = this;
            var options = ref.options;
            var linkView = ref.relatedView;
            var index = handle.options.index;
            var ref$1 = linkView.paper.getPointerArgs(evt);
            var normalizedEvent = ref$1[0];
            var x = ref$1[1];
            var y = ref$1[2];
            var vertex = { x: x, y: y };
            this.snapVertex(vertex, index);
            linkView.model.vertex(index, vertex, { ui: true, tool: this.cid });
            handle.position(vertex.x, vertex.y);
            if (!options.stopPropagation) { linkView.notifyPointermove(normalizedEvent, x, y); }
        },
        onHandleChanged: function(_handle, evt) {
            var ref = this;
            var options = ref.options;
            var linkView = ref.relatedView;
            if (options.vertexAdding) { this.updatePath(); }
            if (!options.redundancyRemoval) { return; }
            var verticesRemoved = linkView.removeRedundantLinearVertices({ ui: true, tool: this.cid });
            if (verticesRemoved) { this.render(); }
            this.blur();
            linkView.model.stopBatch('vertex-move', { ui: true, tool: this.cid });
            if (this.eventData(evt).vertexAdded) {
                linkView.model.stopBatch('vertex-add', { ui: true, tool: this.cid });
            }
            var ref$1 = linkView.paper.getPointerArgs(evt);
            var normalizedEvt = ref$1[0];
            var x = ref$1[1];
            var y = ref$1[2];
            if (!options.stopPropagation) { linkView.notifyPointerup(normalizedEvt, x, y); }
            linkView.checkMouseleave(normalizedEvt);
        },
        snapVertex: function(vertex, index) {
            var snapRadius = this.options.snapRadius;
            if (snapRadius > 0) {
                var neighbors = this.getNeighborPoints(index);
                var prev = neighbors.prev;
                var next = neighbors.next;
                if (Math.abs(vertex.x - prev.x) < snapRadius) {
                    vertex.x = prev.x;
                } else if (Math.abs(vertex.x - next.x) < snapRadius) {
                    vertex.x = next.x;
                }
                if (Math.abs(vertex.y - prev.y) < snapRadius) {
                    vertex.y = neighbors.prev.y;
                } else if (Math.abs(vertex.y - next.y) < snapRadius) {
                    vertex.y = next.y;
                }
            }
        },
        onHandleRemove: function(handle, evt) {
            var index = handle.options.index;
            var linkView = this.relatedView;
            linkView.model.removeVertex(index, { ui: true });
            if (this.options.vertexAdding) { this.updatePath(); }
            linkView.checkMouseleave(normalizeEvent(evt));
        },
        onPathPointerDown: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            var normalizedEvent = normalizeEvent(evt);
            var vertex = this.paper.snapToGrid(normalizedEvent.clientX, normalizedEvent.clientY).toJSON();
            var relatedView = this.relatedView;
            relatedView.model.startBatch('vertex-add', { ui: true, tool: this.cid });
            var index = relatedView.getVertexIndex(vertex.x, vertex.y);
            this.snapVertex(vertex, index);
            relatedView.model.insertVertex(index, vertex, { ui: true, tool: this.cid });
            this.render();
            var handle = this.handles[index];
            this.eventData(normalizedEvent, { vertexAdded: true });
            handle.onPointerDown(normalizedEvent);
        },
        onRemove: function() {
            this.resetHandles();
        }
    }, {
        VertexHandle: VertexHandle // keep as class property
    });

    var SegmentHandle = View.extend({
        tagName: 'g',
        svgElement: true,
        className: 'marker-segment',
        events: {
            mousedown: 'onPointerDown',
            touchstart: 'onPointerDown'
        },
        documentEvents: {
            mousemove: 'onPointerMove',
            touchmove: 'onPointerMove',
            mouseup: 'onPointerUp',
            touchend: 'onPointerUp',
            touchcancel: 'onPointerUp'
        },
        children: [{
            tagName: 'line',
            selector: 'line',
            attributes: {
                'stroke': '#33334F',
                'stroke-width': 2,
                'fill': 'none',
                'pointer-events': 'none'
            }
        }, {
            tagName: 'rect',
            selector: 'handle',
            attributes: {
                'width': 20,
                'height': 8,
                'x': -10,
                'y': -4,
                'rx': 4,
                'ry': 4,
                'fill': '#33334F',
                'stroke': '#FFFFFF',
                'stroke-width': 2
            }
        }],
        onRender: function() {
            this.renderChildren();
        },
        position: function(x, y, angle, view) {

            var matrix = V.createSVGMatrix().translate(x, y).rotate(angle);
            var handle = this.childNodes.handle;
            handle.setAttribute('transform', V.matrixToTransformString(matrix));
            handle.setAttribute('cursor', (angle % 180 === 0) ? 'row-resize' : 'col-resize');

            var viewPoint = view.getClosestPoint(new Point(x, y));
            var line$$1 = this.childNodes.line;
            line$$1.setAttribute('x1', x);
            line$$1.setAttribute('y1', y);
            line$$1.setAttribute('x2', viewPoint.x);
            line$$1.setAttribute('y2', viewPoint.y);
        },
        onPointerDown: function(evt) {
            this.trigger('change:start', this, evt);
            evt.stopPropagation();
            evt.preventDefault();
            this.options.paper.undelegateEvents();
            this.delegateDocumentEvents(null, evt.data);
        },
        onPointerMove: function(evt) {
            this.trigger('changing', this, evt);
        },
        onPointerUp: function(evt) {
            this.undelegateDocumentEvents();
            this.options.paper.delegateEvents();
            this.trigger('change:end', this, evt);
        },
        show: function() {
            this.el.style.display = '';
        },
        hide: function() {
            this.el.style.display = 'none';
        }
    });

    var Segments = ToolView.extend({
        name: 'segments',
        precision: .5,
        options: {
            handleClass: SegmentHandle,
            segmentLengthThreshold: 40,
            redundancyRemoval: true,
            anchor: getAnchor,
            snapRadius: 10,
            snapHandle: true
        },
        handles: null,
        onRender: function() {
            this.resetHandles();
            var relatedView = this.relatedView;
            var vertices = relatedView.model.vertices();
            vertices.unshift(relatedView.sourcePoint);
            vertices.push(relatedView.targetPoint);
            for (var i = 0, n = vertices.length; i < n - 1; i++) {
                var vertex = vertices[i];
                var nextVertex = vertices[i + 1];
                var handle = this.renderHandle(vertex, nextVertex);
                this.simulateRelatedView(handle.el);
                this.handles.push(handle);
                handle.options.index = i;
            }
            return this;
        },
        renderHandle: function(vertex, nextVertex) {
            var handle = new (this.options.handleClass)({ paper: this.paper });
            handle.render();
            this.updateHandle(handle, vertex, nextVertex);
            handle.vel.appendTo(this.el);
            this.startHandleListening(handle);
            return handle;
        },
        update: function() {
            this.render();
            return this;
        },
        startHandleListening: function(handle) {
            this.listenTo(handle, 'change:start', this.onHandleChangeStart);
            this.listenTo(handle, 'changing', this.onHandleChanging);
            this.listenTo(handle, 'change:end', this.onHandleChangeEnd);
        },
        resetHandles: function() {
            var handles = this.handles;
            this.handles = [];
            this.stopListening();
            if (!Array.isArray(handles)) { return; }
            for (var i = 0, n = handles.length; i < n; i++) {
                handles[i].remove();
            }
        },
        shiftHandleIndexes: function(value) {
            var handles = this.handles;
            for (var i = 0, n = handles.length; i < n; i++) { handles[i].options.index += value; }
        },
        resetAnchor: function(type, anchor) {
            var relatedModel = this.relatedView.model;
            if (anchor) {
                relatedModel.prop([type, 'anchor'], anchor, {
                    rewrite: true,
                    ui: true,
                    tool: this.cid
                });
            } else {
                relatedModel.removeProp([type, 'anchor'], {
                    ui: true,
                    tool: this.cid
                });
            }
        },
        snapHandle: function(handle, position, data) {

            var index = handle.options.index;
            var linkView = this.relatedView;
            var link = linkView.model;
            var vertices = link.vertices();
            var axis = handle.options.axis;
            var prev = vertices[index - 2] || data.sourceAnchor;
            var next = vertices[index + 1] || data.targetAnchor;
            var snapRadius = this.options.snapRadius;
            if (Math.abs(position[axis] - prev[axis]) < snapRadius) {
                position[axis] = prev[axis];
            } else if (Math.abs(position[axis] - next[axis]) < snapRadius) {
                position[axis] = next[axis];
            }
            return position;
        },

        onHandleChanging: function(handle, evt) {

            var data = this.eventData(evt);
            var relatedView = this.relatedView;
            var paper = relatedView.paper;
            var index = handle.options.index - 1;
            var normalizedEvent = normalizeEvent(evt);
            var coords = paper.snapToGrid(normalizedEvent.clientX, normalizedEvent.clientY);
            var position = this.snapHandle(handle, coords.clone(), data);
            var axis = handle.options.axis;
            var offset = (this.options.snapHandle) ? 0 : (coords[axis] - position[axis]);
            var link = relatedView.model;
            var vertices = cloneDeep(link.vertices());
            var vertex = vertices[index];
            var nextVertex = vertices[index + 1];
            var anchorFn = this.options.anchor;
            if (typeof anchorFn !== 'function') { anchorFn = null; }

            // First Segment
            var sourceView = relatedView.sourceView;
            var sourceBBox = relatedView.sourceBBox;
            var changeSourceAnchor = false;
            var deleteSourceAnchor = false;
            if (!vertex) {
                vertex = relatedView.sourceAnchor.toJSON();
                vertex[axis] = position[axis];
                if (sourceBBox.containsPoint(vertex)) {
                    vertex[axis] = position[axis];
                    changeSourceAnchor = true;
                } else {
                    // we left the area of the source magnet for the first time
                    vertices.unshift(vertex);
                    this.shiftHandleIndexes(1);
                    deleteSourceAnchor = true;
                }
            } else if (index === 0) {
                if (sourceBBox.containsPoint(vertex)) {
                    vertices.shift();
                    this.shiftHandleIndexes(-1);
                    changeSourceAnchor = true;
                } else {
                    vertex[axis] = position[axis];
                    deleteSourceAnchor = true;
                }
            } else {
                vertex[axis] = position[axis];
            }

            if (anchorFn && sourceView) {
                if (changeSourceAnchor) {
                    var sourceAnchorPosition = data.sourceAnchor.clone();
                    sourceAnchorPosition[axis] = position[axis];
                    var sourceAnchor = anchorFn.call(relatedView, sourceAnchorPosition, sourceView, relatedView.sourceMagnet || sourceView.el, 'source', relatedView);
                    this.resetAnchor('source', sourceAnchor);
                }
                if (deleteSourceAnchor) {
                    this.resetAnchor('source', data.sourceAnchorDef);
                }
            }

            // Last segment
            var targetView = relatedView.targetView;
            var targetBBox = relatedView.targetBBox;
            var changeTargetAnchor = false;
            var deleteTargetAnchor = false;
            if (!nextVertex) {
                nextVertex = relatedView.targetAnchor.toJSON();
                nextVertex[axis] = position[axis];
                if (targetBBox.containsPoint(nextVertex)) {
                    changeTargetAnchor = true;
                } else {
                    // we left the area of the target magnet for the first time
                    vertices.push(nextVertex);
                    deleteTargetAnchor = true;
                }
            } else if (index === vertices.length - 2) {
                if (targetBBox.containsPoint(nextVertex)) {
                    vertices.pop();
                    changeTargetAnchor = true;
                } else {
                    nextVertex[axis] = position[axis];
                    deleteTargetAnchor = true;
                }
            } else {
                nextVertex[axis] = position[axis];
            }

            if (anchorFn && targetView) {
                if (changeTargetAnchor) {
                    var targetAnchorPosition = data.targetAnchor.clone();
                    targetAnchorPosition[axis] = position[axis];
                    var targetAnchor = anchorFn.call(relatedView, targetAnchorPosition, targetView, relatedView.targetMagnet || targetView.el, 'target', relatedView);
                    this.resetAnchor('target', targetAnchor);
                }
                if (deleteTargetAnchor) {
                    this.resetAnchor('target', data.targetAnchorDef);
                }
            }

            link.vertices(vertices, { ui: true, tool: this.cid });
            this.updateHandle(handle, vertex, nextVertex, offset);
        },
        onHandleChangeStart: function(handle, evt) {
            var index = handle.options.index;
            var handles = this.handles;
            if (!Array.isArray(handles)) { return; }
            for (var i = 0, n = handles.length; i < n; i++) {
                if (i !== index) { handles[i].hide(); }
            }
            this.focus();
            var relatedView = this.relatedView;
            var relatedModel = relatedView.model;
            this.eventData(evt, {
                sourceAnchor: relatedView.sourceAnchor.clone(),
                targetAnchor: relatedView.targetAnchor.clone(),
                sourceAnchorDef: clone(relatedModel.prop(['source', 'anchor'])),
                targetAnchorDef: clone(relatedModel.prop(['target', 'anchor']))
            });
            relatedView.model.startBatch('segment-move', { ui: true, tool: this.cid });
        },
        onHandleChangeEnd: function(_handle, evt) {
            var linkView = this.relatedView;
            if (this.options.redundancyRemoval) {
                linkView.removeRedundantLinearVertices({ ui: true, tool: this.cid });
            }
            this.render();
            this.blur();
            linkView.model.stopBatch('segment-move', { ui: true, tool: this.cid });
            linkView.checkMouseleave(normalizeEvent(evt));
        },
        updateHandle: function(handle, vertex, nextVertex, offset) {
            var vertical = Math.abs(vertex.x - nextVertex.x) < this.precision;
            var horizontal = Math.abs(vertex.y - nextVertex.y) < this.precision;
            if (vertical || horizontal) {
                var segmentLine = new Line(vertex, nextVertex);
                var length = segmentLine.length();
                if (length < this.options.segmentLengthThreshold) {
                    handle.hide();
                } else {
                    var position = segmentLine.midpoint();
                    var axis = (vertical) ? 'x' : 'y';
                    position[axis] += offset || 0;
                    var angle = segmentLine.vector().vectorAngle(new Point(1, 0));
                    handle.position(position.x, position.y, angle, this.relatedView);
                    handle.show();
                    handle.options.axis = axis;
                }
            } else {
                handle.hide();
            }
        },
        onRemove: function() {
            this.resetHandles();
        }
    }, {
        SegmentHandle: SegmentHandle // keep as class property
    });

    // End Markers
    var Arrowhead = ToolView.extend({
        tagName: 'path',
        xAxisVector: new Point(1, 0),
        events: {
            mousedown: 'onPointerDown',
            touchstart: 'onPointerDown'
        },
        documentEvents: {
            mousemove: 'onPointerMove',
            touchmove: 'onPointerMove',
            mouseup: 'onPointerUp',
            touchend: 'onPointerUp',
            touchcancel: 'onPointerUp'
        },
        onRender: function() {
            this.update();
        },
        update: function() {
            var ratio = this.ratio;
            var view = this.relatedView;
            var tangent = view.getTangentAtRatio(ratio);
            var position, angle;
            if (tangent) {
                position = tangent.start;
                angle = tangent.vector().vectorAngle(this.xAxisVector) || 0;
            } else {
                position = view.getPointAtRatio(ratio);
                angle = 0;
            }
            if (!position) { return this; }
            var matrix = V.createSVGMatrix().translate(position.x, position.y).rotate(angle);
            this.vel.transform(matrix, { absolute: true });
            return this;
        },
        onPointerDown: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            var relatedView = this.relatedView;
            relatedView.model.startBatch('arrowhead-move', { ui: true, tool: this.cid });
            if (relatedView.can('arrowheadMove')) {
                relatedView.startArrowheadMove(this.arrowheadType);
                this.delegateDocumentEvents();
                relatedView.paper.undelegateEvents();
            }
            this.focus();
            this.el.style.pointerEvents = 'none';
        },
        onPointerMove: function(evt) {
            var normalizedEvent = normalizeEvent(evt);
            var coords = this.paper.snapToGrid(normalizedEvent.clientX, normalizedEvent.clientY);
            this.relatedView.pointermove(normalizedEvent, coords.x, coords.y);
        },
        onPointerUp: function(evt) {
            this.undelegateDocumentEvents();
            var relatedView = this.relatedView;
            var paper = relatedView.paper;
            var normalizedEvent = normalizeEvent(evt);
            var coords = paper.snapToGrid(normalizedEvent.clientX, normalizedEvent.clientY);
            relatedView.pointerup(normalizedEvent, coords.x, coords.y);
            paper.delegateEvents();
            this.blur();
            this.el.style.pointerEvents = '';
            relatedView.model.stopBatch('arrowhead-move', { ui: true, tool: this.cid });
        }
    });

    var TargetArrowhead = Arrowhead.extend({
        name: 'target-arrowhead',
        ratio: 1,
        arrowheadType: 'target',
        attributes: {
            'd': 'M -10 -8 10 0 -10 8 Z',
            'fill': '#33334F',
            'stroke': '#FFFFFF',
            'stroke-width': 2,
            'cursor': 'move',
            'class': 'target-arrowhead'
        }
    });

    var SourceArrowhead = Arrowhead.extend({
        name: 'source-arrowhead',
        ratio: 0,
        arrowheadType: 'source',
        attributes: {
            'd': 'M 10 -8 -10 0 10 8 Z',
            'fill': '#33334F',
            'stroke': '#FFFFFF',
            'stroke-width': 2,
            'cursor': 'move',
            'class': 'source-arrowhead'
        }
    });

    var Button = ToolView.extend({
        name: 'button',
        events: {
            'mousedown': 'onPointerDown',
            'touchstart': 'onPointerDown'
        },
        options: {
            distance: 0,
            offset: 0,
            rotate: false
        },
        onRender: function() {
            this.renderChildren(this.options.markup);
            this.update();
        },
        update: function() {
            var tangent, position, angle;
            var distance = this.options.distance || 0;
            if (isPercentage(distance)) {
                tangent = this.relatedView.getTangentAtRatio(parseFloat(distance) / 100);
            } else {
                tangent = this.relatedView.getTangentAtLength(distance);
            }
            if (tangent) {
                position = tangent.start;
                angle = tangent.vector().vectorAngle(new Point(1, 0)) || 0;
            } else {
                position = this.relatedView.getConnection().start;
                angle = 0;
            }
            var matrix = V.createSVGMatrix()
                .translate(position.x, position.y)
                .rotate(angle)
                .translate(0, this.options.offset || 0);
            if (!this.options.rotate) { matrix = matrix.rotate(-angle); }
            this.vel.transform(matrix, { absolute: true });
            return this;
        },
        onPointerDown: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            var actionFn = this.options.action;
            if (typeof actionFn === 'function') {
                actionFn.call(this.relatedView, evt, this.relatedView, this);
            }
        }
    });


    var Remove = Button.extend({
        children: [{
            tagName: 'circle',
            selector: 'button',
            attributes: {
                'r': 7,
                'fill': '#FF1D00',
                'cursor': 'pointer'
            }
        }, {
            tagName: 'path',
            selector: 'icon',
            attributes: {
                'd': 'M -3 -3 3 3 M -3 3 3 -3',
                'fill': 'none',
                'stroke': '#FFFFFF',
                'stroke-width': 2,
                'pointer-events': 'none'
            }
        }],
        options: {
            distance: 60,
            offset: 0,
            action: function(evt, view, tool) {
                view.model.remove({ ui: true, tool: tool.cid });
            }
        }
    });

    var Boundary = ToolView.extend({
        name: 'boundary',
        tagName: 'rect',
        options: {
            padding: 10
        },
        attributes: {
            'fill': 'none',
            'stroke': '#33334F',
            'stroke-width': .5,
            'stroke-dasharray': '5, 5',
            'pointer-events': 'none'
        },
        onRender: function() {
            this.update();
        },
        update: function() {
            var padding = this.options.padding;
            if (!isFinite(padding)) { padding = 0; }
            var bbox = this.relatedView.getConnection().bbox().inflate(padding);
            this.vel.attr(bbox.toJSON());
            return this;
        }
    });

    var Anchor = ToolView.extend({
        tagName: 'g',
        type: null,
        children: [{
            tagName: 'circle',
            selector: 'anchor',
            attributes: {
                'cursor': 'pointer'
            }
        }, {
            tagName: 'rect',
            selector: 'area',
            attributes: {
                'pointer-events': 'none',
                'fill': 'none',
                'stroke': '#33334F',
                'stroke-dasharray': '2,4',
                'rx': 5,
                'ry': 5
            }
        }],
        events: {
            mousedown: 'onPointerDown',
            touchstart: 'onPointerDown',
            dblclick: 'onPointerDblClick'
        },
        documentEvents: {
            mousemove: 'onPointerMove',
            touchmove: 'onPointerMove',
            mouseup: 'onPointerUp',
            touchend: 'onPointerUp',
            touchcancel: 'onPointerUp'
        },
        options: {
            snap: snapAnchor,
            anchor: getAnchor,
            customAnchorAttributes: {
                'stroke-width': 4,
                'stroke': '#33334F',
                'fill': '#FFFFFF',
                'r': 5
            },
            defaultAnchorAttributes: {
                'stroke-width': 2,
                'stroke': '#FFFFFF',
                'fill': '#33334F',
                'r': 6
            },
            areaPadding: 6,
            snapRadius: 10,
            restrictArea: true,
            redundancyRemoval: true
        },
        onRender: function() {
            this.renderChildren();
            this.toggleArea(false);
            this.update();
        },
        update: function() {
            var type = this.type;
            var relatedView = this.relatedView;
            var view = relatedView.getEndView(type);
            if (view) {
                this.updateAnchor();
                this.updateArea();
                this.el.style.display = '';
            } else {
                this.el.style.display = 'none';
            }
            return this;
        },
        updateAnchor: function() {
            var childNodes = this.childNodes;
            if (!childNodes) { return; }
            var anchorNode = childNodes.anchor;
            if (!anchorNode) { return; }
            var relatedView = this.relatedView;
            var type = this.type;
            var position = relatedView.getEndAnchor(type);
            var options = this.options;
            var customAnchor = relatedView.model.prop([type, 'anchor']);
            anchorNode.setAttribute('transform', 'translate(' + position.x + ',' + position.y + ')');
            var anchorAttributes = (customAnchor) ? options.customAnchorAttributes : options.defaultAnchorAttributes;
            for (var attrName in anchorAttributes) {
                anchorNode.setAttribute(attrName, anchorAttributes[attrName]);
            }
        },
        updateArea: function() {
            var childNodes = this.childNodes;
            if (!childNodes) { return; }
            var areaNode = childNodes.area;
            if (!areaNode) { return; }
            var relatedView = this.relatedView;
            var type = this.type;
            var view = relatedView.getEndView(type);
            var model = view.model;
            var magnet = relatedView.getEndMagnet(type);
            var padding = this.options.areaPadding;
            if (!isFinite(padding)) { padding = 0; }
            var bbox, angle, center;
            if (view.isNodeConnection(magnet)) {
                bbox = view.getBBox();
                angle = 0;
                center = bbox.center();
            } else {
                bbox = view.getNodeUnrotatedBBox(magnet);
                angle = model.angle();
                center = bbox.center();
                if (angle) { center.rotate(model.getBBox().center(), -angle); }
                // TODO: get the link's magnet rotation into account
            }
            bbox.inflate(padding);
            areaNode.setAttribute('x', -bbox.width / 2);
            areaNode.setAttribute('y', -bbox.height / 2);
            areaNode.setAttribute('width', bbox.width);
            areaNode.setAttribute('height', bbox.height);
            areaNode.setAttribute('transform', 'translate(' + center.x + ',' + center.y + ') rotate(' + angle + ')');
        },
        toggleArea: function(visible) {
            this.childNodes.area.style.display = (visible) ? '' : 'none';
        },
        onPointerDown: function(evt) {
            evt.stopPropagation();
            evt.preventDefault();
            this.paper.undelegateEvents();
            this.delegateDocumentEvents();
            this.focus();
            this.toggleArea(this.options.restrictArea);
            this.relatedView.model.startBatch('anchor-move', { ui: true, tool: this.cid });
        },
        resetAnchor: function(anchor) {
            var type = this.type;
            var relatedModel = this.relatedView.model;
            if (anchor) {
                relatedModel.prop([type, 'anchor'], anchor, {
                    rewrite: true,
                    ui: true,
                    tool: this.cid
                });
            } else {
                relatedModel.removeProp([type, 'anchor'], {
                    ui: true,
                    tool: this.cid
                });
            }
        },
        onPointerMove: function(evt) {

            var relatedView = this.relatedView;
            var type = this.type;
            var view = relatedView.getEndView(type);
            var model = view.model;
            var magnet = relatedView.getEndMagnet(type);
            var normalizedEvent = normalizeEvent(evt);
            var coords = this.paper.clientToLocalPoint(normalizedEvent.clientX, normalizedEvent.clientY);
            var snapFn = this.options.snap;
            if (typeof snapFn === 'function') {
                coords = snapFn.call(relatedView, coords, view, magnet, type, relatedView, this);
                coords = new Point(coords);
            }

            if (this.options.restrictArea) {
                if (view.isNodeConnection(magnet)) {
                    // snap coords to the link's connection
                    var pointAtConnection = view.getClosestPoint(coords);
                    if (pointAtConnection) { coords = pointAtConnection; }
                } else {
                    // snap coords within node bbox
                    var bbox = view.getNodeUnrotatedBBox(magnet);
                    var angle = model.angle();
                    var origin = model.getBBox().center();
                    var rotatedCoords = coords.clone().rotate(origin, angle);
                    if (!bbox.containsPoint(rotatedCoords)) {
                        coords = bbox.pointNearestToPoint(rotatedCoords).rotate(origin, -angle);
                    }
                }
            }

            var anchor;
            var anchorFn = this.options.anchor;
            if (typeof anchorFn === 'function') {
                anchor = anchorFn.call(relatedView, coords, view, magnet, type, relatedView);
            }

            this.resetAnchor(anchor);
            this.update();
        },

        onPointerUp: function(evt) {
            this.paper.delegateEvents();
            this.undelegateDocumentEvents();
            this.blur();
            this.toggleArea(false);
            var linkView = this.relatedView;
            if (this.options.redundancyRemoval) { linkView.removeRedundantLinearVertices({ ui: true, tool: this.cid }); }
            linkView.model.stopBatch('anchor-move', { ui: true, tool: this.cid });
        },

        onPointerDblClick: function() {
            this.resetAnchor();
            this.update();
        }
    });

    var SourceAnchor = Anchor.extend({
        name: 'source-anchor',
        type: 'source'
    });

    var TargetAnchor = Anchor.extend({
        name: 'target-anchor',
        type: 'target'
    });

    var index$4 = ({
        Vertices: Vertices,
        Segments: Segments,
        SourceArrowhead: SourceArrowhead,
        TargetArrowhead: TargetArrowhead,
        SourceAnchor: SourceAnchor,
        TargetAnchor: TargetAnchor,
        Button: Button,
        Remove: Remove,
        Boundary: Boundary
    });

    var version = "3.0.4";

    var Vectorizer = V;
    var layout = { PortLabel: PortLabel, Port: Port };
    var setTheme = function(theme, opt) {

        opt = opt || {};

        invoke(views, 'setTheme', theme, opt);

        // Update the default theme on the view prototype.
        View.prototype.defaultTheme = theme;
    };

    var shapes = { basic: basic, standard: standard };
    var format$1 = {};
    var ui = {};

    exports.format = format$1;
    exports.ui = ui;
    exports.shapes = shapes;
    exports.Vectorizer = Vectorizer;
    exports.layout = layout;
    exports.config = config;
    exports.anchors = anchors;
    exports.linkAnchors = linkAnchors;
    exports.connectionPoints = connectionPoints;
    exports.connectionStrategies = index$2;
    exports.connectors = connectors;
    exports.dia = index$3;
    exports.highlighters = highlighters;
    exports.mvc = index$1;
    exports.routers = routers;
    exports.util = index;
    exports.linkTools = index$4;
    exports.V = V;
    exports.g = g;
    exports.setTheme = setTheme;
    exports.env = env;
    exports.version = version;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
if (typeof joint !== 'undefined') { var g = joint.g, V = joint.V, Vectorizer = joint.V; }

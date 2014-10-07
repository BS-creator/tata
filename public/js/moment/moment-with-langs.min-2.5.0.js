//! moment.js
//! version : 2.5.0
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com
(function ( a ) {
    function b ( a, b ) {
        return function ( c ) {
            return i( a.call( this, c ), b )
        }
    }

    function c ( a, b ) {
        return function ( c ) {
            return this.lang().ordinal( a.call( this, c ), b )
        }
    }

    function d () {
    }

    function e ( a ) {
        u( a ), g( this, a )
    }

    function f ( a ) {
        var b = o( a ), c = b.year || 0, d = b.month || 0, e = b.week || 0, f = b.day || 0, g = b.hour || 0, h = b.minute || 0, i = b.second || 0, j = b.millisecond || 0;
        this._milliseconds = +j + 1e3 * i + 6e4 * h + 36e5 * g, this._days = +f + 7 * e, this._months = +d + 12 * c, this._data = {}, this._bubble()
    }

    function g ( a, b ) {
        for (var c in b)b.hasOwnProperty( c ) && (a[c] = b[c]);
        return b.hasOwnProperty( "toString" ) && (a.toString = b.toString), b.hasOwnProperty( "valueOf" ) && (a.valueOf = b.valueOf), a
    }

    function h ( a ) {
        return 0 > a ? Math.ceil( a ) : Math.floor( a )
    }

    function i ( a, b, c ) {
        for (var d = Math.abs( a ) + "", e = a >= 0; d.length < b;)d = "0" + d;
        return(e ? c ? "+" : "" : "-") + d
    }

    function j ( a, b, c, d ) {
        var e, f, g = b._milliseconds, h = b._days, i = b._months;
        g && a._d.setTime( +a._d + g * c ), (h || i) && (e = a.minute(), f = a.hour()), h && a.date( a.date() + h * c ), i && a.month( a.month() + i * c ), g && !d && cb.updateOffset( a ), (h || i) && (a.minute( e ), a.hour( f ))
    }

    function k ( a ) {
        return"[object Array]" === Object.prototype.toString.call( a )
    }

    function l ( a ) {
        return"[object Date]" === Object.prototype.toString.call( a ) || a instanceof Date
    }

    function m ( a, b, c ) {
        var d, e = Math.min( a.length, b.length ), f = Math.abs( a.length - b.length ), g = 0;
        for (d = 0; e > d; d++)(c && a[d] !== b[d] || !c && q( a[d] ) !== q( b[d] )) && g++;
        return g + f
    }

    function n ( a ) {
        if (a) {
            var b = a.toLowerCase().replace( /(.)s$/, "$1" );
            a = Qb[a] || Rb[b] || b
        }
        return a
    }

    function o ( a ) {
        var b, c, d = {};
        for (c in a)a.hasOwnProperty( c ) && (b = n( c ), b && (d[b] = a[c]));
        return d
    }

    function p ( b ) {
        var c, d;
        if (0 === b.indexOf( "week" ))c = 7, d = "day"; else {
            if (0 !== b.indexOf( "month" ))return;
            c = 12, d = "month"
        }
        cb[b] = function ( e, f ) {
            var g, h, i = cb.fn._lang[b], j = [];
            if ("number" == typeof e && (f = e, e = a), h = function ( a ) {
                var b = cb().utc().set( d, a );
                return i.call( cb.fn._lang, b, e || "" )
            }, null != f)return h( f );
            for (g = 0; c > g; g++)j.push( h( g ) );
            return j
        }
    }

    function q ( a ) {
        var b = +a, c = 0;
        return 0 !== b && isFinite( b ) && (c = b >= 0 ? Math.floor( b ) : Math.ceil( b )), c
    }

    function r ( a, b ) {
        return new Date( Date.UTC( a, b + 1, 0 ) ).getUTCDate()
    }

    function s ( a ) {
        return t( a ) ? 366 : 365
    }

    function t ( a ) {
        return a % 4 === 0 && a % 100 !== 0 || a % 400 === 0
    }

    function u ( a ) {
        var b;
        a._a && -2 === a._pf.overflow && (b = a._a[ib] < 0 || a._a[ib] > 11 ? ib : a._a[jb] < 1 || a._a[jb] > r( a._a[hb], a._a[ib] ) ? jb : a._a[kb] < 0 || a._a[kb] > 23 ? kb : a._a[lb] < 0 || a._a[lb] > 59 ? lb : a._a[mb] < 0 || a._a[mb] > 59 ? mb : a._a[nb] < 0 || a._a[nb] > 999 ? nb : -1, a._pf._overflowDayOfYear && (hb > b || b > jb) && (b = jb), a._pf.overflow = b)
    }

    function v ( a ) {
        a._pf = {empty: !1, unusedTokens: [], unusedInput: [], overflow: -2, charsLeftOver: 0, nullInput: !1, invalidMonth: null, invalidFormat: !1, userInvalidated: !1, iso: !1}
    }

    function w ( a ) {
        return null == a._isValid && (a._isValid = !isNaN( a._d.getTime() ) && a._pf.overflow < 0 && !a._pf.empty && !a._pf.invalidMonth && !a._pf.nullInput && !a._pf.invalidFormat && !a._pf.userInvalidated, a._strict && (a._isValid = a._isValid && 0 === a._pf.charsLeftOver && 0 === a._pf.unusedTokens.length)), a._isValid
    }

    function x ( a ) {
        return a ? a.toLowerCase().replace( "_", "-" ) : a
    }

    function y ( a, b ) {
        return b._isUTC ? cb( a ).zone( b._offset || 0 ) : cb( a ).local()
    }

    function z ( a, b ) {
        return b.abbr = a, ob[a] || (ob[a] = new d), ob[a].set( b ), ob[a]
    }

    function A ( a ) {
        delete ob[a]
    }

    function B ( a ) {
        var b, c, d, e, f = 0, g = function ( a ) {
            if (!ob[a] && pb)try {
                require( "./lang/" + a )
            } catch (b) {
            }
            return ob[a]
        };
        if (!a)return cb.fn._lang;
        if (!k( a )) {
            if (c = g( a ))return c;
            a = [a]
        }
        for (; f < a.length;) {
            for (e = x( a[f] ).split( "-" ), b = e.length, d = x( a[f + 1] ), d = d ? d.split( "-" ) : null; b > 0;) {
                if (c = g( e.slice( 0, b ).join( "-" ) ))return c;
                if (d && d.length >= b && m( e, d, !0 ) >= b - 1)break;
                b--
            }
            f++
        }
        return cb.fn._lang
    }

    function C ( a ) {
        return a.match( /\[[\s\S]/ ) ? a.replace( /^\[|\]$/g, "" ) : a.replace( /\\/g, "" )
    }

    function D ( a ) {
        var b, c, d = a.match( tb );
        for (b = 0, c = d.length; c > b; b++)d[b] = Vb[d[b]] ? Vb[d[b]] : C( d[b] );
        return function ( e ) {
            var f = "";
            for (b = 0; c > b; b++)f += d[b]instanceof Function ? d[b].call( e, a ) : d[b];
            return f
        }
    }

    function E ( a, b ) {
        return a.isValid() ? (b = F( b, a.lang() ), Sb[b] || (Sb[b] = D( b )), Sb[b]( a )) : a.lang().invalidDate()
    }

    function F ( a, b ) {
        function c ( a ) {
            return b.longDateFormat( a ) || a
        }

        var d = 5;
        for (ub.lastIndex = 0; d >= 0 && ub.test( a );)a = a.replace( ub, c ), ub.lastIndex = 0, d -= 1;
        return a
    }

    function G ( a, b ) {
        var c, d = b._strict;
        switch (a) {
            case"DDDD":
                return Gb;
            case"YYYY":
            case"GGGG":
            case"gggg":
                return d ? Hb : xb;
            case"YYYYYY":
            case"YYYYY":
            case"GGGGG":
            case"ggggg":
                return d ? Ib : yb;
            case"S":
                if (d)return Eb;
            case"SS":
                if (d)return Fb;
            case"SSS":
            case"DDD":
                return d ? Gb : wb;
            case"MMM":
            case"MMMM":
            case"dd":
            case"ddd":
            case"dddd":
                return Ab;
            case"a":
            case"A":
                return B( b._l )._meridiemParse;
            case"X":
                return Db;
            case"Z":
            case"ZZ":
                return Bb;
            case"T":
                return Cb;
            case"SSSS":
                return zb;
            case"MM":
            case"DD":
            case"YY":
            case"GG":
            case"gg":
            case"HH":
            case"hh":
            case"mm":
            case"ss":
            case"ww":
            case"WW":
                return d ? Fb : vb;
            case"M":
            case"D":
            case"d":
            case"H":
            case"h":
            case"m":
            case"s":
            case"w":
            case"W":
            case"e":
            case"E":
                return d ? Eb : vb;
            default:
                return c = new RegExp( O( N( a.replace( "\\", "" ) ), "i" ) )
        }
    }

    function H ( a ) {
        a = a || "";
        var b = a.match( Bb ) || [], c = b[b.length - 1] || [], d = (c + "").match( Nb ) || ["-", 0, 0], e = +(60 * d[1]) + q( d[2] );
        return"+" === d[0] ? -e : e
    }

    function I ( a, b, c ) {
        var d, e = c._a;
        switch (a) {
            case"M":
            case"MM":
                null != b && (e[ib] = q( b ) - 1);
                break;
            case"MMM":
            case"MMMM":
                d = B( c._l ).monthsParse( b ), null != d ? e[ib] = d : c._pf.invalidMonth = b;
                break;
            case"D":
            case"DD":
                null != b && (e[jb] = q( b ));
                break;
            case"DDD":
            case"DDDD":
                null != b && (c._dayOfYear = q( b ));
                break;
            case"YY":
                e[hb] = q( b ) + (q( b ) > 68 ? 1900 : 2e3);
                break;
            case"YYYY":
            case"YYYYY":
            case"YYYYYY":
                e[hb] = q( b );
                break;
            case"a":
            case"A":
                c._isPm = B( c._l ).isPM( b );
                break;
            case"H":
            case"HH":
            case"h":
            case"hh":
                e[kb] = q( b );
                break;
            case"m":
            case"mm":
                e[lb] = q( b );
                break;
            case"s":
            case"ss":
                e[mb] = q( b );
                break;
            case"S":
            case"SS":
            case"SSS":
            case"SSSS":
                e[nb] = q( 1e3 * ("0." + b) );
                break;
            case"X":
                c._d = new Date( 1e3 * parseFloat( b ) );
                break;
            case"Z":
            case"ZZ":
                c._useUTC = !0, c._tzm = H( b );
                break;
            case"w":
            case"ww":
            case"W":
            case"WW":
            case"d":
            case"dd":
            case"ddd":
            case"dddd":
            case"e":
            case"E":
                a = a.substr( 0, 1 );
            case"gg":
            case"gggg":
            case"GG":
            case"GGGG":
            case"GGGGG":
                a = a.substr( 0, 2 ), b && (c._w = c._w || {}, c._w[a] = b)
        }
    }

    function J ( a ) {
        var b, c, d, e, f, g, h, i, j, k, l = [];
        if (!a._d) {
            for (d = L( a ), a._w && null == a._a[jb] && null == a._a[ib] && (f = function ( b ) {
                var c = parseInt( b, 10 );
                return b ? b.length < 3 ? c > 68 ? 1900 + c : 2e3 + c : c : null == a._a[hb] ? cb().weekYear() : a._a[hb]
            }, g = a._w, null != g.GG || null != g.W || null != g.E ? h = Y( f( g.GG ), g.W || 1, g.E, 4, 1 ) : (i = B( a._l ), j = null != g.d ? U( g.d, i ) : null != g.e ? parseInt( g.e, 10 ) + i._week.dow : 0, k = parseInt( g.w, 10 ) || 1, null != g.d && j < i._week.dow && k++, h = Y( f( g.gg ), k, j, i._week.doy, i._week.dow )), a._a[hb] = h.year, a._dayOfYear = h.dayOfYear), a._dayOfYear && (e = null == a._a[hb] ? d[hb] : a._a[hb], a._dayOfYear > s( e ) && (a._pf._overflowDayOfYear = !0), c = T( e, 0, a._dayOfYear ), a._a[ib] = c.getUTCMonth(), a._a[jb] = c.getUTCDate()), b = 0; 3 > b && null == a._a[b]; ++b)a._a[b] = l[b] = d[b];
            for (; 7 > b; b++)a._a[b] = l[b] = null == a._a[b] ? 2 === b ? 1 : 0 : a._a[b];
            l[kb] += q( (a._tzm || 0) / 60 ), l[lb] += q( (a._tzm || 0) % 60 ), a._d = (a._useUTC ? T : S).apply( null, l )
        }
    }

    function K ( a ) {
        var b;
        a._d || (b = o( a._i ), a._a = [b.year, b.month, b.day, b.hour, b.minute, b.second, b.millisecond], J( a ))
    }

    function L ( a ) {
        var b = new Date;
        return a._useUTC ? [b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate()] : [b.getFullYear(), b.getMonth(), b.getDate()]
    }

    function M ( a ) {
        a._a = [], a._pf.empty = !0;
        var b, c, d, e, f, g = B( a._l ), h = "" + a._i, i = h.length, j = 0;
        for (d = F( a._f, g ).match( tb ) || [], b = 0; b < d.length; b++)e = d[b], c = (h.match( G( e, a ) ) || [])[0], c && (f = h.substr( 0, h.indexOf( c ) ), f.length > 0 && a._pf.unusedInput.push( f ), h = h.slice( h.indexOf( c ) + c.length ), j += c.length), Vb[e] ? (c ? a._pf.empty = !1 : a._pf.unusedTokens.push( e ), I( e, c, a )) : a._strict && !c && a._pf.unusedTokens.push( e );
        a._pf.charsLeftOver = i - j, h.length > 0 && a._pf.unusedInput.push( h ), a._isPm && a._a[kb] < 12 && (a._a[kb] += 12), a._isPm === !1 && 12 === a._a[kb] && (a._a[kb] = 0), J( a ), u( a )
    }

    function N ( a ) {
        return a.replace( /\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function ( a, b, c, d, e ) {
            return b || c || d || e
        } )
    }

    function O ( a ) {
        return a.replace( /[-\/\\^$*+?.()|[\]{}]/g, "\\$&" )
    }

    function P ( a ) {
        var b, c, d, e, f;
        if (0 === a._f.length)return a._pf.invalidFormat = !0, a._d = new Date( 0 / 0 ), void 0;
        for (e = 0; e < a._f.length; e++)f = 0, b = g( {}, a ), v( b ), b._f = a._f[e], M( b ), w( b ) && (f += b._pf.charsLeftOver, f += 10 * b._pf.unusedTokens.length, b._pf.score = f, (null == d || d > f) && (d = f, c = b));
        g( a, c || b )
    }

    function Q ( a ) {
        var b, c = a._i, d = Jb.exec( c );
        if (d) {
            for (a._pf.iso = !0, b = 4; b > 0; b--)if (d[b]) {
                a._f = Lb[b - 1] + (d[6] || " ");
                break
            }
            for (b = 0; 4 > b; b++)if (Mb[b][1].exec( c )) {
                a._f += Mb[b][0];
                break
            }
            c.match( Bb ) && (a._f += "Z"), M( a )
        } else a._d = new Date( c )
    }

    function R ( b ) {
        var c = b._i, d = qb.exec( c );
        c === a ? b._d = new Date : d ? b._d = new Date( +d[1] ) : "string" == typeof c ? Q( b ) : k( c ) ? (b._a = c.slice( 0 ), J( b )) : l( c ) ? b._d = new Date( +c ) : "object" == typeof c ? K( b ) : b._d = new Date( c )
    }

    function S ( a, b, c, d, e, f, g ) {
        var h = new Date( a, b, c, d, e, f, g );
        return 1970 > a && h.setFullYear( a ), h
    }

    function T ( a ) {
        var b = new Date( Date.UTC.apply( null, arguments ) );
        return 1970 > a && b.setUTCFullYear( a ), b
    }

    function U ( a, b ) {
        if ("string" == typeof a)if (isNaN( a )) {
            if (a = b.weekdaysParse( a ), "number" != typeof a)return null
        } else a = parseInt( a, 10 );
        return a
    }

    function V ( a, b, c, d, e ) {
        return e.relativeTime( b || 1, !!c, a, d )
    }

    function W ( a, b, c ) {
        var d = gb( Math.abs( a ) / 1e3 ), e = gb( d / 60 ), f = gb( e / 60 ), g = gb( f / 24 ), h = gb( g / 365 ), i = 45 > d && ["s", d] || 1 === e && ["m"] || 45 > e && ["mm", e] || 1 === f && ["h"] || 22 > f && ["hh", f] || 1 === g && ["d"] || 25 >= g && ["dd", g] || 45 >= g && ["M"] || 345 > g && ["MM", gb( g / 30 )] || 1 === h && ["y"] || ["yy", h];
        return i[2] = b, i[3] = a > 0, i[4] = c, V.apply( {}, i )
    }

    function X ( a, b, c ) {
        var d, e = c - b, f = c - a.day();
        return f > e && (f -= 7), e - 7 > f && (f += 7), d = cb( a ).add( "d", f ), {week: Math.ceil( d.dayOfYear() / 7 ), year: d.year()}
    }

    function Y ( a, b, c, d, e ) {
        var f, g, h = new Date( i( a, 6, !0 ) + "-01-01" ).getUTCDay();
        return c = null != c ? c : e, f = e - h + (h > d ? 7 : 0), g = 7 * (b - 1) + (c - e) + f + 1, {year: g > 0 ? a : a - 1, dayOfYear: g > 0 ? g : s( a - 1 ) + g}
    }

    function Z ( a ) {
        var b = a._i, c = a._f;
        return"undefined" == typeof a._pf && v( a ), null === b ? cb.invalid( {nullInput: !0} ) : ("string" == typeof b && (a._i = b = B().preparse( b )), cb.isMoment( b ) ? (a = g( {}, b ), a._d = new Date( +b._d )) : c ? k( c ) ? P( a ) : M( a ) : R( a ), new e( a ))
    }

    function $ ( a, b ) {
        cb.fn[a] = cb.fn[a + "s"] = function ( a ) {
            var c = this._isUTC ? "UTC" : "";
            return null != a ? (this._d["set" + c + b]( a ), cb.updateOffset( this ), this) : this._d["get" + c + b]()
        }
    }

    function _ ( a ) {
        cb.duration.fn[a] = function () {
            return this._data[a]
        }
    }

    function ab ( a, b ) {
        cb.duration.fn["as" + a] = function () {
            return+this / b
        }
    }

    function bb ( a ) {
        var b = !1, c = cb;
        "undefined" == typeof ender && (a ? (fb.moment = function () {
            return!b && console && console.warn && (b = !0, console.warn( "Accessing Moment through the global scope is deprecated, and will be removed in an upcoming release." )), c.apply( null, arguments )
        }, g( fb.moment, c )) : fb.moment = cb)
    }

    for (var cb, db, eb = "2.5.0", fb = this, gb = Math.round, hb = 0, ib = 1, jb = 2, kb = 3, lb = 4, mb = 5, nb = 6, ob = {}, pb = "undefined" != typeof module && module.exports && "undefined" != typeof require, qb = /^\/?Date\((\-?\d+)/i, rb = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/, sb = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/, tb = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|X|zz?|ZZ?|.)/g, ub = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g, vb = /\d\d?/, wb = /\d{1,3}/, xb = /\d{1,4}/, yb = /[+\-]?\d{1,6}/, zb = /\d+/, Ab = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, Bb = /Z|[\+\-]\d\d:?\d\d/gi, Cb = /T/i, Db = /[\+\-]?\d+(\.\d{1,3})?/, Eb = /\d/, Fb = /\d\d/, Gb = /\d{3}/, Hb = /\d{4}/, Ib = /[+\-]?\d{6}/, Jb = /^\s*\d{4}-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/, Kb = "YYYY-MM-DDTHH:mm:ssZ", Lb = ["YYYY-MM-DD", "GGGG-[W]WW", "GGGG-[W]WW-E", "YYYY-DDD"], Mb = [
        ["HH:mm:ss.SSSS", /(T| )\d\d:\d\d:\d\d\.\d{1,3}/],
        ["HH:mm:ss", /(T| )\d\d:\d\d:\d\d/],
        ["HH:mm", /(T| )\d\d:\d\d/],
        ["HH", /(T| )\d\d/]
    ], Nb = /([\+\-]|\d\d)/gi, Ob = "Date|Hours|Minutes|Seconds|Milliseconds".split( "|" ), Pb = {Milliseconds: 1, Seconds: 1e3, Minutes: 6e4, Hours: 36e5, Days: 864e5, Months: 2592e6, Years: 31536e6}, Qb = {ms: "millisecond", s: "second", m: "minute", h: "hour", d: "day", D: "date", w: "week", W: "isoWeek", M: "month", y: "year", DDD: "dayOfYear", e: "weekday", E: "isoWeekday", gg: "weekYear", GG: "isoWeekYear"}, Rb = {dayofyear: "dayOfYear", isoweekday: "isoWeekday", isoweek: "isoWeek", weekyear: "weekYear", isoweekyear: "isoWeekYear"}, Sb = {}, Tb = "DDD w W M D d".split( " " ), Ub = "M D H h m s w W".split( " " ), Vb = {M: function () {
        return this.month() + 1
    }, MMM                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               : function ( a ) {
        return this.lang().monthsShort( this, a )
    }, MMMM                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              : function ( a ) {
        return this.lang().months( this, a )
    }, D                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 : function () {
        return this.date()
    }, DDD                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               : function () {
        return this.dayOfYear()
    }, d                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 : function () {
        return this.day()
    }, dd                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                : function ( a ) {
        return this.lang().weekdaysMin( this, a )
    }, ddd                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               : function ( a ) {
        return this.lang().weekdaysShort( this, a )
    }, dddd                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              : function ( a ) {
        return this.lang().weekdays( this, a )
    }, w                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 : function () {
        return this.week()
    }, W                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 : function () {
        return this.isoWeek()
    }, YY                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                : function () {
        return i( this.year() % 100, 2 )
    }, YYYY                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              : function () {
        return i( this.year(), 4 )
    }, YYYYY                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             : function () {
        return i( this.year(), 5 )
    }, YYYYYY                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            : function () {
        var a = this.year(), b = a >= 0 ? "+" : "-";
        return b + i( Math.abs( a ), 6 )
    }, gg                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                : function () {
        return i( this.weekYear() % 100, 2 )
    }, gggg                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              : function () {
        return this.weekYear()
    }, ggggg                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             : function () {
        return i( this.weekYear(), 5 )
    }, GG                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                : function () {
        return i( this.isoWeekYear() % 100, 2 )
    }, GGGG                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              : function () {
        return this.isoWeekYear()
    }, GGGGG                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             : function () {
        return i( this.isoWeekYear(), 5 )
    }, e                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 : function () {
        return this.weekday()
    }, E                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 : function () {
        return this.isoWeekday()
    }, a                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 : function () {
        return this.lang().meridiem( this.hours(), this.minutes(), !0 )
    }, A                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 : function () {
        return this.lang().meridiem( this.hours(), this.minutes(), !1 )
    }, H                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 : function () {
        return this.hours()
    }, h                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 : function () {
        return this.hours() % 12 || 12
    }, m                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 : function () {
        return this.minutes()
    }, s                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 : function () {
        return this.seconds()
    }, S                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 : function () {
        return q( this.milliseconds() / 100 )
    }, SS                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                : function () {
        return i( q( this.milliseconds() / 10 ), 2 )
    }, SSS                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               : function () {
        return i( this.milliseconds(), 3 )
    }, SSSS                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              : function () {
        return i( this.milliseconds(), 3 )
    }, Z                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 : function () {
        var a = -this.zone(), b = "+";
        return 0 > a && (a = -a, b = "-"), b + i( q( a / 60 ), 2 ) + ":" + i( q( a ) % 60, 2 )
    }, ZZ                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                : function () {
        var a = -this.zone(), b = "+";
        return 0 > a && (a = -a, b = "-"), b + i( q( a / 60 ), 2 ) + i( q( a ) % 60, 2 )
    }, z                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 : function () {
        return this.zoneAbbr()
    }, zz                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                : function () {
        return this.zoneName()
    }, X                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 : function () {
        return this.unix()
    }, Q                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 : function () {
        return this.quarter()
    }}, Wb = ["months", "monthsShort", "weekdays", "weekdaysShort", "weekdaysMin"]; Tb.length;)db = Tb.pop(), Vb[db + "o"] = c( Vb[db], db );
    for (; Ub.length;)db = Ub.pop(), Vb[db + db] = b( Vb[db], 2 );
    for (Vb.DDDD = b( Vb.DDD, 3 ), g( d.prototype, {set: function ( a ) {
        var b, c;
        for (c in a)b = a[c], "function" == typeof b ? this[c] = b : this["_" + c] = b
    }, _months                                         : "January_February_March_April_May_June_July_August_September_October_November_December".split( "_" ), months: function ( a ) {
        return this._months[a.month()]
    }, _monthsShort                                    : "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split( "_" ), monthsShort: function ( a ) {
        return this._monthsShort[a.month()]
    }, monthsParse                                     : function ( a ) {
        var b, c, d;
        for (this._monthsParse || (this._monthsParse = []), b = 0; 12 > b; b++)if (this._monthsParse[b] || (c = cb.utc( [2e3, b] ), d = "^" + this.months( c, "" ) + "|^" + this.monthsShort( c, "" ), this._monthsParse[b] = new RegExp( d.replace( ".", "" ), "i" )), this._monthsParse[b].test( a ))return b
    }, _weekdays                                       : "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split( "_" ), weekdays: function ( a ) {
        return this._weekdays[a.day()]
    }, _weekdaysShort                                  : "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split( "_" ), weekdaysShort: function ( a ) {
        return this._weekdaysShort[a.day()]
    }, _weekdaysMin                                    : "Su_Mo_Tu_We_Th_Fr_Sa".split( "_" ), weekdaysMin: function ( a ) {
        return this._weekdaysMin[a.day()]
    }, weekdaysParse                                   : function ( a ) {
        var b, c, d;
        for (this._weekdaysParse || (this._weekdaysParse = []), b = 0; 7 > b; b++)if (this._weekdaysParse[b] || (c = cb( [2e3, 1] ).day( b ), d = "^" + this.weekdays( c, "" ) + "|^" + this.weekdaysShort( c, "" ) + "|^" + this.weekdaysMin( c, "" ), this._weekdaysParse[b] = new RegExp( d.replace( ".", "" ), "i" )), this._weekdaysParse[b].test( a ))return b
    }, _longDateFormat                                 : {LT: "h:mm A", L: "MM/DD/YYYY", LL: "MMMM D YYYY", LLL: "MMMM D YYYY LT", LLLL: "dddd, MMMM D YYYY LT"}, longDateFormat: function ( a ) {
        var b = this._longDateFormat[a];
        return!b && this._longDateFormat[a.toUpperCase()] && (b = this._longDateFormat[a.toUpperCase()].replace( /MMMM|MM|DD|dddd/g, function ( a ) {
            return a.slice( 1 )
        } ), this._longDateFormat[a] = b), b
    }, isPM                                            : function ( a ) {
        return"p" === (a + "").toLowerCase().charAt( 0 )
    }, _meridiemParse                                  : /[ap]\.?m?\.?/i, meridiem: function ( a, b, c ) {
        return a > 11 ? c ? "pm" : "PM" : c ? "am" : "AM"
    }, _calendar                                       : {sameDay: "[Today at] LT", nextDay: "[Tomorrow at] LT", nextWeek: "dddd [at] LT", lastDay: "[Yesterday at] LT", lastWeek: "[Last] dddd [at] LT", sameElse: "L"}, calendar: function ( a, b ) {
        var c = this._calendar[a];
        return"function" == typeof c ? c.apply( b ) : c
    }, _relativeTime                                   : {future: "in %s", past: "%s ago", s: "a few seconds", m: "a minute", mm: "%d minutes", h: "an hour", hh: "%d hours", d: "a day", dd: "%d days", M: "a month", MM: "%d months", y: "a year", yy: "%d years"}, relativeTime: function ( a, b, c, d ) {
        var e = this._relativeTime[c];
        return"function" == typeof e ? e( a, b, c, d ) : e.replace( /%d/i, a )
    }, pastFuture                                      : function ( a, b ) {
        var c = this._relativeTime[a > 0 ? "future" : "past"];
        return"function" == typeof c ? c( b ) : c.replace( /%s/i, b )
    }, ordinal                                         : function ( a ) {
        return this._ordinal.replace( "%d", a )
    }, _ordinal                                        : "%d", preparse: function ( a ) {
        return a
    }, postformat                                      : function ( a ) {
        return a
    }, week                                            : function ( a ) {
        return X( a, this._week.dow, this._week.doy ).week
    }, _week                                           : {dow: 0, doy: 6}, _invalidDate: "Invalid date", invalidDate: function () {
        return this._invalidDate
    }} ), cb = function ( b, c, d, e ) {
        return"boolean" == typeof d && (e = d, d = a), Z( {_i: b, _f: c, _l: d, _strict: e, _isUTC: !1} )
    }, cb.utc = function ( b, c, d, e ) {
        var f;
        return"boolean" == typeof d && (e = d, d = a), f = Z( {_useUTC: !0, _isUTC: !0, _l: d, _i: b, _f: c, _strict: e} ).utc()
    }, cb.unix = function ( a ) {
        return cb( 1e3 * a )
    }, cb.duration = function ( a, b ) {
        var c, d, e, g = a, h = null;
        return cb.isDuration( a ) ? g = {ms: a._milliseconds, d: a._days, M: a._months} : "number" == typeof a ? (g = {}, b ? g[b] = a : g.milliseconds = a) : (h = rb.exec( a )) ? (c = "-" === h[1] ? -1 : 1, g = {y: 0, d: q( h[jb] ) * c, h: q( h[kb] ) * c, m: q( h[lb] ) * c, s: q( h[mb] ) * c, ms: q( h[nb] ) * c}) : (h = sb.exec( a )) && (c = "-" === h[1] ? -1 : 1, e = function ( a ) {
            var b = a && parseFloat( a.replace( ",", "." ) );
            return(isNaN( b ) ? 0 : b) * c
        }, g = {y: e( h[2] ), M: e( h[3] ), d: e( h[4] ), h: e( h[5] ), m: e( h[6] ), s: e( h[7] ), w: e( h[8] )}), d = new f( g ), cb.isDuration( a ) && a.hasOwnProperty( "_lang" ) && (d._lang = a._lang), d
    }, cb.version = eb, cb.defaultFormat = Kb, cb.updateOffset = function () {
    }, cb.lang = function ( a, b ) {
        var c;
        return a ? (b ? z( x( a ), b ) : null === b ? (A( a ), a = "en") : ob[a] || B( a ), c = cb.duration.fn._lang = cb.fn._lang = B( a ), c._abbr) : cb.fn._lang._abbr
    }, cb.langData = function ( a ) {
        return a && a._lang && a._lang._abbr && (a = a._lang._abbr), B( a )
    }, cb.isMoment = function ( a ) {
        return a instanceof e
    }, cb.isDuration = function ( a ) {
        return a instanceof f
    }, db = Wb.length - 1; db >= 0; --db)p( Wb[db] );
    for (cb.normalizeUnits = function ( a ) {
        return n( a )
    }, cb.invalid = function ( a ) {
        var b = cb.utc( 0 / 0 );
        return null != a ? g( b._pf, a ) : b._pf.userInvalidated = !0, b
    }, cb.parseZone = function ( a ) {
        return cb( a ).parseZone()
    }, g( cb.fn = e.prototype, {clone: function () {
        return cb( this )
    }, valueOf                       : function () {
        return+this._d + 6e4 * (this._offset || 0)
    }, unix                          : function () {
        return Math.floor( +this / 1e3 )
    }, toString                      : function () {
        return this.clone().lang( "en" ).format( "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ" )
    }, toDate                        : function () {
        return this._offset ? new Date( +this ) : this._d
    }, toISOString                   : function () {
        var a = cb( this ).utc();
        return 0 < a.year() && a.year() <= 9999 ? E( a, "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]" ) : E( a, "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]" )
    }, toArray                       : function () {
        var a = this;
        return[a.year(), a.month(), a.date(), a.hours(), a.minutes(), a.seconds(), a.milliseconds()]
    }, isValid                       : function () {
        return w( this )
    }, isDSTShifted                  : function () {
        return this._a ? this.isValid() && m( this._a, (this._isUTC ? cb.utc( this._a ) : cb( this._a )).toArray() ) > 0 : !1
    }, parsingFlags                  : function () {
        return g( {}, this._pf )
    }, invalidAt                     : function () {
        return this._pf.overflow
    }, utc                           : function () {
        return this.zone( 0 )
    }, local                         : function () {
        return this.zone( 0 ), this._isUTC = !1, this
    }, format                        : function ( a ) {
        var b = E( this, a || cb.defaultFormat );
        return this.lang().postformat( b )
    }, add                           : function ( a, b ) {
        var c;
        return c = "string" == typeof a ? cb.duration( +b, a ) : cb.duration( a, b ), j( this, c, 1 ), this
    }, subtract                      : function ( a, b ) {
        var c;
        return c = "string" == typeof a ? cb.duration( +b, a ) : cb.duration( a, b ), j( this, c, -1 ), this
    }, diff                          : function ( a, b, c ) {
        var d, e, f = y( a, this ), g = 6e4 * (this.zone() - f.zone());
        return b = n( b ), "year" === b || "month" === b ? (d = 432e5 * (this.daysInMonth() + f.daysInMonth()), e = 12 * (this.year() - f.year()) + (this.month() - f.month()), e += (this - cb( this ).startOf( "month" ) - (f - cb( f ).startOf( "month" ))) / d, e -= 6e4 * (this.zone() - cb( this ).startOf( "month" ).zone() - (f.zone() - cb( f ).startOf( "month" ).zone())) / d, "year" === b && (e /= 12)) : (d = this - f, e = "second" === b ? d / 1e3 : "minute" === b ? d / 6e4 : "hour" === b ? d / 36e5 : "day" === b ? (d - g) / 864e5 : "week" === b ? (d - g) / 6048e5 : d), c ? e : h( e )
    }, from                          : function ( a, b ) {
        return cb.duration( this.diff( a ) ).lang( this.lang()._abbr ).humanize( !b )
    }, fromNow                       : function ( a ) {
        return this.from( cb(), a )
    }, calendar                      : function () {
        var a = y( cb(), this ).startOf( "day" ), b = this.diff( a, "days", !0 ), c = -6 > b ? "sameElse" : -1 > b ? "lastWeek" : 0 > b ? "lastDay" : 1 > b ? "sameDay" : 2 > b ? "nextDay" : 7 > b ? "nextWeek" : "sameElse";
        return this.format( this.lang().calendar( c, this ) )
    }, isLeapYear                    : function () {
        return t( this.year() )
    }, isDST                         : function () {
        return this.zone() < this.clone().month( 0 ).zone() || this.zone() < this.clone().month( 5 ).zone()
    }, day                           : function ( a ) {
        var b = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        return null != a ? (a = U( a, this.lang() ), this.add( {d: a - b} )) : b
    }, month                         : function ( a ) {
        var b, c = this._isUTC ? "UTC" : "";
        return null != a ? "string" == typeof a && (a = this.lang().monthsParse( a ), "number" != typeof a) ? this : (b = this.date(), this.date( 1 ), this._d["set" + c + "Month"]( a ), this.date( Math.min( b, this.daysInMonth() ) ), cb.updateOffset( this ), this) : this._d["get" + c + "Month"]()
    }, startOf                       : function ( a ) {
        switch (a = n( a )) {
            case"year":
                this.month( 0 );
            case"month":
                this.date( 1 );
            case"week":
            case"isoWeek":
            case"day":
                this.hours( 0 );
            case"hour":
                this.minutes( 0 );
            case"minute":
                this.seconds( 0 );
            case"second":
                this.milliseconds( 0 )
        }
        return"week" === a ? this.weekday( 0 ) : "isoWeek" === a && this.isoWeekday( 1 ), this
    }, endOf                         : function ( a ) {
        return a = n( a ), this.startOf( a ).add( "isoWeek" === a ? "week" : a, 1 ).subtract( "ms", 1 )
    }, isAfter                       : function ( a, b ) {
        return b = "undefined" != typeof b ? b : "millisecond", +this.clone().startOf( b ) > +cb( a ).startOf( b )
    }, isBefore                      : function ( a, b ) {
        return b = "undefined" != typeof b ? b : "millisecond", +this.clone().startOf( b ) < +cb( a ).startOf( b )
    }, isSame                        : function ( a, b ) {
        return b = b || "ms", +this.clone().startOf( b ) === +y( a, this ).startOf( b )
    }, min                           : function ( a ) {
        return a = cb.apply( null, arguments ), this > a ? this : a
    }, max                           : function ( a ) {
        return a = cb.apply( null, arguments ), a > this ? this : a
    }, zone                          : function ( a ) {
        var b = this._offset || 0;
        return null == a ? this._isUTC ? b : this._d.getTimezoneOffset() : ("string" == typeof a && (a = H( a )), Math.abs( a ) < 16 && (a = 60 * a), this._offset = a, this._isUTC = !0, b !== a && j( this, cb.duration( b - a, "m" ), 1, !0 ), this)
    }, zoneAbbr                      : function () {
        return this._isUTC ? "UTC" : ""
    }, zoneName                      : function () {
        return this._isUTC ? "Coordinated Universal Time" : ""
    }, parseZone                     : function () {
        return this._tzm ? this.zone( this._tzm ) : "string" == typeof this._i && this.zone( this._i ), this
    }, hasAlignedHourOffset          : function ( a ) {
        return a = a ? cb( a ).zone() : 0, (this.zone() - a) % 60 === 0
    }, daysInMonth                   : function () {
        return r( this.year(), this.month() )
    }, dayOfYear                     : function ( a ) {
        var b = gb( (cb( this ).startOf( "day" ) - cb( this ).startOf( "year" )) / 864e5 ) + 1;
        return null == a ? b : this.add( "d", a - b )
    }, quarter                       : function () {
        return Math.ceil( (this.month() + 1) / 3 )
    }, weekYear                      : function ( a ) {
        var b = X( this, this.lang()._week.dow, this.lang()._week.doy ).year;
        return null == a ? b : this.add( "y", a - b )
    }, isoWeekYear                   : function ( a ) {
        var b = X( this, 1, 4 ).year;
        return null == a ? b : this.add( "y", a - b )
    }, week                          : function ( a ) {
        var b = this.lang().week( this );
        return null == a ? b : this.add( "d", 7 * (a - b) )
    }, isoWeek                       : function ( a ) {
        var b = X( this, 1, 4 ).week;
        return null == a ? b : this.add( "d", 7 * (a - b) )
    }, weekday                       : function ( a ) {
        var b = (this.day() + 7 - this.lang()._week.dow) % 7;
        return null == a ? b : this.add( "d", a - b )
    }, isoWeekday                    : function ( a ) {
        return null == a ? this.day() || 7 : this.day( this.day() % 7 ? a : a - 7 )
    }, get                           : function ( a ) {
        return a = n( a ), this[a]()
    }, set                           : function ( a, b ) {
        return a = n( a ), "function" == typeof this[a] && this[a]( b ), this
    }, lang                          : function ( b ) {
        return b === a ? this._lang : (this._lang = B( b ), this)
    }} ), db = 0; db < Ob.length; db++)$( Ob[db].toLowerCase().replace( /s$/, "" ), Ob[db] );
    $( "year", "FullYear" ), cb.fn.days = cb.fn.day, cb.fn.months = cb.fn.month, cb.fn.weeks = cb.fn.week, cb.fn.isoWeeks = cb.fn.isoWeek, cb.fn.toJSON = cb.fn.toISOString, g( cb.duration.fn = f.prototype, {_bubble: function () {
        var a, b, c, d, e = this._milliseconds, f = this._days, g = this._months, i = this._data;
        i.milliseconds = e % 1e3, a = h( e / 1e3 ), i.seconds = a % 60, b = h( a / 60 ), i.minutes = b % 60, c = h( b / 60 ), i.hours = c % 24, f += h( c / 24 ), i.days = f % 30, g += h( f / 30 ), i.months = g % 12, d = h( g / 12 ), i.years = d
    }, weeks                                                                                                                                                                                                          : function () {
        return h( this.days() / 7 )
    }, valueOf                                                                                                                                                                                                        : function () {
        return this._milliseconds + 864e5 * this._days + this._months % 12 * 2592e6 + 31536e6 * q( this._months / 12 )
    }, humanize                                                                                                                                                                                                       : function ( a ) {
        var b = +this, c = W( b, !a, this.lang() );
        return a && (c = this.lang().pastFuture( b, c )), this.lang().postformat( c )
    }, add                                                                                                                                                                                                            : function ( a, b ) {
        var c = cb.duration( a, b );
        return this._milliseconds += c._milliseconds, this._days += c._days, this._months += c._months, this._bubble(), this
    }, subtract                                                                                                                                                                                                       : function ( a, b ) {
        var c = cb.duration( a, b );
        return this._milliseconds -= c._milliseconds, this._days -= c._days, this._months -= c._months, this._bubble(), this
    }, get                                                                                                                                                                                                            : function ( a ) {
        return a = n( a ), this[a.toLowerCase() + "s"]()
    }, as                                                                                                                                                                                                             : function ( a ) {
        return a = n( a ), this["as" + a.charAt( 0 ).toUpperCase() + a.slice( 1 ) + "s"]()
    }, lang                                                                                                                                                                                                           : cb.fn.lang, toIsoString: function () {
        var a = Math.abs( this.years() ), b = Math.abs( this.months() ), c = Math.abs( this.days() ), d = Math.abs( this.hours() ), e = Math.abs( this.minutes() ), f = Math.abs( this.seconds() + this.milliseconds() / 1e3 );
        return this.asSeconds() ? (this.asSeconds() < 0 ? "-" : "") + "P" + (a ? a + "Y" : "") + (b ? b + "M" : "") + (c ? c + "D" : "") + (d || e || f ? "T" : "") + (d ? d + "H" : "") + (e ? e + "M" : "") + (f ? f + "S" : "") : "P0D"
    }} );
    for (db in Pb)Pb.hasOwnProperty( db ) && (ab( db, Pb[db] ), _( db.toLowerCase() ));
    ab( "Weeks", 6048e5 ), cb.duration.fn.asMonths = function () {
        return(+this - 31536e6 * this.years()) / 2592e6 + 12 * this.years()
    }, cb.lang( "en", {ordinal: function ( a ) {
        var b = a % 10, c = 1 === q( a % 100 / 10 ) ? "th" : 1 === b ? "st" : 2 === b ? "nd" : 3 === b ? "rd" : "th";
        return a + c
    }} ), function ( a ) {
        a( cb )
    }( function ( a ) {
        return a.lang( "ar-ma", {months: "يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split( "_" ), monthsShort: "يناير_فبراير_مارس_أبريل_ماي_يونيو_يوليوز_غشت_شتنبر_أكتوبر_نونبر_دجنبر".split( "_" ), weekdays: "الأحد_الإتنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split( "_" ), weekdaysShort: "احد_اتنين_ثلاثاء_اربعاء_خميس_جمعة_سبت".split( "_" ), weekdaysMin: "ح_ن_ث_ر_خ_ج_س".split( "_" ), longDateFormat: {LT: "HH:mm", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY LT", LLLL: "dddd D MMMM YYYY LT"}, calendar: {sameDay: "[اليوم على الساعة] LT", nextDay: "[غدا على الساعة] LT", nextWeek: "dddd [على الساعة] LT", lastDay: "[أمس على الساعة] LT", lastWeek: "dddd [على الساعة] LT", sameElse: "L"}, relativeTime: {future: "في %s", past: "منذ %s", s: "ثوان", m: "دقيقة", mm: "%d دقائق", h: "ساعة", hh: "%d ساعات", d: "يوم", dd: "%d أيام", M: "شهر", MM: "%d أشهر", y: "سنة", yy: "%d سنوات"}, week: {dow: 6, doy: 12}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        return a.lang( "ar", {months: "يناير/ كانون الثاني_فبراير/ شباط_مارس/ آذار_أبريل/ نيسان_مايو/ أيار_يونيو/ حزيران_يوليو/ تموز_أغسطس/ آب_سبتمبر/ أيلول_أكتوبر/ تشرين الأول_نوفمبر/ تشرين الثاني_ديسمبر/ كانون الأول".split( "_" ), monthsShort: "يناير/ كانون الثاني_فبراير/ شباط_مارس/ آذار_أبريل/ نيسان_مايو/ أيار_يونيو/ حزيران_يوليو/ تموز_أغسطس/ آب_سبتمبر/ أيلول_أكتوبر/ تشرين الأول_نوفمبر/ تشرين الثاني_ديسمبر/ كانون الأول".split( "_" ), weekdays: "الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split( "_" ), weekdaysShort: "الأحد_الإثنين_الثلاثاء_الأربعاء_الخميس_الجمعة_السبت".split( "_" ), weekdaysMin: "ح_ن_ث_ر_خ_ج_س".split( "_" ), longDateFormat: {LT: "HH:mm", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY LT", LLLL: "dddd D MMMM YYYY LT"}, calendar: {sameDay: "[اليوم على الساعة] LT", nextDay: "[غدا على الساعة] LT", nextWeek: "dddd [على الساعة] LT", lastDay: "[أمس على الساعة] LT", lastWeek: "dddd [على الساعة] LT", sameElse: "L"}, relativeTime: {future: "في %s", past: "منذ %s", s: "ثوان", m: "دقيقة", mm: "%d دقائق", h: "ساعة", hh: "%d ساعات", d: "يوم", dd: "%d أيام", M: "شهر", MM: "%d أشهر", y: "سنة", yy: "%d سنوات"}, week: {dow: 6, doy: 12}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        return a.lang( "bg", {months: "януари_февруари_март_април_май_юни_юли_август_септември_октомври_ноември_декември".split( "_" ), monthsShort: "янр_фев_мар_апр_май_юни_юли_авг_сеп_окт_ное_дек".split( "_" ), weekdays: "неделя_понеделник_вторник_сряда_четвъртък_петък_събота".split( "_" ), weekdaysShort: "нед_пон_вто_сря_чет_пет_съб".split( "_" ), weekdaysMin: "нд_пн_вт_ср_чт_пт_сб".split( "_" ), longDateFormat: {LT: "H:mm", L: "D.MM.YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY LT", LLLL: "dddd, D MMMM YYYY LT"}, calendar: {sameDay: "[Днес в] LT", nextDay: "[Утре в] LT", nextWeek: "dddd [в] LT", lastDay: "[Вчера в] LT", lastWeek: function () {
            switch (this.day()) {
                case 0:
                case 3:
                case 6:
                    return"[В изминалата] dddd [в] LT";
                case 1:
                case 2:
                case 4:
                case 5:
                    return"[В изминалия] dddd [в] LT"
            }
        }, sameElse                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        : "L"}, relativeTime: {future: "след %s", past: "преди %s", s: "няколко секунди", m: "минута", mm: "%d минути", h: "час", hh: "%d часа", d: "ден", dd: "%d дни", M: "месец", MM: "%d месеца", y: "година", yy: "%d години"}, ordinal: function ( a ) {
            var b = a % 10, c = a % 100;
            return 0 === a ? a + "-ев" : 0 === c ? a + "-ен" : c > 10 && 20 > c ? a + "-ти" : 1 === b ? a + "-ви" : 2 === b ? a + "-ри" : 7 === b || 8 === b ? a + "-ми" : a + "-ти"
        }, week: {dow: 1, doy: 7}} )
    } ), function ( a ) {
        a( cb )
    }( function ( b ) {
        function c ( a, b, c ) {
            var d = {mm: "munutenn", MM: "miz", dd: "devezh"};
            return a + " " + f( d[c], a )
        }

        function d ( a ) {
            switch (e( a )) {
                case 1:
                case 3:
                case 4:
                case 5:
                case 9:
                    return a + " bloaz";
                default:
                    return a + " vloaz"
            }
        }

        function e ( a ) {
            return a > 9 ? e( a % 10 ) : a
        }

        function f ( a, b ) {
            return 2 === b ? g( a ) : a
        }

        function g ( b ) {
            var c = {m: "v", b: "v", d: "z"};
            return c[b.charAt( 0 )] === a ? b : c[b.charAt( 0 )] + b.substring( 1 )
        }

        return b.lang( "br", {months: "Genver_C'hwevrer_Meurzh_Ebrel_Mae_Mezheven_Gouere_Eost_Gwengolo_Here_Du_Kerzu".split( "_" ), monthsShort: "Gen_C'hwe_Meu_Ebr_Mae_Eve_Gou_Eos_Gwe_Her_Du_Ker".split( "_" ), weekdays: "Sul_Lun_Meurzh_Merc'her_Yaou_Gwener_Sadorn".split( "_" ), weekdaysShort: "Sul_Lun_Meu_Mer_Yao_Gwe_Sad".split( "_" ), weekdaysMin: "Su_Lu_Me_Mer_Ya_Gw_Sa".split( "_" ), longDateFormat: {LT: "h[e]mm A", L: "DD/MM/YYYY", LL: "D [a viz] MMMM YYYY", LLL: "D [a viz] MMMM YYYY LT", LLLL: "dddd, D [a viz] MMMM YYYY LT"}, calendar: {sameDay: "[Hiziv da] LT", nextDay: "[Warc'hoazh da] LT", nextWeek: "dddd [da] LT", lastDay: "[Dec'h da] LT", lastWeek: "dddd [paset da] LT", sameElse: "L"}, relativeTime: {future: "a-benn %s", past: "%s 'zo", s: "un nebeud segondennoù", m: "ur vunutenn", mm: c, h: "un eur", hh: "%d eur", d: "un devezh", dd: c, M: "ur miz", MM: c, y: "ur bloaz", yy: d}, ordinal: function ( a ) {
            var b = 1 === a ? "añ" : "vet";
            return a + b
        }, week                     : {dow: 1, doy: 4}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        function b ( a, b, c ) {
            var d = a + " ";
            switch (c) {
                case"m":
                    return b ? "jedna minuta" : "jedne minute";
                case"mm":
                    return d += 1 === a ? "minuta" : 2 === a || 3 === a || 4 === a ? "minute" : "minuta";
                case"h":
                    return b ? "jedan sat" : "jednog sata";
                case"hh":
                    return d += 1 === a ? "sat" : 2 === a || 3 === a || 4 === a ? "sata" : "sati";
                case"dd":
                    return d += 1 === a ? "dan" : "dana";
                case"MM":
                    return d += 1 === a ? "mjesec" : 2 === a || 3 === a || 4 === a ? "mjeseca" : "mjeseci";
                case"yy":
                    return d += 1 === a ? "godina" : 2 === a || 3 === a || 4 === a ? "godine" : "godina"
            }
        }

        return a.lang( "bs", {months: "januar_februar_mart_april_maj_juni_juli_avgust_septembar_oktobar_novembar_decembar".split( "_" ), monthsShort: "jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.".split( "_" ), weekdays: "nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota".split( "_" ), weekdaysShort: "ned._pon._uto._sri._čet._pet._sub.".split( "_" ), weekdaysMin: "ne_po_ut_sr_če_pe_su".split( "_" ), longDateFormat: {LT: "H:mm", L: "DD. MM. YYYY", LL: "D. MMMM YYYY", LLL: "D. MMMM YYYY LT", LLLL: "dddd, D. MMMM YYYY LT"}, calendar: {sameDay: "[danas u] LT", nextDay: "[sutra u] LT", nextWeek: function () {
            switch (this.day()) {
                case 0:
                    return"[u] [nedjelju] [u] LT";
                case 3:
                    return"[u] [srijedu] [u] LT";
                case 6:
                    return"[u] [subotu] [u] LT";
                case 1:
                case 2:
                case 4:
                case 5:
                    return"[u] dddd [u] LT"
            }
        }, lastDay                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      : "[jučer u] LT", lastWeek: function () {
            switch (this.day()) {
                case 0:
                case 3:
                    return"[prošlu] dddd [u] LT";
                case 6:
                    return"[prošle] [subote] [u] LT";
                case 1:
                case 2:
                case 4:
                case 5:
                    return"[prošli] dddd [u] LT"
            }
        }, sameElse                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     : "L"}, relativeTime: {future: "za %s", past: "prije %s", s: "par sekundi", m: b, mm: b, h: b, hh: b, d: "dan", dd: b, M: "mjesec", MM: b, y: "godinu", yy: b}, ordinal: "%d.", week: {dow: 1, doy: 7}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        return a.lang( "ca", {months: "Gener_Febrer_Març_Abril_Maig_Juny_Juliol_Agost_Setembre_Octubre_Novembre_Desembre".split( "_" ), monthsShort: "Gen._Febr._Mar._Abr._Mai._Jun._Jul._Ag._Set._Oct._Nov._Des.".split( "_" ), weekdays: "Diumenge_Dilluns_Dimarts_Dimecres_Dijous_Divendres_Dissabte".split( "_" ), weekdaysShort: "Dg._Dl._Dt._Dc._Dj._Dv._Ds.".split( "_" ), weekdaysMin: "Dg_Dl_Dt_Dc_Dj_Dv_Ds".split( "_" ), longDateFormat: {LT: "H:mm", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY LT", LLLL: "dddd D MMMM YYYY LT"}, calendar: {sameDay: function () {
            return"[avui a " + (1 !== this.hours() ? "les" : "la") + "] LT"
        }, nextDay                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          : function () {
            return"[demà a " + (1 !== this.hours() ? "les" : "la") + "] LT"
        }, nextWeek                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         : function () {
            return"dddd [a " + (1 !== this.hours() ? "les" : "la") + "] LT"
        }, lastDay                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          : function () {
            return"[ahir a " + (1 !== this.hours() ? "les" : "la") + "] LT"
        }, lastWeek                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         : function () {
            return"[el] dddd [passat a " + (1 !== this.hours() ? "les" : "la") + "] LT"
        }, sameElse                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         : "L"}, relativeTime: {future: "en %s", past: "fa %s", s: "uns segons", m: "un minut", mm: "%d minuts", h: "una hora", hh: "%d hores", d: "un dia", dd: "%d dies", M: "un mes", MM: "%d mesos", y: "un any", yy: "%d anys"}, ordinal: "%dº", week: {dow: 1, doy: 4}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        function b ( a ) {
            return a > 1 && 5 > a && 1 !== ~~(a / 10)
        }

        function c ( a, c, d, e ) {
            var f = a + " ";
            switch (d) {
                case"s":
                    return c || e ? "pár vteřin" : "pár vteřinami";
                case"m":
                    return c ? "minuta" : e ? "minutu" : "minutou";
                case"mm":
                    return c || e ? f + (b( a ) ? "minuty" : "minut") : f + "minutami";
                    break;
                case"h":
                    return c ? "hodina" : e ? "hodinu" : "hodinou";
                case"hh":
                    return c || e ? f + (b( a ) ? "hodiny" : "hodin") : f + "hodinami";
                    break;
                case"d":
                    return c || e ? "den" : "dnem";
                case"dd":
                    return c || e ? f + (b( a ) ? "dny" : "dní") : f + "dny";
                    break;
                case"M":
                    return c || e ? "měsíc" : "měsícem";
                case"MM":
                    return c || e ? f + (b( a ) ? "měsíce" : "měsíců") : f + "měsíci";
                    break;
                case"y":
                    return c || e ? "rok" : "rokem";
                case"yy":
                    return c || e ? f + (b( a ) ? "roky" : "let") : f + "lety"
            }
        }

        var d = "leden_únor_březen_duben_květen_červen_červenec_srpen_září_říjen_listopad_prosinec".split( "_" ), e = "led_úno_bře_dub_kvě_čvn_čvc_srp_zář_říj_lis_pro".split( "_" );
        return a.lang( "cs", {months: d, monthsShort: e, monthsParse: function ( a, b ) {
            var c, d = [];
            for (c = 0; 12 > c; c++)d[c] = new RegExp( "^" + a[c] + "$|^" + b[c] + "$", "i" );
            return d
        }( d, e ), weekdays: "neděle_pondělí_úterý_středa_čtvrtek_pátek_sobota".split( "_" ), weekdaysShort: "ne_po_út_st_čt_pá_so".split( "_" ), weekdaysMin: "ne_po_út_st_čt_pá_so".split( "_" ), longDateFormat: {LT: "H:mm", L: "DD.MM.YYYY", LL: "D. MMMM YYYY", LLL: "D. MMMM YYYY LT", LLLL: "dddd D. MMMM YYYY LT"}, calendar: {sameDay: "[dnes v] LT", nextDay: "[zítra v] LT", nextWeek: function () {
            switch (this.day()) {
                case 0:
                    return"[v neděli v] LT";
                case 1:
                case 2:
                    return"[v] dddd [v] LT";
                case 3:
                    return"[ve středu v] LT";
                case 4:
                    return"[ve čtvrtek v] LT";
                case 5:
                    return"[v pátek v] LT";
                case 6:
                    return"[v sobotu v] LT"
            }
        }, lastDay                                                                                                                                                                                                                                                                                                                             : "[včera v] LT", lastWeek: function () {
            switch (this.day()) {
                case 0:
                    return"[minulou neděli v] LT";
                case 1:
                case 2:
                    return"[minulé] dddd [v] LT";
                case 3:
                    return"[minulou středu v] LT";
                case 4:
                case 5:
                    return"[minulý] dddd [v] LT";
                case 6:
                    return"[minulou sobotu v] LT"
            }
        }, sameElse                                                                                                                                                                                                                                                                                                                            : "L"}, relativeTime: {future: "za %s", past: "před %s", s: c, m: c, mm: c, h: c, hh: c, d: c, dd: c, M: c, MM: c, y: c, yy: c}, ordinal: "%d.", week: {dow: 1, doy: 4}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        return a.lang( "cv", {months: "кăрлач_нарăс_пуш_ака_май_çĕртме_утă_çурла_авăн_юпа_чӳк_раштав".split( "_" ), monthsShort: "кăр_нар_пуш_ака_май_çĕр_утă_çур_ав_юпа_чӳк_раш".split( "_" ), weekdays: "вырсарникун_тунтикун_ытларикун_юнкун_кĕçнерникун_эрнекун_шăматкун".split( "_" ), weekdaysShort: "выр_тун_ытл_юн_кĕç_эрн_шăм".split( "_" ), weekdaysMin: "вр_тн_ыт_юн_кç_эр_шм".split( "_" ), longDateFormat: {LT: "HH:mm", L: "DD-MM-YYYY", LL: "YYYY [çулхи] MMMM [уйăхĕн] D[-мĕшĕ]", LLL: "YYYY [çулхи] MMMM [уйăхĕн] D[-мĕшĕ], LT", LLLL: "dddd, YYYY [çулхи] MMMM [уйăхĕн] D[-мĕшĕ], LT"}, calendar: {sameDay: "[Паян] LT [сехетре]", nextDay: "[Ыран] LT [сехетре]", lastDay: "[Ĕнер] LT [сехетре]", nextWeek: "[Çитес] dddd LT [сехетре]", lastWeek: "[Иртнĕ] dddd LT [сехетре]", sameElse: "L"}, relativeTime: {future: function ( a ) {
            var b = /сехет$/i.exec( a ) ? "рен" : /çул$/i.exec( a ) ? "тан" : "ран";
            return a + b
        }, past                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         : "%s каялла", s: "пĕр-ик çеккунт", m: "пĕр минут", mm: "%d минут", h: "пĕр сехет", hh: "%d сехет", d: "пĕр кун", dd: "%d кун", M: "пĕр уйăх", MM: "%d уйăх", y: "пĕр çул", yy: "%d çул"}, ordinal: "%d-мĕш", week: {dow: 1, doy: 7}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        return a.lang( "cy", {months: "Ionawr_Chwefror_Mawrth_Ebrill_Mai_Mehefin_Gorffennaf_Awst_Medi_Hydref_Tachwedd_Rhagfyr".split( "_" ), monthsShort: "Ion_Chwe_Maw_Ebr_Mai_Meh_Gor_Aws_Med_Hyd_Tach_Rhag".split( "_" ), weekdays: "Dydd Sul_Dydd Llun_Dydd Mawrth_Dydd Mercher_Dydd Iau_Dydd Gwener_Dydd Sadwrn".split( "_" ), weekdaysShort: "Sul_Llun_Maw_Mer_Iau_Gwe_Sad".split( "_" ), weekdaysMin: "Su_Ll_Ma_Me_Ia_Gw_Sa".split( "_" ), longDateFormat: {LT: "HH:mm", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY LT", LLLL: "dddd, D MMMM YYYY LT"}, calendar: {sameDay: "[Heddiw am] LT", nextDay: "[Yfory am] LT", nextWeek: "dddd [am] LT", lastDay: "[Ddoe am] LT", lastWeek: "dddd [diwethaf am] LT", sameElse: "L"}, relativeTime: {future: "mewn %s", past: "%s yn &#244;l", s: "ychydig eiliadau", m: "munud", mm: "%d munud", h: "awr", hh: "%d awr", d: "diwrnod", dd: "%d diwrnod", M: "mis", MM: "%d mis", y: "blwyddyn", yy: "%d flynedd"}, ordinal: function ( a ) {
            var b = a, c = "", d = ["", "af", "il", "ydd", "ydd", "ed", "ed", "ed", "fed", "fed", "fed", "eg", "fed", "eg", "eg", "fed", "eg", "eg", "fed", "eg", "fed"];
            return b > 20 ? c = 40 === b || 50 === b || 60 === b || 80 === b || 100 === b ? "fed" : "ain" : b > 0 && (c = d[b]), a + c
        }, week                     : {dow: 1, doy: 4}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        return a.lang( "da", {months: "januar_februar_marts_april_maj_juni_juli_august_september_oktober_november_december".split( "_" ), monthsShort: "jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split( "_" ), weekdays: "søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag".split( "_" ), weekdaysShort: "søn_man_tir_ons_tor_fre_lør".split( "_" ), weekdaysMin: "sø_ma_ti_on_to_fr_lø".split( "_" ), longDateFormat: {LT: "HH:mm", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY LT", LLLL: "dddd D. MMMM, YYYY LT"}, calendar: {sameDay: "[I dag kl.] LT", nextDay: "[I morgen kl.] LT", nextWeek: "dddd [kl.] LT", lastDay: "[I går kl.] LT", lastWeek: "[sidste] dddd [kl] LT", sameElse: "L"}, relativeTime: {future: "om %s", past: "%s siden", s: "få sekunder", m: "et minut", mm: "%d minutter", h: "en time", hh: "%d timer", d: "en dag", dd: "%d dage", M: "en måned", MM: "%d måneder", y: "et år", yy: "%d år"}, ordinal: "%d.", week: {dow: 1, doy: 4}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        function b ( a, b, c ) {
            var d = {m: ["eine Minute", "einer Minute"], h: ["eine Stunde", "einer Stunde"], d: ["ein Tag", "einem Tag"], dd: [a + " Tage", a + " Tagen"], M: ["ein Monat", "einem Monat"], MM: [a + " Monate", a + " Monaten"], y: ["ein Jahr", "einem Jahr"], yy: [a + " Jahre", a + " Jahren"]};
            return b ? d[c][0] : d[c][1]
        }

        return a.lang( "de", {months: "Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split( "_" ), monthsShort: "Jan._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split( "_" ), weekdays: "Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split( "_" ), weekdaysShort: "So._Mo._Di._Mi._Do._Fr._Sa.".split( "_" ), weekdaysMin: "So_Mo_Di_Mi_Do_Fr_Sa".split( "_" ), longDateFormat: {LT: "H:mm [Uhr]", L: "DD.MM.YYYY", LL: "D. MMMM YYYY", LLL: "D. MMMM YYYY LT", LLLL: "dddd, D. MMMM YYYY LT"}, calendar: {sameDay: "[Heute um] LT", sameElse: "L", nextDay: "[Morgen um] LT", nextWeek: "dddd [um] LT", lastDay: "[Gestern um] LT", lastWeek: "[letzten] dddd [um] LT"}, relativeTime: {future: "in %s", past: "vor %s", s: "ein paar Sekunden", m: b, mm: "%d Minuten", h: b, hh: "%d Stunden", d: b, dd: b, M: b, MM: b, y: b, yy: b}, ordinal: "%d.", week: {dow: 1, doy: 4}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        return a.lang( "el", {monthsNominativeEl: "Ιανουάριος_Φεβρουάριος_Μάρτιος_Απρίλιος_Μάιος_Ιούνιος_Ιούλιος_Αύγουστος_Σεπτέμβριος_Οκτώβριος_Νοέμβριος_Δεκέμβριος".split( "_" ), monthsGenitiveEl: "Ιανουαρίου_Φεβρουαρίου_Μαρτίου_Απριλίου_Μαΐου_Ιουνίου_Ιουλίου_Αυγούστου_Σεπτεμβρίου_Οκτωβρίου_Νοεμβρίου_Δεκεμβρίου".split( "_" ), months: function ( a, b ) {
            return/D/.test( b.substring( 0, b.indexOf( "MMMM" ) ) ) ? this._monthsGenitiveEl[a.month()] : this._monthsNominativeEl[a.month()]
        }, monthsShort                          : "Ιαν_Φεβ_Μαρ_Απρ_Μαϊ_Ιουν_Ιουλ_Αυγ_Σεπ_Οκτ_Νοε_Δεκ".split( "_" ), weekdays: "Κυριακή_Δευτέρα_Τρίτη_Τετάρτη_Πέμπτη_Παρασκευή_Σάββατο".split( "_" ), weekdaysShort: "Κυρ_Δευ_Τρι_Τετ_Πεμ_Παρ_Σαβ".split( "_" ), weekdaysMin: "Κυ_Δε_Τρ_Τε_Πε_Πα_Σα".split( "_" ), meridiem: function ( a, b, c ) {
            return a > 11 ? c ? "μμ" : "ΜΜ" : c ? "πμ" : "ΠΜ"
        }, longDateFormat                       : {LT: "h:mm A", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY LT", LLLL: "dddd, D MMMM YYYY LT"}, calendarEl: {sameDay: "[Σήμερα {}] LT", nextDay: "[Αύριο {}] LT", nextWeek: "dddd [{}] LT", lastDay: "[Χθες {}] LT", lastWeek: "[την προηγούμενη] dddd [{}] LT", sameElse: "L"}, calendar: function ( a, b ) {
            var c = this._calendarEl[a], d = b && b.hours();
            return c.replace( "{}", d % 12 === 1 ? "στη" : "στις" )
        }, relativeTime                         : {future: "σε %s", past: "%s πριν", s: "δευτερόλεπτα", m: "ένα λεπτό", mm: "%d λεπτά", h: "μία ώρα", hh: "%d ώρες", d: "μία μέρα", dd: "%d μέρες", M: "ένας μήνας", MM: "%d μήνες", y: "ένας χρόνος", yy: "%d χρόνια"}, ordinal: function ( a ) {
            return a + "η"
        }, week                                 : {dow: 1, doy: 4}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        return a.lang( "en-au", {months: "January_February_March_April_May_June_July_August_September_October_November_December".split( "_" ), monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split( "_" ), weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split( "_" ), weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split( "_" ), weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split( "_" ), longDateFormat: {LT: "h:mm A", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY LT", LLLL: "dddd, D MMMM YYYY LT"}, calendar: {sameDay: "[Today at] LT", nextDay: "[Tomorrow at] LT", nextWeek: "dddd [at] LT", lastDay: "[Yesterday at] LT", lastWeek: "[Last] dddd [at] LT", sameElse: "L"}, relativeTime: {future: "in %s", past: "%s ago", s: "a few seconds", m: "a minute", mm: "%d minutes", h: "an hour", hh: "%d hours", d: "a day", dd: "%d days", M: "a month", MM: "%d months", y: "a year", yy: "%d years"}, ordinal: function ( a ) {
            var b = a % 10, c = 1 === ~~(a % 100 / 10) ? "th" : 1 === b ? "st" : 2 === b ? "nd" : 3 === b ? "rd" : "th";
            return a + c
        }, week                        : {dow: 1, doy: 4}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        return a.lang( "en-ca", {months: "January_February_March_April_May_June_July_August_September_October_November_December".split( "_" ), monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split( "_" ), weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split( "_" ), weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split( "_" ), weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split( "_" ), longDateFormat: {LT: "h:mm A", L: "YYYY-MM-DD", LL: "D MMMM, YYYY", LLL: "D MMMM, YYYY LT", LLLL: "dddd, D MMMM, YYYY LT"}, calendar: {sameDay: "[Today at] LT", nextDay: "[Tomorrow at] LT", nextWeek: "dddd [at] LT", lastDay: "[Yesterday at] LT", lastWeek: "[Last] dddd [at] LT", sameElse: "L"}, relativeTime: {future: "in %s", past: "%s ago", s: "a few seconds", m: "a minute", mm: "%d minutes", h: "an hour", hh: "%d hours", d: "a day", dd: "%d days", M: "a month", MM: "%d months", y: "a year", yy: "%d years"}, ordinal: function ( a ) {
            var b = a % 10, c = 1 === ~~(a % 100 / 10) ? "th" : 1 === b ? "st" : 2 === b ? "nd" : 3 === b ? "rd" : "th";
            return a + c
        }} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        return a.lang( "en-gb", {months: "January_February_March_April_May_June_July_August_September_October_November_December".split( "_" ), monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split( "_" ), weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split( "_" ), weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split( "_" ), weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split( "_" ), longDateFormat: {LT: "HH:mm", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY LT", LLLL: "dddd, D MMMM YYYY LT"}, calendar: {sameDay: "[Today at] LT", nextDay: "[Tomorrow at] LT", nextWeek: "dddd [at] LT", lastDay: "[Yesterday at] LT", lastWeek: "[Last] dddd [at] LT", sameElse: "L"}, relativeTime: {future: "in %s", past: "%s ago", s: "a few seconds", m: "a minute", mm: "%d minutes", h: "an hour", hh: "%d hours", d: "a day", dd: "%d days", M: "a month", MM: "%d months", y: "a year", yy: "%d years"}, ordinal: function ( a ) {
            var b = a % 10, c = 1 === ~~(a % 100 / 10) ? "th" : 1 === b ? "st" : 2 === b ? "nd" : 3 === b ? "rd" : "th";
            return a + c
        }, week                        : {dow: 1, doy: 4}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        return a.lang( "eo", {months: "januaro_februaro_marto_aprilo_majo_junio_julio_aŭgusto_septembro_oktobro_novembro_decembro".split( "_" ), monthsShort: "jan_feb_mar_apr_maj_jun_jul_aŭg_sep_okt_nov_dec".split( "_" ), weekdays: "Dimanĉo_Lundo_Mardo_Merkredo_Ĵaŭdo_Vendredo_Sabato".split( "_" ), weekdaysShort: "Dim_Lun_Mard_Merk_Ĵaŭ_Ven_Sab".split( "_" ), weekdaysMin: "Di_Lu_Ma_Me_Ĵa_Ve_Sa".split( "_" ), longDateFormat: {LT: "HH:mm", L: "YYYY-MM-DD", LL: "D[-an de] MMMM, YYYY", LLL: "D[-an de] MMMM, YYYY LT", LLLL: "dddd, [la] D[-an de] MMMM, YYYY LT"}, meridiem: function ( a, b, c ) {
            return a > 11 ? c ? "p.t.m." : "P.T.M." : c ? "a.t.m." : "A.T.M."
        }, calendar                 : {sameDay: "[Hodiaŭ je] LT", nextDay: "[Morgaŭ je] LT", nextWeek: "dddd [je] LT", lastDay: "[Hieraŭ je] LT", lastWeek: "[pasinta] dddd [je] LT", sameElse: "L"}, relativeTime: {future: "je %s", past: "antaŭ %s", s: "sekundoj", m: "minuto", mm: "%d minutoj", h: "horo", hh: "%d horoj", d: "tago", dd: "%d tagoj", M: "monato", MM: "%d monatoj", y: "jaro", yy: "%d jaroj"}, ordinal: "%da", week: {dow: 1, doy: 7}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        return a.lang( "es", {months: "enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre".split( "_" ), monthsShort: "ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.".split( "_" ), weekdays: "domingo_lunes_martes_miércoles_jueves_viernes_sábado".split( "_" ), weekdaysShort: "dom._lun._mar._mié._jue._vie._sáb.".split( "_" ), weekdaysMin: "Do_Lu_Ma_Mi_Ju_Vi_Sá".split( "_" ), longDateFormat: {LT: "H:mm", L: "DD/MM/YYYY", LL: "D [de] MMMM [de] YYYY", LLL: "D [de] MMMM [de] YYYY LT", LLLL: "dddd, D [de] MMMM [de] YYYY LT"}, calendar: {sameDay: function () {
            return"[hoy a la" + (1 !== this.hours() ? "s" : "") + "] LT"
        }, nextDay                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                : function () {
            return"[mañana a la" + (1 !== this.hours() ? "s" : "") + "] LT"
        }, nextWeek                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               : function () {
            return"dddd [a la" + (1 !== this.hours() ? "s" : "") + "] LT"
        }, lastDay                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                : function () {
            return"[ayer a la" + (1 !== this.hours() ? "s" : "") + "] LT"
        }, lastWeek                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               : function () {
            return"[el] dddd [pasado a la" + (1 !== this.hours() ? "s" : "") + "] LT"
        }, sameElse                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               : "L"}, relativeTime: {future: "en %s", past: "hace %s", s: "unos segundos", m: "un minuto", mm: "%d minutos", h: "una hora", hh: "%d horas", d: "un día", dd: "%d días", M: "un mes", MM: "%d meses", y: "un año", yy: "%d años"}, ordinal: "%dº", week: {dow: 1, doy: 4}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        function b ( a, b, c, d ) {
            var e = {s: ["mõne sekundi", "mõni sekund", "paar sekundit"], m: ["ühe minuti", "üks minut"], mm: [a + " minuti", a + " minutit"], h: ["ühe tunni", "tund aega", "üks tund"], hh: [a + " tunni", a + " tundi"], d: ["ühe päeva", "üks päev"], M: ["kuu aja", "kuu aega", "üks kuu"], MM: [a + " kuu", a + " kuud"], y: ["ühe aasta", "aasta", "üks aasta"], yy: [a + " aasta", a + " aastat"]};
            return b ? e[c][2] ? e[c][2] : e[c][1] : d ? e[c][0] : e[c][1]
        }

        return a.lang( "et", {months: "jaanuar_veebruar_märts_aprill_mai_juuni_juuli_august_september_oktoober_november_detsember".split( "_" ), monthsShort: "jaan_veebr_märts_apr_mai_juuni_juuli_aug_sept_okt_nov_dets".split( "_" ), weekdays: "pühapäev_esmaspäev_teisipäev_kolmapäev_neljapäev_reede_laupäev".split( "_" ), weekdaysShort: "P_E_T_K_N_R_L".split( "_" ), weekdaysMin: "P_E_T_K_N_R_L".split( "_" ), longDateFormat: {LT: "H:mm", L: "DD.MM.YYYY", LL: "D. MMMM YYYY", LLL: "D. MMMM YYYY LT", LLLL: "dddd, D. MMMM YYYY LT"}, calendar: {sameDay: "[Täna,] LT", nextDay: "[Homme,] LT", nextWeek: "[Järgmine] dddd LT", lastDay: "[Eile,] LT", lastWeek: "[Eelmine] dddd LT", sameElse: "L"}, relativeTime: {future: "%s pärast", past: "%s tagasi", s: b, m: b, mm: b, h: b, hh: b, d: b, dd: "%d päeva", M: b, MM: b, y: b, yy: b}, ordinal: "%d.", week: {dow: 1, doy: 4}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        return a.lang( "eu", {months: "urtarrila_otsaila_martxoa_apirila_maiatza_ekaina_uztaila_abuztua_iraila_urria_azaroa_abendua".split( "_" ), monthsShort: "urt._ots._mar._api._mai._eka._uzt._abu._ira._urr._aza._abe.".split( "_" ), weekdays: "igandea_astelehena_asteartea_asteazkena_osteguna_ostirala_larunbata".split( "_" ), weekdaysShort: "ig._al._ar._az._og._ol._lr.".split( "_" ), weekdaysMin: "ig_al_ar_az_og_ol_lr".split( "_" ), longDateFormat: {LT: "HH:mm", L: "YYYY-MM-DD", LL: "YYYY[ko] MMMM[ren] D[a]", LLL: "YYYY[ko] MMMM[ren] D[a] LT", LLLL: "dddd, YYYY[ko] MMMM[ren] D[a] LT", l: "YYYY-M-D", ll: "YYYY[ko] MMM D[a]", lll: "YYYY[ko] MMM D[a] LT", llll: "ddd, YYYY[ko] MMM D[a] LT"}, calendar: {sameDay: "[gaur] LT[etan]", nextDay: "[bihar] LT[etan]", nextWeek: "dddd LT[etan]", lastDay: "[atzo] LT[etan]", lastWeek: "[aurreko] dddd LT[etan]", sameElse: "L"}, relativeTime: {future: "%s barru", past: "duela %s", s: "segundo batzuk", m: "minutu bat", mm: "%d minutu", h: "ordu bat", hh: "%d ordu", d: "egun bat", dd: "%d egun", M: "hilabete bat", MM: "%d hilabete", y: "urte bat", yy: "%d urte"}, ordinal: "%d.", week: {dow: 1, doy: 7}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        var b = {1: "۱", 2: "۲", 3: "۳", 4: "۴", 5: "۵", 6: "۶", 7: "۷", 8: "۸", 9: "۹", 0: "۰"}, c = {"۱": "1", "۲": "2", "۳": "3", "۴": "4", "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9", "۰": "0"};
        return a.lang( "fa", {months: "ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر".split( "_" ), monthsShort: "ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر".split( "_" ), weekdays: "یک‌شنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنج‌شنبه_جمعه_شنبه".split( "_" ), weekdaysShort: "یک‌شنبه_دوشنبه_سه‌شنبه_چهارشنبه_پنج‌شنبه_جمعه_شنبه".split( "_" ), weekdaysMin: "ی_د_س_چ_پ_ج_ش".split( "_" ), longDateFormat: {LT: "HH:mm", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY LT", LLLL: "dddd, D MMMM YYYY LT"}, meridiem: function ( a ) {
            return 12 > a ? "قبل از ظهر" : "بعد از ظهر"
        }, calendar                 : {sameDay: "[امروز ساعت] LT", nextDay: "[فردا ساعت] LT", nextWeek: "dddd [ساعت] LT", lastDay: "[دیروز ساعت] LT", lastWeek: "dddd [پیش] [ساعت] LT", sameElse: "L"}, relativeTime: {future: "در %s", past: "%s پیش", s: "چندین ثانیه", m: "یک دقیقه", mm: "%d دقیقه", h: "یک ساعت", hh: "%d ساعت", d: "یک روز", dd: "%d روز", M: "یک ماه", MM: "%d ماه", y: "یک سال", yy: "%d سال"}, preparse: function ( a ) {
            return a.replace( /[۰-۹]/g, function ( a ) {
                return c[a]
            } ).replace( /،/g, "," )
        }, postformat               : function ( a ) {
            return a.replace( /\d/g, function ( a ) {
                return b[a]
            } ).replace( /,/g, "،" )
        }, ordinal                  : "%dم", week: {dow: 6, doy: 12}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        function b ( a, b, d, e ) {
            var f = "";
            switch (d) {
                case"s":
                    return e ? "muutaman sekunnin" : "muutama sekunti";
                case"m":
                    return e ? "minuutin" : "minuutti";
                case"mm":
                    f = e ? "minuutin" : "minuuttia";
                    break;
                case"h":
                    return e ? "tunnin" : "tunti";
                case"hh":
                    f = e ? "tunnin" : "tuntia";
                    break;
                case"d":
                    return e ? "päivän" : "päivä";
                case"dd":
                    f = e ? "päivän" : "päivää";
                    break;
                case"M":
                    return e ? "kuukauden" : "kuukausi";
                case"MM":
                    f = e ? "kuukauden" : "kuukautta";
                    break;
                case"y":
                    return e ? "vuoden" : "vuosi";
                case"yy":
                    f = e ? "vuoden" : "vuotta"
            }
            return f = c( a, e ) + " " + f
        }

        function c ( a, b ) {
            return 10 > a ? b ? e[a] : d[a] : a
        }

        var d = "nolla yksi kaksi kolme neljä viisi kuusi seitsemän kahdeksan yhdeksän".split( " " ), e = ["nolla", "yhden", "kahden", "kolmen", "neljän", "viiden", "kuuden", d[7], d[8], d[9]];
        return a.lang( "fi", {months: "tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesäkuu_heinäkuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu".split( "_" ), monthsShort: "tammi_helmi_maalis_huhti_touko_kesä_heinä_elo_syys_loka_marras_joulu".split( "_" ), weekdays: "sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai".split( "_" ), weekdaysShort: "su_ma_ti_ke_to_pe_la".split( "_" ), weekdaysMin: "su_ma_ti_ke_to_pe_la".split( "_" ), longDateFormat: {LT: "HH.mm", L: "DD.MM.YYYY", LL: "Do MMMM[ta] YYYY", LLL: "Do MMMM[ta] YYYY, [klo] LT", LLLL: "dddd, Do MMMM[ta] YYYY, [klo] LT", l: "D.M.YYYY", ll: "Do MMM YYYY", lll: "Do MMM YYYY, [klo] LT", llll: "ddd, Do MMM YYYY, [klo] LT"}, calendar: {sameDay: "[tänään] [klo] LT", nextDay: "[huomenna] [klo] LT", nextWeek: "dddd [klo] LT", lastDay: "[eilen] [klo] LT", lastWeek: "[viime] dddd[na] [klo] LT", sameElse: "L"}, relativeTime: {future: "%s päästä", past: "%s sitten", s: b, m: b, mm: b, h: b, hh: b, d: b, dd: b, M: b, MM: b, y: b, yy: b}, ordinal: "%d.", week: {dow: 1, doy: 4}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        return a.lang( "fo", {months: "januar_februar_mars_apríl_mai_juni_juli_august_september_oktober_november_desember".split( "_" ), monthsShort: "jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split( "_" ), weekdays: "sunnudagur_mánadagur_týsdagur_mikudagur_hósdagur_fríggjadagur_leygardagur".split( "_" ), weekdaysShort: "sun_mán_týs_mik_hós_frí_ley".split( "_" ), weekdaysMin: "su_má_tý_mi_hó_fr_le".split( "_" ), longDateFormat: {LT: "HH:mm", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY LT", LLLL: "dddd D. MMMM, YYYY LT"}, calendar: {sameDay: "[Í dag kl.] LT", nextDay: "[Í morgin kl.] LT", nextWeek: "dddd [kl.] LT", lastDay: "[Í gjár kl.] LT", lastWeek: "[síðstu] dddd [kl] LT", sameElse: "L"}, relativeTime: {future: "um %s", past: "%s síðani", s: "fá sekund", m: "ein minutt", mm: "%d minuttir", h: "ein tími", hh: "%d tímar", d: "ein dagur", dd: "%d dagar", M: "ein mánaði", MM: "%d mánaðir", y: "eitt ár", yy: "%d ár"}, ordinal: "%d.", week: {dow: 1, doy: 4}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        return a.lang( "fr-ca", {months: "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split( "_" ), monthsShort: "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split( "_" ), weekdays: "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split( "_" ), weekdaysShort: "dim._lun._mar._mer._jeu._ven._sam.".split( "_" ), weekdaysMin: "Di_Lu_Ma_Me_Je_Ve_Sa".split( "_" ), longDateFormat: {LT: "HH:mm", L: "YYYY-MM-DD", LL: "D MMMM YYYY", LLL: "D MMMM YYYY LT", LLLL: "dddd D MMMM YYYY LT"}, calendar: {sameDay: "[Aujourd'hui à] LT", nextDay: "[Demain à] LT", nextWeek: "dddd [à] LT", lastDay: "[Hier à] LT", lastWeek: "dddd [dernier à] LT", sameElse: "L"}, relativeTime: {future: "dans %s", past: "il y a %s", s: "quelques secondes", m: "une minute", mm: "%d minutes", h: "une heure", hh: "%d heures", d: "un jour", dd: "%d jours", M: "un mois", MM: "%d mois", y: "un an", yy: "%d ans"}, ordinal: function ( a ) {
            return a + (1 === a ? "er" : "")
        }} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        return a.lang( "fr", {months: "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split( "_" ), monthsShort: "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split( "_" ), weekdays: "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split( "_" ), weekdaysShort: "dim._lun._mar._mer._jeu._ven._sam.".split( "_" ), weekdaysMin: "Di_Lu_Ma_Me_Je_Ve_Sa".split( "_" ), longDateFormat: {LT: "HH:mm", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY LT", LLLL: "dddd D MMMM YYYY LT"}, calendar: {sameDay: "[Aujourd'hui à] LT", nextDay: "[Demain à] LT", nextWeek: "dddd [à] LT", lastDay: "[Hier à] LT", lastWeek: "dddd [dernier à] LT", sameElse: "L"}, relativeTime: {future: "dans %s", past: "il y a %s", s: "quelques secondes", m: "une minute", mm: "%d minutes", h: "une heure", hh: "%d heures", d: "un jour", dd: "%d jours", M: "un mois", MM: "%d mois", y: "un an", yy: "%d ans"}, ordinal: function ( a ) {
            return a + (1 === a ? "er" : "")
        }, week                     : {dow: 1, doy: 4}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        return a.lang( "gl", {months: "Xaneiro_Febreiro_Marzo_Abril_Maio_Xuño_Xullo_Agosto_Setembro_Outubro_Novembro_Decembro".split( "_" ), monthsShort: "Xan._Feb._Mar._Abr._Mai._Xuñ._Xul._Ago._Set._Out._Nov._Dec.".split( "_" ), weekdays: "Domingo_Luns_Martes_Mércores_Xoves_Venres_Sábado".split( "_" ), weekdaysShort: "Dom._Lun._Mar._Mér._Xov._Ven._Sáb.".split( "_" ), weekdaysMin: "Do_Lu_Ma_Mé_Xo_Ve_Sá".split( "_" ), longDateFormat: {LT: "H:mm", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY LT", LLLL: "dddd D MMMM YYYY LT"}, calendar: {sameDay: function () {
            return"[hoxe " + (1 !== this.hours() ? "ás" : "á") + "] LT"
        }, nextDay                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           : function () {
            return"[mañá " + (1 !== this.hours() ? "ás" : "á") + "] LT"
        }, nextWeek                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          : function () {
            return"dddd [" + (1 !== this.hours() ? "ás" : "a") + "] LT"
        }, lastDay                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           : function () {
            return"[onte " + (1 !== this.hours() ? "á" : "a") + "] LT"
        }, lastWeek                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          : function () {
            return"[o] dddd [pasado " + (1 !== this.hours() ? "ás" : "a") + "] LT"
        }, sameElse                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          : "L"}, relativeTime: {future: function ( a ) {
            return"uns segundos" === a ? "nuns segundos" : "en " + a
        }, past                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           : "hai %s", s: "uns segundos", m: "un minuto", mm: "%d minutos", h: "unha hora", hh: "%d horas", d: "un día", dd: "%d días", M: "un mes", MM: "%d meses", y: "un ano", yy: "%d anos"}, ordinal: "%dº", week: {dow: 1, doy: 7}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        return a.lang( "he", {months: "ינואר_פברואר_מרץ_אפריל_מאי_יוני_יולי_אוגוסט_ספטמבר_אוקטובר_נובמבר_דצמבר".split( "_" ), monthsShort: "ינו׳_פבר׳_מרץ_אפר׳_מאי_יוני_יולי_אוג׳_ספט׳_אוק׳_נוב׳_דצמ׳".split( "_" ), weekdays: "ראשון_שני_שלישי_רביעי_חמישי_שישי_שבת".split( "_" ), weekdaysShort: "א׳_ב׳_ג׳_ד׳_ה׳_ו׳_ש׳".split( "_" ), weekdaysMin: "א_ב_ג_ד_ה_ו_ש".split( "_" ), longDateFormat: {LT: "HH:mm", L: "DD/MM/YYYY", LL: "D [ב]MMMM YYYY", LLL: "D [ב]MMMM YYYY LT", LLLL: "dddd, D [ב]MMMM YYYY LT", l: "D/M/YYYY", ll: "D MMM YYYY", lll: "D MMM YYYY LT", llll: "ddd, D MMM YYYY LT"}, calendar: {sameDay: "[היום ב־]LT", nextDay: "[מחר ב־]LT", nextWeek: "dddd [בשעה] LT", lastDay: "[אתמול ב־]LT", lastWeek: "[ביום] dddd [האחרון בשעה] LT", sameElse: "L"}, relativeTime: {future: "בעוד %s", past: "לפני %s", s: "מספר שניות", m: "דקה", mm: "%d דקות", h: "שעה", hh: function ( a ) {
            return 2 === a ? "שעתיים" : a + " שעות"
        }, d                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         : "יום", dd: function ( a ) {
            return 2 === a ? "יומיים" : a + " ימים"
        }, M                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         : "חודש", MM: function ( a ) {
            return 2 === a ? "חודשיים" : a + " חודשים"
        }, y                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         : "שנה", yy: function ( a ) {
            return 2 === a ? "שנתיים" : a + " שנים"
        }}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        var b = {1: "१", 2: "२", 3: "३", 4: "४", 5: "५", 6: "६", 7: "७", 8: "८", 9: "९", 0: "०"}, c = {"१": "1", "२": "2", "३": "3", "४": "4", "५": "5", "६": "6", "७": "7", "८": "8", "९": "9", "०": "0"};
        return a.lang( "hi", {months: "जनवरी_फ़रवरी_मार्च_अप्रैल_मई_जून_जुलाई_अगस्त_सितम्बर_अक्टूबर_नवम्बर_दिसम्बर".split( "_" ), monthsShort: "जन._फ़र._मार्च_अप्रै._मई_जून_जुल._अग._सित._अक्टू._नव._दिस.".split( "_" ), weekdays: "रविवार_सोमवार_मंगलवार_बुधवार_गुरूवार_शुक्रवार_शनिवार".split( "_" ), weekdaysShort: "रवि_सोम_मंगल_बुध_गुरू_शुक्र_शनि".split( "_" ), weekdaysMin: "र_सो_मं_बु_गु_शु_श".split( "_" ), longDateFormat: {LT: "A h:mm बजे", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY, LT", LLLL: "dddd, D MMMM YYYY, LT"}, calendar: {sameDay: "[आज] LT", nextDay: "[कल] LT", nextWeek: "dddd, LT", lastDay: "[कल] LT", lastWeek: "[पिछले] dddd, LT", sameElse: "L"}, relativeTime: {future: "%s में", past: "%s पहले", s: "कुछ ही क्षण", m: "एक मिनट", mm: "%d मिनट", h: "एक घंटा", hh: "%d घंटे", d: "एक दिन", dd: "%d दिन", M: "एक महीने", MM: "%d महीने", y: "एक वर्ष", yy: "%d वर्ष"}, preparse: function ( a ) {
            return a.replace( /[१२३४५६७८९०]/g, function ( a ) {
                return c[a]
            } )
        }, postformat               : function ( a ) {
            return a.replace( /\d/g, function ( a ) {
                return b[a]
            } )
        }, meridiem                 : function ( a ) {
            return 4 > a ? "रात" : 10 > a ? "सुबह" : 17 > a ? "दोपहर" : 20 > a ? "शाम" : "रात"
        }, week                     : {dow: 0, doy: 6}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        function b ( a, b, c ) {
            var d = a + " ";
            switch (c) {
                case"m":
                    return b ? "jedna minuta" : "jedne minute";
                case"mm":
                    return d += 1 === a ? "minuta" : 2 === a || 3 === a || 4 === a ? "minute" : "minuta";
                case"h":
                    return b ? "jedan sat" : "jednog sata";
                case"hh":
                    return d += 1 === a ? "sat" : 2 === a || 3 === a || 4 === a ? "sata" : "sati";
                case"dd":
                    return d += 1 === a ? "dan" : "dana";
                case"MM":
                    return d += 1 === a ? "mjesec" : 2 === a || 3 === a || 4 === a ? "mjeseca" : "mjeseci";
                case"yy":
                    return d += 1 === a ? "godina" : 2 === a || 3 === a || 4 === a ? "godine" : "godina"
            }
        }

        return a.lang( "hr", {months: "sječanj_veljača_ožujak_travanj_svibanj_lipanj_srpanj_kolovoz_rujan_listopad_studeni_prosinac".split( "_" ), monthsShort: "sje._vel._ožu._tra._svi._lip._srp._kol._ruj._lis._stu._pro.".split( "_" ), weekdays: "nedjelja_ponedjeljak_utorak_srijeda_četvrtak_petak_subota".split( "_" ), weekdaysShort: "ned._pon._uto._sri._čet._pet._sub.".split( "_" ), weekdaysMin: "ne_po_ut_sr_če_pe_su".split( "_" ), longDateFormat: {LT: "H:mm", L: "DD. MM. YYYY", LL: "D. MMMM YYYY", LLL: "D. MMMM YYYY LT", LLLL: "dddd, D. MMMM YYYY LT"}, calendar: {sameDay: "[danas u] LT", nextDay: "[sutra u] LT", nextWeek: function () {
            switch (this.day()) {
                case 0:
                    return"[u] [nedjelju] [u] LT";
                case 3:
                    return"[u] [srijedu] [u] LT";
                case 6:
                    return"[u] [subotu] [u] LT";
                case 1:
                case 2:
                case 4:
                case 5:
                    return"[u] dddd [u] LT"
            }
        }, lastDay                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                : "[jučer u] LT", lastWeek: function () {
            switch (this.day()) {
                case 0:
                case 3:
                    return"[prošlu] dddd [u] LT";
                case 6:
                    return"[prošle] [subote] [u] LT";
                case 1:
                case 2:
                case 4:
                case 5:
                    return"[prošli] dddd [u] LT"
            }
        }, sameElse                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               : "L"}, relativeTime: {future: "za %s", past: "prije %s", s: "par sekundi", m: b, mm: b, h: b, hh: b, d: "dan", dd: b, M: "mjesec", MM: b, y: "godinu", yy: b}, ordinal: "%d.", week: {dow: 1, doy: 7}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        function b ( a, b, c, d ) {
            var e = a;
            switch (c) {
                case"s":
                    return d || b ? "néhány másodperc" : "néhány másodperce";
                case"m":
                    return"egy" + (d || b ? " perc" : " perce");
                case"mm":
                    return e + (d || b ? " perc" : " perce");
                case"h":
                    return"egy" + (d || b ? " óra" : " órája");
                case"hh":
                    return e + (d || b ? " óra" : " órája");
                case"d":
                    return"egy" + (d || b ? " nap" : " napja");
                case"dd":
                    return e + (d || b ? " nap" : " napja");
                case"M":
                    return"egy" + (d || b ? " hónap" : " hónapja");
                case"MM":
                    return e + (d || b ? " hónap" : " hónapja");
                case"y":
                    return"egy" + (d || b ? " év" : " éve");
                case"yy":
                    return e + (d || b ? " év" : " éve")
            }
            return""
        }

        function c ( a ) {
            return(a ? "" : "[múlt] ") + "[" + d[this.day()] + "] LT[-kor]"
        }

        var d = "vasárnap hétfőn kedden szerdán csütörtökön pénteken szombaton".split( " " );
        return a.lang( "hu", {months: "január_február_március_április_május_június_július_augusztus_szeptember_október_november_december".split( "_" ), monthsShort: "jan_feb_márc_ápr_máj_jún_júl_aug_szept_okt_nov_dec".split( "_" ), weekdays: "vasárnap_hétfő_kedd_szerda_csütörtök_péntek_szombat".split( "_" ), weekdaysShort: "vas_hét_kedd_sze_csüt_pén_szo".split( "_" ), weekdaysMin: "v_h_k_sze_cs_p_szo".split( "_" ), longDateFormat: {LT: "H:mm", L: "YYYY.MM.DD.", LL: "YYYY. MMMM D.", LLL: "YYYY. MMMM D., LT", LLLL: "YYYY. MMMM D., dddd LT"}, calendar: {sameDay: "[ma] LT[-kor]", nextDay: "[holnap] LT[-kor]", nextWeek: function () {
            return c.call( this, !0 )
        }, lastDay                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  : "[tegnap] LT[-kor]", lastWeek: function () {
            return c.call( this, !1 )
        }, sameElse                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 : "L"}, relativeTime: {future: "%s múlva", past: "%s", s: b, m: b, mm: b, h: b, hh: b, d: b, dd: b, M: b, MM: b, y: b, yy: b}, ordinal: "%d.", week: {dow: 1, doy: 7}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        return a.lang( "id", {months: "Januari_Februari_Maret_April_Mei_Juni_Juli_Agustus_September_Oktober_November_Desember".split( "_" ), monthsShort: "Jan_Feb_Mar_Apr_Mei_Jun_Jul_Ags_Sep_Okt_Nov_Des".split( "_" ), weekdays: "Minggu_Senin_Selasa_Rabu_Kamis_Jumat_Sabtu".split( "_" ), weekdaysShort: "Min_Sen_Sel_Rab_Kam_Jum_Sab".split( "_" ), weekdaysMin: "Mg_Sn_Sl_Rb_Km_Jm_Sb".split( "_" ), longDateFormat: {LT: "HH.mm", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY [pukul] LT", LLLL: "dddd, D MMMM YYYY [pukul] LT"}, meridiem: function ( a ) {
            return 11 > a ? "pagi" : 15 > a ? "siang" : 19 > a ? "sore" : "malam"
        }, calendar                 : {sameDay: "[Hari ini pukul] LT", nextDay: "[Besok pukul] LT", nextWeek: "dddd [pukul] LT", lastDay: "[Kemarin pukul] LT", lastWeek: "dddd [lalu pukul] LT", sameElse: "L"}, relativeTime: {future: "dalam %s", past: "%s yang lalu", s: "beberapa detik", m: "semenit", mm: "%d menit", h: "sejam", hh: "%d jam", d: "sehari", dd: "%d hari", M: "sebulan", MM: "%d bulan", y: "setahun", yy: "%d tahun"}, week: {dow: 1, doy: 7}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        function b ( a ) {
            return a % 100 === 11 ? !0 : a % 10 === 1 ? !1 : !0
        }

        function c ( a, c, d, e ) {
            var f = a + " ";
            switch (d) {
                case"s":
                    return c || e ? "nokkrar sekúndur" : "nokkrum sekúndum";
                case"m":
                    return c ? "mínúta" : "mínútu";
                case"mm":
                    return b( a ) ? f + (c || e ? "mínútur" : "mínútum") : c ? f + "mínúta" : f + "mínútu";
                case"hh":
                    return b( a ) ? f + (c || e ? "klukkustundir" : "klukkustundum") : f + "klukkustund";
                case"d":
                    return c ? "dagur" : e ? "dag" : "degi";
                case"dd":
                    return b( a ) ? c ? f + "dagar" : f + (e ? "daga" : "dögum") : c ? f + "dagur" : f + (e ? "dag" : "degi");
                case"M":
                    return c ? "mánuður" : e ? "mánuð" : "mánuði";
                case"MM":
                    return b( a ) ? c ? f + "mánuðir" : f + (e ? "mánuði" : "mánuðum") : c ? f + "mánuður" : f + (e ? "mánuð" : "mánuði");
                case"y":
                    return c || e ? "ár" : "ári";
                case"yy":
                    return b( a ) ? f + (c || e ? "ár" : "árum") : f + (c || e ? "ár" : "ári")
            }
        }

        return a.lang( "is", {months: "janúar_febrúar_mars_apríl_maí_júní_júlí_ágúst_september_október_nóvember_desember".split( "_" ), monthsShort: "jan_feb_mar_apr_maí_jún_júl_ágú_sep_okt_nóv_des".split( "_" ), weekdays: "sunnudagur_mánudagur_þriðjudagur_miðvikudagur_fimmtudagur_föstudagur_laugardagur".split( "_" ), weekdaysShort: "sun_mán_þri_mið_fim_fös_lau".split( "_" ), weekdaysMin: "Su_Má_Þr_Mi_Fi_Fö_La".split( "_" ), longDateFormat: {LT: "H:mm", L: "DD/MM/YYYY", LL: "D. MMMM YYYY", LLL: "D. MMMM YYYY [kl.] LT", LLLL: "dddd, D. MMMM YYYY [kl.] LT"}, calendar: {sameDay: "[í dag kl.] LT", nextDay: "[á morgun kl.] LT", nextWeek: "dddd [kl.] LT", lastDay: "[í gær kl.] LT", lastWeek: "[síðasta] dddd [kl.] LT", sameElse: "L"}, relativeTime: {future: "eftir %s", past: "fyrir %s síðan", s: c, m: c, mm: c, h: "klukkustund", hh: c, d: c, dd: c, M: c, MM: c, y: c, yy: c}, ordinal: "%d.", week: {dow: 1, doy: 4}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        return a.lang( "it", {months: "Gennaio_Febbraio_Marzo_Aprile_Maggio_Giugno_Luglio_Agosto_Settembre_Ottobre_Novembre_Dicembre".split( "_" ), monthsShort: "Gen_Feb_Mar_Apr_Mag_Giu_Lug_Ago_Set_Ott_Nov_Dic".split( "_" ), weekdays: "Domenica_Lunedì_Martedì_Mercoledì_Giovedì_Venerdì_Sabato".split( "_" ), weekdaysShort: "Dom_Lun_Mar_Mer_Gio_Ven_Sab".split( "_" ), weekdaysMin: "D_L_Ma_Me_G_V_S".split( "_" ), longDateFormat: {LT: "HH:mm", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY LT", LLLL: "dddd, D MMMM YYYY LT"}, calendar: {sameDay: "[Oggi alle] LT", nextDay: "[Domani alle] LT", nextWeek: "dddd [alle] LT", lastDay: "[Ieri alle] LT", lastWeek: "[lo scorso] dddd [alle] LT", sameElse: "L"}, relativeTime: {future: function ( a ) {
            return(/^[0-9].+$/.test( a ) ? "tra" : "in") + " " + a
        }, past                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            : "%s fa", s: "alcuni secondi", m: "un minuto", mm: "%d minuti", h: "un'ora", hh: "%d ore", d: "un giorno", dd: "%d giorni", M: "un mese", MM: "%d mesi", y: "un anno", yy: "%d anni"}, ordinal: "%dº", week: {dow: 1, doy: 4}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        return a.lang( "ja", {months: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split( "_" ), monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split( "_" ), weekdays: "日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日".split( "_" ), weekdaysShort: "日_月_火_水_木_金_土".split( "_" ), weekdaysMin: "日_月_火_水_木_金_土".split( "_" ), longDateFormat: {LT: "Ah時m分", L: "YYYY/MM/DD", LL: "YYYY年M月D日", LLL: "YYYY年M月D日LT", LLLL: "YYYY年M月D日LT dddd"}, meridiem: function ( a ) {
            return 12 > a ? "午前" : "午後"
        }, calendar                 : {sameDay: "[今日] LT", nextDay: "[明日] LT", nextWeek: "[来週]dddd LT", lastDay: "[昨日] LT", lastWeek: "[前週]dddd LT", sameElse: "L"}, relativeTime: {future: "%s後", past: "%s前", s: "数秒", m: "1分", mm: "%d分", h: "1時間", hh: "%d時間", d: "1日", dd: "%d日", M: "1ヶ月", MM: "%dヶ月", y: "1年", yy: "%d年"}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        function b ( a, b ) {
            var c = {nominative: "იანვარი_თებერვალი_მარტი_აპრილი_მაისი_ივნისი_ივლისი_აგვისტო_სექტემბერი_ოქტომბერი_ნოემბერი_დეკემბერი".split( "_" ), accusative: "იანვარს_თებერვალს_მარტს_აპრილის_მაისს_ივნისს_ივლისს_აგვისტს_სექტემბერს_ოქტომბერს_ნოემბერს_დეკემბერს".split( "_" )}, d = /D[oD] *MMMM?/.test( b ) ? "accusative" : "nominative";
            return c[d][a.month()]
        }

        function c ( a, b ) {
            var c = {nominative: "კვირა_ორშაბათი_სამშაბათი_ოთხშაბათი_ხუთშაბათი_პარასკევი_შაბათი".split( "_" ), accusative: "კვირას_ორშაბათს_სამშაბათს_ოთხშაბათს_ხუთშაბათს_პარასკევს_შაბათს".split( "_" )}, d = /(წინა|შემდეგ)/.test( b ) ? "accusative" : "nominative";
            return c[d][a.day()]
        }

        return a.lang( "ka", {months: b, monthsShort: "იან_თებ_მარ_აპრ_მაი_ივნ_ივლ_აგვ_სექ_ოქტ_ნოე_დეკ".split( "_" ), weekdays: c, weekdaysShort: "კვი_ორშ_სამ_ოთხ_ხუთ_პარ_შაბ".split( "_" ), weekdaysMin: "კვ_ორ_სა_ოთ_ხუ_პა_შა".split( "_" ), longDateFormat: {LT: "h:mm A", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY LT", LLLL: "dddd, D MMMM YYYY LT"}, calendar: {sameDay: "[დღეს] LT[-ზე]", nextDay: "[ხვალ] LT[-ზე]", lastDay: "[გუშინ] LT[-ზე]", nextWeek: "[შემდეგ] dddd LT[-ზე]", lastWeek: "[წინა] dddd LT-ზე", sameElse: "L"}, relativeTime: {future: function ( a ) {
            return/(წამი|წუთი|საათი|წელი)/.test( a ) ? a.replace( /ი$/, "ში" ) : a + "ში"
        }, past                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              : function ( a ) {
            return/(წამი|წუთი|საათი|დღე|თვე)/.test( a ) ? a.replace( /(ი|ე)$/, "ის წინ" ) : /წელი/.test( a ) ? a.replace( /წელი$/, "წლის წინ" ) : void 0
        }, s                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 : "რამდენიმე წამი", m: "წუთი", mm: "%d წუთი", h: "საათი", hh: "%d საათი", d: "დღე", dd: "%d დღე", M: "თვე", MM: "%d თვე", y: "წელი", yy: "%d წელი"}, ordinal: function ( a ) {
            return 0 === a ? a : 1 === a ? a + "-ლი" : 20 > a || 100 >= a && a % 20 === 0 || a % 100 === 0 ? "მე-" + a : a + "-ე"
        }, week: {dow: 1, doy: 7}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        return a.lang( "ko", {months: "1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split( "_" ), monthsShort: "1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split( "_" ), weekdays: "일요일_월요일_화요일_수요일_목요일_금요일_토요일".split( "_" ), weekdaysShort: "일_월_화_수_목_금_토".split( "_" ), weekdaysMin: "일_월_화_수_목_금_토".split( "_" ), longDateFormat: {LT: "A h시 mm분", L: "YYYY.MM.DD", LL: "YYYY년 MMMM D일", LLL: "YYYY년 MMMM D일 LT", LLLL: "YYYY년 MMMM D일 dddd LT"}, meridiem: function ( a ) {
            return 12 > a ? "오전" : "오후"
        }, calendar                 : {sameDay: "오늘 LT", nextDay: "내일 LT", nextWeek: "dddd LT", lastDay: "어제 LT", lastWeek: "지난주 dddd LT", sameElse: "L"}, relativeTime: {future: "%s 후", past: "%s 전", s: "몇초", ss: "%d초", m: "일분", mm: "%d분", h: "한시간", hh: "%d시간", d: "하루", dd: "%d일", M: "한달", MM: "%d달", y: "일년", yy: "%d년"}, ordinal: "%d일", meridiemParse: /(오전|오후)/, isPM: function ( a ) {
            return"오후" === a
        }} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        function b ( a, b, c ) {
            var d = {m: ["eng Minutt", "enger Minutt"], h: ["eng Stonn", "enger Stonn"], d: ["een Dag", "engem Dag"], dd: [a + " Deeg", a + " Deeg"], M: ["ee Mount", "engem Mount"], MM: [a + " Méint", a + " Méint"], y: ["ee Joer", "engem Joer"], yy: [a + " Joer", a + " Joer"]};
            return b ? d[c][0] : d[c][1]
        }

        function c ( a ) {
            var b = a.substr( 0, a.indexOf( " " ) );
            return g( b ) ? "a " + a : "an " + a
        }

        function d ( a ) {
            var b = a.substr( 0, a.indexOf( " " ) );
            return g( b ) ? "viru " + a : "virun " + a
        }

        function e () {
            var a = this.format( "d" );
            return f( a ) ? "[Leschte] dddd [um] LT" : "[Leschten] dddd [um] LT"
        }

        function f ( a ) {
            switch (a = parseInt( a, 10 )) {
                case 0:
                case 1:
                case 3:
                case 5:
                case 6:
                    return!0;
                default:
                    return!1
            }
        }

        function g ( a ) {
            if (a = parseInt( a, 10 ), isNaN( a ))return!1;
            if (0 > a)return!0;
            if (10 > a)return a >= 4 && 7 >= a ? !0 : !1;
            if (100 > a) {
                var b = a % 10, c = a / 10;
                return 0 === b ? g( c ) : g( b )
            }
            if (1e4 > a) {
                for (; a >= 10;)a /= 10;
                return g( a )
            }
            return a /= 1e3, g( a )
        }

        return a.lang( "lb", {months: "Januar_Februar_Mäerz_Abrëll_Mee_Juni_Juli_August_September_Oktober_November_Dezember".split( "_" ), monthsShort: "Jan._Febr._Mrz._Abr._Mee_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split( "_" ), weekdays: "Sonndeg_Méindeg_Dënschdeg_Mëttwoch_Donneschdeg_Freideg_Samschdeg".split( "_" ), weekdaysShort: "So._Mé._Dë._Më._Do._Fr._Sa.".split( "_" ), weekdaysMin: "So_Mé_Dë_Më_Do_Fr_Sa".split( "_" ), longDateFormat: {LT: "H:mm [Auer]", L: "DD.MM.YYYY", LL: "D. MMMM YYYY", LLL: "D. MMMM YYYY LT", LLLL: "dddd, D. MMMM YYYY LT"}, calendar: {sameDay: "[Haut um] LT", sameElse: "L", nextDay: "[Muer um] LT", nextWeek: "dddd [um] LT", lastDay: "[Gëschter um] LT", lastWeek: e}, relativeTime: {future: c, past: d, s: "e puer Sekonnen", m: b, mm: "%d Minutten", h: b, hh: "%d Stonnen", d: b, dd: b, M: b, MM: b, y: b, yy: b}, ordinal: "%d.", week: {dow: 1, doy: 4}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        function b ( a, b, c, d ) {
            return b ? "kelios sekundės" : d ? "kelių sekundžių" : "kelias sekundes"
        }

        function c ( a, b, c, d ) {
            return b ? e( c )[0] : d ? e( c )[1] : e( c )[2]
        }

        function d ( a ) {
            return a % 10 === 0 || a > 10 && 20 > a
        }

        function e ( a ) {
            return h[a].split( "_" )
        }

        function f ( a, b, f, g ) {
            var h = a + " ";
            return 1 === a ? h + c( a, b, f[0], g ) : b ? h + (d( a ) ? e( f )[1] : e( f )[0]) : g ? h + e( f )[1] : h + (d( a ) ? e( f )[1] : e( f )[2])
        }

        function g ( a, b ) {
            var c = -1 === b.indexOf( "dddd LT" ), d = i[a.weekday()];
            return c ? d : d.substring( 0, d.length - 2 ) + "į"
        }

        var h = {m: "minutė_minutės_minutę", mm: "minutės_minučių_minutes", h: "valanda_valandos_valandą", hh: "valandos_valandų_valandas", d: "diena_dienos_dieną", dd: "dienos_dienų_dienas", M: "mėnuo_mėnesio_mėnesį", MM: "mėnesiai_mėnesių_mėnesius", y: "metai_metų_metus", yy: "metai_metų_metus"}, i = "pirmadienis_antradienis_trečiadienis_ketvirtadienis_penktadienis_šeštadienis_sekmadienis".split( "_" );
        return a.lang( "lt", {months: "sausio_vasario_kovo_balandžio_gegužės_biržėlio_liepos_rugpjūčio_rugsėjo_spalio_lapkričio_gruodžio".split( "_" ), monthsShort: "sau_vas_kov_bal_geg_bir_lie_rgp_rgs_spa_lap_grd".split( "_" ), weekdays: g, weekdaysShort: "Sek_Pir_Ant_Tre_Ket_Pen_Šeš".split( "_" ), weekdaysMin: "S_P_A_T_K_Pn_Š".split( "_" ), longDateFormat: {LT: "HH:mm", L: "YYYY-MM-DD", LL: "YYYY [m.] MMMM D [d.]", LLL: "YYYY [m.] MMMM D [d.], LT [val.]", LLLL: "YYYY [m.] MMMM D [d.], dddd, LT [val.]", l: "YYYY-MM-DD", ll: "YYYY [m.] MMMM D [d.]", lll: "YYYY [m.] MMMM D [d.], LT [val.]", llll: "YYYY [m.] MMMM D [d.], ddd, LT [val.]"}, calendar: {sameDay: "[Šiandien] LT", nextDay: "[Rytoj] LT", nextWeek: "dddd LT", lastDay: "[Vakar] LT", lastWeek: "[Praėjusį] dddd LT", sameElse: "L"}, relativeTime: {future: "po %s", past: "prieš %s", s: b, m: c, mm: f, h: c, hh: f, d: c, dd: f, M: c, MM: f, y: c, yy: f}, ordinal: function ( a ) {
            return a + "-oji"
        }, week                     : {dow: 1, doy: 4}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        function b ( a, b, c ) {
            var d = a.split( "_" );
            return c ? b % 10 === 1 && 11 !== b ? d[2] : d[3] : b % 10 === 1 && 11 !== b ? d[0] : d[1]
        }

        function c ( a, c, e ) {
            return a + " " + b( d[e], a, c )
        }

        var d = {mm: "minūti_minūtes_minūte_minūtes", hh: "stundu_stundas_stunda_stundas", dd: "dienu_dienas_diena_dienas", MM: "mēnesi_mēnešus_mēnesis_mēneši", yy: "gadu_gadus_gads_gadi"};
        return a.lang( "lv", {months: "janvāris_februāris_marts_aprīlis_maijs_jūnijs_jūlijs_augusts_septembris_oktobris_novembris_decembris".split( "_" ), monthsShort: "jan_feb_mar_apr_mai_jūn_jūl_aug_sep_okt_nov_dec".split( "_" ), weekdays: "svētdiena_pirmdiena_otrdiena_trešdiena_ceturtdiena_piektdiena_sestdiena".split( "_" ), weekdaysShort: "Sv_P_O_T_C_Pk_S".split( "_" ), weekdaysMin: "Sv_P_O_T_C_Pk_S".split( "_" ), longDateFormat: {LT: "HH:mm", L: "DD.MM.YYYY", LL: "YYYY. [gada] D. MMMM", LLL: "YYYY. [gada] D. MMMM, LT", LLLL: "YYYY. [gada] D. MMMM, dddd, LT"}, calendar: {sameDay: "[Šodien pulksten] LT", nextDay: "[Rīt pulksten] LT", nextWeek: "dddd [pulksten] LT", lastDay: "[Vakar pulksten] LT", lastWeek: "[Pagājušā] dddd [pulksten] LT", sameElse: "L"}, relativeTime: {future: "%s vēlāk", past: "%s agrāk", s: "dažas sekundes", m: "minūti", mm: c, h: "stundu", hh: c, d: "dienu", dd: c, M: "mēnesi", MM: c, y: "gadu", yy: c}, ordinal: "%d.", week: {dow: 1, doy: 4}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        return a.lang( "mk", {months: "јануари_февруари_март_април_мај_јуни_јули_август_септември_октомври_ноември_декември".split( "_" ), monthsShort: "јан_фев_мар_апр_мај_јун_јул_авг_сеп_окт_ное_дек".split( "_" ), weekdays: "недела_понеделник_вторник_среда_четврток_петок_сабота".split( "_" ), weekdaysShort: "нед_пон_вто_сре_чет_пет_саб".split( "_" ), weekdaysMin: "нe_пo_вт_ср_че_пе_сa".split( "_" ), longDateFormat: {LT: "H:mm", L: "D.MM.YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY LT", LLLL: "dddd, D MMMM YYYY LT"}, calendar: {sameDay: "[Денес во] LT", nextDay: "[Утре во] LT", nextWeek: "dddd [во] LT", lastDay: "[Вчера во] LT", lastWeek: function () {
            switch (this.day()) {
                case 0:
                case 3:
                case 6:
                    return"[Во изминатата] dddd [во] LT";
                case 1:
                case 2:
                case 4:
                case 5:
                    return"[Во изминатиот] dddd [во] LT"
            }
        }, sameElse                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          : "L"}, relativeTime: {future: "после %s", past: "пред %s", s: "неколку секунди", m: "минута", mm: "%d минути", h: "час", hh: "%d часа", d: "ден", dd: "%d дена", M: "месец", MM: "%d месеци", y: "година", yy: "%d години"}, ordinal: function ( a ) {
            var b = a % 10, c = a % 100;
            return 0 === a ? a + "-ев" : 0 === c ? a + "-ен" : c > 10 && 20 > c ? a + "-ти" : 1 === b ? a + "-ви" : 2 === b ? a + "-ри" : 7 === b || 8 === b ? a + "-ми" : a + "-ти"
        }, week: {dow: 1, doy: 7}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        return a.lang( "ml", {months: "ജനുവരി_ഫെബ്രുവരി_മാർച്ച്_ഏപ്രിൽ_മേയ്_ജൂൺ_ജൂലൈ_ഓഗസ്റ്റ്_സെപ്റ്റംബർ_ഒക്ടോബർ_നവംബർ_ഡിസംബർ".split( "_" ), monthsShort: "ജനു._ഫെബ്രു._മാർ._ഏപ്രി._മേയ്_ജൂൺ_ജൂലൈ._ഓഗ._സെപ്റ്റ._ഒക്ടോ._നവം._ഡിസം.".split( "_" ), weekdays: "ഞായറാഴ്ച_തിങ്കളാഴ്ച_ചൊവ്വാഴ്ച_ബുധനാഴ്ച_വ്യാഴാഴ്ച_വെള്ളിയാഴ്ച_ശനിയാഴ്ച".split( "_" ), weekdaysShort: "ഞായർ_തിങ്കൾ_ചൊവ്വ_ബുധൻ_വ്യാഴം_വെള്ളി_ശനി".split( "_" ), weekdaysMin: "ഞാ_തി_ചൊ_ബു_വ്യാ_വെ_ശ".split( "_" ), longDateFormat: {LT: "A h:mm -നു", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY, LT", LLLL: "dddd, D MMMM YYYY, LT"}, calendar: {sameDay: "[ഇന്ന്] LT", nextDay: "[നാളെ] LT", nextWeek: "dddd, LT", lastDay: "[ഇന്നലെ] LT", lastWeek: "[കഴിഞ്ഞ] dddd, LT", sameElse: "L"}, relativeTime: {future: "%s കഴിഞ്ഞ്", past: "%s മുൻപ്", s: "അൽപ നിമിഷങ്ങൾ", m: "ഒരു മിനിറ്റ്", mm: "%d മിനിറ്റ്", h: "ഒരു മണിക്കൂർ", hh: "%d മണിക്കൂർ", d: "ഒരു ദിവസം", dd: "%d ദിവസം", M: "ഒരു മാസം", MM: "%d മാസം", y: "ഒരു വർഷം", yy: "%d വർഷം"}, meridiem: function ( a ) {
            return 4 > a ? "രാത്രി" : 12 > a ? "രാവിലെ" : 17 > a ? "ഉച്ച കഴിഞ്ഞ്" : 20 > a ? "വൈകുന്നേരം" : "രാത്രി"
        }} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        var b = {1: "१", 2: "२", 3: "३", 4: "४", 5: "५", 6: "६", 7: "७", 8: "८", 9: "९", 0: "०"}, c = {"१": "1", "२": "2", "३": "3", "४": "4", "५": "5", "६": "6", "७": "7", "८": "8", "९": "9", "०": "0"};
        return a.lang( "mr", {months: "जानेवारी_फेब्रुवारी_मार्च_एप्रिल_मे_जून_जुलै_ऑगस्ट_सप्टेंबर_ऑक्टोबर_नोव्हेंबर_डिसेंबर".split( "_" ), monthsShort: "जाने._फेब्रु._मार्च._एप्रि._मे._जून._जुलै._ऑग._सप्टें._ऑक्टो._नोव्हें._डिसें.".split( "_" ), weekdays: "रविवार_सोमवार_मंगळवार_बुधवार_गुरूवार_शुक्रवार_शनिवार".split( "_" ), weekdaysShort: "रवि_सोम_मंगळ_बुध_गुरू_शुक्र_शनि".split( "_" ), weekdaysMin: "र_सो_मं_बु_गु_शु_श".split( "_" ), longDateFormat: {LT: "A h:mm वाजता", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY, LT", LLLL: "dddd, D MMMM YYYY, LT"}, calendar: {sameDay: "[आज] LT", nextDay: "[उद्या] LT", nextWeek: "dddd, LT", lastDay: "[काल] LT", lastWeek: "[मागील] dddd, LT", sameElse: "L"}, relativeTime: {future: "%s नंतर", past: "%s पूर्वी", s: "सेकंद", m: "एक मिनिट", mm: "%d मिनिटे", h: "एक तास", hh: "%d तास", d: "एक दिवस", dd: "%d दिवस", M: "एक महिना", MM: "%d महिने", y: "एक वर्ष", yy: "%d वर्षे"}, preparse: function ( a ) {
            return a.replace( /[१२३४५६७८९०]/g, function ( a ) {
                return c[a]
            } )
        }, postformat               : function ( a ) {
            return a.replace( /\d/g, function ( a ) {
                return b[a]
            } )
        }, meridiem                 : function ( a ) {
            return 4 > a ? "रात्री" : 10 > a ? "सकाळी" : 17 > a ? "दुपारी" : 20 > a ? "सायंकाळी" : "रात्री"
        }, week                     : {dow: 0, doy: 6}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        return a.lang( "ms-my", {months: "Januari_Februari_Mac_April_Mei_Jun_Julai_Ogos_September_Oktober_November_Disember".split( "_" ), monthsShort: "Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ogs_Sep_Okt_Nov_Dis".split( "_" ), weekdays: "Ahad_Isnin_Selasa_Rabu_Khamis_Jumaat_Sabtu".split( "_" ), weekdaysShort: "Ahd_Isn_Sel_Rab_Kha_Jum_Sab".split( "_" ), weekdaysMin: "Ah_Is_Sl_Rb_Km_Jm_Sb".split( "_" ), longDateFormat: {LT: "HH.mm", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY [pukul] LT", LLLL: "dddd, D MMMM YYYY [pukul] LT"}, meridiem: function ( a ) {
            return 11 > a ? "pagi" : 15 > a ? "tengahari" : 19 > a ? "petang" : "malam"
        }, calendar                    : {sameDay: "[Hari ini pukul] LT", nextDay: "[Esok pukul] LT", nextWeek: "dddd [pukul] LT", lastDay: "[Kelmarin pukul] LT", lastWeek: "dddd [lepas pukul] LT", sameElse: "L"}, relativeTime: {future: "dalam %s", past: "%s yang lepas", s: "beberapa saat", m: "seminit", mm: "%d minit", h: "sejam", hh: "%d jam", d: "sehari", dd: "%d hari", M: "sebulan", MM: "%d bulan", y: "setahun", yy: "%d tahun"}, week: {dow: 1, doy: 7}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        return a.lang( "nb", {months: "januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split( "_" ), monthsShort: "jan._feb._mars_april_mai_juni_juli_aug._sep._okt._nov._des.".split( "_" ), weekdays: "søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag".split( "_" ), weekdaysShort: "sø._ma._ti._on._to._fr._lø.".split( "_" ), weekdaysMin: "sø_ma_ti_on_to_fr_lø".split( "_" ), longDateFormat: {LT: "H.mm", L: "DD.MM.YYYY", LL: "D. MMMM YYYY", LLL: "D. MMMM YYYY [kl.] LT", LLLL: "dddd D. MMMM YYYY [kl.] LT"}, calendar: {sameDay: "[i dag kl.] LT", nextDay: "[i morgen kl.] LT", nextWeek: "dddd [kl.] LT", lastDay: "[i går kl.] LT", lastWeek: "[forrige] dddd [kl.] LT", sameElse: "L"}, relativeTime: {future: "om %s", past: "for %s siden", s: "noen sekunder", m: "ett minutt", mm: "%d minutter", h: "en time", hh: "%d timer", d: "en dag", dd: "%d dager", M: "en måned", MM: "%d måneder", y: "ett år", yy: "%d år"}, ordinal: "%d.", week: {dow: 1, doy: 4}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        var b = {1: "१", 2: "२", 3: "३", 4: "४", 5: "५", 6: "६", 7: "७", 8: "८", 9: "९", 0: "०"}, c = {"१": "1", "२": "2", "३": "3", "४": "4", "५": "5", "६": "6", "७": "7", "८": "8", "९": "9", "०": "0"};
        return a.lang( "ne", {months: "जनवरी_फेब्रुवरी_मार्च_अप्रिल_मई_जुन_जुलाई_अगष्ट_सेप्टेम्बर_अक्टोबर_नोभेम्बर_डिसेम्बर".split( "_" ), monthsShort: "जन._फेब्रु._मार्च_अप्रि._मई_जुन_जुलाई._अग._सेप्ट._अक्टो._नोभे._डिसे.".split( "_" ), weekdays: "आइतबार_सोमबार_मङ्गलबार_बुधबार_बिहिबार_शुक्रबार_शनिबार".split( "_" ), weekdaysShort: "आइत._सोम._मङ्गल._बुध._बिहि._शुक्र._शनि.".split( "_" ), weekdaysMin: "आइ._सो._मङ्_बु._बि._शु._श.".split( "_" ), longDateFormat: {LT: "Aको h:mm बजे", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY, LT", LLLL: "dddd, D MMMM YYYY, LT"}, preparse: function ( a ) {
            return a.replace( /[१२३४५६७८९०]/g, function ( a ) {
                return c[a]
            } )
        }, postformat               : function ( a ) {
            return a.replace( /\d/g, function ( a ) {
                return b[a]
            } )
        }, meridiem                 : function ( a ) {
            return 3 > a ? "राती" : 10 > a ? "बिहान" : 15 > a ? "दिउँसो" : 18 > a ? "बेलुका" : 20 > a ? "साँझ" : "राती"
        }, calendar                 : {sameDay: "[आज] LT", nextDay: "[भोली] LT", nextWeek: "[आउँदो] dddd[,] LT", lastDay: "[हिजो] LT", lastWeek: "[गएको] dddd[,] LT", sameElse: "L"}, relativeTime: {future: "%sमा", past: "%s अगाडी", s: "केही समय", m: "एक मिनेट", mm: "%d मिनेट", h: "एक घण्टा", hh: "%d घण्टा", d: "एक दिन", dd: "%d दिन", M: "एक महिना", MM: "%d महिना", y: "एक बर्ष", yy: "%d बर्ष"}, week: {dow: 1, doy: 7}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        var b = "jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.".split( "_" ), c = "jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec".split( "_" );
        return a.lang( "nl", {months: "januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december".split( "_" ), monthsShort: function ( a, d ) {
            return/-MMM-/.test( d ) ? c[a.month()] : b[a.month()]
        }, weekdays                 : "zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag".split( "_" ), weekdaysShort: "zo._ma._di._wo._do._vr._za.".split( "_" ), weekdaysMin: "Zo_Ma_Di_Wo_Do_Vr_Za".split( "_" ), longDateFormat: {LT: "HH:mm", L: "DD-MM-YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY LT", LLLL: "dddd D MMMM YYYY LT"}, calendar: {sameDay: "[vandaag om] LT", nextDay: "[morgen om] LT", nextWeek: "dddd [om] LT", lastDay: "[gisteren om] LT", lastWeek: "[afgelopen] dddd [om] LT", sameElse: "L"}, relativeTime: {future: "over %s", past: "%s geleden", s: "een paar seconden", m: "één minuut", mm: "%d minuten", h: "één uur", hh: "%d uur", d: "één dag", dd: "%d dagen", M: "één maand", MM: "%d maanden", y: "één jaar", yy: "%d jaar"}, ordinal: function ( a ) {
            return a + (1 === a || 8 === a || a >= 20 ? "ste" : "de")
        }, week                     : {dow: 1, doy: 4}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        return a.lang( "nn", {months: "januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split( "_" ), monthsShort: "jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split( "_" ), weekdays: "sundag_måndag_tysdag_onsdag_torsdag_fredag_laurdag".split( "_" ), weekdaysShort: "sun_mån_tys_ons_tor_fre_lau".split( "_" ), weekdaysMin: "su_må_ty_on_to_fr_lø".split( "_" ), longDateFormat: {LT: "HH:mm", L: "DD.MM.YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY LT", LLLL: "dddd D MMMM YYYY LT"}, calendar: {sameDay: "[I dag klokka] LT", nextDay: "[I morgon klokka] LT", nextWeek: "dddd [klokka] LT", lastDay: "[I går klokka] LT", lastWeek: "[Føregående] dddd [klokka] LT", sameElse: "L"}, relativeTime: {future: "om %s", past: "for %s siden", s: "noen sekund", m: "ett minutt", mm: "%d minutt", h: "en time", hh: "%d timar", d: "en dag", dd: "%d dagar", M: "en månad", MM: "%d månader", y: "ett år", yy: "%d år"}, ordinal: "%d.", week: {dow: 1, doy: 4}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        function b ( a ) {
            return 5 > a % 10 && a % 10 > 1 && ~~(a / 10) % 10 !== 1
        }

        function c ( a, c, d ) {
            var e = a + " ";
            switch (d) {
                case"m":
                    return c ? "minuta" : "minutę";
                case"mm":
                    return e + (b( a ) ? "minuty" : "minut");
                case"h":
                    return c ? "godzina" : "godzinę";
                case"hh":
                    return e + (b( a ) ? "godziny" : "godzin");
                case"MM":
                    return e + (b( a ) ? "miesiące" : "miesięcy");
                case"yy":
                    return e + (b( a ) ? "lata" : "lat")
            }
        }

        var d = "styczeń_luty_marzec_kwiecień_maj_czerwiec_lipiec_sierpień_wrzesień_październik_listopad_grudzień".split( "_" ), e = "stycznia_lutego_marca_kwietnia_maja_czerwca_lipca_sierpnia_września_października_listopada_grudnia".split( "_" );
        return a.lang( "pl", {months: function ( a, b ) {
            return/D MMMM/.test( b ) ? e[a.month()] : d[a.month()]
        }, monthsShort: "sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru".split( "_" ), weekdays: "niedziela_poniedziałek_wtorek_środa_czwartek_piątek_sobota".split( "_" ), weekdaysShort: "nie_pon_wt_śr_czw_pt_sb".split( "_" ), weekdaysMin: "N_Pn_Wt_Śr_Cz_Pt_So".split( "_" ), longDateFormat: {LT: "HH:mm", L: "DD.MM.YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY LT", LLLL: "dddd, D MMMM YYYY LT"}, calendar: {sameDay: "[Dziś o] LT", nextDay: "[Jutro o] LT", nextWeek: "[W] dddd [o] LT", lastDay: "[Wczoraj o] LT", lastWeek: function () {
            switch (this.day()) {
                case 0:
                    return"[W zeszłą niedzielę o] LT";
                case 3:
                    return"[W zeszłą środę o] LT";
                case 6:
                    return"[W zeszłą sobotę o] LT";
                default:
                    return"[W zeszły] dddd [o] LT"
            }
        }, sameElse                                                                                                                                                                                                                                                                                                                                                                                                            : "L"}, relativeTime: {future: "za %s", past: "%s temu", s: "kilka sekund", m: c, mm: c, h: c, hh: c, d: "1 dzień", dd: "%d dni", M: "miesiąc", MM: c, y: "rok", yy: c}, ordinal: "%d.", week: {dow: 1, doy: 4}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        return a.lang( "pt-br", {months: "Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro".split( "_" ), monthsShort: "Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez".split( "_" ), weekdays: "Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado".split( "_" ), weekdaysShort: "Dom_Seg_Ter_Qua_Qui_Sex_Sáb".split( "_" ), weekdaysMin: "Dom_2ª_3ª_4ª_5ª_6ª_Sáb".split( "_" ), longDateFormat: {LT: "HH:mm", L: "DD/MM/YYYY", LL: "D [de] MMMM [de] YYYY", LLL: "D [de] MMMM [de] YYYY LT", LLLL: "dddd, D [de] MMMM [de] YYYY LT"}, calendar: {sameDay: "[Hoje às] LT", nextDay: "[Amanhã às] LT", nextWeek: "dddd [às] LT", lastDay: "[Ontem às] LT", lastWeek: function () {
            return 0 === this.day() || 6 === this.day() ? "[Último] dddd [às] LT" : "[Última] dddd [às] LT"
        }, sameElse                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            : "L"}, relativeTime: {future: "em %s", past: "%s atrás", s: "segundos", m: "um minuto", mm: "%d minutos", h: "uma hora", hh: "%d horas", d: "um dia", dd: "%d dias", M: "um mês", MM: "%d meses", y: "um ano", yy: "%d anos"}, ordinal: "%dº"} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        return a.lang( "pt", {months: "Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro".split( "_" ), monthsShort: "Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez".split( "_" ), weekdays: "Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado".split( "_" ), weekdaysShort: "Dom_Seg_Ter_Qua_Qui_Sex_Sáb".split( "_" ), weekdaysMin: "Dom_2ª_3ª_4ª_5ª_6ª_Sáb".split( "_" ), longDateFormat: {LT: "HH:mm", L: "DD/MM/YYYY", LL: "D [de] MMMM [de] YYYY", LLL: "D [de] MMMM [de] YYYY LT", LLLL: "dddd, D [de] MMMM [de] YYYY LT"}, calendar: {sameDay: "[Hoje às] LT", nextDay: "[Amanhã às] LT", nextWeek: "dddd [às] LT", lastDay: "[Ontem às] LT", lastWeek: function () {
            return 0 === this.day() || 6 === this.day() ? "[Último] dddd [às] LT" : "[Última] dddd [às] LT"
        }, sameElse                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         : "L"}, relativeTime: {future: "em %s", past: "%s atrás", s: "segundos", m: "um minuto", mm: "%d minutos", h: "uma hora", hh: "%d horas", d: "um dia", dd: "%d dias", M: "um mês", MM: "%d meses", y: "um ano", yy: "%d anos"}, ordinal: "%dº", week: {dow: 1, doy: 4}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        function b ( a, b, c ) {
            var d = {mm: "minute", hh: "ore", dd: "zile", MM: "luni", yy: "ani"}, e = " ";
            return(a % 100 >= 20 || a >= 100 && a % 100 === 0) && (e = " de "), a + e + d[c]
        }

        return a.lang( "ro", {months: "ianuarie_februarie_martie_aprilie_mai_iunie_iulie_august_septembrie_octombrie_noiembrie_decembrie".split( "_" ), monthsShort: "ian_feb_mar_apr_mai_iun_iul_aug_sep_oct_noi_dec".split( "_" ), weekdays: "duminică_luni_marți_miercuri_joi_vineri_sâmbătă".split( "_" ), weekdaysShort: "Dum_Lun_Mar_Mie_Joi_Vin_Sâm".split( "_" ), weekdaysMin: "Du_Lu_Ma_Mi_Jo_Vi_Sâ".split( "_" ), longDateFormat: {LT: "H:mm", L: "DD.MM.YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY H:mm", LLLL: "dddd, D MMMM YYYY H:mm"}, calendar: {sameDay: "[azi la] LT", nextDay: "[mâine la] LT", nextWeek: "dddd [la] LT", lastDay: "[ieri la] LT", lastWeek: "[fosta] dddd [la] LT", sameElse: "L"}, relativeTime: {future: "peste %s", past: "%s în urmă", s: "câteva secunde", m: "un minut", mm: b, h: "o oră", hh: b, d: "o zi", dd: b, M: "o lună", MM: b, y: "un an", yy: b}, week: {dow: 1, doy: 7}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        function b ( a, b, c ) {
            var d = a + " ";
            switch (c) {
                case"m":
                    return b ? "jedna minuta" : "jedne minute";
                case"mm":
                    return d += 1 === a ? "minuta" : 2 === a || 3 === a || 4 === a ? "minute" : "minuta";
                case"h":
                    return b ? "jedan sat" : "jednog sata";
                case"hh":
                    return d += 1 === a ? "sat" : 2 === a || 3 === a || 4 === a ? "sata" : "sati";
                case"dd":
                    return d += 1 === a ? "dan" : "dana";
                case"MM":
                    return d += 1 === a ? "mesec" : 2 === a || 3 === a || 4 === a ? "meseca" : "meseci";
                case"yy":
                    return d += 1 === a ? "godina" : 2 === a || 3 === a || 4 === a ? "godine" : "godina"
            }
        }

        return a.lang( "rs", {months: "januar_februar_mart_april_maj_jun_jul_avgust_septembar_oktobar_novembar_decembar".split( "_" ), monthsShort: "jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.".split( "_" ), weekdays: "nedelja_ponedeljak_utorak_sreda_četvrtak_petak_subota".split( "_" ), weekdaysShort: "ned._pon._uto._sre._čet._pet._sub.".split( "_" ), weekdaysMin: "ne_po_ut_sr_če_pe_su".split( "_" ), longDateFormat: {LT: "H:mm", L: "DD. MM. YYYY", LL: "D. MMMM YYYY", LLL: "D. MMMM YYYY LT", LLLL: "dddd, D. MMMM YYYY LT"}, calendar: {sameDay: "[danas u] LT", nextDay: "[sutra u] LT", nextWeek: function () {
            switch (this.day()) {
                case 0:
                    return"[u] [nedelju] [u] LT";
                case 3:
                    return"[u] [sredu] [u] LT";
                case 6:
                    return"[u] [subotu] [u] LT";
                case 1:
                case 2:
                case 4:
                case 5:
                    return"[u] dddd [u] LT"
            }
        }, lastDay                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                : "[juče u] LT", lastWeek: function () {
            switch (this.day()) {
                case 0:
                case 3:
                    return"[prošlu] dddd [u] LT";
                case 6:
                    return"[prošle] [subote] [u] LT";
                case 1:
                case 2:
                case 4:
                case 5:
                    return"[prošli] dddd [u] LT"
            }
        }, sameElse                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               : "L"}, relativeTime: {future: "za %s", past: "pre %s", s: "par sekundi", m: b, mm: b, h: b, hh: b, d: "dan", dd: b, M: "mesec", MM: b, y: "godinu", yy: b}, ordinal: "%d.", week: {dow: 1, doy: 7}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        function b ( a, b ) {
            var c = a.split( "_" );
            return b % 10 === 1 && b % 100 !== 11 ? c[0] : b % 10 >= 2 && 4 >= b % 10 && (10 > b % 100 || b % 100 >= 20) ? c[1] : c[2]
        }

        function c ( a, c, d ) {
            var e = {mm: "минута_минуты_минут", hh: "час_часа_часов", dd: "день_дня_дней", MM: "месяц_месяца_месяцев", yy: "год_года_лет"};
            return"m" === d ? c ? "минута" : "минуту" : a + " " + b( e[d], +a )
        }

        function d ( a, b ) {
            var c = {nominative: "январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split( "_" ), accusative: "января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря".split( "_" )}, d = /D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/.test( b ) ? "accusative" : "nominative";
            return c[d][a.month()]
        }

        function e ( a, b ) {
            var c = {nominative: "янв_фев_мар_апр_май_июнь_июль_авг_сен_окт_ноя_дек".split( "_" ), accusative: "янв_фев_мар_апр_мая_июня_июля_авг_сен_окт_ноя_дек".split( "_" )}, d = /D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/.test( b ) ? "accusative" : "nominative";
            return c[d][a.month()]
        }

        function f ( a, b ) {
            var c = {nominative: "воскресенье_понедельник_вторник_среда_четверг_пятница_суббота".split( "_" ), accusative: "воскресенье_понедельник_вторник_среду_четверг_пятницу_субботу".split( "_" )}, d = /\[ ?[Вв] ?(?:прошлую|следующую)? ?\] ?dddd/.test( b ) ? "accusative" : "nominative";
            return c[d][a.day()]
        }

        return a.lang( "ru", {months: d, monthsShort: e, weekdays: f, weekdaysShort: "вс_пн_вт_ср_чт_пт_сб".split( "_" ), weekdaysMin: "вс_пн_вт_ср_чт_пт_сб".split( "_" ), monthsParse: [/^янв/i, /^фев/i, /^мар/i, /^апр/i, /^ма[й|я]/i, /^июн/i, /^июл/i, /^авг/i, /^сен/i, /^окт/i, /^ноя/i, /^дек/i], longDateFormat: {LT: "HH:mm", L: "DD.MM.YYYY", LL: "D MMMM YYYY г.", LLL: "D MMMM YYYY г., LT", LLLL: "dddd, D MMMM YYYY г., LT"}, calendar: {sameDay: "[Сегодня в] LT", nextDay: "[Завтра в] LT", lastDay: "[Вчера в] LT", nextWeek: function () {
            return 2 === this.day() ? "[Во] dddd [в] LT" : "[В] dddd [в] LT"
        }, lastWeek                                                                                                                                                                                                                                                                                                                                                                                                                                             : function () {
            switch (this.day()) {
                case 0:
                    return"[В прошлое] dddd [в] LT";
                case 1:
                case 2:
                case 4:
                    return"[В прошлый] dddd [в] LT";
                case 3:
                case 5:
                case 6:
                    return"[В прошлую] dddd [в] LT"
            }
        }, sameElse                                                                                                                                                                                                                                                                                                                                                                                                                                             : "L"}, relativeTime: {future: "через %s", past: "%s назад", s: "несколько секунд", m: c, mm: c, h: "час", hh: c, d: "день", dd: c, M: "месяц", MM: c, y: "год", yy: c}, meridiem: function ( a ) {
            return 4 > a ? "ночи" : 12 > a ? "утра" : 17 > a ? "дня" : "вечера"
        }, ordinal: function ( a, b ) {
            switch (b) {
                case"M":
                case"d":
                case"DDD":
                    return a + "-й";
                case"D":
                    return a + "-го";
                case"w":
                case"W":
                    return a + "-я";
                default:
                    return a
            }
        }, week: {dow: 1, doy: 7}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        function b ( a ) {
            return a > 1 && 5 > a
        }

        function c ( a, c, d, e ) {
            var f = a + " ";
            switch (d) {
                case"s":
                    return c || e ? "pár sekúnd" : "pár sekundami";
                case"m":
                    return c ? "minúta" : e ? "minútu" : "minútou";
                case"mm":
                    return c || e ? f + (b( a ) ? "minúty" : "minút") : f + "minútami";
                    break;
                case"h":
                    return c ? "hodina" : e ? "hodinu" : "hodinou";
                case"hh":
                    return c || e ? f + (b( a ) ? "hodiny" : "hodín") : f + "hodinami";
                    break;
                case"d":
                    return c || e ? "deň" : "dňom";
                case"dd":
                    return c || e ? f + (b( a ) ? "dni" : "dní") : f + "dňami";
                    break;
                case"M":
                    return c || e ? "mesiac" : "mesiacom";
                case"MM":
                    return c || e ? f + (b( a ) ? "mesiace" : "mesiacov") : f + "mesiacmi";
                    break;
                case"y":
                    return c || e ? "rok" : "rokom";
                case"yy":
                    return c || e ? f + (b( a ) ? "roky" : "rokov") : f + "rokmi"
            }
        }

        var d = "január_február_marec_apríl_máj_jún_júl_august_september_október_november_december".split( "_" ), e = "jan_feb_mar_apr_máj_jún_júl_aug_sep_okt_nov_dec".split( "_" );
        return a.lang( "sk", {months: d, monthsShort: e, monthsParse: function ( a, b ) {
            var c, d = [];
            for (c = 0; 12 > c; c++)d[c] = new RegExp( "^" + a[c] + "$|^" + b[c] + "$", "i" );
            return d
        }( d, e ), weekdays: "nedeľa_pondelok_utorok_streda_štvrtok_piatok_sobota".split( "_" ), weekdaysShort: "ne_po_ut_st_št_pi_so".split( "_" ), weekdaysMin: "ne_po_ut_st_št_pi_so".split( "_" ), longDateFormat: {LT: "H:mm", L: "DD.MM.YYYY", LL: "D. MMMM YYYY", LLL: "D. MMMM YYYY LT", LLLL: "dddd D. MMMM YYYY LT"}, calendar: {sameDay: "[dnes o] LT", nextDay: "[zajtra o] LT", nextWeek: function () {
            switch (this.day()) {
                case 0:
                    return"[v nedeľu o] LT";
                case 1:
                case 2:
                    return"[v] dddd [o] LT";
                case 3:
                    return"[v stredu o] LT";
                case 4:
                    return"[vo štvrtok o] LT";
                case 5:
                    return"[v piatok o] LT";
                case 6:
                    return"[v sobotu o] LT"
            }
        }, lastDay                                                                                                                                                                                                                                                                                                                                : "[včera o] LT", lastWeek: function () {
            switch (this.day()) {
                case 0:
                    return"[minulú nedeľu o] LT";
                case 1:
                case 2:
                    return"[minulý] dddd [o] LT";
                case 3:
                    return"[minulú stredu o] LT";
                case 4:
                case 5:
                    return"[minulý] dddd [o] LT";
                case 6:
                    return"[minulú sobotu o] LT"
            }
        }, sameElse                                                                                                                                                                                                                                                                                                                               : "L"}, relativeTime: {future: "za %s", past: "pred %s", s: c, m: c, mm: c, h: c, hh: c, d: c, dd: c, M: c, MM: c, y: c, yy: c}, ordinal: "%d.", week: {dow: 1, doy: 4}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        function b ( a, b, c ) {
            var d = a + " ";
            switch (c) {
                case"m":
                    return b ? "ena minuta" : "eno minuto";
                case"mm":
                    return d += 1 === a ? "minuta" : 2 === a ? "minuti" : 3 === a || 4 === a ? "minute" : "minut";
                case"h":
                    return b ? "ena ura" : "eno uro";
                case"hh":
                    return d += 1 === a ? "ura" : 2 === a ? "uri" : 3 === a || 4 === a ? "ure" : "ur";
                case"dd":
                    return d += 1 === a ? "dan" : "dni";
                case"MM":
                    return d += 1 === a ? "mesec" : 2 === a ? "meseca" : 3 === a || 4 === a ? "mesece" : "mesecev";
                case"yy":
                    return d += 1 === a ? "leto" : 2 === a ? "leti" : 3 === a || 4 === a ? "leta" : "let"
            }
        }

        return a.lang( "sl", {months: "januar_februar_marec_april_maj_junij_julij_avgust_september_oktober_november_december".split( "_" ), monthsShort: "jan._feb._mar._apr._maj._jun._jul._avg._sep._okt._nov._dec.".split( "_" ), weekdays: "nedelja_ponedeljek_torek_sreda_četrtek_petek_sobota".split( "_" ), weekdaysShort: "ned._pon._tor._sre._čet._pet._sob.".split( "_" ), weekdaysMin: "ne_po_to_sr_če_pe_so".split( "_" ), longDateFormat: {LT: "H:mm", L: "DD. MM. YYYY", LL: "D. MMMM YYYY", LLL: "D. MMMM YYYY LT", LLLL: "dddd, D. MMMM YYYY LT"}, calendar: {sameDay: "[danes ob] LT", nextDay: "[jutri ob] LT", nextWeek: function () {
            switch (this.day()) {
                case 0:
                    return"[v] [nedeljo] [ob] LT";
                case 3:
                    return"[v] [sredo] [ob] LT";
                case 6:
                    return"[v] [soboto] [ob] LT";
                case 1:
                case 2:
                case 4:
                case 5:
                    return"[v] dddd [ob] LT"
            }
        }, lastDay                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   : "[včeraj ob] LT", lastWeek: function () {
            switch (this.day()) {
                case 0:
                case 3:
                case 6:
                    return"[prejšnja] dddd [ob] LT";
                case 1:
                case 2:
                case 4:
                case 5:
                    return"[prejšnji] dddd [ob] LT"
            }
        }, sameElse                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  : "L"}, relativeTime: {future: "čez %s", past: "%s nazaj", s: "nekaj sekund", m: b, mm: b, h: b, hh: b, d: "en dan", dd: b, M: "en mesec", MM: b, y: "eno leto", yy: b}, ordinal: "%d.", week: {dow: 1, doy: 7}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        return a.lang( "sq", {months: "Janar_Shkurt_Mars_Prill_Maj_Qershor_Korrik_Gusht_Shtator_Tetor_Nëntor_Dhjetor".split( "_" ), monthsShort: "Jan_Shk_Mar_Pri_Maj_Qer_Kor_Gus_Sht_Tet_Nën_Dhj".split( "_" ), weekdays: "E Diel_E Hënë_E Marte_E Mërkure_E Enjte_E Premte_E Shtunë".split( "_" ), weekdaysShort: "Die_Hën_Mar_Mër_Enj_Pre_Sht".split( "_" ), weekdaysMin: "D_H_Ma_Më_E_P_Sh".split( "_" ), longDateFormat: {LT: "HH:mm", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY LT", LLLL: "dddd, D MMMM YYYY LT"}, calendar: {sameDay: "[Sot në] LT", nextDay: "[Neser në] LT", nextWeek: "dddd [në] LT", lastDay: "[Dje në] LT", lastWeek: "dddd [e kaluar në] LT", sameElse: "L"}, relativeTime: {future: "në %s", past: "%s me parë", s: "disa sekonda", m: "një minut", mm: "%d minuta", h: "një orë", hh: "%d orë", d: "një ditë", dd: "%d ditë", M: "një muaj", MM: "%d muaj", y: "një vit", yy: "%d vite"}, ordinal: "%d.", week: {dow: 1, doy: 4}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        return a.lang( "sv", {months: "januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december".split( "_" ), monthsShort: "jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split( "_" ), weekdays: "söndag_måndag_tisdag_onsdag_torsdag_fredag_lördag".split( "_" ), weekdaysShort: "sön_mån_tis_ons_tor_fre_lör".split( "_" ), weekdaysMin: "sö_må_ti_on_to_fr_lö".split( "_" ), longDateFormat: {LT: "HH:mm", L: "YYYY-MM-DD", LL: "D MMMM YYYY", LLL: "D MMMM YYYY LT", LLLL: "dddd D MMMM YYYY LT"}, calendar: {sameDay: "[Idag] LT", nextDay: "[Imorgon] LT", lastDay: "[Igår] LT", nextWeek: "dddd LT", lastWeek: "[Förra] dddd[en] LT", sameElse: "L"}, relativeTime: {future: "om %s", past: "för %s sedan", s: "några sekunder", m: "en minut", mm: "%d minuter", h: "en timme", hh: "%d timmar", d: "en dag", dd: "%d dagar", M: "en månad", MM: "%d månader", y: "ett år", yy: "%d år"}, ordinal: function ( a ) {
            var b = a % 10, c = 1 === ~~(a % 100 / 10) ? "e" : 1 === b ? "a" : 2 === b ? "a" : 3 === b ? "e" : "e";
            return a + c
        }, week                     : {dow: 1, doy: 4}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        return a.lang( "ta", {months: "ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்".split( "_" ), monthsShort: "ஜனவரி_பிப்ரவரி_மார்ச்_ஏப்ரல்_மே_ஜூன்_ஜூலை_ஆகஸ்ட்_செப்டெம்பர்_அக்டோபர்_நவம்பர்_டிசம்பர்".split( "_" ), weekdays: "ஞாயிற்றுக்கிழமை_திங்கட்கிழமை_செவ்வாய்கிழமை_புதன்கிழமை_வியாழக்கிழமை_வெள்ளிக்கிழமை_சனிக்கிழமை".split( "_" ), weekdaysShort: "ஞாயிறு_திங்கள்_செவ்வாய்_புதன்_வியாழன்_வெள்ளி_சனி".split( "_" ), weekdaysMin: "ஞா_தி_செ_பு_வி_வெ_ச".split( "_" ), longDateFormat: {LT: "HH:mm", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY, LT", LLLL: "dddd, D MMMM YYYY, LT"}, calendar: {sameDay: "[இன்று] LT", nextDay: "[நாளை] LT", nextWeek: "dddd, LT", lastDay: "[நேற்று] LT", lastWeek: "[கடந்த வாரம்] dddd, LT", sameElse: "L"}, relativeTime: {future: "%s இல்", past: "%s முன்", s: "ஒரு சில விநாடிகள்", m: "ஒரு நிமிடம்", mm: "%d நிமிடங்கள்", h: "ஒரு மணி நேரம்", hh: "%d மணி நேரம்", d: "ஒரு நாள்", dd: "%d நாட்கள்", M: "ஒரு மாதம்", MM: "%d மாதங்கள்", y: "ஒரு வருடம்", yy: "%d ஆண்டுகள்"}, ordinal: function ( a ) {
            return a + "வது"
        }, meridiem                 : function ( a ) {
            return a >= 6 && 10 >= a ? " காலை" : a >= 10 && 14 >= a ? " நண்பகல்" : a >= 14 && 18 >= a ? " எற்பாடு" : a >= 18 && 20 >= a ? " மாலை" : a >= 20 && 24 >= a ? " இரவு" : a >= 0 && 6 >= a ? " வைகறை" : void 0
        }, week                     : {dow: 0, doy: 6}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        return a.lang( "th", {months: "มกราคม_กุมภาพันธ์_มีนาคม_เมษายน_พฤษภาคม_มิถุนายน_กรกฎาคม_สิงหาคม_กันยายน_ตุลาคม_พฤศจิกายน_ธันวาคม".split( "_" ), monthsShort: "มกรา_กุมภา_มีนา_เมษา_พฤษภา_มิถุนา_กรกฎา_สิงหา_กันยา_ตุลา_พฤศจิกา_ธันวา".split( "_" ), weekdays: "อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัสบดี_ศุกร์_เสาร์".split( "_" ), weekdaysShort: "อาทิตย์_จันทร์_อังคาร_พุธ_พฤหัส_ศุกร์_เสาร์".split( "_" ), weekdaysMin: "อา._จ._อ._พ._พฤ._ศ._ส.".split( "_" ), longDateFormat: {LT: "H นาฬิกา m นาที", L: "YYYY/MM/DD", LL: "D MMMM YYYY", LLL: "D MMMM YYYY เวลา LT", LLLL: "วันddddที่ D MMMM YYYY เวลา LT"}, meridiem: function ( a ) {
            return 12 > a ? "ก่อนเที่ยง" : "หลังเที่ยง"
        }, calendar                 : {sameDay: "[วันนี้ เวลา] LT", nextDay: "[พรุ่งนี้ เวลา] LT", nextWeek: "dddd[หน้า เวลา] LT", lastDay: "[เมื่อวานนี้ เวลา] LT", lastWeek: "[วัน]dddd[ที่แล้ว เวลา] LT", sameElse: "L"}, relativeTime: {future: "อีก %s", past: "%sที่แล้ว", s: "ไม่กี่วินาที", m: "1 นาที", mm: "%d นาที", h: "1 ชั่วโมง", hh: "%d ชั่วโมง", d: "1 วัน", dd: "%d วัน", M: "1 เดือน", MM: "%d เดือน", y: "1 ปี", yy: "%d ปี"}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        return a.lang( "tl-ph", {months: "Enero_Pebrero_Marso_Abril_Mayo_Hunyo_Hulyo_Agosto_Setyembre_Oktubre_Nobyembre_Disyembre".split( "_" ), monthsShort: "Ene_Peb_Mar_Abr_May_Hun_Hul_Ago_Set_Okt_Nob_Dis".split( "_" ), weekdays: "Linggo_Lunes_Martes_Miyerkules_Huwebes_Biyernes_Sabado".split( "_" ), weekdaysShort: "Lin_Lun_Mar_Miy_Huw_Biy_Sab".split( "_" ), weekdaysMin: "Li_Lu_Ma_Mi_Hu_Bi_Sab".split( "_" ), longDateFormat: {LT: "HH:mm", L: "MM/D/YYYY", LL: "MMMM D, YYYY", LLL: "MMMM D, YYYY LT", LLLL: "dddd, MMMM DD, YYYY LT"}, calendar: {sameDay: "[Ngayon sa] LT", nextDay: "[Bukas sa] LT", nextWeek: "dddd [sa] LT", lastDay: "[Kahapon sa] LT", lastWeek: "dddd [huling linggo] LT", sameElse: "L"}, relativeTime: {future: "sa loob ng %s", past: "%s ang nakalipas", s: "ilang segundo", m: "isang minuto", mm: "%d minuto", h: "isang oras", hh: "%d oras", d: "isang araw", dd: "%d araw", M: "isang buwan", MM: "%d buwan", y: "isang taon", yy: "%d taon"}, ordinal: function ( a ) {
            return a
        }, week                        : {dow: 1, doy: 4}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        var b = {1: "'inci", 5: "'inci", 8: "'inci", 70: "'inci", 80: "'inci", 2: "'nci", 7: "'nci", 20: "'nci", 50: "'nci", 3: "'üncü", 4: "'üncü", 100: "'üncü", 6: "'ncı", 9: "'uncu", 10: "'uncu", 30: "'uncu", 60: "'ıncı", 90: "'ıncı"};
        return a.lang( "tr", {months: "Ocak_Şubat_Mart_Nisan_Mayıs_Haziran_Temmuz_Ağustos_Eylül_Ekim_Kasım_Aralık".split( "_" ), monthsShort: "Oca_Şub_Mar_Nis_May_Haz_Tem_Ağu_Eyl_Eki_Kas_Ara".split( "_" ), weekdays: "Pazar_Pazartesi_Salı_Çarşamba_Perşembe_Cuma_Cumartesi".split( "_" ), weekdaysShort: "Paz_Pts_Sal_Çar_Per_Cum_Cts".split( "_" ), weekdaysMin: "Pz_Pt_Sa_Ça_Pe_Cu_Ct".split( "_" ), longDateFormat: {LT: "HH:mm", L: "DD.MM.YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY LT", LLLL: "dddd, D MMMM YYYY LT"}, calendar: {sameDay: "[bugün saat] LT", nextDay: "[yarın saat] LT", nextWeek: "[haftaya] dddd [saat] LT", lastDay: "[dün] LT", lastWeek: "[geçen hafta] dddd [saat] LT", sameElse: "L"}, relativeTime: {future: "%s sonra", past: "%s önce", s: "birkaç saniye", m: "bir dakika", mm: "%d dakika", h: "bir saat", hh: "%d saat", d: "bir gün", dd: "%d gün", M: "bir ay", MM: "%d ay", y: "bir yıl", yy: "%d yıl"}, ordinal: function ( a ) {
            if (0 === a)return a + "'ıncı";
            var c = a % 10, d = a % 100 - c, e = a >= 100 ? 100 : null;
            return a + (b[c] || b[d] || b[e])
        }, week                     : {dow: 1, doy: 7}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        return a.lang( "tzm-la", {months: "innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir".split( "_" ), monthsShort: "innayr_brˤayrˤ_marˤsˤ_ibrir_mayyw_ywnyw_ywlywz_ɣwšt_šwtanbir_ktˤwbrˤ_nwwanbir_dwjnbir".split( "_" ), weekdays: "asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split( "_" ), weekdaysShort: "asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split( "_" ), weekdaysMin: "asamas_aynas_asinas_akras_akwas_asimwas_asiḍyas".split( "_" ), longDateFormat: {LT: "HH:mm", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY LT", LLLL: "dddd D MMMM YYYY LT"}, calendar: {sameDay: "[asdkh g] LT", nextDay: "[aska g] LT", nextWeek: "dddd [g] LT", lastDay: "[assant g] LT", lastWeek: "dddd [g] LT", sameElse: "L"}, relativeTime: {future: "dadkh s yan %s", past: "yan %s", s: "imik", m: "minuḍ", mm: "%d minuḍ", h: "saɛa", hh: "%d tassaɛin", d: "ass", dd: "%d ossan", M: "ayowr", MM: "%d iyyirn", y: "asgas", yy: "%d isgasn"}, week: {dow: 6, doy: 12}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        return a.lang( "tzm", {months: "ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ".split( "_" ), monthsShort: "ⵉⵏⵏⴰⵢⵔ_ⴱⵕⴰⵢⵕ_ⵎⴰⵕⵚ_ⵉⴱⵔⵉⵔ_ⵎⴰⵢⵢⵓ_ⵢⵓⵏⵢⵓ_ⵢⵓⵍⵢⵓⵣ_ⵖⵓⵛⵜ_ⵛⵓⵜⴰⵏⴱⵉⵔ_ⴽⵟⵓⴱⵕ_ⵏⵓⵡⴰⵏⴱⵉⵔ_ⴷⵓⵊⵏⴱⵉⵔ".split( "_" ), weekdays: "ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split( "_" ), weekdaysShort: "ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split( "_" ), weekdaysMin: "ⴰⵙⴰⵎⴰⵙ_ⴰⵢⵏⴰⵙ_ⴰⵙⵉⵏⴰⵙ_ⴰⴽⵔⴰⵙ_ⴰⴽⵡⴰⵙ_ⴰⵙⵉⵎⵡⴰⵙ_ⴰⵙⵉⴹⵢⴰⵙ".split( "_" ), longDateFormat: {LT: "HH:mm", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY LT", LLLL: "dddd D MMMM YYYY LT"}, calendar: {sameDay: "[ⴰⵙⴷⵅ ⴴ] LT", nextDay: "[ⴰⵙⴽⴰ ⴴ] LT", nextWeek: "dddd [ⴴ] LT", lastDay: "[ⴰⵚⴰⵏⵜ ⴴ] LT", lastWeek: "dddd [ⴴ] LT", sameElse: "L"}, relativeTime: {future: "ⴷⴰⴷⵅ ⵙ ⵢⴰⵏ %s", past: "ⵢⴰⵏ %s", s: "ⵉⵎⵉⴽ", m: "ⵎⵉⵏⵓⴺ", mm: "%d ⵎⵉⵏⵓⴺ", h: "ⵙⴰⵄⴰ", hh: "%d ⵜⴰⵙⵙⴰⵄⵉⵏ", d: "ⴰⵙⵙ", dd: "%d oⵙⵙⴰⵏ", M: "ⴰⵢoⵓⵔ", MM: "%d ⵉⵢⵢⵉⵔⵏ", y: "ⴰⵙⴳⴰⵙ", yy: "%d ⵉⵙⴳⴰⵙⵏ"}, week: {dow: 6, doy: 12}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        function b ( a, b ) {
            var c = a.split( "_" );
            return b % 10 === 1 && b % 100 !== 11 ? c[0] : b % 10 >= 2 && 4 >= b % 10 && (10 > b % 100 || b % 100 >= 20) ? c[1] : c[2]
        }

        function c ( a, c, d ) {
            var e = {mm: "хвилина_хвилини_хвилин", hh: "година_години_годин", dd: "день_дні_днів", MM: "місяць_місяці_місяців", yy: "рік_роки_років"};
            return"m" === d ? c ? "хвилина" : "хвилину" : "h" === d ? c ? "година" : "годину" : a + " " + b( e[d], +a )
        }

        function d ( a, b ) {
            var c = {nominative: "січень_лютий_березень_квітень_травень_червень_липень_серпень_вересень_жовтень_листопад_грудень".split( "_" ), accusative: "січня_лютого_березня_квітня_травня_червня_липня_серпня_вересня_жовтня_листопада_грудня".split( "_" )}, d = /D[oD]? *MMMM?/.test( b ) ? "accusative" : "nominative";
            return c[d][a.month()]
        }

        function e ( a, b ) {
            var c = {nominative: "неділя_понеділок_вівторок_середа_четвер_п’ятниця_субота".split( "_" ), accusative: "неділю_понеділок_вівторок_середу_четвер_п’ятницю_суботу".split( "_" ), genitive: "неділі_понеділка_вівторка_середи_четверга_п’ятниці_суботи".split( "_" )}, d = /(\[[ВвУу]\]) ?dddd/.test( b ) ? "accusative" : /\[?(?:минулої|наступної)? ?\] ?dddd/.test( b ) ? "genitive" : "nominative";
            return c[d][a.day()]
        }

        function f ( a ) {
            return function () {
                return a + "о" + (11 === this.hours() ? "б" : "") + "] LT"
            }
        }

        return a.lang( "uk", {months: d, monthsShort: "січ_лют_бер_квіт_трав_черв_лип_серп_вер_жовт_лист_груд".split( "_" ), weekdays: e, weekdaysShort: "нд_пн_вт_ср_чт_пт_сб".split( "_" ), weekdaysMin: "нд_пн_вт_ср_чт_пт_сб".split( "_" ), longDateFormat: {LT: "HH:mm", L: "DD.MM.YYYY", LL: "D MMMM YYYY р.", LLL: "D MMMM YYYY р., LT", LLLL: "dddd, D MMMM YYYY р., LT"}, calendar: {sameDay: f( "[Сьогодні " ), nextDay: f( "[Завтра " ), lastDay: f( "[Вчора " ), nextWeek: f( "[У] dddd [" ), lastWeek: function () {
            switch (this.day()) {
                case 0:
                case 3:
                case 5:
                case 6:
                    return f( "[Минулої] dddd [" ).call( this );
                case 1:
                case 2:
                case 4:
                    return f( "[Минулого] dddd [" ).call( this )
            }
        }, sameElse                                                                                                                                                                                                                                                                                                                                                                                  : "L"}, relativeTime: {future: "за %s", past: "%s тому", s: "декілька секунд", m: c, mm: c, h: "годину", hh: c, d: "день", dd: c, M: "місяць", MM: c, y: "рік", yy: c}, meridiem: function ( a ) {
            return 4 > a ? "ночі" : 12 > a ? "ранку" : 17 > a ? "дня" : "вечора"
        }, ordinal: function ( a, b ) {
            switch (b) {
                case"M":
                case"d":
                case"DDD":
                case"w":
                case"W":
                    return a + "-й";
                case"D":
                    return a + "-го";
                default:
                    return a
            }
        }, week: {dow: 1, doy: 7}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        return a.lang( "uz", {months: "январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split( "_" ), monthsShort: "янв_фев_мар_апр_май_июн_июл_авг_сен_окт_ноя_дек".split( "_" ), weekdays: "Якшанба_Душанба_Сешанба_Чоршанба_Пайшанба_Жума_Шанба".split( "_" ), weekdaysShort: "Якш_Душ_Сеш_Чор_Пай_Жум_Шан".split( "_" ), weekdaysMin: "Як_Ду_Се_Чо_Па_Жу_Ша".split( "_" ), longDateFormat: {LT: "HH:mm", L: "DD/MM/YYYY", LL: "D MMMM YYYY", LLL: "D MMMM YYYY LT", LLLL: "D MMMM YYYY, dddd LT"}, calendar: {sameDay: "[Бугун соат] LT [да]", nextDay: "[Эртага] LT [да]", nextWeek: "dddd [куни соат] LT [да]", lastDay: "[Кеча соат] LT [да]", lastWeek: "[Утган] dddd [куни соат] LT [да]", sameElse: "L"}, relativeTime: {future: "Якин %s ичида", past: "Бир неча %s олдин", s: "фурсат", m: "бир дакика", mm: "%d дакика", h: "бир соат", hh: "%d соат", d: "бир кун", dd: "%d кун", M: "бир ой", MM: "%d ой", y: "бир йил", yy: "%d йил"}, week: {dow: 1, doy: 7}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        return a.lang( "vn", {months: "tháng 1_tháng 2_tháng 3_tháng 4_tháng 5_tháng 6_tháng 7_tháng 8_tháng 9_tháng 10_tháng 11_tháng 12".split( "_" ), monthsShort: "Th01_Th02_Th03_Th04_Th05_Th06_Th07_Th08_Th09_Th10_Th11_Th12".split( "_" ), weekdays: "chủ nhật_thứ hai_thứ ba_thứ tư_thứ năm_thứ sáu_thứ bảy".split( "_" ), weekdaysShort: "CN_T2_T3_T4_T5_T6_T7".split( "_" ), weekdaysMin: "CN_T2_T3_T4_T5_T6_T7".split( "_" ), longDateFormat: {LT: "HH:mm", L: "DD/MM/YYYY", LL: "D MMMM [năm] YYYY", LLL: "D MMMM [năm] YYYY LT", LLLL: "dddd, D MMMM [năm] YYYY LT", l: "DD/M/YYYY", ll: "D MMM YYYY", lll: "D MMM YYYY LT", llll: "ddd, D MMM YYYY LT"}, calendar: {sameDay: "[Hôm nay lúc] LT", nextDay: "[Ngày mai lúc] LT", nextWeek: "dddd [tuần tới lúc] LT", lastDay: "[Hôm qua lúc] LT", lastWeek: "dddd [tuần rồi lúc] LT", sameElse: "L"}, relativeTime: {future: "%s tới", past: "%s trước", s: "vài giây", m: "một phút", mm: "%d phút", h: "một giờ", hh: "%d giờ", d: "một ngày", dd: "%d ngày", M: "một tháng", MM: "%d tháng", y: "một năm", yy: "%d năm"}, ordinal: function ( a ) {
            return a
        }, week                     : {dow: 1, doy: 4}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        return a.lang( "zh-cn", {months: "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split( "_" ), monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split( "_" ), weekdays: "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split( "_" ), weekdaysShort: "周日_周一_周二_周三_周四_周五_周六".split( "_" ), weekdaysMin: "日_一_二_三_四_五_六".split( "_" ), longDateFormat: {LT: "Ah点mm", L: "YYYY-MM-DD", LL: "YYYY年MMMD日", LLL: "YYYY年MMMD日LT", LLLL: "YYYY年MMMD日ddddLT", l: "YYYY-MM-DD", ll: "YYYY年MMMD日", lll: "YYYY年MMMD日LT", llll: "YYYY年MMMD日ddddLT"}, meridiem: function ( a, b ) {
            var c = 100 * a + b;
            return 600 > c ? "凌晨" : 900 > c ? "早上" : 1130 > c ? "上午" : 1230 > c ? "中午" : 1800 > c ? "下午" : "晚上"
        }, calendar: {sameDay: function () {
            return 0 === this.minutes() ? "[今天]Ah[点整]" : "[今天]LT"
        }, nextDay           : function () {
            return 0 === this.minutes() ? "[明天]Ah[点整]" : "[明天]LT"
        }, lastDay           : function () {
            return 0 === this.minutes() ? "[昨天]Ah[点整]" : "[昨天]LT"
        }, nextWeek          : function () {
            var b, c;
            return b = a().startOf( "week" ), c = this.unix() - b.unix() >= 604800 ? "[下]" : "[本]", 0 === this.minutes() ? c + "dddAh点整" : c + "dddAh点mm"
        }, lastWeek          : function () {
            var b, c;
            return b = a().startOf( "week" ), c = this.unix() < b.unix() ? "[上]" : "[本]", 0 === this.minutes() ? c + "dddAh点整" : c + "dddAh点mm"
        }, sameElse          : "LL"}, ordinal: function ( a, b ) {
            switch (b) {
                case"d":
                case"D":
                case"DDD":
                    return a + "日";
                case"M":
                    return a + "月";
                case"w":
                case"W":
                    return a + "周";
                default:
                    return a
            }
        }, relativeTime: {future: "%s内", past: "%s前", s: "几秒", m: "1分钟", mm: "%d分钟", h: "1小时", hh: "%d小时", d: "1天", dd: "%d天", M: "1个月", MM: "%d个月", y: "1年", yy: "%d年"}, week: {dow: 1, doy: 4}} )
    } ), function ( a ) {
        a( cb )
    }( function ( a ) {
        return a.lang( "zh-tw", {months: "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split( "_" ), monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split( "_" ), weekdays: "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split( "_" ), weekdaysShort: "週日_週一_週二_週三_週四_週五_週六".split( "_" ), weekdaysMin: "日_一_二_三_四_五_六".split( "_" ), longDateFormat: {LT: "Ah點mm", L: "YYYY年MMMD日", LL: "YYYY年MMMD日", LLL: "YYYY年MMMD日LT", LLLL: "YYYY年MMMD日ddddLT", l: "YYYY年MMMD日", ll: "YYYY年MMMD日", lll: "YYYY年MMMD日LT", llll: "YYYY年MMMD日ddddLT"}, meridiem: function ( a, b ) {
            var c = 100 * a + b;
            return 900 > c ? "早上" : 1130 > c ? "上午" : 1230 > c ? "中午" : 1800 > c ? "下午" : "晚上"
        }, calendar                    : {sameDay: "[今天]LT", nextDay: "[明天]LT", nextWeek: "[下]ddddLT", lastDay: "[昨天]LT", lastWeek: "[上]ddddLT", sameElse: "L"}, ordinal: function ( a, b ) {
            switch (b) {
                case"d":
                case"D":
                case"DDD":
                    return a + "日";
                case"M":
                    return a + "月";
                case"w":
                case"W":
                    return a + "週";
                default:
                    return a
            }
        }, relativeTime                : {future: "%s內", past: "%s前", s: "幾秒", m: "一分鐘", mm: "%d分鐘", h: "一小時", hh: "%d小時", d: "一天", dd: "%d天", M: "一個月", MM: "%d個月", y: "一年", yy: "%d年"}} )
    } ), cb.lang( "en" ), pb ? (module.exports = cb, bb( !0 )) : "function" == typeof define && define.amd ? define( "moment", function ( b, c, d ) {
        return d.config && d.config() && d.config().noGlobal !== !0 && bb( d.config().noGlobal === a ), cb
    } ) : bb()
}).call( this );
/**
 * Created by bisconti on 07/01/15.
 */

var Utils = (function () {
  'use strict';

  var smessage     = function (title, message, type, timer) {
    swal({
      title: title || ' ',
      text:  message || ' ',
      type:  type || 'error',
      timer: timer || 4000
    });
  };
  var errorMessage = function (message, timer) {
    smessage('ERROR', message, 'error', timer);
  };

  var endsWith = function (str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  var getURLParameter = function (sParam) {
    var sPageURL      = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
      var sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] == sParam) {
        return sParameterName[1];
      }
    }
  };

  var deleteCookie = function (name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  };

  /*
   executeOnce(callback[, thisObject[, argumentToPass1[, argumentToPass2[, …[, argumentToPassN]]]]], identifier[, onlyHere])
   * */
  var executeOnce = function executeOnce() {
    var argc = arguments.length, bImplGlob = typeof arguments[argc - 1] === "string";
    if (bImplGlob) { argc++; }
    if (argc < 3) { throw new TypeError("executeOnce - not enough arguments"); }
    var fExec       = arguments[0], sKey = arguments[argc - 2];
    if (typeof fExec !== "function") { throw new TypeError("executeOnce - first argument must be a function"); }
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { throw new TypeError("executeOnce - invalid identifier"); }
    if (decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) === "1") { return false; }
    fExec.apply(argc > 3 ? arguments[1] : null, argc > 4 ? Array.prototype.slice.call(arguments, 2, argc - 2) : []);
    document.cookie = encodeURIComponent(sKey) + "=1; expires=Fri, 31 Dec 9999 23:59:59 GMT" + (bImplGlob || !arguments[argc - 1] ? "; path=/" : "");
    return true;
  };

  /*\
   |*|
   |*|  :: Translate relative paths to absolute paths ::
   |*|
   |*|  https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
   |*|  https://developer.mozilla.org/User:fusionchess
   |*|
   |*|  The following code is released under the GNU Public License, version 3 or later.
   |*|  http://www.gnu.org/licenses/gpl-3.0-standalone.html
   |*|
   \*/

  var relPathToAbs = function relPathToAbs(sRelPath) {
    var nUpLn, sDir = "", sPath = location.pathname.replace(/[^\/]*$/, sRelPath.replace(/(\/|^)(?:\.?\/+)+/g, "$1"));
    for (var nEnd, nStart = 0; nEnd = sPath.indexOf("/../", nStart), nEnd > -1; nStart = nEnd + nUpLn) {
      nUpLn = /^\/(?:\.\.\/)*/.exec(sPath.slice(nEnd))[0].length;
      sDir  = (sDir + sPath.substring(nStart, nEnd)).replace(new RegExp("(?:\\\/+[^\\\/]*){0," + ((nUpLn - 1) / 3) + "}$"), "/");
    }
    return sDir + sPath.substr(nStart);
  };
  /*\
   |*|
   |*|  :: cookies.js ::
   |*|
   |*|  A complete cookies reader/writer framework with full unicode support.
   |*|
   |*|  Revision #1 - September 4, 2014
   |*|
   |*|  https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
   |*|  https://developer.mozilla.org/User:fusionchess
   |*|
   |*|  This framework is released under the GNU Public License, version 3 or later.
   |*|  http://www.gnu.org/licenses/gpl-3.0-standalone.html
   |*|
   |*|  Syntaxes:
   |*|
   |*|  * docCookies.setItem(name, value[, end[, path[, domain[, secure]]]])
   |*|  * docCookies.getItem(name)
   |*|  * docCookies.removeItem(name[, path[, domain]])
   |*|  * docCookies.hasItem(name)
   |*|  * docCookies.keys()
   |*|
   \*/

  var docCookies = {
    getItem:    function (sKey) {
      if (!sKey) { return null; }
      return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*"
          + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    setItem:    function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
      if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
      var sExpires = "";
      if (vEnd) {
        switch (vEnd.constructor) {
          case Number:
            sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
            break;
          case String:
            sExpires = "; expires=" + vEnd;
            break;
          case Date:
            sExpires = "; expires=" + vEnd.toUTCString();
            break;
        }
      }
      document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue)
        + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
      return true;
    },
    removeItem: function (sKey, sPath, sDomain) {
      if (!this.hasItem(sKey)) { return false; }
      document.cookie = encodeURIComponent(sKey)
        + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
      return true;
    },
    hasItem:    function (sKey) {
      if (!sKey) { return false; }
      return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    keys:       function () {
      var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
      for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
      return aKeys;
    }
  };

  var bytesToSize = function (bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'],
        i;
    if (bytes === 0) {
      return '0 Byte';
    }
    i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
  };

  /**
   * Returns one of supported language, default if not.
   * Supported languages: 'nl', 'fr', 'en' (default).
   * @returns {string}
   */
  var getNavigatorLanguage = function () {
    var locale = (window.navigator.userLanguage || window.navigator.language);
    locale     = /..-../.test(locale) ? locale.split('-')[0] : locale.split('_')[0];
    if ((locale !== 'en') && (locale !== 'fr') && (locale !== 'nl')) {
      locale = 'en';
    }
    return locale;
  };


  var setTransferURL = function () {
    var url = window.location.hostname;
    if (localStorage.TransferBaseURL) {
      sessionStorage.setItem('TransferBaseURL', localStorage.TransferBaseURL);
      sessionStorage.setItem('TransferServerURL', localStorage.TransferServerURL);
    } else if (_.contains(url, 'localhost')) {
      /***** LOCAL *****/
      sessionStorage.setItem('TransferBaseURL', '//localhost:4000/transfer/');
      sessionStorage.setItem('TransferServerURL', '//localhost:8019/');
      //sessionStorage.setItem('TransferServerURL', '//deviapps.groups.be/ariane-transfer/');
      /**************
       * DEV & QA
       **************/
    } else if (_.contains(url, 'deviapps')) {
      sessionStorage.setItem('TransferBaseURL', '//deviapps.groups.be/prestaweb/transfer/');
      if (!sessionStorage.TransferServerURL) {sessionStorage.setItem('TransferServerURL', '//deviapps.groups.be/ariane-transfer/');}
    } else if (_.contains(url, 'qaiapps')) {
      sessionStorage.setItem('TransferBaseURL', '//qaiapps.groups.be/transfer/');
      if (!sessionStorage.TransferServerURL) {sessionStorage.setItem('TransferServerURL', '//qaiapps.groups.be/ariane-transfer/');}

      /**************
       * PRODUCTION: BELGIUM
       * **************/
    } else if (_.contains(url, 'transfer.groups.be')) {
      sessionStorage.setItem('TransferBaseURL', '//transfer.groups.be/transfer/');
      if (!sessionStorage.TransferServerURL) {sessionStorage.setItem('TransferServerURL', '//transfer.groups.be/ariane-transfer/');}
    }
  };

  var reportError = function (error, message) {
    message = message || '';
    console.error(
      'ERROR: ' + message + ' [' + error.toString() + ']\n' +
      '\nName:\t\t' + (error.name || '-') +
      '\nMessage:\t' + (error.message || '-') +
      '\nFile:\t\t\t' + (error.fileName || '-') +
      '\nSource:\t\t' + ((error.toSource && error.toSource()) || '-') +
      '\nLine #:\t\t' + (error.lineNumber || '-') +
      '\nColumn #:\t' + (error.columnNumber || '-') +
      '\n\nStack:\n\n' + (error.stack || '-')
    );
  };

  window.onerror = function (message, filename, lineno, colno, error) {
    error.fileName     = error.fileName || filename || null;
    error.lineNumber   = error.lineNumber || lineno || null;
    error.columnNumber = error.columnNumber || colno || null;
    reportError(error, 'Uncatched Exception');
  };

  return {
    smessage:             smessage,
    errorMessage:         errorMessage,
    setTransferURL:       setTransferURL,
    getURLParameter:      getURLParameter,
    endsWith:             endsWith,
    bytesToSize:          bytesToSize,
    getNavigatorLanguage: getNavigatorLanguage,
    docCookies:           docCookies,
    relPathToAbs:         relPathToAbs,
    executeOnce:          executeOnce,
    deleteCookie:         deleteCookie,
  }
}());

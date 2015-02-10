/**
 * Created by bisconti on 07/01/15.
 */

var Utils = (function() {
  'use strict';

  var smessage = function(title, message, type, timer) {
      swal({
        title: title || ' ',
        text:  message || ' ',
        type:  type || 'error',
        timer: timer || 4000
      });
    },
    errorMessage = function(message, timer) {
      smessage('ERROR', message, 'error', timer);
    },

    endsWith = function(str, suffix) {
      return str.indexOf(suffix, str.length - suffix.length) !== -1;
    },

    getURLParameter = function(sParam) {
      var sPageURL = window.location.search.substring(1);
      var sURLVariables = sPageURL.split('&');
      for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
          return sParameterName[1];
        }
      }
    },

    bytesToSize = function(bytes) {
      var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'],
        i;
      if (bytes === 0) {
        return '0 Byte';
      }
      i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
    },

    /**
     * Returns one of supported language, default if not.
     * Supported languages: 'nl', 'fr', 'en' (default).
     * @returns {string}
     */
    getNavigatorLanguage = function() {
      var locale = (window.navigator.userLanguage || window.navigator.language);
      locale = /..-../.test(locale) ? locale.split('-')[0] : locale.split('_')[0];
      if ((locale !== 'en') && (locale !== 'fr') && (locale !== 'nl')) {
        locale = 'en';
      }
      return locale;
    },

    setTransferURL = function() {
      var url = window.location.hostname;
      if (localStorage.TransferBaseURL) {
        sessionStorage.setItem('TransferBaseURL', localStorage.TransferBaseURL);
        sessionStorage.setItem('TransferServerURL', localStorage.TransferServerURL);
      } else if (_.contains(url, 'localhost')) {
        /***** LOCAL *****/
        sessionStorage.setItem('TransferBaseURL', '//localhost:4000/transfer/');
        sessionStorage.setItem('TransferServerURL', '//172.20.20.64:8018/');
        //sessionStorage.setItem('TransferServerURL', '//deviapps.groups.be/ariane/');
        if (!localStorage.country) { localStorage.setItem('country', 'FR');}
      } else if (_.contains(url, '172.20.20.64')) {
        if (!sessionStorage.TransferBaseURL) { sessionStorage.setItem('TransferBaseURL', '//172.20.20.64:4000/');}
        if (!sessionStorage.TransferServerURL) {sessionStorage.setItem('TransferServerURL', '//172.20.20.64:8018/');}
        //sessionStorage.setItem('TransferServerURL', '//deviapps.groups.be/ariane/');
        if (!localStorage.country) { localStorage.setItem('country', 'FR');}
      } else if (_.contains(url, 'pdevg1')) {
        if (!sessionStorage.TransferBaseURL) { sessionStorage.setItem('TransferBaseURL', '//pdevg1:4000/');}
        if (!sessionStorage.TransferServerURL) {sessionStorage.setItem('TransferServerURL', '//pdevg1:8018');}
        if (!localStorage.country) { localStorage.setItem('country', 'FR');}

        /**************
         * DEV & QA
         **************/
      } else if (_.contains(url, 'deviapps')) {
        if (!sessionStorage.TransferBaseURL) { sessionStorage.setItem('TransferBaseURL', '//deviapps.groups.be/prestaweb/transfer/');}
        if (!sessionStorage.TransferServerURL) {sessionStorage.setItem('TransferServerURL', '//deviapps.groups.be/ariane/');}
        if (!localStorage.country) { localStorage.setItem('country', 'FR');}
      } else if (_.contains(url, 'qaiapps')) {
        if (!sessionStorage.TransferBaseURL) { sessionStorage.setItem('TransferBaseURL', '//qaiapps.groups.be/transfer/');}
        if (!sessionStorage.TransferServerURL) {sessionStorage.setItem('TransferServerURL', '//qaiapps.groups.be/ariane/');}
        if (!localStorage.country) { localStorage.setItem('country', 'BE');}

        /**************
         * PRODUCTION: BELGIUM
         * **************/
      } else if (_.contains(url, 'transfer.groups.be')) {
        if (!sessionStorage.TransferBaseURL) { sessionStorage.setItem('TransferBaseURL', '//transfer.groups.be/transfer/');}
        if (!sessionStorage.TransferServerURL) {sessionStorage.setItem('TransferServerURL', '//transfer.groups.be/ariane/');}
        if (!localStorage.country) { localStorage.setItem('country', 'BE');}
      } else if (_.contains(url, 'online.groups.be')) {
        if (!sessionStorage.TransferBaseURL) { sessionStorage.setItem('TransferBaseURL', '//online.groups.be/transfer/');}
        if (!sessionStorage.TransferServerURL) {sessionStorage.setItem('TransferServerURL', '//online.groups.be/ariane/');}
        if (!localStorage.country) { localStorage.setItem('country', 'BE');}
        /**************
         * PRODUCTION: TRANSFER FRANCE
         * **************/
      } else if (_.contains(url, 'transfer.groupsfrance.fr')) {
        if (!sessionStorage.TransferBaseURL) { sessionStorage.setItem('TransferBaseURL', '//transfer.groupsfrance.fr/');}
        if (!sessionStorage.TransferServerURL) {sessionStorage.setItem('TransferServerURL', '//transfer.groupsfrance.fr/ariane/');}
        if (!localStorage.country) { localStorage.setItem('country', 'FR');}
      } else if (_.contains(url, 'transfer.groupsfrance.com')) {
        if (!sessionStorage.TransferBaseURL) { sessionStorage.setItem('TransferBaseURL', '//transfer.groupsfrance.com/');}
        if (!sessionStorage.TransferServerURL) {sessionStorage.setItem('TransferServerURL', '//transfer.groupsfrance.com/ariane/');}
        if (!localStorage.country) { localStorage.setItem('country', 'FR');}
        /**************
         * PRODUCTION: PORTAL FRANCE
         * **************/
      } else if (_.contains(url, 'online.groupsfrance.fr')) {
        if (!sessionStorage.TransferBaseURL) { sessionStorage.setItem('TransferBaseURL', '//online.groupsfrance.fr/transfer/');}
        if (!sessionStorage.TransferServerURL) {sessionStorage.setItem('TransferServerURL', '//online.groupsfrance.fr/ariane/');}
        if (!localStorage.country) { localStorage.setItem('country', 'FR');}
      } else if (_.contains(url, 'online.groupsfrance.com')) {
        if (!sessionStorage.TransferBaseURL) { sessionStorage.setItem('TransferBaseURL', '//online.groupsfrance.com/transfer/');}
        if (!sessionStorage.TransferServerURL) {sessionStorage.setItem('TransferServerURL', '//online.groupsfrance.com/ariane/');}
        if (!localStorage.country) { localStorage.setItem('country', 'FR');}
      }
    },

    reportError = function(error, message) {
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

  window.onerror = function(message, filename, lineno, colno, error) {
    error.fileName = error.fileName || filename || null;
    error.lineNumber = error.lineNumber || lineno || null;
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
    getNavigatorLanguage: getNavigatorLanguage
  }
}());

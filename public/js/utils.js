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

    getUrlParameter = function(sParam) {
      var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        i;
      for (i = 0; i < sURLVariables.length; i++) {
        if (sURLVariables[i] === sParam) {
          return sURLVariables[i];
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
      return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
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
      if (_.contains(url, 'localhost')) {
        /***** LOCAL *****/
        sessionStorage.setItem('TransferBaseURL', '//localhost:4000/transfer/');
        sessionStorage.setItem('TransferServerURL', '//172.20.20.64:8018/');
        //sessionStorage.setItem('TransferServerURL', '//deviapps.groups.be/ariane/');
        sessionStorage.setItem('country', 'BE');
        //sessionStorage.setItem('tokenPortal', 'F19EG686BTITNPHX788I5WR682E5TBMP8PBHEHK6SJCVFMAUD469HLMN4NK9HUVKJTB17230RKELJ21L91');

      } else if (_.contains(url, '172.20.20.64')) {
        sessionStorage.setItem('TransferBaseURL', '//172.20.20.64:4001/');
        sessionStorage.setItem('TransferServerURL', '//deviapps.groups.be/ariane/');
        sessionStorage.setItem('country', 'BE');

      } else if (_.contains(url, 'deviapps')) {
        sessionStorage.setItem('TransferBaseURL', '//deviapps.groups.be/transfer/public/');
        sessionStorage.setItem('TransferServerURL', '//deviapps.groups.be/ariane/');
        sessionStorage.setItem('country', 'BE');
      } else if (_.contains(url, 'qaiapps')) {
        sessionStorage.setItem('TransferBaseURL', '//qaiapps.groups.be/transfer/');
        sessionStorage.setItem('TransferServerURL', '//qaiapps.groups.be/ariane/');
        sessionStorage.setItem('country', 'BE');

        /***** PRODUCTION *****/
      } else if (_.contains(url, 'transfer.groups.be')) {
        sessionStorage.setItem('TransferBaseURL', '//transfer.groups.be/');
        sessionStorage.setItem('TransferServerURL', '//transfer.groups.be/ariane/');
        sessionStorage.setItem('country', 'BE');
      } else if (_.contains(url, 'transfer.groupsfrance.fr')) {
        sessionStorage.setItem('TransferBaseURL', '//transfer.groupsfrance.fr/');
        sessionStorage.setItem('TransferServerURL', '//transfer.groupsfrance.fr/ariane/');
        sessionStorage.setItem('country', 'FR');
      } else if (_.contains(url, 'online.groups.be')) {
        sessionStorage.setItem('TransferBaseURL', '//online.groups.be/transfer/');
        sessionStorage.setItem('TransferServerURL', '//online.groups.be/ariane/');
        sessionStorage.setItem('country', 'BE');
      } else if (_.contains(url, 'online.groupsfrance.fr')) {
        sessionStorage.setItem('TransferBaseURL', '//online.groupsfrance.fr/transfer/');
        sessionStorage.setItem('TransferServerURL', '//online.groupsfrance.fr/ariane/');
        sessionStorage.setItem('country', 'FR');
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
    smessage:        smessage,
    errorMessage:    errorMessage,
    setTransferURL:  setTransferURL,
    getUrlParameter: getUrlParameter,
    endsWith:        endsWith,
    bytesToSize:     bytesToSize,
    getNavigatorLanguage: getNavigatorLanguage
  }
}());

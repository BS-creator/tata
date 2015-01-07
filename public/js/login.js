/**
 * Created by bisconti on 29/08/14.
 */

/*globals swal, _ */
$(function (swal, _, utils) {
  'use strict';

  /***  GLOBAL VARIABLES ***/
  var TransferServerURL = sessionStorage.getItem('TransferServerURL'),
    TransferBaseURL = sessionStorage.getItem('TransferBaseURL'),
    i18n = {
      'fr': {
        'login'   : "Nom d'utilisateur",
        'password': "Mot de passe",
        'button'  : 'ENTRER'
      },
      'nl': {
        'login'   : "Gebruikersnaam",
        'password': "Wachtwoord",
        'button'  : 'INLOGGEN'
      },
      'en': {
        'login'   : "login",
        'password': "password",
        'button'  : 'LOGIN'
      }

    };


  function reportError(error, message) {
    message = message || '';
    console.error(
      'ERROR: ' + message + ' [' + error.toString() + ']\n' +
      '\nName:\t\t' + (error.name || '-') +
      '\nMessage:\t' + (error.message || '-') +
      '\nFile:\t\t\t' + (error.fileName || '-') +
      '\nSource:\t\t' + ((error.toSource && error.toSource()) || '-') +
      '\nLine #:\t\t' + (error.lineNumber || '-') +
      '\nColumn #:\t' + (error.columnNumber || '-') +
      '\n\nStack:\n\n' + (error.stack || '-'));
  }

  window.onerror = function (message, filename, lineno, colno, error) {
    error.fileName = error.fileName || filename || null;
    error.lineNumber = error.lineNumber || lineno || null;
    error.columnNumber = error.columnNumber || colno || null;
    reportError(error, 'Uncatched Exception');
  };


  function setURL() {
    var url = window.location.hostname;
    if (_.contains(url, 'localhost')) {
      /***** LOCAL *****/
        //sessionStorage.setItem('TransferBaseURL', '//localhost:4000/itransfer/');
      sessionStorage.setItem('TransferBaseURL', '//localhost:4001/');
      sessionStorage.setItem('TransferServerURL', '//172.20.20.64:8018/');
      //sessionStorage.setItem('TransferServerURL', '//deviapps.groups.be/ariane/');
    } else if (_.contains(url, '172.20.20.64')) {
      sessionStorage.setItem('TransferBaseURL', '//172.20.20.64:4001/');
      sessionStorage.setItem('TransferServerURL', '//deviapps.groups.be/ariane/');
    } else if (_.contains(url, 'deviapps')) {
      /***** DEV *****/
      sessionStorage.setItem('TransferBaseURL', '//deviapps.groups.be/itransfer/public/');
      sessionStorage.setItem('TransferServerURL', '//deviapps.groups.be/ariane/');
    } else if (_.contains(url, 'qaiapps')) {
      /***** QA *****/
      sessionStorage.setItem('TransferBaseURL', '//qaiapps.groups.be/itransfer/');
      sessionStorage.setItem('TransferServerURL', '//qaiapps.groups.be/ariane/');
    } else if (_.contains(url, 'transfer.groups.be')) {
      /***** PROD *****/
      sessionStorage.setItem('TransferBaseURL', '//transfer.groups.be/');
      sessionStorage.setItem('TransferServerURL', '//transfer.groups.be/ariane/');
    } else if (_.contains(url, 'online.groups.be')) {
      /***** PORTAL *****/
      sessionStorage.setItem('TransferBaseURL', '//online.groups.be/transfer/');
      sessionStorage.setItem('TransferServerURL', '//online.groups.be/ariane/');
    } else if (_.contains(url, 'groupsfrance.fr')) {
      /***** FRANCE *****/
      sessionStorage.setItem('TransferBaseURL', '//online.groupsfrance.fr/transfer/');
      sessionStorage.setItem('TransferServerURL', '//online.groupsfrance.fr/ariane/');
      sessionStorage.setItem('country', 'france');
    }
  }


  /**
   * Returns one of supported language, default if not.
   * Supported languages: 'nl', 'fr', 'en' (default).
   * @returns {string}
   */
  function getNavigatorLanguage() {
    var locale = (window.navigator.userLanguage || window.navigator.language);
    locale = /..-../.test(locale) ? locale.split('-')[0] : locale.split('_')[0];
    if ((locale !== 'en') && (locale !== 'fr') && (locale !== 'nl')) {
      locale = 'en';
    }
    return locale;
  }


  function enterPressed(e) {
    if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
      submitLogin();
      return false;
    } else {
      return true;
    }
  }

  function submitLogin() {
    var credentials =
    {
      'login'   : $('#login').val(),
      'password': $('#password').val()
    };

    $('#loader').show();

    $.ajax({
      type    : 'POST',
      url     : TransferServerURL + 'login',
      data    : credentials,
      success : function (data) {
        if (data.token) {
          sessionStorage.setItem('tokenTransfer', data.token);
          sessionStorage.setItem('username', credentials.login);
          //redirect to Transfer;
          window.location = TransferBaseURL + 'transferApp.html';
        }
      },
      dataType: 'json',
      /*complete: function () {
       $('#loader').hide();
       },*/
      error   : function (xhr) {
        $('#loader').hide();
        if (xhr.status === 403) {
          swal({
            title: "ERROR",
            text : "Login / password incorrect.",
            type : "error",
            timer: 3000
          });
        } else {
          swal({
            title: "ERROR",
            text : "Connection problem.",
            type : "error",
            timer: 3000
          });
        }
      }
    });
  }

  function setLanguage(lang) {
    $('#login').attr('placeholder', i18n[lang].login);
    $('#password').attr('placeholder', i18n[lang].password);
    $('#submit-login').text(i18n[lang].button);
  }

  (function init() {

    utils.setURL();

    //set language
    sessionStorage.setItem('lang', getNavigatorLanguage());
    $('.' + getNavigatorLanguage()).addClass('default-lang');


    //set event
    $('#submit-login').on('click', submitLogin);
    $('input').keypress(enterPressed);
    $('.login-lang').on('click', function () {
      var lang = $(this).html().toLowerCase();
      $('.login-lang').removeClass('default-lang');
      $('.' + lang).addClass('default-lang');
      sessionStorage.setItem('lang', lang);
      setLanguage(lang);
    });

  })();

}(swal, _, utils));

/**
 * Created by bisconti on 29/08/14.
 */

/*code to send cookie with every request */
$.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
  options.crossDomain ={
    crossDomain: true
  };
  options.xhrFields = {
    withCredentials: true
  };
});

/*globals swal, _ */
$(function(swal, _, Utils) {
  'use strict';

  /***  GLOBAL VARIABLES ***/
  var TransferServerURL = sessionStorage.getItem('TransferServerURL'),
    TransferBaseURL = sessionStorage.getItem('TransferBaseURL'),
    lang = sessionStorage.getItem('lang') || localStorage.lastLanguage,
    i18n = {
      fr: {
        login:  'Nom d\'utilisateur',
        password: 'Mot de passe',
        button: 'ENTRER'
      },
      nl: {
        login:  'Gebruikersnaam',
        password: 'Wachtwoord',
        button: 'INLOGGEN'
      },
      en: {
        login:  'Username',
        password: 'Password',
        button: 'SIGN IN'
      }

    };

  function enterPressed(e) {
    if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
      submitLogin();
      return false;
    } else {
      return true;
    }
  }

  function submitLogin() {
    var credentials = {
      login:    $('#login').val(),
      password: $('#password').val()
    };

    Utils.docCookies.removeItem('ariane');
    Utils.docCookies.removeItem('ariane-transfer');


    $('#loader').show();
    if (!TransferServerURL) {
      TransferServerURL = sessionStorage.getItem('TransferServerURL');
      TransferBaseURL = sessionStorage.getItem('TransferBaseURL');
      lang = sessionStorage.getItem('lang') || localStorage.lastLanguage;
    }
    $.ajax({
      type:    'POST',
      url:     TransferServerURL + 'login',
      data:    credentials,
      success: function(data) {
        if (data.token) {
          sessionStorage.setItem('tokenTransfer', data.token);
          sessionStorage.setItem('username', credentials.login.toUpperCase());
          //redirect to Transfer;
          window.location = 'transferApp.html';
        }
      },
      dataType: 'json',
      /*complete: function() {
       $('#loader').hide();
       },*/
      error:   function(xhr) {
        $('#loader').hide();
        if (xhr.status === 403) {
          Utils.errorMessage('Login / password incorrect.', 3000);
        } else if (xhr.status >= 500) {
          Utils.errorMessage('Service Unavailable.', 3000);
        } else {
          Utils.errorMessage('Connection problem.', 3000);
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

    Utils.setTransferURL();

    if (!localStorage.lastLanguage) {
      //set language
      sessionStorage.setItem('lang', Utils.getNavigatorLanguage());
      $('.' + Utils.getNavigatorLanguage()).addClass('default-lang');
      //console.log(' Utils.getNavigatorLanguage() = ' + Utils.getNavigatorLanguage());
    } else {
      sessionStorage.setItem('lang', localStorage.lastLanguage);
      $('.' + localStorage.lastLanguage).addClass('default-lang');
    }
    //set event
    $('#submit-login').on('click', submitLogin);
    $('input').keypress(enterPressed);
    $('.login-lang').on('click', function() {
      var lang = $(this).html().toLowerCase();
      $('.login-lang').removeClass('default-lang');
      $('.' + lang).addClass('default-lang');
      sessionStorage.setItem('lang', lang);
      setLanguage(lang);
    });

  })();

}(swal, _, Utils));

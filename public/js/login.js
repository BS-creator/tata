/**
 * Created by bisconti on 29/08/14.
 */

/*globals swal, _ */
$(function (swal, _, Utils) {
  'use strict';

  /***  GLOBAL VARIABLES ***/
  var TransferServerURL = sessionStorage.getItem('TransferServerURL'),
    TransferBaseURL = sessionStorage.getItem('TransferBaseURL'),
    lang = sessionStorage.getItem('lang') || localStorage.lastLanguage,
    i18n = {
      'fr': {
        'login':  "Nom d'utilisateur",
        'password': "Mot de passe",
        'button': 'ENTRER'
      },
      'nl': {
        'login':  "Gebruikersnaam",
        'password': "Wachtwoord",
        'button': 'INLOGGEN'
      },
      'en': {
        'login':  "login",
        'password': "password",
        'button': 'LOGIN'
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

    $('#loader').show();
    if (!TransferServerURL) {
      TransferServerURL = sessionStorage.getItem('TransferServerURL');
      TransferBaseURL = sessionStorage.getItem('TransferBaseURL');
      lang = sessionStorage.getItem('lang') || localStorage.lastLanguage;
      console.log('TransferServerURL = ' + TransferServerURL);
    }
    $.ajax({
      type:    'POST',
      url:     TransferServerURL + 'login',
      data:    credentials,
      success: function (data) {
        if (data.token) {
          sessionStorage.setItem('tokenTransfer', data.token);
          sessionStorage.setItem('username', credentials.login);
          //redirect to Transfer;
          window.location = TransferBaseURL + 'transferApp.html';
        }
      },
      dataType: 'json',
      /*complete: function() {
       $('#loader').hide();
       },*/
      error:   function (xhr) {
        $('#loader').hide();
        if (xhr.status === 403) {
          Utils.errorMessage('Login / password incorrect.', 3000);
          /*swal({
           title: "ERROR",
           text : "Login / password incorrect.",
           type : "error",
           timer: 3000
           });*/
        } else {
          Utils.errorMessage('Connection problem.', 3000);
          /*swal({
           title: "ERROR",
           text : "Connection problem.",
           type : "error",
           timer: 3000
           });*/
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

    //set language
    sessionStorage.setItem('lang', Utils.getNavigatorLanguage());
    $('.' + Utils.getNavigatorLanguage()).addClass('default-lang');
    console.log(' Utils.getNavigatorLanguage() = ' + Utils.getNavigatorLanguage());

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

}(swal, _, Utils));

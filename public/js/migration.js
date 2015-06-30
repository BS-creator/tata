/**
 * Created by bisconti on 26/06/15.
 */

/*globals $,_ */

var migrationUser = (function migration() {

  var hashArray;
  var login;
  var password;
  var appBack;
  var accountType;

  var lang = sessionStorage.getItem('lang') || localStorage.lastLanguage;

  var i18n = {
    fr: {
      header:          'Formulaire de Migration',
      firstname:       'Prénom',
      lastname:        'Nom de famille',
      button:          'Envoyer',
      yes:             'OUI',
      no:              'NON',
      errorData:       'Erreur: problème de connexion.',
      redirectURL:     'Voulez-vous continuer vers l\'application?',
      redirectConfirm: 'Application',
      onlyOneUser:     'Vous êtes la seule personne a utilisé ce compte',
      onlyOneUserb:    'Si ce compte est utilisé par plusieurs personnes, indiquer le nom/prénom/email de l\'utilisateur principal',
      validEmail:      'Une adresse email valide est nécessaire.',
      validfn:         'Un prénom valide est nécessaire.',
      validln:         'Un nom de famille est nécessaire.'
    },
    nl: {
      header:          'Migratie Formulier',
      firstname:       'Voornaam',
      lastname:        'Familienaam',
      button:          'Sturen',
      yes:             'JA',
      no:              'NEE',
      errorData:       'Error: verbinding fout',
      redirectURL:     'Wilt u door de applicatie gaan?',
      redirectConfirm: 'Applicatie',
      onlyOneUser:     'U bent de enige persoon die deze account gebruikt',
      onlyOneUserb:    'Als deze account door meerdere personen gebruikt wordt, geven naam / voornaam / email van de hoofdebruiker',
      validEmail:      'Een geldig email is nodig.',
      validfn:         'Eem geldig voornaam is nodig.',
      validln:         'Eem geldig familienaam is nodig.'
    },
    en: {
      header:          'Migration Forms',
      firstname:       'Username',
      lastname:        'Password',
      button:          'SEND DATA',
      yes:             'YES',
      no:              'NO',
      errorData:       'Error: connexion problem',
      redirectURL:     'Would you like to go the application',
      redirectConfirm: 'Application',
      onlyOneUser:     'You are the only one using this account ',
      onlyOneUserb:    'If this account is used by more than person, use the main user name and email',
      validEmail:      'A *valid* email address is needed.',
      validfn:         'A first name is needed.',
      validln:         'A last name is needed.'
    }
  };

  function setLanguage() {
    var $oou = $('#onlyOneUser');
    $oou.data('on-text', i18n[lang].yes);
    $oou.data('off-text', i18n[lang].no);
    $('.jumbotron > div > h1').html(i18n[lang].header);
    $('.onlyOneUser').html(i18n[lang].onlyOneUser);
    $('.onlyOneUserb').html(i18n[lang].onlyOneUserb);
    $('#firstname').attr('placeholder', i18n[lang].firstname);
    $('#lastname').attr('placeholder', i18n[lang].lastname);
    $('#submit-info').html(i18n[lang].button);

  }

  function enterPressed(e) {
    if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
      submitInfo();
      return false;
    } else {
      return true;
    }
  }

  function validateEmail(email) {
    var emailReg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailReg.test(email);
  }

  function getAnalyticsURL() {
    if (_.contains(window.location.href, 'localhost') && sessionStorage.TransferServerURL) {
      return sessionStorage.TransferServerURL.replace(/8019/g, '8011')
    } else {
      return sessionStorage.TransferServerURL.replace(/ariane-transfer/g, 'analytics')
    }
  }

  function gethash(debug) {
    // 1- get hash in url and fill login/pass field
    // 2- remove hash (put it to just #)

    hashArray = window.location.hash.substring(1).split('&');

    var tmp;
    _.forEach(hashArray, function (i) {
      tmp = i.split('=');
      switch (tmp[0]) {
        case "login":
          if (tmp[1]) {
            login = tmp[1];
            $('#login').val(login); //console.log('login');
          }
          break;
        case "password":
          if (tmp[1]) {
            password = tmp[1];
            $('#password').val(tmp[1]); //console.log('password');
          }
          break;
        case "appback":
          if (tmp[1]) {
            appBack = tmp[1];
            //??? What to do with that ??
          }
          break;
        case "accountType":
          if (tmp[1]) {
            accountType = tmp[1];
            $('[name="accountType"]').val(tmp[1]); //console.log('accountType');
          }
          break;
      }
    });

    window.location.hash = '#';
  }

  function redirectAppBack() {
    if (appBack === 'transfer') {
      window.location.href = sessionStorage.getItem('TransferBaseURL') + 'transferApp.html'
    }
  }

  function redirectSuccess() {
    swal({
      title:          'OK',
      type:           'success',
      timer:          3000,
      closeOnConfirm: false
    }, function () {
      redirectAppBack();
    });
  }

  function redirectOnError() {
    swal({
      title:          i18n[lang].errorData,
      type:           'error',
      timer:          3000,
      closeOnConfirm: false
    }, function () {
      swal({
        title:              "Error",
        text:               i18n[lang].redirectURL,
        type:               "warning",
        showCancelButton:   true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText:  i18n[lang].redirectConfirm,
        closeOnConfirm:     false
      }, function (isConfirm) {
        if (isConfirm) {
          redirectAppBack();
        }
      });
    });
  }

  function submitInfo() {

    var email       = $('.email').val();
    var firstname   = $('#firstname').val();
    var lastname    = $('#lastname').val();
    var onlyOneUser = $('#onlyOneUser').is(':checked');

    // check all fields are filled

    // check email validity
    if (!email || !validateEmail(email)) {
      swal({title: i18n[lang].validEmail, type: "error"});
      return;
    }
    if (!firstname) {
      swal({title: i18n[lang].validfn, type: "error"});
      return;
    }
    if (!lastname) {
      swal({title: i18n[lang].validln, type: "error"});
      return;
    }

    return $.ajax({
      contentType: 'application/json',
      'type':      'PUT',
      'url':       getAnalyticsURL() + 'accountnotes/' + accountType + '/' + login,
      'data':      JSON.stringify({
        "password":    password,
        "onlyOneUser": onlyOneUser,
        "firstName":   firstname,
        "lastName":    lastname,
        "email":       email
      }),
      success:     function (data) {
        console.log(data);
        redirectSuccess();
      },
      error:       function (xhr) {
        console.log(xhr);
        redirectOnError();
      }
    });

  }

  function setEvent() {
    setLanguage();
    $('#onlyOneUser').bootstrapSwitch();
    $('#submit-info').on('click', submitInfo);
    $('input').keypress(enterPressed);
  }

  function main() {
    setEvent();
    gethash();

  }

  $(main);

  return {
    hashArray:       hashArray,
    login:           login,
    password:        password,
    appBack:         appBack,
    accountType:     accountType,
    getAnalyticsURL: getAnalyticsURL,
    redirectOnError: redirectOnError,
    gethash:         gethash
  }
}());

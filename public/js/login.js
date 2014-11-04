/**
 * Created by bisconti on 29/08/14.
 */

$( function (){
    'use strict';

    (function setURL(){
        if ( window.location.hostname.indexOf( 'localhost' ) > -1 ) {
            /***** LOCAL *****/
            //sessionStorage.setItem( 'baseURL', '//localhost:4000/itransfer/' );
            sessionStorage.setItem( 'baseURL', '//localhost:4001/' );
            sessionStorage.setItem( 'serverURL', '//172.20.20.64:8018/' );
            //sessionStorage.setItem('serverURL', '//deviapps.groups.be/ariane/');
        } else if ( window.location.hostname.indexOf( 'deviapps' ) > -1 ) { //dev
            /***** DEV *****/
            sessionStorage.setItem( 'baseURL', '//deviapps.groups.be/itransfer/public/' );
            sessionStorage.setItem( 'serverURL', '//deviapps.groups.be/ariane/' );
        } else if ( window.location.hostname.indexOf( 'qaiapps' ) > -1 ) { //QA
            /***** QA *****/
            sessionStorage.setItem( 'baseURL', '//qaiapps.groups.be/itransfer/' );
            sessionStorage.setItem( 'serverURL', '//qaiapps.groups.be/ariane/' );
        } else if ( window.location.hostname.indexOf( 'transfer.groups.be' ) > -1 ) { //PROD
            /***** PROD *****/
            sessionStorage.setItem( 'baseURL', '//transfer.groups.be/' );
            sessionStorage.setItem( 'serverURL', '//transfer.groups.be/ariane/' );
        }
    }());

    /***  GLOBAL VARIABLES ***/
    var serverURL = sessionStorage.getItem( 'serverURL' ),
    baseURL = sessionStorage.getItem( 'baseURL' );


    function reportError( error, message ){
        message = message || '';
        console.error(
                'ERROR: ' + message + ' [' + error.toString() + ']\n' +
                '\nName:\t\t' + (error.name || '-') +
                '\nMessage:\t' + (error.message || '-') +
                '\nFile:\t\t\t' + (error.fileName || '-') +
                '\nSource:\t\t' + ((error.toSource && error.toSource()) || '-') +
                '\nLine #:\t\t' + (error.lineNumber || '-') +
                '\nColumn #:\t' + (error.columnNumber || '-') +
                '\n\nStack:\n\n' + (error.stack || '-') );
    }

    window.onerror = function ( message, filename, lineno, colno, error ){
        error.fileName = error.fileName || filename || null;
        error.lineNumber = error.lineNumber || lineno || null;
        error.columnNumber = error.columnNumber || colno || null;
        reportError( error, 'Uncatched Exception' );
    };

    /**
     * Returns one of supported language, default if not.
     * Supported languages: 'nl', 'fr', 'en' (default).
     * @returns {string}
     */
    function getNavigatorLanguage(){
        var locale = (window.navigator.userLanguage || window.navigator.language);
        locale = /..-../.test( locale ) ? locale.split( '-' )[0] : locale.split( '_' )[0];
        if ( (locale !== 'en') && (locale !== 'fr') && (locale !== 'nl') ) {
            locale = 'en';
        }
        return locale;
    }


    function enterPressed( e ){
        if ( (e.which && e.which === 13) || (e.keyCode && e.keyCode === 13) ) {
            submitLogin();
            return false;
        } else {
            return true;
        }
    }

    function submitLogin(){
        var credentials =
            {
                'login'   : $( '#login' ).val(),
                'password': $( '#password' ).val()
            };

        $( '#loader' ).show();

        $.ajax( {
            type    : 'POST',
            url     : serverURL + 'login',
            data    : credentials,
            success : function ( data ){
                if ( data.token ) {
                    sessionStorage.setItem( 'token', data.token );
                    sessionStorage.setItem( 'username', credentials.login );
                }
                //redirect to itransfer;
                window.location = baseURL + 'file.html';
                window.login = $( '#login' ).val();
            },
            dataType: 'json',
            /*complete: function () {
             $('#loader').hide();
             },*/
            error   : function ( xhr ){
                $( '#loader' ).hide();
                if ( xhr.status === 403 ) {
                    /*alert( 'ERROR: login / password incorrect.' );*/
                    swal({
                        title: "ERROR",
                        text: "Login / password incorrect.",
                        type: "error",
                        timer: 3000
                    });
                } else {
                    //alert( 'ERROR: connection problem' );
                    swal({
                        title: "ERROR",
                        text: "Connection problem.",
                        type: "error",
                        timer: 3000
                    });
                }
            }
        } );
    }

    //set language
    sessionStorage.setItem( 'lang', getNavigatorLanguage() );
    $( '.' + getNavigatorLanguage() ).addClass( 'default-lang' );


    //set event
    $( '#submit-login' ).on( 'click', submitLogin );
    $( 'input' ).keypress( enterPressed );
    $( '.login-lang' ).on( 'click', function (){
        var lang = $( this ).html().toLowerCase();
        $( '.login-lang' ).removeClass( 'default-lang' );
        $( '.' + lang ).addClass( 'default-lang' );
        sessionStorage.setItem( 'lang', lang );
    } );
} );
/**
 * Created by bisconti on 29/08/14.
 */

$(function (){
    "use strict";

    var serverURL = 'http://172.20.20.64:8018/',
    //var serverURL = 'http://qaiapps.groups.be/ariane/',
        baseURL = 'http://localhost:4000/itransfer/';

    function enterPressed (e) {
        if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
            submitLogin();
            return false;
        } else {
            return true;
        }
    }

    function submitLogin(){
        var credentials =
        {
            "login"     : $('#login').val(),
            "password"  : $('#password').val()
        };

      $('#loader').show();

        $.ajax({
            type: "POST",
            url: serverURL + 'login',
            data: credentials,
            success: function (data){
                if(data.token){
                    sessionStorage.setItem("token", data.token);
                    sessionStorage.setItem("username", credentials.login);
                }
                //redirect to itransfer;
                window.location = baseURL + 'file.html';
                window.login = $('#login').val();
            },
            dataType: 'json',
            /*complete: function () {
              $('#loader').hide();
            },*/
            error: function (xhr) {
                console.log(xhr);
                if(xhr.status >= 500) {
                    alert ( "ERROR: connection problem");
                }
            },
            statusCode: {
                403: function() {
                    alert( "ERROR: login / password incorrect." );
                },
                401: function() {
                    alert ( "ERROR: connection problem");
                },
                504: function() {
                    alert ( "ERROR: connection problem");
                }
            }
        });
    }

    //set event
    $('#submit-login').on('click', submitLogin);
    $('input').keypress(enterPressed);
});
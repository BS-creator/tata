/**
 * Created by bisconti on 29/08/14.
 */

$(function (){
    "use strict";

  /*$('#loader').bind('ajaxStart', function(){
    console.log('test');
    $(this).show();
  }).bind('ajaxStop', function(){
    $(this).hide();
  });*/

    function submitLogin(){
        var credentials =
        {
            "login"     : $('#login').val(),
            "password"  : $('#password').val()
        };

      $('#loader').show();

        $.ajax({
            type: "POST",
            url: 'http://172.20.20.64:8018/login',
            data: credentials,
            success: function (data){
                if(data.token){
                    sessionStorage.setItem("token", data.token);
                    sessionStorage.setItem("username", credentials.login);
                }
                //redirect to itransfer;
                window.location = 'http://localhost:4000/itransfer/file.html';
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
    $('#submit-login').on('click', submitLogin);
});
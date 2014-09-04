/**
 * Created by bisconti on 29/08/14.
 */

$(function (){
    "use strict";

    function submitLogin(){
        var credentials =
        {
            "login"     : $('#login').val(),
            "password"  : $('#password').val()
        }
        $.ajax({
            type: "POST",
            url: 'http://172.20.20.64:8018/login',
            data: credentials,
            success: function (data){
                if(data.token){
                    sessionStorage.setItem("token", data.token);
                }
                //redirect to itransfer;
                window.location = 'http://localhost:4000/itransfer/file.html';
                window.login = $('#login').val();
            },
            dataType: 'json',
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
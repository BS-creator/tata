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
                //redirect to itransfert;
                window.location = 'http://localhost:4000/itransfer/file.html';
            },
            dataType: 'json'
        });
    }

    $('#submit-login').on('click', submitLogin);




});
'user strict'

$( document ).ready(function() {
    // sidenav //////////////////////////////////
    $("#sidenav h3").click(function(){
        $(this).next("ul").toggle();
    });
});

$(function() {

    $.ajax({
        type: 'GET',
        url: 'http://localhost:8009/file/hbrchdbridmxycvroqthk445/',
        success:function(resJSON){
            var templateSource   = $("#datatmpl").html(),
                template = Handlebars.compile(templateSource),
                tableHTML = template(resJSON);
            $('#mycontainerfortemplate').html(tableHTML);

        }})




});
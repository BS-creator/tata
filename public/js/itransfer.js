'user strict'

$( document ).ready(function() {
    // sidenav //////////////////////////////////
    $("#sidenav h3").click(function(){
        $(this).next("ul").toggle();
    });
});

$(function() {
    //var $mainTable = $('#mainTable > tbody:last');

    var lineObj = {};

    var template = Handlebars.compile(
            "<tr class='bg-new'>" +
            "    <td><input type='checkbox'/> </td>" +
            "    <td>{{date}}</td>" +
            "    <td>{{idFile}}</td>" +
            "    <td>{{file}}</td>" +
            "    <td>{{typedoc}}</td>" +
            "    <td>{{noemp}}</td>" +
            "    <td>{{ext}}</td>" +
            "</tr>");

    function addFile(file){

        $('#mainTable > tbody:last').after(template(file));
    }

    function convertJSONObj(obj){   }

    $.ajax({
        type: 'GET',
        url: 'http://localhost:8009/file/jxaqei45ibgph3bmuup4e345/',
        success: function (data) {
            $.each(data.data, function (i, item) {
                //012345678901234567890123456789012345678901234567890
                //FOPAI_0031_079983_000003_000181_20131022_000000.PDF
                var filename = item.filename;
                lineObj = {
                    "file"      : filename.substr(0,5),
                    "typedoc"   : filename.substr(6,4),
                    "noemp"     : filename.substr(11,6),
                    "refcpl"    : filename.substr(18,6),
                    "bla2"      : filename.substr(25,6),
                    "date"      : filename.substr(32,8),
                    "filedesc"  : filename.substr(41,6),
                    "ext"       : filename.substr(48,3)
                }
                addFile(lineObj);
            })
        }
    });
});
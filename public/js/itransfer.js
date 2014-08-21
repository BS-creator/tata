'user strict'
$( document ).ready(function() {

    // sidenav //////////////////////////////////
    $("#sidenav .sidenav-head").click(function(){
        $(this).children("ul").toggle();
    });

    $('div#sidenav ul li ul'){

    }

});

$(function() {
    //var $mainTable = $('#mainTable > tbody:last');

    var lineObj = {};

    var template = Handlebars.compile( //<input type='checkbox'/>
            "<tr class='bg-new'>" +
            "    <td><a class='btn dl' data-id='{{id}}' data-file='{{fileName}}' href='#'><i class='fa fa-download'></i> </a></td>" +
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
        url: 'http://172.20.20.64:8009/file/jxaqei45ibgph3bmuup4e345/',
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
                    "ext"       : filename.substr(48,3),
                    "id"        : item.idFile,
                    "fileName"  : filename
                }
                addFile(lineObj);
            })
        }
    });

    $('#mainTable').delegate('.dl', 'click', function(){
        $(this).attr('href', 'http://localhost:8009/file/jxaqei45ibgph3bmuup4e345/' + $(this).attr('data-id') + '/' + $(this).attr('data-file'));

    });
});


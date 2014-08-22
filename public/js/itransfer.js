'user strict'

$(function() {
    //var $mainTable = $('#mainTable > tbody:last');

    var lineObj = {};

    var template = Handlebars.compile( //<input type='checkbox'/>
            "<tr class='bg-new'>" +
            "    <td><a class='dl' data-id='{{id}}' data-file='{{fileName}}' href='#'><i class='fa fa-download'></i> </a></td>" +
            "    <td>{{date}}</td>" +
            /*"    <td>{{notDownloaded}}</td>" +*/
            "    <td>{{idFile}}</td>" +
            "    <td>{{file}}</td>" +
            "    <td>{{typeDoc}}</td>" +
            "    <td>{{noEmp}}</td>" +
            "    <td>{{ext}}</td>" +
            "</tr>");

    function addFile(file){
        $('#mainBody').append(template(file));
    }

    function convertJSONObj(obj){   }

    $.ajax({
        type: 'GET',
        url: 'http://172.20.20.64:8009/file/ndi1oiyceflacsjv0mngd5nm/',
        success: function (data) {
            $.each(data.data, function (i, item) {
                //012345678901234567890123456789012345678901234567890
                //FOPAI_0031_079983_000003_000181_20131022_000000.PDF
                var filename = item.filename;
                var dl = (item.downloadCount == 0);
                lineObj = {
                    "file"              : filename.substr(0,5),
                    "typeDoc"           : filename.substr(6,4),
                    "noEmp"             : filename.substr(11,6),
                    "refCpl"            : filename.substr(18,6),
                    "bla2"              : filename.substr(25,6),
                    "date"              : filename.substr(32,8),
                    "fileDesc"          : filename.substr(41,6),
                    "ext"               : filename.substr(48,3),
                    "id"                : item.idFile,
                    "fileName"          : filename,
                    "ftpNew"            : item.isNew,
                    "notDownloaded" : dl
                }
                addFile(lineObj);
            });
            ///$('#mainTable').tablesorter();

            $("#mainTable")
                .tablesorter({widthFixed: true, widgets: ['zebra']})
                .tablesorterPager({container: $("#pager")});

        }
    });

    $('#mainTable').delegate('.dl', 'click', function(){
        $(this).attr('href', 'http://172.20.20.64:8009/file/jxaqei45ibgph3bmuup4e345/' + $(this).attr('data-id') + '/' + $(this).attr('data-file'));

    });
});


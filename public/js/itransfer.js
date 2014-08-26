'user strict'

$(function() {
    //var $mainTable = $('#mainTable > tbody:last');

    var lineObj = {};

    var table =  $('#mainBody');

    var template = Handlebars.compile( //<input type='checkbox'/>
            // "<tr class='{{ftpNew}}'>" +
            "<tr class=''>" +
            "    <td class='{{notDownloaded}}'><a class='dl' data-id='{{id}}' data-file='{{fileName}}' href='#'><i class='fa fa-download'></i>" +
                " <small class='text-muted'>{{countDl}}</small> </a></td>" +
            "    <td>{{idFile}}</td>" +
            "    <td>{{date}}</td>" +
            "    <td>{{file}}</td>" +
            "    <td>{{noEmp}}</td>" +
            "    <td>{{ext}}</td>" +
            "</tr>");

    function addFile(file) {
        table.append(template(file));
    }

    function convertJSONObj(item){
        //012345678901234567890123456789012345678901234567890
        //FOPAI_0031_079983_000003_000181_20131022_000000.PDF
        var filename = item.filename,
            lineObj = {
                "file": filename.substr(0, 5),
                "typeDoc": filename.substr(6, 4),
                "noEmp": filename.substr(11, 6),
                "refCpl": filename.substr(18, 6),
                "bla2": filename.substr(25, 6),
                "date": filename.substr(32, 8),
                "fileDesc": filename.substr(41, 6),
                "ext": filename.substr(48, 3),
                "id": item.idFile,
                "fileName": filename,
                "ftpNew": item.isNew,
                "notDownloaded": (item.downloadCount == 0)
            }
    }

    function tableLine(data) {
        $('#mainTable').bootstrapTable({
            /*      method: 'get',
             url: 'http://deviapps.groups.be/ariane/file/2lclt345dkevwz45v0v32h45/',*/
            height: 400,
            striped: true,
            pagination: true,
            pageSize: 50,
            pageList: [10, 25, 50, 100, 200],
            search: true,
            showColumns: true,
            showRefresh: true,
            minimumCountColumns: 2,
            idField: "idFile"
        });
        /* $('#get-selections').click(function() {
         alert('Selected values: ' + JSON.stringify($table.bootstrapTable('getSelections')));
         });*/
        $.each(data.data, function (i, item) {
            addFile(convertJSONObj(item));
        });
        ///$('#mainTable').tablesorter();

        /* $("#mainTable")
         .tablesorter({widthFixed: true, widgets: ['zebra']})
         .tablesorterPager({container: $("#pager")});  */


    }

    $.ajax({
        type: 'GET',
        //url: 'http://deviapps.groups.be/ariane/file/2lclt345dkevwz45v0v32h45/',
        url: 'http://localhost:8018/file/tyy2no55byypmuujm4fdvhzk',
        success: tableLine
    });

    /*$('#mainTable').delegate('.dl', 'click', function(){
        $(this).attr('href', 'http://deviapps/ariane/file/2lclt345dkevwz45v0v32h45/' + $(this).attr('data-id') + '/' + $(this).attr('data-file'));

    });*/

});
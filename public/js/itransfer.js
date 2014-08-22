'user strict'

$(function () {
    //var $mainTable = $('#mainTable > tbody:last');

    var lineObj = {};

    var template = Handlebars.compile( //<input type='checkbox'/>
            "<tr>" +
            "    <td class='{{notDownloaded}}'><a class='dl' data-id='{{id}}' data-file='{{fileName}}' href='#'><i class='fa fa-download'></i> </a></td>" +
            "    <td>{{date}}</td>" +
            "    <td>{{idFile}}</td>" +
            "    <td>{{file}}</td>" +
            "    <td>{{typeDoc}}</td>" +
            "    <td>{{noEmp}}</td>" +
            "    <td>{{ext}}</td>" +
            "</tr>");

    function addFile(file) {
        $('#mainBody').append(template(file));
    }

    function convertJSONObj(obj) {
    }

    $.ajax({
        type: 'GET',
        url: 'http://deviapps.groups.be/ariane/file/2lclt345dkevwz45v0v32h45/',
        success: function (data) {
            $.each(data.data, function (i, item) {
                //012345678901234567890123456789012345678901234567890
                //FOPAI_0031_079983_000003_000181_20131022_000000.PDF
                var filename = item.filename;
                var dl = (item.downloadCount == 0);
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
                    "notDownloaded": dl
                }
                addFile(lineObj);
            });
            ///$('#mainTable').tablesorter();

            $("#mainTable")
                .tablesorter({widthFixed: true, widgets: ['zebra']})
                .tablesorterPager({container: $("#pager")});

        }
    });

    $('#mainTable').delegate('.dl', 'click', function () {
        $(this).attr('href', 'http://172.20.20.64:8009/file/jxaqei45ibgph3bmuup4e345/' + $(this).attr('data-id') + '/' + $(this).attr('data-file'));

    });

    $('#table-javascript').bootstrapTable({
        method: 'get',
        url: 'data2.json',
        height: 400,
        striped: true,
        pagination: true,
        pageSize: 50,
        pageList: [10, 25, 50, 100, 200],
        search: true,
        showColumns: true,
        showRefresh: true,
        minimunCountColumns: 2,
        columns: [
            {
                field: 'state',
                checkbox: true
            },
            {
                field: 'id',
                title: 'Item ID',
                align: 'right',
                valign: 'bottom',
                sortable: true
            },
            {
                field: 'name',
                title: 'Item Name',
                align: 'center',
                valign: 'middle',
                sortable: true,
                formatter: nameFormatter
            },
            {
                field: 'price',
                title: 'Item Price',
                align: 'left',
                valign: 'top',
                sortable: true,
                formatter: priceFormatter,
                sorter: priceSorter
            },
            {
                field: 'operate',
                title: 'Item Operate',
                align: 'center',
                valign: 'middle',
                formatter: operateFormatter,
                events: operateEvents
            }
        ]
    });
});
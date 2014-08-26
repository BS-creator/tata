'user strict'

$(function() {
    $('#mainTable').bootstrapTable({
        method: 'get',
        url: 'http://localhost:8018/file/yinnye55e2iqbf55iah3th45/',
        height: 400,
        striped: true,
        pagination: true,
        pageSize: 50,
        pageList: [10, 25, 50, 100, 200],
        search: true,
        showColumns: true,
        showRefresh: true,
        minimunCountColumns: 2,
        columns: [{
            field: 'state',
            checkbox: true
        }, {
            field: 'notDownloaded',
            title: 'DL',
            align: 'right',
            valign: 'bottom',
            sortable: true
        }, {
            field: 'isNew',
            title: 'New',
            align: 'right',
            valign: 'bottom',
            sortable: true
        }, {
            field: 'idFile',
            title: 'File ID',
            align: 'right',
            valign: 'bottom',
            sortable: true
        }, {
            field: 'filename',
            title: 'Name',
            align: 'center',
            valign: 'middle',
            sortable: true
        }, {
            field: 'path',
            title: 'Path',
            align: 'center',
            valign: 'middle',
            sortable: true
        }, {
            field: 'size',
            title: 'Size',
            align: 'center',
            valign: 'middle',
            sortable: true
        }, {
            field: 'libelle',
            title: 'Libelle',
            align: 'center',
            valign: 'middle',
            sortable: true
        }, {
            field: 'typeDoc',
            title: 'Document',
            align: 'center',
            valign: 'middle',
            sortable: true
        }, {
            field: 'noEmployeur',
            title: 'Employeur',
            align: 'center',
            valign: 'middle',
            sortable: true
        }, {
            field: 'refClientCompl',
            title: 'Ref Client',
            align: 'center',
            valign: 'middle',
            sortable: true
        }, {
            field: 'counter',
            title: '#',
            align: 'center',
            valign: 'middle',
            sortable: true
        }, {
            field: 'date',
            title: 'Date',
            align: 'center',
            valign: 'middle',
            sortable: true
        }, {
            field: 'refGroups',
            title: 'Ref Group S',
            align: 'center',
            valign: 'middle',
            sortable: true
        }, {
            field: 'extension',
            title: 'ext',
            align: 'center',
            valign: 'middle',
            sortable: true
        }]
    });

});
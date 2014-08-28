'user strict'

$(function () {
    // MENU

    $('#sidenav')
        .on('select_node.jstree', function (e, data) {
            data.instance.open_node(data.node);
        })
        .jstree({
            'core': {
                'data': {
                    "text": "Tous les documents",
                    "state": {
                        "opened": true,
                        "disabled": false,
                        "selected": true
                    },
                    "children": [
                        {
                            "text": "0 - Documents Divers",
                            "state": {
                                "opened": false,
                                "disabled": false
                            },
                            "children": [
                                {

                                }
                            ],
                            "li_attr": {"class": "sidenav-head"},
                            "a_attr": {}
                        },
                        {
                            "text": "1 - Documents de paie",
                            "state": {
                                "opened": false,
                                "disabled": false
                            },
                            "children": [
                                {

                                }
                            ],
                            "li_attr": {"class": "sidenav-head"},
                            "a_attr": {}
                        },
                        {
                            "text": "2 - Décomptes",
                            "state": {
                                "opened": false,
                                "disabled": false
                            },
                            "children": [
                                {

                                }
                            ],
                            "li_attr": {"class": "sidenav-head"},
                            "a_attr": {}
                        },
                        {
                            "text": "3 - Attestations",
                            "state": {
                                "opened": false,
                                "disabled": false
                            },
                            "children": [
                                {

                                }
                            ],
                            "li_attr": {"class": "sidenav-head"},
                            "a_attr": {}
                        },
                        {
                            "text": "4 - Fichiers de données",
                            "state": {
                                "opened": false,
                                "disabled": false
                            },
                            "children": [
                                {

                                }
                            ],
                            "li_attr": {"class": "sidenav-head"},
                            "a_attr": {}
                        },
                        {
                            "text": "5 - Paiements",
                            "state": {
                                "opened": false,
                                "disabled": false
                            },
                            "children": [
                                {

                                }
                            ],
                            "li_attr": {"class": "sidenav-head"},
                            "a_attr": {}
                        },
                        {
                            "text": "6 - Rappels",
                            "state": {
                                "opened": false,
                                "disabled": false
                            },
                            "children": [
                                {

                                }
                            ],
                            "li_attr": {"class": "sidenav-head"},
                            "a_attr": {}
                        },
                        {
                            "text": "7 - Titres repas",
                            "state": {
                                "opened": false,
                                "disabled": false
                            },
                            "children": [
                                {

                                }
                            ],
                            "li_attr": {"class": "sidenav-head"},
                            "a_attr": {}
                        },
                        {
                            "text": "8 - Documents annuels",
                            "state": {
                                "opened": false,
                                "disabled": false
                            },
                            "children": [
                                {

                                }
                            ],
                            "li_attr": {"class": "sidenav-head"},
                            "a_attr": {}
                        },
                        {
                            "text": "9 - Statistiques",
                            "state": {
                                "opened": false,
                                "disabled": false
                            },
                            "children": [
                                {

                                }
                            ],
                            "li_attr": {"class": "sidenav-head"},
                            "a_attr": {}
                        },
                        {
                            "text": "10 - Comptabilisation",
                            "state": {
                                "opened": false,
                                "disabled": false
                            },
                            "children": [
                                {

                                }
                            ],
                            "li_attr": {"class": "sidenav-head"},
                            "a_attr": {}
                        },
                        {
                            "text": "11 - Documents de chômage",
                            "state": {
                                "opened": false,
                                "disabled": false
                            },
                            "children": [
                                {

                                }
                            ],
                            "li_attr": {"class": "sidenav-head"},
                            "a_attr": {}
                        },
                        {
                            "text": "12 - Documents DMFA",
                            "state": {
                                "opened": false,
                                "disabled": false
                            },
                            "children": [
                                {

                                }
                            ],
                            "li_attr": {"class": "sidenav-head"},
                            "a_attr": {}
                        },
                        {
                            "text": "13 - Fichiers interfaces AFAS",
                            "state": {
                                "opened": false,
                                "disabled": false
                            },
                            "children": [
                                {

                                }
                            ],
                            "li_attr": {"class": "sidenav-head"},
                            "a_attr": {}
                        },
                        {
                            "text": "14 - Documents externes (scan)",
                            "state": {
                                "opened": false,
                                "disabled": false
                            },
                            "children": [
                                {

                                }
                            ],
                            "li_attr": {"class": "sidenav-head"},
                            "a_attr": {}
                        },
                        {
                            "text": "15 - Documents électroniques",
                            "state": {
                                "opened": false,
                                "disabled": false
                            },
                            "children": [
                                {

                                }
                            ],
                            "li_attr": {"class": "sidenav-head"},
                            "a_attr": {}
                        }
                    ],
                    "li_attr": {"class": "sidenav-head"},
                    "a_attr": {}

                }
            }
        });


    function rowStylef(row, index) {
        if (row.isNew) return {"classes": "isNew" };
        else return {};
    }

    // TABLE
    $('#mainTable').bootstrapTable({
        method: 'get',
        url: 'http://172.20.20.64:8018/file/yinnye55e2iqbf55iah3th45/',
        //height: 400,
        striped: true,
        pagination: true,
        pageSize: 20,
        pageList: [10, 20, 50, 100],
        search: true,
        showColumns: true,
        showRefresh: true,
        minimunCountColumns: 5,
        rowStyle: rowStylef,
        columns: [
            {
                field: 'state',
                checkbox: false,
                visible: false
            },
            {
                field: 'notDownloaded',
                title: 'DL',
                sortable: true,
                formatter: function (value, row) {
                    if (value) {
                        var dlCount = row.downloadCount ? row.downloadCount : '';
                        return "<a class='dl' data-id='" + row.idFile + "' " +
                            "data-file='" + row.fileName + "' href='#'><i class='fa fa-download text-primary'></i><small class='text-muted'>&nbsp;" + dlCount + "</small></a>";
                    } else {
                        var dlCount = row.downloadCount ? row.downloadCount : '';
                        return "<a class='dl' data-id='" + row.idFile + "' " +
                            "data-file='" + row.fileName + "' href='#'><i class='fa fa-download text-muted'></i><small class='text-muted'>&nbsp;" + dlCount + "</small></a>";
                    }
                }
            },
            {
                field: 'isNew',
                title: 'New',
                sortable: true,
                visible: false,
                formatter: function (value) {
                    if (value) return "<i class='fa fa-smile-o'></i>"
                    else return "<i class='fa fa-times'></i>";
                }
            },
            {
                field: 'idFile',
                title: 'File ID',
                align: 'right',
                valign: 'bottom',
                visible: false,
                sortable: true
            },
            {
                field: 'filename',
                title: 'Name',
                align: 'center',
                valign: 'middle',
                visible: false,
                sortable: true
            },
            {
                field: 'path',
                title: 'Path',
                align: 'center',
                valign: 'middle',
                visible: false,
                sortable: true
            },
            {
                field: 'size',
                title: 'Size',
                align: 'center',
                valign: 'middle',
                visible: false,
                sortable: true
            },
            {
                field: 'libelle',
                title: 'Libell&eacute;',
                align: 'left',
                valign: 'middle',
                sortable: true,
                formatter: function (value) {
                    if (!value || value == '') return 'x';
                    else return value;
                }
            },
            {
                field: 'refDoc',
                title: 'Ref Doument',
                align: 'center',
                valign: 'middle',
                sortable: true,
                formatter: function (value) {
                    if (!value || value == '') return 'x';
                    else return value;
                }
            },
            {
                field: 'noEmployeur',
                title: 'Employeur',
                align: 'center',
                valign: 'middle',
                sortable: true,
                formatter: function (value) {
                    if (!value || value == '') return 'x';
                    else return value;
                }
            },
            {
                field: 'refClientCompl',
                title: 'Ref Client',
                align: 'center',
                valign: 'middle',
                sortable: true,
                formatter: function (value) {
                    if (!value || value == '') return 'x';
                    else return value;
                }
            },
            {
                field: 'counter',
                title: '#',
                align: 'center',
                valign: 'middle',
                visible: false,
                sortable: true,
                formatter: function (value) {
                    if (!value || value == '') return 'x';
                    else return value;
                }
            },
            {
                field: 'date',
                title: 'Date',
                align: 'center',
                valign: 'middle',
                sortable: true,
                formatter: function (value) {
                    if (!value || value == '') return 'x';
                    else return value;
                }
            },
            {
                field: 'refGroups',
                title: 'Ref Group S',
                align: 'center',
                valign: 'middle',
                sortable: true,
                formatter: function (value) {
                    if (!value || value == '') return 'x';
                    else return value;
                }
            },
            {
                field: 'extension',
                title: 'ext',
                align: 'center',
                valign: 'middle',
                sortable: true,
                formatter: function (value) {
                    if (!value || value == '') return 'x';
                    else return value;
                }
            }
        ]
    });
});

// add icons UNSORTED to thead tr th div span
$(function (){
    var th = $('table#mainTable thead tr th');
    var span = '<span class="unsorted"></span>';

/*       if($('table#mainTable thead tr th div.th-inner').find('span.order').length == 0){
            $('table#mainTable thead tr th div.th-inner').append(span);
       }*/
        /*
        $(this).on('click', function(e){
            if($(this).find('span.order').length != 0){
                $(this).find('span.unsorted').remove();
                e.preventDefault;
            }else{
                $(this).append(span);
            }
        });*/

/*    $(this).onClick(function(){
        $(this:first-child).remove();
    })*/

});


// add btn-group TRIER PAR
$(function (){
    $('.fixed-table-toolbar').prepend(
        '<div id="filter" class="pull-left">'+
        '<div class="btn-group">'+
        '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">'+
        'Trier par&nbsp;&nbsp;<span class="caret"></span>'+
        '</button>'+
        '<ul class="dropdown-menu" role="menu">'+
        '<li class=""><a href="#"><i class="fa fa-file-text-o"></i>&nbsp;&nbsp;&nbsp;nouveaux fichiers </a></li>'+
        '<li class="divider"></li>'+
        '<li class=""><a href="#"><i class="fa fa-download text-primary"></i>&nbsp;&nbsp;&nbsp;fichiers non-téléchargés</a></li>'+
        '<li class=""><a href="#"><i class="fa fa-download text-muted"></i>&nbsp;&nbsp;&nbsp;fichiers téléchargés</a></li>'+
        '</ul>'+
        '</div>'+
        '</div>'
    );
});

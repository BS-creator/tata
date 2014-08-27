'user strict'

$(function () {
    // MENU

    $('#sidenav').jstree({
        'core': {
            'data': {
                "text"  : "Tous les documents",
                "state" : {
                    "opened"    : true,
                    "disabled"  : false,
                    "selected"   : true
                },
                "children"    : [
                    {
                        "text"  : "0 - Documents Divers",
                        "state" : {
                            "opened"    : false,
                            "disabled"  : false
                        },
                        "children"    : [
                            {

                            }
                        ],
                        "li_attr"     : {"class" : "sidenav-head"},
                        "a_attr"      : {}
                    },{
                        "text"  : "1 - Documents de paie",
                        "state" : {
                            "opened"    : false,
                            "disabled"  : false
                        },
                        "children"    : [
                            {

                            }
                        ],
                        "li_attr"     : {"class" : "sidenav-head"},
                        "a_attr"      : {}
                    },{
                        "text"  : "2 - Décomptes",
                        "state" : {
                            "opened"    : false,
                            "disabled"  : false
                        },
                        "children"    : [
                            {

                            }
                        ],
                        "li_attr"     : {"class" : "sidenav-head"},
                        "a_attr"      : {}
                    },{
                        "text"  : "3 - Attestations",
                        "state" : {
                            "opened"    : false,
                            "disabled"  : false
                        },
                        "children"    : [
                            {

                            }
                        ],
                        "li_attr"     : {"class" : "sidenav-head"},
                        "a_attr"      : {}
                    },{
                        "text"  : "4 - Fichiers de données",
                        "state" : {
                            "opened"    : false,
                            "disabled"  : false
                        },
                        "children"    : [
                            {

                            }
                        ],
                        "li_attr"     : {"class" : "sidenav-head"},
                        "a_attr"      : {}
                    },{
                        "text"  : "5 - Paiements",
                        "state" : {
                            "opened"    : false,
                            "disabled"  : false
                        },
                        "children"    : [
                            {

                            }
                        ],
                        "li_attr"     : {"class" : "sidenav-head"},
                        "a_attr"      : {}
                    },{
                        "text"  : "6 - Rappels",
                        "state" : {
                            "opened"    : false,
                            "disabled"  : false
                        },
                        "children"    : [
                            {

                            }
                        ],
                        "li_attr"     : {"class" : "sidenav-head"},
                        "a_attr"      : {}
                    },{
                        "text"  : "7 - Titres repas",
                        "state" : {
                            "opened"    : false,
                            "disabled"  : false
                        },
                        "children"    : [
                            {

                            }
                        ],
                        "li_attr"     : {"class" : "sidenav-head"},
                        "a_attr"      : {}
                    },{
                        "text"  : "8 - Documents annuels",
                        "state" : {
                            "opened"    : false,
                            "disabled"  : false
                        },
                        "children"    : [
                            {

                            }
                        ],
                        "li_attr"     : {"class" : "sidenav-head"},
                        "a_attr"      : {}
                    },{
                        "text"  : "9 - Statistiques",
                        "state" : {
                            "opened"    : false,
                            "disabled"  : false
                        },
                        "children"    : [
                            {

                            }
                        ],
                        "li_attr"     : {"class" : "sidenav-head"},
                        "a_attr"      : {}
                    },{
                        "text"  : "10 - Comptabilisation",
                        "state" : {
                            "opened"    : false,
                            "disabled"  : false
                        },
                        "children"    : [
                            {

                            }
                        ],
                        "li_attr"     : {"class" : "sidenav-head"},
                        "a_attr"      : {}
                    },{
                        "text"  : "11 - Documents de chômage",
                        "state" : {
                            "opened"    : false,
                            "disabled"  : false
                        },
                        "children"    : [
                            {

                            }
                        ],
                        "li_attr"     : {"class" : "sidenav-head"},
                        "a_attr"      : {}
                    },{
                        "text"  : "12 - Documents DMFA",
                        "state" : {
                            "opened"    : false,
                            "disabled"  : false
                        },
                        "children"    : [
                            {

                            }
                        ],
                        "li_attr"     : {"class" : "sidenav-head"},
                        "a_attr"      : {}
                    },{
                        "text"  : "13 - Fichiers interfaces AFAS",
                        "state" : {
                            "opened"    : false,
                            "disabled"  : false
                        },
                        "children"    : [
                            {

                            }
                        ],
                        "li_attr"     : {"class" : "sidenav-head"},
                        "a_attr"      : {}
                    },{
                        "text"  : "14 - Documents externes (scan)",
                        "state" : {
                            "opened"    : false,
                            "disabled"  : false
                        },
                        "children"    : [
                            {

                            }
                        ],
                        "li_attr"     : {"class" : "sidenav-head"},
                        "a_attr"      : {}
                    },{
                        "text"  : "15 - Documents électroniques",
                        "state" : {
                            "opened"    : false,
                            "disabled"  : false
                        },
                        "children"    : [
                            {

                            }
                        ],
                        "li_attr"     : {"class" : "sidenav-head"},
                        "a_attr"      : {}
                    }
                ],
                "li_attr"     : {"class" : "sidenav-head"},
                "a_attr"      : {}

            }
        }
    });


    function rowStyle(row, index){
        if(row.isNew) return {"classes" : "isNew" };
    }

    // TABLE
    $('#mainTable').bootstrapTable({
        method: 'get',
        url: 'http://172.20.20.64:8018/file/yinnye55e2iqbf55iah3th45/',
        //height: 400,
        striped: true,
        pagination: true,
        pageSize: 50,
        pageList: [10, 25, 50, 100, 200],
        search: true,
        showColumns: true,
        showRefresh: true,
        minimunCountColumns: 5,
        rowStyle: rowStyle,
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
                   if(value) {
                       return "<a class='btn dl' data-id='"+ row.idFile +"' " +
                           "data-file='"+ row.fileName +"' href='#'><i class='fa fa-download text-primary'></i> </a>";
                   }else {
                       return "<a class='btn dl' data-id='"+ row.idFile +"' " +
                           "data-file='"+ row.fileName +"' href='#'><i class='fa fa-download text-muted'></i> </a>";
                   }
                }
            },
            {
                field: 'isNew',
                title: 'New',
                sortable: true,
                formatter: function (value){
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
                title: 'Libelle',
                align: 'center',
                valign: 'middle',
                sortable: true,
                formatter: function (value){
                    if (!value || value == '') return 'x';
                    else return value;
                }
            },
            {
                field: 'typeDoc',
                title: 'Document',
                align: 'center',
                valign: 'middle',
                sortable: true,
                formatter: function (value){
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
                formatter: function (value){
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
                formatter: function (value){
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
                formatter: function (value){
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
                formatter: function (value){
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
                formatter: function (value){
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
                formatter: function (value){
                    if (!value || value == '') return 'x';
                    else return value;
                }
            }
        ]
    });

});
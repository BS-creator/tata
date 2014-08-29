

$(function () {
    'user strict'

    /**  GLOBAL VARIABLE **/
    // array used to store all the existing document reference on the FTP server.
    $.refDocUsed = [];

    /****************************************************
     *
     * MENU
     * */

    function menu(data) {
        var tree = [] ;
        var cat = [];
        // BUILD TREE
        $.each(data, function (i, item) {

            if ( $.inArray( item.noCategory, cat ) > -1 ) {
                //category already exists
                //add document
                if( $.inArray( item.refDoc, $.refDocUsed ) > -1 ) {
                    tree[(tree.length - 1)]
                        .children[(tree[(tree.length - 1)].children.length)] = {
                        "text" :  item.refDoc + " - " +item.labelDoc_f,
                        "li_attr": {"class": "leaf"}
                    }
                }

            }else{
                //create category
                cat[cat.length] = item.noCategory;
                if( $.inArray( item.refDoc, $.refDocUsed ) > -1 ) {
                    tree[tree.length] =
                    {
                        "id"    : item.noCategory,
                        "text"  : item.noCategory + " - " + item.labelCategory_f,
                        "children": [{ //add document
                            "text" : item.refDoc + " - " + item.labelDoc_f,
                            "li_attr": {"class": "leaf"}
                        }]
                    };
                }/*else{
                 tree[tree.length] =
                 {
                 "id"    : item.noCategory,
                 "text"  : item.noCategory + " - " + item.labelCategory_f,
                 "children": []
                 };
                 }*/
            }

        });

        // JSTREE
        $('#sidenav')
            .on('select_node.jstree', function (e, data) {
                data.instance.toggle_node(data.node);
                //apply filter
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
                        "children": tree
                    }
                }
            }
        );
    }

    function loadMenu (){
        //Sort used reference document
        $.refDocUsed.sort(function(a, b){return a-b});
        $.ajax({
            type: 'GET',
            url: 'http://172.20.20.64:8018/category/',
            success: menu
        });
        //override();
    }

    /****************************************************
     *
     * TABLE
     * */

    // Styling the row if the file is new
    function rowStylef(row) {
        if (row.isNew) return {"classes": "isNew" };
        else return {};
    }

    //TODO replace url with dynamic!!!!
    $('#mainTable').bootstrapTable({
        method: 'get',
        url: 'http://172.20.20.64:8018/file/yinnye55e2iqbf55iah3th45/',
        striped: true,
        pagination: true,
        pageSize: 20,
        pageList: [10, 20, 50, 100],
        search: true,
        showColumns: true,
        showRefresh: true,
        minimumCountColumns: 5,
        rowStyle: rowStylef,
        onLoadSuccess: loadMenu,
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
                title: 'Ref Document',
                align: 'center',
                valign: 'middle',
                sortable: true,
                formatter: function (value) {
                    if (!value || value == '') return 'x';
                    else {
                        var val = parseInt(value);
                        if ($.inArray( val, $.refDocUsed ) < 0){
                            $.refDocUsed[$.refDocUsed.length] = val;
                        }
                        return val;
                    }
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
    })

});

// add icons UNSORTED to thead tr th div span
$(function (){
/*    var th = $('table#mainTable thead tr th');
    var span = '<span class="unsorted"></span>';

   if($('table#mainTable thead tr th div.th-inner').find('span.order').length == 0){
        $('table#mainTable thead tr th div.th-inner').append(span);
   }*/
});


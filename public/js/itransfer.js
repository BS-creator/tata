

$(function () {
    'user strict'

    /**  GLOBAL VARIABLE **/
    // array used to store all the existing document reference on the FTP server.
    var refDocUsed = [];
    var BaseURL = 'http://172.20.20.64:8018/';
    var AjaxData = [];


    /****************************************************
     *
     * MENU
     * */

    // $('.leaf') to access leafs...!!!!

    function menu(data) {
        var tree = [] ;
        var cat = [];

        // BUILD TREE
        $.each(data, function (i, item) {

            var refdoc = parseInt(item.refDoc),
                numcat = parseInt(item.noCategory);
            if (numcat == 0) numcat = 988;

            if ($.inArray(refdoc, refDocUsed) > -1) { // doc is used
                if ($.inArray(numcat, cat) > -1) { // category exists --> add children
                    //add child node
                    tree[(tree.length - 1)]
                        .children[(tree[(tree.length - 1)].children.length)] = {
                        "text": refdoc + " - " + item.labelDoc_f,
                        "li_attr": {"class": "leaf"}
                    }
                } else { // create category
                    cat[cat.length] = numcat;
                    tree[tree.length] =
                    {
                        "id": numcat,
                        "text": numcat + " - " + item.labelCategory_f,
                        "state": {
                            "opened": true,
                            "disabled": false,
                            "selected": false
                        },
                        "children": [
                            { //add document
                                "text": refdoc + " - " + item.labelDoc_f,
                                "li_attr": {"class": "leaf"}
                            }
                        ]
                    };
                }
            }
        });

        // ---> ADDING OTHER CATEGORY
        if($.inArray(-1, refDocUsed) > -1){
            tree[tree.length] =
            {
                "id": 98,
                "text": '98 - Documents Divers',
                "state": {
                    "opened": true,
                    "disabled": false,
                    "selected": false
                },
                "li_attr": {"class": "leaf"}
            };
        }

        tree[tree.length] =
        {
            "id": 99,
            "text": '99 - Transferts internes',
            "state": {
                "opened": true,
                "disabled": false,
                "selected": false
            },
            "li_attr": {"class": "leaf"}
        };

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
    };

    function sort_unique(array) {
        array = array.sort(function (a, b) { return a*1 - b*1; });
        if (array.length > 1) {
            var ret = [array[0]];
            for (var i = 1; i < array.length; i++) { // start loop at 1 as element 0 can never be a duplicate
                if (array[i-1] !== array[i]) {
                    ret.push(array[i]);
                }
            }
            return ret;
        }
        return array; // only 1 or no element in the array.
    };


    function getUsedDocRef(data){
        var a = [];
        $.each(data, function (i, item){
            var ref = parseInt(item.refDoc);
            if (!isNaN(ref)) {
                a[a.length] = ref;
            }else{
                a[a.length] = -1;
            }
        });
        return sort_unique(a);

    }
    function loadMenu (data){

        //AjaxData = data;

        refDocUsed = getUsedDocRef(data);

        $.ajax({
            type: 'GET',
            url: BaseURL + 'category/',
            success: menu
        });

    }

    /****************************************************
     *
     * TABLE
     * */


    $.fn.bootstrapTable.Constructor.prototype.onSearch2 = function (event, field, value) {

        this.options.pageNumber = 1;
        this.initFilter(field, value);
        this.updatePagination(true);
        this.initBody();

    };

    $.fn.bootstrapTable.Constructor.prototype.initFilter = function (field, value) {
        if (this.options.sidePagination !== 'server') {
            //console.log((this.data.length !== this.options.data.length));
            this.data = value ? $.grep(this.options.data, function (item) {
                //console.log( value + " == " + parseInt(item[field]) +
                //         '\t test == '+ (value == parseInt(item[field])));

                //filter on condition about the field
                if(field && typeof value === 'number'){
                    if(value == parseInt(item[field])) {
                        return true;
                    }else{
                        return false;
                    }
                }
                if(field && typeof value === 'string'){
                    if (item[field].toLowerCase().indexOf(value) !== -1) {
                        return true;
                    }else{
                        return false;
                    }
                }
                return false;
            }) : this.options.data;
        }
    };

    // Styling the row if the file is new
    function rowStylef(row, i, filter) {
        if (row.isNew) return {"classes": "isNew" };
        else return {};
    }



    function formatDownload(value, row) {
        var dlCount = row.downloadCount ? row.downloadCount : '';
        if (value) {
            return "<a class='dl' data-id='" + row.idFile + "' " +
                "data-file='" + row.fileName + "' ><i class='fa fa-download text-primary'></i>" +
                "<small data-dl='"+ row.downloadCount +"' class='text-muted'>&nbsp;" + dlCount + "</small></a>";
        } else {
            return "<a class='dl' data-id='" + row.idFile + "' " +
                "data-file='" + row.fileName + "' ><i class='fa fa-download text-muted'></i>" +
                "<small data-dl='"+ row.downloadCount +"' class='text-muted'>&nbsp;" + dlCount + "</small></a>";
        }
    }

    var $table = $('#mainTable').bootstrapTable({
        method: 'get',
        url: BaseURL + 'file/'+ sessionStorage.getItem('token') +'/',
        striped: true,
        pagination: true,
        pageSize: 20,
        pageList: [10, 20, 50, 100, 200],
        search: true,
        showColumns: true,
        showRefresh: true,
        minimumCountColumns: 5,
        rowStyle: rowStylef,
        onLoadSuccess: loadMenu,
        columns: [
            {
                field: 'stateField',
                checkbox: true,
                visible: true
            },
            {
                field: 'notDownloaded',
                title: 'DL',
                sortable: true,
                formatter: formatDownload
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
                field: 'date',
                title: 'Date',
                align: 'center',
                valign: 'middle',
                sortable: true,
                formatter: function (value) {
                    if (!value || value == '') return '';
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
                    if (!value || value == '') return '';
                    else return value;
                }
            },
            {
                field: 'libelle',
                title: 'Libell&eacute;', //TODO: multi-language
                align: 'center',
                valign: 'middle',
                sortable: true,
                formatter: function (value) {
                    if (!value || value == '') return '';
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
                    //console.log(index +' >> value = ' + value );
                    if (value) {
                        var v = parseInt(value);
                        if (value > 0 ){
                            refDocUsed[refDocUsed.length] = v;
                            return v ;
                        }
                    }
                    return '';
                }
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
                field: 'extension',
                title: 'ext',
                align: 'center',
                valign: 'middle',
                sortable: true,
                formatter: function (value) {
                    if (!value || value == '') return '';
                    else return value;
                }
            },
            {
                field:'index',
                title:'#',
                sortable: true,
                visible: false,
                sort: function(a, b){return a-b}
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
                field: 'fileName',
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
                field: 'refClientCompl',
                title: 'Ref Client',
                align: 'center',
                valign: 'middle',
                visible: false,
                sortable: true,
                formatter: function (value) {
                    if (!value || value == '') return '';
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
                    if (!value || value == '') return '';
                    else return value;
                }
            },
            {
                field: 'refGroups',
                title: 'Ref Group S',
                align: 'center',
                valign: 'middle',
                visible: false,
                sortable: true,
                formatter: function (value) {
                    if (!value || value == '') return '';
                    else return value;
                }
            },
            {
                field: 'dummy',
                visible: false
            }

        ]
    });


    //DOWNLOAD files
    $('#mainTable').delegate('.dl', 'click', function(){
        $(this).attr('href', BaseURL + 'file/'+ sessionStorage.getItem('token')+ '/' + $(this).attr('data-id') + '/' + $(this).attr('data-file'));
        $(this).find('i').remove();
        var small = $(this).find('small');     // cache object
        $(this).prepend("<i class='fa fa-download text-muted'></i>"); //mark as already downloaded
        var dl = parseInt( small.data('dl') ) +1;
        small.data('dl', dl ); // increment by one the download count
        small.html('&nbsp;' + dl );

    });





    //Add download all button
    $('#get-selections').click(function() {
        alert('Selected values: ' + JSON.stringify($table.bootstrapTable('getSelections')));

        //download();
    });

    /*$('#download').click(function() {
        download('http://nogin.info/cv.doc','http://nogin.info/cv.doc');
    });

    var download = function() {
        for(var i=0; i<arguments.length; i++) {
            var iframe = $('<iframe style="visibility: collapse;"></iframe>');
            $('body').append(iframe);
            var content = iframe[0].contentDocument;
            var form = '<form action="' + arguments[i] + '" method="GET"></form>';
            content.write(form);
            $('form', content).submit();
            setTimeout((function(iframe) {
                return function() {
                    iframe.remove();
                }
            })(iframe), 2000);
        }
    }*/

    $.('.user-name').html('USERNAME');

});



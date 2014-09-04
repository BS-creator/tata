$(function () {
    'user strict'

    /***  GLOBAL VARIABLE ***/
    // array used to store all the existing document reference on the FTP server.
    var serverURL   = 'http://172.20.20.64:8018/',
        baseURL     = 'http://localhost:4000/itransfer/',
        AjaxData    = [],
        label       = [],
        category    = [],
        refDocUsed  = [];

    /****************************************************
     *
     * HELPER
     * */

    function bytesToSize(bytes) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    };

    function sort_unique(array) {
        array = array.sort(function (a, b) {
            return a * 1 - b * 1;
        });
        if (array.length > 1) {
            var ret = [array[0]];
            for (var i = 1; i < array.length; i++) { // start loop at 1 as element 0 can never be a duplicate
                if (array[i - 1] !== array[i]) {
                    ret.push(array[i]);
                }
            }
            return ret;
        }
        return array; // only 1 or no element in the array.
    };

    function getUsedDocRef(data) {
        var a = [];
        $.each(data, function (i, item) {
            var ref = parseInt(item.refDoc);
            if (!isNaN(ref)) {
                a[a.length] = ref;
            } else {
                a[a.length] = -1;
            }
        });
        return sort_unique(a);
    };

    function mergeLabelDoc() {

        $.each(category, function (i, cat){
            $.each(AjaxData, function (j, row){
                if(cat.refDoc == parseInt(row.refDoc)){
                    //TODO: multilanguage
                    row.libelle = cat.labelDoc_f;
                }
            });
        });
    };

    function download(array) {
        for (var i = 0; i < array.length; i++) {
            var iframe = $('<iframe style="visibility: collapse;"></iframe>');
            $('body').append(iframe);
            var content = iframe[0].contentDocument;
            /*var form = '<form action="' + array[i] + '" method="GET"></form>';
            content.write(form);
            $('form', content).submit();*/
            content.write('<a href="' + array[i] + '"></a>');
            console.log($('a', content));
            $('a', content).click(function(){ window.location = array[i];});
            setTimeout((function (iframe) {
                return function () {
                    iframe.remove();
                }
            })(iframe), 1000);
        }
    };

    /****************************************************
     *
     * MENU
     * */

     // $('.leaf') to access leafs...!!!!
    function createMenu() {
        var tree = [];
        var cat = [];

        refDocUsed = getUsedDocRef(AjaxData);

        // BUILD TREE
        //TODO: multi language
        $.each(category, function (i, item) {

            var refdoc = parseInt(item.refDoc),
                numcat = parseInt(item.noCategory);
            if (numcat == 0) numcat = 98;

            if ($.inArray(refdoc, refDocUsed) > -1) { // doc is used
                //adding label
                label[label.length] = {
                    'refDoc'    : refdoc,
                    'labelDoc_f': item.labelDoc_f,
                    'labelDoc_n': item.labelDoc_n,
                    'labelDoc_d': item.labelDoc_d,
                    'labelDoc_x': item.labelDoc_x
                };
                if ($.inArray(numcat, cat) > -1) { // category exists --> add children
                    //add child node
                    tree[(tree.length - 1)]
                        .children[(tree[(tree.length - 1)].children.length)] = {
                        "text": refdoc + " - " + item.labelDoc_f,
                        "li_attr": {"class": "leaf"}
                    }
                } else {
                    // create category
                    cat[cat.length] = numcat;
                    //adding label
                    label[label.length] = {
                        'refDoc'    : refdoc,
                        'labelDoc_f': item.labelDoc_f,
                        'labelDoc_n': item.labelDoc_n,
                        'labelDoc_d': item.labelDoc_d,
                        'labelDoc_x': item.labelDoc_x
                    };
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

        // ---> ADDING the "OTHER CATEGORY"
        if ($.inArray(-1, refDocUsed) > -1) {
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

        // ---> ADDING the "UPLOAD CATEGORY"
        tree[tree.length] =
        {
            "id": 99,
            "text": '99 - Documents transmis à Group S', //Overgebrachte documenten naar Group S
            "state": {
                "opened": true,
                "disabled": false,
                "selected": false
            },
            "li_attr": {"class": "leaf"}
        };

        //destroy before reload
        $('#sidenav').html('');

        // JSTREE
        $('#sidenav')
            .on('select_node.jstree', function (e, data) {
                data.instance.toggle_node(data.node);
                //TODO: apply filter on table when click
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
            });
    };

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
                if (field && typeof value === 'number') {
                    if (value == parseInt(item[field])) {
                        return true;
                    } else {
                        return false;
                    }
                }
                if (field && typeof value === 'string') {
                    if (item[field].toLowerCase().indexOf(value) !== -1) {
                        return true;
                    } else {
                        return false;
                    }
                }
                return false;
            }) : this.options.data;
        }
    };

    $.fn.bootstrapTable.Constructor.prototype.onSortDownload = function (event) {
        var $this = $(event.currentTarget),
            $this_ = this.$header.find('th').eq(1);

        this.$header.add(this.$header_).find('span.order').remove();
        this.options.sortName = "notDownloaded";
        this.options.sortOrder = $this.data('order') === 'asc' ? 'desc' : 'asc';

        this.trigger('sort', this.options.sortName, this.options.sortOrder);

        $this.add($this_).data('order', this.options.sortOrder)
            .find('.th-inner').append(this.getCaretHtml());

        if (this.options.sidePagination === 'server') {
            this.initServer();
            return;
        }
        this.initSort();
        this.initBody();
    };

    function refresh(){
        this.bootstrapTable('destroy');
        createTable();
        createMenu();
    };
    // Styling the row if the file is new
    function rowStylef(row, i, filter) {
        if (row.isNew) return {"classes": "isNew" };
        else return {};
    };

    function formatDownload(value, row) {
        var dlCount = row.downloadCount ? row.downloadCount : '';
        if (value) {
            return "<a class='dl' data-id='" + row.idFile + "' " +
                "data-file='" + row.fileName + "' ><i class='fa fa-download fa-lg text-primary'></i>" +
                "<small data-dl='" + row.downloadCount + "' class='text-muted'>&nbsp;" + dlCount + "</small></a>";
        } else {
            return "<a class='dl' data-id='" + row.idFile + "' " +
                "data-file='" + row.fileName + "' ><i class='fa fa-download fa-lg text-muted'></i>" +
                "<small data-dl='" + row.downloadCount + "' class='text-muted'>&nbsp;" + dlCount + "</small></a>";
        }
    };

    function createTable() {
        //destroy before reload
        var $table = $('#mainTable');
        $table.html('');

        $table.bootstrapTable({
            data: AjaxData,
            striped: true,
            pagination: true,
            pageSize: 20,
            pageList: [10, 20, 50, 100, 200],
            search: true,
            showColumns: true,
            showRefresh: true,
            minimumCountColumns: 5,
            rowStyle: rowStylef,
            columns: [
                {
                    field: 'stateField',
                    checkbox: true,
                    visible: true
                },
                {
                    field: 'notDownloaded',
                    title: '<i class="fa fa-download fa-lg"></i>',
                    align: 'center',
                    sortable: true,
                    formatter: formatDownload
                },
                {
                    field: 'isNew',
                    title: 'New',
                    align: 'center',
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
                    align: 'left',
                    valign: 'middle',
                    class: 'labelDoc',
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
                    class: 'refDoc',
                    formatter: function (value) {
                        //console.log(index +' >> value = ' + value );
                        if (value) {
                            var v = parseInt(value);
                            if (value > 0) {
                                refDocUsed[refDocUsed.length] = v;
                                return v;
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
                    visible: true,
                    sortable: true,
                    formatter: function (value) {
                        var val = parseInt(value);
                        if (val > 1024) return Math.round(val / 1024, 2) + ' KB';
                        else return val;
                        //return bytesToSize(val);
                    }
                },
                {
                    field: 'extension',
                    title: 'ext',
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                    formatter: function (value) {
                        if (value || value != '') {
                            if (value.toLowerCase().indexOf('pdf')) {
                                return '<i class="fa fa-file-pdf-o fa-lg"></i>';
                            }
                            if (value.toLowerCase().indexOf('zip')) {
                                return '<i class="fa fa-file-archive-o fa-lg"></i>';
                            }
                            return value;
                        } else {
                            return '';
                        }
                    }
                },
                /*{
                 field: 'index',
                 title: '#',
                 sortable: true,
                 visible: false,
                 sort: function (a, b) {
                 return a - b
                 }
                 },
                 {
                 field: 'idFile',
                 title: 'File ID',
                 align: 'right',
                 valign: 'bottom',
                 visible: false,
                 sortable: true
                 },*/
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
                }
            ]
        });

        return $table;
    };

    /****************************************************
     *
     * LOAD DATA (AJAX)
     * */

    function LoadCategory() {

        return  $.ajax({
            type: 'GET',
            url: serverURL + 'category/',
            success: function(data){ category = data;}
        });

    };

    function LoadData() {
       return $.ajax({
            type: "GET",
            url: serverURL + 'file/' + sessionStorage.getItem('token') + '/',
            success: function (data) {AjaxData = data; },
            dataType: 'json',
            statusCode: {
                403: function () {
                    alert("ERROR: Forbidden.");
                },
                401: function () {
                    alert("ERROR: connection problem.");
                }
            }
        });
    };

    /****************************************************
     *
     * MAIN
     * */
    function main() {
        //$('#loader').html('<i class="fa-li fa fa-spinner fa-spin fa-3x"></i>');

        //SYNC & WAIT
        $.when(LoadCategory(), LoadData()).done(function (){

            mergeLabelDoc();
            var $table = createTable();
            createMenu();

            console.log($table);
            //DOWNLOAD files
            $table.delegate('.dl', 'click', function () {
                $(this).attr('href', serverURL + 'file/' + sessionStorage.getItem('token') + '/' + $(this).attr('data-id') + '/' + $(this).attr('data-file'));
                $(this).find('i').remove();
                var small = $(this).find('small');     // cache object
                $(this).prepend("<i class='fa fa-download text-muted'></i>"); //mark as already downloaded
                var dl = parseInt(small.data('dl')) + 1;
                small.data('dl', dl); // increment by one the download count
                small.html('&nbsp;' + dl);
            });

            $table.delegate('button[name="refresh"]', 'click', function(){
                console.log("test");
                $table.bootstrapTable('destroy');
                createTable();
                createMenu();
            });
            //refresh();

            $('.user-name').html(window.login);

            $('#signout').on('click', function () {
                sessionStorage.setItem("token", '');
                window.location = baseURL;
                $('#login').val(window.login);
            });

            //Add download all button
            $('#get-selections').click(function () {
                alert('Selected values: ' + JSON.stringify($('#mainTable').bootstrapTable('getSelections')));
                var array = [];
                $.each($('#mainTable').bootstrapTable('getSelections'), function(i, item){
                    array[array.length] = serverURL + 'file/' + sessionStorage.getItem('token') + '/' + item.idFile + '/' + item.fileName;
                });
                //console.log(array);
                download(array);
            });
        });
    };

    main();

});



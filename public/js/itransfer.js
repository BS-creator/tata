$(function () {
    'user strict'

    /***  GLOBAL VARIABLE ***/
    // array used to store all the existing document reference on the FTP server.
    var serverURL   = 'http://172.20.20.64:8018/',
        baseURL     = 'http://localhost:4000/itransfer/',
        //dc          = {},
        AjaxData    = [],
        category    = [],
        refDocUsed  = [],
        username    = sessionStorage.getItem('username').toLowerCase(),
        token       = sessionStorage.getItem('token'),
        destFolders = [];

    window.dc = [];
    /****************************************************
     * HELPER
     * */

    function bytesToSize(bytes) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }

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
    }

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
    }

    function mergeLabelDoc() {

        $.each(category, function (i, cat){
            $.each(AjaxData, function (j, row){
                if(cat.refDoc == parseInt(row.refDoc)){
                    //TODO: multilanguage
                    row.libelle = cat.labelDoc_f;
                }
                row.noEmployeur = parseInt(row.noEmployeur);
                row.uploadUserName.toUpperCase();
            });
        });
    }

    function download(array) {
        //TODO
        for (var i = 0; i < array.length; i++) {
            var iframe = $('<iframe style="visibility: collapse;"></iframe>');
            $('body').append(iframe);
            var content = iframe[0].contentDocument;
            /*var form = '<form action="' + array[i] + '" method="GET"></form>';
            content.write(form);
            $('form', content).submit();*/
            content.write('<a href="' + array[i] + '"></a>');
            //console.log($('a', content));
            $('a', content).click(function(){ window.location = array[i];});
            setTimeout((function (iframe) {
                return function () {
                    iframe.remove();
                }
            })(iframe), 1000);
        }
    }

    // Styling the row if the file is new
    function rowStylef(row, i, filter) {
        if (row.isNew) return {"classes": "success" };
        else return {};
    }


    //Format for the download column
    function formatDownload(value, row) {
        var dlCount = row.downloadCount ? row.downloadCount : '';
        var icon = "fa-download";
        //console.log(row.uploadUserName + "!==" +username);
        if (row.uploadUserName === username ){
            icon = "fa-upload";
        }
        if (value) {
            return "<a class='dl' data-id='" + row.idFile + "' " +
                "data-file='" + row.fileName + "' ><i class='fa "+ icon +" fa-lg text-primary'></i>" +
                "<small data-dl='" + row.downloadCount + "' class='text-muted'>&nbsp;" + dlCount + "</small></a>";
        } else {
            return "<a class='dl' data-id='" + row.idFile + "' " +
                "data-file='" + row.fileName + "' ><i class='fa "+ icon +" fa-lg text-muted'></i>" +
                "<small data-dl='" + row.downloadCount + "' class='text-muted'>&nbsp;" + dlCount + "</small></a>";
        }
    }

    function formatIsNew(value) {
        if (value) return "<i class='fa fa-smile-o'></i>"
        else return "<i class='fa fa-times'></i>";
    }

    function formatRefDoc(value) {
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

    function FormatExtension(value) {
        if (value || value != '') {
            var v = value.toLowerCase();

            if (v.indexOf('pdf') !== -1 ) {
                return '<i class="fa fa-file-pdf-o fa-lg"></i>';
            }
            if (v.indexOf('zip') !== -1 ) {
                return '<i class="fa fa-file-archive-o fa-lg"></i>';
            }
            if (v.indexOf('dat') !== -1 || v.indexOf('csv') !== -1 ){
                return '<i class="fa fa-bar-chart"></i>';
            }
            return value;
        } else {
            return '';
        }
    }

    function formatSize(value) {
        var val = parseInt(value);
        if (val > 1024) return Math.round(val / 1024, 2) + ' KB';
        else return val;
        //return bytesToSize(val);
    }

    function formatUserName(value){
        return value.toUpperCase();
    }

    function formatDate(value, row){
        //2014-09-09"
        //if (value.length === )
        //console.log(row.date);
        var year    = row.date.slice(0,4),
            month   = row.date.slice(5,7),
            day     = row.date.slice(8,10);
        return day+"-"+month+"-"+year;
    }

    function formatDefault (value) {
        if (!value || value == '') return '';
        else return value;
    }

    function operateFormatter() {
        return [
            '<a class="remove" title="Remove">',
            '<i class="fa fa-times"></i>',
            '</a>'
        ].join('');
    }

    function menuActionClick (e, data) {
        var table = $('#mainTable');
        if ( data.node.id === 'root'){
            table.bootstrapTable('showColumn', 'refDoc');
            table.bootstrapTable('showColumn', 'libelle');
            table.bootstrapTable('showColumn', 'noEmployeur');
            table.bootstrapTable('showColumn', 'extension');
            table.bootstrapTable('hideColumn', 'uploadUserName');
            table.bootstrapTable('hideColumn', 'fileName');
            table.bootstrapTable('hideColumn', 'path');
            table.bootstrapTable('onFilter', ['uploadUserName', 'trf_fich']);
        }else{
            data.instance.toggle_node(data.node);

            //Filter on refDoc
            var nodeid = parseInt(data.node.id);
            if (nodeid > -1 && data.node.li_attr.class === 'leaf'){
                table.bootstrapTable('showColumn', 'refDoc');
                table.bootstrapTable('showColumn', 'libelle');
                table.bootstrapTable('showColumn', 'noEmployeur');
                table.bootstrapTable('showColumn', 'extension');
                table.bootstrapTable('hideColumn','uploadUserName');
                table.bootstrapTable('hideColumn','fileName');
                table.bootstrapTable('hideColumn','path');
                table.bootstrapTable('onFilter',['refDoc', nodeid ]);
            }

            //Filter for upload
            if ( data.node.id === 'upload' ){
                //console.log("upload");
                table.bootstrapTable('hideColumn', 'refDoc');
                table.bootstrapTable('hideColumn', 'libelle');
                table.bootstrapTable('hideColumn', 'noEmployeur');
                table.bootstrapTable('hideColumn', 'extension');
                table.bootstrapTable('showColumn','uploadUserName');
                table.bootstrapTable('showColumn','fileName');
                table.bootstrapTable('showColumn','path');
                table.bootstrapTable('onFilter',['uploadUserName', username]);
            }
            //Filter for other category
            if ( data.node.id === 'other' ){
                //console.log("other");
                table.bootstrapTable('hideColumn', 'refDoc');
                table.bootstrapTable('hideColumn', 'libelle');
                table.bootstrapTable('hideColumn', 'noEmployeur');
                table.bootstrapTable('hideColumn', 'extension');
                table.bootstrapTable('showColumn', 'uploadUserName');
                table.bootstrapTable('showColumn','fileName');
                table.bootstrapTable('showColumn','path');
                table.bootstrapTable('onFilter',['refDoc','empty']);
            }
        }
    }

    /****************************************************
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
            //if (numcat == 0) numcat = 98;



            if ($.inArray(refdoc, refDocUsed) > -1) { // doc is used
                //adding label
                if ($.inArray(numcat, cat) > -1) { // category exists --> add children
                    //add child node
                    tree[(tree.length - 1)]
                        .children[(tree[(tree.length - 1)].children.length)] = {
                        "id" : refdoc,
                        "data" : refdoc,
                        "text": refdoc + " - " + item.labelDoc_f,
                        "li_attr": {"class": "leaf"}
                    }
                } else {
                    // create category
                    cat[cat.length] = numcat;
                    tree[tree.length] =
                    {
                        /*"id": numcat,*/
                        "text": numcat + " - " + item.labelCategory_f,
                        "state": {
                            "opened": true,
                            "disabled": false,
                            "selected": false
                        },
                        "children": [
                            { //add document
                                "id": refdoc,
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
                "id": "other",
                "text": '98 - Autres Documents',
                "state": {
                    "opened": true,
                    "disabled": false,
                    "selected": false
                },
                "children": [],
                "li_attr": {"class": "leaf"}
            };
        }


        // ---> ADDING the "UPLOAD CATEGORY"
        tree[tree.length] =
        {
            "id": "upload",
            "text": '> Documents transmis à Group S', //Overgebrachte documenten naar Group S
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
            .on('select_node.jstree', menuActionClick )
            .jstree({
                'core': {
                    'data': {
                        "id": 'root',
                        "text": "  Tous les documents",
                        "state": {
                            "opened": true,
                            "disabled": false,
                            "selected": true
                        },
                        "children": tree
                    }
                }
                /*"plugins" : [ "contextmenu" ]*/
            });
    }

    /****************************************************
     * TABLE
     * */

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
            clickToSelect: true,
            columns: [
                {
                    field: 'stateField',
                    align: 'center',
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
                    formatter: formatIsNew
                },
                {
                    field: 'formattedDate',
                    title: 'Date',
                    align: 'center',
                    valign: 'middle',
                    class: "formattedDate",
                    sortable: true,
                    visible: true,
                    formatter: formatDate
                },
                {
                    field: 'date',
                    title: 'Date',
                    align: 'center',
                    valign: 'middle',
                    class: 'sortableDate',
                    sortable: true,
                    visible: false,
                    formatter: formatDefault
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
                    field: 'uploadUserName',
                    title: 'User',
                    align: 'center',
                    valign: 'middle',
                    visible: false,
                    sortable: true,
                    formatter: formatUserName
                },
                {
                    field: 'noEmployeur',
                    title: 'Employeur',
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                    formatter: formatDefault
                },
                {
                    field: 'libelle',
                    title: 'Libell&eacute;', //TODO: multi-language
                    align: 'left',
                    valign: 'middle',
                    class: 'labelDoc',
                    sortable: true,
                    formatter: formatDefault
                },
                {
                    field: 'refDoc',
                    title: 'Ref Document',
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                    class: 'refDoc',
                    formatter: formatRefDoc
                },
                {
                    field: 'size',
                    title: 'Taille',
                    align: 'center',
                    valign: 'middle',
                    visible: true,
                    sortable: true,
                    formatter: formatSize
                },
                {
                    field: 'extension',
                    title: 'ext',
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                    formatter:FormatExtension
                },
                /*{
                 field: 'index',
                 title: '#',
                 sortable: true,
                 visible: false,
                 sort: function (a, b) {return a - b;}
                 },
                 */
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
                    formatter: formatDefault
                },
                {
                    field: 'counter',
                    title: '#',
                    align: 'center',
                    valign: 'middle',
                    visible: false,
                    sortable: true,
                    formatter: formatDefault
                },
                {
                    field: 'refGroups',
                    title: 'Ref Group S',
                    align: 'center',
                    valign: 'middle',
                    visible: false,
                    sortable: true,
                    formatter: formatDefault
                },
                {
                    field: 'operate',
                    title: 'Effacer',
                    align: 'center',
                    valign: 'middle',
                    clickToSelect: false,
                    formatter: operateFormatter,
                    events: {
                        'click .remove': function (e, value, row, index) {
                            deleteFile(row.path, row);
                        }
                    }
                }
            ]
        });

        return $table;
    };

    /****************************************************
     * AJAX
     * */

    function deleteFile(filePath){
        var data = {
            "token"     : token,
            "filePath"  : filePath
        };
        $.ajax({
            type: 'DELETE',
            url: serverURL + 'file/',
            data : data,
            success: function(data){
                if(data){
                    alert("fichier supprimé")
                }else{
                    alert("Fichier déja supprimé");
                }
            }
        })
    }


    function LoadFolder() {
        //folder
        return $.ajax({
            type: 'GET',
            url: serverURL + 'folder/' + token + '/',
            success: function(data){ destFolders = data;}
        });
    };

    function LoadCategory() {

        return $.ajax({
            type: 'GET',
            url: serverURL + 'category/',
            success: function(data){ category = data;}
        });

    }

    function LoadData() {

      $('#loader').show();

       return $.ajax({
            type: "GET",
            url: serverURL + 'file/' + token + '/',
            success: function (data) {
              AjaxData = data;
                window.dc = new DataCollection(data);
            },
           complete: function () {
             $('#loader').hide();
           },
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
    }

    /****************************************************
     * MAIN
     * */
    function main() {
        //$('#loader').html('<i class="fa-li fa fa-spinner fa-spin fa-3x"></i>');

        // set token for upload
        var $uploadform = $('#uploadForm');
        $("input[name|='token']").val(token);

        $uploadform.fileupload({
            sequentialUploads: true,
            progressall: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $('#progress .progress-bar').css('width', progress + '%' );
            },
            add: function (e, data) {
                var jqXHR = data.submit()
                    .success(function (result, textStatus, jqXHR) {})
                    .error(function (jqXHR, textStatus, errorThrown) {alert("KO")})
                    .complete(function (result, textStatus, jqXHR) {$('#progress').hide();});
            },
            start: function () {
                $('#progress').show();
            }
        });

        //SYNC & WAIT
        $.when(LoadCategory(), LoadData(), LoadFolder()).done(function (){
            //dc = new DataCollection(AjaxData);
            //dc.query().filter({last_name: 'Snow'}).values();

            var listFolder = $('#uploadForm p:first ');
            for (key in destFolders){
                listFolder.append(
                    '<label class="radio control-label"><input name="destFolder" value="'+ destFolders[key] +'" type="radio" />'+
                        destFolders[key] +'/</label>'
                );
            }

            mergeLabelDoc();
            var $table = createTable();
            createMenu();


            //APPLY FILTERS
            $table.bootstrapTable('onFilter',['isNew', true, '||', 'notDownloaded', true]);

            //DOWNLOAD files
            $table.delegate('.dl', 'click', function () {
                $(this).attr('href', serverURL + 'file/' + token + '/' + $(this).attr('data-id') + '/' + $(this).attr('data-file'));
                //Update icon
                $(this).find('i').remove();
                var small = $(this).find('small');     // cache object
                $(this).prepend("<i class='fa fa-download text-muted'></i>"); //mark as already downloaded
                var dl = parseInt(small.data('dl')) + 1;
                small.data('dl', dl); // increment by one the download count
                small.html('&nbsp;' + dl);
            });


            $('body').delegate('.reloadme', 'click', function(){
                $table.bootstrapTable('onFilter');
            });

            $('.user-name').html(window.login);

            $('#signout').on('click', function () {
                sessionStorage.setItem("token", '');
                window.location = baseURL;
            });

            // Filter
            $('#filterDL').on('click', function (){
                //console.log('filterDL');
                $table.bootstrapTable('onFilter',['notDownloaded', false]);
            });
            $('#filterNew').on('click', function(){
                $table.bootstrapTable('onFilter',['isNew', true]);
            });

            $('header-logo').attr('href',baseURL);
            //Add download all button
            $('#get-selections').click(function () {
                alert('Selected values: ' + JSON.stringify($table.bootstrapTable('getSelections')));
                var array = [];
                $.each($table.bootstrapTable('getSelections'), function(i, item){
                    array[array.length] = serverURL + 'file/' + token + '/' + item.idFile + '/' + item.fileName;
                });
                //console.log(array);
                download(array);
            });

            $('.user-name').html(username.toUpperCase());


            //////////////////// upload
            // btn bootstrap
            $('input[type=file]').bootstrapFileInput();

            //////////////////// upload
            // add cllss active to btn

            $("#uploadCollapse .btn-upload").on('click', function (){
                $( "#uploadCollapse .btn-upload" ).toggleClass( "active", "active");
            });

            // checked : show btn-download


            // date picker
            $('#datepicker .input-daterange').datepicker({
                format: "yyyy-mm-dd",
                language: "fr",
                calendarWeeks: true,
                autoclose: true,
                todayHighlight: true
            });

            $('#sandbox-container .input-daterange').datepicker({
                language: "fr",
                calendarWeeks: true,
                autoclose: true,
                todayHighlight: true
            });            
        });
    }

    $('document').ready(main());

});


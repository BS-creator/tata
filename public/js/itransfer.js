$(function () {
    'user strict'

    /***  GLOBAL VARIABLE ***/
    // array used to store all the existing document reference on the FTP server.
    var serverURL = 'http://172.20.20.64:8018/',
        baseURL = 'http://localhost:4000/itransfer/',
        AjaxData = [],
        category = [],
        refDocUsed = [],
        username = sessionStorage.getItem('username').toLowerCase(),
        token = sessionStorage.getItem('token');

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
            return a - b;
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

        $.each(category, function (i, cat) {
            $.each(AjaxData, function (j, row) {
                if (cat.refDoc == parseInt(row.refDoc)) {
                    //TODO: multilanguage
                    row.libelle = cat.labelDoc_f;
                }
                row.noEmployeur = parseInt(row.noEmployeur);
                row.uploadUserName.toUpperCase();
            });
        });
    }

    function yearFirst(date) {
        return date.slice(6, 11) + "-" +
            date.slice(3, 5) + "-" +
            date.slice(0, 2);
    }

    function filterDate(e) {

        //TODO: case delete date
        var $table = $('#mainTable');
        var dateEnd = yearFirst($('input[name=end]').val());
        var dateStart = yearFirst($('input[name=start]').val());
        var expr = '';

        console.log(dateStart, dateEnd);
        if (dateStart !== "--" && dateEnd === "--" ) {
            //FROM
            expr = 'item["date"] > "' + dateStart + '" ';
        }
        if (dateStart === "--" && dateEnd !== "--") {
            //UP TO
            expr = 'item["date"] < "' + dateEnd + '"';
        }
        if (dateStart !== '--' && dateEnd !== "--" && dateEnd !== '') {
            //FROM TO
            expr += 'item["date"] > "' + dateStart +
                '" && item["date"] < "' + dateEnd + '"';
        }
        if (dateStart === "--" && dateEnd === "--") {
            //ALL DATE
            $table.bootstrapTable('onFilter');
            return;
        }

        console.log("start: expr", expr);
        $table.bootstrapTable('onFilter', expr);

    }


    /****************************************************
     * FORMAT COLUMNS
     * */


        // Styling the row if the file is new
    function rowStylef(row) {
        if (row.isNew) return {"classes": "success" };
        else return {};
    }

    //Format for the download column
    function formatDownload(value, row) {
        var dlCount = row.downloadCount ? row.downloadCount : '';
        var icon = "fa-download";
        //console.log(row.uploadUserName + "!==" +username);
        if (row.uploadUserName === username) {
            icon = "fa-upload";
        }
        if (value) {
            return '<a class="dlfile" data-id="' + row.idFile + '" ' +
                'data-file="' + row.fileName + '" ><i class="fa ' + icon + ' fa-lg text-primary"></i>' +
                '<small data-dl="' + row.downloadCount + '" class="text-muted">&nbsp;' + dlCount + '</small></a>';
        } else {
            return '<a class="dlfile" data-id="' + row.idFile + '" ' +
                'data-file="' + row.fileName + '" ><i class="fa ' + icon + ' fa-lg text-muted"></i>' +
                '<small data-dl="' + row.downloadCount + ' class="text-muted">&nbsp;' + dlCount + '</small></a>';
        }
    }

    function formatIsNew(value) {
        if (value) return "<i class='fa fa-smile-o'></i>";
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

    function FormatExtension(value, row) {
        if (value || value != '') {
            var v = value.toLowerCase();

            if (v.indexOf('pdf') !== -1) {
                return '<a class="dlfile" data-id="' + row.idFile + '" data-file="' + row.fileName + '" >' +
                    '<i class="fa fa-file-pdf-o fa-lg" title="pdf"></i>' +
                    '</a>';
            }
            else if (v.indexOf('zip') !== -1) {
                return '<a class="dlfile" data-id="' + row.idFile + '" data-file="' + row.fileName + '" >' +
                    '<i class="fa fa-file-archive-o fa-lg" title="zip"></i>' +
                    '</a>';
            }
            else if (v.indexOf('xls') !== -1 || v.indexOf('csv') !== -1) {
                return '<a class="dlfile" data-id="' + row.idFile + '" data-file="' + row.fileName + '" >' +
                    '<i class="fa fa-file-excel-o fa-lg" title="xls"></i>' +
                    '</a>';
            }
            else if (v.indexOf('dat') !== -1) {
                return '<a class="dlfile" data-id="' + row.idFile + '" data-file="' + row.fileName + '" >' +
                    '<i class="fa fa-file-text-o fa-lg" title="dat"></i>' +
                    '</a>';
            }
            else if (v.indexOf('jpg') !== -1 || v.indexOf('png') !== -1) {
                return '<a class="dlfile" data-id="' + row.idFile + '" data-file="' + row.fileName + '" >' +
                    '<i class="fa fa-file-picture-o fa-lg" title="image"></i>' +
                    '</a>';
            }
            else {
                return '<a class="dlfile" data-id="' + row.idFile + '" data-file="' + row.fileName + '" >' +
                    '<i class="fa fa-file-o fa-lg" ></i>' +
                    '</a>';
            }
            if (v.indexOf('dat') !== -1 || v.indexOf('csv') !== -1) {
                return '<a class="dlfile" data-id="' + row.idFile + '" data-file="' + row.fileName + '" >' +
                    '<i class="fa fa-bar-chart"></i>' +
                    '</a>';
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

    function formatUserName(value) {
        return value.toUpperCase();
    }

    function formatDate(value, row) {
        //2014-09-09"
        //if (value.length === )
        //console.log(row.date);
        var year = row.date.slice(0, 4),
            month = row.date.slice(5, 7),
            day = row.date.slice(8, 10);
        return day + "/" + month + "/" + year;
    }

    function formatPath(value) {
        return value.replace('/data/' + username + '/', '');
    }

    function formatDefault(value) {
        if (!value || value == '') return '';
        else return value;
    }

    function operateFormatter() {
        return [
            '<a class="remove" title="Remove">',
            '<i class="fa fa-trash fa-lg"></i>',
            '</a>'
        ].join('');
    }

    /****************************************************
     * DOWNLOAD (ZIP)
     * */

    function download() {
        $.ajax({
            type: "POST",
            url: serverURL + 'file/list/',
            data : {
                "token" : token,
                "fileID": "128496992"
            }
        });
    }

    /****************************************************
     * UPLOAD
     * */


    function uploadForm() {
        // set token for upload
        var $uploadform = $('#uploadForm');
        $("input[name='token']").val(token);

        $uploadform.attr("action", serverURL + "file/upload");

        //console.log(" $uploadform.attr('action')",  $uploadform.attr("action"));
        $uploadform.fileupload({
            sequentialUploads: true,
            progressall: function (e, data) {
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $('#progress .progress-bar').css('width', progress + '%');
            },
            add: function (e, data) {
                var jqXHR = data.submit()
                    .success(function (result, textStatus, jqXHR) {
                    })
                    .error(function (jqXHR, textStatus, errorThrown) {
                        alert("Error " + textStatus)
                    })
                    .complete(function (result, textStatus, jqXHR) {
                        //console.log("result file upload: ", result);
                        $('#progress').hide();
                        $('.close').click();
                        location.reload();
                    });
            },
            start: function () {
                $('#progress').show();
            }
        });


    }

    function ListFolderUpload(destFolders) {
        var listFolder = $('#uploadForm p:first');
        for (key in destFolders) {
            if (destFolders[key] === 'Presta') {
                listFolder.append(
                        '<label class="radio control-label"><input name="destFolder" value="' +
                        destFolders[key] + '" type="radio" checked />' + destFolders[key] + '/</label>'
                );
            } else {
                listFolder.append(
                        '<label class="radio control-label"><input name="destFolder" value="' +
                        destFolders[key] + '" type="radio" />' + destFolders[key] + '/</label>'
                );
            }

        }
    }


    /****************************************************
     * MENU
     * */

    function menuActionClick(e, data) {
        var table = $('#mainTable');
        $('.breadcrumb').html('<li class="active">'+ data.node.text+'</li><li><a href="#"></a></li>');
        if (data.node.id === 'root') {
            table.bootstrapTable('showColumn', 'refDoc');
            table.bootstrapTable('showColumn', 'libelle');
            table.bootstrapTable('showColumn', 'noEmployeur');
            table.bootstrapTable('showColumn', 'extension');
            table.bootstrapTable('hideColumn', 'uploadUserName');
            table.bootstrapTable('hideColumn', 'fileName');
            table.bootstrapTable('hideColumn', 'path');
            table.bootstrapTable('onFilter', ['uploadUserName', 'trf_fich']);
            //$('.breadcrumb').html('<li class="active">Tous les documents</li><li><a href="#"></a></li>');
        } else {
            data.instance.toggle_node(data.node);
            //console.log(data.node);

            //Filter on refDoc
            var nodeid = parseInt(data.node.id);
            if (nodeid > -1 && data.node.li_attr.class === 'leaf') {
                table.bootstrapTable('showColumn', 'refDoc');
                table.bootstrapTable('showColumn', 'libelle');
                table.bootstrapTable('showColumn', 'noEmployeur');
                table.bootstrapTable('showColumn', 'extension');
                table.bootstrapTable('hideColumn', 'uploadUserName');
                table.bootstrapTable('hideColumn', 'fileName');
                table.bootstrapTable('hideColumn', 'path');
                table.bootstrapTable('onFilter', ['refDoc', nodeid ]);
            }

            //Filter for upload
            if (data.node.id === 'upload') {
                //console.log("upload");
                table.bootstrapTable('hideColumn', 'refDoc');
                table.bootstrapTable('hideColumn', 'libelle');
                table.bootstrapTable('hideColumn', 'noEmployeur');
                table.bootstrapTable('hideColumn', 'extension');
                table.bootstrapTable('showColumn', 'uploadUserName');
                table.bootstrapTable('showColumn', 'fileName');
                table.bootstrapTable('showColumn', 'path');
                table.bootstrapTable('onFilter', ['uploadUserName', username]);
            }
            //Filter for other category
            if (data.node.id === 'other') {
                //console.log("other");
                table.bootstrapTable('hideColumn', 'refDoc');
                table.bootstrapTable('hideColumn', 'libelle');
                table.bootstrapTable('hideColumn', 'noEmployeur');
                table.bootstrapTable('hideColumn', 'extension');
                table.bootstrapTable('showColumn', 'uploadUserName');
                table.bootstrapTable('showColumn', 'fileName');
                table.bootstrapTable('showColumn', 'path');
                table.bootstrapTable('onFilter', ['refDoc', 'empty']);
            }
        }
    }

    // TIP: $('.leaf') to access leaf nodes...!!!!
    function buildTree() {

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
                        "id": refdoc,
                        "data": refdoc,
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
            "text": 'Documents transmis à Group S', //Overgebrachte documenten naar Group S
            "state": {
                "opened": true,
                "disabled": false,
                "selected": false
            },
            "li_attr": {"class": "leaf"}
        };

        return tree;
    }


    function createMenu() {

        var $sidenave = $('#sidenav');

        // JSTREE
        $sidenave
            .on('select_node.jstree', menuActionClick)
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
                        "children": buildTree()
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
            clickToSelect: false,
            columns: [
                {
                    field: 'stateField',
                    align: 'center',
                    checkbox: true

                },
                {
                    field: 'notDownloaded',
                    title: '<i class="fa fa-download fa-lg"></i>',
                    align: 'center',
                    sortable: true,
                    class: 'dl',
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
                /*{
                    field: 'date',
                    title: 'Date',
                    align: 'center',
                    valign: 'middle',
                    class: 'sortableDate',
                    sortable: true,
                    visible: false,
                    formatter: formatDefault
                },*/
                {
                    field: 'fileName',
                    title: 'Nom',
                    align: 'center',
                    valign: 'middle',
                    visible: false,
                    sortable: true
                },
                {
                    field: 'uploadUserName',
                    title: 'Utilisateur',
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
                    class: 'empl',
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
                    title: 'Ref Doc',
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
                    class: 'size',
                    formatter: formatSize
                },
                {
                    field: 'extension',
                    title: 'Type',
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                    class: 'ext',
                    formatter: FormatExtension
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
                    title: 'Chemin',
                    align: 'center',
                    valign: 'middle',
                    visible: false,
                    sortable: true,
                    formatter: formatPath
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
                    class: 'del',
                    formatter: operateFormatter,
                    events: {
                        'click .remove': function (e, value, row, index) {
                            deleteFile(row.path, row);
                        }
                    }
                }
            ]
        })/*.on('check.bs.table', function (e, row) {
            $('.downloadall').show();
            //$result.text('Event: check.bs.table, data: ' + JSON.stringify(row));
        }).on('uncheck.bs.table', function (e, row) {
            $('.downloadall').hide();
        }).on('check-all.bs.table', function (e) {
            $('.downloadall').show();
        }).on('uncheck-all.bs.table', function (e) {
            $('.downloadall').hide();
        })*/;

        return $table;
    }

    /****************************************************
     * AJAX
     * */

    function deleteFile(filePath) {
        var data = {
            "token": token,
            "filePath": filePath
        };
        $.ajax({
            type: 'DELETE',
            url: serverURL + 'file/',
            data: data,
            success: function (data) {
                if (data) {
                    alert("Fichier supprimé");
                    location.reload();
                } else {
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
            success: function (data) {
                ListFolderUpload(data);
            }
        });
    }

    function LoadCategory() {

        return $.ajax({
            type: 'GET',
            url: serverURL + 'category/',
            success: function (data) {
                category = data;
            }
        });

    }

    function LoadData() {

        $('#loader').show();

        return $.ajax({
            type: "POST",
            url: serverURL + 'file/list/',
            data: { "token" : token },
            success: function (data) { AjaxData = data; },
            complete: function () {
                $('#loader').hide();
            },
            statusCode: {
                403: function () {
                    alert("ERREUR: Session expirée.");
                    window.location = baseURL;
                },
                401: function () {
                    alert("ERREUR: Problème de connexion.");
                }
            }
        });
    }

    /****************************************************
     * EVENTS
     * */

    function setEventsHTML(){

        var $table = $('#mainTable');

        //DOWNLOAD files
        $table.on('click','.dlfile', function () {
            $(this).attr('href', serverURL + 'file/' + token + '/' + $(this).attr('data-id') + '/' + $(this).attr('data-file'));
            //Update icon
            $(this).find('i').remove();
            var small = $(this).find('small');     // cache object
            $(this).prepend("<i class='fa fa-download text-muted'></i>"); //mark as already downloaded
            var dl = parseInt(small.data('dl')) + 1;
            small.data('dl', dl); // increment by one the download count
            small.html('&nbsp;' + dl);
        });


        // RELOAD
        $('.reloadme').on('click', function () {
            //$table.bootstrapTable('onFilter');
            location.reload();
        });

        // LOGOUT
        $('#signout').on('click', function () {
            sessionStorage.setItem("token", '');
            window.location = baseURL;
        });

        // Filter
        $('#filterDL').on('click', function () {
            $table.bootstrapTable('onFilter', "item['notDownloaded']");
        });
        $('#filterNew').on('click', function () {
            $table.bootstrapTable('onFilter', "item['isNew']");
        });

        //TODO
        //$('header-logo').attr('href', baseURL);

        $('.downloadall').on('click', function(){
            $('#loader').show();
            var array = $table.bootstrapTable('getSelections');
            //console.log("getSelections",array);
            var listID='';
            $.each(array, function(i,item){
                listID += item.idFile +'@!';
            });
            console.log(listID);
            //post download
            //TODO!!!!

            var params = {
                "token": token,
                "fileID": listID
            }
            $.ajax({
                type: "POST",
                url: serverURL + "/file/zip",
                data: params,
                success: function(response, status, request) {
                    $('#loader').hide();
                    var disp = request.getResponseHeader('Content-Disposition');
                    if (disp && disp.search('attachment') != -1) {
                        var form = $('<form method="POST"  action="' + serverURL + '/file/zip">');
                        $.each(params, function(k, v) {
                            form.append($('<input type="hidden" name="' + k +
                                '" value="' + v + '">'));
                        });
                        $('body').append(form);
                        console.log("form", form);
                        form.submit();
                    }
                }
            });
        });


        // Upload
        // btn bootstrap
        $('input[type=file]').bootstrapFileInput();

        // add css active to btn
        $("#uploadCollapse .btn-upload").on('click', function () {
            $("#uploadCollapse .btn-upload").toggleClass("active", "active");
        });

        // checked : show btn-download
        //TODO css?

        // date picker
        $('#datepicker input').datepicker({
            format: "dd/mm/yyyy",
            language: "fr",
            autoclose: true,
            todayHighlight: true,
            startView: 1
            //minViewMode: 1 //month view

        }).on('changeDate', filterDate)
            .off('keyup').on('keyup', function (event) {
                setTimeout(filterDate, 500, event); // 500ms
        });
    }



    /****************************************************
     * MAIN
     * */
    function main() {

        $('.user-name').html(username.toUpperCase());
        //SYNC & WAIT
        $.when(LoadCategory(), LoadData(), LoadFolder()).done(function () {

            //Add label for reference of Document
            mergeLabelDoc();

            var $table = createTable();

            createMenu();

            //set upload form events
            uploadForm();

            //set all other events
            setEventsHTML();


            //APPLY DEFAULT FILTERS
            $table.bootstrapTable('onFilter', "(item['uploadUserName'] !== '"+username+"') && (item['isNew'] || item['notDownloaded'])");

        });
    }

    $('document').ready(main());
});


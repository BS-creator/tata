$(function () {
    'user strict'

    /***  GLOBAL VARIABLES ***/
    /*var serverURL = '//qaiapps.groups.be/ariane/',
     baseURL = '//qaiapps.groups.be/itransfer/',*/
    //var serverURL = '//deviapps.groups.be/ariane/',
    var serverURL = '//172.20.20.64:8018/',
        baseURL = '//localhost:4000/itransfer/',
        lang = sessionStorage.getItem("lang"),
        i18n = {},
        AjaxData = [],
        category = [],
        refDocUsed = [],
        username = sessionStorage.getItem('username').toLowerCase(),
        token = sessionStorage.getItem('token');


    /****************************************************
     * HELPER
     * */

    function reportError(error, message) {
        message = message || '';
        console.error(
                'ERROR: ' + message + ' [' + error.toString() + ']\n' +
                '\nName:\t\t' + (error.name || '-') +
                '\nMessage:\t' + (error.message || '-') +
                '\nFile:\t\t\t' + (error.fileName || '-') +
                '\nSource:\t\t' + ((error.toSource && error.toSource()) || '-') +
                '\nLine #:\t\t' + (error.lineNumber || '-') +
                '\nColumn #:\t' + (error.columnNumber || '-') +
                '\n\nStack:\n\n' + (error.stack || '-'));
    }

    window.onerror = function (message, filename, lineno, colno, error) {
        error.fileName = error.fileName || filename || null;
        error.lineNumber = error.lineNumber || lineno || null;
        error.columnNumber = error.columnNumber || colno || null;
        reportError(error, 'Uncatched Exception');
    };

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
                    row.libelle = labelDoc_i18n(cat);
                } else {
                    if(!row.refDoc){
                        row.libelle = row.fileName;
                    }
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

        var $table = $('#mainTable');
        var dateEnd = yearFirst($('input[name=end]').val());
        var dateStart = yearFirst($('input[name=start]').val());
        var expr = '';

        //console.log(dateStart, dateEnd);
        if (dateStart !== "--" && dateEnd === "--") {
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

        //console.log("start: expr", expr);
        $table.bootstrapTable('onFilter', expr);

    }


    /****************************************************
     * INTERNATIONALIZATION i18n
     * */

    function loadTable_i18n() {
        if (lang === "fr") {
            $.getScript("js/locale/bootstrap-table-fr_BE.js");
            $.getScript("js/locale/bootstrap-datepicker.fr.js");
        } else if (lang === "nl") {
            $.getScript("js/locale/bootstrap-table-nl_BE.js");
            $.getScript("js/locale/bootstrap-datepicker.nl-BE.js");
        } else {
            $.getScript("js/locale/bootstrap-table-en.js");
        }
    }

    function labelDoc_i18n(item) {
        if (lang === "fr") {
            return item.labelDoc_f;
        } else if (lang === "nl") {
            return item.labelDoc_n;
        } else if (lang === "de") {
            return item.labelDoc_d;
        } else {
            return item.labelDoc_x;
        }
    }

    function labelCat_i18n(item) {
        if (lang === "fr") {
            return item.labelCategory_f;
        } else if (lang === "nl") {
            return item.labelCategory_n;
        } else if (lang === "de") {
            return item.labelCategory_d;
        } else {
            return item.labelCategory_x;
        }
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
        if (value) return "<i class='fa fa-check text-success'></i>";
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

    function downloadAll() {

        var array   = $('#mainTable').bootstrapTable('getSelections'),
            listID  = '';

        $.each(array, function (i, item) {
            listID += item.idFile + '@!';
        });

        var params = {
            "token": token,
            "fileID": listID
        };

        var form = $('<form method="POST" action="' + serverURL + 'file/zip">');

        $.each(params, function (k, v) {
            form.append($('<input type="hidden" name="' + k +
                '" value="' + v + '">'));
        });

        $('body').append(form);

        form.submit();

    }

    /****************************************************
     * UPLOAD
     * */

    function uploadForm() {
        // set token for upload
        var $uploadform = $('#uploadForm');
        $("input[name='token']").val(token);

        $uploadform.attr("action", serverURL + "file/upload");

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
        //console.log(data);
        if (data.node.parent && data.node.id !== 'upload' && data.node.id !== 'root') {
            $('.breadcrumb').html('<li class="active">' + $("#" + data.node.parent + " a:first").html().substring(7) + '</li><li class="active">' + data.node.text + '</li><li><a href="#"></a></li>');
        } else {
            $('.breadcrumb').html('<li class="active">' + data.node.text + '</li><li><a href="#"></a></li>');
        }

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
                table.bootstrapTable('onFilter', "(item['uploadUserName'] !== '" + username + "' && item['refDoc'] == '' )");
                //table.bootstrapTable('onFilter', ['refDoc', 'empty']);
            }
        }
    }

    // TIP: $('.leaf') to access leaf nodes...!!!!
    function buildTree() {

        var tree = [];
        var cat = [];

        refDocUsed = getUsedDocRef(AjaxData);

        // BUILD TREE
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
                        "text": refdoc + " - " + labelDoc_i18n(item), //item.labelDoc_f,
                        "li_attr": {"class": "leaf"}
                    }
                } else {
                    // create category
                    cat[cat.length] = numcat;
                    tree[tree.length] =
                    {
                        /*"id": numcat,*/
                        "text": numcat + " - " + labelCat_i18n(item),//item.labelCategory_f,
                        "state": {
                            "opened": true,
                            "disabled": false,
                            "selected": false
                        },
                        "children": [
                            { //add document
                                "id": refdoc,
                                "text": refdoc + " - " + labelDoc_i18n(item), //item.labelDoc_f,
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
                "text": i18n[lang].tree.other,
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
            "text": i18n[lang].tree.upload, //'Documents transmis à Group S',
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

        $('#sidenav')
            .on('select_node.jstree', menuActionClick)
            .jstree({
                'core': {
                    'data': {
                        "id": 'root',
                        "text": i18n[lang].tree.root,//"Tous les documents",
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

    /*    function addSortCarets(){
     $(this).on('click', function () {
     $(this).find('[class="fa-sort"]').remove();
     });
     //$this.parents().siblings().find('div.th-inner').toggleClass('fa-sort-up fa-sort');
     }*/
    // addSortCarets();
    /****************************************************
     * TABLE
     * */

    function createTable() {

        return $('#mainTable').bootstrapTable({
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
                    class: 'dl sortable',
                    formatter: formatDownload
                },
                {
                    field: 'isNew',
                    title: i18n[lang].col.new,
                    align: 'center',
                    sortable: true,
                    class: "new sortable",
                    visible: false,
                    formatter: formatIsNew
                },
                {
                    field: 'formattedDate',
                    title: i18n[lang].col.date,
                    align: 'center',
                    valign: 'middle',
                    class: "formattedDate sortable",
                    sortable: true,
                    visible: true,
                    formatter: formatDate
                },
                {
                    field: 'fileName',
                    title: i18n[lang].col.name,
                    align: 'center',
                    valign: 'middle',
                    visible: false,
                    sortable: true,
                    class: "fileName sortable"
                },
                {
                    field: 'uploadUserName',
                    title: i18n[lang].col.user,
                    align: 'center',
                    valign: 'middle',
                    visible: false,
                    sortable: true,
                    formatter: formatUserName,
                    class: "uploadUserName sortable"
                },
                {
                    field: 'noEmployeur',
                    title: i18n[lang].col.empl,
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                    class: 'empl sortable',
                    formatter: formatDefault
                },
                {
                    field: 'libelle',
                    title: i18n[lang].col.label,
                    align: 'left',
                    valign: 'middle',
                    class: 'labelDoc sortable',
                    sortable: true,
                    formatter: formatDefault
                },
                {
                    field: 'refDoc',
                    title: i18n[lang].col.refdoc,
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                    class: 'refDoc sortable',
                    formatter: formatRefDoc
                },
                {
                    field: 'size',
                    title: i18n[lang].col.size,
                    align: 'center',
                    valign: 'middle',
                    visible: true,
                    sortable: true,
                    class: 'size sortable',
                    formatter: formatSize
                },
                {
                    field: 'extension',
                    title: i18n[lang].col.ext,
                    align: 'center',
                    valign: 'middle',
                    sortable: true,
                    class: 'ext sortable',
                    formatter: FormatExtension
                },
                {
                    field: 'path',
                    title: i18n[lang].col.path,
                    align: 'center',
                    valign: 'middle',
                    visible: false,
                    sortable: true,
                    formatter: formatPath,
                    class: 'path sortable'
                },
                {
                    field: 'refClientCompl',
                    title: i18n[lang].col.refCl,
                    align: 'center',
                    valign: 'middle',
                    visible: false,
                    sortable: true,
                    formatter: formatDefault,
                    class: 'refClientCompl sortable'
                },
                {
                    field: 'counter',
                    title: i18n[lang].col.count,
                    align: 'center',
                    valign: 'middle',
                    visible: false,
                    sortable: true,
                    formatter: formatDefault,
                    class: 'counter sortable'
                },
                {
                    field: 'refGroups',
                    title: i18n[lang].col.refGS,
                    align: 'center',
                    valign: 'middle',
                    visible: false,
                    sortable: true,
                    formatter: formatDefault,
                    class: 'refGroups sortable'
                },
                {
                    field: 'operate',
                    title: i18n[lang].col.del,
                    align: 'center',
                    valign: 'middle',
                    clickToSelect: false,
                    class: 'operate',
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


    }

    /****************************************************
     * AJAX
     * */

    function Loadi18n() {
        $.getJSON("data/i18n.json", function (data) {
            i18n = data;
        });
    }

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
                    alert(i18n[lang].file.del);
                    location.reload();
                } else {
                    alert("ERROR");
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
            data: { "token": token },
            success: function (data) {
                AjaxData = data;
            },
            complete: function () {
                $('#loader').hide();
            },
            error: function (xhr, status) {
                $('#loader').hide();
                alert(i18n[lang].error0);
            },
            dataType: 'json',
            statusCode: {
                403: function () {
                    $('#loader').hide();
                    alert(i18n[lang].errorSession);
                    window.location = baseURL;
                },
                401: function () {
                    $('#loader').hide();
                    alert(i18n[lang].error0);
                }
            }
        });
    }

    /****************************************************
     * EVENTS
     * */

    function setEventsHTML() {

        $('#btn-upload-div span').html('<i class="fa fa-upload"></i>&nbsp;&nbsp;' + i18n[lang].upload);
        $('#modalh4').html('<i class="fa fa-2x fa-upload"></i>&nbsp;&nbsp;' + i18n[lang].modalupload);
        $('#modalbq').html(i18n[lang].modalbq);

        //Language settings
        $('.login-lang').on('click', function () {
            //console.log($(this).html().toLowerCase());
            sessionStorage.setItem("lang", $(this).html().toLowerCase());
            location.reload();
        });

        var $table = $('#mainTable');

        //DOWNLOAD files
        $table.on('click', '.dlfile', function () {
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

        // Filter
        $('#filterDL').on('click', function () {
            $table.bootstrapTable('onFilter', "item['notDownloaded']");
        });
        $('#filterNew').on('click', function () {
            $table.bootstrapTable('onFilter', "item['isNew']");
        });

        //multidownload
        $('.downloadall').on('click', downloadAll);
        $('.bottomDL').on('click', downloadAll);


        // Upload
        // btn bootstrap
        $('input[type=file]').bootstrapFileInput(i18n[lang].modalbtn);

        // add css active to btn
        $("#upload-modal .btn-upload").on('click', function () {
            $("#upload-modal .btn-upload").toggleClass("active", "active");
        });

        // date picker
        $('#datepicker input').datepicker({
            format: "dd/mm/yyyy",
            language: lang === 'nl' ? "nl-BE" : lang,
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

    function render() {
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
            $table.bootstrapTable('onFilter', "(item['uploadUserName'] !== '" + username + "') && (item['isNew'] || item['notDownloaded'])");

        });
    }

    function main() {

        $('.user-name').html(username.toUpperCase());

        // LOGOUT
        $('#signout').on('click', function () {
            sessionStorage.setItem("token", '');
            window.location = baseURL;
        });

        //i18n
        $.getJSON("data/i18n.json", function (data) {
            i18n = data;
            loadTable_i18n();
            if (i18n[lang]) {   // if language is set,
                render();       // load data and create table
            } else {
                alert("ERROR loading data");
                window.location = baseURL;
            }
        });
    }

    $('document').ready(main());

});


$(function (_, moment) {
    'user strict'

    /***  GLOBAL VARIABLES ***/

    var serverURL = sessionStorage.getItem('serverURL'),
        baseURL = sessionStorage.getItem('baseURL'),
        lang = sessionStorage.getItem("lang"),
        tableId = '#tableID',
        table = {},
        oTable = {},
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

    function sortUnique(array) {
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
            var ref = parseInt(item.referenceDocument);
            if (!isNaN(ref)) {
                a[a.length] = ref;
            } else {
                a[a.length] = -1;
            }
        });
        return sortUnique(a);
    }

    function mergeLabelDoc() {

        $.each(category, function (i, cat) {
            $.each(AjaxData, function (j, row) {
                if (cat.referenceDocument == parseInt(row.referenceDocument)) {
                    row.label = labelDoc_i18n(cat);
                } else {
                    if (!row.referenceDocument) {
                        row.label = row.fileName;
                    }
                }
            });
        });
    }

    function yearFirst(date) { //TODO: use moment!
        return date.slice(6, 11) + "-" +
            date.slice(3, 5) + "-" +
            date.slice(0, 2);
    }

    function filterDate() {
    //TODO: use DATATABLE date filter!!!
    //TODO: filterDate(inputStart, inputEnd)

        var $table = $(tableId);
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
    //TODO: function formatPath(value) {return value.replace('/data/' + username + '/', '');}

    //TODO: function formatUserName(value) { return value.toUpperCase(); }

    /****************************************************
     * DOWNLOAD (ZIP)
     * */

    function downloadAll() {

        var array = $(tableId).bootstrapTable('getSelections'),
            listID = '';

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

        //console.log(data);
        if (data.node.parent && data.node.id !== 'upload' && data.node.id !== 'root') {
            $('.breadcrumb').html('<li class="active">' + $("#" + data.node.parent + " a:first").html().substring(7) + '</li><li class="active">' + data.node.text + '</li><li><a href="#"></a></li>');
        } else {
            $('.breadcrumb').html('<li class="active">' + data.node.text + '</li><li><a href="#"></a></li>');
        }

        if (data.node.id === 'root') {

            oTable.fnFilterClear();
            table.columns('.detailsLayer').visible(false, false);
            table.columns('.fileLayer').visible(true, false);
            table.columns.adjust().draw(false); // adjust column sizing and redraw

            table.column(4).search('trf_fich').draw(); //filter on uploadUserName

            //$('.breadcrumb').html('<li class="active">Tous les documents</li><li><a href="#"></a></li>');

        } else {
            data.instance.toggle_node(data.node);

            var nodeid = parseInt(data.node.id);
            if (nodeid > -1 && data.node.li_attr.class === 'leaf') {

                oTable.fnFilterClear();
                table.columns('.detailsLayer').visible(false, false);
                table.columns('.fileLayer').visible(true, false);
                table.columns.adjust().draw(false); // adjust column sizing and redraw

                table.column(7).search(nodeid).draw(); //filter on referenceDocument

            }

            //Filter for upload
            if (data.node.id === 'upload') {
                //console.log("upload");

                oTable.fnFilterClear();
                table.columns('.detailsLayer').visible(true, false);
                table.columns('.fileLayer').visible(false, false);
                table.columns.adjust().draw(false); // adjust column sizing and redraw

                table.column(4).search(username).draw(); //filter on uploadUserName


            }
            //Filter for other category
            if (data.node.id === 'other') {
                //console.log("other");

                //table.bootstrapTable('onFilter', "(item['uploadUserName'] !== '" + username + "' && item['refDoc'] == '' )");

                oTable.fnFilterClear();
                table.columns('.detailsLayer').visible(true, false);
                table.columns('.fileLayer').visible(false, false);
                table.columns.adjust().draw(false); // adjust column sizing and redraw

                table
                    .column(4).search('[^' + username + ']', true, false)
                    .column(7).search('^\\s*$', true, false)
                    .draw(); //filter on uploadUserName != username


            }
        }
    }

    // TIP: $('.leaf') to access leaf nodes...!!!!
    function buildTree() {

        var tree = [];
        var cat = [];

        refDocUsed = getUsedDocRef(AjaxData);

        console.log(refDocUsed);
        // BUILD TREE
        $.each(category, function (i, item) {

            var refdoc = parseInt(item.referenceDocument),
                numcat = parseInt(item.categoryNumber);
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

    /****************************************************
     * TABLE
     * */

    function templateTable() {
        _.templateSettings = {
            interpolate: /\[\[(.+?)\]\]/g
            //Define an *interpolate* regex to match expressions
            // that should be interpolated verbatim, an *escape* regex
            // to match expressions that should be inserted after being
            // HTML escaped, and an *evaluate* regex to match expressions
            // that should be evaluated without insertion into
            // the resulting string.
        };

        var tpl = _.template($('#headertpl').html());

        var $table = $(tableId);
        $table.find('thead').html(tpl(i18n[lang].col));

        tpl = _.template($('#bodytpl').html());
        var html = {};

        _.each(AjaxData, function (row) {

            /* if (row.isNew) return "<i class='fa fa-check text-success'></i>";
             else return "<i class='fa fa-times'></i>";*/

            if (row.isNew) row.classNew = 'isNew';
            else row.classNew = 'notNew';

            if (parseInt(row.downloadCount) > 0) row.alreadyDL = 'text-muted';
            else row.alreadyDL = 'text-primary';
            row.downloadCount = parseInt(row.downloadCount);
            if (isNaN(row.downloadCount)) row.downloadCount = -1;

            //TODO: how to improve this code? ==> ugly
            row.employerNumber = parseInt(row.employerNumber);
            if (isNaN(row.employerNumber)) row.employerNumber = "";

            row.referenceDocument = parseInt(row.referenceDocument);
            if (isNaN(row.referenceDocument)) row.referenceDocument = "";

            if (row.uploadUserName === username) row.dlClass = 'fa-upload';
            else row.dlClass = 'fa-download';

            row.dateFormatted = moment(row.date, "YYYY-MM-DD").format("DD/MM/YYYY");
            row.sizeFormatted = formatSize(row.size);
            row.extensionFormatted = FormatExtension(row.extension, row);
            //row.uploadUserName.toUpperCase();

            html += tpl(row);
        });

        $table.find('tbody').html(html);
    }

    function createDataTable() {

        templateTable();

        //DataTable object
        table = $(tableId).DataTable({
            "paging": true,
            "ordering": true,
            "info": true,
            "stateSave": true,
            "lengthMenu": [
                [10, 20, 50, -1],
                [10, 20, 50, i18n[lang].listAll]
            ],
            "dom": '<"top"iCT>rt<"bottom"lp>',
            "language": {
                "url": i18n[lang].url.table
            },
            "order": [
                [ 2, 'desc' ]
            ],
            "columnDefs": [
                {
                    "targets": 0,  //checkbox
                    "visible": true,
                    "orderable": false,
                    "searchable": true
                },
                {
                    "targets": 1    //DownloadCount HTML
                },
                {
                    "targets": 2    // Date
                },
                {
                    "className": 'detailsLayer',
                    "targets": 3,  // fileName
                    "visible": false,
                    "searchable": true
                },
                {
                    "className": 'detailsLayer',
                    "targets": 4,  // uploadUserName
                    "visible": false,
                    "searchable": true
                },
                {
                    "className": 'fileLayer',
                    "targets": 5    //employerNumber
                },
                {
                    "className": 'fileLayer',
                    "targets": 6    // label
                },
                {
                    "className": 'fileLayer',
                    "targets": 7    //referenceDocument
                },
                {
                    "className": 'fileLayer',
                    "targets": 8    // size
                },
                {
                    "className": 'fileLayer',
                    "targets": 9    //extension
                },
                {
                    "className": 'detailsLayer',
                    "targets": 10,  //path
                    "visible": false,
                    "searchable": true
                },
                {
                    "targets": 11,  //referenceClient
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": 12,  //counter
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": 13,  //referenceGroupS
                    "visible": false,
                    "searchable": false
                },
                {
                    "targets": 14,      // remove
                    "orderable": false
                },
                {
                    "targets": 15,      // downloadCount
                    "visible": false,
                    "searchable": true
                },
                {
                    "targets": 16,
                    "visible": false,
                    "searchable": true
                }
            ],
            "colVis": {
                "activate": "mouseover",
                "buttonText": i18n[lang].showHide,
                "exclude": [ 0, 1, 14, 15, 16 ],
                "restore": "restore"
            },
            "initComplete": function (settings, json) {
                table
                    .column(4).search('[^' + username + ']', true, false)
                    .column(15).search('0')   // not downloaded yet
                    .draw();


            }
        });

        //jQuery TABLE object
        oTable = $(tableId).dataTable();
    }

    /****************************************************
     * AJAX
     * */
    function deleteFile(filePath, $this) {
        //The FTP can delete a file by its path or by its ID (same method on backend)
        //So it works if the fileID is in the filePath
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
                    table
                        .row($this.closest('tr'))
                        .remove()
                        .draw();
                    //location.reload();
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

        var $table = $(tableId);

        //DOWNLOAD files
        $table.on('click', '.dlfile', function () {
            var $this = $(this);
            $this.attr('href', serverURL + 'file/' + token + '/' + $this.data('file-id') + '/' + $this.data('filename'));
            //Update icon
            $this.find('i').remove();
            var small = $this.find('small');     // cache object
            $this.prepend("<i class='fa fa-download fa-lg text-muted'></i>"); //mark as already downloaded
            var dl = parseInt(small.data('dl')) + 1;
            $this.parent().data('order', dl);
            small.data('dl', dl); // increment by one the download count
            small.html('&nbsp;' + dl);
        });


        //select all
        $('input[name=btSelectAll]').on('change', function(){
            $('input[name|=cb]').toggle(); //TODO
        })

        // RELOAD
        $('.reloadme').on('click', function () {
            //$table.bootstrapTable('onFilter');
            location.reload();
        });

        // Search
        var searchInput = $('input[name=search]');
        searchInput.on( 'keyup', function () {
            table.search( this.value ).draw();
        } );

        searchInput.attr('placeholder',i18n[lang].button.search);

        // Filter
        $('#filterNew').on('click', function () {
            table
                .column(16).search('true')
                //.column(4).search('[^' + username + ']', true, false)
                .draw();
        });

        $('#filterDL').on('click', function () {
            table
                .column(15).search('0')
                .column(4).search('[^' + username + ']', true, false)
                .draw();
        });

        $('#filterClear').on('click', function (){
            oTable.fnFilterClear();
        })


        //Delete file
        $('.remove').on('click', function () {
            deleteFile($(this).data('file-id'), $(this));
        });

        //multidownload
        $('.downloadall').on('click', downloadAll);

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

            //var $table = createTable();
            createDataTable();

            createMenu();

            //set upload form events
            uploadForm();

            //set all other events
            setEventsHTML();

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
            if (i18n[lang]) {   // if language is set,
                render();       // load data and create table
            } else {
                alert("ERROR loading data");
                window.location = baseURL;
            }
        });
    }

    $('document').ready(main());

}(_, moment));


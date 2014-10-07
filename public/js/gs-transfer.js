$( function ( _, moment ){
    'use strict';

    /***  GLOBAL VARIABLES ***/

    var serverURL = sessionStorage.getItem( 'serverURL' ),
    baseURL = sessionStorage.getItem( 'baseURL' ),
    lang = sessionStorage.getItem( 'lang' ),
    TABLEID = '#tableID',
    table = {},
    oTable = {},
    i18n = {},
    AjaxData = [],
    category = [],
    refDocUsed = [],
    username = sessionStorage.getItem( 'username' ).toLowerCase(),
    token = sessionStorage.getItem( 'token' );


    _.templateSettings = {
        interpolate: /\[\[([\s\S]+?)\]\]/g,
        //evaluate:/\[\[-([\s\S]+?)\]\]/g,
        escape     : /\[\[=([\s\S]+?)\]\]/g
        //Define an *interpolate* regex to match expressions
        // that should be interpolated verbatim, an *escape* regex
        // to match expressions that should be inserted after being
        // HTML escaped, and an *evaluate* regex to match expressions
        // that should be evaluated without insertion into
        // the resulting string.
        /*
         // DEFAULT SETTINGS
         _.templateSettings = {
         interpolate : /<%=([\s\S]+?)%>/g,
         evaluate : /<%([\s\S]+?)%>/g,
         escape : /<%-([\s\S]+?)%>/g
         };*/
    };

    /****************************************************
     * HELPER
     * */

    function reportError( error, message ){
        message = message || '';
        console.error(
                'ERROR: ' + message + ' [' + error.toString() + ']\n' +
                '\nName:\t\t' + (error.name || '-') +
                '\nMessage:\t' + (error.message || '-') +
                '\nFile:\t\t\t' + (error.fileName || '-') +
                '\nSource:\t\t' + ((error.toSource && error.toSource()) || '-') +
                '\nLine #:\t\t' + (error.lineNumber || '-') +
                '\nColumn #:\t' + (error.columnNumber || '-') +
                '\n\nStack:\n\n' + (error.stack || '-')
        );
    }

    window.onerror = function ( message, filename, lineno, colno, error ){
        error.fileName = error.fileName || filename || null;
        error.lineNumber = error.lineNumber || lineno || null;
        error.columnNumber = error.columnNumber || colno || null;
        reportError( error, 'Uncatched Exception' );
    };

    function bytesToSize( bytes ){
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) {
            return '0 Byte';
        }
        var i = parseInt( Math.floor( Math.log( bytes ) / Math.log( 1024 ) ) );
        return Math.round( bytes / Math.pow( 1024, i ), 2 ) + ' ' + sizes[i];
    }

    function sortUnique( array ){
        array = array.sort( function ( a, b ){
            return a - b;
        } );
        if (array.length > 1) {
            var ret = [array[0]];
            for (var i = 1; i < array.length; i++) { // start loop at 1 as element 0 can never be a duplicate
                if (array[i - 1] !== array[i]) {
                    ret.push( array[i] );
                }
            }
            return ret;
        }
        return array; // only 1 or no element in the array.
    }

    function getUsedDocRef( data ){
        var a = [];
        $.each( data, function ( i, item ){
            var ref = parseInt( item.referenceDocument );
            if (!isNaN( ref )) {
                a[a.length] = ref;
            } else {
                a[a.length] = -1;
            }
        } );
        return sortUnique( a );
    }

    function mergeLabelDoc(){

        $.each( category, function ( i, cat ){
            $.each( AjaxData, function ( j, row ){
                if (cat.referenceDocument === parseInt( row.referenceDocument )) {
                    row.label = labelDoci18n( cat );
                } else {
                    if (!row.referenceDocument) {
                        row.label = row.fileName;
                    }
                }
            } );
        } );
    }

    function yearFirst( date ){ //TODO: use moment!
        return date.slice( 6, 11 ) + '-' +
            date.slice( 3, 5 ) + '-' +
            date.slice( 0, 2 );
    }

    function filterDate(){
        //TODO: use DATATABLE date filter!!!
        //TODO: filterDate(inputStart, inputEnd)

        var $table = $( TABLEID );
        var dateEnd = yearFirst( $( 'input[name=end]' ).val() );
        var dateStart = yearFirst( $( 'input[name=start]' ).val() );
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
            $table.bootstrapTable( 'onFilter' );
            return;
        }

        //console.log("start: expr", expr);
        $table.bootstrapTable( 'onFilter', expr );

    }


    /****************************************************
     * INTERNATIONALIZATION i18n
     * */

    function labelDoci18n( item ){
        if (lang === 'fr') {
            return item.labelDoc_f;
        } else if (lang === 'nl') {
            return item.labelDoc_n;
        } else if (lang === 'de') {
            return item.labelDoc_d;
        } else {
            return item.labelDoc_x;
        }
    }

    function labelCati18n( item ){
        if (lang === 'fr') {
            return item.labelCategory_f;
        } else if (lang === 'nl') {
            return item.labelCategory_n;
        } else if (lang === 'de') {
            return item.labelCategory_d;
        } else {
            return item.labelCategory_x;
        }
    }

    /****************************************************
     * FORMAT COLUMNS
     * */

    function formatExtension( value, row ){
        if (value || value !== '') {
            var v = value.toLowerCase();

            if (v.indexOf( 'pdf' ) !== -1) {
                return '<a class="dlfile" data-id="' + row.idFile + '" data-file="' + row.fileName + '" >' +
                    '<i class="fa fa-file-pdf-o fa-lg" title="pdf"></i>' +
                    '</a>';
            }
            else if (v.indexOf( 'zip' ) !== -1) {
                return '<a class="dlfile" data-id="' + row.idFile + '" data-file="' + row.fileName + '" >' +
                    '<i class="fa fa-file-archive-o fa-lg" title="zip"></i>' +
                    '</a>';
            }
            else if (v.indexOf( 'xls' ) !== -1 || v.indexOf( 'csv' ) !== -1) {
                return '<a class="dlfile" data-id="' + row.idFile + '" data-file="' + row.fileName + '" >' +
                    '<i class="fa fa-file-excel-o fa-lg" title="xls"></i>' +
                    '</a>';
            }
            else if (v.indexOf( 'dat' ) !== -1) {
                return '<a class="dlfile" data-id="' + row.idFile + '" data-file="' + row.fileName + '" >' +
                    '<i class="fa fa-file-text-o fa-lg" title="dat"></i>' +
                    '</a>';
            }
            else if (v.indexOf( 'jpg' ) !== -1 || v.indexOf( 'png' ) !== -1) {
                return '<a class="dlfile" data-id="' + row.idFile + '" data-file="' + row.fileName + '" >' +
                    '<i class="fa fa-file-picture-o fa-lg" title="image"></i>' +
                    '</a>';
            }
            else {
                return '<a class="dlfile" data-id="' + row.idFile + '" data-file="' + row.fileName + '" >' +
                    '<i class="fa fa-file-o fa-lg" ></i>' +
                    '</a>';
            }
            if (v.indexOf( 'dat' ) !== -1 || v.indexOf( 'csv' ) !== -1) {
                return '<a class="dlfile" data-id="' + row.idFile + '" data-file="' + row.fileName + '" >' +
                    '<i class="fa fa-bar-chart"></i>' +
                    '</a>';
            }
            return value;
        } else {
            return '';
        }
    }

    function formatSize( value ){
        var val = parseInt( value );
        if (val > 1024) {
            return Math.round( val / 1024, 2 ) + ' KB';
        }
        else {
            return val;
        }
        //return bytesToSize(val);
    }

    //TODO: function formatPath(value) {return value.replace('/data/' + username + '/', '');}

    //TODO: function formatUserName(value) { return value.toUpperCase(); }


    function getSelectedRows(){
        return table.rows( '.active' ).data();
    }

    /****************************************************
     * DOWNLOAD (ZIP)
     * */

    function addDownloadButton(){
        $('.multiDL' ).html('');
        var btn = $('<button class="btn-portal-green downloadall">'+i18n[lang].button.multiDL+'</button>');
        var multidl = $('.multiDL' );
        multidl.append(btn);
    }

    function downloadAll(){

        //TODO: replace getSelections
        var array = getSelectedRows(),
            listID = '';

        console.log( array );

        $.each( array, function ( i, item ){
            console.log( item );
            listID += item.idFile + '@!';
        } );

        var params = {
            'token' : token,
            'fileID': listID
        };

        var form = $( '<form method="POST" action="' + serverURL + 'file/zip">' );

        $.each( params, function ( k, v ){
            form.append( $( '<input type="hidden" name="' + k +
                '" value="' + v + '">' ) );
        } );

        $( 'body' ).append( form );

        //form.submit();

    }

    /****************************************************
     * UPLOAD
     * */

    function uploadForm(){
        // set token for upload
        var $uploadform = $( '#uploadForm' );
        $( 'input[name="token"]' ).val( token );

        $uploadform.attr( 'action', serverURL + 'file/upload' );

        $uploadform.fileupload( {
            sequentialUploads: true,
            progressall      : function ( e, data ){
                var progress = parseInt( data.loaded / data.total * 100, 10 );
                $( '#progress .progress-bar' ).css( 'width', progress + '%' );
            },
            add              : function ( e, data ){
                data.submit()
                    .error( function ( jqXHR, textStatus ){
                        alert( 'Error ' + textStatus );
                    } )
                    .complete( function (){
                        //console.log("result file upload: ", result);
                        $( '#progress' ).hide();
                        $( '.close' ).click();
                        location.reload();
                    } );
            },
            start            : function (){
                $( '#progress' ).show();
            }
        } );
    }

    function listFolderUpload( destFolders ){
        var listFolder = $( '#uploadForm p:first' );
        for (var key in destFolders) {
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

    function resetDefaultView(){
        oTable.fnFilterClear();
        table.columns().visible( false, false );
        table.columns( '.defaultView' ).visible( true, false );
        table.columns.adjust().draw( false );
        $( '#breadcrumb' ).html( '' );
        createVisibleColumnList();
    }

    function menuRootClick(){

        oTable.fnFilterClear();
        table.columns( '.detailsLayer' ).visible( false, false );
        table.columns( '.fileLayer' ).visible( true, false );
        table.columns.adjust().draw( false ); // adjust column sizing and redraw

        table.column( 4 ).search( 'trf_fich' ).draw(); //filter on uploadUserName

        $( '#breadcrumb' ).html( '<li class="active">' + i18n[lang].tree.root + '</li>' );

        createVisibleColumnList();
    }

    function menuOtherClick(){

        oTable.fnFilterClear();
        table.columns( '.detailsLayer' ).visible( true, false );
        table.columns( '.fileLayer' ).visible( false, false );
        table.columns.adjust().draw( false ); // adjust column sizing and redraw

        table
            .column( 4 ).search( '[^' + username + ']', true, false )
            .column( 7 ).search( '^\\s*$', true, false )
            .draw(); //filter on uploadUserName != username

        $( '#breadcrumb' ).html( '<li class="active">' + i18n[lang].tree.other + '</li>' );

        createVisibleColumnList();
    }

    function menuUploadClick(){

        oTable.fnFilterClear();
        table.columns( '.detailsLayer' ).visible( true, false );
        table.columns( '.fileLayer' ).visible( false, false );
        table.columns.adjust().draw( false ); // adjust column sizing and redraw

        table.column( 4 ).search( username ).draw(); //filter on uploadUserName

        $( '#breadcrumb' ).html( '<li class="active">' + i18n[lang].tree.upload + '</li>' );

        createVisibleColumnList();
    }

    function menuRefDocClick(){
        var $this = $( this );
        var nodeID = $this.attr( 'id' ),
            nodeText = $this.text(),
            nodeParentText = $this.closest( 'li.level2' ).find( 'a:first' ).text();

        $( '#breadcrumb' ).html( '<li class="active">' + nodeParentText + '</li><li class="active">' + nodeText + '</li>' );
        if (nodeID > -1 && $this.hasClass( 'level3' )) {

            oTable.fnFilterClear();
            table.columns( '.detailsLayer' ).visible( false, false );
            table.columns( '.fileLayer' ).visible( true, false );
            table.columns.adjust().draw( false ); // adjust column sizing and redraw

            table.column( 7 ).search( nodeID ).draw(); //filter on referenceDocument
        }

        createVisibleColumnList();
    }

    function templateMenu(){

        var prevCat = -100;
        var htmlLeafNode = '';
        var htmlCategoryNode = '';

        var createLeafNode = _.template( $( '#menuL3' ).html() ),
            createCategoryNode = _.template( $( '#menuL2' ).html() );


        refDocUsed = getUsedDocRef( AjaxData );

        // BUILD leaf and category node
        $.each( category, function ( i, item ){

            var refdoc = parseInt( item.referenceDocument ),
                numcat = parseInt( item.categoryNumber );

            if ($.inArray( refdoc, refDocUsed ) > -1) { // doc is used

                htmlLeafNode += createLeafNode(
                    {
                        referenceDocument: refdoc,
                        typeDocument     : labelDoci18n( item )
                    } );

                if (prevCat !== numcat) {//new category

                    htmlCategoryNode += createCategoryNode(
                        {
                            categoryNumber: numcat,
                            categoryName  : labelCati18n( item ),
                            leafNode      : htmlLeafNode
                        } );
                    htmlLeafNode = '';
                    prevCat = numcat;
                }
            }
        } );

        //other category
        if ($.inArray( -1, refDocUsed ) > -1) {
            htmlCategoryNode += createCategoryNode(
                {
                    categoryNumber: 98,
                    categoryName  : i18n[lang].tree.other,
                    leafNode      : ''
                } );
        }

        var htmlMenu = _.template( $( '#menuL1' ).html() )(
            {
                allDocs     : i18n[lang].tree.root,
                uploadText  : i18n[lang].tree.upload,
                categoryNode: htmlCategoryNode
            }
        );
        return htmlMenu;
    }

    function createMenu(){

        $( '#sidenav' ).html( templateMenu() );

    }

    /****************************************************
     * MENU COLUMN VISIBLE
     * */

    function createVisibleColumnList(){
        var exclude = [ 0, 1, 14, 15, 16 ],
            list = $( '.side-menu-list' ),
            i = 0,
            headerCol = '',
            li = '';

        list.html( '' );

        while (i < 17) {
            if ($.inArray( i, exclude ) === -1) {
                headerCol = table.columns( i ).header().to$().html();
                li = document.createElement( 'li' );
                li.innerHTML = '&nbsp;&nbsp;&nbsp;' + headerCol;
                li.setAttribute( 'data-index', i );
                if (table.column( i ).visible()) {
                    li.className += "active";
                }
                list.append( li );
            }
            i++;
        }
        setEventColumnListVisible();
    }

    /****************************************************
     * TABLE
     * */

    function templateTable(){ //TODO: make it REUSABLE --> parameter for tbody, theader and tableID

        var tpl = _.template( $( '#headertpl' ).html() );

        var $table = $( TABLEID );
        $table.find( 'thead' ).html( tpl( i18n[lang].col ) );

        tpl = _.template( $( '#bodytpl' ).html() );
        var html = {};

        _.each( AjaxData, function ( row ){

            /* if (row.isNew) return "<i class='fa fa-check text-success'></i>";
             else return "<i class='fa fa-times'></i>";*/

            if (row.isNew) {
                row.classNew = 'isNew';
            }
            else {
                row.classNew = 'notNew';
            }

            row.downloadCount = parseInt( row.downloadCount );
            if (isNaN( row.downloadCount )) {
                row.downloadCount = -1;
            }
            if (row.downloadCount > 0) {
                row.alreadyDL = 'text-muted';
            }
            else {
                row.alreadyDL = 'text-primary';
            }

            //TODO: how to improve this code? ==> ugly
            row.employerNumber = parseInt( row.employerNumber );
            if (isNaN( row.employerNumber )) {
                row.employerNumber = '';
            }

            row.referenceDocument = parseInt( row.referenceDocument );
            if (isNaN( row.referenceDocument )) {
                row.referenceDocument = '';
            }

            if (row.uploadUserName === username) {
                row.dlClass = 'fa-upload';
            }
            else {
                row.dlClass = 'fa-download';
            }

            row.dateFormatted = moment( row.date, 'YYYY-MM-DD' ).format( 'DD/MM/YYYY' );
            row.sizeFormatted = formatSize( row.size );
            row.extensionFormatted = formatExtension( row.extension, row );
            //row.uploadUserName.toUpperCase();

            html += tpl( row );
        } );

        $table.find( 'tbody' ).html( html );
    }

    function createDataTable(){

        templateTable();

        //DataTable object
        table = $( TABLEID ).DataTable( {
            paging        : true,
            ordering      : true,
            info          : true,
            scrollX       : true,
            //stateSave: true, //TODO: put it true when deploy to prod!!!
            lengthMenu    : [
                [10, 20, 50, -1],
                [10, 20, 50, i18n[lang].listAll]
            ],
            dom           : '<"top"C>rt<"multiDL"><"page"p><"bottom"il>',
            /*"dom": '<"top"CT>rt<"page"p><"bottom"li>',*/
            language      : {
                url: i18n[lang].url.table
            },
            //pagingType: 'full',
            order         : [
                [ 2, 'desc' ]
            ],
            columnDefs    : [
                {
                    className    : 'defaultView',
                    targets      : 0,  //checkbox
                    orderDataType: 'dom-checkbox',
                    //orderable: false,
                    searchable   : true
                },
                {
                    className: 'defaultView',
                    targets  : 1    //Download
                },
                {
                    className: 'defaultView',
                    targets  : 2    // Date
                },
                {
                    className : 'detailsLayer',
                    targets   : 3,  // fileName
                    visible   : false,
                    searchable: true
                },
                {
                    className : 'detailsLayer',
                    targets   : 4,  // uploadUserName
                    visible   : false,
                    searchable: true
                },
                {
                    className: 'fileLayer defaultView',
                    targets  : 5    //employerNumber
                },
                {
                    className: 'fileLayer defaultView',
                    targets  : 6    // label
                },
                {
                    className: 'fileLayer defaultView',
                    targets  : 7    //referenceDocument
                },
                {
                    className: 'fileLayer defaultView',
                    targets  : 8    // size
                },
                {
                    className: 'fileLayer defaultView',
                    targets  : 9    //extension
                },
                {
                    className : 'detailsLayer',
                    targets   : 10,  //path
                    visible   : false,
                    searchable: true
                },
                {
                    targets   : 11,  //referenceClient
                    visible   : false,
                    searchable: false
                },
                {
                    targets   : 12,  //counter
                    visible   : false,
                    searchable: false
                },
                {
                    targets   : 13,  //referenceGroupS
                    visible   : false,
                    searchable: false
                },
                {
                    className: 'defaultView',
                    targets  : 14,      // remove
                    orderable: false
                },
                {
                    targets   : 15,      // downloadCount
                    visible   : false,
                    searchable: true
                },
                {
                    targets   : 16,     //isNew
                    visible   : false,
                    searchable: true
                }
            ],
            /*colVis        : {
             activate  : 'mouseover',
             buttonText: i18n[lang].showHide,
             exclude   : [ 0, 1, 14, 15, 16 ],
             restore   : 'restore'
             },*/ /* tableTools: {
             "sRowSelect": "multi"
             },*/
            'initComplete': function (){
                table
                    .column( 4 ).search( '[^' + username + ']', true, false )
                    .column( 15 ).search( '0' )   // not downloaded yet
                    .draw();
            }
        } );

        //jQuery TABLE object
        oTable = $( TABLEID ).dataTable();
    }

    /****************************************************
     * AJAX
     * */
    function deleteFile( filePath, $this ){
        //The FTP can delete a file by its path or by its ID (same method on backend)
        //So it works if the fileID is in the filePath
        var data = {
            token   : token,
            filePath: filePath
        };
        $.ajax( {
            type   : 'DELETE',
            url    : serverURL + 'file/',
            data   : data,
            success: function ( data ){
                if (data) {
                    alert( i18n[lang].file.del );
                    table
                        .row( $this.closest( 'tr' ) )
                        .remove()
                        .draw();
                    //location.reload();
                } else {
                    alert( 'ERROR' );
                }
            }
        } );
    }

    function loadFolder(){
        //folder
        return $.ajax( {
            type   : 'GET',
            url    : serverURL + 'folder/' + token + '/',
            success: function ( data ){
                listFolderUpload( data );
            }
        } );
    }

    function loadCategory(){

        return $.ajax( {
            type   : 'GET',
            url    : serverURL + 'category/',
            success: function ( data ){
                category = data;
            }
        } );

    }

    function loadData(){

        $( '#loader' ).show();

        return $.ajax( {
            type      : 'POST',
            url       : serverURL + 'file/list/',
            data      : { 'token': token },
            success   : function ( data ){
                AjaxData = data;
            },
            complete  : function (){
                $( '#loader' ).hide();
            },
            error     : function (){
                $( '#loader' ).hide();
                alert( i18n[lang].error0 );
            },
            dataType  : 'json',
            statusCode: {
                403: function (){
                    $( '#loader' ).hide();
                    alert( i18n[lang].errorSession );
                    window.location = baseURL;
                }
            }
        } );
    }

    /****************************************************
     * EVENTS
     * */

    function setEventColumnListVisible(){
        $( '.side-menu-list > li' ).off( 'click' ).on( 'click', function (){
            var $this = $( this ),
                index = $this.data( 'index' ),
                visible = table.column( index ).visible();
            $this.toggleClass( 'active' );
            table.column( index ).visible( !visible );
        } );

        $( '#init-conf' ).off( 'click' ).on( 'click', function (){
            resetDefaultView();

        } );
    }

    function setEventSideMenuColumnList(){

        $( '#toggle-side-menu' ).html( '<i class="fa fa-columns"></i>&nbsp;&nbsp;&nbsp;' + i18n[lang].button.colVisible );


        oTable.on( 'length.dt', function (){
            var sbWidth = $( '#sidenav' ).width(),
                mainTop = $( '#main' ).offset().top;
            console.log( "test 2" );
            $( '#side-menu' ).css( {
                top   : mainTop, // get top height to align
                right : -sbWidth,
                width : sbWidth,
                height: $( window ).height() - mainTop
            } ).removeClass();
        } );

        $( 'p.side-menu-head' ).text( i18n[lang].sideMenu.config );
        $( '#init-conf' ).html( '<i class="fa fa-dot-circle-o"></i>&nbsp;&nbsp;&nbsp;' + i18n[lang].sideMenu.reset );

        createVisibleColumnList();


    }

    function toggleDLButton(){
        var trActive = $( 'tr.active' );

        if (trActive && trActive.length > 0) {
            addDownloadButton();
            $( '.downloadall' ).show();
        } else {
            $( '.downloadall' ).toggle();
        }
    }

    /***** MENU FILTERS *****/
    function setEventMenuFilters(){
        $( '#root' ).on( 'click', menuRootClick );
        $( '#upload' ).off( 'click' ).on( 'click', menuUploadClick );
        $( '.cat98' ).off( 'click' ).on( 'click', menuOtherClick );
        $( 'li.level3' ).off( 'click' ).on( 'click', menuRefDocClick );
    }

    /***** UPLOAD *****/
    function setEventUpload(){
        //TODO: put it in CSS, just use it to translate!!!
        $( '#btn-upload-div' ).find( 'span' ).html( '<i class="fa fa-upload"></i>&nbsp;&nbsp;' + i18n[lang].upload );
        $( '#modalh4' ).html( '<i class="fa fa-2x fa-upload"></i>&nbsp;&nbsp;' + i18n[lang].modalupload );
        $( '#modalbq' ).html( i18n[lang].modalbq );

        $( 'input[type=file]' ).bootstrapFileInput( i18n[lang].modalbtn );

        $( '#upload-modal .btn-upload' ).on( 'click', function (){
            $( this ).toggleClass( 'active', 'active' );
        } );
    }

    /***** LANGUAGE SETTINGS *****/
    function setEventLanguageSettings(){
        $( '.login-lang' ).on( 'click', function (){
            var lang = $( this ).html().toLowerCase();
            $( '.login-lang' ).removeClass( 'default-lang' );
            $( '.' + lang ).addClass( 'default-lang' );
            sessionStorage.setItem( 'lang', lang );
            location.reload();
        } );
    }


    /***** DOWNLOAD *****/
    function setEventDownload(){
        $( TABLEID ).on( 'click', '.dlfile', function (){
            var $this = $( this );
            $this.attr( 'href', serverURL + 'file/' + token + '/' + $this.data( 'file-id' ) + '/' + $this.data( 'filename' ) );
            //Update icon
            $this.find( 'i' ).remove();
            var small = $this.find( 'small' );     // cache object
            $this.prepend( '<i class="fa fa-download fa-lg text-muted"></i>' ); //mark as already downloaded
            var dl = parseInt( small.data( 'dl' ) ) + 1;
            $this.parent().data( 'order', dl );
            small.data( 'dl', dl ); // increment by one the download count
            small.html( '&nbsp;' + dl );
        } );
    }

    /***** MULTIDOWNLOAD *****/
    function setEventMultiDownload(){

        var dlBtn = $( '.downloadall' );
        dlBtn.on( 'click', downloadAll );
        dlBtn.html('<i class="fa fa-download"></i>&nbsp;&nbsp;&nbsp;' + i18n[lang].button.multiDL);

    }

    /***** DELETE *****/
    function setEventDeleteFile(){
        $( '.remove' ).on( 'click', function (){
            deleteFile( $( this ).data( 'file-id' ), $( this ) );
        } );
    }

    /***** CHECKBOX SELECT ALL *****/
    function setEventCheckBox(){
        $( 'input[name|=cb]' ).on( 'change', function (){
            $( this ).closest( 'tr' ).toggleClass( 'active' );
            toggleDLButton();
        } );

        $( 'td:not(:first-child)' ).on( 'click', function (){
            $( this ).closest( 'tr' ).toggleClass( 'active' );
            var cb = $( this ).closest( 'tr' ).find( 'input[name|=cb]' );
            cb.prop( 'checked', !cb.prop( 'checked' ) );
            toggleDLButton();
        } );
    }

    /***** FILTER *****/
    function setEventFiltersMenu(){

        $( '#filterby' ).html( i18n[lang].button.filter.filterby + '&nbsp;&nbsp;&nbsp;<span class="caret"></span>' );//

        var filterNew = $( '#filterNew' );
        filterNew.on( 'click', function (){
            table
                .column( 16 ).search( 'true' )
                //.column(4).search('[^' + username + ']', true, false)
                .draw();
        } );
        filterNew.html( '<i class="fa fa-file-o"></i>&nbsp;&nbsp;&nbsp;' + i18n[lang].button.filter.new );

        var filterDL = $( '#filterDL' );
        filterDL.on( 'click', function (){
            table
                .column( 15 ).search( '0' )
                .column( 4 ).search( '[^' + username + ']', true, false )
                .draw();
        } );
        filterDL.html( '<i class="fa fa-download"></i>&nbsp;&nbsp;&nbsp;Fichiers non-téléchargés' + i18n[lang].button.filter.notDL );

        var filterClear = $( '#filterClear' );
        filterClear.on( 'click', function (){
            $( 'input[name=search]' ).text( '' );
            oTable.fnFilterClear();
        } );
        filterClear.html( '<i class="fa fa-times"></i>&nbsp;&nbsp;&nbsp;' + i18n[lang].button.filter.clear );
    }

    /***** SEARCH *****/
    function setEventSearch(){
        var searchInput = $( 'input[name=search]' );
        searchInput.attr( 'placeholder', i18n[lang].button.search );
        searchInput.on( 'keyup', function (){
            table.search( this.value ).draw();
        } );
    }

    function setEventReload(){
        var reloadBtn = $( '.reloadme' );
        reloadBtn.html( '<i class="fa fa-refresh"></i>&nbsp;&nbsp;&nbsp;' + i18n[lang].button.reload );
        reloadBtn.on( 'click', function (){
            location.reload();
        } );
    }

    function setEventDatePicker(){

        $( '.dateBegin' ).attr( 'placeholder', i18n[lang].datepicker.start );
        $( '.dp-to' ).text( i18n[lang].datepicker.to );
        $( '.dateEnd' ).attr( 'placeholder', i18n[lang].datepicker.end );

        $( '#datepicker' ).datepicker( {
            format        : 'dd/mm/yyyy',
            forceParse    : true,
            language      : lang,
            weekStart     : 1,
            autoclose     : true,
            todayHighlight: true,
            startView     : 1,
            clearBtn      : true
            //calendarWeeks : true,
            //minViewMode: 1 //month view
        } );
        /*.on( 'changeDate', filterDate )
         .off( 'keyup' ).on( 'keyup', function ( event ) {
         setTimeout( filterDate, 500, event ); // 500ms
         } );
         */

    }


    function setEventsHTML(){

        setEventSideMenuColumnList();

        setEventMenuFilters();

        setEventUpload();

        setEventLanguageSettings();

        setEventDownload();

        setEventSearch();

        setEventFiltersMenu();

        setEventCheckBox();

        setEventDatePicker();

        setEventReload();

        setEventDeleteFile();

        setEventMultiDownload();

        /***** TOOLTIP *****/
        //$( '[rel=tooltip]' ).tooltip();

    }

    /****************************************************
     * MAIN
     * */


    function render(){
        $.when( loadCategory(), loadData(), loadFolder() ).done( function (){

            //Add label for reference of Document
            mergeLabelDoc();

            createDataTable();

            createMenu();

            //set upload form events
            uploadForm();

            setEventsHTML();

        } );
    }

    function main(){

        $( '.user-name' ).html( username.toUpperCase() );

        // LOGOUT
        $( '#signout' ).on( 'click', function (){
            sessionStorage.setItem( 'token', '' );
            window.location = baseURL;
        } );

        //i18n
        $.getJSON( 'data/i18n.json', function ( data ){
            i18n = data;

            if (lang !== 'en') {
                $.getScript( i18n[lang].url.datepicker );
            }

            if (i18n[lang]) {   // if language is set,
                render();       // load data and create table
            } else {
                alert( 'ERROR loading data' );
                window.location = baseURL;
            }
        } );

    }

    $( 'document' ).ready( main() );

}( _, moment ) );


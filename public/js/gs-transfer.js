/**
 * Created by bisconti on 29/08/14.
 */
/*globals $, _, moment, introJs, swal, console, Utils */

var gsTransfer = (function (_, moment, introJs, swal, Utils) {
  'use strict';
  //---------------------------------------------
  /*code to send cookie with every request */
  $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
    options.crossDomain = {
      crossDomain: true
    };
    options.xhrFields   = {
      withCredentials: true
    };
  });

  //---------------------------------------------


  _.templateSettings = {
    interpolate: /\[\[([\s\S]+?)\]\]/g, //evaluate:/\[\[-([\s\S]+?)\]\]/g,
    escape:      /\[\[=([\s\S]+?)\]\]/g
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

  /***  GLOBAL VARIABLES ***/

  var TransferServerURL = sessionStorage.getItem('TransferServerURL');
  var TransferBaseURL   = sessionStorage.getItem('TransferBaseURL');
  var lang              = sessionStorage.getItem('lang');
  var TABLEID           = '#tableID';
  var table             = {}; //DataTable object
  var oTable = {}; //Jquery Data object
  var i18n = {}; // Language
  var AjaxData = []; // Data
  var category = []; // Data
  var refDocUsed = []; // Data
  var username          = sessionStorage.getItem('username') ? sessionStorage.getItem('username').toLowerCase() : '';
  var tokenTransfer     = sessionStorage.getItem('tokenTransfer');
  var selectMenu        = 'ROOT';
  var countFilePerCat   = [];

  /*** HELPER ***/

  var getPDFjsURL = function (serverURL, fileID, filename) {
    return TransferBaseURL + '../cdn/pdfjs/1.0.1149/web/viewer.html?file=' + serverURL + 'file/' + fileID + '/' + filename;
  };

  var redirectToLogin = function () { window.location = TransferBaseURL; };

  var getUsedDocRef = function (data) {
    var a = [];
    var ref;

    //reset number of file
    while (countFilePerCat.length > 0) { countFilePerCat.pop(); }
    countFilePerCat['upload'] = 0;
    countFilePerCat['other']  = 0;

    _.forEach(data, function (item) {
      ref = parseInt(item.referenceDocument);

      if (!isNaN(ref) && username !== item.uploadUserName) {
        a.push(ref);
        countFilePerCat[ref] ? countFilePerCat[ref] += 1 : countFilePerCat[ref] = 1;
      } else {
        a.push(-1);
        if (username !== item.uploadUserName) {countFilePerCat['other'] += 1; }
      }

      if (item.uploadUserName === username) {countFilePerCat['upload'] += 1; }

    });

    return _.uniq(a);
  };


  var mergeLabelDoc = function () {
    var dfd = new $.Deferred();

    _.forEach(category, function (cat) {
      _.forEach(AjaxData, function (row) {
        if (cat.referenceDocument === parseInt(row.referenceDocument)) {
          row.label = labelDocI18n(cat);
        } else {
          if (!row.referenceDocument) {
            row.label = formatFileName(row.fileName);
          }
        }
      });
    });
    dfd.resolve();

    return dfd.promise();
  };


  var getFilesID = function () {
    var array = getSelectedRows(), listID = '', it = null, countFile = 0;

    _.forEach(array, function (item) {
      if (item[1].display) {
        it = $(item[1].display);
      } else {
        it = $(item[1]);
      }
      listID += it.data('file-id') + '&' + it.data('filename') + '@!';
      countFile++;
    });

    return {
      countFile: countFile, data: {fileID: listID}
    };
  };

  var setCursorToAuto = function () {
    $('body').css('cursor', 'auto');
    $('.sweet-alert button').css('cursor', 'auto');
  };

  var setCursorToProgress = function () {
    $('body').css('cursor', 'progress');
    $('.sweet-alert button').css('cursor', 'progress');
  };

  /****************************************************
   * INTERNATIONALIZATION i18n
   * */

  var labelDocI18n = function (item) {

    var doc = {
      fr:      function () { return item.labelDocFR; },
      nl:      function () { return item.labelDocNL; },
      de:      function () { return item.labelDocDE; },
      default: function () { return item.labelDocX; }
    };
    return (doc[lang] || doc['default'])();
  };

  var labelCati18n = function (item) {
    var cat = {
      fr:      function () { return item.labelCategoryFR;},
      nl:      function () { return item.labelCategoryNL;},
      de:      function () { return item.labelCategoryDE;},
      default: function () { return item.labelCategoryX; }
    };
    return (cat[lang] || cat['default'])();
  };

  /****************************************************
   * FORMAT COLUMNS
   * */

  var formatExtension = function (value) {

    if (value || value !== '') {
      var v = value.toLowerCase(), extension = {
        pdf:     function () { return '<span><i class="fa fa-file-pdf-o fa-lg" title="pdf"></i></span>';},
        zip:     function () { return '<span><i class="fa fa-file-archive-o fa-lg" title="zip"></i></span>';},
        xls:     function () { return '<span><i class="fa fa-file-excel-o fa-lg" title="xls"></i></span>';},
        dat:     function () { return '<span><i class="fa fa-bar-chart fa-lg" title="dat"></i></span>';},
        csv:     function () { return '<span><i class="fa fa-file-excel-o fa-lg" title="csv"></i></span>';},
        jpg:     function () { return '<span><i class="fa fa-file-picture-o fa-lg" title="image"></i></span>';},
        png:     function () { return '<span><i class="fa fa-file-picture-o fa-lg" title="image"></i></span>';},
        default: function () { return '<span><i class="fa fa-file-o fa-lg" ></i></span>';}
      };
      return (extension[v] || extension['default'])();
    } else { return ''; }
  };

  var formatSize = function (value) {
    var val = parseInt(value);
    if (val > 1024) { return Math.round(val / 1024) + ' KB';}
    else { return val; }
  };

  var formatPath = function (value) { return value.replace('/data/' + username + '/', ''); };

  var formatFileName = function (value) {
    var v = (value ? value.substring(0, 3) : value);
    if (v === 'PPP' || v === 'GAR' || v === 'GES' || v === 'GAD') { return value.substring(3); }
    return value;
  };

  var getSelectedRows = function () { return table.rows('.active', {search: 'applied'}).data(); };

  var reloadPage = function () { reloadNewData(); };

  var reloadNewData = function (data) {

    showLoading();
    // hide
    $('.modal-select2-open').removeClass('modal-select2-open').addClass('modal-select2');

    loadData().then(function () {
      //add new files from clients.
      AjaxData = (data && data.target) ? AjaxData : (data || AjaxData);
      $.when(mergeLabelDoc()).then(function () {
        //RESOLVED
        //destroy dt
        try {
          table.destroy(false);
        } catch (e) {
          console.warn(e);
          //I18N.common.stabilityWarning
          // setTimeout(function() { throw e; }, 0);
        }
        //table.empty();
        //RESOLVED
        createDataTable();
        createMenu();
      }, function () {
        //REJECT
        console.error('>>>>> reloadNewData: FAILED');
      });
    }, function () {
      //REJECT
      console.error('>>>>> reloadNewData: FAILED');
    })
  };

  /****************************************************
   * DOWNLOAD (ZIP)
   * */

  var addLowerButton = function addLowerButton() {
    var multidl = $('.multiDL');
    multidl.html('');
    /***** DOWNLOAD BUTTON *****/
    multidl.append('<button class="btn-portal-green downloadall mt-xs">' + '<i class="fa fa-download"></i>&nbsp;&nbsp;&nbsp;' + i18n[lang].button.multiDL + '</button>');
    $('.downloadall').off('click').on('click', downloadAll);


    /***** DELETE BUTTON *****/
    multidl.append('<button class="btn-portal-red deleteAll mt-xs pull-right">' + '<i class="fa fa-trash"></i>&nbsp;&nbsp;&nbsp;' + i18n[lang].button.multiDelete + '</button>');
    $('.deleteAll').off('click').on('click', function () {
      swal({
        title:              i18n[lang].dialog.delAction,
        text:               i18n[lang].dialog.delSure,
        type:               'warning',
        showCancelButton:   true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText:  i18n[lang].dialog.delConfirm,
        cancelButtonText:   i18n[lang].dialog.cancel,
        closeOnConfirm:     false
      }, function () {
        deleteAll();
      });
    });
  };
  var incrementCounter         = function (link) {
    link.find('i').remove();
    var small = link.find('small'), // cache object
      dl    = parseInt(small.data('dl')) + 1;
    link.prepend('<i class="fa fa-download fa-lg text-muted"></i>'); //mark as already downloaded

    link.parent().data('order', dl);
    small.data('dl', dl); // increment by one the download count
    small.html('&nbsp;' + dl);
  };
  var dlIcon                   = function (e) {
    var $this = $(this);
    Utils.smessage(i18n[lang].file.dl, ' ', 'warning', 4000);

    //Update icon
    incrementCounter($this);

    //$this.attr('href', TransferServerURL + 'file/' + token + '/' + $this.data('file-id') + '/' +
    // $this.data('filename')); download file (click is not triggered in IE11)
    window.location.href = TransferServerURL + 'file/' + $this.data('file-id') + '/' + $this.data('filename');

    e.stopImmediatePropagation();
  };
  var dlLabel                  = function (e) {
    var $this    = $(this);
    var filename = $this.data('filename');
    var fileID   = $this.data('file-id');
    var url      = TransferServerURL + 'file/' + fileID + '/' + filename;

    // view the PDF directly
    if (filename && (Utils.endsWith(filename, '.PDF') || Utils.endsWith(filename, '.pdf'))) {
      url = getPDFjsURL(TransferServerURL, fileID, filename);
      window.open(url, '_blank');
    } else {
      Utils.smessage(i18n[lang].file.dl, '', 'warning', 4000);

      //$this.attr('href', url);
      window.location.href = url;
    }
    incrementCounter($this.closest('tr').find('a').first());
    e.stopImmediatePropagation();
  };

  var incrementAllSelectedRows = function () {
    _.forEach($(TABLEID).find('.active'), function (row) {
      incrementCounter($(row).find('a').first());
    });
  };
  var resetCheckBox            = function () {

    _.forEach($(TABLEID).find('.active'), function (line) {
      $(line).removeClass('active').find('i.fa-check-square-o').toggleClass('fa-square-o fa-check-square-o');
    });
  };
  var downloadAll              = function () {

    var params = getFilesID(), fileID, filename, form;

    if (params.countFile === 0) {
      Utils.errorMessage(i18n[lang].file.noselect, 3000);

    } else if (params.countFile === 1) {
      fileID   = params.data.fileID.slice(0, params.data.fileID.indexOf('&'));
      filename = params.data.fileID.slice(params.data.fileID.indexOf('&') + 1, params.data.fileID.indexOf('@'));

      window.location.href = TransferServerURL + 'file/' + fileID + '/' + filename;

      incrementAllSelectedRows();

    } else {

      $('#multiDownloadForm').remove();
      form = $('<form id="multiDownloadForm" method="POST" action="' + TransferServerURL + 'file/zip">');

      _.forEach(params.data, function (v, k) {
        form.append($('<input type="hidden" name="' + k + '" value="' + v + '">'));
      });

      $('body').append(form);

      Utils.smessage(i18n[lang].file.dl, '', 'warning', (params.countFile * 1200));
      // about 1,2 seconds per files (õ_ó) .... it's a good guess, what a shame... (╯_╰”)

      incrementAllSelectedRows();
      resetCheckBox();

      form.submit();
    }
  };
  /****************************************************
   * UPLOAD
   * */

  var setEventuploadForm       = function () {
    // set token for upload
    var $uploadform = $('#uploadForm'), activeUploads = null;
    $('input[name="token"]').val(tokenTransfer);

    $uploadform.attr('action', TransferServerURL + 'file/upload');
    if (_.contains(window.location.href, 'localhost')) {
      $uploadform.attr('action', '//localhost:8018/file/upload');
    }
    $uploadform.fileupload({

      limitMultiFileUploads: 10, //autoUpload: false,

      progressall: function (e, data) {
        var progress = parseInt(data.loaded / data.total * 100, 10);
        $('#progress').find('.progress-bar').css('width', progress + '%');
      }, add:      function (e, data) {
        data.submit().error(function (jqXHR) {
          Utils.errorMessage('Error: ' + jqXHR.status + ' - ' + jqXHR.statusText, 4000);
        }).success(function () {
          activeUploads = $uploadform.fileupload('active');
        });

      }, start:    function () {
        $('#progress').show();
      }, done:     function () {
        activeUploads = $uploadform.fileupload('active');
        if (activeUploads < 2) {
          var p = $('#progress');
          p.find('.progress-bar').css('width', '0%');
          p.hide();
          $('.close').click();
          Utils.smessage('OK', ' ', 'success', 4000);
          selectMenu = 'UPLOAD';
          reloadPage();
        }
      }
    });
  };

  var listFolderUpload = function (destFolders) {
    var listFolder = $('#uploadForm').find('div.dir-list'), key;
    for (key in destFolders) {
      if (destFolders[key]) {
        listFolder.append('<label class="radio"><input name="destFolder" value="' + destFolders[key] + '" type="radio" ' + ((destFolders[key] === 'Presta') ? 'checked' : '') + ' />' + destFolders[key] + '/</label>');
      }
    }
  };

  /****************************************************
   * MENU
   * */

  var resetFilters                = function () {

    table.search('').columns().search('');
    $('#breadcrumb').html('&nbsp;');
    $('.dateBegin').val('').datepicker('update');
    $('.dateEnd').val('').datepicker('update');
    $('input[name="search"]').val('');
    $('[class^=level]').removeClass('active');
  };
  var resetDefaultView            = function () {
    resetFilters();
    table.columns().visible(false, false);
    table.columns('.defaultView').visible(true, false);
    table.columns.adjust().draw(false);

    updateMenuVisibleColumnList();
  };
  var setBreadCrumb               = function (text, textChild) {
    if (textChild) {
      $('#breadcrumb').html('<span style="color: #BA5B08;">' + i18n[lang].result + '</span><li class="active noclick">' + text + '</li><li class="active noclick">' + textChild + '</li>');
    } else if (text) {
      $('#breadcrumb').html('<span style="color: #BA5B08;">' + i18n[lang].result + '</span><li class="active noclick">' + text + '</li>');
    } else {
      console.log('error Setting BreadCrumb.');
      $('#breadcrumb').html();
    }
  };
  var menuRootClick               = function (event) {

    $('#upload').removeClass('active');
    $('#validation').removeClass('active');
    resetFilters();
    table.columns('.detailsLayer').visible(false, false);
    table.columns('.validation').visible(false, false);
    table.columns('.fileLayer').visible(true, false);
    // adjust column sizing and redraw
    table.columns.adjust().draw(false);
    table.column(4).search('[^' + username + ']', true, false).draw(); //filter on uploadUserName
    selectMenu = 'ROOT';
    setBreadCrumb(i18n[lang].tree.root);
    updateMenuVisibleColumnList();
    event.preventDefault();
  };
  var menuOtherClick              = function (event) {

    $('#upload').removeClass('active');
    $('#validation').removeClass('active');
    resetFilters();
    table.columns('.fileLayer').visible(false, false);
    table.columns('.validation').visible(false, false);
    table.columns('.detailsLayer').visible(true, false);
    table.columns.adjust().draw(false); // adjust column sizing and redraw
    table.column(4).search('[^' + username + ']', true, false).column(7).search('^\\s*$', true, false)//.column(10).search(/^((?!Validation\/).)*$/,
    // true, false)
    .draw(); //filter on uploadUserName != username
    $('[class^=level] .active').removeClass('active');
    selectMenu = 'OTHER';
    setBreadCrumb(i18n[lang].tree.other);
    updateMenuVisibleColumnList();
    event.preventDefault();
  };
  var menuUploadClick             = function (event) {

    $('#root').parent('li.level1').removeClass('active');
    $('#upload').addClass('active');
    $('#validation').removeClass('active');
    resetFilters();
    table.columns('.fileLayer').visible(false, false);
    table.columns('.validation').visible(false, false);
    table.columns('.detailsLayer').visible(true, false);
    table.columns.adjust().draw(false); // adjust column sizing and redraw
    table//.column(10).search(/^((?!Validation\/).)*$/, true, false) // Don't show validation folder
    .column(4).search(username).draw(); //filter on uploadUserName
    $('[class^=level] .active').removeClass('active');
    selectMenu = 'UPLOAD';
    setBreadCrumb(i18n[lang].tree.upload);
    updateMenuVisibleColumnList();
    event.preventDefault();
  };

  /**
   * When the user click on a category, return all document in that category
   * @param event
   */
  var menuCategoryClick = function (event) {

    $('#upload').removeClass('active');
    $('#validation').removeClass('active');
    resetFilters();
    table.columns('.detailsLayer').visible(false, false);
    table.columns('.validation').visible(false, false);
    table.columns('.fileLayer').visible(true, false);
    var $this       = $(event.currentTarget).parent('li'), levl3 = $this.find('.level3'), //list children
      numDocRegex = '(', child = {}, i;

    $('[class^=level] .active').removeClass('active');
    setBreadCrumb($this.children('a').text());
    $this.addClass('active');
    $this.parents('li').addClass('active');

    for (i = 0; i < levl3.length; i++) {
      child = $(levl3[i]);
      numDocRegex += '^' + child.data('refdoc') + '$|'; // get ref doc number
      child.addClass('active');
    }
    numDocRegex = numDocRegex.replace(/\|([^\|]*)$/, '$1'); //remove last '|'
    numDocRegex += ')';

    table.column(4).search('[^' + username + ']', true, false)
    .column(7).search(numDocRegex, true, false).draw(); //filter on ref docs
    selectMenu = 'ROOT';
    updateMenuVisibleColumnList();
    event.preventDefault();
  };
  var menuRefDocClick             = function (event) {
    var $this          = $(event.currentTarget).parent('li');
    var nodeID         = $this.attr('id');
    var nodeText       = $this.text();
    var nodeParentText = $this.closest('li.level2').children('a').text();

    setBreadCrumb(nodeParentText, nodeText);

    $('[class^=level] .active').removeClass('active');
    $this.addClass('active');
    $this.parents('[class^=level]').addClass('active');
    $('#validation').removeClass('active');
    $('#upload').removeClass('active');

    if (nodeID > -1 && $this.hasClass('level3')) {
      //clear filters
      table.search('').columns().search('');
      table.columns('.detailsLayer').visible(false, false);
      table.columns('.fileLayer').visible(true, false);
      table.columns('.validation').visible(false, false);
      table.columns.adjust().draw(false); // adjust column sizing and redraw
      table//.column(10).search(/^((?!Validation\/).)*$/, true, false) // Don't show validation folder
      .column(4).search('[^' + username + ']', true, false)
      .column(7).search('^' + nodeID + '$', true, false).draw(); //filter on referenceDocument
    }
    selectMenu = 'ROOT';
    updateMenuVisibleColumnList();
    event.preventDefault();
  };
  var templateMenu                = function (menu) {

    var htmlLeafNode       = '';
    var htmlCategoryNode   = '';
    var currentCat         = '';
    var currentCatLabel    = '';
    var createLeafNode     = _.template($('#menuL3').html());
    var createCategoryNode = _.template($('#menuL2').html());

    _.forEach(menu, function (catArray) {
      _.forEach(catArray, function (item) {

        htmlLeafNode += createLeafNode({
          referenceDocument: parseInt(item.referenceDocument),
          typeDocument:      labelDocI18n(item),
          countFiles:        countFilePerCat[item.referenceDocument]
        });
        currentCat      = parseInt(item.categoryNumber);
        currentCatLabel = labelCati18n(item);

      });
      htmlCategoryNode += createCategoryNode({
        categoryNumber: currentCat,
        categoryName:   currentCatLabel,
        categoryFiles:  'test',
        leafNode:       htmlLeafNode
      });
      htmlLeafNode = '';
    });

    //
    //other category
    //
    //added manually!!!! it is too custom to make it a rule!!!
    //
    if (_.contains(refDocUsed, -1)) {
      htmlCategoryNode += '<li class="level2" >'
      + '<a id="other" href="#"><span style="float: left;">' + i18n[lang].tree.other + '</span>'
      + '<span class="badge pull-right" style="margin-top: 0px;  margin-right: 10px;">'
      + (countFilePerCat['other'] ? countFilePerCat['other'] : 0)
      + '</span>'
      + '</a>'
      + '</li>';
    }
    var uploadCount = countFilePerCat['upload'] ? countFilePerCat['upload'] : 0;
    return _.template($('#menuL1').html())({
      allDocs:        i18n[lang].tree.root,
      uploadText:     i18n[lang].tree.upload,
      validationText: i18n[lang].tree.valid,
      uploadCount:    uploadCount,
      categoryNode:   htmlCategoryNode
    });
  };
  var filterMenu                  = function () {
    refDocUsed = getUsedDocRef(AjaxData);
    return _.groupBy(_.filter(category, function (obj) {
      if (_.contains(refDocUsed, parseInt(obj.referenceDocument))) { return obj; }
    }), function (obj) {
      return obj.categoryNumber;
    });
  };
  var createMenu                  = function createMenu() {
    $('#sidenav').html(templateMenu(filterMenu()));
  };

  /****************************************************
   * MENU COLUMN VISIBLE
   * */

  var updateMenuVisibleColumnList = function updateMenuVisibleColumnList() {
    var exclude       = [0, 1, 16, 17, 18, 19, 20];
    var list          = $('.side-menu-list');
    var i             = 0;
    var headerCol, li = '';
    var numberCol     = 20; //number of column in the table

    list.html('');
    while (i <= numberCol) {
      if (!_.contains(exclude, i)) {
        headerCol    = table.columns(i).header().to$().html();
        li           = document.createElement('li');
        li.innerHTML = '&nbsp;&nbsp;&nbsp;' + headerCol;
        li.setAttribute('data-index', '' + i);
        if (table.column(i).visible()) {
          li.className += 'active';
        }
        list.append(li);
      }
      i++;
    }
    setEventColumnListVisible();
  };

  /****************************************************
   * TABLE
   * */

  var templateHeader              = function templateHeader() {
    var tpl = _.template($('#headertpl').html());
    $(TABLEID).find('thead').html(tpl(i18n[lang].col));
  };
  var templateTable               = function templateTable() {

    var tpl = _.template($('#bodytpl').html());
    var date;

    _.forEach(AjaxData, function (row) {

      row.classNew = row.isNew ? 'isNew' : 'notNew';

      row.downloadCount = parseInt(row.downloadCount);
      if (isNaN(row.downloadCount)) { row.downloadCount = -1; }

      row.alreadyDL = row.downloadCount > 0 ? 'text-muted' : 'text-primary';

      row.strippedPath = formatPath(row.path);

      row.fileNameFormatted = formatFileName(row.fileName);

      //row.label = formatFileName(row.label);

      row.employerNumber = parseInt(row.employerNumber) || '';

      row.referenceDocument = parseInt(row.referenceDocument) || '';

      row.dlClass = row.uploadUserName === username ? 'fa-upload' : 'fa-download';

      row.dateFormatted      = moment(row.date, 'YYYY-MM-DD').format('DD/MM/YYYY');
      row.date               = moment(row.date, 'YYYY-MM-DD').format('X');
      row.sizeFormatted      = formatSize(row.size);
      row.extensionFormatted = formatExtension(row.extension, row);

      date                 = moment(row.uploadStamp, 'MM/DD/YYYY hh:mm:ss a');
      row.uploadStamp      = date.format('DD/MM/YYYY HH:mm:ss');
      row.uploadStampOrder = date.format('YYYY/MM/DD HH:mm:ss');

      row.uploaderCommentLimit = Utils.htmlEncode(row.uploaderComment, false).substring(0, 20);
      row.uploaderComment      = Utils.htmlEncode(Utils.htmlEncode(row.uploaderComment, true), false);

      if (row.uploadUserName === 'trf_fich') {row.uploadUserName = 'Group S';}

      table.rows.add($(tpl(row).trim()));
    });
  };

  var createDataTable = function createDataTable() {

    templateHeader();

    //DataTable object
    table = $(TABLEID).DataTable({
      //retrieve      : true,
      paging:       true,
      ordering:     true,
      info:         true,
      scrollX:      true,
      stateSave:    false,
      lengthMenu:   [[10, 20, 50, -1], [10, 20, 50, i18n[lang].listAll]],
      dom:          '<"top"C>rt<"#warningQuota"><"multiDL"><"page"p><"bottom"il>',
      language:     {
        url: i18n[lang].url.table
      }, //pagingType: 'full',
      order:        [[1, 'asc'], [2, 'desc']],
      columnDefs:   [{
        //checkbox
        targets: 0, orderable: false, searchable: true, className: 'defaultView'
      }, {//Download
        targets: 1, className: 'defaultView'
      }, {// Date
        targets: 2, className: 'defaultView'
      }, {// fileName
        targets: 3, visible: false, searchable: true, className: 'detailsLayer '
      }, {// uploadUserName
        targets: 4, visible: false, searchable: true, className: 'detailsLayer '
      }, {//employerNumber
        targets: 5, className: 'fileLayer defaultView'
      }, {// label
        targets: 6, className: 'fileLayer defaultView'
      }, {//referenceDocument
        targets: 7, className: 'fileLayer defaultView'
      }, {// size
        targets: 8, className: 'defaultView'
      }, {//extension or type
        targets: 9, className: 'defaultView'
      }, {//path --  don't show path (too big on screen)
        targets: 10, visible: false, searchable: true
      }, {//referenceClient
        targets: 11, className: 'defaultView'
      }, {//counter
        targets: 12, visible: false, searchable: false
      }, {//referenceGroupS
        targets: 13, visible: false, searchable: false
      }, {//uploadStamp
        targets: 14, visible:   false, searchable: true, className: 'validation '
      }, {//uploader comment
        targets: 15, visible:   true, searchable: true, className: 'comment'
      }, {// downloadCount
        targets: 16, visible: false, searchable: true
      }, {//isNew
        targets: 17, visible: false, searchable: true
      }, { //Validation
        targets: 18, visible: false, searchable: false, orderable: false
      }, {//filename
        targets: 19, visible: false, searchable: true
      }, {// remove
        targets: 20, searchable: false, orderable: false, className:  'defaultView'
      }],
      initComplete: initTableComplete
    });
  };

  /****************************************************
   * AJAX
   * */

  var signOut                     = function () {
    Utils.docCookies.removeItem('ariane');
    Utils.docCookies.removeItem('ariane-transfer');

    swal({
      title:              i18n[lang].dialog.signout,
      text:               i18n[lang].dialog.signoutSure,
      type:               'warning',
      showCancelButton:   true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText:  i18n[lang].dialog.signoutConfirm,
      cancelButtonText:   i18n[lang].dialog.cancel,
      closeOnConfirm:     false
    }, function () {
      return $.ajax({
        type:     'POST',
        url:      TransferServerURL + 'logoff/',
        data:     {token: tokenTransfer},
        complete: function () {
          document.cookie = 'ariane-transfer=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
          sessionStorage.clear();
          redirectToLogin();
        }
      });
    });
  };
  var deleteFile                  = function (fileID, cell) {
    //The FTP can delete a file by its path or by its ID (same method on backend)
    //So it works if the fileID is in the filePath

    setCursorToProgress();
    return $.ajax({
      type:       'DELETE', url: TransferServerURL + 'file/', data: {
        token: tokenTransfer, fileID: fileID
      }, success: function () {
        Utils.smessage(i18n[lang].file.del, '', 'success', 2000);

        table.row(cell.closest('tr')).remove().draw();
        reloadPage();
      },
      complete:   function () { setCursorToAuto(); }

    });
  };
  var deleteAll        = function () {
    $('.deleteAll').off('click');
    setCursorToProgress();

    return $.ajax({
      type:        'DELETE',
      url: TransferServerURL + 'file/multi',
      data: getFilesID().data,
      success: function () {
        Utils.smessage(i18n[lang].file.del, '', 'success', 2000);
        reloadPage();
        resetCheckBox();
        setEventMultiDelete();
      }, error:    function () {
        Utils.errorMessage(i18n[lang].error5xx, 5000);
      }, complete: function () {
        setCursorToAuto();
      }
    });
  };
  /**
   *
   *  list of folder to upload files to.
   *  */
  var loadFolder                  = function () {

    return $.ajax({
      type:          'GET', url: TransferServerURL + 'folder/', success: function (data) {
        listFolderUpload(data);
      }, statusCode: {
        403: function () {
          console.log('error loading folder');
          hideLoading();
          Utils.errorMessage(i18n[lang].errorCnx, 4000);
        }
      }
    });
  };
  // Category of type of document in central db
  var loadCategory               = function () {
    var service = 'category/false';
    //var service = 'category/' ;
    //if(token){ console.log("token = "+token +" defined ==> OK");}
    return $.ajax({
      type:  'GET', url: TransferServerURL + service, success: function (data) {
        category = data;
      },
      error: function () {
        hideLoading();
        console.log('error loading category');
        Utils.errorMessage(i18n[lang].errorCnx, 4000);
      }
    });
  };

  /***
   * list files on the server FTP.
   */

  var loadData                   = function () {

    return $.ajax({
      type:        'GET', url: TransferServerURL + 'file/list/',
      success: function (data) {
        AjaxData = data;
      }, error:    function () {
        hideLoading();
        console.log('error loading data');
        Utils.errorMessage(i18n[lang].error0, 4000);
        AjaxData = [];
      }, dataType: 'json', statusCode: {
        403: function () {
          hideLoading();
          Utils.errorMessage(i18n[lang].errorCnx, 4000);
          setTimeout(function () {
            redirectToLogin();
          }, 4000);
        }
      }
    });
  };
  /****************************************************
   * EVENTS
   * */

  var showLoading                = function () {
    $('#loader').show();
  };
  var hideLoading                = function () {
    $('#loader').hide();
  };
  var setEventColumnListVisible  = function () {
    $('.side-menu-list > li').off('click').on('click', function () {
      var $this   = $(this);
      var index   = $this.data('index');
      var visible = table.column(index).visible();
      $this.toggleClass('active');
      table.column(index).visible(!visible);
    });

    $('#init-conf').off('click').on('click', function () {
      resetDefaultView();
    });
  };
  var setI18nSideMenuColumnList  = function () {
    $('#toggle-side-menu').html('<i class="fa fa-columns"></i>&nbsp;&nbsp;&nbsp;' + i18n[lang].button.colVisible);
    var $smh = $('p.side-menu-head');
    $smh.text(i18n[lang].sideMenu.config);
    $smh.append('&nbsp;&nbsp;&nbsp;<i class="fa fa-chevron-right"></i>');
    $('#init-conf').html(i18n[lang].sideMenu.reset);
  };

  var setEventSideMenuColumnList = function () {

    // slide off #side-menu
    oTable.on('length.dt', function () {
      var sbWidth = $('#sidenav').width();
      $('#main').animate({
        right: 0
      }, 200);
      $('#side-menu').animate({
        right: -sbWidth, width: sbWidth
      }, 200).removeClass('active');
    });

    updateMenuVisibleColumnList();
  };
  var toggleDLButton             = function () {
    var trActive = $('tr.active');
    if (trActive && trActive.length > 0) {
      addLowerButton();
      $('.downloadall').show();
      $('.deleteAll').show();
    } else {
      $('.downloadall').toggle();
      $('.deleteAll').toggle();
    }
  };
  /***** MENU FILTERS *****/
  var setEventMenuFilters        = function () {
    $('#root').off('click').on('click', menuRootClick);
    $('#upload').children('a').off('click').on('click', menuUploadClick);
    $('li.level2').children('a').off('click').on('click', menuCategoryClick);
    $('#other').off('click').on('click', menuOtherClick);
    $('li.level3').children('a').off('click').on('click', menuRefDocClick);
  };
  /***** UPLOAD *****/
  var setI18nUpload              = function () {
    //TODO: put it in CSS, just use it to translate!!!
    $('#btn-upload-div').find('span').html('<i class="fa fa-upload"></i>&nbsp;&nbsp;&nbsp;' + i18n[lang].upload);
    $('#modalh4').html('<i class="fa fa-2x fa-upload"></i>&nbsp;&nbsp;' + i18n[lang].modalupload);
    $('#modalbq').html(i18n[lang].modalbq);
    $('input[type=file]').bootstrapFileInput(i18n[lang].modalbtn);

  };
  var setEventUpload             = function () {
    $('#upload-modal').find('.btn-upload').off('click').on('click', function () {
      $(this).toggleClass('active', 'active');
    });
  };

  /***** LANGUAGE SETTINGS *****/
  var setEventLanguageSettings   = function () {
    $('.' + lang).addClass('default-lang');

    $('.login-lang').off('click').on('click', function () {
      var lang = $(this).html().toLowerCase();
      $('.login-lang').removeClass('default-lang');
      $('.' + lang).addClass('default-lang');
      sessionStorage.setItem('lang', lang);
      //reloadPage();
      window.location.href = TransferBaseURL + 'transferApp.html';
      //window.location.reload();
    });
  };

  /***** DOWNLOAD *****/
  var setEventDownload           = function () {
    $(TABLEID).on('click', '.dlfile', dlIcon);

    //download Single file by click on label
    $(TABLEID).on('click', '.dlfileLabel', dlLabel);
  };

  /***** MULTIDOWNLOAD *****/
  var setI18nMultiDownload       = function () {
    $('.downloadall').html('<i class="fa fa-download"></i>&nbsp;&nbsp;&nbsp;' + i18n[lang].button.multiDL);
  };
  var setEventMultiDownload      = function () {
    $('.downloadall').off('click').on('click', downloadAll);
  };

  /***** DELETE *****/
  var setEventDeleteFile         = function () {
    $('.remove').off('click').on('click', function () {
      var $this = $(this);
      swal({
        title:              i18n[lang].dialog.delAction,
        text:               i18n[lang].dialog.delSure,
        type:               'warning',
        showCancelButton:   true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText:  i18n[lang].dialog.delConfirm,
        cancelButtonText:   i18n[lang].dialog.cancel,
        closeOnConfirm:     false
      }, function () {
        deleteFile($this.data('file-id'), $this);
      });
    });
  };
  /***** MULTI DELETE *****/

  var setI18nMultiDelete         = function () {
    $('.deleteAll').html('<i class="fa fa-trash"></i>&nbsp;&nbsp;&nbsp;' + i18n[lang].button.multiDelete);
  };
  var setEventMultiDelete        = function () {
    $('.deleteAll').off('click').on('click', function () {
      swal({
        title:              i18n[lang].dialog.delAction,
        text:               i18n[lang].dialog.delSure,
        type:               'warning',
        showCancelButton:   true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText:  i18n[lang].dialog.delConfirm,
        cancelButtonText:   i18n[lang].dialog.cancel,
        closeOnConfirm:     false
      }, function () {
        deleteAll();
      });
    });
  };
  var toggleAllIconCheck         = function (activated) {
    if (activated) {
      $('.iconSelect').find('i').removeClass('fa-square-o fa-check-square-o').addClass('fa-check-square-o');
      $('td').closest('tr').addClass('active');

    } else {
      $('.iconSelect').find('i').removeClass('fa-square-o fa-check-square-o').addClass('fa-square-o');
      $('td').closest('tr').removeClass('active');
    }
  };

  /***** CHECKBOX SELECT ALL *****/
  var setEventCheckBox           = function () {

    $('#btnSelectAll').off('click').on('click', function (e) {
      e.preventDefault();
      var $this = $(this);
      $this.toggleClass('fa-square-o fa-check-square-o');
      toggleAllIconCheck($this.hasClass('fa-check-square-o'));
      toggleDLButton();
    });

    $('.iconSelect').off('click').on('click', function (e) {
      e.preventDefault();
      var $this = $(this);
      $this.find('i').toggleClass('fa-square-o fa-check-square-o');
      $this.closest('tr').toggleClass('active');
      toggleDLButton();
      //toggleIconCheck(this);
    });

  };
  /***** FILTER *****/

  var setI18nFiltersButton       = function () {
    $('#filterby').html(i18n[lang].button.filter.filterby + '&nbsp;&nbsp;&nbsp;<span class="caret"></span>'); //
    //$('#filterNew').html('<i class="fa fa-file-o"></i>&nbsp;&nbsp;&nbsp;' + i18n[lang].button.filter.new);
    $('#filterDL').html('<i class="fa fa-download"></i>&nbsp;&nbsp;&nbsp;' + i18n[lang].button.filter.notDL);
    $('#filterClear').html('<i class="fa fa-times"></i>&nbsp;&nbsp;&nbsp;' + i18n[lang].button.filter.clear);
  };
  var setEventFiltersButton      = function () {

    /*$('#filterNew').off('click').on('click', function () {
      var filterby = $('#filterby');
      if (!filterby.hasClass('active')) {filterby.addClass('active');}
      $('#breadcrumb').html($('#breadcrumb').html() + '<li class="active">' + i18n[lang].button.filter.new + '</li>');
      table.column(17).search('true')//.column(4).search('[^' + username + ']', true, false)
      .draw();
      });*/

    $('#filterDL').off('click').on('click', function () {
      var filterby = $('#filterby');
      if (!filterby.hasClass('active')) {filterby.addClass('active');}
      $('#breadcrumb').html($('#breadcrumb').html() + '<li class="active">' + i18n[lang].button.filter.notDL + '</li>');
      table.column(16).search('^0$', true, false)//.column( 4 ).search( '[^' + username + ']', true, false )
      .draw();
    });

    $('#filterClear').off('click').on('click', function () {
      $('#filterby').removeClass('active');
      $('#breadcrumb').html($('#breadcrumb').html() + '<li class="active">' + i18n[lang].button.filter.clear + '</li>');
      $('input[name=search]').text('');
      resetFilters();
      table.draw();
    });

  };

  /***** SEARCH *****/

  var setI18nSearch              = function () {
    $('input[name=search]').attr('placeholder', i18n[lang].button.search);
  };
  var setEventSearch             = function () {
    $('input[name=search]').on('keyup', function () {
      table.search(this.value).draw();
    });
  };
  var setEventReload             = function () {
    var reloadBtn = $('.reloadme');
    /*reloadBtn.html('<i class="fa fa-refresh"></i>&nbsp;&nbsp;&nbsp;' + i18n[lang].button.reload);*/
    reloadBtn.html('<i class="fa fa-refresh"></i>');
    /*reloadBtn.off('click').on('click', function() {
      window.location = TransferBaseURL + 'transferApp.html';
    //window.location.reload();
    });*/
    reloadBtn.off('click').on('click', function () {
      reloadNewData();
    });
  };
  var setI18nDatePicker          = function () {
    $('.dp-to').text(i18n[lang].datepicker.to);
    $('.dateBegin').attr('placeholder', i18n[lang].datepicker.start);
    $('.dateEnd').attr('placeholder', i18n[lang].datepicker.end);
  };
  var setEventDatePicker         = function () {

    var db = $('.dateBegin'), de = $('.dateEnd');

    db.val('');
    db.on('focus', function () { this.select(); });
    db.on('keyup', function () { setTimeout(table.draw(), 1000); });
    db.on('change', function () { table.draw(); });

    de.val('');
    de.on('focus', function () { this.select(); });
    de.on('keyup', function () { setTimeout(table.draw(), 1000); });
    de.on('change', function () { table.draw(); });

    $('#datepicker').datepicker({
      format:             'dd/mm/yyyy',
      forceParse:         true,
      language:           lang,
      weekStart:          1,
      autoclose:          true,
      todayHighlight:     true,
      startView:          1,
      keyboardNavigation: false,
      clearBtn:           true
      //calendarWeeks : true,
      //minViewMode: 1 //month view
    });
  };
  var setI18nBreadCrumb          = function () {
    setBreadCrumb(i18n[lang].breadrumb);
    //$( '#breadcrumb' ).html( i18n[lang].result + '<li class="active">' + i18n[lang].breadrumb + '</li>' );
  };
  var setI18nQuotaWarning        = function () {
    $('#warningQuota').html('<p>' + i18n[lang].warningQuota + '</p>');
  };
  var setI18nHelpButton          = function () {
    var helpBtn = $('#help');
    /*
       helpBtn.html('<i class="fa fa-question"></i>&nbsp;&nbsp;&nbsp;' + i18n[lang].button.help);
       */
    helpBtn.html('<i class="fa fa-question"></i>');
    helpBtn.off('click').on('click', function () {
      //console.log("test");
      var intro = introJs();
      intro.setOptions({
        steps: [{
          intro: i18n[lang].help.welcome
        }, {
          element: '#tableID', intro: i18n[lang].help.table
        }, {
          element: '.iconSelect', intro: i18n[lang].help.checkbox, position: 'right'
        }, {
          element: '.dlfile', intro: i18n[lang].help.dlfile, position: 'right'
        }, {
          element: '.dlfileLabel', intro: i18n[lang].help.dlfileLabel, position: 'right'
        }, {
          element: '.remove', intro: i18n[lang].help.remove, position: 'left'
        }, {
          element:  '.dataTables_scrollHeadInner > table:nth-child(1) > thead:nth-child(1) > tr:nth-child(1)',
          intro:    i18n[lang].help.headers,
          position: 'bottom'
        }, {
          element: '.bottom', intro: i18n[lang].help.bottom, position: 'left'
        }, {
          element: '#btn-upload-div', intro: i18n[lang].help.upload, position: 'right'
        }, {
          element: 'li.level1', intro: i18n[lang].help.menu, position: 'right'
        }, {
          element: '#upload', intro: i18n[lang].help.uploaded, position: 'right'
        }, {
          element: '#breadcrumb', intro: i18n[lang].help.breadcrumb, position: 'right'
        }, {
          element: '#filterby', intro: i18n[lang].help.filterby, position: 'left'
        }, {
          element: '#searchBox', intro: i18n[lang].help.searchBox, position: 'bottom'
        }, {
          element: '#datepicker', intro: i18n[lang].help.datepicker, position: 'bottom'
        }, {
          element: '.reloadme', intro: i18n[lang].help.reloadme, position: 'left'
        }, {
          element: '#toggle-side-menu', intro: i18n[lang].help.columnMenu, position: 'left'
        }/*,
           {
element:  '#signout',
intro:    i18n[lang].help.logoff,
position: 'left'
}*/]
});
intro.setOption('skipLabel', '');
intro.setOption('nextLabel', ''); //'→');
intro.setOption('prevLabel', ''); //'←');
intro.setOption('doneLabel', '');
/*intro.setOption('showButtons', false);*/
intro.start();
});

};
var setEventPreData            = function () {

  setI18nUpload();
  setI18nMultiDelete();
  setI18nMultiDownload();
  setI18nFiltersButton();
  setI18nDatePicker();
  setI18nBreadCrumb();
  setI18nHelpButton();
  setI18nSearch();
  setI18nSideMenuColumnList();

  setEventUpload();
  setEventLanguageSettings();
  setEventReload();
};
var setEventsHTML              = function () {

  setEventSideMenuColumnList();
  setEventMenuFilters();
  setEventSearch();
  setEventDownload();
  setEventFiltersButton();
  setEventCheckBox();
  setEventDatePicker();
  setEventDeleteFile();
  setEventMultiDelete();
  setEventMultiDownload();

};

var initTableComplete = function () {

  table.clear();

  templateTable();

  oTable = $(TABLEID).dataTable();
  table.column(4).search('[^' + username + ']', true, false).draw();

  hideLoading();

  //set upload form events
  $(TABLEID).off('draw.dt').on('draw.dt', function () {
      setEventCheckBox();
      setEventDeleteFile();

      });

  setEventsHTML();

  setTimeout(function () {

      $('[data-toggle="tooltip"]').tooltip();
      setI18nQuotaWarning();

      if (AjaxData.length === 0) {
      //$('#btn-upload-div').trigger('click');
      console.log('>>> NO files');
      }
      //console.log('selectMenu = ' + selectMenu);
      if (selectMenu === 'UPLOAD') {
      $('#upload').find('a').trigger('click');
      }
      $('.downloadall').hide();
      $('.deleteAll').hide();
      }, 500);
};
/****************************************************
 * MAIN
 * */
var render                     = function () {
  showLoading();
  setEventPreData();

  $.when(loadCategory(), loadData(), loadFolder()).then(function () {

    //Add label for reference of Document
    $.when(mergeLabelDoc()).then(function () {

      //Template of Table and Menu
      createDataTable();
      createMenu();

      setEventuploadForm();

    });
  });
};
var main                       = function main() {

  Utils.setTransferURL();

  TransferServerURL = sessionStorage.getItem('TransferServerURL');
  TransferBaseURL   = sessionStorage.getItem('TransferBaseURL');
  lang              = sessionStorage.getItem('lang') || localStorage.lastLanguage;
  username          = sessionStorage.getItem('username') ? sessionStorage.getItem('username').toLowerCase() : '';
  tokenTransfer     = sessionStorage.getItem('tokenTransfer');

  $('[rel="tooltip"]').tooltip();

  //$('.user-name').html(username.toUpperCase());
  $('.username').find('span').html(username.toUpperCase());

  // LOGOUT
  $('#signout').off('click').on('click', signOut);

  //i18n
  $.getJSON('data/i18n.json', function (data) {
    i18n = data;

    //Default Language
    if ((lang !== 'en') && (lang !== 'fr') && (lang !== 'nl')) {
      lang = 'fr';
    }

    if (lang !== 'en') {
      $.getScript(i18n[lang].url.datepicker);
    }

    if (i18n[lang]) { // if language is set,
      $('input[name="lang"]').val(lang);
      // load data and create table
      render();
    } else {
      Utils.errorMessage('ERROR loading language data', 4000);
      setTimeout(function () {
        redirectToLogin();
      }, 4000);
    }
  });
};

$(main);

return {
  i18n:                        i18n,
  countFilePerCat:             countFilePerCat,
  AjaxData:                    AjaxData,
  category:                    category,
  refDocUsed:                  refDocUsed,
  filterMenu:                  filterMenu,
  signOut:                     signOut,
  getFilesID:                  getFilesID,
  getSelectedRows:             getSelectedRows,
  setBreadCrumb:               setBreadCrumb,
  createMenu:                  createMenu,
  createTable:                 createDataTable,
  menuRootClick:               menuRootClick,
  menuCategoryClick:           menuCategoryClick,
  menuOtherClick:              menuOtherClick,
  menuRefDocClick:             menuRefDocClick,
  toggleDLButton:              toggleDLButton,
  toggleAllIconCheck:          toggleAllIconCheck,
  updateMenuVisibleColumnList: updateMenuVisibleColumnList,
  showLoading:                 showLoading,
  hideLoading:                 hideLoading
};

}(_, moment, introJs, swal, Utils));

/**
 * Created by bisconti on 29/08/14.
 */
/*globals _, moment, introJs, swal*/
var gsTransfer = (function(_, moment, introJs, swal, Utils) {
  'use strict';

  _.templateSettings = {
    interpolate: /\[\[([\s\S]+?)\]\]/g,
    //evaluate:/\[\[-([\s\S]+?)\]\]/g,
    escape: /\[\[=([\s\S]+?)\]\]/g
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

  var TransferServerURL = sessionStorage.getItem('TransferServerURL'),
    TransferBaseURL = sessionStorage.getItem('TransferBaseURL'),
    lang = sessionStorage.getItem('lang'),
    TABLEID = '#tableID',
    table = {}, //DataTable object
    oTable = {}, //Jquery Data object
    i18n = {}, // Language
    AjaxData = [], // Data
    category = [], // Data
    refDocUsed = [], // Data
    numberCol = 18,
    username = sessionStorage.getItem('username') ? sessionStorage.getItem('username').toLowerCase() : '',
    tokenTransfer = sessionStorage.getItem('tokenTransfer'),
    tokenPortal = sessionStorage.getItem('token'),

    getUsedDocRef = function(data) {
      var a = [];
      _.each(data, function(item) {
        var ref = parseInt(item.referenceDocument);
        if (!isNaN(ref) && username !== item.uploadUserName) {
          a[a.length] = ref;
        } else {
          a[a.length] = -1;
        }
      });
      return _.uniq(a);
    },

    mergeLabelDoc = function() {

      _.each(category, function(cat) {
        _.each(AjaxData, function(row) {
          if (cat.referenceDocument === parseInt(row.referenceDocument)) {
            row.label = labelDocI18n(cat);
          } else {
            if (!row.referenceDocument) {
              row.label = row.fileName;
            }
          }
        });
      });
    },

    getFilesID = function() {
      var array = getSelectedRows(),
        listID = '',
        it = null,
        fileNumber = 0;

      _.each(array, function(item) {
        it = $(item[1].display);
        listID += it.data('file-id') + '&' + it.data('filename') + '@!';
        fileNumber++;
      });

      return {
        fileNumber: fileNumber,
        data:       {
          token:  tokenTransfer,
          fileID: listID
        }
      };
    },

    setCursorToAuto = function() {
      $('body').css('cursor', 'auto');
      $(' .sweet-alert button').css('cursor', 'auto');
    },

    setCursorToProgress = function() {
      $('body').css('cursor', 'progress');
      $(' .sweet-alert button').css('cursor', 'progress');
    },

    /****************************************************
     * INTERNATIONALIZATION i18n
     * */

    labelDocI18n = function(item) {

      var doc = {
        fr:      function() {
          return item.labelDocFR;
        },
        nl:      function() {
          return item.labelDocNL;
        },
        de:      function() {
          return item.labelDocDE;
        },
        default: function() {
          return item.labelDocX;
        }
      };
      return (doc[lang] || doc['default'])();
    },

    labelCati18n = function(item) {
      var cat = {
        fr:      function() {
          return item.labelCategoryFR;
        },
        nl:      function() {
          return item.labelCategoryNL;
        },
        de:      function() {
          return item.labelCategoryDE;
        },
        default: function() {
          return item.labelCategoryX;
        }
      };
      return (cat[lang] || cat['default'])();
    },

    /****************************************************
     * FORMAT COLUMNS
     * */

    formatExtension = function(value) {

      if (value || value !== '') {
        var v = value.toLowerCase(),
          extension = {
            pdf:     function() {
              return '<span><i class="fa fa-file-pdf-o fa-lg" title="pdf"></i></span>';
            },
            zip:     function() {
              return '<span><i class="fa fa-file-archive-o fa-lg" title="zip"></i></span>';
            },
            xls:     function() {
              return '<span><i class="fa fa-file-excel-o fa-lg" title="xls"></i></span>';
            },
            dat:     function() {
              return '<span><i class="fa fa-bar-chart fa-lg" title="dat"></i></span>';
            },
            csv:     function() {
              return '<span><i class="fa fa-file-excel-o fa-lg" title="csv"></i></span>';
            },
            jpg:     function() {
              return '<span><i class="fa fa-file-picture-o fa-lg" title="image"></i></span>';
            },
            png:     function() {
              return '<span><i class="fa fa-file-picture-o fa-lg" title="image"></i></span>';
            },
            default: function() {
              return '<span><i class="fa fa-file-o fa-lg" ></i></span>';
            }
          };
        return (extension[v] || extension['default'])();
      } else {
        return '';
      }
    },
    formatSize = function(value) {
      var val = parseInt(value);
      if (val > 1024) {
        return Math.round(val / 1024) + ' KB';
      } else {
        return val;
      }
      //return bytesToSize(val);
    },
    formatPath = function(value) {
      return value.replace('/data/' + username + '/', '');
    },
    getSelectedRows = function() {
      return table.rows('.active').data();
    },

    /****************************************************
     * DOWNLOAD (ZIP)
     * */

    addLowerButton = function() {
      var multidl = $('.multiDL');
      multidl.html('');
      multidl.append(
        '<button class="btn-portal-green downloadall mt-xs">' +
        '<i class="fa fa-download"></i>&nbsp;&nbsp;&nbsp;' +
        i18n[lang].button.multiDL +
        '</button>'
      );
      $('.downloadall').off('click').on('click', downloadAll);

      multidl.append(
        '<button class="btn-portal-red deleteAll mt-xs pull-right">' +
        '<i class="fa fa-trash"></i>&nbsp;&nbsp;&nbsp;' +
        i18n[lang].button.multiDelete +
        '</button>'
      );
      $('.deleteAll').off('click').on('click', function() {
        swal({
            title:              i18n[lang].dialog.delAction,
            text:               i18n[lang].dialog.delSure,
            type:               'warning',
            showCancelButton:   true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText:  i18n[lang].dialog.delConfirm,
            cancelButtonText:   i18n[lang].dialog.cancel,
            closeOnConfirm:     false
          },
          function() {
            deleteAll();
          });
      });
    },

    incrementCounter = function(link) {
      link.find('i').remove();
      var small = link.find('small'), // cache object
        dl = parseInt(small.data('dl')) + 1;
      link.prepend('<i class="fa fa-download fa-lg text-muted"></i>'); //mark as already downloaded

      link.parent().data('order', dl);
      small.data('dl', dl); // increment by one the download count
      small.html('&nbsp;' + dl);
    },

    dlIcon = function(e) {
      var $this = $(this);
      Utils.smessage(i18n[lang].file.dl, ' ', 'warning', 4000);

      //Update icon
      incrementCounter($this);

      //$this.attr('href', TransferServerURL + 'file/' + token + '/' + $this.data('file-id') + '/' + $this.data('filename'));
      //download file (click is not triggered in IE11)
      window.location.href = TransferServerURL + 'file/' + tokenTransfer + '/' + $this.data('file-id') +
      '/' + $this.data('filename');
      e.stopImmediatePropagation();
    },

    dlLabel = function(e) {
      var $this = $(this),
        filename = $this.data('filename'),
        fileID = $this.data('file-id'),
        url = TransferServerURL + 'file/' + tokenTransfer + '/' + fileID + '/' + filename;

      if (endsWith(filename, '.PDF') || endsWith(filename, '.pdf')) {
        url = TransferBaseURL + '../cdn/pdfjs/1.0.712/web/viewer.html?file=' + url;
        window.open(url, '_blank');
      } else {
        Utils.smessage(i18n[lang].file.dl, '', 'warning', 4000);

        //$this.attr('href', url);
        window.location.href = url;
      }
      incrementCounter($this.closest('tr').find('a').first());
      e.stopImmediatePropagation();
    },

    incrementAllSelectedRows = function() {
      _.each($(TABLEID).find('.active'), function(row) {
        incrementCounter($(row).find('a').first());
      });
    },

    downloadAll = function() {

      var params = getFilesID(),
        fileID,
        filename,
        form;

      if (params.fileNumber === 0) {
        Utils.errorMessage(i18n[lang].file.noselect, 3000);

      } else if (params.fileNumber === 1) {
        fileID = params.data.fileID.slice(0, params.data.fileID.indexOf('&'));
        filename = params.data.fileID.slice(
          params.data.fileID.indexOf('&') + 1,
          params.data.fileID.indexOf('@'));

        window.location.href = TransferServerURL + 'file/' + tokenTransfer + '/' + fileID + '/' + filename;

        incrementAllSelectedRows();

      } else {

        $('#multiDownloadForm').remove();
        form = $('<form id="multiDownloadForm" method="POST" action="' + TransferServerURL + 'file/zip">');

        _.each(params.data, function(v, k) {
          form.append($('<input type="hidden" name="' + k +
          '" value="' + v + '">'));
        });

        $('body').append(form);

        Utils.smessage(i18n[lang].file.dl, '', 'warning', (params.fileNumber * 1200));
        // about 1,2 seconds per files (õ_ó) .... it's a good guess, what a shame... (╯_╰”)

        incrementAllSelectedRows();

        form.submit();
      }
    },

    /****************************************************
     * UPLOAD
     * */

    setEventuploadForm = function() {
      // set token for upload
      var $uploadform = $('#uploadForm'),
        activeUploads = null;
      $('input[name="token"]').val(tokenTransfer);

      $uploadform.attr('action', TransferServerURL + 'file/upload');

      $uploadform.fileupload({

        limitMultiFileUploads: 10,

        progressall: function(e, data) {
          var progress = parseInt(data.loaded / data.total * 100, 10);
          $('#progress').find('.progress-bar').css('width', progress + '%');
        },
        add:         function(e, data) {
          data.submit()
            .error(function(jqXHR) {
              Utils.errorMessage(' ', 4000);
            })
            .success(function() {
              activeUploads = $uploadform.fileupload('active');
              //console.log( "activeUploads = ", activeUploads );
            })
        },
        start:       function() {
          $('#progress').show();
        },
        done:        function(e, data) {
          activeUploads = $uploadform.fileupload('active');
          //console.log( 'LATER activeUploads = ', activeUploads );
          if (activeUploads < 2) {
            $('#progress').hide();
            $('.close').click();
            Utils.smessage('OK', ' ', 'success', 4000);
            setTimeout(function() {
              window.location = TransferBaseURL + 'transferApp.html?upload';
            }, 4000);
          }
          /*else {
           //console.log( "activeUploads = " + activeUploads + "\tFILE UPLOADED = ", data );
           }*/
        }
      });

      //$uploadform.bind( 'fileuploaddone', function( e, data ){/* ... */} )
    },

    listFolderUpload = function(destFolders) {
      var listFolder = $('#uploadForm').find('div.dir-list'),
        key;
      for (key in destFolders) {
        listFolder.append(
          '<label class="radio"><input name="destFolder" value="' +
          destFolders[key] + '" type="radio" ' +
          ((destFolders[key] === 'Presta') ? 'checked' : '') + ' />' +
          destFolders[key] + '/</label>'
        );
      }
    },

    /****************************************************
     * MENU
     * */

    resetFilters = function() {

      table
        .search('')
        .columns().search('');
      $('#breadcrumb').html('&nbsp;');
      $('.dateBegin').val('').datepicker('update');
      $('.dateEnd').val('').datepicker('update');
      $('input[name="search"]').val('');
      $('[class^=level]').removeClass('active');
    },

    resetDefaultView = function() {
      resetFilters();
      table.columns().visible(false, false);
      table.columns('.defaultView').visible(true, false);
      table.columns.adjust().draw(false);

      updateMenuVisibleColumnList();
    },

    setBreadCrumb = function(text, textChild) {
      if (textChild) {
        $('#breadcrumb').html(i18n[lang].result + '<li class="active noclick">' + text +
        '</li><li class="active noclick">' + textChild + '</li>');
      } else if (text) {
        $('#breadcrumb').html(i18n[lang].result + '<li class="active noclick">' + text +
        '</li>');
      } else {
        console.log('error Setting BreadCrumb.');
      }
    },

    menuRootClick = function(event) {

      $('#upload').removeClass('active');
      resetFilters();
      table.columns('.detailsLayer').visible(false, false);
      table.columns('.fileLayer').visible(true, false);
      // adjust column sizing and redraw
      table.columns.adjust().draw(false);
      //filter on uploadUserName
      table.column(4).search('[^' + username + ']', true, false).draw();
      setBreadCrumb(i18n[lang].tree.root);
      updateMenuVisibleColumnList();
      event.preventDefault();
    },

    menuOtherClick = function(event) {

      resetFilters();
      table.columns('.detailsLayer').visible(true, false);
      table.columns('.fileLayer').visible(false, false);
      table.columns.adjust().draw(false); // adjust column sizing and redraw
      table
        .column(4).search('[^' + username + ']', true, false)
        .column(7).search('^\\s*$', true, false)
        .draw(); //filter on uploadUserName != username
      $('[class^=level] .active').removeClass('active');
      setBreadCrumb(i18n[lang].tree.other);
      updateMenuVisibleColumnList();
      event.preventDefault();
    },

    menuUploadClick = function(event) {

      $('#root').parent('li.level1').removeClass('active');
      $('#upload').addClass('active');
      resetFilters();
      table.columns('.detailsLayer').visible(true, false);
      table.columns('.fileLayer').visible(false, false);
      table.columns.adjust().draw(false); // adjust column sizing and redraw
      table.column(4).search(username).draw(); //filter on uploadUserName
      $('[class^=level] .active').removeClass('active');
      setBreadCrumb(i18n[lang].tree.upload);
      updateMenuVisibleColumnList();
      event.preventDefault();
    },

    menuCategoryClick = function(event) {

      resetFilters();
      table.columns('.detailsLayer').visible(false, false);
      table.columns('.fileLayer').visible(true, false);
      var $this = $(event.currentTarget).parent('li'),
        levl3 = $this.find('.level3'), //list children
        numDocRegex = '(',
        child = {},
        i;

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

      table
        .column(4).search('[^' + username + ']', true, false)
        .column(7).search(numDocRegex, true, false)
        .draw(); //filter on ref docs
      updateMenuVisibleColumnList();
      event.preventDefault();
    },

    menuRefDocClick = function(event) {
      var $this = $(event.currentTarget).parent('li'),
        nodeID = $this.attr('id'),
        nodeText = $this.text(),
        nodeParentText = $this.closest('li.level2').children('a').text();

      setBreadCrumb(nodeParentText, nodeText);

      $('[class^=level] .active').removeClass('active');
      $this.addClass('active');
      $this.parents('[class^=level]').addClass('active');

      if (nodeID > -1 && $this.hasClass('level3')) {
        //clear filters
        table
          .search('')
          .columns().search('');
        table.columns('.detailsLayer').visible(false, false);
        table.columns('.fileLayer').visible(true, false);
        table.columns.adjust().draw(false); // adjust column sizing and redraw
        table
          .column(4).search('[^' + username + ']', true, false)
          .column(7).search('^' + nodeID + '$', true, false)
          .draw(); //filter on referenceDocument
      }
      updateMenuVisibleColumnList();
      event.preventDefault();
    },

    templateMenu = function(menu) {

      var htmlLeafNode = '',
        htmlCategoryNode = '',
        currentCat = '',
        currentCatLabel = '',
        createLeafNode = _.template($('#menuL3').html()),
        createCategoryNode = _.template($('#menuL2').html());

      _.each(menu, function(catArray) {
        _.each(catArray, function(item) {

          htmlLeafNode += createLeafNode({
            referenceDocument: parseInt(item.referenceDocument),
            typeDocument:      labelDocI18n(item)
          });
          currentCat = parseInt(item.categoryNumber);
          currentCatLabel = labelCati18n(item);

        });
        htmlCategoryNode += createCategoryNode({
          categoryNumber: currentCat,
          categoryName:   currentCatLabel,
          leafNode:       htmlLeafNode
        });
        htmlLeafNode = '';
      });

      //other category
      //DONE: added manually!!!! it is too custom to make it a rule!!!
      if (_.contains(refDocUsed, -1)) {
        htmlCategoryNode +=
          '<li class="level2" >' +
          '<a id="other" href="#">' + i18n[lang].tree.other + '</a>' +
          '</li>';
      }

      return _.template($('#menuL1').html())({
        allDocs:      i18n[lang].tree.root,
        uploadText:   i18n[lang].tree.upload,
        categoryNode: htmlCategoryNode
      });
    },

    filterMenu = function() {
      refDocUsed = getUsedDocRef(AjaxData);
      return _.groupBy(_.filter(category, function(obj) {
        if (_.contains(refDocUsed, parseInt(obj.referenceDocument))) {
          return obj;
        }
      }), function(obj) {
        return obj.categoryNumber;
      });
    },

    createMenu = function() {
      $('#sidenav').html(templateMenu(filterMenu()));
    },

    /****************************************************
     * MENU COLUMN VISIBLE
     * */

    updateMenuVisibleColumnList = function() {
      var exclude = [0, 1, 15, 16, 17, 18],
        list = $('.side-menu-list'),
        i = 0,
        headerCol = '',
        li = '';

      list.html('');
      while (i < numberCol) {
        if (!_.contains(exclude, i)) {
          headerCol = table.columns(i).header().to$().html();
          li = document.createElement('li');
          li.innerHTML = '&nbsp;&nbsp;&nbsp;' + headerCol;
          li.setAttribute('data-index', i);
          if (table.column(i).visible()) {
            li.className += 'active';
          }
          list.append(li);
        }
        i++;
      }
      setEventColumnListVisible();
    },

    /****************************************************
     * TABLE
     * */

    templateHeader = function() {
      var tpl = _.template($('#headertpl').html());
      $(TABLEID).find('thead').html(tpl(i18n[lang].col));
    },

    templateTable = function() {

      //TODO: make it REUSABLE --> parameter for tbody, theader and tableID

      var tpl = _.template($('#bodytpl').html());

      _.each(AjaxData, function(row) {

        row.classNew = row.isNew ? 'isNew' : 'notNew';

        row.downloadCount = parseInt(row.downloadCount);
        if (isNaN(row.downloadCount)) {
          row.downloadCount = -1;
        }

        row.alreadyDL = row.downloadCount > 0 ? 'text-muted' : 'text-primary';

        row.strippedPath = formatPath(row.path);

        row.employerNumber = parseInt(row.employerNumber) || '';

        row.referenceDocument = parseInt(row.referenceDocument) || '';

        row.dlClass = row.uploadUserName === username ? 'fa-upload' : 'fa-download';

        row.dateFormatted = moment(row.date, 'YYYY-MM-DD').format('DD/MM/YYYY');
        row.sizeFormatted = formatSize(row.size);
        row.extensionFormatted = formatExtension(row.extension, row);

        var date = moment(row.uploadStamp, 'MM/DD/YYYY hh:mm:ss a');
        row.uploadStamp = date.format('DD/MM/YYYY HH:mm:ss');
        row.uploadStampOrder = date.format('YYYY/MM/DD HH:mm:ss');

        table.rows.add(
          $(tpl(row).trim())
        );
      });
    },

    createDataTable = function() {

      templateHeader();

      //DataTable object
      table = $(TABLEID).DataTable({
        //retrieve      : true,
        paging:       true,
        ordering:     true,
        info:         true,
        scrollX:      true,
        stateSave:    false,
        lengthMenu:   [
          [10, 20, 50, -1],
          [10, 20, 50, i18n[lang].listAll]
        ],
        dom:          '<"top"C>rt<"#warningQuota"><"multiDL"><"page"p><"bottom"il>',
        language:     {
          url: i18n[lang].url.table
        },
        //pagingType: 'full',
        order:        [
          [1, 'asc'],
          [2, 'desc']
        ],
        columnDefs:   [
          {
            className:  'defaultView',
            targets:    0, //checkbox
            //orderDataType: 'dom-checkbox',
            orderable:  false,
            searchable: true
          },
          {
            className: 'defaultView',
            targets:   1 //Download
          },
          {
            className: 'defaultView',
            targets:   2 // Date
          },
          {
            className:  'detailsLayer',
            targets:    3, // fileName
            visible:    false,
            searchable: true
          },
          {
            className:  'detailsLayer',
            targets:    4, // uploadUserName
            visible:    false,
            searchable: true
          },
          {
            className: 'fileLayer defaultView',
            targets:   5 //employerNumber
          },
          {
            className: 'fileLayer defaultView',
            targets:   6 // label
          },
          {
            className: 'fileLayer defaultView',
            targets:   7 //referenceDocument
          },
          {
            className: 'defaultView',
            targets:   8 // size
          },
          {
            className: 'defaultView',
            targets:   9 //extension or type
          },
          {
            className:  'detailsLayer',
            targets:    10, //path
            visible:    false,
            searchable: true
          },
          {
            targets:    11, //referenceClient
            visible:    false,
            searchable: false
          },
          {
            targets:    12, //counter
            visible:    false,
            searchable: false
          },
          {
            targets:    13, //referenceGroupS
            visible:    false,
            searchable: false
          },
          {
            targets:    14, //uploadStamp
            visible:    false,
            searchable: true
          },
          {
            className: 'defaultView',
            targets:   15, // remove
            orderable: false
          },
          {
            targets:    16, // downloadCount
            visible:    false,
            searchable: true
          },
          {
            targets:    17, //isNew
            visible:    false,
            searchable: true
          },
          {
            className:  'validation',
            targets:    18, //Validation
            visible:    false,
            searchable: false
          }
        ],
        initComplete: initTableComplete
      });
    },

    /****************************************************
     * AJAX
     * */

    signOut = function() {

      swal({
          title:              i18n[lang].dialog.signout,
          text:               i18n[lang].dialog.signoutSure,
          type:               'warning',
          showCancelButton:   true,
          confirmButtonColor: '#DD6B55',
          confirmButtonText:  i18n[lang].dialog.signoutConfirm,
          cancelButtonText:   i18n[lang].dialog.cancel,
          closeOnConfirm:     false
        },
        function() {
          return $.ajax({
            type:     'POST',
            url:      TransferServerURL + 'logoff/',
            data:     {
              token: tokenTransfer
            },
            complete: function() {
              //swal({title: "OK", type: "success"});
              sessionStorage.setItem('token', '');
              window.location = TransferBaseURL;
            }
          });
        });
    },

    deleteFile = function(filePath, cell) {
      //The FTP can delete a file by its path or by its ID (same method on backend)
      //So it works if the fileID is in the filePath

      setCursorToProgress();
      return $.ajax({
        type:     'DELETE',
        url:      TransferServerURL + 'file/',
        data:     {
          token:    tokenTransfer,
          filePath: filePath
        },
        success:  function() {
          Utils.smessage(i18n[lang].file.del, '', 'success', 2000);

          table
            .row(cell.closest('tr'))
            .remove()
            .draw();
          //window.location.reload();
        },
        complete: function() {
          setCursorToAuto();
        }

      });
    },

    deleteAll = function() {
      setCursorToProgress();

      return $.ajax({
        type:     'DELETE',
        url:      TransferServerURL + 'file/multi',
        data:     getFilesID().data,
        success:  function() {
          Utils.smessage(i18n[lang].file.del, '', 'success', 2000);
          setTimeout(function() {
            window.location.reload();
          }, 2000);
        },
        error:    function() {
          Utils.errorMessage(i18n[lang].error5xx, 5000);
        },
        complete: function() {
          setCursorToAuto();
        }
      });
    },

    loadFolder = function() {

      // if(token){ console.log("token = "+token +" defined ==> OK");}
      return $.ajax({
        type:       'POST',
        url:        TransferServerURL + 'folder/',
        data:       {token: tokenTransfer},
        success:    function(data) {
          listFolderUpload(data);
        },
        statusCode: {
          403: function() {
            console.log('error loading folder');
            hideLoading();
            Utils.errorMessage(i18n[lang].errorCnx, 4000);
          }
        }
      });
    },

    loadCategory = function() {
      var service = 'category/' + (sessionStorage.getItem('country') === 'FR' ? 'true' : 'false');
      //var service = 'category/' ;
      //if(token){ console.log("token = "+token +" defined ==> OK");}
      return $.ajax({
        type:       'GET',
        url:        TransferServerURL + service,
        success:    function(data) {
          category = data;
        },
        statusCode: {
          403: function() {
            hideLoading();
            console.log('error loading category');
            Utils.errorMessage(i18n[lang].errorCnx, 4000);
          }
        }
      });
    },

    loadData = function() {
      //if(tokenPortal){ console.log("tokenPortal = "+tokenPortal +" defined ==> OK");}
      return $.ajax({
        type:       'POST',
        url:        TransferServerURL + 'file/list/',
        data:       {token: tokenTransfer},
        success:    function(data) {
          AjaxData = data;
        },
        error:      function() {
          hideLoading();
          console.log('error loading data');
          Utils.errorMessage(i18n[lang].error0, 4000);
          AjaxData = [];
        },
        dataType:   'json',
        statusCode: {
          403: function() {
            hideLoading();
            Utils.errorMessage(i18n[lang].errorSession, 4000);
            setTimeout(function() {
              window.location = TransferBaseURL;
            }, 4000);
          }
        }
      });
    },

    /****************************************************
     * EVENTS
     * */

    showLoading = function() {
      $('#loader').show();
    },

    hideLoading = function() {
      $('#loader').hide();
    },

    setEventColumnListVisible = function() {
      $('.side-menu-list > li').off('click').on('click', function() {
        var $this = $(this),
          index = $this.data('index'),
          visible = table.column(index).visible();
        $this.toggleClass('active');
        table.column(index).visible(!visible);
      });

      $('#init-conf').off('click').on('click', function() {
        resetDefaultView();
      });
    },

    setI18nSideMenuColumnList = function() {
      $('#toggle-side-menu').html('<i class="fa fa-columns"></i>&nbsp;&nbsp;&nbsp;' + i18n[lang]
        .button.colVisible);
      var $smh = $('p.side-menu-head');
      $smh.text(i18n[lang].sideMenu.config);
      $smh.append('&nbsp;&nbsp;&nbsp;<i class="fa fa-chevron-right"></i>');
      $('#init-conf').html(i18n[lang].sideMenu.reset);
    },

    setEventSideMenuColumnList = function() {

      // slide off #side-menu
      oTable.on('length.dt', function() {
        var sbWidth = $('#sidenav').width();
        $('#main').animate({
          right: 0
        }, 200);
        $('#side-menu').animate({
          right: -sbWidth,
          width: sbWidth
        }, 200).removeClass('active');
      });

      updateMenuVisibleColumnList();
    },

    toggleDLButton = function() {
      var trActive = $('tr.active');

      if (trActive && trActive.length > 0) {
        addLowerButton();
        $('.downloadall').show();
        $('.deleteAll').show();
      } else {
        $('.downloadall').toggle();
        $('.deleteAll').toggle();
      }
    },

    /***** MENU FILTERS *****/
    setEventMenuFilters = function() {
      $('#root').off('click').on('click', menuRootClick);
      $('#upload').children('a').off('click').on('click', menuUploadClick);
      $('li.level2').children('a').off('click').on('click', menuCategoryClick);
      $('#other').off('click').on('click', menuOtherClick);
      $('li.level3').children('a').off('click').on('click', menuRefDocClick);
    },

    /***** UPLOAD *****/
    setI18nUpload = function() {
      //TODO: put it in CSS, just use it to translate!!!
      $('#btn-upload-div').find('span').html('<i class="fa fa-upload"></i>&nbsp;&nbsp;' + i18n[
        lang].upload);
      $('#modalh4').html('<i class="fa fa-2x fa-upload"></i>&nbsp;&nbsp;' + i18n[lang].modalupload);
      $('#modalbq').html(i18n[lang].modalbq);
      $('input[type=file]').bootstrapFileInput(i18n[lang].modalbtn);

    },

    setEventUpload = function() {
      $('#upload-modal').find('.btn-upload').off('click').on('click', function() {
        $(this).toggleClass('active', 'active');
      });
    },

    /***** LANGUAGE SETTINGS *****/
    setEventLanguageSettings = function() {
      $('.' + lang).addClass('default-lang');

      $('.login-lang').off('click').on('click', function() {
        var lang = $(this).html().toLowerCase();
        $('.login-lang').removeClass('default-lang');
        $('.' + lang).addClass('default-lang');
        sessionStorage.setItem('lang', lang);
        window.location = TransferBaseURL + 'transferApp.html';
        //window.location.reload();
      });
    },

    /***** DOWNLOAD *****/
    setEventDownload = function() {
      $(TABLEID).on('click', '.dlfile', dlIcon);

      //download Single file by click on label
      $(TABLEID).on('click', '.dlfileLabel', dlLabel);
    },

    /***** MULTIDOWNLOAD *****/
    setI18nMultiDownload = function() {
      $('.downloadall').html('<i class="fa fa-download"></i>&nbsp;&nbsp;&nbsp;' + i18n[lang].button.multiDL);
    },

    setEventMultiDownload = function() {
      $('.downloadall').off('click').on('click', downloadAll);
    },

    /***** DELETE *****/
    setEventDeleteFile = function() {
      $('.remove').off('click').on('click', function() {
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
          },
          function() {
            deleteFile($this.data('file-id'), $this);
          });
      });
    },

    /***** MULTI DELETE *****/

    setI18nMultiDelete = function() {
      $('.deleteAll').html('<i class="fa fa-trash"></i>&nbsp;&nbsp;&nbsp;' + i18n[lang].button.multiDelete);
    },

    setEventMultiDelete = function() {
      $('.deleteAll').off('click').on('click', function() {
        swal({
            title:              i18n[lang].dialog.delAction,
            text:               i18n[lang].dialog.delSure,
            type:               'warning',
            showCancelButton:   true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText:  i18n[lang].dialog.delConfirm,
            cancelButtonText:   i18n[lang].dialog.cancel,
            closeOnConfirm:     false
          },
          function() {
            deleteAll();
          });
      });
    },

    toggleAllIconCheck = function(activated) {
      if (activated) {
        $('.iconSelect')
          .find('i')
          .removeClass('fa-square-o fa-check-square-o')
          .addClass('fa-check-square-o');
        $('td').closest('tr').addClass('active');

      } else {
        $('.iconSelect')
          .find('i')
          .removeClass('fa-square-o fa-check-square-o')
          .addClass('fa-square-o');
        $('td').closest('tr').removeClass('active');
      }
    },

    /***** CHECKBOX SELECT ALL *****/
    setEventCheckBox = function() {

      $('#btnSelectAll').off('click').on('click', function(e) {
        e.preventDefault();
        var $this = $(this);
        $this.toggleClass('fa-square-o fa-check-square-o');
        toggleAllIconCheck($this.hasClass('fa-check-square-o'));
        toggleDLButton();
      });

      $('.iconSelect').off('click').on('click', function(e) {
        e.preventDefault();
        var $this = $(this);
        $this.find('i').toggleClass('fa-square-o fa-check-square-o');
        $this.closest('tr').toggleClass('active');
        toggleDLButton();
        //toggleIconCheck(this);
      });

    },

    /***** FILTER *****/

    setI18nFiltersButton = function() {
      $('#filterby').html(i18n[lang].button.filter.filterby +
      '&nbsp;&nbsp;&nbsp;<span class="caret"></span>'); //
      $('#filterNew').html('<i class="fa fa-file-o"></i>&nbsp;&nbsp;&nbsp;' + i18n[lang].button
        .filter.new);
      $('#filterDL').html('<i class="fa fa-download"></i>&nbsp;&nbsp;&nbsp;' + i18n[lang].button
        .filter.notDL);
      $('#filterClear').html('<i class="fa fa-times"></i>&nbsp;&nbsp;&nbsp;' + i18n[lang].button
        .filter.clear);
    },

    setEventFiltersButton = function() {

      $('#filterNew').off('click').on('click', function() {
        $('#breadcrumb').html(
          $('#breadcrumb').html() +
          '<li class="active">' + i18n[lang].button.filter.new + '</li>');
        table
          .column(16).search('true')
          //.column(4).search('[^' + username + ']', true, false)
          .draw();
      });

      $('#filterDL').off('click').on('click', function() {
        $('#breadcrumb').html(
          $('#breadcrumb').html() +
          '<li class="active">' + i18n[lang].button.filter.notDL + '</li>');
        table
          .column(16).search('^0$', true, false)
          //.column( 4 ).search( '[^' + username + ']', true, false )
          .draw();
      });

      $('#filterClear').off('click').on('click', function() {
        $('#breadcrumb').html(
          $('#breadcrumb').html() +
          '<li class="active">' + i18n[lang].button.filter.clear + '</li>');
        $('input[name=search]').text('');
        resetFilters();
        table.draw();
      });

    },

    /***** SEARCH *****/

    setI18nSearch = function() {
      $('input[name=search]').attr('placeholder', i18n[lang].button.search);
    },

    setEventSearch = function() {
      $('input[name=search]').on('keyup', function() {
        table.search(this.value).draw();
      });
    },

    setEventReload = function() {
      var reloadBtn = $('.reloadme');
      reloadBtn.html('<i class="fa fa-refresh"></i>&nbsp;&nbsp;&nbsp;' + i18n[lang].button.reload);
      reloadBtn.off('click').on('click', function() {
        window.location = TransferBaseURL + 'transferApp.html';
        //window.location.reload();
      });
    },

    setI18nDatePicker = function() {
      $('.dp-to').text(i18n[lang].datepicker.to);
      $('.dateBegin').attr('placeholder', i18n[lang].datepicker.start);
      $('.dateEnd').attr('placeholder', i18n[lang].datepicker.end);
    },

    setEventDatePicker = function() {

      var db = $('.dateBegin'),
        de = $('.dateEnd');

      db.val('');
      db.on('focus', function() { this.select(); });
      db.on('keyup', function() { setTimeout(table.draw(), 1000); });
      db.on('change', function() { table.draw(); });

      de.val('');
      de.on('focus', function() { this.select(); });
      de.on('keyup', function() { setTimeout(table.draw(), 1000); });
      de.on('change', function() { table.draw(); });

      $('#datepicker')
        .datepicker({
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
    },

    setI18nBreadCrumb = function() {
      setBreadCrumb(i18n[lang].breadrumb);
      //$( '#breadcrumb' ).html( i18n[lang].result + '<li class="active">' + i18n[lang].breadrumb + '</li>' );
    },

    setI18nQuotaWarning = function() {
      $('#warningQuota').html('<p>' + i18n[lang].warningQuota + '</p>');
    },

    setI18nHelpButton = function() {
      var helpBtn = $('#help');
      helpBtn.html('<i class="fa fa-question"></i>&nbsp;&nbsp;&nbsp;' + i18n[lang].button.help);
      helpBtn.off('click').on('click', function() {
        //console.log("test");
        var intro = introJs();
        intro.setOptions({
          steps: [
            {
              intro: i18n[lang].help.welcome
            },
            {
              element: '#tableID',
              intro:   i18n[lang].help.table
            },
            {
              element:  '.iconSelect',
              intro:    i18n[lang].help.checkbox,
              position: 'right'
            },
            {
              element:  '.dlfile',
              intro:    i18n[lang].help.dlfile,
              position: 'right'
            },
            {
              element:  '.dlfileLabel',
              intro:    i18n[lang].help.dlfileLabel,
              position: 'right'
            },
            {
              element:  '.remove',
              intro:    i18n[lang].help.remove,
              position: 'left'
            },
            {
              element:  '.dataTables_scrollHeadInner > table:nth-child(1) > thead:nth-child(1) > tr:nth-child(1)',
              intro:    i18n[lang].help.headers,
              position: 'bottom'
            },
            {
              element:  '.bottom',
              intro:    i18n[lang].help.bottom,
              position: 'left'
            },
            {
              element:  '#btn-upload-div',
              intro:    i18n[lang].help.upload,
              position: 'right'
            },
            {
              element:  'li.level1',
              intro:    i18n[lang].help.menu,
              position: 'right'
            },
            {
              element:  '#upload',
              intro:    i18n[lang].help.uploaded,
              position: 'right'
            },
            {
              element:  '#breadcrumb',
              intro:    i18n[lang].help.breadcrumb,
              position: 'right'
            },
            {
              element:  '#filterby',
              intro:    i18n[lang].help.filterby,
              position: 'left'
            },
            {
              element:  '#searchBox',
              intro:    i18n[lang].help.searchBox,
              position: 'bottom'
            },
            {
              element:  '#datepicker',
              intro:    i18n[lang].help.datepicker,
              position: 'bottom'
            },
            {
              element:  '.reloadme',
              intro:    i18n[lang].help.reloadme,
              position: 'left'
            }, {
              element:  '#toggle-side-menu',
              intro:    i18n[lang].help.columnMenu,
              position: 'left'
            },
            {
              element:  '#signout',
              intro:    i18n[lang].help.logoff,
              position: 'left'
            }
          ]
        });
        intro.setOption('skipLabel', '');
        intro.setOption('nextLabel', ''); //'→');
        intro.setOption('prevLabel', ''); //'←');
        intro.setOption('doneLabel', '');
        /*intro.setOption('showButtons', false);*/
        intro.start();
      });

    },

    setEventPreData = function() {

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
      setEventuploadForm();
    },

    setEventsHTML = function() {

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

    },

    initTableComplete = function() {

      table.clear();

      templateTable();

      oTable = $(TABLEID).dataTable();
      table
        .column(4).search('[^' + username + ']', true, false)
        .draw();

      hideLoading();

      //set upload form events
      $(TABLEID).on('draw.dt', function() {
        setEventCheckBox();
        setEventDeleteFile();

      });

      setEventsHTML();

      if (Utils.getUrlParameter('upload') === 'upload') {
        $('#upload').find('a').trigger('click');
      }

      setTimeout(function() {

        setI18nQuotaWarning();

        if (AjaxData.length === 0) {
          $('#btn-upload-div').trigger('click');
          console.log('>>> NO files');
        }

      }, 1000);
    },

    /****************************************************
     * MAIN
     * */
    render = function() {
      showLoading();
      setEventPreData();

      //console.log(tokenPortal);

      $.when(portalCnx()).then(function() {

        $.when(loadCategory(), loadData(), loadFolder()).then(function() {

          //Add label for reference of Document
          $.when(mergeLabelDoc()).done(function() {

            //Template of Table and Menu
            createDataTable();
            createMenu();

          });
        });
      });

    },

    portalCnx = function() {

      var url = TransferServerURL + 'login/portal/';
      if (tokenPortal) {

        return $.ajax({
          type:       'POST',
          url:        url,
          data:       {tokenPortal: tokenPortal},
          success:    function(data) {
            //console.log("data = ", data);
            tokenTransfer = data ? data.token : '';
            sessionStorage.setItem('tokenTransfer', tokenTransfer);
            /* set token for FTP*/
          },
          error:      function() {
            hideLoading();
            Utils.errorMessage(i18n[lang].error0, 4000);
            AjaxData = [];
          },
          dataType:   'json',
          statusCode: {
            403: function() {
              hideLoading();
              Utils.errorMessage(i18n[lang].errorSession, 4000);
              setTimeout(function() {
                window.location = TransferBaseURL;
              }, 4000);
            }
          }
        });
      }
    },

    main = function() {

      Utils.setTransferURL();
      TransferServerURL = sessionStorage.getItem('TransferServerURL'),
        TransferBaseURL = sessionStorage.getItem('TransferBaseURL'),
        lang = sessionStorage.getItem('lang') || localStorage.lastLanguage,
        TABLEID = '#tableID',
        table = {}, //DataTable object
        oTable = {}, //Jquery Data object
        i18n = {}, // Language
        AjaxData = [], // Data
        category = [], // Data
        refDocUsed = [], // Data
        numberCol = 18,
        username = sessionStorage.getItem('username') ? sessionStorage.getItem('username').toLowerCase() : '',
        tokenTransfer = sessionStorage.getItem('tokenTransfer'),
        tokenPortal = sessionStorage.getItem('token');

      $('[rel="tooltip"]').tooltip();

      //$('.user-name').html(username.toUpperCase());
      $('.username').find('span').html(username.toUpperCase());

      // LOGOUT
      $('#signout').off('click').on('click', signOut);

      //i18n
      $.getJSON('data/i18n.json', function(data) {
        i18n = data;

        //Default Language
        if ((lang !== 'en') && (lang !== 'fr') && (lang !== 'nl')) {
          if (sessionStorage.getItem('country') === 'FR') {
            lang = 'fr';
          }
          else {
            lang = 'en';
          }
        }

        if (lang !== 'en') {
          $.getScript(i18n[lang].url.datepicker);
        }

        if (i18n[lang]) { // if language is set,
          //Add client Select2
          var option = document.createElement('option'),
            s2 = document.getElementById('clients');
          option.text = i18n[lang].button.client;
          option.value = ' ';
          s2.add(option, s2[0]);
          option.selected = true;
          $('#clients').select2();
          // load data and create table
          render();
        } else {

          Utils.errorMessage('ERROR loading language data', 4000);
          window.location = TransferBaseURL;
        }
      });
    };

  //TODO: replace by module design pattern
  $('document').ready(main());

  return {
    signOut:            signOut,
    getFilesID:         getFilesID,
    getSelectedRows:    getSelectedRows,
    setBreadCrumb:      setBreadCrumb,
    createMenu:         createMenu,
    createTable:        createDataTable,
    menuRootClick:      menuRootClick,
    menuCategoryClick:  menuCategoryClick,
    menuOtherClick:     menuOtherClick,
    menuRefDocClick:    menuRefDocClick,
    toggleDLButton:     toggleDLButton,
    toggleAllIconCheck: toggleAllIconCheck,
    updateMenuVisibleColumnList: updateMenuVisibleColumnList,
    showLoading:        showLoading,
    hideLoading:        hideLoading
  };

}(_, moment, introJs, swal, Utils));

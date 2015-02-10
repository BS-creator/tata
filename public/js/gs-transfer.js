// jscs:disable requireMultipleVarDecl
//---------------------------------------------
//SUPPORT FOR PWLIB TOKEN ADDED STRAIGHT INTO JQUERY

var $ajax = $.ajax;
$.ajax = function(params) {
  params.headers = params.headers || {};
  params.headers['Authorization'] = 'Groups groups_token=' + sessionStorage.token || '00';
  return $ajax.apply($, arguments);
};
//---------------------------------------------

/**
 * Created by bisconti on 29/08/14.
 */
/*globals $, _, moment, introJs, swal, console, Utils */
var gsTransfer = (function(_, moment, introJs, swal, Utils) {
  'use strict';

  _.templateSettings = {
    interpolate: /\[\[([\s\S]+?)\]\]/g,
    //evaluate:/\[\[-([\s\S]+?)\]\]/g,
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
    numberCol = 19, //number of column in the table
    username = sessionStorage.getItem('username') ? sessionStorage.getItem('username').toLowerCase() : '',
    tokenTransfer = sessionStorage.getItem('tokenTransfer'),
    tokenPortal = sessionStorage.getItem('token'),
    clientList = [], //list of all FTP account in e_adresse (used by GMS)
    isCabinet = false,
    cabinetID = 0,
    cabinetEmail = '',
    GMSEmail = '',
    isClientOfCabinet = false,
    ClientCabinetList = [],
    FTPClientCabinetList = [],
    selectMenu = 'ROOT',

    /*** HELPER ***/
    isGMS = function() {
      //@devcode
      //if (username && username.toUpperCase() === 'GMSTEST') return false;

      return (username && username.toUpperCase().indexOf('GMS') === 0);
    },

    isNormalClient = function() {
      return !(isGMS() || isAccountingCabinet() || isClientOfAccountingCabinet());
    },

    isAccountingCabinet = function() {
      return isCabinet;
    },

    isClientOfAccountingCabinet = function() {
      return isClientOfCabinet;
    },

    isFrance = function() {
      return (localStorage.country === 'FR' ||
      sessionStorage.country === 'FR' ||
      _.contains(window.location.hostname, '.groupsfrance'));
    },

    getClientName = function() {
      /*var $client = $('input[name="clientName"]');
       return ($client.val() === username) ? false : $client.val();*/
      return $('input[name="clientName"]').val();
    },

    getContactEmail = function() {
      return $('#emailContact').html();
    },

    getEmailGMS = function() {
      return GMSEmail;
    },

    getPDFjsURL = function(serverURL, tokenTransfer, fileID, filename) {
      return TransferBaseURL + '../cdn/pdfjs/1.0.907/web/viewer.html?file=' + serverURL + 'file/' + tokenTransfer + '/' + fileID + '/' + filename;
    },

    getEmployerFromLogin = function() {
      //@devcode
      //if (username.toUpperCase() === 'D00000001') return 192900;//220300; //182800; // id client of CC
      //if (username.toUpperCase() === 'GMSTEST') return 990800;

      if (username && username.length === 9) {
        return username.substring(1, 7);
      } else {
        return '0';
      }
    },

    redirectToLogin = function() {

      if (_.contains(TransferBaseURL, 'online.') || (sessionStorage.token && sessionStorage.user)) {
        window.location = TransferBaseURL.replace(/transfer\/.*$/i, 'portal/');
      } else {
        window.location = TransferBaseURL;
      }

    },

    getUsedDocRef = function(data) {
      var a = [];
      _.forEach(data, function(item) {
        var ref = parseInt(item.referenceDocument);
        if (!isNaN(ref) && username !== item.uploadUserName) {
          a.push(ref);
        } else {
          a.push(-1);
        }
      });
      return _.uniq(a);
    },

    mergeLabelDoc = function() {
      var dfd = new $.Deferred();

      _.forEach(category, function(cat) {
        _.forEach(AjaxData, function(row) {
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
    },

    getFilesID = function() {
      var array = getSelectedRows(),
        listID = '',
        it = null,
        countFile = 0;

      _.forEach(array, function(item) {
        if (item[1].display) it = $(item[1].display);
        else it = $(item[1]);
        listID += it.data('file-id') + '&' + it.data('filename') + '@!';
        countFile++;
      });

      return {
        countFile: countFile,
        data:      {
          token:      tokenTransfer,
          fileID:     listID,
          clientName: getClientName()
        }
      };
    },

    setCursorToAuto = function() {
      $('body').css('cursor', 'auto');
      $('.sweet-alert button').css('cursor', 'auto');
    },

    setCursorToProgress = function() {
      $('body').css('cursor', 'progress');
      $('.sweet-alert button').css('cursor', 'progress');
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
    },
    formatPath = function(value) {
      return value.replace('/data/' + username + '/', '');
    },
    formatFileName = function(value) {
      var v = (value ? value.substring(0, 3) : value);
      if (v === 'PPP' || v === 'GAR' || v === 'GES' || v === 'GAD') {
        return value.substring(3);
      }
      return value;
    },
    getSelectedRows = function() {
      return table.rows('.active', {search: 'applied'}).data();
    },

    reloadPage = function() {
      //console.log('selectMenu = ' + selectMenu);
      if (isGMS() || isAccountingCabinet()) {
        loadClientFiles(getClientName());
      } else {
        reloadNewData();
      }
      //console.log('reloadPage' + new Date());
      /*.then(function() {
       if (selectMenu === 'ROOT') {$('#root').trigger('click');}
       else if (selectMenu === 'UPLOAD') {$('#upload').find('a').trigger('click');}
       else if (selectMenu === 'VALIDATION') {$('#validation').find('a').trigger('click');}
       else if (selectMenu === 'PPP') {$('#PPP').trigger('click');}
       else if (selectMenu === 'GES') {$('#GES').trigger('click');}
       else if (selectMenu === 'GAR') {$('#GAR').trigger('click');}
       else if (selectMenu === 'GAD') {$('#GAD').trigger('click');}
       });*/
    },

    reloadNewData = function(data) {

      // hide
      $('.modal-select2-open').removeClass('modal-select2-open').addClass('modal-select2');

      //destroy dt
      table.destroy();
      //TODO: load data client if it is connected to a client!!

      loadData().then(function() {
        //add new files from clients.
        AjaxData = (data && data.target) ? AjaxData : (data || AjaxData);

        $.when(mergeLabelDoc())
          .then(function() {
            //RESOLVED
            createDataTable();
            createMenu();
            setEventGMS();
          }, function() {
            //REJECT
            console.log('>>>>> ERR: FAILED');
          }
        );
      });
    },

    /****************************************************
     * DOWNLOAD (ZIP)
     * */

    addLowerButton = function() {
      var multidl = $('.multiDL');
      multidl.html('');
      /***** DOWNLOAD BUTTON *****/
      multidl.append(
        '<button class="btn-portal-green downloadall mt-xs">' +
        '<i class="fa fa-download"></i>&nbsp;&nbsp;&nbsp;' +
        i18n[lang].button.multiDL +
        '</button>'
      );
      $('.downloadall').off('click').on('click', downloadAll);

      /***** VALIDATION BUTTON *****/
      multidl.append(
        '<button class="btn-portal-green validAll mt-xs pull-right">' +
        '<i class="fa fa-check"></i>&nbsp;&nbsp;&nbsp;' +
        i18n[lang].button.validation +
        '</button>'
      );
      $('.validAll').off('click').on('click', function() {
        swal({
            title:              i18n[lang].dialog.validAction,
            text:               i18n[lang].dialog.validSure,
            type:               'warning',
            showCancelButton:   true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText:  i18n[lang].dialog.validConfirm,
            cancelButtonText:   i18n[lang].dialog.cancel,
            closeOnConfirm:     false
          },
          function() {
            validateAll();
          });
      });

      /***** DELETE BUTTON *****/
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

      if (filename && (Utils.endsWith(filename, '.PDF') || Utils.endsWith(filename, '.pdf'))) {
        url = getPDFjsURL(TransferServerURL, tokenTransfer, fileID, filename);
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
      _.forEach($(TABLEID).find('.active'), function(row) {
        incrementCounter($(row).find('a').first());
      });
    },

    resetCheckBox = function() {

      _.forEach($(TABLEID).find('.active'), function(line) {
        $(line)
          .removeClass('active')
          .find('i.fa-check-square-o')
          .toggleClass('fa-square-o fa-check-square-o');
      });
    },

    downloadAll = function() {

      var params = getFilesID(),
        fileID,
        filename,
        form;

      if (params.countFile === 0) {
        Utils.errorMessage(i18n[lang].file.noselect, 3000);

      } else if (params.countFile === 1) {
        fileID = params.data.fileID.slice(0, params.data.fileID.indexOf('&'));
        filename = params.data.fileID.slice(
          params.data.fileID.indexOf('&') + 1,
          params.data.fileID.indexOf('@'));

        window.location.href = TransferServerURL + 'file/' + tokenTransfer + '/' + fileID + '/' + filename;

        incrementAllSelectedRows();

      } else {

        $('#multiDownloadForm').remove();
        form = $('<form id="multiDownloadForm" method="POST" action="' + TransferServerURL + 'file/zip">');

        _.forEach(params.data, function(v, k) {
          form.append($('<input type="hidden" name="' + k +
          '" value="' + v + '">'));
        });

        $('body').append(form);

        Utils.smessage(i18n[lang].file.dl, '', 'warning', (params.countFile * 1200));
        // about 1,2 seconds per files (õ_ó) .... it's a good guess, what a shame... (╯_╰”)

        incrementAllSelectedRows();
        resetCheckBox();

        form.submit();
      }
    },

    /****************************************************
     * UPLOAD
     * */

    setEventuploadForm = function() {
      // set token for upload
      var $uploadform = $('#uploadForm'),
        activeUploads = null,
        notif;
      $('input[name="token"]').val(tokenTransfer);

      $uploadform.attr('action', TransferServerURL + 'file/upload');

      if (isFrance()) {
        notif = $('input[name="notification"]')[0];
        notif.style.display = 'inline-block';
        notif.checked = true;

        if (isGMS()) {
          $('#notification').text(i18n[lang].notification);
        } else if (isAccountingCabinet()) {
          $('#notification').text(i18n[lang].notificationGMS);
        } else if (isClientOfAccountingCabinet()) {
          $('#notification').text(i18n[lang].notificationCC);
          $('input[name="email"]').val(loadEmailCabinet());
        } else if (isNormalClient()) {
          $('#notification').text(i18n[lang].notificationGMS);
          $('input[name="clientName"]').val(username);
          $('input[name="email"]').val(getEmailGMS());
        }

      }

      $uploadform.fileupload({

        limitMultiFileUploads: 10,
        //autoUpload: false,

        progressall: function(e, data) {
          var progress = parseInt(data.loaded / data.total * 100, 10);
          $('#progress').find('.progress-bar').css('width', progress + '%');
        },
        add:         function(e, data) {
          //TODO: add it to the list and create 'UPLOAD' button
          /*var $uploadList = $('#uploadList');
           _.forEach(data.files, function(file) {
           $uploadList.append('<li>' + file.name + '</li>');
           });*/
          data.submit()
            .error(function(jqXHR) {
              Utils.errorMessage('Error... ' + jqXHR.statusText, 4000);
            })
            .success(function() {
              activeUploads = $uploadform.fileupload('active');
              //console.log( "activeUploads = ", activeUploads );
            });
        },
        start:       function() { $('#progress').show(); },
        done:        function() {
          activeUploads = $uploadform.fileupload('active');
          if (activeUploads < 2) {
            $('#progress').hide();
            $('.close').click();
            Utils.smessage('OK', ' ', 'success', 4000);
            if ($('input[name="notification"]').prop('checked')) {
              postNotification()
                .then(function() {
                  console.log('notification sent');
                  selectMenu = 'UPLOAD';
                });
            } else {
              selectMenu = 'UPLOAD';
              reloadPage();
            }
            //setTimeout(function() { window.location = TransferBaseURL + 'transferApp.html?upload'; }, 4000);
          }
        }
      });
    },

    listFolderUpload = function(destFolders) {
      var listFolder = $('#uploadForm').find('div.dir-list'), key;
      for (key in destFolders) {
        if (destFolders[key]) {
          listFolder.append(
            '<label class="radio"><input name="destFolder" value="' +
            destFolders[key] + '" type="radio" ' +
            ((destFolders[key] === 'Presta') ? 'checked' : '') + ' />' +
            destFolders[key] + '/</label>'
          );
        }
      }
    },

    listFolderUploadFR = function() {
      var listFolder = $('#uploadForm').find('div.dir-list');
      listFolder.html('');
      _.forEach(i18n[lang].dirlist, function(v, k) {
        listFolder.append('<label class="radio"><input name="destFolder" value="' + k + '" type="radio" />' +
        v + '</label>');
      });
      listFolder.find('label:first-of-type > input[name="destFolder"]')[0].checked = true;
      $('.radio').find('input').off('click').on('click', function() {selectMenu = this.value;});
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
        $('#breadcrumb').html(i18n[lang].result + '<li class="active noclick">' + text + '</li>');
      } else {
        console.log('error Setting BreadCrumb.');
      }
    },

    menuRootClick = function(event) {

      $('#upload').removeClass('active');
      $('#validation').removeClass('active');
      resetFilters();
      table.columns('.categoryFrance').visible(false, false);
      table.columns('.detailsLayer').visible(false, false);
      table.columns('.validation').visible(false, false);
      table.columns('.fileLayer').visible(true, false);
      // adjust column sizing and redraw
      table.columns.adjust().draw(false);
      //filter on uploadUserName
      table.column(4).search('[^' + username + ']', true, false).draw();
      setBreadCrumb(i18n[lang].tree.root);
      updateMenuVisibleColumnList();
      selectMenu = 'ROOT';
      event.preventDefault();
    },

    menuOtherClick = function(event) {

      $('#upload').removeClass('active');
      $('#validation').removeClass('active');
      resetFilters();
      table.columns('.categoryFrance').visible(false, false);
      table.columns('.fileLayer').visible(false, false);
      table.columns('.validation').visible(false, false);
      table.columns('.detailsLayer').visible(true, false);
      table.columns.adjust().draw(false); // adjust column sizing and redraw
      table
        .column(4).search('[^' + username + ']', true, false)
        .column(7).search('^\\s*$', true, false)
        .draw(); //filter on uploadUserName != username
      $('[class^=level] .active').removeClass('active');
      setBreadCrumb(i18n[lang].tree.other);
      updateMenuVisibleColumnList();
      selectMenu = 'OTHER';
      event.preventDefault();
    },

    menuUploadClick = function(event) {

      $('#root').parent('li.level1').removeClass('active');
      $('#upload').addClass('active');
      $('#validation').removeClass('active');
      resetFilters();
      table.columns('.categoryFrance').visible(false, false);
      table.columns('.fileLayer').visible(false, false);
      table.columns('.validation').visible(false, false);
      table.columns('.detailsLayer').visible(true, false);
      table.columns.adjust().draw(false); // adjust column sizing and redraw
      table.column(4).search(username).draw(); //filter on uploadUserName
      $('[class^=level] .active').removeClass('active');
      setBreadCrumb(i18n[lang].tree.upload);
      updateMenuVisibleColumnList();
      selectMenu = 'UPLOAD';
      event.preventDefault();
    },

    menuCategoryClick = function(event) {

      $('#upload').removeClass('active');
      $('#validation').removeClass('active');
      resetFilters();
      table.columns('.categoryFrance').visible(false, false);
      table.columns('.detailsLayer').visible(false, false);
      table.columns('.validation').visible(false, false);
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
      selectMenu = 'ROOT';
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
      $('#validation').removeClass('active');
      $('#upload').removeClass('active');

      if (nodeID > -1 && $this.hasClass('level3')) {
        //clear filters
        table
          .search('')
          .columns().search('');
        table.columns('.categoryFrance').visible(false, false);
        table.columns('.detailsLayer').visible(false, false);
        table.columns('.fileLayer').visible(true, false);
        table.columns('.validation').visible(false, false);
        table.columns.adjust().draw(false); // adjust column sizing and redraw
        table
          .column(4).search('[^' + username + ']', true, false)
          .column(7).search('^' + nodeID + '$', true, false)
          .draw(); //filter on referenceDocument
      }
      updateMenuVisibleColumnList();
      selectMenu = 'ROOT';
      event.preventDefault();
    },

    menuValidateClick = function(event) {
      $('#root').parent('li.level1').removeClass('active');
      $('#upload').removeClass('active');
      $('#validation').addClass('active');
      resetFilters();
      table.columns('.detailsLayer').visible(false, false);
      table.columns('.fileLayer').visible(true, false);
      table.columns('.validation').visible(true, false);
      table.columns.adjust().draw(false); // adjust column sizing and redraw
      table.column(10).search('Validation\/', true, false).draw(); //filter on Validation Folder
      $('[class^=level] .active').removeClass('active');
      setBreadCrumb(i18n[lang].tree.valid);
      updateMenuVisibleColumnList();
      selectMenu = 'ROOT';
      event.preventDefault();
    },

    templateMenu = function(menu) {

      var htmlLeafNode = '',
        htmlCategoryNode = '',
        currentCat = '',
        currentCatLabel = '',
        createLeafNode = _.template($('#menuL3').html()),
        createCategoryNode = _.template($('#menuL2').html());

      _.forEach(menu, function(catArray) {
        _.forEach(catArray, function(item) {

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
        allDocs:        i18n[lang].tree.root,
        uploadText:     i18n[lang].tree.upload,
        validationText: i18n[lang].tree.valid,
        categoryNode:   htmlCategoryNode
      });
    },

    filterMenu = function() {
      refDocUsed = getUsedDocRef(AjaxData);
      return _.groupBy(_.filter(category, function(obj) {
        if (_.contains(refDocUsed, parseInt(obj.referenceDocument))) { return obj; }
      }), function(obj) {
        return obj.categoryNumber;
      });
    },

    templateMenuFR = function(menu) {

      var htmlLeafNode = '',
        htmlCategoryNode = '',
        currentCat = '',
        currentCatLabel = '',
        createLeafNode = _.template($('#menuL3').html()),
        createCategoryNode = _.template($('#menuL2').html()),
        catPPP = '', catGAR = '', catGAD = '';

      _.forEach(menu, function(catArray) {
        _.forEach(catArray, function(item) {

          htmlLeafNode += createLeafNode({
            referenceDocument: parseInt(item.referenceDocument),
            typeDocument:      labelDocI18n(item)
          });
          currentCat = parseInt(item.categoryNumber);
          currentCatLabel = labelCati18n(item);
        });
        //Put the category in the right French Category
        if (_.contains([0, 1, 3, 4, 5, 6, 7], currentCat)) {
          catPPP += createCategoryNode({
            categoryNumber: currentCat,
            categoryName:   currentCatLabel,
            leafNode:       htmlLeafNode
          });
        } else if (currentCat === 8) {
          catGAR = createCategoryNode({
            categoryNumber: currentCat,
            categoryName:   currentCatLabel,
            leafNode:       htmlLeafNode
          });
        } else if (currentCat === 2) {
          catGAD = createCategoryNode({
            categoryNumber: currentCat,
            categoryName:   currentCatLabel,
            leafNode:       htmlLeafNode
          });
        }
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

      return _.template($('#menuFR').html())({
        allDocs:        i18n[lang].tree.root,
        uploadText:     i18n[lang].tree.upload,
        validationText: i18n[lang].tree.valid,
        catPPP:         catPPP,
        catGAR:         catGAR,
        catGAD:         catGAD,
        categoryNode:   htmlCategoryNode
      });
    },

  /*    filterMenuCatFR = function() {
   refDocUsed = getUsedDocRef(AjaxData);
   var cat = {},
   i,
   group = _.groupBy(_.filter(category, function(obj) {
   if (_.contains(refDocUsed, parseInt(obj.referenceDocument))) { return obj; }
   }), function(obj) {
   return obj.categoryNumber;
   });

   for (i in group) {
   if (i === '0') {cat.PPP = $.extend({}, cat.PPP, {0: group[i]})}
   else if (i === '1') {cat.GAD = {1: group[i]} }
   else if (i === '2') {cat.PPP = $.extend({}, cat.PPP, {2: group[i]})}
   else if (i === '3') {cat.PPP = $.extend({}, cat.PPP, {3: group[i]})}
   else if (i === '4') {cat.PPP = $.extend({}, cat.PPP, {4: group[i]})}
   else if (i === '5') {cat.PPP = $.extend({}, cat.PPP, {5: group[i]})}
   else if (i === '6') {cat.PPP = $.extend({}, cat.PPP, {6: group[i]})}
   else if (i === '7') {cat.PPP = $.extend({}, cat.PPP, {7: group[i]})}
   else if (i === '8') {cat.GAR = {8: group[i]}}
   }
   console.log('cat', cat);
   return cat;
   },*/

    createMenu = function createMenu() {
      if (isFrance()) {
        console.log('>>> FRANCE');
        $('#sidenav').html(templateMenuFR(filterMenu()));
      } else {
        $('#sidenav').html(templateMenu(filterMenu()));
      }
    },

    /****************************************************
     * MENU COLUMN VISIBLE
     * */

    updateMenuVisibleColumnList = function updateMenuVisibleColumnList() {
      var exclude = [0, 1, 15, 16, 17, 18, 19],
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

      var tpl = _.template($('#bodytpl').html());

      _.forEach(AjaxData, function(row) {

        row.classNew = row.isNew ? 'isNew' : 'notNew';

        row.downloadCount = parseInt(row.downloadCount);
        if (isNaN(row.downloadCount)) {
          row.downloadCount = -1;
        }

        row.alreadyDL = row.downloadCount > 0 ? 'text-muted' : 'text-primary';

        row.strippedPath = formatPath(row.path);

        row.fileNameFormatted = formatFileName(row.fileName);

        //row.label = formatFileName(row.label);

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
            className:  'detailsLayer categoryFrance',
            targets:    3, // fileName
            visible:    false,
            searchable: true
          },
          {
            className:  'detailsLayer categoryFrance',
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
            //className:  'detailsLayer validation', // don't show path (too big on screen)
            targets:    10, //path
            visible:    false,
            searchable: true
          },
          {
            className:  'defaultView',
            targets:    11 //referenceClient
            //visible:    true,
            //searchable: true
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
            className:  'validation categoryFrance',
            targets:    14, //uploadStamp
            visible:    false,
            searchable: true
          },
          {
            className:  'defaultView',
            targets:    15, // remove
            searchable: false,
            orderable:  false
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
            searchable: false,
            orderable:  false
          },
          {
            targets:    19, //filename
            visible:    false,
            searchable: true
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
            data:     {token: tokenTransfer},
            complete: function() {
              sessionStorage.clear();
              redirectToLogin();
            }
          });
        });
    },

    deleteFile = function(fileID, cell) {
      //The FTP can delete a file by its path or by its ID (same method on backend)
      //So it works if the fileID is in the filePath

      setCursorToProgress();
      return $.ajax({
        type:     'DELETE',
        url:      TransferServerURL + 'file/',
        data:     {
          token:  tokenTransfer,
          fileID: fileID
        },
        success:  function() {
          Utils.smessage(i18n[lang].file.del, '', 'success', 2000);

          table
            .row(cell.closest('tr'))
            .remove()
            .draw();
          reloadPage();
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
          reloadPage();
          //setTimeout(function() { window.location.reload(); }, 2000);
          resetCheckBox();
        },
        error:    function() {
          Utils.errorMessage(i18n[lang].error5xx, 5000);
        },
        complete: function() {
          setCursorToAuto();
        }
      });
    },

    validateFile = function(fileName, cell) {
      setCursorToProgress();
      return $.ajax({
        type:     'POST',
        url:      TransferServerURL + 'file/valid',
        data:     {
          token:      tokenTransfer,
          fileName:   fileName,
          clientName: getClientName()
        },
        success:  function(data) {
          if (data) {
            Utils.smessage(i18n[lang].file.valid, '', 'success', 2000);
            table.row(cell.closest('tr'))
              .remove()
              .draw();
          } else {
            setCursorToAuto();
          }
        },
        complete: function() {
          setCursorToAuto();
        }
      });
    },

    validateAll = function() {
      setCursorToProgress();

      return $.ajax({
        type:     'POST',
        url:      TransferServerURL + 'file/multi',
        data:     getFilesID().data,
        success:  function() {
          Utils.smessage(i18n[lang].file.valid, '', 'success', 2000);
          postNotification(true);
          reloadPage();
          //setTimeout(function() { window.location = TransferBaseURL + 'transferApp.html?validation'; }, 2000);
        },
        error:    function() {
          Utils.errorMessage(i18n[lang].errorValid, 5000);
        },
        complete: function() {
          setCursorToAuto();
        }
      });
    },

    postNotification = function(skipRedirect) {
      setCursorToProgress();

      var params = {
        token:      tokenTransfer,
        clientName: getClientName(),
        lang:       lang
      };

      return $.ajax({
        type:     'POST',
        url:      TransferServerURL + 'notification/',
        data:     params,
        success:  function() {
          //Utils.smessage(i18n[lang].file.XXX, '', 'success', 2000);
          if (skipRedirect) {return;}
          reloadPage();
          //setTimeout(function() { window.location = TransferBaseURL + 'transferApp.html?upload'; }, 2000);
        },
        error:    function(jqXHR) {
          var error = JSON.parse(jqXHR.responseText);
          if (error.code === '2') {
            Utils.errorMessage(i18n[lang].noNotifMail, 5000);
          } else {
            Utils.errorMessage(i18n[lang].noNotif, 5000);
          }
        },
        complete: function() {
          setCursorToAuto();
        }
      });
    },
    /***
     * Retrieve the file list of another user
     * ***/
    loadClientFiles = function(clientName) {
      showLoading();
      if (isFrance() && (isGMS() || isAccountingCabinet())) {
        return $.ajax({
          type:       'POST',
          url:        TransferServerURL + 'file/list/',
          data:       {
            token:      tokenTransfer,
            clientName: clientName
          },
          success:    reloadNewData,
          error:      function(err) {
            console.log('>>>>> ERR:', JSON.stringify(err));
          },
          statusCode: {
            403: function() {
              console.log('ERROR: loading client files');
              hideLoading();
              Utils.errorMessage(i18n[lang].errorCnx, 4000);
            }
          }
        });
      } else {
        //Not a GMS, pass...
        return $.Deferred().resolve();
      }
    },

    buildClientListForSelect2 = function(data) {

      // on first call, show a modal to the user
      var openModal = clientList.length === 0;

      // add itself as a client
      if (isAccountingCabinet()) { //|| isGMS()
        clientList.push({id: username, text: i18n[lang].myOwnAccount, email: ''});
      }

      // add the real clients
      _.forEach(data, function(i) {
        clientList.push({
          id:    i.clientLogin,
          text:  i['label' + lang.charAt(0).toUpperCase()],
          email: i.email
        });
      });

      // @devcode
      if (username && username.toUpperCase() === 'GMSTEST') {
        clientList.push({id: 'D00000001', text: 'D00000001', email: ''});
      }

      // on first call, show a modal to the user (follow-up)
      if (openModal) {
        setTimeout(function() {
          $('#clients').select2('open');
          $('.modal-select2').removeClass('modal-select2').addClass('modal-select2-open');
        }, 1000);
      }
    },

    /**
     * Load the list of client login for the GMS user or a cabinet */
    loadClients = function() {

      // prevent the user from interacting while we load clients
      $('.modal-select2').removeClass('modal-select2').addClass('modal-select2-open');

      // check which clients we need to load
      if (isGMS()) {
        console.log('>>>>> load all Clients');
        return $.ajax({
          type:    'POST',
          url:     TransferServerURL + 'client/',
          data:    {token: tokenTransfer},
          success: buildClientListForSelect2,
          error:   function(err) {
            console.log('No Clients: ' + JSON.stringify(err));
          }
        });
      } else if (isAccountingCabinet()) {
        console.log('>>>>> load all Accounting Clients');
        return $.ajax({
          type:    'GET',
          url:     TransferServerURL + 'cabinet/ftpclient/' + getEmployerFromLogin(),
          /* data:    {token: tokenTransfer},*/
          success: buildClientListForSelect2,
          error:   function(err) {
            console.log('No Clients: ' + JSON.stringify(err));
          }
        });
      } else {
        //Not a GMS, not a cabinet, pass...
        return $.Deferred().resolve();
      }
    },

    /**
     *
     *  list of folder to upload files to.
     *  */
    loadFolder = function() {

      if (isFrance()) {
        listFolderUploadFR();
        return $.Deferred().resolve();
      } else {
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
      }
    },

  // Category of type of document in central db
    loadCategory = function() {
      var service = 'category/' + isFrance();
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

    /***
     * list files on the server FTP.
     */

    loadData = function() {

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
            Utils.errorMessage(i18n[lang].errorCnx, 4000);
            setTimeout(function() {
              redirectToLogin();
            }, 4000);
          }
        }
      });
    },
    /***
     *  Is the user connected an Accounting Cabinet
     */

    loadIsAccountingCabinet = function() {
      return $.ajax({
        type:    'GET',
        url:     TransferServerURL + 'cabinet/' + getEmployerFromLogin(),
        success: function(data) {
          console.log('loadIsAccountingCabinet = ', data);
          isCabinet = (data && parseInt(data) > 0);
        },
        error:   function() {
          console.log('error loading accounting cabinet information');
          Utils.errorMessage(i18n[lang].errorCnx, 4000);
        }
      });
    },

    /***
     *  Is the user connected a client of an Accounting Cabinet
     */
    loadIsClientOfAccountingCabinet = function() {
      return $.ajax({
        type:    'GET',
        url:     TransferServerURL + 'cabinet/client/' + getEmployerFromLogin(),
        success: function(data) {
          console.log('loadIsClientOfAccountingCabinet = ', data);
          isClientOfCabinet = (data && data[0]);
          cabinetID = (data ? data[0] : 0);
        },
        error:   function() {
          console.log('error loading accounting cabinet information');
          Utils.errorMessage(i18n[lang].errorCnx, 4000);
        }
      });
    },

    /***
     * Get email of the cabinet
     * */
    loadEmailCabinet = function() {
      return $.ajax({
        type:       'GET',
        url:        TransferServerURL + 'cabinet/contact/' + getEmployerFromLogin(),
        success:    function(data) {
          console.log('getEmailCabinet = ', data);
          var params = {};

          if (data && data.length > 0) {
            cabinetEmail = data[0];
            params = {
              role:  'Cabinet Comptable', bureau: '', rue: '',
              num:   '', cp: '', ville: '',
              phone: '-',
              fax:   '-',
              email: cabinetEmail,
              name:  '-'
            };
            $('#mycontacttmpdiv').html(_.template($('#mycontacttmp').html(), params));
          } else {
            console.log('getEmailCabinet = No data found');
          }
        },
        error:      function() {
          hideLoading();
          console.log('error loading data');
          Utils.errorMessage(i18n[lang].errorCnx, 4000);

        },
        dataType:   'json',
        statusCode: {
          403: function() {
            hideLoading();
            Utils.errorMessage(i18n[lang].errorCnx, 4000);
            setTimeout(function() {
              redirectToLogin();
            }, 4000);
          }
        }
      });
    },

    /***
     * Get email of the GMS
     * */
    loadEmailGMS = function() {
      return $.ajax({
        type:       'GET',
        url:        TransferServerURL + 'gms/' + getEmployerFromLogin(),
        success:    function(data) {
          console.log('getEmailGMS = ', data);
          var params, d;
          if (data && data[0]) {
            d = data[0];
            GMSEmail = d.emailGMS;
            params = {
              role:  'Gestionnaire', bureau: '-', rue: '-',
              num:   '-', cp: '-', ville: '-',
              phone: d.phone || '-',
              fax:   '-',
              email: d.emailGMS,
              name:  d.agentName
            };
            $('#mycontacttmpdiv').html(_.template($('#mycontacttmp').html(), params));
          }
        },
        error:      function() {
          hideLoading();
          console.log('error loading data');
          Utils.errorMessage(i18n[lang].errorCnx, 4000);

        },
        dataType:   'json',
        statusCode: {
          403: function() {
            hideLoading();
            Utils.errorMessage(i18n[lang].errorCnx, 4000);
            setTimeout(function() {
              redirectToLogin();
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

    setEventGMS = function() {
      if (isGMS() || isAccountingCabinet()) {
        var $validation = $('#validation'),
          $selectClients = $('#clients');

        if (isGMS()) { // Validation is for GMS only !!!
          $validation.show();
          $validation.find('a').off('click').on('click', menuValidateClick);
        }

        $selectClients.show();
        $selectClients.select2('destroy');

        if (clientList.length < 1) {
          Utils.errorMessage(i18n[lang].clientListEmpty, 3000);
          return;
        }
        $selectClients.select2({
          placeholder: i18n[lang].button.client,
          allowClear:  true,
          data:        clientList
        }).off('select2-selecting').on('select2-selecting', function(e) {
          sessionStorage.lastClient = e.val;
          /** Set contact information of the select user!!! **/
          $('input[name="clientName"]').val(e.val);
          $('input[name="email"]').val(e.object.email);
          $('#modalh4').html('<i class="fa fa-2x fa-upload"></i>&nbsp;&nbsp;' +
          i18n[lang].modalupload + ' à <span class="clientDest">' + e.choice.text + '</span>');

          loadClientFiles(e.val)
            .then(function() {
              // doesn't work
              //setTimeout($('#validation').find('a').trigger('click'), 0);
            });
        }).off('select2-removed').on('select2-removed', function() {
          sessionStorage.lastClient = username;
          /** When removed, reset everything to contact the GMS of the current user!!! **/
          $('input[name="clientName"]').val(username);
          $('input[name="email"]').val(getContactEmail());
          $('#modalh4').html('<i class="fa fa-2x fa-upload"></i>&nbsp;&nbsp;' + i18n[lang].modalupload + '</span>');

          loadClientFiles(username);
        });
      }
    },

    filterCategoryFR = function(filter) {
      $('#upload').removeClass('active');
      $('#validation').removeClass('active');
      resetFilters();
      table.columns('.fileLayer').visible(false, false);
      table.columns('.detailsLayer').visible(false, false);
      table.columns('.validation').visible(false, false);
      table.columns('.categoryFrance').visible(true, false);

      // adjust column sizing and redraw
      table.columns.adjust().draw(false);
      //filter on uploadUserName
      table
        .column(4).search('[^' + username + ']', true, false)
        .column(19).search('^' + filter, true, false).draw();
      setBreadCrumb(i18n[lang].dirlist[filter]);
      updateMenuVisibleColumnList();
    },

    setEventCategoryFR = function() {
      $('#PPP').off('click').on('click', function(event) {
        filterCategoryFR('PPP');
        event.preventDefault();
      });
      $('#GAD').off('click').on('click', function(event) {
        filterCategoryFR('GAD');
        event.preventDefault();
      });
      $('#GES').off('click').on('click', function(event) {
        filterCategoryFR('GES');
        event.preventDefault();
      });
      $('#GAR').off('click').on('click', function(event) {
        filterCategoryFR('GAR');
        event.preventDefault();
      });
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
        if ((isGMS() || isAccountingCabinet()) && $('th.validation.sorting_disabled').length > 0) {$('.validAll').show();}
      } else {
        $('.downloadall').toggle();
        $('.deleteAll').toggle();
        if ((isGMS() || isAccountingCabinet()) && $('th.validation.sorting_disabled').length > 0) {$('.validAll').toggle();}
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
      $('#btn-upload-div').find('span').html('<i class="fa fa-upload"></i>&nbsp;&nbsp;&nbsp;' + i18n[lang].upload);
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
        //reloadPage();
        window.location.href = TransferBaseURL + 'transferApp.html';
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

    /***** VALIDATE *****/
    setEventValidateFile = function() {

      $('.icon-validation').off('click').on('click', function() {
        var $this = $(this);
        swal({
            title:              i18n[lang].dialog.validAction,
            text:               i18n[lang].dialog.validSure,
            type:               'warning',
            showCancelButton:   true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText:  i18n[lang].dialog.validConfirm,
            cancelButtonText:   i18n[lang].dialog.cancel,
            closeOnConfirm:     false
          },
          function() {
            validateFile($this.data('filename'), $this)
              .then(function resolved(data) {
                if (!data) {
                  Utils.errorMessage(i18n[lang].errorValid, 4000);
                }
              }, function reject(err) {
                console.log('reject', err);
              });
          });
      });
    },

    /***** MULTI VALIDATE *****/
    setI18nMultiValidate = function() {
      $('.validAll').html('<i class="fa fa-check"></i>&nbsp;&nbsp;&nbsp;' + i18n[lang].button.validation);
    },

    setEventMultiValidate = function() {

      $('.validAll').off('click').on('click', function() {
        swal({
            title:              i18n[lang].dialog.validAction,
            text:               i18n[lang].dialog.validSure,
            type:               'warning',
            showCancelButton:   true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText:  i18n[lang].dialog.validConfirm,
            cancelButtonText:   i18n[lang].dialog.cancel,
            closeOnConfirm:     false
          },
          function() {
            validateAll();
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
      /*reloadBtn.html('<i class="fa fa-refresh"></i>&nbsp;&nbsp;&nbsp;' + i18n[lang].button.reload);*/
      reloadBtn.html('<i class="fa fa-refresh"></i>');
      /*reloadBtn.off('click').on('click', function() {
       window.location = TransferBaseURL + 'transferApp.html';
       //window.location.reload();
       });*/
      reloadBtn.off('click').on('click', function() {
        loadClientFiles(getClientName());
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
      /*
       helpBtn.html('<i class="fa fa-question"></i>&nbsp;&nbsp;&nbsp;' + i18n[lang].button.help);
       */
      helpBtn.html('<i class="fa fa-question"></i>');
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
            }/*,
             {
             element:  '#signout',
             intro:    i18n[lang].help.logoff,
             position: 'left'
             }*/
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
      setI18nMultiValidate();
      setI18nFiltersButton();
      setI18nDatePicker();
      setI18nBreadCrumb();
      setI18nHelpButton();
      setI18nSearch();
      setI18nSideMenuColumnList();

      setEventUpload();
      setEventLanguageSettings();
      setEventReload();
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
      setEventValidateFile();
      setEventMultiDelete();
      setEventMultiDownload();
      setEventMultiValidate();

      //setEventGMS();
      setEventCategoryFR();

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
      $(TABLEID).off('draw.dt').on('draw.dt', function() {
        setEventCheckBox();
        setEventDeleteFile();
        setEventValidateFile();

      });

      setEventsHTML();

      //redirectToPreviousCat();

      setTimeout(function() {

        setI18nQuotaWarning();

        if (AjaxData.length === 0) {
          //$('#btn-upload-div').trigger('click');
          console.log('>>> NO files');
        }
        //console.log('selectMenu = ' + selectMenu);
        if (selectMenu === 'UPLOAD') {
          $('#upload').find('a').trigger('click');
        }
      }, 500);
    },

    /***
     * set token for FTP
     * ***/
    portalCnx = function() {

      var url = TransferServerURL + 'login/portal/';
      if (tokenPortal && !tokenTransfer) {
        return $.ajax({
          type:     'POST',
          url:      url,
          data:     {tokenPortal: tokenPortal},
          success:  function(data) {
            tokenTransfer = (data ? data.token : '');
            sessionStorage.setItem('tokenTransfer', tokenTransfer);
          },
          error:    function() {
            AjaxData = [];
            hideLoading();
            Utils.errorMessage(i18n[lang].errorCnx, 4000);
            setTimeout(function() {
              redirectToLogin();
            }, 4000);
          },
          dataType: 'json'
        });
      } else {
        console.log('>>> no Token from Portal received...');
        //Utils.errorMessage('Pas de token du Portail recu...', 4000);
      }
    },

    /****************************************************
     * MAIN
     * */
    render = function() {
      showLoading();
      setEventPreData();

      $.when(portalCnx()).then(function() {

        $.when(loadCategory(), loadData(), loadFolder()).then(function() {

          //Add label for reference of Document
          $.when(mergeLabelDoc()).then(function() {

            //Template of Table and Menu
            createDataTable();
            createMenu();

            if (isGMS()) {
              loadClients().then(function() {
                setEventGMS();
                setEventuploadForm();
              });
            }

            if (isFrance() && !isGMS()) {
              //Specific for France and Accounting cabinet
              loadIsAccountingCabinet().then(function() {

                if (isAccountingCabinet()) {

                  loadEmailGMS().then(function() {

                    loadClients().then(function() {

                      setEventGMS();
                      setEventuploadForm();

                    });
                  });

                } else {

                  loadIsClientOfAccountingCabinet().then(function() {

                    if (isClientOfAccountingCabinet()) {

                      loadEmailCabinet().then(function() {setEventuploadForm();});

                    } else {

                      loadEmailGMS().then(function() {setEventuploadForm();});
                    }
                  });
                }
              });
            }
          });
        });
      });
    },

    main = function() {

      Utils.setTransferURL();
      TransferServerURL = sessionStorage.getItem('TransferServerURL');
      TransferBaseURL = sessionStorage.getItem('TransferBaseURL');
      lang = sessionStorage.getItem('lang') || localStorage.lastLanguage || localStorage.lang;
      username = sessionStorage.getItem('username') ? sessionStorage.getItem('username').toLowerCase() : '';
      tokenPortal = sessionStorage.getItem('token');
      tokenTransfer = sessionStorage.getItem('tokenTransfer');

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
          if (isFrance()) lang = 'fr';
          else lang = 'en';
        }

        if (lang !== 'en') {
          $.getScript(i18n[lang].url.datepicker);
        }
        if (isFrance()) {
          lang = 'fr';
          $('.univers').html('Online Transfer France');
        }
        if (i18n[lang]) { // if language is set,
          $('input[name="lang"]').val(lang);
          // load data and create table
          render();
        } else {

          Utils.errorMessage('ERROR loading language data', 4000);
          setTimeout(function() {
            redirectToLogin();
          }, 4000);
        }
      });
    };

  //TODO: replace by module design pattern
  $(main());

  return {
    i18n:                        i18n,
    clientList:                  clientList,
    cabinetID:                   cabinetID,
    ClientCabinetList:           ClientCabinetList,
    FTPClientCabinetList:        FTPClientCabinetList,
    isGMS:                       isGMS,
    isAccountingCabinet:         isAccountingCabinet,
    isClientOfAccountingCabinet: isClientOfAccountingCabinet,
    isNormalClient:              isNormalClient,
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

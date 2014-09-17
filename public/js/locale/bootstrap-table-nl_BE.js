/**
 * Bootstrap Table Dutch translation
 * Author: Julien Bisconti<julien.bisconti@gmail.com>
 */
(function ($) {
    'use strict';

    $.extend($.fn.bootstrapTable.defaults, {
        formatLoadingMessage: function() {
            return 'Loading, wacht a.u.b…';
        },
        formatRecordsPerPage: function(pageNumber) {
            return pageNumber + ' documenten per pagina';
        },
        formatShowingRows: function(pageFrom, pageTo, totalRows) {
            return 'Tonen ' + pageFrom + ' tot ' + pageTo + ' van ' + totalRows + ' documenten';
        },
        formatSearch: function() {
            return 'Zoeken'
        },
        formatNoMatches: function() {
            return 'Geen documenten gevonden';
        },
        formatDownloadAll: function(){
            return 'Download Selectie';
        },
        formatBreadCrumb: function(){
            return 'Nieuwe documenten ';
        },
        formatDateStart: function(){
            return 'Beginnen Datum';
        },
        formatDateEnd: function(){
            return 'Einde Datum';
        },
        formatReload: function(){
            return 'Opnieuw laden';
        },
        formatShowColumn: function(){
            return 'Tonen';
        },
        formatFilter: function(){
            return 'Filtrer door';
        },
        formatNewFile: function(){
            return 'Nieuw Documenten';
        },
        formatNotDl: function(){
            return 'Document nog niet gedownload'
        },
        formatDL: function(){
            return 'Downloaden';
        }
    });
})(jQuery);
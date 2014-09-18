/**
 * Bootstrap Table English translation
 * Author: Zhixin Wen<wenzhixin2010@gmail.com>
 */
(function ($) {
    'use strict';

    $.extend($.fn.bootstrapTable.defaults, {
        formatLoadingMessage: function() {
            return 'Loading, please wait…';
        },
        formatRecordsPerPage: function(pageNumber) {
            return pageNumber + ' records per page';
        },
        formatShowingRows: function(pageFrom, pageTo, totalRows) {
            return 'Showing ' + pageFrom + ' to ' + pageTo + ' of ' + totalRows + ' rows';
        },
        formatSearch: function() {
            return 'Search'
        },
        formatNoMatches: function() {
            return 'No matching records found';
        },
        formatDownloadAll: function(){
            return 'Download Selected';
        },
        formatBreadCrumb: function(){
            return 'New file not yet downloaded';
        },
        formatDateStart: function(){
            return 'Start Date';
        },
        formatDateEnd: function(){
            return 'End Date';
        },
        formatReload: function(){
            return 'Reload';
        },
        formatShowColumn: function(){
            return 'Show';
        },
        formatFilter: function(){
            return 'Filter by';
        },
        formatNewFile: function(){
            return 'New Documents';
        },
        formatNotDl: function(){
            return 'Documents not yet downloaded'
        },
        formatDL: function(){
            return 'Download';
        },
        formatBtnDl: function(total){
            return total > 1 ? 'Download '+total+' files' : 'Download '+total+' file';
        }
    });
})(jQuery);
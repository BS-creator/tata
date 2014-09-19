/**
 * Bootstrap Table French (Belgium) translation
 * Author: Julien Bisconti (julien.bisconti@gmail.com)
 */
(function ($) {
    'use strict';

    $.extend($.fn.bootstrapTable.defaults, {
        formatLoadingMessage: function() {
            return 'Chargement en cours... ';
        },
        formatRecordsPerPage: function(pageNumber) {
            return pageNumber + ' entrées par page ';
        },
        formatShowingRows: function(pageFrom, pageTo, totalRows) {
            return 'Affiche de ' + pageFrom + ' à ' + pageTo + ' sur ' + totalRows + ' fichiers';
        },
        formatSearch: function() {
            return 'Recherche '
        },
        formatNoMatches: function() {
            return 'Pas de fichiers trouvés ';
        },
        formatDownloadAll: function(){
            return 'Télécharger';
        },
        formatBreadCrumb: function(){
            return 'Nouveaux fichiers non-téléchargés';
        },
        formatDateStart: function(){
            return 'Date de début';
        },
        formatDateEnd: function(){
            return 'Date de fin';
        },
        formatReload: function(){
            return 'Rafra&icirc;chir';
        },
        formatShowColumn: function(){
            return 'Affichage';
        },
        formatFilter: function(){
            return 'Filtrer par';
        },
        formatNewFile: function(){
            return 'Nouveau Fichiers';
        },
        formatNotDl: function(){
            return 'Fichiers Non-Téléchargés'
        },
        formatDL: function(){
            return 'Télécharger';
        },
        formatBtnDl: function(total){
            return total > 1 ? 'Télécharger '+total+' fichiers' : 'Télécharger '+total+' fichiers';
        }
    });
})(jQuery);

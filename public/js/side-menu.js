$('document').ready(function () {

    ////////////////////////////////////////////////////////
    //                  SIDE-MENU
    ///////////////////////////////////////////////////////

    var $main = $('#main');
    var $snav = $('.sidenav');
    var $smenu = $('#side-menu');


    // initialize size & display /default
    (function () {
        var sbWidth = $('#sidenav').width();
        $('#side-menu').css({
            top: $main.offset().top, // get top height to align
            right: -sbWidth,
            width: sbWidth,
            height: $(window).height() - $main.offset().top
        }).removeClass();
    })();

    // set position
    var sideMenuToggle = function (displayed) {
        var MSWidth = $('#sidenav').width();
        var MSAbsc = (displayed === true) ? 0 : -MSWidth;
        var mainAbsc = (displayed === false) ? 0 : -MSWidth;
        $main.animate({
            right: -mainAbsc
        });
        $smenu.animate({
            right: MSAbsc,
            width: sbWidth
        }).toggleClass('active');
    }

    // resize side-menu width x height
    $(window).resize(function () {
        $smenu.height($(window).height() - $('#header').height());
        if ($smenu.hasClass('active')) {
            sideMenuToggle(false);
            $(this).width($('#sidenav').width());
        }
    });
    $(window).trigger('resize');

    // side-menu active
    $('#toggle-side-menu').on('click', function () {
        sideMenuToggle(true);
    });

    // side-menu desactive
    $('.side-menu-head-icon').on('click', function () {
        sideMenuToggle(false);
        // $('#side-menu').hide();
    });

    // side-menu li active class
    $('.side-menu-list > li').on('click', function () {
        $(this).toggleClass('active');
    });


});
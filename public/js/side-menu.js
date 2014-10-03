$('document').ready(function () {

    ////////////////////////////////////////////////////////
    //                  SIDE-MENU
    ///////////////////////////////////////////////////////

    var main = $('#main');
    var sidenav = $('#sidenav');
    var sidemenu = $('#side-menu');


    // initialize size & display /default
    (function () {
        $('#side-menu').css({
            top: main.offset().top, // get top height to align
            right: -sidenav.width(),
            width: sidenav.width(),
            height: $(window).height() - main.offset().top
        }).removeClass();
    })();

    // set position
    var sideMenuToggle = function (displayed) {
        var MSAbsc = (displayed === true) ? 0 : -sidenav.width();
        var mainAbsc = (displayed === false) ? 0 : -sidenav.width();
        main.animate({
            right: -mainAbsc
        });
        sidemenu.animate({
            right: MSAbsc,
            width: sidenav.width()
        }).toggleClass('active');
    }

    // resize side-menu width x height
    $(window).resize(function () {
        sidemenu.height($(window).height() - $('#header').height());
        if (sidemenu.hasClass('active')) {
            sideMenuToggle(false);
            $(this).width(sidenav.width());
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
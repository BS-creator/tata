$('document').ready(function(){

    ////////////////////////////////////////////////////////
    //                  SIDE-MENU
    ///////////////////////////////////////////////////////

    // initialize size & display /default
    (function() {
        $('#side-menu').css({
            top: $('#main').offset().top, // get top height to align
            right: -$('.sidebar-left').width(),
            width: $('.sidebar-left').width(),
            height: $(window).height()- $('#main').offset().top
        }).removeClass();
    })();

    // set position
    var sideMenuToggle = function(displayed){
        var MSAbsc = (displayed === true) ? 0 : -$('.sidebar-left').width();
        var mainAbsc = (displayed === false) ? 0 : -$('.sidebar-left').width();
        $('#main').animate({
            right: -mainAbsc
        });
        $('#side-menu').animate({
            right: MSAbsc,
            width: $('.sidebar-left').width()
        }).toggleClass('active');
    }

    // resize side-menu width x height
    $(window).resize(function() {
        $('#side-menu').height($(window).height()- $('#header').height());
        if($('#side-menu').hasClass('active')) {
            sideMenuToggle(false);
            $(this).width($('.sidebar-left').width());
        }
    });
    $(window).trigger('resize');

    // side-menu active
    $('#toggle-side-menu').on('click', function(){
        sideMenuToggle(true);
    });

    // side-menu desactive
    $('.side-menu-head-icon').on('click', function(){
        sideMenuToggle(false);
        // $('#side-menu').hide();
    });

    // side-menu li active class
    $('.side-menu-list > li').on('click', function(){
        $(this).toggleClass('active');
    });


});
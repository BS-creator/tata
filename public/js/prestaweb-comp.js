$( document ).ready(function() {

    // SIDENAV
    /*$("#sidenav .sidenav-head").click(function(){
        // $(this).next("ul").toggle();
        $(this).addClass('active');
    });*/
    $('#sidenav .sidenav-head').on('click', function() {
        $(this).parent().parent().find('.active').removeClass('active');
        $(this).addClass('active');
    });

    $('#sidenav > ul > li > a').click(function() {

        var checkElement = $(this).next();

        $('#cssmenu li').removeClass('active');
        $(this).closest('li').addClass('active');

        if((checkElement.is('ul')) && (checkElement.is(':visible'))) {
            $(this).closest('li').removeClass('active');
            checkElement.slideUp('normal');
        }
        if((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
            $('#cssmenu ul ul:visible').slideUp('normal');
            checkElement.slideDown('normal');
        }

        if($(this).closest('li').find('ul').children().length == 0) {
            return true;
        } else {
            return false;
        }

    });





});

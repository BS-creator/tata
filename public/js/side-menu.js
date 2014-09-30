$('document').ready(function(){

    // resize side-menu height
    $(window).resize(function() {
        $('#side-menu').height($(window).height() - 85); // - 85 depends on the header height
    });
    $(window).trigger('resize');

    // slide-menu in/out
    $('#toggler').on('click', function(){

        $('#toggler').toggleClass('active');

        if($('#side-menu').hasClass('side-menu-show')){

            $('#side-menu').animate({
                right: -300
            }).removeClass('side-menu-show');

            // main
            $('#main').animate({
                left: 0
            });

        }else{

            // side-menu
            $('#side-menu').animate({
                right: 0
            }).addClass('side-menu-show');

            // main
            $('#main').animate({
                left: -300
            });
        }
    });

    // side-menu li active class
    $('.side-menu-list > li').on('click', function(){
        $(this).toggleClass('active');
    });

    // tooltip - add rel='tooltip' to the tooltip element
    $(function () {
        $("[rel='tooltip']").tooltip();
    });
});
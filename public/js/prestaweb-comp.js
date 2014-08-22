$( document ).ready(function() {

    // SIDENAV
    $('#sidenav > ul > li.sidenav-head p').click(function() {
        if($(this).parent().hasClass('active')){
            $(this).parent().removeClass('active');
            $(this).removeClass('active');
        }else{
            $(this).parent().addClass('active');
            $(this).addClass('active');
        };
    });





});

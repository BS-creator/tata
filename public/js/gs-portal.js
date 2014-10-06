$('document').ready(function () {

    // tooltip - add rel='tooltip' to the tooltip element
    $(function () {
        $("[rel='tooltip']").tooltip();
    });


    ////////////////////////////////////////////////////////
    //                  SIDENAV
    ///////////////////////////////////////////////////////

    $(function () {

        $('.level2 a').on('click', function(){
            alert($(this).next());
            $(this).next().toggle();
        });

    });
});
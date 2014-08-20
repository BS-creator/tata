$( document ).ready(function() {


    // sidenav //////////////////////////////////

    $("#sidenav h3").click(function(){
        $(this).next("ul").toggle();
    });



        var label = [];



    var d = $.getJSON("scripts/files.json", function (data) {


        //var arr = $.map( data, function( obj, i ) { return data; } );
        $.each( data, function( index, obj ) {
            $.each(obj, function(key,val){
                if(key=="LIB_CATEGORIE_F"){
                    //console.log(label[val]);
                    if(label.indexOf(val)===-1){
                        label.push(val);

                    }
                }
            });
            //items.push( "<li id='" + key + "'>" + val + "</li>" );

        });
    })
    //console.log(data);
    .done(function () {
            console.log("import JSON success");
            console.log(label);
        })
    .fail(function () {
            console.log("import JSON error");
        });




    // INCLUDING FILES
    $(function(){
        $("#content").load("view/index.file-list.html");
    });

});

$( document ).ready(function() {


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
    /*
    $(function(){
        $("#content").load("view/index.file-list.html");
    });
    */

});

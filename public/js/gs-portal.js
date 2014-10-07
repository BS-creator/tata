$( 'document' ).ready( function () {
    'use strict';
    // tooltip - add rel='tooltip' to the tooltip element
    $( function () {
        $( "[rel='tooltip']" ).tooltip();
    } );


    ////////////////////////////////////////////////////////
    //                  SIDENAV
    ///////////////////////////////////////////////////////

console.log($('#root'));
    $( "#root" ).on( 'click', function () {
        console.log($(this));
        $(this).addClass('active');
    });

    $( '.level2 a' ).on( 'click', function () {
            console.log( $( this ) );
        } );


        $( '#root' ).on( 'click', function () {
            alert( $( this ).next() );
            $( this ).next().toggle();
        } );


} );
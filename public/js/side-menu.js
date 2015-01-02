$('document').ready(function () {
  'use strict';

  ////////////////////////////////////////////////////////
  //                  SIDE-MENU
  ///////////////////////////////////////////////////////

  var $main = $('#main');
  var $smenu = $('#side-menu');

  // initialize size & display /default
  (function () {
    var sbWidth = $('#sidenav').width();
    var mainTop = ($main.offset().top)-1;
    $('#side-menu').css({
      top  : mainTop, // get top height to align
      right: -sbWidth,
      width: sbWidth,
      /*
       bottom: 0
       */
    }).removeClass();
  })();

  // set position
  var sideMenuToggle = function (displayed) {

    // set height
    $('#side-menu').height(( $('#main').height() ) - $('footer').height());

    var sbWidth = $('#sidenav').width();
    var MSAbsc = (displayed === true) ? 0 : -sbWidth;
    var mainAbsc = (displayed === false) ? 0 : -sbWidth;
    $main.animate({
      right: -mainAbsc
    }, 200);
    $smenu.animate({
      right: MSAbsc,
      width: sbWidth
    }, 200).toggleClass('active');
  };

  // resize side-menu width x height
  $(window).resize(function () {
    if ($smenu.hasClass('active')) {
      sideMenuToggle(false);
      $(this).width($('#sidenav').width());
    }
  });

  $(window).trigger('resize');

  // side-menu active
  $('#toggle-side-menu').on('click', function () {
    sideMenuToggle(!$('#side-menu').hasClass('active'));
  });

  // side-menu desactive
  $('.side-menu-head-icon').on('click', function () {
    sideMenuToggle(false);
  });

  // side-menu li active class
  $('.side-menu-list > li').on('click', function () {
    $(this).toggleClass('active');
  });


});

var fruit = fruit || {};
//顶部工具栏
fruit.adToptool = function() {
  var $link_btn = $(".web-nav");
  var $link_list = $(".web-nav > .web-list");
  $link_btn.mouseenter(function() {
    $(this).find('a').addClass('hover');
    $link_list.show();
  }).mouseleave(function() {
    $(this).find('a').removeClass('hover');
    $link_list.hide();
  });
  
};


$(function() {
  
  //新版顶部工具栏
  fruit.adToptool();

  $(".nav-all").hover(function() {
            $(this).children(".nav-all-title i").addClass("hover-nav");
            $(this).children(".nav-all-class").show();
        },function(){
            $(this).children("nav-all-title i").removeClass("hover-nav");
            $(this).children(".nav-all-class").hide();
        });/*all menu*/

  
});
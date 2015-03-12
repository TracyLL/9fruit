// JavaScript Document
$(function(){
    var $index_slider = $('.onelist-right-box');
    var $index_slider_child_l = $('.index_recommend_list .onelist-right-three').length;
    var index_slider_count = 0;

    if ($index_slider_child_l <= 3) {
        $('.btn_recommend_top').html('');
        $('.btn_recommend_bottom').html('');
        
        $('.btn_recommend_top').css({cursor: 'auto'});
        $('.btn_recommend_bottom').css({cursor: 'auto'});
    }else{
        $('.btn_recommend_top').html('');
        $('.btn_recommend_bottom').html('▼');
        
        $('.btn_recommend_top').css({cursor: 'auto'});
        $('.btn_recommend_bottom').css({cursor: 'pointer'});
    }

    $('.btn_recommend_bottom').click(function() {
        if ($index_slider_child_l < 3 || index_slider_count >= Math.ceil($index_slider_child_l/3)-1) {
            return false;
        }

        index_slider_count++;
        $index_slider.animate({top: '-=' + 513 + 'px'}, 'slow');
        index_slider_pic(index_slider_count,$index_slider_child_l) 
    });
    
    $('.btn_recommend_top').click(function() {
        if (index_slider_count <= 0) {
            return false;
        }
        
        index_slider_count--;
        $index_slider.animate({top: '+=' + 513 + 'px'}, 'slow');
        index_slider_pic(index_slider_count,$index_slider_child_l) 
    });
    
    function index_slider_pic(index_slider_count,$index_slider_child_l) {
        if (index_slider_count >= Math.ceil($index_slider_child_l/3)-1) {
            $('.btn_recommend_top').html('▲');
            $('.btn_recommend_bottom').html('');
            
            $('.btn_recommend_top').css({cursor: 'pointer'});
            $('.btn_recommend_bottom').css({cursor: 'auto'});
        }
        else if (index_slider_count > 0 && index_slider_count <= Math.ceil($index_slider_child_l/3)-1) {
            $('.btn_recommend_top').html('▲');
            $('.btn_recommend_bottom').html('▼');
            
            $('.btn_recommend_top').css({cursor: 'pointer'});
            $('.btn_recommend_bottom').css({cursor: 'pointer'});
        }
        else if (index_slider_count <= 0) {
            $('.btn_recommend_top').html('');
            $('.btn_recommend_bottom').html('▼');
            
            $('.btn_recommend_top').css({cursor: 'auto'});
            $('.btn_recommend_bottom').css({cursor: 'pointer'});
        }
    }
});


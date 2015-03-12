
var adPlatform = adPlatform || {};
//顶部工具栏
adPlatform.adToptool = function() {
  var $link_btn = $(".web-nav");
  var $link_list = $(".web-nav > .web-list");
  $link_btn.mouseenter(function() {
    $(this).find('a').addClass('hover');
    $link_list.show();
  }).mouseleave(function() {
    $(this).find('a').removeClass('hover');
    $link_list.hide();
  });

  var $msgBox = $(".g-msg");
  var $msgNumBox = $(".total-num-box");
  var msg = $(".total-num").text();
  if(msg>=10){
    $msgBox.addClass('wide');
  }
  if(msg>99){
    $(".total-num").text("99+");
    $msgBox.addClass('max');
  }
};
//新版导航栏
adPlatform.adNav = function() {
  var $mov = $(".g-nav .mov");
  var $nav_item = $(".g-nav li");
  var $ori_item = $nav_item.filter('.on');
  var ori_pos = $ori_item.position().left;
  var ori_width = $ori_item.outerWidth();
  $mov.css({
    left: ori_pos,
    width: ori_width
  });
  $nav_item.mouseover(function() {
    $mov.stop();
    var _pos = $(this).position().left;
    var _width = $(this).outerWidth();
    $mov.animate({left: _pos,width:_width}, 100);
  }).mouseout(function() {
    $mov.stop();
    $mov.animate({left: ori_pos,width:ori_width}, 100);
  });
};
//新版左侧menu
adPlatform.adSidebar = function() {
  var $parentItem = $(".m-sidebar > ul > li").children('a');
  $parentItem.bind('click', function() {
    var _this = $(this);
    if(!$(this).parent().hasClass('select')){
      $(this).parent().siblings('li.select').removeClass('select')
                      .find('ul').slideUp('fast',function(){
        _this.parent().addClass('select')
              .find('ul').slideDown();
      })
    }
  });
};
//表格效果
adPlatform.adTable = function() {
  var $tr = $(".m-table tr");
  $tr.die('mouseover').live('mouseover',function() {
    $(this).addClass('hover');
  }).die('mouseout').live('mouseout', function() {
    $(this).removeClass('hover');
  });
};
//激活时改变输入框边框色
adPlatform.changeTextBorder = function() {
  var uiText = $(".ui-text");
  uiText.bind("focus", function() {
    $(this).addClass("ui-text-focus");
    //搜索框激活事件
    if($(this).parent().hasClass('input-search-wrapper')){
      $(this).parent().addClass('focus');
    }
  });
  uiText.bind("blur", function() {
    $(this).removeClass("ui-text-focus");
    //搜索框激活事件
    if($(this).parent().hasClass('input-search-wrapper')){
      $(this).parent().removeClass('focus');
    }
  });
};
//关键词模板
adPlatform.keywordTemplate = function() {
  var $keyword_textarea = $(".keyword-textarea");
  //关键词计数
  var count = 0;
  if(!$keyword_textarea.length>0){
    return false;
  }
  //文本域点击事件
  $keyword_textarea.bind('click', function() {
    if($(this).find('input').length<=1){
      $(this).find('input:first').focus();
    }
  });
  //输入框
  var $keyword_input = $(".keyword-textarea ul li input");
  $keyword_input.live('keydown', function(e) {
    //去掉出错提示
    $(".keyword-textarea ul").find('strong').remove();
    var $new_line = $('<li><input type="text" class="item" maxlength="20" /><span><em></em></span></li>');
    var currentKey=0,e=e||event;   
    currentKey=e.keyCode||e.which||e.charCode;
    //回车确认
    if(currentKey==13){
      if($.trim($(this).val())==""){
        return false;
      }
      if(count>=50){
        return false;
      }
      //将当前行input框内的值存入span标签
      var confirm_val = $(this).val();
      //如果输入有重复值，则无法添加并给予提示
      var curIndex = $(this).parent().index();
      var curSelectedItems = $(".keyword-textarea ul li:not(:eq("+curIndex+"))").find('span').find('em');
      var $tip_repeat = $('<strong>对不起，您输入的条目已存在</strong>');
      var flag = true;
      curSelectedItems.each(function(index, el) {
        if($(this).text().trim()==confirm_val){
          flag = false;
        }
      });
      if(!flag){
        $tip_repeat.appendTo($(".keyword-textarea ul"));
        return;
      }
      $(this).hide()
             .siblings('span').show()
             .find('em').text(confirm_val);
      //新增一行
      $(this).parent('li').after($new_line);
      //取消事件的默认动作
      e.preventDefault();
      //当前焦点移至新行
      $(this).parent('li').next().find('input').focus();
      //关键词个数更新
      countUpdate();
    }
  });
  //文本框焦点事件
  $keyword_input.live('focus', function(e) {
    $(this).textFocus();
  });
  //特殊字符高亮显示
  $keyword_input.live('keyup', function(e) {
    var reg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]","gi");
    var current_val = $(this).val();
    if(reg.test(current_val)){
      $(this).parent().addClass('error');
    }else{
      $(this).parent().removeClass('error');
    }
    //若当前行字符为空，则重新计算关键词个数
    var currentKey=0,e=e||event;   
    currentKey=e.keyCode||e.which||e.charCode;
    if(currentKey==8&&count>0){
      if(current_val==""){
        $(this).siblings('span').find('em').text("");
        //关键词个数更新
        countUpdate();
      }
    }
  });
  //删除操作
  $keyword_input.live('keydown', function(e) {
    var current_val = $(this).val();
    var currentKey=0,e=e||event;   
    currentKey=e.keyCode||e.which||e.charCode;
    if(current_val==""){
      //关键词个数更新
      countUpdate();
      if(currentKey==8&&count>0){
        //取消事件的默认动作
        e.preventDefault();
        //将当前焦点移至上一个输入框
        $(this).parent('li').prev().find('input').show().textFocus()
                                    .siblings('span').hide();
        if($(this).index()!=0){
          return;
        }
        //删除当前输入框
        $(this).parent('li').remove();
      }
    }
  });
  //输入框失去焦点事件
  $keyword_input.live('blur', function(e) {
    var $new_line = $('<li><input type="text" class="item" maxlength="20" /><span><em></em></span></li>');
    if($.trim($(this).val())==""){
      return false;
    }
    if(count>=50){
        return false;
      }
    //将当前行input框内的值存入span标签
    var confirm_val = $(this).val();
    //如果输入有重复值，则无法添加并给予提示
    var curIndex = $(this).parent().index();
    var curSelectedItems = $(".keyword-textarea ul li:not(:eq("+curIndex+"))").find('span').find('em');
    var flag = true;
    curSelectedItems.each(function(index, el) {
      if($(this).text().trim()==confirm_val){
        flag = false;
      }
    });
    if(!flag){
      $(this).textFocus();
      return;
    }
    $(this).hide()
           .siblings('span').show()
           .find('em').text(confirm_val);
    if(!$(this).parent().next().length>0){
      //新增一行
      $(this).parent('li').after($new_line);
      //取消事件的默认动作
      e.preventDefault();
      //当前焦点移至新行
      $(this).parent('li').next().find('input').focus();
    }else{
      $(this).parent('li:last').find('input').focus();
    }
    //关键词个数更新
    countUpdate();
  });
  //文本域行
  var $keyword_item = $(".keyword-textarea ul li span");
  $keyword_item.live('mouseover', function(e) {
    $(this).addClass('hover');
  });
  $keyword_item.live('mouseleave', function(e) {
    $(this).removeClass('hover');
  });
  $keyword_item.live('click', function(e) {
    $(this).hide()
            .siblings('input').show().focus()
            // .find('em').text(confirm_val);
  });
  $keyword_item.find('i').live('click', function(e) {
    $(this).parent().parent().remove();
    $keyword_textarea.find('li:last').find('input').focus();
    //关键词个数更新
    countUpdate();
  });
  //当前关键词个数更新
  function countUpdate(){
    //关键词个数
    count = $keyword_textarea.find('input[value!=""]').length;
    //将当前个数更新至页面
    $keyword_textarea.next('div').find('em').text(count);
  }
  //清空按钮
  var $clearBtn = $keyword_textarea.next('div').find('a');
  $clearBtn.bind('click', function() {
    var $new_line = $('<li><input type="text" class="item" maxlength="20" /><span><em></em></span></li>');
    $keyword_textarea.children('ul')
                      .empty()
                      .append($new_line)
                      .find('input').focus();
    //关键词个数更新
    countUpdate();
  });
};
//带滚动条表格宽度匹配
adPlatform.scrollTable = function() {
  var $table_outer = $(".m-table.outer");
  var $table_inner = $(".m-table.inner");
  var $table_outer_th = $table_outer.find('th');
  var $table_inner_th = $table_inner.find('th');
  for (var i = 0; i < $table_outer_th.length; i++) {
    var _width = $table_outer_th.eq(i).attr("width");
    $table_inner_th.eq(i).attr("width",_width);
  };

  var $table_scroll = $(".m-table-scroll");
  if($table_inner.height()>$table_scroll.height()){
    //内层表格最后一行边框不显示
    $table_inner.find('tr:last td').css("border-bottom","0");
  }
};
//checkbox按钮效果
adPlatform.checkboxBtn = function() {
  var $checkboxBtn = $(".checkbox-btn");
  $checkboxBtn.die('click').live('click', function(event) {
    if(!$(this).attr('checked')){
      $(this).addClass('checked')
              .attr("checked","checked")
              .siblings('label').addClass('checked');
      if($(this).hasClass('ctrl')){
        var name = $(this).attr("name");
        $(".checkbox-btn[name="+name+"]").addClass('checked')
                                          .attr("checked","checked");
      }
    }else{
      $(this).removeClass('checked')
              .removeAttr("checked")
              .siblings('label').removeClass('checked');
      $(this).closest('.m-table-wrapper').find('.checkbox-btn.ctrl')
              .removeClass('checked')
              .removeAttr("checked");
      if($(this).hasClass('ctrl')){
        var name = $(this).attr("name");
        $(".checkbox-btn[name="+name+"]").removeClass('checked')
                                          .removeAttr("checked");
      }
    }
  });
};
//按钮弹出窗口
adPlatform.btnDialog = function() {
  var $dialogBtn = $(".dialog-btn-wrapper").children('.act-btn').bind('click', function(event) {
    $('.dialog').hide();//隐藏已打开的弹出框
    $(this).siblings('.dialog').show();
  });
  //关闭按钮事件
  var $closeBtn = $(".dialog p.close").find('i');
  $closeBtn.bind('click', function(e) {
    //隐藏弹出框
    $(this).closest('.dialog').hide()
            .find('input').val('');//清空输入框
  });
  //取消按钮事件
  var $cancelBtn = $(".dialog .act").find('.cancel');
  $cancelBtn.bind('click', function(e) {
    //隐藏弹出框
    $(this).closest('.dialog').hide()
            .find('input').val('');//清空输入框
  });
};
//弹出框组件
adPlatform.winAct = function(opts, callback) {
  $(".dialog-mask").remove();
  //opts.id -- 弹出框外围ID
  //opts.isOpen -- 是否为打开操作
  //opts.isImported -- 是否为子页面的弹窗
  //opts.isFix -- 是否窗口定位 默认 true
  //opts.isIframe -- 是否有灰色遮罩层
  var isIE6 = !-[1, ] && !window.XMLHttpRequest,
    obj = $("#" + opts.id),
    wrapper = $('<div class="dialog-wrapper" id="dialogWrapper"></div>'),//弹出层容器
    mask = $('<iframe class="dialog-mask" scrolling="no" frameborder="0"></iframe>'),//遮罩层
    isFix = opts.isFix || true;
  wrapper.appendTo('body');//新建弹出层容器
  mask.appendTo('body');//新建遮罩层
  obj.show().appendTo(wrapper);//将目标元素添加至弹出层
  winActResize(isFix, obj, wrapper, isIE6);//窗口位置自适应
  //弹出层显示与关闭
  if (opts.isOpen) {
    wrapper.show();
  } else {
    obj.hide().unwrap(wrapper);
    $(".dialog-wrapper").remove();
  }
  if (callback) {
    callback.apply(this, [opts.id]);
  }
  //遮罩层
  var screenIfm = $(".dialog-mask");
  opts.isIframe ?
    screenIfm.css({
      width: '100%',
      height: $(document).height() + "px",
      opacity: 0.3,
      backgroundColor: "#000"
    }).show() : screenIfm.css({
      width: 0,
      height: 0
    }).hide();
  //窗口改变时加载
  window.onresize = function() {
    winActResize(isFix, obj, wrapper, isIE6);
  }
};
//窗口改变时加载
var winActResize = function(isFix, obj, wrapper, isIE6) {
  var _oW = obj.width(),
    _oH = obj.height(),
    _wH = $(window).height(),
    _dW = $(document).width(),
    _dS = $(document).scrollTop(),
    _h = _oH <= 0 ? 150 : _oH,
    _t = Math.max(0, (_wH - _h) / 2);
  wrapper.css({
    top: _t + "px",
    'left': (_dW - _oW) / 2
  });
  if (isFix) {
    wrapper.css({
      top: _t + "px"
    });
    wrapper.css('position', isIE6 ? 'absolute' : 'fixed');
    isIE6 && $(window).scroll(function() {
      var _top = Math.max(0, (_wH - _h) / 2);
      wrapper.css({
        'top': _dS + _top,
        'left': (_dW - _oW) / 2
      });
    });
  }
};

//新手指南组件
adPlatform.guideAct = function(opts, callback) {
  $(".dialog-mask").remove();
  //opts.id -- 弹出框外围ID
  //opts.isOpen -- 是否为打开操作
  //opts.isImported -- 是否为子页面的弹窗
  //opts.isFix -- 是否窗口定位 默认 true
  //opts.isIframe -- 是否有灰色遮罩层
  var isIE6 = !-[1, ] && !window.XMLHttpRequest,
    obj = $("#" + opts.id),
    clone_obj = {},
    wrapper = $('<div class="dialog-wrapper" id="dialogWrapper"></div>'),//弹出层容器
    mask = $('<iframe class="dialog-mask" scrolling="no" frameborder="0"></iframe>'),//遮罩层
    isFix = opts.isFix || true;
  wrapper.appendTo('body');
  mask.appendTo('body');//新建遮罩层
  //弹出层显示与关闭
  if (opts.isOpen) {
    clone_obj = obj.clone(true);
    clone_obj.appendTo(wrapper);
    clone_obj.show();
    wrapper.fadeIn();
  } else {
    $(".dialog-wrapper").remove();
    return false;
  }
  if (callback) {
    callback.apply(this, [opts.id]);
  }
  //遮罩层
  var screenIfm = $(".dialog-mask");
  opts.isIframe ?
    screenIfm.css({
      width: '100%',
      height: $(document).height() + "px",
      opacity: 0.3,
      backgroundColor: "#000"
    }).show() : screenIfm.css({
      width: 0,
      height: 0
    }).hide();

  winGuideResize(isFix, clone_obj, wrapper, isIE6);//窗口位置自适应
  //窗口改变时加载
  window.onresize = function() {
    winGuideResize(isFix, clone_obj, wrapper, isIE6);
  }

  var content = clone_obj.find('.container').children('p');
  var current_step = clone_obj.find('.act').find('em.cur');
  var title = clone_obj.find('.title').find('h1').children('span');
  var max = clone_obj.find('.container').find('p').length;
  clone_obj.find('em.total').text(max);

  goStep(1);

  function goStep(stepNum){
    content.eq(stepNum-1).show().siblings('p').hide();
    title.eq(stepNum-1).show().siblings('span').hide();
    current_step.text(stepNum);
    if(stepNum==max){
      clone_obj.find(".guide-btn.next").hide();
      clone_obj.find(".guide-btn.confirm").show().die('click').live('click', function(event) {
        $("html,body").stop().animate({scrollTop: 0}, '300');
        return false;
      });
    }
    move(stepNum);
    clone_obj.find(".guide-btn.next").die('click').live('click', function(event) {
      goStep(stepNum+1);
      return false;
    });
  }
  function move(stepNum){
    var _target = $("[name=guide_step_"+stepNum+"]");
    var _top = _target.offset().top+60;
    var _left = _target.offset().left+100;
    var _width = _target.outerWidth();
    var _height = _target.outerHeight();
    if(_left>1000){
      clone_obj.find('.arrow').removeClass('l');
      _left = _left-obj.outerWidth()-100;
    }else{
      clone_obj.find('.arrow').addClass('l');
    }
    if(_top>800){
      $("html,body").stop().animate({scrollTop: _top-200}, '300');
    }
    clone_obj.find('.arrow-box').css({'width':_width,'height':_height});
    if(stepNum==1){
      wrapper.css({left: _left, top: _top});
    }else{
      wrapper.animate({left: _left, top: _top});
    }
  }
};
//新手指南窗口改变时加载
var winGuideResize = function(isFix, obj, wrapper, isIE6) {
  var _oW = obj.width(),
    _oH = obj.height(),
    _wH = $(window).height(),
    _dW = $(document).width(),
    _dS = $(document).scrollTop(),
    _h = _oH <= 0 ? 150 : _oH,
    _t = Math.max(0, (_wH - _h) / 2);
  var _top = Math.max(0, (_wH - _h) / 2);
  wrapper.css({
    'top': _dS + _top,
    'left': (_dW - _oW) / 2
  });
};

//新版tab
adPlatform.adTab = function() {
  var ctrlLi = $(".m-tab-ctrl li");
  ctrlLi.die('click').live("click", function() {
    var index = $(this).index()+1;
    $(this).addClass('select')
            .siblings('li').removeClass('select');
    $(".m-tab-con").find('.m-tab-con-'+index)
        .show()
        .siblings().hide();
    return false;
  });
};

//快捷日期下拉组件
(function($) {
  $.fn.setQuickDate = function(options) {
    var opt = $.extend({
        container: this.selector,
        defStartDate: '',
        defEndDate: '',
        callback: function() {}
    }, options || {});
    
    $(opt.container).each(function(index, el) {
      var $customDate = $(this);
      var $startDate = $customDate.find('.date-wrapper').find('span:eq(0)');//起始日期容器
      var $endDate = $customDate.find('.date-wrapper').find('span:eq(2)');//结束日期容器
      var TODAY = new Date();
      var ONEDAY = 60*60*24*1000;
      var YESTERDAY_DATE = new Date(TODAY.getTime()-ONEDAY);
      var YESTERDAY = YESTERDAY_DATE.pattern("yyyy-MM-dd");
      var BEFORE_YESTERDAY_DATE = new Date(TODAY.getTime()-ONEDAY*2);
      var BEFORE_YESTERDAY = BEFORE_YESTERDAY_DATE.pattern("yyyy-MM-dd");
      var LASTDAYINLASTWEEK_DATE = getLastWeekEndDate(TODAY);

      //快捷按钮
      var $dateWrapper = $customDate.find('.dateWrapper');
      var quickBtnHTML = [//快捷按钮框架
        '<p>快捷日期：</p>',
        '<p><a href="javascript:void(0)" class="quick-btn">昨天</a><a href="javascript:void(0)" class="quick-btn r">前天</a></p>',
        '<p><a href="javascript:void(0)" class="quick-btn">过去七天</a></p>',
        '<p><a href="javascript:void(0)" class="quick-btn">上周（周日到周六）</a></p>',
        '<p><a href="javascript:void(0)" class="quick-btn">上周（周一到周日）</a></p>'
        ];
      $dateWrapper.after($(quickBtnHTML.join('')));
      var $quickBtn = $customDate.find('.quick-btn');

      //初始化日期
      setDate(opt.defStartDate,opt.defEndDate);

      //主容器弹出
      var $quickDate = $customDate.find('.date-wrapper');
      $quickDate.bind('click', function(e) {
        $(this).siblings('.drop-down').slideToggle('fast',function(){
          $(this).siblings('.date-wrapper').find('i').toggleClass('up');
        });
      });

      //快捷按钮事件
      $quickBtn.die('click').bind('click', function(e) {
        //昨天日期按钮
        if($(this).text()=='昨天'){
          setDate(YESTERDAY,YESTERDAY);
        }
        //前天日期按钮
        if($(this).text()=='前天'){
          setDate(BEFORE_YESTERDAY,BEFORE_YESTERDAY);
        }
        //过去七天日期按钮
        if($(this).text()=='过去七天'){
          var STARTDAY_DATE = new Date(TODAY.getTime()-ONEDAY*7);
          var STARTDAY = STARTDAY_DATE.pattern("yyyy-MM-dd");
          setDate(STARTDAY,YESTERDAY);
        }
        //上周周日到周六按钮
        if($(this).text()=='上周（周日到周六）'){
          var ENDDAY_DATE = new Date(LASTDAYINLASTWEEK_DATE.getTime()-ONEDAY);
          var ENDDAY = ENDDAY_DATE.pattern("yyyy-MM-dd");
          var STARTDAY_DATE = new Date(LASTDAYINLASTWEEK_DATE.getTime()-ONEDAY*7);
          var STARTDAY = STARTDAY_DATE.pattern("yyyy-MM-dd");
          setDate(STARTDAY,ENDDAY);
        }
        //上周周一到周日按钮
        if($(this).text()=='上周（周一到周日）'){
          var ENDDAY = LASTDAYINLASTWEEK_DATE.pattern("yyyy-MM-dd");
          var STARTDAY_DATE = new Date(LASTDAYINLASTWEEK_DATE.getTime()-ONEDAY*6);
          var STARTDAY = STARTDAY_DATE.pattern("yyyy-MM-dd");
          setDate(STARTDAY,ENDDAY);
        }
        dropDownHide();
        return opt.callback();
      });
      //确定按钮点击事件
      $customDate.find('.act-btn.drop-down-btn:eq(0)').bind('click',function(){
        var $dataWrapper = $customDate.find('.dateWrapper');
        var STARTDAY = $dataWrapper.find('.ad-date:eq(0)').find('input').val();
        var ENDDAY = $dataWrapper.find('.ad-date:eq(1)').find('input').val();
        setDate(STARTDAY,ENDDAY);
        dropDownHide();
        return opt.callback();
      })
      //取消按钮点击事件
      $customDate.find('.act-btn.drop-down-btn.cancel').bind('click',function(){
        var $dataWrapper = $customDate.find('.dateWrapper');
        $dataWrapper.find('.ad-date:eq(0)').find('input').val('开始时间');
        $dataWrapper.find('.ad-date:eq(1)').find('input').val('结束时间');
        dropDownHide();
        return;
      })
      //设置时间
      function setDate(startDate,endDate){
        if(startDate!='开始时间'){
          $startDate.text(startDate);
        }
        if(endDate!='结束时间'){
          $endDate.text(endDate);
        }
      }
      //返回当前日期上一周的结束日期
      function getLastWeekEndDate(date){
        var dateIndex = date.getDay()-1;
        if(dateIndex==-1){
            dateIndex = 6;
        }
        var lastDayInLastWeek = new Date(date.getTime()-ONEDAY*(dateIndex+1));
        return lastDayInLastWeek;
      }
      //下拉菜单隐藏
      function dropDownHide(){
        $customDate.find('.drop-down').slideUp('fast')
                            .parent().find('.date-wrapper').find('i').toggleClass('up');
      }
    });
    /*outMethod*/
    var getStartDate = function() {
        return $(opt.container).find('.date-wrapper').find('span:eq(0)').text();
    }
    var getEndDate = function() {
        return $(opt.container).find('.date-wrapper').find('span:eq(2)').text();
    }
    return {
        startDate: getStartDate,
        endDate: getEndDate
    }
  }
})(jQuery);

// //快捷日期下拉组件
// adPlatform.quickDate = function() {
//   var $quickDate = $(".date-wrapper");
//   $quickDate.bind('click', function(e) {
//     $(this).siblings('.drop-down').slideToggle('fast',function(){
//       $(this).siblings('.date-wrapper').find('i').toggleClass('up');
//     });
//   });

//   //快捷日期按钮点击事件
//   var $customDate = $(".m-custom-date");
//   var $quickBtn = $customDate.find('.quick-btn');
//   var $startDate = $customDate.find('.date-wrapper').find('span:eq(0)');//起始日期容器
//   var $endDate = $customDate.find('.date-wrapper').find('span:eq(2)');//结束日期容器
//   var TODAY = new Date();
//   var ONEDAY = 60*60*24*1000;
//   var YESTERDAY_DATE = new Date(TODAY.getTime()-ONEDAY);
//   var YESTERDAY = YESTERDAY_DATE.pattern("yyyy-MM-dd");
//   var BEFORE_YESTERDAY_DATE = new Date(TODAY.getTime()-ONEDAY*2);
//   var BEFORE_YESTERDAY = BEFORE_YESTERDAY_DATE.pattern("yyyy-MM-dd");
//   var LASTDAYINLASTWEEK_DATE = getLastWeekEndDate(TODAY);
//   $quickBtn.die('click').bind('click', function(e) {
//     //昨天日期按钮
//     if($(this).text()=='昨天'){
//       setDate(YESTERDAY,YESTERDAY);
//       dropDownHide();
//       return;
//     }
//     //前天日期按钮
//     if($(this).text()=='前天'){
//       setDate(BEFORE_YESTERDAY,BEFORE_YESTERDAY);
//       dropDownHide();
//       return;
//     }
//     //过去七天日期按钮
//     if($(this).text()=='过去七天'){
//       var STARTDAY_DATE = new Date(TODAY.getTime()-ONEDAY*7);
//       var STARTDAY = STARTDAY_DATE.pattern("yyyy-MM-dd");
//       setDate(STARTDAY,YESTERDAY);
//       dropDownHide();
//       return;
//     }
//     //上周周日到周六按钮
//     if($(this).text()=='上周（周日到周六）'){
//       var ENDDAY_DATE = new Date(LASTDAYINLASTWEEK_DATE.getTime()-ONEDAY);
//       var ENDDAY = ENDDAY_DATE.pattern("yyyy-MM-dd");
//       var STARTDAY_DATE = new Date(LASTDAYINLASTWEEK_DATE.getTime()-ONEDAY*7);
//       var STARTDAY = STARTDAY_DATE.pattern("yyyy-MM-dd");
//       setDate(STARTDAY,ENDDAY);
//       dropDownHide();
//       return;
//     }
//     //上周周一到周日按钮
//     if($(this).text()=='上周（周一到周日）'){
//       var ENDDAY = LASTDAYINLASTWEEK_DATE.pattern("yyyy-MM-dd");
//       var STARTDAY_DATE = new Date(LASTDAYINLASTWEEK_DATE.getTime()-ONEDAY*6);
//       var STARTDAY = STARTDAY_DATE.pattern("yyyy-MM-dd");
//       setDate(STARTDAY,ENDDAY);
//       dropDownHide();
//       return;
//     }
//   });
//   //确定按钮点击事件
//   $(".act-btn.drop-down-btn:eq(0)").die('click').bind('click',function(){
//     var $dataWrapper = $(this).parent().siblings('.dateWrapper');
//     var STARTDAY = $dataWrapper.find('.ad-date:eq(0)').find('input').val();
//     var ENDDAY = $dataWrapper.find('.ad-date:eq(1)').find('input').val();
//     setDate(STARTDAY,ENDDAY);
//     dropDownHide();
//     return;
//   })
//   //取消按钮点击事件
//   $(".act-btn.drop-down-btn.cancel").die('click').bind('click',function(){
//     var $dataWrapper = $(this).parent().siblings('.dateWrapper');
//     $dataWrapper.find('.ad-date:eq(0)').find('input').val('开始时间');
//     $dataWrapper.find('.ad-date:eq(1)').find('input').val('结束时间');
//     dropDownHide();
//     return;
//   })
//   //设置时间
//   function setDate(startDate,endDate){
//     if(startDate!='开始时间'){
//       $startDate.text(startDate);
//     }
//     if(endDate!='结束时间'){
//       $endDate.text(endDate);
//     }
//   }
//   //返回当前日期上一周的结束日期
//   function getLastWeekEndDate(date){
//     var dateIndex = date.getDay()-1;
//     if(dateIndex==-1){
//         dateIndex = 6;
//     }
//     var lastDayInLastWeek = new Date(date.getTime()-ONEDAY*(dateIndex+1));
//     return lastDayInLastWeek;
//   }
//   //下拉菜单隐藏
//   function dropDownHide(){
//     $(".m-custom-date").find('.drop-down').slideUp('fast')
//                         .parent().find('.date-wrapper').find('i').toggleClass('up');
//   }
// };
//图片滚动组件
(function($) {
  var defaults = {
    num: 4, //默认滚动个数
    duration: 1000 // 持续时间

  };
  $.fn.scroll = function(opt) {
    var opts = $.extend({}, defaults, opt),
      obj;
    return this.each(function() {
      var _self = $(this),
        obj = new scrollFunc(_self, opts);
      obj.init();
    });
  }
  function scrollFunc(self, opts) {
    this._self = self;
    this._opts = opts;
  };
  scrollFunc.prototype = {
    init: function() {
      this.doStart();
      this.showImg();
    },
    doStart: function() {
      var _that = this;
      _pre = $('.m-scroll-left'),
      _next = $('.m-scroll-right'),
      _thisLi = _that._self.find('li'),
      _thisLength = _thisLi.size(),
      _thisWidth = _thisLi.outerWidth(true),
      _count = 0,
      _num = _that._opts.num,
      _thisLiWidth = _thisWidth * _thisLength,
      _vWidth = this._self.parent().width()
      _f = false,
      _t = true,
      _duration = _that._opts.duration;
      if (_thisLength<5) {
        _t = false
        _next.addClass('disable')
      }
      _pre.bind('click', function() {
        _that.doRight()

      });
      _next.bind('click', function() {
        _that.doLeft();

      })
    },
    doLeft: function() {
      if (_thisLength<5) {
        return 
      }
      if (_thisLiWidth - _vWidth - (-this._self.position().left) < _num * _thisWidth && !_f) {
        this._self.stop(true, true).delay(100).animate({
          left: "-=" + (_thisLiWidth - _vWidth - (-this._self.position().left))
        }, {
          duration: _duration
        });
        _f = true;
        _next.addClass('disable')
      } else if (!_f) {
        this._self.stop(true, true).delay(100).animate({
          left: "-=" + _num * _thisWidth
        }, {
          duration: _duration
        });
      };
      _t = true;
      _pre.removeClass('disable')

    },
    doRight: function() {
      if (_thisLength<5) {
        return 
      }
      if (_t && this._self.position().left > -_num * _thisWidth) {
        this._self.stop(true, true).delay(100).animate({
          left: 0
        }, {
          duration: _duration
        });
        _t = false;
        _pre.addClass('disable')
      } else if (_t) {
        this._self.stop(true, true).delay(100).animate({
          left: "+=" + _num * _thisWidth
        }, {
          duration: _duration
        });
      };
      _f = false;
      _next.removeClass('disable')
    },
    showImg: function() {
      var _that = this;
      _basePlace = _that._self.find('li').find('.base-img')
      _basePlace.eq(0).parent().append('<div class="selected"><i></i></div>')
      _targetPlace = $('.m-selected-image').find('.img > img');
      _targetPlace.attr({
        "src": _basePlace.find('img').eq(0).attr("src"),
        "title": _basePlace.find('img').eq(0).attr("title")
      })
      // _basePlace.find('img').eq(0).attr("src")
      // _basePlace.each(function(index) {
        $(document).delegate('.base-img','click',function(){
          _targetParent = $(this).parent()
          _targetPlace.attr({
            "src": $(this).find('img').attr("src"),
            'title': $(this).find('img').attr("title")
          });
          if (_targetParent.children('.selected').size() == 0) {
            _targetParent.append('<div class="selected"><i></i></div>')
            _targetParent.siblings().children('.selected').remove()
          };
        })
        // $(this).bind('click', function() {
        //   _targetParent = $(this).parent()
        //   _targetPlace.attr({
        //     "src": $(this).find('img').attr("src"),
        //     'title': $(this).find('img').attr("title")
        //   });
        //   if (_targetParent.children('.selected').size() == 0) {
        //     _targetParent.append('<div class="selected"><p class="text"><i></i>已选中</p><p class="bg"></p></div>')
        //     _targetParent.siblings().children('.selected').remove()
        //   };
        // })
      // })
    }
  }
})(jQuery);

//新建推广单元--添加关键词和类目
adPlatform.promoteTextarea = function() {
  //去除头尾空格
  String.prototype.trim = function() {  
    return (this.replace(/^\s+|\s+$/g,""));  
  }
  //文本输入区域
  var $keyword_textarea = $(".promote-textarea");
  //关键词计数
  var count_keyword = 0;
  //类目计数
  var count_category = 0;
  if(!$keyword_textarea.length>0){
    return false;
  }
  //文本域点击事件
  $keyword_textarea.die('click').live('click', function() {
    if($(this).find('input').length<=1){
      $(this).find('input:first').focus();
    }else{
      $(this).find('input:last').focus();
    }
  });
  //输入框
  var $keyword_input = $(".promote-textarea ul li input");
  $keyword_input.die('keydown').live('keydown', function(e) {
    //去掉出错提示
    $(".promote-textarea ul").find('strong').remove();
    var $new_line = $('<li class="item-keyword"><input type="text" class="item" maxlength="20" /><span><em></em><i></i></span></li>');
    var currentKey=0,e=e||event;
    currentKey=e.keyCode||e.which||e.charCode;
    //回车确认
    if(currentKey==13){
      this.blur();
    }
  });
  //文本框焦点事件
  $keyword_input.live('focus', function(e) {
    $(this).textFocus();
  });
  // //特殊字符高亮显示
  // $keyword_input.live('keyup', function(e) {
  //   var current_val = $(this).val();
  //   if(reg.test(current_val)||current_val.search('-')>-1){
  //     $(this).parent().addClass('error');
  //   }else{
  //     $(this).parent().removeClass('error');
  //   }
  // });
  // //删除操作
  // $keyword_input.live('keydown', function(e) {
  //   var current_val = $(this).val();
  //   var currentKey=0,e=e||event;   
  //   currentKey=e.keyCode||e.which||e.charCode;
  //   if(current_val==""){
  //     //关键词个数更新
  //     countUpdate();
  //     if(currentKey==8&&count_keyword>0){
  //       //取消事件的默认动作
  //       e.preventDefault();
  //       //将当前焦点移至上一个输入框
  //       $(this).parent('li').prev().find('input').show().textFocus()
  //                                   .siblings('span').hide();
  //       if($(this).index()!=0){
  //         return;
  //       }
  //       //删除当前输入框
  //       $(this).parent('li').remove();
  //     }
  //   }
  // });
  //输入框失去焦点事件
  $keyword_input.die('blur').live('blur', function(e) {
    //去掉出错提示
    $(".promote-textarea ul").find('strong').remove();
    var $new_line = $('<li class="item-keyword"><input type="text" class="item" maxlength="20" /><span><em></em><i></i></span></li>');
    //当前行input框内的值
    var confirm_val = $(this).val().trim();
    //判断特殊字符
    var reg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]","gi");
    confirm_val = confirm_val.replace(reg, " ").trim();
    //空值不允许保存
    if(confirm_val==""){
      $(this).textFocus();
      return false;
    }
    if(count_keyword>49){
      var $tip_num = $('<strong>对不起，您输入的关键词个数超出限制</strong>');
      $tip_num.appendTo($(".promote-textarea ul"));
      return false;
    }
    //如果输入有重复值，则无法添加并给予提示
    var curSelectedItems = $(".promote-textarea ul li").find('span').find('em');
    var $tip_repeat = $('<strong>对不起，您输入的条目已存在</strong>');
    var flag = true;
    curSelectedItems.each(function(index, el) {
      if($(this).text().trim()==confirm_val){
        flag = false;
      }
    });
    if(!flag){
      $tip_repeat.appendTo($(".promote-textarea ul"));
      $(this).textFocus();
      return false;
    }
    //数据匹配--禁用右侧表格中相同元素
    sameDataSelected(confirm_val);
    $(this).hide()
           .siblings('span').show()
           .find('em').text(confirm_val)
           .siblings('i').hide();
    if(!$(this).parent().next().length>0){
      //新增一行
      $(this).parent('li').after($new_line);
      //取消事件的默认动作
      e.preventDefault();
      //当前焦点移至新行
      $(this).parent('li').next().find('input').focus();
    }else{
      $(this).parent('li:last').find('input').focus();
    }
    //关键词个数更新
    countUpdate();
  });
  //文本域行
  var $keyword_item = $(".promote-textarea ul li span");
  $keyword_item.live('mouseover', function(e) {
    $(this).addClass('hover').find('i').show();
  });
  $keyword_item.live('mouseleave', function(e) {
    $(this).removeClass('hover').find('i').hide();
  });
  // //已确认元素修改
  // $keyword_item.live('click', function(e) {
  //   $(this).hide()
  //           .siblings('input').show().focus()
  //           // .find('em').text(confirm_val);
  // });
  //元素删除
  $keyword_item.find('i').live('click', function(e) {
    //去掉出错提示
    $(".promote-textarea ul").find('strong').remove();
    //保存当前删除元素值
    var confirm_val = $(this).siblings('em').text();
    //数据匹配--禁用右侧表格中相同元素
    var $data = $(".m-tab-con").find('.m-table.inner')
    $data.each(function(index, el) {
      var $sub_data = $(this).find('tr');
      $sub_data.each(function(index, el) {
        var name = $(this).find('td:first').text();
        if(name==confirm_val){
          $(this).removeClass('selected');
        }
      });
    });
    $(this).parent().parent().remove();
    //取消事件的默认动作
    e.preventDefault();
    //判断当前删除行的上一行是否为空行
    var $ul = $('.promote-textarea ul');
    if(!$ul.find('li:last').find('em').text()==''){//如果删除当前元素后，上一行不为空行则新增一行空行
      //新增一行
      $ul.append($('<li class="item-keyword"><input type="text" class="item" maxlength="20" /><span><em></em><i></i></span></li>'))                
    }
    $ul.find('li:last').find('input').textFocus();//当前焦点移至新行
    //关键词个数更新
    countUpdate();
  });
  //当前关键词个数更新
  function countUpdate(){
    //关键词个数
    count_keyword = $(".promote-textarea").find('li.item-keyword:not(:last)').length;
    count_category = $(".promote-textarea").find('li.item-category').length;
    //将当前个数更新至页面
    $('.promote-textarea-counter').find('p:first').find('em').text(count_keyword);
    $('.promote-textarea-counter').find('p:last').find('em').text(count_category);
    //确定按钮
    if(count_keyword>0||count_category>0){
      $(".editor-wrapper").children('.act').find('a').removeClass('disabled');
    }else{
      $(".editor-wrapper").children('.act').find('a').addClass('disabled');
    }
  }
  //匹配数据同时选中
  function sameDataSelected(_val){
    var $data = $(".m-tab-con").find('.m-table.inner')
    $data.each(function(index, el) {
      var $sub_data = $(this).find('tr');
      $sub_data.each(function(index, el) {
        var name = $(this).find('td:first').text();
        if(name==_val){
          $(this).addClass('selected');
        }
      });
    });
  }
  //相关词查询与关键词模板动态加载数据后，对已选择列表项进行过滤
  function dataFilter(){
    var $editorData = $(".promote-textarea ul").find('li').find('em');
    var $selectAreaData = $(".m-tab-con").find('.m-table.inner')
    $selectAreaData.each(function(index, el) {
      var $sub_data = $(this).find('tr');
      $sub_data.each(function(index, el) {
        var name = $(this).find('td:first').text();
        for (var i = 0; i < $editorData.length; i++) {
          var editorItem = $editorData.get(i).innerHTML;
          if(name==editorItem){
            $(this).addClass('selected');
          }
        };
      });
    });
  }
  //清空按钮
  var $clearBtn = $keyword_textarea.next('div').find('a');
  $clearBtn.bind('click', function() {
    var $new_line = $('<li class="item-keyword"><input type="text" class="item" maxlength="20" /><span><em></em><i></i></span></li>');
    $keyword_textarea.children('ul')
                      .empty()
                      .append($new_line)
                      .find('input').focus();
    //已选元素状态清除
    var $data = $(".m-tab-con").find('.m-table.inner')
    $data.each(function(index, el) {
      var $sub_data = $(this).find('tr');
      $sub_data.each(function(index, el) {
        $(this).removeClass('selected');
      });
    });
    //关键词个数更新
    countUpdate();
  });

  //系统推荐词、相关词查询、关键词模板表格鼠标点击事件
  var $keyword_list = $(".m-tab-con").find('.m-table.inner:not(.category)').find('tr:not(.selected)');
  $keyword_list.die('click').live('click', function(e) {
    //去掉出错提示
    $(".promote-textarea ul").find('strong').remove();
    if(count_keyword>49){
      var $tip_num = $('<strong>对不起，您输入的关键词个数超出限制</strong>');
      $tip_num.appendTo($(".promote-textarea ul"));
      return false;
    }
    //保存当前鼠标点击的列表项的值
    var _val = $(this).find('td:first').text();
    //数据匹配--禁用右侧表格中相同元素
    sameDataSelected(_val);
    //所选中项添加选中效果并移除单击事件
    $(this).addClass('selected').unbind('click');
    var $new_line = $('<li class="item-keyword"><input type="text" class="item" maxlength="20" /><span><em></em><i></i></span></li>');
    $new_line.appendTo('.promote-textarea ul')
              .find('input').hide()
              .parent().find('span').show()
              .find('em').text(_val)
              .siblings('i').hide();
    //判断当前插入行的上一行是否为空行
    if($new_line.prev('li').find('em').text()==''){
      $new_line.prev('li').remove();
    }
    //新增一行
    $('.promote-textarea ul').append($('<li class="item-keyword"><input type="text" class="item" maxlength="20" /><span><em></em><i></i></span></li>'))
                            .find('li:last').find('input').textFocus();//当前焦点移至新行
    //取消事件的默认动作
    e.preventDefault();
    //关键词个数更新
    countUpdate();
  });
  //系统推荐类目表格鼠标点击事件
  var $category_list = $(".m-tab-con").find('.m-table.inner.category').find('tr:not(.selected)');
  $category_list.die('click').live('click', function(e) {
    //去掉出错提示
    $(".promote-textarea ul").find('strong').remove();
    if(count_category>9){
      var $tip_num = $('<strong>对不起，您输入的类目个数超出限制</strong>');
      $tip_num.appendTo($(".promote-textarea ul"));
      return false;
    }
    //保存当前鼠标点击的列表项的值
    var _val = $(this).find('td:first').text();
    //所选中项添加选中效果并移除单击事件
    $(this).addClass('selected').unbind('click');
    var $new_line = $('<li class="item-category"><input type="text" class="item" maxlength="20" /><span><em></em><i></i></span></li>');
    $new_line.appendTo('.promote-textarea ul')
              .find('input').hide()
              .parent().find('span').show()
              .find('em').text(_val)
              .siblings('i').hide();
    //判断当前插入行的上一行是否为空行
    if($new_line.prev('li').find('em').text()==''){
      $new_line.prev('li').remove();
    }
    //新增一行
    $('.promote-textarea ul').append($('<li class="item-keyword"><input type="text" class="item" maxlength="20" /><span><em></em><i></i></span></li>'))
                            .find('li:last').find('input').textFocus();//当前焦点移至新行
    //取消事件的默认动作
    e.preventDefault();
    //关键词个数更新
    countUpdate();
  });
  
  //全部添加按钮事件
  var $keyword_act = $(".m-tab-con").find('.act').find('.opt-btn');
  $keyword_act.die('click').live('click', function(e) {
    $(this).parent('.act')
            .siblings('.m-table-wrapper')
            .find('.m-table.inner').find('tbody').find('tr:not(.selected)').click();
  });

};

//表格编辑按钮
adPlatform.tableTdModify = function() {
  //标准推广页面--表格--计划名称--鼠标点击修改
  $(".m-table.promote-plan").find('td.modify').find('span').die('click').live('click', function(event) {
    var _val = $(this).text();
    $(this).hide()
        .siblings('input').show().val(_val).textFocus()
        .unbind('keydown').bind('keydown', function(e) {//回车键确认
          var currentKey=0,e=e||event;   
            currentKey=e.keyCode||e.which||e.charCode;
            //回车确认
            if(currentKey==13){
              $(this).hide().siblings('span').text($(this).val()).show();
            }
        })
        .unbind('blur').bind('blur', function(e) {//输入框失去焦点事件
          $(this).hide().siblings('span').text($(this).val()).show();
        });
  });

  //新建推广单元--设置投放位置--表格编辑按钮事件
  var $promotePlaceTable = $(".m-table.inner.promote-place");
  $promotePlaceTable.find('tbody').find('tr').find('.opt-btn.edit').die('click').live('click', function(event) {
    $(this).closest('tbody').find('span').show().siblings('input').hide();//点击另一行时取消上一行的编辑状态
    var type = $(this).parent().siblings('td:eq(1)').text();//判断投放类别类型
    if(type=='类目'){
      $(this).parent().siblings('td:eq(2)')
              .find('span').hide()
              .siblings('input').show();//若投放类别为类目，则只能修改出价
    }else{
      $(this).parent().siblings('td')
              .find('span').hide()
              .siblings('input').show();//若投放类别为关键词，则能修改关键词名称和出价
    }
  });
  $promotePlaceTable.find('tbody').find('input').die('focus').live('focus', function(event) {
    var _val = $(this).val();
    $(this).textFocus()
            .unbind('keydown').bind('keydown', function(e) {//回车键确认
              var currentKey=0,e=e||event;   
                currentKey=e.keyCode||e.which||e.charCode;
                //回车确认
                if(currentKey==13){
                  $(this).hide().siblings('span').text($(this).val()).show();
                }
            });
  }).die('blur').live('blur', function(event) {
    var _val = $(this).val();
    $(this).hide()
        .siblings('span').show().text(_val);
  });
}

//投放报表横向滚动表格
adPlatform.xScrollTable = function() {
  var $xScrollTable = $(".m-table-xScroll");
  $xScrollTable.find('table tr').die('mouseover').live('mouseover',function() {
    var _index = $(this).index();
    $(this).closest('.m-table').parent().siblings().find('table').find('tr:eq('+_index+')').addClass('hover');
  }).die('mouseout').live('mouseout', function() {
    var _index = $(this).index();
    $(this).closest('.m-table').parent().siblings().find('table').find('tr:eq('+_index+')').removeClass('hover');
  });
};

//投放报表日期选择组件
(function($) {
  $.fn.setSingleDate = function(options) {
    var opt = $.extend({
        container: this.selector,
        dateCount: '',
        callback: function() {}
    }, options || {});
    
    $(opt.container).each(function(index, el) {
      var $singleDate = $(this);
      var $dateCount = $singleDate.find('span.count');//日期计算

      //初始化日期
      setDateCount(opt.dateCount);

      //主容器弹出
      var $quickDate = $singleDate.find('.date-wrapper');
      $quickDate.bind('click', function(e) {
        $(this).siblings('.drop-down-single').slideToggle('fast',function(){
          $(this).siblings('.date-wrapper').find('i').toggleClass('up');
        });
      });

      //确定按钮点击事件
      $singleDate.find('.act-btn.drop-down-btn:eq(0)').bind('click',function(){
        var $dataWrapper = $singleDate.find('.dateWrapper');
        dropDownHide();
        return opt.callback();
      })
      //取消按钮点击事件
      $singleDate.find('.act-btn.drop-down-btn.cancel').bind('click',function(){
        var $dataWrapper = $singleDate.find('.dateWrapper');
        dropDownHide();
        return;
      })
      //设置日期数
      function setDateCount(count){
        $dateCount.text(opt.dateCount);
      }
      //下拉菜单隐藏
      function dropDownHide(){
        $singleDate.find('.drop-down-single').slideUp('fast')
                            .parent().find('.date-wrapper').find('i').toggleClass('up');
      }
    });
    /*outMethod*/
    var getDate = function() {
        return $(opt.container).find('.ad-date').find('input').val();
    }
    return {
        date: getDate
    }
  }
})(jQuery);

//投放报表下拉菜单radio事件
adPlatform.radioBoxBtn = function() {
  $(".ui-select").die('click').live('click', function(event) {
    $(this).prev('.radio-btn').addClass('checked')
           .siblings('.radio-btn').removeClass('checked');
  });

  $(".m-single-date").die('click').live('click', function(event) {
    $(this).prev('.radio-btn').addClass('checked')
           .siblings('.radio-btn').removeClass('checked');
  });
};

//投放报表更多数据
adPlatform.moreData = function() {
  var $moreData = $(".dialog.more-data");//更多数据--主窗体
  var $itemList = $moreData.find('.item-list');//更多数据--选择度量
  var $resultList = $moreData.find('.result-list');//更多数据--默认列表
  var $tableWrapper = $(".m-table-wrapper.chart");//获取表格主窗体
  var $scrollTable = $(".m-table.xScroll");//获取滚动表格
  var $fixedTable = $(".m-table.fixed");//获取固定表格
  var $th = $scrollTable.find('th');
  var th_name_arr = [];//定义数组存取滚动表格表头名称
  var WIDTH = $scrollTable.width();//保存滚动表格初始宽度
  $th.each(function(index, el) {
    var name = $(this).find('span').text();
    if(name!='操作'){
      th_name_arr.push(name);
    }
  });
  initList(th_name_arr);//初始化更多数据列表

  //选择度量按钮事件
  $itemList.find('.checkbox-btn').unbind('click').bind('click', function(event) {
    if($(this).attr('checked')=='checked'){
      var name = $(this).siblings('label').text();
      $resultList.find('li').filter(function(){
        if($(this).text()==name){
          return this;
        }
      }).hide();
    }else{
      var name = $(this).siblings('label').text();
      $resultList.find('li').filter(function(){
        if($(this).text()==name){
          return this;
        }
      }).show();
    }
  });
  //确定按钮事件
  $moreData.find('.act-btn.confirm').unbind('click').bind('click', function(event) {
    var result_arr = [];
    $resultList.find('li:hidden').each(function(index, el) {
      result_arr.push($(this).text());
    });
    resetTable(result_arr);//滚动表格重新渲染
    $moreData.hide();
  });
  //取消按钮事件
  $moreData.find('.act-btn.cancel').bind('click', function(event) {
    resetList();
  });
  //关闭按钮事件
  $moreData.find('.close').find('i').bind('click', function(event) {
    resetList();
  });

  //初始化列表
  function initList(arr){
    $itemList.empty();
    $resultList.empty();
    for (var i = 0; i < arr.length; i++) {
      var $item = $('<li><a href="javascript:void(0)" class="checkbox-btn"></a><label>'+arr[i]+'</label></li>');
      var $result = $('<li>'+arr[i]+'</li>');
      $itemList.append($item);
      $resultList.append($result);
    };
    $itemList.find('.checkbox-btn').click();
  }
  //根据当前表格状态匹配更多数据显示结果
  function resetList(){
    var $cur_th = $scrollTable.find('th:visible');//获取当前显示的表格列
    var cur_th_arr = [];//定义数组保存当前显示的表格列名称
    $cur_th.each(function(index, el) {
      var name = $(this).find('span').text();
      if(name!='操作'){
        cur_th_arr.push(name);
      }
    });
    //选择度量列表根据当前表格状态匹配显示结果
    $itemList.find('li').each(function(index, el) {
      $(this).find('label').removeClass('checked')
             .siblings('a').removeClass('checked').removeAttr('checked');//重置列表状态
      for (var i = 0; i < cur_th_arr.length; i++) {
        if($(this).find('label').text()==cur_th_arr[i]){
          $(this).find('label').addClass('checked')
                 .siblings('a').addClass('checked').attr('checked','checked');//根据当前表格状态显示匹配元素
        }
      };
    });
    //默认列表根据当前表格状态匹配显示结果
    $resultList.find('li').each(function(index, el) {
      $(this).hide();//重置列表状态
      for (var i = 0; i < cur_th_arr.length; i++) {
        if($(this).text()==cur_th_arr[i]){
          $(this).show();//根据当前表格状态显示匹配元素
        }
      };
    });
  }
  //滚动表格重新渲染
  function resetTable(arr){
    $scrollTable.find('th').show();
    $scrollTable.find('td').show();
    var index_arr = [];//定义数组存取隐藏列索引
    for (var i = 0; i < arr.length; i++) {
      $scrollTable.find('th').each(function(index, el) {
        if($(this).find('span').text()==arr[i]){
          var _index = $(this).index();
          index_arr.push(_index);
          $(this).hide();
        }
      });
    };
    $scrollTable.find('tr:not(:first)').each(function(index, el) {
      for (var i = 0; i < index_arr.length; i++) {
        $(this).find('td:eq('+index_arr[i]+')').hide();
      };
    });
    var count = index_arr.length;//保存隐藏列个数
    var minWidth = $tableWrapper.width()-$fixedTable.width();//保存最小宽度
    var resizeWidth = WIDTH-80*count;
    if(resizeWidth<minWidth){
      resizeWidth = minWidth-2;
    }
    $scrollTable.css("width",resizeWidth);
  }

};



$(function() {
  
  //新版顶部工具栏
  adPlatform.adToptool();
  //新版导航
  adPlatform.adNav();
  //新版menu
  adPlatform.adSidebar();
  //关键词模板
  adPlatform.keywordTemplate();
  //表格效果
  adPlatform.adTable();
  //带滚动条表格宽度匹配
  adPlatform.scrollTable();
  //checkbox按钮效果
  adPlatform.checkboxBtn();
  //按钮弹出窗口
  adPlatform.btnDialog();
  //新建推广单元--添加关键词和类目
  adPlatform.promoteTextarea();
  //新版tab
  adPlatform.adTab();
  //投放报表横向滚动表格
  adPlatform.xScrollTable();
  //投放报表下拉菜单radio事件
  adPlatform.radioBoxBtn();
  //投放报表更多数据
  adPlatform.moreData();

  //input焦点移至文本最后
  $.fn.textFocus=function(v){
    var range,len,v=v===undefined?0:parseInt(v);
    this.each(function(){
      if($.browser.msie){
        range=this.createTextRange();
        v===0?range.collapse(false):range.move("character",v);
        range.select();
      }else{
        len=this.value.length;
        v===0?this.setSelectionRange(len,len):this.setSelectionRange(v,v);
      }
      this.focus();
    });
    return this;
  }

  //表格头部帮助说明tip
  $(document).mouseover(function(e){
    var e = e || event;
    var target = e.srcElement || e.target;
    if (!$(target).hasClass('m-helpful')) {
      $('.m-helpful').children().hide();
    }else{
      e.stopPropagation()
      $('.m-helpful').children().css('display','none');
      $(target).children().css('display','block');
      var _width = $(target).find('span').width();
      var _height = $(target).find('span').height();
      var max_width = 300;
      var ratio = Math.ceil(_width/max_width);
      if(_width>max_width){
        $(target).find('span').css({
          'width': max_width+'px',
          'white-space': 'normal',
          'text-align': 'left'
        });
        $(target).find('p').css({
          'top': -1*ratio*_height-27
        });
      }
    }
  })
  //按钮dialog鼠标点击空白事件
  $(document).click(function(e){
      var e = e || event;
      var target = e.srcElement || e.target;
      if($(target).closest('.dialog-btn-wrapper').length==0) {
        $('.dialog').hide();
      }
  })
  $(document).bind('click',function(e){
      var e = e || event;
      var target = e.srcElement || e.target;
      if($(target).closest('.m-custom-date').length==0) {
        $('.drop-down').slideUp('fast',function(){
          $(this).siblings('.date-wrapper').find('i').removeClass('up');
        })
      }
  })
  $(document).bind('click',function(e){
      var e = e || event;
      var target = e.srcElement || e.target;
      if($(target).closest('.m-single-date').length==0) {
        $('.drop-down-single').slideUp('fast',function(){
          $(this).siblings('.date-wrapper').find('i').removeClass('up');
        })
      }
  })
  //图片滚动组件调用
  $(".m-scroll-area-ul").scroll({
    num: 4,
    duration: 300
  })

});

/*
日期时间格式化
 */
Date.prototype.pattern=function(fmt) {    
    var o = {       
      "M+" : this.getMonth()+1, //月份       
      "d+" : this.getDate(), //日       
      "h+" : this.getHours() == 0 ? 12 : this.getHours(), //小时       
      "H+" : this.getHours(), //小时       
      "m+" : this.getMinutes(), //分       
      "s+" : this.getSeconds(), //秒       
      "q+" : Math.floor((this.getMonth()+3)/3), //季度       
      "S" : this.getMilliseconds() //毫秒       
    };    
    var week = {"0":"\u65e5","1":"\u4e00","2":"\u4e8c","3":"\u4e09","4":"\u56db","5":"\u4e94","6":"\u516d"};       
    if(/(y+)/.test(fmt)){       
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));       
    }       
    if(/(E+)/.test(fmt)){       
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "\u661f\u671f" : "\u5468") : "")+week[this.getDay()+""]);       
    }       
    for(var k in o){       
        if(new RegExp("("+ k +")").test(fmt)){       
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));       
        }     
    }    
    var m = {
        "s":"m",
        "d":"h"
    };
    return fmt;       
}
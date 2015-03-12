(function($) {
    $.fn.setSelect = function(options) {
        var opt = $.extend({
            container: this.selector,
            optionList: [],
            type: 0,
            arrowHover: '',
            defaultVal: 0,
            selectWidth:'',
            handleStyle: '',
            defaultText:'',
            //height:'middle',
            mouseover: function() {},
            mouseout: function() {},
            mousemove: function() {},
            callback: function() {}
        }, options || {});
        $(opt.container).addClass('ui-select');
        opt.type == 0 ? $(opt.container).addClass('single-colspan') : $(opt.container).addClass('multi-colspan');
        !!opt.height ? $(opt.container).addClass(opt.height) : null;
        $(opt.container).html('').html('<a class="s-option" href="javascript:void(0)"></a> <i class="arrow-dn"></i>');
        $(opt.container).find('.s-option').attr('val', opt.defaultVal);
        for (var i = 0; i < opt.optionList.length; i++) {
            if (opt.optionList[i].value == opt.defaultVal) {
                $(opt.container).find('.s-option').text(opt.optionList[i].text);
            }else{
                $(opt.container).find('.s-option').text(opt.optionList[0].text);
            }
        }
        if(opt.defaultText!=''){
            $(opt.container).find('.s-option').text(opt.defaultText);
        }
        $(opt.container).each(function() {
            var _time, arrow = $(opt.container).find('i');
            $(opt.container).append('<ul name="sn_select"></ul>');
            var selectList = $(opt.container).find('ul');
            if(opt.selectWidth){
                $(opt.container).width(opt.selectWidth);
            }
            selectList.width(($(opt.container).width() - 2) + 'px');
            for (var i = 0; i < opt.optionList.length; i++) {
                var _o = opt.optionList[i];
                if (!!_o.disabled && _o.disabled == 'true') {
                    selectList.append('<li name="sn_select" class="forbidden">'+ _o.text + '</li>');
                } else {
                    selectList.append('<li><a name="sn_select" val="' + _o.value + '" title="' + _o.text + '">' + _o.text + '</a></li>');
                }
            };
            if(opt.handleStyle=="click"){
                $(opt.container).bind({
                    click: function(e) {
                        var target = e.target || e.srcElement;
                        if(target.className != 's-option') return;
                        if (!opt.arrowHover || opt.arrowHover == '') {
                            $(arrow).addClass('arrow-hover');
                        } else {
                            $(arrow).addClass(opt.arrowHover);
                        }
                        selectList.show();
                        clearTimeout(_time);
                    },
                    mouseleave: function(e) {
                        var target = e.target || e.srcElement;
                        if(target.className != 's-option' && $(target).attr('name') != 'sn_select') return;
                        if(!!e.toElement && e.toElement.className == 'arrow-dn') return;
                        _time = setTimeout(function() {
                            if (!opt.arrowHover || opt.arrowHover == '') {
                                $(arrow).removeClass('arrow-hover');
                            } else {
                                $(arrow).removeClass(opt.arrowHover);
                            }
                            selectList.hide();
                        }, 0);
                    }
                });
            }else{
                $(opt.container).bind({
                    mouseenter: function(e) {
                        var target = e.target || e.srcElement;
                        if(target.className != 's-option') return;
                        if (!opt.arrowHover || opt.arrowHover == '') {
                            $(arrow).addClass('arrow-hover');
                        } else {
                            $(arrow).addClass(opt.arrowHover);
                        }
                        selectList.show();
                        clearTimeout(_time);
                    },
                    mouseleave: function(e) {
                        var target = e.target || e.srcElement;
                        if(target.className != 's-option' && $(target).attr('name') != 'sn_select') return;
                        if(!!e.toElement && e.toElement.className == 'arrow-dn') return;
                        _time = setTimeout(function() {
                            if (!opt.arrowHover || opt.arrowHover == '') {
                                $(arrow).removeClass('arrow-hover');
                            } else {
                                $(arrow).removeClass(opt.arrowHover);
                            }
                            selectList.hide();
                        }, 0);
                    }
                });
            }
            //获取选择的值
            selectList.delegate('a', 'click', function() {
                var option = $(this).text();
                $(opt.container).find('.s-option').attr('val', $(this).attr('val'));
                $(opt.container).find('.s-option').text(option);
                selectList.slideUp('fast');
                return opt.callback(option);
            });
            selectList.find('li').not('.forbidden').bind({
                mouseenter: function() {
                    $(this).addClass('cur');
                    opt.mouseover.apply($(this).find('a'));
                },
                mousemove: function(){
                	opt.mousemove.apply($(this).find('a'));
                },
                mouseleave: function() {
                    $(this).removeClass('cur');
                    opt.mouseout.apply($(this).find('a'));
                }
            });
        });
        if (!!opt.selectWidth) {
            $(opt.container).css('width', opt.selectWidth + 'px');
            if (!!opt.type && opt.type == 1) {
                $(opt.container).find('.s-option').css('width', (opt.selectWidth - 10) + 'px');
            } else {
                $(opt.container).find('a').css('width', (opt.selectWidth - 10) + 'px');
                $(opt.container).find('ul').css('width', opt.selectWidth + 'px');
            }
        }
        /*outMethod*/
        var getVal = function() {
            return $(opt.container).find('.s-option').attr('val');
        }
        var getText = function() {
            return $(opt.container).find('.s-option').html();
        }
        return {
            val: getVal,
            text: getText
        }
    }
})(jQuery);


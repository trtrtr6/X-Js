;(function($){
  "use strict";
  var defaults = {
    key: "",
    keyword:"",
    city: "",
    onSearchComplete: null
  };
  function Inputtips($ele, options) {
    this.$ele = $ele;
    this.options = options = $.extend(defaults, options || {});
    this.$inputtipsdiv=null;
    this.index=-1;
    this.init();
  }
  Inputtips.prototype={
    constructor:Inputtips,
    init:function(){
      if(this.$ele.length==0){
        return;
      }
      this.renderHtml();
      this.bindInputEvent();
    },
    renderHtml:function(){
      //获取绑定元素的位置以及宽高
      var offset = this.$ele.offset();
      var l = offset.left,
          t = offset.top,
          w = this.$ele.outerWidth(true),
          h = this.$ele.outerHeight(true);
      var input_id = this.$ele.attr("id");
      if(!this.isNotEmpty(input_id)){
        input_id = parseInt(Math.random()*1000000);
      }
      var tips_id = "inputtips-main_"+input_id;
      if($("#"+tips_id).length>0){
        $("#"+tips_id).remove();
      }
      var tipsdiv = $("<div id='"+tips_id+"' class='inputtips-main' style='left:"+l+"px;top:"+(t+h-1)+"px;width:"+w+"px;'><ul></ul></div>");
      $("body").append(tipsdiv);
      this.$inputtipsdiv = $("#"+tips_id);
    },
    bindInputEvent:function(){
      var self = this;
      var options = this.options;
      var key = options.key;
      if(!this.isNotEmpty(key)){
        return;
      }
      self.$ele.bind("keyup",function(e){
        var keyCode = e.keyCode;
        var isShow = "block"==self.$inputtipsdiv.css("display")?true:false;
        var tipsCount = self.$inputtipsdiv.find("ul>li").length;
        if(keyCode == 13){
          if(isShow){
            self.selectTip(self.$inputtipsdiv.find("ul>li").eq(self.index));
            self.$ele.blur();
          }
          return;
        }else if(keyCode==38 && isShow){//向上
          self.index--
          if(self.index==-1){
            self.index=(tipsCount-1);
          }
          self.selectTip(self.$inputtipsdiv.find("ul>li").eq(self.index));
          return;
        }else if(keyCode == 40 && isShow){//向下
          self.index++;
          if(self.index==tipsCount){
            self.index=0;
          }
          self.selectTip(self.$inputtipsdiv.find("ul>li").eq(self.index));
          return;
        }else if(keyCode == 9){
          return;
        }
        var keyword = $(this).val();
        if(keyword.length==0){
          self.$inputtipsdiv.find("ul").html("");
          return;
        }else{
          keyword = self.keyword = ($(this).val()||self.keyword).replace(/\s+/g, "");
        }
        var city = options.city.replace(/\s+/g, "");
        if(keyword.length==0){
          self.$inputtipsdiv.find("ul").html("");
          return;
        }
        //获取tips数据
        self.getTipsdata(keyword,city);
      }).bind("blur",function(){
        if("block"==self.$inputtipsdiv.css("display")){
          setTimeout(function(){
            self.hide(); 
          },100);
        }
      });
    },
    getTipsdata:function(keyword,city){
      var self = this;
      var key = self.options.key;
      var callback = this.options.onSearchComplete;
      $.ajax({
        type: "GET",
        url: "http://restapi.amap.com/v3/assistant/inputtips?key="+key+"&keywords="+encodeURI(keyword)+"&types=&location=&city="+encodeURI(city)+"&datatype=poi",
        dataType:'jsonp',
        success: function(ret){
          if(ret.status == "1"){
            var reaultlist = "";
            var tips = ret.tips;
            for(var i=0;i<tips.length;i++){
              var showTip = (tips[i].address+tips[i].name).replace(eval('/'+keyword+'/'),"<b>"+keyword+"</b>");
              reaultlist += "<li class='inputtips-main-tip' val='"+tips[i].address+tips[i].name+"'>"+showTip+"</li>";
            }
            if(self.$inputtipsdiv){
              self.$inputtipsdiv.find("ul").html("").html(reaultlist);
              self.bindTipsEvent(self);
              self.index=-1;
              self.show();
            }
            //回调函数返回数据
            if(typeof callback == "function"){
              callback(ret);
            }
          }
        }
      });
    },
    bindTipsEvent:function(self){
      self.$inputtipsdiv.find("ul>li").unbind("click").bind("click",function(){
        self.selectTip($(this));
      });
      self.$inputtipsdiv.find("ul>li").mouseenter(function() {
        var k = $(this).parent().find("li").index($(this));
        self.index=k;
        $(this).css("background","#e8e8e8").siblings().css("background", "");
      });
      self.$inputtipsdiv.mouseleave(function(){
        self.index=-1;
        $(this).find("ul>li").css("background","")
      });
    },
    selectTip:function($obj){
      $obj.css("background","#e8e8e8").siblings().css("background", "");
      this.$ele.val($obj.attr("val"));
    },
    setCity:function(city){
      this.options.city = city;
    },
    show:function(){
      this.$inputtipsdiv.show();
    },
    hide:function(){
      this.$inputtipsdiv.hide();
    },
    destory:function(){
      this.$inputtipsdiv.remove();
    },
    isNotEmpty : function(value) {
      return value != null && value != "" && value != undefined && value != "undefined"
    }
  }
  $.fn.inputtips = function (options) {
    options = $.extend(defaults, options || {});
    return new Inputtips($(this), options);
  }
  $.extend({
    seachTips:function(options){
      options = $.extend(defaults, options || {})
      var key = options.key;
      var callback = options.onSearchComplete;
      var keyword = options.keyword;
      var city = options.city;
      if(!(key&&key.length>0)||!(city&&city.length>0)){
        return;
      }
      $.ajax({
        type: "GET",
        url: "http://restapi.amap.com/v3/assistant/inputtips?key="+key+"&keywords="+encodeURI(keyword)+"&types=&location=&city="+encodeURI(city)+"&datatype=poi",
        dataType:'jsonp',
        success: function(ret){
          if(ret.status == "1"){
            //回调函数返回数据
            if(typeof callback == "function"){
              callback(ret);
            }
          }
        }
      });
    }
  })
})(jQuery);

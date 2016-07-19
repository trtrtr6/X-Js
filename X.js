(function(factory){
  //facctory的值为下面的function(XExports){}，所以factory是一个函数，而XExports为其参数
  if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
      var target = module['exports'] || exports; // module.exports is for Node.js
      factory(target);
  } else if (typeof define === 'function' && define['amd']) {
      define(['exports'], factory);
  } else {
    factory(window['X'] = {
      Version:'0.0.1',
      IE : !!(window.attachEvent && !window.opera), //判断ie
      Webkit :  navigator.userAgent.toLowerCase().indexOf(' applewebkit/') > -1,  //判断webkit内核
      StringUtils:{
        //是否为字符串
        isString: function(obj){
          return typeof obj === "string";
        },
        //字符串是否为空
        isNotEmpty:function(str){
          return str != null && str != "" && str != undefined && str != "undefined"
        },
        //去掉字符串两边的空格
        trim: function(str){
          if(this.isNotEmpty(str)){
            return str.replace(/(^\s*)|(\s*$)/g, '');
          }
        },
        //去掉字符串中所有的空格
        trimAll:function(str){
          if(this.isNotEmpty(str)){
            return str.replace(/\s*/g, '');
          }
        },
        //截取指定字符之间的字符串/截取指定字符串字符下标之间的字符串(当只指定一个下标/字符的时候可指所要截取的字符串长度)
        subString : function(begin,end,length){

        }
      },
      DateUtils:{
        weekArr:['/u65e5','/u4e00','/u4e8c','/u4e09','/u56db','/u4e94','/u516d'],
        //获取当前的年份(datetime传值时，获取与之对应时间参数)
        getYear : function(datetime){
          var time = this.getDateTime(datetiem);
          return time.getFullYear();
        },
        //获取当前的月份(datetime传值时，获取与之对应时间参数)
        getMonth : function(datetime){
          var time = this.getDateTime(datetiem);
          return time.getMonth() + 1;
        },
        //获取当前日期的星期(datetime传值时，获取与之对应时间参数)
        getWeek : function(datetime){
          return this.weekArr[this.getWeekIndex(datetime)-1];
        },
        //获取当前日期是当月的第几天(datetime传值时，获取与之对应时间参数)
        getDate : function(datetime){
          var time = this.getDateTime(datetiem);
          return time.getDate();
        },
        //获取当前日期的小时(datetime传值时，获取与之对应时间参数)
        getHours : function(datetime,is_12){
          var time = this.getDateTime(datetiem);
          var hours = time.getHours();
          if(is_12){
            return hours%12 == 0 ? 12 : hours%12;
          }
          return hours;
        },
        //获取当前日期的分钟数(datetime传值时，获取与之对应时间参数)
        getMinutes : function(datetime){
          var time = this.getDateTime(datetiem);
          return time.getMinutes();
        },
        //获取当前日期的秒数(datetime传值时，获取与之对应时间参数)
        getSeconds : function(datetime){
          var time = this.getDateTime(datetiem);
          return time.getSeconds();
        },
        //获取当前日期的毫秒数
        getMilliseconds : function(datetime){
          var time = this.getDateTime(datetiem);
          return time.getMilliseconds();
        },
        //获取当前日期是该星期的第几天(datetime传值时，获取与之对应时间参数)
        getWeekIndex : function(datetime){
          var time = this.getDateTime(datetiem);
          return time.getday()+1;
        },
        //获取当前日期(通过相关格式)(datetime传值时，获取与之对应时间参数)
        //format相关参数值 "yyyy-MM-dd", "yyyy-MM-dd HH:mm:ss"
        getDateFormat : function(datetime,format){
          var time = this.getDateTime(datetiem);
          var o = {
             "M+" : this.getMonth(time), //月份
             "d+" : this.getDate(time), //日
             "h+" : this.getHours(time,true), //小时
             "H+" : this.getHours(time), //小时
             "m+" : this.getMinutes(time), //分
             "s+" : this.getSeconds(time), //秒
             "q+" : Math.floor((this.getMonth()+3)/3), //季度
             "S" : this.getMilliseconds(time) //毫秒
          };

          if(/(y+)/.test(fmt)){
            fmt=fmt.replace(RegExp.$1, (this.getYear(time)+"").substr(4 - RegExp.$1.length));
          }
          if(/(E+)/.test(fmt)){
            fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+weekArr[this.getWeekIndex(time)-1]);
          }
          for(var k in o){
            if(new RegExp("("+ k +")").test(fmt)){
              fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
          }
          return fmt;
        },
        //获取当前日期的时间戳(datetime传值时，获取与之对应时间参数)
        getTimestamp : function(datetime,isAddMillisecond){
          var time = this.getDateTime(datetiem);
          var timeStamp = time.getTime();
          if (isAddMillisecond) {
            return timeStamp;
          }
          return timeStamp/1000;
        },
        //获取当前日期(datetime传值时，获取与之对应时间参数)
        getDateTime : function(datetiem){
          return datetime ? datetime : new Date();
        }
      },

      //页面加载完成的可执行入口
      ready : function(fn){
        if (!this.IE && !this.Webkit && document.addEventListener)  // addEventListener mozilla
          return document.addEventListener('DOMContentLoaded', fn, false);
        if (this.IE) (function(){
          try {
            document.documentElement.doScroll('left');
            fn();
          }catch (err){
            setTimeout(arguments.callee, 0);
          }
        }
        )();
        else if (this.Webkit)
          var t = setInterval(function(){
            if (/^(loaded|complete)$/.test(document.readyState))
            clearInterval(t),fn();
          },0);
      }
    });
  }
})(function(XExports){
  //X的全局定义,对js一些重要类型的方法封装
  var X = typeof XExports !== 'undefined' ? XExports : {};

  $_fn = function(selectName){
    this.selectName = selectName,
    this.obj = this.selectElement()
  }
  //定义简单的X选择器
  $_fn.prototype={
    selectElement:function(){
      if(typeof this.selectName == 'object'){
        return this.selectName;
      }else if (this.selectName.indexOf('#') != -1) {
        return document.getElementById(this.selectName.replace('#',''));
      }else if (this.selectName.indexOf('.') != -1) {
        return document.getElementsByClassName(this.selectName.replace('.',''));
      }else{
        return document.getElementsByTagName(this.selectName);
      }
    },
    getSelectName : function(){
      return this.selectName;
    },
    html : function(val){
      if(val != undefined || val != null){
        this.obj[0].innerHTML = val
      }
      return this.obj[0].innerHTML;
    },
    text : function(val){
      if(val != undefined || val != null){
        this.obj[0].innerText = val
      }
      return this.obj[0].innerText;
    }
  }
  
  window['$X'] = function(selectName){return new $_fn(selectName)};
});



























/*js模块化封装实例(兼容CommonJS规范,AMD规范,CMD规范的JS写法)
//闭包执行一个立即定义的匿名函数
!function(factory) {

    //factory是一个函数，下面的koExports就是他的参数

    // Support three module loading scenarios
    if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
        // [1] CommonJS/Node.js
        // [1] 支持在module.exports.abc,或者直接exports.abc
        var target = module['exports'] || exports; // module.exports is for Node.js
        factory(target);
    } else if (typeof define === 'function' && define['amd']) {
        // [2] AMD anonymous module
        // [2] AMD 规范
        //define(['exports'],function(exports){
           //    exports.abc = function(){}
        //});
        define(['exports'], factory);
    } else {
        // [3] No module loader (plain <script> tag) - put directly in global namespace
        factory(window['ko'] = {});
    }
}(function(koExports){

    //ko的全局定义 koExports是undefined 对应着上面的[3] 这种情况
    var ko = typeof koExports !== 'undefined' ? koExports : {};

    //定义一个ko的方法
    ko.abc = function(s){
        alert(s);
    }
});

//[3]中情况的调用
ko.abc("msg");  */

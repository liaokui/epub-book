(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-013d5a97"],{"05a9":function(e,t,s){"use strict";var i=s("9421"),a=s.n(i);a.a},6111:function(e,t,s){"use strict";s.r(t);var i=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{attrs:{id:"list"}},[s("header",{staticClass:"clearfix"},[s("div",{staticClass:"header"},[e._m(0),s("p",{staticClass:"exit",on:{click:function(t){return e.exit()}}},[s("i",{staticClass:"iconfont iconexit"})]),s("div",{staticClass:"search"},[s("el-input",{attrs:{placeholder:"请输入关键词","prefix-icon":"el-icon-search",size:"medium"},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.clearList()}},model:{value:e.keyword,callback:function(t){e.keyword=t},expression:"keyword"}})],1)])]),s("section",{staticClass:"container"},[s("el-scrollbar",{ref:"componentScrollBar",staticClass:"app-el-scrollbar",attrs:{id:"scrollCover"}},[s("div",{staticClass:"content clearfix"},[e._l(e.list,(function(t,i){return s("div",{key:i,staticClass:"book"},[s("el-card",[s("div",{staticClass:"cover"},[s("p",{staticClass:"delBtn",on:{click:function(s){return e.delBook(t._id)}}},[s("i",{staticClass:"el-icon-delete"})]),s("router-link",{attrs:{to:{path:"/detail",query:{id:t._id}}}},[s("el-image",{attrs:{src:e.imgReadUrl+t.cover,fit:"cover","preview-src-list":[e.imgReadUrl+t.cover]}})],1)],1)]),s("router-link",{attrs:{to:{path:"/detail",query:{id:t._id}}}},[s("p",{staticClass:"title wordOverFlow"},[e._v(e._s(t.title))])])],1)})),e.isUploading?s("div",{staticClass:"book"},[s("el-card",[s("p",{staticClass:"delBtn",on:{click:function(t){return e.delUploadingBook()}}},[s("i",{staticClass:"el-icon-close"})]),s("div",{staticClass:"cover"},[s("el-progress",{staticStyle:{"margin-top":"70px"},attrs:{percentage:e.progress,type:"circle"}})],1)])],1):e._e(),s("div",{directives:[{name:"show",rawName:"v-show",value:!e.isUploading,expression:"!isUploading"}],staticClass:"book"},[s("el-upload",{ref:"uploadBook",staticClass:"book-uploader",attrs:{action:e.uploadAction,headers:e.uploadHeaders,"show-file-list":!1,data:e.uploadData,"on-progress":e.uploading,"on-change":e.bookHandleChange,"on-success":e.bookHandleSuccess,"on-error":e.handleError,"before-upload":e.beforeBookUpload}},[s("div",{staticClass:"upload-book",attrs:{slot:"trigger"},slot:"trigger"},[s("i",{staticClass:"el-icon-plus"}),s("span",[e._v("点击上传图书")])])])],1),s("el-collapse-transition",[e.continueLoading?s("div",{staticClass:"load"},[s("i",{staticClass:"el-icon-loading"}),s("span",[e._v("加载中 ~~")])]):e._e()]),e.noMore?s("p",{staticClass:"nomore"},[e._v("没有更多了~~")]):e._e()],2),s("footer",[s("p",[e._v("Copyright © 2018 LK. All rights reserved.")])]),s("el-backtop",{attrs:{target:".el-scrollbar .el-scrollbar__wrap",bottom:40,"visibility-height":100}},[s("i",{staticClass:"el-icon-top"})])],1)],1)])},a=[function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"title"},[s("p",[s("i",{staticClass:"el-icon-reading"}),e._v("在线EPUB电子书")])])}],o=(s("99af"),s("d81d"),s("fb6a"),s("ac1f"),s("1276"),s("96cf"),s("1da1")),r=s("5f87"),n=s("b775");function l(e){return Object(n["a"])({url:"/api/book/find",method:"get",params:e})}function c(e){return Object(n["a"])({url:"/api/book/remove",method:"post",data:e})}var u=window.ePub,d={components:{},data:function(){return{uploadAction:"/api/upload/epub",uploadHeaders:{Authorization:Object(r["a"])()},keyword:null,isUploading:!1,list:[],imgReadUrl:"http://150.109.105.237:7002",uploadData:{name:"epub"},uploadFileList:[],progress:0,noMore:!1,isLoading:!0,continueLoading:!1,page:{num:0,size:10,total:null}}},created:function(){this.clearList()},methods:{clearList:function(){this.page.num=0,this.loading=!0,this.noMore=!1,this.list=[],this.getList()},getList:function(e){var t=this;if("load"===e&&(this.isLoading=!1,this.continueLoading=!0),"load"===e&&this.list.length>=this.page.total)return this.isLoading=!1,this.noMore=!0,this.continueLoading=!1,!0;this.page.num++;var s={keyword:this.keyword,pageNumber:this.page.num,pageSize:this.page.size};l(s).then((function(e){e&&"success"===e.status?e.data&&e.data.list&&Array.isArray(e.data.list)&&(t.list=t.list.concat(e.data.list.map((function(e){return e}))),t.page.total=e.data.count):t.$message({message:e.msg,type:"error"}),t.continueLoading=!1,t.isLoading=!0}),(function(e){t.$message({type:"error",message:e})}))},delBook:function(e){var t=this,s={id:e};this.$confirm("此操作将删除该图书, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){c(s).then((function(e){e&&"success"===e.status?(t.$message({message:e.msg,type:"success"}),t.clearList()):t.$message({message:e.msg,type:"error"})}),(function(e){t.message.error(e),t.loading=!1}))})).catch((function(){t.$message({type:"info",message:"已取消删除"})}))},exit:function(){Object(r["b"])(),Object(r["d"])(),Object(r["c"])(),this.$router.push({path:"/login"})},handleScroll:function(){var e=document.getElementById("scrollCover").querySelector(".el-scrollbar__bar").offsetTop,t=document.getElementById("scrollCover").querySelector(".is-vertical").querySelector(".el-scrollbar__thumb").offsetHeight,s=document.getElementById("scrollCover").querySelector(".is-vertical").querySelector(".el-scrollbar__thumb").style.transform.split("translateY(")[1].split("%")[0]/100,i=e-t*(1+s);this.isLoading&&i<100&&this.getList("load")},uploading:function(e,t){this.progress=parseInt(t.percentage)},bookHandleChange:function(e,t){this.uploadFileList=t.slice()},bookHandleSuccess:function(e){e&&"success"===e.status?(this.$message({message:e.msg,type:"success"}),this.isUploading=!1,this.clearList()):(this.$message({message:e.msg,type:"error"}),this.isUploading=!1)},beforeBookUpload:function(e){var t=this;return Object(o["a"])(regeneratorRuntime.mark((function s(){var i,a,r;return regeneratorRuntime.wrap((function(s){while(1)switch(s.prev=s.next){case 0:if(!e||"application/epub"!==e.type&&"application/epub+zip"!==e.type){s.next=10;break}return r=u(e),s.next=4,r.ready.then(function(){var e=Object(o["a"])(regeneratorRuntime.mark((function e(t){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,r.archive.getBase64(r.cover).then((function(e){i=t[2].title,a=e,r.destroy()}));case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}());case 4:return t.uploadData.title=i,t.uploadData.cover=a,t.isUploading=!0,s.abrupt("return",!0);case 10:return t.$message.error("上传的图书必须为epub格式!"),s.abrupt("return",!1);case 12:case"end":return s.stop()}}),s)})))()},handleError:function(){this.isUploading=!1,this.$message.error("上传出错")},delUploadingBook:function(){this.isUploading=!1,this.$refs.uploadBook.abort()},init:function(){window.addEventListener("scroll",this.handleScroll,!0)}},mounted:function(){this.$nextTick((function(){this.init()}))},destroyed:function(){window.removeEventListener("scroll",this.handleScroll,!0)}},p=d,g=p,h=(s("6ceb"),s("05a9"),s("2877")),f=Object(h["a"])(g,i,a,!1,null,"e8dd6bc0",null);t["default"]=f.exports},"6cb7a":function(e,t,s){},"6ceb":function(e,t,s){"use strict";var i=s("6cb7a"),a=s.n(i);a.a},9421:function(e,t,s){},fb6a:function(e,t,s){"use strict";var i=s("23e7"),a=s("861d"),o=s("e8b5"),r=s("23cb"),n=s("50c4"),l=s("fc6a"),c=s("8418"),u=s("b622"),d=s("1dde"),p=s("ae40"),g=d("slice"),h=p("slice",{ACCESSORS:!0,0:0,1:2}),f=u("species"),m=[].slice,v=Math.max;i({target:"Array",proto:!0,forced:!g||!h},{slice:function(e,t){var s,i,u,d=l(this),p=n(d.length),g=r(e,p),h=r(void 0===t?p:t,p);if(o(d)&&(s=d.constructor,"function"!=typeof s||s!==Array&&!o(s.prototype)?a(s)&&(s=s[f],null===s&&(s=void 0)):s=void 0,s===Array||void 0===s))return m.call(d,g,h);for(i=new(void 0===s?Array:s)(v(h-g,0)),u=0;g<h;g++,u++)g in d&&c(i,u,d[g]);return i.length=u,i}})}}]);
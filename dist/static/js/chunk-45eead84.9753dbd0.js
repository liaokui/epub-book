(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-45eead84"],{"08d1":function(e,t,n){"use strict";var o=n("b596"),r=n.n(o);r.a},1321:function(e,t,n){},"55d4":function(e,t,n){"use strict";var o=n("1321"),r=n.n(o);r.a},b596:function(e,t,n){},b775:function(e,t,n){"use strict";n("d3b7"),n("1ce0"),n("375c");var o=n("daa7"),r=n.n(o),a=n("cebe"),s=n.n(a),i=n("5f87"),l=n("a18c"),u=s.a.create({baseURL:Object({NODE_ENV:"production",VUE_APP_imgReadUrl:"http://150.109.105.237:72",BASE_URL:""}).BASE_API,timeout:15e3});u.interceptors.request.use((function(e){for(var t in e.data)""===e.data[t]&&(e.data[t]=null),Array.isArray(e.data[t])&&0==e.data[t].length&&(e.data[t]=null);for(var n in e.params)""===e.params[n]&&(e.params[n]=null),Array.isArray(e.params[n])&&0==e.params[n].length&&(e.params[n]=null);return void 0!==e.noToken&&e.noToken||!Object(i["a"])()||(e.headers["Authorization"]=Object(i["a"])()),delete e.noToken,e}),(function(e){Promise.reject(e)})),u.interceptors.response.use((function(e){return e.data}),(function(e){console.log(e.response);var t=e.response;return 401==t.status&&r.a.confirm("登录信息失效,将转跳登录页面","提示",{confirmButtonText:"确定",type:"warning",showCancelButton:!1,showClose:!1}).then((function(){setTimeout((function(){l["a"].push({path:"/login"})}),500)})).catch((function(){setTimeout((function(){l["a"].push({path:"/login"})}),500)})),Promise.reject(e)})),t["a"]=u},dc3f:function(e,t,n){"use strict";n.r(t);var o=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"login"}},[n("p",{staticClass:"title"},[e._v("EPUB在线电子书")]),n("el-card",{staticClass:"box-card loginCard"},[n("p",{staticClass:"title"},[e._v("登录")]),n("el-form",{ref:"loginForm",staticClass:"loginForm",attrs:{model:e.loginForm,rules:e.rules}},[n("el-form-item",{attrs:{prop:"username"}},[n("el-input",{attrs:{placeholder:"用户名"},model:{value:e.loginForm.username,callback:function(t){e.$set(e.loginForm,"username",t)},expression:"loginForm.username"}})],1),n("el-form-item",{attrs:{prop:"password"}},[n("el-input",{attrs:{type:"password",placeholder:"密码"},model:{value:e.loginForm.password,callback:function(t){e.$set(e.loginForm,"password",t)},expression:"loginForm.password"}})],1),n("el-form-item",[n("div",{staticClass:"validateBox clearfix"},[n("el-input",{attrs:{placeholder:"验证码"},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.handleForm("loginForm")}},model:{value:e.loginForm.code,callback:function(t){e.$set(e.loginForm,"code",t)},expression:"loginForm.code"}},[n("template",{slot:"append"},[n("span",{domProps:{innerHTML:e._s(e.codeHtml)},on:{click:function(t){return e.getCode()}}})])],2)],1)]),n("el-form-item",[n("el-button",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticClass:"submitBtn",attrs:{type:"primary"},on:{click:function(t){return e.handleForm("loginForm")}}},[e._v("登陆")])],1)],1),n("p",{staticClass:"tips"},[e._v("账号： admin 密码：123456")])],1)],1)},r=[],a=n("b775");function s(){return Object(a["a"])({url:"/api/getCaptcha",method:"get",noToken:!1})}function i(e){return Object(a["a"])({url:"/api/login",method:"post",data:e})}var l=n("5f87"),u={components:{},data:function(){return{codeHtml:null,loading:!1,loginForm:{username:null,password:null,code:null},rules:{username:[{required:!0,message:"用户名不能为空!",trigger:"blur"}],password:[{required:!0,message:"密码不能为空",trigger:"blur"}],code:[{required:!0,message:"验证码不能为空",trigger:"blur"}]}}},created:function(){this.getCode()},methods:{getCode:function(){var e=this;s().then((function(t){t&&(e.codeHtml=t)}),(function(t){e.$message.error(t)}))},handleForm:function(e){var t=this;this.$refs[e].validate((function(e){if(!e)return!1;var n={username:t.loginForm.username,password:t.loginForm.password,code:t.loginForm.code};t.loading=!0,i(n).then((function(e){t.loading=!1,e&&"success"===e.status?(t.$message({message:e.msg,type:"success"}),Object(l["e"])(e.token),Object(l["g"])(e.data.username),Object(l["f"])(e.data.uid),setTimeout((function(){t.$router.push({path:"/list"})}),500)):(t.$message({message:e.msg,type:"warning"}),t.getCode())}),(function(){t.$message({message:"请求失败!",type:"error"}),t.loading=!1,t.getCode()}))}))},init:function(){}},mounted:function(){this.$nextTick((function(){this.init()}))}},c=u,d=c,m=(n("55d4"),n("08d1"),n("2877")),p=Object(m["a"])(d,o,r,!1,null,"6e43fbe2",null);t["default"]=p.exports}}]);
(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-36ccc2ba"],{"0a09":function(e,t,r){"use strict";var a=r("c495"),n=r.n(a);n.a},"52ab":function(e,t,r){"use strict";r.d(t,"e",(function(){return n})),r.d(t,"a",(function(){return o})),r.d(t,"i",(function(){return i})),r.d(t,"b",(function(){return u})),r.d(t,"h",(function(){return s})),r.d(t,"c",(function(){return l})),r.d(t,"g",(function(){return c})),r.d(t,"f",(function(){return p})),r.d(t,"d",(function(){return f}));var a=r("9bd2");function n(e,t,r,n,o,i){return Object(a["a"])({url:"/user/group/page/query?name="+e+"&grpType="+t+"&workflow="+r+"&extend="+n+"&page="+o+"&length="+i,method:"get"})}function o(e){return Object(a["a"])({url:"/user/group/add",method:"post",data:e})}function i(e){return Object(a["a"])({url:"/user/group/update",method:"put",data:e})}function u(e){return Object(a["a"])({url:"/user/group/del?id="+e,method:"delete"})}function s(){return Object(a["a"])({url:"/user/group/ldap/sync",method:"get"})}function l(e,t){return Object(a["a"])({url:"/user/group/grant?userId="+e+"&userGroupId="+t,method:"get"})}function c(e,t){return Object(a["a"])({url:"/user/group/revoke?userId="+e+"&userGroupId="+t,method:"delete"})}function p(e,t,r){return Object(a["a"])({url:"/user/include/group/page/query?userId="+e+"&page="+t+"&length="+r,method:"get"})}function f(e,t,r,n){return Object(a["a"])({url:"/user/exclude/group/page/query?userId="+e+"&queryName="+t+"&page="+r+"&length="+n,method:"get"})}},be8d:function(e,t,r){"use strict";r.r(t);var a=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("d2-container",[[r("div",[r("h1",[e._v(e._s(e.title))])]),r("div",{staticStyle:{"margin-bottom":"5px"}},[r("el-row",{staticStyle:{"margin-bottom":"5px"},attrs:{gutter:24}},[r("el-input",{staticStyle:{display:"inline-block","max-width":"200px","margin-left":"10px"},attrs:{placeholder:"输入关键字查询用户组"},model:{value:e.queryParam.name,callback:function(t){e.$set(e.queryParam,"name","string"===typeof t?t.trim():t)},expression:"queryParam.name"}}),r("el-button",{staticStyle:{"margin-left":"5px"},on:{click:e.fetchData}},[e._v("查询")]),r("el-button",{staticStyle:{"margin-left":"5px"},on:{click:e.syncLdapUserGroup}},[e._v("同步")])],1)],1),r("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticStyle:{width:"100%"},attrs:{data:e.tableData}},[r("el-table-column",{attrs:{type:"expand"},scopedSlots:e._u([{key:"default",fn:function(t){return[r("el-form",{staticClass:"table-expand",attrs:{"label-position":"left",inline:""}},[r("el-form-item",{attrs:{label:"用户成员"}},[r("div",{staticClass:"tag-group"},e._l(t.row.users,(function(t){return r("el-tag",{key:t.id,staticStyle:{"margin-left":"5px"}},[e._v(e._s(t.username)+"<"+e._s(t.displayName)+"> ")])})),1)])],1)]}}])}),r("el-table-column",{attrs:{prop:"name",label:"用户组名称"}}),r("el-table-column",{attrs:{prop:"users.length",label:"成员数",width:"100"}}),r("el-table-column",{attrs:{prop:"workflow",label:"工单申请",width:"100"},scopedSlots:e._u([{key:"default",fn:function(t){return[r("el-tag",{attrs:{type:0===t.row.inWorkorder?"danger":"success","disable-transitions":""}},[e._v(" "+e._s(0===t.row.inWorkorder?"禁止":"允许")+" ")])]}}])}),r("el-table-column",{attrs:{prop:"comment",label:"描述"}}),r("el-table-column",{attrs:{fixed:"right",label:"操作",width:"280"},scopedSlots:e._u([{key:"default",fn:function(t){return[r("el-button",{attrs:{type:"primary",plain:"",size:"mini"},on:{click:function(r){return e.editItem(t.row)}}},[e._v("编辑")]),r("el-button",{attrs:{type:"danger",plain:"",size:"mini"},on:{click:function(r){return e.delItem(t.row)}}},[e._v("删除")])]}}])})],1),r("el-pagination",{attrs:{background:"","page-sizes":[10,15,20,25,30],layout:"sizes, prev, pager, next",total:e.pagination.total,"current-page":e.pagination.currentPage,"page-size":e.pagination.pageSize},on:{"current-change":e.paginationCurrentChange,"size-change":e.handleSizeChange}}),r("UserGroupDialog",{ref:"userGroupDialog",attrs:{formStatus:e.formGroupStatus},on:{closeDialog:e.fetchData}})]],2)},n=[],o=(r("a4d3"),r("4de4"),r("b0c0"),r("e439"),r("dbb4"),r("b64b"),r("159b"),r("ade3")),i=r("5880"),u=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("el-dialog",{attrs:{title:e.formStatus.operationType?e.formStatus.addTitle:e.formStatus.updateTitle,visible:e.formStatus.visible},on:{"update:visible":function(t){return e.$set(e.formStatus,"visible",t)}}},[r("el-form",{attrs:{model:e.userGroup}},[r("el-form-item",{attrs:{label:"用户组名称","label-width":e.formStatus.labelWidth}},[r("el-input",{attrs:{placeholder:"请输入内容",disabled:!e.formStatus.operationType},model:{value:e.userGroup.name,callback:function(t){e.$set(e.userGroup,"name",t)},expression:"userGroup.name"}})],1)],1),r("el-form",{attrs:{model:e.userGroup}},[r("el-form-item",{attrs:{label:"工单申请","label-width":e.formStatus.labelWidth,required:!0}},[r("el-select",{attrs:{placeholder:"选择类型"},model:{value:e.userGroup.inWorkorder,callback:function(t){e.$set(e.userGroup,"inWorkorder",t)},expression:"userGroup.inWorkorder"}},e._l(e.workorderOptions,(function(e){return r("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})})),1)],1)],1),r("el-form",{attrs:{model:e.userGroup}},[r("el-form-item",{attrs:{label:"描述","label-width":e.formStatus.labelWidth}},[r("el-input",{attrs:{placeholder:"请输入内容"},model:{value:e.userGroup.comment,callback:function(t){e.$set(e.userGroup,"comment",t)},expression:"userGroup.comment"}})],1)],1),r("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[r("el-button",{on:{click:function(t){e.formStatus.visible=!1}}},[e._v("取消")]),r("el-button",{attrs:{type:"primary"},on:{click:e.saveInfo}},[e._v("确定")])],1)],1)},s=[],l=r("52ab"),c=[{value:0,label:"禁止工单申请"},{value:1,label:"允许工单申请"}],p={data:function(){return{userGroup:"",workorderOptions:c}},name:"UserGroupDialog",props:["formStatus"],mounted:function(){},methods:{initData:function(e){this.userGroup=e},saveInfo:function(){var e=this;setTimeout((function(){var t=Object.assign({},e.userGroup);e.formStatus.operationType?Object(l["a"])(t).then((function(t){e.$message({message:"成功",type:"success"}),e.formStatus.visible=!1,e.$emit("closeDialog")})):Object(l["i"])(t).then((function(t){e.$message({message:"成功",type:"success"}),e.formStatus.visible=!1,e.$emit("closeDialog")}))}),600)}}},f=p,d=r("2877"),m=function(e){e.options.__source="src/components/opscloud/dialog/UserGroupDialog.vue"},g=m,b=Object(d["a"])(f,u,s,!1,null,null,null);"function"===typeof g&&g(b);var h=b.exports;function y(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function v(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?y(Object(r),!0).forEach((function(t){Object(o["a"])(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):y(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}var S={data:function(){return{formGroupStatus:{visible:!1,labelWidth:"150px",operationType:!0,addTitle:"新增用户信息",updateTitle:"更新用户信息"},tableData:[],loading:!1,pagination:{currentPage:1,pageSize:10,total:0},queryParam:{name:"",workflow:""},title:"用户组管理"}},mounted:function(){this.initPageSize(),this.fetchData()},computed:v({},Object(i["mapState"])("d2admin/user",["info"])),components:{UserGroupDialog:h},methods:v({},Object(i["mapActions"])({setPageSize:"d2admin/user/set"}),{handleSizeChange:function(e){this.pagination.pageSize=e,this.info.pageSize=e,this.setPageSize(this.info),this.fetchData()},initPageSize:function(){"undefined"!==typeof this.info.pageSize&&(this.pagination.pageSize=this.info.pageSize)},delItem:function(e){var t=this;this.$confirm("此操作将删除当前配置?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){Object(l["b"])(e.id).then((function(e){t.fetchData(),t.$message({type:"success",message:"删除成功!"})}))})).catch((function(){t.$message({type:"info",message:"已取消删除"})}))},editItem:function(e){this.$refs.userGroupDialog.initData(Object.assign({},e)),this.formGroupStatus.visible=!0,this.formGroupStatus.operationType=!1},addItem:function(){var e={id:"",name:"",grpType:0,workflow:0,comment:""};this.$refs.userGroupDialog.initData(e),this.formGroupStatus.visible=!0,this.formGroupStatus.operationType=!0},handleDialogCancel:function(e){this.$message({message:"取消保存",type:"warning"}),e()},syncLdapUserGroup:function(){var e=this;setTimeout((function(){e.loading=!0,Object(l["h"])().then((function(t){e.$message({message:"同步成功",type:"success"}),e.fetchData()}))}),300)},paginationCurrentChange:function(e){this.pagination.currentPage=e,this.fetchData()},fetchData:function(){var e=this;this.loading=!0,Object(l["e"])(this.queryParam.name,"",this.queryParam.workflow,1,this.pagination.currentPage,this.pagination.pageSize).then((function(t){e.tableData=t.body.data,e.pagination.total=t.body.totalNum,e.loading=!1}))}})},w=S,O=(r("0a09"),function(e){e.options.__source="src/pages/user/group/index.vue"}),k=O,j=Object(d["a"])(w,a,n,!1,null,"ad910efe",null);"function"===typeof k&&k(j);t["default"]=j.exports},c495:function(e,t,r){}}]);
(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-42d03b42"],{"04b5":function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("el-dialog",{attrs:{title:t.formStatus.title,visible:t.formStatus.visible},on:{"update:visible":function(e){return t.$set(t.formStatus,"visible",e)}}},[n("el-form",{attrs:{model:t.tagTransfer}},[n("el-transfer",{attrs:{props:{key:"id",label:"tagKey"},data:t.tagTransfer.tagOptions,titles:["所有标签","当前标签"]},model:{value:t.tagTransfer.tagIds,callback:function(e){t.$set(t.tagTransfer,"tagIds",e)},expression:"tagTransfer.tagIds"}})],1),n("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[n("el-button",{attrs:{size:"mini"},on:{click:function(e){t.formStatus.visible=!1}}},[t._v("关闭")]),n("el-button",{attrs:{type:"primary",size:"mini"},on:{click:t.handlerSave}},[t._v("确定")])],1)],1)},i=[],r=n("a3e9"),s={data:function(){return{tagTransfer:{}}},name:"TagTransferDialog",props:["formStatus"],mixins:[],mounted:function(){},methods:{handleClick:function(){this.$emit("input",!this.value)},initData:function(t){this.tagTransfer=t},handlerSave:function(){var t=this;setTimeout((function(){Object(r["f"])(t.tagTransfer).then((function(e){t.$message({message:"成功",type:"success"}),t.formStatus.visible=!1,t.$emit("closeDialog")}))}),600)}}},o=s,u=n("2877"),c=function(t){t.options.__source="src/components/opscloud/dialog/TagTransferDialog.vue"},l=c,f=Object(u["a"])(o,a,i,!1,null,null,null);"function"===typeof l&&l(f);e["a"]=f.exports},"11a2":function(t,e,n){"use strict";function a(t){switch(t){case!0:return"success";case!1:return"warning";case 1:return"success";case 0:return"warning";default:return"info"}}function i(t){switch(t){case!0:return"有效";case!1:return"无效";case 1:return"有效";case 0:return"无效";default:return"未定义"}}n.d(e,"b",(function(){return a})),n.d(e,"a",(function(){return i}))},"69b7":function(t,e,n){},a3e9:function(t,e,n){"use strict";n.d(e,"d",(function(){return i})),n.d(e,"a",(function(){return r})),n.d(e,"b",(function(){return s})),n.d(e,"e",(function(){return o})),n.d(e,"f",(function(){return u})),n.d(e,"c",(function(){return c}));var a=n("9bd2");function i(t,e,n){return Object(a["a"])({url:"/tag/page/query?tagKey="+t+"&page="+e+"&length="+n,method:"get"})}function r(t){return Object(a["a"])({url:"/tag/add",method:"post",data:t})}function s(t){return Object(a["a"])({url:"/tag/del?id="+t,method:"delete"})}function o(t){return Object(a["a"])({url:"/tag/update",method:"put",data:t})}function u(t){return Object(a["a"])({url:"/tag/business/update",method:"put",data:t})}function c(t,e,n){return Object(a["a"])({url:"/tag/business/query?businessType="+t+"&businessId="+e+"&tagKey="+n,method:"get"})}},df79:function(t,e,n){"use strict";n.d(e,"b",(function(){return r})),n.d(e,"d",(function(){return s})),n.d(e,"c",(function(){return o})),n.d(e,"a",(function(){return u}));var a=n("9bd2"),i="/aliyun/oss/bucket";function r(t){return Object(a["a"])({url:i+"/page/query",method:"post",data:t})}function s(){return Object(a["a"])({url:i+"/sync",method:"put"})}function o(t){return Object(a["a"])({url:i+"/active/set?id="+t,method:"put"})}function u(t){return Object(a["a"])({url:i+"/del?id="+t,method:"delete"})}},dfab:function(t,e,n){"use strict";n.r(e);var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("d2-container",[[n("div",[n("h1",[t._v(t._s(t.title))])]),n("el-row",{staticStyle:{"margin-bottom":"5px"},attrs:{gutter:24}},[n("el-input",{staticClass:"input",attrs:{placeholder:"输入关键字模糊查询"},model:{value:t.queryParam.queryName,callback:function(e){t.$set(t.queryParam,"queryName",e)},expression:"queryParam.queryName"}}),n("el-button",{staticStyle:{"margin-left":"5px"},on:{click:t.fetchData}},[t._v("查询")]),n("el-button",{staticStyle:{"margin-left":"5px"},on:{click:t.handlerSync}},[t._v("同步")])],1),n("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticStyle:{width:"100%"},attrs:{data:t.tableData}},[n("el-table-column",{attrs:{prop:"name",label:"名称"}}),n("el-table-column",{attrs:{prop:"extranetEndpoint",label:"公网地址"}}),n("el-table-column",{attrs:{prop:"intranetEndpoint",label:"内网地址"}}),n("el-table-column",{attrs:{prop:"serverStatus",label:"有效"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("el-tag",{staticClass:"filters",attrs:{type:t._f("getActiveType")(e.row.isActive),size:"small"}},[t._v(" "+t._s(t._f("getActiveText")(e.row.isActive))+" ")])]}}])}),n("el-table-column",{attrs:{prop:"comment",label:"描述"}}),n("el-table-column",{attrs:{prop:"tags",label:"标签"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("div",{staticClass:"tag-group"},t._l(e.row.tags,(function(e){return n("span",{key:e.id},[n("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:e.comment,placement:"top-start"}},[n("el-tag",{staticStyle:{"margin-left":"5px"},style:{color:e.color}},[t._v(t._s(e.tagKey))])],1)],1)})),0)]}}])}),n("el-table-column",{attrs:{fixed:"right",label:"操作",width:"280"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("el-button",{attrs:{type:e.row.isActive?"info":"success",plain:"",size:"mini"},on:{click:function(n){return t.handlerRowSetActive(e.row)}}},[t._v(t._s(e.row.isActive?"无效":"有效")+" ")]),n("el-button",{attrs:{type:"primary",plain:"",size:"mini"},on:{click:function(n){return t.handlerRowTagEdit(e.row)}}},[t._v("标签")]),n("el-button",{attrs:{type:"danger",plain:"",size:"mini"},on:{click:function(n){return t.handlerRowDel(e.row)}}},[t._v("删除")])]}}])})],1),n("el-pagination",{attrs:{background:"","page-sizes":[10,15,20,25,30],layout:"sizes, prev, pager, next",total:t.pagination.total,"current-page":t.pagination.currentPage,"page-size":t.pagination.pageSize},on:{"current-change":t.paginationCurrentChange,"size-change":t.handleSizeChange}}),n("TagTransferDialog",{ref:"tagTransferDialog",attrs:{formStatus:t.formTagTransferStatus},on:{closeDialog:t.fetchData}})]],2)},i=[],r=(n("a4d3"),n("4de4"),n("e439"),n("dbb4"),n("b64b"),n("159b"),n("ade3")),s=n("5880"),o=n("04b5"),u=n("11a2"),c=n("a3e9"),l=n("df79");function f(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,a)}return n}function d(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?f(Object(n),!0).forEach((function(e){Object(r["a"])(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):f(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var g={name:"OssTable",data:function(){return{title:"阿里云对象存储管理",tableData:[],options:{stripe:!0},loading:!1,pagination:{currentPage:1,pageSize:10,total:0},queryParam:{instanceId:"",queryName:""},instanceOptions:[],businessType:12,formTagTransferStatus:{visible:!1,title:"编辑对象存储标签"}}},computed:d({},Object(s["mapState"])("d2admin/user",["info"])),mounted:function(){this.initPageSize(),this.fetchData()},filters:{getActiveType:u["b"],getActiveText:u["a"]},components:{TagTransferDialog:o["a"]},methods:d({},Object(s["mapActions"])({setPageSize:"d2admin/user/set"}),{handleSizeChange:function(t){this.pagination.pageSize=t,this.info.pageSize=t,this.setPageSize(this.info),this.fetchData()},initPageSize:function(){"undefined"!==typeof this.info.pageSize&&(this.pagination.pageSize=this.info.pageSize)},handlerSync:function(){var t=this;Object(l["d"])().then((function(e){t.$message({type:"success",message:"任务后台执行中!"})}))},handlerRowSetActive:function(t){var e=this;Object(l["c"])(t.id).then((function(t){e.fetchData(),e.$message({type:"success",message:"设置成功!"})}))},handlerRowTagEdit:function(t){this.formTagTransferStatus.visible=!0;var e={businessId:t.id,businessType:this.businessType,tagIds:[],tagOptions:[]};Object(c["d"])("",1,100).then((function(t){e.tagOptions=t.body.data})),Object(c["c"])(this.businessType,e.businessId,"").then((function(t){for(var n in t.body)e.tagIds.push(t.body[n].id)})),this.formTagTransferStatus.visible=!0,this.$refs.tagTransferDialog.initData(e)},handlerRowDel:function(t){var e=this;this.$confirm("此操作将删除当前配置?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){Object(l["a"])(t.id).then((function(t){e.fetchData(),e.$message({type:"success",message:"删除成功!"})}))})).catch((function(){e.$message({type:"info",message:"已取消删除"})}))},paginationCurrentChange:function(t){this.pagination.currentPage=t,this.fetchData()},fetchData:function(){var t=this;this.loading=!0;var e={queryName:this.queryParam.queryName,extend:1,page:this.pagination.currentPage,length:this.pagination.pageSize};Object(l["b"])(e).then((function(e){t.tableData=e.body.data,t.pagination.total=e.body.totalNum,t.loading=!1}))}})},p=g,b=(n("ff54"),n("2877")),m=function(t){t.options.__source="src/pages/storage/oss/index.vue"},h=m,y=Object(b["a"])(p,a,i,!1,null,null,null);"function"===typeof h&&h(y);e["default"]=y.exports},ff54:function(t,e,n){"use strict";var a=n("69b7"),i=n.n(a);i.a}}]);
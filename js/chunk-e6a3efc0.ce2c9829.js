(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-e6a3efc0"],{"15ed":function(t,e,n){},"1ec5":function(t,e,n){"use strict";var a=n("3202"),i=n.n(a);i.a},3202:function(t,e,n){},"3d7e":function(t,e,n){},"72f9":function(t,e,n){"use strict";var a=n("9e96"),i=n.n(a);i.a},"9e96":function(t,e,n){},b952:function(t,e,n){"use strict";var a=n("15ed"),i=n.n(a);i.a},e739:function(t,e,n){"use strict";var a=n("3d7e"),i=n.n(a);i.a},fceb:function(t,e,n){"use strict";n.r(e);var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("d2-container",[n("h1",[t._v(t._s(t.title))]),n("el-row",{attrs:{gutter:40}},[n("el-col",{attrs:{span:12}},[n("el-card",{attrs:{shadow:"never"}},[n("MyKubernetesApplicationTable",{ref:"myKubernetesApplicationTable",on:{handlerSelInstance:t.handlerSelInstance}})],1)],1),n("el-col",{attrs:{span:10}},[n("el-card",{attrs:{shadow:"never"}},[n("MyKubernetesPodTable",{ref:"myKubernetesPodTable"})],1)],1)],1)],1)},i=[],r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("el-row",{staticStyle:{"margin-bottom":"5px","margin-left":"0px"},attrs:{gutter:24}},[n("el-input",{staticClass:"input",attrs:{placeholder:"输入关键字模糊查询"},model:{value:t.queryParam.queryName,callback:function(e){t.$set(t.queryParam,"queryName",e)},expression:"queryParam.queryName"}}),n("el-button",{staticStyle:{"margin-left":"5px"},on:{click:t.fetchData}},[t._v("查询")]),n("el-button",{staticStyle:{"margin-left":"5px"},on:{click:t.handlerAdd}},[t._v("新增")])],1),n("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticStyle:{width:"100%"},attrs:{data:t.tableData}},[n("el-table-column",{attrs:{prop:"name",label:"应用名称"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("div",[t._v(t._s(e.row.name))]),n("div",[t._v(t._s(e.row.comment))])]}}])}),n("el-table-column",{attrs:{prop:"serverGroupId",label:"服务器组"},scopedSlots:t._u([{key:"default",fn:function(e){return[null!==e.row.serverGroup?n("span",[t._v(t._s(e.row.serverGroup.name))]):t._e()]}}])}),n("el-table-column",{attrs:{prop:"serverGroupId",label:"授权",width:"80"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("el-tag",{attrs:{type:e.row.authorized?"success":"info"}},[t._v(t._s(e.row.authorized?"已授权":"未授权"))])]}}])}),n("el-table-column",{attrs:{prop:"instances",fixed:"right",label:"应用实例",width:"250"},scopedSlots:t._u([{key:"default",fn:function(e){return t._l(e.row.instances,(function(e){return n("div",{key:e.id,staticStyle:{float:"right","margin-right":"10px"}},[n("el-tag",{style:{color:e.env.color},attrs:{type:"primary"}},[t._v(t._s(e.instanceName)+" "),n("el-button",{staticStyle:{"margin-left":"10px",padding:"3px 0"},attrs:{type:"text"},on:{click:function(n){return t.handlerSelInstance(e)}}},[t._v("详情 ")])],1)],1)}))}}])})],1),n("el-pagination",{attrs:{background:"","page-sizes":[10,15,20,25,30],layout:"sizes, prev, pager, next",total:t.pagination.total,"current-page":t.pagination.currentPage,"page-size":t.pagination.pageSize},on:{"current-change":t.paginationCurrentChange,"size-change":t.handleSizeChange}}),n("KubernetesApplicationInstanceDialog",{ref:"kubernetesApplicationInstanceDialog",attrs:{formStatus:t.formInstanceStatus},on:{closeDialog:t.fetchData}}),n("KubernetesApplicationDialog",{ref:"kubernetesApplicationDialog",attrs:{formStatus:t.formApplicationStatus},on:{closeDialog:t.fetchData}})],1)},s=[],o=(n("a4d3"),n("4de4"),n("e439"),n("dbb4"),n("b64b"),n("159b"),n("ade3")),c=n("d4c4"),l=n("3a3e"),u=n("2b41"),d=n("5880");function p(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);e&&(a=a.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,a)}return n}function h(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?p(Object(n),!0).forEach((function(e){Object(o["a"])(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):p(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}var f={data:function(){return{title:"我的Kubernetes应用",formInstanceStatus:{visible:!1,operationType:!0,addTitle:"新增实例配置",updateTitle:"更新实例配置"},formApplicationStatus:{visible:!1,operationType:!0,addTitle:"新增应用配置",updateTitle:"更新应用配置"},tableData:[],loading:!1,pagination:{currentPage:1,pageSize:10,total:0},queryParam:{queryName:"",serverGroupId:"",extend:1}}},computed:h({},Object(d["mapState"])("d2admin/user",["info"])),mounted:function(){this.initPageSize(),this.fetchData()},components:{KubernetesApplicationInstanceDialog:c["a"],KubernetesApplicationDialog:l["a"]},methods:h({},Object(d["mapActions"])({setPageSize:"d2admin/user/set"}),{handleSizeChange:function(t){this.pagination.pageSize=t,this.info.pageSize=t,this.setPageSize(this.info),this.fetchData()},initPageSize:function(){"undefined"!==typeof this.info.pageSize&&(this.pagination.pageSize=this.info.pageSize)},handlerSelInstance:function(t){this.$emit("handlerSelInstance",t.id)},handlerAdd:function(t){var e={id:"",name:"",serverGroupId:"",businessId:"",comment:""};this.$refs.kubernetesApplicationDialog.initData(e),this.formApplicationStatus.visible=!0,this.formApplicationStatus.operationType=!0},handlerRowEdit:function(t){var e=Object.assign({},t);this.$refs.kubernetesApplicationDialog.initData(e),this.formApplicationStatus.visible=!0,this.formApplicationStatus.operationType=!1},handlerRowInstanceEdit:function(t,e){var n=Object.assign({},t),a=Object.assign({},e);this.$refs.kubernetesApplicationInstanceDialog.initData(n,a),this.formInstanceStatus.visible=!0,this.formInstanceStatus.operationType=!1},handlerRowInstanceAdd:function(t){var e={id:"",applicationId:t.id,envType:0,envLabel:"",templateVariable:""};this.$refs.kubernetesApplicationInstanceDialog.initData(t,e),this.formInstanceStatus.visible=!0,this.formInstanceStatus.operationType=!0},paginationCurrentChange:function(t){this.pagination.currentPage=t,this.fetchData()},fetchData:function(){var t=this;this.loading=!0;var e=Object.assign({},this.queryParam);e.page=this.pagination.currentPage,e.length=this.pagination.pageSize,Object(u["d"])(e).then((function(e){t.tableData=e.body.data,t.pagination.total=e.body.totalNum,t.loading=!1}))}})},m=f,g=(n("72f9"),n("2877")),b=function(t){t.options.__source="src/components/opscloud/kubernetes/MyKubernetesApplicationTable.vue"},v=b,y=Object(g["a"])(m,r,s,!1,null,"78a025ae",null);"function"===typeof v&&v(y);var S=y.exports,x=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticStyle:{width:"100%"},attrs:{data:t.tableData}},[n("el-table-column",{attrs:{prop:"name",label:"容器组状态",width:"150"},scopedSlots:t._u([{key:"default",fn:function(e){return[n("el-popover",{attrs:{placement:"right",width:"500",trigger:"hover"}},[n("el-form",{attrs:{model:e.row}},[n("el-form-item",{attrs:{label:"名称","label-width":t.labelWidth}},[n("el-input",{attrs:{readonly:""},model:{value:e.row.name,callback:function(n){t.$set(e.row,"name",n)},expression:"props.row.name"}})],1),n("el-form-item",{attrs:{label:"运行阶段","label-width":t.labelWidth}},[n("el-tag",{attrs:{type:"Running"===e.row.phase?"success":"warning"}},[t._v(t._s(e.row.phase))])],1)],1),n("el-button",{attrs:{slot:"reference",type:"text"},slot:"reference"},[t._v("容器组详情")])],1)]}}])}),n("el-table-column",{attrs:{prop:"hostIP",label:"节点ip",width:"120"}}),n("el-table-column",{attrs:{prop:"containers",label:"容器"},scopedSlots:t._u([{key:"default",fn:function(e){return t._l(e.row.containers,(function(a){return n("div",{key:a.name,staticStyle:{float:"right","margin-right":"10px"}},[n("el-tag",{attrs:{type:a.started?"success":"warning",effect:"dark"}},[t._v(t._s(a.name)+" "),n("span",{directives:[{name:"show",rawName:"v-show",value:""!==a.id,expression:"item.id !== ''"}]},[t._v("[id:"+t._s(a.id)+"]")]),n("el-button",{staticStyle:{"margin-left":"10px",padding:"3px 0"},attrs:{type:"text"},on:{click:function(n){return t.handlerXTerm(e.row,a)}}},[n("span",{staticStyle:{color:"#535353"}},[t._v("打开终端")])])],1)],1)}))}}])})],1),n("KubernetesXTerm",{ref:"xtermDialog",attrs:{formStatus:t.formXtermStatus}})],1)},k=[],O=n("9bd2"),w="/kubernetes/pod";function _(t){return Object(O["a"])({url:w+"/query",method:"post",data:t})}var I=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("el-dialog",{attrs:{title:t.title,visible:t.formStatus.visible,width:"80%"},on:{"update:visible":function(e){return t.$set(t.formStatus,"visible",e)},close:t.handlerExit}},[t._l(t.xterms,(function(e){return n("div",{key:e},[[n("el-col",{attrs:{span:24}},[n("el-alert",{staticStyle:{"margin-bottom":"5px"},attrs:{title:"常用命令",type:"success","show-icon":""}},[n("el-button",{staticStyle:{"margin-left":"10px",padding:"3px 0"},attrs:{type:"text"},on:{click:function(e){return t.handlerSendCmd(0)}}},[t._v("[点击查看日志] sudo docker logs -f --tail 100 "+t._s(t.container.id)+" ")]),n("br"),n("el-button",{staticStyle:{"margin-left":"10px",padding:"3px 0"},attrs:{type:"text"},on:{click:function(e){return t.handlerSendCmd(1)}}},[t._v("[点击进入容器] sudo docker exec -it "+t._s(t.container.id)+" ash ")])],1),n("el-card",{staticStyle:{"margin-right":"10px","margin-bottom":"10px"},attrs:{shadow:"hover","body-style":"padding: 2px"}},[n("div",{staticClass:"clearfix",staticStyle:{height:"15px"},attrs:{slot:"header"},slot:"header"},[n("span",[n("el-tag",[t._v(" "+t._s(e))])],1),n("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"退出",placement:"top-start"}},[n("el-button",{staticStyle:{float:"right",padding:"3px 0"},attrs:{type:"text"},on:{click:function(n){return t.handlerLogout(e)}}},[t._v(" Logout ")])],1),n("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"复制会话",placement:"top-start"}},[n("el-button",{staticStyle:{float:"right",padding:"3px 0","margin-right":"20px"},attrs:{type:"text"},on:{click:function(e){return t.handlerDuplicateSession()}}},[t._v("Duplicate ")])],1)],1),n("div",{staticClass:"xterm",attrs:{id:e}})])],1)]],2)})),n("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[n("el-button",{attrs:{size:"mini"},on:{click:t.handlerExit}},[t._v("关闭")])],1)],2)},T=[],D=(n("d81d"),n("b0c0"),n("1276"),n("c276")),M=(n("abb2"),n("fcf3")),A=n("47d0"),P=n("e232"),E="ws/xterm",z="XTERM",j={data:function(){return{title:"Web-XTerminal",socketURI:D["a"].wsUrl(E),pod:{},container:{},server:{},addonMap:[],xterms:[],xtermMap:{},timer:null,xtermSize:{rows:30},xtermTheme:{foreground:"#FFFFFF",background:"#606266",cursor:"help"}}},name:"KubernetesXTerm",props:["formStatus"],mixins:[],mounted:function(){this.setXTermSetting()},beforeDestroy:function(){try{for(var t in this.socket.close(),this.xtermMap)this.xtermMap[t].dispose()}catch(e){}clearInterval(this.timer)},methods:{setXTermSetting:function(){var t=this;Object(P["a"])(z).then((function(e){if(e.success)try{t.xtermTheme.foreground=e.body["XTERM_FOREGROUND"],t.xtermTheme.background=e.body["XTERM_BACKGROUND"],t.xtermSize.rows=e.body["XTERM_ROWS"]||30}catch(n){}else t.$message.error(e.msg)}))},handlerExit:function(){this.handlerClose();try{for(var t in this.socket.close(),this.xtermMap)this.xtermMap[t].dispose()}catch(e){}this.formStatus.visible=!1},initData:function(t,e){this.pod=t,this.container=e,this.server=t.server,this.handlerLogin()},setTimer:function(){var t=this;this.timer=setInterval((function(){t.handlerSSHHeartbeat()}),1e4)},handlerSSHHeartbeat:function(){var t={status:"HEARTBEAT"};try{this.socketOnSend(JSON.stringify(t))}catch(e){}},initTermInstance:function(t){var e=this,n=t.name,a=new M["Terminal"]({rendererType:"canvas",allowTransparency:!0,fontSize:11,rows:this.xtermSize.rows,theme:this.xtermTheme,termName:"xterm",visualBell:!1,popOnBell:!1,scrollback:1e3,screenKeys:!1,debug:!1,cancelEvents:!1,cursorStyle:"underline",cursorBlink:!0,convertEol:!0});e.addonMap[n]=new A["FitAddon"],a.loadAddon(e.addonMap[n]),a.open(document.getElementById(n)),e.addonMap[n].fit(),a.focus(),a.onData((function(t){var a={data:t,status:"COMMAND",instanceId:n};e.socketOnSend(JSON.stringify(a))})),this.xtermMap[n]=a},handlerResize:function(){for(var t in this.xtermMap){this.addonMap[t].fit();var e={status:"RESIZE",instanceId:t,xtermWidth:7*this.addonMap[t]._terminal.cols,xtermHeight:document.getElementById(t).clientHeight};this.socketOnSend(JSON.stringify(e)),this.xtermMap[t].scrollToBottom()}},handlerDuplicateSession:function(){var t=this,e=this.server.name+"#"+D["a"].uuid(),n={status:"DUPLICATE_SESSION_IP",duplicateInstanceId:this.server.name,token:D["a"].cookies.get("token"),instanceId:e,xtermWidth:7*this.addonMap[e.split("#")[0]]._terminal.cols,xtermHeight:document.getElementById(e.split("#")[0]).clientHeight};this.xterms.push(e);var a={name:e,ip:this.server.privateIp};this.$nextTick((function(){t.initTermInstance(a),t.socketOnSend(JSON.stringify(n))}))},handlerLogout:function(t){var e={status:"LOGOUT",instanceId:t};this.socketOnSend(JSON.stringify(e));var n=this.xtermMap[t];n.dispose(),delete this.xtermMap[t],this.xterms=this.xterms.filter((function(e){return e!==t})),this.$message.warning(t+"终端已关闭")},handlerClose:function(){var t={status:"CLOSE"};this.socketOnSend(JSON.stringify(t)),this.xterms=[],this.xtermMap={},clearInterval(this.timer)},handlerLogin:function(){this.xtermMap={},this.initSocket(),this.setTimer()},initSocket:function(){this.socket=new WebSocket(this.socketURI),this.socketOnClose(),this.socketOnOpen(),this.socketOnError(),this.socketOnMessage()},socketOnOpen:function(){var t=this;this.socket.onopen=function(){try{t.xterms=[],t.xterms.push(t.server.name),t.$nextTick((function(){t.initTermInstance(t.server);var e={token:D["a"].cookies.get("token"),instanceId:t.server.name,ip:t.server.privateIp,status:"INITIAL_IP",xtermWidth:0,xtermHeight:308};t.socketOnSend(JSON.stringify(e)),t.$nextTick((function(){t.handlerResize()}))}))}catch(e){t.$message.error("登录失败，未选择服务器或其它原因")}}},socketOnClose:function(){this.socket.onclose=function(){}},socketOnError:function(){this.socket.onerror=function(){}},socketOnSend:function(t){this.socket.send(t)},socketOnMessage:function(){var t=this;this.socket.onmessage=function(e){var n=JSON.parse(e.data),a=t;n.map((function(t){a.xtermMap[t.instanceId].write(t.output)}))}},handlerSendCmd:function(t){for(var e in this.xtermMap){var n=0===t?"logs -f --tail 100 "+this.container.id:"exec -it "+this.container.id+" ash",a={data:"sudo docker "+n+"\n",status:"COMMAND",instanceId:e};this.socketOnSend(JSON.stringify(a))}}}},N=j,C=(n("e739"),function(t){t.options.__source="src/components/opscloud/xterm/KubernetesXTerm.vue"}),K=C,$=Object(g["a"])(N,I,T,!1,null,"2c122d7a",null);"function"===typeof K&&K($);var R=$.exports,X={name:"MyKubernetesPodTable",data:function(){return{instanceId:"",tableData:[],loading:!1,labelWidth:"80px",formXtermStatus:{visible:!1}}},computed:{},mounted:function(){},components:{KubernetesXTerm:R},methods:{initData:function(t){this.instanceId=t,this.fetchData()},handlerXTerm:function(t,e){this.formXtermStatus.visible=!0,this.$refs.xtermDialog.initData(t,e)},fetchData:function(){var t=this;this.loading=!0;var e={instanceId:this.instanceId};_(e).then((function(e){t.tableData=e.body,t.loading=!1}))}}},J=X,q=(n("b952"),function(t){t.options.__source="src/components/opscloud/kubernetes/MyKubernetesPodTable.vue"}),H=q,L=Object(g["a"])(J,x,k,!1,null,"272a074e",null);"function"===typeof H&&H(L);var B=L.exports,G={data:function(){return{title:"我的应用"}},components:{MyKubernetesApplicationTable:S,MyKubernetesPodTable:B},mounted:function(){},methods:{handlerSelInstance:function(t){this.$refs.myKubernetesPodTable.initData(t)}}},W=G,F=(n("1ec5"),function(t){t.options.__source="src/pages/workbench/application/index.vue"}),U=F,V=Object(g["a"])(W,a,i,!1,null,"250523da",null);"function"===typeof U&&U(V);e["default"]=V.exports}}]);
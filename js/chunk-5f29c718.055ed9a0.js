(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-5f29c718"],{"0714":function(t,e,i){"use strict";var s=i("b255"),a=i.n(s);a.a},1219:function(t,e,i){"use strict";var s=i("a225"),a=i.n(s);a.a},1379:function(t,e,i){"use strict";var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("el-row",[i("el-col",{attrs:{span:22}},[i("div",{directives:[{name:"show",rawName:"v-show",value:null!==t.changes.length&&t.changes.length>0,expression:"changes.length !== null && changes.length > 0"}],staticClass:"tag-group"},t._l(t.changes,(function(e){return i("div",{key:e.id},[i("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:e.commitId,placement:"top-start"}},[i("el-button",{staticStyle:{"margin-left":"10px",padding:"3px 0"},attrs:{type:"text"},on:{click:function(i){return t.handlerOpenUrl(e)}}},[t._v(t._s(e.shortCommitId))])],1),i("span",{staticStyle:{"margin-left":"5px"}},[t._v(t._s(e.commitMsg))])],1)})),0),i("span",{directives:[{name:"show",rawName:"v-show",value:null===t.changes||0===t.changes.length,expression:"changes === null || changes.length === 0"}]},[t._v("No Changes")])]),i("el-col",{attrs:{span:2}},[i("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"变更详情",placement:"top-start"}},[i("i",{staticClass:"fa fa-comment-o",attrs:{"aria-hidden":"true"}})])],1)],1),i("el-row",[i("el-divider")],1)],1)},a=[],n=i("c276"),l={name:"BuildChanges",data:function(){return{}},props:["changes"],filters:{},mounted:function(){},methods:{handlerOpenUrl:function(t){n["a"].open(t.commitUrl)}}},c=l,r=(i("275c"),i("2877")),o=function(t){t.options.__source="src/components/opscloud/build/summary/BuildChanges.vue"},u=o,d=Object(r["a"])(c,s,a,!1,null,null,null);"function"===typeof u&&u(d);e["a"]=d.exports},"275c":function(t,e,i){"use strict";var s=i("97ca"),a=i.n(s);a.a},"2ad8":function(t,e,i){},3452:function(t,e,i){"use strict";var s=i("6889"),a=i.n(s);a.a},4205:function(t,e,i){"use strict";var s=i("c835"),a=i.n(s);a.a},5505:function(t,e,i){"use strict";var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("el-row",[i("el-col",{attrs:{span:22}},[i("div",{directives:[{name:"show",rawName:"v-show",value:null!==t.executors.length&&t.executors.length>0,expression:"executors.length !== null && executors.length > 0"}],staticClass:"tag-group"},t._l(t.executors,(function(e){return i("div",{key:e.id},[i("b",{staticClass:"label"},[t._v(t._s(e.nodeName))]),null!==e.privateIp&&""!==e.privateIp?i("span",{staticStyle:{"margin-left":"5px"}},[t._v(t._s(e.privateIp))]):t._e()])})),0),i("span",{directives:[{name:"show",rawName:"v-show",value:null===t.executors.length||0===t.executors.length,expression:"executors.length === null || executors.length === 0"}]},[t._v("No Executors")])]),i("el-col",{attrs:{span:2}},[i("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"工作节点",placement:"top-start"}},[i("i",{staticClass:"fa fa-television",attrs:{"aria-hidden":"true"}})])],1)],1)],1)},a=[],n={name:"BuildExecutors",data:function(){return{}},props:["executors"],filters:{},mounted:function(){},methods:{}},l=n,c=(i("0714"),i("2877")),r=function(t){t.options.__source="src/components/opscloud/build/summary/BuildExecutors.vue"},o=r,u=Object(c["a"])(l,s,a,!1,null,"a2a68b44",null);"function"===typeof o&&o(u);e["a"]=u.exports},"5bbe":function(t,e){t.exports="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTk3OTA4NDMxMDM1IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIyNjIiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNNjI2LjMgMjI1LjNjNDYuMy01NCA0Mi4xLTEzMy44IDQyLjEtMTMzLjhzLTc5LjEgNy4zLTEyNS40IDYxLjRjLTQ2LjMgNTMuOS00Mi4xIDEzMy45LTQyLjEgMTMzLjlzNzktNy41IDEyNS40LTYxLjV6IG0xMDAuNCAzMTEuNGMwLTY4LjEgMzcuNi0xMjcuNSA5Mi45LTE1OC4zLTM4LjctNTUuOS0xMDYuOC04Ni44LTE1NC4xLTg2LjgtNTYuOSAwLTEzNS4yIDQwLjItMTU4IDQwLjItMjQuMiAwLTc0LjgtMzYuMy0xNDIuMi0zNy4zLTU1LjctMC44LTE0OS4zIDMxLjUtMTgyIDEyNy42LTMyLjcgOTYtMzEuMiAyMzQuOCAzNy4zIDM2My44QzI3NS41IDg4OS4yIDMyNC4xIDkzMSAzNzEgOTMxYzQ3IDAgMTAyLjQtMzUuOSAxNDYuNi0zNS45IDQ0LjEgMCA4NS40IDM1LjkgMTMwLjkgMzUuOXM5Mi40LTM3LjMgMTI2LjYtODguOWMzNC4xLTUxLjcgNjUuNS0xMzEuOSA2NS41LTEzMS45czAuMi0yLjEgMC42LTUuMmMtNjctMjYuMi0xMTQuNS05MS42LTExNC41LTE2OC4zeiIgcC1pZD0iMjI2MyIgZmlsbD0iIzcwNzA3MCI+PC9wYXRoPjwvc3ZnPg=="},6889:function(t,e,i){},"822b":function(t,e,i){"use strict";var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("el-row",[i("el-col",{attrs:{span:22}},[i("div",[i("span",{directives:[{name:"show",rawName:"v-show",value:null!==t.buildTime&&""!==t.buildTime,expression:"buildTime !== null && buildTime !== ''"}],staticClass:"label"},[t._v("构建时长")]),t._v(" "+t._s(t.buildTime))]),i("div",[i("span",{staticClass:"label"},[t._v("开始时间")]),t._v(" "+t._s(t.startTime))]),i("div",[i("span",{directives:[{name:"show",rawName:"v-show",value:null!==t.endTime&&""!==t.endTime,expression:"endTime !== null && endTime !== ''"}],staticClass:"label"},[t._v("结束时间")]),t._v(" "+t._s(t.endTime))])]),i("el-col",{attrs:{span:2}},[i("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"构建时间",placement:"top-start"}},[i("i",{staticClass:"el-icon-time",attrs:{"aria-hidden":"true"}})])],1)],1),i("el-row",[i("el-divider")],1)],1)},a=[],n={name:"BuildTimes",data:function(){return{}},props:["buildTime","startTime","endTime"],filters:{},mounted:function(){},methods:{}},l=n,c=(i("4205"),i("2877")),r=function(t){t.options.__source="src/components/opscloud/build/summary/BuildTimes.vue"},o=r,u=Object(c["a"])(l,s,a,!1,null,null,null);"function"===typeof o&&o(u);e["a"]=u.exports},"877f":function(t,e,i){"use strict";var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("el-row",[i("el-col",{attrs:{span:22}},[i("div",{directives:[{name:"show",rawName:"v-show",value:null!==t.artifacts&&t.artifacts.length>0,expression:"artifacts !== null && artifacts.length > 0"}],staticClass:"tag-group"},t._l(t.artifacts,(function(e){return i("div",{key:e.id},[i("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:e.ossUrl,placement:"top-start"}},[i("b",{staticClass:"label"},[t._v(t._s(e.artifactFileName))])]),i("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"文件大小",placement:"top-start"}},[i("span",{staticStyle:{"margin-left":"5px"}},[t._v(t._s(e.artifactFileSize))])])],1)})),0),i("span",{directives:[{name:"show",rawName:"v-show",value:null===t.artifacts||0===t.artifacts.length,expression:"artifacts === null || artifacts.length === 0"}]},[t._v("No Artifacts")])]),i("el-col",{attrs:{span:2}},[i("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"产出物",placement:"top-start"}},[i("i",{staticClass:"el-icon-folder",attrs:{"aria-hidden":"true"}})])],1)],1),i("el-row",[i("el-divider")],1)],1)},a=[],n={name:"BuildArtifacts",data:function(){return{}},props:["artifacts"],filters:{},mounted:function(){},methods:{}},l=n,c=(i("3452"),i("2877")),r=function(t){t.options.__source="src/components/opscloud/build/summary/BuildArtifacts.vue"},o=r,u=Object(c["a"])(l,s,a,!1,null,"6132f5ca",null);"function"===typeof o&&o(u);e["a"]=u.exports},9582:function(t,e,i){"use strict";i.r(e);var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("div",[i("h1",[t._v(t._s(t.title))])]),i("el-col",{attrs:{span:10}},[i("el-card",{attrs:{shadow:"never"}},[i("el-col",{attrs:{span:10}},[i("div",{staticStyle:{width:"100%","text-align":"center"}},[i("vue-qr",{attrs:{logoSrc:t.imageUrl,text:t.downloadHref,size:150}})],1)]),i("el-col",{attrs:{span:10}},[i("div",{staticStyle:{width:"100%","text-align":"center","margin-top":"50px"}},[i("div",{staticStyle:{color:"#286090","font-size":"1em"}},[t._v(t._s(t.build.jobName))]),i("div",{staticStyle:{color:"#286090","font-size":"2em"}},[t._v(t._s(t.build.versionName))])])])],1),i("el-card",{staticStyle:{"margin-top":"10px"},attrs:{shadow:"never"}},[i("build-user",{attrs:{user:t.build.user,ago:t.build.ago}}),i("build-times",{attrs:{buildTime:t.build.buildTime,startTime:t.build.startTime,endTime:t.build.endTime}}),i("build-changes",{attrs:{changes:t.build.changes}}),i("build-artifacts",{attrs:{artifacts:t.build.artifacts}}),i("build-executors",{attrs:{executors:t.build.executors}})],1)],1)],1)},a=[],n=i("658f"),l=i.n(n),c=i("ec44"),r=i("822b"),o=i("877f"),u=i("5505"),d=i("1379"),m=i("0970"),f={user:{email:""},ago:"",artifacts:[],changes:[],executors:[]},p={name:"IosBuildDetails",data:function(){return{title:"iOS构建任务详情",buildId:"",build:f,options:{stripe:!0},imageUrl:i("5bbe"),pageUrl:"",downloadHref:""}},mounted:function(){this.buildId=this.$route.query.buildId,this.fetchData(),this.$store.dispatch("d2admin/menu/asideCollapseSet",!0)},components:{VueQr:l.a,BuildUser:c["a"],BuildTimes:r["a"],BuildArtifacts:o["a"],BuildExecutors:u["a"],BuildChanges:d["a"]},methods:{initDownloadHref:function(){for(var t="itms-services://?action=download-manifest&url=",e=0;e<this.build.artifacts.length;e++)if("manifest.plist"===this.build.artifacts[e].artifactFileName){this.downloadHref=t+this.build.artifacts[e].ossUrl;break}},fetchData:function(){var t=this;Object(m["j"])(this.buildId).then((function(e){t.build=e.body,t.initDownloadHref()}))}}},v=p,h=(i("d5ca"),i("2877")),g=function(t){t.options.__source="src/pages/jenkins/job/build/ios/index.vue"},M=g,b=Object(h["a"])(v,s,a,!1,null,null,null);"function"===typeof M&&M(b);e["default"]=b.exports},"97ca":function(t,e,i){},a225:function(t,e,i){},b255:function(t,e,i){},c835:function(t,e,i){},d5ca:function(t,e,i){"use strict";var s=i("2ad8"),a=i.n(s);a.a},ec44:function(t,e,i){"use strict";var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("el-row",[i("el-col",{attrs:{span:22}},[i("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:t.user.email,placement:"top-start"}},[i("b",{staticClass:"label"},[t._v(t._s(t.user.displayName))])]),i("span",{staticStyle:{"margin-left":"5px"}},[t._v(t._s(t.ago))])],1),i("el-col",{attrs:{span:2}},[i("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"执行人",placement:"top-start"}},[i("i",{staticClass:"el-icon-user",attrs:{"aria-hidden":"true"}})])],1)],1),i("el-row",[i("el-divider")],1)],1)},a=[],n={name:"BuildOperation",data:function(){return{}},props:["user","ago"],filters:{},mounted:function(){},methods:{}},l=n,c=(i("1219"),i("2877")),r=function(t){t.options.__source="src/components/opscloud/build/summary/BuildUser.vue"},o=r,u=Object(c["a"])(l,s,a,!1,null,"6a7f126a",null);"function"===typeof o&&o(u);e["a"]=u.exports}}]);
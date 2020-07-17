<template>
  <el-card class="box-card" shadow="never">
    <div slot="header" class="clearfix">
      <span>{{businessType === 2 ? formStatus.groupAttributeTitle : formStatus.serverAttributeTitle}}</span>
      <el-button style="float: right; padding: 3px 0" type="text">关闭</el-button>
    </div>
    <el-collapse v-model="activeName" accordion>
      <div v-for="(attributeGroup) in attributeGroups" :key="attributeGroup.groupName"
           class="text item">
        <el-collapse-item :title="attributeGroup.groupName" :name="attributeGroup.groupName">
          <!--                  <d2-highlight :code="attributeGroup.attributes"/>-->
          <!--                  width="500" height="100"-->
          <editor v-model="attributeGroup.attributes" @init="editorInit" lang="yaml" theme="chrome"
                  width="100%"
                  height="200" :options="options"></editor>
          <div style="margin-top: 5px">
            <el-button type="success" plain size="mini" @click="updateServerGroupAttribute(attributeGroup)">预览
            </el-button>
            <el-button type="info" plain size="mini" @click="updateServerGroupAttribute(attributeGroup)">智能
            </el-button>
            <el-button type="warning" style="float:right; margin-right: 250px" plain size="mini"
                       @click="updateServerGroupAttribute(attributeGroup)">保存
            </el-button>
          </div>
        </el-collapse-item>
      </div>
    </el-collapse>
  </el-card>
</template>

<script>
  // API
  import { queryServerGroupAttribute, saveServerGroupAttribute } from '@api/server/server.group.js'
  import { queryServerAttribute, saveServerAttribute } from '@api/server/server.js'

  const options = {
    // vue2-ace-editor编辑器配置自动补全等
    enableBasicAutocompletion: true,
    enableSnippets: true,
    // 自动补全
    enableLiveAutocompletion: true
  }

  export default {
    data () {
      return {
        businessId: '',
        businessType: '',
        activeName: '',
        attributeGroups: [],
        loading: false,
        // ace
        options: options
      }
    },
    name: 'ServerAttributeCard',
    props: ['formStatus'],
    mixins: [],
    mounted () {
    },
    components: {
      editor: require('vue2-ace-editor')
    },
    methods: {
      initData (businessType, businessId) {
        this.businessType = businessType
        this.businessId = businessId
        this.getServerAttribute(businessId)
      },
      getServerAttribute (id) {
        // type 1 server; type 2 serverGroup
        if (this.businessType === 2) {
          queryServerGroupAttribute(id)
            .then(res => {
              this.attributeGroups = res.body
            })
        } else {
          queryServerAttribute(id)
            .then(res => {
              this.attributeGroups = res.body
            })
        }
      },
      editorInit: function () {
        // language extension prerequsite...
        require('brace/ext/language_tools')
        require('brace/mode/html')
        // language
        require('brace/mode/yaml')
        require('brace/mode/less')
        require('brace/theme/chrome')
        // snippet
        require('brace/snippets/yaml')
      },
      handleClick () {
        this.$emit('input', !this.value)
      },
      updateServerGroupAttribute (attributeGroup) {
        if (this.businessType === 2) {
          saveServerGroupAttribute(attributeGroup)
            .then(res => {
              if (res.success) {
                this.$message({
                  message: '保存成功',
                  type: 'success'
                })
                this.getServerAttribute(this.businessId)
              } else {
                this.$message.error({
                  message: '保存失败'
                })
              }
            })
        } else {
          saveServerAttribute(attributeGroup)
            .then(res => {
              if (res.success) {
                this.$message({
                  message: '保存成功',
                  type: 'success'
                })
                this.getServerAttribute(this.businessId)
              } else {
                this.$message.error({
                  message: '保存失败'
                })
              }
            })
        }
      }
    }
  }
</script>

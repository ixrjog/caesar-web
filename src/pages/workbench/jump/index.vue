<template>
  <d2-container>
    <template>
      <div>
        <h1>{{title}}</h1>
      </div>
      <el-col>
        <el-tabs tab-position="top" style="height: 200px;">
          <el-tab-pane label="帮助">
            <d2-markdown :source="doc.previewDoc" v-if="success"/>
            <d2-highlight :code="doc.previewDoc" v-show="false" lang="sh" style="margin-top: 5px"/>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </template>
  </d2-container>
</template>

<script>
  // Component

  import { queryDocByKey } from '@api/doc/doc.js'

  // import doc from '@/static/md/jump.jumpserver.settings.md'

  export default {
    data () {
      return {
        title: 'JUMP堡垒机',
        docKey: 'JUMP_README',
        doc: {},
        success: false
      }
    },
    mounted () {
      this.handlerFeatchDoc()
    },
    filters: {},
    methods: {
      handlerFeatchDoc () {
        queryDocByKey(this.docKey)
          .then(res => {
            this.doc = res.body
            this.success = true
          })
      }
    }
  }
</script>

<style scoped>
</style>

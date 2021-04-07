<template>
  <div>
    <span v-for="item in items" :key="item.buildNumber">
      <el-popover placement="top-start" trigger="hover">
        <span>控制台</span>
        <el-button style="float: right; padding: 3px 0" type="text"
                   @click="handlerAbortBuild(item.executors)" v-show="item.building">中止任务
        </el-button>
        <el-divider></el-divider>
        <span v-show="item.executors.length > 0">
          <div v-for="executor in item.executors" :key="executor.id">
            <el-tag type="primary">日志
                      <el-button type="text" style="margin-left: 10px; padding: 3px 0"
                                 @click="handlerOpenOutput(executor)"><span style="color: #535353">查看</span></el-button>
                    </el-tag>
                      <el-divider></el-divider>
                      <el-tag type="primary">{{ executor.nodeName }}:{{ executor.privateIp}}
                        <el-button type="text" style="margin-left: 10px; padding: 3px 0"
                                   @click="handlerOpenExecutor(executor)"><span
                          style="color: #535353">打开终端</span></el-button>
                      </el-tag>
                    </div>
                  </span>
        <span v-show="item.executors.length === 0">No Executors</span>
        <span slot="reference">
            <el-tag :style="{ backgroundColor: item.color, color: '#FFFFFF',width: '50px' }"><i class="el-icon-loading"
                                                                                                v-if="item.building"></i>{{item.buildNumber}}</el-tag>
        </span>
      </el-popover>
    </span>
  </div>
</template>

<script>
  export default {
    name: 'BuildView',
    props: ['items'],
    methods: {
      handlerOpenExecutor (executor) {
        this.$emit('handlerOpenExecutor', executor)
      },
      handlerOpenOutput (executor) {
        this.$emit('handlerOpenOutput', executor)
      }
    }

  }
</script>

<style scoped>
  .number {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
  }

</style>

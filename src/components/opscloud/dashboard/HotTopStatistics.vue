<template>
  <div>
    <el-row :gutter="24">
      <el-col :span="14">
        <el-card shadow="hover">
          <div style="margin-bottom: 20px">
            <span style="font-size: 14px">热门应用</span>
          </div>
          <el-table :data="hotTop.hotApplications" style="width: 100%;margin-bottom: 13px">
            <el-table-column label="应用名称">
              <template slot-scope="scope">
                <span style="color:#5b5d66;font-weight: 300">{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column label="标签">
               <template slot-scope="props">
                <span class="tag-group">
                  <span v-for="item in props.row.tags" :key="item.id">
                    <el-tooltip class="item" effect="light" :content="item.comment" placement="top-start">
                      <el-tag style="margin-left: 5px" :style="{ color: item.color }">{{ item.tagKey }}</el-tag>
                   </el-tooltip>
                  </span>
                 </span>
              </template>
            </el-table-column>
            <el-table-column label="说明">
              <template slot-scope="scope">
                <span style="color:#5b5d66">{{scope.row.comment}}</span>
              </template>
            </el-table-column>
            <el-table-column label="构建次数" width="150">
              <template slot-scope="scope">
                <span style="color: #20A9D9">{{scope.row.count}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card shadow="hover">
          <div style="margin-bottom: 20px">
            <span style="font-size: 14px">活跃用户</span>
          </div>
          <el-table :data="hotTop.hotUsers" style="width: 100%;margin-bottom: 13px">
            <el-table-column label="用户名">
              <template slot-scope="scope">
                <span style="color:#5b5d66;font-weight: 300">{{scope.row.username}}</span>
              </template>
            </el-table-column>
            <el-table-column label="显示名称">
              <template slot-scope="scope">
                <span style="color:#5b5d66">{{scope.row.displayName}}</span>
              </template>
            </el-table-column>
            <el-table-column label="构建次数" width="150">
              <template slot-scope="scope">
                <span style="color: #20A9D9">{{scope.row.count}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>

  import { queryHotTopStatistics } from '@api/dashboard/dashboard.js'

  export default {
    name: 'HotTopStatistics',
    data () {
      return {
        hotTop: ''
      }
    },
    filters: {},
    mounted () {
      this.fetchData()
    },
    methods: {
      fetchData () {
        queryHotTopStatistics()
          .then(res => {
            this.hotTop = res.body
          })
      }
    }
  }
</script>

<style>
  .el-card__header {
    padding: 10px 10px;
    border-bottom: 1px solid #EBEEF5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
</style>

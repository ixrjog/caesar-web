<template>
    <d2-container>
        <template>
            <div>
                <h1>SQL调试结果</h1>
            </div>
            <div>
              <el-form label-width="100px">
                <el-form-item label="目标库">
                  <span>{{data.ruleDetailDebugInfo.targetDb}}</span>
                </el-form-item>
                <el-form-item label="目标表">
                  <span>{{data.ruleDetailDebugInfo.targetTable}}</span>
                </el-form-item>
                <el-form-item label="规则SQL">
                  <span>{{data.ruleDetailDebugInfo.ruleSql}}</span>
                </el-form-item>
                <el-form-item label="提交时间">
                  <span>{{data.ruleDetailDebugInfo.createTime}}</span>
                </el-form-item>
              </el-form>
            </div>
            <div>
              <el-table
                :data="tbodydata"
                style="width: 100%">
                <el-table-column
                  v-for="thed in theaddata"
                  :prop="thed"
                  :label="thed"
                  :width="200">
                  <template slot-scope="scope">
                      <span class="tdcontent" :title="scope.row[thed]">{{scope.row[thed]}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
        </template>
    </d2-container>
</template>

<script>
    import { queryDetailById } from '@api/sqlDebug.js'

    export default {
        data () {
            return {
                queryParam: {
                    targetDb: '',
                    targetTable: ''
                },
              tbodydata: [],
              theaddata: [],
                data: {
                  ruleDetailDebugInfo: {},
                  invokeResult: {
                    columnMapList: []
                  }
                }
            }
        },
        mounted () {
          this.queryDetail(this.$route.query.id)
        },
        methods: {
            queryDetail (debugRuleDetailId) {
                queryDetailById(debugRuleDetailId)
                    .then(res => {
                        this.data = res.body;
                        this.table_data = res.body.invokeResult.columnMapList;
                        this.theaddata = [];
                        this.tbodydata = [];
                        for (var index in this.table_data){
                          var column_tmp = {}
                          for (var j in this.table_data[index]){
                            if (index==0){
                              this.theaddata.push(this.table_data[0][j].columnName)
                            }
                            var data = this.table_data[index][j]
                            column_tmp[data['columnName']] = data['columnValue']
                          }
                          this.tbodydata.push(column_tmp)
                        }
                    })
            }
        }
    }
</script>
<style>
  td span.tdcontent{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>

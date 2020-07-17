<template>
    <d2-container>
        <template>
            <div>
                <h1>SQL调试</h1>
            </div>
            <div>
                <el-row :gutter="24" style="margin-bottom: 5px">
                    <el-select v-model="queryParam.targetDb" clearable placeholder="目标db" @change="getTargetTable(queryParam.targetDb)" style="display: inline-block;max-width:200px;">
                        <el-option
                                v-for="item in targetDbOptions"
                                :key="item"
                                :label="item"
                                :value="item">
                        </el-option>
                    </el-select>
                    <el-select v-model="queryParam.targetTable" clearable placeholder="目标表">
                        <el-option
                          v-for="item in targetTableOptions"
                          :key="item"
                          :label="item"
                          :value="item">
                        </el-option>
                    </el-select>
                    <el-button @click="queryDebugSql" style="margin-left: 5px;">查询</el-button>
                    <el-button @click="dialogFormVisible = true" style="margin-left: 5px;">新增</el-button>
                 </el-row>
            </div>
            <div>
                <d2-crud
                  ref="d2Crud"
                  :columns="columns"
                  :data="data"
                  :options="options"
                  :form-options="formOptions"
                  :rowHandle="rowHandle"
                  :loading="loading"
                  :pagination="pagination"
                  @query-result="queryResult"
                  @pagination-current-change="paginationCurrentChange">
                </d2-crud>
            </div>

          <el-dialog title="新增调试SQL" :visible.sync="dialogFormVisible">
            <el-form :model="form">
              <el-form-item label="目标db" :label-width="formLabelWidth">
                <el-select v-model="form.targetDb" clearable placeholder="目标db" @change="getTargetTable(form.targetDb)">
                  <el-option
                    v-for="item in targetDbOptions"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="目标table" :label-width="formLabelWidth">
                <el-select v-model="form.targetTable" clearable placeholder="目标table">
                  <el-option
                    v-for="item in targetTableOptions"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="规则SQL" :label-width="formLabelWidth">
                <el-input type="textarea" rows="15" v-model="form.ruleSql" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="saveInfo">确 定</el-button>
            </div>
          </el-dialog>
        </template>
    </d2-container>
</template>

<script>
    import { addRuleDetailDebug, queryPage } from '@api/sqlDebug.js'
    import { queryAvailableTopicList, queryAvailableTableList } from '@api/binlogConfig.js'

    import statusTag from './statusTag'

    export default {
        data () {
            return {
                formLabelWidth: '80px',
                dialogFormVisible: false,
                form: {
                    targetDb: '',
                    targetTable: '',
                    ruleSql: ''
                },
                columns: [
                    {
                      title: '目标db',
                      key: 'targetDb',
                      minWidth: '80%'
                    },
                    {
                      title: '目标table',
                      key: 'targetTable',
                      minWidth: '50%'
                    },
                    {
                      title: '规则SQL',
                      key: 'ruleSql',
                      minWidth: '160%'
                    },
                    {
                      title: '失败次数',
                      key: 'failureNums',
                      minWidth: '40%'
                    },
                    {
                      title: '失败原因',
                      key: 'failureReason',
                      minWidth: '80%'
                    },
                    {
                      title: '执行结果',
                      key: 'invokeStatus',
                      minWidth: '50%',
                      component: {
                        name: statusTag,
                        props: {
                          myProps: ''
                        }
                      }
                    },
                    {
                      title: '创建时间',
                      key: 'createTime',
                      minWidth: '60%'
                    }
                ],

                data: [],
                options: {
                  stripe: true
                },
                formOptions: {
                  labelWidth: '80px',
                  labelPosition: 'left',
                  saveLoading: false
                },
                loading: false,
                pagination: {
                  currentPage: 1,
                  pageSize: 15,
                  total: 0
                },
              rowHandle: {
                custom: [
                  {
                    icon: 'el-icon-edit',
                    text: '查看执行结果',
                    size: 'small',
                    fixed: 'left',
                    emit: 'query-result'
                  }
                ]
              },
                queryParam: {
                    targetDb: '',
                    targetTable: ''
                },
                targetDbOptions: [],
                targetTableOptions: []
            }
        },
        mounted () {
            this.getTargetDB()
            this.queryDebugSql()
        },
        methods: {
            getTargetDB () {
                queryAvailableTopicList()
                    .then(res => {
                        this.targetDbOptions = res.body
                    })
            },
            getTargetTable (targetDb) {
                queryAvailableTableList(targetDb, '', '')
                    .then(res => {
                        this.targetTableOptions = res.body
                        this.queryParam.targetTable = ''
                    })
            },
            paginationCurrentChange (currentPage) {
                this.pagination.currentPage = currentPage
                this.queryDebugSql()
            },
            queryDebugSql () {
              this.loading = true
              queryPage({
                targetDb: this.queryParam.targetDb,
                targetTable: this.queryParam.targetTable,
                page: this.pagination.currentPage,
                length: this.pagination.pageSize
              })
                .then(res => {
                  this.data = res.body.data
                  this.pagination.total = res.body.totalNum
                  this.loading = false
                })
            },
            saveInfo () {
              this.formOptions.saveLoading = true
              setTimeout(() => {
                addRuleDetailDebug(this.form)
                  .then(res => {
                    // 返回数据
                    this.$message({
                      message: '成功',
                      type: 'success'
                    })
                    this.queryDebugSql()
                    this.dialogFormVisible = false
                    this.form = {
                      targetDb: '',
                      targetTable: '',
                      ruleSql: ''
                    }
                  })

                // done可以传入一个对象来修改提交的某个字段
                this.formOptions.saveLoading = false
              }, 600)
            },
            queryResult ({ index, row }) {
                if (row.invokeStatus === 1) {
                    this.$router.push({
                      path: '/sql/debug/result?id=' + row.id
                    })
                }
            }
        }
    }
</script>

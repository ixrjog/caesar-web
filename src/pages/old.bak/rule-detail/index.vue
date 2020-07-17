<template>
    <d2-container>
        <template>
            <div>
                <h1>规则SQL管理</h1>
            </div>
            <div>
                <el-row :gutter="24" style="margin-bottom: 5px">
                  <el-select v-model="queryParam.businessId" clearable placeholder="业务域" style="display: inline-block;max-width:200px;">
                    <el-option
                      v-for="item in businessOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-select v-model="queryParam.targetDb" clearable placeholder="目标db" @change="getTargetTable(queryParam.targetDb)">
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
                  <el-button @click="fetchData">查询</el-button>
                  <el-button @click="addRuleDetail">新增</el-button>
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
                        @row-remove="handleRowRemove"
                        @fill-form="fillForm"
                        :loading="loading"
                        :pagination="pagination"
                        @pagination-current-change="paginationCurrentChange">
                </d2-crud>
            </div>

            <el-dialog title="规则SQL" :visible.sync="dialogFormVisible">
                <el-form :model="form">
                    <el-form-item label="规则详情" :label-width="formLabelWidth">
                        <el-input v-model="form.ruleDetailDesc" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="业务域" :label-width="formLabelWidth">
                        <el-select v-model="form.businessId" clearable placeholder="业务域">
                            <el-option
                                    v-for="item in businessOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
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

    import { addRuleDetail, updateRuleDetail, delById, queryRulePage } from '@api/ruleDetail.js'
    import { queryBusinessDetailPage } from '@api/businessDetail.js'
    import { queryAvailableTopicList, queryAvailableTableList } from '@api/binlogConfig.js'

    export default {
        data () {
            return {
                formLabelWidth: '80px',
                dialogFormVisible: false,
                form: {
                    id: null,
                    ruleDetailDesc: '',
                    businessId: '',
                    targetDb: '',
                    targetTable: '',
                    ruleSql: ''
                },
                columns: [
                    {
                        title: '规则详情描述',
                        key: 'ruleDetailDesc',
                        minWidth: '60%'
                    },
                    {
                        title: '业务域',
                        key: 'businessName',
                        minWidth: '30%'
                    },
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
                        minWidth: '180%'
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
                    pageSize: 10,
                    total: 0
                },
                rowHandle: {
                    custom: [
                        {
                            icon: 'el-icon-edit',
                            text: '编辑',
                            size: 'small',
                            fixed: 'left',
                            emit: 'fill-form'
                        }
                    ],
                    remove: {
                        icon: 'el-icon-delete',
                        size: 'small',
                        fixed: 'right',
                        confirm: true,
                        show (index, row) {
                            return true
                        }
                    }
                },
                queryParam: {
                    businessId: '',
                    targetDb: '',
                    targetTable: ''
                },
                businessOptions: [],
                targetDbOptions: [],
                targetTableOptions: [],
                operatorType: true
            }
        },
        mounted () {
            this.getBusinessDetail()
            this.getTargetDB()
            this.getTargetTable()
            this.fetchData()
        },
        methods: {
            addRuleDetail () {
                this.operatorType = true
                this.dialogFormVisible = true
                this.form = {
                    id: null,
                    businessId: '',
                    targetDb: '',
                    targetTable: '',
                    ruleSql: ''
                }
            },
            saveInfo () {
                if (this.operatorType) {
                    this.handleRowAdd()
                } else {
                    this.handleRowEdit()
                }
            },
            fillForm ({ row }) {
                this.form = row
                this.operatorType = false
                this.dialogFormVisible = true
            },
            getBusinessDetail () {
                queryBusinessDetailPage(1, 1000)
                    .then(res => {
                        for (var index = 0; index < res.body.data.length; index++) {
                            var mapItem = {
                                value: res.body.data[index].id,
                                label: res.body.data[index].businessName
                            }
                            this.businessOptions.push(mapItem)
                        }
                    })
            },
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
                        this.form.targetTable = ''
                        this.queryParam.targetTable = ''
                    })
            },
            // 普通的新增
            handleRowAdd () {
                this.formOptions.saveLoading = true
                setTimeout(() => {
                    addRuleDetail(this.form)
                    .then(res => {
                        // 返回数据
                        this.$message({
                            message: '成功',
                            type: 'success'
                        })
                        this.fetchData()
                        this.dialogFormVisible = false
                    })

                    // done可以传入一个对象来修改提交的某个字段
                    this.formOptions.saveLoading = false
                }, 600)
            },
            handleRowRemove ({ index, row }, done) {
                setTimeout(() => {
                    delById(row.id)
                    .then(res => {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        })
                        this.fetchData()
                        done()
                    })
                }, 300)
            },
            handleRowEdit () {
                setTimeout(() => {
                    updateRuleDetail( this.form )
                        .then(res => {
                            this.$message({
                                message: '更新成功',
                                type: 'success'
                            })
                            this.fetchData()
                            this.dialogFormVisible = false
                        })
                }, 300)
            },
            paginationCurrentChange (currentPage) {
                this.pagination.currentPage = currentPage
                this.fetchData()
            },
            fetchData () {
                this.loading = true
                queryRulePage(this.queryParam.businessId, this.queryParam.targetDb, this.queryParam.targetTable, this.pagination.currentPage, this.pagination.pageSize)
                .then(res => {
                    this.data = res.body.data
                    this.pagination.total = res.body.totalNum
                    this.loading = false
                })
            }
        }
    }
</script>

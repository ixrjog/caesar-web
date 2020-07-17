<template>
    <d2-container>
        <template>
            <div>
                <h1>binlog订阅配置</h1>
            </div>
            <div>
                <el-row :gutter="24" style="margin-bottom: 5px">
                  <el-select v-model="queryParam.topic" clearable placeholder="订阅的topic" @change="getDestination()">
                    <el-option
                      v-for="item in topicOptions"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                  <el-select v-model="queryParam.destination" clearable placeholder="订阅目标" @change="getSchema()">
                    <el-option
                      v-for="item in destinationOptions"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                  <el-select v-model="queryParam.schema" clearable placeholder="订阅库" @change="getTable()">
                    <el-option
                      v-for="item in schemaOptions"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                  <el-select v-model="queryParam.table" clearable placeholder="要监听的表">
                    <el-option
                      v-for="item in schemaOptions"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                  <el-select v-model="queryParam.status" placeholder="配置状态">
                    <el-option
                      v-for="item in selectOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-button @click="fetchData">查询</el-button>
                  <el-button @click="addRow">新增</el-button>
                </el-row>
            </div>
            <div>
                <d2-crud
                        ref="d2Crud"
                        :columns="columns"
                        :data="data"
                        :options="options"
                        add-title="新增binlog订阅配置"
                        :add-template="addTemplate"
                        edit-title="修改binlog订阅配置"
                        :edit-template="addTemplate"
                        :form-options="formOptions"
                        @row-add="handleRowAdd"
                        @dialog-cancel="handleDialogCancel"
                        :rowHandle="rowHandle"
                        @row-remove="handleRowRemove"
                        @row-edit="handleRowEdit"
                        :loading="loading"
                        :pagination="pagination"
                        @status-update="updateStatus"
                        @pagination-current-change="paginationCurrentChange">
                </d2-crud>
            </div>
        </template>
    </d2-container>
</template>

<script>
    import statusTag from './statusTag'
    import ioModelTag from './ioModelTag'

    import { addBinlogConfig, queryPage, deleteById, updateBinlogConfig, updateBinlogConfigStatus, queryAvailableTopicList, queryAvailableDestinationList, queryAvailableSchemaList, queryAvailableTableList } from '@api/binlogConfig.js'

    export default {
        data () {
            return {
                columns: [
                    {
                        title: '订阅topic',
                        key: 'topic',
                        minWidth: '40%'
                    },
                    {
                        title: '订阅目标',
                        key: 'destination',
                        minWidth: '30%'
                    },
                    {
                        title: '订阅库',
                        key: 'schema',
                        minWidth: '30%'
                    },
                    {
                        title: '监听的表',
                        key: 'table',
                        minWidth: '30%'
                    },
                    {
                        title: 'IO模式',
                        key: 'ioModel',
                        component: {
                            name: ioModelTag,
                            props: {
                                myProps: ''
                            }
                        },
                        minWidth: '30%'
                    },
                    {
                        title: '并发资源数',
                        key: 'parallelNum',
                        minWidth: '30%'
                    },
                    {
                        title: '配置状态',
                        key: 'status',
                        component: {
                            name: statusTag,
                            props: {
                                myProps: ''
                            }
                        },
                        minWidth: '20%'
                    }
                ],
                data: [],
                addTemplate: {
                    topic: {
                        title: 'topic',
                        value: ''
                    },
                    destination: {
                        title: '订阅目标',
                        value: ''
                    },
                    schema: {
                        title: '订阅库',
                        value: ''
                    },
                    table: {
                        title: '监听的表',
                        value: ''
                    },
                    // ioModel: {
                    //     title: 'IO模式',
                    //     value: '',
                    //     component: {
                    //         name: 'el-select',
                    //         options: [
                    //           {
                    //             label : 'ram',
                    //             value : 1
                    //           },
                    //           {
                    //             label : 'disk',
                    //             value : 0
                    //         }]
                    //     }
                    // },
                    parallelNum: {
                        title: '并发资源',
                        value: '',
                        component: {
                            name: 'el-input-number'
                        }
                    },
                    createDdl: {
                        title: '建表DDL',
                        value: '',
                        component: {
                            name: 'el-input',
                            type: 'textarea',
                            rows: 15
                        }
                    }
                },
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
                queryParam: {
                    topic: '',
                    destination: '',
                    schema: '',
                    table: '',
                    status: ''
                },
                selectOptions: [{
                    value: '0',
                    label: '生效'
                }, {
                    value: '1',
                    label: '停用'
                }],
                rowHandle: {
                    remove: {
                        icon: 'el-icon-delete',
                        size: 'small',
                        fixed: 'right',
                        confirm: true,
                        show (index, row) {
                            return true
                        }
                    },
                    edit: {
                        icon: 'el-icon-edit',
                        size: 'small',
                        fixed: 'left',
                        confirm: false
                    },
                    custom: [
                        {
                            text: '启用/停用',
                            type: 'warning',
                            size: 'small',
                            fixed: 'left',
                            emit: 'status-update'
                        }
                    ]
                },
                topicOptions: [],
                destinationOptions: [],
                schemaOptions: [],
                tableOptions: []
            }
        },
        mounted () {
            this.fetchData()
            this.getTopic()
            this.getTable()
        },
        methods: {
            getTopic () {
                queryAvailableTopicList()
                    .then(res => {
                        this.topicOptions = res.body
                    })
            },
            getDestination () {
                queryAvailableDestinationList(this.queryParam.topic)
                    .then(res => {
                    this.destinationOptions = res.body
                })
            },
            getSchema () {
                queryAvailableSchemaList(this.queryParam.topic, this.queryParam.destination)
                    .then(res => {
                        this.schemaOptions = res.body
                    })
            },
            getTable () {
                queryAvailableTableList(this.queryParam.topic, this.queryParam.destination, this.queryParam.schema)
                    .then(res => {
                        this.tableOptions = res.body
                    })
            },
            handleClick () {
                this.$emit('input', !this.value)
            },
            // 普通的新增
            addRow () {
                this.$refs.d2Crud.showDialog({
                    mode: 'add'
                })
            },
            handleRowAdd (row, done) {
                this.formOptions.saveLoading = true
                setTimeout(() => {
                    var requestBody = {
                        'topic': row.topic,
                        'destination': row.destination,
                        'schema': row.schema,
                        'table': row.table,
                        'ioModel': 1,
                        'parallelNum': row.parallelNum,
                        'createDdl': row.createDdl
                    }
                    addBinlogConfig(requestBody)
                        .then(res => {
                            // 返回数据
                            this.$message({
                                message: '成功',
                                type: 'success'
                            })
                            done()
                        })

                    // done可以传入一个对象来修改提交的某个字段
                    this.formOptions.saveLoading = false
                }, 600)
            },
            handleRowRemove ({ index, row }, done) {
                setTimeout(() => {
                    deleteById(row.id)
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
            handleRowEdit ({ index, row }, done) {
                setTimeout(() => {
                    updateBinlogConfig({
                        id: row.id,
                        topic: row.topic,
                        destination: row.destination,
                        schema: row.schema,
                        table: row.table,
                        ioModel: 1,
                        parallelNum: row.parallelNum,
                        createDdl: row.createDdl
                    })
                        .then(res => {
                            this.$message({
                                message: '更新成功',
                                type: 'success'
                            })
                            this.fetchData()
                            done()
                        })
                }, 300)
            },
            updateStatus ({ index, row }) {
                setTimeout(() => {
                    updateBinlogConfigStatus({
                        id: row.id
                    })
                        .then(res => {
                            this.$message({
                                message: '更新成功',
                                type: 'success'
                            })
                            this.fetchData()
                        })
                }, 300)
            },
            handleDialogCancel (done) {
                this.$message({
                    message: '取消保存',
                    type: 'warning'
                })
                done()
            },
            paginationCurrentChange (currentPage) {
                this.pagination.currentPage = currentPage
                this.fetchData()
            },
            fetchData () {
                this.loading = true
                queryPage(
                    this.queryParam.topic, this.queryParam.destination, this.queryParam.schema,
                    this.queryParam.table, this.queryParam.status, this.pagination.currentPage, this.pagination.pageSize)
                .then(res => {
                    this.data = res.body.data
                    this.pagination.total = res.body.totalNum
                    this.loading = false
                })
            }
        }
    }
</script>

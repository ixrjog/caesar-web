<template>
    <d2-container>
        <template>
            <div>
                <h1>业务域管理</h1>
            </div>
            <div>
                <d2-crud
                        ref="d2Crud"
                        :columns="columns"
                        :data="data"
                        :options="options"
                        add-title="新增业务域"
                        :add-template="addTemplate"
                        edit-title="修改业务域"
                        :edit-template="addTemplate"
                        :form-options="formOptions"
                        @row-add="handleRowAdd"
                        @dialog-cancel="handleDialogCancel"
                        :rowHandle="rowHandle"
                        @row-remove="handleRowRemove"
                        @row-edit="handleRowEdit"
                        :loading="loading"
                        :pagination="pagination"
                        @pagination-current-change="paginationCurrentChange">
                    <el-button slot="header" style="margin-bottom: 5px" @click="addRow">新增</el-button>
                </d2-crud>
            </div>
        </template>
    </d2-container>
</template>

<script>

    import { addBusinessDetail, updateBusinessDetail, delById, queryBusinessDetailPage } from '@api/businessDetail.js'

    export default {
        data () {
            return {
                columns: [
                    {
                        title: '业务域名称',
                        key: 'businessName',
                        minWidth: '80%'
                    },
                    {
                        title: '创建时间',
                        key: 'createTime',
                        minWidth: '80%'
                    }
                ],
                data: [],
                addTemplate: {
                    businessName: {
                        title: '业务域',
                        value: ''
                    },
                    dingdingAccessToken: {
                        title: '钉钉token',
                        value: ''
                    },
                    dingdingSecret: {
                        title: '钉钉密钥',
                        value: ''
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
                    }
                }
            }
        },
        mounted () {
            this.fetchData()
        },
        methods: {
            // 普通的新增
            addRow () {
                this.$refs.d2Crud.showDialog({
                    mode: 'add'
                })
            },
            handleRowAdd (row, done) {
                this.formOptions.saveLoading = true
                setTimeout(() => {
                    addBusinessDetail({
                        businessName: row.businessName,
                        dingdingAccessToken: row.dingdingAccessToken,
                        dingdingSecret: row.dingdingSecret
                    })
                    .then(res => {
                        // 返回数据
                        this.$message({
                            message: '成功',
                            type: 'success'
                        });
                        this.fetchData()
                        done()
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
            handleRowEdit ({ index, row }, done) {
                setTimeout(() => {
                    updateBusinessDetail({
                        id : row.id,
                        businessName: row.businessName,
                        dingdingAccessToken: row.dingdingAccessToken,
                        dingdingSecret: row.dingdingSecret
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
            handleDialogCancel (done) {
                this.$message({
                    message: '取消保存',
                    type: 'warning'
                });
                done()
            },
            paginationCurrentChange (currentPage) {
                this.pagination.currentPage = currentPage
                this.fetchData()
            },
            fetchData () {
                this.loading = true
                queryBusinessDetailPage(this.pagination.currentPage, this.pagination.pageSize)
                .then(res => {
                    this.data = res.body.data
                    this.pagination.total = res.body.totalNum
                    this.loading = false
                })
            }
        }
    }
</script>

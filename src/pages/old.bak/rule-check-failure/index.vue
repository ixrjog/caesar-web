<template>
    <d2-container>
        <template>
            <div>
                <h1>检查失败记录</h1>
            </div>
            <div>
                <el-row :gutter="24" style="margin-bottom: 5px">
                    <el-col :span="4">
                        <el-input v-model="queryParam.equalKey" placeholder="等式key"/>
                    </el-col>
                    <el-col :span="4">
                        <el-button @click="fetchData">查询</el-button>
                    </el-col>
                </el-row>
            </div>
            <div>
                <d2-crud
                        ref="d2Crud"
                        :columns="columns"
                        :data="data"
                        :options="options"
                        :loading="loading"
                        :pagination="pagination"
                        @pagination-current-change="paginationCurrentChange">
                </d2-crud>
            </div>
        </template>
    </d2-container>
</template>

<script>

    import { queryPage } from '@api/ruleCheckFailure.js'
    import statusTag from './statusTag'

    export default {
        data () {
            return {
                columns: [
                    {
                        title: '业务域',
                        key: 'businessName',
                        minWidth: '50%'
                    },
                    {
                        title: '业务规则描述',
                        key: 'ruleDesc',
                        minWidth: '80%'
                    },
                    {
                        title: '左规则',
                        key: 'ruleDetailLeftDesc',
                        minWidth: '60%'
                    },
                    {
                        title: '右规则',
                        key: 'ruleDetailRightDesc',
                        minWidth: '60%'
                    },
                    {
                        title: '等式依托key',
                        key: 'equalKey',
                        minWidth: '80%'
                    },
                    {
                        title: '失败原因',
                        key: 'reason',
                        minWidth: '80%'
                    },
                    {
                        title: '失败状态',
                        key: 'status',
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
                        minWidth: '70%'
                    },
                    {
                        title: '更新时间',
                        key: 'updateTime',
                        minWidth: '70%'
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
                    pageSize: 12,
                    total: 0
                },
                queryParam : {
                    equalKey : ''
                }
            }
        },
        mounted () {
            this.fetchData()
        },
        methods: {
            paginationCurrentChange (currentPage) {
                this.pagination.currentPage = currentPage
                this.fetchData()
            },
            fetchData () {
                this.loading = true
                queryPage(this.queryParam.equalKey, this.pagination.currentPage, this.pagination.pageSize)
                .then(res => {
                    this.data = res.body.data
                    this.pagination.total = res.body.totalNum
                    this.loading = false
                })
            }
        }
    }
</script>

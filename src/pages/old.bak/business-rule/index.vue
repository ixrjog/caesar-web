<template>
    <d2-container>
        <template>
            <div>
                <h1>业务规则</h1>
            </div>
            <div>
                <el-row :gutter="24" style="margin-bottom: 5px">
                    <el-col :span="4">
                        <el-select v-model="queryParam.businessId" clearable placeholder="业务域">
                            <el-option
                                    v-for="item in businessOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="4">
                        <el-button @click="fetchData">查询</el-button>
                        <el-button @click="handleAdd">新增</el-button>
                    </el-col>
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
                        :loading="loading"
                        :pagination="pagination"
                        @update-data="handleEdit"
                        @pagination-current-change="paginationCurrentChange">
                </d2-crud>
            </div>
        </template>
    </d2-container>
</template>

<script>
    import statusTag from './statusTag'
    import checkType from './checkType'
    import timeoutUnit from './timeoutUnit'

    import { delById, queryPage } from '@api/businessRule.js'
    import { queryBusinessDetailPage } from '@api/businessDetail.js'

    export default {
        data () {
            return {
                columns: [
                    {
                        title: '业务域',
                        key: 'businessName',
                        minWidth: '30%'
                    },
                    {
                        title: '规则描述',
                        key: 'ruleDesc',
                        minWidth: '50%'
                    },
                    {
                        title: '左等式',
                        key: 'ruleDetailLeftDesc',
                        minWidth: '50%'
                    },
                    {
                        title: '右等式',
                        key: 'ruleDetailRightDesc',
                        minWidth: '50%'
                    },
                    {
                        title: '校验类型',
                        key: 'checkType',
                        minWidth: '30%',
                        component: {
                            name: checkType,
                            props: {
                                myProps: ''
                            }
                        }
                    },
                    {
                        title: '状态',
                        key: 'status',
                        minWidth: '30%',
                        component: {
                            name: statusTag,
                            props: {
                                myProps: ''
                            }
                        }
                    },
                    {
                        title: '超时数量',
                        key: 'timeoutNum',
                        minWidth: '30%'
                    },
                    {
                        title: '超时单位',
                        key: 'timeoutUnit',
                        minWidth: '30%',
                        component: {
                            name: timeoutUnit,
                            props: {
                                myProps: ''
                            }
                        }
                    },
                    {
                        title: '创建时间',
                        key: 'createTime',
                        minWidth: '50%'
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
                            text: '编辑',
                            size: 'small',
                            fixed: 'left',
                            emit: 'update-data'
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
                    businessId: ''
                },
                businessOptions: []
            }
        },
        mounted () {
            this.getBusinessDetail()
            this.fetchData()
        },
        methods: {
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
            handleEdit ({ index, row }) {
                this.$router.push({
                    path: '/business/rule/detail?id=' + row.id
                })
            },
            handleAdd () {
                this.$router.push({
                    name: 'business-rule-detail'
                })
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
            paginationCurrentChange (currentPage) {
                this.pagination.currentPage = currentPage
                this.fetchData()
            },
            fetchData () {
                this.loading = true
                queryPage(this.queryParam.businessId, this.pagination.currentPage, this.pagination.pageSize)
                .then(res => {
                    this.data = res.body.data
                    this.pagination.total = res.body.totalNum
                    this.loading = false
                })
            }
        }
    }
</script>

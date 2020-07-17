<template>
    <d2-container>
        <template>
            <div>
                <el-row :gutter="24" style="margin-bottom: 5px">
                    <el-col>
                        <h1 style="display:inline-block;margin-right:20px">业务规则详情</h1>
                        <el-button type="text" @click="goback">返回列表</el-button>
                    </el-col>
                </el-row>
            </div>
            <el-form :model="form" label-position="top">
                <el-form-item label="业务域" :label-width="formLabelWidth" required>
                    <el-select v-model="form.businessId" clearable placeholder="业务域">
                        <el-option
                                v-for="item in businessOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="查询模式" :label-width="formLabelWidth" required>
                    <el-select v-model="form.queryMode"  placeholder="查询模式" @change="changeQueryMode">
                        <el-option
                                v-for="item in queryModesOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="规则Mapping" :label-width="formLabelWidth" required>
                  <el-tabs type="card">
                    <el-tab-pane label="左规则">
                      <table class="el-table">
                        <tr>
                          <td style="width: 100px;">
                            规则SQL
                          </td>
                          <td>
                            <div>
                              <div>
                                <el-select v-model="left.targetDb" clearable placeholder="从属topic" @change="getTargetTableLeft(left.targetDb)" style="display: inline-block;max-width:200px;">
                                  <el-option
                                    v-for="item in targetDbOptions"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                                  </el-option>
                                </el-select>
                                <el-select v-model="left.targetTable" clearable placeholder="从属表" @change="getRuleDetailLeft(left.targetDb, left.targetTable)">
                                  <el-option
                                    v-for="item in left.targetTableOptions"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                                  </el-option>
                                </el-select>
                                <el-select v-model="form.ruleEqualLeftId" clearable placeholder="左规则SQL" @change="leftChange($event)">
                                  <el-option
                                    v-for="item in left.ruleDetailOptions"
                                    :key="item.id"
                                    :label="item.ruleDetailDesc"
                                    :value="item.id">
                                  </el-option>
                                </el-select>
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>具体SQL</td>
                          <td><div>{{left.ruleSql}}</div></td>
                        </tr>
                        <tr v-if="left.ioModel === 0">
                          <td>参数</td>
                          <td>
                            <table>
                              <tr>
                                <td>查询参数</td>
                                <td>对应变量</td>
                              </tr>
                              <tr>
                                <td>
                                  查询开始位置（fromIndex）
                                </td>
                                <td>
                                  <el-select v-model="form.columnMapping.left.param.fromIndex" clearable placeholder="变量">
                                    <el-option
                                      v-for="item in left.paramQuerys"
                                      :key="item"
                                      :label="item"
                                      :value="item">
                                    </el-option>
                                  </el-select>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  查询结束位置（toIndex）
                                </td>
                                <td>
                                  <el-select v-model="form.columnMapping.left.param.toIndex" clearable placeholder="变量">
                                    <el-option
                                      v-for="item in left.paramQuerys"
                                      :key="item"
                                      :label="item"
                                      :value="item">
                                    </el-option>
                                  </el-select>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td>查询列</td>
                          <td>
                            <table>
                              <tr>
                                <td>列类型</td>
                                <td>映射查询列</td>
                                <td>数据类型</td>
                                <td>数据格式</td>
                              </tr>
                              <tr>
                                <td>equalKey</td>
                                <td>
                                  <el-select v-model="form.columnMapping.left.equalKey.key" clearable placeholder="变量">
                                    <el-option
                                      v-for="item in left.columnQuerys"
                                      :key="item"
                                      :label="item"
                                      :value="item">
                                    </el-option>
                                  </el-select>
                                </td>
                                <td></td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>uniqueKey</td>
                                <td>
                                  <el-select v-model="form.columnMapping.left.uniqueKey.key" clearable placeholder="变量">
                                    <el-option
                                      v-for="item in left.columnQuerys"
                                      :key="item"
                                      :label="item"
                                      :value="item">
                                    </el-option>
                                  </el-select>
                                </td>
                                <td></td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>eventTime</td>
                                <td>
                                  <el-select v-model="form.columnMapping.left.eventTime.key" clearable placeholder="变量">
                                    <el-option
                                      v-for="item in left.columnQuerys"
                                      :key="item"
                                      :label="item"
                                      :value="item">
                                    </el-option>
                                  </el-select>
                                </td>
                                <td>
                                  <el-select v-model="form.columnMapping.left.eventTime.dataType" clearable placeholder="数据类型">
                                    <el-option
                                      v-for="item in dataTypeOptions"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value">
                                    </el-option>
                                  </el-select>
                                </td>
                                <td>
                                  <el-select v-model="form.columnMapping.left.eventTime.format" clearable placeholder="数据格式">
                                    <el-option
                                      v-for="item in formatOptions"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value">
                                    </el-option>
                                  </el-select>
                                </td>
                              </tr>
                              <tr>
                                <td>procTime</td>
                                <td>
                                  <el-select v-model="form.columnMapping.left.procTime.key" clearable placeholder="变量">
                                    <el-option
                                      v-for="item in left.columnQuerys"
                                      :key="item"
                                      :label="item"
                                      :value="item">
                                    </el-option>
                                  </el-select>
                                </td>
                                <td>
                                  <el-select v-model="form.columnMapping.left.procTime.dataType" clearable placeholder="数据类型">
                                    <el-option
                                      v-for="item in dataTypeOptions"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value">
                                    </el-option>
                                  </el-select>
                                </td>
                                <td>
                                  <el-select v-model="form.columnMapping.left.procTime.format" clearable placeholder="数据格式">
                                    <el-option
                                      v-for="item in formatOptions"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value">
                                    </el-option>
                                  </el-select>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td>扩展列</td>
                          <td>
                            <div>
                              <el-button @click="addLeft()">增加扩展列</el-button>
                              <d2-crud class="testaaa"
                                       ref="leftExtend"
                                       :columns="columns"
                                       add-title="新增扩展列"
                                       @row-add="handleLeftRowAdd"
                                       @row-remove="handleLeftRowRemove"
                                       :add-template="addTemplate"
                                       :rowHandle="leftRowHandle"
                                       :data="form.columnMapping.left.extend"
                                       @dialog-cancel="handleDialogCancel"
                                       :form-options="formOptions"
                                       :options="options">
                              </d2-crud>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </el-tab-pane>
                    <el-tab-pane label="右规则">
                      <table class="el-table">
                        <tr>
                          <td style="width: 100px;">
                            规则SQL
                          </td>
                          <td>
                            <div>
                              <div>
                                <el-select v-model="right.targetDb" clearable placeholder="从属topic" @change="getTargetTableRight(right.targetDb)" style="display: inline-block;max-width:200px;">
                                  <el-option
                                    v-for="item in targetDbOptions"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                                  </el-option>
                                </el-select>
                                <el-select v-model="right.targetTable" clearable placeholder="从属表" @change="getRuleDetailRight(right.targetDb, right.targetTable)">
                                  <el-option
                                    v-for="item in right.targetTableOptions"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                                  </el-option>
                                </el-select>
                                <el-select v-model="form.ruleEqualRightId" clearable placeholder="右规则SQL" @change="rightChange($event)">
                                  <el-option
                                    v-for="item in right.ruleDetailOptions"
                                    :key="item.id"
                                    :label="item.ruleDetailDesc"
                                    :value="item.id">
                                  </el-option>
                                </el-select>
                              </div>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>具体SQL</td>
                          <td><div>{{right.ruleSql}}</div></td>
                        </tr>
                        <tr v-if="right.ioModel === 0">
                          <td>参数</td>
                          <td>
                            <table>
                              <tr>
                                <td>查询参数</td>
                                <td>对应变量</td>
                              </tr>
                              <tr>
                                <td>
                                  查询开始位置（fromIndex）
                                </td>
                                <td>
                                  <el-select v-model="form.columnMapping.right.param.fromIndex" clearable placeholder="变量">
                                    <el-option
                                      v-for="item in right.paramQuerys"
                                      :key="item"
                                      :label="item"
                                      :value="item">
                                    </el-option>
                                  </el-select>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  查询结束位置（toIndex）
                                </td>
                                <td>
                                  <el-select v-model="form.columnMapping.right.param.toIndex" clearable placeholder="变量">
                                    <el-option
                                      v-for="item in right.paramQuerys"
                                      :key="item"
                                      :label="item"
                                      :value="item">
                                    </el-option>
                                  </el-select>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td>查询列</td>
                          <td>
                            <table>
                              <tr>
                                <td>列类型</td>
                                <td>映射查询列</td>
                                <td>数据类型</td>
                                <td>数据格式</td>
                              </tr>
                              <tr>
                                <td>equalKey</td>
                                <td>
                                  <el-select v-model="form.columnMapping.right.equalKey.key" clearable placeholder="变量">
                                    <el-option
                                      v-for="item in right.columnQuerys"
                                      :key="item"
                                      :label="item"
                                      :value="item">
                                    </el-option>
                                  </el-select>
                                </td>
                                <td></td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>uniqueKey</td>
                                <td>
                                  <el-select v-model="form.columnMapping.right.uniqueKey.key" clearable placeholder="变量">
                                    <el-option
                                      v-for="item in right.columnQuerys"
                                      :key="item"
                                      :label="item"
                                      :value="item">
                                    </el-option>
                                  </el-select>
                                </td>
                                <td></td>
                                <td></td>
                              </tr>
                              <tr>
                                <td>eventTime</td>
                                <td>
                                  <el-select v-model="form.columnMapping.right.eventTime.key" clearable placeholder="变量">
                                    <el-option
                                      v-for="item in right.columnQuerys"
                                      :key="item"
                                      :label="item"
                                      :value="item">
                                    </el-option>
                                  </el-select>
                                </td>
                                <td>
                                  <el-select v-model="form.columnMapping.right.eventTime.dataType" clearable placeholder="数据类型">
                                    <el-option
                                      v-for="item in dataTypeOptions"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value">
                                    </el-option>
                                  </el-select>
                                </td>
                                <td>
                                  <el-select v-model="form.columnMapping.right.eventTime.format" clearable placeholder="数据格式">
                                    <el-option
                                      v-for="item in formatOptions"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value">
                                    </el-option>
                                  </el-select>
                                </td>
                              </tr>
                              <tr>
                                <td>procTime</td>
                                <td>
                                  <el-select v-model="form.columnMapping.right.procTime.key" clearable placeholder="变量">
                                    <el-option
                                      v-for="item in right.columnQuerys"
                                      :key="item"
                                      :label="item"
                                      :value="item">
                                    </el-option>
                                  </el-select>
                                </td>
                                <td>
                                  <el-select v-model="form.columnMapping.right.procTime.dataType" clearable placeholder="数据类型">
                                    <el-option
                                      v-for="item in dataTypeOptions"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value">
                                    </el-option>
                                  </el-select>
                                </td>
                                <td>
                                  <el-select v-model="form.columnMapping.right.procTime.format" clearable placeholder="数据格式">
                                    <el-option
                                      v-for="item in formatOptions"
                                      :key="item.value"
                                      :label="item.label"
                                      :value="item.value">
                                    </el-option>
                                  </el-select>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td>扩展列</td>
                          <td>
                            <el-button @click="addRight()">增加扩展列</el-button>
                            <d2-crud
                              ref="rightExtend"
                              :columns="columns"
                              add-title="新增扩展列"
                              @row-add="handleRightRowAdd"
                              @row-remove="handleRightRowRemove"
                              :add-template="addTemplate"
                              :rowHandle="rightRowHandle"
                              :data="form.columnMapping.right.extend"
                              @dialog-cancel="handleDialogCancel"
                              :form-options="formOptions"
                              :options="options">
                            </d2-crud>
                          </td>
                        </tr>
                      </table>
                    </el-tab-pane>
                  </el-tabs>
                </el-form-item>
                <el-form-item label="关注类型" :label-width="formLabelWidth" required>
                <el-select v-model="form.watchType" clearable placeholder="关注类型">
                  <el-option
                    v-for="item in watchTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
                <el-form-item label="校验类型" :label-width="formLabelWidth" required>
                  <el-select v-model="form.checkType" clearable placeholder="校验类型">
                    <el-option
                      v-for="item in checkTypeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="校验规则" :label-width="formLabelWidth" v-if="form.checkType === 1">
                    <el-button @click="addRuleCheck()">增加校验规则</el-button>
                    <d2-crud
                            ref="checkRule"
                            :columns="checkRuleColumns"
                            add-title="新增校验规则"
                            @row-add="handleRuleCheckRowAdd"
                            @row-remove="handleRuleCheckRowRemove"
                            :add-template="addCheckRuleTemplate"
                            :rowHandle="rightRowHandle"
                            :data="form.checkRulesList"
                            @dialog-cancel="handleDialogCancel"
                            :form-options="formOptions"
                            :options="options">
                    </d2-crud>
                </el-form-item>
                <el-form-item label="窗口设置" :label-width="formLabelWidth" required>
                    <el-input  type="number" style="display: inline-block;max-width:200px;" placeholder="超时数量" v-model="form.timeoutNum"/>
                    <el-select v-model="form.timeoutUnit" clearable placeholder="超时单位">
                        <el-option
                                v-for="item in timeoutOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="规则描述" :label-width="formLabelWidth" required>
                    <el-input placeholder="业务规则描述" v-model="form.ruleDesc"/>
                </el-form-item>
                <el-form-item label="状态" :label-width="formLabelWidth" v-if="operatorType">
                    <el-select v-model="form.status" clearable placeholder="状态">
                        <el-option
                                v-for="item in statusOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="text-align: center;" >
                    <el-button @click="save">保存</el-button>
                </el-form-item>
            </el-form>
        </template>
    </d2-container>
</template>

<script>

    import { queryRulePage } from '@api/ruleDetail.js'
    import { queryBusinessDetailPage } from '@api/businessDetail.js'
    import { addBusinessRule, updateBusinessRule, queryById } from '@api/businessRule.js'
    import { queryAvailableTopicList, queryAvailableTableList } from '@api/binlogConfig.js'

    export default {
        data () {
            return {
                checkRuleColumns: [
                  {
                    title: '规则引擎类型',
                    key: 'engineType',
                    minWidth: '60%'
                  },
                  {
                      title: '校验规则明细',
                      key: 'ruleDetail',
                      minWidth: '240%'
                  }
                ],
                columns: [
                    {
                        title: '扩展列',
                        key: 'key',
                        minWidth: '80%'
                    },
                    {
                        title: '数据类型',
                        key: 'dataType',
                        minWidth: '80%'
                    },
                    {
                        title: '数据格式',
                        key: 'format',
                        minWidth: '80%'
                    },
                    {
                        title: '聚合方式',
                        key: 'aggregation',
                        minWidth: '80%'
                    }
                ],
                addCheckRuleTemplate: {
                    engineType: {
                      title: '规则引擎',
                      value: '',
                      component: {
                        name: 'el-select',
                        options: [{
                            label: 'spel',
                            value: 'spel'
                        }]
                      }
                    },
                    ruleDetail: {
                      title: '规则明细',
                      value: ''
                    }
                },
                addTemplate: {
                    key: {
                        title: '列key',
                        value: '',
                        component: {
                            name: 'el-select',
                            options: [{
                                label: '列维度sum',
                                value: 'column-sum'
                            }]
                        }
                    },
                    dataType: {
                        title: '数据类型',
                        value: '',
                        component: {
                            name: 'el-select',
                            options: [{
                                label: 'number',
                                value: 'number'
                            }]
                        }
                    },
                    format: {
                        title: '数据格式',
                        value: '',
                        component: {
                            name: 'el-select',
                            options: []
                        }
                    },
                    aggregation: {
                        title: '聚合方式',
                        value: '',
                        component: {
                            name: 'el-select',
                            options: [{
                                label: '列维度sum',
                                value: 'column-sum'
                            }]
                        }
                    }
                },
                leftRowHandle: {
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
                rightRowHandle: {
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
                options: {
                    stripe: true
                },
                formOptions: {
                    labelWidth: '80px',
                    labelPosition: 'left',
                    saveLoading: false
                },
                left: {
                    targetDb: '',
                    targetTable: '',
                    ruleSql: '',
                    ioModel: '',
                    columnQuerys: [],
                    paramQuerys: [],
                    targetTableOptions: [],
                    ruleDetailOptions: []
                },
                right: {
                    targetDb: '',
                    targetTable: '',
                    ruleSql: '',
                    ioModel: '',
                    columnQuerys: [],
                    paramQuerys: [],
                    targetTableOptions: [],
                    ruleDetailOptions: []
                },
                form: {
                    id: null,
                    businessId: '',
                    queryMode: '',
                    ruleDesc: '',
                    checkType: '',
                    watchType: '',
                    ruleEqualLeftId: '',
                    ruleEqualRightId: '',
                    timeoutNum: '',
                    timeoutUnit: '',
                    status: '',
                    columnMapping: {
                        left: {
                            equalKey: {
                                key: ''
                            },
                            uniqueKey: {
                                key: ''
                            },
                            eventTime: {
                                key: '',
                                dataType: '',
                                format: ''
                            },
                            procTime: {
                                key: '',
                                dataType: '',
                                format: ''
                            },
                            param: {
                                fromIndex: '',
                                toIndex: ''
                            },
                            extend: []
                        },
                        right: {
                            equalKey: {
                                key: ''
                            },
                            uniqueKey: {
                                key: ''
                            },
                            eventTime: {
                                key: '',
                                dataType: '',
                                format: ''
                            },
                            procTime: {
                                key: '',
                                dataType: '',
                                format: ''
                            },
                            param: {
                                fromIndex: '',
                                toIndex: ''
                            },
                            extend: []
                        }
                    },
                    checkRulesList: []
                },
                formLabelWidth: '100px',
                checkTypeOptions: [{
                    label: '完整性校验',
                    value: 0
                }, {
                    label: '对帐校验',
                    value: 1
                }],
                watchTypeOptions: [{
                  label: '关注所有',
                  value: 0
                }, {
                  label: '关注左边',
                  value: 1
                }, {
                  label: '关注右边',
                  value: 2
                }],
                dataTypeOptions: [{
                    label: 'timestamp',
                    value: 'timestamp'
                }],
                formatOptions: [{
                    label: 'yyyy-MM-dd HH:mm:ss',
                    value: 'yyyy-MM-dd HH:mm:ss'
                }],
                timeoutOptions: [{
                    label: '分钟',
                    value: 0
                },
                {
                    label: '小时',
                    value: 1
                }],
                statusOptions: [{
                    label: '已提交',
                    value: 0
                }, {
                    label: '已上线',
                    value: 1
                }, {
                    label: '停用',
                    value: 2
                }],
                queryModesOptions: [{
                    label: '1:1',
                    value: 0
                }, {
                    label: '1:n',
                    value: 1
                }, {
                    label: 'n:1',
                    value: 2
                }],
                businessOptions: [],
                targetDbOptions: [],
                operatorType: false
            }
        },
        mounted () {
            this.getBusinessDetail()
            this.getTargetDB()
            this.getBusinessRuleDetail(this.$route.query.id)
            if (this.$route.query.id === null || this.$route.query.id === undefined || this.$route.query.id === '') {
                this.operatorType = false
            } else {
                this.operatorType = true
            }
        },
        methods: {
            getBusinessRuleDetail (businessRuleId) {
                if (businessRuleId === null || businessRuleId === undefined || businessRuleId === '') {
                    return
                }
                queryById(businessRuleId).then(res => {
                    this.form = res.body
                    if (this.form.columnMapping.left.eventTime === null) {
                        this.form.columnMapping.left.eventTime = {
                            key: '',
                            dataType: '',
                            format: ''
                        }
                    }
                    if (this.form.columnMapping.left.procTime === null) {
                        this.form.columnMapping.left.procTime = {
                            key: '',
                            dataType: '',
                            format: ''
                        }
                    }
                    if (this.form.columnMapping.right.eventTime === null) {
                        this.form.columnMapping.right.eventTime = {
                            key: '',
                            dataType: '',
                            format: ''
                        }
                    }
                    if (this.form.columnMapping.right.procTime === null) {
                        this.form.columnMapping.right.procTime = {
                            key: '',
                            dataType: '',
                            format: ''
                        }
                    }
                    if (this.form.columnMapping.left.uniqueKey === null) {
                      this.form.columnMapping.left.uniqueKey = {
                        key: ''
                      }
                    }
                  if (this.form.columnMapping.right.uniqueKey === null) {
                    this.form.columnMapping.right.uniqueKey = {
                      key: ''
                    }
                  }

                    this.getTargetTableLeft(res.body.ruleDetailLeft.targetDb, res.body.ruleDetailLeft.targetTable)
                    this.getTargetTableRight(res.body.ruleDetailRight.targetDb, res.body.ruleDetailRight.targetTable)

                    this.left = res.body.ruleDetailLeft
                    this.left.ruleDetailOptions = [{
                        id: res.body.ruleDetailLeft.id,
                        ruleDetailDesc: res.body.ruleDetailLeft.ruleDetailDesc
                    }]
                    this.right = res.body.ruleDetailRight
                    this.right.ruleDetailOptions = [{
                        id: res.body.ruleDetailRight.id,
                        ruleDetailDesc: res.body.ruleDetailRight.ruleDetailDesc
                    }]

                    if (this.form.checkRulesList === null || this.form.checkRulesList === undefined) {
                      this.form.checkRulesList = []
                    }
                })
            },
            goback () {
                this.$router.push({
                    name: 'business-rule'
                })
            },
            addLeft () {
                var columnList = []
                for (var index = 0; index < this.left.columnQuerys.length; index++) {
                    columnList.push({
                        label: this.left.columnQuerys[index],
                        value: this.left.columnQuerys[index]
                    })
                }
                this.addTemplate.key.component.options = columnList

                this.$refs.leftExtend.showDialog({
                    mode: 'add'
                })
            },
            handleLeftRowAdd (row, done) {
                this.form.columnMapping.left.extend.push(row)
                done()
            },
            handleLeftRowRemove ({ index, row }, done) {
                this.form.columnMapping.left.extend.splice(index, 1)
                done()
            },

            addRight () {
                var columnList = []
                for (var index = 0; index < this.right.columnQuerys.length; index++) {
                    columnList.push({
                        label: this.right.columnQuerys[index],
                        value: this.right.columnQuerys[index]
                    })
                }
                this.addTemplate.key.component.options = columnList

                this.$refs.rightExtend.showDialog({
                    mode: 'add'
                })
            },
            handleRightRowAdd (row, done) {
                this.form.columnMapping.right.extend.push(row)
                done()
            },
            handleRightRowRemove ({ index, row }, done) {
                this.form.columnMapping.right.extend.splice(index, 1)
                done()
            },

            addRuleCheck () {
                this.$refs.checkRule.showDialog({
                    mode: 'add'
                })
            },
            handleRuleCheckRowAdd (row, done) {
              if (this.form.checkRulesList === null || this.form.checkRulesList === undefined) {
                this.form.checkRulesList = []
              }
              if (row !== null && row !== undefined) {
                this.form.checkRulesList.push(row)
              }
              done()
            },
            handleRuleCheckRowRemove ({ index, row }, done) {
                this.form.checkRulesList.splice(index, 1)
                done()
            },

            leftChange (event) {
                for (var index = 0; index < this.left.ruleDetailOptions.length; index++) {
                    if (this.left.ruleDetailOptions[index].id === event) {
                        this.left = this.left.ruleDetailOptions[index]
                        break
                    }
                }
            },
            rightChange (event) {
                for (var index = 0; index < this.right.ruleDetailOptions.length; index++) {
                    if (this.right.ruleDetailOptions[index].id === event) {
                        this.right = this.right.ruleDetailOptions[index]
                        break
                    }
                }
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
            changeQueryMode () {
                if (this.form.queryMode === 0) {
                    this.form.columnMapping.left.uniqueKey.key = ''
                    this.form.columnMapping.right.uniqueKey.key = ''
                } else if (this.form.queryMode === 1) {
                    this.form.columnMapping.left.uniqueKey.key = ''
                } else {
                    this.form.columnMapping.right.uniqueKey.key = ''
                }
            },
            getTargetTableLeft (targetDb, targetTable) {
                queryAvailableTableList(targetDb, '', '')
                    .then(res => {
                        this.left.targetTableOptions = res.body
                        if (targetTable === null || targetTable === '' || targetTable === undefined) {
                            this.left.targetTable = ''
                        } else {
                            this.left.targetTable = targetTable
                        }
                    })
            },
            getRuleDetailLeft (targetDb, targetTable) {
                if (this.form.businessId === '') {
                    this.$message({
                        message: '业务域必选！',
                        type: 'error'
                    })
                    return
                }
                queryRulePage(this.form.businessId, targetDb, targetTable, 1, 1000)
                    .then(res => {
                        this.left.ruleDetailOptions = res.body.data
                    })
            },
            getTargetTableRight (targetDb, targetTable) {
                queryAvailableTableList(targetDb, '', '')
                    .then(res => {
                        this.right.targetTableOptions = res.body
                        if (targetTable === null || targetTable === '' || targetTable === undefined) {
                            this.right.targetTable = ''
                        } else {
                            this.right.targetTable = targetTable
                        }
                    })
            },
            getRuleDetailRight (targetDb, targetTable) {
                if (this.form.businessId === '') {
                    this.$message({
                        message: '业务域必选！',
                        type: 'error'
                    })
                    return
                }
                queryRulePage(this.form.businessId, targetDb, targetTable, 1, 1000)
                    .then(res => {
                        this.right.ruleDetailOptions = res.body.data
                    })
            },
            save () {
              if (!this.operatorType) {
                addBusinessRule(this.form)
                    .then(res => {
                        this.$message({
                            message: '保存成功！',
                            type: 'success'
                        })
                    })
              } else {
                  updateBusinessRule(this.form)
                      .then(res => {
                          this.$message({
                              message: '保存成功！',
                              type: 'success'
                          })
                      })
              }
            },
            handleDialogCancel (done) {
                this.$message({
                    message: '取消保存',
                    type: 'warning'
                })
                done()
            }
        }
    }
</script>

<style>
    .rule-label{
        width: 80px;
        display: inline-block;
    }
    .el-dialog__body .el-form-item__label{
        float: left
    }
</style>

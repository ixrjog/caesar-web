<template>
    <d2-container>
        <template>
            <div>
                <h1>助力类型管理</h1>
            </div>
          <div>
            <template>
              <div style="margin-bottom: 5px">
                <el-select v-model="queryParam.assitAppId" placeholder="助力应用">
                  <el-option
                    v-for="item in assitAppList"
                    :key="item.id"
                    :label="item.appName"
                    :value="item.id">
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
                <el-button @click="addItem">新增</el-button>
              </div>
              <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column fixed prop="id" label="id" width="100"></el-table-column>
                <el-table-column prop="assitAppName" label="应用名称" width="200"></el-table-column>
                <el-table-column prop="typeName" label="助力类型名称" width="200"></el-table-column>
                <el-table-column prop="typeDesc" label="助力类型描述" width="200"></el-table-column>
                <el-table-column label="logo" width="80" className="logo">
                  <template slot-scope="scope">
                    <el-image
                      style="width: 60px; height: 60px"
                      :src="scope.row.typeLogo"
                      fit="fill">
                      <div slot="placeholder" class="image-slot">
                        加载中<span class="dot">...</span>
                      </div>
                    </el-image>
                  </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" width="70">
                  <template slot-scope="scope">
                    <el-tag
                      :type="scope.row.status === 0 ? 'success' : 'primary'"
                      disable-transitions>{{scope.row.status === 0 ? '启用' : '停用'}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="fromTime" label="活动开始时间" width="160"></el-table-column>
                <el-table-column prop="toTime" label="活动结束时间" width="160"></el-table-column>
                <el-table-column label="活动提交超时时间" width="160">
                  <template slot-scope="scope">
                    <el-tag
                      :type="'success'"
                      disable-transitions>{{scope.row.submitTimeoutNum}}
                      {{scope.row.submitTimeoutUnit === 0 ? '分钟' :
                      scope.row.submitTimeoutUnit === 1 ? '小时' :
                      scope.row.submitTimeoutUnit === 2 ? '天' :
                      scope.row.submitTimeoutUnit === 3 ? '周' :
                      scope.row.submitTimeoutUnit === 4 ? '月' :
                      scope.row.submitTimeoutUnit === 5 ? '季度' : '年'}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="gmtCreate" label="创建时间" width="160"></el-table-column>
                <el-table-column fixed="right" label="操作" width="220">
                  <template slot-scope="scope">
                    <el-button type="primary" plain size="small" @click="updateItemStatus(scope.row)">{{scope.row.status === 0 ? '停用' : '启用'}}</el-button>
                    <el-button type="warning" plain size="small" @click="updateItem(scope.row)">编辑</el-button>
                    <el-button type="danger" plain size="small" @click="delItem(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination background @current-change="paginationCurrentChange"
                layout="prev, pager, next" :total="pagination.total" :current-page="pagination.currentPage" :page-size="pagination.pageSize">
              </el-pagination>
            </template>
          </div>
          <el-dialog :title="dialogForm.operationType ? dialogForm.addTitle : dialogForm.updateTitle" :visible.sync="dialogForm.visible">
            <el-form :model="form">
              <el-form-item label="助力应用" :label-width="formLabelWidth">
                <el-select v-model="form.assitAppId" placeholder="助力应用">
                  <el-option
                    v-for="item in assitAppList"
                    :key="item.id"
                    :label="item.appName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="类型名称" :label-width="formLabelWidth">
                <el-input type="input" v-model="form.typeName" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="类型描述" :label-width="formLabelWidth">
                <el-input type="input" v-model="form.typeDesc" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="logo" :label-width="formLabelWidth">
                <el-upload
                  class="avatar-uploader"
                  action="//api.pingtuanbuluo.com/ptbl/store/file"
                  :show-file-list="false"
                  :with-credentials="true"
                  :on-success="handleUploadSuccess"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove">
                  <img v-if="dialogImageUrl" :src="dialogImageUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
              <el-form-item label="活动时间" :label-width="formLabelWidth">
                <el-date-picker
                  v-model="form.activityTime"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="提交有效期" :label-width="formLabelWidth">
                <el-input-number v-model="form.submitTimeoutNum" :min="1" :max="100"></el-input-number>
                <el-select v-model="form.submitTimeoutUnit" placeholder="请选择">
                  <el-option
                    v-for="item in unitOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogForm.visible = false">取 消</el-button>
              <el-button type="primary" @click="saveInfo">确 定</el-button>
            </div>
          </el-dialog>
        </template>
    </d2-container>
</template>

<script>
    import { queryAssitAppPage } from '@api/assitApp.js'
    import { addAssitType, updateAssitType, queryPage, delAssitType } from '@api/assitType.js'

    export default {
        data () {
            return {
              dialogImageUrl: '',
              dialogVisible: false,

              formLabelWidth: '100px',
              dialogForm: {
                visible: false,
                addTitle: '新增助力类型',
                updateTitle: '更新助力类型',
                operationType: true
              },
              tableData: [],
              assitAppList:[],
              form: {
                id: '',
                assitAppId: '',
                typeName: '',
                typeDesc: '',
                typeLogo: '',
                activityTime: [],
                status: '',
                submitTimeoutNum: '',
                submitTimeoutUnit: ''
              },
                pagination: {
                    currentPage: 1,
                    pageSize: 10,
                    total: 0
                },
                selectOptions: [{
                    value: '0',
                    label: '生效'
                }, {
                    value: '1',
                    label: '停用'
                }],
                unitOptions: [{
                  value: 0,
                  label: '分钟'
                }, {
                  value: 1,
                  label: '小时'
                }, {
                  value: 2,
                  label: '天'
                }, {
                  value: 3,
                  label: '周'
                }, {
                  value: 4,
                  label: '月'
                }, {
                  value: 5,
                  label: '季度'
                }, {
                  value: 6,
                  label: '年'
                }],
                queryParam: {
                    assitAppId: '',
                    status: '',
                    pageNum: '1',
                    pageSize: '10'
                }
            }
        },
        mounted () {
            this.getAssitApp()
            this.fetchData()
        },
        methods: {
            getAssitApp() {
              queryAssitAppPage({
                pageNum:1,
                pageSize: 1000
              }).then(res => {
                // 返回数据
                this.assitAppList = res.body.data
              })
            },
            getTimetransformTime(timestamp) {
              if (timestamp) {
                var time = new Date(timestamp);
                var y = time.getFullYear();
                var M = time.getMonth() + 1;
                var d = time.getDate();
                var h = time.getHours();
                var m = time.getMinutes();
                var s = time.getSeconds();
                return y + '-' + this.addZero(M) + '-' + this.addZero(d) + ' ' + this.addZero(h) + ':' + this.addZero(m) + ':' + this.addZero(s);
              } else {
                return '';
              }
            },
            addZero(m) {
              return m < 10 ? '0' + m : m;
            },

          addItem() {
            this.dialogForm.operationType = true
            this.dialogForm.visible = true
            this.dialogImageUrl = ''
            this.form = {
              assitAppId: '',
              typeName: '',
              typeDesc: '',
              typeLogo: '',
              activityTime: [],
              submitTimeoutNum: '',
              submitTimeoutUnit: ''
            }
          },

          updateItemStatus(row) {
            var requestBody = {
              'id': row.id,
              'status': row.status === 0 ? 1 : 0
            }
            updateAssitType(requestBody)
              .then(res => {
                // 返回数据
                this.$message({
                  message: '成功',
                  type: 'success'
                })
                this.fetchData()
              })
          },

          updateItem(row) {
              var times = []
              var fromDate = new Date(row.fromTime)
              if (row.fromTime === '' || row.fromTime === undefined || row.fromTime === null) {
              } else {
                times.push(fromDate)
              }
              var toDate = new Date(row.toTime)
              if (row.toTime === '' || row.toTime === undefined || row.toTime === null) {
              } else {
                times.push(toDate)
              }

            this.form = {
              id: row.id,
              assitAppId: row.assitAppId,
              typeName: row.typeName,
              typeDesc: row.typeDesc,
              typeLogo: row.typeLogo,
              activityTime: times,
              status: row.status,
              submitTimeoutNum: row.submitTimeoutNum,
              submitTimeoutUnit: row.submitTimeoutUnit
            }
            this.dialogImageUrl = row.typeLogo
            this.dialogForm.operationType = false
            this.dialogForm.visible = true
          },

            saveInfo () {
                setTimeout(() => {
                  var requestBody = {
                      'id': this.form.id,
                      'assitAppId': this.form.assitAppId,
                      'typeName': this.form.typeName,
                      'typeDesc': this.form.typeDesc,
                      'typeLogo': this.form.typeLogo,
                      'fromTime': this.getTimetransformTime(this.form.activityTime[0]),
                      'toTime': this.getTimetransformTime(this.form.activityTime[1]),
                      'status': this.form.status,
                      'submitTimeoutNum': this.form.submitTimeoutNum,
                      'submitTimeoutUnit': this.form.submitTimeoutUnit
                  }
                  if(this.dialogForm.operationType) {
                    addAssitType(requestBody)
                      .then(res => {
                        // 返回数据
                        this.$message({
                          message: '成功',
                          type: 'success'
                        })
                        this.dialogForm.visible = false
                        this.fetchData()
                      })
                  } else {
                    updateAssitType(requestBody)
                      .then(res => {
                        // 返回数据
                        this.$message({
                          message: '成功',
                          type: 'success'
                        })
                        this.dialogForm.visible = false
                        this.fetchData()
                      })
                  }
                }, 600)
            },
            paginationCurrentChange (currentPage) {
                this.pagination.currentPage = currentPage
                this.fetchData()
            },
            fetchData () {
                queryPage(this.queryParam)
                .then(res => {
                    this.tableData = res.body.data
                    this.pagination.total = res.body.totalNum
                })
            },
          delItem(row) {
            this.$confirm('此操作将删除当前助力类型, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              delAssitType({
                id: row.id
              }).then(res => {
                this.fetchData()
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });
            });
          },
          handleRemove(file, fileList) {
            this.form.typeLogo = '';
          },
          handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
          },
          handleUploadSuccess(response, file, fileList) {
            this.dialogImageUrl = URL.createObjectURL(file.raw);
            this.form.typeLogo = response.body.url;
          }
        }
    }
</script>
<style>
  .el-table .logo .cell{
    text-overflow: unset;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: block;
  }
</style>

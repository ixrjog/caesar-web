<template>
  <div>
    <el-row :gutter="24" style="margin-bottom: 5px; margin-left: 0px">
      <el-input v-model="queryParam.queryName" placeholder="关键字查询" class="input-search-bar"/>
      <el-button @click="fetchData" class="search-bar">查询</el-button>
      <el-button @click="addItem" class="search-bar">新增</el-button>
    </el-row>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="镜像id" v-show="props.row.imageId != null && props.row.imageId != ''">
              <span>{{ props.row.imageId }}</span>
            </el-form-item>
            <el-form-item label="专有网络id" v-show="props.row.vpcId != null && props.row.vpcId != ''">
              <span>{{ props.row.vpcId }}</span>
            </el-form-item>
            <el-form-item label="专有网络名称" v-show="props.row.vpcName != null && props.row.vpcName != ''">
              <span>{{ props.row.vpcName }}</span>
            </el-form-item>
            <el-form-item label="安全组id"
                          v-show="props.row.securityGroupId != null && props.row.securityGroupId != ''">
              <span>{{ props.row.securityGroupId }}</span>
            </el-form-item>
            <el-form-item label="安全组名称"
                          v-show="props.row.securityGroupName != null && props.row.securityGroupName != ''">
              <span>{{ props.row.securityGroupName }}</span>
            </el-form-item>
            <el-form-item label="创建时间">
              <span>{{ props.row.createTime }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="templateName" label="模版名称"></el-table-column>
      <el-table-column prop="regionId" label="地区id"></el-table-column>
      <el-table-column label="有效可用区">
        <template slot-scope="props">
          <div class="tag-group" v-if="props.row.instanceZones != null">
            <el-tag style="margin-left: 5px" :type="item.active ? 'success': 'info'"
                    v-for="item in props.row.instanceZones" :key="item.zoneId">{{ item.zoneId }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="instanceTemplate.instance.typeId" label="实例类型"></el-table-column>
      <el-table-column prop="instanceTemplate.instance.cpuCoreCount" label="cpu"></el-table-column>
      <el-table-column prop="instanceTemplate.instance.memorySize" label="内存GiB"></el-table-column>
      <el-table-column fixed="right" label="操作" width="280">
        <template slot-scope="scope">
          <el-button type="success" plain size="mini" @click="createInstance(scope.row)">创建</el-button>
          <el-button type="warning" plain size="mini" @click="editItem(scope.row)">编辑</el-button>
          <el-button type="danger" plain size="mini" @click="delItem(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background @current-change="paginationCurrentChange" :page-sizes="[10, 15, 20, 25, 30]" @size-change="handleSizeChange"
                   layout="sizes, prev, pager, next" :total="pagination.total" :current-page="pagination.currentPage"
                   :page-size="pagination.pageSize">
    </el-pagination>
    <CloudInstanceTemplateDialog :formStatus="formTemplateStatus"
                                 ref="cloudInstanceTemplateDialog"
                                 @closeCloudInstanceTemplateDialog="fetchData"></CloudInstanceTemplateDialog>
    <CreateCloudInstanceDialog :formStatus="formCreateInstanceStatus" ref="createCloudInstanceDialog" @closeCloudInstanceTemplateDialog="fetchData">
    </CreateCloudInstanceDialog>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  // Component
  import CloudInstanceTemplateDialog from '../dialog/CloudInstanceTemplateDialog'
  import CreateCloudInstanceDialog from '../dialog/CreateCloudInstanceDialog'

  // Filters
  import { getActiveType, getActiveText } from '@/filters/public.js'
  // API
  import { fuzzyQueryCloudInstanceTemplatePage, deleteCloudInstanceTemplateById } from '@api/cloud/cloud.instance.js'

  export default {
    name: 'CloudInstanceTemplate',
    data () {
      return {
        formTemplateStatus: {
          visible: false,
          labelWidth: '150px',
          operationType: true,
          addTitle: '新增实例模版配置',
          updateTitle: '更新实例模版配置',
          cloudType: ''
        },
        formCreateInstanceStatus: {
          visible: false,
          labelWidth: '150px',
          cloudType: '',
          title: '模版创建ECS实例'
        },
        tableData: [],
        loading: false,
        pagination: {
          currentPage: 1,
          pageSize: 10,
          total: 0
        },
        queryParam: {
          extend: 1,
          queryName: ''
        },
        syncLoading: false
      }
    },
    props: ['formStatus'],
    computed: {
      ...mapState('d2admin/user', [
        'info'
      ])
    },
    mounted () {
      this.initPageSize()
      this.fetchData()
    },
    components: {
      CloudInstanceTemplateDialog,
      CreateCloudInstanceDialog
    },
    filters: {
      getActiveType,
      getActiveText
    },
    methods: {
      ...mapActions({
        setPageSize: 'd2admin/user/set'
      }),
      handleSizeChange (size) {
        this.pagination.pageSize = size
        this.info.pageSize = size
        this.setPageSize(this.info)
        this.fetchData()
      },
      initPageSize () {
        if (typeof (this.info.pageSize) !== 'undefined') {
          this.pagination.pageSize = this.info.pageSize
        }
      },
      paginationCurrentChange (currentPage) {
        this.pagination.currentPage = currentPage
        this.fetchData()
      },
      delItem (row) {
        this.$confirm('此操作将删除当前配置?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCloudInstanceTemplateById(row.id).then(res => {
            this.fetchData()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      editItem (row) {
        let templateData = Object.assign({}, row)
        this.formTemplateStatus.operationType = false
        this.formTemplateStatus.visible = true
        this.formTemplateStatus.cloudType = this.formStatus.cloudType
        this.$refs.cloudInstanceTemplateDialog.initData(this.formStatus.cloudType, templateData)
      },
      addItem () {
        this.formTemplateStatus.operationType = true
        this.formTemplateStatus.visible = true
        this.formTemplateStatus.cloudType = this.formStatus.cloudType
        let templateData = {
          id: '',
          templateName: '',
          cloudType: 2,
          instanceTypeFamily: '',
          instanceTypeId: '',
          regionId: '',
          cpuCoreCount: 0,
          memorySize: 0,
          instanceFamilyLevel: '',
          usageCount: 0,
          comment: '',
          templateYAML: ''
        }
        this.$refs.cloudInstanceTemplateDialog.initData(this.formStatus.cloudType, templateData)
      },
      createInstance (row) {
        this.formCreateInstanceStatus.visible = true
        this.formCreateInstanceStatus.cloudType = this.formStatus.cloudType
        let templateData = Object.assign({}, row)
        this.$refs.createCloudInstanceDialog.initData(this.formStatus.cloudType, templateData)
      },
      fetchData () {
        this.loading = true
        let requestBody = Object.assign({}, this.queryParam)
        requestBody.cloudType = this.formStatus.cloudType
        requestBody.page = this.pagination.currentPage
        requestBody.length = this.pagination.pageSize
        fuzzyQueryCloudInstanceTemplatePage(requestBody)
          .then(res => {
            this.tableData = res.body.data
            this.pagination.total = res.body.totalNum
            this.loading = false
          })
      }
    }
  }
</script>

<style scoped>

  .table-expand {
    font-size: 0;
  }

  .table-expand label {
    width: 150px;
    color: #99a9bf;
  }

  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .input-search-bar {
    display: inline-block;
    max-width: 200px;
  }

  .search-bar {
    margin-left: 5px;
  }
</style>

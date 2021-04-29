<template>
  <el-select v-model="userId" filterable clearable
             remote reserve-keyword placeholder="输入关键词搜索用户"
             :remote-method="fetchData"
             @change="selUser"
             :loading="searchLoading">
    <el-option
      v-for="item in userOptions"
      :key="item.id"
      :label="item.displayName"
      :value="item.id">
      <span style="float: left">{{ getFullName(item) }}</span>
      <span class="email">{{ item.email }}</span>
    </el-option>
  </el-select>
</template>

<script>
  export default {
    name: 'UserIdSelect',
    props: ['userOptions', 'searchLoading'],
    data () {
      return {
        userId: ''
      }
    },
    methods: {
      getFullName (user) {
        return user.username + '<' + (user.name !== null && user.name !== '' ? (user.name + ':') : '') + user.displayName + '>'
      },
      clearUser () {
        this.userId = ''
      },
      selUser () {
        this.$emit('selUser', this.userId)
      },
      fetchData (queryName) {
        this.$emit('getUser', queryName)
      }
    }
  }
</script>

<style scoped>
  .el-select {
    display: inline-block;
    max-width: 200px;
    margin-left: 10px;
  }

  .email {
    float: right;
    color: #8492a6;
    font-size: 13px;
    margin-left: 40px;
  }
</style>

<template>
    <div>
        <el-tag :type="type">{{ text }}</el-tag>
    </div>
</template>

<script>
    export default {
        props: {
            value: {
                type: Number,
                require: 0
            },
            // 本行的所有数据，此字段不需要额外配置
            scope: {
                default: null
            },
            // 通过 component 中 props 字段传过来的数据，此字段需要先在 component 中配置
            myProps: {
                default: null
            }
        },
        computed: {
            type () {
              switch (this.value) {
                case 0:
                  return 'primary'
                case 1:
                  return 'success'
                case 2:
                  return 'warning'
                case 3:
                  return 'info'
                default:
                  return 'danger'
              }
            },
            text () {
              switch (this.value) {
                case 0:
                  return '新建'
                case 1:
                  return '已录入'
                case 2:
                  return '标记删除'
                case 3:
                  return '删除'
                default:
                  return '未定义'
              }
            }
        }
    }
</script>

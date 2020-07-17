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
              if (this.value === 0) {
                return 'warning'
              } else if (this.value === 1) {
                return 'success'
              } else if (this.value === 2) {
                return 'error'
              } else {
                return 'warning'
              }
            },
            text () {
                if (this.value === 0) {
                    return '待执行'
                } else if (this.value === 1) {
                    return '已执行'
                } else if (this.value === 2) {
                    return '已放弃'
                }
                return ''
            }
        }
    }
</script>

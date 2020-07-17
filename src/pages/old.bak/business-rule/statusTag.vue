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
                return this.value === 0 ? 'danger' : 'warning'
            },
            text () {
                if (this.value === 0) {
                    return '已提交'
                } else if (this.value === 1) {
                    return '已上线'
                } else if (this.value === 2) {
                    return '停用'
                }
                return ''
            }
        }
    }
</script>

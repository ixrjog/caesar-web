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
                return this.value === 0 ? 'success' : 'danger'
            },
            text () {
                return this.value === 0 ? '不鉴权' : '鉴权'
            }
        }
    }
</script>

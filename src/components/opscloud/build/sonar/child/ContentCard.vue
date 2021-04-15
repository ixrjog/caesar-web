<template>
  <div>
    <el-card class="box-card" shadow="never">
      <div class="value">{{ value }}<span v-if="symbol !== null">{{ symbol}}</span></div>
      <div class="comment">{{ comment }}</div>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'ContentCard',
    props: ['value', 'symbol', 'comment']
  }
</script>

<style scoped>
  .value {
    font-size: 30px;
    color: #20A9D9;
    font-weight: 300;
  }

  .comment {
    font-size: 10px;
    color: #B7B6B6;
  }

</style>

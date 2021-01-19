<template>
  <div>
    <i class="fa fa-code-fork" style="margin-right: 2px"></i>
    <b>{{branch}}</b>
  </div>
</template>

<script>
  export default {
    name: 'BuildBranch',
    props: ['branch'],
  }
</script>

<style scoped>

</style>

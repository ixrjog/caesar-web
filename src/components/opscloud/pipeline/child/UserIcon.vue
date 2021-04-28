<template>
  <span class="icon"><i class="fa fa-user-o"></i>{{ user.displayName }}</span>
</template>

<script>
  export default {
    name: 'UserIcon',
    props: ['user']
  }
</script>

<style scoped>

</style>

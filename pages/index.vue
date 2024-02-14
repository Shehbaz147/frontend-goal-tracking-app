<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  title: 'List of Goals'
})
  import GoalsList from './goals/index.vue'
</script>

<template>
  <GoalsList />
</template>

<style scoped>

</style>
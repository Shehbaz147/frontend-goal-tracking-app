<script setup lang='ts'>
definePageMeta({
  middleware: 'auth',
  title: 'List of Goals'
})
import {columns} from './columns'
import {ref, onMounted} from 'vue'
import DataTable from './DataTable.vue'

const auth = useAuthStore();
const goalsStore = useGoalsStore();
const data = ref([])

onMounted(() => {
  goalsStore.getUserGoals()
      .then((result) => {
        data.value = result.data
      }).catch((err) => {
    console.log(err)
  });


})
</script>

<template>
  <NuxtLayout>
    <div class="w-full">
      <DataTable :data="data" :columns="columns"/>
    </div>
  </NuxtLayout>
</template>

<route lang="yaml">
meta:
  layout: auth
</route>
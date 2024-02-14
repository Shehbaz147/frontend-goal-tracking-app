<script setup lang='ts'>
import {ref, onMounted} from 'vue'

import {Switch} from "~/components/ui/switch";
import {Label} from "~/components/ui/label";
import {Skeleton} from "~/components/ui/skeleton";

const goalsLoading = ref(true)
const goal = ref({})
const disabled = ref(false)
const percentageView = ref(true); // Added a ref to track the view mode


const route = useRoute()

const goalsStore = useGoalsStore();

const handleChange = (value) => {
  percentageView.value = value
}

onMounted(() => {
  disabled.value = true
  window.Echo.channel(`goal.updated.${route.params.id}`)
      .listen(`.GoalUpdated`, (e) => {
        goalsStore.getGoalDetails(e.goal.id)
            .then(res => {
              goal.value = res
            })
            .catch(error => {
              console.log(error)
            })
      })
  goalsStore.getGoalDetails(route.params.id)
      .then(res => {
        goalsLoading.value = false
        goal.value = res
      })
      .catch(error => {
        goalsLoading.value = false
        console.log(error)
      })
})
</script>

<template>
  <NuxtLayout>
    <div class="w-[500px]">
      <template v-if="goalsLoading" v-for="index in perPage" :key="index">
        <div class="flex items-center space-x-4 space-y-4">
          <Skeleton class="h-12 w-12 rounded-full" />
          <div class="space-y-2">
            <Skeleton class="h-4 w-[250px]" />
            <Skeleton class="h-4 w-[200px]" />
          </div>
        </div>
      </template>
      <template v-else>
        <div class="flex flex-row items-center justify-between">
          <div class="percentage font-bold">{{ percentageView ? goal?.goal_progress?.currentProgress.toFixed(0) + '%' : goal?.goal_progress?.currentProgressUnit }}</div>
          <div class="toggle">
            <div class="flex items-center text-sm space-x-2">
              <Switch id="airplane-mode text-sm" :checked="percentageView" @update:checked="handleChange"/>
              <Label for="airplane-mode text-sm">{{ percentageView ? 'Progress' : 'Result' }}</Label>
            </div>
          </div>
        </div>
        <div class="flex items-center space-x-4 space-y-4">

        </div>
        <div class=" mt-3">
          <div class="progress-bar flex bg-slate-200 rounded-full max-w-[100%]">

            <template v-if="goal?.goal_progress?.totalYears < 1 && goal?.goal_progress?.totalDays <= 1">
              <div class="progress bg-green-700 transition duration-150 ease-in-out h-3 relative rounded-full"
                   :style="{ width: goal?.goal_progress?.currentProgress + '%' }">
                <span class="absolute top-[12px] left-0 text-sm text-slate-400">{{ percentageView ? goal?.goal_progress?.currentProgress.toFixed(0) + '%' : goal?.goal_progress?.currentProgressUnit }}</span>
              </div>

              <div
                  v-if="goal?.goal_progress?.expectedProgress > 0 && goal?.goal_progress?.expectedProgress > goal?.goal_progress?.currentProgress"
                  class="behind-progress striped h-3 relative transition duration-100 ease-in-out"
                  :style="{ width: goal?.goal_progress?.expectedProgress + '%' }">
              <span class="absolute top-[12px] right-0 text-sm text-slate-400">{{
                  percentageView ? (goal?.goal_progress?.expectedProgress.toFixed(0) > 100 ? 100 + '%' : goal?.goal_progress?.expectedProgress.toFixed(0) + '%') : (goal?.goal_progress?.expectedProgressUnit > goal.target ? goal.target : goal?.goal_progress?.expectedProgressUnit.toFixed(0))
                }}</span>
              </div>

            </template>

            <template v-else-if="goal?.goal_progress?.totalYears < 1 && goal?.goal_progress?.totalDays > 1">
              <div class="progress bg-green-700 transition duration-150 ease-in-out h-3 relative rounded-full"
                   :style="{ width: goal?.goal_progress?.currentProgress + '%' }">
                <span class="absolute top-[12px] left-0 text-sm text-slate-400">{{ percentageView ? '0%' : 0 }}</span>
                <span class="absolute top-[12px] right-0 text-sm text-slate-400">{{ percentageView ? goal?.goal_progress?.currentProgress.toFixed(0) + '%' : goal?.goal_progress?.currentProgressUnit }}</span>
              </div>

              <div
                  v-if="goal?.goal_progress?.expectedProgress > 0 && goal?.goal_progress?.expectedProgress >= goal?.goal_progress?.currentProgress"
                  class="behind-progress striped h-3 relative transition duration-100 ease-in-out"
                  :style="{ width: goal?.goal_progress?.expectedProgress + '%' }">
              <span class="absolute top-[12px] right-0 text-sm text-slate-400">{{
                  percentageView ? (goal?.goal_progress?.expectedProgress.toFixed(0) > 100 ? 100 : goal?.goal_progress?.expectedProgress.toFixed(0)) + '%' : goal?.goal_progress?.expectedProgressUnit.toFixed(0)
                }}</span>
              </div>

              <div v-if="goal?.goal_progress?.currentProgress < goal?.goal_progress?.expectedProgress"
                   class="h-3 relative" :style="{ width: goal?.goal_progress?.remainingProgress + '%' }">
                <span class="absolute top-[12px] right-0 text-sm text-slate-400">{{ percentageView ? '100%' : goal?.target }}</span>
              </div>

              <div v-if="goal?.goal_progress?.currentProgress > goal?.goal_progress?.expectedProgress"
                   class="h-3 relative" :style="{ width: (`${goal?.goal_progress?.remainingProgress + goal?.goal_progress?.expectedProgress}`) + '%' }">
                <span class="absolute top-[12px] right-0 text-sm text-slate-400">{{ percentageView ? '100%' : goal?.target }}</span>
              </div>
            </template>

            <template v-else v-for="(year, index) in goal?.goal_progress?.totalYears" :key="index">
              <div v-if="index === 0"
                   class="progress bg-green-700 transition duration-150 ease-out h-3 relative rounded-full"
                   :style="{ width: goal?.goal_progress?.currentProgress + '%' }">
                <span class="absolute top-[12px] left-0 text-sm text-slate-400">{{ percentageView ? '0%' : 0 }}</span>
                <span class="absolute top-[12px] -right-[20px] text-sm text-slate-400 bg-white">{{
                    percentageView ? goal?.goal_progress?.currentProgress.toFixed(0) + '%' : goal?.goal_progress?.currentProgressUnit.toFixed(0)
                  }}</span>
              </div>

              <div v-else-if="index > 0 && index < (goal?.goal_progress?.totalYears - 1)"
                   class="behind-progress striped h-3 transition duration-150 ease-out relative"
                   :style="{ width: goal?.goal_progress?.expectedProgress + '%' }">
              <span class="absolute top-[12px] right-0 text-sm text-slate-400">{{
                  goal?.goal_progress?.expectedProgress.toFixed(0)
                }}%</span>
              </div>

              <div v-else-if="index == (goal?.goal_progress?.totalYears - 1)" class=" h-3 relative"
                   :style="{ width: goal?.goal_progress?.remainingProgress + '%' }">
                <span class="absolute top-[12px] right-0 text-sm text-slate-400">100%</span>
              </div>
            </template>
          </div>
        </div>
      </template>
    </div>
  </NuxtLayout>
</template>
<style scoped>

.striped {
  background-image: repeating-linear-gradient(
      -50deg,
      transparent,
      transparent 5px,
      #a6a6a6 5px,
      #a6a6a6 10px
  );
}

</style>

<route lang="yaml">
meta:
  layout: auth
</route>
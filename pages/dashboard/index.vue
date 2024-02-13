<script setup>
definePageMeta({
  middleware: ['auth', 'profile'],
})

import { ref, computed, onMounted } from 'vue'
import { Skeleton } from '@/components/ui/skeleton'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'


const goalsStore = useGoalsStore()

const baselineDate = new Date('2023-01-01');
const deadlineDate = new Date('2022-11-29');
const targetValue = 1050;
const currentStatus = 63;

const progressPercentage = computed(() => calculateProgress());
const behindProgressPercentage = computed(() => calculateBehindProgress());


const goals = ref([]);
const perPage = ref(12)
const page = ref(1)
const lastPage = ref()
const goalsLoading = ref(true)

const loadUserGoals = async () => {
  const result = await goalsStore.getUserGoals(perPage.value)
  if (result !== null || result !== undefined) {
    goals.value = result.data
    goalsLoading.value = false
  }
}

function calculateProgress() {
  const currentDate = new Date();
  const totalTimeRange = deadlineDate.getTime() - baselineDate.getTime();
  const elapsedTime = currentDate.getTime() - baselineDate.getTime();

  const progress = (elapsedTime / totalTimeRange) * 100;
  return Math.min(progress, 100); // Ensure progress doesn't exceed 100%
}

function calculateBehindProgress() {
  const progress = calculateProgress();
  console.log(progress)
  return Math.max(0, progress - targetValue);
}


const load = async $state => {
  try {

    const response = await fetch(
      "/goals/list?page=" + page.value
    );

    const json = await response.json();
    lastPage.value = json.to
    if (json.data.length < 12) {
      goals.value = json.data;
      $state.complete();
    }
    else {
      goals.value.push(json.data);
      $state.loaded();
    }

    page.value++;
  } catch (error) {
    $state.error();
  }
};

onMounted(() => {
  setTimeout(async() => {
    await loadUserGoals()
  }, 600)
})

</script>

<template>
  <NuxtLayout>
    <div class="flex flex-row flex-wrap justify-between h-full w-full px-3 py-3">
      <div class="flex flex-col h-full w-[320px]">
        <template v-if="goalsLoading" v-for="index in perPage" :key="index">
          <div class="flex items-center space-x-4 space-y-4">
            <Skeleton class="h-12 w-12 rounded-full" />
            <div class="space-y-2">
              <Skeleton class="h-4 w-[250px]" />
              <Skeleton class="h-4 w-[200px]" />
            </div>
          </div>
        </template>

        <template v-if="!goalsLoading">
          <div class="flex flex-row items-center justify-between">
            <div class="percentage font-bold">6%</div>
            <div class="toggle">
              <div class="flex items-center text-sm space-x-2">
                <Switch id="airplane-mode text-sm" />
                <Label for="airplane-mode text-sm">Progress</Label>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-4 space-y-4">

          </div>
          <div class="progress-bar-container mt-3">
            <div class="progress-bar">
              <div class="progress" :style="{ width: progressPercentage + '%' }"></div>
              <div class="behind-progress" :style="{ width: behindProgressPercentage + '%' }"></div>
            </div>
            <div class="progress-label">
              Actual Progress: {{ progressPercentage.toFixed(2) }}%
            </div>
          </div>

        </template>
      </div>
      <div class="flex flex-col h-full border-dashed border border-purple-400">
        hek
      </div>
    </div>
  </NuxtLayout>
</template>


<style scoped>
.progress-bar-container {
  text-align: center;
  margin: 20px;
}

.progress-bar {
  position: relative;
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background-color: #4caf50;
  width: 100%;
  transition: width 0.3s ease-in-out;
}

.behind-progress {
  height: 100%;
  background-color: #ff9800;
  width: 0;
  position: absolute;
}

.progress-label {
  margin-top: 10px;
}
</style>
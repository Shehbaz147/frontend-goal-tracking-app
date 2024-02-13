<script setup lang='ts'>
import * as z from 'zod'
import {ref, onMounted} from 'vue'
import {useForm} from 'vee-validate'
import {format} from 'date-fns'
import {Calendar as CalendarIcon} from 'lucide-vue-next'
import {cn} from '~/lib/utils'
import {Calendar} from '~/components/ui/calendar'
import {post} from '~/api/api';
import {toast} from 'vue-sonner'
import {Toaster} from "~/components/ui/sonner"
import {vAutoAnimate} from '@formkit/auto-animate/vue'
import {toTypedSchema} from '@vee-validate/zod'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '~/components/ui/menubar'


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '~/components/ui/form'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import {Switch} from "~/components/ui/switch";
import {Label} from "~/components/ui/label";

const goal = ref({})
const disabled = ref(false)


const route = useRoute()

const goalsStore = useGoalsStore();


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
        goal.value = res
      })
      .catch(error => {
        console.log(error)
      })
})
</script>

<template>
  <NuxtLayout>
    <div class="w-[500px]">
      <div class="flex flex-row items-center justify-between">
        <div class="percentage font-bold">{{ goal?.goal_progress?.currentProgress.toFixed(0) }}%</div>
        <div class="toggle">
          <div class="flex items-center text-sm space-x-2">
            <Switch id="airplane-mode text-sm"/>
            <Label for="airplane-mode text-sm">Progress</Label>
          </div>
        </div>
      </div>
      <div class="flex items-center space-x-4 space-y-4">

      </div>
      <div class=" mt-3">
        <div class="progress-bar flex bg-slate-200 rounded-full max-w-[500px]">

          <template v-if="goal?.goal_progress?.totalYears < 1 && goal?.goal_progress?.totalDays <= 1">
            <div class="progress bg-green-700 transition duration-150 ease-in-out h-3 relative rounded-full"
                 :style="{ width: goal?.goal_progress?.currentProgress + '%' }">
              <span class="absolute top-[12px] left-0 text-sm text-slate-400">0%</span>
              <span class="absolute top-[12px] -right-[20px] text-sm text-slate-400 bg-white">{{
                  goal?.goal_progress?.currentProgress.toFixed(0)
                }}%</span>
            </div>

            <div
                v-if="goal?.goal_progress?.expectedProgress > 0 && goal?.goal_progress?.expectedProgress > goal?.goal_progress?.currentProgress"
                class="behind-progress striped h-3 relative transition duration-100 ease-in-out"
                :style="{ width: goal?.goal_progress?.expectedProgress + '%' }">
              <span class="absolute top-[12px] right-0 text-sm text-slate-400">{{
                  goal?.goal_progress?.expectedProgress.toFixed(0) > 100 ? 100 : goal?.goal_progress?.expectedProgress.toFixed(0)
                }}%</span>
            </div>

          </template>

          <template v-else-if="goal?.goal_progress?.totalYears < 1 && goal?.goal_progress?.totalDays > 1">
            <div class="progress bg-green-700 transition duration-150 ease-in-out h-3 relative rounded-full"
                 :style="{ width: goal?.goal_progress?.currentProgress + '%' }">
              <span class="absolute top-[12px] left-0 text-sm text-slate-400">0%</span>
              <span class="absolute top-[12px] -right-[20px] text-sm text-slate-400 bg-white">{{
                  goal?.goal_progress?.currentProgress.toFixed(0)
                }}%</span>
            </div>

            <div
                v-if="goal?.goal_progress?.expectedProgress > 0 && goal?.goal_progress?.expectedProgress > goal?.goal_progress?.currentProgress"
                class="behind-progress striped h-3 relative transition duration-100 ease-in-out"
                :style="{ width: goal?.goal_progress?.expectedProgress + '%' }">
              <span class="absolute top-[12px] right-0 text-sm text-slate-400">{{
                  goal?.goal_progress?.expectedProgress.toFixed(0) > 100 ? 100 : goal?.goal_progress?.expectedProgress.toFixed(0)
                }}%</span>
            </div>

            <div v-if="goal?.goal_progress?.currentProgress < goal?.goal_progress?.expectedProgress"
                 class="h-3 relative" :style="{ width: goal?.goal_progress?.remainingProgress + '%' }">
              <span class="absolute top-[12px] right-0 text-sm text-slate-400">100%</span>
            </div>
          </template>

          <template v-else v-for="(year, index) in goal?.goal_progress?.totalYears" :key="index">
            <div v-if="index === 0"
                 class="progress bg-green-700 transition duration-150 ease-out h-3 relative rounded-full"
                 :style="{ width: goal?.goal_progress?.currentProgress + '%' }">
              <span class="absolute top-[12px] left-0 text-sm text-slate-400">0%</span>
              <span class="absolute top-[12px] -right-[20px] text-sm text-slate-400 bg-white">{{
                  goal?.goal_progress?.currentProgress.toFixed(0)
                }}%</span>
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
    </div>
  </NuxtLayout>
</template>
<style scoped>
.progress-bar-container {
  text-align: center;
  margin: 20px;
}

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
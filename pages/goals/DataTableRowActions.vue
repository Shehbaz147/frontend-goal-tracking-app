<script setup lang="ts">
import type {Row} from '@tanstack/vue-table'
import {computed, onMounted, ref} from 'vue'
import {labels} from './data/data'
import {taskSchema} from './data/schema'
import {type Task} from './data/schema'
import {MoreHorizontalIcon} from 'lucide-vue-next'
import {toast} from 'vue-sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import {Button} from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {useGoalsStore} from "~/stores/goals";

interface DataTableRowActionsProps {
  row: Row<Task>
}

const props = defineProps<DataTableRowActionsProps>()

const goal = computed(() => taskSchema.parse(props.row.original))

const goalStore = useGoalsStore()

const isAlertDialogOpen = ref(false)

const goToProgress = () => {
  window.location.href = `goals/${goal.value.id}`
}

const deleteGoal = () => {
  goalStore.deleteGoal(goal.value.id)
      .then(res => {
        console.log(res)
        toast(res.message)
        window.location.href = '/'
      })
      .catch(error => {
        toast(error.data)
      })
}

const updateOpen = (value) => {}

const editGoal = () => {
  window.location.href = `goals/${goal.value.id}/edit`
}
</script>

<template>
  <div class="">
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button
            variant="ghost"
            class="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontalIcon class="h-4 w-4"/>
          <span class="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" class="w-[160px]">
        <DropdownMenuItem class="cursor-pointer" v-on:click="goToProgress()">
          View Progress
        </DropdownMenuItem>
        <DropdownMenuItem
            v-on:click="editGoal()"
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator/>
        <DropdownMenuItem v-on:click="isAlertDialogOpen = !isAlertDialogOpen" class="text-red-500 w-full">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <AlertDialog :open="isAlertDialogOpen" @update:open="updateOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel v-on:click="isAlertDialogOpen = !isAlertDialogOpen">Cancel</AlertDialogCancel>
          <AlertDialogAction v-on:click="deleteGoal()">Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
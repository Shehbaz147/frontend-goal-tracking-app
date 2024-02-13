<script setup lang="ts">

import * as z from 'zod'
import {ref, onMounted} from 'vue'
import {useForm} from 'vee-validate'
import {format} from 'date-fns'
import {Calendar as CalendarIcon} from 'lucide-vue-next'
import {cn} from '~/lib/utils'
import {Calendar} from '~/components/ui/calendar'
import {toast} from 'vue-sonner'
import {Toaster} from "~/components/ui/sonner"
import {vAutoAnimate} from '@formkit/auto-animate/vue'
import {toTypedSchema} from '@vee-validate/zod'


import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '~/components/ui/form'

const goalsStore = useGoalsStore()
const route = useRoute()
const goal = ref(null)

const formSchema = toTypedSchema(z.object({
  id: z.any(),
  name: z.string().min(2).max(50),
  baseline: z.date({
    required_error: "Please select a date and time",
    invalid_type_error: "That's not a date!",
  }),
  deadline: z.date({
    required_error: "Please select a date and time",
    invalid_type_error: "That's not a date!",
  }),
  target: z.number().positive(),
  unit: z.string(),
  progress: z.number(),
  status: z.string(),
}))

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    id: '',
    name : '',
    baseline: new Date(),
    deadline: new Date(),
    status: '',
    target: 0,
    progress: 0
  }
})

const onSubmit = form.handleSubmit(async (values) => {
  goalsStore.updateGoalDetails(values)
      .then(res => {
        if(res.data.errors){
          form.setErrors(res.data.errors)
        }else{
          toast(res.data.message)
        }
      })
      .catch(err => {
        form.setErrors(err)
      })
})

const getGoalDetails = () => {
  goalsStore.getGoalDetails(route.params.id)
      .then(res => {
        goal.value = res
        form.setValues({
          id: res.id,
          name : res.name,
          baseline: new Date(res.baseline),
          deadline: new Date(res.deadline),
          status: res.status,
          target: res.target,
          unit: res.unit,
          progress: res.current_progress
        })
      })
      .catch(err => {
        console.log(err)
      })
}

const getFormattedDate = (date: string) => {
  return new Date(date);
}

onMounted(() => {
  getGoalDetails()
})
</script>

<template>
  <NuxtLayout>
    <form v-if="goal !== null" @submit="onSubmit">
      <FormField v-slot="{ componentField }" name="name">
        <FormItem class="pb-3">
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input type="text" placeholder="shadcn" v-bind="componentField"/>
          </FormControl>
          <FormDescription>
            This is your public display name.
          </FormDescription>
          <FormMessage/>
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField, value }" name="baseline">
        <FormItem class="flex flex-col pb-3">
          <FormLabel>Baseline Date/Time</FormLabel>
          <Popover>
            <PopoverTrigger as-child>
              <FormControl>
                <Button variant="outline" :class="cn(
                      'w-[240px] ps-3 text-start font-normal',
                      !value && 'text-muted-foreground',
                    )">
                  <span>{{ value ? format(value, 'PPP') : "Pick a date" }}</span>
                  <CalendarIcon class="ms-auto h-4 w-4 opacity-50"/>
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent class="p-0">
              <Calendar :default-value="getFormattedDate(goal.baseline)" v-bind="componentField" mode="date"/>
            </PopoverContent>
          </Popover>
          <FormDescription>
            Add baseline date for your goals
          </FormDescription>
          <FormMessage/>
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField, value }" name="deadline">
        <FormItem class="flex flex-col pb-3">
          <FormLabel>Deadline Date/Time</FormLabel>
          <Popover>
            <PopoverTrigger as-child>
              <FormControl>
                <Button variant="outline" :class="cn(
                      'w-[240px] ps-3 text-start font-normal',
                      !value && 'text-muted-foreground',
                    )">
                  <span>{{ value ? format(value, 'PPP') : "Pick a date" }}</span>
                  <CalendarIcon class="ms-auto h-4 w-4 opacity-50"/>
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent class="p-0">
              <Calendar v-bind="componentField" mode="date"/>
            </PopoverContent>
          </Popover>
          <FormDescription>
            Add baseline date for your goals
          </FormDescription>
          <FormMessage/>
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="target">
        <FormItem class="flex flex-col pb-3">
          <FormLabel>Target Value</FormLabel>
          <FormControl>
            <Input type="number" min="0" step="0" placeholder="200" v-bind="componentField"/>
          </FormControl>
          <FormDescription>
            Add target value for each goal
          </FormDescription>
          <FormMessage/>
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="unit">
        <FormItem class="flex flex-col pb-3">
          <FormLabel>Unit</FormLabel>
          <FormControl>
            <Select default-value="null" v-bind="componentField">
              <SelectTrigger class="w-[180px]">
                <SelectValue placeholder="Select a currency unit"/>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Currency</SelectLabel>
                  <SelectItem value="null" disabled>
                    Select Currency
                  </SelectItem>
                  <SelectItem value="dollar">
                    Dollar
                  </SelectItem>
                  <SelectItem value="euro">
                    Euro
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
          <FormDescription>
            Select currency unit
          </FormDescription>
          <FormMessage/>
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="status">
        <FormItem class="flex flex-col pb-3">
          <FormLabel>Status</FormLabel>
          <FormControl>
            <Select v-bind="componentField">
              <SelectTrigger class="w-[180px]">
                <SelectValue placeholder="Select a status"/>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Currency</SelectLabel>
                  <SelectItem value="null" disabled>
                    Select Status
                  </SelectItem>
                  <SelectItem value="Not started">
                    Not Started
                  </SelectItem>
                  <SelectItem value="In progress">
                    In progress
                  </SelectItem>
                  <SelectItem value="Completed">
                    Completed
                  </SelectItem>
                  <SelectItem value="Expired">
                    Expired
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
          <FormDescription>
            Select currency unit
          </FormDescription>
          <FormMessage/>
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="progress">
        <FormItem class="pb-3">
          <FormLabel>Current Progress</FormLabel>
          <FormControl>
            <Input type="number" placeholder="10" v-bind="componentField"/>
          </FormControl>
          <FormDescription>
            Current Progress of the goal
          </FormDescription>
          <FormMessage/>
        </FormItem>
      </FormField>

      <Button type="submit">Update</Button>
    </form>
  </NuxtLayout>
</template>

<style scoped>

</style>
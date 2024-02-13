<script setup>
import * as z from 'zod'
import { ref, watch, onMounted } from 'vue'
import { useForm } from 'vee-validate'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { post } from '~/api/api';
import { toast } from 'vue-sonner'
import { Toaster } from "@/components/ui/sonner"
import { vAutoAnimate } from '@formkit/auto-animate/vue'
import { toTypedSchema } from '@vee-validate/zod'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar'


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const isDialogOpen = ref(false)

const formSchema = toTypedSchema(z.object({
  name: z.string().min(2).max(50),
  baseline: z.any(),
  deadline: z.any(),
  target: z.number().positive(),
  unit: z.string()
}))

const form = useForm({
  validationSchema: formSchema,
})

const auth = useAuthStore();

const user = ref({
  id: '',
  name: ''
})

const toggleDialog = () => {
  isDialogOpen.value = !isDialogOpen.value
}

const onSubmit = form.handleSubmit(async (values) => {
  const { data, error } = await post('auth/goals/store', values);
  if (error.value) {
    form.setErrors(error.value.data.errors)
  }

  if (data.value) {
    toggleDialog()
    toast(data.value.message)
    window.location.href = '/'
  }
})

const getUserDetails = async () => {
  try {
    auth.getUserDetails()
        .then(res => {
          user.value = res
        })
  } catch (error) {
    toast(error)
  }
}

const logout = async () => {
  await auth.logout();
}

const handleDialogOpenChange = (value) => {}

onMounted(() => {
  getUserDetails()
})
</script>

<template>
  <div class="flex flex-row justify-center items-center pt-3">
    <Dialog :open="isDialogOpen" @update:open="handleDialogOpenChange">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>{{ user.name }}</MenubarTrigger>
          <MenubarContent>

            <DialogTrigger asChild>
              <MenubarItem v-on:click="isDialogOpen = !isDialogOpen">
                Add New Goal
              </MenubarItem>
            </DialogTrigger>

            <MenubarItem v-on:click="logout">
              Logout
            </MenubarItem>

          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      <DialogContent>
        <form @submit="onSubmit">
          <DialogHeader>
            <DialogTitle>Add new Goal</DialogTitle>
            <DialogDescription>
              Start tracking progress by creating a new goal
            </DialogDescription>
          </DialogHeader>

          <FormField v-slot="{ componentField }" name="name">
            <FormItem class="pb-3">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="shadcn" v-bind="componentField" />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
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
                      <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent class="p-0">
                  <Calendar v-bind="componentField" mode="date" />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Add baseline date for your goals
              </FormDescription>
              <FormMessage />
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
                      <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent class="p-0">
                  <Calendar v-bind="componentField" mode="date" />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Add baseline date for your goals
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="target">
            <FormItem class="flex flex-col pb-3">
              <FormLabel>Target Value</FormLabel>
              <FormControl>
                <Input type="number" min="0" step="0" placeholder="200" v-bind="componentField" />
              </FormControl>
              <FormDescription>
                Add target value for each goal
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="unit">
            <FormItem class="flex flex-col pb-3">
              <FormLabel>Unit</FormLabel>
              <FormControl>
                <Select default-value="null" v-bind="componentField">
                  <SelectTrigger class="w-[180px]">
                    <SelectValue placeholder="Select a currency unit" />
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
              <FormMessage />
            </FormItem>
          </FormField>
          <DialogFooter>
            <Button type="submit">Confirm</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    <Toaster />
  </div>
</template>
  
<style lang="scss"></style>
  
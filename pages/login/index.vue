<script setup lang='ts'>
import { h, ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { vAutoAnimate } from '@formkit/auto-animate/vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
const auth = useAuthStore();


import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'

const errors = ref([])

const formSchema = toTypedSchema(z.object({
    email: z.string().email(),
    password: z.string()
}))

const { handleSubmit } = useForm({
    validationSchema: formSchema,
})

const appConfig = useRuntimeConfig()

const onSubmit = handleSubmit(async (values: any) => {
   const result = await auth.signIn(values);
})
</script>

<template>
    <div class="flex flex-row justify-center items-center h-screen">

        <Card class="w-[350px]">
            <form @submit="onSubmit">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Enter Email & Password to login</CardDescription>
                </CardHeader>
                <CardContent>
                    <FormField v-slot="{ componentField }" name="email">
                        <FormItem v-auto-animate>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="test@gmail.com" v-bind="componentField" />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    </FormField>

                    <FormField v-slot="{ componentField }" name="password">
                        <FormItem v-auto-animate class="mt-5">
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Password" v-bind="componentField" />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    </FormField>
                </CardContent>
                <CardFooter class="flex px-6 pb-6">
                    <Button class="w-full" type="submit">
                        Submit
                    </Button>
                </CardFooter>
            </form>
        </Card>
    </div>
</template>

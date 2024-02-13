<script setup>
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { vAutoAnimate } from '@formkit/auto-animate/vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'vue-sonner'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'

const auth = useAuthStore();


const formSchema = toTypedSchema(
    z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(8),
        password_confirmation: z.string().min(8)

    }).refine(data => data.password === data.password_confirmation, {
        message: "Passwords don't match",
        path: ['password_confirmation'],
    })

)

const { handleSubmit, errors } = useForm({
    validationSchema: formSchema,
})

const appConfig = useRuntimeConfig()

const onSubmit = handleSubmit(async (values) => {
    auth.signUp(values)
        .then(res => {
            if (auth.getErrors().length) {
                form.errors = auth.getErrors()
            }
        })
        .catch(error => {

        })
})
</script>

<template>
    <div class="flex flex-row justify-center items-center h-screen">

        <Card class="w-[350px]">
            <form @submit="onSubmit">
                <CardHeader>
                    <CardTitle>Register</CardTitle>
                    <CardDescription>Enter Name, Email & Password to register</CardDescription>
                </CardHeader>
                <CardContent>

                    <FormField v-slot="{ componentField }" name="name">
                        <FormItem v-auto-animate>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input id="name" type="text" placeholder="ABC" v-bind="componentField" />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    </FormField>

                    <FormField v-slot="{ componentField }" name="email">
                        <FormItem v-auto-animate class="mt-5">
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input id="email" type="email" placeholder="test@gmail.com" v-bind="componentField" />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    </FormField>

                    <FormField v-slot="{ componentField }" name="password">
                        <FormItem v-auto-animate class="mt-5">
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input id="password" type="password" placeholder="Password" v-bind="componentField" />
                            </FormControl>

                            <FormMessage />
                        </FormItem>

                        <FormField v-slot="{ componentField }" name="password_confirmation">
                            <FormItem v-auto-animate class="mt-5">
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input id="password_confirmation" type="password" placeholder="Confirm Password"
                                        v-bind="componentField" />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        </FormField>
                    </FormField>
                </CardContent>
                <CardFooter class="flex px-6 pb-6">
                    <Button class="w-full" type="submit">
                        Submit
                    </Button>
                </CardFooter>
            </form>
        </Card>
        <Toaster />
    </div>
</template>

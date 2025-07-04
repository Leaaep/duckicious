<script setup lang="ts">
import * as v from 'valibot'
import type {FormSubmitEvent} from '@nuxt/ui'

const schema = v.object({
  username: v.pipe(v.string()),
  password: v.pipe(v.string(), v.minLength(8, 'Must be at least 8 characters'))
})

type Schema = v.InferOutput<typeof schema>

const state = reactive({
  username: '',
  password: ''
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {

  const {error} = await useFetch('http://localhost:4000/api/auth/login', {
    method: "POST",
    credentials: 'include',
    body: state
  })

  if (error.value) {
    toast.add({title: 'Error', description: 'An error occurred: ' + error.value, color: 'error'})
  } else {
    toast.add({title: 'Success', description: 'Successfully logged in', color: 'success'})
  }
}
</script>


<template>
  <UForm :schema="schema" :state="state" class="space-y-4 flex h-screen flex items-center justify-center flex-col"
         @submit="onSubmit">
    <UFormField label="Username" name="username">
      <UInput v-model="state.username"/>
    </UFormField>

    <UFormField label="Password" name="password">
      <UInput v-model="state.password" type="password"/>
    </UFormField>

    <UButton type="submit">
      Submit
    </UButton>
  </UForm>
</template>

<style scoped>

</style>
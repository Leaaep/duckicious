<script setup lang="ts">
import {navigateTo} from "nuxt/app";

const toast = useToast()
const open = ref(false)
const url = ref<string>('')

const importRecipe = async () => {
  if (url.value) {
    await useFetch(`http://localhost:4000/api/recipe/import?url=${url.value}`, {
      method: 'get',
      server: false,
      credentials: 'include',
      onResponseError: (error) => {
        if (error.response?.status === 401) {
          navigateTo('/login')
        } else {
          toast.add({title: 'Error', description: 'An error occurred: ' + error.response.status, color: 'error'})
        }
      },
      onResponse: (context) => {
        if (context.response.status === 200) {
          toast.add({title: 'Success', description: 'Recipe successfully imported ', color: 'success'})
          navigateTo('/')
        }
      }
    })
  } else {
    toast.add({title: 'Error', description: 'Please enter a URL', color: 'error'})
  }
}
</script>

<template>
  <UModal v-model:open="open" title="Import Recipe" description="Wow such a fancy feature"
          :ui="{ footer: 'justify-end' }">
    <UButton class="ml-2" label="+ Import Recipe via URL" color="neutral" variant="subtle"/>

    <template #body>
      <UForm :validate="validate" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Recipe URL">
          <UInput v-model="url" placeholder="URL"></UInput>
        </UFormField>
      </UForm>
    </template>

    <template #footer="{ close }">
      <UButton label="Cancel" color="neutral" variant="outline" @click="close"/>
      <UButton label="Import" color="neutral" @click="importRecipe"/>
    </template>
  </UModal>
</template>

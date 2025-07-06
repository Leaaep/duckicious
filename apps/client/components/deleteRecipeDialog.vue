<script setup lang="ts">
import {navigateTo} from "nuxt/app";
import {awaitAsync} from "valibot";

const open = ref(false)
const toast = useToast()

const route = useRoute()
const id = route.params.id

const deleteRecipe = async () => {
  await useFetch(`http://localhost:4000/api/recipe/${id}`, {
    method: 'delete',
    credentials: 'include',
    server: false,
    onResponseError: (error) => {
      if (error.response?.status === 401) {
        navigateTo('/login')
      } else {
        toast.add({title: 'Error', description: 'An error occurred: ' + error.response.status, color: 'error'})
      }
    },
    onResponse: (context) => {
      if (context.response.status === 200) {
        toast.add({title: 'Success', description: 'Recipe successfully deleted ', color: 'success'})
        navigateTo('/')
      }
    }
  })
}
</script>

<template>
  <UModal v-model:open="open" title="Delete Recipe" description="Quack quack quack" :ui="{ footer: 'justify-end' }">
    <UButton class="ml-2" label="Delete" color="error" variant="subtle" />

    <template #body>
      <p>Are you sure you want to delete this recipe?</p>
    </template>

    <template #footer="{ close }">
      <UButton label="Cancel" color="neutral" variant="outline" @click="close" />
      <UButton label="Delete" color="error" @click="deleteRecipe" />
    </template>
  </UModal>
</template>
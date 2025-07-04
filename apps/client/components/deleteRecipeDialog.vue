<script setup lang="ts">
const open = ref(false)
const toast = useToast()
const props = defineProps({
  id: Number
})

const deleteRecipe = () => {
  const {error} = useFetch(`http://localhost:4000/api/recipe/${props.id}`, {
    method: 'delete',
    credentials: 'include',
    server: false,
  })
  if (error.value) {
    toast.add({title: 'Error', description: 'An error occurred: ' + error.value, color: 'error'})
  } else {
    toast.add({title: 'Success', description: 'Recipe successfully deleted', color: 'success'})
    navigateTo('/dashboard')
  }
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
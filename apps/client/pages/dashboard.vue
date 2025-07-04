<script setup lang="ts">
const toast = useToast()

definePageMeta({
  layout: 'default'
})

const {data, error} = await useFetch('http://localhost:4000/api/recipe', {
  method: 'get',
  credentials: 'include',
  server: false
})

if (error.value) {
  toast.add({
    title: 'Error',
    description: 'An error occurred: ' + error.value?.statusCode + ' ' + error.value?.statusMessage,
    color: 'error'
  })
}
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
    <div :key="index" v-for="(recipe, index) in data">
      <RecipeCard
          :id="recipe.id"
          :title="recipe.title"
          :cook-time="recipe.cookTime"
          :description="recipe.description"
          :servings="recipe.servings"
      />
    </div>
  </div>
</template>


<style scoped>

</style>
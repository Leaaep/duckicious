<script setup lang="ts">
import {navigateTo} from "nuxt/app";

const toast = useToast()

definePageMeta({
  layout: 'default'
})

const {data} = await useFetch('http://localhost:4000/api/recipe', {
  method: 'get',
  credentials: 'include',
  server: false,
  onResponseError: (error) => {
    if (error.response?.status === 401) {
      navigateTo('/login')
    } else {
      toast.add({title: 'Error', description: 'An error occurred: ' + error.response.status, color: 'error'})
    }
  },
})

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
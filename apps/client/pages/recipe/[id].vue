<script setup lang="ts">
const toast = useToast()
definePageMeta({
  layout: 'recipe'
})

const data = ref<{}>({})
const route = useRoute()
const id = route.params.id

const {data: recipe, error} = await useAsyncData('recipe',
    () => $fetch(`http://localhost:4000/api/recipe/${id}`, {
      params: {
        recipe: data.value
      }
    }), {
      watch: [data]
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
  <UCard>
    <template #header>
      <EditRecipeDialog :id="recipe.id" :title="recipe.title" :description="recipe.description" :servings="recipe.servings"
                    :cook-time="recipe.cookTime" :ingredients="recipe.ingredients" :instructions="recipe.instructions"
                    :season="recipe.season"/>
      <p class="text-3xl text-center">{{ recipe.title }}</p>
      <p class="text-center">{{ recipe.description }}</p>
    </template>
    <template #default>
      <UContainer class="flex flex-row justify-between">
        <ul class="text-center">
          <li :key="index" v-for="(ingredient, index) in recipe.ingredients">
            {{ ingredient }}
          </li>
        </ul>

        <p class="text-center">{{ recipe.instructions }}</p>
      </UContainer>
    </template>
    <template #footer>
      <UContainer class="flex flex-row justify-between">
        <p class="text-gray-400">{{ 'Cook time: ' + recipe.cookTime }}</p>
        <p class="text-gray-400">{{ 'Servings: ' + recipe.servings }}</p>
        <p class="text-gray-400">{{ 'Season: ' + recipe.season }}</p>
      </UContainer>
    </template>
  </UCard>
</template>

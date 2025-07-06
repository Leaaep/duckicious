<script setup lang="ts">
import {navigateTo} from "nuxt/app";

const open = ref(false)
const seasonItems = ref(['spring', 'summer', 'autumn', 'winter'])
const toast = useToast()

const route = useRoute()
const paramID = route.params.id
const recipe = ref<{}>({
  id: 0,
  title: '',
  description: '',
  ingredients: [],
  instructions: '',
  season: '',
  servings: 0,
  cookTime: 0
})

const {data} = await useAsyncData('recipeEdit',
    () => $fetch(`http://localhost:4000/api/recipe/${paramID}`, {
      credentials: 'include',
      onResponseError: (error) => {
        if (error.response?.status === 401) {
          navigateTo('/login')
        } else {
          toast.add({title: 'Error', description: 'An error occurred: ' + error.response.status, color: 'error'})
        }
      }
    }), {
      watch: [open]
    })

watch(data, (newData) => {
  recipe.value = newData
})

const removeIngredient = (index: number) => {
  recipe.value.ingredients.splice(index, 1)
}

const addIngredient = () => {
  recipe.value.ingredients.push('')
}

const save = async () => {
  await useFetch(`http://localhost:4000/api/recipe/${paramID}`, {
    method: 'put',
    credentials: 'include',
    server: false,
    body: {
      id: recipe.value.id,
      title: recipe.value.title,
      description: recipe.value.description,
      ingredients: recipe.value.ingredients,
      instructions: recipe.value.instructions,
      season: recipe.value.season,
      servings: recipe.value.servings,
      cookTime: recipe.value.cookTime
    },
    onResponseError: (error) => {
      if (error.response?.status === 401) {
        navigateTo('/login')
      } else {
        toast.add({title: 'Error', description: 'An error occurred: ' + error.response.status, color: 'error'})
      }
    },
    onResponse: (context) => {
      if (context.response.status === 200) {
        toast.add({title: 'Success', description: 'Recipe successfully saved ', color: 'success'})
        reloadNuxtApp()
      }
    }
  })
}
</script>

<template>
  <UModal v-model:open="open" title="Edit Recipe" description="Upgrading the recipe to the next level?"
          :ui="{ footer: 'justify-end' }"
          :dismissible="false"
  >
    <UButton label="Edit" color="neutral" variant="subtle"/>
    <DeleteRecipeDialog />

    <template #body>
      <UForm :validate="validate" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Title">
          <UInput v-model="recipe.title" placeholder="Title"></UInput>
        </UFormField>
        <UFormField label="Description">
          <UInput v-model="recipe.description" placeholder="Description"></UInput>
        </UFormField>
        <UFormField label="Image">
          <UInput type="file"></UInput>
        </UFormField>
        <UFormField label="Ingredients">
          <UButton @click="addIngredient">Add</UButton>
          <UContainer class="flex flex-row" :key="index" v-for="(ingredient, index) in recipe.ingredients">
            <UInput class="flex flex-col m-2"
                    placeholder="Ingredients"
                    v-model="recipe.ingredients[index]">
            </UInput>
            <UButton @click="removeIngredient(index)" class="m-2">-</UButton>
          </UContainer>
        </UFormField>
        <UFormField label="Instructions">
          <UInput v-model="recipe.instructions" placeholder="Instructions"></UInput>
        </UFormField>
        <UFormField label="Season">
          <USelect placeholder="Season" v-model="recipe.season" :items="seasonItems" class="w-48"/>
        </UFormField>
        <UFormField label="Servings">
          <UInputNumber v-model="recipe.servings" placeholder="Servings"></UInputNumber>
        </UFormField>
        <UFormField label="Cook time">
          <UInputNumber v-model="recipe.cookTime" placeholder="Cook time"></UInputNumber>
        </UFormField>
      </UForm>
    </template>

    <template #footer="{ close }">
      <UButton label="Cancel" color="neutral" variant="outline" @click="close"/>
      <UButton label="Save" color="neutral" @click="save"/>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import {navigateTo} from "nuxt/app";

const open = ref(false)
const seasonItems = ref(['spring', 'summer', 'autumn', 'winter'])
const toast = useToast()

const title = ref<string>('')
const description = ref<string>('')
const ingredients = ref<string[]>([])
const instructions = ref<string>('')
const season = ref<string>('')
const servings = ref<number>(0)
const cookTime = ref<number>(0)

const resetForm = () => {
  title.value = ''
  description.value = ''
  ingredients.value = []
  instructions.value = ''
  season.value = 'spring'
  servings.value = 0
  cookTime.value = 0
}

const removeIngredient = (index: number) => {
  ingredients.value.splice(index, 1)
}

const addIngredient = () => {
  ingredients.value.push('')
}

const save = async () => {
  await useFetch(`http://localhost:4000/api/recipe`, {
    method: 'post',
    credentials: 'include',
    server: false,
    body: {
      title: title,
      description: description,
      ingredients: ingredients,
      instructions: instructions,
      season: season,
      servings: servings,
      cookTime: cookTime
    },
    onResponseError: (error) => {
      if (error.response?.status === 401) {
        navigateTo('/login')
      } else {
        toast.add({title: 'Error', description: 'An error occurred: ' + error.response.status, color: 'error'})
      }
    },
    onResponse: (context) => {
      if (context.response.status === 201) {
        toast.add({title: 'Success', description: 'Recipe successfully saved ', color: 'success'})
        navigateTo('/')
      }
    }
  })
}

watch(open, () => {
  resetForm()
})
</script>

<template>
  <UModal :onclose="resetForm" v-model:open="open" title="Create Recipe" description="No duck recipes allowed!"
          :ui="{ footer: 'justify-end' }"
          :dismissible="false"
  >
    <UButton label="+ Custom recipe" color="neutral" variant="subtle"/>

    <template #body>
      <UForm :validate="validate" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Title">
          <UInput v-model="title" placeholder="Title"></UInput>
        </UFormField>
        <UFormField label="Description">
          <UInput v-model="description" placeholder="Description"></UInput>
        </UFormField>
        <UFormField label="Image">
          <UInput type="file"></UInput>
        </UFormField>
        <UFormField label="Ingredients">
          <UButton @click="addIngredient">Add</UButton>
          <UContainer class="flex flex-row" :key="index" v-for="(ingredient, index) in ingredients">
            <UInput class="flex flex-col m-2"
                    placeholder="Ingredients"
                    v-model="ingredients[index]">
            </UInput>
            <UButton @click="removeIngredient(index)" class="m-2">-</UButton>
          </UContainer>
        </UFormField>
        <UFormField label="Instructions">
          <UInput v-model="instructions" placeholder="Instructions"></UInput>
        </UFormField>
        <UFormField label="Season">
          <USelect placeholder="Season" v-model="season" :items="seasonItems" class="w-48"/>
        </UFormField>
        <UFormField label="Servings">
          <UInputNumber v-model="servings" placeholder="Servings"></UInputNumber>
        </UFormField>
        <UFormField label="Cook time">
          <UInputNumber v-model="cookTime" placeholder="Cook time"></UInputNumber>
        </UFormField>
      </UForm>
    </template>

    <template #footer="{ close }">
      <UButton label="Cancel" color="neutral" variant="outline" @click="close"/>
      <UButton label="Save" color="neutral" @click="save"/>
    </template>
  </UModal>
</template>
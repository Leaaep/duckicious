<script setup lang="ts">
const open = ref(false)
const seasonItems = ref(['spring', 'summer', 'autumn', 'winter'])
const toast = useToast()

watch(open, (newOpen) => {
  console.log(newOpen)
  if (!newOpen) {
    reloadNuxtApp()
  }
})

const props = defineProps({
  id: Number,
  title: String,
  description: String,
  ingredients: Array<string>,
  instructions: String,
  season: String,
  servings: Number,
  cookTime: Number
})

const title = ref<string>(props.title || '')
const description = ref<string>(props.description || '')
const ingredients = ref<string[]>(props.ingredients || [])
const instructions = ref<string>(props.instructions || '')
const season = ref<string>(props.season || '')
const servings = ref<number>(props.servings || 0)
const cookTime = ref<number>(props.cookTime || 0)

const removeIngredient = (index: number) => {
  ingredients.value.splice(index, 1)
}

const addIngredient = () => {
  ingredients.value.push('')
}

const save = () => {
  const {error} = useFetch(`http://localhost:4000/api/recipe/${props.id}`, {
    method: 'put',
    credentials: 'include',
    server: false,
    body: {
      id: props.id,
      title: title,
      description: description,
      ingredients: ingredients,
      instructions: instructions,
      season: season,
      servings: servings,
      cookTime: cookTime
    }
  })
  if (error.value) {
    toast.add({title: 'Error', description: 'An error occurred: ' + error.value, color: 'error'})
  } else {
    toast.add({title: 'Success', description: 'Recipe successfully saved', color: 'success'})
  }
}
</script>

<template>
  <UModal v-model:open="open" title="Edit Recipe" description="Upgrading the recipe to the next level?"
          :ui="{ footer: 'justify-end' }"
          :dismissible="false"
  >
    <UButton label="Edit" color="neutral" variant="subtle"/>
    <DeleteRecipeDialog :id="props.id"/>

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
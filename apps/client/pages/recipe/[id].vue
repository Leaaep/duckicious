<script setup lang="ts">
import {navigateTo} from "nuxt/app";

const toast = useToast();
definePageMeta({
  layout: 'recipe'
});

const route = useRoute();
const id = route.params.id;

const {data: recipe} = await useFetch(() => `http://localhost:4000/api/recipe/${id}`, {
  credentials: 'include',
  server: false,
  onResponseError: (error) => {
    if (error.response?.status === 401) {
      navigateTo('/login');
    } else {
      toast.add({
        title: 'Error',
        description: 'An error occurred: ' + error.response.status,
        color: 'error'
      });
    }
  }
});
</script>

<template>
  <UCard>
    <template #header>
      <EditRecipeDialog/>
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

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
  <template v-if="recipe">
    <UCard class="w-full">
      <template #header>
        <EditRecipeDialog />
        <p class="text-3xl font-bold text-center">{{ recipe.title }}</p>
        <USeparator class="my-4" />
        <p class="text-center text-gray-600">{{ recipe.description }}</p>
      </template>
      <template #default>
        <UContainer class="flex flex-col lg:flex-row lg:space-x-8 space-y-6 lg:space-y-0">
          <ul class="list-disc list-inside space-y-2 flex-shrink-0 lg:w-64">
            <li
                v-for="(ingredient, index) in recipe.ingredients"
                :key="index"
            >
              {{ ingredient }}
            </li>
          </ul>
          <p class="flex-1 leading-relaxed">
            {{ recipe.instructions }}
          </p>
        </UContainer>
      </template>
      <template #footer>
        <UContainer class="flex flex-wrap justify-between text-sm text-gray-500 mt-4">
          <p>{{ 'Cook time: ' + recipe.cookTime + 'm' }}</p>
          <p>{{ 'Servings: ' + recipe.servings }}</p>
          <p>{{ 'Season: ' + recipe.season }}</p>
        </UContainer>
      </template>
    </UCard>
  </template>

  <div v-else class="text-center text-gray-400 p-10">
    Loading recipe or recipe not found.
  </div>
</template>


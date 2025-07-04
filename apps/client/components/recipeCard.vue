<script setup lang="ts">
defineProps({
  id: Number,
  title: String,
  description: String,
  servings: Number,
  cookTime: Number,
})

</script>

<template>
  <NuxtLink :to="{ name: 'recipe-id', params: { id } }">
  <UCard class="w-full text-center p-4 m-0">
      <template #header>
        <p class="text-3xl">{{ title }}</p>
      </template>
      <template #default>
        <p>{{ description }}</p>
      </template>
      <template #footer>
        <p class="text-gray-400"> {{ 'Cook time: ' + cookTime + ' Servings: ' + servings }} </p>
      </template>
    </UCard>
  </NuxtLink>
</template>

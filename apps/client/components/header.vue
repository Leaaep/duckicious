<template>
  <header class="shadow-md p-4 flex justify-between items-center">
    <h1 class="text-2xl font-bold">Duckicious</h1>
    <nav class="space-x-4">
      <NuxtLink to="/dashboard" class="">Dashboard</NuxtLink>

      <UPopover>
        <UButton label="New Recipe" color="neutral" variant="subtle"/>

        <template #content>
          <CreateRecipeDialog/>
          <RecipeImportDialog/>
        </template>
      </UPopover>

    </nav>
  </header>
</template>

<template>

<div class="relative flex min-h-[100vh] w-full">


    <div class="w-full">
        <LayoutsHeader />

        <div class="relative xl:px-9 px-5 xl:py-7 py-4 lg:max-h-[calc(100vh-75px)] max-h-[calc(100vh-67px)] overflow-y-auto y-scroll">
            <slot />
        </div>
    </div>
  </div>
  </template>
  
  <script setup>
  
  </script>
  
  <style scoped>
  </style>
  
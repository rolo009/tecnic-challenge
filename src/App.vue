<script setup>
import OperatorMachine from './components/OperatorMachine.vue'
import Toast from 'primevue/toast'
</script>

<template>
  <header></header>

  <main class="p-8">
    <div class="flex justify-center text-4xl mb-6">Operator Machine</div>
    <Toast />
    <OperatorMachine />
  </main>
</template>

<style scoped></style>

<script setup>
import { ref } from 'vue'
import OperatorMachine from './components/OperatorMachine.vue'
import Toast from 'primevue/toast'
import Button from 'primevue/button'

let autoMachine = ref(true)
</script>

<template>
  <header>
    <div class="application-header">
      <h1>Operator Machine</h1>
      <Button :label="autoMachine ? 'Manual' : 'Auto'" @click="autoMachine = !autoMachine" />
    </div>
  </header>

  <main class="application-content">
    <Toast />
    <OperatorMachine :autoMachine="autoMachine" />
  </main>
</template>

<style scoped>
.application-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 32px;
}

.application-header h1 {
  margin: 0;
}

.application-content {
  padding: 32px;
}

@media only screen and (max-width: 800px) {
  .application-header,
  .application-content {
    padding: 8px;
  }
  .application-header {
    margin-bottom: 12px;
  }
  .application-header h1 {
    font-size: 24px;
  }
}
</style>

<script setup>
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import Fieldset from 'primevue/fieldset'

import { ref } from 'vue'
let valueToPush = ref(null)
let queue = ref([])

/**
 * Add a value to the queue.
 *
 * @param {number} value - The value to add.
 */
let push = (value) => {
  queue.value.unshift(value)
  valueToPush.value = null
}

/**
 * Add the top two values of the queue and replace them with the result.
 */
let add = () => {
  let addAux = 0
  addAux = queue.value[0] + queue.value[1]
  queue.value.splice(0, 2, addAux)
}

/**
 * Subtract the second top value of the queue from the top value and replace them with the result.
 */
let sub = () => {
  let subAux = 0
  subAux = queue.value[0] - queue.value[1]
  queue.value.splice(0, 2, subAux)
}

/**
 * Multiply the top two values of the queue and replace them with the result.
 */
let mul = () => {
  let mulAux = 0
  mulAux = queue.value[0] * queue.value[1]
  queue.value.splice(0, 2, mulAux)
}

/**
 * Divide the top value of the queue by the second top value and replace them with the result.
 */
let div = () => {
  let divAux = 0
  divAux = queue.value[0] / queue.value[1]
  queue.value.splice(0, 2, divAux)
}

/**
 * Duplicate the top value of the queue.
 */
let dup = () => {
  push(queue.value[0])
}

/**
 * Remove the top value of the queue.
 */
let pop = () => {
  queue.value.splice(0, 1)
}

/**
 * Swap the positions of the top two values of the queue.
 */
let swap = () => {
  let valAux = queue.value[0]
  queue.value[0] = queue.value[1]
  queue.value[1] = valAux
}
</script>

<template>
  <div class="operator-machine-page-container">
    <div class="operator-machine-container">
      <div class="input-container">
        <InputNumber v-model="valueToPush" inputId="integeronly" class="w-64" />
        <Button label="PUSH" @click="push(valueToPush)" :disabled="!valueToPush" />
      </div>

      <Fieldset legend="Queue" v-if="queue.length">
        <div class="queue-list-container">
          <div
            class="queue-list-item"
            v-for="(item, index) of queue"
            v-tooltip.top="`Element - ${index + 1}`"
          >
            {{ item }}
          </div>
        </div>
      </Fieldset>
      <div class="operations-container">
        <Button label="ADD" class="operation-button" @click="add" />
        <Button label="SUB" class="operation-button" @click="sub" />
        <Button label="MUL" class="operation-button" @click="mul" />
        <Button label="DIV" class="operation-button" @click="div" />
        <Button label="DUP" class="operation-button" @click="dup" />
        <Button label="POP" class="operation-button" @click="pop" />
        <Button label="SWAP" class="operation-button" @click="swap" />
      </div>
    </div>
    <div></div>
  </div>
</template>

<style scoped>
.operator-machine-page-container {
  display: flex;
  flex-direction: row;
}

.operator-machine-page-container .operator-machine-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 66%;
  border: 1px solid rgba(0, 0, 0, 0.35);
  border-radius: 12px;
  padding: 32px;
}

.operator-machine-page-container .operator-machine-container .input-container {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
}

.operator-machine-page-container .operator-machine-container .queue-list-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 12px;
  gap: 12px;
  padding: 0 50px;
  width: 100%;
}

.operator-machine-page-container
  .operator-machine-container
  .queue-list-container
  .queue-list-item {
  padding: 12px;
  background-color: rgba(0, 0, 0, 0.24);
  border-radius: 6px;
}

.operator-machine-page-container .operator-machine-container .operations-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 32px;
  margin-top: 24px;
}

.operator-machine-page-container
  .operator-machine-container
  .operations-container
  .operation-button {
  width: 30%;
}
</style>

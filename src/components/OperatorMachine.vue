<script setup>
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import Fieldset from 'primevue/fieldset'

import { useToast } from 'primevue/usetoast'

const toast = useToast()
import { ref, onMounted } from 'vue'
let valueToPush = ref(null)
let queue = ref([])
let history = ref([])
let autoMachine = ref(true)
/**
 * Add a value to the queue.
 *
 * @param {number} value - The value to add.
 */
let push = (value) => {
  if (!valueToPush.value) {
    toast.add({
      severity: 'warning',
      summary: 'Push Warning',
      detail: 'You need to enter a number to proceed.',
      life: 3000
    })

    return
  }
  queue.value.unshift(value)
  valueToPush.value = null

  updateHistory('PUSH', value, null)
}

/**
 * Add the top two values of the queue and replace them with the result.
 */
let add = () => {
  if (queue.value.length < 2) {
    toast.add({
      severity: 'warning',
      summary: 'Add Warning',
      detail: 'The queue needs at least two items to proceed.',
      life: 3000
    })
    return
  }
  let addAux = 0
  addAux = queue.value[0] + queue.value[1]
  updateHistory('ADD', queue.value[0] + ' + ' + queue.value[1], addAux)

  queue.value.splice(0, 2, addAux)
}

/**
 * Subtract the second top value of the queue from the top value and replace them with the result.
 */
let sub = () => {
  if (queue.value.length < 2) {
    toast.add({
      severity: 'warning',
      summary: 'Sub Warning',
      detail: 'The queue needs at least two items to proceed.',
      life: 3000
    })
    return
  }
  let subAux = 0
  subAux = queue.value[0] - queue.value[1]
  updateHistory('SUB', queue.value[0] + ' - ' + queue.value[1], subAux)
  queue.value.splice(0, 2, subAux)
}

/**
 * Multiply the top two values of the queue and replace them with the result.
 */
let mul = () => {
  if (queue.value.length < 2) {
    toast.add({
      severity: 'warning',
      summary: 'Mul Warning',
      detail: 'The queue needs at least two items to proceed.',
      life: 3000
    })
    return
  }
  let mulAux = 0
  mulAux = queue.value[0] * queue.value[1]
  updateHistory('MUL', queue.value[0] + ' * ' + queue.value[1], mulAux)
  queue.value.splice(0, 2, mulAux)
}

/**
 * Divide the top value of the queue by the second top value and replace them with the result.
 */
let div = () => {
  if (queue.value.length < 2) {
    toast.add({
      severity: 'warning',
      summary: 'Div Warning',
      detail: 'The queue needs at least two items to proceed.',
      life: 3000
    })
    return
  }
  let divAux = 0
  divAux = queue.value[0] / queue.value[1]
  updateHistory('DIV', queue.value[0] + ' * ' + queue.value[1], divAux)
  queue.value.splice(0, 2, divAux)
}

/**
 * Duplicate the top value of the queue.
 */
let dup = () => {
  if (queue.value.length < 1) {
    toast.add({
      severity: 'warning',
      summary: 'Dup Warning',
      detail: 'The queue needs at least one item to proceed.',
      life: 3000
    })
    return
  }
  push(queue.value[0])

  updateHistory('DUP', queue.value[0], null)
}

/**
 * Remove the top value of the queue.
 */
let pop = () => {
  if (queue.value.length < 1) {
    toast.add({
      severity: 'warning',
      summary: 'Pop Warning',
      detail: 'The queue needs at least one item to proceed.',
      life: 3000
    })
    return
  }
  queue.value.splice(0, 1)

  updateHistory('POP', queue.value[0], null)
}

/**
 * Swap the positions of the top two values of the queue.
 */
let swap = () => {
  if (queue.value.length < 2) {
    toast.add({
      severity: 'warning',
      summary: 'Swap Warning',
      detail: 'The queue needs at least two items to proceed.',
      life: 3000
    })
    return
  }
  let valAux = queue.value[0]
  queue.value[0] = queue.value[1]
  queue.value[1] = valAux

  updateHistory('SWAP', queue.value[1], queue.value[0])
}

let updateHistory = (operation, value, result) => {
  history.value.unshift({
    operation: operation,
    value: value,
    result: result
  })

  if (history.value.length >= 15) {
    history.value.pop()
  }
  localStorage.setItem('operations-history', JSON.stringify(history.value))
}

onMounted(() => {
  let historyAux = localStorage.getItem('operations-history')
  if (historyAux) {
    history.value = JSON.parse(historyAux)
  }
})
</script>

<template>
  <div class="operator-machine-page-container">
    <div class="operator-machine-container">
      <div class="input-container">
        <InputNumber v-model="valueToPush" inputId="integeronly" class="w-64" />
        <Button label="PUSH" @click="push(valueToPush)" />
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
    <div class="history-container" v-if="history.length > 0">
      <div>History</div>
      <div v-for="historyItem of history">
        <div
          v-if="
            historyItem.operation == 'PUSH' ||
            historyItem.operation == 'DUP' ||
            historyItem.operation == 'POP'
          "
          class="history-item"
        >
          <span>
            {{ historyItem.operation }}
          </span>
          <span>
            {{ historyItem.value }}
          </span>
        </div>
        <div v-else-if="historyItem.operation == 'SWAP'" class="history-item">
          <span>
            {{ historyItem.operation }}
          </span>
          <span>
            {{ historyItem.value }}
            <i class="pi pi-arrow-right-arrow-left"></i>
            {{ historyItem.result }}
          </span>
        </div>
        <div v-else class="history-item">
          <span>
            {{ historyItem.operation }}
          </span>
          <span>
            {{ historyItem.value }}
          </span>
          <span>
            {{ historyItem.result }}
          </span>
        </div>
      </div>
    </div>
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
  width: 55%;
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

.operator-machine-page-container .history-container {
  display: flex;
  flex-direction: column;
  width: 45%;
  padding-left: 24px;
  height: 500px;
  overflow: auto;
}

.operator-machine-page-container .history-container div:first-child {
  margin-bottom: 12px;
}

.operator-machine-page-container .history-container .history-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.35);
}

.operator-machine-page-container .history-container .history-item span:first-child {
  background-color: #10b981;
  padding: 8px;
  border-radius: 8px;
  color: #fff;
}
</style>

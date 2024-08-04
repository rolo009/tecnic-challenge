<script setup>
import { ref, onMounted } from 'vue'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Fieldset from 'primevue/fieldset'
import { useToast } from 'primevue/usetoast'
import History from './History.vue'
import OverlayPanel from 'primevue/overlaypanel'

const props = defineProps({
  autoMachine: {
    type: Boolean,
    required: true
  }
})
const toast = useToast()

let valueToPush = ref(null)
let queue = ref([])
let history = ref([])
let operationString = ref('')
const operationsInformation = ref()

/**
 * Add a value to the queue.
 *
 * @param {number} value - The value to add.
 */
let push = (value) => {
  // Check if the value to push is not provided and autoMachine is not enabled
  if (!valueToPush.value && !props.autoMachine) {
    // Display a warning message if no value is provided
    toast.add({
      severity: 'warn',
      summary: 'Push Warning',
      detail: 'You need to enter a number to proceed.',
      life: 10000
    })

    return
  }
  // Add the value to the top of the queue
  queue.value.unshift(value)

  // Reset the input value
  valueToPush.value = null

  // Update the history with the push operation
  updateHistory('PUSH', value, null)
}

/**
 * Add the top two values of the queue and replace them with the result.
 */
let add = () => {
  // Check if the queue has fewer than two items
  if (queue.value.length < 2) {
    // Display a warning message if the queue has less than two items
    toast.add({
      severity: 'warn',
      summary: 'Add Warning',
      detail: 'The queue needs at least two items to proceed.'
    })
    return
  }

  // Perform the addition of the top two values
  let addAux = queue.value[0] + queue.value[1]

  // Update the history with the add operation
  updateHistory('ADD', queue.value[0] + ' + ' + queue.value[1], addAux)

  // Replace the top two values with the result
  queue.value.splice(0, 2, addAux)
}

/**
 * Subtract the second top value of the queue from the top value and replace them with the result.
 */
let sub = () => {
  // Check if the queue has fewer than two items
  if (queue.value.length < 2) {
    // Display a warning message if the queue has less than two items
    toast.add({
      severity: 'warn',
      summary: 'Sub Warning',
      detail: 'The queue needs at least two items to proceed.',
      life: 10000
    })
    return
  }

  // Perform the subtraction of the top two value
  let subAux = queue.value[0] - queue.value[1]

  // Update the history with the sub operation
  updateHistory('SUB', queue.value[0] + ' - ' + queue.value[1], subAux)

  // Replace the top two values with the result
  queue.value.splice(0, 2, subAux)
}

/**
 * Multiply the top two values of the queue and replace them with the result.
 */
let mul = () => {
  // Check if the queue has fewer than two items
  if (queue.value.length < 2) {
    // Display a warning message if the queue has less than two items
    toast.add({
      severity: 'warn',
      summary: 'Mul Warning',
      detail: 'The queue needs at least two items to proceed.',
      life: 10000
    })
    return
  }

  // Perform the multiplication of the top two values
  let mulAux = queue.value[0] * queue.value[1]

  // Update the history with the mul operation
  updateHistory('MUL', queue.value[0] + ' * ' + queue.value[1], mulAux)

  // Replace the top two values with the result
  queue.value.splice(0, 2, mulAux)
}

/**
 * Divide the top value of the queue by the second top value and replace them with the result.
 */
let div = () => {
  // Check if the queue has fewer than two items
  if (queue.value.length < 2) {
    // Display a warning message if the queue has less than two items
    toast.add({
      severity: 'warn',
      summary: 'Div Warning',
      detail: 'The queue needs at least two items to proceed.',
      life: 10000
    })
    return
  }
  // Perform the division of the top two values
  let divAux = queue.value[0] / queue.value[1]

  // Update the history with the div operation
  updateHistory('DIV', queue.value[0] + ' / ' + queue.value[1], divAux)

  // Replace the top two values with the result
  queue.value.splice(0, 2, divAux)
}

/**
 * Duplicate the top value of the queue.
 */
let dup = () => {
  // Check if the queue has fewer than one item
  if (queue.value.length < 1) {
    // Display a warning message if the queue has less than one item
    toast.add({
      severity: 'warn',
      summary: 'Dup Warning',
      detail: 'The queue needs at least one item to proceed.',
      life: 10000
    })
    return
  }

  // Push the top value onto the queue again
  push(queue.value[0])

  // Update the history with the dup operation
  updateHistory('DUP', queue.value[0], null)
}

/**
 * Remove the top value of the queue.
 */
let pop = () => {
  // Check if the queue has fewer than one item
  if (queue.value.length < 1) {
    // Display a warning message if the queue has less than one item
    toast.add({
      severity: 'warn',
      summary: 'Pop Warning',
      detail: 'The queue needs at least one item to proceed.',
      life: 10000
    })
    return
  }

  // Update the history with the pop operation
  updateHistory('POP', queue.value[0], null)

  // Remove the top value from the queue
  queue.value.splice(0, 1)
}

/**
 * Swap the positions of the top two values of the queue.
 */
let swap = () => {
  // Check if the queue has fewer than two items
  if (queue.value.length < 2) {
    // Display a warning message if the queue has less than two items
    toast.add({
      severity: 'warn',
      summary: 'Swap Warning',
      detail: 'The queue needs at least two items to proceed.',
      life: 10000
    })
    return
  }

  // Swap the first two items in the queue
  let valAux = queue.value[0]
  queue.value[0] = queue.value[1]
  queue.value[1] = valAux

  // Update the history with the swap operation
  updateHistory('SWAP', queue.value[1], queue.value[0])
}

/**
 * Start the machine by processing the operation string.
 */
let startMachine = () => {
  // Check if the operation string is empty
  if (!operationString.value) {
    toast.add({
      severity: 'warn',
      summary: 'Machine Warning',
      detail: 'You need to enter a string to proceed.',
      life: 10000
    })

    return
  }
  // Split the operation string into an array of operations
  let operationStringAux = operationString.value.split(' ')

  //Execute each operation
  for (let i = 0; i < operationStringAux.length; i++) {
    switch (operationStringAux[i]) {
      case 'PUSH':
        push(+operationStringAux[i + 1])
        i++
        break
      case 'ADD':
        add()
        break
      case 'SUB':
        sub()
        break
      case 'MUL':
        mul()
        break
      case 'DIV':
        div()
        break
      case 'DUP':
        dup()
        break
      case 'POP':
        pop()
        break
      case 'SWAP':
        swap()
        break
      default:
        break
    }
  }

  // Clear the operation string input
  operationString.value = ''
}

/**
 * Update the history of operations with a new entry.
 * @param {string} operation - The operation performed.
 * @param {*} value - The value associated with the operation.
 * @param {*} result - The result of the operation.
 */
let updateHistory = (operation, value, result) => {
  // Add the new operation to the beginning of the history array
  history.value.unshift({
    operation: operation,
    value: value,
    result: result,
    date: new Date()
  })

  // Keep the history array to a maximum of 15 entries
  if (history.value.length >= 15) {
    history.value.pop()
  }

  // Save the updated history to local storage
  localStorage.setItem('operations-history', JSON.stringify(history.value))
}

/**
 * Clear the operation history.
 */
let cleanHistory = () => {
  history.value = []
}

/**
 * Toggle the overlay panel of the operations information.
 * @param {Event} event - The event that triggered the toggle.
 */
const toggle = (event) => {
  operationsInformation.value.toggle(event)
}

/**
 * Load the operation history from local storage when the component is mounted.
 */
onMounted(() => {
  let historyAux = localStorage.getItem('operations-history')
  if (historyAux) {
    history.value = JSON.parse(historyAux)
  }
})
</script>

<template>
  <div class="operator-machine-page-container" :class="autoMachine ? 'auto-machine-container' : ''">
    <div class="operator-machine-container" v-if="autoMachine">
      <div class="input-container">
        <Button icon="pi pi-info-circle" severity="secondary" text rounded @click="toggle" />

        <InputText type="text" v-model="operationString" placeholder="Insert Operations" />
        <Button label="SEND" @click="startMachine()" />

        <OverlayPanel ref="operationsInformation">
          <b>PUSH X:</b> Empurra o valor X para a queue. <br /><b>ADD:</b> Adiciona os dois valores
          no topo da queue e empurra o resultado de volta.<br /><b>SUB:</b> Subtrai o valor no topo
          da queue do próximo valor e empurra o resultado de volta.<br /><b>MUL:</b> Multiplica os
          dois valores no topo da queue e empurra o resultado de volta.<br /><b>DIV:</b> Divide o
          valor no topo da queue pelo próximo valor e empurra o resultado de volta. <br /><b
            >DUP:</b
          >
          Duplica o valor no topo da queue.<br /><b>POP:</b> Remove o valor no topo da queue.<br /><b
            >SWAP:</b
          >
          Inverte a posição dos dois valores no topo da queue. <br /><b>Exemplo de entrada:</b>​​
          "PUSH 3 PUSH 4 ADD DUP MUL POP SUB"
        </OverlayPanel>
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
    </div>

    <div class="operator-machine-container" v-if="!autoMachine">
      <div class="input-container">
        <InputNumber
          v-model="valueToPush"
          inputId="integeronly"
          class="w-64"
          placeholder="Insert a Number"
        />
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
      <div class="info-button">
        <Button icon="pi pi-info-circle" severity="secondary" text rounded @click="toggle" />
        <OverlayPanel ref="operationsInformation">
          <b>PUSH X:</b> Empurra o valor X para a queue. <br /><b>ADD:</b> Adiciona os dois valores
          no topo da queue e empurra o resultado de volta.<br /><b>SUB:</b> Subtrai o valor no topo
          da queue do próximo valor e empurra o resultado de volta.<br /><b>MUL:</b> Multiplica os
          dois valores no topo da queue e empurra o resultado de volta.<br /><b>DIV:</b> Divide o
          valor no topo da queue pelo próximo valor e empurra o resultado de volta. <br /><b
            >DUP:</b
          >
          Duplica o valor no topo da queue.<br /><b>POP:</b> Remove o valor no topo da queue.<br /><b
            >SWAP:</b
          >
          Inverte a posição dos dois valores no topo da queue.
        </OverlayPanel>
      </div>
    </div>
    <div class="machine-history-container">
      <History
        :fullHistory="true"
        :autoMachine="autoMachine"
        :history="history"
        @cleanHistory="cleanHistory()"
      />
    </div>
  </div>
</template>

<style scoped>
.operator-machine-page-container {
  display: flex;
  flex-direction: row;
}

.auto-machine-container {
  flex-direction: column;
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
  max-height: 450px;
  position: relative;
}

.operator-machine-page-container .operator-machine-container .info-button {
  position: absolute;
  bottom: 12px;
  right: 12px;
}

.auto-machine-container .operator-machine-container {
  width: 100%;
  border: 0;
}

.operator-machine-page-container .operator-machine-container .input-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 24px;
  width: 100%;
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

.operator-machine-page-container .machine-history-container {
  width: 45%;
}

.auto-machine-container .machine-history-container {
  width: 100%;
}

@media only screen and (max-width: 800px) {
  .operator-machine-page-container {
    flex-direction: column;
  }

  .operator-machine-page-container.auto-machine-container .operator-machine-container {
    padding: 0;
  }
  .operator-machine-page-container .operator-machine-container {
    padding: 12px;
    width: 100%;
  }

  .operator-machine-page-container .operator-machine-container .input-container {
    margin-bottom: 0;
  }

  .operator-machine-page-container .machine-history-container {
    width: 100%;
  }
}
</style>

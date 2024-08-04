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
  if (!valueToPush.value && !props.autoMachine) {
    toast.add({
      severity: 'warning',
      summary: 'Push Warning',
      detail: 'You need to enter a number to proceed.',
      life: 10000
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
      life: 10000
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
      life: 10000
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
      life: 10000
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
      life: 10000
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
      life: 10000
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
      life: 10000
    })
    return
  }
  updateHistory('POP', queue.value[0], null)
  queue.value.splice(0, 1)
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
      life: 10000
    })
    return
  }
  let valAux = queue.value[0]
  queue.value[0] = queue.value[1]
  queue.value[1] = valAux

  updateHistory('SWAP', queue.value[1], queue.value[0])
}

let startMachine = () => {
  if (!operationString.value) {
    toast.add({
      severity: 'warning',
      summary: 'Machine Warning',
      detail: 'You need to enter a string to proceed.',
      life: 10000
    })

    return
  }
  let operationStringAux = operationString.value.split(' ')
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

  operationString.value = ''
}

let updateHistory = (operation, value, result) => {
  history.value.unshift({
    operation: operation,
    value: value,
    result: result,
    date: new Date()
  })

  if (history.value.length >= 15) {
    history.value.pop()
  }
  localStorage.setItem('operations-history', JSON.stringify(history.value))
}

let cleanHistory = () => {
  history.value = []
}

const toggle = (event) => {
  console.log(132)
  operationsInformation.value.toggle(event)
}

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

<script setup>
import Button from 'primevue/button'

const emit = defineEmits(['cleanHistory'])

const props = defineProps({
  fullHistory: {
    type: Boolean,
    required: true
  },
  autoMachine: {
    type: Boolean,
    required: true
  },
  history: {
    type: Object,
    required: true
  }
})

const formatDate = (value) => {
  return moment(String(value)).format('DD/MM/YYYY')
}

let cleanHistory = () => {
  localStorage.removeItem('operations-history')
  emit('cleanHistory')
}
</script>

<template>
  <div
    class="history-container"
    :class="autoMachine ? 'auto-history-items' : 'manual-history-container'"
  >
    <div class="history-header-container">
      <h3 class="history-title">History</h3>
      <Button label="Clear" @click="cleanHistory()" />
    </div>
    <div class="history-items-container" v-if="history.length > 0">
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
    <div v-else class="no-operations">No operations executed yet</div>
  </div>
</template>

<style scoped>
.history-title {
  padding: 0 32px;
}
.history-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.history-container .history-header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.history-items-container {
  display: flex;
  flex-direction: column;
  padding-left: 24px;
  height: 420px;
  overflow: auto;
}

.history-items-container .history-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.35);
}

.history-items-container div:first-child .history-item {
  background-color: rgba(16, 185, 129, 0.145);
}

.history-items-container .history-item span:first-child {
  background-color: #10b981;
  padding: 8px;
  border-radius: 8px;
  color: #fff;
}

.no-operations {
  padding: 8px 32px;
  opacity: 0.5;
}

@media only screen and (max-width: 800px) {
  .history-items-container {
    padding: 0;
  }
  .auto-history-items .history-items-container {
    padding: 0px;
    height: calc(100vh - 220px);
  }

  .history-title {
    padding: 12px;
  }

  .manual-history-container .history-items-container {
    height: calc(100vh - 500px) !important;
  }
}
</style>

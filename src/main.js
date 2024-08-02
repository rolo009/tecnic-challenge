import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import PrimeVue from 'primevue/config'
import Tooltip from 'primevue/tooltip'
import 'primevue/resources/themes/aura-light-green/theme.css'
import 'primeicons/primeicons.css' // ícones PrimeIcons
import 'primeflex/primeflex.css' // PrimeFlex para utilidades CSS

const app = createApp(App)
app.directive('tooltip', Tooltip)
app.use(PrimeVue, {
  ripple: true
})
app.mount('#app')

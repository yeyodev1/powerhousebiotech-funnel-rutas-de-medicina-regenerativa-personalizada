import { createApp } from 'vue'
import { createPinia } from 'pinia'

import '@/styles/global.scss'

import App from './App.vue'
import router from './router'
import { initPhbTracker } from '@/utils/phbTracker'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

initPhbTracker(router)

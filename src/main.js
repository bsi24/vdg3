import { createApp } from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import ElNotification from 'element-plus'
import locale from 'element-plus/es/locale/lang/ru'
import iconTools from '@element-plus/icons/es/Tools'
import Expand from '@element-plus/icons/es/Expand'

import '@/css/style.css'
import '@/css/color.css'


createApp(App)
    .component('tools',iconTools)
    .component('expand',Expand)
    .use(ElementPlus,  {locale}, ElNotification)
    .mount('#app')
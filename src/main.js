import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import BootstrapVue from 'bootstrap-vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlus, faFolderOpen, faBan, faSave, faEdit, faPaperPlane, faCheck, faSignature, faDownload, faMoneyBill, faShareAlt, faUser, faUserEdit, faUserPlus, faList, faEye, faTrash, faShare} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import 'va/lib/css'
import 'va/lib/script'
import 'vue2-datepicker/index.css';
import Paginate from 'vuejs-paginate'
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/locale/ru';

Vue.use(BootstrapVue)

library.add(faPlus, faFolderOpen, faBan, faSave, faEdit, faPaperPlane, faCheck, faSignature, faDownload, faMoneyBill, faShareAlt, faUser, faUserEdit, faUserPlus, faList, faEye, faTrash, faShare)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('paginate', Paginate)
Vue.component('date-picker', DatePicker)
Vue.config.productionTip = false
new Vue({
  router,
  store,
  data: {
    title: 'Default'
  },
  render: h => h(App)
}).$mount('#app')

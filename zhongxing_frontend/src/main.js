import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import echarts from 'echarts'
// import d3 from 'd3'
// import neo4jd3 from 'neo4jd3'
import cookie from './assets/js/cookie'
import api from './assets/api-config'
import './assets/css/init.css'
import './assets/css/custom.css'
// import './static/lib/d3.min.js'
// import './static/lib/neo4jd3.js'
// import './static/lib/neo4jd3test.js'
import {bytesToSize, formatDuration} from './assets/js/utils'
import VueParticles from './components/vue-particles'

Vue.prototype.$echarts = echarts;
Vue.prototype.$cookie = cookie;
Vue.prototype.$api = api;
Vue.prototype.$bytesToSize = bytesToSize;
Vue.prototype.$formatDuration = formatDuration;

Vue.use(VueParticles);

Vue.config.productionTip = false;

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');

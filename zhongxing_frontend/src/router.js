import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Upload from './views/Upload.vue'
import Preprocess from './views/Preprocess.vue'
import Algorithm from './views/Algorithm.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import Config from './views/Config.vue'
import Application from './views/Application.vue'
import SHMetro from './views/SHMetro.vue'
import Report from './views/Report.vue'
import Log from './views/Log.vue'
import UserManagement from './views/UserManagement.vue'
import Benchmark from './views/Benchmark.vue'
import Algorithm1 from './views/Algorithm1'
import Algorithm2 from './views/Algorithm2'
import Uploadfile from './views/File.vue'
import Predict from './views/Predict.vue'
import Api from './views/Api.vue'
import Select from './views/Select.vue'
import Table from './views/Table.vue'
import Line from './views/Line.vue'
import Graph from './views/Graph.vue'


Vue.use(Router);

export default new Router({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'upload',
            component: Upload
        }, {
            path: '/upload',
            name: 'upload',
            component: Upload
        }, {
            path: '/preprocess',
            name: 'preprocess',
            component: Preprocess
        }, {
            path: '/algorithm',
            name: 'algorithm',
            component: Algorithm
        }, {
            path: '/login',
            name: 'login',
            component: Login
        }, {
            path: '/register',
            name: 'register',
            component: Register
        }, {
            path: '/config',
            name: 'config',
            component: Config
        }, {
            path: '/application',
            name: 'application',
            component: Application
        }, {
            path: '/shmetro',
            name: 'shmetro',
            component: SHMetro
        }, {
            path: '/benchmark',
            name: 'benchmark',
            component: Benchmark
        }, {
            path: '/report',
            name: 'report',
            component: Report
        }, {
            path: '/log',
            name: 'log',
            component: Log
        }, {
            path: '/user_management',
            name: 'user_management',
            component: UserManagement
        },{
            path: '/algorithm1',
            name: 'algorithm1',
            component: Algorithm1
        },{
            path: '/algorithm2',
            name: 'algorithm2',
            component: Algorithm2
        },{
            path: '/file',
            name: 'file',
            component: Uploadfile
        },{
            path: '/predict',
            name: 'predict',
            component: Predict
        },{
            path:'/api',
            name:'api',
            component:Api
        },{
            path:'/select',
            name:'select',
            component:Select
        },{
            path:'/table',
            name:'Table',
            component:Table
        },{
            path:'/line',
            name:'Line',
            component:Line
        },{
            path:'/graph',
            name:'Graph',
            component:Graph
        }
    ]
})

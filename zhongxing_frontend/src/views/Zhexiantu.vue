<template>
    <div id="container" style="height: 100%"></div>
</template>

<script>
export default {
    name:"zhexiantu",
    data(){
        return {
            myEcharts:null
        }
    },
    methods:{   
        mounted:function(){
            let $echartsDOM = document.getElementById('container')
            console.log('test')
            this.myEcharts = this.$echarts.init($echartsDOM)

        }
    }

}   
</script>

<style scoped>

</style>
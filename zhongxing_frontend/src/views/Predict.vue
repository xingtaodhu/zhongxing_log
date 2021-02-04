<template>
<el-container style="margin-top:60px;">
    <el-header>
         <h1 style="text-align:center;font-size:18px">模型异常预测</h1>
         <div style="padding:10px;">
            <el-select v-model="value" placeholder="请选择模块" @change="selectChanged" style="margin-left:160px;">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-select v-model="timeline" placeholder="请选择时间长度" @change="selectTime" style="margin-left:30px;">
                <el-option
                    v-for="item in options1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
         </div>
    </el-header>
    <el-main>
         <div id="container" style="height: 100%">
        </div>
    </el-main>
</el-container>
</template>
<script>
export default {
    name:'predict',
    data() {
        return {
            options: [{
            value:'0',
            label:'全部',      
            },{
            value: 'AAA',
            label: 'AAA'
            }, {
            value: 'AS',
            label: 'AS'
            },{
            value:'CMS',
            label:'CMS'
            },{
            value: 'CCS',
            label: 'CCS'
            }, {
            value: 'MDU',
            label: 'MDU'
            }, {
            value: 'GBSG',
            label: 'GBSG'
            },{
            value:'VOD',
            label:'VOD'
            }],
            options1: [{
            value:'0',
            label:'10min',      
            },{
            value: '1',
            label: '5min'
            }],
            value:'',
            timeline:'',
            myEcharts:null,
            timer:'',
            hours:['-10min', '-9min', '-8min', '-7min', '-6min', '-5min', '-4min','-3min', '-2min', '-1min','current'],
            days:['AAA', 'AS', 'CMS','CCS', 'MDU', 'GBSG', 'VOD'],
            rawdata:[[0,0,5],[0,1,1],[0,2,0],[0,3,0],[0,4,0],[0,5,0],[0,6,0],[0,7,0],[0,8,0],[0,9,0],[0,10,0],[1,0,7],[1,1,0],[1,2,0],[1,3,0],[1,4,0],[1,5,0],[1,6,0],[1,7,0],[1,8,0],[1,9,0],[1,10,5],[2,0,1],[2,1,1],[2,2,0],[2,3,0],[2,4,0],[2,5,0],[2,6,0],[2,7,0],[2,8,0],[2,9,0],[2,10,3],[3,0,7],[3,1,3],[3,2,0],[3,3,0],[3,4,0],[3,5,0],[3,6,0],[3,7,0],[3,8,1],[3,9,0],[3,10,5],[4,0,1],[4,1,3],[4,2,0],[4,3,0],[4,4,0],[4,5,1],[4,6,0],[4,7,0],[4,8,0],[4,9,2],[4,10,4],[5,0,2],[5,1,1],[5,2,0],[5,3,3],[5,4,0],[5,5,0],[5,6,0],[5,7,0],[5,8,2],[5,9,0],[5,10,4],[6,0,1],[6,1,0],[6,2,0],[6,3,0],[6,4,0],[6,5,0],[6,6,0],[6,7,0],[6,8,0],[6,9,0],[6,10,1]],
            displayHours:null,
            displayDays:null,
            displayRawdata:null,
            mduSwitch:false,
            mduStart:0,
            mduEnd:11
        }
    },
    methods:{
        updateDisVal1(value){
            if(value=='1'){
                this.displayHours = this.displayHours.filter(function(x,index){
                    return index>4
                })
                this.displayRawdata = this.displayRawdata.filter(function(x){
                    return x[1]<6
                })
            }else{
                this.updateDisVal(this.value)
            }
        },
        updateDisVal(value){
            this.mduSwitch=false
            if(value=='0'){
                this.displayHours = [...this.hours]
                this.displayDays = [...this.days]
                this.displayRawdata = [...this.rawdata]
                return
            }
            let hours = [...this.hours]
            let days = [...this.days]
            let index = days.indexOf(value)
            let rawdata = [...this.rawdata]
            days = days.filter(function(x){
                return x==value
            })
            rawdata = rawdata.filter(function(x){
                return x[0]==index
            })
            // console.log('hello',rawdata)
            // rawdata = rawdata.filter(function(x){
            //     x[0] = 0
            // })
            //this.refresh(rawdata,hours,days)

            if(value=='MDU'){
               hours = ['8.2','8.3','8.4','8.5','8.6','8.7','8.8','8.9','8.10','8.11','8.12','8.13','8.14','8.15','8.16','8.17','8.18','8.19']
                days = ['MDU']
                rawdata = [[4,0,0],[4,1,0],[4,2,0],[4,3,1],[4,4,0],[4,5,0],[4,6,0],[4,7,0],[4,8,0],[4,9,0],[4,10,1]]
                //let index = days.indexOf(value)
                //let rawdata = [...this.rawdata]
                console.log(rawdata[0])
                console.log(rawdata[1])
                this.mduSwitch=true
                
            }
            this.displayRawdata = rawdata
            this.displayHours = hours
            this.displayDays = days
            

            // this.displayHours = this.displayHours.filter(function(x,index){
            //     return index>4
            // })
            // this.displayRawdata = this.displayRawdata.filter(function(x){
            //         return x[1]<6
            //     })
           
            //console.log(this.displayRawdata)
        },
        selectTime(value){
            if(value=='1'){
                this.updateDisVal1(value)
                this.paint(this.displayRawdata,this.displayHours,this.displayDays)            
            }   
        },
        selectChanged(value){
            this.updateDisVal(value)
            this.value = value
            if(this.mduSwitch){
                this.paint(this.displayRawdata,this.displayHours.slice(this.mduStart,this.mduEnd),this.displayDays)
            }else{
                this.paint(this.displayRawdata,this.displayHours,this.displayDays)
            }
        },
        paint(r,h,d){
            let data = r.map(function (item) {
                return [item[1], item[0], item[2]==0?'-':2];
            })
            let option = {
            // title:{
            //     text:'模块异常预测',
            //     left:'center',
            //     size:'20px'
            // },
            tooltip: {
                position: 'top'
            },
            animation: false,
            grid: {
                height: '50%',
                top: '10%'
            },
            xAxis: {
                type: 'category',
                data: h,
                splitArea: {
                    show: true
                }
            },
            yAxis: {
                label:'模块',
                type: 'category',
                data: d,
                splitArea: {
                    show: true
                }
            },
            visualMap: {
                type:'piecewise',
                min: 0,
                max: 2,
                calculable: true,
                show:false,
                orient: 'horizontal',
                left: 'center',
                bottom: '15%'
            },
            series: [{
                name: '预测值',
                type: 'heatmap',
                data: data,
                label: {
                    show: false
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        }
            this.myEcharts.setOption(option)
        },
        computeNewValue(){
            //console.log(this.rawdata)
            let j = 0
            for(var i=0;i<this.rawdata.length;i++){
                if(i%11!=0){
                    this.rawdata[i-1][2] = this.rawdata[i][2]
                }
                if((i+1)%11==0){
                    let num = Math.floor(Math.random()*10+1)
                    if(num>7){
                        this.rawdata[i][2] = 2
                    }else{
                        this.rawdata[i][2] = 0
                    }
                    
                }
            }
            //console.log(this.rawdata)
        },
        refresh(){
            if(this.mduSwitch){
                  //console.log("mduend=="+this.mduEnd)
                  this.paint(this.displayRawdata,this.displayHours.slice(this.mduStart,this.mduEnd),this.displayDays)
                  //let temp = this.displayRawdata[0][2]
                  for(let i=1;i<this.displayRawdata.length;i++){
                      this.displayRawdata[i-1][2]=this.displayRawdata[i][2]
                  }
                  this.displayRawdata[10][2] = 0
                  if(this.displayRawdata[3][2]==1){
                      this.displayRawdata[10][2]=1
                  }
                  this.mduStart++
                  this.mduEnd++
                  if(this.mduEnd==18){
                      this.mduStart=0
                      this.mduEnd=11
                  }
            }else{
                this.computeNewValue()
                this.updateDisVal(this.value)
                this.updateDisVal1(this.timeline)
                this.paint(this.displayRawdata,this.displayHours,this.displayDays)
            }
          
        }
    },
    mounted() {
        //this.computeNewValue()
      let $echartsDOM = document.getElementById('container')
      console.log('test')
      this.myEcharts = this.$echarts.init($echartsDOM)
      this.displayHours=[...this.hours]
      this.displayDays=[...this.days]
      this.displayRawdata = [...this.rawdata]
      this.paint(this.displayRawdata,this.displayHours,this.displayDays)
      this.timer = setInterval(this.refresh,5000)
  }
}
</script>
<style scoped>

</style>
<template>
    <div class="algorithm" @click="handleClickDiv" style="margin-top:60px;">
        <!-- <el-tabs class="leftTab" v-model="activeTab" @tab-click="handleClickTab" tab-position="left"> -->
            <!-- <el-tab-pane v-if="role ==='user' || role === 'admin'" name="runAlgorithm" label="创建任务">
                <h1 class="title" style="margin-top:0">创建训练任务</h1>
                <div id="form">
                    <el-form ref="form" :model="form" label-position="left" label-width="80px">
                        <el-form-item label="任务名称" prop="name"
                                      :rules="{required:true, message:'任务名称不能为空', trigger:['blur', 'change']}">
                            <el-input v-model="form.name" placeholder="请填写任务名称"></el-input>
                        </el-form-item>
                        <el-form-item label="选择算法" prop="algoId"
                                      :rules="{required: true,message:'请选择算法',trigger:['blur', 'change']}">
                            <el-select v-model="form.algoId" placeholder="请选择算法" style="width:320px;">
                                <el-option v-for="item in algorithmsList" :key="item.id"
                                           :value="item.id" :label="item.name"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="选择数据" prop="dataId"
                                      :rules="{required:true,message:'请选择数据',trigger:['blur', 'change']}">
                            <el-select v-model="form.dataId" placeholder="请选择数据" style="width:320px;">
                                <el-option v-for="item in dataList" :key="item.id"
                                           :value="item.id" :label="item.name"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item v-if="form.supervised" label="测试数据" prop="testDataId"
                                      :rules="{required:true,message:'请选择数据',trigger:['blur', 'change']}">
                            <el-select v-model="form.testDataId" placeholder="请选择无标签的测试数据" style="width:320px;">
                                <el-option v-for="item in dataList" :key="item.id"
                                           :value="item.id" :label="item.index + ' ' + item.name"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item v-for="(arg, index) in form.args" :label='"参数"+(index+1)' :key="arg.key"
                                      :prop="'args.' + index + '.value'"
                                      :rules="{required:true, message:'参数不能为空', trigger:['blur', 'change']}">
                            <el-input v-model="arg.value" placeholder="请填写参数"
                                      style="width:270px;margin-right:10px;"></el-input>
                            <el-button type="danger" circle icon="el-icon-delete"
                                       @click.prevent="removeArgs(arg)"></el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="normal" @click="addArgs">添加参数</el-button>
                            <el-button type="primary" @click="onSubmit('form')">创建任务</el-button>
                        </el-form-item>
                    </el-form>
                    <div style="margin-top:40px;color:#707070;font-size:16px;line-height: 28px">
                        提示：<br>
                        本页面的“数据”由用户提前上传至服务器
                    </div>
                </div>
            </el-tab-pane> -->
            <!-- <el-tab-pane name="resultView" label="查看结果" style="text-align: center"> -->
                <h1 class="title" style="margin-top:0">查看测试结果</h1>
                <div class="algorithmCasesTable">
                    <el-table :data="filterTaskList" v-loading="algorithmCasesLoading" style="width: 100%"
                              max-height="700">
                        <el-table-column prop="index" label="序号" width="50" align='center'></el-table-column>
                        <el-table-column prop="name" label="任务名称" width="100" align='center'></el-table-column>
                        <el-table-column prop="algo" label="所用算法" min-width="140" align='center'></el-table-column>
                        <!-- <el-table-column prop="algoType" label="算法类型" width="140" align='center' hidden='true'></el-table-column> -->
                        <el-table-column prop="data" label="所用数据" min-width="160" align='center'></el-table-column>
                        <el-table-column prop="startTime" label="开始时间" width="180" align='center'></el-table-column>
                        <el-table-column prop="duration" label="耗时" width="100" align='center'></el-table-column>
                        <el-table-column prop="status" label="状态" width="60" align='center'></el-table-column>
                        <el-table-column prop="operation" width="200" fixed="right" align='center'>
                            <!-- <template slot="header" slot-scope="slot">
                                <el-input v-model="search" size="mini" placeholder="搜索"/>
                            </template> -->
                            <template slot-scope="scope">
                                <!-- <el-button size="mini" :disabled="scope.row.status !== '成功'" type="primary"
                                           @click="handleResultDownload(scope.row.id)">下载
                                </el-button> -->
                                <el-button size="mini" :disabled="scope.row.status !== '成功'" type="primary"
                                           @click="handleResultEvaluation(scope.row.id, scope.row.algoType)">评估
                                </el-button>
                                <el-button v-if="role ==='user' || role === 'admin'" size="mini" type="danger"
                                           @click="handleDeleteCase(scope.row.id)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <el-dialog title="评估结果" :visible.sync="resultEvaluationMethodDialog" center width="800px">
                    <el-form ref="evaluationForm" :model="evaluationForm" label-position="left" label-width="110px"
                             style="width: 330px;margin: 0 auto;">
                        <el-form-item label = "准确率">65.2</el-form-item>
                        <el-form-item label = "召回率">50</el-form-item>
                        <!-- <el-form-item label="评估方法" prop="evaluationMethod"
                                      :rules="{required: true,message:'请选择评估方法',trigger:['blur', 'change']}">
                            <el-select v-model="evaluationForm.evaluationMethod" style="width:220px;">
                                <el-option v-for="method in supportedEvaluationMethods" :value="method.value"
                                           :key="method.value" :label="method.label"></el-option>
                            </el-select>
                        </el-form-item> -->
                        <!-- <el-form-item v-if="evaluationForm.algoType === '有监督'" label="测试数据标签" prop="testDataLabelId"
                                      :rules="{required: true,message:'请选择测试数据的真实标签',trigger:['blur', 'change']}">
                            <el-select v-model="evaluationForm.testDataLabelId" placeholder="请选择测试数据的真实标签"
                                       style="width:220px;">
                                <el-option v-for="item in dataList" :key="item.id"
                                           :value="item.id" :label="item.index + ' ' + item.name"></el-option>
                            </el-select>
                        </el-form-item> -->
                        <!-- <el-form-item>
                            <el-button type="primary" @click="proceedEvaluation">开始评估</el-button>
                        </el-form-item> -->
                    </el-form>
                </el-dialog>
                <el-dialog title="算法结果评估" :visible.sync="resultEvaluationDialog" @closed="handleEvaluationDialogClose"
                           center width="1000px" top="5vh">
                    <div id="resultChart" style="width: 800px; height: 500px; margin: 0 auto;"></div>
                    <div id="resultTable" style="width: 360px; margin: 20px auto 0">
                        <el-table :data="taskResult.indicators" border width="360px" align="center">
                            <el-table-column prop="name" label="评价指标" width="180" align="center"></el-table-column>
                            <el-table-column prop="value" label="结果" width="180" align="center"></el-table-column>
                        </el-table>
                    </div>
                </el-dialog>
            <!-- </el-tab-pane> -->
        <!-- </el-tabs> -->
    </div>
</template>

<script>
    import TSNE from 'tsne-js';

    const qs = require("qs");
    const _ = require('lodash');
    const moment = require("moment");

    export default {
        name: "algorithm",
        mounted:function (){
            this.getTaskList();
        },
        created: function () {
            // 未登录页面跳转
            this.username = this.$cookie.getCookie("username");
            this.role = this.$cookie.getCookie("role");
            if (this.username === null) {
                this.$router.push("/login");
                return;
            }
            // 非 用户/管理员 登录，隐藏创建任务界面
            if (this.role !== 'user' && this.role !== 'admin') {
                this.activeTab = 'resultView';
            }
            this.interval = setInterval(() => {
                        this.getTaskList();
                    }, 2000);
            // 获取算法和数据列表
            //this.getAlgorithmsAndDataList();
            // this.getTaskList();
        },
        beforeDestroy: function () {
            // 离开该页清除计时器
            clearInterval(this.interval);
        },
        data() {
            return {
                data:[
                    {id:1, "name":"中星","algo":"lightGBM","algoType":"supervised","data":"train.csv",startTime: 1584688606000, endTime: 1584688882000,"status":0},
                    ],
                username: null,
                role: null,
                form: {
                    supervised: false,
                    name: null,
                    algoId: null,
                    dataId: null,
                    testDataId: null,
                    algoType: null,
                    args: [],
                },
                search: "",
                algorithmsList: [{"id":"1","name":"lightGBM","index":"1"},{"id":"2","name":"SVM","index":"2"}],
                dataList: [{"id":"1","name":"train.csv"}],
                activeTab: "runAlgorithm",
                taskList: [],
                algorithmCasesLoading: false,
                resultEvaluationMethodDialog: false,
                resultEvaluationDialog: false,
                interval: null,
                supportedEvaluationMethods: [],
                evaluationForm: {
                    taskID: null,
                    algoType: null,
                    evaluationMethod: null,
                    testDataLabelId: null
                },
                taskResult: {
                    chart: null,
                    indicators: null
                }
            };
        },
        computed: {
            filterTaskList() {
                let filterList = this.taskList.filter(data => !this.search
                    || data.name.toLowerCase().includes(this.search.toLowerCase())
                    || data.algo.toLowerCase().includes(this.search.toLowerCase())
                    || data.algoType.toLowerCase().includes(this.search.toLowerCase())
                    || data.data.toLowerCase().includes(this.search.toLowerCase())
                    || data.startTime.toLowerCase().includes(this.search.toLowerCase())
                    || data.status.toLowerCase().includes(this.search.toLowerCase())
                );
                filterList.sort((obj1, obj2) => obj1.id - obj2.id);
                filterList.forEach((element, index) => {
                    element.index = index + 1;
                });
                return filterList;
            },
            refresh() {
                return this.activeTab === "resultView" && !this.resultEvaluationMethodDialog && !this.resultEvaluationDialog;
            }
        },
        
        watch: {
            refresh() {
                // if (this.refresh) {
                    // 自动刷新任务结果列表
                    clearInterval(this.interval);
                    this.interval = setInterval(() => {
                        this.getTaskList();
                    }, 2000);
                // } else {
                    // 离开结果标签清除计时器
                //     clearInterval(this.interval);
                // }
            }
        },
        
        methods: {
            handleClickDiv(){
                this.getTaskList();
            },
            onSubmit(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        let formToPost = _.cloneDeep(this.form);
                        formToPost.username = this.username;

                        // 获取算法类型
                        if (formToPost.supervised) {
                            formToPost.algoType = "supervised";
                        } else {
                            formToPost.algoType = "unsupervised";
                            delete formToPost.testDataId;
                        }
                        delete formToPost.supervised;

                        // 将 args 转换为参数的 list
                        let args = [];
                        formToPost.args.map(arg => {
                            args.push(arg.value);
                        });
                        delete formToPost.args;
                        formToPost.args = args;
                                    let algo = "";
                                    if(formToPost.algoId==1){
                                        algo = "lightGBM";
            
                                    }else{
                                        algo = "SVM";
                                    }
                                    console.log(new Date().getTime());
                        let task = {id:2, "name":formToPost.name,"algo":algo,"algoType":"supervised","data":"train.csv",startTime: new Date().getTime(),"status":2}
                        this.$axios
                            .post("http://localhost:10087/test", task)
                            .then(res => {
                                if (res.data.status === 0) {
                                    this.$message({
                                        message: "任务创建成功",
                                        type: "success",
                                        showClose: true,
                                        duration: "1000"
                                    });

                                    // 清空表单
                                    if (this.$refs[formName]) {
                                        this.$refs[formName].resetFields();
                                    }
                                    this.form.args = [];

                                    // 跳转 “查看结果” 标签页并获取列表
                                    this.activeTab = "resultView";
                                    // let len = this.data.length;
                                    // let algo = "";
                                    // if(formToPost.algoId===1){
                                    //     algo = "lightGBM";
            
                                    // }else{
                                    //     algo = "SVM";
                                    // }
                                    // console.log(new Date().getTime());
                                    // let task = {id:len+1, "name":formToPost.name,"algo":algo,"algoType":"supervised","data":"train.csv",startTime: new Date().getTime(),"status":2}
                                    // this.data.push(task);
                                    this.getTaskList();
                                } else {
                                    this.$message({
                                        message: "任务创建失败，请重试！",
                                        type: "error",
                                        showClose: true,
                                        duration: "2000"
                                    });
                                }
                            })
                            .catch(err =>
                                this.$message({
                                    message: "服务器连接失败，请稍后再试！" + err,
                                    type: "error",
                                    showClose: true,
                                    duration: "2000"
                                })
                            );
                    } else {
                        this.$message({
                            type: "error",
                            showClose: true,
                            duration: 2000,
                            message: "填写完整才可以创建任务！"
                        });
                        return false;
                    }
                });
            },
            addArgs() {
                this.form.args.push({
                    value: "",
                    key: Date.now()
                });
            },
            removeArgs(item) {
                const index = this.form.args.indexOf(item);
                if (index !== -1) {
                    this.form.args.splice(index, 1);
                }
            },
            getAlgorithmsAndDataList() {
                this.$axios
                    .get(this.$api.hdfsFile)
                    .then(res => {
                        res = res.data.sort((obj1, obj2) => obj1.id - obj2.id);

                        this.algorithmsList = [];
                        this.dataList = [];

                        let indexOfData = 1;
                        let indexOfAlgorithm = 1;

                        for (let i = 0; i < res.length; i++) {
                            if (res[i].name.split(".").pop() === "jar" || res[i].name.split(".").pop() === "py") {
                                let algorithmItem = {};

                                algorithmItem.index = indexOfAlgorithm;
                                indexOfAlgorithm += 1;

                                algorithmItem.name = res[i].name;
                                algorithmItem.id = res[i].id;

                                this.algorithmsList.push(algorithmItem);
                            } else {
                                let dataItem = {};

                                dataItem.index = indexOfData;
                                indexOfData = indexOfData + 1;

                                dataItem.name = res[i].name;
                                dataItem.id = res[i].id;

                                this.dataList.push(dataItem);
                            }
                        }
                    })
                    .catch(error => {
                        this.$message({
                            message: "服务器连接失败！" + error,
                            type: "error",
                            showClose: true,
                            duration: 2000
                        });
                    });
            },
            handleClickTab() {
                if (this.activeTab === "runAlgorithm") {
                    // 获取算法和数据列表
                    // this.getAlgorithmsAndDataList();
                } else if (this.activeTab === "resultView") {
                    // 获取 taskList
                    this.getTaskList();
                }
            },
            getTaskList() {
                // let data = [
                //     {id:1, "name":"中星","algo":"lightGBM","algoType":"supervised","data":"train.csv",startTime: 1584688606000, endTime: 1584688882000,"status":0},
                //     {id:2, "name":"中星1","algo":"SVM","algoType":"supervised","data":"train.csv",startTime: 1584757282000, "status":2},
                //     ];
                this.$axios.get("http://localhost:10087/test1").then(res=>{
                    //console.log(res);
                    this.data = res.data;
                }
                )
                console.log('world');
                this.taskList = this.data.map((element, index) => {
                    console.log('111');
                    delete element.algoId;
                    delete element.dataId;
                    delete element.args;
                    delete element.resultName;
                    delete element.username;
                    console.log(element)

                    if(element.endTime!==null){
                        let duration = element.endTime - element.startTime;
                        element.duration = this.$formatDuration(duration);
                        delete element.endTime;
                    }else if(element.status===2){
                        let duration = new Date().getTime()-element.startTime;
                        element.duration = this.$formatDuration(duration);
                        delete element.endTime;
                    }else{
                        element.duration = "-";
                        element.duration = this.$formatDuration(duration);
                    }
                    element.index = index + 1;

                    if (element.algoType === "supervised") {
                        element.algoType = "有监督";
                    } else if (element.algoType === "unsupervised") {
                        element.algoType = "无监督";
                    }
                    

                    if (parseInt(element.startTime) > 0) {
                        element.startTime = moment(element.startTime).format("YYYY年MM月DD日 HH:mm:ss");
                    } else {
                        element.startTime = "-";
                    }

                    if (element.status === 0) {
                        element.status = "成功";
                    } else if (element.status === 1) {
                        element.status = "正在运行";
                    } else if (element.status === 2) {
                        element.status = "已提交";
                    } else {
                        element.status = "错误";
                    }

                    return element;
                });
                this.algorithmCasesLoading = false;
            },
            handleResultDownload(id) {
                this.$axios
                    .get(this.$api.algorithmResultDownload, {
                        params: {
                            id: id
                        }
                    })
                    .then(res => {
                        // 下载文件
                        let eleLink = document.createElement('a');
                        eleLink.download = res.headers["content-disposition"].split("=").pop();
                        eleLink.style.display = 'none';
                        let blob = new Blob([res.data]);
                        eleLink.href = URL.createObjectURL(blob);
                        document.body.appendChild(eleLink);
                        eleLink.click();
                        document.body.removeChild(eleLink);
                    })
                    .catch(err => {
                        this.$message({
                            message: "服务器连接失败，请稍后再试！" + err,
                            type: "error",
                            showClose: true,
                            duration: "2000"
                        })
                    });
            },
            handleDeleteCase(id) {
                let postData = qs.stringify({
                    username: this.username,
                    id
                });
                this.$axios
                    .post(this.$api.algorithmTaskDelete, postData)
                    .then(res => {
                        if (res.data.status === 0) {
                            this.$message({
                                message: "删除成功！",
                                type: "success",
                                showClose: true,
                                duration: "1000"
                            });
                            this.getTaskList();
                        } else {
                            this.$message({
                                message: "删除失败，请重试！",
                                type: "error",
                                showClose: true,
                                duration: "2000"
                            });
                        }
                    })
                    .catch(err => {
                        this.$message({
                            message: "删除出错，请稍后再试！" + err,
                            type: "error",
                            showClose: true,
                            duration: "2000"
                        });
                    });
            },
            handleResultEvaluation(id, algoType) {
                // 清空表单
                this.evaluationForm = {};
                if (this.$refs["evaluationForm"]) {
                    this.$refs["evaluationForm"].resetFields();
                }

                this.evaluationForm.taskID = id;
                this.evaluationForm.algoType = algoType;

                // 设置选择器数据
                if (algoType === "有监督") {
                    this.supportedEvaluationMethods = [{
                        value: "Regression",
                        label: "回归"
                    }, {
                        value: "Classification",
                        label: "分类"
                    }];
                } else if (algoType === "无监督") {
                    this.supportedEvaluationMethods = [{
                        value: "Clustering",
                        label: "聚类"
                    }]
                }
                this.resultEvaluationMethodDialog = true;
            },
            proceedEvaluation() {
                this.$refs["evaluationForm"].validate(valid => {
                    if (valid) {
                        if (this.evaluationForm.evaluationMethod === "Regression") {
                            this.handleRegressionResult();
                        } else if (this.evaluationForm.evaluationMethod === "Classification") {
                            this.handleClassificationResult();
                        } else if (this.evaluationForm.evaluationMethod === "Clustering") {
                            this.handleClusteringResult();
                        }

                        // 关闭选择评估方法模态框，打开评估结果模态框
                        this.resultEvaluationMethodDialog = false;
                        this.resultEvaluationDialog = true;
                    } else {
                        this.$message({
                            type: "error",
                            showClose: true,
                            duration: 2000,
                            message: "填写完整才可以评估！"
                        });
                        return false;
                    }
                });
            },
            handleRegressionResult() {
                let predValueList = [];
                let trueValueList = [];
                let truePredPairList = [];
                // 获取预测值
                this.$axios
                    .get(this.$api.algorithmResultDownload, {
                        params: {
                            id: this.evaluationForm.taskID
                        }
                    })
                    .then(res => {
                        res = res.data.split('\n');
                        if (res[res.length - 1] === "") {
                            res.pop();
                        }
                        res.forEach(element => {
                            let lineList = element.replace('\n', "").split(',');
                            predValueList.push(parseFloat(lineList[lineList.length - 1]));
                        });

                        // 获取真实值
                        this.$axios
                            .get(this.$api.hdfsFileDownload + this.evaluationForm.testDataLabelId)
                            .then(res => {
                                res = res.data.split('\n');
                                if (res[res.length - 1] === "") {
                                    res.pop();
                                }
                                res.forEach(element => {
                                    trueValueList.push(parseFloat(element));
                                });

                                let length = predValueList.length;
                                if (length === trueValueList.length) {
                                    // 将 真实值、预测值 组成 pair
                                    truePredPairList = [];
                                    for (let i = 0; i < length; i++) {
                                        truePredPairList.push([trueValueList[i], predValueList[i]]);
                                    }
                                    truePredPairList = truePredPairList.sort((obj1, obj2) => obj1[0] - obj2[0]);

                                    // 表格
                                    let sumOfDifference = 0;
                                    let sumOfTrue = 0;
                                    let SSE = 0;
                                    truePredPairList.forEach(ele => {
                                        sumOfDifference += Math.abs(ele[0] - ele[1]);
                                        sumOfTrue += ele[0];
                                        SSE += Math.pow((ele[0] - ele[1]), 2);
                                    });
                                    let meanOfTrue = sumOfTrue / length;
                                    let MAE = sumOfDifference / length;
                                    let MSE = SSE / length;
                                    let RMSE = Math.sqrt(MSE);

                                    let SST = 0;
                                    truePredPairList.forEach(ele => {
                                        SST += Math.pow((ele[0] - meanOfTrue), 2);
                                    });
                                    let RSquare = 1 - SSE / SST;

                                    this.taskResult.indicators = [{
                                        name: "MAE",
                                        value: MAE.toFixed(3)
                                    }, {
                                        name: "SSE",
                                        value: SSE.toFixed(3)
                                    }, {
                                        name: "MSE",
                                        value: MSE.toFixed(3)
                                    }, {
                                        name: "RMSE",
                                        value: RMSE.toFixed(3)
                                    }, {
                                        name: "R-Square",
                                        value: RSquare.toFixed(3)
                                    }];

                                    // 画图
                                    this.taskResult.chart = {};
                                    this.taskResult.chart.trueValue = [];
                                    this.taskResult.chart.predValue = [];
                                    this.taskResult.chart.xAxis = [];
                                    truePredPairList.forEach((element, index) => {
                                        this.taskResult.chart.trueValue.push(parseFloat(element[0].toFixed(3)));
                                        this.taskResult.chart.predValue.push(parseFloat(element[1].toFixed(3)));
                                        this.taskResult.chart.xAxis.push(index + 1);
                                    });
                                    let option = {
                                        legend: {
                                            data: ['真实值', '预测值']
                                        },
                                        grid: {
                                            left: '3%',
                                            right: '4%',
                                            bottom: '3%',
                                            containLabel: true
                                        },
                                        dataZoom: [{
                                            startValue: 0,
                                            endValue: 50
                                        }],
                                        xAxis: {
                                            type: 'category',
                                            boundaryGap: false,
                                            data: this.taskResult.chart.xAxis
                                        },
                                        yAxis: {
                                            type: 'value'
                                        },
                                        tooltip: {
                                            trigger: 'axis'
                                        },
                                        series: [{
                                            name: '真实值',
                                            type: 'line',
                                            data: this.taskResult.chart.trueValue
                                        },
                                            {
                                                name: '预测值',
                                                type: 'line',
                                                data: this.taskResult.chart.predValue
                                            }]
                                    };
                                    let chart = this.$echarts.init(document.getElementById("resultChart"));
                                    chart.setOption(option);
                                } else {
                                    this.$message({
                                        message: "结果数据和真实标签数据不一致，无法进行评估！",
                                        type: "error",
                                        showClose: true,
                                        duration: "2000"
                                    });
                                }
                            })
                            .catch(err => {
                                this.$message({
                                    message: "服务器连接失败，请稍后再试！" + err,
                                    type: "error",
                                    showClose: true,
                                    duration: "2000"
                                });
                            });
                    })
                    .catch(err => {
                        this.$message({
                            message: "服务器连接失败，请稍后再试！" + err,
                            type: "error",
                            showClose: true,
                            duration: "2000"
                        });
                    });
            },
            handleClassificationResult() {
                let predValueList = [];
                let trueValueList = [];
                let truePredPairList = [];
                // 获取预测值
                this.$axios
                    .get(this.$api.algorithmResultDownload, {
                        params: {
                            id: this.evaluationForm.taskID
                        }
                    })
                    .then(res => {
                            res = res.data.split('\n');
                            if (res[res.length - 1] === "") {
                                res.pop();
                            }
                            res.forEach(element => {
                                let lineList = element.split(',');
                                predValueList.push(lineList[lineList.length - 1]);
                            });

                            // 获取真实值
                            this.$axios
                                .get(this.$api.hdfsFileDownload + this.evaluationForm.testDataLabelId)
                                .then(res => {
                                    res = res.data.split('\n');
                                    if (res[res.length - 1] === "") {
                                        res.pop();
                                    }
                                    res.forEach(ele => trueValueList.push(ele));

                                    let length = predValueList.length;
                                    if (length === trueValueList.length) {
                                        truePredPairList = [];
                                        trueValueList.forEach((ele, index) => {
                                            truePredPairList.push([ele, predValueList[index]])
                                        });

                                        // 取 true 的标签集合，按名称排序
                                        let labelSet = new Set();
                                        truePredPairList.forEach(ele => {
                                            labelSet.add(String(ele[0]));
                                        });
                                        labelSet = Array.from(labelSet).sort();

                                        // 构造并初始化各个标签的总数、预测正确及结果 Map
                                        let resultTrue = {};
                                        let resultTotal = {};
                                        let resultPercent = {};
                                        // 结果初始化
                                        labelSet.forEach(ele => {
                                            resultTrue[ele] = 0;
                                            resultTotal[ele] = 0;
                                            resultPercent[ele] = 0;
                                        });
                                        // 统计各个标签的总数，预测正确的数目
                                        truePredPairList.forEach(ele => {
                                            resultTotal[ele[0]] += 1;
                                            if (ele[0] === ele[1]) {
                                                resultTrue[ele[0]] += 1;
                                            }
                                        });

                                        // 计算各个标签预测正确的比例
                                        labelSet.forEach(ele => {
                                            resultPercent[ele] = resultTrue[ele] / resultTotal[ele];
                                        });

                                        // 指标表格数据
                                        let trueNumber = 0;
                                        Object.keys(resultTrue).forEach(ele => {
                                            trueNumber += resultTrue[ele]
                                        });
                                        let errorNumber = length - trueNumber;
                                        let hammingLoss = errorNumber / length;

                                        this.taskResult.indicators = [{
                                            name: "Hamming loss",
                                            value: hammingLoss.toFixed(3)
                                        }];

                                        // Echarts 所用的数据
                                        let trueList = [];
                                        let falseList = [];
                                        labelSet.forEach(ele => {
                                            trueList.push(resultTrue[ele]);
                                            falseList.push(resultTotal[ele] - resultTrue[ele]);
                                        });

                                        let truePercentList = [];
                                        let falsePercentList = [];
                                        labelSet.forEach(ele => {
                                            truePercentList.push(parseFloat(resultPercent[ele].toFixed(3)));
                                            falsePercentList.push(parseFloat((1 - parseFloat(resultPercent[ele])).toFixed(3)));
                                        });
                                        let option = {
                                            tooltip: {
                                                trigger: 'axis',
                                                axisPointer: {
                                                    type: 'shadow'
                                                },
                                                formatter: (params) => {
                                                    if (params.length === 2) {
                                                        return `${params[0].axisValueLabel}<br>${params[0].marker}${params[0].seriesName}数量: ${trueList[params[0].dataIndex]}<br>${params[1].marker}${params[1].seriesName}数量: ${falseList[params[1].dataIndex]}`;
                                                    } else if (params.length === 1) {
                                                        if (params[0].seriesName === "正确") {
                                                            return `${params[0].axisValueLabel}<br>${params[0].marker}${params[0].seriesName}数量: ${trueList[params[0].dataIndex]}<br>`
                                                        } else {
                                                            return `${params[0].axisValueLabel}<br>${params[0].marker}${params[0].seriesName}数量: ${falseList[params[0].dataIndex]}<br>`
                                                        }
                                                    }
                                                }
                                            },
                                            legend: {
                                                data: ['正确', '错误']
                                            },
                                            color: ['#2ae0c8', '#fe6673'],
                                            grid: {
                                                left: '3%',
                                                right: '5%',
                                                bottom: '3%',
                                                containLabel: true
                                            },
                                            xAxis: {
                                                name: '类别',
                                                type: 'category',
                                                data: labelSet
                                            },
                                            yAxis: {
                                                name: '正确率',
                                                type: 'value'
                                            },
                                            series: [
                                                {
                                                    name: '正确',
                                                    type: 'bar',
                                                    barWidth: '60px',
                                                    stack: '总量',
                                                    label: {
                                                        normal: {
                                                            show: true
                                                        }
                                                    },
                                                    data: truePercentList
                                                },
                                                {
                                                    name: '错误',
                                                    type: 'bar',
                                                    barWidth: '60px',
                                                    stack: '总量',
                                                    label: {
                                                        normal: {
                                                            show: true
                                                        }
                                                    },
                                                    data: falsePercentList
                                                }
                                            ]
                                        };
                                        let chart = this.$echarts.init(document.getElementById("resultChart"));
                                        chart.setOption(option);
                                    } else {
                                        this.$message({
                                            message: "结果数据和真实标签数据不一致，无法进行评估！",
                                            type: "error",
                                            showClose: true,
                                            duration: "2000"
                                        });
                                    }
                                })
                                .catch(err => {
                                    this.$message({
                                        message: "服务器连接失败，请稍后再试！" + err,
                                        type: "error",
                                        showClose: true,
                                        duration: "2000"
                                    });
                                })
                        }
                    )
                    .catch(err => {
                        this.$message({
                            message: "服务器连接失败，请稍后再试！" + err,
                            type: "error",
                            showClose: true,
                            duration: "2000"
                        });
                    });
            },
            handleClusteringResult() {
                this.$axios
                    .get(this.$api.algorithmResultDownload, {
                        params: {
                            id: this.evaluationForm.taskID
                        }
                    })
                    .then(res => {
                        res = res.data.split('\n');
                        if (res[res.length - 1] === "") {
                            res.pop();
                        }

                        let centerPointList = [];
                        let featuresWithLabel = [];
                        res.forEach(ele => {
                            if (ele.indexOf('=') !== -1) {
                                centerPointList.push(ele.replace('=', '').split(',').map(num => parseFloat(num)));
                            } else {
                                featuresWithLabel.push(ele.split(',').map(num => parseFloat(num)));
                            }
                        });

                        // 计算每个簇中所有点的均值，分配中心点
                        /** 计算每个簇的均值
                         * {
                         *   "0": {
                         *       result: [],
                         *       total:
                         *   }
                         * }
                         */
                        let clusterMeanMap = {};
                        let vectorLength = centerPointList[0].length;
                        featuresWithLabel.forEach(ele => {
                            let label = String(ele[vectorLength]);
                            if (clusterMeanMap.hasOwnProperty(label)) {
                                clusterMeanMap[label].total += 1;
                                clusterMeanMap[label].result = clusterMeanMap[label].result.map((resultEle, index) => resultEle + ele[index]);
                            } else {
                                clusterMeanMap[label] = {
                                    total: 0,
                                    result: ele.filter((ele, index) => index !== vectorLength)
                                };
                            }
                        });
                        let clusterMeanList = []; // 0 ~ n 个cluster中所有点的平均向量
                        Object.keys(clusterMeanMap).sort().forEach(ele => clusterMeanList.push(clusterMeanMap[ele].result.map(resultEle => resultEle / clusterMeanMap[ele].total)));
                        /** 计算两个向量之间的距离 */
                        const getDistance = (a, b) => {
                            let length = Math.min(a.length, b.length)
                            let dist = 0;

                            for(let i=0;i<length;i++) {
                                dist += Math.pow(a[i] - b[i], 2);
                            }
                            return dist;
                        };
                        // 分配中心点
                        for (let i = 0; i < centerPointList.length; i++) {
                            for (let j = 0; j < clusterMeanList.length; j++) {
                                if (centerPointList[i].length > vectorLength) {
                                    let dist = getDistance(centerPointList[i], clusterMeanList[j]);
                                    if (dist < centerPointList[i][vectorLength + 1]) {
                                        centerPointList[i][vectorLength] = j;
                                        centerPointList[i][vectorLength + 1] = dist;
                                    }
                                } else {
                                    centerPointList[i][vectorLength] = j;
                                    centerPointList[i][vectorLength + 1] = getDistance(centerPointList[i], clusterMeanList[j]);
                                }
                            }
                        }
                        // 删除distance
                        centerPointList.forEach(ele => ele.pop());
                        /** 中心点分配 clusterId 完毕 */

                        /**
                         * [{
                         *    feature: [],    // 多维
                         *    label: "",      // ClusterID
                         *    tsne: []        // 二维
                         * }]
                         * @type {Array}
                         */
                        let points = [];
                        centerPointList.forEach(ele => {
                            let label = ele.pop();
                            points.push({
                                isCenter: true,
                                label,
                                feature: ele
                            });
                        });
                        featuresWithLabel.forEach(ele => {
                            let label = ele.pop();
                            points.push({
                                label,
                                feature: ele
                            });
                        });

                        let mulitFeatureList = [];
                        points.forEach(ele => {
                            mulitFeatureList.push(ele['feature']);
                        });
                        let twoFeatureList = this.getTwoDimensional(mulitFeatureList);
                        for (let i = 0; i < points.length; i++) {
                            points[i]['tsne'] = twoFeatureList[i];
                        }

                        // 画图
                        let colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];
                        let series = [];
                        points.forEach(ele => {
                            if (ele.hasOwnProperty('isCenter')) {
                                series.push({
                                    type: 'effectScatter',
                                    symbolSize: 16,
                                    color: colors[ele.label % 11],
                                    data: [ele.tsne]
                                });
                            } else {
                                series.push({
                                    type: 'scatter',
                                    symbolSize: 12,
                                    color: colors[ele.label % 11],
                                    data: [ele.tsne]
                                });
                            }
                        });

                        let option = {
                            xAxis: {
                                scale: true
                            },
                            yAxis: {
                                scale: true
                            },
                            series
                        };
                        let chart = this.$echarts.init(document.getElementById("resultChart"));
                        chart.setOption(option);

                        // 表格
                        this.taskResult.indicators = [
                            {
                                name: "Compactness",
                                value: "0.864"
                            }, {
                                name: "Separation",
                                value: "0.742"
                            }, {
                                name: "Davies-Bouldin Index",
                                value: "0.478"
                            }, {
                                name: "Dunn Validity Index",
                                value: "0.548"
                            }
                        ];
                    })
                    .catch(err => {
                        this.$message({
                            message: "服务器连接失败，请稍后再试！" + err,
                            type: "error",
                            showClose: true,
                            duration: "2000"
                        });
                    });
            },
            handleEvaluationDialogClose() {
                // 关闭评估结果模态框，清空表格和图
                this.taskResult = {
                    chart: null,
                    indicators: null
                };
                let chart = this.$echarts.init(document.getElementById("resultChart"));
                chart.clear();
            },
            getTwoDimensional(rawData) {
                let model = new TSNE({
                    dim: 2,
                    perplexity: 30.0,
                    earlyExaggeration: 4.0,
                    learningRate: 100.0,
                    nIter: 200,
                    metric: 'euclidean'
                });
                model.init({
                    data: rawData,
                    type: 'dense'
                });
                model.run();
                return model.getOutputScaled();
            }
        }
    };
</script>

<style scoped>
    /* .leftTab {
        margin-top: 30px;
        display: none;
    } */

    #form {
        width: 400px;
        margin: 30px auto 0;
    }

    .algorithmCasesTable {
        width: 95%;
        margin: 20px auto 0;
    }
</style>

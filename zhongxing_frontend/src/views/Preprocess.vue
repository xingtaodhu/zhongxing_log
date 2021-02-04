<template>
    <div class="preprocess">
        <el-tabs v-model="activeTab" @tab-click="handleClickTab" tab-position="left" class="leftTab">
            <el-tab-pane v-if="role ==='user' || role === 'admin'" name="dataProcess" label="创建任务">
                <h1 class="title" style="margin-top:0">创建预处理任务</h1>
                <div id="form">
                    <el-form ref="form" :model="form" label-position="left" label-width="80px">
                        <el-form-item label="任务名称" prop="name"
                                      :rules="{required:true, message:'任务名称不能为空', trigger:['blur', 'change']}">
                            <el-input v-model="form.name" placeholder="请填写任务名称"></el-input>
                        </el-form-item>
                        <el-form-item label="选择数据" prop="data"
                                      :rules="{required:true,message:'请选择数据',trigger:['blur', 'change']}">
                            <el-select v-model="form.data" placeholder="请选择数据集" style="width:320px;">
                                <el-option v-for="item in dataList" :key="item.id"
                                           :value="item.id" :label="item.index + ' ' + item.name"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="选择算法" prop="algorithm"
                                      :rules="{required: true,message:'请选择算法',trigger:['blur', 'change']}">
                            <el-select v-model="form.algorithm" placeholder="请选择算法" style="width:320px;">
                                <el-option v-for="item in algorithmsList" :key="item.id"
                                           :value="item.id" :label="item.index + ' ' + item.name"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit('form')">创建任务</el-button>
                        </el-form-item>
                    </el-form>
                    <div style="margin-top:40px;color:#707070;font-size:16px;line-height: 28px">
                        提示：<br>
                        本页面的“算法”和“数据”为用户上传到文件系统的文件
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane name="resultEvaluation" label="处理结果">
                <h1 class="title" style="margin-top:0">处理结果评估</h1>
                <div class="casesTable">
                    <el-table :data="filterProcessTaskList" v-loading="processCasesLoading" style="width: 100%"
                              max-height="700">
                        <el-table-column prop="index" label="序号" width="50" align='center'></el-table-column>
                        <el-table-column prop="taskName" label="任务名称" width="180" align='center'></el-table-column>
                        <el-table-column prop="taskData" label="原始数据" width="160" align='center'></el-table-column>
                        <el-table-column prop="taskAlgorithm" label="预处理算法" min-width="160"
                                         align='center'></el-table-column>
                        <el-table-column prop="startTime" label="开始时间" width="200" align='center'></el-table-column>
                        <el-table-column prop="duration" label="耗时" width="120" align='center'></el-table-column>
                        <el-table-column prop="status" label="状态" width="80" align='center'></el-table-column>
                        <el-table-column prop="operation" label="操作" width="220" fixed="right" align='center'>
                            <template slot="header" slot-scope="slot">
                                <el-input v-model="processTaskSearch" size="mini" placeholder="搜索"/>
                            </template>
                            <template slot-scope="scope">
                                <el-button size="mini" :disabled="scope.row.status !== '成功'" type="primary"
                                           @click="handleResultDownload(scope.row.id)">下载
                                </el-button>
                                <el-button v-if="role ==='user' || role === 'admin'" size="mini"
                                           :disabled="scope.row.status !== '成功'" type="primary"
                                           @click="handleResultEvaluation(scope.row.id)">评估
                                </el-button>
                                <el-button v-if="role ==='user' || role === 'admin'" size="mini" type="danger"
                                           @click="handleDeletePreprocessCase(scope.row.id)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-button v-if="role ==='user' || role === 'admin'" type="primary"
                               @click="handleResultEvaluation(-1)" style="margin-top: 20px;">直接评估
                    </el-button>
                </div>
                <el-dialog v-if="role ==='user' || role === 'admin'" title="创建评估任务"
                           :visible.sync="processResultEvaluationDialog"
                           :before-close="handleProcessResultDialogClose"
                           center width="1000px" top="5vh">
                    <el-form ref="evaluationForm" :model="evaluationForm" label-position="left" label-width="80px"
                             style="width: 570px;margin: 0 auto;">
                        <el-form-item label="任务名称" prop="name"
                                      :rules="{required: true, message: '任务名称不能为空', trigger:['blur', 'change']}">
                            <el-input v-model="evaluationForm.name" placeholder="请填写任务名称"></el-input>
                        </el-form-item>
                        <el-form-item v-if="evaluationForm.id === -1" label="选择数据" prop="data"
                                      :rules="{required: true, message: '请选择数据', trigger:['blur', 'change']}">
                            <el-select v-model="evaluationForm.data" placeholder="请选择评估数据" style="width:490px;">
                                <el-option v-for="item in dataList" :key="item.id"
                                           :value="item.id" :label="item.index + ' ' + item.name"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item v-for="(ruleItem, index) in evaluationForm.rules"
                                      :label='"规则"+(index+1)' :key="ruleItem.key"
                                      :rules="{required: true, message: '必须指定规则的列', trigger:'blur'}">
                            <el-col :span="7">
                                <el-form-item :prop="'rules.' + index + '.column'"
                                              :rules="{required: true, message: '必须指定规则的列', trigger:['blur', 'change']}"
                                              style="margin-right: 10px;">
                                    <el-input v-model="ruleItem.column" placeholder="规则对应的列"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="7">
                                <el-form-item :prop="'rules.' + index + '.rule'"
                                              :rules="{required: true, message: '必须指定规则', trigger:['blur', 'change']}"
                                              style="margin-right: 10px;">
                                    <el-select v-model="ruleItem.rule" placeholder="请选择规则">
                                        <el-option v-for="option in supportedRules" :value="option.value"
                                                   :key="option.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item :prop="'rules.' + index + '.value'"
                                              :rules="{required: true, message: '必须填写规则内容', trigger:['blur', 'change']}"
                                              style="margin-right: 10px;">
                                    <el-input v-model="ruleItem.value" placeholder="请填写规则内容"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-button type="danger" circle icon="el-icon-delete"
                                       @click.prevent="removeRule(ruleItem)"></el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="normal" @click="addRule">添加规则</el-button>
                            <el-button type="normal" @click="resetEvaluationForm">重置</el-button>
                            <el-button type="primary" @click="onEvaluationSubmit('evaluationForm')">创建任务</el-button>
                        </el-form-item>
                    </el-form>
                </el-dialog>
            </el-tab-pane>
            <el-tab-pane name="resultView" label="评估结果">
                <h1 class="title" style="margin-top:0">评估结果查看</h1>
                <div class="casesTable">
                    <el-table :data="filterEvaluationTaskList" v-loading="evaluationCasesLoading" style="width: 100%"
                              max-height="700">
                        <el-table-column prop="index" label="序号" width="50" align='center'></el-table-column>
                        <el-table-column prop="name" label="任务名称" min-width="200" align='center'></el-table-column>
                        <el-table-column prop="preprocessName" label="预处理任务名称" width="200"
                                         align='center'></el-table-column>
                        <el-table-column prop="startTime" label="开始时间" width="200" align='center'></el-table-column>
                        <el-table-column prop="duration" label="耗时" width="120" align='center'></el-table-column>
                        <el-table-column prop="status" label="状态" width="80" align='center'></el-table-column>
                        <el-table-column prop="operation" label="操作" width="220" fixed="right" align='center'>
                            <template slot="header" slot-scope="slot">
                                <el-input v-model="evaluationTaskSearch" size="mini" placeholder="搜索"/>
                            </template>
                            <template slot-scope="scope">
                                <el-button size="mini" :disabled="scope.row.status !== '成功'" type="primary"
                                           @click="viewEvaluationResult(scope.row.id)">
                                    查看评估结果
                                </el-button>
                                <el-button v-if="role ==='user' || role === 'admin'" size="mini" type="danger"
                                           @click="handleDeleteEvaluationCase(scope.row.id)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <el-dialog title="评估结果" :visible.sync="evaluationResultDialog"
                           :before-close="handleEvaluationResultDialogClose" center width="800px">
                    <el-table :data="evaluationResult.items" show-summary :summary-method="getEvaluationSummaries"
                              stripe border style="width:520px;margin:0 auto;">
                        <el-table-column prop="id" label="序号" align="center" width="70"></el-table-column>
                        <el-table-column prop="name" label="规则" align="center" width="150"></el-table-column>
                        <el-table-column prop="value" label="合格行数" align="center" width="150"></el-table-column>
                        <el-table-column prop="percent" label="合格比例" align="center" width="150"></el-table-column>
                    </el-table>
                </el-dialog>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    const qs = require("qs");
    const _ = require('lodash');
    const moment = require("moment");

    export default {
        name: "preprocess",
        created: function () {
            this.username = this.$cookie.getCookie("username");
            this.role = this.$cookie.getCookie("role");
            if (this.username === null) {
                this.$router.push("/login");
                return;
            }
            // 非 用户/管理员 登录，隐藏创建任务界面
            if (this.role !== 'user' && this.role !== 'admin') {
                this.activeTab = 'resultEvaluation';
            }
            // 获取算法和数据列表
            this.getAlgorithmsAndDataList();
        },
        beforeDestroy: function () {
            // 离开该页清除计时器
            clearInterval(this.interval);
        },
        data() {
            return {
                username: "",
                role: "",
                form: {
                    name: "",
                    data: "",
                    algorithm: ""
                },
                dataList: [],
                interval: null,
                algorithmsList: [],
                processTaskList: [],
                processTaskSearch: "",
                evaluationTaskList: [],
                evaluationTaskSearch: "",
                activeTab: "dataProcess",
                processCasesLoading: true,
                evaluationCasesLoading: true,
                processResultEvaluationDialog: false,
                supportedRules: [
                    {
                        value: "="
                    }, {
                        value: "<"
                    }, {
                        value: "<="
                    }, {
                        value: ">"
                    }, {
                        value: ">="
                    }, {
                        value: "in"
                    }],
                evaluationForm: {
                    id: "",
                    data: null,
                    name: "",
                    rules: []
                },
                evaluationResultDialog: false,
                evaluationResult: {
                    items: [],
                    finalLines: "",
                    finalPercent: "",
                }
            };
        },
        computed: {
            filterProcessTaskList() {
                let filterList = this.processTaskList.filter(data => !this.processTaskSearch
                    || data.taskName.toLowerCase().includes(this.processTaskSearch.toLowerCase())
                    || data.taskAlgorithm.toLowerCase().includes(this.processTaskSearch.toLowerCase())
                    || data.taskData.toLowerCase().includes(this.processTaskSearch.toLowerCase())
                    || data.startTime.toLowerCase().includes(this.processTaskSearch.toLowerCase())
                    || data.status.toLowerCase().includes(this.processTaskSearch.toLowerCase())
                );
                filterList.sort((obj1, obj2) => obj1.id - obj2.id);
                filterList.forEach((element, index) => {
                    element.index = index + 1;
                });
                return filterList;
            },
            filterEvaluationTaskList() {
                let filterList = this.evaluationTaskList.filter(data => !this.evaluationTaskSearch
                    || data.name.toLowerCase().includes(this.evaluationTaskSearch.toLowerCase())
                    || data.preprocessName.toLowerCase().includes(this.evaluationTaskSearch.toLowerCase())
                    || data.startTime.toLowerCase().includes(this.evaluationTaskSearch.toLowerCase())
                    || data.status.toLowerCase().includes(this.evaluationTaskSearch.toLowerCase())
                );
                filterList.sort((obj1, obj2) => obj1.id - obj2.id);
                filterList.forEach((element, index) => {
                    element.index = index + 1;
                });
                return filterList;
            }
        },
        watch: {
            activeTab: function (tabName) {
                if (tabName === "resultEvaluation") {
                    // 自动刷新预处理结果列表
                    clearInterval(this.interval);
                    this.interval = setInterval(() => {
                        this.getPreprocessTaskList();
                    }, 2000);
                } else if (tabName === "resultView") {
                    // 自动刷新评估结果列表
                    clearInterval(this.interval);
                    this.interval = setInterval(() => {
                        this.getEvaluationTaskList();
                    }, 2000);
                } else {
                    // 离开结果标签清除计时器
                    clearInterval(this.interval);
                }
            }
        },
        methods: {
            handleClickTab() {
                if (this.activeTab === "dataProcess") {
                    // 获取算法和数据列表
                    this.getAlgorithmsAndDataList();
                } else if (this.activeTab === "resultEvaluation") {
                    // 获取预处理任务列表
                    this.getPreprocessTaskList();
                } else if (this.activeTab === "resultView") {
                    // 获取评估结果列表
                    this.getEvaluationTaskList();
                }
            },
            onSubmit(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        let formToPost = _.cloneDeep(this.form);

                        formToPost.username = this.username;

                        formToPost.algoId = formToPost.algorithm;
                        delete formToPost.algorithm;

                        formToPost.dataId = formToPost.data;
                        delete formToPost.data;

                        this.$axios
                            .post(this.$api.dataProcess, formToPost)
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

                                    // 跳转 “处理结果评估” 标签页并获取列表
                                    this.activeTab = "resultEvaluation";
                                    this.getPreprocessTaskList();
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
                            message: "填写完整才可以创建任务！",
                            type: "error",
                            showClose: true,
                            duration: 2000
                        });
                        return false;
                    }
                });
            },
            getAlgorithmsAndDataList() {
                this.$axios
                    .get(this.$api.fsFile)
                    .then(res => {
                        res = res.data;

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
                            type: "error",
                            showClose: true,
                            duration: 2000,
                            message: "服务器连接失败！" + error
                        });
                    });
            },
            getPreprocessTaskList() {
                this.$axios
                    .get(this.$api.preprocessTask)
                    .then(res => {
                        res = res.data.sort((obj1, obj2) => obj1.id - obj2.id);
                        this.processTaskList = [];
                        this.processTaskList = res.map((element, index) => {
                            delete element.algoId;
                            delete element.dataId;

                            element.index = index + 1;

                            element.taskName = element.name;
                            delete element.name;

                            element.taskAlgorithm = element.algo;
                            delete element.algo;

                            element.taskData = element.data;
                            delete element.data;

                            let duration = element.endTime - element.startTime;
                            element.duration = this.$formatDuration(duration);
                            delete element.endTime;

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
                        this.processCasesLoading = false;
                    })
                    .catch(error => {
                        this.processCasesLoading = false;
                        this.$message({
                            type: "error",
                            showClose: true,
                            duration: 2000,
                            message: "服务器连接失败！" + error
                        });
                    });
            },
            getEvaluationTaskList() {
                this.$axios
                    .get(this.$api.preprocessEvaluationTask)
                    .then(res => {
                        res = res.data.sort((obj1, obj2) => obj1.id - obj2.id);
                        this.evaluationTaskList = [];
                        this.evaluationTaskList = res.map((element, index) => {
                            element.index = index + 1;

                            delete element.resultName;

                            if (parseInt(element.startTime) > 0 && (parseInt(element.endTime) - parseInt(element.startTime) > 0)) {
                                let duration = element.endTime - element.startTime;
                                element.duration = this.$formatDuration(duration);
                                delete element.endTime;

                                element.startTime = moment(element.startTime).format("YYYY年MM月DD日 HH:mm:ss");
                            } else {
                                element.startTime = "-";
                                element.duration = "-";
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
                        this.evaluationCasesLoading = false;
                    })
                    .catch(error => {
                        this.processCasesLoading = false;
                        this.$message({
                            type: "error",
                            showClose: true,
                            duration: 2000,
                            message: "服务器连接失败！" + error
                        });
                    });
            },
            handleResultDownload(id) {
                this.$axios
                    .get(this.$api.preprocessResultDownload, {
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
            handleResultEvaluation(id) {
                // 打开模态框，停止计时器
                clearInterval(this.interval);

                // 如果两次点击的不是同一个任务，重置评估表单数据
                if (id !== this.evaluationForm.id) {
                    this.evaluationForm.id = id;
                    this.resetEvaluationForm();
                }

                this.processResultEvaluationDialog = true;
            },
            handleDeletePreprocessCase(id) {
                let postData = qs.stringify({
                    username: this.username,
                    id
                });
                this.$axios
                    .post(this.$api.preprocessTaskDelete, postData)
                    .then(res => {
                        if (res.data.status === 0) {
                            this.$message({
                                message: "删除成功！",
                                type: "success",
                                showClose: true,
                                duration: "1000"
                            });
                            this.getPreprocessTaskList();
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
            handleProcessResultDialogClose(done) {
                // 自动刷新预处理结果列表
                clearInterval(this.interval);
                this.interval = setInterval(() => {
                    this.getPreprocessTaskList();
                }, 2000);
                done();
            },
            addRule() {
                this.evaluationForm.rules.push({
                    key: Date.now(),
                    column: "",
                    rule: "",
                    value: ""
                });
            },
            removeRule(item) {
                const index = this.evaluationForm.rules.indexOf(item);
                if (index !== -1) {
                    this.evaluationForm.rules.splice(index, 1);
                }
            },
            onEvaluationSubmit(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        if (this.evaluationForm.rules.length > 0) {
                            let formToPost = _.cloneDeep(this.evaluationForm);

                            formToPost.username = this.username;

                            formToPost.taskName = formToPost.name;
                            delete formToPost.name;
                            formToPost.algorithmId = formToPost.id;
                            delete formToPost.id;
                            formToPost.operations = formToPost.rules;
                            delete formToPost.rules;

                            formToPost.operations.forEach(element => {
                                    delete element.key;
                                    element.columnPos = element.column;
                                    delete element.column;
                                    element.operation = element.rule;
                                    delete element.rule;
                                }
                            );
                            this.$axios
                                .post(this.$api.preprocessEvaluation, formToPost)
                                .then(res => {
                                    if (res.data.status === 0) {
                                        this.$message({
                                            message: "任务创建成功",
                                            type: "success",
                                            showClose: true,
                                            duration: "1000"
                                        });
                                        // 清空表单
                                        this.resetEvaluationForm();
                                        // 关闭模态框
                                        this.processResultEvaluationDialog = false;
                                        // 跳转 “评估结果查看” 标签页 并获取结果列表
                                        this.activeTab = "resultView";
                                        this.getEvaluationTaskList();
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
                                message: "至少需要一条规则才可以创建任务！"
                            });
                        }
                    } else {
                        this.$message({
                            message: "填写完整才可以创建任务！",
                            type: "error",
                            showClose: true,
                            duration: 2000
                        });
                        return false;
                    }
                });
            },
            resetEvaluationForm() {
                // 可能没渲染，没有 resetFields 方法
                if (this.$refs["evaluationForm"]) {
                    this.$refs["evaluationForm"].resetFields();
                }
                this.evaluationForm.rules = [];
            },
            viewEvaluationResult(id) {
                let postData = qs.stringify({id});
                this.$axios
                    .post(this.$api.evaluationTaskResult, postData)
                    .then(res => {
                        if (res.data.status === 0) {
                            res = res.data.data;

                            let totalLines = res.total;
                            delete res.total;
                            let finalQualifiedLines = res.final;
                            delete res.final;

                            this.evaluationResult.finalLines = finalQualifiedLines;
                            this.evaluationResult.finalPercent = (finalQualifiedLines * 100 / totalLines).toFixed(2) + "%";

                            let index = 1;
                            let resultItems = [];
                            for (let key in res) {
                                let ruleSplit = key.split(' ');
                                let item = {
                                    id: index++,
                                    name: `第${ruleSplit[0].replace('C', '')}列 ${ruleSplit[1]} ${ruleSplit[2]}`,
                                    value: res[key],
                                    percent: (res[key] * 100 / totalLines).toFixed(2) + "%"
                                };
                                resultItems.push(item);
                                this.evaluationResult.items = resultItems;
                            }

                            // 打开模态框，停止计时器
                            clearInterval(this.interval);
                            this.evaluationResultDialog = true;
                        } else {
                            this.$message({
                                message: "获取结果失败，请重试！",
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
                        })
                    });
            },
            getEvaluationSummaries() {
                let sums = [];
                sums[1] = "总  计";
                sums[2] = this.evaluationResult.finalLines;
                sums[3] = this.evaluationResult.finalPercent;
                return sums;
            },
            handleEvaluationResultDialogClose(done) {
                // 自动刷新评估结果列表
                clearInterval(this.interval);
                this.interval = setInterval(() => {
                    this.getEvaluationTaskList();
                }, 2000);
                done();
            },
            handleDeleteEvaluationCase(id) {
                let postData = qs.stringify({
                    username: this.username,
                    id
                });
                this.$axios
                    .post(this.$api.evaluationTaskDelete, postData)
                    .then(res => {
                        if (res.data.status === 0) {
                            this.$message({
                                message: "删除成功！",
                                type: "success",
                                showClose: true,
                                duration: "1000"
                            });
                            this.getEvaluationTaskList();
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
            }
        }
    };
</script>


<style scoped>
    .leftTab {
        margin-top: 30px;
    }

    #form {
        width: 400px;
        margin: 30px auto 0;
    }

    .casesTable {
        width: 95%;
        margin: 20px auto 0;
        text-align: center;
    }
</style>

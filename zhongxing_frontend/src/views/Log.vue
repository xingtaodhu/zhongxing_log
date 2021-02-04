<template>
    <div class="log">
        <h1 class="title">系统日志</h1>
        <el-table :data="filterLogList" v-loading="logLoading" style="width: 100%" max-height="700">
            <el-table-column prop="index" label="序号" width="70" align='center'></el-table-column>
            <el-table-column prop="time" label="时间" width="200" align='center'></el-table-column>
            <el-table-column prop="username" label="操作人" width="100" align='center'></el-table-column>
            <el-table-column prop="type" label="类型" min-width="200" align='center'></el-table-column>
            <el-table-column prop="content" min-width="200" align='left'>
                <template slot="header" slot-scope="slot">
                    <span style="line-height: 35px">内容</span>
                    <el-input v-model="search" size="mini" placeholder="搜索" style="width: 280px; float: right;"/>
                </template>
            </el-table-column>
        </el-table>
        <el-button v-if="this.role === 'admin'" type="danger" @click="emptyLog"
                   style="margin-top: 20px;">
            <i class="el-icon-delete el-icon--left"></i>
            清空日志
        </el-button>
    </div>
</template>

<script>
    const moment = require("moment");
    const qs = require("qs");

    export default {
        name: "Log",
        data() {
            return {
                username: null,
                role: null,
                logList: [],
                search: "",
                logLoading: true
            }
        },
        computed: {
            filterLogList() {
                let filterList = this.logList.filter(data => !this.search
                    || data.time.toLowerCase().includes(this.search.toLowerCase())
                    || data.username.toLowerCase().includes(this.search.toLowerCase())
                    || data.type.toLowerCase().includes(this.search.toLowerCase())
                    || data.content.toLowerCase().includes(this.search.toLowerCase())
                );
                filterList.sort((obj1, obj2) => obj1.time - obj2.time);
                filterList.forEach((element, index) => {
                    element.index = index + 1;
                });
                return filterList;
            }
        },
        created() {
            this.username = this.$cookie.getCookie("username");
            this.role = this.$cookie.getCookie("role");

            if (this.role !== "admin") {
                this.$router.push("/");
                return;
            }
            this.getLogList();
        },
        methods: {
            getLogList() {
                this.$axios
                    .get(this.$api.logList)
                    .then(res => {
                        res = res.data.sort((obj1, obj2) => obj1.time - obj2.time);
                        this.logList = res.map((element, index) => {
                            element.index = index + 1;

                            element.time = moment(element.time).format("YYYY年MM月DD日 HH:mm:ss");

                            element.username = element.user;
                            delete element.user;

                            if (element.operation === "login") {
                                element.type = "登录";
                                element.content = "-";
                            } else if (element.operation === "upload web file") {
                                element.type = "上传文件至文件系统";
                            } else if (element.operation === "upload hdfs file") {
                                element.type = "上传文件至 HDFS";
                            } else if (element.operation === "delete web file") {
                                element.type = "删除文件系统文件";
                            } else if (element.operation === "delete hdfs file") {
                                element.type = "删除 HDFS 文件";
                            } else if (element.operation === "create preprocessing job") {
                                element.type = "创建数据预处理任务";
                            } else if (element.operation === "delete preprocessing job") {
                                element.type = "删除数据预处理任务";
                            } else if (element.operation === "create preprocessing evaluation job") {
                                element.type = "创建预处理评估任务";
                            } else if (element.operation === "delete preprocessing evaluation job") {
                                element.type = "删除预处理评估任务";
                            } else if (element.operation === "create algorithm job") {
                                element.type = "创建算法测试任务";
                            } else if (element.operation === "delete algorithm job") {
                                element.type = "删除算法测试任务";
                            } else if (element.operation === "upload report file") {
                                element.type = "上传测试报告";
                            } else if (element.operation === "delete report file") {
                                element.type = "删除测试报告";
                            } else {
                                element.type = element.operation;
                            }
                            delete element.operation;

                            return element;
                        });
                        this.logLoading = false;
                    })
                    .catch(error => {
                        this.logLoading = false;
                        this.$message({
                            message: "服务器连接失败！" + error,
                            type: "error",
                            showClose: true,
                            duration: 2000
                        });
                    });
            },
            emptyLog() {
                this.$confirm('此操作将永久删除所有日志, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let postData = qs.stringify({
                        requestUsername: this.username
                    });
                    this.$axios
                        .post(this.$api.emptyLog, postData)
                        .then(res => {
                            if (res.data.status === 0) {
                                this.$message({
                                    message: "删除成功！",
                                    type: "success",
                                    showClose: true,
                                    duration: "1000"
                                });
                                this.getLogList();
                            } else {
                                this.$message({
                                    message: "您不是管理员，无权清空日志！",
                                    type: "error",
                                    showClose: true,
                                    duration: 2000
                                });
                            }
                        })
                        .catch(err => {
                            this.$message({
                                message: "清空失败，请稍后再试！" + err,
                                type: "error",
                                showClose: true,
                                duration: "2000"
                            });
                        });
                }).catch(()=>{});
            }
        }
    }
</script>

<style scoped>
    .log {
        margin: 30px auto 0;
        width: 80%;
        text-align: center;
    }
</style>
<template>
    <div class="report">
        <h1 class="title">测试报告管理</h1>
        <!-- 报告列表 -->
        <div class="reportTable">
            <el-table :data="filterReportList" v-loading="reportLoading" style="width: 100%" max-height="700">
                <el-table-column prop="index" label="序号" width="70" align='center'></el-table-column>
                <el-table-column prop="name" label="报告名称" min-width="300" align='left'></el-table-column>
                <el-table-column prop="fileSize" label="报告大小" width="100" align='center'></el-table-column>
                <el-table-column prop="uploadTime" label="上传时间" width="200" align='center'></el-table-column>
                <el-table-column prop="operation" width="240" fixed="right" align='center'>
                    <template slot="header" slot-scope="slot">
                        <el-input v-model="search" size="mini" placeholder="搜索"/>
                    </template>
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" @click="handleDownloadReport(scope.row.id)">下载</el-button>
                        <el-button v-if="role ==='user' || role === 'admin'" size="mini" type="danger" @click="handleDeleteReport(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-button v-if="role ==='user' || role === 'admin'" id="uploadButton" type="primary" @click="uploadDialog = true">上传安全报告<i class="el-icon-upload el-icon--right"></i></el-button>
        <!-- 上传报告到服务器的模态框 -->
        <el-dialog title="上传安全报告" :visible.sync="uploadDialog" center width="600px">
            <el-upload id="upload" ref="upload" :auto-upload="false" drag multiple
                       :on-success="handleUploadSuccess" :data="{username}" :action="$api.reportUpload" style="text-align: center">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">支持多文件同时上传，单文件最大800MB</div>
            </el-upload>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" type="success" @click="submitUpload">开始上传</el-button>
              </span>
        </el-dialog>
    </div>
</template>

<script>
    const moment = require("moment");
    const qs = require("qs");

    export default {
        name: "Report",
        data: function () {
            return {
                username: null,
                role: null,
                uploadDialog: false,
                reportList: [],
                search: "",
                reportLoading: true
            }
        },
        computed: {
            filterReportList() {
                let filterList = this.reportList.filter(data => !this.search
                    || data.name.toLowerCase().includes(this.search.toLowerCase())
                    || data.uploadTime.toLowerCase().includes(this.search.toLowerCase())
                );
                filterList.sort((obj1, obj2) => obj1.id - obj2.id);
                filterList.forEach((element, index) => {
                    element.index = index + 1;
                });
                return filterList;
            }
        },
        created: function () {
            this.username = this.$cookie.getCookie("username");
            this.role = this.$cookie.getCookie("role");
            if (this.username === null) {
                this.$router.push("/login");
                return;
            }
            this.getReportList();
        },
        methods: {
            getReportList() {
                this.$axios
                    .get(this.$api.reportList)
                    .then(res => {
                        res = res.data.sort((obj1, obj2) => obj1.id - obj2.id);
                        this.reportList = res.map((element, index) => {
                            element.index = index + 1;

                            element.fileSize = this.$bytesToSize(element.size);
                            delete element.size;

                            element.uploadTime = moment(element.date).format("YYYY年MM月DD日 HH:mm:ss");
                            delete element.date;

                            return element;
                        });
                        this.reportLoading = false;
                    })
                    .catch(error => {
                        this.reportLoading = false;
                        this.$message({
                            message: "服务器连接失败！" + error,
                            type: "error",
                            showClose: true,
                            duration: 2000
                        });
                    });
            },
            submitUpload() {
                // 上传文件
                this.$refs.upload.submit();
            },
            handleUploadSuccess(response, file, fileList) {
                // 删除上传列表中已经上传成功的文件
                for (let i = 0; i < fileList.length; i++) {
                    if (fileList[i].name === file.name) {
                        fileList.splice(i, 1);
                    }
                }
                // 重新获取文件列表
                this.getReportList();
            },
            handleDownloadReport(id) {
                let eleLink = document.createElement('a');
                eleLink.href = this.$api.reportDownload + id;
                eleLink.click();
            },
            handleDeleteReport(id) {
                let postData = qs.stringify({
                    username: this.username,
                    id
                });
                this.$axios
                    .post(this.$api.reportDelete, postData)
                    .then(res => {
                        if (res.data.status === 0) {
                            this.$message({
                                message: "文件删除成功！",
                                type: "success",
                                showClose: true,
                                duration: "1000"
                            });
                            this.getReportList();
                        } else {
                            this.$message({
                                message: "文件删除失败，请重试！",
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
            }
        }
    }
</script>

<style scoped>
    .report {
        margin: 30px auto 0;
        width: 90%;
        text-align: center;
    }

    #uploadButton {
        margin-top: 20px;
    }
</style>
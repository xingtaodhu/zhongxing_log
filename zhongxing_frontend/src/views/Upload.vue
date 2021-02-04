<template>
    <div class="upload">
        <div class="leftTab">
            <el-tabs v-model="activeTab" tab-position="left" @tab-click="handleClickTab">
                <!-- Start 已上传的文件标签页 -->
                <el-tab-pane label="已上传的文件" name="fsFileTab">
                    <h1 class="title" style="margin-top:0">已上传的文件</h1>
                    <!-- 已上传的文件列表 -->
                    <div class="FsFileTable">
                        <el-table :data="filterFsFiles" v-loading="fsLoading" style="width: 100%" max-height="700">
                            <el-table-column prop="index" label="序号" width="70" align='center'></el-table-column>
                            <el-table-column prop="name" label="文件名" min-width="300" align='left'></el-table-column>
                            <el-table-column prop="fileSize" label="文件大小" width="100" align='center'></el-table-column>
                            <el-table-column prop="uploadTime" label="上传时间" width="200"
                                             align='center'></el-table-column>
                            <el-table-column prop="operation" width="260" fixed="right" align='center'>
                                <template slot="header" slot-scope="slot">
                                    <el-input v-model="fsSearch" size="mini" placeholder="搜索"/>
                                </template>
                                <template slot-scope="scope">
                                    <el-button v-if="role ==='user' || role === 'admin'" size="mini" type="primary"
                                               @click="handleUploadToHDFS(scope.row.id)">上传至HDFS
                                    </el-button>
                                    <el-button size="mini" type="primary"
                                               @click="handleDownloadFsFile(scope.row.id)">下载
                                    </el-button>
                                    <el-button v-if="role ==='user' || role === 'admin'" size="mini" type="danger"
                                               @click="handleDeleteFsFile(scope.row.id)">删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <!-- 上传文件到服务器的模态框和触发按钮 -->
                    <div v-if="role ==='user' || role === 'admin'" class="uploadToFS">
                        <el-button id="uploadToFSButton" type="primary" @click="uploadToFSDialog = true">添加文件<i
                                class="el-icon-upload el-icon--right"></i></el-button>
                        <el-dialog title="上传文件到服务器" :visible.sync="uploadToFSDialog" center width="600px">
                            <el-upload id="upload" ref="upload" :auto-upload="false" drag multiple
                                       :on-success="handleUploadToFSSuccess" :data="{username}"
                                       :action="$api.fsFileUpload">
                                <i class="el-icon-upload"></i>
                                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                                <div class="el-upload__tip" slot="tip">支持多文件同时上传，单文件最大800MB</div>
                            </el-upload>
                            <span slot="footer" class="dialog-footer">
                                <el-button size="medium" type="success" @click="submitUpload">上传到服务器</el-button>
                            </span>
                        </el-dialog>
                    </div>
                </el-tab-pane>
                <!-- End 已上传的文件标签页 -->

                <!-- Start HDFS文件管理标签页 -->
                <el-tab-pane label="HDFS文件管理" name="hdfsFileTab">
                    <h1 class="title" style="margin-top:0">HDFS文件管理</h1>
                    <div class="hdfsFileTable">
                        <el-table :data="filterHdfsFiles" v-loading="hdfsLoading" style="width: 100%" max-height="700">
                            <el-table-column prop="index" label="序号" width="70" align='center'></el-table-column>
                            <el-table-column prop="name" label="文件名" min-width="300" align='left'></el-table-column>
                            <el-table-column prop="fileSize" label="文件大小" width="100" align='center'></el-table-column>
                            <el-table-column prop="uploadTime" label="上传时间" width="200"
                                             align='center'></el-table-column>
                            <el-table-column prop="duration" label="耗时" width="100" align='center'></el-table-column>
                            <el-table-column prop="speed" label="上传速度" width="100" align='center'></el-table-column>
                            <el-table-column prop="operation" width="200" fixed="right" align='center'>
                                <template slot="header" slot-scope="slot">
                                    <el-input v-model="hdfsSearch" size="mini" placeholder="搜索"/>
                                </template>
                                <template slot-scope="scope">
                                    <el-button size="mini" type="primary"
                                               @click="handleDownloadHdfsFile(scope.row.id)">下载
                                    </el-button>
                                    <el-button v-if="role ==='user' || role === 'admin'" size="mini" type="danger"
                                               @click="handleDeleteHdfsFile(scope.row.id)">删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div id="hdfsStroge" style="width: 90%;margin: 20px auto 0;">
                        <el-card shadow="hover" style="color: #606266;">
                            HDFS：{{ hdfsStorage.remaining }} 可用（共 {{ hdfsStorage.capacity }}）
                            <div class="progressBar">
                                <el-tooltip class="item" effect="dark" :content="'不可用空间 ' + hdfsStorage.other"
                                            placement="top">
                                    <div class="hdfsOther" :style=this.hdfsStorage.otherStyle></div>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" :content="'已用空间 ' + hdfsStorage.used"
                                            placement="top">
                                    <div class="hdfsUsed" :style=this.hdfsStorage.usedStyle></div>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" :content="'剩余空间 ' + hdfsStorage.remaining"
                                            placement="top">
                                    <div class="hdfsRemaining" :style=this.hdfsStorage.remainingStyle></div>
                                </el-tooltip>
                            </div>
                        </el-card>
                    </div>
                </el-tab-pane>
                <!-- End HDFS文件管理标签页 -->
            </el-tabs>
        </div>
    </div>
</template>

<script>
    const moment = require("moment");
    const qs = require("qs");

    export default {
        name: "upload",
        created: function () {
            this.username = this.$cookie.getCookie("username");
            this.role = this.$cookie.getCookie("role");
            if (this.username === null) {
                this.$router.push("/login");
                return;
            }

            this.getFsData();
        },
        data() {
            return {
                username: null,
                role: null,
                fsFiles: [],
                fsSearch: "",
                hdfsFiles: [],
                hdfsSearch: "",
                fsLoading: true,
                hdfsLoading: true,
                activeTab: "fsFileTab",
                uploadToFSDialog: false,
                hdfsStorage: {
                    capacity: "",
                    remaining: "",
                    used: "",
                    other: "",
                    usedStyle: "",
                    otherStyle: "",
                    remainingStyle: ""
                }
            };
        },
        computed: {
            filterFsFiles() {
                let filterList = this.fsFiles.filter(data => !this.fsSearch
                    || data.name.toLowerCase().includes(this.fsSearch.toLowerCase())
                    || data.uploadTime.toLowerCase().includes(this.fsSearch.toLowerCase())
                );
                filterList.sort((obj1, obj2) => obj1.id - obj2.id);
                filterList.forEach((element, index) => {
                    element.index = index + 1;
                });
                return filterList;
            },
            filterHdfsFiles() {
                let filterList = this.hdfsFiles.filter(data => !this.hdfsSearch
                    || data.name.toLowerCase().includes(this.hdfsSearch.toLowerCase())
                    || data.uploadTime.toLowerCase().includes(this.hdfsSearch.toLowerCase())
                );
                filterList.sort((obj1, obj2) => obj1.id - obj2.id);
                filterList.forEach((element, index) => {
                    element.index = index + 1;
                });
                return filterList;
            }
        },
        methods: {
            // 切换标签页
            handleClickTab() {
                if (this.activeTab === "fsFileTab") {
                    this.getFsData();
                } else if (this.activeTab === "hdfsFileTab") {
                    this.getHdfsData();
                    this.getHdfsStorage();
                }
            },
            // 上传文件
            submitUpload: function () {
                this.$refs.upload.submit();
            },
            // 文件上传成功
            handleUploadToFSSuccess: function (response, file, fileList) {
                // 删除上传列表中已经上传成功的文件
                for (let i = 0; i < fileList.length; i++) {
                    if (fileList[i].name === file.name) {
                        fileList.splice(i, 1);
                    }
                }
                // 重新获取文件列表
                this.getFsData();
            },
            // 获取已经上传到服务器的文件列表
            getFsData: function () {
                this.$axios
                    .get(this.$api.fsFile)
                    .then(res => {
                        res = res.data.sort((obj1, obj2) => obj1.id - obj2.id);
                        this.fsFiles = res.map((element, index) => {
                            element.index = index + 1;

                            element.fileSize = this.$bytesToSize(element.size);
                            delete element.size;

                            element.uploadTime = moment(element.date).format(
                                "YYYY年MM月DD日 HH:mm:ss"
                            );
                            delete element.date;

                            return element;
                        });
                        this.fsLoading = false;
                    })
                    .catch(error => {
                        this.fsLoading = false;
                        this.$message({
                            message: "服务器连接失败！" + error,
                            type: "error",
                            showClose: true,
                            duration: 2000
                        });
                    });
            },
            // 获取上传到HDFS的文件列表
            getHdfsData() {
                this.$axios
                    .get(this.$api.hdfsFile)
                    .then(res => {
                        res = res.data.sort((obj1, obj2) => obj1.id - obj2.id);
                        this.hdfsFiles = res.map((element, index) => {
                            element.index = index + 1;

                            element.uploadTime = moment(element.startTime).format("YYYY年MM月DD日 HH:mm:ss");

                            element.fileSize = this.$bytesToSize(element.size);

                            let duration = element.endTime - element.startTime;
                            if (duration > 0) {
                                element.duration = this.$formatDuration(duration);
                                element.speed = this.$bytesToSize((element.size / duration * 1000)) + "/s";
                            } else {
                                element.duration = "记录异常";
                                element.speed = "记录异常";
                            }
                            delete element.startTime;
                            delete element.endTime;
                            delete element.size;
                            return element;
                        });
                        this.hdfsLoading = false;
                    })
                    .catch(error => {
                        this.hdfsLoading = false;
                        this.$message({
                            message: "服务器连接失败！" + error,
                            type: "error",
                            showClose: true,
                            duration: 2000
                        });
                    });
            },
            // 选择服务器上的文件上传至HDFS
            handleUploadToHDFS(id) {
                let requestData = qs.stringify({
                    username: this.username,
                    id
                });
                this.$axios
                    .post(this.$api.fsToHDFS, requestData)
                    .then(() => {
                        this.$message({
                            message: "上传成功！",
                            type: "success",
                            showClose: true,
                            duration: 1000,
                        });
                    })
                    .catch(error => {
                        this.$message({
                            message: "服务器连接失败！" + error,
                            type: "error",
                            showClose: true,
                            duration: 2000,
                        });
                    });
            },
            // 删除已上传到服务器的文件
            handleDeleteFsFile(id) {
                let postData = qs.stringify({
                    username: this.username,
                    id
                });
                this.$axios
                    .post(this.$api.fsFileDelete, postData)
                    .then(res => {
                        if (res.data.status === 0) {
                            this.$message({
                                message: "文件删除成功！",
                                type: "success",
                                showClose: true,
                                duration: "1000"
                            });
                            this.getFsData();
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
            },
            handleDeleteHdfsFile(id) {
                let postData = qs.stringify({
                    username: this.username,
                    id
                });
                this.$axios
                    .post(this.$api.hdfsFileDelete, postData)
                    .then(res => {
                        if (res.data.status === 0) {
                            this.$message({
                                message: "文件删除成功！",
                                type: "success",
                                showClose: true,
                                duration: "1000"
                            });
                            this.getHdfsData();
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
            },
            handleDownloadFsFile(id) {
                let eleLink = document.createElement('a');
                eleLink.href = this.$api.fsFileDownload + id;
                eleLink.click();
            },
            handleDownloadHdfsFile(id) {
                let eleLink = document.createElement('a');
                eleLink.href = this.$api.hdfsFileDownload + id;
                eleLink.click();
            },
            getHdfsStorage() {
                this.$axios
                    .get(this.$api.hdfsStroge)
                    .then(res => {
                        this.hdfsStorage.used = this.$bytesToSize(res.data.used);
                        this.hdfsStorage.remaining = this.$bytesToSize(res.data.remaining);
                        this.hdfsStorage.capacity = this.$bytesToSize(res.data.capacity);
                        this.hdfsStorage.other = this.$bytesToSize(res.data.capacity - res.data.used - res.data.remaining);

                        this.hdfsStorage.usedStyle = "width:" + res.data.used / res.data.capacity * 100 + "%;";
                        this.hdfsStorage.otherStyle = "width:" + (res.data.capacity - res.data.used - res.data.remaining) / res.data.capacity * 100 + "%;";
                        this.hdfsStorage.remainingStyle = "width:" + res.data.remaining / res.data.capacity * 100 + "%;";
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
        }
    };
</script>

<style scoped>
    .leftTab {
        margin-top: 30px;
    }

    .FsFileTable {
        width: 90%;
        margin: 20px auto 0;
    }

    .hdfsFileTable {
        width: 90%;
        margin: 20px auto 0;
    }

    .uploadToFS {
        text-align: center;
    }

    #uploadToFSButton {
        margin-top: 20px;
    }

    #upload {
        text-align: center;
    }

    .progressBar {
        width: 100%;
        height: 20px;
        margin-top: 20px;
        border: 1px solid #606266;
        border-radius: 5px;
    }

    .hdfsUsed {
        height: 20px;
        float: left;
        background-color: #2aaef5;
    }

    .hdfsOther {
        height: 20px;
        float: left;
        background-color: #c574d9;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
    }

    .hdfsRemaining {
        height: 20px;
        float: left;
        background-color: #fff;
        border-bottom-right-radius: 5px;
        border-top-right-radius: 5px;
    }
</style>

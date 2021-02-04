<template>
    <div class="config">
        <h1 class="title">后台接口配置</h1>
        <el-form label-position="left" label-width="150px" :model="form" style="width: 500px;margin: 30px auto 0;text-align: center">
            <el-form-item label="Web 后台 IP">
                <el-input class="line" v-model="form.webServerIp"></el-input>
            </el-form-item>
            <el-form-item label="集群 Master IP">
                <el-input class="line" v-model="form.clusterMasterIp"></el-input>
            </el-form-item>
            <el-form-item label="Spark 端口">
                <el-input v-model="form.sparkPort"></el-input>
            </el-form-item>
            <el-form-item label="HDFS 端口">
                <el-input v-model="form.hdfsPort"></el-input>
            </el-form-item>
            <el-form-item label="HDFS 目录">
                <el-input v-model="form.hdfsRootPath"></el-input>
            </el-form-item>
            <el-form-item label="集群 Master 用户名">
                <el-input v-model="form.clusterMasterUsername"></el-input>
            </el-form-item>
            <el-form-item label="集群 Master 密码">
                <el-input v-model="form.clusterMasterPassword"></el-input>
            </el-form-item>
            <el-form-item label="spark-submit 路径">
                <el-input v-model="form.sparkShellPath"></el-input>
            </el-form-item>
            <el-form-item label="Hadoop 路径">
                <el-input v-model="form.hadoopPath"></el-input>
            </el-form-item>
            <el-form-item label="Benchmark jar包路径">
                <el-input v-model="form.benchmarkJarPath"></el-input>
            </el-form-item>
            <el-form-item label="Python 路径">
                <el-input v-model="form.pythonPath"></el-input>
            </el-form-item>
            <el-button type="primary" plain @click="saveConfig">保存</el-button>
        </el-form>
    </div>
</template>

<script>
    const qs = require("qs");

    export default {
        name: "config",
        data() {
            return {
                role: null,
                form: {
                    // webServerIp: "10.141.209.224",
                    // clusterMasterIp: "10.141.209.224",
                    // sparkPort: "7077",
                    // hdfsPort: "9000",
                    // hdfsRootPath: "test",
                    // clusterMasterUsername: "username",
                    // clusterMasterPassword: "password",
                    // sparkShellPath: "/home/opt/spark/bin/spark-submit",
                    // hadoopPath: "/home/opt/hadoop/bin/hadoop",
                    // benchmarkJarPath: "/home/opt/hadoop/share/hadoop/mapreduce/hadoop-mapreduce-client-jobclient-2.7.6-tests.jar",
                    // pythonPath: "/home/carbondata/.pyenv/versions/anaconda3-5.1.0/bin/python"
                }
            };
        },
        created: function () {
            this.role = this.$cookie.getCookie("role");

            if (this.role !== "admin") {
                this.$router.push("/");
                return;
            }

            this.getConfig();
        },
        methods: {
            getConfig: function () {
                this.$axios.get(this.$api.settingCheck)
                    .then(res => {
                        res = res.data;
                        if (res.status === 0) {
                            this.form = res.data;
                        } else if (res.status === 1) {
                            this.form = {
                                webServerIp: "",
                                clusterMasterIp: "",
                                sparkPort: "",
                                hdfsPort: "",
                                hdfsRootPath: "",
                                clusterMasterUsername: "",
                                clusterMasterPassword: "",
                                sparkShellPath: "",
                                hadoopPath: "",
                                benchmarkJarPath: "",
                                pythonPath: ""
                            }
                        } else {
                            this.$message({
                                message: "获取数据失败，请刷新页面重试！",
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
            },
            saveConfig: function () {
                let postData = qs.stringify({
                    webServerIp: this.form.webServerIp,
                    clusterMasterIp: this.form.clusterMasterIp,
                    sparkPort: this.form.sparkPort,
                    hdfsPort: this.form.hdfsPort,
                    hdfsRootPath: this.form.hdfsRootPath,
                    clusterMasterUsername: this.form.clusterMasterUsername,
                    clusterMasterPassword: this.form.clusterMasterPassword,
                    sparkShellPath: this.form.sparkShellPath,
                    hadoopPath: this.form.hadoopPath,
                    benchmarkJarPath: this.form.benchmarkJarPath,
                    pythonPath: this.form.pythonPath
                });
                this.$axios
                    .post(this.$api.setting, postData)
                    .then(res => {
                        if (res.data.status === 0) {
                            this.$message({
                                message: "保存成功！",
                                type: "success",
                                showClose: true,
                                duration: "1000"
                            });
                        } else {
                            this.$message({
                                message: "保存失败，请重试！",
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
            }
        }
    }
</script>
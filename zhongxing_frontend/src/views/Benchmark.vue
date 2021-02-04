<template>
    <div class="benchmark" style="width: 680px; margin: 0 auto;text-align: center">
        <h1 class="title">DFSIO Benchmark</h1>
        <el-table :data="benchmarkResult" stripe style="width: 680px;margin: 30px auto;">
            <el-table-column prop="indicator" label="指标" width="200"></el-table-column>
            <el-table-column prop="writeResult" label="写入" width="240"></el-table-column>
            <el-table-column prop="readResult" label="读取" width="240"></el-table-column>
        </el-table>
        <el-button v-if="role === 'admin' || role === 'user'" type="primary" @click="runBenchmark()"
                   :disabled="!reTest">重新测试
        </el-button>
        <div v-if="fileNumber && fileSize"
             style="margin-top:40px;color:#707070;font-size:16px;line-height: 28px;text-align: left;">
            提示：<br>
            本页面结果使用 {{this.fileNumber}} 个 {{this.fileSize}}M 的文件在 HDFS 上进行写入/读取操作得出。
        </div>
    </div>
</template>

<script>
    const qs = require("qs");

    export default {
        name: "Benchmark",
        data() {
            return {
                role: null,
                benchmarkResult: [
                    {
                        indicator: "",
                        writeResult: "",
                        readResult: ""
                    }
                ],
                fileNumber: null,
                fileSize: null,
                reTest: true
            }
        },
        created() {
            this.role = this.$cookie.getCookie("role");

            if (this.role === null) {
                this.$router.push("/");
                return;
            }

            this.getBenchmark();
        },
        methods: {
            getBenchmark() {
                this.$axios
                    .post(this.$api.benchmark)
                    .then(res => {
                        res = res.data;
                        if (res.status === 0) {
                            this.fileNumber = parseInt(res.data['read']["Number of files"]);
                            this.fileSize = parseInt(res.data['read']["Total MBytes processed"]) / this.fileNumber;

                            let pushBenchmarkResultItem = (key) => {
                                this.benchmarkResult.push({
                                    indicator: key,
                                    writeResult: res.data['write'][key],
                                    readResult: res.data['read'][key]
                                })
                            };
                            let indicators = ["Date & time", "Number of files", "Total MBytes processed", "Throughput mb/sec", "Average IO rate mb/sec", "IO rate std deviation", "Test exec time sec"];
                            this.benchmarkResult = [];
                            indicators.forEach(ele => {
                                pushBenchmarkResultItem(ele);
                            });
                        } else if (res.status === 1) {
                            this.benchmarkResult = [];
                            this.$message({
                                message: "请先运行测试！",
                                type: "warning",
                                showClose: true,
                                duration: 2000
                            });
                        } else {
                            this.$message({
                                message: "获取结果出错！",
                                type: "error",
                                showClose: true,
                                duration: 2000
                            });
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
            runBenchmark() {
                this.reTest = false;
                this.$message({
                    message: "正在测试，请稍等片刻...",
                    type: "success",
                    showClose: true,
                    duration: "3000"
                });

                // 写入测试
                this.$axios
                    .post(this.$api.runBenchmark, qs.stringify({io: "write"}))
                    .then(res => {
                        if (res.data.status === 0) {
                            this.$message({
                                message: "写入测试完成，开始读取测试！",
                                type: "success",
                                showClose: true,
                                duration: "1000"
                            });

                            // 写入测试成功，进行读取测试
                            this.$axios
                                .post(this.$api.runBenchmark, qs.stringify({io: "read"}))
                                .then(res => {
                                    if (res.data.status === 0) {
                                        this.$message({
                                            message: "读取测试完成！",
                                            type: "success",
                                            showClose: true,
                                            duration: "1000"
                                        });
                                        this.getBenchmark();
                                        this.reTest = true;
                                    } else {
                                        this.$message({
                                            message: "读取测试出错，请重试！",
                                            type: "error",
                                            showClose: true,
                                            duration: 2000
                                        });
                                        this.reTest = true;
                                    }
                                })
                                .catch(err => {
                                    this.$message({
                                        message: "请求读取测试失败，请稍后再试！" + err,
                                        type: "error",
                                        showClose: true,
                                        duration: "2000"
                                    });
                                    this.reTest = true;
                                });
                        } else {
                            this.$message({
                                message: "写入测试出错，请重试！",
                                type: "error",
                                showClose: true,
                                duration: 2000
                            });
                            this.reTest = true;
                        }
                    })
                    .catch(err => {
                        this.$message({
                            message: "请求读取测试失败，请稍后再试！" + err,
                            type: "error",
                            showClose: true,
                            duration: "2000"
                        });
                        this.reTest = true;
                    });
            }

        }
    }
</script>

<style scoped>

</style>
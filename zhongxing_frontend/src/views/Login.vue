<template>
    <div class="login">
        <div id="login-container">
            <h1>登录</h1>
            <div class='login-form' v-on:keypress.enter="login">
                <el-input v-model="username" placeholder="用户名"></el-input>
                <el-input v-model="password" placeholder="密码" type="password"></el-input>
                <el-tooltip class="item" effect="light" placement="right">
                    <div slot="content">为了信息安全，请勿在<br/>公用电脑上使用此功能</div>
                    <el-checkbox v-model="remember">记住我</el-checkbox>
                </el-tooltip>
                <el-row>
                    <el-button type="primary" round @click="login">登录</el-button>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "login",
        data() {
            return {
                username: "",
                password: "",
                remember: false
            };
        },
        methods: {
            login: function () {
                if (this.username === "" || this.password === "") {
                    this.$message({
                        message: "用户名和密码不能为空",
                        type: "warning",
                        showClose: true,
                        duration: "2000"
                    });
                } else {
                    const qs = require("qs");
                    let postData = qs.stringify({
                        username: this.username,
                        password: this.password
                    });
                    this.$axios
                        .post(this.$api.login, postData)
                        .then(res => {
                            if (res.data.status === 0) {
                                let time = "";
                                if (this.remember) {
                                    time = "d7";
                                } else {
                                    time = "h8";
                                }

                                let role = "";
                                if (res.data.role === "ADMIN") {
                                    role = "admin";
                                } else if (res.data.role === "USER") {
                                    role = "user";
                                } else {
                                    role = "demo";
                                }

                                this.$cookie.setCookie("user_id", res.data.id, time);
                                this.$cookie.setCookie("username", this.username, time);
                                this.$cookie.setCookie("role", role, time);

                                this.$message({
                                    message: "登录成功！",
                                    type: "success",
                                    showClose: true,
                                    duration: "1000"
                                });

                                // 登录后刷新页面，修复导航栏第一个条目——“导入性能测试”指示器不显示的问题
                                window.location.href = "/";
                                // this.$router.push("/");
                            } else {
                                this.$message({
                                    message: "登录失败，用户名或密码不正确！",
                                    type: "error",
                                    showClose: true,
                                    duration: "2000"
                                });
                            }
                        })
                        .catch(err => {
                            if (err.message.split(" ")[0] === "timeout") {
                                this.$message({
                                    message: "服务器连接超时，请稍后再试！" + err,
                                    type: "error",
                                    showClose: true,
                                    duration: "2000"
                                });
                            } else {
                                this.$message({
                                    message: "服务器连接失败，请稍后再试！" + err,
                                    type: "error",
                                    showClose: true,
                                    duration: "2000"
                                });
                            }
                        });
                }
            }
        }
    };
</script>

<style scoped>
    .login {
        width: 100%;
        height: calc(100vh - 140px);
        padding-top: 80px;
        background-color: #f1f1f1;
    }

    #login-container {
        width: 400px;
        height: 360px;
        margin: 0 auto;
        border-radius: 5px;
        background-color: white;
        box-shadow: 3px 3px 15px #888888;
    }

    #login-container h1 {
        text-align: center;
        padding-top: 40px;
        font-size: 24px;
    }

    .login-form {
        width: 260px;
        text-align: left;
        margin: 30px auto 0;
        line-height: 50px;
    }

    .login-form .el-button {
        width: 260px;
    }
</style>

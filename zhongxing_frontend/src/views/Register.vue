<template>
    <div class="register">
        <div id="register-container">
            <h1>注册</h1>
            <div class='register-form'>
                <el-input v-model="username" placeholder="用户名"></el-input>
                <el-input v-model="password" placeholder="密码" type="password"></el-input>
                <el-input v-model="password_confirm" placeholder="密码确认" type="password"></el-input>
                <el-row>
                    <el-button type="primary" round @click="register">注册</el-button>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "register",
        data() {
            return {
                username: "",
                password: "",
                password_confirm: ""
            };
        },
        methods: {
            register: function () {
                if (
                    this.username === "" ||
                    this.password === "" ||
                    this.password_confirm === ""
                ) {
                    this.$message({
                        message: "用户名和密码不能为空",
                        type: "warning",
                        showClose: true,
                        duration: "2000"
                    });
                } else if (this.password !== this.password_confirm) {
                    this.$message({
                        message: "两次密码不一致",
                        type: "warning",
                        showClose: true,
                        duration: "2000"
                    });
                } else {
                    const qs = require("qs");
                    let postData = qs.stringify({
                        username: this.username,
                        password: this.password,
                        password_confirm: this.password_confirm
                    });
                    this.$axios
                        .post(this.$api.register, postData)
                        .then(res => {
                            if (res.data.status === 0) {
                                this.$message({
                                    message: "注册成功",
                                    type: "success",
                                    showClose: true,
                                    duration: "1000"
                                });
                                this.$router.push("/login");
                            } else {
                                this.$message({
                                    message: "注册失败，请重试！",
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
    };
</script>

<style scoped>
    .register {
        width: 100%;
        height: calc(100vh - 140px);
        padding-top: 80px;
        background-color: #f1f1f1;
    }

    #register-container {
        width: 400px;
        height: 380px;
        margin: 0 auto;
        border-radius: 5px;
        background-color: white;
        box-shadow: 3px 3px 15px #888888;
    }

    #register-container h1 {
        text-align: center;
        padding-top: 40px;
        font-size: 24px;
    }

    .register-form {
        width: 260px;
        text-align: left;
        margin: 30px auto 0;
        line-height: 50px;
    }

    .register-form .el-button {
        margin-top: 20px;
        width: 260px;
    }
</style>

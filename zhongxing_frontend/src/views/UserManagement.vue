<template>
    <div class="user_management">
        <h1 class="title">用户管理</h1>
        <el-table :data="filterUserList" v-loading="loading" style="width: 70%;margin: 0 auto;" max-height="700">
            <el-table-column prop="index" label="序号" width="70" align='center'></el-table-column>
            <el-table-column prop="username" label="用户名" min-width="200" align='center'></el-table-column>
            <el-table-column prop="role" label="角色" width="100" align='left'></el-table-column>
            <el-table-column prop="register_time" label="注册时间" width="200" align='center'></el-table-column>
            <el-table-column prop="operation" min-width="120" align='center'>
                <template slot="header" slot-scope="slot">
                    <el-input v-model="search" size="mini" placeholder="搜索"/>
                </template>
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="showModifyDialog(scope.row)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="修改用户权限" :visible.sync="dialog" width="50%" center top="12%">
            <div style="text-align: center">
                <span>{{ row.username }}</span>
                <el-select v-model="modifiedRole" style="margin: 0 20px;">
                    <el-option v-for="role in roles" :value="role.value" :label="role.label"
                               :key="role.value"></el-option>
                </el-select>
                <el-button type="danger" @click="deleteUser">
                    <i class="el-icon-delete el-icon--left"></i>
                    删除该用户
                </el-button>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="modifyRole">保 存</el-button>

            </span>
        </el-dialog>

    </div>
</template>

<script>
    const qs = require("qs");
    const moment = require("moment");

    export default {
        name: "UserManagement",
        data() {
            return {
                user_id: null,
                username: null,
                role: null,

                userList: [],
                loading: true,
                search: "",
                row: {},
                roles: [{
                    value: "admin",
                    label: "管理员",
                }, {
                    value: "user",
                    label: "用户"
                }, {
                    value: "demo",
                    label: "演示"
                }],
                modifiedRole: "",
                dialog: false
            }
        },
        computed: {
            filterUserList() {
                let filterList = this.userList.filter(data => !this.search
                    || data.username.toLowerCase().includes(this.search.toLowerCase())
                    || data.role.toLowerCase().includes(this.search.toLowerCase())
                    || data.register_time.toLowerCase().includes(this.search.toLowerCase())
                );
                filterList.sort((obj1, obj2) => obj1.id - obj2.id);
                filterList.forEach((element, index) => {
                    element.index = index + 1;
                });
                return filterList;
            }
        },
        created() {
            this.user_id = this.$cookie.getCookie("user_id");
            this.username = this.$cookie.getCookie("username");
            this.role = this.$cookie.getCookie("role");

            if (this.role !== "admin") {
                this.$router.push("/");
                return;
            }
            this.getUserList();
        },
        methods: {
            getUserList() {
                this.$axios
                    .get(this.$api.userList)
                    .then(res => {
                        res = res.data.sort((obj1, obj2) => obj1.id - obj2.id);
                        this.userList = res.map((element, index) => {
                            element.index = index + 1;

                            if (element.role === "ADMIN") {
                                element.role = "管理员";
                            } else if (element.role === "BOSS") {
                                element.role = "演示";
                            } else {
                                element.role = "用户";
                            }

                            element.register_time = moment(element.time).format("YYYY年MM月DD日 HH:mm:ss");
                            delete element.time;

                            return element;
                        });
                        this.loading = false;
                    })
                    .catch(error => {
                        this.loading = false;
                        this.$message({
                            message: "服务器连接失败！" + error,
                            type: "error",
                            showClose: true,
                            duration: 2000
                        });
                    });
            },
            showModifyDialog(row) {
                if (row.id === parseInt(this.user_id)) {
                    this.$message({
                        message: "不可以修改自己的权限！",
                        type: "error",
                        showClose: true,
                        duration: "2000"
                    });
                    return;
                }

                this.row = row;

                if (this.row.role === "管理员") {
                    this.modifiedRole = "admin";
                } else if (this.row.role === "用户") {
                    this.modifiedRole = "user";
                } else if (this.row.role === "演示") {
                    this.modifiedRole = "demo";
                }

                this.dialog = true;
            },
            modifyRole() {
                let role = "";
                if (this.modifiedRole === "admin") {
                    role = "ADMIN";
                } else if (this.modifiedRole === "user") {
                    role = "USER";
                } else if (this.modifiedRole === "demo") {
                    role = "BOSS";
                }
                let postData = qs.stringify({
                    requestUsername: this.username,
                    id: this.row.id,
                    role: role
                });
                this.$axios
                    .post(this.$api.userModify, postData)
                    .then(res => {
                        if (res.data.status === 0) {
                            this.$message({
                                message: "修改成功！",
                                type: "success",
                                showClose: true,
                                duration: "1000"
                            });
                            this.getUserList();
                            this.dialog = false;
                        } else {
                            this.$message({
                                message: "权限不足，修改失败！",
                                type: "error",
                                showClose: true,
                                duration: "2000"
                            });
                        }
                    })
                    .catch(err => {
                        this.$message({
                            message: "修改出错，请稍后再试！" + err,
                            type: "error",
                            showClose: true,
                            duration: "2000"
                        });
                    });
            },
            deleteUser() {
                this.$confirm('您确定要删除该用户吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        let postData = qs.stringify({
                            requestUsername: this.username,
                            id: this.row.id
                        });
                        this.$axios
                            .post(this.$api.userDel, postData)
                            .then(res => {
                                if (res.data.status === 0) {
                                    this.$message({
                                        message: "删除成功！",
                                        type: "success",
                                        showClose: true,
                                        duration: "1000"
                                    });
                                    this.getUserList();
                                    this.dialog = false;
                                } else {
                                    this.$message({
                                        message: "权限不足，删除失败！",
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
                    })
                    .catch(() => {});

            }
        }
    }
</script>

<style scoped>

</style>
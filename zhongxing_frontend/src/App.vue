<template>
    <div id="app">
        <el-header style="display:none">
            <div id="nav">
                <el-menu :default-active="activeIndex" mode="horizontal" menu-trigger="click" @select="handleSelect">
                    <!-- <el-menu-item index="home" id="nav-logo-container">
                        <img src="./assets/img/logoXinHeGray.png" alt="" id="nav-logo">
                    </el-menu-item> -->
                    <!-- <template v-if="username !== null">
                        <el-menu-item index="home" id="nav-home">首页</el-menu-item>
                        <el-menu-item index="upload">导入性能测试</el-menu-item>
                        <el-menu-item index="preprocess">数据预处理评估</el-menu-item>
                        <el-menu-item index="algorithm">算法性能测试</el-menu-item>
                        <el-menu-item index="report">测试报告管理</el-menu-item>
                        <el-menu-item index="application">典型应用</el-menu-item>
                        <el-menu-item v-if="role === 'admin'" index="user_management">用户管理</el-menu-item>
                        <el-menu-item v-if="role === 'admin'" index="log">日志</el-menu-item>
                    </template> -->
                    <el-menu-item v-if="username === null" index="register" id="nav-register">注册</el-menu-item>
                    <el-menu-item v-if="username === null" index="login" id="nav-login">登录</el-menu-item>
                    <!-- <el-submenu v-if="username !== null" index="username" id="nav-username">
                        <template slot="title">{{ username }}</template>
                        <el-menu-item v-if="role === 'admin'" index="config" style="padding-left: 20px;">设置</el-menu-item>
                        <el-menu-item index="logout" style="padding-left: 20px;">注销</el-menu-item>
                    </el-submenu> -->
                </el-menu>
            </div>
        </el-header>
        <el-main>
            <router-view/>
        </el-main>
        <el-footer v-if="this.$route.path !== '/login' && this.$route.path !== '/register'">
            <custom_footer></custom_footer>
        </el-footer>
    </div>
</template>

<script>
    import custom_footer from "@/components/Footer.vue";

    export default {
        name: "app",
        components: {
            custom_footer
        },
        data() {
            return {
                activeIndex: "home",
                username: null,
                role: null
            };
        },
        methods: {
            handleSelect(key) {
                // console.log(key);
                switch (key) {
                    case "home":
                        this.$router.push("/");
                        break;
                    case "upload":
                        this.$router.push("/upload");
                        break;
                    case "preprocess":
                        this.$router.push("/preprocess");
                        break;
                    case "algorithm":
                        this.$router.push("/algorithm");
                        break;
                    case "config":
                        this.$router.push("/config");
                        break;
                    case "report":
                        this.$router.push("/report");
                        break;
                    case "application":
                        this.$router.push("/application");
                        break;
                    case "user_management":
                        this.$router.push("/user_management");
                        break;
                    case "log":
                        this.$router.push("/log");
                        break;
                    case "login":
                        this.$router.push("/login");
                        break;
                    case "register":
                        this.$router.push("/register");
                        break;
                    case "logout":
                        this.$cookie.delCookie("user_id");
                        this.$cookie.delCookie("username");
                        this.$cookie.delCookie("role");
                        window.location.href = "/";
                        break;
                    default:
                        this.$router.push("/");
                        break;
                }
            }
        },
        created: function () {
            // 开发时写入登录的用户，方便调试
             this.$cookie.setCookie("user_id", "1", "d7");
             this.$cookie.setCookie("username", "developer", "d7");
             this.$cookie.setCookie("role", "admin", "d7");

            // 获取登录的用户信息
            this.username = this.$cookie.getCookie("username");
            this.role = this.$cookie.getCookie("role");

            // 设置全局网络请求超时时长
            // this.$axios.defaults.timeout = 2500;

            // 更新状态栏指示器，解决在非首页刷新指示器显示在首页的问题
            let path = this.$router.match(location).hash.split("/")[1];
            if (path.length > 0) {
                if (path === "shmetro" || path === "benchmark") {
                    this.activeIndex = "application";
                } else {
                    this.activeIndex = path;
                }
            } else {
                this.activeIndex = "home";
            }
        },
        // 路由变化时调用
        beforeUpdate: function () {
            // 更新状态栏指示器
            let path = this.$router.match(location).hash.split("/")[1];
            if (path.length > 0) {
                if (path === "shmetro" || path === "benchmark") {
                    this.activeIndex = "application";
                } else {
                    this.activeIndex = path;
                }
            } else {
                this.activeIndex = "home";
            }
            // 路由变化时从cookie获取登录的用户，用于登录后更新导航栏、切换页面检查cookie是否过期
            this.username = this.$cookie.getCookie("username");
        }
    };
</script>

<style>
    #app {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
    }

    #app .title {
        font-size: 24px;
        font-weight: normal;
        text-align: center;
        margin-top: 30px;
    }

    #nav-logo-container {
        padding-left: 30px;
        padding-right: 10px;
        border-bottom: none;
    }

    #nav-logo {
        height: 50px;
    }

    #nav-register {
        float: right;
        padding-left: 10px;
        padding-right: 10px;
        margin-right: 20px;
    }

    #nav-login {
        float: right;
        padding-left: 10px;
        padding-right: 10px;
    }

    #nav-username {
        float: right;
    }
</style>

<template>
    <div class="custom_footer">
        <div class="top">
            <el-row :gutter="40">
                <el-col :span="9">
                    <div>
                        <h2 class="footer_title">关于我们</h2>
                        <ul>
                            <li><span>上海心河信息技术有限公司</span></li>
                            <li><i class="el-icon-location-outline"></i>&nbsp;&nbsp;<a href="https://dwz.cn/5Rlv3N04" target="_blank">上海市普陀区中江路879弄28号楼218</a></li>
                            <li><i class="el-icon-message"></i>&nbsp;&nbsp;<a href="mailto:info@utest.org.cn">info@utest.org.cn</a></li>
                            <li><i class="el-icon-phone-outline"></i>&nbsp;&nbsp;<a href="tel:(86) 21-62701033">(86) 21-62701033</a></li>
                        </ul>
                    </div>
                </el-col>
                <el-col :span="3" v-if='role !== null'>
                    <h2 class="footer_title">应用案例</h2>
                    <ul>
                        <li><a href="#/shmetro">上海地铁</a></li>
                        <li><a href="#/benchmark">基准测试</a></li>
                    </ul>
                </el-col>
                <el-col :span="3" v-if="role === 'admin'">
                    <h2 class="footer_title">我的账户</h2>
                    <ul>
                        <li><a href="#/user_management">用户管理</a></li>
                        <li><a href="#/config">设置</a></li>
                        <li><a href="#/log">日志</a></li>
                    </ul>
                </el-col>
                <el-col :span="3" v-if='role !== null'>
                    <h2 class="footer_title">使用说明</h2>
                    <ul>
                        <li><a href="./data/用户手册.pdf" download="">用户手册</a></li>
                        <li><a href="./data/技术文档.pdf" download="">技术文档</a></li>
                        <li><a href="./data/算法开发文档.pdf" download="">算法开发文档</a></li>
                    </ul>
                </el-col>
                <el-col :span="6">
                    <h2 class="footer_title">友情链接</h2>
                    <ul>
                        <li><a href="https://www.utest.org.cn/" target="_blank">上海心河信息技术有限公司</a></li>
                        <li><a href="http://datascience.fudan.edu.cn/" target="_blank">上海市数据科学重点实验室</a></li>
                    </ul>
                </el-col>
            </el-row>
        </div>
        <div class="copyright">
            Copyright © {{ yearStr }} Hadoop Testing Tools. All Rights Reserved.
            <br>
            上海心河信息技术有限公司 版权所有
        </div>
    </div>
</template>

<script>
    const moment = require("moment");

    export default {
        name: "custom_footer",
        data() {
            return {
                role: null,
                yearStr: ""
            }
        },
        created() {
            this.role = this.$cookie.getCookie("role");
            this.yearStr = this.getCopyrightYearStr();
        },
        methods: {
            getCopyrightYearStr() {
                const currentYear = moment(new Date()).format("YYYY");
                if (parseInt(currentYear) > 2018) {
                    return `2018 - ${currentYear}`;
                }
                return '2018';
            }
        }
    };
</script>

<style scoped>
    .custom_footer {
        background-color: #2a2a2a;
        width: 100%;
        font-size: 14px;
        line-height: 30px;
        color: #7f7f7f;
    }

    .top {
        width: 70%;
        margin: 0 auto 20px;
        padding-top: 30px;
    }

    .copyright {
        height: 80px;
        width: 70%;
        margin: 0 auto;
        padding-top: 10px;
        line-height: 24px;
        border-top: 1px solid #7f7f7f;
        text-align: center;
        color: #666666;
    }

    a {
        text-decoration: none;
        color: #7f7f7f;
    }

    .footer_title {
        font-size: 16px;
        font-weight: normal;
        margin-bottom: 10px;
        color: #666666;
    }
</style>
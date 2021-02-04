<template>
    <div class="application">
        <el-row :gutter="20" style="margin: 10px 10px">
            <el-col :span="8">
                <el-button @click="shmetro" class="item shmetro">
                    上海地铁站点聚类
                </el-button>
            </el-col>
            <el-col :span="8">
                <el-button @click="benchmark" class="item benchmark">
                    基准测试
                </el-button>
            </el-col>
            <el-col :span="8">
                <el-button class="item">
                    敬请期待...
                </el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "Application",
        created() {
            if (this.$cookie.getCookie("username") === null) {
                this.$router.push("/login");
                return;
            }
        },
        methods: {
            shmetro() {
                this.$router.push("/shmetro");
            },
            benchmark() {
                this.$router.push("/benchmark");
            }
        }
    }
</script>

<style scoped>
    .item {
        background: #d3dce6;
        width: 100%;
        height: 240px;
        margin: 10px 0;
        font-size: 24px;
        color: #2d3e4f;
    }
    .shmetro {
        background: url("../assets/img/shmetro.jpg") no-repeat;
        background-size: 100%;
        -ms-background-position-y: 60%;
        background-position-y: 60%;
    }
    .benchmark {
        background: url("../assets/img/benchmark.png") no-repeat;
        background-size: 100%;
        -ms-background-position-y: 60%;
        background-position-y: 60%;
    }
</style>
<template>
    <div class="home">
        <img alt="Hadoop 测试工具" src="../assets/img/logoHadoop.png" height="187">
        <HelloWorld msg="欢迎使用 Hadoop 测试工具"/>
        <vue-particles style="position:absolute;top:60px;bottom:3px;width:100%;z-index:-1;"></vue-particles>
    </div>
</template>

<script>
    // @ is an alias to /src
    import HelloWorld from "@/components/HelloWorld.vue";

    export default {
        name: "home",
        components: {
            HelloWorld
        }
    };
</script>

<style scoped>
    .home {
        text-align: center;
    }

    img {
        margin-top: 40px;
        margin-bottom: 30px;
    }
</style>

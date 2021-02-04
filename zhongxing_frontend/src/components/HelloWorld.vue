<template>
    <div class="hello">
        <h1>{{ msg }}</h1>
        <div class="content">
            <p>本平台是Hadoop 测试工具，针对使用Hadoop、Spark等技术搭建的大数据集群环境进行测试，除了常规的性能测试外，还提供了对集群算法的评估方案，通过跟踪集群算法评估算法效率，并能够对一些常规类型的算法结果进行评价。平台集成了基准性能测试、读取/写入速度测试、数据预处理性能测试、数据质量评估、算法性能测试、算法结果评估等一系列常用的测试评估功能。</p>
        </div>
        <div class="footer">
            <img src="../assets/img/logoXinHe128.png" alt="" height="50">
            <img src="../assets/img/logoFudan128.png" alt="" height="50">
            <img src="../assets/img/logoDataology.png" alt="" height="50">
        </div>
    </div>
</template>

<script>
    export default {
        name: "HelloWorld",
        props: {
            msg: String
        }
    };

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h1 {
        font-size: 30px;
        margin-bottom: 40px;
    }

    p {
        text-align: left;
        text-indent: 2em;
        font-size: 18px;
        line-height: 40px;
    }

    .content {
        width: 70%;
        margin: 0 auto;
    }

    .footer {
        margin: 18vh auto 0;
    }

    .footer img {
        margin: 0 15px;
    }
</style>

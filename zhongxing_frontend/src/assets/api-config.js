const server = "http://10.141.209.224:8090/";
// const server = "http://192.168.1.2:8090/";

const api = {
    /**
     * 用户管理
     */
    login: server + "user/login",
    register: server + "user/register",
    // 获取用户列表
    userList: server + "user",
    // 修改用户角色
    userModify: server + "user/modify",
    // 删除用户
    userDel: server + "user/del",

    /**
     * fs 文件
     */
    // web 后台文件列表
    fsFile: server + "file",
    // 上传文件到 web 后台
    fsFileUpload: server + "file/upload",
    // 下载 web 后台文件
    fsFileDownload: server + "file/download/",
    // 删除 web 后台文件
    fsFileDelete: server + "file/delete",

    /**
     * hdfs 文件
     */
    // hdfs 文件列表
    hdfsFile: server + "hdfs",
    // 从web后台上传到hdfs
    fsToHDFS: server + "hdfs/id",
    // 下载 hdfs 文件
    hdfsFileDownload: server + "hdfs/download/",
    // 删除 hdfs 的文件
    hdfsFileDelete: server + "hdfs/delete",
    // 获取 hdfs 储存信息
    hdfsStroge: server + "hdfs/storage",

    /**
     * Hadoop 基准测试
     */
    // 获取测试结果
    benchmark: server + "hdfs/test",
    // 重新测试
    runBenchmark: server + "hdfs/testRun",

    /**
     * 算法
     */
    // 创建算法任务
    runAlgorithm: server + "algorithm/spark",
    // 获取算法运行结果
    algorithmTask: server + "algorithm",
    // 下载算法结果文件
    algorithmResultDownload: server + "algorithm/download",
    // 删除算法运行记录
    algorithmTaskDelete: server + "algorithm/delete",

    /**
     * 预处理
     */
    // 提交数据预处理任务
    dataProcess: server + "pre/submit",
    // 获取数据预处理任务列表
    preprocessTask: server + "pre/showPreprocess",
    // 下载预处理结果文件
    preprocessResultDownload: server + "pre/download",
    // 删除预处理运行记录
    preprocessTaskDelete: server + "pre/deletePre",
    // 创建预处理评估任务
    preprocessEvaluation: server + "pre/evaluation",
    // 获取预处理评估结果列表
    preprocessEvaluationTask: server + "pre/showEvaluation",
    // 删除评估结果
    evaluationTaskDelete: server + "pre/deleteEva",
    // 查看单个评估结果
    evaluationTaskResult: server + "pre/evaluationResult",

    /**
     * 报告管理
     */
    // 获取报告列表
    reportList: server + "report",
    // 上传报告
    reportUpload: server + "report/upload",
    // 下载报告
    reportDownload: server + "report/download/",
    // 删除报告
    reportDelete: server + "report/delete",

    /**
     * 后台接口
     */
    // 修改后台接口配置
    setting: server + "setting/change",
    // 查询后台接口配置
    settingCheck: server + "setting/check",

    /**
     * 日志
     */
    // 获取日志列表
    logList: server + "log",
    // 清空日志
    emptyLog: server + "log/empty"
};

export default api
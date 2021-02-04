layui.use(['layer', 'table', 'ax', 'laydate'], function () {
    var $ = layui.$;
    var $ax = layui.ax;
    var layer = layui.layer;
    var table = layui.table;
    var laydate = layui.laydate;

    /**
     * 系统管理--登陆日志
     */
    var LoginLog = {
        tableId: "loginLogTable"   //表格id
    };

    /**
     * 初始化表格的列
     */
    LoginLog.initColumn = function () {
        return [[
            {type: 'checkbox'},
            {field: 'menuId',  hide: true, sort: true, title: 'id'},
            {field: 'logName', align: "center", sort: true, title: '模块名称'},
            {field: 'userName', align: "center", sort: true, title: '用户名称',hide:true},
            {field: 'createTime', align: "center", sort: true, title: '时间'},
            {field: 'regularMessage', align: "center", sort: true, title: 'cpu占用率'},
            {field: 'ipAddress', align: "center", sort: true, title: '内存使用率'}
        ]];
    };

    /**
     * 点击查询按钮
     */
    LoginLog.search = function () {
        var queryData = {};
        queryData['beginTime'] = $("#beginTime").val();
        queryData['endTime'] = $("#endTime").val();
        queryData['logName'] = $("#logName").val();
        table.reload(LoginLog.tableId, {
            where: queryData, page: {curr: 1}
        });
    };

    /**
     * 导出excel按钮
     */
    LoginLog.exportExcel = function () {
        var checkRows = table.checkStatus(LoginLog.tableId);
        if (checkRows.data.length === 0) {
            Feng.error("请选择要导出的数据");
        } else {
            table.exportFile(tableResult.config.id, checkRows.data, 'xls');
        }
    };

    //清空日志
    LoginLog.cleanLog = function () {
        Feng.confirm("是否清空所有日志?", function () {
            var ajax = new $ax(Feng.ctxPath + "/loginLog/delLoginLog", function (data) {
                Feng.success("清空日志成功!");
                LoginLog.search();
            }, function (data) {
                Feng.error("清空日志失败!");
            });
            ajax.start();
        });
    };

    //渲染时间选择框
    laydate.render({
        elem: '#beginTime'
    });

    //渲染时间选择框
    laydate.render({
        elem: '#endTime'
    });

    // 渲染表格
    var tableResult = table.render({
        elem: '#' + LoginLog.tableId,
        url: Feng.ctxPath + '/loginLog/list',
        page: true,
        height: "full-98",
        cellMinWidth: 100,
        cols: LoginLog.initColumn()
    });

    // 搜索按钮点击事件
    $('#btnSearch').click(function () {
        LoginLog.search();
    });



    // 搜索按钮点击事件
    $('#btnClean').click(function () {
            var myChart = echarts.init(document.getElementById('speedChartMain'));
            option = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:['CPU使用率(%)','内存使用率(%)']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['','','','','','','']
                },
                yAxis: {

                    type: 'value'
                },
                series: [
                    {
                        name:'CPU使用率(%)',
                        type:'line',
                        stack: '总量',
                        data:[77, 79, 81, 73, 90, 77, 73]
                    },
                    {
                        name:'内存使用率(%)',
                        type:'line',
                        stack: '总量',
                        data:[67, 76, 74, 77,81, 78, 75]
                    }
                ]
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
            layer.open({
                title:'系统性能',
                type: 1,
                shade: false,
                area: ['620px', '460px'],
                shadeClose: false, //点击遮罩关闭
                content: $("#speedChart")
            });
        // LoginLog.cleanLog();
    });
});

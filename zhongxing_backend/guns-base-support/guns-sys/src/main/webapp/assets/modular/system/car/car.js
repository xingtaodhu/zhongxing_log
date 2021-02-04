layui.use(['layer', 'table', 'ax', 'laydate','admin','func'], function () {
    var $ = layui.$;
    var $ax = layui.ax;
    var layer = layui.layer;
    var table = layui.table;
    var laydate = layui.laydate;
    var admin = layui.admin;
    var func = layui.func;

    /**
     * 系统管理--登陆日志
     */
    var Car = {
        tableId: "carTable"   //表格id
    };

    /**
     * 初始化表格的列
     */
    Car.initColumn = function () {
        return [[
            {type: 'checkbox'},
            {field: 'carId',  hide: true, sort: true, title: 'id'},
            {field: 'carNum', align: "center", sort: true, title: '车牌号'},
            {field: 'carLoad', align: "center", sort: true, title: '车辆大小'},
            {field: 'carStatus', align: "center", sort: true, title: '车辆状态'},
            {field: 'carType', align: "center", sort: true, title: '车辆类型'},
            {align: 'center', toolbar: '#tableBar', title: '操作', minWidth: 200}
        ]];
    };



    // 渲染表格
    var tableResult = table.render({
        elem: '#' + Car.tableId,
        url: Feng.ctxPath + '/info/car/list',
        page: true,
        height: "full-98",
        cellMinWidth: 100,
        cols: Car.initColumn()
    });

    /**
     * 点击查询按钮
     */
    Car.search = function () {
        var queryData = {};
        queryData['condition'] = $("#condition").val();
        table.reload(Car.tableId, {
            where: queryData, page: {curr: 1}
        });
    };

    /**
     * 弹出添加通知
     */
    Car.openAddCar = function () {
        func.open({
            height: 420,
            title: '添加车辆',
            content: Feng.ctxPath + '/info/car/car_add',
            tableId: Car.tableId
        });
    };

    /**
     * 点击编辑通知
     *
     * @param data 点击按钮时候的行数据
     */
    Car.onEditCar = function (data) {
        func.open({
            height: 420,
            title: '修改车辆',
            content: Feng.ctxPath + "/info/car/car_update/" + data.carId,
            tableId: Car.tableId
        });
    };

    /**
     * 点击删除通知
     *
     * @param data 点击按钮时候的行数据
     */
    Car.onDeleteCar = function (data) {
        var operation = function () {
            var ajax = new $ax(Feng.ctxPath + "/info/car/delete", function (data) {
                Feng.success("删除成功!");
                table.reload(Car.tableId);
            }, function (data) {
                Feng.error("删除失败!" + data.responseJSON.message + "!");
            });
            ajax.set("carId", data.carId);
            ajax.start();
        };
        Feng.confirm("是否删除车辆 " + data.carNum + "?", operation);
    };

    // 搜索按钮点击事件
    $('#btnSearch').click(function () {
        Car.search();
    });

    // 添加按钮点击事件
    $('#btnAdd').click(function () {
        Car.openAddCar();
    });

    // 工具条点击事件
    table.on('tool(' + Car.tableId + ')', function (obj) {
        var data = obj.data;
        var layEvent = obj.event;

        if (layEvent === 'edit') {
            console.log('edit');
            Car.onEditCar(data);
        } else if (layEvent === 'delete') {
            console.log("click delete");
            console.log(data);
            Car.onDeleteCar(data);
        }
    });

});

# 日志分析系统

## 主要有四个模块组成

1. 系统后台模块：zhongxing_backend
2. 算法后台模块：zhongxing_python
3. 前端模块: zhongxing_frontend
4. 文件上传模块: zhongxing_uploader

## 启动命令
```
/*解压导入镜像文件*/
docker load -i zhongxing_backend.tar
docker load -i zhongxing_frontend.tar
docker load -i zhongxing_python.tar
docker load -i zhongxing_mysql.tar
docker load -i zhongxing_uploader.tar


/*创建桥接网络*/
docker network create zhongxing

/*启动db*/
docker run -e MYSQL_ROOT_PASSWORD=123456 -p 3313:3306 -d --network zhongxing --network-alias db zhongxing_mysql:1.0

/*启动系统后台*/
docker run --network zhongxing --network-alias backend -d -p 8090:8090 zhongxing_backend:1.0

/*启动算法后台*/
docker run --network zhongxing --network-alias python -d -p 8832:8832 zhongxing_python:1.0

/*启动前端*/
docker run -p 8081:8081 -d --network zhongxing --network-alias frontend zhongxing_frontend:1.0

/*启动文件上传服务*/
docker run -p 5000:5000 -d --network zhongxing --network-alias uploader zhongxing_uploader:1.0
```


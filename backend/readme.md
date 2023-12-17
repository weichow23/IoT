# 后端

```shell
pip install -r requirements.txt
# 如果报错缺乏14安装工具， python -m pip install --upgrade pip
```

### MySQL

使用`mysql workbench`打开`init.sql`文件，执行建表

我本机使用了MySQL workbench， 具体来说配置如下

```shell
账号 bs
密码  bsbs
root bsbs
```

### 如果端口被占用

```shell
netstat -ano | findstr :3306
taskkill /F /PID 5748
```

### 监听前端

 ==启动`iot_backend`==

### 监听客户端

==启动`mqtt_backend`==

下载mosquitto后运行服务

```shell
# 先运行下列语句打开服务(Eclipse Mosquitto是一个流行的开源MQTT服务器软件)
mosquitto
```

然后使用老师提供的模拟器发送信号

```shell
# 首先要运行后端程序
mvn clean package
# 同时复制一份iot道target
cd target
java -jar iotclient-1.0.0.jar
```

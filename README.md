# IoT

### Demo



<img src="report/demo.png" style="zoom:60%;" />



密码如下所示，具体支持的操作详见**用户手册**

```shell
普通用户密码都是zhouwei
root用户密码是root
```

**或者**可以使用我提供的docker(它由`docker-compose up -d`生成后打包)

```shell
# 把docker_image.zip解压后的文件夹下的镜像都load
docker load < mysql_latest.tar
docker load < eclipse_mosquitto_latest.tar
docker load < iot_python.tar
docker load < iot_java.tar
docker load < nginx_latest.tar
# 解压IoT后在IoT目录下执行
docker-compose up -d
```

### 文档目录

```shell
├── IoT
│   └── backend
│       ├── flask_server #头文件
│       ├── iot_backend  #前端的后端
│       ├── mqtt_backend  #客户端的后端
│       └── ...
│   ├── client  # 老师提供的客户端，主要的修改见报告，不再赘述
│       └── ...
│   ├── mqtt
│       └── mosquitto.conf
│   └── react
│       ├── build #yarn build生成的静态文件
│       ├── src   #该目录下为主要的前端代码
│       	└── ...
```

### 开发历程

#### 模式设计

```mermaid
graph LR
    subgraph 用户模式
        用户1((用户1))
        用户2((用户2))
        用户3((用户3))
        用户1 --> 自己的设备信息
        用户2 --> 自己的设备信息
        用户3 --> 自己的设备信息
        用户1 --> 更改自己的账号信息
        用户2 --> 更改自己的账号信息
        用户3 --> 更改自己的账号信息
    end

    subgraph 管理员模式
        管理员((管理员))
        管理员 --> 所有设备信息
        管理员 --> 更改所有用户密码
    end

    用户模式 -->|切换模式| 管理员模式

```

#### SQL & ER图

```mermaid
erDiagram

    USER ||--o{ DEVICE : owns
    DEVICE ||--o{ DEVICE_MESSAGE : sends

    USER {
        int id
        varchar(128) name
        varchar(128) password
        varchar(128) email
    }

    DEVICE {
        int id
        varchar(128) name
        varchar(256) description
        int userid
        varchar(128) typology
        datetime timestamp
    }

    DEVICE_MESSAGE {
        int id
        int alert
        varchar(128) clientId
        varchar(128) info
        datetime timestamp
        float lat
        float lng
        int userID forigen key
    }

```

#### 整体架构

```mermaid
graph LR

  Client[Client] -->|API| A{云}
  A{云} -->|API| Client[Client]
  A{云} -->|API| Satellite[后端]
  Satellite[后端] -->|API| A{云}
  A[MQTT服务器]
  A-->B[数据库]

```

#### 时间安排

```mermaid
gantt
    title 项目时间安排 (2023)
    dateFormat YYYY-MM-DD
    section 阶段一：准备和设计
    需求分析 :done, 2023-10-08, 2023-10-10
    数据库设计 :done, 2023-10-11, 2023-10-12
    服务器端框架设计 :done, 2023-10-13, 2023-10-14

    section 阶段二：客户端UI设计和搭建
    客户端UI设计 :done, 2023-10-15, 2023-10-17
    客户端UI搭建 :done, 2023-10-18, 2023-10-19
    客户端UI整合调试 :done, 2023-10-20, 2023-10-21

    section 阶段三：服务端编码和接口文档
    服务端编码（用户注册、登录功能） :done, 2023-10-22, 2023-10-26
    服务端编码（设备配置界面、设备上报数据查询） :done, 2023-10-27, 2023-11-01
    编写服务端接口文档 :done, 2023-11-02, 2023-11-05

    section 阶段四：客户端与服务端整合
    客户端与服务端接口对接 :done, 2023-11-06, 2023-11-10
    整合调试 :done, 2023-11-11, 2023-11-15

    section 阶段五：测试和文档编写
    多次测试、发现和修复问题 :done, 2023-11-16, 2023-11-25
    编写测试文档 :done, 2023-11-26, 2023-11-30
    用户手册编写和细化 :done, 2023-12-01, 2023-12-10
    最后的测试、问题修复、用户手册完善 :done, 2023-12-11, 2023-12-20

```


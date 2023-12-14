# IoT 物联网设备管理平台

<img src="report/demo.png" style="zoom:60%;" />

## 前端

```shell
nvm install 19
nvm use 19
```

然后用yarn来运行前端

```shell
# frontend
rm -rf node_modules
rm yarn.lock
yarn install
# 第一次之后直接进入react目录运行就行
yarn start
```

如果报错可能需要运行

```shell
npm install react-leaflet leaflet --legacy-peer-deps

npm update --save-dev eslint prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-promise
```

## 后端

```shell
# backend
pip install -r requirements.txt
# 如果报错缺乏14安装工具， python -m pip install --upgrade pip
```

[解决14构建工具错误](https://blog.csdn.net/u012637358/article/details/123214825)

使用`mysql workbench`打开`init.sql`文件，执行建表

```
账号 bs
密码  bsbs
root bsbs
```

用pycharm打卡整个工程

+ 配置好运行环境运行`backendServer.py`，运行在`localhost:3790`

```shell
netstat -ano | findstr :1883
taskkill /F /PID 5748
# 运行mqttServer.py之前要先运行下列语句打开服务(Eclipse Mosquitto是一个流行的开源MQTT服务器软件)
mosquitto
```

+ 再开启一个终端，运行`mqttServer.py`，准备监听client信息

#### 3. Client虚拟信息发送

由老师提供，几乎没有进行更改

```shell
# 首先要运行后端程序
mvn clean package
# 同时复制一份iot道target
cd target
java -jar iotclient-1.0.0.jar
```



此时就可以在本机前端进行一系列操作了，详见**用户手册**

```
普通用户密码都是zhouwei
root用户密码是root
```



## TODO

报告写完

然后试一下部署在网页上

1. 使用 [Zeabur](https://zeabur.com/home/) 进行一站式、全自动的项目部署，且自带 CI/CD 和 SSL 证书

2. 华为云学生端

最后录一个视频



🙅‍2024年1月5日前提交： 

1、程序代码和实验报告。 

2、**制作一个docker容器，包含运行网站所需的软件** （docker只能运行一个软件，不知道这个什么意思）

3、录制一个功能演示的操作视频

4、提交的文档包括： 

（2）里面的文档

（4）源代码文件（包括sql） 

打包上传学在浙大



### 文档梗概



**开发文档和环境配置**：  主要记录了我的一些开发过程，以及有详细的环境配置教程



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
        varchar(128) workunit
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

# 关于docker打包

我要如何把下列仓库https://github.com/Llux-C/IoT所示内容需要的环境(比如python， mysql， nodejs)一起用docker打包 已经知道我本地已经能正常运行该程序，我要如何把本地的环境用docker打包

2 / 2

ChatGPT

ChatGPT

要将一个项目及其所需环境（如Python、MySQL、Node.js等）使用Docker进行打包，您需要创建一个Dockerfile和一个docker-compose.yml文件（如果需要管理多个容器）。以下是基本步骤：

### 1. 创建 Dockerfile

Dockerfile 是一个文本文件，包含了从一个基础镜像创建新镜像的所有命令。您的项目需要Python、MySQL和Node.js，所以您可能需要创建多个 Dockerfile，每个针对一个特定的环境。例如，对于Python环境：

```
DockerfileCopy code# 使用Python官方镜像作为基础镜像
FROM python:3.8

# 设置工作目录
WORKDIR /app

# 将本地代码复制到容器内
COPY . /app

# 安装所需依赖
RUN pip install -r requirements.txt

# 运行应用
CMD ["python", "./your-app.py"]
```

对于Node.js和MySQL，您可以类似地创建Dockerfile。

### 2. 创建 docker-compose.yml

当您需要同时运行多个容器时，docker-compose.yml 文件会非常有用。这个文件定义了如何运行您的服务。

```
yamlCopy codeversion: '3'
services:
  web:
    build: ./path-to-your-nodejs-app
    ports:
      - "3000:3000"
  python-app:
    build: ./path-to-your-python-app
    volumes:
      - .:/app
  db:
    image: mysql
    environment:
      MYSQL_ROOT_PASSWORD: example
```

这个文件定义了三个服务：Node.js应用、Python应用和MySQL数据库。

### 3. 构建和运行容器

在拥有Dockerfile和docker-compose.yml文件后，您可以使用以下命令来构建和运行容器：

```
bashCopy code
docker-compose up --build
```

这将根据Dockerfile中的指令构建镜像，并根据docker-compose.yml中的定义启动服务。

### 注意事项

- **依赖管理**：确保您的应用程序依赖在容器内被正确安装。
- **环境变量**：如果您的应用程序需要环境变量，您需要在Dockerfile或docker-compose.yml文件中设置。
- **端口映射**：确保docker-compose.yml文件中正确设置了端口映射，以便可以从外部访问容器内的应用程序。
- **数据持久化**：对于数据库服务，您可能需要设置卷来持久化数据。

在执行这些步骤时，您可能需要根据项目的具体需求做出调整。

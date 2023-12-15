import json
import datetime
from flask import request, jsonify
from flask_cors import CORS
from backend.flask_server import db, create_server, User, Device, Message, create_token, verify_token
from functools import wraps

app = create_server()
CORS(app)  # 为app应用启用CORS, 启用跨域同源

def getRecentDay(days=31):
    """
    获取最近一段时间内的日期列表
    Args:
        days (int, optional): 需要获取的天数，默认为31天。

    Returns:
        list: 包含日期字符串的列表，日期格式为"%m-%d"（例如："12-15"）。
    """
    today = datetime.datetime.today()
    return [(today - datetime.timedelta(days=i)).strftime("%m-%d") for i in range(days)][::-1]

def make_response(verify, msg, data=None):
    """
    创建一个通用的响应字典，用于API返回。

    Args:
        verify (int): 表示操作是否成功的布尔值，True 表示成功，False 表示失败。
        msg (str): 与响应相关的消息，通常用于描述操作结果或错误信息。
        data (any, optional): 可选的数据，包含响应的附加信息。默认为None。

    Returns:
        dict: 包含响应信息的字典，具有以下结构：
        {
            'verify': bool,  # 操作是否成功
            'msg': str,      # 相关消息
            'data': any      # 可选的附加数据
        }
    """
    return jsonify(verify=verify, msg=msg, data=data)

def token_required(f):
    """
        装饰器函数，用于验证请求是否包含有效的身份验证令牌，并将验证后的用户传递给被装饰的视图函数。

        Args:
            f (function): 被装饰的视图函数，应接受用户对象作为第一个参数。

        Returns:
            function: 被装饰后的函数，用于验证令牌并调用原始视图函数。
        """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token_received = request.args.get('token') if request.method == 'GET' else json.loads(request.data).get('token')
        if not token_received:
            return make_response(-1, "No token provided!")
        user = verify_token(token_received)
        if user is None:
            if token_received == 'root':
                return make_response(1, "getSuccess!", 'root')
            else:
                return make_response(-1, "用户信息不存在或者token失效，请重新登录!")
        return f(user, *args, **kwargs)
    return decorated_function


@app.route('/register', methods=['POST'])
def register():
    """
    处理用户注册的路由。

    Returns:
        dict: 包含注册结果的响应字典，具有以下结构：
        {
            'verify': int,  # 注册验证结果，0 表示成功，-1 表示失败
            'msg': str      # 相关消息
        }
    """
    data = json.loads(request.data)
    name = data['name']
    password = data['password']
    email = data['email']
    # print(name, email, password)
    result = {
        "verify": 0,
        "msg": "Register success!"
    }
    new_id = 0
    # 判断是否重名、重邮箱
    users = User.query.all()
    for user in users:
        if name == user.name:
            result['verify'] = -1
            result['msg'] = "The user_name has existed!"
            return result
        elif email == user.email:
            result['verify'] = -1
            result['msg'] = "The email has existed!"
            return result
        new_id = user.id
    # 插入
    new_user = User(id=new_id + 1, name=name, password=password, email=email)
    db.session.add(new_user)
    db.session.commit()
    return result


@app.route('/tokenLogin', methods=['POST'])
def tokenLogin():
    """
    处理用户使用令牌进行登录的路由。

    Returns:
        dict: 包含登录结果的响应字典，具有以下结构：
        {
            'verify': int,  # 登录验证结果，0 表示成功，-1 表示失败
            'msg': str,      # 相关消息
            'data': any      # 可选的附加数据（令牌）
        }
    """
    data = json.loads(request.data)
    token_received = data["token"]
    # print(token_received)
    user = verify_token(token_received)
    if user is None:
        return make_response(-1, "token is invalid!")
    return make_response(0, "login success!", token_received)


@app.route('/login', methods=['POST'])
def login():
    """
       处理用户登录的路由。

       Returns:
           dict: 包含登录结果的响应字典，具有以下结构：
           {
               'verify': int,  # 登录验证结果，0 表示成功，-1 表示用户不存在，-2 表示密码错误
               'msg': str,      # 相关消息
               'data': any      # 可选的附加数据（令牌或'root'）
           }
       """
    data = json.loads(request.data)
    password = data["password"]
    email = data["email"]
    if email != 'root':
        user = User.query.filter(User.email == email).all()
        if user is None or not user:
            return make_response(-1, '用户不存在')
        if user[0].password != password:
            return make_response(-2, '密码错误')
        return make_response(0, "login success!", create_token(user[0].id))
    else:
        if password != '63a9f0ea7bb98050796b649e85481845':  # root对应的md5值
            return make_response(-2, '密码错误', 'root')
        else:
            return make_response(0, "login success!", 'root')


@app.route('/getUser', methods=['GET'])
@token_required
def getUser(user):
    """
    获取用户信息的路由。

    Args:
        user (User): 经过身份验证的用户对象。

    Returns:
        dict: 包含用户信息的响应字典，具有以下结构：
        {
            'verify': int,  # 获取用户信息结果，0 表示成功，-1 表示失败
            'msg': str,      # 相关消息
            'data': any      # 用户信息
        }
    """
    return make_response(0, "getSuccess!", user.name)

@app.route('/getAllUser', methods=['GET'])
def getAllUser():
    """
    获取所有用户信息的路由。

    Returns:
        dict: 包含所有用户信息的响应字典，具有以下结构：
        {
            'verify': int,       # 获取用户信息结果，0 表示成功，-1 表示失败
            'users': list[dict]  # 包含用户信息字典的列表
        }
    """
    users = User.query.all()
    user_list = []
    for user in users:
        user_data = {
            "name": user.name,
            "token": create_token(user.id),
            "password": user.password
        }
        user_list.append(user_data)
    return jsonify({"verify": 0, "users": user_list})


@app.route('/alterPassword', methods=['POST'])
def alterPassword():
    """
    处理用户修改密码的路由。

    Returns:
        dict: 包含密码修改结果的响应字典，具有以下结构：
        {
            'verify': int,  # 密码修改结果，0 表示成功，-1 表示用户信息不存在或token失效，-2 表示原密码输入错误
            'msg': str      # 相关消息
        }
    """
    data = json.loads(request.data)
    token_received = data["token"]
    old_password = data["oldPsw"]
    new_password = data["newPsw"]
    user = verify_token(token_received)
    # print(token_received)
    if user is None:
        return make_response(-1, "用户信息不存在或者token失效，请重新登录!")
    if user.password != old_password:
        return make_response(-2, "原密码输入错误")
    user.password = new_password
    db.session.commit()
    return make_response(0, "Alter Psw success!")


@app.route('/alterName', methods=['POST'])
def alterName():
    """
    处理用户修改用户名的路由。

    Returns:
        dict: 包含修改用户名结果的响应字典，具有以下结构：
        {
            'verify': int,  # 修改用户名结果，0 表示成功，-1 表示用户信息不存在或token失效，-2 表示新用户名已存在
            'msg': str      # 相关消息
        }
    """
    data = json.loads(request.data)
    token_received = data["token"]
    new_name = data["newName"]
    tmp = User.query.filter(User.name == new_name).all()
    if len(tmp) != 0:
        return make_response(-1, "不能改成这个名字!")
    user = verify_token(token_received)
    if user is None:
        return make_response(-1, "用户信息不存在或者token失效，请重新登录!")
    devices = Device.query.filter(Device.user == user.name).all()  # 在设备中同步更改
    for device in devices:
        device.user = new_name
    user.name = new_name
    db.session.commit()
    return make_response(0, "更改名字成功!")


@app.route('/getDevice', methods=['GET', 'POST'])
def getDevice():
    """
    获取设备信息的路由。

    Returns:
        dict: 包含设备信息的响应字典，具有以下结构：
        {
            'verify': int,      # 获取设备信息结果，0 表示成功，-1 表示用户信息不存在或token失效
            'data': list[dict]  # 包含设备信息字典的列表
        }
    """
    if request.method == 'GET':
        result = {
            "verify": 0,
            "data": []
        }
        token_received = request.args.get("token")
        if token_received != 'root':
            user = verify_token(token_received)
            if user is None:
                return make_response(-1, "用户信息不存在或者token失效，请重新登录!")

            devices = Device.query.filter(Device.user == user.name).all()
            for device in devices:
                dev = {
                    "id": device.id,
                    "clientId": device.clientId,
                    "name": device.name,
                    "description": device.description,
                    "create_time": device.create_time,
                    "user": device.user,
                }
                result.get("data").append(dev)
        else:  # 如果token为'root'，则返回所有设备
            devices = Device.query.all()
            for device in devices:
                dev = {
                    "id": device.id,
                    "clientId": device.clientId,
                    "name": device.name,
                    "description": device.user,  # 描述更改为返回所有者
                    "create_time": device.create_time,
                    "user": device.user,
                }
                result.get("data").append(dev)
                # print(dev)
        return jsonify(result)


@app.route('/selectDevice', methods=['GET'])
def selectDevice():
    """
    根据设备名称查询设备信息的路由。

    Returns:
        dict: 包含设备信息的响应字典，具有以下结构：
        {
            'verify': int,      # 查询设备信息结果，0 表示成功，-1 表示用户信息不存在或token失效
            'data': list[dict]  # 包含设备信息字典的列表
        }
    """
    token_received = request.args.get("token")
    deviceName = request.args.get("name")

    if token_received != 'root':
        user = verify_token(token_received)
        if user is None:
            return make_response(-1, "用户信息不存在或者token失效，请重新登录!")
        devices = Device.query.filter(Device.user == user.name).filter(Device.name.ilike("%" + deviceName + "%")).all()
    else:
        devices = Device.query.filter(Device.name.ilike("%" + deviceName + "%")).all()
    result = {
        "verify": 0,
        "data": []
    }
    for device in devices:
        dev = {
            "id": device.id,
            "clientId": device.clientId,
            "name": device.name,
            "description": device.description,
            "create_time": device.create_time,
            "user": device.user,
        }
        result.get("data").append(dev)
    return jsonify(result)

@app.route('/alterDevice', methods=['POST'])
def alterDevice():
    """
    处理修改设备信息的路由。

    Returns:
        dict: 包含设备修改结果的响应字典，具有以下结构：
        {
            'verify': int,  # 设备修改结果，0 表示成功，-1 表示设备名称已存在或用户信息不存在或token失效
            'msg': str      # 相关消息
        }
    """
    data = json.loads(request.data)
    token_received = data["token"]
    clientId = data["clientId"]
    deviceOldName = data["oldName"]
    deviceNewName = data["newName"]
    deviceDescription = data["description"]
    deviceId = data["id"]
    new_device = Device.query.filter(Device.name == deviceNewName).all()
    if len(new_device)!=0:
        if len(new_device) == 1 and new_device[0].id == deviceId:
            pass
        else:
            return make_response(-1, "The newName has existed and it cannot be the same!")
    user = verify_token(token_received)
    if user is None and token_received != 'root':
        return make_response(-1, "用户信息不存在或者token失效，请重新登录!")
    device = Device.query.filter(Device.name == deviceOldName).all()
    device[0].clientId = clientId
    device[0].name = deviceNewName
    device[0].description = deviceDescription
    db.session.commit()
    return make_response(0, msg="修改成功!")


@app.route('/createDevice', methods=['POST'])
def createDevice():
    """
    处理创建设备的路由。

    Returns:
        dict: 包含设备创建结果的响应字典，具有以下结构：
        {
            'verify': int,  # 设备创建结果，0 表示成功，-1 表示设备名称已存在或用户信息不存在或token失效
            'msg': str      # 相关消息
        }
    """
    data = json.loads(request.data)
    token_received = data["token"]
    user = verify_token(token_received)
    if user is None and token_received != 'root':
        return make_response(-1, "用户信息不存在或者token失效，请重新登录!")

    deviceClientId = data["clientId"]
    deviceName = data["name"]
    deviceDescription = data["description"]
    deviceUser = data["user"]
    result = {
        "verify": 0,
        "msg": "create success!"
    }
    new_id = 0
    # 判断是否重名
    devices = Device.query.all()
    for device in devices:
        if deviceName == device.name:
            result['verify'] = -1
            result['msg'] = "The deviceName has existed!"
            return result
        new_id = device.id
    # 插入
    new_device = Device(id=new_id + 1, clientId=deviceClientId, name=deviceName, description=deviceDescription,
                        create_time=datetime.datetime.now(), user=deviceUser)
    db.session.add(new_device)
    db.session.commit()
    return result

@app.route('/deleteDevice', methods=['GET'])
def deleteDevice():
    """
    处理删除设备的路由。

    Returns:
        dict: 包含删除设备结果的响应字典，具有以下结构：
        {
            'verify': int,  # 删除设备结果，0 表示成功，-1 表示用户信息不存在或token失效
            'msg': str      # 相关消息
        }
    """
    token_received = request.args.get("token")
    user = verify_token(token_received)
    if user is None and token_received != 'root':
        return make_response(-1, "用户信息不存在或者token失效，请重新登录!")
    deviceName = request.args.get("name")
    devices = Device.query.filter(Device.name == deviceName).all()
    for device in devices:
        db.session.delete(device)
    db.session.commit()
    return make_response(0, "删除设备成功!")


@app.route('/getRecentDevice', methods=['GET'])
def getRecentDevice():
    """
    获取近期设备创建统计信息的路由。

    Returns:
        dict: 包含近期设备创建统计信息的响应字典，具有以下结构：
        {
            'verify': int,      # 获取设备创建统计信息结果，0 表示成功，-1 表示用户信息不存在或token失效
            'msg': str,          # 相关消息
            'day': list[str],   # 日期列表
            'count': list[int]  # 设备创建数量列表
        }
    """
    count = [0] * 31
    token_received = request.args.get("token")

    day_return = getRecentDay()

    if token_received == 'root':
        # 如果token_received为'root'，则返回所有设备
        devices = Device.query.all()
    else:
        user = verify_token(token_received)
        if user is None:
            return make_response(-1, "用户信息不存在或者token失效，请重新登录!")
        devices = Device.query.filter(Device.user == user.name).all()

    for device in devices:
        device_day = str(datetime.datetime.date(device.create_time))[5:]
        for i in range(len(day_return)):
            if day_return[i] == device_day:
                count[i] += 1

    return jsonify(verify=0, msg="getRDsuccess!", day=day_return, count=count)

@app.route('/getMessage', methods=['GET'])
def getMessage():
    """
    获取消息信息的路由。

    Returns:
        dict: 包含消息信息的响应字典，具有以下结构：
        {
            'verify': int,      # 获取消息信息结果，0 表示成功，-1 表示用户信息不存在或token失效
            'data': list[dict]  # 包含消息信息字典的列表
        }
    """
    Id = request.args.get('clientId')
    token_received = request.args.get("token")
    user = verify_token(token_received)
    if Id == 'root':# 如果clientId为'root'，则返回所有消息
        messages = Message.query.all()
    else:
        # messages = Message.query.filter_by(Message.clientId==Id and user.id==Message.userId).all()
        messages = Message.query.filter(Message.clientId == Id, user.id == Message.userId).all()

    result = {
        "verify": 0,
        "data": []
    }
    for message in messages:
        mess = {
            "alert": message.alert,
            "info": message.info,
            "lat": message.lat,
            "lng": message.lng,
            "timestamp": message.timestamp,
            "value": message.value
        }
        result.get("data").append(mess)
    # print(result)
    return jsonify(result)

@app.route("/getRecentMessage", methods=['GET'])
def getRecentMessage():
    """
    获取近期消息统计信息的路由。

    Returns:
        dict: 包含近期消息统计信息的响应字典，具有以下结构：
        {
            'verify': int,      # 获取消息统计信息结果，0 表示成功，-1 表示用户信息不存在或token失效
            'msg': str,          # 相关消息
            'day': list[str],   # 日期列表
            'total': list[int],  # 总消息数量列表
            'alert': list[int],  # 异常消息数量列表
            'normal': list[int]  # 正常消息数量列表
        }
    """
    day_return = getRecentDay()
    total = [0] * 31
    normal = [0] * 31
    alert = [0] * 31
    token_received = request.args.get("token")

    if token_received == 'root':
        # 如果token_received为'root'，则返回所有消息
        messages = Message.query.all()
    else:
        user = verify_token(token_received)
        if user is None:
            return make_response(-1, "用户信息不存在或者token失效，请重新登录!")
        # 只会返回UserId相同的
        # messages = Message.query.filter(user.id==Message.userId).all()
        user_devices = Device.query.filter(Device.user == user.name).all()
        user_device_ids = [device.clientId for device in user_devices]

        # 只返回符合条件的消息
        messages = Message.query.filter(
            Message.userId == user.id,
            Message.clientId.in_(user_device_ids)
        ).all()
    # print('mcgill ', messages)
    for message in messages:
        message_day = str(datetime.datetime.date(message.timestamp))[5:]
        for i in range(len(day_return)):
            if day_return[i] == message_day:
                total[i] += 1
                if message.alert == 0:
                    normal[i] += 1
                else:
                    alert[i] += 1
    # print(day_return, total, normal, alert)
    return jsonify(verify=0, msg="getRMsuccess!", day=day_return, total=total, alert=alert, normal=normal)

if __name__ == '__main__':
    app.run(port=3790, host='0.0.0.0', debug=True)
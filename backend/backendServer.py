import json
from backend.flask_server import db, create_server, User, Device, Message
from flask import request, jsonify
from flask_cors import CORS
import backend.flask_server as token
import datetime
from termcolor import cprint

app = create_server()
CORS(app)  # 为app应用启用CORS, 启用跨域同源

def getRecentDay(days:int=31):
    day_return = []
    today = datetime.datetime.today()
    for i in range(0, days):
        daytmp = today - datetime.timedelta(days=i)
        dayt = daytmp.replace(hour=0, minute=0, second=0, microsecond=0)
        dayt = datetime.datetime.date(dayt)
        day_return.append(str(dayt)[5:])
    day_return.reverse()
    return day_return

@app.route('/register', methods=['POST'])
def register():
    data = json.loads(request.data)
    name = data['name']
    password = data['password']
    email = data['email']
    print(name, email, password)
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
    data = json.loads(request.data)
    token_received = data["token"]
    print(token_received)
    user = token.verify_token(token_received)
    if user is None:
        return jsonify(verify=-1, msg="token is invalid!")
    return jsonify(verify=0, msg="login success!", data=token_received)


@app.route('/login', methods=['POST'])
def login():
    data = json.loads(request.data)
    password = data["password"]
    email = data["email"]
    print(email, password)
    verify = 0
    msg = "login success!"
    if email != 'root':
        user = User.query.filter(User.email == email).all()
        if user is None or not user:
            verify = -1
            msg = "Not exist the user!"
            return jsonify(verify=verify, msg=msg)
        print(user)
        if user[0].password != password:
            verify = -2
            msg = "Password error!"
            return jsonify(verify=verify, msg=msg)
        token_back = token.create_token(user[0].id)
        print(token_back)
        print(type(token_back))
        return jsonify(verify=verify, msg=msg, data=token_back)
    else:
        if password != '63a9f0ea7bb98050796b649e85481845':  # root对应的md5值
            verify = -2
            msg = "Password error!"
        return jsonify(verify=verify, msg=msg, data='root')


@app.route('/getUser', methods=['GET'])
def getUser():
    token_received = request.args.get('token')
    user = token.verify_token(token_received)
    if user is None:
        if token_received == 'root':
            return jsonify(verify=1, msg="getSuccess!", data='root')
        else:
            return jsonify(verify=-1, msg="用户信息不存在或者token失效，请重新登录!")
    return jsonify(verify=0, msg="getSuccess!", data=user.name)

@app.route('/getAllUser', methods=['GET'])
def getAllUser():
    users = User.query.all()
    user_list = []

    for user in users:
        user_data = {
            "name": user.name,
            "token": token.create_token(user.id),  # Assuming the token can be recreated based on the user id
            "password": user.password  # Note: It's a security concern to return actual passwords!
        }
        user_list.append(user_data)

    return jsonify({"verify": 0, "users": user_list})


@app.route('/alterPassword', methods=['POST'])
def alterPassword():
    data = json.loads(request.data)
    token_received = data["token"]
    old_password = data["oldPsw"]
    new_password = data["newPsw"]
    user = token.verify_token(token_received)
    print(token_received)
    if user is None:
        return jsonify(verify=-1, msg="用户信息不存在或者token失效，请重新登录!")
    if user.password != old_password:
        return jsonify(verify=-2, msg="The old password is wrong!")
    user.password = new_password
    db.session.commit()
    return jsonify(verify=0, msg="Alter Psw success!")


@app.route('/alterName', methods=['POST'])
def alterName():
    data = json.loads(request.data)
    token_received = data["token"]
    new_name = data["newName"]
    print(new_name)
    tmp = User.query.filter(User.name == new_name).all()
    if len(tmp) != 0:
        return jsonify(verify=-1, msg="不能改成这个名字!")
    user = token.verify_token(token_received)
    if user is None:
        return jsonify(verify=-1, msg="用户信息不存在或者token失效，请重新登录!")

    # 对设备的主人名称也要进行修改
    devices = Device.query.filter(Device.user == user.name).all()
    for device in devices:
        device.user = new_name
    user.name = new_name
    db.session.commit()
    return jsonify(verify=0, msg="更改名字成功!")


@app.route('/getDevice', methods=['GET', 'POST'])
def getDevice():
    if request.method == 'GET':
        result = {
            "verify": 0,
            "data": []
        }
        token_received = request.args.get("token")
        if token_received != 'root':
            user = token.verify_token(token_received)
            if user is None:
                return jsonify(verify=-1, msg="用户信息不存在或者token失效，请重新登录!")

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
                print(dev)
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
                print(dev)
        return jsonify(result)


@app.route('/selectDevice', methods=['GET'])
def selectDevice():
    token_received = request.args.get("token")
    deviceName = request.args.get("name")

    if token_received != 'root':
        user = token.verify_token(token_received)
        if user is None:
            return jsonify(verify=-1, msg="用户信息不存在或者token失效，请重新登录!")
        devices = Device.query.filter(Device.user == user.name).filter(Device.name.ilike("%" + deviceName + "%")).all()
    else:
        # 如果token_received为'root'，则返回所有设备
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
            return jsonify(verify=-1, msg="The newName has existed and it cannot be the same!")
    user = token.verify_token(token_received)
    if user is None and token_received != 'root':
        return jsonify(verify=-1, msg="用户信息不存在或者token失效，请重新登录!")
    device = Device.query.filter(Device.name == deviceOldName).all()
    device[0].clientId = clientId
    device[0].name = deviceNewName
    device[0].description = deviceDescription
    db.session.commit()
    return jsonify(verify=0, msg="修改成功!")


@app.route('/createDevice', methods=['POST'])
def createDevice():
    data = json.loads(request.data)
    token_received = data["token"]
    user = token.verify_token(token_received)
    if user is None and token_received != 'root':
        return jsonify(verify=-1, msg="用户信息不存在或者token失效，请重新登录!")

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
    token_received = request.args.get("token")
    user = token.verify_token(token_received)
    if user is None and token_received != 'root':
        return jsonify(verify=-1, msg="用户信息不存在或者token失效，请重新登录!")
    deviceName = request.args.get("name")
    devices = Device.query.filter(Device.name == deviceName).all()
    for device in devices:
        db.session.delete(device)
    db.session.commit()
    return jsonify(verify=0, msg="删除设备成功!")


@app.route('/getRecentDevice', methods=['GET'])
def getRecentDevice():

    count = [0] * 31
    token_received = request.args.get("token")

    day_return = getRecentDay()

    if token_received == 'root':
        # 如果token_received为'root'，则返回所有设备
        devices = Device.query.all()
    else:
        user = token.verify_token(token_received)
        if user is None:
            return jsonify(verify=-1, msg="用户信息不存在或者token失效，请重新登录!")
        devices = Device.query.filter(Device.user == user.name).all()

    for device in devices:
        device_day = str(datetime.datetime.date(device.create_time))[5:]
        for i in range(len(day_return)):
            if day_return[i] == device_day:
                count[i] += 1

    print(day_return, count)
    return jsonify(verify=0, msg="getRDsuccess!", day=day_return, count=count)

@app.route('/getMessage', methods=['GET'])
def getMessage():
    Id = request.args.get('clientId')
    token_received = request.args.get("token")
    user = token.verify_token(token_received)
    if Id == 'root':# 如果clientId为'root'，则返回所有消息
        messages = Message.query.all()
    else:
        # messages = Message.query.filter_by(Message.clientId==Id and user.id==Message.userID).all()
        messages = Message.query.filter(Message.clientId == Id, user.id == Message.userID).all()

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
    print(result)
    return jsonify(result)

@app.route("/getRecentMessage", methods=['GET'])
def getRecentMessage():
    day_return = getRecentDay()
    total = [0] * 31
    normal = [0] * 31
    alert = [0] * 31
    token_received = request.args.get("token")

    if token_received == 'root':
        # 如果token_received为'root'，则返回所有消息
        messages = Message.query.all()
    else:
        user = token.verify_token(token_received)
        if user is None:
            return jsonify(verify=-1, msg="用户信息不存在或者token失效，请重新登录!")
        # 只会返回UserID相同的
        # messages = Message.query.filter(user.id==Message.userID).all()
        user_devices = Device.query.filter(Device.user == user.name).all()
        user_device_ids = [device.clientId for device in user_devices]

        # 只返回符合条件的消息
        messages = Message.query.filter(
            Message.userID == user.id,
            Message.clientId.in_(user_device_ids)
        ).all()
    print('mcgill ', messages)
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
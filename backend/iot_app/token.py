from backend.iot_app.models import *
from flask import request, jsonify, current_app
from itsdangerous import TimedSerializer as Serializer

SECRET_KEY = "ccy"  # 第一个参数是内部的私钥，随便设置
EXPIRATION = 3600  # 第二个参数是有效期(秒)

def create_token(api_user):


    s = Serializer(SECRET_KEY)
    token = s.dumps({"id": api_user})
    # token = token.decode()
    if isinstance(token, bytes):  # 判断token是否为字节串
        token = token.decode()
    return token


def verify_token(token):

    # 参数为私有秘钥，跟上面方法的秘钥保持一致
    # token1 = str(token)
    s = Serializer(SECRET_KEY)
    try:
        # 转换为字典
        # data = s.loads(token1)
        data = s.loads(token, max_age=EXPIRATION)
    except Exception:
        return None
    # 拿到转换后的数据，根据模型类去数据库查询用户信息
    user = User.query.get(data["id"])
    return user

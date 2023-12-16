import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Integer
from sqlalchemy.dialects.mysql import INTEGER
from itsdangerous import TimedSerializer, BadSignature, SignatureExpired

EXPIRATION = 3600  # 有效期 3600s
SECRET_KEY = os.environ.get('SECRET_KEY', 'default-secret-key')  # 从环境变量获取密钥

UnsignedInt = Integer()
UnsignedInt = UnsignedInt.with_variant(INTEGER(unsigned=True), 'mysql')

db = SQLAlchemy()

def create_server():
    server = Flask(__name__)

    db_host = os.getenv('DB_HOST', 'localhost')
    server.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://root:bsbs@{db_host}:3306/iot'

    server.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True
    server.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
    db.init_app(server)
    return server

class User(db.Model):
    __tablename__ = 'user_info'
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    name = db.Column(db.String(128), nullable=False)
    password = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(128), nullable=False)

class Device(db.Model):
    __tablename__ = 'device_info'
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    clientId = db.Column(db.String(128), default='', nullable=False)
    name = db.Column(db.String(128), default='', nullable=False)
    description = db.Column(db.UnicodeText)
    create_time = db.Column(db.DateTime, nullable=False)
    user = db.Column(db.String(128), default='', nullable=False)

class Message(db.Model):
    __tablename__ = 'device_message'
    id = db.Column(db.Integer, primary_key=True, nullable=False)
    alert = db.Column(db.Integer, default=0, nullable=False)
    clientId = db.Column(db.String(128), default='', nullable=False)
    info = db.Column(db.String(128), default='', nullable=False)
    lat = db.Column(db.Float, nullable=False)
    lng = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)
    value = db.Column(db.Integer, default=0, nullable=False)
    userId = db.Column(db.Integer, default=0, nullable=False)

def create_token(api_user):
    s = TimedSerializer(SECRET_KEY)
    token = s.dumps({"id": api_user})
    if isinstance(token, bytes):
        token = token.decode()
    return token

def verify_token(token):
    s = TimedSerializer(SECRET_KEY)
    try:
        data = s.loads(token, max_age=EXPIRATION)
        user = User.query.get(data["id"])
        return user
    except BadSignature:
        return None
    except SignatureExpired:
        return None


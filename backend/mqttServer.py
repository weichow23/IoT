import time
import paho.mqtt.client as mqtt
import re
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# 连接数据库
engine = create_engine("mysql+pymysql://root:bsbs@localhost:3306/iot") # 数据库类型 + 数据库驱动器://用户名:密码@地址:端口/数据库名
Session = sessionmaker(bind=engine)

def process_message(message):
    pattern = r'\"(alert|clientId|info|lat|lng|timestamp|userId|value)\":(.*?)[,}]'
    data = dict(re.findall(pattern, message))

    try:
        with Session() as session:
            timestamp = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(int(float(data['timestamp']) / 1000)))
            params = {
                'alert': int(data['alert']),
                'clientId': eval(data['clientId']),
                'info': eval(data['info']),
                'lat': float(data['lat']),
                'lng': float(data['lng']),
                'timestamp': timestamp,
                'value': int(data['value']),
                'userId': int(data['userId'])
            }
            stmt = text(
                'insert into device_message(alert,clientId,info,lat,lng,timestamp,value, userId) values (:alert, :clientId, :info, :lat, :lng, :timestamp, :value, :userId)')
            session.execute(stmt, params)
            session.commit()
    except Exception as e:
        print(f"Error processing message: {e}")

def on_connect(client, userdata, flags, rc):
    print(f"Connected with result {rc}")
    client.subscribe("testapp", 0)

def on_message(client, userdata, msg):
    print("MQTT Data Received...")
    payload = msg.payload.decode('utf-8')
    print(payload)
    process_message(payload)

# 启用MQTT客户端
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
client.connect(host="127.0.0.1", port=1883, keepalive=60)
client.loop_forever()
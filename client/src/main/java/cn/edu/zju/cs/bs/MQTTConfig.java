package cn.edu.zju.cs.bs;

public class MQTTConfig {
    public final static String SERVER = "tcp://localhost:1883";  // 监听端口
    public final static String USER_NAME = "username"; // mosquitto用户名
    public final static String USER_PASSWORD = "password";  // mosquitto密码
    public final static Integer DEVICE_NUM = 5;
    public final static String TOPIC = "iotclient";// 订阅主题
    public final static String DEVICE_ID_PREFIX = "device";
    public final static Integer QoS = 2;
}

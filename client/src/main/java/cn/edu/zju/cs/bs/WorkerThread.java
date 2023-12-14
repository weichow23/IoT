package cn.edu.zju.cs.bs;

import lombok.Data;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;
import com.alibaba.fastjson.JSONObject;
import java.util.concurrent.TimeUnit;

@Data
public class WorkerThread extends Thread {
    private boolean running = true;
    private int deviceId;
    private String mqttServer;
    private String topic;
    private String clientPrefix;

    public void run() {
        try {
            String clientId;
            String content;
            int qos = 2;
            MemoryPersistence persistence = new MemoryPersistence();

            Random rand = new Random();

            clientId = clientPrefix + String.format("%04d", deviceId);
            MqttClient mqttClient = new MqttClient(mqttServer, clientId, persistence);
            MqttConnectOptions connOpts = new MqttConnectOptions();
            connOpts.setCleanSession(true);
            System.out.println("Connecting to broker: " + mqttServer);
            mqttClient.connect(connOpts);
            System.out.println("Connected");
            while (running) {
                // wait for 0-10 seconds
                int interval = rand.nextInt(10);
                Thread.sleep(interval * 1000);

                SimpleDateFormat sdf=new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
                Date now = new Date();
                // + ---------------------------------------- +
                long nowMillis = now.getTime();
                long twoWeeksAgoMillis = nowMillis - TimeUnit.DAYS.toMillis(14);
                long randomTimestamp = twoWeeksAgoMillis + (long) (rand.nextDouble() * (nowMillis - twoWeeksAgoMillis));
                // also change timestep to sdf, but not needed
                // String formattedTimestamp = sdf.format(new Date(randomTimestamp));
                // + ---------------------------------------- +
                int value = rand.nextInt(100);
                int userID = rand.nextInt(10);
                IOTMessage msg = new IOTMessage();
                msg.setClientId(clientId);
                msg.setInfo("Device Data " + sdf.format(now));
                msg.setValue(value);
                // alter if value > 80
                msg.setAlert(value > 80 ? 1 : 0);
                rand.nextFloat();
                // site in HongKong
//                 msg.setLng(114.3 + rand.nextFloat() * 0.6);
//                 msg.setLat(22.165 + rand.nextFloat() * 0.4);
                // site in HangZhou
                msg.setLng(119.9 + rand.nextFloat() * 0.6);
                msg.setLat(30.1 + rand.nextFloat() * 0.4);
                //msg.setTimestamp(now.getTime());
                msg.setTimestamp(randomTimestamp);
                msg.setUserId(userID);
                content = JSONObject.toJSONString(msg);
                System.out.println("Publishing message: " + content);
                MqttMessage message = new MqttMessage(content.getBytes());
                message.setQos(qos);
                mqttClient.publish(topic, message);
                System.out.println("Message published");
            }
            mqttClient.disconnect();
            System.out.println("Disconnected");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

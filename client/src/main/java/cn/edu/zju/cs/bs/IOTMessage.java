package cn.edu.zju.cs.bs;

import lombok.Data;

@Data
public class IOTMessage {
    private String clientId;
    private String info;
    private int value;
    private int alert;
    private double lng;
    private double lat;
    private long timestamp;
    private int userId;
}

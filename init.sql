create database iot;

use iot;

create table device_info
(
    id          int unsigned auto_increment primary key,
    user		varchar(128) default '' not null,
    clientId        varchar(128) default '' not null,
    name        varchar(128) default '' not null,
    description varchar(128),
    create_time datetime     default CURRENT_TIMESTAMP not null
);

create table device_message
(
    id        int unsigned auto_increment	primary key,
    alert     int           default 0                 not null,
    clientId  varchar(128)  default ''                not null,
    info      varchar(128)  default ''                not null,
    lat		  float 		default 0.0000            not null,
    lng		  float			default 0.0000            not null,
    timestamp datetime      default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    value     int           default 0                 not null,
    userId    int           default 0                 not null
)charset = utf8; 

CREATE TABLE user_info
(
    id       INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email    VARCHAR(128) DEFAULT '' not null UNIQUE,
    name     VARCHAR(128) DEFAULT '' not null UNIQUE,
    password VARCHAR(128) DEFAULT '' not null
);

GRANT ALL PRIVILEGES ON iot.* TO 'root'@'localhost';
FLUSH PRIVILEGES;

-- FLUSH PRIVILEGES;
-- show tables;
-- DROP USER 'A'@'%';

-- GRANT ALL PRIVILEGES ON iot.* TO 'root'@'%';

-- show databases;
-- use iot;
-- show tables;
-- DESCRIBE device_info;
-- DROP DATABASE iot;
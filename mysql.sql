create database sms;
use sms;

create table users(
	userId int primary key auto_increment,
    name varchar(50),
    fathername varchar(50),
    age int,
    gender enum("Male","Female"),
    grade enum("9th","10th","11th","12th"),
    contactno varchar(20),
    email varchar(50),
    username varchar(50),
    password varchar(50),
    createdAt date,
    updatedAt date,
    deletedAt date,
    logincount int,
    isAdmin enum("yes","no")
);
select * from users;
insert into users(name,username,email,password,createdAt,isAdmin) values("admin","admin","admin@gmail.com","admin@123","2025-07-16","yes");
-- drop table users;
-- truncate table users;

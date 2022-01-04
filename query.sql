create database labPracticalsDB;
use labPracticalsDB;

create table accounts (id int primary key auto_increment, username varchar(100) unique, password varchar(100), isadmin boolean);
insert into accounts values (null, "admin", "admin", true);
insert into accounts values (null, "test", "test", false);
select * from accounts;

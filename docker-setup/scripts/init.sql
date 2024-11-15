create user typeuser with password 'pass11657';
alter role typeuser superuser createrole createdb replication;
create database typedb;
create database typedb_test;
alter database typedb owner to typeuser;
alter database typedb_test owner to typeuser;

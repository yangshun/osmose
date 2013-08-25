How to setup the project
==

1. git clone
2. npm install
3. Create a new mysql user: Sails (no password)
	- CREATE USER 'sails'@'localhost';
4. Create a new database: sails
	- CREATE DATABASE sails;
5. Grant privileges to sails database
	- GRANT ALL PRIVILEGES ON sails.* TO 'sails'@'localhost';
6. In /etc/hosts (MAC)
  - Add the line: `127.0.0.1    local.osmose.soedar.com`
7. sails lift
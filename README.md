
# Node js C++ server Monitor 
* This project monitors Server.exe at https://github.com/choiis/Cpp-Server
* SQL Server and Redis are required to run the backend.
* There is table information in sql/ChatTable.sql. Create it in SQL Server in advance SQL Server

### backend
* build
```bash
npm install  
```
* run
```bash
node app.js
```
* Check at https://localhost:9443/

* You must put the path to the Server.exe executable file in the exelocation of conf.properties.
* Write SQL Server connection information in conf.properties
* Write Redis connection information in redis.properties

### frontend
* build
```bash
npm install  
```
* run

```bash
npm run server
```

* When connecting to http://localhost:8080, it is proxied to the backend API.

## Node js c++ server Monitor 
이 프로젝트는 https://github.com/choiis/Cpp-Server 의 Server.exe를 모니터링합니다  
SQL Server와 Redis가 있어야 backend실행이 됩니다  
SQL Server 테이블 정보는 sql/ChatTable.sql 참고

### backend
build   : npm install  
run     : node app.js

conf.properties의 exelocation에 Server.exe실행파일 경로를 넣어야 합니다  
conf.properties에 SQL Server 접속정보 쓰세요  
redis.properties에 Redis 접속정보를 쓰세요

### frontend
build   : npm install  
run     : npm run server

localhost:8080으로 접속하면 backend API로 프록시됩니다
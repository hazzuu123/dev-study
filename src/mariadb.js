import mysql from "mysql2";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "Campain",
  dateStrings: true, // 시간대를 db 세팅 시간으로 변경
});

export default connection;

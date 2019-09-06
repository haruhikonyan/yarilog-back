module.exports = {
  "type": "mysql",
  "host": "db",
  "port": 3306,
  "username": process.env.DB_USERNAME,
  "password": process.env.DB_PASSWORD,
  "database": "yarilog",
  "entities": [process.env.TYPEORM_ENTITIES],
  "charset": "utf8mb4",
  "synchronize": true,
  "logging": ["query", "error"]
}
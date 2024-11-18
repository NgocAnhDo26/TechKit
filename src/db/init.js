const mysql = require('mysql2/promise');

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
  host: 'db-techkit-techkit.h.aivencloud.com',
  user: 'avnadmin',
  database: 'db-techkit',
  port: 21007,
  password: 'AVNS_MgQJWFFF3a85l8GRLWZ',
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as connectionLimit
  idleTimeout: 10000000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

module.exports = pool
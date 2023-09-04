const mysql = require('mysql2/promise');

class Db {
  constructor ({user, password, dbName, host}) {
    this.user = user;
    this.password = password;
    this.dbName = dbName;
    this.conn = {};
    this.pool = '';
    this.host = host || 'localhost';
  }

  async connect () {
    const pool = mysql.createPool({
      host : this.host,
      port : 3306,
      user : this.user,
      password : this.password,
      database : this.dbName,
      waitForConnections : true,
      connectionLimit : 10,
      queueLimit : 0
    });
    this.conn.execute = async (...args) => {
      return await pool.query.apply(pool, args);
    };
    this.pool = pool;
  }

  async query (sql) {
    const [rows] = await this.conn.execute(sql);
    return rows;
  }

  async tableExists (name) {
    const sql = `SHOW tables LIKE '${name}'`;
    const [rows] = await this.conn.execute(sql);
    return rows.length > 0;
  }

  async createTableByScheme (FIELDS) {
    let sql;
    const desc = FIELDS.ids.map(id => [id, FIELDS.byId[id]].join(' ')).join(',');
    if (FIELDS.primary) {
      sql = `CREATE TABLE ${FIELDS.name} (${desc}, PRIMARY KEY ( ${FIELDS.primary}))`;
    } else {
      sql = `CREATE TABLE ${FIELDS.name} (${desc})`;
    }
    await this.conn.execute(sql);
  }

  async close () {
    await this.pool.end();
  }
}

module.exports = { Db };

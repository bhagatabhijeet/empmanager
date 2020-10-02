const mysql = require('mysql');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

/**
 * @description Database class does all the work of querying the MySQL database and
 * sending the results
 * The database class is consumed by ORMs
 * The class is not to be consumed by any other code.
 */

class Database {
  constructor() {
    this._connection = null;
  }

  createConnection() {
    this._connection = mysql.createConnection({
      host: process.env.host,
      user: process.env.user,
      password: process.env.password,
      port: process.env.port,
      multipleStatements: true
    });
  }

  /**
     *
     * @param {string} sql
     * @description executeQuery processes the sql passed by user.
     * Note:- The use of promise
     */
  executeQuery(sql) {
    const promise = new Promise((resolve, reject) => {
      if (!this._connection) {
        this.createConnection();
      }

      this._connection.query(sql, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    return promise;
  }

  /**
     * @description seedData is a Utility method to allow user to seed data to the database.
     * Note: - The paths in this method are hardcoded so it will not work on other systems.
     * The method is created just in case we need to create data for quick Demo.
     */
  async seedData() {
    try {
      await this.executeQueryUsingFile(path.join(__dirname, '../db/schema.sql'));
    } catch (err) {
      console.log(err);
      return;
    }
    try {
      await this.executeQueryUsingFile(path.join(__dirname, '../db/seed.sql'));
    } catch (err) {
      console.log(err);
    }

    // Output the stats to the console once seeding data is complete
    let count = await this.executeQuery('SELECT COUNT(*) AS \'Employee Count\' FROM employee;');
    console.table(count[0]);
    count = await this.executeQuery('SELECT COUNT(*) AS \'Department Count\' FROM department;');

    console.table(count[0]);
    count = await this.executeQuery('SELECT COUNT(*) AS \'Roles Count\' FROM role;');

    console.table(count[0]);
  }

  // Just a wrapper on executeQuery method. This method allows convinience to use sql from a file
  async executeQueryUsingFile(filePath) {
    const sql = fs.readFileSync(filePath).toString();
    return this.executeQuery(sql);
  }
}

const db = new Database();
module.exports = db;

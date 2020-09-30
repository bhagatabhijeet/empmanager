const mysql = require('mysql');
const fs = require('fs');
const path = require('path');
// const util = require('util');
require('dotenv').config();

// const readFileAsync = util.promisify(fs.readFile);

class Database{
    _connection=null;
    createConnection(){
        this._connection = mysql.createConnection({
            host: process.env.host,
            user: process.env.user,
            password: process.env.password,
            database: process.env.database,
            port:process.env.port,
            multipleStatements:true
          });
    }

    executeQuery(sql){
        const promise = new Promise((resolve, reject) => {
            if(!this._connection){
                this.createConnection();
            }
            // this._connection.connect();
            this._connection.query(sql, (err, result) => {
              if (err) {
                reject(err);
              }
              else {
                //   this._connection.end();
                resolve(result);
              }
            });
          });
          return promise;
    }

    async seedData(){
        try{
        await this.executeQueryUsingFile(path.join(__dirname,"../db/schema.sql"));
        }
        catch(err){
            console.log(err);
        }
        try{
        await this.executeQueryUsingFile(path.join(__dirname,"../db/seed.sql"));
        }
        catch(err){
            console.log(err);
        }
        // const result={
        //     employeeCount:0,
        //     departmentCount:0,
        //     roleCount:0
        // };
        let count = await this.executeQuery(`SELECT COUNT(*) AS 'Employee Count' FROM employee;`)
        console.table(count[0]);
        count = await this.executeQuery(`SELECT COUNT(*) AS 'Department Count' FROM department;`)
        // result.departmentCount=count;
        console.table(count[0]);
        count = await this.executeQuery(`SELECT COUNT(*) AS 'Roles Count' FROM role;`)
        // result.roleCount=count;
        console.table(count[0]);
        // console.table(result);
         
    }

    async executeQueryUsingFile(filePath){
        let sql=fs.readFileSync(filePath).toString();
        return this.executeQuery(sql);
    }
}

const db=new Database();
module.exports=db;


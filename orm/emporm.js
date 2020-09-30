const db = require('./database');

class EmployeeORM {
    async add() {

    }

    async update() {

    }

    async deleteRows() {

    }

    async getAllAsList() {

    }
    async getAll(params = { where: '', orderBy: '', limit: '' }) {
        let sqlQuery = 'SELECT * FROM employee'
        if ((params.where !== '')) {
            sqlQuery += ` WHERE ${params.where}`
        }
        if (params.orderBy !== '') {
            sqlQuery += ` ORDER BY ${params.orderBy}`
        }
        if (params.limit !== '') {
            sqlQuery += ` LIMIT ${params.limit}`
        }
        sqlQuery += ';';
        try {
            const roles = await db.executeQuery(sqlQuery);
            return roles;
        }
        catch (err) {
            return err;
        }
    }

    async get(params = { sql: '', where: '', orderBy: '', limit: '' }) {
        let sqlQuery = params.sql;
        if (!params.sql) {
            const e = new Error();
            e.sqlMessage = 'Invalid SQL:Select clause not specified';
            throw e;
        }
        if (params.where) {
            sqlQuery += ` WHERE ${params.where}`
        }
        if (params.orderBy) {
            sqlQuery += ` ORDER BY ${params.orderBy}`
        }
        if (params.limit) {
            sqlQuery += ` LIMIT ${params.limit}`
        }
        sqlQuery += ';';
        try {
            const roles = await db.executeQuery(sqlQuery);
            return roles;
        }
        catch (err) {
            return err;
        }
    }
}


const empORM = new EmployeeORM();
module.exports = empORM;
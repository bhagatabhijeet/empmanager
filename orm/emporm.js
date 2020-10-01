const db = require('./database');

class EmployeeORM {

    //Inserts row in employee table
    async add(first_name, last_name, role_id, manager_id) {
        try {
            const addResult = await db.executeQuery(`INSERT INTO employee (first_name,last_name,role_id,manager_id)
            VALUES ('${first_name}','${last_name}',${role_id},${manager_id});`);
            return addResult;
        }
        catch (err) {
            return err;
        }
    }

    // Update employee records
    async update(params = { set: '', where: '' }) {
        if (params.set === '') {
            const e = new Error();
            e.sqlMessage = 'Invalid SQL:SET condition not specified';
            throw e;
        }
        if (params.where === '') {
            const e = new Error();
            e.sqlMessage = 'Invalid SQL:WHERE condition not specified';
            throw e;
        }
        try {
            const updateResult = await db.executeQuery(`UPDATE employee SET ${params.set} 
            WHERE ${params.where};`);
            return updateResult;
        }
        catch (err) {
            console.log(err);
        }

    }

    // Delete from employee table
    async deleteRows(whereCondition) {
        if (typeof whereCondition === 'undefined') {
            const e = new Error();
            e.sqlMessage = 'Invalid SQL:WHERE condition not specified';
            throw e;
        }
        try {
            const deleteResult = await db.executeQuery(`DELETE FROM employee WHERE ${whereCondition};`);
            return deleteResult;
        }
        catch (err) {
            return err;
        }
    }

    // Get all employee records. The method returns only employee table records and performs NO JOINs
    async getAllNoJoin(params = { where: '', orderBy: '', limit: '' }) {
        let sqlQuery = `SELECT * FROM employee`;
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
            const employees = await db.executeQuery(sqlQuery);
            return employees;
        }
        catch (err) {
            return err;
        }
    }
    // Ge all emplyee records. The SQL Query is pre-writtent to perform join on role and department tables
    async getAll(params = { where: '', orderBy: '', limit: '' }) {
        let sqlQuery = `SELECT 
            e.id,
            e.first_name,
            e.last_name,
            r.title,
            r.salary,
            d.name 'department',
            e1.first_name AS 'manager'
        FROM
            employee e
            LEFT JOIN
        employee e1 ON e.manager_id = e1.id
            INNER JOIN
        role r ON e.role_id = r.id
            INNER JOIN
        department d ON r.department_id = d.id`
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
            const employees = await db.executeQuery(sqlQuery);
            return employees;
        }
        catch (err) {
            return err;
        }
    }

    // Get method to allow user to pass custom SQL
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
            const employees = await db.executeQuery(sqlQuery);
            return employees;
        }
        catch (err) {
            return err;
        }
    }
}


const empORM = new EmployeeORM();
module.exports = empORM;
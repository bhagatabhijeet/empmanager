const db = require('./database');

class RoleORM {
    async add(title, salary, department_id) {
        try {
            const addResult = await db.executeQuery(`INSERT INTO role (title,salary,department_id)
            VALUES ('${title}',${salary},${department_id});`);
            return addResult;
        }
        catch (err) {
            return err;
        }
    }

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
            const updateResult = await db.executeQuery(`UPDATE role SET ${params.set} 
            WHERE ${params.where};`);
            return updateResult;
        }
        catch (err) {
            console.log(err);
        }

    }

    async deleteRows(whereCondition) {
        if (typeof whereCondition === 'undefined') {
            const e = new Error();
            e.sqlMessage = 'Invalid SQL:WHERE condition not specified';
            throw e;
        }
        try {
            const deleteResult = await db.executeQuery(`DELETE FROM role WHERE ${whereCondition};`);
            return deleteResult;
        }
        catch (err) {
            return err;
        }

    }

    async getAllAsList(params = { where: '', orderBy: '', limit: '' }) {
        const roleList = [];
        try {
            const roles = await this.getAll(params);
            roles.forEach(r => {
                roleList.push(r.title);
            });
            return roleList;
        }
        catch (err) {
            return err;
        }
    }

    async getAll(params = { where: '', orderBy: '', limit: '' }) {
        let sqlQuery = 'SELECT * FROM role'
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
const roleOrm = new RoleORM();
module.exports = roleOrm;
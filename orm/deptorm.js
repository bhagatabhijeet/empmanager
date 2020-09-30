const db = require('./database');

let DepartmentORM = {
    //Add to department table
    async add(name) {
        try {
            const addResult = await db.executeQuery(`INSERT INTO department (name)
            VALUES ('${name}');`);
            return addResult;
        }
        catch (err) {
            return err;
        }
    },

    // Update department table
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
            const updateResult = await db.executeQuery(`UPDATE department SET ${params.set} 
            WHERE ${params.where};`);
            return updateResult;
        }
        catch (err) {
            console.log(err);
        }
    },

    // Delete from department table that meets the whereCondition
    async delete(whereCondition) {
        if (typeof whereCondition === 'undefined') {
            const e = new Error();
            e.sqlMessage = 'Invalid SQL:WHERE condition not specified';
            throw e;
        }
        try {
            const deleteResult = await db.executeQuery(`DELETE FROM department WHERE ${whereCondition};`);
            return deleteResult;
        }
        catch (err) {
            return err;
        }
    },

    // Get all records but as an Array
    async getAllAsList(params = { where: '', orderBy: '', limit: '' }) {
        const deptList = [];
        try {
            const departments = await this.getAll(params);
            departments.forEach(d => {
                deptList.push(d.name);
            });
            return deptList;
        }
        catch (err) {
            return err;
        }
    },
    
    // Get all records as recordset
    async getAll(params = { where: '', orderBy: '', limit: '' }) {
        let sqlQuery = 'SELECT * FROM department'
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
            const departments = await db.executeQuery(sqlQuery);
            return departments;
        }
        catch (err) {
            return err;
        }
    }
}

module.exports = DepartmentORM;
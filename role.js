const db = require('./database');
const cTable = require('console.table');
const inquirer = require('inquirer');

let Role = {

    //   async addEmployee() {
    //     console.log('Adding employee...');
    //   },

    async viewAllRolesForDepartment() {
        const departments = await db.executeQuery('SELECT * FROM department');
        console.log(departments);
        let departmentQuestion = [{
            message: 'Select Department',
            name: 'dept',
            type: "rawlist",
            choices: []
        }];
        departments.forEach(d => {
            departmentQuestion[0].choices.push(d.name);
        })
        let selectedDepartment = await inquirer.prompt(departmentQuestion);

        const rolesfordpartment = await db.executeQuery(`
        SELECT *
        FROM  role r
            INNER JOIN
        department d 
        ON r.department_id = d.id
        WHERE
        d.name = '${selectedDepartment.dept}';`);

        console.table(rolesfordpartment);

    },
    async viewAllRoles() {

        let sqlQuery = `SELECT * FROM role;`;

        try {
            const result = await db.executeQuery(sqlQuery);
            console.table(result);
        }
        catch (e) {
            console.log(e);
        }
    }
}

module.exports = Role;
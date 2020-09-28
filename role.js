const db = require('./database');
const cTable = require('console.table');
const inquirer = require('inquirer');
const Chalk = require('chalk');

let Role = {

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
    },

    async addNewRole() {
        const departments = await db.executeQuery('SELECT * FROM department');
        console.log(departments);
        let roleQuestions = [{
            message: 'Select Department',
            name: 'dept',
            type: "rawlist",
            choices: []
        },
        {
            message: 'role title',
            name: 'title',
            type: "input"
        },
        {
            message: 'role salary',
            name: 'salary',
            type: "input",

        }];
        departments.forEach(d => {
            roleQuestions[0].choices.push(d.name);
        })
        let roleAnswers = await inquirer.prompt(roleQuestions);

        const findDepartment = departments.find(e => e.name === roleAnswers.dept);

        try {
            await db.executeQuery(`INSERT INTO role (title,salary,department_id)
        VALUES ('${roleAnswers.title}',${roleAnswers.salary},${findDepartment.id});`);
            console.log(`${Chalk.green('New Role Added!')}`);
            const addedRole = await db.executeQuery(`SELECT * 
            FROM role WHERE department_id='${findDepartment.id}' 
            ORDER BY id desc limit 1;`);
            console.table(addedRole);
        }
        catch (err) {
            console.log(err);
        }
    }
}

module.exports = Role;
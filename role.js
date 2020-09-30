const roleORM = require('./orm/roleorm');
const departmentORM = require('./orm/deptorm');
const cTable = require('console.table');
const inquirer = require('inquirer');
const Chalk = require('chalk');

let Role = {

    async viewAllRolesForDepartment() {
        let departmentQuestion = [{
            message: 'Select Department >>',
            name: 'dept',
            type: "rawlist",
            pageSize:12,
            choices: []
        }];
        departmentQuestion[0].choices = await departmentORM.getAllAsList();
        departmentQuestion[0].choices.push(new inquirer.Separator());
        departmentQuestion[0].choices.push('Back To Main Menu');
        
        let selectedDepartment = await inquirer.prompt(departmentQuestion);
        if (selectedDepartment.dept.toUpperCase() === "BACK TO MAIN MENU") {
            return "MAIN_MENU";
        }

        try {
            const roles = await roleORM.get({
                sql: `SELECT r.id,r.title,r.salary,d.id as 'department_id',d.name as 'department_name'
                    FROM  role r
                        INNER JOIN
                    department d 
                    ON r.department_id = d.id`,
                where: `d.name = '${selectedDepartment.dept}'`
            });
            console.table(roles);
        }
        catch (err) {
            console.log(`${Chalk.yellow(err.sqlMessage)}`);
        }
    },
    async viewAllRoles() {
        try {
            const result = await roleORM.getAll();
            console.table(result);
        }
        catch (err) {
            console.log(`${Chalk.yellow(err.sqlMessage)}`);
        }
    },

    async addNewRole() {
        let roleQuestions = [{
            message: 'Select Department >>',
            name: 'dept',
            type: "rawlist",
            pageSize:12,
            choices: []
        },
        {
            message: 'role title : ',
            name: 'title',
            type: "input"
        },
        {
            message: 'role salary : ',
            name: 'salary',
            type: "input",

        }];

        roleQuestions[0].choices = await departmentORM.getAllAsList();
        roleQuestions[0].choices.push(new inquirer.Separator());
        roleQuestions[0].choices.push('Back To Main Menu');

        let roleAnswers = await inquirer.prompt(roleQuestions);
        if (roleAnswers.dept.toUpperCase() === "BACK TO MAIN MENU") {
            return "MAIN_MENU";
        }
        const departments = await departmentORM.getAll();
        const findDepartment = await departments.find(e => e.name === roleAnswers.dept);
        try {
            const addRoleResult = await roleORM.add(roleAnswers.title, roleAnswers.salary, findDepartment.id);
            const addedRole = await roleORM.getAll({
                where: `department_id='${findDepartment.id}'`,
                orderBy: `id desc`,
                limit: '1'
            });
            console.table(addedRole);
        }
        catch (err) {
            console.log(`${Chalk.yellow(err.sqlMessage)}`);
        }
    },
    async deleteRole() {
        try {
            let roleQuestion = [{
                message: 'Select Role To Delete >>',
                name: 'role',
                type: "rawlist",
                pageSize:12,
                choices: []

            }];
            roleQuestion[0].choices = await roleORM.getAllAsList();
            roleQuestion[0].choices.push(new inquirer.Separator());
            roleQuestion[0].choices.push('Back To Main Menu');
            const roleAnswer = await inquirer.prompt(roleQuestion);
            if (roleAnswer.role.toUpperCase() === "BACK TO MAIN MENU") {
                return "MAIN_MENU";
            }

            try {
                await roleORM.deleteRows(`title='${roleAnswer.role}'`);
                console.log(`${Chalk.green(`Role : '${roleAnswer.role}' is deleted!`)}`);
            }
            catch (err) {
                console.log(`${Chalk.yellow(err.sqlMessage)}`);
            }
        }
        catch (e) {
            console.log(e);
        }
    },
    async updateRole() {
        try {
            let roleQuestion = [{
                message: 'Select Role To Update >>',
                name: 'role',
                type: "rawlist",
                pageSize:12,
                choices: []

            },
            {
                message: 'Select New Department >>',
                name: 'dept',
                type: "rawlist",
                pageSize:12,
                choices: []

            },
            {
                message: 'New role title : ',
                name: 'title',
                type: "input"
            },
            {
                message: 'New role salary : ',
                name: 'salary',
                type: "input",

            }
            ];
            roleQuestion[0].choices = await roleORM.getAllAsList();
            roleQuestion[0].choices.push(new inquirer.Separator());
            roleQuestion[0].choices.push('Back To Main Menu');

            roleQuestion[1].choices = await departmentORM.getAllAsList();
            roleQuestion[1].choices.push(new inquirer.Separator());
            roleQuestion[1].choices.push('Back To Main Menu');
            const roleAnswer = await inquirer.prompt(roleQuestion);
            if (roleAnswer.role.toUpperCase() === "BACK TO MAIN MENU") {
                return "MAIN_MENU";
            }
            if (roleAnswer.dept.toUpperCase() === "BACK TO MAIN MENU") {
                return "MAIN_MENU";
            }
            const departments = await departmentORM.getAll();
            const findDepartment = await departments.find(e => e.name === roleAnswer.dept);
            try {
                await roleORM.update(
                    {
                        set:`title='${roleAnswer.title}',salary=${roleAnswer.salary},department_id=${findDepartment.id}`,
                        where:`title='${roleAnswer.role}'`
                    });
                console.log(`${Chalk.green(`Role : '${roleAnswer.role}' is Updated to New Role : '${roleAnswer.title}'!`)}`);
            }
            catch (err) {
                console.log(`${Chalk.yellow(err.sqlMessage)}`);
            }
        }
        catch (e) {
            console.log(e);
        }
    }
}

module.exports = Role;
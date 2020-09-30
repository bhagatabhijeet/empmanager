const departmentORM = require('./orm/deptorm');
const cTable = require('console.table');
const inquirer = require('inquirer');
const Chalk = require('chalk');

let Department = {

    // Add new Department
    async addNewDepartment() {
        let departmentQuestion = [{
            message: 'Enter Department Name : ',
            name: 'dept',
            type: "input"
        }];
        let departmentAnswer = await inquirer.prompt(departmentQuestion);

        try {
            const addResult = await departmentORM.add(`${departmentAnswer.dept}`);

            console.log(`${Chalk.green('New Department Added!')}`);
            const addedDepartment = await departmentORM.getAll({
                where: `name='${departmentAnswer.dept}'`,
                orderBy: `id desc`,
                limit: '1'
            });

            console.table(addedDepartment);
        }
        catch (err) {
            console.log(`${Chalk.yellow(err.sqlMessage)}`);
        }
    },

    // View All Departments
    async viewAllDepartments() {
        try {
            const departments = await departmentORM.getAll();
            console.table(departments);
        }
        catch (err) {
            console.log(`${Chalk.yellow(err.sqlMessage)}`);
        }

    },

    // Update Department
    async updateDepartment() {
        try {
            let departmentQuestion = [{
                message: 'Select Department To Update >>',
                name: 'dept',
                type: "rawlist",
                pageSize: 12,
                choices: []

            }];
            departmentQuestion[0].choices = await departmentORM.getAllAsList();
            departmentQuestion[0].choices.push(new inquirer.Separator());
            departmentQuestion[0].choices.push('Back To Main Menu');
            const departmentAnswer = await inquirer.prompt(departmentQuestion);
            if (departmentAnswer.dept.toUpperCase() === "BACK TO MAIN MENU") {
                return "MAIN_MENU";
            }

            let departmentUpdateQuestion = [{
                message: 'Enter Department Name : ',
                name: 'updatedept',
                type: "input"
            }];
            let departmentUpdateAnswer = await inquirer.prompt(departmentUpdateQuestion);

            try {
                const updateresult = await departmentORM.update(
                    {
                        set: `name='${departmentUpdateAnswer.updatedept}'`,
                        where: `name='${departmentAnswer.dept}'`
                    });
                console.log(`${Chalk.green(`Department : '${departmentAnswer.dept}' is Updated to '${departmentUpdateAnswer.updatedept}'!`)}`);
            }
            catch (err) {
                console.log(`${Chalk.yellow(err.sqlMessage)}`);
            }
        }
        catch (e) {
            console.log(e);
        }
    },
    
    // Delete Department
    async deleteDepartment() {
        try {
            let departmentQuestion = [{
                message: 'Select Department To Delete >>',
                name: 'dept',
                type: "rawlist",
                pageSize: 12,
                choices: []
            }];
            departmentQuestion[0].choices = await departmentORM.getAllAsList();
            departmentQuestion[0].choices.push(new inquirer.Separator());
            departmentQuestion[0].choices.push('Back To Main Menu');
            const departmentAnswer = await inquirer.prompt(departmentQuestion);
            if (departmentAnswer.dept.toUpperCase() === "BACK TO MAIN MENU") {
                return "MAIN_MENU";
            }
            try {
                const deleteResult = await departmentORM.deleteRows(`name='${departmentAnswer.dept}'`);
                console.log(`${Chalk.green(`Department : '${departmentAnswer.dept}' is deleted!`)}`);
            }
            catch (err) {
                console.log(err.sqlMessage);
            }
        }
        catch (e) {
            console.log(e);
        }
    }
}

module.exports = Department;
const db = require('./database');
const cTable = require('console.table');
const inquirer = require('inquirer');
const Chalk = require('chalk');

let Department = {

    async viewAllDepartments() {
        const departments = await db.executeQuery('SELECT * FROM department');
        console.table(departments);        
    },
    async updateDepartment() {
        try {
            const departments = await db.executeQuery("SELECT * FROM department");
            let departmentQuestion = [{
                message: 'Select Department To Update',
                name: 'dept',
                type: "rawlist",
                choices: []
            
            }];
            departments.forEach(d=>departmentQuestion[0].choices.push(d.name));
            const departmentAnswer = await inquirer.prompt(departmentQuestion);

            let departmentUpdateQuestion = [{
                message: 'Enter Department Name',
                name: 'updatedept',
                type: "input"            
            }];
            let departmentUpdateAnswer = await inquirer.prompt(departmentUpdateQuestion);

            try{
            await db.executeQuery(`UPDATE department SET name='${departmentUpdateAnswer.updatedept}'
            WHERE name='${departmentAnswer.dept}';`);
            console.log(`${Chalk.green(`Department : '${departmentAnswer.dept}' is Updated to '${departmentUpdateAnswer.updatedept}'!`)}`);
            }
            catch(err){
                console.log(err);
            }        
        }
        catch (e) {
            console.log(e);
        }
    },

    async addNewDepartment() {
        let departmentQuestion = [{
            message: 'Enter Department Name',
            name: 'dept',
            type: "input"            
        }];
        let departmentAnswer = await inquirer.prompt(departmentQuestion);

        try {
            await db.executeQuery(`INSERT INTO department (name)
            VALUES ('${departmentAnswer.dept}');`);

            console.log(`${Chalk.green('New Department Added!')}`);
            const addedDepartment = await db.executeQuery(`SELECT * 
            FROM department WHERE name='${departmentAnswer.dept}' 
            ORDER BY id desc limit 1;`);
            console.table(addedDepartment);
        }
        catch (err) {
            console.log(err);
        }
    },
    async deleteDepartment(){
        try {
            const departments = await db.executeQuery("SELECT * FROM department");
            let departmentQuestion = [{
                message: 'Select Department To Delete',
                name: 'dept',
                type: "rawlist",
                choices: []
            
            }];
            departments.forEach(d=>departmentQuestion[0].choices.push(d.name));
            const departmentAnswer = await inquirer.prompt(departmentQuestion);
            try{
            await db.executeQuery(`DELETE FROM department WHERE name='${departmentAnswer.dept}';`);
            console.log(`${Chalk.green(`Department : '${departmentAnswer.dept}' is deleted!`)}`);
            }
            catch(err){
                console.log(err);
            }

            
        }
        catch (e) {
            console.log(e);
        }
    }
}

module.exports = Department;
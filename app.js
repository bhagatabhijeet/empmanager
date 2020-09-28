// import * as mysql from "mysql";
const CFonts = require('cfonts');
const chalk = require("chalk");
const inquirer = require('inquirer')
const Employee = require('./employee');

// import boxen, { BorderStyle } from "boxen";
// import { formatWithOptions } from "util";

// ***********************   WELCOME SCREEN ******************************************************************
//#region welcomScreen 
CFonts.say('Emp.Manager', {
    font: 'block',
    align: 'center',
    colors: ['red', 'blue'],
    background: 'transparent',
    letterSpacing: 1,
    lineHeight: 1,
    space: true,
    maxLength: '0',
    gradient: ['red', 'blue'],
    independentGradient: false,
    transitionGradient: false,
    env: 'node'
});

console.log(chalk.magenta(`			Developer : Abhijeet Bhagat (https://github.com/bhagatabhijeet)`));
console.log(`			GitHub Repo : https://github.com/bhagatabhijeet/empmanager`);
//#endregion
// ***********************************************************************************************************

process.on('exit', (code) => {
    console.log('bye');
})

process.on('SIGINT', () => {
    console.log('Adios!');
}
);
process.on('beforeExit',(c)=>{
    console.log(c);
});

async function init() {
    let continueAsking = true;
    while (continueAsking) {
        let empoperation = await inquirer.prompt([
            {
                message: 'What would you like to do?',
                name: 'operation',
                type: "rawlist",
                choices: [
                    'View All Employees',
                    'View All Employees By Department',
                    'View All Emplyees By Manager',
                    'Add Employee',
                    'Remove Employee',
                    'Update Employee Role',
                    'Update Employee Manager',
                    'View All Roles',
                    'Add New Role',
                    'Update Role',
                    'Delete Role',
                    'View All Departments',
                    'Add New Department',
                    'Update Department',
                    'Delete Department',
                    'View Total Utilized Budget Of Department'

                ]
            }
            
        ]);
        console.log(empoperation);
        switch (empoperation.operation.toUpperCase()) {
            case 'VIEW ALL EMPLOYEES':
                await Employee.viewAllEmployees();               
        }

        let continueQuestion = await inquirer.prompt([
            {
                message: 'Continue?',
                type: 'confirm',
                name: 'continueAsking'
            }
        ]);
        continueAsking = continueQuestion.continueAsking;
    }
}



init();

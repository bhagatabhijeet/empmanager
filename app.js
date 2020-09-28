const CFonts = require('cfonts');
const chalk = require("chalk");
const inquirer = require('inquirer')
const db = require('./database');
const Employee = require('./employee');


// ***********************   WELCOME SCREEN ******************************************************************
//#region welcomScreen 
CFonts.say('Emp.Manager', {
    font: 'block',
    align: 'center',
    colors: ['green','blue', 'red'],
    background: 'transparent',
    letterSpacing: 1,
    lineHeight: 1,
    space: true,
    maxLength: '0',
    gradient: false,
    independentGradient: false,
    transitionGradient: false,
    env: 'node'
});

console.log(chalk.magenta(`			Developer : Abhijeet Bhagat (https://github.com/bhagatabhijeet)`));
console.log(`			GitHub Repo : https://github.com/bhagatabhijeet/empmanager`);
console.log();
console.log();
//#endregion
// ***********************************************************************************************************

process.on('exit', (code) => {
    console.log(`Thanks for using ${chalk.magentaBright('Emp.Manager!')}`);
})

process.on('beforeExit', (c) => {
    console.log(`${chalk.magentaBright('Ok!')}`);
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
                    'View All Roles For A Department',
                    'Add New Role',
                    'Update Role',
                    'Delete Role',
                    'View All Departments',
                    'Add New Department',
                    'Update Department',
                    'Delete Department',
                    'View Total Utilized Budget Of Department',
                    'DB Seed Data'
                ]
            }
            // ,
            // {
            //     message:"Select the option for seeding",
            //     name: 'dboperation',
            //     type:'expand',
            //     choices:[{
            //         key:'s',
            //         name:'Create Schema Only',
            //         value:'createSchemaOnly',
            //     },{
            //         key:'d',
            //         name:'Re-Seed Entire Schema',
            //         value:'createSchemaAndData',
            //     }]


            // }

        ]);
        console.log(empoperation);
        switch (empoperation.operation.toUpperCase()) {
            case 'VIEW ALL EMPLOYEES':
                await Employee.viewAllEmployees();
                break;
            case 'DB SEED DATA':
                await db.seedData();
                break;
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
    process.exit(0);
}


init();

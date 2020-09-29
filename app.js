const CFonts = require('cfonts');
const chalk = require("chalk");
const inquirer = require('inquirer')
const db = require('./database');
const Employee = require('./employee');
const Role = require('./role');
const Department = require('./department');


// ***********************   WELCOME SCREEN ******************************************************************
//#region welcomScreen 
CFonts.say('Emp.Manager', {
    font: 'block',
    align: 'center',
    colors: ['green', 'blue', 'red'],
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
    var ui = new inquirer.ui.BottomBar();
    
    while (continueAsking) {
        ui.updateBottomBar(`${chalk.bgMagenta('[Enter Number To Select Operation Or Select Using Arrow Keys]')}\n`);
        let empoperation = await inquirer.prompt([
            {
                message: 'What would you like to do? >>',
                name: 'operation',
                type: "rawlist",
                pageSize:12,
                choices: [
                    'View All Employees',
                    'View All Employees By Department',
                    'View All Employees By Manager',
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
                    'DB Seed Data',
                    new inquirer.Separator(),
                    'Exit'
                ]
            }            
        ]);
        // console.log(empoperation);

        // Two blank lines on the console.Just for better looking.
        console.log();console.log();

        switch (empoperation.operation.toUpperCase()) {
            case 'VIEW ALL EMPLOYEES':
                await Employee.viewAllEmployees();
                break;
            case 'VIEW ALL EMPLOYEES BY DEPARTMENT':
                console.log("Not Implemented");
                break;
            case 'VIEW ALL EMPLOYEES BY MANAGER':
                await Employee.viewAllEmployeesByManager();
                break;
            case 'ADD EMPLOYEE':
                console.log("Not Implemented");
                break;
            case 'REMOVE EMPLOYEE':
                await Employee.removeEmployee();
                break;
            case 'UPDATE EMPLOYEE ROLE':
                console.log("Not Implemented");
                break;
            case 'UPDATE EMPLOYEE MANAGER':
                console.log("Not Implemented");
                break;
            case 'VIEW ALL ROLES':
                await Role.viewAllRoles();
                break;
            case 'VIEW ALL ROLES FOR A DEPARTMENT':
                await Role.viewAllRolesForDepartment();
                break;
            case 'ADD NEW ROLE':
                await Role.addNewRole();
                break;
            case 'UPDATE ROLE':
                console.log("Not Implemented");
                break;
            case 'DELETE ROLE':
                await Role.deleteRole();
                break;
            case 'VIEW ALL DEPARTMENTS':
                await Department.viewAllDepartments();
                break;
            case 'ADD NEW DEPARTMENT':
                await Department.addNewDepartment();
                break;
            case 'UPDATE DEPARTMENT':
                if(await Department.updateDepartment() === 'MAIN_MENU'){
                    continue;
                }
                break;
            case 'DELETE DEPARTMENT':
                if(await Department.deleteDepartment()  === 'MAIN_MENU'){
                    continue;
                }
                break;
            case 'VIEW TOTAL UTILIZED BUDGET OF DEPARTMENT':
                console.log("Not Implemented");
                break;
            case 'DB SEED DATA':
                await db.seedData();
                break;
            case 'EXIT':
                process.exit(0);         
        }

        let continueQuestion = await inquirer.prompt([
            {
                message: chalk.bgMagenta('Continue? : '),
                type: 'confirm',
                name: 'continueAsking'
            }
        ]);
        continueAsking = continueQuestion.continueAsking;
    }
    process.exit(0);
}


init();

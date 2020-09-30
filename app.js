const CFonts = require('cfonts');
const chalk = require("chalk");
const inquirer = require('inquirer')
const Employee = require('./employee');
const Role = require('./role');
const Department = require('./department');
const Admin = require('./admin');


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
                pageSize: 16,
                choices: [
                    new inquirer.Separator('---------- EMPLOYEE OPERATIONS ----------'),
                    'View All Employees',
                    'View All Employees In A Department',
                    'View All Employees By Manager',
                    'Add Employee',
                    'Remove Employee',
                    'Update Employee',
                    new inquirer.Separator('---------- ROLE OPERATIONS --------------'),
                    'View All Roles',
                    'View All Roles For A Department',
                    'Add New Role',
                    'Update Role',
                    'Delete Role',
                    new inquirer.Separator('---------- DEPARTMENT OPERATIONS --------'),
                    'View All Departments',
                    'Add New Department',
                    'Update Department',
                    'Delete Department',
                    'View Total Utilized Budget Of Department',
                    'View Total Utilized Budget By Department',
                    new inquirer.Separator('---------- DB ADMIN OPERATIONS ----------'),
                    'DB Seed Data',
                    new inquirer.Separator(),
                    'Exit'
                ]
            }
        ]);

        // Two blank lines on the console.Just for better looking.
        console.log(); console.log();

        switch (empoperation.operation.toUpperCase()) {
            case 'VIEW ALL EMPLOYEES':
                await Employee.viewAllEmployees();
                break;
            case 'VIEW ALL EMPLOYEES IN A DEPARTMENT':
                if (await Employee.viewAllEmployeesInDepartment() === 'MAIN_MENU') {
                    continue;
                }
                break;
            case 'VIEW ALL EMPLOYEES BY MANAGER':
                await Employee.viewAllEmployeesByManager();
                break;
            case 'ADD EMPLOYEE':
                if (await Employee.addNewEmployee() === 'MAIN_MENU') {
                    continue;
                }
                break;
            case 'REMOVE EMPLOYEE':
                if (await Employee.removeEmployee() === 'MAIN_MENU') {
                    continue;
                }
                break;
            case 'UPDATE EMPLOYEE':
                if (await Employee.updateEmployee() === 'MAIN_MENU') {
                    continue;
                }
                break;
            case 'VIEW ALL ROLES':
                await Role.viewAllRoles();
                break;
            case 'VIEW ALL ROLES FOR A DEPARTMENT':
                if (await Role.viewAllRolesForDepartment() === 'MAIN_MENU') {
                    continue;
                }
                break;
            case 'ADD NEW ROLE':
                if (await Role.addNewRole() === 'MAIN_MENU') {
                    continue;
                }
                break;
            case 'UPDATE ROLE':
                if (await Role.updateRole() === 'MAIN_MENU') {
                    continue;
                }
                break;
            case 'DELETE ROLE':
                if (await Role.deleteRole() === 'MAIN_MENU') {
                    continue;
                }
                break;
            case 'VIEW ALL DEPARTMENTS':
                await Department.viewAllDepartments();
                break;
            case 'ADD NEW DEPARTMENT':
                await Department.addNewDepartment();
                break;
            case 'UPDATE DEPARTMENT':
                if (await Department.updateDepartment() === 'MAIN_MENU') {
                    continue;
                }
                break;
            case 'DELETE DEPARTMENT':
                if (await Department.deleteDepartment() === 'MAIN_MENU') {
                    continue;
                }
                break;
            case 'VIEW TOTAL UTILIZED BUDGET OF DEPARTMENT':
                if(await Employee.viewTotalUtilizedBudgetOfDepartment()  === 'MAIN_MENU') {
                    continue;
                }
                break;
            case 'VIEW TOTAL UTILIZED BUDGET BY DEPARTMENT':
                await Employee.viewTotalUtilizedBudgetByDepartment();
                break;
            case 'DB SEED DATA':
                await Admin.seedData();
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

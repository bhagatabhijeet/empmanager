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

// Event handler when process exits
process.on('exit', (code) => {
    console.log(`Thanks for using ${chalk.magentaBright('Emp.Manager!')}`);
})

// Event handler befor process exit
process.on('beforeExit', (c) => {
    console.log(`${chalk.magentaBright('Ok!')}`);
});

/**
 * @description init is the main function.The job of init is to route the calls to appropriate entities
 * e.g Employee.ViewAllEmployees, Role.viewAllRoles etc.
 * init supports 19 operations.
 * @author Abhijeet Bhagat
 */
async function init() {
    let continueAsking = true;
    var ui = new inquirer.ui.BottomBar();

    // Loop to ask user if he wants to continue
    while (continueAsking) {
        // Use of bottom bar. This will show a constant message on screen
        ui.updateBottomBar(`${chalk.bgMagenta('[Enter Number To Select Operation Or Select Using Arrow Keys]')}\n`);
        let empoperation = await inquirer.prompt([
            {
                message: 'What would you like to do? >>',
                name: 'operation',
                type: "rawlist",
                pageSize: 16,  // Render 15 Items at once
                choices: [
                    // **************   THIS IS OUR MAIN MENU *************************
                    // Use of separator to enhance UX
                    new inquirer.Separator('---------- EMPLOYEE OPERATIONS ----------'),
                    'View All Employees',                           /* Operation 1 */
                    'View All Employees In A Department',           /* Operation 2 */
                    'View All Employees By Manager',                /* Operation 3 */
                    'Add Employee',                                 /* Operation 4 */
                    'Remove Employee',                              /* Operation 5 */
                    'Update Employee',                              /* Operation 6 */
                    // Use of separator to enhance UX
                    new inquirer.Separator('---------- ROLE OPERATIONS --------------'),
                    'View All Roles',                               /* Operation 7 */
                    'View All Roles For A Department',              /* Operation 8 */
                    'Add New Role',                                 /* Operation 9 */
                    'Update Role',                                  /* Operation 10 */
                    'Delete Role',                                  /* Operation 11 */
                    // Use of separator to enhance UX
                    new inquirer.Separator('---------- DEPARTMENT OPERATIONS --------'),
                    'View All Departments',                         /* Operation 12 */
                    'Add New Department',                           /* Operation 13 */
                    'Update Department',                            /* Operation 14 */
                    'Delete Department',                            /* Operation 15 */
                    'View Total Utilized Budget Of Department',     /* Operation 16 */
                    'View Total Utilized Budget By Department',     /* Operation 17 */
                    // Use of separator to enhance UX
                    new inquirer.Separator('---------- DB ADMIN OPERATIONS ----------'),
                    'DB Seed Data',                                 /* Operation 18 */
                    new inquirer.Separator(),
                    // Allow User to gracefully exit
                    'Exit'                                          /* Operation 19 */
                ]
            }
        ]);

        // Two blank lines on the console.Just for better looking.
        console.log(); console.log();

        // Switch statement to route call to approprite entities vis Employee, Department or Role
        // All calls use await syntax

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
                if (await Employee.viewTotalUtilizedBudgetOfDepartment() === 'MAIN_MENU') {
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

        // Confirmation to continue
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

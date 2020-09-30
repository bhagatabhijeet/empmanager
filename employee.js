const empORM = require('./orm/emporm');
const departmentORM = require('./orm/deptorm');
const inquirer = require('inquirer');
const Chalk = require('chalk');
const cTable = require('console.table');

let Employee = {
  async addEmployee() {
    console.log('Adding employee...');
  },
  async viewAllEmployees() {
    try {
      const result = await empORM.getAll();
      console.table(result);
    }
    catch (err) {
      console.log(`${Chalk.yellow(err.sqlMessage)}`);
    }
  },
  async viewAllEmployeesByManager() {
    let managerQuestion = [{
      message: 'Enter Manager Name : ',
      name: 'manager',
      type: "input"
    }];
    let managerAnswer = await inquirer.prompt(managerQuestion);
    try {
      let employees = await empORM.get({
        sql: `SELECT e1.*,e2.first_name as 'manager' FROM employee e1
            INNER JOIN employee e2
            ON e1.manager_id = e2.id`,
        where: `e2.first_name LIKE '%${managerAnswer.manager}%'`
      });

      if (employees.length > 0) {
        console.table(employees);
      }
      else {
        console.log(`${Chalk.green(`No Records Found!!`)}`);
      }
    }
    catch (err) {
      console.log(`${Chalk.yellow(err.sqlMessage)}`);
    }
  },
  async viewAllEmployeesInDepartment() {
    const departments = await departmentORM.getAllAsList();

    let departmentQuestion = [{
      message: 'Select Department >>',
      name: 'dept',
      type: "rawlist",
      pageSize: 12,
      choices: []
    }];
    departmentQuestion[0].choices = departments;
    departmentQuestion[0].choices.push(new inquirer.Separator());
    departmentQuestion[0].choices.push('Back To Main Menu');

    let departmentAnswer = await inquirer.prompt(departmentQuestion);
    if (departmentAnswer.dept.toUpperCase() === "BACK TO MAIN MENU") {
      return "MAIN_MENU";
    }
    try {
      let employees = await empORM.getAll({
        where: `d.name ='${departmentAnswer.dept}'`
      });

      if (employees.length > 0) {
        console.table(employees);
      }
      else {
        console.log(`${Chalk.green(`No Records Found!!`)}`);
      }
    }
    catch (err) {
      console.log(`${Chalk.yellow(err.sqlMessage)}`);
    }
  },
  async removeEmployee() {
    let empQuestion = [{
      message: 'Enter Employee Firstname : ',
      name: 'empfirst',
      type: "input"
    },
    {
      message: 'Enter Employee Lastname : ',
      name: 'emplast',
      type: "input"
    }
    ];
    let empAnswer = await inquirer.prompt(empQuestion);

    // First Query Employee Table to check if record count is more than one
    try {
      let employees = await empORM.getAllNoJoin({
        where:`first_name LIKE '%${empAnswer.empfirst}%' and last_name like '%${empAnswer.emplast}%'`
      });

      if (employees.length > 1) {
        console.log(`${Chalk.green(`More than 1 record found. Select among the following to remove`)}`);
        const choices = [];
        employees.forEach(e => {
          choices.push(`${e.id}:${e.first_name} ${e.last_name}`);
        });
        choices.push(new inquirer.Separator());
        choices.push('Back To Main Menu');
        let empDelSelect = await inquirer.prompt([{
          message: "Select Employee To Remove >>",
          name: 'delemp',
          type: 'rawlist',
          pageSize: 15,
          choices: choices
        }]);
        if (empDelSelect.delemp.toUpperCase() === "BACK TO MAIN MENU") {
          return "MAIN_MENU";
        }

        let empIdToDelete = empDelSelect.delemp.split(':')[0];
        
        try {
          await empORM.deleteRows(`id=${empIdToDelete}`)
          console.log(`${Chalk.green(`Employee with Empoyee Id : ${empIdToDelete} Removed!`)}`);
        }
        catch (err) {
          console.log(err.sqlMessage);
        }

      }
      else {
        try {
          await empORM.deleteRows(`first_name LIKE '%${empAnswer.empfirst}%' and last_name LIKE '%${empAnswer.emplast}%'`);
          console.log(`${Chalk.green(`employee whose first_name LIKE '%${empAnswer.empfirst}%' last_name LIKE '%${empAnswer.emplast}%' Removed!`)}`);
        }
        catch (err) {
          console.log(err.sqlMessage);
        }
      }
    }
    catch (err) {
      console.log(err.sqlMessage);
    }
  }
}



module.exports = Employee;
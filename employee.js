const empORM = require('./orm/emporm');
const inquirer = require('inquirer');
const Chalk = require('chalk');
const cTable = require('console.table');

let Employee = {
  async addEmployee() {
    console.log('Adding employee...');
  },
  async viewAllEmployees() {
    let sqlQuery = `
          SELECT 
              e.id,
              e.first_name,
              e.last_name,
              r.title,
              r.salary,
              d.name 'department',
              e1.first_name AS 'manager'
          FROM
              employee e
                  LEFT JOIN
              employee e1 ON e.manager_id = e1.id
                  INNER JOIN
              role r ON e.role_id = r.id
                  INNER JOIN
              department d ON r.department_id = d.id;`

    try {
      const result = await empORM.get({
        sql: sqlQuery
      });
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
        sql:`SELECT e1.*,e2.first_name as 'manager' FROM employee e1
            INNER JOIN employee e2
            ON e1.manager_id = e2.id`,
        where:`e2.first_name LIKE '%${managerAnswer.manager}%'`    
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
      let employees = await db.executeQuery(`
        SELECT id,first_name,last_name FROM employee        
        WHERE first_name LIKE '%${empAnswer.empfirst}%' and last_name like '%${empAnswer.emplast}%';`);

      if (employees.length > 0) {
        console.log(`${Chalk.green(`More than 1 record found. Select among the following to remove`)}`);
        const choices = [];
        employees.forEach(e => {
          choices.push(`${e.id}:${e.first_name} ${e.last_name}`);
        });
        let empDelSelect = await inquirer.prompt([{
          message: "Select Employee To Remove >>",
          name: 'delemp',
          type: 'rawlist',
          pageSize: 15,
          choices: choices
        }]);
        let empIdToDelete = empDelSelect.delemp.split(':')[0];
        console.log(empIdToDelete);
        try {
          await db.executeQuery(`DELETE FROM employee WHERE id=${empIdToDelete}`);
          console.log(`${Chalk.green(`Employee with Empoyee Id : ${empIdToDelete} Removed!`)}`);
        }
        catch (err) {
          console.log(err.sqlMessage);
        }

      }
      else {
        try {
          await db.executeQuery(`DELETE FROM employee WHERE first_name LIKE '%${empAnswer.empfirst}%' last_name LIKE '%${empAnswer.emplast}%'`);
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
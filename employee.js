const db = require('./database');
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
      const result = await db.executeQuery(sqlQuery);
      console.table(result);
    }
    catch (e) {
      console.log(e);
    }
  }
  ,
  async viewAllEmployeesByManager() {
    let managerQuestion = [{
      message: 'Enter Manager Name : ',
      name: 'manager',
      type: "input"
    }];
    let managerAnswer = await inquirer.prompt(managerQuestion);
    try {
      let employees = await db.executeQuery(`
        SELECT e1.*,e2.first_name as 'manager' FROM employee e1
        INNER JOIN employee e2
        ON e1.manager_id = e2.id
        WHERE e2.first_name LIKE '%${managerAnswer.manager}%';`);
     
      if (employees.length > 0) {
        console.table(employees);
      }
      else {
        console.log(`${Chalk.green(`No Records Found!!`)}`);
      }
    }
    catch (err) {
      console.log(err.sqlMessage);
    }
  }
}



module.exports = Employee;
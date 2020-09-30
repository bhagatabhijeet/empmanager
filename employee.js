const empORM = require('./orm/emporm');
const departmentORM = require('./orm/deptorm');
const roleORM = require('./orm/roleorm');
const inquirer = require('inquirer');
const Chalk = require('chalk');
const cTable = require('console.table');

let Employee = {

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
        where: `first_name LIKE '%${empAnswer.empfirst}%' and last_name like '%${empAnswer.emplast}%'`
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
          console.log(`${Chalk.yellow(err.sqlMessage)}`);
        }

      }
      else {
        try {
          await empORM.deleteRows(`first_name LIKE '%${empAnswer.empfirst}%' and last_name LIKE '%${empAnswer.emplast}%'`);
          console.log(`${Chalk.green(`employee whose first_name LIKE '%${empAnswer.empfirst}%' last_name LIKE '%${empAnswer.emplast}%' Removed!`)}`);
        }
        catch (err) {
          console.log(`${Chalk.yellow(err.sqlMessage)}`);
        }
      }
    }
    catch (err) {
      console.log(`${Chalk.yellow(err.sqlMessage)}`);
    }
  },
  async addNewEmployee() {
    let empQuestions = [
      {
        message: 'Firstname : ',
        name: 'firstname',
        type: "input"
      },
      {
        message: 'Lastname : ',
        name: 'lastname',
        type: "input"
      }];
    let departmentQuestion = [
      {
        message: 'Select Department >>',
        name: 'dept',
        type: "rawlist",
        pageSize: 12,
        choices: []
      }];
    let roleQuestion = [
      {
        message: 'Select Role >>',
        name: 'role',
        type: "rawlist",
        pageSize: 12,
        choices: []
      }];
    let managerQuestion = [
      {
        message: 'Select Manager >>',
        name: 'manager',
        type: "rawlist",
        pageSize: 12,
        choices: []
      }];

    const empAnswers = await inquirer.prompt(empQuestions);

    departmentQuestion[0].choices = await departmentORM.getAllAsList();
    departmentQuestion[0].choices.push(new inquirer.Separator());
    departmentQuestion[0].choices.push('Back To Main Menu');

    const departmentAnswer = await inquirer.prompt(departmentQuestion);
    if (departmentAnswer.dept.toUpperCase() === "BACK TO MAIN MENU") {
      return "MAIN_MENU";
    }

    const department = await departmentORM.getAll({
      where: `name='${departmentAnswer.dept}'`
    });

    roleQuestion[0].choices = await roleORM.getAllAsList({
      where: `department_id=${department[0].id}`
    });
    roleQuestion[0].choices.push(new inquirer.Separator());
    roleQuestion[0].choices.push('Back To Main Menu');

    let roleAnswer = await inquirer.prompt(roleQuestion);
    if (roleAnswer.role.toUpperCase() === "BACK TO MAIN MENU") {
      return "MAIN_MENU";
    }
    const role = await roleORM.getAll({
      where: `title='${roleAnswer.role}'`
    });
    // console.log(role);

    const EmployeesInDepartment = await empORM.getAll({
      where: `d.name ='${departmentAnswer.dept}'`
    });


    EmployeesInDepartment.forEach(emp => {
      managerQuestion[0].choices.push(emp.id + ":" + emp.first_name + " " + emp.last_name);
    });

    const managerAnswer = await inquirer.prompt(managerQuestion);

    try {
      // console.log(role);
      const empAddResult = empORM.add(empAnswers.firstname, empAnswers.lastname, role[0].id, managerAnswer.manager.split(':')[0]);
      if (empAddResult.affectedRows === "1") {
        console.log(`${Chalk.green(`New Employee(id:'${empAddResult.insertId}') Successfully Added!`)}`);
      }
    }
    catch (err) {
      console.log(`${Chalk.yellow(err.sqlMessage)}`);
    }
  },

  async viewTotalUtilizedBudgetByDepartment() {
    try {
      const result = await empORM.get({
        sql: `SELECT d.id,d.name, sum(r.salary) as 'total_utilized_budget' FROM employee e
        INNER JOIN role r
        on e.role_id = r.id
        INNER JOIN department d
        on r.department_id=d.id
        group by d.id`,
        orderBy: 'id asc'
      });
      console.table(result);
    }
    catch (err) {
      console.log(`${Chalk.yellow(err.sqlMessage)}`);
    }

  },
  async viewTotalUtilizedBudgetOfDepartment() {
    let departmentQuestion = [
      {
        message: 'Select Department >>',
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

    const department = await departmentORM.getAll({
      where: `name='${departmentAnswer.dept}'`
    });
    try {
      const result = await empORM.get({
        sql: `SELECT d.id,d.name, sum(r.salary) as 'total_utilized_budget' FROM employee e
        INNER JOIN role r
        on e.role_id = r.id
        INNER JOIN department d
        on r.department_id=d.id
        where d.id=${department[0].id}
        group by d.id`,
        orderBy: 'id asc'
      });
      if (result.length > 0) {
        console.table(result);
      }
      else {
        console.log("dept id : " + department[0].id);
        console.log("dept name : " + departmentAnswer.dept);
        console.log();
        let created_result = [{
          id: department[0].id,
          name: departmentAnswer.dept,
          total_utilized_budget: 0
        }];
        console.table(created_result);
      }

    }
    catch (err) {
      console.log(`${Chalk.yellow(err.sqlMessage)}`);
    }

  },
  async updateEmployee() {
    // Get the Employee Id from user to Update
    let empInitialQuestion = [
      {
        message: 'Enter Employee Id To Update : ',
        name: 'empid',
        type: "input"
      }
    ];
    const empInitialAnswer = await inquirer.prompt(empInitialQuestion);
    // Show the employee details to the user and get confirmation if he really wants to update this employee
    const showEmployee = await empORM.getAllNoJoin({
      where: `id=${empInitialAnswer.empid}`
    });
    if (showEmployee.length > 0) {
      console.log(`${Chalk.yellow("You are about to update following employee")}`);
      console.log();
      console.table(showEmployee);
      console.log();
    }
    else {
      console.log(`${Chalk.yellow("No Records Found!")}`);
      console.log();
      return;
    }
    const empUpdateConfirm = await inquirer.prompt([
      {
        message: 'Are you sure you want to proceed : ',
        name: 'proceed',
        type: "confirm"
      }
    ]);
    if (!empUpdateConfirm.proceed) {
      return;
    }

    const empUpdateQuestions = [
      {
        message: 'Firstname : ',
        name: 'firstname',
        type: "input",
        default: `${showEmployee[0].first_name}`
      },
      {
        message: 'Lastname : ',
        name: 'lastname',
        type: "input",
        default: `${showEmployee[0].last_name}`
      },
      {
        message: 'Select Role >>',
        name: 'role',
        type: "rawlist",
        choices: []
      }

    ];
    empUpdateQuestions[2].choices = await roleORM.getAllAsList();
    empUpdateQuestions[2].choices.push(new inquirer.Separator());
    empUpdateQuestions[2].choices.push('Back To Main Menu');
    console.log();
    console.log(`${Chalk.yellow("Leave empty and press enter if you want to use existing name.")}`);
    console.log();
    const empUpdateAnswer = await inquirer.prompt(empUpdateQuestions);
    if (empUpdateAnswer.role.toUpperCase() === "BACK TO MAIN MENU") {
      return "MAIN_MENU";
    }
    const role = await roleORM.getAll({
      where: `title='${empUpdateAnswer.role}'`
    });

    const empUpdateManagerQuestion = [
      {
        message: 'Select Manager >>',
        name: 'manager',
        type: "rawlist",
        choices: []
      }];

    const EmployeesInDepartment = await empORM.getAll({
      where: `d.id =${role[0].department_id} and e.id <> ${showEmployee[0].id}`
    });


    EmployeesInDepartment.forEach(emp => {
      empUpdateManagerQuestion[0].choices.push(emp.id + ":" + emp.first_name + " " + emp.last_name);
    });

    empUpdateManagerQuestion[0].choices.push(new inquirer.Separator());
    empUpdateManagerQuestion[0].choices.push('Back To Main Menu');

    const empUpdateManagerAnswer = await inquirer.prompt(empUpdateManagerQuestion);
    if (empUpdateManagerAnswer.manager.toUpperCase() === "BACK TO MAIN MENU") {
      return "MAIN_MENU";   
    }

    try{
      const empUpdateResult = await empORM.update({
        set:`first_name='${empUpdateAnswer.firstname}',last_name='${empUpdateAnswer.lastname}',
        role_id=${role[0].id},manager_id=${empUpdateManagerAnswer.manager.split(':')[0]}`,
        where:`id=${showEmployee[0].id}`
      });
            
      if (empUpdateResult.affectedRows === 1) {        
        console.log(`${Chalk.green(`Employee(id:'${showEmployee[0].id}') Successfully Updated!`)}`);
        console.log();
      }
    }
    catch(err){
      console.log(`${Chalk.yellow(err.sqlMessage)}`);
    }

  }

}

module.exports = Employee;
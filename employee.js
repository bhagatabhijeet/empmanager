const chalk = require('chalk');
// eslint-disable-next-line no-unused-vars
const cTable = require('console.table');
const inquirer = require('inquirer');
const empORM = require('./orm/emporm');
const departmentORM = require('./orm/deptorm');
const roleORM = require('./orm/roleorm');
const validators = require('./validators');
const { printHelperMessage } = require('./utils');

const Employee = {
  // View All Employees
  async viewAllEmployees() {
    try {
      // Get All employee recordsets using empORM
      const result = await empORM.getAll();
      console.table(result);
    } catch (err) {
      console.log(`${chalk.yellow(err.sqlMessage)}`);
    }
  },
  // View All Employees BY Manager
  async viewAllEmployeesByManager() {
    // Ask user to enter Manager Name
    const managerQuestion = [{
      message: 'Enter Manager Name : ',
      name: 'manager',
      type: 'input'
    }];
    console.log(`${chalk.yellow('Leave Manager Name Blank To Select All Employees Having Manager')}`);

    await printHelperMessage();

    const managerAnswer = await inquirer.prompt(managerQuestion);
    if (managerAnswer.manager.toUpperCase() === '!Q') {
      return 'MAIN_MENU';
    }
    try {
      // Get all employees where Manager name like the one entered above
      const employees = await empORM.get({
        sql: `SELECT e1.*,e2.first_name as 'manager' FROM employee e1
            INNER JOIN employee e2
            ON e1.manager_id = e2.id`,
        where: `e2.first_name LIKE '%${managerAnswer.manager}%'`
      });

      // If there are records found then show
      if (employees.length > 0) {
        console.log(); // Blank link for better UX
        console.table(employees);
        console.log(); // Blank link for better UX
      } else {
        // Convey to the user that there are no records
        console.log(); // Blank link for better UX
        console.log(`${chalk.green('No Records Found!!')}`);
        console.log(); // Blank link for better UX
      }
    } catch (err) {
      console.log(`${chalk.yellow(err.sqlMessage)}`);
    }
    return '';
  },

  // View All Employees in a department
  async viewAllEmployeesInDepartment() {
    // First get all departments in a list using departmentORM.getAllAsList
    const departments = await departmentORM.getAllAsList();

    const departmentQuestion = [{
      message: 'Select Department >>',
      name: 'dept',
      type: 'rawlist',
      pageSize: 12,
      choices: []
    }];

    // Populate the select department question choices with the fetched department
    departmentQuestion[0].choices = departments;
    // Additionally add 'BACK TO MAIN MENU' as choice
    departmentQuestion[0].choices.push(new inquirer.Separator());
    departmentQuestion[0].choices.push('Back To Main Menu');

    const departmentAnswer = await inquirer.prompt(departmentQuestion);
    // Return in case user selects back to main menu
    if (departmentAnswer.dept.toUpperCase() === 'BACK TO MAIN MENU') {
      return 'MAIN_MENU';
    }
    try {
      // Get all employees where department name is one selected above
      const employees = await empORM.getAll({
        where: `d.name ='${departmentAnswer.dept}'`
      });

      // If there are records? then show
      if (employees.length > 0) {
        console.log(); // Blank link for better UX
        console.table(employees);
        console.log(); // Blank link for better UX
      } else {
        // Else convey to the user that there are no records found
        console.log();
        console.log(`${chalk.green('No Records Found!!')}`);
        console.log(); // Blank link for better UX
      }
      return '';
    } catch (err) {
      console.log(`${chalk.yellow(err.sqlMessage)}`);
      return '';
    }
  },

  // Deletes Employee
  async removeEmployee() {
    // Ask user to enter employees firstname and lastname
    const empQuestion = [{
      message: 'Enter Employee Firstname : ',
      name: 'empfirst',
      type: 'input',
      validate: validators.blankNameValidator
    },
    {
      message: 'Enter Employee Lastname : ',
      name: 'emplast',
      type: 'input',
      validate: validators.blankNameValidator,
      when: (answer) => answer.empfirst.toUpperCase() !== '!Q'
    }
    ];
    await printHelperMessage();

    const empAnswer = await inquirer.prompt(empQuestion);

    if (empAnswer.empfirst.toUpperCase() === '!Q' || empAnswer.emplast.toUpperCase() === '!Q') {
      return 'MAIN_MENU';
    }

    // First Query Employee Table to check if record count is more than one
    try {
      // Questy employee table using empORM
      const employees = await empORM.getAllNoJoin({
        where: `first_name LIKE '%${empAnswer.empfirst}%' and last_name like '%${empAnswer.emplast}%'`
      });

      // if more than one employee found matching the firstname and last name entered above
      if (employees.length > 1) {
        // Tell user that more than 1 employees has same first and last name
        console.log();
        console.log(`${chalk.green('More than 1 record found. Select among the following to remove')}`);
        console.log();
        const choices = [];
        // put the found employees into a list and show user.
        // This is to ask user to select which employee he intends to delete
        // Note in order to avoid another server trip I put choice as id: FirstName Last Name
        employees.forEach((e) => {
          choices.push(`${e.id}:${e.first_name} ${e.last_name}`);
        });

        choices.push(new inquirer.Separator());
        choices.push('Back To Main Menu');
        const empDelSelect = await inquirer.prompt([{
          message: 'Select Employee To Remove >>',
          name: 'delemp',
          type: 'rawlist',
          pageSize: 15,
          choices // Note the shorthand usage when key and value have same name
        }]);

        if (empDelSelect.delemp.toUpperCase() === 'BACK TO MAIN MENU') {
          return 'MAIN_MENU';
        }

        // When the user selects the employee the answer is in the 'id:firstname lastname' format
        // So we need to split in order to get the id
        const empIdToDelete = empDelSelect.delemp.split(':')[0];

        try {
          // finally now that we have id. Delete employee using empORM.deleteRows method
          const deleteResult = await empORM.deleteRows(`id=${empIdToDelete}`);
          if (deleteResult.affectedRows > 0) {
            console.log(`\n${chalk.green(`employee whose first_name LIKE '%${empAnswer.empfirst}%' last_name LIKE '%${empAnswer.emplast}%' Removed!`)}\n`);
          } else {
            console.log(`\n${chalk.green('No Records Affected By Your Criterion!')}\n`);
          }
        } catch (err) {
          console.log(`\n${chalk.yellow(err.sqlMessage)}\n`);
        }
      } else {
        // if only single employee was found matching the firstname and last name entered above
        // Then proceed to delete directly
        try {
          // Delete employee using empORM
          const deleteResult = await empORM.deleteRows(`first_name LIKE '%${empAnswer.empfirst}%' and last_name LIKE '%${empAnswer.emplast}%'`);
          if (deleteResult.affectedRows > 0) {
            console.log(`\n${chalk.green(`employee whose first_name LIKE '%${empAnswer.empfirst}%' last_name LIKE '%${empAnswer.emplast}%' Removed!`)}\n`);
          } else {
            console.log(`\n${chalk.green('No Records Affected By Your Criterion!')}\n`);
          }
        } catch (err) {
          console.log(`\n${chalk.yellow(err.sqlMessage)}\n`);
        }
      }
      return '';
    } catch (err) {
      console.log(`\n${chalk.yellow(err.sqlMessage)}\n`);
      return '';
    }
  },

  // Adds a new employee
  async addNewEmployee() {
    // Ask firstname and lastname to the user
    const empQuestions = [
      {
        message: 'Firstname : ',
        name: 'firstname',
        type: 'input',
        validate: validators.blankNameValidator
      },
      {
        message: 'Lastname : ',
        name: 'lastname',
        type: 'input',
        validate: validators.blankNameValidator,
        // Only ask this question when firstname is NOT !Q
        when: (answer) => answer.firstname.toUpperCase() !== '!Q'
      }];

    // Ask the user to select department
    const departmentQuestion = [
      {
        message: 'Select Department >>',
        name: 'dept',
        type: 'rawlist',
        pageSize: 12,
        choices: []
      }];
    // Ask the user to select role
    const roleQuestion = [
      {
        message: 'Select Role >>',
        name: 'role',
        type: 'rawlist',
        pageSize: 12,
        choices: []
      }];
    // Ask the user to select manager
    const managerQuestion = [
      {
        message: 'Select Manager >>',
        name: 'manager',
        type: 'rawlist',
        pageSize: 12,
        choices: []
      }];

    await printHelperMessage();
    const empAnswers = await inquirer.prompt(empQuestions);
    if (empAnswers.firstname.toUpperCase() === '!Q' || empAnswers.lastname.toUpperCase() === '!Q') {
      return 'MAIN_MENU';
    }

    // populate department question choices
    departmentQuestion[0].choices = await departmentORM.getAllAsList();
    departmentQuestion[0].choices.push(new inquirer.Separator());
    departmentQuestion[0].choices.push('Back To Main Menu');

    const departmentAnswer = await inquirer.prompt(departmentQuestion);
    if (departmentAnswer.dept.toUpperCase() === 'BACK TO MAIN MENU') {
      return 'MAIN_MENU';
    }

    const department = await departmentORM.getAll({
      where: `name='${departmentAnswer.dept}'`
    });

    // Populate the role choices.
    // NOTE :- !!!!! ONLY ROLES FOR THE SELECTED DEPARTMENTS ARE SHOWN !!!!!
    roleQuestion[0].choices = await roleORM.getAllAsList({
      where: `department_id=${department[0].id}`
    });
    roleQuestion[0].choices.push(new inquirer.Separator());
    roleQuestion[0].choices.push('Back To Main Menu');

    const roleAnswer = await inquirer.prompt(roleQuestion);
    if (roleAnswer.role.toUpperCase() === 'BACK TO MAIN MENU') {
      return 'MAIN_MENU';
    }
    const role = await roleORM.getAll({
      where: `title='${roleAnswer.role}'`
    });
    // Now we get the list of Employees in the *selected department*
    // !!!! THIS WILL ENFORCE SELECTING MANAGER IN THE SAME DEPARTMENT
    const EmployeesInDepartment = await empORM.getAll({
      where: `d.name ='${departmentAnswer.dept}'`
    });

    let managerAnswer;
    if (EmployeesInDepartment.length < 1) {
      console.log();
      console.log(`${chalk.yellow('No Employees in this department. \'null\' would entered for Manager Id')}`);
      console.log();
    } else {
      EmployeesInDepartment.forEach((emp) => {
        managerQuestion[0].choices.push(`${emp.id}:${emp.first_name} ${emp.last_name}`);
      });
      managerQuestion[0].choices.push(new inquirer.Separator());
      managerQuestion[0].choices.push('Back To Main Menu');
      managerAnswer = await inquirer.prompt(managerQuestion);
      if (managerAnswer.manager.toUpperCase() === 'BACK TO MAIN MENU') {
        return 'MAIN_MENU';
      }
    }

    try {
      // Now that we have all the info
      // Add the employee using empORM
      const managerId = typeof managerAnswer === 'undefined' ? null : managerAnswer.manager.split(':')[0];

      const empAddResult = await empORM.add(empAnswers.firstname,
        empAnswers.lastname, role[0].id, managerId);

      if (empAddResult.affectedRows === 1) {
        console.log();
        console.log(`${chalk.green(`New Employee(id:'${empAddResult.insertId}') Successfully Added!`)}`);
        console.log();
      }
    } catch (err) {
      console.log(`${chalk.yellow(err.sqlMessage)}`);
    }
    return '';
  },

  // View Total Utilized Budget BY Department
  async viewTotalUtilizedBudgetByDepartment() {
    try {
      // Select all employees, sum salary and group them by department
      const result = await empORM.get({
        sql: `SELECT d.id,d.name, COALESCE(sum(r.salary),0) as 'total_utilized_budget' FROM employee e
        INNER JOIN role r
        on e.role_id = r.id
        RIGHT JOIN department d
        on r.department_id=d.id
        group by d.id`,
        orderBy: 'id asc'
      });
      console.log();
      console.table(result);
      console.log();
    } catch (err) {
      console.log();
      console.log(`${chalk.yellow(err.sqlMessage)}`);
    }
  },

  // View Total Utilized Budget OF A  Department
  async viewTotalUtilizedBudgetOfDepartment() {
    // Ask user to select the department
    const departmentQuestion = [
      {
        message: 'Select Department >>',
        name: 'dept',
        type: 'rawlist',
        pageSize: 12,
        choices: []
      }];
    // Populate department question choices using departmentORM
    departmentQuestion[0].choices = await departmentORM.getAllAsList();
    departmentQuestion[0].choices.push(new inquirer.Separator());
    departmentQuestion[0].choices.push('Back To Main Menu');

    const departmentAnswer = await inquirer.prompt(departmentQuestion);
    if (departmentAnswer.dept.toUpperCase() === 'BACK TO MAIN MENU') {
      return 'MAIN_MENU';
    }

    const department = await departmentORM.getAll({
      where: `name='${departmentAnswer.dept}'`
    });
    try {
      // Select all employees, sum salary and
      // group them by department WHERE department id is one that was selected above
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
      } else {
        console.log(`dept id : ${department[0].id}`);
        console.log(`dept name : ${departmentAnswer.dept}`);
        console.log();
        const createdResult = [{
          id: department[0].id,
          name: departmentAnswer.dept,
          total_utilized_budget: 0
        }];
        console.table(createdResult);
      }
    } catch (err) {
      console.log(`${chalk.yellow(err.sqlMessage)}`);
    }
    return '';
  },

  // Update Employee
  async updateEmployee() {
    // Get the Employee Id from user to Update
    const empInitialQuestion = [
      {
        message: 'Enter Employee Id To Update : ',
        name: 'empid',
        type: 'input',
        validate: validators.blankIdValidator
      }
    ];
    await printHelperMessage();

    const empInitialAnswer = await inquirer.prompt(empInitialQuestion);
    if (empInitialAnswer.empid.toUpperCase() === '!Q') {
      return 'MAIN_MENU';
    }

    // Show the employee details to the user and
    // get confirmation if he really wants to update this employee
    const showEmployee = await empORM.getAllNoJoin({
      where: `id=${empInitialAnswer.empid}`
    });
    if (showEmployee.length > 0) {
      console.log(`${chalk.yellow('You are about to update following employee')}`);
      console.log();
      console.table(showEmployee);
      console.log();
    } else {
      console.log(`\n${chalk.yellow('No Records Found!')}`);
      console.log();
      // Return if no records found
      return '';
    }
    const empUpdateConfirm = await inquirer.prompt([
      {
        message: 'Are you sure you want to proceed : ',
        name: 'proceed',
        type: 'confirm'
      }
    ]);
    if (!empUpdateConfirm.proceed) {
      return '';
    }

    // Ask user to enter new firstname, lastname and show the defaults
    const empUpdateQuestions = [
      {
        message: 'Firstname : ',
        name: 'firstname',
        type: 'input',
        default: `${showEmployee[0].first_name}`
      },
      {
        message: 'Lastname : ',
        name: 'lastname',
        type: 'input',
        default: `${showEmployee[0].last_name}`,
        when: (answer) => answer.firstname.toUpperCase() !== '!Q'
      },
      {
        message: 'Select Role >>',
        name: 'role',
        type: 'rawlist',
        choices: [],
        when: (answer) => {
          if (answer.lastname) {
            return answer.lastname.toUpperCase() !== '!Q';
          }
          return false;
        }
      }
    ];
    empUpdateQuestions[2].choices = await roleORM.getAllAsList();
    empUpdateQuestions[2].choices.push(new inquirer.Separator());
    empUpdateQuestions[2].choices.push('Back To Main Menu');
    console.log();
    console.log(`${chalk.yellow('Leave empty and press enter if you want to use existing name.')}`);

    await printHelperMessage();

    const empUpdateAnswer = await inquirer.prompt(empUpdateQuestions);
    console.log(empUpdateAnswer);
    if (empUpdateAnswer.firstname.toUpperCase() === '!Q') {
      return 'MAIN_MENU';
    }
    if (empUpdateAnswer.lastname.toUpperCase() === '!Q') {
      return 'MAIN_MENU';
    }

    if (empUpdateAnswer.role.toUpperCase() === 'BACK TO MAIN MENU') {
      // eslint-disable-next-line consistent-return
      return 'MAIN_MENU';
    }
    const role = await roleORM.getAll({
      where: `title='${empUpdateAnswer.role}'`
    });

    // Ask user to select manager
    const empUpdateManagerQuestion = [
      {
        message: 'Select Manager >>',
        name: 'manager',
        type: 'rawlist',
        choices: []
      }];

    // Get all employees in the department
    // This is to enforce selection of manager from the same department
    const EmployeesInDepartment = await empORM.getAll({
      where: `d.id =${role[0].department_id} and e.id <> ${showEmployee[0].id}`
    });

    // populate the manager selection question with the choices
    // Each choice is formatted as 'id: firstname lastname'
    // This avoids one unnecessary server trip
    let empUpdateManagerAnswer;
    if (EmployeesInDepartment.length < 1) {
      console.log();
      console.log(`${chalk.yellow('No Employees in this department. \'null\' would entered for Manager Id')}`);
      console.log();
    } else {
      EmployeesInDepartment.forEach((emp) => {
        empUpdateManagerQuestion[0].choices.push(`${emp.id}:${emp.first_name} ${emp.last_name}`);
      });
      empUpdateManagerQuestion[0].choices.push(new inquirer.Separator());
      empUpdateManagerQuestion[0].choices.push('Back To Main Menu');
      empUpdateManagerAnswer = await inquirer.prompt(empUpdateManagerQuestion);
      if (empUpdateManagerAnswer.manager.toUpperCase() === 'BACK TO MAIN MENU') {
        // eslint-disable-next-line consistent-return
        return 'MAIN_MENU';
      }
    }
    const managerId = typeof empUpdateManagerAnswer === 'undefined' ? null : empUpdateManagerAnswer.manager.split(':')[0];
    try {
      // Now that we have all the data update employee using empORM
      const empUpdateResult = await empORM.update({
        set: `first_name='${empUpdateAnswer.firstname}',last_name='${empUpdateAnswer.lastname}',
        role_id=${role[0].id},manager_id=${managerId}`,
        where: `id=${showEmployee[0].id}`
      });

      if (empUpdateResult.affectedRows === 1) {
        console.log();
        console.log(`${chalk.green(`Employee(id:'${showEmployee[0].id}') Successfully Updated!`)}`);
        console.log();
      }
    } catch (err) {
      console.log(`${chalk.yellow(err.sqlMessage)}`);
    }
    return '';
  }
};

module.exports = Employee;

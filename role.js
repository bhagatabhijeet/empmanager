// eslint-disable-next-line no-unused-vars
const cTable = require('console.table');
const inquirer = require('inquirer');
const chalk = require('chalk');
const roleORM = require('./orm/roleorm');
const departmentORM = require('./orm/deptorm');
const validators = require('./validators');
const { printHelperMessage } = require('./utils');

const Role = {
  // View All Roles for a Department
  async viewAllRolesForDepartment() {
    // Ask user to select a department
    const departmentQuestion = [{
      message: 'Select Department >>',
      name: 'dept',
      type: 'rawlist',
      pageSize: 12,
      choices: []
    }];
    // populate the department choices to be shown to the user
    departmentQuestion[0].choices = await departmentORM.getAllAsList();
    // additionally add 'BACK TO MAIN MENU' choice
    departmentQuestion[0].choices.push(new inquirer.Separator());
    departmentQuestion[0].choices.push('Back To Main Menu');

    // if the user select 'Back to main menu' don't perform any futher processing
    const selectedDepartment = await inquirer.prompt(departmentQuestion);
    if (selectedDepartment.dept.toUpperCase() === 'BACK TO MAIN MENU') {
      return 'MAIN_MENU';
    }

    try {
      // Get the roles matching the department using roleORM
      const roles = await roleORM.get({
        sql: `SELECT r.id,r.title,r.salary,d.id as 'department_id',d.name as 'department_name'
                    FROM  role r
                        INNER JOIN
                    department d 
                    ON r.department_id = d.id`,
        where: `d.name = '${selectedDepartment.dept}'`
      });
      // Show the fetched results
      console.log();
      console.table(roles);
    } catch (err) {
      console.log(`${chalk.yellow(err.sqlMessage)}`);
    }
    return '';
  },
  // View all roles
  async viewAllRoles() {
    // Fetch all roles using roleORM
    try {
      const result = await roleORM.getAll();
      // Show the fetched results
      console.table(result);
    } catch (err) {
      console.log(`${chalk.yellow(err.sqlMessage)}`);
    }
  },
  // Add a new role
  async addNewRole() {
    const roleQuestions = [{
      // Ask the user for a department
      message: 'Select Department >>',
      name: 'dept',
      type: 'rawlist',
      pageSize: 12,
      choices: []
    },
    {
      // Ask for title
      message: 'role title : ',
      name: 'title',
      type: 'input',
      validate: validators.blankTitleValidator,
      when: (answer) => answer.dept.toUpperCase() !== 'BACK TO MAIN MENU'
    },
    {
      // Ask for Salary
      message: 'role salary : ',
      name: 'salary',
      type: 'input',
      validate: validators.salaryValidator,
      when: (answer) => {
        if (answer.title) {
          return answer.title.toUpperCase() !== '!Q';
        }
        return false;
      }
    }];
    // Populate the department choices using departmentORM
    roleQuestions[0].choices = await departmentORM.getAllAsList();
    // Additionally add 'BACK TO MAIN MENU' as a choice
    roleQuestions[0].choices.push(new inquirer.Separator());
    roleQuestions[0].choices.push('Back To Main Menu');

    await printHelperMessage();

    // Stop further processing if the user selects 'Back to Main Menu'
    const roleAnswers = await inquirer.prompt(roleQuestions);
    if (roleAnswers.dept.toUpperCase() === 'BACK TO MAIN MENU') {
      return 'MAIN_MENU';
    }
    if (roleAnswers.title.toUpperCase() === '!Q' || roleAnswers.salary.toUpperCase() === '!Q') {
      return 'MAIN_MENU';
    }
    // find the department id for this role
    const departments = await departmentORM.getAll();
    const findDepartment = await departments.find((e) => e.name === roleAnswers.dept);
    try {
      // Add new role using roleORM.add method
      await roleORM.add(roleAnswers.title,
        roleAnswers.salary, findDepartment.id);

      // Once added show the added result to the user in a table
      const addedRole = await roleORM.getAll({
        where: `department_id='${findDepartment.id}'`,
        orderBy: 'id desc',
        limit: '1'
      });
      console.log();
      console.log(`${chalk.green('Added New Role :')}`);
      console.log();
      console.table(addedRole);
      console.log();
    } catch (err) {
      console.log(`${chalk.yellow(err.sqlMessage)}`);
    }
    return '';
  },
  // Delete role
  async deleteRole() {
    try {
      // Ask the user which role to delete
      const roleQuestion = [{
        message: 'Select Role To Delete >>',
        name: 'role',
        type: 'rawlist',
        pageSize: 12,
        choices: []

      }];
      // populate role choices using roleORM.getAllAsList method
      roleQuestion[0].choices = await roleORM.getAllAsList();
      roleQuestion[0].choices.push(new inquirer.Separator());
      // Additionally add 'BACK TO MAIN MENU' choice
      roleQuestion[0].choices.push('Back To Main Menu');
      const roleAnswer = await inquirer.prompt(roleQuestion);
      // No further processing if user selects 'Back to Main Menu'
      if (roleAnswer.role.toUpperCase() === 'BACK TO MAIN MENU') {
        return 'MAIN_MENU';
      }

      // Get a final confirmation
      const roleDeleteFinal = await inquirer.prompt([
        {
          message: `You are about to delete a role '${roleAnswer.role}'. Are you sure you want to proceed : `,
          name: 'proceed',
          type: 'confirm'
        }
      ]);
      if (!roleDeleteFinal.proceed) {
        return 'MAIN_MENU';
      }

      try {
        // Delete role using roleORM.deleteRows method
        await roleORM.deleteRows(`title='${roleAnswer.role}'`);
        console.log();
        console.log(`${chalk.green(`Role : '${roleAnswer.role}' is deleted!`)}`);
        console.log();
      } catch (err) {
        console.log(`${chalk.yellow(err.sqlMessage)}`);
      }
    } catch (e) {
      console.log(e);
    }
    return '';
  },
  // Update Role
  async updateRole() {
    try {
      // Ask user to select role to update
      const roleQuestion = [{
        message: 'Select Role To Update >>',
        name: 'role',
        type: 'rawlist',
        pageSize: 12,
        choices: []

      },
      {
        message: 'Select New Department >>',
        name: 'dept',
        type: 'rawlist',
        pageSize: 12,
        choices: [],
        when: (answer) => answer.role.toUpperCase() !== 'BACK TO MAIN MENU'

      },
      {
        message: 'New role title : ',
        name: 'title',
        type: 'input',
        validate: validators.blankTitleValidator,
        when: (answer) => {
          if (answer.dept) {
            return answer.dept.toUpperCase() !== 'BACK TO MAIN MENU';
          }
          return false;
        }
      },
      {
        message: 'New role salary : ',
        name: 'salary',
        type: 'input',
        validate: validators.salaryValidator,
        when: (answer) => {
          if (answer.title) {
            return answer.title.toUpperCase() !== '!Q';
          }
          return false;
        }
      }
      ];
      // Populate role choices using roleORM
      roleQuestion[0].choices = await roleORM.getAllAsList();
      roleQuestion[0].choices.push(new inquirer.Separator());
      roleQuestion[0].choices.push('Back To Main Menu');

      // Populate department choices using departmentORM
      roleQuestion[1].choices = await departmentORM.getAllAsList();
      roleQuestion[1].choices.push(new inquirer.Separator());
      roleQuestion[1].choices.push('Back To Main Menu');

      await printHelperMessage();

      const roleAnswer = await inquirer.prompt(roleQuestion);

      // No further processing if user selects 'Back to Main Menu'
      if (roleAnswer.role.toUpperCase() === 'BACK TO MAIN MENU') {
        return 'MAIN_MENU';
      }
      if (roleAnswer.dept.toUpperCase() === 'BACK TO MAIN MENU') {
        return 'MAIN_MENU';
      }
      if (roleAnswer.title.toUpperCase() === '!Q') {
        return 'MAIN_MENU';
      }
      if (roleAnswer.salary.toUpperCase() === '!Q') {
        return 'MAIN_MENU';
      }
      // Find department for this role
      const departments = await departmentORM.getAll();
      const findDepartment = await departments.find((e) => e.name === roleAnswer.dept);
      try {
        // Update role using roleORM.update method
        await roleORM.update(
          {
            set: `title='${roleAnswer.title}',salary=${roleAnswer.salary},department_id=${findDepartment.id}`,
            where: `title='${roleAnswer.role}'`
          }
        );
        console.log();
        console.log(`${chalk.green(`Role : '${roleAnswer.role}' is Updated to New Role : '${roleAnswer.title}'!`)}`);
        console.log();
      } catch (err) {
        console.log(`${chalk.yellow(err.sqlMessage)}`);
      }
    } catch (e) {
      console.log(e);
    }
    return '';
  }
};

module.exports = Role;

const Chalk = require('chalk');
// eslint-disable-next-line no-unused-vars
const cTable = require('console.table');
const inquirer = require('inquirer');
const departmentORM = require('./orm/deptorm');
const validators = require('./validators')

const Department = {

  // Add new Department
  async addNewDepartment() {
    // Ask user to enter department name
    const departmentQuestion = [{
      message: 'Enter Department Name : ',
      name: 'dept',
      type: 'input',
      validate: validators.blankNameValidator
    }];
    const departmentAnswer = await inquirer.prompt(departmentQuestion);

    try {
      // Add department using departmentORM
      await departmentORM.add(`${departmentAnswer.dept}`);

      console.log(`${Chalk.green('New Department Added!')}`);
      // Get the added department
      const addedDepartment = await departmentORM.getAll({
        where: `name='${departmentAnswer.dept}'`,
        orderBy: 'id desc',
        limit: '1'
      });
      // Show added department to the user
      console.log();
      console.table(addedDepartment);
      console.log();
    }
    catch (err) {
      console.log();
      console.log(`${Chalk.yellow(err.sqlMessage)}`);
    }
  },

  // View All Departments
  async viewAllDepartments() {
    try {
      // Get all departments using departmentORM
      const departments = await departmentORM.getAll();
      // show the department to the user
      console.table(departments);
    } catch (err) {
      console.log(`${Chalk.yellow(err.sqlMessage)}`);
    }
  },

  // Update Department
  async updateDepartment() {
    try {
      // Ask usere to select a department which he wishes to update
      const departmentQuestion = [{
        message: 'Select Department To Update >>',
        name: 'dept',
        type: 'rawlist',
        pageSize: 12,
        choices: []

      }];
      // Populate the department question choices using departmentORM
      departmentQuestion[0].choices = await departmentORM.getAllAsList();
      departmentQuestion[0].choices.push(new inquirer.Separator());
      // Additionally add 'BACK TO MAIN MENU'
      departmentQuestion[0].choices.push('Back To Main Menu');
      const departmentAnswer = await inquirer.prompt(departmentQuestion);
      // Return in case user selects 'back to main menu'
      if (departmentAnswer.dept.toUpperCase() === 'BACK TO MAIN MENU') {
        return 'MAIN_MENU';
      }

      // Ask useer to enter new department name
      const departmentUpdateQuestion = [{
        message: 'Enter Department Name : ',
        name: 'updatedept',
        type: 'input',
        validate: validators.blankNameValidator
      }];
      const departmentUpdateAnswer = await inquirer.prompt(departmentUpdateQuestion);

      try {
        // Update the department using the new deparment name using the departmentORM
        await departmentORM.update(
          {
            set: `name='${departmentUpdateAnswer.updatedept}'`,
            where: `name='${departmentAnswer.dept}'`
          }
        );
        console.log();
        console.log(`${Chalk.green(`Department : '${departmentAnswer.dept}' is Updated to '${departmentUpdateAnswer.updatedept}'!`)}`);
        console.log();
        return '';
      } catch (err) {
        console.log();
        console.log(`${Chalk.yellow(err.sqlMessage)}`);
        return '';
      }
    } catch (e) {
      console.log(e);
      return '';
    }
  },

  // Delete Department
  async deleteDepartment() {
    try {
      // Ask user to select department to update
      const departmentQuestion = [{
        message: 'Select Department To Delete >>',
        name: 'dept',
        type: 'rawlist',
        pageSize: 12,
        choices: []
      }];
      // Populate department question choices using departmentORM
      departmentQuestion[0].choices = await departmentORM.getAllAsList();
      departmentQuestion[0].choices.push(new inquirer.Separator());
      // Additionally add 'BACK TO MAIN MENU'
      departmentQuestion[0].choices.push('Back To Main Menu');
      const departmentAnswer = await inquirer.prompt(departmentQuestion);
      // Return in case users selects back to main menu
      if (departmentAnswer.dept.toUpperCase() === 'BACK TO MAIN MENU') {
        return 'MAIN_MENU';
      }
      try {
        // Delete departmetn using departmentORM
        await departmentORM.deleteRows(`name='${departmentAnswer.dept}'`);
        // Show the confirmation to the user
        console.log();
        console.log(`${Chalk.green(`Department : '${departmentAnswer.dept}' is deleted!`)}`);
        console.log();
        return '';
      } catch (err) {
        console.log();
        console.log(err.sqlMessage);
        return '';
      }
    } catch (e) {
      console.log(e);
      return '';
    }
  }
};

module.exports = Department;

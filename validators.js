const chalk = require('chalk');

async function blankNameValidator(input) {
  if (input.length === 0) {
    console.log(`${chalk.yellow('  Invalid Name')}${chalk.blue(' Name cannot be empty string.')}`);
    return false;
  }
  return true;
}

async function blankIdValidator(input) {
  if (input.length === 0) {
    console.log(`${chalk.yellow('  Invalid Id')}${chalk.blue(' Id cannot be empty.')}`);
    return false;
  }
  return true;
}

async function blankTitleValidator(input) {
  if (input.length === 0) {
    console.log(`${chalk.yellow('  Invalid Title')}${chalk.blue(' Title cannot be empty.')}`);
    return false;
  }
  return true;
}

async function salaryValidator(input) {
  if (input.length === 0) {
    console.log(`${chalk.yellow('  Invalid Salary')}${chalk.blue(' Salary cannot be empty.')}`);
    return false;
  }
  if (input.trim().toUpperCase() === '!Q') {
    return true;
  }
  const pattern = new RegExp(/^\d+(\.\d+)?$/, 'g');
  if (!pattern.test(input)) {
    console.log(`${chalk.yellow('  Invalid Salary')}${chalk.blue(' Salary should be numeric.')}`);
    return false;
  }
  return true;
}

module.exports = {
  blankNameValidator,
  blankIdValidator,
  blankTitleValidator,
  salaryValidator
};

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

module.exports = { blankNameValidator, blankIdValidator };

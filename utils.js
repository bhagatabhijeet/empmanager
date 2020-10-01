const chalk = require('chalk');

async function printHelperMessage() {
  return new Promise((resolve) => {
    console.log(`
        ${chalk.yellow(`Enter ${chalk.cyanBright('!q')} In Any Input Field To Go Back To Main Menu.
        ${chalk.bgRed('CTRL + C')} To Quit`)}`);
    console.log();
    resolve(true);
  });
}

module.exports = {
  printHelperMessage
};

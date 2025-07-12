import chalk from 'chalk';

class Logger {
  static info(message) {
    console.log(chalk.blue('[INFO]'), chalk.white(new Date().toLocaleTimeString()), message);
  }
  
  static success(message) {
    console.log(chalk.green('[SUCCESS]'), chalk.white(new Date().toLocaleTimeString()), message);
  }
  
  static warn(message) {
    console.log(chalk.yellow('[WARN]'), chalk.white(new Date().toLocaleTimeString()), message);
  }
  
  static error(message) {
    console.log(chalk.red('[ERROR]'), chalk.white(new Date().toLocaleTimeString()), message);
  }
  
  static debug(message) {
    console.log(chalk.magenta('[DEBUG]'), chalk.white(new Date().toLocaleTimeString()), message);
  }
}

export default Logger;
